<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use App\Models\Supplier;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    public function index()
    {
        $materials = RawMaterial::with('supplier')
            ->orderBy('delivery_date', 'desc')
            ->paginate(15);

        // Group by material_name (renamed from wood_type)
        $summary = RawMaterial::select('material_name', DB::raw('SUM(board_feet) as total'))
            ->groupBy('material_name')
            ->pluck('total', 'material_name')
            ->toArray();

        $lowStockThreshold = 100;
        $lowStockAlerts = [];
        foreach ($summary as $material => $total) {
            if ($total < $lowStockThreshold) {
                $lowStockAlerts[$material] = $total;
            }
        }

        return Inertia::render('Manager/RawMaterials/Index', [
            'materials' => $materials,
            'summary' => $summary,
            'lowStockAlerts' => $lowStockAlerts,
            'suppliers' => Supplier::all(),
            'purchaseOrders' => PurchaseOrder::where('status', 'delivered')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Manager/RawMaterials/Create', [
            'suppliers' => Supplier::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'wood_type' => 'required|in:Mahogany,Gemelina',
            'thickness' => 'required|integer|min:1',
            'width' => 'required|integer|min:1',
            'length' => 'required|integer|min:1',
            'quantity' => 'required|integer|min:1',
            'supplier_id' => 'required|exists:suppliers,id',
            'delivery_date' => 'required|date',
            'receipt' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
            'purchase_order_id' => 'nullable|exists:purchase_orders,id',
        ]);

        DB::transaction(function () use ($validated, $request) {
            $bfPerPiece = ($validated['thickness'] * $validated['width'] * $validated['length']) / 12;
            $totalBF = $bfPerPiece * $validated['quantity'];

            $receiptPath = null;
            if ($request->hasFile('receipt')) {
                $receiptPath = $request->file('receipt')->store('receipts', 'public');
            }

            RawMaterial::create([
                'material_name' => $validated['wood_type'], // map to new column
                'board_feet' => $totalBF,
                'thickness' => $validated['thickness'],
                'width' => $validated['width'],
                'length' => $validated['length'],
                'supplier_id' => $validated['supplier_id'],
                'delivery_date' => $validated['delivery_date'],
                'receipt_path' => $receiptPath,
                'purchase_order_id' => $validated['purchase_order_id'] ?? null,
            ]);
        });

        return redirect()->route('manager.raw-materials.index')
            ->with('success', 'Raw material added successfully.');
    }

    public function toggleLowStockAlert(Request $request, RawMaterial $rawMaterial)
    {
        return back()->with('success', 'Alert settings updated.');
    }
}
