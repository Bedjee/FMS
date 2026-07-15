import DriverLayout from '@/Layouts/DriverLayout';
import { Link } from '@inertiajs/react';

export default function DriverOrders({ orders }) {
    return (
        <DriverLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">My Deliveries</h1>
                <p className="text-gray-600">Orders assigned to you for delivery.</p>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                        <p className="text-gray-500">No orders assigned to you.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                                <div className="flex flex-wrap items-start justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900">Order #{order.order_number}</p>
                                        <p className="text-sm text-gray-500">Customer: {order.user?.name}</p>
                                        <p className="text-sm text-gray-500">{order.recipient_name} • {order.contact_number}</p>
                                        <p className="text-sm text-gray-500">{order.street_address}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            order.fulfillment_status === 'shipped' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {order.fulfillment_status}
                                        </span>
                                        <Link href={route('driver.orders.show', order.id)} className="mt-2 block text-amber-700 hover:text-amber-900 text-sm">
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DriverLayout>
    );
}
