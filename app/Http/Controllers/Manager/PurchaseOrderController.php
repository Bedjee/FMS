<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $purchaseOrders = PurchaseOrder::with(['supplier', 'creator', 'items'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Manager/PurchaseOrders/Index', [
            'purchaseOrders' => $purchaseOrders,
            'suppliers' => Supplier::all(),
        ]);
    }

    public function show(PurchaseOrder $purchaseOrder)
{
    $purchaseOrder->load([
        'supplier',
        'creator',
        'items.material',
        'materialRequest.admin',
        'materialRequest.manager'
    ]);
    return Inertia::render('Manager/PurchaseOrders/Show', [
        'purchaseOrder' => $purchaseOrder,
    ]);
}



    public function create()
    {
        return Inertia::render('Manager/PurchaseOrders/Create', [
            'suppliers' => Supplier::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'expected_delivery' => 'nullable|date|after:order_date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.wood_type' => 'required|in:Mahogany,Gemelina',
            'items.*.thickness' => 'required|integer|min:1',
            'items.*.width' => 'required|integer|min:1',
            'items.*.length' => 'required|integer|min:1',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $purchaseOrder = PurchaseOrder::create([
                'supplier_id' => $validated['supplier_id'],
                'created_by' => auth()->id(),
                'status' => 'draft',
                'order_date' => $validated['order_date'],
                'expected_delivery' => $validated['expected_delivery'],
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $item) {
                $boardFeet = ($item['thickness'] * $item['width'] * $item['length']) / 12 * $item['quantity'];
                $purchaseOrder->items()->create([
                    'wood_type' => $item['wood_type'],
                    'thickness' => $item['thickness'],
                    'width' => $item['width'],
                    'length' => $item['length'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_board_feet' => $boardFeet,
                    'line_total' => $boardFeet * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('manager.purchase-orders.index')
            ->with('success', 'Purchase order created.');
    }

    public function confirmDelivery(PurchaseOrder $purchaseOrder)
    {
        if ($purchaseOrder->status !== 'confirmed') {
            return back()->with('error', 'Order must be confirmed by supplier first.');
        }

        $purchaseOrder->update(['status' => 'delivered']);

        foreach ($purchaseOrder->items as $item) {
            \App\Models\RawMaterial::create([
                'wood_type' => $item->wood_type,
                'board_feet' => $item->total_board_feet,
                'thickness' => $item->thickness,
                'width' => $item->width,
                'length' => $item->length,
                'supplier_id' => $purchaseOrder->supplier_id,
                'purchase_order_id' => $purchaseOrder->id,
                'delivery_date' => now(),
            ]);
        }

        return back()->with('success', 'Delivery confirmed and inventory updated.');
    }
}
