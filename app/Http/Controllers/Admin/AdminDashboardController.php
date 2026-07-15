<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalRevenue = EcommerceOrder::where('revenue_recorded', true)->sum('total');
        $todayRevenue = EcommerceOrder::where('revenue_recorded', true)
            ->whereDate('updated_at', today())
            ->sum('total');
        $monthRevenue = EcommerceOrder::where('revenue_recorded', true)
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->sum('total');
        $completedOrders = EcommerceOrder::where('revenue_recorded', true)->count();
        $activeOrders = EcommerceOrder::whereIn('fulfillment_status', ['pending', 'processing', 'shipped'])->count();
        $totalUsers = User::count();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalRevenue' => (float) $totalRevenue,
                'todayRevenue' => (float) $todayRevenue,
                'monthRevenue' => (float) $monthRevenue,
                'completedOrders' => (int) $completedOrders,
                'activeOrders' => (int) $activeOrders,
                'totalUsers' => (int) $totalUsers,
            ],
        ]);
    }
}
