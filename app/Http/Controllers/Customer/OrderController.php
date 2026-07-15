<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return redirect()->route('login');
        }

        $orders = EcommerceOrder::with(['items.variant.product'])
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Customer/Orders', [
            'orders' => $orders,
        ]);
    }

    public function show(EcommerceOrder $order)
{
    $user = Auth::user();
    if (!$user || $order->user_id !== $user->id) {
        abort(403);
    }

    $order->load(['items.variant.product', 'deliveries']);

    // Debug
    \Log::info('Order data:', $order->toArray());

    return Inertia::render('Customer/OrderDetail', [
        'order' => $order,
    ]);
}



}
