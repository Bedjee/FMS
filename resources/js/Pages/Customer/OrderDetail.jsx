import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';

export default function OrderDetail({ order }) {
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
            'shipped': { label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
            'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
            'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const getPaymentStatusBadge = (status) => {
        const statusMap = {
            'awaiting_downpayment': { label: 'Awaiting Payment', color: 'bg-yellow-100 text-yellow-800' },
            'downpayment_paid': { label: 'Downpayment Paid', color: 'bg-blue-100 text-blue-800' },
            'completed': { label: 'Paid', color: 'bg-green-100 text-green-800' },
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    return (
        <CustomerLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                    <Link href={route('customer.orders')} className="text-amber-700 hover:text-amber-900">
                        ← Back to Orders
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.fulfillment_status).color}`}>
                                {getStatusBadge(order.fulfillment_status).label}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusBadge(order.payment_status).color}`}>
                                {getPaymentStatusBadge(order.payment_status).label}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
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
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <div className="flex justify-end">
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between gap-8">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>₱{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between gap-8">
    <span className="text-gray-500">Shipping Fee</span>
    <span>₱{order.shipping_fee !== undefined && order.shipping_fee !== null ? order.shipping_fee : 0}</span>
</div>
                                <div className="flex justify-between gap-8 font-bold text-lg border-t border-gray-200 pt-2">
                                    <span>Total</span>
                                    <span>₱{order.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
