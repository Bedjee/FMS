<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\BomItem;
use App\Models\Material;
use App\Models\RawMaterial;
use App\Models\MaterialInventory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('variants')
            ->withCount(['variants', 'bomItems'])
            ->withSum('variants', 'stock_quantity')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

  public function create()
{
    $finishes = ['Natural', 'Walnut', 'Mahogany', 'Matte', 'Glossy', 'Satin', 'Rustic', 'Antique'];
    $woodTypes = ['Mahogany', 'Gemelina'];

    $materials = Material::with('supplier')
        ->where('is_available', true)
        ->orderBy('name')
        ->get(['id', 'name', 'unit']);

    // Get stock from material_inventories
    $stockData = MaterialInventory::with('material')
        ->get()
        ->mapWithKeys(function ($item) {
            $key = strtolower(trim($item->material->name));
            return [$key => (float) $item->quantity];
        })
        ->toArray();

    return Inertia::render('Admin/Products/Create', [
        'finishes' => $finishes,
        'woodTypes' => $woodTypes,
        'materials' => $materials,
        'stockData' => $stockData,
    ]);
}

public function edit(Product $product)
{
    $product->load(['variants', 'bomItems.material']);

    $materials = Material::with('supplier')
        ->where('is_available', true)
        ->orderBy('name')
        ->get(['id', 'name', 'unit']);

    // Get stock from material_inventories
    $stockData = MaterialInventory::with('material')
        ->get()
        ->mapWithKeys(function ($item) {
            $key = strtolower(trim($item->material->name));
            return [$key => (float) $item->quantity];
        })
        ->toArray();

    $finishes = ['Natural', 'Walnut', 'Mahogany', 'Matte', 'Glossy', 'Satin', 'Rustic', 'Antique'];
    $woodTypes = ['Mahogany', 'Gemelina'];

    return Inertia::render('Admin/Products/Edit', [
        'product' => $product,
        'finishes' => $finishes,
        'woodTypes' => $woodTypes,
        'materials' => $materials,
        'stockData' => $stockData,
    ]);
}

  public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'dimensions' => 'nullable|string|max:255',
        'sku' => 'required|string|unique:products,sku',
        'base_price' => 'required|numeric|min:0',
        'is_active' => 'boolean',
        'image' => 'nullable|file|image|max:2048',
        'variant_wood_type' => 'required|in:Mahogany,Gemelina',
        'variant_finish' => 'nullable|string|max:50',
        'variant_dimensions' => 'nullable|string|max:255',
        'variant_price' => 'required|numeric|min:0',
        'variant_stock' => 'nullable|integer|min:0',
        'bom_items' => 'nullable|array',
        'bom_items.*.material_id' => 'required|exists:materials,id',
        'bom_items.*.quantity' => 'required|numeric|min:0.01',
        'bom_items.*.unit' => 'nullable|string|max:20',
        'bom_items.*.notes' => 'nullable|string',
    ]);

    $product = null;

    DB::transaction(function () use ($validated, $request, &$product) {
        // 1. Create product
        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'dimensions' => $validated['dimensions'] ?? null,
            'sku' => $validated['sku'],
            'base_price' => $validated['base_price'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // 2. Handle image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image' => $path]);
        }

        // 3. Create initial variant
        $product->variants()->create([
            'wood_type' => $validated['variant_wood_type'],
            'finish' => $validated['variant_finish'] ?? null,
            'dimensions' => $validated['variant_dimensions'] ?? null,
            'price' => $validated['variant_price'],
            'stock_quantity' => $validated['variant_stock'] ?? 0,
            'low_stock_threshold' => 5,
        ]);

        // 4. Create BOM items and deduct inventory
        if (!empty($validated['bom_items'])) {
            foreach ($validated['bom_items'] as $bomItem) {
                // Create BOM item
                $product->bomItems()->create([
                    'material_id' => $bomItem['material_id'],
                    'quantity' => $bomItem['quantity'],
                    'unit' => $bomItem['unit'] ?? null,
                    'notes' => $bomItem['notes'] ?? null,
                ]);

                // Deduct from inventory and log transaction
                try {
                    \App\Models\MaterialInventory::deduct(
                        $bomItem['material_id'],
                        $bomItem['quantity'],
                        'product_creation',              // reference_type
                        $product->id,                    // reference_id (the product)
                        'Deducted for product: ' . $product->name
                    );
                } catch (\Exception $e) {
                    throw new \Exception('Insufficient stock for material: ' . $e->getMessage());
                }
            }
        }
    });

    return redirect()->route('admin.products.edit', $product)
        ->with('success', 'Product created successfully and raw materials deducted from inventory.');
}



    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'dimensions' => 'nullable|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'base_price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            'image' => 'nullable|file|image|max:2048',
            'remove_image' => 'nullable|boolean',
        ]);

        $product->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'dimensions' => $validated['dimensions'] ?? null,
            'sku' => $validated['sku'],
            'base_price' => $validated['base_price'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($request->boolean('remove_image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
                $product->update(['image' => null]);
            }
        }

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $path = $request->file('image')->store('products', 'public');
            $product->update(['image' => $path]);
        }

        return back()->with('success', 'Product updated.');
    }


    public function show(Product $product)
    {
        $product->load(['variants', 'bomItems.material']);
        return Inertia::render('Admin/Products/Show', [
            'product' => $product,
        ]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted.');
    }

    // ---- Variant Management ----

    public function storeVariant(Request $request, Product $product)
    {
        $validated = $request->validate([
            'wood_type' => 'required|in:Mahogany,Gemelina',
            'finish' => 'nullable|string|max:50',
            'dimensions' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $product->variants()->create($validated);
        return back()->with('success', 'Variant added.');
    }

    public function updateVariant(Request $request, Product $product, ProductVariant $variant)
    {
        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'wood_type' => 'required|in:Mahogany,Gemelina',
            'finish' => 'nullable|string|max:50',
            'dimensions' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'nullable|integer|min:0',
        ]);

        $variant->update($validated);
        return back()->with('success', 'Variant updated.');
    }

    public function destroyVariant(Product $product, ProductVariant $variant)
    {
        if ($variant->product_id !== $product->id) {
            abort(403);
        }
        $variant->delete();
        return back()->with('success', 'Variant removed.');
    }

    // ---- BOM Management ----

    public function storeBomItem(Request $request, Product $product)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['unit'])) {
            $material = Material::find($validated['material_id']);
            $validated['unit'] = $material->unit ?? 'units';
        }

        try {
            MaterialInventory::deduct($validated['material_id'], $validated['quantity']);
        } catch (\Exception $e) {
            return back()->with('error', 'Insufficient stock: ' . $e->getMessage());
        }

        $product->bomItems()->create($validated);
        return back()->with('success', 'BOM item added and inventory deducted.');
    }

    public function updateBomItem(Request $request, Product $product, BomItem $bomItem)
    {
        if ($bomItem->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);

        if (empty($validated['unit'])) {
            $material = Material::find($validated['material_id']);
            $validated['unit'] = $material->unit ?? 'units';
        }

        try {
            MaterialInventory::add($bomItem->material_id, $bomItem->quantity);
            MaterialInventory::deduct($validated['material_id'], $validated['quantity']);
        } catch (\Exception $e) {
            return back()->with('error', 'Inventory adjustment failed: ' . $e->getMessage());
        }

        $bomItem->update($validated);
        return back()->with('success', 'BOM item updated.');
    }

    public function destroyBomItem(Product $product, BomItem $bomItem)
    {
        if ($bomItem->product_id !== $product->id) {
            abort(403);
        }

        MaterialInventory::add($bomItem->material_id, $bomItem->quantity);
        $bomItem->delete();
        return back()->with('success', 'BOM item removed and inventory restored.');
    }
}
