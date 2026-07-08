<?php
// app/Http/Controllers/Manager/RawMaterialController.php

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

        $summary = [
            'Mahogany' => RawMaterial::where('wood_type', 'Mahogany')->sum('board_feet'),
            'Gemelina' => RawMaterial::where('wood_type', 'Gemelina')->sum('board_feet'),
        ];

        $lowStockThreshold = 100; // board feet
        $lowStockAlerts = [];
        foreach ($summary as $wood => $total) {
            if ($total < $lowStockThreshold) {
                $lowStockAlerts[$wood] = $total;
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
                'wood_type' => $validated['wood_type'],
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
        // This is a placeholder – you can store a setting per material or globally.
        // For now, we'll just return a success message.
        return back()->with('success', 'Alert settings updated.');
    }
}
