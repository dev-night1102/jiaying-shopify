import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import FlashMessages from '@/Components/FlashMessages';
import { Mail, Shield } from 'lucide-react';

export default function VerifyCode({ email }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/verify-code');
    };

    const resendCode = () => {
        post('/resend-code');
    };

    return (
        <GuestLayout>
            <Head title={t('Verify Email')} />

            <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                    <div className="p-4 bg-primary-100 rounded-full">
                        <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('Enter Verification Code')}
                </h1>
                <p className="text-gray-600 mb-2">
                    {t('We sent a 6-digit code to')}
                </p>
                <p className="font-medium text-gray-900 mb-4">
                    {email}
                </p>
                <p className="text-sm text-gray-500">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {t('Check your email inbox (and spam folder)')}
                </p>
            </div>

            <FlashMessages />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <Input
                        type="text"
                        placeholder="000000"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                        error={errors.code}
                        className="text-center text-2xl tracking-widest font-mono"
                        maxLength="6"
                        autoComplete="one-time-code"
                        autoFocus
                    />
                    {errors.code && (
                        <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                    )}
                </div>

                <Button 
                    type="submit" 
                    loading={processing}
                    disabled={data.code.length !== 6}
                    className="w-full"
                >
                    {t('Verify Email')}
                </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-gray-600">
                    {t("Didn't receive the code?")}
                </p>
                <Button
                    variant="outline"
                    onClick={resendCode}
                    disabled={processing}
                    className="w-full"
                >
                    {t('Send New Code')}
                </Button>
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    {t('Code expires in 10 minutes')}
                </p>
            </div>
        </GuestLayout>
    );
}