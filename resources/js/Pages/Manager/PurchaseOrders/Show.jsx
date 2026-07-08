import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';

export default function PurchaseOrderShow({ purchaseOrder }) {
    const handleDownloadPdf = () => {
        // Open the PDF route in a new tab to trigger download
        window.open(route('manager.purchase-orders.pdf', purchaseOrder.id), '_blank');
    };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        confirmed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        delivered: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const total = purchaseOrder.items.reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0);

    return (
        <ManagerLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Purchase Order #{purchaseOrder.po_number}</h1>
                    <div className="flex space-x-3">
                        <button
                            onClick={handleDownloadPdf}
                            className="inline-flex items-center px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </button>
                        <Link href={route('manager.purchase-orders.index')} className="text-slate-600 hover:text-slate-800">
                            ← Back
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* ... same content as before ... */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{purchaseOrder.order_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[purchaseOrder.status] || 'bg-gray-100 text-gray-800'}`}>
                                {purchaseOrder.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Expected Delivery</p>
                            <p className="font-medium">{purchaseOrder.expected_delivery || 'Not set'}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500">Supplier</p>
                            <p className="font-medium">{purchaseOrder.supplier?.name}</p>
                            <p className="text-xs text-gray-400">{purchaseOrder.supplier?.contact_person} • {purchaseOrder.supplier?.phone}</p>
                            <p className="text-xs text-gray-400">{purchaseOrder.supplier?.address}</p>
                        </div>
                        {purchaseOrder.notes && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-700">{purchaseOrder.notes}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ordered Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {purchaseOrder.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.material?.name || item.wood_type || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{item.material?.unit || 'BF'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">₱{item.unit_price}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">₱{item.line_total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="4" className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">Total:</td>
                                        <td className="px-4 py-2 text-sm font-bold text-gray-900">₱{total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
