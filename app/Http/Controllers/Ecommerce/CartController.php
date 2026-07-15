<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'variant_id' => 'required|exists:product_variants,id', // <-- required
            'quantity' => 'nullable|integer|min:1',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $variant = ProductVariant::with('product')->findOrFail($request->variant_id);
        $quantity = $request->quantity ?? 1;

        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        $cartItem = $cart->items()->where('product_variant_id', $variant->id)->first();
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cart->items()->create([
                'product_variant_id' => $variant->id,
                'quantity' => $quantity,
                'price' => $variant->price,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Item added to cart.',
            'cart' => $cart->load('items.variant.product'),
        ]);
    }

    public function index()
{
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }

    $cart = Cart::with('items.variant.product')->where('user_id', $user->id)->first();

    // Calculate totals
    $items = $cart ? $cart->items : collect();
    $subtotal = $items->sum(function ($item) {
        return $item->quantity * $item->price;
    });
    $totalItems = $items->sum('quantity');

    return Inertia::render('Customer/Cart', [
        'cartItems' => $items->map(function ($item) {
            return [
                'id' => $item->id,
                'variant_id' => $item->variant_id,
                'product_name' => $item->variant->product->name,
                'wood_type' => $item->variant->wood_type,
                'finish' => $item->variant->finish,
                'dimensions' => $item->variant->dimensions,
                'price' => $item->price,
                'quantity' => $item->quantity,
                'subtotal' => $item->quantity * $item->price,
                'image' => $item->variant->product->image ? '/storage/' . $item->variant->product->image : null,
            ];
        }),
        'summary' => [
            'totalItems' => $totalItems,
            'subtotal' => $subtotal,
            'estimatedTotal' => $subtotal, // later add shipping, tax, etc.
        ],
    ]);
}


    public function remove(Request $request)
    {
        $request->validate(['variant_id' => 'required|exists:product_variants,id']);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $cart = Cart::where('user_id', $user->id)->first();
        if ($cart) {
            $cart->items()->where('product_variant_id', $request->variant_id)->delete();
        }

        return response()->json(['success' => true]);
    }

    public function clear()
    {
        $user = Auth::user();
        if ($user) {
            Cart::where('user_id', $user->id)->delete();
        }
        return response()->json(['success' => true]);
    }


    public function update(Request $request)
{
    $request->validate([
        'variant_id' => 'required|exists:product_variants,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $cart = Cart::where('user_id', $user->id)->first();
    if (!$cart) {
        return response()->json(['error' => 'Cart not found'], 404);
    }

    $cartItem = $cart->items()->where('product_variant_id', $request->variant_id)->first();
    if (!$cartItem) {
        return response()->json(['error' => 'Item not found in cart'], 404);
    }

    $cartItem->quantity = $request->quantity;
    $cartItem->save();

    return response()->json([
        'success' => true,
        'message' => 'Quantity updated.',
        'cart' => $cart->load('items.variant.product'),
    ]);
}




    public function count()
{
    $user = Auth::user();
    if (!$user) {
        return response()->json(['count' => 0]);
    }
    $cart = Cart::where('user_id', $user->id)->first();
    $count = $cart ? $cart->items->sum('quantity') : 0;
    return response()->json(['count' => $count]);
}


public function cartView()
{
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }

    $cart = Cart::with('items.variant.product')
        ->where('user_id', $user->id)
        ->first();

    return Inertia::render('Customer/Cart', [
        'cart' => $cart ?? ['items' => []],
    ]);
}


public function updateQuantity(Request $request)
{
    $request->validate([
        'variant_id' => 'required|exists:product_variants,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $cart = Cart::where('user_id', $user->id)->first();
    if (!$cart) {
        return response()->json(['error' => 'Cart not found'], 404);
    }

    $cartItem = $cart->items()->where('product_variant_id', $request->variant_id)->first();
    if (!$cartItem) {
        return response()->json(['error' => 'Item not found'], 404);
    }

    $cartItem->quantity = $request->quantity;
    $cartItem->save();

    return response()->json([
        'success' => true,
        'message' => 'Quantity updated.',
        'cart' => $cart->load('items.variant.product'),
    ]);
}
}
