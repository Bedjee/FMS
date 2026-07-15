import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function EditProduct({ product, finishes, woodTypes, materials, stockData }) {
    // ----- Product Form -----
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description || '',
        dimensions: product.dimensions || '',
        sku: product.sku,
        base_price: product.base_price,
        is_active: product.is_active,
        image: product.image || null,
    });

    // ----- Image Handling -----
    const [imagePreview, setImagePreview] = useState(
        product.image ? `/storage/${product.image}` : null
    );
    const [imageFile, setImageFile] = useState(null);
    const [removeImage, setRemoveImage] = useState(false);

    // ----- Variant Form -----
    const [variantForm, setVariantForm] = useState({
        wood_type: 'Mahogany',
        finish: '',
        dimensions: '',
        price: '',
        stock_quantity: '',
        low_stock_threshold: 5,
    });
    const [editingVariantId, setEditingVariantId] = useState(null);

    // ----- BOM Form -----
    const [bomForm, setBomForm] = useState({
        material_id: '',
        quantity: '',
        unit: '',
        notes: '',
    });
    const [editingBomId, setEditingBomId] = useState(null);

    // Helper to get stock for a material (smart matching)
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

    // ----- Image Handlers -----
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setRemoveImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(product.image ? `/storage/${product.image}` : null);
        }
    };

    const handleRemoveImage = () => {
        setRemoveImage(true);
        setImagePreview(null);
        setImageFile(null);
        const fileInput = document.getElementById('edit-image-input');
        if (fileInput) fileInput.value = '';
    };

    // ----- Product Handlers -----
    const submitProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('dimensions', data.dimensions);
        formData.append('sku', data.sku);
        formData.append('base_price', data.base_price);
        formData.append('is_active', data.is_active ? '1' : '0');
        if (imageFile) {
            formData.append('image', imageFile);
        }
        if (removeImage) {
            formData.append('remove_image', '1');
        }

        router.post(route('admin.products.update', product.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                // Flash message is handled by useFlashToasts in layout
                // No need to reload manually; Inertia handles the redirect
            },
        });
    };

    // ----- Variant Handlers -----
    const handleVariantSubmit = (e) => {
        e.preventDefault();
        if (editingVariantId) {
            router.put(
                route('admin.products.variants.update', [product.id, editingVariantId]),
                variantForm,
                { onSuccess: resetVariantForm }
            );
        } else {
            router.post(
                route('admin.products.variants.store', product.id),
                variantForm,
                { onSuccess: resetVariantForm }
            );
        }
    };

    const resetVariantForm = () => {
        setVariantForm({
            wood_type: 'Mahogany',
            finish: '',
            dimensions: '',
            price: '',
            stock_quantity: '',
            low_stock_threshold: 5,
        });
        setEditingVariantId(null);
    };

    const editVariant = (variant) => {
        setVariantForm({
            wood_type: variant.wood_type,
            finish: variant.finish || '',
            dimensions: variant.dimensions || '',
            price: variant.price,
            stock_quantity: variant.stock_quantity,
            low_stock_threshold: variant.low_stock_threshold || 5,
        });
        setEditingVariantId(variant.id);
    };

    const deleteVariant = (id) => {
        if (confirm('Remove this variant?')) {
            router.delete(route('admin.products.variants.destroy', [product.id, id]));
        }
    };

    // ----- BOM Handlers -----
    const handleBomSubmit = (e) => {
        e.preventDefault();
        if (editingBomId) {
            router.put(
                route('admin.products.bom.update', [product.id, editingBomId]),
                bomForm,
                { onSuccess: resetBomForm }
            );
        } else {
            router.post(
                route('admin.products.bom.store', product.id),
                bomForm,
                { onSuccess: resetBomForm }
            );
        }
    };

    const resetBomForm = () => {
        setBomForm({
            material_id: '',
            quantity: '',
            unit: '',
            notes: '',
        });
        setEditingBomId(null);
    };

    const editBom = (bom) => {
        setBomForm({
            material_id: bom.material_id,
            quantity: bom.quantity,
            unit: bom.unit || '',
            notes: bom.notes || '',
        });
        setEditingBomId(bom.id);
    };

    const deleteBom = (id) => {
        if (confirm('Remove this BOM item?')) {
            router.delete(route('admin.products.bom.destroy', [product.id, id]));
        }
    };

    // Calculate total BOM cost (optional)
    const calculateTotalBomCost = () => {
        let total = 0;
        product.bom_items.forEach(item => {
            if (item.material) {
                total += item.quantity * (item.material.price || 0);
            }
        });
        return total;
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto py-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Edit Product: {product.name}</h1>
                    <Link href={route('admin.products.index')} className="text-slate-600 hover:text-slate-800">
                        ← Back
                    </Link>
                </div>

                {/* Product Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Information</h2>
                    <form onSubmit={submitProduct} className="space-y-4">
                        {/* ... existing product fields (unchanged) ... */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
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
                                <label className="block text-sm font-medium text-gray-700">SKU <span className="text-red-500">*</span></label>
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
                                rows="3"
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
                                <label className="block text-sm font-medium text-gray-700">Base Price <span className="text-red-500">*</span></label>
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
                                <label className="block text-sm font-medium text-gray-700">Active</label>
                                <div className="mt-1.5">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-gray-300 text-slate-600 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Active (visible in catalog)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Image</label>
                            <div className="mt-1 flex items-center gap-4">
                                <label className="cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition">
                                    <span className="text-sm text-gray-600">
                                        {imagePreview ? 'Change Image' : 'Choose Image'}
                                    </span>
                                    <input
                                        id="edit-image-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                {imagePreview && (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Product"
                                            className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                                        >
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                {product.image && !removeImage && !imageFile && (
                                    <span className="text-xs text-gray-400">Current image will be kept unless removed.</span>
                                )}
                            </div>
                            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                            <p className="mt-1 text-xs text-gray-400">Max file size: 2MB. Supported formats: JPG, PNG, GIF, WEBP.</p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition"
                            >
                                {processing ? 'Saving...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Variants */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Product Variants</h2>
                    <form onSubmit={handleVariantSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                        {/* ... variant form fields (unchanged) ... */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Wood Type</label>
                            <select
                                value={variantForm.wood_type}
                                onChange={(e) => setVariantForm({ ...variantForm, wood_type: e.target.value })}
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
                                value={variantForm.finish}
                                onChange={(e) => setVariantForm({ ...variantForm, finish: e.target.value })}
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
                                value={variantForm.dimensions}
                                onChange={(e) => setVariantForm({ ...variantForm, dimensions: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder="e.g. 48 x 30 x 36 in"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Price</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={variantForm.price}
                                onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Stock</label>
                            <input
                                type="number"
                                min="0"
                                value={variantForm.stock_quantity}
                                onChange={(e) => setVariantForm({ ...variantForm, stock_quantity: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                required
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                            >
                                {editingVariantId ? 'Update' : 'Add'} Variant
                            </button>
                        </div>
                    </form>

                    {product.variants.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Wood</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Finish</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dimensions</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Stock</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {product.variants.map((variant) => (
                                        <tr key={variant.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{variant.wood_type}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{variant.finish || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{variant.dimensions || '—'}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">₱{variant.price}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{variant.stock_quantity}</td>
                                            <td className="px-4 py-2 text-sm space-x-2">
                                                <button onClick={() => editVariant(variant)} className="text-slate-600 hover:text-slate-800">Edit</button>
                                                <button onClick={() => deleteVariant(variant.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No variants added yet.</p>
                    )}
                </div>

                {/* BOM */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Bill of Materials (BOM)</h2>
                    <p className="text-sm text-gray-500 mb-4">Define the raw materials required to produce one unit of this product.</p>

                    <form onSubmit={handleBomSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        {/* ... BOM form fields (unchanged) ... */}
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
                            <label className="block text-xs font-medium text-gray-500">
                                Quantity {bomForm.unit ? `(${bomForm.unit})` : ''}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={bomForm.quantity}
                                onChange={(e) => setBomForm({ ...bomForm, quantity: e.target.value })}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder="0.00"
                                required
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
                    </form>

                    {/* Stock info and warning */}
                    {bomForm.material_id && (
                        <div className="mb-4">
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

                    <div className="mb-4">
                        {editingBomId ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleBomSubmit}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 mr-2 transition"
                                >
                                    Update BOM Item
                                </button>
                                <button
                                    type="button"
                                    onClick={resetBomForm}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={handleBomSubmit}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                            >
                                <PlusIcon className="h-4 w-4" /> Add BOM Item
                            </button>
                        )}
                    </div>

                    {product.bom_items.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
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
                                        {product.bom_items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.material?.name || '—'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.unit || '—'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-500">{item.notes || '—'}</td>
                                                <td className="px-4 py-2 text-sm space-x-2">
                                                    <button onClick={() => editBom(item)} className="text-slate-600 hover:text-slate-800">Edit</button>
                                                    <button onClick={() => deleteBom(item.id)} className="text-red-600 hover:text-red-800">Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 bg-slate-50 p-3 rounded-lg text-sm text-slate-700">
                                Estimated Total Material Cost per Unit: ₱{calculateTotalBomCost().toFixed(2)}
                                <span className="ml-2 text-xs text-slate-400">(based on supplier prices)</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">No BOM items added yet.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
