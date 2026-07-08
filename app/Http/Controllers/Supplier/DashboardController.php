<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $supplier = auth()->user()->supplier;

        if (!$supplier) {
            return Inertia::render('Dashboard/Supplier', [
                'stats' => [
                    'pendingOrders' => 0,
                    'completedDeliveries' => 0,
                    'totalOrdersThisMonth' => 0,
                ]
            ]);
        }

        $stats = [
            // Pending orders: status = 'sent' (sent to supplier, awaiting confirmation)
            'pendingOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'sent')
                ->count(),

            // Completed deliveries: status = 'delivered'
            'completedDeliveries' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->where('status', 'delivered')
                ->count(),

            // Total orders this month
            'totalOrdersThisMonth' => PurchaseOrder::where('supplier_id', $supplier->id)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return Inertia::render('Dashboard/Supplier', [
            'stats' => $stats,
        ]);
    }
}
