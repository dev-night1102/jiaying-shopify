import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import { useTranslation } from '@/Utils/i18n';

export default function PayOrder({ auth, order }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'wallet'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/orders/${order.id}/pay`);
    };

    const insufficientBalance = auth.user.balance < order.total_cost;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('payments.pay_order')} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">{t('payments.pay_order')}</h2>
                            
                            <div className="mb-6 space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold mb-2">{t('order.details')}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>{t('order.number')}:</span>
                                            <span className="font-medium">#{order.order_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('order.item_cost')}:</span>
                                            <span>${order.item_cost}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('order.service_fee')}:</span>
                                            <span>${order.service_fee}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>{t('order.shipping_estimate')}:</span>
                                            <span>${order.shipping_estimate}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                                            <span>{t('order.total')}:</span>
                                            <span>${order.total_cost}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="font-semibold mb-2">{t('payments.payment_method')}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-3 border rounded">
                                            <div>
                                                <p className="font-medium">{t('payments.wallet_balance')}</p>
                                                <p className="text-sm text-gray-600">
                                                    {t('payments.current_balance')}: ${auth.user.balance}
                                                </p>
                                            </div>
                                            {insufficientBalance && (
                                                <span className="text-red-600 text-sm">
                                                    {t('payments.insufficient_balance')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {insufficientBalance && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <p className="text-yellow-800">
                                            {t('payments.need_deposit', { 
                                                amount: (order.total_cost - auth.user.balance).toFixed(2) 
                                            })}
                                        </p>
                                        <a 
                                            href="/payments/deposit" 
                                            className="text-yellow-900 underline font-medium"
                                        >
                                            {t('payments.deposit_funds')}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={processing || insufficientBalance}
                                        className="flex-1"
                                    >
                                        {processing ? t('common.processing') : t('payments.pay_now')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => window.history.back()}
                                    >
                                        {t('common.cancel')}
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