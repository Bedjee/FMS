<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        $supplier = auth()->user()->supplier;
        $purchaseOrders = PurchaseOrder::with(['items', 'creator'])
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
            abort(403, 'Unauthorized access to this purchase order.');
        }

        $purchaseOrder->load(['items.material', 'creator']);
        return Inertia::render('Supplier/PurchaseOrders/Show', [
            'purchaseOrder' => $purchaseOrder,
        ]);
    }

    public function updateStatus(Request $request, PurchaseOrder $purchaseOrder)
    {
        $supplier = auth()->user()->supplier;
        if ($purchaseOrder->supplier_id !== $supplier->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,rejected',
        ]);

        // Only allow if current status is 'sent'
        if ($purchaseOrder->status !== 'sent') {
            return back()->with('error', 'This order cannot be modified.');
        }

        $purchaseOrder->status = $validated['status'];
        $purchaseOrder->save();

        $message = $validated['status'] === 'confirmed'
            ? 'Purchase order confirmed successfully.'
            : 'Purchase order rejected.';

        return redirect()->route('supplier.purchase-orders.index')
            ->with('success', $message);
    }
}
