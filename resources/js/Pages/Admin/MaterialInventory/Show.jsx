import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function MaterialInventoryShow({ inventory, transactions }) {
    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {inventory.material?.name} – Stock History
                    </h1>
                    <Link href={route('admin.material-inventory.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Current Stock</p>
                            <p className="text-2xl font-bold text-gray-900">{inventory.quantity} {inventory.unit}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Unit</p>
                            <p className="text-lg font-medium text-gray-700">{inventory.unit}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Transaction History</h2>
                    {transactions.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Balance After</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reference</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {transactions.data.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="px-4 py-2 text-sm text-gray-500">{tx.created_at}</td>
                                            <td className="px-4 py-2 text-sm capitalize">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    tx.type === 'stock_in' ? 'bg-green-100 text-green-800' :
                                                    tx.type === 'stock_out' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{tx.quantity}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{tx.balance_after}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{tx.reference_type || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{tx.notes || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No transactions yet.</p>
                    )}
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
