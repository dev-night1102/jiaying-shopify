import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import StatusBadge from '@/Components/StatusBadge';

export default function OrderShow({ auth, order }) {
    const { t } = useTranslation();

    const statusSteps = [
        'pending',
        'quoted',
        'quote_accepted',
        'purchasing',
        'purchased',
        'inspection',
        'shipped',
        'delivered'
    ];

    const currentStepIndex = statusSteps.indexOf(order.status);

    return (
        <AuthenticatedLayout user={auth.user}>
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
                                        {t('created_at')}: {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            {/* Order Progress */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">{t('order_progress')}</h3>
                                <div className="flex items-center space-x-4 overflow-x-auto pb-4">
                                    {statusSteps.map((step, index) => (
                                        <div key={step} className="flex items-center whitespace-nowrap">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                                index <= currentStepIndex
                                                    ? 'bg-primary-600 border-primary-600 text-white'
                                                    : 'border-gray-300 text-gray-400'
                                            }`}>
                                                {index <= currentStepIndex ? (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <span className="text-xs">{index + 1}</span>
                                                )}
                                            </div>
                                            <span className={`ml-2 text-sm ${
                                                index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                                            }`}>
                                                {t(step)}
                                            </span>
                                            {index < statusSteps.length - 1 && (
                                                <div className={`ml-4 w-8 h-px ${
                                                    index < currentStepIndex ? 'bg-primary-600' : 'bg-gray-300'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">{t('product_details')}</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="font-medium">{t('product_name')}:</span>
                                            <span className="ml-2">{order.product_name}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('product_url')}:</span>
                                            <a href={order.product_url} target="_blank" rel="noopener noreferrer" 
                                               className="ml-2 text-primary-600 hover:underline">
                                                {t('view_product')}
                                            </a>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('quantity')}:</span>
                                            <span className="ml-2">{order.quantity}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('specifications')}:</span>
                                            <span className="ml-2">{order.specifications || t('none')}</span>
                                        </div>
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

                            {/* Quote Actions */}
                            {order.status === 'quoted' && (
                                <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{t('quote_received')}</h3>
                                    <p className="text-gray-700 mb-4">
                                        {t('quote_decision_prompt')}
                                    </p>
                                    <div className="flex space-x-4">
                                        <Button
                                            href={`/orders/${order.id}/accept-quote`}
                                            method="post"
                                            variant="primary"
                                        >
                                            {t('accept_quote')}
                                        </Button>
                                        <Button
                                            href={`/orders/${order.id}/reject-quote`}
                                            method="post"
                                            variant="danger"
                                        >
                                            {t('reject_quote')}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Payment Required */}
                            {(order.status === 'quote_accepted' || order.status === 'purchasing') && order.total_cost && (
                                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{t('payment_required')}</h3>
                                    <p className="text-gray-700 mb-4">
                                        {t('payment_prompt')}
                                    </p>
                                    <Button
                                        href={`/orders/${order.id}/pay`}
                                        variant="primary"
                                    >
                                        {t('pay_now')} - ${order.total_cost}
                                    </Button>
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

                            {/* Logistics Information */}
                            {order.logistics && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">{t('shipping_info')}</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                        <div>
                                            <span className="font-medium">{t('tracking_number')}:</span>
                                            <span className="ml-2">{order.logistics.tracking_number}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('carrier')}:</span>
                                            <span className="ml-2">{order.logistics.carrier}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('shipped_at')}:</span>
                                            <span className="ml-2">
                                                {new Date(order.logistics.shipped_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Special Requests */}
                            {order.special_requests && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-2">{t('special_requests')}</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p>{order.special_requests}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <Button href="/orders" variant="secondary">
                                    {t('back_to_orders')}
                                </Button>
                                <Button href="/chats/create" variant="primary">
                                    {t('contact_support')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}