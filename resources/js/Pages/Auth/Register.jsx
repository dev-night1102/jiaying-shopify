import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import { 
    Eye, 
    EyeOff, 
    Mail, 
    Lock, 
    User,
    ArrowRight, 
    CheckCircle, 
    ShoppingBag,
    Sparkles,
    Globe,
    Shield,
    Star,
    Users,
    Zap,
    Gift,
    Clock
} from 'lucide-react';

export default function Register() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsLoaded(true);
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const features = [
        { icon: ShoppingBag, text: 'Personal Shopping Assistant' },
        { icon: Shield, text: 'Secure Account Protection' },
        { icon: Users, text: 'Dedicated Support Team' },
        { icon: Globe, text: 'Global Product Access' }
    ];

    const benefits = [
        { icon: Zap, text: 'Instant Order Processing', delay: '0.4s' },
        { icon: Gift, text: 'Exclusive Member Deals', delay: '0.5s' },
        { icon: Clock, text: '24/7 Customer Support', delay: '0.6s' }
    ];

    return (
        <>
            <Head title={t('Register')} />
            
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex">
                {/* Left Side - Image and Features */}
                <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600">
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url('https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop&q=80')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-teal-600/90 to-blue-600/90" />
                    
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
                                    <p className="text-white/80">Join Our Community</p>
                                </div>
                            </div>
                            
                            {/* Welcome Text */}
                            <div className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
                                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                                    Start Your Journey to
                                    <span className="block text-cyan-300">Smart Shopping</span>
                                </h2>
                                <p className="text-xl text-white/90 leading-relaxed">
                                    Join thousands of satisfied customers who trust us with their global shopping needs.
                                </p>
                            </div>
                            
                            {/* Features */}
                            <div className="space-y-4 mb-8">
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
                            
                            {/* Benefits */}
                            <div className="space-y-3">
                                {benefits.map((benefit, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center space-x-3 text-white/80 animate-fade-in"
                                        style={{animationDelay: benefit.delay}}
                                    >
                                        <div className="p-1.5 bg-white/15 rounded-lg">
                                            <benefit.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">10K+</div>
                                    <div className="text-white/70 text-sm">New Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">195+</div>
                                    <div className="text-white/70 text-sm">Countries</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">4.9★</div>
                                    <div className="text-white/70 text-sm">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Register Form */}
                <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative">
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl mr-3">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                ShopAgent Pro
                            </h1>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className={`mx-auto w-full max-w-md transition-all duration-1000 ${isLoaded ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-10'}`}>
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account ✨
                            </h2>
                            <p className="text-gray-600">
                                Join our global shopping community today
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t('Full Name')}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200" />
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.name 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t('Email Address')}
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.email 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
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
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.password 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="Create a strong password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {t('Confirm Password')}
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors duration-200" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 ${
                                            errors.password_confirmation 
                                                ? 'border-red-300 focus:border-red-500 bg-red-50' 
                                                : 'border-gray-200 focus:border-emerald-500 hover:border-gray-300 bg-gray-50 focus:bg-white'
                                        }`}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 font-medium animate-slide-down">{errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Terms Agreement */}
                            <div className="flex items-start space-x-3">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 transition-colors duration-200"
                                        required
                                    />
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-600">
                                        I agree to the{' '}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors duration-200">
                                            Terms of Service
                                        </a>
                                        {' '}and{' '}
                                        <a href="#" className="text-emerald-600 hover:text-emerald-500 font-semibold transition-colors duration-200">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative flex items-center">
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                                            {t('Creating Account...')}
                                        </>
                                    ) : (
                                        <>
                                            {t('Create Account')}
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
                                    <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <Link
                                href="/login"
                                className="group relative w-full flex items-center justify-center py-4 px-6 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="relative flex items-center">
                                    {t('Sign In Instead')}
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
                                Trusted by professionals worldwide
                            </p>
                        </div>
                    </div>

                    {/* Background Decorations */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full opacity-60 animate-pulse" />
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full opacity-60 animate-float" />
                </div>
            </div>
        </>
    );
}