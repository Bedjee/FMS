import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const renderInput = ({ id, type = 'text', label, icon: Icon, placeholder, ...props }) => (
        <div className="mt-4 first:mt-0">
            <InputLabel htmlFor={id} value={label} className="text-sm font-medium text-gray-700" />
            <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8B5E3C]/60">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <TextInput
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    className="block w-full pl-9 pr-3 py-2 rounded-xl border-gray-200/80 bg-white/70 shadow-sm backdrop-blur-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/30 transition-all duration-200 text-sm"
                    {...props}
                />
            </div>
            <InputError message={errors[id]} className="mt-1.5 text-sm" />
        </div>
    );

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-6 rounded-xl bg-green-50 p-4 text-sm text-green-700 border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {renderInput({
                    id: 'email',
                    type: 'email',
                    label: 'Email address',
                    icon: Mail,
                    placeholder: 'you@example.com',
                    value: data.email,
                    onChange: (e) => setData('email', e.target.value),
                    autoComplete: 'username',
                    isFocused: true,
                    required: true,
                })}

                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" className="text-sm font-medium text-gray-700" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-[#8B5E3C] hover:text-[#5C4033] transition font-medium"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8B5E3C]/60">
                            <Lock className="h-4 w-4" strokeWidth={1.75} />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="block w-full pl-9 pr-3 py-2 rounded-xl border-gray-200/80 bg-white/70 shadow-sm backdrop-blur-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/30 transition-all duration-200 text-sm"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1.5 text-sm" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-gray-300 text-[#8B5E3C] focus:ring-[#8B5E3C]"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <PrimaryButton
                    className="w-full justify-center rounded-xl bg-[#2F1B12] py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#5C4033] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:ring-offset-2 transition duration-200 disabled:opacity-50"
                    disabled={processing}
                >
                    {processing ? 'Signing in...' : 'Sign in'}
                </PrimaryButton>

                <div className="text-center text-sm mt-6">
                    <span className="text-gray-500">Don't have an account?</span>{' '}
                    <Link href={route('register')} className="font-medium text-[#8B5E3C] hover:text-[#5C4033] transition inline-flex items-center gap-1">
                        Create one now
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
