import { Link } from '@inertiajs/react';
import {
    Sofa,
    Package,
    Cog,
    Truck,
    BarChart3,
    ArrowRight,
    Sparkles,
    Shield,
} from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex overflow-hidden bg-gradient-to-br from-[#F7F4EF] via-[#F7F4EF] to-[#F7F4EF]/80">

            {/* Animated Background Orbs — using sand/wood tones */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#C89F6A]/20 blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#8B5E3C]/20 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#5C4033]/10 blur-3xl animate-pulse delay-500" />
            </div>

            {/* Left Side — Branding with new palette */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2F1B12] via-[#5C4033] to-[#5C4033]">

                {/* Decorative shapes */}
                <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-white/10 animate-float blur-sm" />
                <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-white/5 animate-float-delayed blur-sm" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-[#C89F6A]/10 animate-pulse" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

                <div className="relative z-10 flex h-full w-full items-center justify-center px-16 py-20">
                    <div className="max-w-xl text-white space-y-8">
                        {/* Logo */}
                        <div className="group relative">
                            <div className="absolute -inset-1 rounded-3xl bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-md shadow-2xl border border-white/20 group-hover:scale-105 transition-transform duration-300">
                                <Sofa className="h-14 w-14 text-white drop-shadow-lg" strokeWidth={1.5} />
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="h-5 w-5 text-[#C89F6A] fill-[#C89F6A]/50" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                                Furniture<span className="text-[#C89F6A]">MES</span>
                            </h1>
                            <p className="text-xl text-[#C89F6A]/90 leading-relaxed max-w-md">
                                Streamline your furniture manufacturing process
                                from raw materials to finished products.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            {[
                                { icon: Package, label: 'Inventory', desc: 'Monitor wood, materials and stock levels.' },
                                { icon: Cog, label: 'Production', desc: 'Track manufacturing progress efficiently.' },
                                { icon: Truck, label: 'Delivery', desc: 'Manage customer deliveries with ease.' },
                                { icon: BarChart3, label: 'Analytics', desc: 'View reports and business insights.' },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group/card rounded-2xl bg-white/10 backdrop-blur-md p-5 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:border-white/30 cursor-default"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 group-hover/card:bg-white/30 transition-colors">
                                            <feature.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                                        </div>
                                        <h3 className="font-semibold text-lg text-white">
                                            {feature.label}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-[#C89F6A]/80 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Trust badge */}
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2 text-[#C89F6A]/70 text-sm">
                                <Shield className="h-4 w-4" />
                                <span>Enterprise Grade</span>
                            </div>
                            <div className="w-px h-6 bg-white/20" />
                            <div className="flex items-center gap-2 text-[#C89F6A]/70 text-sm">
                                <span className="flex -space-x-1">
                                    {['#8B5E3C', '#C89F6A', '#F7F4EF'].map((c, i) => (
                                        <div key={i} className={`h-6 w-6 rounded-full border-2 border-white/50`} style={{ backgroundColor: c }} />
                                    ))}
                                </span>
                                <span>2k+ users</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Login/Register */}
            <div className="flex flex-1 items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-10 text-center lg:hidden">
                        <Link href="/" className="inline-block group">
                            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2F1B12] to-[#5C4033] shadow-2xl group-hover:scale-105 transition-transform duration-300">
                                <Sofa className="h-10 w-10 text-white" strokeWidth={1.5} />
                                <div className="absolute -top-1 -right-1">
                                    <Sparkles className="h-4 w-4 text-[#C89F6A] fill-[#C89F6A]/50" />
                                </div>
                            </div>
                        </Link>
                        <h2 className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
                            Furniture<span className="text-[#8B5E3C]">MES</span>
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            Manufacturing Excellence
                        </p>
                    </div>

                    {/* Card */}
                    <div className="relative group">
                        <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#C89F6A]/30 via-[#8B5E3C]/20 to-[#C89F6A]/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative rounded-3xl border border-white/50 bg-white/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl transition-all duration-500 hover:shadow-[0_20px_70px_-15px_rgba(92,64,51,0.3)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-[#8B5E3C]/60 to-transparent rounded-full" />

                            <div className="space-y-6">
                                {/* Header — dynamic per page */}
                                <div className="text-center space-y-1">
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                        Welcome back
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Sign in to your account to continue
                                    </p>
                                </div>

                                <div className="pt-2">
                                    {children}
                                </div>

                                <div className="text-center text-sm text-gray-500 pt-2">
                                    <span>Need help? </span>
                                    <a href="#" className="text-[#8B5E3C] font-medium hover:text-[#5C4033] transition-colors inline-flex items-center gap-1 group/link">
                                        Contact support
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex items-center justify-between text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} FurnitureMES. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
                            <span className="w-px h-3 bg-gray-200" />
                            <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </div>

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
                .delay-1000 {
                    animation-delay: 1s;
                }
                .delay-500 {
                    animation-delay: 0.5s;
                }
            `}</style>
        </div>
    );
}
