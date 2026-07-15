import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function OrdersShow({ order }) {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [personnel, setPersonnel] = useState([]);
    const [loadingPersonnel, setLoadingPersonnel] = useState(false);

    // Reject form
    const { data, setData, post, processing } = useForm({
        rejection_reason: '',
    });

    // Status update form
    const { data: statusData, setData: setStatusData, post: updateStatus, processing: statusProcessing } = useForm({
        status: order.fulfillment_status,
        notes: '',
    });

    // Personnel assignment form
    const { data: assignData, setData: setAssignData, post: assignPersonnel, processing: assignProcessing } = useForm({
        personnel_id: order.delivery_personnel_id || '',
    });

    // Fetch delivery personnel on mount
    useEffect(() => {
        setLoadingPersonnel(true);
        axios.get(route('admin.users.drivers'))
            .then(res => setPersonnel(res.data))
            .catch(() => toast.error('Failed to load delivery personnel.'))
            .finally(() => setLoadingPersonnel(false));
    }, []);

    // Handlers
    const handleAccept = () => {
        if (!confirm('Accept this order?')) return;

        post(route('admin.orders.accept', order.id), {
            onSuccess: (response) => {
                const flash = response.props?.flash;
                if (flash?.error) {
                    toast.error(flash.error);
                    return;
                }
                if (flash?.success) {
                    toast.success(flash.success);
                }
                window.location.reload();
            },
            onError: (errors) => {
                toast.error(errors?.message || 'Failed to accept order.');
            },
        });
    };

    const handleStatusUpdate = (e) => {
        e.preventDefault();
        updateStatus(route('admin.orders.update-status', order.id), {
            onSuccess: () => {
                toast.success('Order status updated.');
                window.location.reload();
            },
            onError: (errors) => {
                toast.error(errors?.message || 'Failed to update status.');
            },
        });
    };

    const handleAssignPersonnel = (e) => {
        e.preventDefault();
        assignPersonnel(route('admin.orders.assign-personnel', order.id), {
            onSuccess: () => {
                toast.success('Delivery personnel assigned.');
                window.location.reload();
            },
            onError: (errors) => {
                toast.error(errors?.message || 'Failed to assign personnel.');
            },
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        post(route('admin.orders.reject', order.id), {
            data: data,
            onSuccess: () => {
                setShowRejectModal(false);
                toast.success('Order rejected.');
                window.location.reload();
            },
            onError: (errors) => {
                toast.error(errors?.message || 'Failed to reject order.');
            },
        });
    };

    // Status colors
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStatusColors = {
        awaiting_downpayment: 'bg-yellow-100 text-yellow-800',
        downpayment_paid: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    // Check if status can be changed
    const isLocked = ['cancelled', 'delivered'].includes(order.fulfillment_status);
    const canAssignPersonnel = order.fulfillment_status === 'processing';
    const hasPersonnel = !!order.delivery_personnel_id;

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                    <Link href={route('admin.orders.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back to Orders
                    </Link>
                </div>

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium">{order.user?.name}</p>
                            <p className="text-sm text-gray-400">{order.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">{order.contact_number}</p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.fulfillment_status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.fulfillment_status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
                                {order.payment_status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium capitalize">{order.payment_method}</p>
                        </div>
                    </div>
                    {hasPersonnel && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Delivery Personnel</p>
                            <p className="font-medium">{order.delivery_personnel?.name}</p>
                        </div>
                    )}
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Recipient</p>
                            <p className="font-medium">{order.recipient_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Contact</p>
                            <p className="font-medium">{order.contact_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium">
                                {order.street_address}<br />
                                {order.barangay}, {order.city}<br />
                                {order.province} {order.postal_code}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {item.variant?.product?.image ? (
                                        <img
                                            src={`/storage/${item.variant.product.image}`}
                                            alt={item.variant.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{item.variant?.product?.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.variant?.wood_type}
                                        {item.variant?.finish && ` · ${item.variant.finish}`}
                                        {item.variant?.dimensions && ` · ${item.variant.dimensions}`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} × ₱{item.price}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">₱{item.subtotal}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between gap-8">
                                <span className="text-gray-500">Subtotal</span>
                                <span>₱{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between gap-8">
                                <span className="text-gray-500">Shipping Fee</span>
                                <span>₱{order.shipping_fee}</span>
                            </div>
                            <div className="flex justify-between gap-8 font-bold text-lg border-t border-gray-200 pt-2">
                                <span>Total</span>
                                <span>₱{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proof of Delivery */}
                {order.proof_of_delivery && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Proof of Delivery</h2>
                        <a
                            href={`/storage/${order.proof_of_delivery}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                        >
                            View Proof of Delivery
                        </a>
                    </div>
                )}

                {/* Status Update Form */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Order Status</h2>
                    <form onSubmit={handleStatusUpdate} className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700">New Status</label>
                            <select
                                value={statusData.status}
                                onChange={(e) => setStatusData('status', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                disabled={isLocked}
                            >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                            <input
                                type="text"
                                value={statusData.notes}
                                onChange={(e) => setStatusData('notes', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder="Add a note..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={statusProcessing || isLocked}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                        >
                            Update Status
                        </button>
                    </form>
                    {isLocked && (
                        <p className="mt-2 text-sm text-gray-500">
                            This order is {order.fulfillment_status} and its status cannot be changed.
                        </p>
                    )}
                </div>

                {/* Personnel Assignment */}
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Personnel</h2>
                    {canAssignPersonnel || hasPersonnel ? (
                        <form onSubmit={handleAssignPersonnel} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700">Select Personnel</label>
                                {loadingPersonnel ? (
                                    <p className="text-sm text-gray-500 mt-1">Loading...</p>
                                ) : (
                                    <select
                                        value={assignData.personnel_id}
                                        onChange={(e) => setAssignData('personnel_id', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        disabled={!canAssignPersonnel}
                                    >
                                        <option value="">Select a personnel</option>
                                        {personnel.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.email})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={assignProcessing || !canAssignPersonnel || loadingPersonnel}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                            >
                                {hasPersonnel ? 'Update Personnel' : 'Assign Personnel'}
                            </button>
                        </form>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Personnel can only be assigned when order is in Processing status.
                        </p>
                    )}
                    {hasPersonnel && (
                        <div className="mt-2 text-sm text-green-600">
                            Assigned to: <strong>{order.delivery_personnel?.name}</strong>
                        </div>
                    )}
                </div>

                {/* Actions (pending) */}
                {order.fulfillment_status === 'pending' && (
                    <div className="flex gap-4">
                        <button
                            onClick={handleAccept}
                            disabled={processing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Accept Order
                        </button>
                        <button
                            onClick={() => setShowRejectModal(true)}
                            disabled={processing}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            Reject Order
                        </button>
                    </div>
                )}

                {order.fulfillment_status === 'processing' && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-700">Order has been accepted and is being processed. Assign delivery personnel to proceed.</p>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowRejectModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Order</h3>
                        <form onSubmit={handleReject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Reason (optional)</label>
                                <textarea
                                    value={data.rejection_reason}
                                    onChange={(e) => setData('rejection_reason', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    placeholder="Why are you rejecting this order?"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRejectModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    Reject Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
