import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function ProductsIndex({ products }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = products.data.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isLowStock = (variants) => {
        if (!variants || variants.length === 0) return false;
        return variants.some(v => v.stock_quantity <= v.low_stock_threshold);
    };

    return (
        <ManagerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">View product catalog, variants, and inventory levels.</p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-slate-500 focus:ring-slate-500"
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {filteredProducts.map((product) => {
                        const lowStock = isLowStock(product.variants);
                        const totalStock = product.variants_sum_stock_quantity || 0;

                        return (
                            <div
                                key={product.id}
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${lowStock ? 'border-red-300' : 'border-gray-200'}`}
                            >
                                <div className="flex flex-wrap items-center p-4 gap-4">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                                <span className="text-xs text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                {product.name}
                                            </h3>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                            {lowStock && (
                                                <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                                                    ⚠️ Low Stock
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-0.5">
                                            <span>SKU: <span className="font-mono text-gray-700">{product.sku}</span></span>
                                            <span>Base Price: <span className="font-medium text-gray-900">₱{product.base_price}</span></span>
                                            <span>Variants: <span className="font-medium text-gray-700">{product.variants_count}</span></span>
                                            <span>BOM Items: <span className="font-medium text-gray-700">{product.bom_items_count}</span></span>
                                            <span>
                                                Total Stock:{' '}
                                                <span className={`font-medium ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {totalStock}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions – View only */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={route('manager.products.show', product.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                            View
                                        </Link>
                                    </div>
                                </div>

                                {/* Variant Summary */}
                                {product.variants && product.variants.length > 0 && (
                                    <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Variants:</span>
                                            {product.variants.map((variant, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs rounded-full border border-gray-200 bg-white shadow-sm ${variant.stock_quantity <= variant.low_stock_threshold ? 'border-red-300 bg-red-50' : ''}`}
                                                >
                                                    <span className="font-medium text-gray-700">{variant.wood_type}</span>
                                                    {variant.finish && <span className="text-gray-400">({variant.finish})</span>}
                                                    <span className="text-gray-500">|</span>
                                                    <span className={`font-medium ${variant.stock_quantity > variant.low_stock_threshold ? 'text-green-600' : 'text-red-500'}`}>
                                                        {variant.stock_quantity}
                                                    </span>
                                                    {variant.stock_quantity <= variant.low_stock_threshold && (
                                                        <span className="text-red-500 text-xs ml-0.5">⚠️</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Empty state */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <p className="text-gray-500">No products found.</p>
                    </div>
                )}

                {/* Pagination */}
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
        </ManagerLayout>
    );
}
