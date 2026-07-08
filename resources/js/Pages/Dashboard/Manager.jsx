import ManagerLayout from '@/Layouts/ManagerLayout';
import { ChartBarIcon, CubeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { usePage } from '@inertiajs/react';

export default function ManagerDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Dynamic greeting based on time of day
    const currentHour = new Date().getHours();
    let greeting = 'Good morning';
    if (currentHour >= 12 && currentHour < 18) greeting = 'Good afternoon';
    else if (currentHour >= 18) greeting = 'Good evening';

    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {greeting}, {user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome to your dashboard. Here's what's happening today.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <div className="flex items-center">
                            <CubeIcon className="h-8 w-8 text-gray-700" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Raw Materials</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalRawMaterials}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <div className="flex items-center">
                            <ShoppingCartIcon className="h-8 w-8 text-gray-700" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Purchase Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.activePurchaseOrders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <div className="flex items-center">
                            <ChartBarIcon className="h-8 w-8 text-gray-700" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Work Orders</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingWorkOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
