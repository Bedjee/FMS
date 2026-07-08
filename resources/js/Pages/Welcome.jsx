import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Box,
    Package,
    Settings,
    Truck,
    BarChart3,
    Users,
    ShoppingCart,
    Clock,
    CheckCircle,
    ArrowRight,
    Star,
    Zap,
    TrendingUp,
    Shield,
    Layers,
    Gauge,
    Calendar,
    MapPin,
    Phone,
    Mail,


    ChevronRight,
    Home,
    Info,
    MessageCircle,
    LogIn,
    UserPlus,
    Gift,
    Sparkles,
    ClipboardList,
    Warehouse,
    Factory,
    Award,
    Target,
    Eye,
    PieChart,
    LineChart,
    Activity,
    Megaphone,
    Laptop,
    Monitor,
} from 'lucide-react';

// Custom hook for scroll-triggered animations
const useOnScreen = (ref, threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref, threshold]);
    return isVisible;
};

export default function Welcome({ auth }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Refs for animation sections
    const heroRef = useRef(null);
    const workflowRef = useRef(null);
    const featuresRef = useRef(null);
    const whyRef = useRef(null);
    const dashboardPreviewRef = useRef(null);
    const testimonialsRef = useRef(null);
    const ctaRef = useRef(null);

    const isHeroVisible = useOnScreen(heroRef, 0.2);
    const isWorkflowVisible = useOnScreen(workflowRef, 0.2);
    const isFeaturesVisible = useOnScreen(featuresRef, 0.2);
    const isWhyVisible = useOnScreen(whyRef, 0.2);
    const isDashboardVisible = useOnScreen(dashboardPreviewRef, 0.2);
    const isTestimonialsVisible = useOnScreen(testimonialsRef, 0.2);
    const isCtaVisible = useOnScreen(ctaRef, 0.2);

    // Color palette (matching the spec)
    const colors = {
        darkWalnut: '#2F1B12',
        brown: '#5C4033',
        wood: '#8B5E3C',
        sand: '#C89F6A',
        cream: '#F7F4EF',
        white: '#FFFFFF',
    };

    // Feature data
    const features = [
        {
            icon: ClipboardList,
            title: 'Inventory Management',
            description: 'Track raw materials, work-in-progress, and finished goods with real-time updates.',
            link: '#',
        },
        {
            icon: Factory,
            title: 'Production Workflow',
            description: 'Optimize manufacturing processes with visual scheduling and task tracking.',
            link: '#',
        },
        {
            icon: Users,
            title: 'Supplier Management',
            description: 'Manage supplier relationships, purchase orders, and material sourcing efficiently.',
            link: '#',
        },
        {
            icon: ShoppingCart,
            title: 'Customer Orders',
            description: 'Handle custom and standard orders from inquiry to delivery with ease.',
            link: '#',
        },
        {
            icon: Truck,
            title: 'Delivery Tracking',
            description: 'Monitor shipments, manage logistics, and keep customers informed.',
            link: '#',
        },
        {
            icon: BarChart3,
            title: 'Reports & Analytics',
            description: 'Gain insights with interactive dashboards and detailed performance reports.',
            link: '#',
        },
    ];

    const whyChoose = [
        {
            icon: Gauge,
            title: 'Real-Time Inventory',
            description: 'Know your stock levels at a glance with live updates.',
        },
        {
            icon: Activity,
            title: 'Production Monitoring',
            description: 'Track every stage of manufacturing from start to finish.',
        },
        {
            icon: TrendingUp,
            title: 'Sales Analytics',
            description: 'Analyze sales trends and forecast demand accurately.',
        },
        {
            icon: MapPin,
            title: 'Delivery Tracking',
            description: 'End-to-end visibility for all your deliveries.',
        },
    ];

    const testimonials = [
        {
            quote: 'FurnitureMES transformed our entire production workflow. We now deliver faster and with fewer errors.',
            author: 'Maria Gonzalez',
            role: 'Operations Manager, WoodCraft Co.',
        },
        {
            quote: 'The real-time inventory tracking alone saved us 20% in material costs. Highly recommended!',
            author: 'James Chen',
            role: 'CEO, Urban Furnishings',
        },
        {
            quote: 'The dashboard provides clear insights that helped us scale from a small workshop to a full-fledged factory.',
            author: 'Aisha Patel',
            role: 'Founder, Artisan Woods',
        },
    ];

    return (
        <>
            <Head title="FurnitureMES - Smart Furniture Manufacturing" />

            <div className="min-h-screen bg-[#F7F4EF] font-sans overflow-x-hidden">

                {/* Floating background blur shapes */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 -left-20 w-72 h-72 bg-[#C89F6A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
                    <div className="absolute top-1/3 right-0 w-96 h-96 bg-[#8B5E3C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed" />
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#5C4033] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
                </div>

                {/* Navbar */}
                <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                    scrolled ? 'bg-white/80 backdrop-blur-xl shadow-xl border-b border-white/20' : 'bg-transparent'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5E3C] to-[#5C4033] rounded-xl blur-md opacity-60 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#C89F6A] to-[#8B5E3C] flex items-center justify-center shadow-lg">
                                        <Box className="h-5 w-5 text-white" strokeWidth={2} />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-[#2F1B12] tracking-tight">FurnitureMES</h1>
                                    <p className="text-xs text-[#5C4033] -mt-0.5">Manufacturing Excellence</p>
                                </div>
                            </Link>

                            {/* Center links - hidden on mobile */}
                            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#5C4033]">
                                <Link href="#features" className="hover:text-[#8B5E3C] transition">Features</Link>
                                <Link href="#workflow" className="hover:text-[#8B5E3C] transition">Workflow</Link>
                                <Link href="#why" className="hover:text-[#8B5E3C] transition">Why Choose</Link>
                                <Link href="#testimonials" className="hover:text-[#8B5E3C] transition">Testimonials</Link>
                                <Link href="#contact" className="hover:text-[#8B5E3C] transition">Contact</Link>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-3">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-5 py-2 rounded-full bg-[#2F1B12] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-200"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-4 py-2 text-sm font-medium text-[#5C4033] hover:text-[#2F1B12] transition"
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-5 py-2 rounded-full bg-[#2F1B12] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition duration-200"
                                        >
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section ref={heroRef} className="relative z-10 pt-28 md:pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left content */}
                            <div className={`space-y-6 transition-all duration-1000 transform ${isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C89F6A]/20 text-[#5C4033] text-xs font-semibold border border-[#C89F6A]/30">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Smart Manufacturing Platform
                                </span>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-[#2F1B12]">
                                    Complete Furniture
                                    <span className="block text-[#8B5E3C]">Manufacturing Management</span>
                                    in One Platform
                                </h1>
                                <p className="text-lg text-[#5C4033]/80 max-w-lg leading-relaxed">
                                    Manage inventory, production, suppliers, orders, deliveries, employees, and reports from one centralized platform.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#2F1B12] text-white font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#C89F6A]/40 bg-white/50 backdrop-blur-sm text-[#2F1B12] font-semibold hover:bg-white/80 hover:shadow-lg transition-all duration-200"
                                    >
                                        Learn More
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                                {/* Trust badges */}
                                <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-[#5C4033]">
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-[#8B5E3C]" />
                                        Inventory
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-[#8B5E3C]" />
                                        Production
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-[#8B5E3C]" />
                                        Orders
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-[#8B5E3C]" />
                                        Delivery
                                    </span>
                                </div>
                            </div>

                            {/* Right: Dashboard Mockup */}
                            <div className={`relative transition-all duration-1000 delay-300 transform ${isHeroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                {/* Laptop frame */}
                                <div className="relative mx-auto w-full max-w-2xl">
                                    {/* Screen */}
                                    <div className="relative rounded-2xl bg-[#2F1B12] shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
                                        {/* Top bezel */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-white/20 rounded-full mt-2" />
                                        <div className="p-4 bg-[#F7F4EF]">
                                            {/* Dashboard preview content */}
                                            <div className="bg-white rounded-xl shadow-inner p-4 space-y-4">
                                                {/* Top bar */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Box className="h-5 w-5 text-[#2F1B12]" />
                                                        <span className="text-xs font-bold text-[#2F1B12]">Dashboard</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <div className="w-2 h-2 rounded-full bg-[#8B5E3C]" />
                                                        <div className="w-2 h-2 rounded-full bg-[#C89F6A]" />
                                                        <div className="w-2 h-2 rounded-full bg-[#5C4033]" />
                                                    </div>
                                                </div>
                                                {/* Stats cards */}
                                                <div className="grid grid-cols-4 gap-2">
                                                    {['Orders', 'Revenue', 'Products', 'Suppliers'].map((label, i) => (
                                                        <div key={i} className="bg-[#F7F4EF] rounded-lg p-2 text-center">
                                                            <div className="text-xs text-[#5C4033]">{label}</div>
                                                            <div className="text-sm font-bold text-[#2F1B12]">{i === 0 ? '124' : i === 1 ? '₱45k' : i === 2 ? '89' : '12'}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {/* Chart and activity */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="col-span-2 bg-[#F7F4EF] rounded-lg p-3 h-20 flex items-center justify-center">
                                                        <LineChart className="h-8 w-8 text-[#8B5E3C]" />
                                                        <span className="text-xs ml-2 text-[#5C4033]">Inventory Trend</span>
                                                    </div>
                                                    <div className="bg-[#F7F4EF] rounded-lg p-3 h-20 flex flex-col items-center justify-center">
                                                        <PieChart className="h-6 w-6 text-[#8B5E3C]" />
                                                        <span className="text-xs text-[#5C4033] mt-1">Production</span>
                                                    </div>
                                                </div>
                                                {/* Recent orders */}
                                                <div className="bg-[#F7F4EF] rounded-lg p-2">
                                                    <div className="flex items-center justify-between text-xs text-[#5C4033] mb-1">
                                                        <span>Recent Orders</span>
                                                        <span className="text-[#8B5E3C]">View all</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {['#1234 - Table', '#1235 - Chair', '#1236 - Cabinet'].map((item, i) => (
                                                            <div key={i} className="flex items-center justify-between text-xs bg-white/50 rounded px-2 py-1">
                                                                <span>{item}</span>
                                                                <span className="text-[#8B5E3C]">●</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Bottom bezel */}
                                        <div className="h-2 bg-[#2F1B12]/80" />
                                    </div>
                                    {/* Base */}
                                    <div className="mx-auto w-3/4 h-2 bg-[#2F1B12]/60 rounded-b-xl shadow-xl" />
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Workflow Section */}
                <section id="workflow" ref={workflowRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-sm font-semibold text-[#8B5E3C] uppercase tracking-wider">Workflow</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2F1B12] mt-2">Streamlined Production Process</h2>
                            <p className="text-[#5C4033]/70 mt-4">From supplier to customer, manage every step seamlessly.</p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 transition-all duration-1000 transform ${isWorkflowVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {['Supplier', 'Raw Materials', 'Production', 'Quality Check', 'Warehouse', 'Delivery', 'Customer'].map((step, index) => {
                                const icons = [Users, Package, Settings, CheckCircle, Warehouse, Truck, Star];
                                const IconComp = icons[index];
                                return (
                                    <div key={index} className="flex flex-col items-center text-center group">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-[#C89F6A]/20 flex items-center justify-center group-hover:bg-[#C89F6A]/40 transition duration-300 shadow-md group-hover:shadow-xl group-hover:scale-110">
                                                <IconComp className="h-7 w-7 text-[#5C4033]" />
                                            </div>
                                            {index < 6 && (
                                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#C89F6A]/40" />
                                            )}
                                        </div>
                                        <p className="mt-3 text-sm font-medium text-[#2F1B12]">{step}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-sm font-semibold text-[#8B5E3C] uppercase tracking-wider">Features</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2F1B12] mt-2">Everything You Need to Succeed</h2>
                            <p className="text-[#5C4033]/70 mt-4">Powerful tools designed specifically for furniture manufacturers.</p>
                        </div>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 transform ${isFeaturesVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {features.map((feature, idx) => (
                                <div key={idx} className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-[#C89F6A]/20">
                                    <div className="w-14 h-14 rounded-xl bg-[#C89F6A]/20 flex items-center justify-center group-hover:bg-[#C89F6A]/40 transition">
                                        <feature.icon className="h-7 w-7 text-[#5C4033]" />
                                    </div>
                                    <h3 className="mt-6 text-xl font-bold text-[#2F1B12]">{feature.title}</h3>
                                    <p className="mt-3 text-[#5C4033]/70 leading-relaxed">{feature.description}</p>
                                    <Link href={feature.link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#8B5E3C] hover:gap-2 transition-all">
                                        Learn More <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Choose Section */}
                <section id="why" ref={whyRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-sm font-semibold text-[#8B5E3C] uppercase tracking-wider">Why Choose Us</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2F1B12] mt-2">Built for Furniture Manufacturers</h2>
                            <p className="text-[#5C4033]/70 mt-4">Our platform addresses the unique challenges of the furniture industry.</p>
                        </div>
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 transform ${isWhyVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {whyChoose.map((item, idx) => (
                                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-[#C89F6A]/20">
                                    <div className="w-12 h-12 rounded-xl bg-[#C89F6A]/20 flex items-center justify-center">
                                        <item.icon className="h-6 w-6 text-[#5C4033]" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-bold text-[#2F1B12]">{item.title}</h3>
                                    <p className="mt-2 text-sm text-[#5C4033]/70">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dashboard Preview Section */}
                <section ref={dashboardPreviewRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F4EF]/70 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-1000 transform ${isDashboardVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="order-2 lg:order-1 space-y-6">
                                <span className="text-sm font-semibold text-[#8B5E3C] uppercase tracking-wider">Dashboard</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-[#2F1B12]">Real-Time Insights at a Glance</h2>
                                <p className="text-[#5C4033]/70 leading-relaxed">
                                    Our modern dashboard provides easy navigation, powerful analytics, role-based access, and real-time monitoring to keep your operations running smoothly.
                                </p>
                                <ul className="space-y-3">
                                    {['Modern Dashboard', 'Easy Navigation', 'Advanced Analytics', 'Role-Based Access', 'Real-Time Monitoring'].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[#2F1B12]">
                                            <CheckCircle className="h-5 w-5 text-[#8B5E3C]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="order-1 lg:order-2 flex justify-center">
                                <div className="relative w-full max-w-md">
                                    <div className="bg-[#2F1B12] rounded-2xl p-4 shadow-2xl border border-white/10 backdrop-blur-sm">
                                        <div className="bg-[#F7F4EF] rounded-xl p-4">
                                            {/* Minimal dashboard preview */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <LayoutDashboard className="h-5 w-5 text-[#2F1B12]" />
                                                    <span className="text-sm font-bold text-[#2F1B12]">Analytics</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 rounded-full bg-[#8B5E3C]" />
                                                    <div className="w-2 h-2 rounded-full bg-[#C89F6A]" />
                                                    <div className="w-2 h-2 rounded-full bg-[#5C4033]" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                    <div className="text-xs text-[#5C4033]">Revenue</div>
                                                    <div className="text-sm font-bold text-[#2F1B12]">₱12.4k</div>
                                                </div>
                                                <div className="bg-white rounded-lg p-2 text-center shadow-sm">
                                                    <div className="text-xs text-[#5C4033]">Orders</div>
                                                    <div className="text-sm font-bold text-[#2F1B12]">84</div>
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 shadow-sm">
                                                <div className="flex justify-between text-xs text-[#5C4033] mb-1">
                                                    <span>Production Progress</span>
                                                    <span>78%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-[#C89F6A]/30 rounded-full overflow-hidden">
                                                    <div className="h-full w-[78%] bg-[#8B5E3C] rounded-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C89F6A]/20 rounded-full blur-2xl -z-10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" ref={testimonialsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-sm font-semibold text-[#8B5E3C] uppercase tracking-wider">Testimonials</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#2F1B12] mt-2">What Our Clients Say</h2>
                            <p className="text-[#5C4033]/70 mt-4">Trusted by furniture manufacturers worldwide.</p>
                        </div>
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 transform ${isTestimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            {testimonials.map((t, idx) => (
                                <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-[#C89F6A]/20">
                                    <div className="flex items-center gap-1 text-[#C89F6A] mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-[#2F1B12] italic leading-relaxed">“{t.quote}”</p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#C89F6A]/40 flex items-center justify-center text-[#2F1B12] font-bold">
                                            {t.author.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#2F1B12]">{t.author}</p>
                                            <p className="text-xs text-[#5C4033]/60">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section ref={ctaRef} className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={`max-w-5xl mx-auto bg-[#2F1B12] rounded-3xl p-12 text-center shadow-2xl transition-all duration-1000 transform ${isCtaVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Modernize Your Furniture Business?</h2>
                        <p className="mt-4 text-[#C89F6A]/80 text-lg max-w-2xl mx-auto">
                            Start managing your entire manufacturing process today.
                        </p>
                        <div className="mt-8">
                            <Link
                                href={auth.user ? route('dashboard') : route('register')}
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-[#F7F4EF] text-[#2F1B12] font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                            >
                                Get Started Now
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="contact" className="bg-[#2F1B12] text-[#C89F6A]/70 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo & about */}
                        <div className="col-span-1">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="h-10 w-10 rounded-xl bg-[#C89F6A]/20 flex items-center justify-center">
                                    <Box className="h-5 w-5 text-[#C89F6A]" />
                                </div>
                                <span className="text-lg font-bold text-white">FurnitureMES</span>
                            </Link>
                            <p className="mt-4 text-sm">Manufacturing Excellence</p>
                            <p className="mt-2 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition">Home</Link></li>
                                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                                <li><Link href="#workflow" className="hover:text-white transition">Workflow</Link></li>
                                <li><Link href="#why" className="hover:text-white transition">Why Choose</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Connect</h4>
                            <div className="flex gap-4">

                            </div>
                            <p className="mt-4 text-sm flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                support@furnituremes.com
                            </p>
                            <p className="mt-1 text-sm flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                +1 (555) 000-0000
                            </p>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Custom animations */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(10px, -20px) scale(1.05); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-15px, 15px) scale(1.08); }
                }
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 10s ease-in-out infinite;
                }
            `}</style>
        </>
    );
}
