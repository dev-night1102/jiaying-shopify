import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminOrderShow({ auth, order }) {
    const { t } = useTranslation();
    
    const { data: statusData, setData: setStatusData, post: postStatus, processing: statusProcessing } = useForm({
        status: order?.status || '',
    });
    
    const { data: quoteData, setData: setQuoteData, post: postQuote, processing: quoteProcessing } = useForm({
        quoted_price: '',
        service_fee: '',
        notes: '',
    });

    const updateStatus = (e) => {
        e.preventDefault();
        postStatus(`/admin/orders/${order.id}/status`);
    };

    const sendQuote = (e) => {
        e.preventDefault();
        postQuote(`/admin/orders/${order.id}/quote`);
    };

    if (!order) {
        return <div>{t('order_not_found')}</div>;
    }

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`${t('order')} #${order.order_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">
                                        {t('order')} #{order.order_number}
                                    </h2>
                                    <p className="text-gray-600">
                                        {t('customer')}: {order.user?.name} ({order.user?.email})
                                    </p>
                                    <p className="text-gray-600">
                                        {t('created_at')}: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{t('product_details')}</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-medium">{t('product_url')}:</span>
                                            <a href={order.product_url} target="_blank" rel="noopener noreferrer" 
                                               className="ml-2 text-primary-600 hover:underline break-all">
                                                {order.product_url}
                                            </a>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('quantity')}:</span>
                                            <span className="ml-2">{order.quantity}</span>
                                        </div>
                                        {order.specifications && (
                                            <div>
                                                <span className="font-medium">{t('specifications')}:</span>
                                                <span className="ml-2">{order.specifications}</span>
                                            </div>
                                        )}
                                        {order.special_requests && (
                                            <div>
                                                <span className="font-medium">{t('special_requests')}:</span>
                                                <p className="mt-1 text-gray-700">{order.special_requests}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{t('pricing')}</h3>
                                    <div className="space-y-2">
                                        {order.quoted_price && (
                                            <div>
                                                <span className="font-medium">{t('quoted_price')}:</span>
                                                <span className="ml-2">${order.quoted_price}</span>
                                            </div>
                                        )}
                                        {order.service_fee && (
                                            <div>
                                                <span className="font-medium">{t('service_fee')}:</span>
                                                <span className="ml-2">${order.service_fee}</span>
                                            </div>
                                        )}
                                        {order.total_cost && (
                                            <div className="pt-2 border-t">
                                                <span className="font-medium text-lg">{t('total_cost')}:</span>
                                                <span className="ml-2 text-lg font-bold">${order.total_cost}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Update Status */}
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">{t('update_status')}</h3>
                                <form onSubmit={updateStatus} className="flex items-center space-x-4">
                                    <select
                                        value={statusData.status}
                                        onChange={(e) => setStatusData('status', e.target.value)}
                                        className="input"
                                    >
                                        <option value="pending">{t('pending')}</option>
                                        <option value="quoted">{t('quoted')}</option>
                                        <option value="quote_accepted">{t('quote_accepted')}</option>
                                        <option value="purchasing">{t('purchasing')}</option>
                                        <option value="purchased">{t('purchased')}</option>
                                        <option value="inspection">{t('inspection')}</option>
                                        <option value="shipped">{t('shipped')}</option>
                                        <option value="delivered">{t('delivered')}</option>
                                    </select>
                                    <Button type="submit" variant="primary" loading={statusProcessing}>
                                        {t('update_status')}
                                    </Button>
                                </form>
                            </div>

                            {/* Send Quote */}
                            {(order.status === 'pending' || order.status === 'quoted') && (
                                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-4">{t('send_quote')}</h3>
                                    <form onSubmit={sendQuote} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                label={t('quoted_price')}
                                                value={quoteData.quoted_price}
                                                onChange={(e) => setQuoteData('quoted_price', e.target.value)}
                                                placeholder="0.00"
                                            />
                                            <Input
                                                type="number"
                                                step="0.01"
                                                label={t('service_fee')}
                                                value={quoteData.service_fee}
                                                onChange={(e) => setQuoteData('service_fee', e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('notes')}
                                            </label>
                                            <textarea
                                                value={quoteData.notes}
                                                onChange={(e) => setQuoteData('notes', e.target.value)}
                                                rows="3"
                                                className="input w-full"
                                                placeholder={t('additional_notes')}
                                            />
                                        </div>
                                        <Button type="submit" variant="primary" loading={quoteProcessing}>
                                            {t('send_quote')}
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* Order Images */}
                            {order.images && order.images.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">{t('order_images')}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {order.images.map((image) => (
                                            <div key={image.id} className="relative">
                                                <img
                                                    src={image.file_path}
                                                    alt={image.filename}
                                                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                                                />
                                                <p className="text-xs text-gray-600 mt-1 text-center">
                                                    {image.type}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <Button href="/admin/orders" variant="secondary">
                                    {t('back_to_orders')}
                                </Button>
                                <Button href={`/admin/orders/${order.id}/logistics`} variant="primary">
                                    {t('manage_logistics')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}