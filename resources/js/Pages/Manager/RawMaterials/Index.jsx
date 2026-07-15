import { useState,  } from 'react';
import { router,Link } from '@inertiajs/react';
import ManagerLayout from '@/Layouts/ManagerLayout';
import {
    ExclamationTriangleIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    CubeIcon,
    CalendarIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

export default function RawMaterialsIndex({ materials, summary, lowStockAlerts }) {
    const [searchTerm, setSearchTerm] = useState('');

    const deleteMaterial = (id) => {
        if (confirm('Are you sure you want to delete this material entry?')) {
            router.delete(route('manager.raw-materials.destroy', id));
        }
    };

    // Filter materials based on search
    const filteredMaterials = materials.data.filter(
        (material) =>
            material.material_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ManagerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CubeIcon className="h-6 w-6 text-gray-700" />
                            Raw Materials Inventory
                        </h1>
                        <p className="text-gray-500 text-sm mt-0.5">
                            Track and manage your raw material stock levels.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 transition shadow-sm">
                        <PlusIcon className="h-5 w-5" />
                        Add Delivery
                    </button>
                </div>

                {/* Low Stock Alert */}
                {Object.keys(lowStockAlerts).length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-amber-800">Low Stock Alert</h4>
                            <ul className="mt-1 space-y-0.5 text-sm text-amber-700">
                                {Object.entries(lowStockAlerts).map(([material, total]) => (
                                    <li key={material}>
                                        {material}: <strong>{total}</strong> BF remaining (below 100 BF)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(summary).map(([material, total]) => (
                        <div
                            key={material}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-sm font-medium text-gray-500">{material}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {total} <span className="text-sm font-normal text-gray-400">BF</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by material or supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    />
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Material
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dimensions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Board Feet
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Delivery Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredMaterials.length > 0 ? (
                                    filteredMaterials.map((material) => (
                                        <tr
                                            key={material.id}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {material.material_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {material.thickness}" × {material.width}" × {material.length}'
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {material.board_feet}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {material.supplier?.name || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {material.delivery_date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => deleteMaterial(material.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No materials found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {materials.links && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{materials.from}</span> to{' '}
                                    <span className="font-medium">{materials.to}</span> of{' '}
                                    <span className="font-medium">{materials.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {materials.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active
                                                    ? 'z-10 bg-slate-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600'
                                                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            } ${!link.url ? 'pointer-events-none bg-gray-100 text-gray-400' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ManagerLayout>
    );
}
