import { Head, Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Package, 
    ShoppingCart, 
    CheckCircle, 
    DollarSign, 
    Plus, 
    MessageSquare,
    TrendingUp,
    Clock,
    Star,
    ArrowUpRight,
    Activity,
    Zap,
    Globe,
    Award,
    Sparkles
} from 'lucide-react';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect, useMemo } from 'react';

export default function Dashboard({ auth, stats = {}, recentOrders = [], membership }) {
    const { t } = useTranslation();
    const [animatedValues, setAnimatedValues] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    
    // Provide default values for stats - memoized to prevent re-creation
    const defaultStats = useMemo(() => ({
        totalOrders: stats?.totalOrders || 0,
        activeOrders: stats?.activeOrders || 0,
        completedOrders: stats?.completedOrders || 0,
        balance: stats?.balance || '0.00'
    }), [stats?.totalOrders, stats?.activeOrders, stats?.completedOrders, stats?.balance]);

    // Animate counter effect
    useEffect(() => {
        setIsVisible(true);
        const duration = 2000;
        const steps = 60;
        const interval = Math.max(duration / steps, 16); // Minimum 16ms for 60fps
        
        const animations = {};
        Object.keys(defaultStats).forEach(key => {
            if (typeof defaultStats[key] === 'number' && defaultStats[key] > 0) {
                let current = 0;
                const target = defaultStats[key];
                const increment = target / steps;
                
                const timer = setInterval(() => {
                    current = Math.min(current + increment, target);
                    setAnimatedValues(prev => ({...prev, [key]: Math.floor(current)}));
                    
                    if (current >= target) {
                        clearInterval(timer);
                        setAnimatedValues(prev => ({...prev, [key]: target}));
                    }
                }, interval);
                
                animations[key] = timer;
            }
        });
        
        return () => Object.values(animations).forEach(clearInterval);
    }, [defaultStats]);

    const statCards = [
        {
            title: t('Total Orders'),
            value: animatedValues.totalOrders || 0,
            icon: Package,
            gradient: 'from-emerald-500 to-teal-500',
            shadowColor: 'shadow-emerald-500/30',
            iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-400',
            trend: '+12%',
            trendUp: true
        },
        {
            title: t('Active Orders'),
            value: animatedValues.activeOrders || 0,
            icon: ShoppingCart,
            gradient: 'from-teal-500 to-blue-500',
            shadowColor: 'shadow-teal-500/30',
            iconBg: 'bg-gradient-to-br from-teal-400 to-blue-400',
            trend: '+5%',
            trendUp: true
        },
        {
            title: t('Completed Orders'),
            value: animatedValues.completedOrders || 0,
            icon: CheckCircle,
            gradient: 'from-blue-500 to-cyan-500',
            shadowColor: 'shadow-blue-500/30',
            iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-400',
            trend: '+18%',
            trendUp: true
        },
        {
            title: t('Account Balance'),
            value: `$${defaultStats.balance}`,
            icon: DollarSign,
            gradient: 'from-cyan-500 to-emerald-500',
            shadowColor: 'shadow-cyan-500/30',
            iconBg: 'bg-gradient-to-br from-cyan-400 to-emerald-400',
            trend: '+8%',
            trendUp: true
        },
    ];

    // Background shapes for visual interest
    const backgroundShapes = [
        { size: 300, top: '10%', left: '5%', delay: 0 },
        { size: 200, top: '60%', right: '10%', delay: 2 },
        { size: 150, bottom: '20%', left: '15%', delay: 4 },
        { size: 250, top: '30%', right: '30%', delay: 1 },
    ];

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('Dashboard')} />

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {backgroundShapes.map((shape, index) => (
                    <div
                        key={index}
                        className="absolute rounded-full opacity-5 animate-float"
                        style={{
                            width: shape.size,
                            height: shape.size,
                            background: `radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(59,130,246,0.1) 100%)`,
                            top: shape.top,
                            left: shape.left,
                            right: shape.right,
                            bottom: shape.bottom,
                            animationDelay: `${shape.delay}s`,
                            animationDuration: '20s'
                        }}
                    />
                ))}
            </div>

            <div className="relative space-y-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-8 shadow-2xl">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                    
                    <div className="relative flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
                                {t('Welcome back')}, {auth?.user?.name}! ✨
                            </h1>
                            <p className="text-white/80 text-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
                                {t('Here\'s your business overview for today')}
                            </p>
                        </div>
                        <div className="flex space-x-3 animate-slide-left">
                            <Link
                                href="/orders/create"
                                className="group relative inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                                {t('Submit Order')}
                                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
                            </Link>
                            <Link
                                href="/chats"
                                className="group inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
                            >
                                <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                {t('Chats')}
                            </Link>
                            <Link
                                href="/memberships"
                                className="group inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
                            >
                                <Award className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                                {t('Memberships')}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Membership Status Card */}
                {membership && (
                    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${
                        membership.type === 'premium' ? 'from-yellow-400 via-amber-500 to-orange-500' : 
                        membership.type === 'vip' ? 'from-purple-600 via-pink-600 to-red-600' :
                        'from-gray-600 to-gray-700'
                    } p-6 shadow-xl transform hover:scale-[1.02] transition-all duration-300 animate-slide-up`}>
                        <div className="absolute inset-0 bg-white opacity-5"></div>
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full opacity-10 animate-pulse"></div>
                        
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
                                    <Star className="w-8 h-8 text-white animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {t('Membership Status')}
                                    </h3>
                                    <div className="flex items-center space-x-3">
                                        <span className="px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-white font-semibold text-sm">
                                            {membership.type.toUpperCase()}
                                        </span>
                                        <span className="text-white/90 text-sm flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            {membership.days_remaining} {t('days remaining')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {membership.type === 'trial' && (
                                <Link
                                    href="/memberships"
                                    className="group inline-flex items-center px-6 py-3 bg-white text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <Zap className="w-5 h-5 mr-2 text-yellow-500 group-hover:animate-bounce" />
                                    {t('Upgrade Now')}
                                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Stats Grid with Modern Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <div 
                            key={index} 
                            className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-2xl ${stat.shadowColor} transform hover:scale-105 transition-all duration-500 animate-slide-up cursor-pointer`}
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            {/* Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                            
                            {/* Animated Circle */}
                            <div className={`absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 ${stat.iconBg} rounded-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {stat.trend && (
                                        <div className={`flex items-center text-sm font-semibold ${stat.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                            <TrendingUp className={`w-4 h-4 mr-1 ${!stat.trendUp && 'rotate-180'}`} />
                                            {stat.trend}
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                    {stat.value}
                                </p>
                                
                                {/* Activity Indicator */}
                                <div className="mt-4 flex items-center space-x-1">
                                    <Activity className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full animate-pulse`}
                                            style={{width: `${75 + index * 5}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Orders with Enhanced Design */}
                <div className="rounded-2xl bg-white shadow-xl overflow-hidden animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {t('Recent Orders')}
                                </h3>
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full animate-pulse">
                                    LIVE
                                </span>
                            </div>
                            <Link
                                href="/orders"
                                className="group inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-200"
                            >
                                {t('View All')}
                                <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                            </Link>
                        </div>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order, index) => (
                                <div 
                                    key={order.id} 
                                    className="group px-8 py-5 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 animate-fade-in"
                                    style={{animationDelay: `${index * 0.05}s`}}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 flex items-center space-x-4">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Package className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                {order.status === 'active' && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        #{order.order_number}
                                                    </p>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <p className="text-sm text-gray-600 truncate max-w-md group-hover:text-gray-700 transition-colors duration-200">
                                                    {order.product_link}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-1">
                                                    <p className="text-xs text-gray-500 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                    {order.tracking_number && (
                                                        <p className="text-xs text-indigo-600 flex items-center">
                                                            <Globe className="w-3 h-3 mr-1" />
                                                            Tracking Available
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4">
                                            {order.total_cost && (
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 mb-1">Total</p>
                                                    <span className="text-lg font-bold bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent">
                                                        ${order.total_cost}
                                                    </span>
                                                </div>
                                            )}
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="group/btn inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-lg shadow hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                            >
                                                {t('View')}
                                                <ArrowUpRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-8 py-16 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4 animate-bounce-in">
                                    <Package className="w-10 h-10 text-indigo-600" />
                                </div>
                                <p className="text-gray-500 mb-6 text-lg">{t('No orders yet')}</p>
                                <Link
                                    href="/orders/create"
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    {t('Submit Your First Order')}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}