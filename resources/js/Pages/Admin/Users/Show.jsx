import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminUserShow({ auth, user }) {
    const { t } = useTranslation();
    
    const { data: balanceData, setData: setBalanceData, post: postBalance, processing: balanceProcessing } = useForm({
        amount: '',
        action: 'add', // 'add' or 'subtract'
        description: '',
    });

    const updateBalance = (e) => {
        e.preventDefault();
        postBalance(`/admin/users/${user.id}/balance`);
    };

    if (!user) {
        return <div>{t('user_not_found')}</div>;
    }

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`${t('user')}: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-gray-600">
                                        {t('joined')}: {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                                    user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}>
                                    {t(user.role)}
                                </span>
                            </div>

                            {/* User Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{t('account_balance')}</h3>
                                    <p className="text-2xl font-bold text-green-600">${user.balance || '0.00'}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{t('total_orders')}</h3>
                                    <p className="text-2xl font-bold text-blue-600">{user.orders_count || 0}</p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold mb-2">{t('membership_status')}</h3>
                                    {user.membership ? (
                                        <div>
                                            <StatusBadge status={user.membership.type} />
                                            <p className="text-sm text-gray-600 mt-1">
                                                {user.membership.expires_at 
                                                    ? new Date(user.membership.expires_at).toLocaleDateString()
                                                    : t('no_expiry')
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">{t('no_membership')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Update Balance */}
                            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">{t('update_balance')}</h3>
                                <form onSubmit={updateBalance} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('action')}
                                            </label>
                                            <select
                                                value={balanceData.action}
                                                onChange={(e) => setBalanceData('action', e.target.value)}
                                                className="input w-full"
                                            >
                                                <option value="add">{t('add')}</option>
                                                <option value="subtract">{t('subtract')}</option>
                                            </select>
                                        </div>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            label={t('amount')}
                                            value={balanceData.amount}
                                            onChange={(e) => setBalanceData('amount', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <Input
                                            type="text"
                                            label={t('description')}
                                            value={balanceData.description}
                                            onChange={(e) => setBalanceData('description', e.target.value)}
                                            placeholder={t('reason_for_change')}
                                        />
                                    </div>
                                    <Button type="submit" variant="primary" loading={balanceProcessing}>
                                        {t('update_balance')}
                                    </Button>
                                </form>
                            </div>

                            {/* Recent Orders */}
                            {user.recent_orders && user.recent_orders.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">{t('recent_orders')}</h3>
                                    <div className="space-y-3">
                                        {user.recent_orders.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">#{order.order_number}</p>
                                                    <p className="text-sm text-gray-600">{order.product_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <StatusBadge status={order.status} />
                                                    {order.total_cost && (
                                                        <p className="text-sm font-medium mt-1">${order.total_cost}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Payments */}
                            {user.recent_payments && user.recent_payments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">{t('recent_payments')}</h3>
                                    <div className="space-y-3">
                                        {user.recent_payments.map((payment) => (
                                            <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium capitalize">{t(payment.type)}</p>
                                                    <p className="text-sm text-gray-600">{payment.description}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(payment.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-medium ${
                                                        payment.type === 'deposit' || payment.type === 'refund'
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}>
                                                        {payment.type === 'deposit' || payment.type === 'refund' ? '+' : '-'}
                                                        ${payment.amount}
                                                    </p>
                                                    <StatusBadge status={payment.status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <Button href="/admin/users" variant="secondary">
                                    {t('back_to_users')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}