import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import StatusBadge from '@/Components/StatusBadge';
import Button from '@/Components/Button';

export default function AdminOrdersIndex({ auth, orders = [], filters = {} }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('manage_orders')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{t('manage_orders')}</h2>
                                <div className="flex space-x-4">
                                    <select className="input">
                                        <option value="">{t('all_orders')}</option>
                                        <option value="requested">{t('requested')}</option>
                                        <option value="quoted">{t('quoted')}</option>
                                        <option value="accepted">{t('accepted')}</option>
                                        <option value="paid">{t('paid')}</option>
                                        <option value="purchased">{t('purchased')}</option>
                                        <option value="inspected">{t('inspected')}</option>
                                        <option value="shipped">{t('shipped')}</option>
                                        <option value="delivered">{t('delivered')}</option>
                                    </select>
                                </div>
                            </div>

                            {orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('order')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('customer')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('product')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('status')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('total')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{order.order_number}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{order.user?.name}</div>
                                                        <div className="text-sm text-gray-500">{order.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                                            <a href={order.product_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                                {order.product_link}
                                                            </a>
                                                        </div>
                                                        {order.notes && (
                                                            <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                {order.notes}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={order.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {order.total_cost ? `$${order.total_cost}` : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/admin/orders/${order.id}`}
                                                                className="text-primary-600 hover:text-primary-900"
                                                            >
                                                                {t('view')}
                                                            </Link>
                                                            {order.status === 'requested' && (
                                                                <Link
                                                                    href={`/admin/orders/${order.id}/quote`}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    {t('quote')}
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-gray-500">{t('no_orders_found')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}