import DriverLayout from '@/Layouts/DriverLayout';
import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DriverOrderDetail({ order }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        pod_image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('driver.orders.delivered', order.id), {
            forceFormData: true,
            onSuccess: () => setShowModal(false),
        });
    };

    const handleFileChange = (e) => {
        setData('pod_image', e.target.files[0]);
    };

    return (
        <DriverLayout>
            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                    <Link href={route('driver.orders.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back to Deliveries
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-6">
                    {/* Order Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-sm text-gray-400">{order.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                order.fulfillment_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.fulfillment_status === 'shipped' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {order.fulfillment_status}
                            </span>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery Address</h2>
                        <p className="font-medium">{order.recipient_name}</p>
                        <p className="text-gray-500">{order.contact_number}</p>
                        <p className="text-gray-700">
                            {order.street_address}<br />
                            {order.barangay}, {order.city}<br />
                            {order.province} {order.postal_code}
                        </p>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-200 pt-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Items</h2>
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm border-b border-gray-100 pb-2">
                                    <div>
                                        <p className="font-medium">{item.variant?.product?.name}</p>
                                        <p className="text-gray-500">
                                            {item.variant?.wood_type}
                                            {item.variant?.finish && ` (${item.variant.finish})`}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p>Qty: {item.quantity}</p>
                                        <p>₱{item.subtotal}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-end font-bold">
                            Total: ₱{order.total}
                        </div>
                    </div>

                    {/* Proof of Delivery (if uploaded) */}
                    {order.proof_of_delivery && (
                        <div className="border-t border-gray-200 pt-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Proof of Delivery</h2>
                            <div className="flex items-center gap-4">
                                <a
                                    href={`/storage/${order.proof_of_delivery}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                                >
                                    View Proof of Delivery
                                </a>
                                <span className="text-sm text-green-600">✓ Uploaded successfully</span>
                            </div>
                        </div>
                    )}

                    {/* Action */}
                    {order.fulfillment_status === 'shipped' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                        >
                            Mark as Delivered
                        </button>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div
                        className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof of Delivery</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Please upload a photo as proof of delivery (JPG, PNG, max 2MB).
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                                    required
                                />
                                {errors.pod_image && <p className="mt-1 text-sm text-red-600">{errors.pod_image}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !data.pod_image}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {processing ? 'Uploading...' : 'Confirm Delivery'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DriverLayout>
    );
}
