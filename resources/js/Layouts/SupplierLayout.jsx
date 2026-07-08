import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ShoppingBagIcon,
    DocumentArrowUpIcon,
    CubeIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

export default function SupplierLayout({ children }) {
    const { auth, flash } = usePage().props; // <-- add flash
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const colors = {
        purple: '#8B5CF6',
        darkPurple: '#7C3AED',
        veryDarkPurple: '#6D28D9',
        white: '#FFFFFF',
    };

    const navigation = [
        { name: 'Dashboard', href: route('supplier.dashboard'), icon: HomeIcon },
        { name: 'Materials', href: route('supplier.materials.index'), icon: CubeIcon },
        { name: 'Purchase Orders', href: route('supplier.purchase-orders.index'), icon: ShoppingBagIcon },
        // future links...
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ backgroundColor: colors.purple }}
            >
                <div className="flex h-16 items-center justify-center border-b border-white/20">
                    <h1 className="text-xl font-bold text-white">FurnitureMES</h1>
                    <p className="ml-2 text-xs text-white/70">Supplier</p>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = route().current(item.href.split('/').pop());
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2 text-white/80 transition hover:bg-white/10 hover:text-white ${
                                    isActive ? 'bg-white/10 text-white' : ''
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full border-t border-white/20 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-white/70">{user?.email}</p>
                        </div>
                        <Link href={route('logout')} method="post" as="button" className="text-white/70 hover:text-white">
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </aside>

            <div className="lg:ml-64">
                <header className="sticky top-0 z-10 shadow-sm border-b bg-white border-gray-200">
                    <div className="flex items-center justify-between px-6 py-3">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <svg className="h-6 w-6" style={{ color: colors.purple }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">Supplier Portal</h2>
                        <div className="w-6 lg:hidden" />
                    </div>
                </header>

                <main className="p-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 rounded-lg bg-green-50 p-4 border border-green-200 text-green-700 flex items-center gap-2">
                            <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-4 border border-red-200 text-red-700 flex items-center gap-2">
                            <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.error}
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
