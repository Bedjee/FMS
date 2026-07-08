import { useState } from 'react';
import { router } from '@inertiajs/react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function RawMaterialsIndex({ materials, summary, lowStockAlerts }) {
    const deleteMaterial = (id) => {
        if (confirm('Are you sure?')) {
            router.delete(route('manager.raw-materials.destroy', id));
        }
    };

    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Raw Materials Inventory</h1>
                    <button className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-900 transition">
                        + Add Delivery
                    </button>
                </div>

                {/* Low Stock Alert – neutral but noticeable */}
                {Object.keys(lowStockAlerts).length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-orange-800">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            <span className="font-semibold">Low Stock Alert</span>
                        </div>
                        <ul className="mt-2 list-inside list-disc text-sm text-orange-700">
                            {Object.entries(lowStockAlerts).map(([wood, total]) => (
                                <li key={wood}>{wood}: {total} BF remaining (below 100 BF)</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Mahogany</h3>
                        <p className="text-2xl font-bold text-gray-900">{summary.Mahogany} BF</p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Gemelina</h3>
                        <p className="text-2xl font-bold text-gray-900">{summary.Gemelina} BF</p>
                    </div>
                </div>

                {/* Materials Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wood</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Board Feet</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materials.data.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.wood_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {material.thickness}" x {material.width}" x {material.length}'
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.board_feet}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.supplier?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.delivery_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => deleteMaterial(material.id)} className="text-red-600 hover:text-red-800 font-medium">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {materials.links && (
                    <div className="mt-4 flex justify-center">
                        <div dangerouslySetInnerHTML={{ __html: materials.links }} />
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
}
