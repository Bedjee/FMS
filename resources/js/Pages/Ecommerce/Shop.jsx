import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Box, ShoppingCart, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Shop({ products }) {
    const { auth } = usePage().props;
    const user = auth?.user ?? null;

    console.log('🔍 Auth user:', user);

    const [filter, setFilter] = useState('all');
    const [selectedVariants, setSelectedVariants] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [loadingItem, setLoadingItem] = useState(null);

    // Fetch cart count on mount
    useEffect(() => {
        if (user) {
            axios.get(route('customer.cart.count'))
                .then(res => setCartCount(res.data.count || 0))
                .catch(() => {});
        }
    }, [user]);

    const getDashboardRoute = () => {
        if (!user) return '#';
        if (user.roles && user.roles.length > 0) {
            const role = user.roles[0];
            const routeMap = {
                'Owner': 'owner.dashboard',
                'Admin': 'admin.dashboard',
                'Manager': 'manager.dashboard',
                'Supplier': 'supplier.dashboard',
                'Skiller': 'skiller.dashboard',
                'Carpenter': 'carpenter.dashboard',
                'Delivery Driver': 'driver.dashboard',
                'Customer': 'customer.dashboard',
            };
            return routeMap[role] || 'customer.dashboard';
        }
        return 'customer.dashboard';
    };

    const handleVariantChange = (productId, variantId) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variantId }));
    };

    const getSelectedVariant = (product) => {
        const id = selectedVariants[product.id];
        if (id) {
            return product.variants.find(v => v.id === id) || product.variants[0];
        }
        return product.variants?.[0];
    };

    const handleAddToCart = async (product, e) => {
        e.stopPropagation();
        if (!user) {
            setSelectedProduct(product);
            setShowLoginModal(true);
            return;
        }

        const variant = getSelectedVariant(product);
        if (!variant) {
            toast.error('This product has no variants available.');
            return;
        }

        setLoadingItem(product.id);
        try {
            const response = await axios.post(route('customer.cart.add'), {
                variant_id: variant.id,
                quantity: 1,
            });
            if (response.data.success) {
                toast.success(`🛒 "${product.name}" (${variant.wood_type}${variant.finish ? `, ${variant.finish}` : ''}) added to cart!`);
                setCartCount(prev => prev + 1);
            }
        } catch (error) {
            toast.error('Failed to add item to cart.');
            console.error(error);
        } finally {
            setLoadingItem(null);
        }
    };

    if (!products) {
        return (
            <>
                <Head title="Shop" />
                <div className="min-h-screen bg-[#F7F4EF] py-12">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold text-[#2F1B12]">No products</h1>
                    </div>
                </div>
            </>
        );
    }

    if (products.data.length === 0) {
        return (
            <>
                <Head title="Shop" />
                <div className="min-h-screen bg-[#F7F4EF] py-12">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold text-[#2F1B12]">No products available</h1>
                    </div>
                </div>
            </>
        );
    }

    // Extract unique wood types for filters
    const woodTypes = ['all', ...new Set(
        products.data.flatMap(p => p.variants ? p.variants.map(v => v.wood_type) : [])
    )];

    const filteredProducts = filter === 'all'
        ? products.data
        : products.data.filter(p =>
            p.variants && p.variants.some(v => v.wood_type === filter)
        );

    return (
        <>
            <Head title="Our Collection" />

            <div className="min-h-screen bg-[#F7F4EF] font-sans">
                {/* Navbar – same as before */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5E3C] to-[#5C4033] rounded-xl blur-md opacity-60 group-hover:opacity-100 transition" />
                                    <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#C89F6A] to-[#8B5E3C] flex items-center justify-center shadow-lg">
                                        <Box className="h-5 w-5 text-white" strokeWidth={2} />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-[#2F1B12] tracking-tight">FurnitureMES</h1>
                                    <p className="text-xs text-[#5C4033] -mt-0.5">Manufacturing Excellence</p>
                                </div>
                            </Link>

                            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#5C4033]">
                                <Link href="/" className="hover:text-[#8B5E3C] transition">Home</Link>
                                <Link href="/shop" className="text-[#8B5E3C] font-semibold">Shop</Link>
                                <Link href="#about" className="hover:text-[#8B5E3C] transition">About</Link>
                                <Link href="#contact" className="hover:text-[#8B5E3C] transition">Contact</Link>
                            </div>

                            <div className="flex items-center gap-3">
                                {user ? (
                                    <>
                                        <Link
                                            href={route(getDashboardRoute())}
                                            className="px-5 py-2 rounded-full bg-[#2F1B12] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition flex items-center gap-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href={route('customer.cart')}
                                            className="relative p-2 rounded-full hover:bg-[#C89F6A]/10 transition"
                                        >
                                            <ShoppingCart className="h-5 w-5 text-[#2F1B12]" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#8B5E3C] text-[10px] font-bold text-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="px-5 py-2 rounded-full bg-[#2F1B12] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Header */}
                <div className="pt-28 md:pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F7F4EF] to-white">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#2F1B12] tracking-tight">
                            Our Collection
                        </h1>
                        <p className="mt-2 text-lg text-[#5C4033]/80 max-w-2xl">
                            Handcrafted furniture made from premium Mahogany and Gemelina wood.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Filters */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        {woodTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 text-sm rounded-full border transition ${
                                    filter === type
                                        ? 'bg-[#2F1B12] text-white border-[#2F1B12]'
                                        : 'bg-white text-[#5C4033] border-[#C89F6A]/40 hover:bg-[#C89F6A]/10'
                                }`}
                            >
                                {type === 'all' ? 'All' : type}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const selectedVariant = getSelectedVariant(product);
                            const variantPrice = selectedVariant?.price || product.base_price;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-[#C89F6A]/20 overflow-hidden"
                                >
                                    {/* Image */}
                                    <div className="aspect-square bg-[#F7F4EF] flex items-center justify-center overflow-hidden">
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[#F7F4EF] flex items-center justify-center text-[#C89F6A]/50">
                                                <Box className="w-16 h-16" strokeWidth={1} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-[#2F1B12] truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-[#5C4033]/70 mt-1">SKU: {product.sku}</p>

                                        {/* Variant Selector */}
                                        {product.variants && product.variants.length > 1 && (
                                            <div className="mt-2">
                                                <label className="block text-xs font-medium text-[#5C4033] mb-1">Select Variant</label>
                                                <select
                                                    value={selectedVariant?.id || ''}
                                                    onChange={(e) => handleVariantChange(product.id, parseInt(e.target.value))}
                                                    className="w-full rounded-lg border-[#C89F6A]/40 text-sm px-3 py-1.5 focus:border-[#8B5E3C] focus:ring-[#8B5E3C]"
                                                >
                                                    {product.variants.map((variant) => (
                                                        <option key={variant.id} value={variant.id}>
                                                            {variant.wood_type}
                                                            {variant.finish && ` (${variant.finish})`}
                                                            {variant.dimensions && ` · ${variant.dimensions}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <p className="text-2xl font-bold text-[#8B5E3C] mt-2">
                                            ₱{variantPrice}
                                        </p>

                                        {/* Variant Summary (if only one variant) */}
                                        {product.variants && product.variants.length === 1 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                                {product.variants.map((variant) => (
                                                    <span
                                                        key={variant.id}
                                                        className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-[#C89F6A]/10 text-[#5C4033] border border-[#C89F6A]/20"
                                                    >
                                                        {variant.wood_type}
                                                        {variant.finish && ` (${variant.finish})`}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <Link
                                                href={route('shop.product', product.id)}
                                                className="flex-1 text-center bg-[#2F1B12] text-white py-2.5 rounded-full hover:bg-[#5C4033] transition duration-200 font-medium text-sm"
                                            >
                                                View Details
                                            </Link>
                                            <button
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className={`px-4 py-2.5 rounded-full bg-[#C89F6A] text-[#2F1B12] hover:bg-[#8B5E3C] hover:text-white transition duration-200 flex items-center justify-center gap-1 font-medium text-sm ${
                                                    loadingItem === product.id ? 'opacity-50 cursor-wait' : ''
                                                }`}
                                                disabled={loadingItem === product.id}
                                            >
                                                {loadingItem === product.id ? (
                                                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#2F1B12] border-t-transparent" />
                                                ) : (
                                                    <ShoppingCart className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[#5C4033]">No products match the selected filter.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {products.links && (
                        <div className="mt-8 flex justify-center">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`mx-1 px-3 py-1 rounded ${
                                        link.active
                                            ? 'bg-[#2F1B12] text-white'
                                            : 'bg-white text-[#5C4033] border border-[#C89F6A]/40 hover:bg-[#C89F6A]/10'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer id="contact" className="bg-[#2F1B12] text-[#C89F6A]/70 py-12 px-4 sm:px-6 lg:px-8 mt-12">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="h-10 w-10 rounded-xl bg-[#C89F6A]/20 flex items-center justify-center">
                                    <Box className="h-5 w-5 text-[#C89F6A]" />
                                </div>
                                <span className="text-lg font-bold text-white">FurnitureMES</span>
                            </Link>
                            <p className="mt-4 text-sm">Manufacturing Excellence</p>
                            <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                                <li><Link href="/shop" className="hover:text-white transition">Shop</Link></li>
                                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <p className="text-sm">support@furnituremes.com</p>
                            <p className="text-sm mt-1">+1 (555) 000-0000</p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Login Required Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-[#5C4033]/60 hover:text-[#2F1B12] transition">
                            <X className="h-5 w-5" />
                        </button>
                        <div className="w-16 h-16 rounded-full bg-[#C89F6A]/20 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-8 w-8 text-[#8B5E3C]" />
                        </div>
                        <h3 className="text-2xl font-bold text-center text-[#2F1B12]">Login Required</h3>
                        <p className="mt-2 text-center text-[#5C4033]/80">
                            To add items to your cart and proceed to checkout, please log in to your account.
                        </p>
                        {selectedProduct && (
                            <p className="mt-1 text-center text-sm text-[#5C4033]/60">
                                "{selectedProduct.name}" will be added after you log in.
                            </p>
                        )}
                        <div className="mt-6 flex flex-col gap-3">
                            <Link href={route('login')} className="w-full text-center bg-[#2F1B12] text-white py-2.5 rounded-full hover:bg-[#5C4033] transition font-medium">Log In</Link>
                            <Link href={route('register')} className="w-full text-center border border-[#C89F6A]/40 text-[#2F1B12] py-2.5 rounded-full hover:bg-[#F7F4EF] transition font-medium">Create Account</Link>
                            <button onClick={() => setShowLoginModal(false)} className="w-full text-center text-[#5C4033]/70 hover:text-[#2F1B12] transition font-medium text-sm">Continue Browsing</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
