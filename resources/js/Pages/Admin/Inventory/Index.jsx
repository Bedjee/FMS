import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    PlusIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

export default function InventoryIndex({ products }) {
    const [showStockInModal, setShowStockInModal] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        variant_id: '',
        quantity: '',
        notes: '',
    });

    const openStockIn = (variant) => {
        setSelectedVariant(variant);
        setData('variant_id', variant.id);
        setData('quantity', '');
        setData('notes', '');
        setShowStockInModal(true);
    };

    const handleStockIn = (e) => {
        e.preventDefault();
        post(route('admin.inventory.stock-in'), {
            onSuccess: () => {
                setShowStockInModal(false);
                reset();
            },
        });
    };

    const getStockStatus = (variant) => {
        const stock = variant.stock_quantity;
        const threshold = variant.low_stock_threshold || 5;
        if (stock <= 0) {
            return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: XCircleIcon };
        } else if (stock <= threshold) {
            return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon };
        } else {
            return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon };
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
                    <p className="text-gray-600">Monitor product stock levels and replenish inventory.</p>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Variant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.data.map((product) =>
                                product.variants.map((variant, idx) => {
                                    const status = getStockStatus(variant);
                                    const StatusIcon = status.icon;
                                    return (
                                        <tr key={variant.id}>
                                            {idx === 0 ? (
                                                <td
                                                    className="px-6 py-4 text-sm font-medium text-gray-900"
                                                    rowSpan={product.variants.length}
                                                >
                                                    {product.name}
                                                </td>
                                            ) : null}
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {variant.wood_type}
                                                {variant.finish && ` (${variant.finish})`}
                                                {variant.dimensions && ` - ${variant.dimensions}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {variant.stock_quantity}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}
                                                >
                                                    <StatusIcon className="h-4 w-4" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm space-x-3">
                                                <button
                                                    onClick={() => openStockIn(variant)}
                                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800"
                                                >
                                                    <PlusIcon className="h-4 w-4" />
                                                    Stock In
                                                </button>
                                                <Link
                                                    href={route('admin.inventory.transactions', variant.id)}
                                                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-800"
                                                >
                                                    <ClockIcon className="h-4 w-4" />
                                                    History
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {products.links && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{products.from}</span> to{' '}
                                    <span className="font-medium">{products.to}</span> of{' '}
                                    <span className="font-medium">{products.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {products.links.map((link, index) => (
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

            {/* Stock In Modal */}
            {showStockInModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowStockInModal(false)}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowStockInModal(false)} />
                    <div
                        className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock In</h3>
                        <form onSubmit={handleStockIn} className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Variant</p>
                                <p className="font-medium">
                                    {selectedVariant?.wood_type}
                                    {selectedVariant?.finish && ` (${selectedVariant.finish})`}
                                    {selectedVariant?.dimensions && ` - ${selectedVariant.dimensions}`}
                                </p>
                                <p className="text-sm text-gray-500">Current Stock: {selectedVariant?.stock_quantity}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity to Add *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    required
                                />
                                {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="2"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowStockInModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Add Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
