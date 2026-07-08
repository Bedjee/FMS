import ManagerLayout from '@/Layouts/ManagerLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Preview({ request, suppliers }) {
    const [selectedSupplierId, setSelectedSupplierId] = useState(request.supplier_id || '');
    const [materials, setMaterials] = useState([]);
    const [items, setItems] = useState([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: request.supplier_id || '',
        expected_delivery: '',
        notes: '',
        items: [],
    });

    // Load materials when supplier changes
    useEffect(() => {
        if (selectedSupplierId) {
            fetchMaterials(selectedSupplierId);
        }
    }, [selectedSupplierId]);

    const fetchMaterials = async (supplierId) => {
        setLoadingMaterials(true);
        try {
            const response = await axios.get(route('manager.material-requests.get-supplier-materials'), {
                params: { supplier_id: supplierId }
            });
            setMaterials(response.data);
            // Initialize items from request items if available, else map from materials
            if (request.items && request.items.length > 0) {
                // Map request items to preview items
                const previewItems = request.items.map((reqItem) => {
                    // Find matching material (by description/name if possible)
                    const matched = response.data.find(m =>
                        m.name.toLowerCase().includes(reqItem.description?.toLowerCase() || '')
                    );
                    return {
                        material_id: matched?.id || '',
                        quantity: reqItem.quantity,
                        unit_price: matched?.price || 0,
                        unit: reqItem.unit || 'BF',
                        description: reqItem.description || reqItem.wood_type || '',
                        item_type: reqItem.item_type,
                    };
                });
                setItems(previewItems);
            } else {
                // Empty items list, user can add from materials
                setItems([]);
            }
        } catch (error) {
            console.error('Failed to load materials', error);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const addItem = () => {
        setItems([...items, { material_id: '', quantity: '', unit_price: '', unit: 'BF', description: '' }]);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const updated = items.map((item, i) => {
            if (i === index) {
                // If material_id changes, update price and unit from materials
                if (field === 'material_id') {
                    const material = materials.find(m => m.id == value);
                    return {
                        ...item,
                        material_id: value,
                        unit_price: material?.price || 0,
                        unit: material?.unit || 'BF',
                        description: material?.name || ''
                    };
                }
                return { ...item, [field]: value };
            }
            return item;
        });
        setItems(updated);
    };

    const updateForm = () => {
        setData('supplier_id', selectedSupplierId);
        setData('items', items.map(item => ({
            material_id: item.material_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            unit: item.unit,
            description: item.description,
        })));
    };

    const submit = (e) => {
        e.preventDefault();
        updateForm();
        post(route('manager.material-requests.confirm-purchase-order', request.id));
    };

    const total = items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);

    return (
        <ManagerLayout>
            <div className="max-w-6xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Purchase Order Preview</h1>
                    <Link href={route('manager.material-requests.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Request Info */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-700">Request #{request.request_number}</h2>
                        <p className="text-sm text-gray-500">Submitted by {request.admin?.name} on {request.request_date}</p>
                        {request.notes && <p className="mt-1 text-sm text-gray-600">Notes: {request.notes}</p>}
                    </div>

                    <form onSubmit={submit}>
                        {/* Supplier (readonly) */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Supplier</label>
                            <div className="mt-1 text-sm text-gray-900 font-medium">
                                {request.supplier?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                                {request.supplier?.contact_person} • {request.supplier?.phone}
                            </div>
                            <input type="hidden" value={selectedSupplierId} />
                        </div>

                        {/* Expected Delivery */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Expected Delivery</label>
                            <input
                                type="date"
                                value={data.expected_delivery}
                                onChange={(e) => setData('expected_delivery', e.target.value)}
                                className="mt-1 block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            />
                        </div>

                        {/* Items */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">Items</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm text-slate-600 hover:text-slate-800 font-medium"
                                >
                                    + Add Item
                                </button>
                            </div>

                            {loadingMaterials ? (
                                <p className="text-gray-500">Loading materials...</p>
                            ) : (
                                <>
                                    {items.map((item, index) => (
                                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Material</label>
                                                    <select
                                                        value={item.material_id}
                                                        onChange={(e) => handleItemChange(index, 'material_id', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                    >
                                                        <option value="">Select material</option>
                                                        {materials.map((material) => (
                                                            <option key={material.id} value={material.id}>
                                                                {material.name} (₱{material.price}/{material.unit})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Quantity</label>
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
                                                    <label className="block text-xs font-medium text-gray-500">Unit Price</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.unit_price}
                                                        onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Unit</label>
                                                    <input
                                                        type="text"
                                                        value={item.unit}
                                                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <label className="block text-xs font-medium text-gray-500">Description</label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                                    placeholder="Material description"
                                                />
                                            </div>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}
                            {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}
                        </div>

                        {/* Notes */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700">Order Notes (Optional)</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows="2"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder="Any notes for the supplier"
                            />
                        </div>

                        {/* Summary */}
                        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                            <div className="text-lg font-bold text-gray-900">
                                Total Estimate: ₱{total.toFixed(2)}
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    href={route('manager.material-requests.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || items.length === 0}
                                    className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Confirm Purchase Order'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </ManagerLayout>
    );
}
