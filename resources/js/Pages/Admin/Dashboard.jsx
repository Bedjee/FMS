import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';
import {
    UsersIcon,
    ShoppingBagIcon,
    BanknotesIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Ensure stats are numbers with fallback to 0
    const safeStats = {
        totalRevenue: stats?.totalRevenue ?? 0,
        todayRevenue: stats?.todayRevenue ?? 0,
        monthRevenue: stats?.monthRevenue ?? 0,
        completedOrders: stats?.completedOrders ?? 0,
        activeOrders: stats?.activeOrders ?? 0,
        totalUsers: stats?.totalUsers ?? 0,
    };

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₱${safeStats.totalRevenue.toFixed(2)}`,
            icon: BanknotesIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: "Today's Revenue",
            value: `₱${safeStats.todayRevenue.toFixed(2)}`,
            icon: BanknotesIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: "This Month's Revenue",
            value: `₱${safeStats.monthRevenue.toFixed(2)}`,
            icon: BanknotesIcon,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            label: 'Completed Orders',
            value: safeStats.completedOrders,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Active Orders',
            value: safeStats.activeOrders,
            icon: ShoppingBagIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Total Users',
            value: safeStats.totalUsers,
            icon: UsersIcon,
            color: 'text-slate-600',
            bg: 'bg-slate-50',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Here's an overview of your business.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg bg-white p-6 shadow border border-gray-200 hover:shadow-md transition"
                        >
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Total Revenue</span>
                                <span className="font-bold text-gray-900">₱{safeStats.totalRevenue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Today</span>
                                <span className="font-medium text-gray-700">₱{safeStats.todayRevenue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">This Month</span>
                                <span className="font-medium text-gray-700">₱{safeStats.monthRevenue.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Statistics</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Completed Orders</span>
                                <span className="font-bold text-gray-900">{safeStats.completedOrders}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                <span className="text-gray-500">Active Orders</span>
                                <span className="font-medium text-gray-700">{safeStats.activeOrders}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Total Users</span>
                                <span className="font-medium text-gray-700">{safeStats.totalUsers}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
