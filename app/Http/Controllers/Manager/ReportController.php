<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use App\Models\PurchaseOrder;
use App\Models\ProductVariant;
use App\Models\RawMaterial;
use App\Models\EcommerceOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Show the report form.
     */
    public function index()
    {
        return Inertia::render('Manager/Report/Index');
    }

    /**
     * Generate and download the PDF report.
     */
    public function generate(Request $request)
    {
        $request->validate([
        'from_date' => 'nullable|date',
        'to_date'   => 'nullable|date|after_or_equal:from_date',
    ]);

    $fromDate = $request->query('from_date') ? date('Y-m-d 00:00:00', strtotime($request->query('from_date'))) : null;
    $toDate   = $request->query('to_date')   ? date('Y-m-d 23:59:59', strtotime($request->query('to_date'))) : null;


        // ---------- Base Queries with Date Filter ----------
        $revenueQuery = EcommerceOrder::where('revenue_recorded', true);
        $orderQuery   = EcommerceOrder::query();
        $expenseQuery = PurchaseOrder::where('status', 'confirmed');

        if ($fromDate) {
            $revenueQuery->where('updated_at', '>=', $fromDate);
            $orderQuery->where('created_at', '>=', $fromDate);
            $expenseQuery->where('updated_at', '>=', $fromDate);
        }
        if ($toDate) {
            $revenueQuery->where('updated_at', '<=', $toDate);
            $orderQuery->where('created_at', '<=', $toDate);
            $expenseQuery->where('updated_at', '<=', $toDate);
        }

        // ---------- Revenue & Orders ----------
        $totalRevenue = $revenueQuery->sum('total');
        $totalOrders  = $orderQuery->count();
        $pendingOrders   = (clone $orderQuery)->where('fulfillment_status', 'pending')->count();
        $processingOrders = (clone $orderQuery)->where('fulfillment_status', 'processing')->count();
        $shippedOrders    = (clone $orderQuery)->where('fulfillment_status', 'shipped')->count();
        $deliveredOrders  = (clone $orderQuery)->where('fulfillment_status', 'delivered')->count();

        // ---------- Expenses ----------
        $totalExpenses = $expenseQuery->with('items')
            ->get()
            ->sum(fn($po) => $po->items->sum('line_total'));

        // ---------- Profit & Margin ----------
        $netProfit    = $totalRevenue - $totalExpenses;
        $profitMargin = $totalRevenue > 0 ? ($netProfit / $totalRevenue) * 100 : 0;

        // ---------- Available Capital (latest from user) ----------
        $capital = auth()->user()->available_capital ?? 0;

        // ---------- Inventory Summary ----------
        $totalProducts = ProductVariant::count();
        $totalStock    = ProductVariant::sum('stock_quantity');
        $lowStockCount = ProductVariant::whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->where('stock_quantity', '>', 0)
            ->count();
        $outOfStockCount = ProductVariant::where('stock_quantity', 0)->count();

        // ---------- Top Selling Products (based on order items, with date filter) ----------
        $topProductsQuery = EcommerceOrderItem::select(
                'product_variant_id',
                DB::raw('SUM(quantity) as total_sold')
            )
            ->with(['variant.product'])
            ->groupBy('product_variant_id')
            ->orderByDesc('total_sold')
            ->limit(10);

        if ($fromDate) {
            $topProductsQuery->whereHas('order', function ($q) use ($fromDate, $toDate) {
                $q->where('created_at', '>=', $fromDate);
                if ($toDate) $q->where('created_at', '<=', $toDate);
            });
        }
        $topProducts = $topProductsQuery->get()->map(function ($item) {
            return [
                'name'       => $item->variant?->product?->name ?? 'Unknown',
                'variant'    => $item->variant ? ($item->variant->wood_type . ($item->variant->finish ? ' ('.$item->variant->finish.')' : '')) : 'N/A',
                'total_sold' => $item->total_sold,
            ];
        });

        // ---------- Recent Financial Transactions (within filter) ----------
        $recentIncome = EcommerceOrder::where('revenue_recorded', true)
            ->with('user')
            ->when($fromDate, fn($q) => $q->where('updated_at', '>=', $fromDate))
            ->when($toDate, fn($q) => $q->where('updated_at', '<=', $toDate))
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn($order) => [
                'type'        => 'Income',
                'description' => 'Order #' . $order->order_number . ' - ' . ($order->user?->name ?? 'Guest'),
                'amount'      => (float) $order->total,
                'date'        => $order->updated_at->format('Y-m-d H:i'),
            ]);

        $recentExpenses = PurchaseOrder::where('status', 'confirmed')
            ->with('creator')
            ->when($fromDate, fn($q) => $q->where('updated_at', '>=', $fromDate))
            ->when($toDate, fn($q) => $q->where('updated_at', '<=', $toDate))
            ->latest('updated_at')
            ->limit(5)
            ->get()
            ->map(fn($po) => [
                'type'        => 'Expense',
                'description' => 'PO #' . ($po->po_number ?? $po->id) . ' - ' . ($po->creator?->name ?? 'System'),
                'amount'      => $po->items->sum('line_total'),
                'date'        => $po->updated_at->format('Y-m-d H:i'),
            ]);

        $transactions = $recentIncome->merge($recentExpenses)->sortByDesc('date')->values();

        // ---------- Business Info ----------
        $businessName = config('app.name', 'FurnitureMES');
        $logoPath     = public_path('images/logo.png'); // adjust as needed
        $logoData     = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : null;

        // ---------- Prepare View Data ----------
        $data = [
            'business_name'   => $businessName,
            'logo'            => $logoData,
            'generated_at'    => now()->format('F d, Y H:i:s'),
            'date_range'      => ($fromDate ? date('M d, Y', strtotime($fromDate)) : 'Start') . ' - ' . ($toDate ? date('M d, Y', strtotime($toDate)) : 'End'),
            'total_revenue'   => $totalRevenue,
            'total_expenses'  => $totalExpenses,
            'net_profit'      => $netProfit,
            'profit_margin'   => $profitMargin,
            'capital'         => $capital,
            'total_orders'    => $totalOrders,
            'pending'         => $pendingOrders,
            'processing'      => $processingOrders,
            'shipped'         => $shippedOrders,
            'delivered'       => $deliveredOrders,
            'total_products'  => $totalProducts,
            'total_stock'     => $totalStock,
            'low_stock'       => $lowStockCount,
            'out_of_stock'    => $outOfStockCount,
            'top_products'    => $topProducts,
            'transactions'    => $transactions,
        ];

        // ---------- Generate PDF ----------
        $pdf = Pdf::loadView('reports.manager_dashboard', $data);
        $pdf->setPaper('A4', 'portrait');

         return $pdf->download('Financial_Report_' . now()->format('Y-m-d') . '.pdf');
    }
}
