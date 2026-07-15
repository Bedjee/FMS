<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use App\Models\ProductVariant;
use App\Models\RawMaterial;
use App\Models\PurchaseOrder;
use App\Models\WorkOrder;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ---------- Revenue Stats ----------
        $totalRevenue = EcommerceOrder::where('revenue_recorded', true)->sum('total');
        $todayRevenue = EcommerceOrder::where('revenue_recorded', true)
            ->whereDate('updated_at', today())
            ->sum('total');
        $monthRevenue = EcommerceOrder::where('revenue_recorded', true)
            ->whereMonth('updated_at', now()->month)
            ->whereYear('updated_at', now()->year)
            ->sum('total');

        // ---------- Order Counts ----------
        $totalOrders = EcommerceOrder::count();
        $pendingOrders = EcommerceOrder::where('fulfillment_status', 'pending')->count();
        $processingOrders = EcommerceOrder::where('fulfillment_status', 'processing')->count();
        $shippedOrders = EcommerceOrder::where('fulfillment_status', 'shipped')->count();
        $deliveredOrders = EcommerceOrder::where('fulfillment_status', 'delivered')->count();

        // ---------- Inventory Stats ----------
        $lowStockProducts = ProductVariant::with('product')
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->where('stock_quantity', '>', 0)
            ->get();

        $outOfStockProducts = ProductVariant::with('product')
            ->where('stock_quantity', 0)
            ->get();

        // ---------- Recent Orders ----------
        $recentOrders = EcommerceOrder::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id'            => $order->id,
                    'order_number'  => $order->order_number,
                    'customer'      => $order->user?->name ?? 'Guest',
                    'total'         => (float) $order->total,
                    'status'        => $order->fulfillment_status,
                    'created_at'    => $order->created_at,
                ];
            });

        // ---------- Raw Materials & Purchase Orders ----------
        $totalRawMaterials = RawMaterial::sum('board_feet');
        $activePurchaseOrders = PurchaseOrder::whereIn('status', ['draft', 'sent', 'confirmed'])->count();
        $pendingWorkOrders = WorkOrder::whereNotIn('status', ['completed', 'cancelled'])->count();

        // ---------- Financial Analytics (FIXED) ----------
        // Total Expenses: sum line totals from confirmed purchase orders
        $totalExpenses = PurchaseOrder::where('status', 'confirmed')
            ->with('items')  // make sure you have the items relationship
            ->get()
            ->sum(function ($po) {
                return $po->items->sum('line_total'); // adjust column name as needed
            });

        $netProfit = $totalRevenue - $totalExpenses;
        $profitMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        // ---------- Monthly Revenue ----------
        $monthlyRevenue = EcommerceOrder::where('revenue_recorded', true)
            ->select(DB::raw('SUM(total) as total, YEAR(updated_at) as year, MONTH(updated_at) as month'))
            ->where('updated_at', '>=', now()->subMonths(12))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                $dateKey = $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT);
                return [$dateKey => (float) $item->total];
            });

        // ---------- Monthly Expenses (FIXED) ----------
        $monthlyExpenses = PurchaseOrder::where('status', 'confirmed')
            ->where('updated_at', '>=', now()->subMonths(12))
            ->with('items')
            ->get()
            ->groupBy(function ($po) {
                return $po->updated_at->format('Y-m');
            })
            ->map(function ($orders) {
                return $orders->sum(function ($po) {
                    return $po->items->sum('line_total');
                });
            });

        // Merge into a single array for the chart
        $allMonths = collect($monthlyRevenue->keys()->merge($monthlyExpenses->keys()))->unique()->sort();
        $monthlyData = $allMonths->map(function ($month) use ($monthlyRevenue, $monthlyExpenses) {
            return [
                'month'   => $month,
                'revenue' => $monthlyRevenue[$month] ?? 0,
                'expense' => $monthlyExpenses[$month] ?? 0,
            ];
        })->values();

        // ---------- Recent Financial Transactions ----------
        $recentIncome = EcommerceOrder::where('revenue_recorded', true)
            ->with('user')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'type'        => 'income',
                    'description' => 'Order #' . $order->order_number . ' - ' . ($order->user?->name ?? 'Guest'),
                    'amount'      => (float) $order->total,
                    'date'        => $order->updated_at,
                ];
            });

        $recentExpenses = PurchaseOrder::where('status', 'confirmed')
            ->with('creator')
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(function ($po) {
                return [
                    'type'        => 'expense',
                    'description' => 'Purchase Order #' . ($po->po_number ?? $po->id) . ' - ' . ($po->creator?->name ?? 'System'),
                    'amount'      => $po->items->sum('line_total'), // compute on the fly
                    'date'        => $po->updated_at,
                ];
            });

        $recentTransactions = $recentIncome->merge($recentExpenses)
            ->sortByDesc('date')
            ->take(10)
            ->values();

        // ---------- Authenticated Manager ----------
        $user = auth()->user();

        // ---------- Return Inertia Response ----------
        return Inertia::render('Dashboard/Manager', [
            'stats' => [
                // Financial
                'availableCapital'      => (float) ($user->available_capital ?? 0),
                'totalRevenue'          => (float) $totalRevenue,
                'todayRevenue'          => (float) $todayRevenue,
                'monthRevenue'          => (float) $monthRevenue,
                'totalExpenses'         => (float) $totalExpenses,
                'netProfit'             => (float) $netProfit,
                'profitMargin'          => (float) $profitMargin,
                'monthlyData'           => $monthlyData,
                'recentTransactions'    => $recentTransactions,

                // Orders
                'totalOrders'           => (int) $totalOrders,
                'pendingOrders'         => (int) $pendingOrders,
                'processingOrders'      => (int) $processingOrders,
                'shippedOrders'         => (int) $shippedOrders,
                'deliveredOrders'       => (int) $deliveredOrders,

                // Inventory
                'lowStockCount'         => $lowStockProducts->count(),
                'outOfStockCount'       => $outOfStockProducts->count(),
                'lowStockProducts'      => $lowStockProducts->map(function ($variant) {
                    return [
                        'name'    => $variant->product?->name ?? 'Unknown Product',
                        'variant' => $variant->wood_type . ($variant->finish ? ' (' . $variant->finish . ')' : ''),
                        'stock'   => $variant->stock_quantity,
                    ];
                }),
                'outOfStockProducts'    => $outOfStockProducts->map(function ($variant) {
                    return [
                        'name'    => $variant->product?->name ?? 'Unknown Product',
                        'variant' => $variant->wood_type . ($variant->finish ? ' (' . $variant->finish . ')' : ''),
                    ];
                }),

                // Recent Orders
                'recentOrders'          => $recentOrders,

                // Raw Materials & Others
                'totalRawMaterials'     => round($totalRawMaterials, 2) . ' BF',
                'activePurchaseOrders'  => (int) $activePurchaseOrders,
                'pendingWorkOrders'     => (int) $pendingWorkOrders,
            ],
        ]);
    }
}
