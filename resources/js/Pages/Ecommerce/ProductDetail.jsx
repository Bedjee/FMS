import { Head, Link } from '@inertiajs/react';

export default function ProductDetail({ product }) {
    return (
        <>
            <Head title={product.name} />
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Link href={route('shop')} className="text-slate-600 hover:text-slate-800">
                        ← Back to Shop
                    </Link>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image */}
                        <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                            {product.image ? (
                                <img
                                    src={`/storage/${product.image}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-4">₱{product.base_price}</p>
                            <p className="mt-4 text-gray-700">{product.description || 'No description available.'}</p>
                            {product.dimensions && (
                                <p className="mt-2 text-sm text-gray-500">Dimensions: {product.dimensions}</p>
                            )}

                            {/* Variants */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-900">Variants</h3>
                                    <div className="mt-2 grid grid-cols-1 gap-3">
                                        {product.variants.map((variant) => (
                                            <div key={variant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div>
                                                    <span className="font-medium">{variant.wood_type}</span>
                                                    {variant.finish && <span className="text-gray-500 ml-2">({variant.finish})</span>}
                                                    {variant.dimensions && <span className="text-gray-400 ml-2 text-sm">· {variant.dimensions}</span>}
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold">₱{variant.price}</span>
                                                    <span className="text-sm text-gray-500 block">Stock: {variant.stock_quantity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );A
}
