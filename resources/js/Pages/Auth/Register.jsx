import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import GuestLayout from '@/Layouts/GuestLayout';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Register() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout>
            <Head title={t('Register')} />

            <form onSubmit={submit} className="space-y-6">
                <Input
                    label={t('Name')}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    autoComplete="name"
                />

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
                    autoComplete="new-password"
                />

                <Input
                    label={t('Confirm Password')}
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    error={errors.password_confirmation}
                    autoComplete="new-password"
                />

                <div className="flex items-center justify-between">
                    <Link
                        href="/login"
                        className="text-sm text-primary-600 hover:text-primary-500"
                    >
                        {t('Already registered?')}
                    </Link>

                    <Button type="submit" loading={processing}>
                        {t('Register')}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}