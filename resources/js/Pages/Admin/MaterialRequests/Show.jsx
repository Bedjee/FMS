import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import MarkAsDeliveredModal from '../../../Components/MarkAsDeliveredModal';

export default function MaterialRequestShow({ request }) {
    const [showModal, setShowModal] = useState(false);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        ordered: 'bg-blue-100 text-blue-800',
        delivered: 'bg-purple-100 text-purple-800',
    };

    const poStatusColors = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        confirmed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        delivered: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const total = request.items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        return sum + (qty * price);
    }, 0);

    // Show the button only if request is 'ordered' and has a purchase order
    const showMarkDelivered = request.status === 'ordered' && request.purchase_order_id;

    // Debug logging to console
    console.log('Request data:', request);
    console.log('showMarkDelivered:', showMarkDelivered);
    console.log('Status:', request.status, 'PO ID:', request.purchase_order_id);

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Request #{request.request_number}</h1>
                    <Link href={route('admin.material-requests.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Request Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{request.request_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Admin</p>
                            <p className="font-medium">{request.admin?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Supplier</p>
                            <p className="font-medium">{request.supplier?.name || '—'}</p>
                            {request.supplier && (
                                <p className="text-xs text-gray-400">{request.supplier.contact_person} • {request.supplier.phone}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Request Status</p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${statusColors[request.status] || 'bg-gray-100 text-gray-800'}`}>
                                {request.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">PO Status</p>
                            {request.purchase_order ? (
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${poStatusColors[request.purchase_order.status] || 'bg-gray-100 text-gray-800'}`}>
                                    {request.purchase_order.status}
                                </span>
                            ) : (
                                <p className="font-medium">—</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Purchase Order</p>
                            {request.purchase_order ? (
                                <Link href={route('manager.purchase-orders.show', request.purchase_order.id)} className="text-blue-600 hover:text-blue-800">
                                    {request.purchase_order.po_number}
                                </Link>
                            ) : (
                                <p className="font-medium">—</p>
                            )}
                        </div>
                        {request.notes && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-700">{request.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Items Table */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Requested Items</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {request.items.map((item, idx) => {
                                        const qty = parseFloat(item.quantity) || 0;
                                        const price = parseFloat(item.unit_price) || 0;
                                        const subtotal = qty * price;
                                        return (
                                            <tr key={idx}>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {item.description || item.wood_type || '—'}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {price > 0 ? `₱${price.toFixed(2)}` : '—'}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{qty}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.unit}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {subtotal > 0 ? `₱${subtotal.toFixed(2)}` : '₱0.00'}
                                                </td>
                                            </tr>
                                        );
                                    })}
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



                    {/* Action: Mark as Delivered */}
                    {showMarkDelivered && (
                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                Mark as Delivered
                            </button>
                            <p className="mt-2 text-sm text-gray-500">
                                This will create stock-in entries and update the raw materials inventory.
                            </p>
                        </div>
                    )}

                    {request.status === 'delivered' && (
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm text-purple-700">
                                <strong>Delivered.</strong> Stock-in entries have been created.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <MarkAsDeliveredModal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    request={request}
    onSuccess={() => window.location.reload()}
/>
        </AdminLayout>
    );
}
