<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\MaterialRequest;
use App\Models\Supplier;
use App\Models\Material;
use Illuminate\Support\Facades\Log;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\MaterialRequestItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MaterialRequestController extends Controller
{
    public function index()
{
    $requests = MaterialRequest::with(['admin', 'items', 'supplier'])
        ->where('status', '!=', 'ordered') // <-- exclude ordered requests
        ->orderBy('created_at', 'desc')
        ->paginate(15);

    return Inertia::render('Manager/MaterialRequests/Index', [
        'requests' => $requests,
    ]);
}

  public function show(MaterialRequest $materialRequest)
{
    $materialRequest->load(['admin', 'items.material', 'supplier']); // load items.material
    return Inertia::render('Manager/MaterialRequests/Show', [
        'request' => $materialRequest,
    ]);
}


    public function approve(Request $request, MaterialRequest $materialRequest)
{
    $validated = $request->validate(['notes' => 'nullable|string']);
    $materialRequest->approve(auth()->id());
    if ($validated['notes']) {
        $materialRequest->notes .= "\n[Approved by Manager: " . auth()->user()->name . "] " . $validated['notes'];
        $materialRequest->save();
    }
    return redirect()->route('manager.material-requests.preview', $materialRequest)
        ->with('success', 'Request approved. Please review and confirm purchase order.');
}
    public function reject(Request $request, MaterialRequest $materialRequest)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|min:5',
        ]);

        $materialRequest->reject(auth()->id(), $validated['rejection_reason']);

        return redirect()->route('manager.material-requests.index')
            ->with('success', 'Material request rejected.');
    }


    // At the top: use App\Models\Material;
public function preview(MaterialRequest $materialRequest)
{
    if ($materialRequest->status !== 'approved') {
        return redirect()->route('manager.material-requests.index')->with('error', 'Request not approved.');
    }
    if ($materialRequest->purchase_order_id) {
        return redirect()->route('manager.material-requests.index')->with('error', 'Purchase order already exists.');
    }

    $materialRequest->load(['items', 'admin', 'supplier']);
    $suppliers = Supplier::with('materials')->get();
    return Inertia::render('Manager/MaterialRequests/Preview', [
        'request' => $materialRequest,
        'suppliers' => $suppliers,
    ]);
}


public function getSupplierMaterials(Request $request)
{
    $request->validate(['supplier_id' => 'required|exists:suppliers,id']);
    $materials = Material::where('supplier_id', $request->supplier_id)
        ->where('is_available', true)
        ->get(['id', 'name', 'unit', 'price', 'stock_quantity']);
    return response()->json($materials);
}

 /**
     * Confirm purchase order from approved material request.
     */
  public function confirmPurchaseOrder(Request $request, MaterialRequest $materialRequest)
{
    $validated = $request->validate([
        'supplier_id' => 'required|exists:suppliers,id',
        'expected_delivery' => 'nullable|date|after:today',
        'notes' => 'nullable|string',
        'items' => 'required|array|min:1',
        'items.*.material_id' => 'required|exists:materials,id',
        'items.*.quantity' => 'required|numeric|min:0.01',
        'items.*.unit_price' => 'required|numeric|min:0',
        'items.*.unit' => 'required|string|max:20',
        'items.*.description' => 'nullable|string',
    ]);

    Log::info('========== PO CONFIRMATION START ==========');
    Log::info('Validated Request Data:', $validated);

    if ($materialRequest->status !== 'approved') {
        return back()->with('error', 'Request not approved.');
    }
    if ($materialRequest->purchase_order_id) {
        return back()->with('error', 'PO already exists.');
    }

    $purchaseOrder = null;

    DB::transaction(function () use ($validated, $materialRequest, &$purchaseOrder) {
        $purchaseOrder = PurchaseOrder::create([
            'po_number' => 'PO-' . strtoupper(uniqid()),
            'supplier_id' => $validated['supplier_id'],
            'created_by' => auth()->id(),
            'status' => 'sent',
            'order_date' => now(),
            'expected_delivery' => $validated['expected_delivery'],
            'notes' => $validated['notes'],
            'material_request_id' => $materialRequest->id,
        ]);

        Log::info('Purchase Order Created: ID=' . $purchaseOrder->id . ', PO#=' . $purchaseOrder->po_number);

        foreach ($validated['items'] as $index => $itemData) {
            $material = Material::findOrFail($itemData['material_id']);
            $quantity = (float) $itemData['quantity'];
            $unitPrice = (float) $itemData['unit_price'];

            // Fallback to material price if unitPrice is zero
            if ($unitPrice == 0 && $material->price > 0) {
                $unitPrice = (float) $material->price;
                Log::info("Item $index: unit_price was 0, using material price: $unitPrice");
            }

            $lineTotal = $quantity * $unitPrice;

            Log::info("Item $index: material_id={$material->id}, name={$material->name}, qty=$quantity, unit_price=$unitPrice, line_total=$lineTotal");

            $createdItem = $purchaseOrder->items()->create([
                'material_id' => $material->id,
                'wood_type' => $this->determineWoodType($material),
                'thickness' => 0,
                'width' => 0,
                'length' => 0,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_board_feet' => $quantity,
                'line_total' => $lineTotal,
            ]);

            Log::info("Saved item ID: {$createdItem->id}, line_total: {$createdItem->line_total}");
        }

        $materialRequest->update([
            'status' => 'ordered',
            'purchase_order_id' => $purchaseOrder->id,
        ]);
    });

    // Reload the purchase order with items to verify saved data
    if ($purchaseOrder) {
        $loadedPO = PurchaseOrder::with('items')->find($purchaseOrder->id);
        Log::info('Final PO data after save:', $loadedPO->toArray());
    }

    Log::info('========== PO CONFIRMATION END ==========');

    return redirect()->route('manager.purchase-orders.index')
        ->with('success', 'Purchase order created and sent to supplier.');
}




// Helper to determine wood type
private function determineWoodType($material)
{
    $name = strtolower($material->name);
    if (strpos($name, 'mahogany') !== false) return 'Mahogany';
    if (strpos($name, 'gemelina') !== false) return 'Gemelina';
    return null;
}

}
