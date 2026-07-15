import CustomerLayout from '@/Layouts/CustomerLayout';
import { Link } from '@inertiajs/react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, PackageIcon } from 'lucide-react';

export default function Orders({ orders }) {
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
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>

                {orders.data.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                        <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-4 text-gray-500">You haven't placed any orders yet.</p>
                        <Link href={route('shop')} className="mt-4 inline-block text-amber-700 hover:text-amber-900">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => {
                            const status = getStatusBadge(order.fulfillment_status);
                            const payment = getPaymentStatusBadge(order.payment_status);
                            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order #{order.order_number}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                {status.label}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${payment.color}`}>
                                                {payment.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Total Items</p>
                                            <p className="font-medium">{totalItems}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="font-bold text-lg text-gray-900">₱{order.total}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="text-amber-700 hover:text-amber-900 text-sm font-medium"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {orders.links && (
                    <div className="mt-6 flex justify-center">
                        {orders.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`mx-1 px-3 py-1 rounded ${
                                    link.active
                                        ? 'bg-amber-700 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
