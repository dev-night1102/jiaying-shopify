import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    MessageSquare, 
    Package, 
    ArrowRight, 
    Send,
    Sparkles,
    Clock,
    DollarSign,
    User,
    CheckCircle,
    MessageCircle
} from 'lucide-react';
import { useState } from 'react';

export default function ChatCreate({ auth, orders = [] }) {
    const { t } = useTranslation();
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const { data, setData, post, processing, errors } = useForm({
        order_id: '',
        content: 'Hello! I would like to start a chat about my order.',
        type: 'text'
    });

    const submit = (e) => {
        e.preventDefault();
        if (!selectedOrder) return;
        
        setData('order_id', selectedOrder.id);
        post('/chats');
    };

    const selectOrder = (order) => {
        setSelectedOrder(order);
        setData('order_id', order.id);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('Start New Chat')} />

            {/* Background */}
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

            {/* Floating Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative z-10 py-12 space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 shadow-2xl mb-8 animate-slide-down">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        
                        <div className="relative text-center">
                            <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
                                <MessageCircle className="w-12 h-12 mr-4 animate-bounce" />
                                Start New Chat
                            </h1>
                            <p className="text-xl text-white/90">
                                Select an order to start chatting with our support team
                            </p>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        /* No Orders Available */
                        <div className="rounded-3xl bg-white shadow-2xl p-16 text-center animate-slide-up">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 animate-bounce-in">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                No Orders Available
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                You need to have an order to start a chat. Create your first order to get started.
                            </p>
                            <a
                                href="/orders/create"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Package className="w-5 h-5 mr-2" />
                                Create First Order
                                <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                            </a>
                        </div>
                    ) : (
                        <>
                            {/* Order Selection */}
                            <div className="rounded-3xl bg-white shadow-2xl overflow-hidden mb-8 animate-slide-up">
                                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Package className="w-7 h-7 mr-3 text-blue-600" />
                                        Select Order
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Choose the order you want to chat about
                                    </p>
                                </div>
                                
                                <div className="p-8 space-y-4">
                                    {orders.map((order, index) => (
                                        <div 
                                            key={order.id}
                                            onClick={() => selectOrder(order)}
                                            className={`group relative overflow-hidden rounded-2xl p-6 cursor-pointer transform hover:scale-[1.02] transition-all duration-300 animate-slide-up ${
                                                selectedOrder?.id === order.id
                                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg'
                                                    : 'bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg'
                                            }`}
                                            style={{animationDelay: `${index * 0.1}s`}}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-2xl ${
                                                        selectedOrder?.id === order.id
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'
                                                    }`}>
                                                        <Package className="w-6 h-6" />
                                                    </div>
                                                    
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg">
                                                            Order #{order.order_number}
                                                        </h3>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                                            <span className="flex items-center">
                                                                <Clock className="w-4 h-4 mr-1" />
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </span>
                                                            {order.total_cost && (
                                                                <span className="flex items-center text-green-600 font-medium">
                                                                    <DollarSign className="w-4 h-4 mr-1" />
                                                                    {order.total_cost}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {order.product_link && (
                                                            <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                                                                {order.product_link}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                                                        order.status === 'quoted' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {order.status?.toUpperCase()}
                                                    </span>
                                                    
                                                    {selectedOrder?.id === order.id && (
                                                        <CheckCircle className="w-6 h-6 text-blue-500 animate-bounce" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Form */}
                            {selectedOrder && (
                                <div className="rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up" style={{animationDelay: '0.3s'}}>
                                    <div className="px-8 py-6 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                            <MessageSquare className="w-7 h-7 mr-3 text-green-600" />
                                            Start Chat
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            Send your first message about Order #{selectedOrder.order_number}
                                        </p>
                                    </div>
                                    
                                    <form onSubmit={submit} className="p-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                    Initial Message
                                                </label>
                                                <textarea
                                                    value={data.content}
                                                    onChange={(e) => setData('content', e.target.value)}
                                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 focus:border-green-500 hover:border-gray-300 bg-gray-50 focus:bg-white resize-none"
                                                    rows="4"
                                                    placeholder="Type your message about this order..."
                                                />
                                                {errors.content && (
                                                    <p className="text-sm text-red-600 font-medium mt-2 animate-slide-down">{errors.content}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={() => window.history.back()}
                                                    className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                                                >
                                                    Cancel
                                                </button>
                                                
                                                <button
                                                    type="submit"
                                                    disabled={processing || !selectedOrder}
                                                    className="group relative flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                                                >
                                                    <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    <div className="relative flex items-center">
                                                        {processing ? (
                                                            <>
                                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                                                Starting Chat...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="w-5 h-5 mr-3" />
                                                                Start Chat
                                                                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                                            </>
                                                        )}
                                                    </div>
                                                    <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}