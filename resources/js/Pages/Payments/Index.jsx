import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import StatusBadge from '@/Components/StatusBadge';

export default function PaymentIndex({ auth, payments = [], balance = 0 }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('payments')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{t('payment_history')}</h2>
                                <Button href={'/payments/deposit'} variant="primary">
                                    {t('add_funds')}
                                </Button>
                            </div>

                            <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-primary-900">
                                    {t('current_balance')}: ${balance.toFixed(2)}
                                </h3>
                            </div>

                            {payments.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('date')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('type')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('amount')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('status')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('description')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {payments.map((payment) => (
                                                <tr key={payment.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(payment.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="capitalize text-sm text-gray-900">
                                                            {t(payment.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`text-sm font-medium ${
                                                            payment.type === 'deposit' || payment.type === 'refund'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}>
                                                            {payment.type === 'deposit' || payment.type === 'refund' ? '+' : '-'}
                                                            ${payment.amount}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={payment.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {payment.description || t('no_description')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">{t('no_payments_yet')}</p>
                                    <Button href={'/payments/deposit'} variant="primary">
                                        {t('make_first_deposit')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}