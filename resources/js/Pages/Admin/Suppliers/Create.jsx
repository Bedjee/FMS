import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function CreateSupplier() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        category: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.suppliers.store'));
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl mx-auto py-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <BuildingOfficeIcon className="h-6 w-6 text-slate-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Supplier</h1>
                            <p className="text-sm text-gray-500 mt-0.5">Enter supplier details and assign a category</p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Supplier Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                        placeholder="e.g., Wood Suppliers Inc."
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contact Person <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                        placeholder="e.g., John Doe"
                                        required
                                    />
                                    {errors.contact_person && <p className="mt-1 text-sm text-red-600">{errors.contact_person}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                        placeholder="supplier@example.com"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>


                                <div>
    <label className="block text-sm font-medium text-gray-700">Password (optional, default: 'password')</label>
    <input
        type="password"
        value={data.password}
        onChange={(e) => setData('password', e.target.value)}
        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500"
        placeholder="Leave blank for default password"
    />
    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
</div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                        placeholder="+63 912 345 6789"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows="2"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                    placeholder="123 Main St, City, Country"
                                    required
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">Supplier Category</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1 block w-full max-w-xs rounded-lg border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 transition"
                                    required
                                >
                                    <option value="">Select category</option>
                                    <option value="Wood">Wood</option>
                                    <option value="Varnish">Varnish</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                        <Link
                            href={route('admin.suppliers.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition"
                        >
                            {processing ? 'Saving...' : 'Add Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
