import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CreateMaterialRequest({ suppliers }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        request_date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [{ material_id: '', quantity: '', unit_price: 0 }],
    });

    const [availableMaterials, setAvailableMaterials] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    useEffect(() => {
        if (data.supplier_id) {
            fetchMaterials(data.supplier_id);
        } else {
            setAvailableMaterials([]);
            setData('items', [{ material_id: '', quantity: '', unit_price: 0 }]);
        }
    }, [data.supplier_id]);

    const fetchMaterials = async (supplierId) => {
        setLoadingMaterials(true);
        try {
            const response = await axios.get(
                route('admin.material-requests.get-supplier-materials'),
                { params: { supplier_id: supplierId } }
            );
            setAvailableMaterials(response.data);
            setData('items', [{ material_id: '', quantity: '', unit_price: 0 }]);
        } catch (error) {
            console.error('Failed to load materials', error);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const addItem = () => {
        setData('items', [...data.items, { material_id: '', quantity: '', unit_price: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleItemChange = (index, field, value) => {
        const updated = data.items.map((item, i) => {
            if (i === index) {
                // If material_id changes, fetch its price from availableMaterials
                if (field === 'material_id') {
                    const material = availableMaterials.find(m => m.id == value);
                    const unitPrice = material?.price || 0;
                    return {
                        ...item,
                        material_id: value,
                        unit_price: unitPrice,
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setData('items', updated);
    };

    const getSubtotal = (item) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unit_price) || 0;
        return qty * price;
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.material-requests.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Material Request</h1>

                <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                    {/* Supplier Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Supplier <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={data.supplier_id}
                            onChange={(e) => setData('supplier_id', e.target.value)}
                            className="mt-1 block w-full max-w-sm rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            required
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name} ({supplier.category || 'General'})
                                </option>
                            ))}
                        </select>
                        {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                    </div>

                    {/* Request Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Request Date</label>
                        <input
                            type="date"
                            value={data.request_date}
                            onChange={(e) => setData('request_date', e.target.value)}
                            className="mt-1 block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            required
                        />
                        {errors.request_date && <p className="mt-1 text-sm text-red-600">{errors.request_date}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            rows="3"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            placeholder="Any additional notes..."
                        />
                        {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
                    </div>

                    {/* Items */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Items</h2>
                            {data.supplier_id && (
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    + Add Item
                                </button>
                            )}
                        </div>

                        {!data.supplier_id ? (
                            <p className="text-sm text-gray-500">Please select a supplier first.</p>
                        ) : loadingMaterials ? (
                            <p className="text-sm text-gray-500">Loading materials...</p>
                        ) : availableMaterials.length === 0 ? (
                            <p className="text-sm text-amber-600">No materials available for this supplier.</p>
                        ) : (
                            data.items.map((item, index) => {
                                const subtotal = getSubtotal(item);
                                return (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500">Material <span className="text-red-500">*</span></label>
                                                <select
                                                    value={item.material_id}
                                                    onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                    required
                                                >
                                                    <option value="">Select material</option>
                                                    {availableMaterials.map((material) => (
                                                        <option key={material.id} value={material.id}>
                                                            {material.name} ({material.unit})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500">Quantity <span className="text-red-500">*</span></label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500">Unit Price (₱) – Read‑only</label>
                                                <input
                                                    type="text"
                                                    value={item.unit_price ? parseFloat(item.unit_price).toFixed(2) : '0.00'}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-700"
                                                    disabled
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500">Subtotal (₱)</label>
                                                <input
                                                    type="text"
                                                    value={subtotal.toFixed(2)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-700 font-semibold"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="mt-2 text-sm text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                        {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="submit"
                            disabled={processing || !data.supplier_id || data.items.some(item => !item.material_id || !item.quantity)}
                            className="rounded-lg bg-slate-700 px-6 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
