import CarpenterLayout from '@/Layouts/CarpenterLayout';
import { usePage } from '@inertiajs/react';

export default function CarpenterDashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <CarpenterLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Carpenter Workspace</h1>
                    <p className="text-gray-600 mt-1">Welcome, {user?.name}. Manage your assigned work orders and update production status.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Assigned Tasks</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">In Progress</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
                        <p className="text-sm font-medium text-gray-500">Completed This Week</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                </div>
            </div>
        </CarpenterLayout>
    );
}
