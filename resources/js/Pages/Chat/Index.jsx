import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import { useState, useEffect } from 'react';
import {
    MessageSquare,
    Plus,
    Search,
    Filter,
    Clock,
    User,
    Users,
    CheckCircle,
    AlertCircle,
    MessageCircle,
    ArrowRight,
    Sparkles,
    Activity,
    Star,
    Calendar,
    Package,
    Zap,
    Eye
} from 'lucide-react';

export default function ChatIndex({ auth, chats = [], isAdmin = false }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const filteredChats = chats.filter(chat => {
        const matchesSearch = !searchTerm || 
            (chat.order?.order_number && chat.order.order_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (chat.user?.name && chat.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (chat.last_message?.content && chat.last_message.content.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filterStatus === 'all' || chat.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'closed': return AlertCircle;
            case 'pending': return Clock;
            default: return MessageCircle;
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('Support Chats')} />

            {/* Background */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            </div>

            {/* Floating Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 py-12 space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 p-10 shadow-2xl mb-8 transition-all duration-1000 ${
                        isVisible ? 'animate-slide-down' : 'opacity-0 translate-y-20'
                    }`}>
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-3 flex items-center">
                                        <MessageSquare className="w-12 h-12 mr-4 animate-bounce" />
                                        Support Chats
                                    </h1>
                                    <p className="text-xl text-white/90">
                                        {isAdmin ? 'Manage customer conversations' : 'Your support conversations'}
                                    </p>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    {/* Stats */}
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
                                        <div className="text-3xl font-bold text-white">{chats.length}</div>
                                        <div className="text-sm text-white/80">Total Chats</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center">
                                        <div className="text-3xl font-bold text-white">
                                            {chats.filter(c => c.status === 'active').length}
                                        </div>
                                        <div className="text-sm text-white/80">Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className={`rounded-2xl bg-white shadow-xl p-6 mb-8 transition-all duration-1000 ${
                        isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-20'
                    }`} style={{animationDelay: '0.2s'}}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search chats, orders, or messages..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                                    />
                                </div>
                                
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-200"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            <Link
                                href="/chats/create"
                                className="group relative flex items-center px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Start New Chat
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>
                        </div>
                    </div>

                    {/* Chat List */}
                    <div className={`rounded-3xl bg-white shadow-2xl overflow-hidden transition-all duration-1000 ${
                        isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-20'
                    }`} style={{animationDelay: '0.4s'}}>
                        {filteredChats.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredChats.map((chat, index) => {
                                    const StatusIcon = getStatusIcon(chat.status);
                                    const hasUnread = chat.messages_count > 0 && !chat.is_read;
                                    
                                    return (
                                        <Link
                                            key={chat.id}
                                            href={`/chats/${chat.id}`}
                                            className="group block p-6 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 animate-slide-up"
                                            style={{animationDelay: `${index * 0.05}s`}}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    {/* Avatar */}
                                                    <div className="relative">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                            {isAdmin ? (
                                                                <User className="w-7 h-7 text-indigo-600" />
                                                            ) : (
                                                                <Users className="w-7 h-7 text-indigo-600" />
                                                            )}
                                                        </div>
                                                        {chat.status === 'active' && (
                                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                                                        )}
                                                    </div>

                                                    {/* Chat Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3 mb-2">
                                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                                {isAdmin && chat.user ? (
                                                                    `${chat.user.name}`
                                                                ) : (
                                                                    `Order #${chat.order?.order_number || 'N/A'}`
                                                                )}
                                                            </h3>
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(chat.status)}`}>
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {chat.status.toUpperCase()}
                                                            </div>
                                                            {hasUnread && (
                                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                                            <span className="flex items-center">
                                                                <Package className="w-4 h-4 mr-1" />
                                                                Order #{chat.order?.order_number || 'N/A'}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {new Date(chat.updated_at).toLocaleDateString()}
                                                            </span>
                                                            <span className="flex items-center">
                                                                <Activity className="w-4 h-4 mr-1" />
                                                                {chat.messages_count || 0} messages
                                                            </span>
                                                        </div>

                                                        <p className="text-gray-600 truncate max-w-md group-hover:text-gray-700 transition-colors duration-200">
                                                            {chat.last_message?.content || (
                                                                <span className="italic text-gray-400">No messages yet</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Right Side */}
                                                <div className="flex items-center space-x-4 ml-4">
                                                    <div className="text-right">
                                                        <div className="text-xs text-gray-500 mb-1">Last activity</div>
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {new Date(chat.last_message_at || chat.updated_at).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="group/btn p-2 hover:bg-indigo-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <ArrowRight className="w-5 h-5 text-indigo-600 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 animate-bounce-in">
                                    <MessageSquare className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {searchTerm || filterStatus !== 'all' ? 'No chats found' : 'No chats yet'}
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    {searchTerm || filterStatus !== 'all' 
                                        ? 'Try adjusting your search or filter criteria'
                                        : isAdmin 
                                            ? 'Customers will appear here when they start conversations'
                                            : 'Start your first conversation with our support team'
                                    }
                                </p>
                                {(!searchTerm && filterStatus === 'all') && (
                                    <Link
                                        href="/chats/create"
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Start Your First Chat
                                        <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 transition-all duration-1000 ${
                        isVisible ? 'animate-slide-up' : 'opacity-0 translate-y-20'
                    }`} style={{animationDelay: '0.6s'}}>
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Response Time</p>
                                    <p className="text-2xl font-bold text-gray-900">~2 min</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-2xl font-bold text-gray-900">4.9</p>
                                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                    </div>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                    <Star className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Available</p>
                                    <p className="text-2xl font-bold text-gray-900">24/7</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-xl">
                                    <Clock className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}