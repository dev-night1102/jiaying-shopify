import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import { 
    Eye, 
    EyeOff, 
    Mail, 
    Lock, 
    ArrowRight, 
    CheckCircle, 
    ShoppingBag,
    Sparkles,
    Globe,
    Shield,
    Star,
    Users
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true, // Default to checked for better UX
    });

    useEffect(() => {
        setIsLoaded(true);
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const features = [
        { icon: ShoppingBag, text: 'Global Shopping Made Easy' },
        { icon: Shield, text: 'Secure & Guaranteed Transactions' },
        { icon: Users, text: 'Expert Shopping Agents' },
        { icon: Globe, text: 'Worldwide Marketplace Access' }
    ];

    return (
        <>
            <Head title={t('Login')} />
            
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
                {/* Left Side - Image and Features */}
                <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop&q=80')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90" />
                    
                    {/* Animated Background Elements */}
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float" />
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}} />
                    <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-12 py-20">
                        <div className="max-w-lg">
                            {/* Logo */}
                            <div className="flex items-center mb-8 animate-slide-right">
                                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl mr-4">
                                    <ShoppingBag className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">ShopAgent Pro</h1>
                                    <p className="text-white/80">Global Shopping Platform</p>
                                </div>
                            </div>
                            
                            {/* Welcome Text */}
                            <div className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                                    Welcome Back to Your
                                    <span className="block text-yellow-300">Global Shopping Hub</span>
                                </h2>
                                <p className="text-xl text-white/90 leading-relaxed">
                                    Access your orders, track shipments, and discover amazing products from around the world.
                                </p>
                            </div>
                            
                            {/* Features */}
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <div 
                                        key={index} 
                                        className="flex items-center space-x-4 text-white/90 animate-slide-left"
                                        style={{animationDelay: `${0.4 + index * 0.1}s`}}
                                    >
                                        <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                                            <feature.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">10K+</div>
                                    <div className="text-white/70 text-sm">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">50K+</div>
                                    <div className="text-white/70 text-sm">Orders Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">99.9%</div>
                                    <div className="text-white/70 text-sm">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mr-3">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ShopAgent Pro
                            </h1>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className={`mx-auto w-full max-w-md transition-all duration-1000 ${isLoaded ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-10'}`}>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome Back! 👋
                            </h2>
                            <p className="text-gray-600">
                                Sign in to access your global shopping dashboard
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-slide-down">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="text-sm font-medium text-green-800">{status}</span>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t('Email Address')}
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.email 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="Enter your email address"
                                        autoComplete="username"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t('Password')}
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.password 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-indigo-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center group cursor-pointer p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 transition-colors duration-200"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <div className="ml-3">
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                            {t('Remember me')}
                                        </span>
                                        <p className="text-xs text-gray-500 mt-0.5">Stay logged in for 30 days</p>
                                    </div>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                                    >
                                        {t('Forgot Password?')}
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                            {t('Signing In...')}
                                        </>
                                    ) : (
                                        <>
                                            {t('Sign In')}
                                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                        </>
                                    )}
                                </div>
                                <Sparkles className="absolute top-1 right-1 w-4 h-4 text-yellow-300 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">New to ShopAgent Pro?</span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <Link
                                href="/register"
                                className="group relative w-full flex items-center justify-center py-4 px-6 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="relative flex items-center">
                                    {t('Create New Account')}
                                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </Link>
                        </form>

                        {/* Trust Indicators */}
                        <div className="mt-8 text-center">
                            <div className="flex justify-center items-center space-x-2 text-yellow-500 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600">
                                Trusted by 10,000+ customers worldwide
                            </p>
                        </div>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full opacity-60 animate-pulse" />
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full opacity-60 animate-float" />
                </div>
            </div>
        </>
    );
}