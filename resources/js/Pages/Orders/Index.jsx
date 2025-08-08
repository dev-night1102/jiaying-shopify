import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Package, 
    Plus, 
    Search, 
    Filter, 
    ShoppingBag,
    Clock,
    DollarSign,
    Truck,
    CheckCircle,
    MessageCircle,
    Eye,
    CreditCard,
    TrendingUp,
    Calendar,
    ArrowRight,
    Sparkles,
    Globe,
    Activity,
    Box
} from 'lucide-react';

export default function OrdersIndex({ auth, orders = [], filters = {} }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredOrder, setHoveredOrder] = useState(null);

    const handleFilter = () => {
        setIsLoading(true);
        router.get('/orders', { search, status }, { 
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    // Auto-search after typing stops
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== filters.search) {
                handleFilter();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const statusOptions = [
        { value: '', label: t('All'), icon: Package, color: 'gray' },
        { value: 'requested', label: t('Requested'), icon: ShoppingBag, color: 'blue' },
        { value: 'quoted', label: t('Quoted'), icon: DollarSign, color: 'yellow' },
        { value: 'accepted', label: t('Accepted'), icon: CheckCircle, color: 'green' },
        { value: 'paid', label: t('Paid'), icon: CreditCard, color: 'purple' },
        { value: 'purchased', label: t('Purchased'), icon: Box, color: 'indigo' },
        { value: 'shipped', label: t('Shipped'), icon: Truck, color: 'orange' },
        { value: 'delivered', label: t('Delivered'), icon: CheckCircle, color: 'emerald' },
    ];

    const getStatusIcon = (orderStatus) => {
        const option = statusOptions.find(opt => opt.value === orderStatus);
        return option ? option.icon : Package;
    };

    const getStatusColor = (orderStatus) => {
        const option = statusOptions.find(opt => opt.value === orderStatus);
        return option ? option.color : 'gray';
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('Orders')} />

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
            </div>

            <div className="relative space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header with Gradient Background */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-8 shadow-2xl animate-slide-down">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                    
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                                <Box className="w-10 h-10 mr-3 animate-bounce" />
                                {t('Your Orders')}
                            </h1>
                            <p className="text-white/80 text-lg">
                                {t('Track and manage all your shopping requests')}
                            </p>
                        </div>
                        <Link 
                            href="/orders/create" 
                            className="group relative inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                            {t('Submit Order')}
                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                        </Link>
                    </div>
                </div>

                {/* Advanced Filter Section */}
                <div className="rounded-2xl bg-white shadow-xl p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-emerald-600" />
                            {t('Filter & Search')}
                        </h2>
                        {isLoading && (
                            <div className="flex items-center text-emerald-600">
                                <div className="spinner spinner-sm mr-2"></div>
                                <span className="text-sm">{t('Loading...')}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200" />
                                <input
                                    type="text"
                                    placeholder={t('Search by order number, product, or link...')}
                                    className="input pl-12 pr-4 py-3 w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl transition-all duration-200 hover:border-gray-300"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="sm:w-64">
                            <div className="relative">
                                <select
                                    className="input px-4 py-3 pr-10 w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl appearance-none cursor-pointer transition-all duration-200 hover:border-gray-300 font-medium"
                                    value={status}
                                    onChange={(e) => { setStatus(e.target.value); handleFilter(); }}
                                >
                                    {statusOptions.map(option => {
                                        const Icon = option.icon;
                                        return (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        );
                                    })}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleFilter} 
                            className="btn bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            {t('Apply Filters')}
                        </button>
                    </div>
                </div>

                {/* Orders List with Modern Cards */}
                <div className="space-y-4">
                    {orders.data.length > 0 ? (
                        <>
                            {/* Stats Summary */}
                            <div className="grid grid-cols-4 gap-4 mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('Total Orders')}</p>
                                            <p className="text-2xl font-bold text-gray-900">{orders.total}</p>
                                        </div>
                                        <Package className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('Active')}</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {orders.data.filter(o => ['requested', 'quoted', 'accepted', 'paid', 'purchased', 'shipped'].includes(o.status)).length}
                                            </p>
                                        </div>
                                        <Activity className="w-8 h-8 text-green-600" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl p-4 border border-teal-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('Completed')}</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {orders.data.filter(o => o.status === 'delivered').length}
                                            </p>
                                        </div>
                                        <CheckCircle className="w-8 h-8 text-teal-600" />
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl p-4 border border-amber-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('This Month')}</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {orders.data.filter(o => {
                                                    const orderDate = new Date(o.created_at);
                                                    const now = new Date();
                                                    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
                                                }).length}
                                            </p>
                                        </div>
                                        <Calendar className="w-8 h-8 text-amber-600" />
                                    </div>
                                </div>
                            </div>

                            {/* Orders Grid */}
                            <div className="grid gap-4">
                                {orders.data.map((order, index) => {
                                    const StatusIcon = getStatusIcon(order.status);
                                    const statusColor = getStatusColor(order.status);
                                    
                                    return (
                                        <div 
                                            key={order.id} 
                                            className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform transition-all duration-500 animate-slide-up hover:scale-[1.02] cursor-pointer`}
                                            style={{animationDelay: `${Math.min(index * 0.05, 0.5)}s`}}
                                            onMouseEnter={() => setHoveredOrder(order.id)}
                                            onMouseLeave={() => setHoveredOrder(null)}
                                        >
                                            {/* Gradient Border Effect */}
                                            <div className={`absolute inset-0 bg-gradient-to-r from-${statusColor}-400 to-${statusColor}-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                                            
                                            {/* Status Indicator Bar */}
                                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${statusColor}-400 to-${statusColor}-600`}></div>
                                            
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-4 mb-3">
                                                            <div className={`p-3 bg-gradient-to-br from-${statusColor}-100 to-${statusColor}-200 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                                                <StatusIcon className={`w-6 h-6 text-${statusColor}-600`} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                                                    #{order.order_number}
                                                                    {hoveredOrder === order.id && (
                                                                        <ArrowRight className="w-5 h-5 ml-2 text-purple-600 animate-slide-left" />
                                                                    )}
                                                                </h3>
                                                                <div className="flex items-center space-x-2 mt-1">
                                                                    <StatusBadge status={order.status} />
                                                                    {order.is_urgent && (
                                                                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">
                                                                            URGENT
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2">
                                                            <p className="text-gray-700 font-medium truncate max-w-2xl group-hover:text-gray-900 transition-colors duration-200">
                                                                <Globe className="inline w-4 h-4 mr-2 text-gray-400" />
                                                                {order.product_link}
                                                            </p>
                                                            
                                                            <div className="flex items-center space-x-6 text-sm">
                                                                <span className="flex items-center text-gray-500">
                                                                    <Calendar className="w-4 h-4 mr-1" />
                                                                    {new Date(order.created_at).toLocaleDateString('en-US', { 
                                                                        year: 'numeric', 
                                                                        month: 'short', 
                                                                        day: 'numeric' 
                                                                    })}
                                                                </span>
                                                                {order.total_cost && (
                                                                    <span className="flex items-center font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                                        <DollarSign className="w-5 h-5 mr-1 text-green-600" />
                                                                        {order.total_cost}
                                                                    </span>
                                                                )}
                                                                {order.tracking_number && (
                                                                    <span className="flex items-center text-indigo-600">
                                                                        <Truck className="w-4 h-4 mr-1" />
                                                                        {t('Tracking Available')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            {order.notes && (
                                                                <p className="text-sm text-gray-600 italic bg-gray-50 rounded-lg p-2 mt-2">
                                                                    "{order.notes}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        {order.status === 'quoted' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.post(`/orders/${order.id}/accept`);
                                                                }}
                                                                className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                                {t('Accept Quote')}
                                                            </button>
                                                        )}
                                                        {order.status === 'accepted' && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    router.post(`/orders/${order.id}/pay`);
                                                                }}
                                                                className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                                            >
                                                                <CreditCard className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                                                                {t('Pay Now')}
                                                            </button>
                                                        )}
                                                        {order.chat_id && (
                                                            <Link
                                                                href={`/chats/${order.chat_id}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 font-semibold rounded-lg border border-indigo-200 hover:border-indigo-300 hover:shadow transform hover:scale-105 transition-all duration-300"
                                                            >
                                                                <MessageCircle className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                                {t('Chat')}
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow transform hover:scale-105 transition-all duration-300"
                                                        >
                                                            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                                                            {t('View Details')}
                                                        </Link>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress Bar */}
                                                <div className="mt-4">
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                        <span>{t('Order Progress')}</span>
                                                        <span className="font-semibold">{getOrderProgress(order.status)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className={`h-full bg-gradient-to-r from-${statusColor}-400 to-${statusColor}-600 rounded-full transition-all duration-1000 ease-out`}
                                                            style={{width: `${getOrderProgress(order.status)}%`}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="rounded-2xl bg-white shadow-xl p-16 text-center animate-fade-in">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6 animate-bounce-in">
                                <Package className="w-12 h-12 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                {t('No orders found')}
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                {t('Start your global shopping journey by submitting your first order request')}
                            </p>
                            <Link 
                                href="/orders/create" 
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                {t('Submit Your First Order')}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {orders.data.length > 0 && (
                    <div className="rounded-xl bg-white shadow-lg p-4 animate-slide-up" style={{animationDelay: '0.3s'}}>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 font-medium">
                                <span className="text-purple-600 font-bold">{orders.from}</span> - <span className="text-purple-600 font-bold">{orders.to}</span> {t('of')} <span className="text-purple-600 font-bold">{orders.total}</span> {t('orders')}
                            </div>
                            <div className="flex items-center space-x-2">
                                {orders.links.map((link, index) => {
                                    const isNumber = !isNaN(link.label.replace('&laquo;', '').replace('&raquo;', ''));
                                    const isPrev = link.label.includes('&laquo;');
                                    const isNext = link.label.includes('&raquo;');
                                    
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`
                                                ${link.active 
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110' 
                                                    : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-purple-400 hover:shadow'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }
                                                ${isNumber ? 'w-10 h-10' : 'px-4 py-2'}
                                                rounded-lg font-semibold text-sm
                                                flex items-center justify-center
                                                transition-all duration-200
                                                ${link.url ? 'hover:scale-105 transform' : ''}
                                            `}
                                            dangerouslySetInnerHTML={{ 
                                                __html: link.label
                                                    .replace('&laquo;', '←')
                                                    .replace('&raquo;', '→')
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

// Helper function to calculate order progress
function getOrderProgress(status) {
    const progressMap = {
        'requested': 12.5,
        'quoted': 25,
        'accepted': 37.5,
        'paid': 50,
        'purchased': 62.5,
        'shipped': 75,
        'in_transit': 87.5,
        'delivered': 100,
        'cancelled': 0,
    };
    return progressMap[status] || 0;
}