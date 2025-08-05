import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ auth, chat, messages, isAdmin }) {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() && !selectedImage) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('content', newMessage);
        if (selectedImage) {
            formData.append('image', selectedImage);
            formData.append('type', 'image');
        }

        try {
            await router.post(route('chats.send', chat.id), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setSelectedImage(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const isMyMessage = (message) => {
        return message.sender_id === auth.user.id;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        {isAdmin 
                            ? `Chat with ${chat.user?.name}` 
                            : `Order ${chat.order?.order_number}`
                        }
                    </h2>
                    <div className="text-sm text-gray-600">
                        Order Status: 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            chat.order?.status === 'delivered' 
                                ? 'bg-green-100 text-green-800'
                                : chat.order?.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {chat.order?.status}
                        </span>
                    </div>
                </div>
            }
        >
            <Head title={`Chat - Order ${chat.order?.order_number}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col h-[600px]">
                        {/* Order Info */}
                        <div className="p-4 bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        Order #{chat.order?.order_number}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {chat.order?.product_link && (
                                            <a 
                                                href={chat.order.product_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View Product
                                            </a>
                                        )}
                                    </p>
                                </div>
                                {chat.order?.total_cost && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total Cost</p>
                                        <p className="font-bold text-green-600">${chat.order.total_cost}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                            isMyMessage(message)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                        }`}>
                                            <div className="text-xs opacity-75 mb-1">
                                                {message.sender?.name} • {formatMessageTime(message.created_at)}
                                            </div>
                                            
                                            {message.type === 'image' && message.image_path && (
                                                <img 
                                                    src={`/storage/${message.image_path}`}
                                                    alt="Uploaded image"
                                                    className="max-w-full h-auto rounded mb-2"
                                                />
                                            )}
                                            
                                            <div className="text-sm">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t bg-gray-50">
                            <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                                <div className="flex-1">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows="2"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                    
                                    {selectedImage && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Selected: {selectedImage.name}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedImage(null)}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
                                >
                                    📎
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || (!newMessage.trim() && !selectedImage)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}