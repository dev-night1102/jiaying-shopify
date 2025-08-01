import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';

export default function ChatIndex({ auth, chats = [] }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('chats')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">{t('support_chats')}</h2>
                                <Button href={'/chats/create'} variant="primary">
                                    {t('new_chat')}
                                </Button>
                            </div>

                            {chats.length > 0 ? (
                                <div className="space-y-4">
                                    {chats.map((chat) => (
                                        <Link
                                            key={chat.id}
                                            href={`/chats/${chat.id}`}
                                            className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">{chat.subject}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {chat.last_message?.content || t('no_messages_yet')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                        chat.status === 'open' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {t(chat.status)}
                                                    </span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(chat.updated_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">{t('no_chats_yet')}</p>
                                    <Button href={'/chats/create'} variant="primary">
                                        {t('start_chat')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}