import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function MaterialInventoryIndex({ transactions, currentStock }) {
    // Helper to determine stock before (with safe number parsing)
    const getStockBefore = (tx) => {
        const balanceAfter = parseFloat(tx.balance_after) || 0;
        const quantity = parseFloat(tx.quantity) || 0;

        if (tx.type === 'stock_in') {
            return balanceAfter - quantity;
        } else if (tx.type === 'stock_out') {
            return balanceAfter + quantity;
        }
        return balanceAfter;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Material Inventory</h1>
                    <p className="text-gray-600">Transaction history for all raw materials.</p>
                </div>

                {/* Summary Cards */}
                {currentStock && currentStock.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currentStock.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
                                <h3 className="text-sm font-medium text-gray-500">{item.material?.name}</h3>
                                <p className="text-2xl font-bold text-gray-900">
                                    {item.quantity} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Material
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock Before
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Transaction Qty
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock After
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Movement Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.data.map((tx) => {
                                    const before = getStockBefore(tx);
                                    const isStockIn = tx.type === 'stock_in';
                                    const isStockOut = tx.type === 'stock_out';

                                    return (
                                        <tr key={tx.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {tx.material?.name || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {tx.material?.unit || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {before.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {parseFloat(tx.quantity).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {parseFloat(tx.balance_after).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {isStockIn ? (
                                                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                                                        Stock In
                                                    </span>
                                                ) : isStockOut ? (
                                                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-red-100 text-red-800">
                                                        Stock Out
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                        Adjustment
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {transactions.links && transactions.from !== undefined && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{transactions.from}</span> to{' '}
                                    <span className="font-medium">{transactions.to}</span> of{' '}
                                    <span className="font-medium">{transactions.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {transactions.links.map((link, index) => (
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
