import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import StatusBadge from '@/Components/StatusBadge';
import { 
    Users, 
    Package, 
    DollarSign, 
    TrendingUp, 
    Clock, 
    CheckCircle,
    AlertCircle,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Eye,
    ExternalLink,
    Activity,
    Target,
    Award,
    Globe
} from 'lucide-react';

// Simple chart components for basic data visualization
const SimpleBarChart = ({ data, color = "emerald" }) => {
    if (!data || data.length === 0) return <div className="text-gray-500 text-sm">No data available</div>;
    
    const maxValue = Math.max(...data.map(d => d.orders));
    
    return (
        <div className="flex items-end justify-between h-32 space-x-2">
            {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                        className={`w-full bg-${color}-500 rounded-t-sm transition-all duration-300 hover:bg-${color}-600`}
                        style={{
                            height: `${(item.orders / maxValue) * 100}%`,
                            minHeight: item.orders > 0 ? '8px' : '2px'
                        }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{item.month}</span>
                </div>
            ))}
        </div>
    );
};

const SimpleLineChart = ({ data, color = "teal" }) => {
    if (!data || data.length === 0) return <div className="text-gray-500 text-sm">No data available</div>;
    
    const maxValue = Math.max(...data.map(d => d.revenue));
    const points = data.map((item, index) => ({
        x: (index / (data.length - 1)) * 100,
        y: 100 - ((item.revenue / maxValue) * 100)
    }));
    
    const pathD = points.reduce((acc, point, index) => {
        return acc + `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }, '');
    
    return (
        <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <path
                    d={pathD}
                    fill="none"
                    stroke={`rgb(20 184 166)`} // teal-500
                    strokeWidth="2"
                    className="drop-shadow-sm"
                />
                {points.map((point, index) => (
                    <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="1.5"
                        fill={`rgb(20 184 166)`}
                        className="drop-shadow-sm"
                    />
                ))}
            </svg>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                {data.map((item, index) => (
                    <span key={index}>{item.month}</span>
                ))}
            </div>
        </div>
    );
};

export default function AdminDashboard({ 
    auth, 
    stats = {}, 
    chartData = {},
    recentOrders = [], 
    pendingQuotes = [] 
}) {
    const { t } = useTranslation();
    
    // Stats cards configuration
    const statsCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'emerald',
            growth: stats.userGrowth || 0,
            description: 'Active customers'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders || 0,
            icon: Package,
            color: 'teal',
            growth: stats.orderGrowth || 0,
            description: 'All time orders'
        },
        {
            title: 'Total Revenue',
            value: `$${(stats.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'blue',
            growth: 12.5,
            description: 'Lifetime earnings'
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversionRate || 0}%`,
            icon: Target,
            color: 'purple',
            growth: 3.2,
            description: 'Orders completed'
        }
    ];

    const formatGrowth = (growth) => {
        const isPositive = growth > 0;
        return (
            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="font-medium">{Math.abs(growth)}%</span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Admin Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Activity className="w-8 h-8 mr-3 text-emerald-600" />
                                    Admin Dashboard
                                </h1>
                                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((card, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-${card.color}-100`}>
                                        <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                                    </div>
                                    {formatGrowth(card.growth)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Orders Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                                        Orders Overview
                                    </h3>
                                    <p className="text-sm text-gray-600">Monthly order trends</p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Last 6 months
                                </div>
                            </div>
                            <SimpleBarChart data={chartData.monthlyOrders} color="emerald" />
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-teal-600" />
                                        Revenue Trends
                                    </h3>
                                    <p className="text-sm text-gray-600">Monthly revenue performance</p>
                                </div>
                                <div className="text-sm font-medium text-teal-600">
                                    ${(stats.monthlyRevenue || 0).toLocaleString()}
                                </div>
                            </div>
                            <SimpleLineChart data={chartData.monthlyRevenue} color="teal" />
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Quotes</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingQuotes || 0}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Orders</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.activeOrders || 0}</p>
                                </div>
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Completed Orders</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.completedOrders || 0}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                        {/* Recent Orders */}
                        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <Package className="w-5 h-5 mr-2 text-emerald-600" />
                                        Recent Orders
                                    </h3>
                                    <Link 
                                        href="/admin/orders"
                                        className="text-sm text-emerald-600 hover:text-emerald-800 flex items-center"
                                    >
                                        View all <ArrowUpRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {recentOrders.length > 0 ? recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                                    {order.user_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{order.order_number}</p>
                                                    <p className="text-sm text-gray-600">{order.user_name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={order.status} />
                                                {order.total_cost && (
                                                    <p className="text-sm font-medium mt-1 text-gray-900">
                                                        ${order.total_cost.toLocaleString()}
                                                    </p>
                                                )}
                                                <div className="flex items-center mt-1">
                                                    <Link 
                                                        href={`/admin/orders/${order.id}`}
                                                        className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center"
                                                    >
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No recent orders</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pending Quotes */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                                    Pending Quotes
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Orders waiting for quotation</p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {pendingQuotes.length > 0 ? pendingQuotes.map((quote) => (
                                        <div key={quote.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-gray-900">{quote.order_number}</p>
                                                <span className="text-xs font-medium text-yellow-800 bg-yellow-200 px-2 py-1 rounded-full">
                                                    {quote.days_waiting} days
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{quote.user_name}</p>
                                            <p className="text-xs text-gray-500 mb-3">
                                                {new Date(quote.created_at).toLocaleDateString()}
                                            </p>
                                            <div className="flex items-center space-x-2">
                                                <Link 
                                                    href={`/admin/orders/${quote.id}`}
                                                    className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 transition-colors"
                                                >
                                                    Create Quote
                                                </Link>
                                                {quote.product_link && (
                                                    <a 
                                                        href={quote.product_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-gray-600 hover:text-gray-800 flex items-center"
                                                    >
                                                        <ExternalLink className="w-3 h-3 mr-1" />
                                                        View Product
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8">
                                            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                                            <p className="text-gray-500">No pending quotes</p>
                                            <p className="text-xs text-gray-400">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link 
                                href="/admin/orders" 
                                className="group p-6 border border-gray-200 rounded-lg hover:border-emerald-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                        <Package className="w-5 h-5 text-emerald-600" />
                                    </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Manage Orders</h4>
                                <p className="text-sm text-gray-600">View and process customer orders</p>
                            </Link>

                            <Link 
                                href="/admin/users" 
                                className="group p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                                        <Users className="w-5 h-5 text-teal-600" />
                                    </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Manage Users</h4>
                                <p className="text-sm text-gray-600">View user accounts and activity</p>
                            </Link>

                            <Link 
                                href="/admin/chats" 
                                className="group p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <Globe className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Support</h4>
                                <p className="text-sm text-gray-600">Respond to customer inquiries</p>
                            </Link>

                            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Award className="w-5 h-5 text-purple-600" />
                                    </div>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Analytics</h4>
                                <p className="text-sm text-gray-600">Coming soon - Advanced analytics</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}