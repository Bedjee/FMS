import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Transactions({ variant, transactions }) {
    const transactionTypes = {
        stock_in: { label: 'Stock In', color: 'bg-green-100 text-green-800' },
        stock_out: { label: 'Stock Out', color: 'bg-red-100 text-red-800' },
        adjustment: { label: 'Adjustment', color: 'bg-yellow-100 text-yellow-800' },
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {variant.product?.name} – {variant.wood_type}
                        {variant.finish && ` (${variant.finish})`}
                        {variant.dimensions && ` - ${variant.dimensions}`}
                    </h1>
                    <Link href={route('admin.inventory.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back to Inventory
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(tx.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${transactionTypes[tx.type]?.color || 'bg-gray-100 text-gray-800'}`}>
                                                {transactionTypes[tx.type]?.label || tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{tx.quantity}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{tx.balance_after}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {tx.reference_type && tx.reference_id
                                                ? `${tx.reference_type} #${tx.reference_id}`
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{tx.notes || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
