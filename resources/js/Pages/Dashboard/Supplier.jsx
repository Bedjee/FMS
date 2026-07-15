import SupplierLayout from '@/Layouts/SupplierLayout';
import { usePage } from '@inertiajs/react';
import {
    CubeIcon,
    CurrencyDollarIcon,
    TruckIcon,
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';

export default function SupplierDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const statCards = [
        { label: 'Total Materials', value: stats.totalMaterials, icon: CubeIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Stock (units)', value: stats.totalStock, icon: CubeIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Low Stock', value: stats.lowStock, icon: ExclamationTriangleIcon, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { label: 'Out of Stock', value: stats.outOfStock, icon: XCircleIcon, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Total Revenue', value: `₱${(parseFloat(stats.totalRevenue) || 0).toFixed(2)}`, icon: CurrencyDollarIcon, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: ClockIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Completed Deliveries', value: stats.completedDeliveries, icon: CheckCircleIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Orders This Month', value: stats.totalOrdersThisMonth, icon: TruckIcon, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    ];

    return (
        <SupplierLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Here's your business overview.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className="rounded-lg bg-white p-6 shadow border border-gray-200 hover:shadow-md transition">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                {stats.recentOrders && stats.recentOrders.length > 0 && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.recentOrders.map((order) => (
    <tr key={order.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 text-sm text-gray-900">{order.po_number}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{order.creator?.name}</td>
        <td className="px-6 py-4 text-sm text-gray-500">{order.order_date}</td>
        <td className="px-6 py-4 text-sm text-gray-900">
            ₱{((order.items || []).reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0)).toFixed(2)}
        </td>
        <td className="px-6 py-4 text-sm">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                order.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
                {order.status}
            </span>
        </td>
    </tr>
))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </SupplierLayout>
    );
}
