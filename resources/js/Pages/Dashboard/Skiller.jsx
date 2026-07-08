import SkillerLayout from '@/Layouts/SkillerLayout';
import { usePage } from '@inertiajs/react';

export default function SkillerDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <SkillerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Record usable board feet from raw materials and manage work orders.
                    </p>
                </div>

                {/* Placeholder stats or later tasks */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Pending Processing</h3>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Materials Processed Today</h3>
                        <p className="text-2xl font-bold text-gray-900">0 BF</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Active Work Orders</h3>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>
        </SkillerLayout>
    );
}
