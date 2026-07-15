<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialRequest;
use App\Models\Supplier;
use App\Models\Material;
use App\Models\RawMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaterialRequestController extends Controller
{
   public function index()
{
    $requests = MaterialRequest::with(['admin', 'manager', 'items', 'supplier', 'purchaseOrder'])
        ->orderBy('created_at', 'desc')
        ->paginate(15);

    return Inertia::render('Admin/MaterialRequests/Index', [
        'requests' => $requests,
    ]);
}

    public function create()
    {
        $suppliers = Supplier::orderBy('name')->get(['id', 'name', 'category']);
        return Inertia::render('Admin/MaterialRequests/Create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'request_date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|exists:materials,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $materialRequest = MaterialRequest::create([
                'admin_id' => auth()->id(),
                'supplier_id' => $validated['supplier_id'],
                'status' => 'pending',
                'request_date' => $validated['request_date'],
                'notes' => $validated['notes'],
            ]);

            foreach ($validated['items'] as $item) {
                $material = Material::findOrFail($item['material_id']);
                $materialRequest->items()->create([
                    'material_id' => $material->id,
                    'item_type' => $this->determineItemType($material),
                    'wood_type' => $this->determineWoodType($material),
                    'description' => $material->name,
                    'quantity' => $item['quantity'],
                    'unit' => $material->unit,
                    'unit_price' => $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('admin.material-requests.index')
            ->with('success', 'Material request submitted successfully.');
    }

   public function show(MaterialRequest $materialRequest)
{
    $materialRequest->load(['admin', 'manager', 'items', 'supplier', 'purchaseOrder']);
    return Inertia::render('Admin/MaterialRequests/Show', [
        'request' => $materialRequest,
    ]);
}

    public function markAsDelivered(Request $request, MaterialRequest $materialRequest)
{
    if ($materialRequest->status !== 'ordered') {
        return back()->with('error', 'Only ordered requests can be marked as delivered.');
    }

    $purchaseOrder = $materialRequest->purchaseOrder;
    if (!$purchaseOrder) {
        return back()->with('error', 'No purchase order found for this request.');
    }
    if ($purchaseOrder->status !== 'confirmed') {
        return back()->with('error', 'Purchase order must be confirmed by supplier first.');
    }

    $validated = $request->validate([
        'dimensions_unknown' => 'required|boolean',
        'thickness' => 'nullable|numeric|min:0',
        'width' => 'nullable|numeric|min:0',
        'length' => 'nullable|numeric|min:0',
        'quantity' => 'required|numeric|min:0.01',
    ]);

    DB::transaction(function () use ($validated, $materialRequest, $purchaseOrder) {
        $materialRequest->update(['status' => 'delivered']);
        $purchaseOrder->update(['status' => 'delivered']);

        $items = $materialRequest->items;
        $thickness = $validated['thickness'] ?? 0;
        $width = $validated['width'] ?? 0;
        $length = $validated['length'] ?? 0;
        $quantity = $validated['quantity'];

        foreach ($items as $item) {
            // Determine unit and material name
            if ($item->item_type === 'varnish') {
                $materialName = 'Varnish';
                $unit = 'Liters';
            } elseif ($item->item_type === 'other') {
                $materialName = $item->description ?? 'Other';
                $unit = $item->unit ?? 'units';
            } else {
                $materialName = $item->wood_type ?? 'Mahogany';
                $unit = $item->unit ?? 'BF';
            }

            // Calculate quantity
            if ($item->item_type === 'wood' && $thickness > 0 && $width > 0 && $length > 0) {
                $bfPerPiece = ($thickness * $width * $length) / 12;
                $itemBF = $bfPerPiece * $quantity;
                $remarks = 'Stock-in from Material Request: ' . $materialRequest->request_number;
            } else {
                $itemBF = $quantity / $items->count();
                $thickness = 0;
                $width = 0;
                $length = 0;
                $remarks = $item->item_type === 'varnish'
                    ? 'Varnish stock-in from Material Request: ' . $materialRequest->request_number
                    : 'Stock-in from Material Request: ' . $materialRequest->request_number;
            }

            // Save raw material
            $rawMaterial = RawMaterial::create([
                'material_name' => $materialName,
                'board_feet' => $itemBF,
                'unit' => $unit,
                'thickness' => $thickness,
                'width' => $width,
                'length' => $length,
                'supplier_id' => $materialRequest->supplier_id,
                'purchase_order_id' => $purchaseOrder->id,
                'material_request_id' => $materialRequest->id,
                'delivery_date' => now(),
                'remarks' => $remarks,
            ]);

            if ($item->material_id) {
    \App\Models\MaterialInventory::add(
    $item->material_id,
    $itemBF,
    'purchase_order',
    $purchaseOrder->id,
    'Stock-in from Material Request: ' . $materialRequest->request_number
);
}


        }
    });

    return redirect()->route('admin.material-requests.show', $materialRequest)
        ->with('success', 'Materials marked as delivered. Stock-in entries created successfully.');
}



    // API: Get materials for a supplier
    public function getSupplierMaterials(Request $request)
    {
        $request->validate(['supplier_id' => 'required|exists:suppliers,id']);
        $materials = Material::where('supplier_id', $request->supplier_id)
            ->where('is_available', true)
            ->get(['id', 'name', 'unit', 'price']);
        return response()->json($materials);
    }

    // Helpers
    private function determineItemType($material)
    {
        $categories = ['Wood' => 'wood', 'Varnish' => 'varnish', 'Other' => 'other'];
        $supplier = $material->supplier;
        return $categories[$supplier->category] ?? 'other';
    }

    private function determineWoodType($material)
    {
        if ($material->supplier->category === 'Wood') {
            $name = strtolower($material->name);
            if (strpos($name, 'mahogany') !== false) return 'Mahogany';
            if (strpos($name, 'gemelina') !== false) return 'Gemelina';
            return null;
        }
        return null;
    }
}
