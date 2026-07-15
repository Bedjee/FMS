import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function MarkAsDeliveredModal({ isOpen, onClose, request, onSuccess }) {
    const [calculatedBF, setCalculatedBF] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const expectedQuantity = request.items.reduce((sum, item) => {
        return sum + (parseFloat(item.quantity) || 0);
    }, 0);

    const unit = request.items[0]?.unit || 'BF';

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const { data, setData, reset, errors } = useForm({
        thickness: '',
        width: '',
        length: '',
        quantity: '',
        dimensions_unknown: false,
    });

    useEffect(() => {
        if (isOpen) {
            reset();
            setCalculatedBF(0);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const t = parseFloat(data.thickness) || 0;
        const w = parseFloat(data.width) || 0;
        const l = parseFloat(data.length) || 0;
        const qty = parseFloat(data.quantity) || 0;
        if (t > 0 && w > 0 && l > 0 && qty > 0) {
            const bf = (t * w * l) / 12 * qty;
            setCalculatedBF(bf);
        } else {
            setCalculatedBF(0);
        }
    }, [data.thickness, data.width, data.length, data.quantity]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Convert empty values to 0 for submission
        const thickness = data.dimensions_unknown ? 0 : parseFloat(data.thickness) || 0;
        const width = data.dimensions_unknown ? 0 : parseFloat(data.width) || 0;
        const length = data.dimensions_unknown ? 0 : parseFloat(data.length) || 0;
        const quantity = parseFloat(data.quantity) || 0;

        if (quantity <= 0) {
            toast.error('Please enter a valid quantity.');
            return;
        }

        const payload = {
            dimensions_unknown: data.dimensions_unknown,
            thickness: thickness,
            width: width,
            length: length,
            quantity: quantity,
        };

        setIsSubmitting(true);

        router.post(route('admin.material-requests.mark-delivered', request.id), payload, {
            onSuccess: () => {
                onClose();
                reset();
                toast.success(' Stock entry recorded successfully.', { duration: 3000 });
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 1500);
                setIsSubmitting(false);
            },
            onError: (error) => {
                toast.error(' Failed to record stock entry. Please try again.', { duration: 4000 });
                console.error(error);
                setIsSubmitting(false);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Mark as Delivered
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    Record the received materials. Dimensions are optional – leave blank for non‑wood materials.
                </p>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                        <strong>📋 Expected Quantity:</strong> {expectedQuantity} {unit}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="dimensions_unknown"
                            checked={data.dimensions_unknown}
                            onChange={(e) => setData('dimensions_unknown', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                        />
                        <label htmlFor="dimensions_unknown" className="ml-2 text-sm text-gray-700">
                            I don't have exact dimensions (enter total {unit} directly)
                        </label>
                    </div>

                    {!data.dimensions_unknown ? (
                        <>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Thickness (in) <span className="text-gray-400">(optional)</span></label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        min="0"
                                        value={data.thickness}
                                        onChange={(e) => setData('thickness', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. 2"
                                    />
                                    {errors.thickness && <p className="mt-1 text-xs text-red-600">{errors.thickness}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Width (in) <span className="text-gray-400">(optional)</span></label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        min="0"
                                        value={data.width}
                                        onChange={(e) => setData('width', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. 4"
                                    />
                                    {errors.width && <p className="mt-1 text-xs text-red-600">{errors.width}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Length (ft) <span className="text-gray-400">(optional)</span></label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        value={data.length}
                                        onChange={(e) => setData('length', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                        placeholder="e.g. 8"
                                    />
                                    {errors.length && <p className="mt-1 text-xs text-red-600">{errors.length}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-500">Received Quantity (pieces)</label>
                                <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                    placeholder="Enter number of pieces received"
                                    required={!data.dimensions_unknown}
                                />
                                {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
                            </div>

                            {calculatedBF > 0 && (
                                <div className="rounded-lg bg-slate-50 p-3 text-center border border-slate-200">
                                    <p className="text-sm text-slate-600">
                                        Total Board Feet: <span className="font-bold text-slate-900">{calculatedBF.toFixed(2)} BF</span>
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Calculated from {data.quantity || 0} piece(s) of {data.thickness || 0}×{data.width || 0}×{data.length || 0}
                                    </p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div>
                            <label className="block text-xs font-medium text-gray-500">Total Received ({unit})</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                                placeholder={`Enter total ${unit} received`}
                                required={data.dimensions_unknown}
                            />
                            {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
                        </div>
                    )}
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Processing...' : 'Confirm Delivery'}
                    </button>
                </div>
            </div>
        </div>
    );
}
