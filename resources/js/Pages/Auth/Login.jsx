import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import GuestLayout from '@/Layouts/GuestLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <GuestLayout>
            <Head title={t('Login')} />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <Input
                    label={t('Email')}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    autoComplete="username"
                />

                <Input
                    label={t('Password')}
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                    autoComplete="current-password"
                />

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                            {t('Remember me')}
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href="/forgot-password"
                            className="text-sm text-primary-600 hover:text-primary-500"
                        >
                            {t('Forgot your password?')}
                        </Link>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <Link
                        href="/register"
                        className="text-sm text-primary-600 hover:text-primary-500"
                    >
                        {t('Need an account?')}
                    </Link>

                    <Button type="submit" loading={processing}>
                        {t('Login')}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}