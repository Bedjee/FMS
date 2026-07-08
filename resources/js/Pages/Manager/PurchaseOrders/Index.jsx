import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';

export default function PurchaseOrdersIndex({ purchaseOrders }) {
    const statusInfo = {
        draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', description: 'Initial stage, not yet sent to supplier' },
        sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800', description: 'Order sent to supplier, awaiting confirmation' },
        confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800', description: 'Supplier has confirmed the order' },
        delivered: { label: 'Delivered', color: 'bg-purple-100 text-purple-800', description: 'Materials have been delivered' },
        cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', description: 'Order has been cancelled' },
    };

    const getTotal = (items) => {
        if (!items || !Array.isArray(items)) return 0;
        return items.reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0);
    };

    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
                        <p className="text-gray-600">View all purchase orders created from material requests.</p>
                    </div>
                </div>

                {/* Status Legend */}
                <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Legend</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(statusInfo).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2 text-sm">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${value.color}`}>
                                    {value.label}
                                </span>
                                <span className="text-gray-500 text-xs">{value.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {purchaseOrders.data.map((po) => (
                                <tr key={po.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{po.po_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.supplier?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{po.order_date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₱{getTotal(po.items).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusInfo[po.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                                            {statusInfo[po.status]?.label || po.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link href={route('manager.purchase-orders.show', po.id)} className="text-slate-600 hover:text-slate-800">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {purchaseOrders.links && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{purchaseOrders.from}</span> to{' '}
                                    <span className="font-medium">{purchaseOrders.to}</span> of{' '}
                                    <span className="font-medium">{purchaseOrders.total}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {purchaseOrders.links.map((link, index) => (
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
