import ManagerLayout from '@/Layouts/ManagerLayout';
import { useForm, Link } from '@inertiajs/react';

export default function ManagerMaterialRequestShow({ request }) {
    const approveForm = useForm({ notes: '' });
    const rejectForm = useForm({ rejection_reason: '' });

    const handleApprove = (e) => {
        e.preventDefault();
        approveForm.post(route('manager.material-requests.approve', request.id));
    };

    const handleReject = (e) => {
        e.preventDefault();
        rejectForm.post(route('manager.material-requests.reject', request.id));
    };

    // Calculate total from items
    const total = request.items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        return sum + (qty * price);
    }, 0);

    return (
        <ManagerLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Request #{request.request_number}</h1>
                    <Link href={route('manager.material-requests.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
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
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                request.status === 'ordered' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {request.status}
                            </span>
                        </div>
                        {request.notes && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-700">{request.notes}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Requested Items</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
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
                                                <td className="px-4 py-2 text-sm text-gray-900 capitalize">{item.item_type}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {item.item_type === 'wood' ? item.wood_type : item.description || '-'}
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
                                        <td colSpan="5" className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">Total Estimated Amount:</td>
                                        <td className="px-4 py-2 text-sm font-bold text-gray-900">₱{total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {request.status === 'pending' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                            <form onSubmit={handleApprove} className="space-y-3">
                                <h3 className="font-medium text-green-700">Approve Request</h3>
                                <textarea
                                    value={approveForm.data.notes}
                                    onChange={(e) => approveForm.setData('notes', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                                    rows="2"
                                    placeholder="Optional approval notes"
                                />
                                <button
                                    type="submit"
                                    disabled={approveForm.processing}
                                    className="w-full bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 disabled:opacity-50"
                                >
                                    Approve & Review Order
                                </button>
                            </form>

                            <form onSubmit={handleReject} className="space-y-3">
                                <h3 className="font-medium text-red-700">Reject Request</h3>
                                <textarea
                                    value={rejectForm.data.rejection_reason}
                                    onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                    rows="2"
                                    placeholder="Reason for rejection *"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={rejectForm.processing}
                                    className="w-full bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </form>
                        </div>
                    )}

                    {request.status === 'rejected' && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700"><strong>Rejection Reason:</strong> {request.rejection_reason}</p>
                        </div>
                    )}

                    {request.status === 'approved' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-700">
                                <strong>Approved.</strong> Proceed to purchase order preview to confirm.
                            </p>
                            <Link
                                href={route('manager.material-requests.preview', request.id)}
                                className="mt-3 inline-block bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
                            >
                                Review Purchase Order
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
