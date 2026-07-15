<?php

namespace App\Http\Controllers\Supplier;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
   public function index()
{
    $user = auth()->user();
    $supplier = $user->supplier;

    if (!$supplier) {
        return redirect()->route('supplier.dashboard')
            ->with('error', 'No supplier record found for your account.');
    }

    $materials = Material::where('supplier_id', $supplier->id)->paginate(15);
    return Inertia::render('Supplier/Materials/Index', ['materials' => $materials]);
}



    public function create()
    {
        return Inertia::render('Supplier/Materials/Create');
    }

    public function store(Request $request)
    {
        $supplier = auth()->user()->supplier;
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|numeric|min:0',
            'is_available' => 'boolean',
        ]);

        $validated['supplier_id'] = $supplier->id;
        $validated['is_available'] = $request->has('is_available');
        Material::create($validated);
        return redirect()->route('supplier.materials.index')->with('success', 'Material added.');
    }

    public function edit(Material $material)
    {
        if ($material->supplier_id !== auth()->user()->supplier->id) abort(403);
        return Inertia::render('Supplier/Materials/Edit', ['material' => $material]);
    }

    public function update(Request $request, Material $material)
    {
        if ($material->supplier_id !== auth()->user()->supplier->id) abort(403);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:20',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'nullable|numeric|min:0',
            'is_available' => 'boolean',
        ]);
        $validated['is_available'] = $request->has('is_available');
        $material->update($validated);
        return redirect()->route('supplier.materials.index')->with('success', 'Material updated.');
    }

    public function destroy(Material $material)
    {
        if ($material->supplier_id !== auth()->user()->supplier->id) abort(403);
        $material->delete();
        return back()->with('success', 'Material deleted.');
    }


    public function transactions(Material $material)
{
    if ($material->supplier_id !== auth()->user()->supplier->id) {
        abort(403);
    }

    $transactions = $material->inventoryTransactions()
        ->orderBy('created_at', 'desc')
        ->paginate(20);

    return Inertia::render('Supplier/Materials/Transactions', [
        'material' => $material,
        'transactions' => $transactions,
    ]);
}
}
