import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import toast from 'react-hot-toast';

export function useFlashToasts() {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, { duration: 4000 });
        }
        if (flash?.error) {
            toast.error(flash.error, { duration: 4000 });
        }
        if (flash?.warning) {
            toast(flash.warning, {
                duration: 4000,
                style: { background: '#f59e0b', color: '#fff' },
            });
        }
        if (flash?.info) {
            toast(flash.info, {
                duration: 4000,
                style: { background: '#3b82f6', color: '#fff' },
            });
        }
    }, [flash]);
}
