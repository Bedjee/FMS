<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $products = Product::with(['variants'])
            ->where('is_active', true)
            ->orderBy('name')
            ->paginate(12);

        // Debug: log the products count
        \Log::info('Shop products count: ' . $products->total());

        return Inertia::render('Ecommerce/Shop', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['variants', 'bomItems.material']);
        return Inertia::render('Ecommerce/ProductDetail', [
            'product' => $product,
        ]);
    }
}
