import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import StatusBadge from '@/Components/StatusBadge';

export default function AdminChatsIndex({ auth, chats = {}, filters = {} }) {
    const { t } = useTranslation();
    
    const chatData = chats?.data || [];

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('support_chats')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{t('support_chats')}</h2>
                                <div className="flex space-x-4">
                                    <select className="input">
                                        <option value="">{t('all_chats')}</option>
                                        <option value="open">{t('open')}</option>
                                        <option value="closed">{t('closed')}</option>
                                    </select>
                                </div>
                            </div>

                            {chatData.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('chat')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('customer')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('order')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('status')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('last_message')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {t('actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {chatData.map((chat) => (
                                                <tr key={chat.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {chat.subject || `Chat #${chat.id}`}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(chat.created_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{chat.user?.name}</div>
                                                        <div className="text-sm text-gray-500">{chat.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {chat.order ? (
                                                            <Link
                                                                href={`/admin/orders/${chat.order.id}`}
                                                                className="text-primary-600 hover:underline"
                                                            >
                                                                #{chat.order.order_number}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-gray-500">{t('general_inquiry')}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={chat.status} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900 max-w-xs truncate">
                                                            {chat.last_message?.content || t('no_messages_yet')}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {chat.messages_count} {t('messages')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                href={`/admin/chats/${chat.id}`}
                                                                className="text-primary-600 hover:text-primary-900"
                                                            >
                                                                {t('view')}
                                                            </Link>
                                                            {chat.status === 'open' && (
                                                                <button
                                                                    onClick={() => {
                                                                        // Handle close chat
                                                                        window.location.href = `/admin/chats/${chat.id}/close`;
                                                                    }}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    {t('close')}
                                                                </button>
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-gray-500">{t('no_chats_found')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}