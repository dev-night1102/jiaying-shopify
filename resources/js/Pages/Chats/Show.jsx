import { useState, useEffect, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function ChatShow({ auth, chat, messages = [] }) {
    const { t } = useTranslation();
    const messagesEndRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({
        content: '',
        attachment: null,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.content.trim() || data.attachment) {
            post(`/chats/${chat.id}/messages`, {
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={chat.subject} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 p-6">
                            <h2 className="text-xl font-semibold">{chat.subject}</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {t('order')}: #{chat.order?.order_number || t('general_inquiry')}
                            </p>
                        </div>

                        <div className="h-96 overflow-y-auto p-6 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.user_id === auth.user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.user_id === auth.user.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                    }`}>
                                        <p className="text-sm">{message.content}</p>
                                        {message.attachment_path && (
                                            <a
                                                href={message.attachment_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`text-xs underline mt-1 block ${
                                                    message.user_id === auth.user.id ? 'text-white' : 'text-primary-600'
                                                }`}
                                            >
                                                {t('view_attachment')}
                                            </a>
                                        )}
                                        <p className={`text-xs mt-1 ${
                                            message.user_id === auth.user.id ? 'text-white/70' : 'text-gray-500'
                                        }`}>
                                            {new Date(message.created_at).toLocaleTimeString()}
                                        </p>
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
                                        placeholder={t('type_message')}
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}