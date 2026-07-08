import AdminLayout from '@/Layouts/AdminLayout';
import { usePage } from '@inertiajs/react';

export default function AdminDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Manage system users, view reports, and configure settings.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">____</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Active Orders</p>
                        <p className="text-2xl font-bold text-gray-900">____</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                        <p className="text-2xl font-bold text-gray-900">₱0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">System Status</p>
                        <p className="text-2xl font-bold text-green-600">Development</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
