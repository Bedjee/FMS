import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState,useEffect  } from 'react';
import { CubeIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function CreateProduct({ finishes, woodTypes, materials, stockData }) {


     // Add this at the top of the component
    console.log('🟢 CreateProduct props:', { finishes, woodTypes, materials, stockData });

    useEffect(() => {
        console.log('📦 Materials:', materials);
        console.log('📊 StockData:', stockData);
    }, [materials, stockData]);




    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        dimensions: '',
        sku: '',
        base_price: '',
        is_active: true,
        image: null,
        variant_wood_type: 'Mahogany',
        variant_finish: '',
        variant_dimensions: '',
        variant_price: '',
        variant_stock: '',
        bom_items: [],
    });

    const [preview, setPreview] = useState(null);
    const [bomForm, setBomForm] = useState({
        material_id: '',
        quantity: '',
        unit: '',
        notes: '',
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreview(null);
        const fileInput = document.getElementById('image-input');
        if (fileInput) fileInput.value = '';
    };

    // Helper to get stock (same as Edit)
    const getStock = (materialName) => {
        if (!materialName) return 0;
        const normalized = materialName.toLowerCase().trim();

        // 1. Exact match
        if (stockData[normalized] !== undefined) {
            return stockData[normalized];
        }

        // 2. Partial match
        for (const key in stockData) {
            if (normalized.includes(key) || key.includes(normalized)) {
                return stockData[key];
            }
        }

        return 0;
    };


    const addBomItem = () => {
        if (!bomForm.material_id || !bomForm.quantity) {
            toast.error('Please select a material and enter quantity.');
            return;
        }
        const selectedMaterial = materials.find(m => m.id == bomForm.material_id);
        setData('bom_items', [
            ...data.bom_items,
            {
                material_id: bomForm.material_id,
                quantity: parseFloat(bomForm.quantity),
                unit: selectedMaterial ? selectedMaterial.unit : bomForm.unit,
                notes: bomForm.notes,
            }
        ]);
        setBomForm({ material_id: '', quantity: '', unit: '', notes: '' });
    };

    const removeBomItem = (index) => {
        const newItems = data.bom_items.filter((_, i) => i !== index);
        setData('bom_items', newItems);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.products.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto py-6">
                <div className="mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <CubeIcon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Create a new product with its first variant and BOM.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">SKU *</label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    required
                                />
                                {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="2"
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dimensions</label>
                            <input
                                type="text"
                                value={data.dimensions}
                                onChange={(e) => setData('dimensions', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder="e.g. 48 x 30 x 36 inches"
                            />
                            {errors.dimensions && <p className="mt-1 text-sm text-red-600">{errors.dimensions}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Base Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    required
                                />
                                {errors.base_price && <p className="mt-1 text-sm text-red-600">{errors.base_price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                                        <span className="text-sm text-gray-600">Choose Image</span>
                                        <input
                                            id="image-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    {preview && (
                                        <div className="relative">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            </div>
                        </div>

                        {/* Initial Variant */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Initial Variant</h3>
                            <p className="text-xs text-gray-500 mb-4">Set up the first variant for this product.</p>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Wood Type</label>
                                    <select
                                        value={data.variant_wood_type}
                                        onChange={(e) => setData('variant_wood_type', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    >
                                        {woodTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Finish</label>
                                    <select
                                        value={data.variant_finish}
                                        onChange={(e) => setData('variant_finish', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    >
                                        <option value="">None</option>
                                        {finishes.map((finish) => (
                                            <option key={finish} value={finish}>{finish}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Dimensions (optional)</label>
                                    <input
                                        type="text"
                                        value={data.variant_dimensions}
                                        onChange={(e) => setData('variant_dimensions', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. 48 x 30 x 36 in"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Variant Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.variant_price}
                                        onChange={(e) => setData('variant_price', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. 1500.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Initial Stock</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.variant_stock}
                                        onChange={(e) => setData('variant_stock', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* BOM Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Bill of Materials (BOM)</h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Define the raw materials required to produce one unit of this product.
                                These materials will be deducted from inventory upon product creation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Material</label>
                                    <select
                                        value={bomForm.material_id}
                                        onChange={(e) => {
                                            const materialId = e.target.value;
                                            const selectedMaterial = materials.find(m => m.id == materialId);
                                            setBomForm({
                                                ...bomForm,
                                                material_id: materialId,
                                                unit: selectedMaterial ? selectedMaterial.unit : '',
                                            });
                                        }}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    >
                                        <option value="">Select material</option>
                                        {materials.map(material => {
                                            const stock = getStock(material.name);
                                            return (
                                                <option key={material.id} value={material.id}>
                                                    {material.name} ({material.unit}) – Available: {stock.toFixed(2)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={bomForm.quantity}
                                        onChange={(e) => setBomForm({ ...bomForm, quantity: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Unit (auto-filled)</label>
                                    <input
                                        type="text"
                                        value={bomForm.unit}
                                        className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-100 text-gray-500"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Notes (optional)</label>
                                    <input
                                        type="text"
                                        value={bomForm.notes}
                                        onChange={(e) => setBomForm({ ...bomForm, notes: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. For legs"
                                    />
                                </div>
                            </div>

                            {/* Stock info and warning (same as Edit) */}
                            {bomForm.material_id && (
                                <div className="mb-3">
                                    {(() => {
                                        const selectedMaterial = materials.find(m => m.id == bomForm.material_id);
                                        const stock = selectedMaterial ? getStock(selectedMaterial.name) : 0;
                                        const quantity = parseFloat(bomForm.quantity) || 0;
                                        const isOver = quantity > stock;

                                        return (
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-600">
                                                    Available: <strong>{stock.toFixed(2)}</strong> {selectedMaterial?.unit || ''}
                                                </span>
                                                {quantity > 0 && (
                                                    <span className={isOver ? 'text-red-600 font-semibold' : 'text-green-600'}>
                                                        {isOver ? (
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                Exceeds available stock!
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                Within available stock
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={addBomItem}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-600 text-white rounded-lg hover:bg-slate-700 text-sm"
                            >
                                <PlusIcon className="h-4 w-4" /> Add BOM Item
                            </button>

                            {data.bom_items.length > 0 && (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Material</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Unit</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Notes</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.bom_items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">
                                                        {materials.find(m => m.id == item.material_id)?.name || '—'}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{item.unit || '—'}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-500">{item.notes || '—'}</td>
                                                    <td className="px-4 py-2 text-sm">
                                                        <button onClick={() => removeBomItem(idx)} className="text-red-600 hover:text-red-800">Remove</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Product is active</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                        <Link
                            href={route('admin.products.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 disabled:opacity-50 transition"
                        >
                            {processing ? 'Creating...' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
