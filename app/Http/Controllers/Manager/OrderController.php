<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = EcommerceOrder::with(['user', 'items.variant.product', 'deliveryPersonnel'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Manager/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(EcommerceOrder $order)
    {
        $order->load(['user', 'items.variant.product', 'deliveryPersonnel', 'deliveryZone']);
        return Inertia::render('Manager/Orders/Show', [
            'order' => $order,
        ]);
    }
}
