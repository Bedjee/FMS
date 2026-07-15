import ManagerLayout from '@/Layouts/ManagerLayout';
import { Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
    ClockIcon,
    CubeIcon,
} from '@heroicons/react/24/outline';

export default function Transactions({ variant, transactions }) {
    const transactionTypes = {
        stock_in: { label: 'Stock In', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircleIcon },
        stock_out: { label: 'Stock Out', color: 'bg-rose-100 text-rose-700', icon: XCircleIcon },
        adjustment: { label: 'Adjustment', color: 'bg-amber-100 text-amber-700', icon: ArrowPathIcon },
    };

    // Helper to format reference
    const formatReference = (tx) => {
        if (!tx.reference_type) return '—';
        const type = tx.reference_type.replace('_', ' ').toUpperCase();
        return `${type} #${tx.reference_id}`;
    };

    // Format date to a readable string
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Calculate previous stock
    const getPreviousStock = (tx) => {
        return tx.type === 'stock_in'
            ? tx.balance_after - tx.quantity
            : tx.balance_after + tx.quantity;
    };

    // Current stock (from the variant)
    const currentStock = variant.stock_quantity || 0;

    return (
        <ManagerLayout>
            <div className="space-y-6">
                {/* Header with back button */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('manager.inventory.index')}
                            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back
                        </Link>
                        <div className="h-6 w-px bg-slate-200" />
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                {variant.product?.name}
                            </h1>
                            <p className="text-sm text-slate-500">
                                {variant.wood_type}
                                {variant.finish && ` · ${variant.finish}`}
                                {variant.dimensions && ` · ${variant.dimensions}`}
                            </p>
                        </div>
                    </div>
                    {/* Stock badge */}
                    <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                        <CubeIcon className="h-4 w-4 text-slate-500" />
                        Current Stock: <span className="font-bold text-slate-900">{currentStock}</span>
                    </div>
                </div>

                {/* Transaction table card */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Previous
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Current
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Performed By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-sm text-slate-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <ClockIcon className="h-8 w-8 text-slate-300" />
                                                <span>No transactions recorded for this variant.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((tx) => {
                                        const typeInfo = transactionTypes[tx.type] || {
                                            label: tx.type,
                                            color: 'bg-slate-100 text-slate-700',
                                            icon: null,
                                        };
                                        const IconComponent = typeInfo.icon;

                                        return (
                                            <tr
                                                key={tx.id}
                                                className="transition hover:bg-slate-50/50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                    {formatDate(tx.created_at)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${typeInfo.color}`}
                                                    >
                                                        {IconComponent && (
                                                            <IconComponent className="h-3.5 w-3.5" />
                                                        )}
                                                        {typeInfo.label}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                                                    {tx.quantity}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                    {getPreviousStock(tx)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700">
                                                    {tx.balance_after}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                    {tx.performer?.name ?? 'System'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-500">
                                                    {tx.notes || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination – with clean styling */}
                    {transactions.links && transactions.from !== undefined && (
                        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-sm text-slate-600">
                                    Showing <span className="font-medium">{transactions.from}</span> to{' '}
                                    <span className="font-medium">{transactions.to}</span> of{' '}
                                    <span className="font-medium">{transactions.total}</span> results
                                </p>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                    {transactions.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                link.active
                                                    ? 'z-10 bg-slate-600 text-white focus:z-20'
                                                    : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20'
                                            } ${!link.url ? 'pointer-events-none bg-slate-100 text-slate-400' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ManagerLayout>
    );
}
