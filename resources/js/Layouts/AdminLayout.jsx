import { useState } from 'react';
import { useFlashToasts } from '@/hooks/useFlashToasts';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    UsersIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    ClipboardDocumentListIcon,
    CubeIcon,
    TruckIcon,
    ShoppingBagIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({ children }) {
    useFlashToasts();
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openGroups, setOpenGroups] = useState({
        masterData: true,
        inventory: true,
        operations: true,
    });

    const toggleGroup = (group) => {
        setOpenGroups((prev) => ({
            ...prev,
            [group]: !prev[group],
        }));
    };

    const colors = {
        slate: '#64748B',
        darkSlate: '#475569',
        veryDarkSlate: '#334155',
        white: '#FFFFFF',
    };

    const navigationGroups = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            items: [
                { name: 'Dashboard', href: route('admin.dashboard'), icon: HomeIcon },
            ],
            isSingle: true,
        },
        {
            id: 'masterData',
            label: 'Master Data',
            icon: Cog6ToothIcon,
            items: [
                { name: 'Users', href: route('admin.users.index'), icon: UsersIcon },
                { name: 'Suppliers', href: route('admin.suppliers.index'), icon: UsersIcon },
                { name: 'Products', href: route('admin.products.index'), icon: ClipboardDocumentListIcon },
                { name: 'Delivery Zones', href: route('admin.delivery-zones.index'), icon: TruckIcon },
            ],
        },
        {
            id: 'inventory',
            label: 'Inventory',
            icon: CubeIcon,
            items: [
                { name: 'Material Inventory', href: route('admin.material-inventory.index'), icon: CubeIcon },
                { name: 'Raw Materials', href: route('admin.raw-materials.index'), icon: CubeIcon },
                { name: 'Product Inventory', href: route('admin.inventory.index'), icon: CubeIcon },
            ],
        },
        {
            id: 'operations',
            label: 'Operations',
            icon: ClipboardDocumentListIcon,
            items: [
                { name: 'Material Requests', href: route('admin.material-requests.index'), icon: ClipboardDocumentListIcon },
                { name: 'Orders', href: route('admin.orders.index'), icon: ShoppingBagIcon },
            ],
        },
    ];

    // Check if any item in a group is active
    const isGroupActive = (groupItems) => {
        return groupItems.some((item) => {
            const routeName = item.href.split('/').pop();
            return route().current(routeName);
        });
    };

    const isItemActive = (href) => {
        const routeName = href.split('/').pop();
        return route().current(routeName);
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.white }}>
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 transform shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ backgroundColor: colors.slate }}
            >
                <div className="flex h-16 items-center justify-center border-b border-white/20">
                    <h1 className="text-xl font-bold text-white">FurnitureMES</h1>
                    <p className="ml-2 text-xs text-white/70">Admin</p>
                </div>

                <nav className="mt-4 px-3 pb-4 overflow-y-auto h-[calc(100vh-4rem)]">
                    {navigationGroups.map((group) => {
                        const isActive = isGroupActive(group.items);
                        const isOpen = group.isSingle ? true : openGroups[group.id];

                        if (group.isSingle) {
                            const item = group.items[0];
                            const Icon = item.icon;
                            return (
                                <div key={group.id} className="mb-1">
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            isActive
                                                ? 'bg-white/10 text-white'
                                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                </div>
                            );
                        }

                        const GroupIcon = group.icon;
                        return (
                            <div key={group.id} className="mb-2">
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
                                >
                                    <span className="flex items-center gap-2">
                                        <GroupIcon className="h-4 w-4" />
                                        {group.label}
                                    </span>
                                    {isOpen ? (
                                        <ChevronDownIcon className="h-4 w-4" />
                                    ) : (
                                        <ChevronRightIcon className="h-4 w-4" />
                                    )}
                                </button>

                                {/* Group Items */}
                                <div
                                    className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    {group.items.map((item) => {
                                        const active = isItemActive(item.href);
                                        const ItemIcon = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                                                    active
                                                        ? 'bg-white/10 text-white'
                                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                <ItemIcon className="h-4 w-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* User Profile */}
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

            {/* Main content */}
            <div className="lg:ml-64">
                <header className="sticky top-0 z-10 shadow-sm border-b bg-white border-gray-200">
                    <div className="flex items-center justify-between px-6 py-3">
                        <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <svg className="h-6 w-6" style={{ color: colors.slate }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">Admin Portal</h2>
                        <div className="w-6 lg:hidden" />
                    </div>
                </header>
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
