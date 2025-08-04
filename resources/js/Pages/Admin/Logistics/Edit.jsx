import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import { useTranslation } from '@/Utils/i18n';

export default function Edit({ auth, order }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        tracking_number: order.logistics?.tracking_number || '',
        carrier: order.logistics?.carrier || '',
        tracking_url: order.logistics?.tracking_url || '',
        actual_weight: order.logistics?.actual_weight || '',
        actual_shipping_cost: order.logistics?.actual_shipping_cost || '',
        warehouse_notes: order.logistics?.warehouse_notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/orders/${order.id}/logistics`);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('logistics.edit')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">
                                    {t('logistics.edit_for_order', { order: order.order_number })}
                                </h2>
                                <Link
                                    href={`/admin/orders/${order.id}`}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t('common.back')}
                                </Link>
                            </div>

                            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">{t('order.information')}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">{t('order.customer')}:</span>
                                        <span className="ml-2">{order.user.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">{t('order.status')}:</span>
                                        <span className="ml-2">{order.status}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">{t('order.total')}:</span>
                                        <span className="ml-2">${order.total_cost}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">{t('order.shipping_estimate')}:</span>
                                        <span className="ml-2">${order.shipping_estimate}</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('logistics.tracking_number')}
                                    </label>
                                    <Input
                                        type="text"
                                        className="mt-1 w-full"
                                        value={data.tracking_number}
                                        onChange={(e) => setData('tracking_number', e.target.value)}
                                    />
                                    {errors.tracking_number && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tracking_number}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('logistics.carrier')}
                                    </label>
                                    <Input
                                        type="text"
                                        className="mt-1 w-full"
                                        value={data.carrier}
                                        onChange={(e) => setData('carrier', e.target.value)}
                                        placeholder="DHL, FedEx, UPS, etc."
                                    />
                                    {errors.carrier && (
                                        <p className="mt-1 text-sm text-red-600">{errors.carrier}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('logistics.tracking_url')}
                                    </label>
                                    <Input
                                        type="url"
                                        className="mt-1 w-full"
                                        value={data.tracking_url}
                                        onChange={(e) => setData('tracking_url', e.target.value)}
                                        placeholder="https://..."
                                    />
                                    {errors.tracking_url && (
                                        <p className="mt-1 text-sm text-red-600">{errors.tracking_url}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('logistics.actual_weight')} (kg)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.actual_weight}
                                            onChange={(e) => setData('actual_weight', e.target.value)}
                                        />
                                        {errors.actual_weight && (
                                            <p className="mt-1 text-sm text-red-600">{errors.actual_weight}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('logistics.actual_shipping_cost')} ($)
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            className="mt-1 w-full"
                                            value={data.actual_shipping_cost}
                                            onChange={(e) => setData('actual_shipping_cost', e.target.value)}
                                        />
                                        {errors.actual_shipping_cost && (
                                            <p className="mt-1 text-sm text-red-600">{errors.actual_shipping_cost}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('logistics.warehouse_notes')}
                                    </label>
                                    <textarea
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        rows={4}
                                        value={data.warehouse_notes}
                                        onChange={(e) => setData('warehouse_notes', e.target.value)}
                                    />
                                    {errors.warehouse_notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.warehouse_notes}</p>
                                    )}
                                </div>

                                {data.tracking_number && order.status !== 'shipped' && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-800">
                                            {t('logistics.will_mark_as_shipped')}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? t('common.saving') : t('common.save')}
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