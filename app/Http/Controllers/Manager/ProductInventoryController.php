<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Inertia\Inertia;

class ProductInventoryController extends Controller
{
    public function index()
    {
        $products = Product::with('variants')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Manager/Inventory/Index', [
            'products' => $products,
        ]);
    }

    public function transactions(ProductVariant $variant)
    {
        $variant->load('product');

        $transactions = $variant->transactions()

            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Manager/Inventory/Transactions', [
            'variant' => $variant,
            'transactions' => $transactions,
        ]);
    }
}
