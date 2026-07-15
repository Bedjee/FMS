<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Services\InventoryService;
use Inertia\Inertia;

class ProductInventoryController extends Controller
{
    public function index()
    {
        $products = Product::with('variants')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Inventory/Index', [
            'products' => $products,
        ]);
    }

   public function stockIn(Request $request, InventoryService $inventoryService)
{
    $validated = $request->validate([
        'variant_id' => 'required|exists:product_variants,id',
        'quantity' => 'required|integer|min:1',
        'notes' => 'nullable|string|max:255',
    ]);

    $variant = ProductVariant::findOrFail($validated['variant_id']);

    $inventoryService->addStock(
        $variant,
        $validated['quantity'],
        'manual',
        null,
        $validated['notes'] ?? 'Manual stock addition'
    );

    return back()->with('success', 'Stock added successfully. New stock: ' . $variant->stock_quantity);
}


    public function transactions(ProductVariant $variant)
{
    $transactions = $variant->transactions()->orderBy('created_at', 'desc')->paginate(20);
    return Inertia::render('Admin/Inventory/Transactions', [
        'variant' => $variant,
        'transactions' => $transactions,
    ]);
}
}
