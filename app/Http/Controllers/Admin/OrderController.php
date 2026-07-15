<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\EcommerceOrder;
use Illuminate\Support\Facades\Log;
use App\Models\ProductVariant;
use App\Services\InventoryService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = EcommerceOrder::with(['items.variant.product', 'user'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }


public function show(EcommerceOrder $order)
{
    $order->load(['items.variant.product', 'user', 'deliveryZone', 'deliveryPersonnel']);
    return Inertia::render('Admin/Orders/Show', [
        'order' => $order,
    ]);
}




public function accept(EcommerceOrder $order)
{
    Log::info('🔍 Accept order attempt (status only)', ['order_id' => $order->id, 'status' => $order->fulfillment_status]);

    if ($order->fulfillment_status !== 'pending') {
        return back()->with('error', 'Order cannot be accepted (status: ' . $order->fulfillment_status . ')');
    }

    // Temporarily disable inventory deduction for debugging
    // We only update the status
    try {
        $updated = $order->update(['fulfillment_status' => 'processing']);
        Log::info('✅ Order status update result', ['order_id' => $order->id, 'updated' => $updated]);
    } catch (\Exception $e) {
        Log::error('❌ Status update failed: ' . $e->getMessage());
        return back()->with('error', 'Failed to update order status: ' . $e->getMessage());
    }

    $order->refresh();
    Log::info('📦 Final order status', ['order_id' => $order->id, 'status' => $order->fulfillment_status]);

    return back()->with('success', 'Order #' . $order->order_number . ' accepted.');
}


    public function reject(Request $request, EcommerceOrder $order)
{
    if ($order->fulfillment_status !== 'pending') {
        return back()->with('error', 'This order cannot be rejected.');
    }

    $order->update([
        'fulfillment_status' => 'cancelled',
        'payment_status' => 'cancelled',
    ]);

    return back()->with('success', 'Order #' . $order->order_number . ' rejected.');
}


public function assignPersonnel(Request $request, EcommerceOrder $order)
{
    Log::info('🔍 Assign personnel attempt', [
        'order_id' => $order->id,
        'personnel_id' => $request->personnel_id,
        'current_status' => $order->fulfillment_status,
    ]);

    $validated = $request->validate([
        'personnel_id' => 'required|exists:users,id',
    ]);

    if ($order->fulfillment_status !== 'processing') {
        Log::warning('⚠️ Order not in processing status', ['order_id' => $order->id]);
        return back()->with('error', 'Order must be in processing status to assign delivery personnel.');
    }

    $personnel = User::find($validated['personnel_id']);
    if (!$personnel || !$personnel->hasRole('Delivery Driver')) {
        Log::error('❌ User is not a Delivery Driver', ['user_id' => $validated['personnel_id']]);
        return back()->with('error', 'Selected user is not a Delivery Driver.');
    }

    $order->update(['delivery_personnel_id' => $validated['personnel_id']]);
    Log::info('✅ Personnel assigned', ['order_id' => $order->id, 'personnel_id' => $validated['personnel_id']]);

    return back()->with('success', 'Delivery personnel assigned successfully.');
}



public function updateStatus(Request $request, EcommerceOrder $order)
{
    $validated = $request->validate([
        'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        'notes' => 'nullable|string|max:500',
    ]);

    if (in_array($order->fulfillment_status, ['cancelled', 'delivered'])) {
        return back()->with('error', 'Cannot change status of a ' . $order->fulfillment_status . ' order.');
    }

   $newStatus = $validated['status'];
    $oldStatus = $order->fulfillment_status;

    if ($newStatus === 'shipped' && !$order->delivery_personnel_id) {
        return back()->with('error', 'Cannot mark as shipped without assigning delivery personnel first.');
    }

    // If status changes to delivered, handle inventory
    if ($newStatus === 'delivered' && $oldStatus !== 'delivered') {
        try {
            DB::transaction(function () use ($order, $inventoryService) {
                $order->revenue_recorded = true;
                if ($order->payment_method === 'cod') {
                    $order->payment_status = 'completed';
                }
                $order->fulfillment_status = 'delivered';
                $order->save();

                $inventoryService->deductOrderStock($order, 'order', 'Order #' . $order->order_number . ' marked delivered by Admin');
            });
        } catch (\Exception $e) {
            Log::error('❌ Stock deduction failed: ' . $e->getMessage());
            return back()->with('error', 'Inventory update failed: ' . $e->getMessage());
        }
    } else {
        $order->fulfillment_status = $newStatus;
        if ($newStatus === 'cancelled') {
            $order->payment_status = 'cancelled';
        }
        $order->save();
    }

    return back()->with('success', 'Order status updated to ' . ucfirst($newStatus) . '.');
}



}
