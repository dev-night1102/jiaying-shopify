import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import { useTranslation } from '@/Utils/i18n';

export default function Quote({ auth, order }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        item_cost: '',
        service_fee: '',
        shipping_estimate: '',
    });

    const [total, setTotal] = useState(0);

    const calculateTotal = () => {
        const itemCost = parseFloat(data.item_cost) || 0;
        const serviceFee = parseFloat(data.service_fee) || 0;
        const shippingEstimate = parseFloat(data.shipping_estimate) || 0;
        return (itemCost + serviceFee + shippingEstimate).toFixed(2);
    };

    const handleInputChange = (field, value) => {
        setData(field, value);
        
        // Recalculate total
        const newData = { ...data, [field]: value };
        const itemCost = parseFloat(newData.item_cost) || 0;
        const serviceFee = parseFloat(newData.service_fee) || 0;
        const shippingEstimate = parseFloat(newData.shipping_estimate) || 0;
        setTotal((itemCost + serviceFee + shippingEstimate).toFixed(2));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/orders/${order.id}/quote`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('orders.create_quote')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    {t('orders.create_quote_for', { order: order.order_number })}
                                </h2>
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t('common.back')}
                                </Link>
                            </div>

                            <div className="mb-6 space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold mb-2">{t('order.details')}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">{t('order.customer')}:</span>
                                            <span className="ml-2">{order.user.name} ({order.user.email})</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">{t('order.product_link')}:</span>
                                            <a 
                                                href={order.product_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="ml-2 text-blue-600 hover:underline"
                                            >
                                                {order.product_link}
                                            </a>
                                        </div>
                                        {order.notes && (
                                            <div>
                                                <span className="text-gray-600">{t('order.notes')}:</span>
                                                <span className="ml-2">{order.notes}</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-gray-600">{t('order.created_at')}:</span>
                                            <span className="ml-2">{new Date(order.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {order.images && order.images.length > 0 && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-semibold mb-2">{t('order.images')}</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {order.images.map((image) => (
                                                <a
                                                    key={image.id}
                                                    href={image.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block"
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.type}
                                                        className="w-full h-24 object-cover rounded"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('order.item_cost')} ($)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="mt-1 w-full"
                                        value={data.item_cost}
                                        onChange={(e) => handleInputChange('item_cost', e.target.value)}
                                        required
                                    />
                                    {errors.item_cost && (
                                        <p className="mt-1 text-sm text-red-600">{errors.item_cost}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('orders.item_cost_help')}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('order.service_fee')} ($)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="mt-1 w-full"
                                        value={data.service_fee}
                                        onChange={(e) => handleInputChange('service_fee', e.target.value)}
                                        required
                                    />
                                    {errors.service_fee && (
                                        <p className="mt-1 text-sm text-red-600">{errors.service_fee}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('orders.service_fee_help')}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('order.shipping_estimate')} ($)
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        className="mt-1 w-full"
                                        value={data.shipping_estimate}
                                        onChange={(e) => handleInputChange('shipping_estimate', e.target.value)}
                                        required
                                    />
                                    {errors.shipping_estimate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.shipping_estimate}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('orders.shipping_estimate_help')}
                                    </p>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>{t('order.total_cost')}:</span>
                                        <span>${total}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? t('common.sending') : t('orders.send_quote')}
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