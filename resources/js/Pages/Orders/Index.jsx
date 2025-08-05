import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Package, Plus, Search, Filter } from 'lucide-react';

export default function OrdersIndex({ auth, orders = [], filters = {} }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = () => {
        router.get('/orders', { search, status }, { preserveState: true });
    };

    const statusOptions = [
        { value: '', label: t('All') },
        { value: 'requested', label: t('Requested') },
        { value: 'quoted', label: t('Quoted') },
        { value: 'accepted', label: t('Accepted') },
        { value: 'paid', label: t('Paid') },
        { value: 'purchased', label: t('Purchased') },
        { value: 'shipped', label: t('Shipped') },
        { value: 'delivered', label: t('Delivered') },
    ];

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('Orders')} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{t('Orders')}</h1>
                    <Link href="/orders/create" className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('Submit Order')}
                    </Link>
                </div>

                <div className="card p-6">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('Search orders...')}
                                    className="input pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                className="input"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleFilter} className="btn btn-secondary">
                            <Filter className="w-4 h-4 mr-2" />
                            {t('Filter')}
                        </button>
                    </div>
                </div>

                <div className="card">
                    <div className="divide-y divide-gray-200">
                        {orders.data.length > 0 ? (
                            orders.data.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    #{order.order_number}
                                                </h3>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2 truncate max-w-2xl">
                                                {order.product_link}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                                {order.total_cost && (
                                                    <span className="font-medium text-gray-900">
                                                        ${order.total_cost}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {order.status === 'quoted' && (
                                                <>
                                                    <button
                                                        onClick={() => router.post(`/orders/${order.id}/accept`)}
                                                        className="btn btn-primary btn-sm"
                                                    >
                                                        {t('Accept Quote')}
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'accepted' && (
                                                <button
                                                    onClick={() => router.post(`/orders/${order.id}/pay`)}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    {t('Pay Now')}
                                                </button>
                                            )}
                                            {order.chat_id && (
                                                <Link
                                                    href={`/chats/${order.chat_id}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    💬 {t('Chat')}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="btn btn-secondary btn-sm"
                                            >
                                                {t('View')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {t('No orders found')}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {t('Start by submitting your first order')}
                                </p>
                                <Link href="/orders/create" className="btn btn-primary">
                                    {t('Submit Order')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {orders.data.length > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            {t('Showing')} {orders.from} {t('to')} {orders.to} {t('of')} {orders.total} {t('results')}
                        </div>
                        <div className="flex space-x-2">
                            {orders.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-2 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}