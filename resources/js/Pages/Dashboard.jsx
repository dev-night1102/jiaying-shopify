import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Package, ShoppingCart, CheckCircle, DollarSign, Plus, MessageSquare } from 'lucide-react';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({ auth, stats = {}, recentOrders = [], membership }) {
    const { t } = useTranslation();
    
    // Provide default values for stats
    const defaultStats = {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        balance: '0.00',
        ...stats
    };

    const statCards = [
        {
            title: t('Total Orders'),
            value: defaultStats.totalOrders,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: t('Active Orders'),
            value: defaultStats.activeOrders,
            icon: ShoppingCart,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            title: t('Completed Orders'),
            value: defaultStats.completedOrders,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: t('Account Balance'),
            value: `$${defaultStats.balance}`,
            icon: DollarSign,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('Dashboard')} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{t('Dashboard')}</h1>
                    <div className="flex space-x-3">
                        <Link
                            href="/orders/create"
                            className="btn btn-primary"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            {t('Submit Order')}
                        </Link>
                        <Link
                            href="/chats"
                            className="btn btn-secondary"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            {t('Chats')}
                        </Link>
                        <Link
                            href="/memberships"
                            className="btn btn-secondary"
                        >
                            {t('Memberships')}
                        </Link>
                    </div>
                </div>

                {membership && (
                    <div className="card p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {t('Membership Status')}
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <StatusBadge status={membership.type} />
                                    <span className="text-sm text-gray-600">
                                        {membership.days_remaining} {t('days remaining')}
                                    </span>
                                </div>
                            </div>
                            {membership.type === 'trial' && (
                                <Link
                                    href="/memberships"
                                    className="btn btn-primary"
                                >
                                    {t('Upgrade Membership')}
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <div key={index} className="card p-6">
                            <div className="flex items-center">
                                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                {t('Recent Orders')}
                            </h3>
                            <Link
                                href="/orders"
                                className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                            >
                                {t('View All')}
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    #{order.order_number}
                                                </p>
                                                <StatusBadge status={order.status} />
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 truncate max-w-md">
                                                {order.product_link}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            {order.total_cost && (
                                                <span className="text-sm font-medium text-gray-900">
                                                    ${order.total_cost}
                                                </span>
                                            )}
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="text-primary-600 hover:text-primary-500 text-sm"
                                            >
                                                {t('View')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">{t('No orders yet')}</p>
                                <Link
                                    href="/orders/create"
                                    className="btn btn-primary mt-4"
                                >
                                    {t('Submit Your First Order')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}