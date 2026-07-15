import DriverLayout from '@/Layouts/DriverLayout';
import { usePage } from '@inertiajs/react';
import { TruckIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function DriverDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const statCards = [
        {
            label: 'Assigned Deliveries',
            value: stats.assigned,
            icon: TruckIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'In Progress',
            value: stats.inProgress,
            icon: ClockIcon,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
        },
        {
            label: 'Completed Today',
            value: stats.completedToday,
            icon: CheckCircleIcon,
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
    ];

    return (
        <DriverLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-lg bg-white p-6 shadow border border-gray-200 hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href={route('driver.orders.index')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                        >
                            <TruckIcon className="h-5 w-5" />
                            View My Deliveries
                        </a>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
