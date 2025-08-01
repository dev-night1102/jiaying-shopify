import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';
import { Mail, CheckCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <GuestLayout>
            <Head title={t('Email Verification')} />

            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary-100 rounded-full">
                        <Mail className="w-8 h-8 text-primary-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('Verify Your Email')}
                </h1>
                <p className="text-gray-600">
                    {t('Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you?')}
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        <p className="text-sm text-green-800">
                            {t('A new verification link has been sent to the email address you provided during registration.')}
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <form onSubmit={submit}>
                    <Button 
                        type="submit" 
                        loading={processing}
                        className="w-full"
                    >
                        {t('Resend Verification Email')}
                    </Button>
                </form>

                <div className="text-center">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        {t('Log Out')}
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}