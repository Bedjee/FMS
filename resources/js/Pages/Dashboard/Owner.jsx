import OwnerLayout from '@/Layouts/OwnerLayout';
import { usePage } from '@inertiajs/react';

export default function OwnerDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <OwnerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Full system insights and reports will appear here.</p>
                </div>
                {/* Placeholder for future metrics */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₱0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>
        </OwnerLayout>
    );
}
