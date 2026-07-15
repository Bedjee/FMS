<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Services\FinancialService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
{
    $supplier = auth()->user()->supplier;
    $purchaseOrders = PurchaseOrder::with(['items.material', 'creator'])
        ->where('supplier_id', $supplier->id)
        ->orderBy('created_at', 'desc')
        ->paginate(15);

    return Inertia::render('Supplier/PurchaseOrders/Index', [
        'purchaseOrders' => $purchaseOrders,
    ]);
}

public function show(PurchaseOrder $purchaseOrder)
{
    $supplier = auth()->user()->supplier;
    if ($purchaseOrder->supplier_id !== $supplier->id) {
        abort(403);
    }

    $purchaseOrder->load(['items.material', 'creator']);
    return Inertia::render('Supplier/PurchaseOrders/Show', [
        'purchaseOrder' => $purchaseOrder,
    ]);
}

public function updateStatus(Request $request, PurchaseOrder $purchaseOrder, FinancialService $financialService)
{
    $supplier = auth()->user()->supplier;
    if ($purchaseOrder->supplier_id !== $supplier->id) {
        abort(403);
    }

    $validated = $request->validate([
        'status' => 'required|in:confirmed,rejected',
    ]);

    if ($purchaseOrder->status !== 'sent') {
        return back()->with('error', 'This order cannot be modified.');
    }

    $purchaseOrder->load('items.material');

    if ($validated['status'] === 'confirmed') {
        if (!$purchaseOrder->canBeFulfilled()) {
            return back()->with('error', 'Cannot confirm: insufficient stock.');
        }

        try {
            $financialService->processPurchaseOrderPayment($purchaseOrder);
        } catch (\Exception $e) {
            return back()->with('error', 'Payment failed: ' . $e->getMessage());
        }

        foreach ($purchaseOrder->items as $item) {
            $material = $item->material;
            if ($material) {
                $material->decrement('stock_quantity', $item->quantity);
                $material->logTransaction('stock_out', $item->quantity, 'purchase_order', $purchaseOrder->id, 'PO #' . $purchaseOrder->po_number);
            }
        }

        $purchaseOrder->status = 'confirmed';
        $purchaseOrder->save();

        return redirect()->route('supplier.purchase-orders.index')
            ->with('success', 'Order confirmed. Payment received and stock deducted.');
    }

    $purchaseOrder->status = 'rejected';
    $purchaseOrder->save();

    return redirect()->route('supplier.purchase-orders.index')
        ->with('success', 'Order rejected.');
}


}
