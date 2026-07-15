<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Product;
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

        return Inertia::render('Manager/Products/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['variants', 'bomItems.material']);
        return Inertia::render('Manager/Products/Show', [
            'product' => $product,
        ]);
    }
}
