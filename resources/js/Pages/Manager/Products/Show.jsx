import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';

export default function ShowProduct({ product }) {
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock_quantity, 0);

    return (
        <ManagerLayout>
            <div className="max-w-5xl mx-auto py-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    <Link href={route('manager.products.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.image && (
                            <div>
                                <img src={`/storage/${product.image}`} alt={product.name} className="w-48 h-48 object-cover rounded-lg border border-gray-200" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-500">SKU</p>
                            <p className="font-medium">{product.sku}</p>
                            <p className="text-sm text-gray-500 mt-2">Base Price</p>
                            <p className="font-medium">₱{product.base_price}</p>
                            <p className="text-sm text-gray-500 mt-2">Dimensions</p>
                            <p className="font-medium">{product.dimensions || 'Not set'}</p>
                            <p className="text-sm text-gray-500 mt-2">Status</p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                            <p className="text-sm text-gray-500 mt-2">Total Stock</p>
                            <p className="font-medium">{totalStock}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                        <p className="text-gray-600">{product.description || 'No description'}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Variants</h2>
                        {product.variants.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Wood</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Finish</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {product.variants.map((variant) => (
                                        <tr key={variant.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{variant.wood_type}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{variant.finish || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">₱{variant.price}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{variant.stock_quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500">No variants.</p>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">Bill of Materials</h2>
                        {product.bom_items.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {product.bom_items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.material?.name || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{item.unit || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{item.notes || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500">No BOM items.</p>
                        )}
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
