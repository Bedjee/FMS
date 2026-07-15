import CustomerLayout from '@/Layouts/CustomerLayout';
import { usePage } from '@inertiajs/react';
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function CustomerDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const statCards = [
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            icon: ShoppingBagIcon,
            color: 'text-amber-700',
            bg: 'bg-amber-50',
        },
        {
            label: 'Pending Orders',
            value: stats.pendingOrders,
            icon: ClockIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Completed Orders',
            value: stats.completedOrders,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    return (
        <CustomerLayout>
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="mt-1 text-gray-600">
                        Welcome back, <span className="font-medium text-gray-900">{user?.name}</span>!
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity Placeholder – can be replaced with recent orders later */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    <div className="text-center py-8">
                        <p className="text-gray-500">No recent activity to display.</p>
                        <p className="text-sm text-gray-400 mt-1">Your recent orders and updates will appear here.</p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
