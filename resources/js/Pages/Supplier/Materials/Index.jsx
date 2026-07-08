import SupplierLayout from '@/Layouts/SupplierLayout';
import { Link, router } from '@inertiajs/react';

export default function MaterialsIndex({ materials }) {
    const deleteMaterial = (id) => {
        if (confirm('Delete this material?')) {
            router.delete(route('supplier.materials.destroy', id));
        }
    };

    return (
        <SupplierLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Materials</h1>
                    <Link href={route('supplier.materials.create')} className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                        + Add Material
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materials.data.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{material.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.unit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{material.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.stock_quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${material.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {material.is_available ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                        <Link href={route('supplier.materials.edit', material.id)} className="text-purple-600 hover:text-purple-800">
                                            Edit
                                        </Link>
                                        <button onClick={() => deleteMaterial(material.id)} className="text-red-600 hover:text-red-800">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Custom Pagination */}
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
                                                ? 'z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600'
                                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        } ${!link.url ? 'pointer-events-none bg-gray-100 text-gray-400' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </SupplierLayout>
    );
}
