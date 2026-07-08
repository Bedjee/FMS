import DriverLayout from '@/Layouts/DriverLayout';
import { usePage } from '@inertiajs/react';

export default function DriverDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <DriverLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Track your deliveries and update statuses.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Assigned Deliveries</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">In Progress</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Completed Today</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
}
