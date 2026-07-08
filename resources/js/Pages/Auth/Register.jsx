import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    LockKeyhole,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const renderInput = ({ id, type = 'text', label, icon: Icon, ...props }) => (
        <div className="mt-4 first:mt-0">
            <InputLabel htmlFor={id} value={label} className="text-sm font-medium text-gray-700" />
            <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#8B5E3C]/60">
                    <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <TextInput
                    id={id}
                    type={type}
                    className="block w-full pl-9 pr-3 py-2 rounded-xl border-gray-200/80 bg-white/70 shadow-sm backdrop-blur-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/30 transition-all duration-200 text-sm"
                    {...props}
                />
            </div>
            <InputError message={errors[id]} className="mt-1.5 text-sm" />
        </div>
    );

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-1">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-1 rounded-full bg-[#C89F6A]/30 blur-xl" />
                            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F1B12] to-[#5C4033] shadow-lg">
                                <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Create account
                    </h3>
                    <p className="text-sm text-gray-500">
                        Start managing your furniture production
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-3">
                    {renderInput({
                        id: 'name',
                        label: 'Full Name',
                        icon: User,
                        value: data.name,
                        onChange: (e) => setData('name', e.target.value),
                        autoComplete: 'name',
                        isFocused: true,
                        required: true,
                    })}

                    {renderInput({
                        id: 'email',
                        type: 'email',
                        label: 'Email',
                        icon: Mail,
                        value: data.email,
                        onChange: (e) => setData('email', e.target.value),
                        autoComplete: 'username',
                        required: true,
                    })}

                    {renderInput({
                        id: 'phone',
                        label: 'Phone Number',
                        icon: Phone,
                        value: data.phone,
                        onChange: (e) => setData('phone', e.target.value),
                        autoComplete: 'tel',
                    })}

                    {/* Address - custom textarea with icon */}
                    <div className="mt-4">
                        <InputLabel htmlFor="address" value="Address" className="text-sm font-medium text-gray-700" />
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-start pt-2.5 pl-3 pointer-events-none text-[#8B5E3C]/60">
                                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                            </div>
                            <textarea
                                id="address"
                                name="address"
                                value={data.address}
                                rows="2"
                                className="block w-full pl-9 pr-3 py-2 rounded-xl border-gray-200/80 bg-white/70 shadow-sm backdrop-blur-sm focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/30 transition-all duration-200 resize-none text-sm"
                                onChange={(e) => setData('address', e.target.value)}
                            />
                        </div>
                        <InputError message={errors.address} className="mt-1.5 text-sm" />
                    </div>

                    {renderInput({
                        id: 'password',
                        type: 'password',
                        label: 'Password',
                        icon: Lock,
                        value: data.password,
                        onChange: (e) => setData('password', e.target.value),
                        autoComplete: 'new-password',
                        required: true,
                    })}

                    {renderInput({
                        id: 'password_confirmation',
                        type: 'password',
                        label: 'Confirm Password',
                        icon: LockKeyhole,
                        value: data.password_confirmation,
                        onChange: (e) => setData('password_confirmation', e.target.value),
                        autoComplete: 'new-password',
                        required: true,
                    })}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-500 hover:text-[#8B5E3C] transition inline-flex items-center gap-1 group"
                        >
                            Already registered?
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <PrimaryButton
                            className="w-full sm:w-auto justify-center px-6 py-2 bg-[#2F1B12] hover:bg-[#5C4033] border-0 shadow-lg shadow-[#2F1B12]/20 hover:shadow-[#2F1B12]/30 transition-all duration-200 rounded-xl text-white font-semibold text-sm"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create account'}
                        </PrimaryButton>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200/60" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white/80 px-3 py-0.5 rounded-full text-gray-400 backdrop-blur-sm">
                            Secure & encrypted
                        </span>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
