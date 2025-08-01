import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function PaymentDeposit({ auth }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        payment_method: 'paypal',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/payments/deposit');
    };

    const predefinedAmounts = [50, 100, 200, 500];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('add_funds')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">{t('add_funds_to_account')}</h2>

                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    {t('current_balance')}: ${auth.user.balance.toFixed(2)}
                                </h3>
                                <p className="text-blue-700 text-sm">
                                    {t('add_funds_description')}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('quick_amounts')}
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                        {predefinedAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => setData('amount', amount.toString())}
                                                className={`p-3 border rounded-lg text-center hover:border-primary-500 transition-colors ${
                                                    data.amount === amount.toString()
                                                        ? 'border-primary-500 bg-primary-50'
                                                        : 'border-gray-300'
                                                }`}
                                            >
                                                ${amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('custom_amount')}
                                    </label>
                                    <Input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        error={errors.amount}
                                        placeholder="0.00"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('payment_method')}
                                    </label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="paypal">PayPal</option>
                                        <option value="stripe">Credit Card (Stripe)</option>
                                        <option value="alipay">Alipay</option>
                                        <option value="wechat">WeChat Pay</option>
                                    </select>
                                    {errors.payment_method && (
                                        <p className="text-sm text-red-600 mt-1">{errors.payment_method}</p>
                                    )}
                                </div>

                                <div className="border-t pt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-medium">{t('deposit_amount')}:</span>
                                        <span className="text-lg font-bold">${data.amount || '0.00'}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        {t('deposit_fee_notice')}
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button href="/payments" variant="secondary">
                                        {t('cancel')}
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        variant="primary" 
                                        loading={processing}
                                        disabled={!data.amount || parseFloat(data.amount) <= 0}
                                    >
                                        {t('proceed_to_payment')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}