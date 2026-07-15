import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { HomeIcon, TruckIcon, UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DriverLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('driver.dashboard'), icon: HomeIcon },
        { name: 'My Deliveries', href: route('driver.orders.index'), icon: TruckIcon },
        { name: 'Profile', href: route('profile.edit'), icon: UserIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-amber-800">FurnitureMES</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-700">{user?.name}</span>
                            <Link href={route('logout')} method="post" as="button" className="text-sm text-red-600 hover:text-red-800">Logout</Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="md:col-span-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
