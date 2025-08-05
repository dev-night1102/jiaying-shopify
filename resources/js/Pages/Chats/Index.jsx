import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, chats, isAdmin }) {
    const formatLastMessage = (chat) => {
        if (!chat.last_message) return 'No messages yet';
        
        const message = chat.last_message.content;
        return message.length > 50 ? message.substring(0, 50) + '...' : message;
    };

    const getUnreadCount = (chat) => {
        return chat.messages?.filter(m => !m.is_read && m.sender_id !== auth.user.id).length || 0;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Chats</h2>}
        >
            <Head title="Chats" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {chats.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">No chats yet</p>
                                    {!isAdmin && (
                                        <Link
                                            href={route('orders.create')}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Create an Order to Start Chatting
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium mb-4">
                                        {isAdmin ? 'All Chats' : 'Your Chats'}
                                    </h3>
                                    
                                    {chats.map((chat) => (
                                        <Link
                                            key={chat.id}
                                            href={route('chats.show', chat.id)}
                                            className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {isAdmin 
                                                                ? `Chat with ${chat.user?.name}` 
                                                                : `Order ${chat.order?.order_number}`
                                                            }
                                                        </h4>
                                                        {getUnreadCount(chat) > 0 && (
                                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                {getUnreadCount(chat)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {formatLastMessage(chat)}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>
                                                            Order Status: 
                                                            <span className={`ml-1 px-2 py-1 rounded-full ${
                                                                chat.order?.status === 'delivered' 
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : chat.order?.status === 'shipped'
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {chat.order?.status}
                                                            </span>
                                                        </span>
                                                        <span>
                                                            {chat.last_message_at 
                                                                ? new Date(chat.last_message_at).toLocaleString()
                                                                : 'No activity'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0 ml-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        chat.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {chat.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}