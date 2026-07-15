import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link, router } from '@inertiajs/react'; // add router import
import { useState } from 'react';
import { Trash2Icon, PlusIcon, MinusIcon, ShoppingBagIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Cart({ cart }) {
    const [items, setItems] = useState(cart?.items || []);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState(() => {
        // Default: all items selected
        const initial = {};
        (cart?.items || []).forEach(item => {
            const id = item.variant?.id || item.product_variant_id;
            if (id) initial[id] = true;
        });
        return initial;
    });

    // Helper to get variant ID from item
    const getVariantId = (item) => {
        return item.variant?.id || item.product_variant_id || null;
    };

    // Calculate totals – only for selected items
    const selectedItemsList = items.filter(item => {
        const id = getVariantId(item);
        return id && selectedItems[id];
    });

    const subtotal = selectedItemsList.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 0;
        return sum + (price * qty);
    }, 0);

    const totalItems = selectedItemsList.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);

    // Toggle selection
    const toggleSelect = (variantId) => {
        setSelectedItems(prev => ({
            ...prev,
            [variantId]: !prev[variantId],
        }));
    };

    // Select / Deselect All
    const toggleSelectAll = () => {
        const allSelected = items.every(item => {
            const id = getVariantId(item);
            return id && selectedItems[id];
        });
        const newState = {};
        items.forEach(item => {
            const id = getVariantId(item);
            if (id) newState[id] = !allSelected;
        });
        setSelectedItems(newState);
    };

    const updateQuantity = async (variantId, newQuantity) => {
        if (newQuantity < 1) return;
        if (!variantId) {
            toast.error('Invalid item.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.put(route('customer.cart.update'), {
                variant_id: variantId,
                quantity: newQuantity,
            });
            if (response.data.success) {
                setItems(response.data.cart.items);
                toast.success('Cart updated.');
            }
        } catch (error) {
            toast.error('Failed to update cart.');
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (variantId) => {
        if (!variantId) {
            toast.error('Invalid item.');
            return;
        }
        if (!confirm('Remove this item?')) return;
        setLoading(true);
        try {
            const response = await axios.delete(route('customer.cart.remove'), {
                data: { variant_id: variantId },
            });
            if (response.data.success) {
                setItems(items.filter(item => getVariantId(item) !== variantId));
                setSelectedItems(prev => {
                    const newState = { ...prev };
                    delete newState[variantId];
                    return newState;
                });
                toast.success('Item removed.');
            }
        } catch (error) {
            toast.error('Failed to remove item.');
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        if (!confirm('Clear your entire cart?')) return;
        setLoading(true);
        try {
            await axios.delete(route('customer.cart.clear'));
            setItems([]);
            setSelectedItems({});
            toast.success('Cart cleared.');
        } catch (error) {
            toast.error('Failed to clear cart.');
        } finally {
            setLoading(false);
        }
    };

    const allSelected = items.length > 0 && items.every(item => {
        const id = getVariantId(item);
        return id && selectedItems[id];
    });

   const proceedToCheckout = () => {
    const selectedIds = items
        .filter(item => {
            const id = getVariantId(item);
            return id && selectedItems[id];
        })
        .map(item => item.id);

    if (selectedIds.length === 0) {
        toast.error('Please select at least one item.');
        return;
    }

    router.post(route('customer.checkout.store-selected'), {
        item_ids: selectedIds,
    }, {
        onError: (errors) => {
            toast.error('Failed to proceed to checkout.');
            console.error(errors);
        },
    });
};



    return (
        <CustomerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                    {items.length > 0 && (
                        <button
                            onClick={toggleSelectAll}
                            className="text-sm text-amber-700 hover:text-amber-900"
                        >
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">Your cart is empty.</p>
                        <Link href={route('shop')} className="mt-4 inline-block text-amber-700 hover:text-amber-900">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const variantId = getVariantId(item);
                                const isSelected = variantId && selectedItems[variantId];
                                const price = parseFloat(item.price) || 0;
                                const quantity = parseInt(item.quantity) || 0;

                                return (
                                    <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex gap-4 items-center">
                                        {/* Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={isSelected || false}
                                            onChange={() => variantId && toggleSelect(variantId)}
                                            className="h-5 w-5 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
                                        />

                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.variant?.product?.image ? (
                                                <img
                                                    src={`/storage/${item.variant.product.image}`}
                                                    alt={item.variant.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <ShoppingBagIcon className="h-8 w-8" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">
                                                {item.variant?.product?.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {item.variant?.wood_type}
                                                {item.variant?.finish && ` · ${item.variant.finish}`}
                                                {item.variant?.dimensions && ` · ${item.variant.dimensions}`}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                ₱{price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(variantId, quantity - 1)}
                                                disabled={loading || quantity <= 1}
                                                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                                            >
                                                <MinusIcon className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(variantId, quantity + 1)}
                                                disabled={loading}
                                                className="p-1 rounded-full hover:bg-gray-100"
                                            >
                                                <PlusIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => removeItem(variantId)}
                                                disabled={loading}
                                                className="p-1 ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="flex justify-between">
                                <button
                                    onClick={clearCart}
                                    disabled={loading}
                                    className="text-sm text-red-600 hover:text-red-800"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary – only selected items */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 h-fit">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Selected Items ({totalItems})</span>
                                    <span className="font-medium">₱{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-bold text-lg text-gray-900">₱{subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                               <button
    onClick={proceedToCheckout}
    disabled={loading || selectedItemsList.length === 0}
    className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
>
    Proceed to Checkout ({selectedItemsList.length} items)
</button>
                                <Link
                                    href={route('shop')}
                                    className="block text-center text-sm text-amber-700 hover:text-amber-900"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
