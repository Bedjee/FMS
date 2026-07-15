import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';

export default function OrdersShow({ order }) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStatusColors = {
        awaiting_downpayment: 'bg-yellow-100 text-yellow-800',
        downpayment_paid: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <ManagerLayout>
            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                    <Link href={route('manager.orders.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back to Orders
                    </Link>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-sm text-gray-400">{order.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">{order.contact_number}</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.fulfillment_status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.fulfillment_status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.payment_status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium capitalize">{order.payment_method}</p>
                        </div>
                    </div>
                    {order.delivery_personnel_id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Delivery Personnel</p>
                            <p className="font-medium">{order.delivery_personnel?.name}</p>
                        </div>
                    )}
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Recipient</p>
                            <p className="font-medium">{order.recipient_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">{order.contact_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                                {order.street_address}<br />
                                {order.barangay}, {order.city}<br />
                                {order.province} {order.postal_code}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.variant?.product?.image ? (
                                        <img
                                            src={`/storage/${item.variant.product.image}`}
                                            alt={item.variant.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.variant?.product?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.variant?.wood_type}
                                        {item.variant?.finish && ` · ${item.variant.finish}`}
                                        {item.variant?.dimensions && ` · ${item.variant.dimensions}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} × ₱{item.price}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">₱{item.subtotal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between gap-8">
                                <span className="text-gray-500">Subtotal</span>
                                <span>₱{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                                <span className="text-gray-500">Shipping Fee</span>
                                <span>₱{order.shipping_fee}</span>
                            </div>
                            <div className="flex justify-between gap-8 font-bold text-lg border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>₱{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proof of Delivery */}
                {order.proof_of_delivery && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Proof of Delivery</h2>
                        <a
                            href={`/storage/${order.proof_of_delivery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                        >
                            View Proof of Delivery
                        </a>
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
}
