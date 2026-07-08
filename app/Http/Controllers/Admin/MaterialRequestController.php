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

    // Mark request as delivered and create stock-in entries
  public function markAsDelivered(Request $request, MaterialRequest $materialRequest)
{
    // Only allow if status is 'ordered'
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

    // Validate input
    $validated = $request->validate([
        'dimensions_unknown' => 'required|boolean',
        'thickness' => 'required_if:dimensions_unknown,false|numeric|min:0.25',
        'width' => 'required_if:dimensions_unknown,false|numeric|min:0.25',
        'length' => 'required_if:dimensions_unknown,false|numeric|min:0.5',
        'quantity' => 'required|numeric|min:0.01',
    ]);

    DB::transaction(function () use ($validated, $materialRequest, $purchaseOrder) {
        // Update request status
        $materialRequest->update(['status' => 'delivered']);

        // Update purchase order status
        $purchaseOrder->update(['status' => 'delivered']);

        $items = $materialRequest->items;

        foreach ($items as $item) {
            if ($validated['dimensions_unknown']) {
                // If dimensions unknown, distribute total BF equally among items
                $itemBF = $validated['quantity'] / $items->count();
                $thickness = 0;
                $width = 0;
                $length = 0;
                $remarks = 'Dimensions unknown - total BF: ' . $validated['quantity'];
            } else {
                // Calculate BF per piece based on dimensions
                $bfPerPiece = ($validated['thickness'] * $validated['width'] * $validated['length']) / 12;
                $itemBF = $bfPerPiece * $validated['quantity'];
                $thickness = $validated['thickness'];
                $width = $validated['width'];
                $length = $validated['length'];
                $remarks = 'Stock-in from Material Request: ' . $materialRequest->request_number;
            }

            $woodType = $item->wood_type ?? 'Mahogany';

            RawMaterial::create([
                'wood_type' => $woodType,
                'board_feet' => $itemBF,
                'thickness' => $thickness,
                'width' => $width,
                'length' => $length,
                'supplier_id' => $materialRequest->supplier_id,
                'purchase_order_id' => $purchaseOrder->id,
                'material_request_id' => $materialRequest->id,
                'delivery_date' => now(),
                'remarks' => $remarks,
            ]);
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
