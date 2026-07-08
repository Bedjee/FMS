import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';

export default function RawMaterialShow({ material }) {
    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Raw Material Entry #{material.id}</h1>
                    <Link href={route('admin.raw-materials.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Wood Type</p>
                            <p className="font-medium">{material.wood_type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Board Feet</p>
                            <p className="font-medium">{material.board_feet} BF</p>
                        </div>
                        <div>
    <p className="text-sm text-gray-500">Dimensions</p>
    <p className="font-medium">
        {material.thickness > 0 && material.width > 0 && material.length > 0
            ? `${material.thickness}" x ${material.width}" x ${material.length}'`
            : '—'}
    </p>
</div>
                        <div>
                            <p className="text-sm text-gray-500">Delivery Date</p>
                            <p className="font-medium">{material.delivery_date}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Supplier</p>
                            <p className="font-medium">{material.supplier?.name || '—'}</p>
                            {material.supplier && (
                                <p className="text-xs text-gray-400">{material.supplier.contact_person} • {material.supplier.phone}</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Purchase Order</p>
                            {material.purchase_order ? (
                                <Link href={route('manager.purchase-orders.show', material.purchase_order.id)} className="text-blue-600 hover:text-blue-800">
                                    {material.purchase_order.po_number}
                                </Link>
                            ) : (
                                <p className="font-medium">—</p>
                            )}
                        </div>
                        <div className="col-span-2">
                            <p className="text-sm text-gray-500">Material Request</p>
                            {material.material_request ? (
                                <Link href={route('admin.material-requests.show', material.material_request.id)} className="text-blue-600 hover:text-blue-800">
                                    {material.material_request.request_number}
                                </Link>
                            ) : (
                                <p className="font-medium">—</p>
                            )}
                        </div>
                        {material.remarks && (
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500">Remarks</p>
                                <p className="text-gray-700">{material.remarks}</p>
                            </div>
                        )}
                    </div>

                    {material.receipt_path && (
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500">Receipt</p>
                            <a href={`/storage/${material.receipt_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                View Receipt
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
