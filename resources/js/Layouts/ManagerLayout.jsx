import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ChartBarIcon,
    CubeIcon,
    ShoppingCartIcon,
    ClipboardDocumentListIcon,
    WrenchScrewdriverIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
} from '@heroicons/react/24/outline';

export default function ManagerLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Colors matching the welcome page
    const colors = {
        mediumBrown: '#A0522D',
        darkBrown: '#5C3A21',
        veryDarkBrown: '#2E1B0F',
        offWhite: '#FAF7F2',
        lightBrown: '#D2B48C',
    };

    const navigation = [
        { name: 'Dashboard', href: route('manager.dashboard'), icon: HomeIcon },
        { name: 'Material Requests', href: route('manager.material-requests.index'), icon: ClipboardDocumentListIcon },
        { name: 'Raw Materials', href: route('manager.raw-materials.index'), icon: CubeIcon },
        { name: 'Purchase Orders', href: route('manager.purchase-orders.index'), icon: ShoppingCartIcon },
        // { name: 'Products', href: route('manager.products.index'), icon: ClipboardDocumentListIcon },
        // { name: 'Work Orders', href: route('manager.work-orders.index'), icon: WrenchScrewdriverIcon },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.offWhite }}>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar with dark brown background and white text */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ backgroundColor: colors.darkBrown }}
            >
                <div className="flex h-16 items-center justify-center border-b border-white/20">
                    <h1 className="text-xl font-bold text-white">FurnitureMES</h1>
                    <p className="ml-2 text-xs text-white/70">Manager</p>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = route().current(
                            item.href.split('/').pop()
                        );
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
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-white/70 hover:text-white"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Top header – light background with brown accents */}
                <header
                    className="sticky top-0 z-10 shadow-sm border-b"
                    style={{ backgroundColor: colors.white, borderBottomColor: colors.lightBrown + '40' }}
                >
                    <div className="flex items-center justify-between px-6 py-3">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <svg className="h-6 w-6" style={{ color: colors.darkBrown }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold" style={{ color: colors.veryDarkBrown }}>
                            Manager Portal
                        </h2>
                        <div className="w-6 lg:hidden" />
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
