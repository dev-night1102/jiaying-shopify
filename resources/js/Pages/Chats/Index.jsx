import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    MessageCircle, 
    User, 
    Clock, 
    CheckCircle,
    AlertCircle,
    Package,
    Send,
    Search,
    Filter,
    Users,
    Activity,
    Star,
    ArrowRight,
    Sparkles,
    MessageSquare,
    Bell,
    Plus,
    Zap,
    Eye,
    Calendar
} from 'lucide-react';

export default function Index({ auth, chats, isAdmin }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredChats, setFilteredChats] = useState(chats);
    const [hoveredChat, setHoveredChat] = useState(null);
    const [animationDelay, setAnimationDelay] = useState(0);

    useEffect(() => {
        const filtered = chats.filter(chat => {
            const chatTitle = isAdmin 
                ? chat.user?.name?.toLowerCase() 
                : chat.order?.order_number?.toLowerCase();
            const lastMessage = chat.last_message?.content?.toLowerCase() || '';
            
            return chatTitle?.includes(searchTerm.toLowerCase()) || 
                   lastMessage.includes(searchTerm.toLowerCase());
        });
        setFilteredChats(filtered);
    }, [searchTerm, chats]);

    const formatLastMessage = (chat) => {
        if (!chat.last_message) return 'No messages yet';
        
        const message = chat.last_message.content;
        return message.length > 60 ? message.substring(0, 60) + '...' : message;
    };

    const getUnreadCount = (chat) => {
        return chat.messages?.filter(m => !m.is_read && m.sender_id !== auth.user.id).length || 0;
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'from-green-400 to-emerald-500',
            inactive: 'from-gray-400 to-gray-500',
            closed: 'from-red-400 to-pink-500'
        };
        return colors[status] || 'from-blue-400 to-indigo-500';
    };

    const getOrderStatusColor = (status) => {
        const colors = {
            delivered: 'bg-green-100 text-green-700 border-green-300',
            shipped: 'bg-blue-100 text-blue-700 border-blue-300',
            paid: 'bg-purple-100 text-purple-700 border-purple-300',
            quoted: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            requested: 'bg-gray-100 text-gray-700 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const chatStats = {
        total: chats.length,
        active: chats.filter(c => c.status === 'active').length,
        unread: chats.reduce((sum, c) => sum + getUnreadCount(c), 0)
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Chat Messages" />

            {/* Hero Background Image */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%), url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1920&h=1080&fit=crop&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            </div>

            {/* Floating Animation Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-300 rounded-full opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-cyan-300 rounded-full opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
            </div>

            <div className="relative z-10 py-12 space-y-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Premium Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-10 shadow-2xl mb-8 animate-slide-down">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-3 flex items-center">
                                        <MessageCircle className="w-12 h-12 mr-4 animate-bounce" />
                                        {isAdmin ? 'All Conversations' : 'Your Messages'}
                                    </h1>
                                    <p className="text-xl text-white/90">
                                        {isAdmin ? 'Monitor and respond to customer inquiries' : 'Chat with support about your orders'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-6">
                                    {!isAdmin && (
                                        <Link
                                            href="/orders/create"
                                            className="group relative inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                            New Order
                                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Chats</p>
                                    <p className="text-3xl font-bold text-gray-900">{chatStats.total}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquare className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Active Chats</p>
                                    <p className="text-3xl font-bold text-gray-900">{chatStats.active}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Activity className="w-8 h-8 text-green-600 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Unread Messages</p>
                                    <p className="text-3xl font-bold text-gray-900">{chatStats.unread}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Bell className="w-8 h-8 text-red-600 animate-bounce" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="rounded-2xl bg-white shadow-xl p-6 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="input pl-12 pr-4 py-3 w-full border-2 border-gray-200 focus:border-indigo-500 rounded-xl transition-all duration-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                                <Filter className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className="space-y-4">
                        {filteredChats.length === 0 ? (
                            <div className="rounded-3xl bg-white shadow-2xl p-16 text-center animate-fade-in">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 animate-bounce-in">
                                    <MessageCircle className="w-12 h-12 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {searchTerm ? 'No matching conversations' : 'No chats yet'}
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms'
                                        : isAdmin 
                                        ? 'Customer conversations will appear here'
                                        : 'Start by creating an order to begin chatting with support'
                                    }
                                </p>
                                {!isAdmin && !searchTerm && (
                                    <Link
                                        href="/orders/create"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Your First Order
                                    </Link>
                                )}
                            </div>
                        ) : (
                            filteredChats.map((chat, index) => {
                                const unreadCount = getUnreadCount(chat);
                                const isUnread = unreadCount > 0;
                                
                                return (
                                    <Link
                                        key={chat.id}
                                        href={`/chats/${chat.id}`}
                                        className="group block animate-slide-up"
                                        style={{animationDelay: `${index * 0.05}s`}}
                                        onMouseEnter={() => setHoveredChat(chat.id)}
                                        onMouseLeave={() => setHoveredChat(null)}
                                    >
                                        <div className={`relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 p-6 ${
                                            isUnread ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                                        }`}>
                                            {/* Gradient Background Effect */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${getStatusColor(chat.status)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                            
                                            {/* Status Indicator Bar */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusColor(chat.status)}`}></div>
                                            
                                            <div className="relative flex items-start justify-between">
                                                <div className="flex-1 flex items-start space-x-4">
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-14 h-14 bg-gradient-to-br ${getStatusColor(chat.status)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                            {isAdmin ? (
                                                                <User className="w-7 h-7 text-white" />
                                                            ) : (
                                                                <Package className="w-7 h-7 text-white" />
                                                            )}
                                                        </div>
                                                        {/* Online Status */}
                                                        {chat.status === 'active' && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0">
                                                        {/* Chat Title */}
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                                                                {isAdmin 
                                                                    ? `${chat.user?.name || 'Unknown User'}` 
                                                                    : `Order #${chat.order?.order_number || 'N/A'}`
                                                                }
                                                            </h3>
                                                            {hoveredChat === chat.id && (
                                                                <ArrowRight className="w-5 h-5 text-indigo-600 animate-slide-left" />
                                                            )}
                                                        </div>
                                                        
                                                        {/* Last Message */}
                                                        <p className="text-gray-700 mb-3 group-hover:text-gray-900 transition-colors duration-200 leading-relaxed">
                                                            {formatLastMessage(chat)}
                                                        </p>
                                                        
                                                        {/* Chat Meta Info */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-4">
                                                                {/* Order Status */}
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getOrderStatusColor(chat.order?.status)}`}>
                                                                    <Package className="w-3 h-3 mr-1" />
                                                                    {chat.order?.status || 'No Order'}
                                                                </span>
                                                                
                                                                {/* Last Activity */}
                                                                <span className="text-xs text-gray-500 flex items-center">
                                                                    <Clock className="w-3 h-3 mr-1" />
                                                                    {chat.last_message_at 
                                                                        ? new Date(chat.last_message_at).toLocaleDateString('en-US', {
                                                                            month: 'short',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })
                                                                        : 'No activity'
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Area */}
                                                <div className="flex flex-col items-end space-y-2">
                                                    {/* Chat Status */}
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                        chat.status === 'active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : chat.status === 'closed'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        <Activity className={`w-3 h-3 mr-1 ${chat.status === 'active' ? 'animate-pulse' : ''}`} />
                                                        {chat.status.toUpperCase()}
                                                    </span>
                                                    
                                                    {/* Unread Badge */}
                                                    {isUnread && (
                                                        <div className="relative">
                                                            <div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full animate-pulse shadow-lg">
                                                                {unreadCount} new
                                                            </div>
                                                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Action Button */}
                                                    <button className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 font-semibold rounded-lg border border-indigo-200 hover:border-indigo-300 hover:shadow transform hover:scale-105 transition-all duration-300">
                                                        <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                        View Chat
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Animated Border Effect */}
                                            {hoveredChat === chat.id && (
                                                <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50 animate-pulse"></div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}