import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function RawMaterialsIndex({ materials, summary }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Raw Materials Inventory</h1>
                    <p className="text-gray-600">View all raw materials stock entries.</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 shadow border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Mahogany</h3>
                        <p className="text-2xl font-bold text-gray-900">{summary.Mahogany} BF</p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-500">Gemelina</h3>
                        <p className="text-2xl font-bold text-gray-900">{summary.Gemelina} BF</p>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wood Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Board Feet</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materials.data.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.wood_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.board_feet}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {material.thickness > 0 && material.width > 0 && material.length > 0
        ? `${material.thickness}" x ${material.width}" x ${material.length}'`
        : '—'}
</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.supplier?.name || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.delivery_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link href={route('admin.raw-materials.show', material.id)} className="text-slate-600 hover:text-slate-800">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
        </AdminLayout>
    );
}
