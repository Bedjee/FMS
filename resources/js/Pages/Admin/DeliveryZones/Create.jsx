import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        fee: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.delivery-zones.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Delivery Zone</h1>
                <form onSubmit={submit} className="bg-white rounded-lg shadow border border-gray-200 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Zone Name</label>
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
                        <label className="block text-sm font-medium text-gray-700">Delivery Fee</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.fee}
                            onChange={(e) => setData('fee', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
                            required
                        />
                        {errors.fee && <p className="mt-1 text-sm text-red-600">{errors.fee}</p>}
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-slate-600 focus:ring-slate-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Active</span>
                        </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <Link href={route('admin.delivery-zones.index')} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</Link>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">Save</button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
