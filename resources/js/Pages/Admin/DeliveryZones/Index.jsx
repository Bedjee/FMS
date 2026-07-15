import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ zones }) {
    const del = (id) => {
        if (confirm('Delete this zone?')) {
            router.delete(route('admin.delivery-zones.destroy', id));
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Zones</h1>
                    <Link href={route('admin.delivery-zones.create')} className="bg-slate-700 text-white px-4 py-2 rounded-lg">
                        + Add Zone
                    </Link>
                </div>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {zones.data.map((zone) => (
                                <tr key={zone.id}>
                                    <td className="px-6 py-4 text-sm text-gray-900">{zone.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">₱{zone.fee}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${zone.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {zone.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <Link href={route('admin.delivery-zones.edit', zone.id)} className="text-slate-600 hover:text-slate-800">Edit</Link>
                                        <button onClick={() => del(zone.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
