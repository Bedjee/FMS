<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'totalOrders' => EcommerceOrder::where('user_id', $user->id)->count(),
            'pendingOrders' => EcommerceOrder::where('user_id', $user->id)
                ->whereIn('fulfillment_status', ['pending', 'processing'])
                ->count(),
            'completedOrders' => EcommerceOrder::where('user_id', $user->id)
                ->where('fulfillment_status', 'delivered')
                ->count(),
        ];

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
