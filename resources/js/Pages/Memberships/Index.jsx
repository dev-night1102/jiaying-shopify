import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Crown, 
    Star, 
    Zap, 
    TrendingUp, 
    Gift, 
    Shield, 
    Award,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    Sparkles,
    Gem,
    Trophy,
    Rocket,
    Heart,
    DollarSign,
    Plus,
    Calendar,
    Activity,
    Users,
    Lock,
    Unlock
} from 'lucide-react';

export default function Index({ auth, memberships, isAdmin, membershipPlans }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hoveredPlan, setHoveredPlan] = useState(null);
    const [animatedBalance, setAnimatedBalance] = useState(0);

    // Animate balance counter
    useEffect(() => {
        const target = parseFloat(auth.user.balance) || 0;
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setAnimatedBalance(current);
            
            if (current >= target) {
                clearInterval(timer);
                setAnimatedBalance(target);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [auth.user.balance]);

    const handleSubscribe = (planType) => {
        setIsProcessing(true);
        router.post('/memberships/subscribe', { type: planType }, {
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleTopUp = (amount) => {
        setIsProcessing(true);
        router.post('/memberships/top-up', { amount }, {
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleCancel = (membershipId) => {
        if (confirm('Are you sure you want to cancel this membership?')) {
            setIsProcessing(true);
            router.post(`/memberships/${membershipId}/cancel`, {}, {
                onFinish: () => setIsProcessing(false)
            });
        }
    };

    const planIcons = {
        trial: { icon: Gift, gradient: 'from-gray-400 to-gray-600' },
        basic: { icon: Star, gradient: 'from-blue-400 to-teal-600' },
        premium: { icon: Crown, gradient: 'from-teal-400 to-emerald-600' },
        vip: { icon: Gem, gradient: 'from-emerald-400 to-cyan-600' }
    };

    const planFeatureIcons = [CheckCircle, Zap, Shield, Trophy, Users, Activity];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Memberships" />

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full opacity-10 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-300 rounded-full opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full opacity-5 animate-pulse-slow"></div>
            </div>

            <div className="relative py-12 space-y-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Premium Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 p-10 shadow-2xl mb-8 animate-slide-down">
                        <div className="absolute inset-0 bg-black opacity-10"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full opacity-10 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                        
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-5xl font-bold text-white mb-3 flex items-center">
                                        <Crown className="w-12 h-12 mr-4 animate-bounce" />
                                        Membership Plans
                                    </h1>
                                    <p className="text-xl text-white/90">
                                        Unlock premium features and exclusive benefits
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-white/80 text-sm mb-2">Account Balance</p>
                                    <div className="text-5xl font-bold text-white flex items-center">
                                        <DollarSign className="w-10 h-10 mr-1" />
                                        {animatedBalance.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Top-up Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
                        {[50, 100, 200, 500].map((amount, index) => (
                            <button
                                key={amount}
                                onClick={() => handleTopUp(amount)}
                                disabled={isProcessing}
                                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 p-6"
                                style={{animationDelay: `${index * 0.1}s`}}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Quick Add</p>
                                        <p className="text-2xl font-bold text-gray-900">${amount}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                        <Plus className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Current Membership Status */}
                    {auth.user.membership && (
                        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${
                            auth.user.membership.type === 'vip' ? 'from-emerald-600 via-teal-600 to-blue-600' :
                            auth.user.membership.type === 'premium' ? 'from-teal-400 via-emerald-500 to-cyan-600' :
                            auth.user.membership.type === 'basic' ? 'from-blue-400 via-teal-500 to-emerald-600' :
                            'from-gray-600 to-gray-700'
                        } p-8 shadow-2xl mb-8 animate-slide-up`}>
                            <div className="absolute inset-0 bg-white opacity-5"></div>
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full opacity-10 animate-pulse"></div>
                            
                            <div className="relative">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                                            {React.createElement(planIcons[auth.user.membership.type]?.icon || Crown, {
                                                className: "w-12 h-12 text-white animate-pulse"
                                            })}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">
                                                {auth.user.membership.type.charAt(0).toUpperCase() + auth.user.membership.type.slice(1)} Member
                                            </h2>
                                            <div className="flex items-center space-x-4 text-white/90">
                                                <span className="flex items-center">
                                                    <Clock className="w-5 h-5 mr-2" />
                                                    {auth.user.membership.days_remaining} days remaining
                                                </span>
                                                <span className="flex items-center">
                                                    <Calendar className="w-5 h-5 mr-2" />
                                                    Expires: {new Date(auth.user.membership.expires_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-white/80 text-sm">Status</p>
                                            <span className="inline-flex items-center px-4 py-2 bg-white/30 backdrop-blur-md rounded-full text-white font-bold">
                                                <Activity className="w-4 h-4 mr-2 animate-pulse" />
                                                ACTIVE
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between text-white/80 text-sm mb-2">
                                        <span>Membership Period</span>
                                        <span>{Math.round((30 - auth.user.membership.days_remaining) / 30 * 100)}% Complete</span>
                                    </div>
                                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                                            style={{width: `${Math.round((30 - auth.user.membership.days_remaining) / 30 * 100)}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Membership Plans Grid */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-slide-up">
                            Choose Your Perfect Plan
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(membershipPlans).map(([key, plan], index) => {
                                const PlanIcon = planIcons[key]?.icon || Star;
                                const isCurrentPlan = auth.user.membership?.type === key;
                                const isPremium = key === 'vip' || key === 'premium';
                                
                                return (
                                    <div
                                        key={key}
                                        className={`group relative overflow-hidden rounded-3xl ${
                                            isPremium ? 'scale-105' : ''
                                        } ${
                                            isCurrentPlan ? 'ring-4 ring-purple-500 ring-offset-4' : ''
                                        } bg-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-500 animate-slide-up cursor-pointer`}
                                        style={{animationDelay: `${index * 0.1}s`}}
                                        onMouseEnter={() => setHoveredPlan(key)}
                                        onMouseLeave={() => setHoveredPlan(null)}
                                    >
                                        {/* Premium Badge */}
                                        {isPremium && (
                                            <div className="absolute -top-2 -right-2 z-10">
                                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Gradient Background */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${planIcons[key]?.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
                                        
                                        {/* Animated Circle */}
                                        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${planIcons[key]?.gradient} rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700`}></div>
                                        
                                        <div className="relative p-8">
                                            {/* Plan Icon */}
                                            <div className={`inline-flex p-4 bg-gradient-to-br ${planIcons[key]?.gradient} rounded-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                                <PlanIcon className="w-8 h-8 text-white" />
                                            </div>
                                            
                                            {/* Plan Name */}
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            
                                            {/* Price */}
                                            <div className="mb-6">
                                                <span className={`text-5xl font-bold bg-gradient-to-r ${planIcons[key]?.gradient} bg-clip-text text-transparent`}>
                                                    ${plan.price}
                                                </span>
                                                <span className="text-gray-500 text-lg">/month</span>
                                            </div>
                                            
                                            {/* Features */}
                                            <ul className="space-y-3 mb-8">
                                                {plan.features.map((feature, fIndex) => {
                                                    const FeatureIcon = planFeatureIcons[fIndex % planFeatureIcons.length];
                                                    return (
                                                        <li key={fIndex} className="flex items-start group/item">
                                                            <FeatureIcon className={`w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform duration-300`} />
                                                            <span className="text-gray-700 text-sm group-hover/item:text-gray-900 transition-colors duration-200">
                                                                {feature}
                                                            </span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                            
                                            {/* Subscribe Button */}
                                            <button
                                                onClick={() => handleSubscribe(key)}
                                                disabled={isCurrentPlan || isProcessing}
                                                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform ${
                                                    isCurrentPlan 
                                                        ? 'bg-gray-400 cursor-not-allowed' 
                                                        : `bg-gradient-to-r ${planIcons[key]?.gradient} hover:shadow-xl hover:scale-105 active:scale-95`
                                                } flex items-center justify-center group/btn`}
                                            >
                                                {isCurrentPlan ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5 mr-2" />
                                                        Current Plan
                                                    </>
                                                ) : (
                                                    <>
                                                        {hoveredPlan === key && <Rocket className="w-5 h-5 mr-2 animate-bounce" />}
                                                        Get Started
                                                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Membership History */}
                    <div className="rounded-3xl bg-white shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                                    <Clock className="w-7 h-7 mr-3 text-purple-600" />
                                    Membership History
                                </h3>
                                <span className="px-4 py-2 bg-purple-100 text-purple-600 text-sm font-semibold rounded-full">
                                    {memberships.data.length} Records
                                </span>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Plan Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Started
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Expires
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        {!isAdmin && (
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {memberships.data.map((membership, index) => {
                                        const MembershipIcon = planIcons[membership.type]?.icon || Star;
                                        
                                        return (
                                            <tr 
                                                key={membership.id} 
                                                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 animate-fade-in"
                                                style={{animationDelay: `${index * 0.05}s`}}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`p-2 bg-gradient-to-br ${planIcons[membership.type]?.gradient} rounded-lg mr-3`}>
                                                            <MembershipIcon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                        membership.status === 'active' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : membership.status === 'expired'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {membership.status === 'active' && <Activity className="w-3 h-3 mr-1 animate-pulse" />}
                                                        {membership.status === 'expired' && <XCircle className="w-3 h-3 mr-1" />}
                                                        {membership.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                        {new Date(membership.started_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                        {new Date(membership.expires_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                        ${membership.amount_paid}
                                                    </span>
                                                </td>
                                                {!isAdmin && membership.status === 'active' && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleCancel(membership.id)}
                                                            disabled={isProcessing}
                                                            className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transform hover:scale-105 transition-all duration-300"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Cancel
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}