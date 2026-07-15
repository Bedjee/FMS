<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MaterialInventory;
use App\Models\MaterialInventoryTransaction;
use Inertia\Inertia;

class MaterialInventoryController extends Controller
{
   public function index()
{
    // Fetch transactions with relationships
    $transactions = MaterialInventoryTransaction::with(['material', 'inventory'])
        ->orderBy('created_at', 'desc')
        ->paginate(20);

    // Compute current stock for summary (optional)
    $currentStock = MaterialInventory::with('material')->get();

    return Inertia::render('Admin/MaterialInventory/Index', [
        'transactions' => $transactions,
        'currentStock' => $currentStock,
    ]);
}   
    public function show(MaterialInventory $inventory)
    {
        $inventory->load('material');

        $transactions = MaterialInventoryTransaction::with('creator')
            ->where('material_inventory_id', $inventory->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/MaterialInventory/Show', [
            'inventory' => $inventory,
            'transactions' => $transactions,
        ]);
    }

    // Optional: Manual adjustment (for admin corrections)
    public function adjust(Request $request, MaterialInventory $inventory)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        // This is a manual adjustment – we'll replace the current stock
        $oldQuantity = $inventory->quantity;
        $newQuantity = $validated['quantity'];
        $difference = $newQuantity - $oldQuantity;

        if ($difference != 0) {
            $inventory->quantity = $newQuantity;
            $inventory->save();

            $inventory->transactions()->create([
                'material_id' => $inventory->material_id,
                'type' => 'adjustment',
                'quantity' => $difference,
                'balance_after' => $newQuantity,
                'reference_type' => 'manual',
                'notes' => $validated['notes'] ?? 'Manual adjustment',
                'created_by' => auth()->id(),
            ]);
        }

        return back()->with('success', 'Inventory adjusted.');
    }
}
