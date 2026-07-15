import ManagerLayout from '@/Layouts/ManagerLayout';
import { usePage } from '@inertiajs/react';
import {
    BanknotesIcon,
    ShoppingBagIcon,
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    CubeIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function ManagerDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const currentHour = new Date().getHours();
    let greeting = 'Good morning';
    if (currentHour >= 12 && currentHour < 18) greeting = 'Good afternoon';
    else if (currentHour >= 18) greeting = 'Good evening';

    // Safely parse numeric values
    const safeStats = {
        totalRevenue: parseFloat(stats?.totalRevenue) || 0,
        todayRevenue: parseFloat(stats?.todayRevenue) || 0,
        monthRevenue: parseFloat(stats?.monthRevenue) || 0,
        availableCapital: parseFloat(stats?.availableCapital) || 0,
        totalExpenses: parseFloat(stats?.totalExpenses) || 0,
        netProfit: parseFloat(stats?.netProfit) || 0,
        profitMargin: parseFloat(stats?.profitMargin) || 0,
        totalOrders: stats?.totalOrders ?? 0,
        pendingOrders: stats?.pendingOrders ?? 0,
        processingOrders: stats?.processingOrders ?? 0,
        shippedOrders: stats?.shippedOrders ?? 0,
        deliveredOrders: stats?.deliveredOrders ?? 0,
        lowStockCount: stats?.lowStockCount ?? 0,
        outOfStockCount: stats?.outOfStockCount ?? 0,
        totalRawMaterials: stats?.totalRawMaterials ?? '0 BF',
        activePurchaseOrders: stats?.activePurchaseOrders ?? 0,
        pendingWorkOrders: stats?.pendingWorkOrders ?? 0,
        lowStockProducts: stats?.lowStockProducts ?? [],
        outOfStockProducts: stats?.outOfStockProducts ?? [],
        recentOrders: stats?.recentOrders ?? [],
        monthlyData: stats?.monthlyData ?? [],
        recentTransactions: stats?.recentTransactions ?? [],
    };

    const orderStatusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    // Format currency
    const formatCurrency = (amount) => `₱${amount.toFixed(2)}`;

    // Financial stat cards (additional)
    const financialCards = [
        {
            label: 'Available Capital',
            value: formatCurrency(safeStats.availableCapital),
            icon: BanknotesIcon,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
        },
        {
            label: 'Total Revenue',
            value: formatCurrency(safeStats.totalRevenue),
            icon: CurrencyDollarIcon,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
        {
            label: 'Total Expenses',
            value: formatCurrency(safeStats.totalExpenses),
            icon: CurrencyDollarIcon,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
        },
        {
            label: 'Net Profit / Loss',
            value: formatCurrency(safeStats.netProfit),
            icon: safeStats.netProfit >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
            color: safeStats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600',
            bg: safeStats.netProfit >= 0 ? 'bg-emerald-50' : 'bg-rose-50',
        },
        {
            label: 'Profit Margin',
            value: `${safeStats.profitMargin.toFixed(2)}%`,
            icon: ArrowTrendingUpIcon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
    ];

    // Existing stat cards (non-financial)
    const operationalCards = [
        {
            label: 'Total Orders',
            value: safeStats.totalOrders,
            icon: ShoppingBagIcon,
            color: 'text-slate-600',
            bg: 'bg-slate-50',
        },
        {
            label: 'Pending Orders',
            value: safeStats.pendingOrders,
            icon: ClockIcon,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
        {
            label: 'Processing Orders',
            value: safeStats.processingOrders,
            icon: ClockIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Shipped Orders',
            value: safeStats.shippedOrders,
            icon: TruckIcon,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
        },
        {
            label: 'Delivered Orders',
            value: safeStats.deliveredOrders,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            label: 'Raw Materials',
            value: safeStats.totalRawMaterials,
            icon: CubeIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
        },
        {
            label: 'Purchase Orders',
            value: safeStats.activePurchaseOrders,
            icon: ShoppingBagIcon,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
        },
        {
            label: 'Low Stock Items',
            value: safeStats.lowStockCount,
            icon: ExclamationTriangleIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Out of Stock',
            value: safeStats.outOfStockCount,
            icon: ExclamationTriangleIcon,
            color: 'text-red-600',
            bg: 'bg-red-50',
        },
    ];

    return (
        <ManagerLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {greeting}, {user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome to your dashboard. Here's what's happening today.
                    </p>
                </div>

                {/* Financial Overview */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                        {financialCards.map((stat) => (
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
                </div>

                {/* Monthly Revenue vs Expenses Chart */}
                {safeStats.monthlyData.length > 0 && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Expenses (Last 12 Months)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={safeStats.monthlyData}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => `₱${(value/1000).toFixed(0)}k`} />
                                <Tooltip
                                    formatter={(value) => [`₱${value.toFixed(2)}`, undefined]}
                                    labelFormatter={(label) => `Month: ${label}`}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10B981"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#F43F5E"
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                    name="Expenses"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Recent Financial Transactions */}
                {safeStats.recentTransactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Financial Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {safeStats.recentTransactions.map((tx, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    tx.type === 'income'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {tx.type === 'income' ? 'Income' : 'Expense'}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 text-sm font-medium ${
                                                tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                                            }`}>
                                                {tx.type === 'income' ? '+' : '-'} ₱{tx.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Operational Stats */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Operations Overview</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {operationalCards.map((stat) => (
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
                </div>

                {/* Low Stock & Out of Stock Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Products</h2>
                        {safeStats.lowStockProducts.length === 0 ? (
                            <p className="text-gray-500 text-sm">No low stock products.</p>
                        ) : (
                            <div className="space-y-2">
                                {safeStats.lowStockProducts.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.variant}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-orange-600">{product.stock} units</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Out of Stock Products</h2>
                        {safeStats.outOfStockProducts.length === 0 ? (
                            <p className="text-gray-500 text-sm">All products are in stock.</p>
                        ) : (
                            <div className="space-y-2">
                                {safeStats.outOfStockProducts.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.variant}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-red-600">Out of Stock</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
                    {safeStats.recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {safeStats.recentOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{order.order_number}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{order.customer}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">₱{order.total}</td>
                                            <td className="px-4 py-2 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${orderStatusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
