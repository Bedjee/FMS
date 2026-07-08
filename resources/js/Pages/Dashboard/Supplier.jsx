import SupplierLayout from '@/Layouts/SupplierLayout';
import { usePage } from '@inertiajs/react';

export default function SupplierDashboard({ stats }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <SupplierLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supplier Portal</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Manage your purchase orders and deliveries.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Pending Orders</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Completed Deliveries</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.completedDeliveries}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Total Orders This Month</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrdersThisMonth}</p>
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
}
