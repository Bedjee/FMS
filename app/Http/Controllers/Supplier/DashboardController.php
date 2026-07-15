<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\PurchaseOrder;
use App\Models\SupplierInventoryTransaction;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
{
    $supplier = auth()->user()->supplier;
    if (!$supplier) {
        return redirect()->route('supplier.dashboard')->with('error', 'Supplier not found.');
    }

    $stats = [
        'totalMaterials' => $supplier->materials()->count(),
        'totalStock' => $supplier->materials()->sum('stock_quantity'),
        'lowStock' => $supplier->materials()->where('stock_quantity', '<=', 10)->count(),
        'outOfStock' => $supplier->materials()->where('stock_quantity', '<=', 0)->count(),
        'pendingOrders' => PurchaseOrder::where('supplier_id', $supplier->id)->where('status', 'sent')->count(),
        'completedDeliveries' => PurchaseOrder::where('supplier_id', $supplier->id)->where('status', 'confirmed')->count(),
        'totalOrdersThisMonth' => PurchaseOrder::where('supplier_id', $supplier->id)
            ->whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
        'totalRevenue' => $supplier->total_revenue,
        'recentOrders' => PurchaseOrder::where('supplier_id', $supplier->id)
            ->with('creator')->orderBy('created_at', 'desc')->limit(5)->get(),
        'recentTransactions' => SupplierInventoryTransaction::whereIn('material_id', $supplier->materials->pluck('id'))
            ->with('material')->orderBy('created_at', 'desc')->limit(10)->get(),
    ];

    return Inertia::render('Dashboard/Supplier', ['stats' => $stats]);
}



}
