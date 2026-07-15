<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Services\InventoryService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $orders = EcommerceOrder::with(['user', 'items.variant.product'])
            ->where('delivery_personnel_id', $user->id)
            ->whereIn('fulfillment_status', ['processing', 'shipped'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Driver/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(EcommerceOrder $order)
    {
        $user = Auth::user();
        if ($order->delivery_personnel_id !== $user->id) {
            abort(403, 'You are not assigned to this order.');
        }

        $order->load(['user', 'items.variant.product', 'deliveryZone']);
        return Inertia::render('Driver/OrderDetail', [
            'order' => $order,
        ]);
    }
public function markDelivered(Request $request, EcommerceOrder $order, InventoryService $inventoryService)
{
    $driverId = Auth::id();

    if ($order->delivery_personnel_id !== $driverId) {
        abort(403, 'You are not assigned to this order.');
    }

    if ($order->fulfillment_status !== 'shipped') {
        return back()->with('error', 'Order must be shipped before it can be marked as delivered.');
    }

    $validated = $request->validate([
        'pod_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    $path = $request->file('pod_image')->store('proof_of_delivery', 'public');

    try {
        DB::transaction(function () use ($order, $path, $inventoryService) {
            // Update order status
            $order->update([
                'fulfillment_status' => 'delivered',
                'revenue_recorded' => true,
                'payment_status' => $order->payment_method === 'cod' ? 'completed' : $order->payment_status,
                'proof_of_delivery' => $path,
            ]);

            // Deduct stock
            $inventoryService->deductOrderStock(
                $order,
                'order',
                'Order #' . $order->order_number . ' delivered by driver ' . Auth::user()->name
            );
        });
    } catch (\Exception $e) {
        Log::error('❌ Stock deduction failed: ' . $e->getMessage());
        return back()->with('error', 'Inventory update failed: ' . $e->getMessage());
    }

    return back()->with('success', 'Order marked as delivered. Stock deducted and revenue recorded.');
}



}
