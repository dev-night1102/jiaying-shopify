import { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function AdminChatShow({ auth, chat, messages = {} }) {
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);
    
    const messageData = messages?.data || [];
    const { data, setData, post, processing, reset } = useForm({
        content: '',
        attachment: null,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.content.trim() || data.attachment) {
            post(`/admin/chats/${chat.id}/messages`, {
                onSuccess: () => reset(),
            });
        }
    };

    const closeChat = () => {
        if (confirm(t('confirm_close_chat'))) {
            post(`/admin/chats/${chat.id}/close`);
        }
    };

    if (!chat) {
        return <div>{t('chat_not_found')}</div>;
    }

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={`${t('chat')}: ${chat.subject || chat.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">{chat.subject || `Chat #${chat.id}`}</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {t('customer')}: {chat.user?.name} ({chat.user?.email})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {chat.order ? (
                                            <>
                                                {t('order')}: <a href={`/admin/orders/${chat.order.id}`} className="text-primary-600 hover:underline">
                                                    #{chat.order.order_number}
                                                </a>
                                            </>
                                        ) : (
                                            t('general_inquiry')
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                        chat.status === 'open' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {t(chat.status)}
                                    </span>
                                    {chat.status === 'open' && (
                                        <Button onClick={closeChat} variant="danger" size="sm">
                                            {t('close_chat')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="h-96 overflow-y-auto p-6 space-y-4">
                            {messageData.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender_id === chat.user_id ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.sender_id === chat.user_id
                                            ? 'bg-gray-200 text-gray-900'
                                            : 'bg-primary-600 text-white'
                                    }`}>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="text-xs font-medium">
                                                {message.sender_id === chat.user_id ? chat.user?.name : t('admin')}
                                            </span>
                                            <span className={`text-xs ${
                                                message.sender_id === chat.user_id ? 'text-gray-500' : 'text-white/70'
                                            }`}>
                                                {new Date(message.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm">{message.content}</p>
                                        {message.image_path && (
                                            <a
                                                href={message.image_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-xs underline mt-1 block ${
                                                    message.sender_id === chat.user_id ? 'text-primary-600' : 'text-white'
                                                }`}
                                            >
                                                {t('view_attachment')}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {chat.status === 'open' && (
                            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                                <div className="flex space-x-4">
                                    <Input
                                        type="text"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder={t('type_admin_response')}
                                        className="flex-1"
                                    />
                                    <Input
                                        type="file"
                                        onChange={(e) => setData('attachment', e.target.files[0])}
                                        className="max-w-xs"
                                    />
                                    <Button type="submit" variant="primary" disabled={processing}>
                                        {t('send')}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {chat.status === 'closed' && (
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <p className="text-center text-gray-600">{t('chat_closed')}</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 p-4">
                            <Button href="/admin/chats" variant="secondary">
                                {t('back_to_chats')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}