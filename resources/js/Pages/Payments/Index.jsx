import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    DollarSign,
    TrendingUp,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    Wallet,
    PiggyBank,
    Activity,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter,
    Download,
    Eye,
    Sparkles,
    Zap,
    Shield,
    Star
} from 'lucide-react';

export default function PaymentIndex({ auth, payments = [], balance = 0 }) {
    const { t } = useTranslation();
    const [animatedBalance, setAnimatedBalance] = useState(0);
    const [filter, setFilter] = useState('all');
    const [timeRange, setTimeRange] = useState('all');
    
    // Animate balance counter
    useEffect(() => {
        const target = parseFloat(balance) || 0;
        if (target === 0) {
            setAnimatedBalance(0);
            return;
        }
        
        const duration = 1500;
        const steps = 60;
        const interval = Math.max(duration / steps, 16); // Minimum 16ms
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setAnimatedBalance(current);
            
            if (current >= target) {
                clearInterval(timer);
                setAnimatedBalance(target);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [balance]);
    
    const getPaymentIcon = (type) => {
        switch (type) {
            case 'deposit': return ArrowDownLeft;
            case 'order_payment': return CreditCard;
            case 'refund': return ArrowUpRight;
            default: return DollarSign;
        }
    };
    
    const getPaymentColor = (type) => {
        switch (type) {
            case 'deposit': return 'text-green-600';
            case 'order_payment': return 'text-blue-600';
            case 'refund': return 'text-purple-600';
            default: return 'text-gray-600';
        }
    };
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return CheckCircle;
            case 'pending': return Clock;
            case 'failed': return XCircle;
            default: return AlertCircle;
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'failed': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    
    const filteredPayments = payments.filter(payment => {
        if (filter !== 'all' && payment.type !== filter) return false;
        if (timeRange !== 'all') {
            const paymentDate = new Date(payment.created_at);
            const now = new Date();
            const diffTime = Math.abs(now - paymentDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            switch (timeRange) {
                case '7d': return diffDays <= 7;
                case '30d': return diffDays <= 30;
                case '90d': return diffDays <= 90;
                default: return true;
            }
        }
        return true;
    });
    
    const paymentStats = {
        totalDeposits: payments.filter(p => p.type === 'deposit').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        totalSpent: payments.filter(p => p.type === 'order_payment').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        totalRefunds: payments.filter(p => p.type === 'refund').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        recentTransactions: payments.slice(0, 5).length
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('Payments & Wallet')} />

            {/* Background Image */}
            <div 
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: `linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%), url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1920&h=1080&fit=crop&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
            </div>

            {/* Floating Animation Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-300 rounded-full opacity-20 animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12 space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Premium Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-10 shadow-2xl mb-8 animate-slide-down">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-3 flex items-center">
                                        <Wallet className="w-12 h-12 mr-4 animate-bounce" />
                                        Payments & Wallet
                                    </h1>
                                    <p className="text-xl text-white/90">
                                        Manage your funds and payment history
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-sm mb-2">Available Balance</p>
                                    <div className="text-6xl font-bold text-white flex items-center">
                                        <DollarSign className="w-12 h-12 mr-1" />
                                        {animatedBalance.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-up">
                        <Link
                            href="/payments/deposit"
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Add Funds</p>
                                    <p className="text-2xl font-bold text-gray-900">Deposit</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Plus className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-400 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Deposits</p>
                                    <p className="text-2xl font-bold text-gray-900">${paymentStats.totalDeposits.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <TrendingUp className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                                    <p className="text-2xl font-bold text-gray-900">${paymentStats.totalSpent.toFixed(2)}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <CreditCard className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 p-6">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Transactions</p>
                                    <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                    <Activity className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="rounded-2xl bg-white shadow-xl p-6 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                <Filter className="w-6 h-6 mr-3 text-purple-600" />
                                Payment History
                            </h3>
                            
                            <div className="flex space-x-4">
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                                >
                                    <option value="all">All Types</option>
                                    <option value="deposit">Deposits</option>
                                    <option value="order_payment">Payments</option>
                                    <option value="refund">Refunds</option>
                                </select>
                                
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                                >
                                    <option value="all">All Time</option>
                                    <option value="7d">Last 7 days</option>
                                    <option value="30d">Last 30 days</option>
                                    <option value="90d">Last 90 days</option>
                                </select>
                                
                                <button className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 flex items-center">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up" style={{animationDelay: '0.4s'}}>
                        {filteredPayments.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredPayments.map((payment, index) => {
                                    const PaymentIcon = getPaymentIcon(payment.type);
                                    const StatusIcon = getStatusIcon(payment.status);
                                    
                                    return (
                                        <div 
                                            key={payment.id} 
                                            className="group p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 animate-slide-up"
                                            style={{animationDelay: `${index * 0.05}s`}}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-3 rounded-2xl bg-gradient-to-br group-hover:scale-110 transition-transform duration-300 ${
                                                        payment.type === 'deposit' ? 'from-green-100 to-emerald-100' :
                                                        payment.type === 'order_payment' ? 'from-blue-100 to-indigo-100' :
                                                        payment.type === 'refund' ? 'from-purple-100 to-pink-100' :
                                                        'from-gray-100 to-gray-200'
                                                    }`}>
                                                        <PaymentIcon className={`w-6 h-6 ${getPaymentColor(payment.type)}`} />
                                                    </div>
                                                    
                                                    <div>
                                                        <div className="flex items-center space-x-3 mb-1">
                                                            <h4 className="font-bold text-gray-900 capitalize">
                                                                {payment.type.replace('_', ' ')}
                                                            </h4>
                                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(payment.status)}`}>
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {payment.status.toUpperCase()}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                            <span className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                {new Date(payment.created_at).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                            {payment.description && (
                                                                <span className="text-gray-500 truncate max-w-md">
                                                                    {payment.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${
                                                            payment.type === 'deposit' || payment.type === 'refund'
                                                                ? 'text-green-600'
                                                                : 'text-red-600'
                                                        }`}>
                                                            {payment.type === 'deposit' || payment.type === 'refund' ? '+' : '-'}
                                                            ${parseFloat(payment.amount).toFixed(2)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {payment.type === 'deposit' ? 'Added to wallet' :
                                                             payment.type === 'order_payment' ? 'Order payment' :
                                                             payment.type === 'refund' ? 'Refunded' : 'Transaction'}
                                                        </div>
                                                    </div>
                                                    
                                                    <button className="group/btn p-2 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <Eye className="w-5 h-5 text-gray-500 group-hover/btn:text-gray-700" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 animate-bounce-in">
                                    <PiggyBank className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No payments yet
                                </h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Start by adding funds to your account to make your first purchase
                                </p>
                                <Link
                                    href="/payments/deposit"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Make First Deposit
                                    <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 animate-fade-in">
                        <div className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Shield className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                    Secure & Protected
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    All payments are processed through secure, encrypted channels. Your financial information is protected with bank-level security measures.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}