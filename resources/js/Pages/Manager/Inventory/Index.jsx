import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

export default function InventoryIndex({ products }) {
    const getStockStatus = (variant) => {
        const stock = variant.stock_quantity;
        const threshold = variant.low_stock_threshold || 5;
        if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: XCircleIcon };
        if (stock <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: ExclamationTriangleIcon };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon };
    };

    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Inventory</h1>
                    <p className="text-gray-600">Monitor stock levels and view transaction history.</p>
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
                                            {idx === 0 && (
                                                <td
                                                    className="px-6 py-4 text-sm font-medium text-gray-900"
                                                    rowSpan={product.variants.length}
                                                >
                                                    {product.name}
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {variant.wood_type}
                                                {variant.finish && ` (${variant.finish})`}
                                                {variant.dimensions && ` - ${variant.dimensions}`}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {variant.stock_quantity}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                                                    <StatusIcon className="h-4 w-4" />
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link
                                                    href={route('manager.inventory.transactions', variant.id)}
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

                {/* Pagination – same as in your other pages */}
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
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
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
        </ManagerLayout>
    );
}
