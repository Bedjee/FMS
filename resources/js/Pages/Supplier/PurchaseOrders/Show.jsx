import SupplierLayout from '@/Layouts/SupplierLayout';
import { Link, router } from '@inertiajs/react';

export default function PurchaseOrderShow({ purchaseOrder }) {
    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        confirmed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        delivered: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const total = purchaseOrder.items.reduce((sum, item) => sum + parseFloat(item.line_total || 0), 0);
    const canConfirm = purchaseOrder.can_confirm;

    const handleConfirm = () => {
        if (confirm('Confirm this purchase order?')) {
            router.post(route('supplier.purchase-orders.update-status', purchaseOrder.id), {
                status: 'confirmed',
            });
        }
    };

    const handleReject = () => {
        if (confirm('Reject this purchase order?')) {
            router.post(route('supplier.purchase-orders.update-status', purchaseOrder.id), {
                status: 'rejected',
            });
        }
    };

    return (
        <SupplierLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Purchase Order #{purchaseOrder.po_number}</h1>
                    <Link href={route('supplier.purchase-orders.index')} className="text-purple-600 hover:text-purple-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
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
                        <div>
                            <p className="text-sm text-gray-500">Created By</p>
                            <p className="font-medium">{purchaseOrder.creator?.name}</p>
                        </div>
                        {purchaseOrder.notes && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Notes</p>
                                <p className="text-gray-700">{purchaseOrder.notes}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Items</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Qty</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Available Stock</th>
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
                                            <td className="px-4 py-2 text-sm text-gray-500">
                                                {item.material ? (
                                                    <span className={item.material.stock_quantity >= item.quantity ? 'text-green-600' : 'text-red-600'}>
                                                        {item.material.stock_quantity} {item.material.unit}
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td colSpan="5" className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">Total:</td>
                                        <td className="px-4 py-2 text-sm font-bold text-gray-900">₱{total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {purchaseOrder.status === 'sent' && (
                        <div className="flex flex-col gap-4 pt-4 border-t border-gray-200">
                            {canConfirm ? (
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleConfirm}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Confirm Order
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject Order
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-700 flex-1">
                                        <strong>⚠️ Insufficient Stock</strong>
                                        <p className="text-sm mt-1">Please restock your materials before confirming this order.</p>
                                    </div>
                                    <button
                                        onClick={handleReject}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject Order
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {purchaseOrder.status === 'confirmed' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-700">
                            <strong>Order Confirmed.</strong> You have confirmed this purchase order. Stock has been deducted.
                        </div>
                    )}

                    {purchaseOrder.status === 'rejected' && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-red-700">
                            <strong>Order Rejected.</strong> You have rejected this purchase order.
                        </div>
                    )}
                </div>
            </div>
        </SupplierLayout>
    );
}
