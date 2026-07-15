import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ShoppingBagIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function CustomerLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (user) {
            axios.get(route('customer.cart.count'))
                .then(res => setCartCount(res.data.count || 0))
                .catch(() => {});
        }
    }, [user]);

    const navigation = [
        { name: 'Dashboard', href: route('customer.dashboard'), icon: HomeIcon },
        { name: 'My Orders', href: route('customer.orders'), icon: ShoppingBagIcon },
        { name: 'Profile', href: route('profile.edit'), icon: UserIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-amber-800">FurnitureMES</Link>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Shop Button */}
                            <Link
                                href={route('shop')}
                                className="text-sm font-medium text-gray-700 hover:text-amber-800 transition"
                            >
                                Shop
                            </Link>

                            {/* Cart Icon */}
                            <Link
                                href={route('customer.cart')}
                                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <ShoppingCartIcon className="h-5 w-5 text-gray-700" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            <span className="text-sm text-gray-700">{user?.name}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Logout
                            </Link>
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
