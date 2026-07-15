import CustomerLayout from '@/Layouts/CustomerLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Checkout({
    items,
    subtotal,
    totalItems,
    user,
    deliveryFee: initialDeliveryFee,
    deliveryZone: initialDeliveryZone,
    deliveryAvailable: initialDeliveryAvailable,
    deliveryMessage: initialDeliveryMessage,
    deliveryZones,
}) {
    // Ensure numeric values
    const [deliveryFee, setDeliveryFee] = useState(() => Number(initialDeliveryFee) || 0);
    const [deliveryAvailable, setDeliveryAvailable] = useState(() => initialDeliveryAvailable !== false);
    const [deliveryMessage, setDeliveryMessage] = useState(() => initialDeliveryMessage || '');
    const [isChecking, setIsChecking] = useState(false);
    const [showZoneModal, setShowZoneModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        recipient_name: user.name || '',
        contact_number: user.phone || '',
        province: '',
        city: '',
        barangay: '',
        street_address: user.address || '',
        postal_code: '',
        payment_method: 'cod',
        delivery_zone_id: initialDeliveryZone?.id || null,
        shipping_fee: deliveryFee, // use the state value
        items: items.map(item => ({ id: item.id, quantity: item.quantity })),
    });

    // When props update, sync state
    useEffect(() => {
        setDeliveryFee(Number(initialDeliveryFee) || 0);
        setDeliveryAvailable(initialDeliveryAvailable !== false);
        setDeliveryMessage(initialDeliveryMessage || '');
        setData('shipping_fee', Number(initialDeliveryFee) || 0);
        setData('delivery_zone_id', initialDeliveryZone?.id || null);
    }, [initialDeliveryFee, initialDeliveryAvailable, initialDeliveryMessage, initialDeliveryZone]);

    // Check delivery when city changes
    useEffect(() => {
        const city = data.city;
        if (city && city.length > 2) {
            setIsChecking(true);
            router.visit(route('customer.checkout'), {
                data: { city: city },
                preserveState: true,
                preserveScroll: true,
                only: ['deliveryFee', 'deliveryZone', 'deliveryAvailable', 'deliveryMessage'],
                onFinish: () => setIsChecking(false),
            });
        }
    }, [data.city]);

    const selectZone = (zone) => {
        setData('city', zone.name);
        setDeliveryFee(Number(zone.fee) || 0);
        setShowZoneModal(false);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!deliveryAvailable) {
            toast.error('Delivery is not available in your area.');
            return;
        }
        // Ensure shipping fee is numeric
        setData('shipping_fee', deliveryFee);
        post(route('customer.checkout.store'));
    };

    // Compute totals – all numeric
    const subtotalNum = Number(subtotal) || 0;
    const deliveryFeeNum = Number(deliveryFee) || 0;
    const total = subtotalNum + deliveryFeeNum;
    const totalItemsNum = Number(totalItems) || 0;

    return (
        <CustomerLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Delivery Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Recipient Name *</label>
                                        <input
                                            type="text"
                                            value={data.recipient_name}
                                            onChange={(e) => setData('recipient_name', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            required
                                        />
                                        {errors.recipient_name && <p className="mt-1 text-sm text-red-600">{errors.recipient_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                                        <input
                                            type="text"
                                            value={data.contact_number}
                                            onChange={(e) => setData('contact_number', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                            required
                                        />
                                        {errors.contact_number && <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Province *</label>
                                    <input
                                        type="text"
                                        value={data.province}
                                        onChange={(e) => setData('province', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        required
                                    />
                                    {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province}</p>}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-gray-700">City/Municipality *</label>
                                        <button
                                            type="button"
                                            onClick={() => setShowZoneModal(true)}
                                            className="text-sm text-amber-700 hover:text-amber-900 flex items-center gap-1"
                                        >
                                            <MapPinIcon className="h-4 w-4" />
                                            See Delivery Locations
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        placeholder="Enter your city"
                                        required
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                    {isChecking && <p className="mt-1 text-sm text-gray-400">Checking delivery availability...</p>}
                                    {!deliveryAvailable && !isChecking && (
                                        <p className="mt-1 text-sm text-red-600">{deliveryMessage}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Barangay *</label>
                                    <input
                                        type="text"
                                        value={data.barangay}
                                        onChange={(e) => setData('barangay', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        required
                                    />
                                    {errors.barangay && <p className="mt-1 text-sm text-red-600">{errors.barangay}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Street Address / House No. / Landmark *</label>
                                    <textarea
                                        value={data.street_address}
                                        onChange={(e) => setData('street_address', e.target.value)}
                                        rows="2"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                        required
                                    />
                                    {errors.street_address && <p className="mt-1 text-sm text-red-600">{errors.street_address}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        value={data.postal_code}
                                        onChange={(e) => setData('postal_code', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                                    />
                                    {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="cod"
                                        checked={data.payment_method === 'cod'}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="h-4 w-4 text-amber-700 focus:ring-amber-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-700">Cash on Delivery (COD)</span>
                                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer opacity-50">
                                    <input
                                        type="radio"
                                        value="gcash"
                                        disabled
                                        className="h-4 w-4 text-amber-700 focus:ring-amber-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-700">GCash</span>
                                        <p className="text-sm text-gray-500">
                                            Coming Soon <span className="text-xs text-amber-600 ml-1">(not yet available)</span>
                                        </p>
                                    </div>
                                </label>
                            </div>
                            {errors.payment_method && <p className="mt-1 text-sm text-red-600">{errors.payment_method}</p>}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6 h-fit sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Items ({totalItemsNum})</span>
                                    <span className="font-medium">₱{subtotalNum.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="font-medium">₱{deliveryFeeNum.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                    <span className="font-semibold text-gray-900">Total</span>
                                    <span className="font-bold text-lg text-gray-900">₱{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={submit}
                                    disabled={processing || !deliveryAvailable}
                                    className="w-full bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Placing Order...' : 'Place Order'}
                                </button>
                                <Link
                                    href={route('customer.cart')}
                                    className="block text-center text-sm text-amber-700 hover:text-amber-900"
                                >
                                    ← Back to Cart
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Zones Modal */}
            {showZoneModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowZoneModal(false)}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowZoneModal(false)} />
                    <div
                        className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Delivery Locations</h3>
                            <button
                                onClick={() => setShowZoneModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Select your delivery location. We currently serve the following areas:
                        </p>
                        {deliveryZones && deliveryZones.length > 0 ? (
                            <div className="space-y-2">
                                {deliveryZones.map((zone) => (
                                    <button
                                        key={zone.id}
                                        onClick={() => selectZone(zone)}
                                        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition"
                                    >
                                        <div className="font-medium text-gray-900">{zone.name}</div>
                                        <div className="text-sm text-gray-500">Delivery Fee: ₱{Number(zone.fee).toFixed(2)}</div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No delivery zones available at the moment.</p>
                        )}
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
