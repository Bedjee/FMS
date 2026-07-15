<?php

namespace App\Http\Controllers\Ecommerce;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\EcommerceOrder;
use App\Models\EcommerceOrderItem;
use App\Models\DeliveryZone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CheckoutController extends Controller
{
   public function index(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }

    // Get selected items from session
    $selected = session()->get('checkout_items', []);
    if (empty($selected)) {
        return redirect()->route('customer.cart')->with('error', 'No items selected for checkout.');
    }

    $cart = Cart::with('items.variant.product')->where('user_id', $user->id)->first();
    if (!$cart) {
        return redirect()->route('customer.cart')->with('error', 'Cart not found.');
    }

    $selectedItems = $cart->items->filter(fn($item) => in_array($item->id, $selected));

    if ($selectedItems->isEmpty()) {
        return redirect()->route('customer.cart')->with('error', 'Selected items not found.');
    }

    $subtotal = $selectedItems->sum(fn($item) => $item->quantity * $item->price);
    $totalItems = $selectedItems->sum('quantity');

    // Delivery fee calculation
    $city = $request->input('city');
    if ($city) {
        $zone = DeliveryZone::where('name', 'LIKE', '%' . $city . '%')
            ->where('is_active', true)
            ->first();
        // set $deliveryFee, $deliveryAvailable, etc.
    }


    $deliveryFee = 0;
    $deliveryZone = null;
    $deliveryAvailable = true;
    $deliveryMessage = '';

    if ($city) {
        $zone = DeliveryZone::where('name', 'LIKE', '%' . $city . '%')
            ->where('is_active', true)
            ->first();
        if ($zone) {
            $deliveryFee = (float) $zone->fee;      // 🔧 cast to float
            $deliveryZone = $zone;
        } else {
            $deliveryAvailable = false;
            $deliveryMessage = 'Delivery is not available in your area. We currently serve Cagayan de Oro, Opol, and El Salvador City.';
        }
    }

     $deliveryZones = DeliveryZone::where('is_active', true)->orderBy('name')->get();

    return Inertia::render('Customer/Checkout', [
        'items' => $selectedItems,
        'subtotal' => $subtotal,
        'totalItems' => $totalItems,
        'user' => $user,
        'deliveryZones' => $deliveryZones,
        'deliveryFee' => $deliveryFee,
        'deliveryZone' => $deliveryZone,
        'deliveryAvailable' => $deliveryAvailable,
        'deliveryMessage' => $deliveryMessage,
    ]);
}



    public function storeSelected(Request $request)
    {
        $request->validate(['item_ids' => 'required|array']);
        session()->put('checkout_items', $request->item_ids);
        return redirect()->route('customer.checkout');
    }

    public function store(Request $request)
{
    $user = Auth::user();
    if (!$user) {
        return redirect()->route('login');
    }

    $validated = $request->validate([
        'recipient_name' => 'required|string|max:255',
        'contact_number' => 'required|string|max:20',
        'province' => 'required|string|max:100',
        'city' => 'required|string|max:100',
        'barangay' => 'required|string|max:100',
        'street_address' => 'required|string|max:255',
        'postal_code' => 'nullable|string|max:10',
        'payment_method' => 'required|in:cod,gcash',
        'delivery_zone_id' => 'nullable|exists:delivery_zones,id', // <-- add this
        'items' => 'required|array|min:1',
        'items.*.id' => 'required|exists:cart_items,id',
        'items.*.quantity' => 'required|integer|min:1',
    ]);

    // Get selected items from session
    $selectedIds = session()->get('checkout_items', []);
    if (empty($selectedIds)) {
        return back()->with('error', 'No items selected.');
    }

    $cart = Cart::with('items.variant.product')->where('user_id', $user->id)->first();
    if (!$cart) {
        return back()->with('error', 'Cart not found.');
    }

    // Filter selected items
    $selectedItems = $cart->items->filter(function ($item) use ($selectedIds) {
        return in_array($item->id, $selectedIds);
    });

    if ($selectedItems->isEmpty()) {
        return back()->with('error', 'Selected items not found.');
    }

    // Calculate subtotal
    $subtotal = $selectedItems->sum(function ($item) {
        return $item->quantity * $item->price;
    });

    // Calculate shipping fee
    $shippingFee = 0;
    $deliveryZoneId = null;
    if (!empty($validated['delivery_zone_id'])) {
        $zone = DeliveryZone::find($validated['delivery_zone_id']);
        if ($zone) {
            $shippingFee = (float) $zone->fee;
            $deliveryZoneId = $zone->id;
        }
    } else {
        // Fallback: try to find zone by city (if delivery_zone_id not provided)
        $zone = DeliveryZone::where('name', 'LIKE', '%' . $validated['city'] . '%')
            ->where('is_active', true)
            ->first();
        if ($zone) {
            $shippingFee = (float) $zone->fee;
            $deliveryZoneId = $zone->id;
        }
    }

    $total = $subtotal + $shippingFee;

    // Create order
    $order = EcommerceOrder::create([
        'user_id' => $user->id,
        'subtotal' => $subtotal,
        'shipping_fee' => $shippingFee,
        'total' => $total,
        'downpayment_paid' => 0,
        'cod_balance' => $total,
        'payment_status' => 'awaiting_downpayment',
        'fulfillment_status' => 'pending',
        'shipping_address' => $validated['street_address'],
        'payment_method' => $validated['payment_method'],
        'recipient_name' => $validated['recipient_name'],
        'contact_number' => $validated['contact_number'],
        'province' => $validated['province'],
        'city' => $validated['city'],
        'barangay' => $validated['barangay'],
        'street_address' => $validated['street_address'],
        'postal_code' => $validated['postal_code'],
        'delivery_zone_id' => $deliveryZoneId, // store the zone ID
    ]);

    // Create order items
   foreach ($selectedItems as $item) {
    if (!$item->product_variant_id) {
        return back()->with('error', 'One of the items is missing a variant. Please contact support.');
    }
    EcommerceOrderItem::create([
        'ecommerce_order_id' => $order->id,
        'product_variant_id' => $item->product_variant_id,
        'quantity' => $item->quantity,
        'price' => $item->price,
    ]);
}
    // Remove selected items from cart
    $cart->items()->whereIn('id', $selectedIds)->delete();

    // Clear session checkout items
    session()->forget('checkout_items');

    return redirect()->route('customer.orders')->with('success', 'Order placed successfully! Order #' . $order->order_number);
}
}
