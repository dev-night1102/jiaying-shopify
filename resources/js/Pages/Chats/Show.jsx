import React, { useState, useRef, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Send,
    Paperclip,
    Smile,
    MoreVertical,
    Phone,
    Video,
    Search,
    ArrowLeft,
    Check,
    CheckCheck,
    Image as ImageIcon,
    X,
    Download,
    User,
    Package,
    ExternalLink,
    Clock,
    DollarSign,
    ShoppingBag
} from 'lucide-react';

export default function Show({ auth, chat, messages, isAdmin }) {
    const [newMessage, setNewMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Real-time polling for new messages
    useEffect(() => {
        const pollForNewMessages = () => {
            router.reload({ 
                only: ['messages'],
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Silent refresh - no loading indicators
                }
            });
        };

        // Poll every 3 seconds for new messages
        const interval = setInterval(pollForNewMessages, 3000);

        // Clean up interval on component unmount
        return () => clearInterval(interval);
    }, [chat.id]);

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
            await router.post(`/chats/${chat.id}/send`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                    setSelectedImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    inputRef.current?.focus();
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
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatMessageTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 86400000) { // Less than 24 hours
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (diff < 604800000) { // Less than 7 days
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const isMyMessage = (message) => {
        return message.sender_id === auth.user.id;
    };

    const addEmoji = (emoji) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
        inputRef.current?.focus();
    };

    const commonEmojis = [
        '😊', '😂', '😍', '🥰', '😘', '😉', '😎', '🤗', '🤔', '😅',
        '👍', '👎', '👌', '🤝', '🙏', '💪', '👏', '🎉', '🔥', '💯',
        '❤️', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🤍',
        '📦', '🛒', '🎁', '💰', '💳', '✅', '❌', '⭐', '🚚', '🌟'
    ];

    const getStatusColor = (status) => {
        const colors = {
            'requested': 'bg-blue-100 text-blue-700 border-blue-300',
            'quoted': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'accepted': 'bg-green-100 text-green-700 border-green-300',
            'paid': 'bg-purple-100 text-purple-700 border-purple-300',
            'purchased': 'bg-indigo-100 text-indigo-700 border-indigo-300',
            'shipped': 'bg-orange-100 text-orange-700 border-orange-300',
            'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Chat - Order ${chat.order?.order_number}`} />

            {/* WhatsApp-style Background */}
            <div className="fixed inset-0 bg-green-50" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
                backgroundSize: '20px 20px'
            }}>
                <div className="absolute inset-0 bg-green-50/30"></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    {isAdmin ? (
                                        <User className="w-5 h-5 text-white" />
                                    ) : (
                                        <ShoppingBag className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        {isAdmin 
                                            ? chat.user?.name || 'Customer' 
                                            : `Order Support`
                                        }
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Order #{chat.order?.order_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                                <Search className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                                <Phone className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                                <Video className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                                <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Info Card */}
                <div className="px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 animate-slide-down">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">
                                            Order #{chat.order?.order_number}
                                        </h3>
                                        {chat.order?.product_link && (
                                            <a 
                                                href={chat.order.product_link} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-1" />
                                                View Product
                                            </a>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-6">
                                    <div className="text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(chat.order?.status)}`}>
                                            {chat.order?.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    {chat.order?.total_cost && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                                            <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                                                <DollarSign className="w-5 h-5 mr-1" />
                                                {chat.order.total_cost}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-4">
                    <div className="max-w-6xl mx-auto h-full">
                        <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 flex flex-col h-full overflow-hidden animate-slide-up">
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-green-50/30" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)', backgroundSize: '30px 30px'}}>
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                                            <Package className="w-10 h-10 text-gray-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Start the conversation!</h3>
                                        <p className="text-gray-500">Send a message to begin chatting about your order.</p>
                                    </div>
                                ) : (
                                    messages.map((message, index) => {
                                        const isMe = isMyMessage(message);
                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex items-end space-x-2 animate-slide-up ${isMe ? 'justify-end' : 'justify-start'}`}
                                                style={{animationDelay: `${index * 0.05}s`}}
                                            >
                                                {!isMe && (
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                                
                                                <div className="max-w-md">
                                                    <div className={`rounded-2xl px-4 py-3 shadow-lg transform hover:scale-[1.02] transition-all duration-200 ${
                                                        isMe
                                                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white rounded-br-md'
                                                            : 'bg-white text-gray-900 rounded-bl-md shadow-md'
                                                    }`}>
                                                        {message.type === 'image' && message.image_path && (
                                                            <div className="mb-3 relative group">
                                                                <img 
                                                                    src={`/storage/${message.image_path}`}
                                                                    alt="Shared image"
                                                                    className="max-w-full h-auto rounded-xl cursor-pointer group-hover:scale-105 transition-transform duration-300"
                                                                    onClick={() => window.open(`/storage/${message.image_path}`, '_blank')}
                                                                />
                                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                                    <button className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors duration-200">
                                                                        <Download className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {message.content && (
                                                            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                                {message.content}
                                                            </div>
                                                        )}
                                                        
                                                        <div className={`flex items-center justify-between mt-2 text-xs opacity-70 ${isMe ? 'text-green-100' : 'text-gray-500'}`}>
                                                            <span className="flex items-center">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {formatMessageTime(message.created_at)}
                                                            </span>
                                                            {isMe && (
                                                                <div className="flex items-center ml-2">
                                                                    <CheckCheck className="w-4 h-4 text-green-200" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {!isMe && (
                                                        <div className="text-xs text-gray-600 mt-1 ml-2">
                                                            {message.sender?.name}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {isMe && (
                                                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="px-6 py-3 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                                    <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-xl">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {selectedImage?.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {selectedImage && (selectedImage.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={removeSelectedImage}
                                            className="p-2 hover:bg-red-100 rounded-full transition-colors duration-200"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="space-y-3">
                                    <div className="flex items-end space-x-3">
                                        {/* Emoji Button */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
                                            >
                                                <Smile className="w-5 h-5" />
                                            </button>
                                            
                                            {/* Emoji Picker */}
                                            {showEmojiPicker && (
                                                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 animate-slide-up">
                                                    <div className="grid grid-cols-10 gap-1 max-w-sm">
                                                        {commonEmojis.map((emoji, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => addEmoji(emoji)}
                                                                className="p-2 hover:bg-gray-100 rounded-lg text-lg transition-colors duration-200 hover:scale-110"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Message Input */}
                                        <div className="flex-1 relative">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type a message..."
                                                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-full focus:border-green-500 focus:outline-none transition-all duration-200 bg-white"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage(e);
                                                    }
                                                }}
                                            />
                                        </div>

                                        {/* File Upload Button */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </button>

                                        {/* Send Button */}
                                        <button
                                            type="submit"
                                            disabled={loading || (!newMessage.trim() && !selectedImage)}
                                            className={`p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                                                loading || (!newMessage.trim() && !selectedImage)
                                                    ? 'bg-gray-300 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
                                            }`}
                                        >
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5 text-white" />
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}