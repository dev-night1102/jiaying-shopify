import { Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import { ShoppingBag, Users, Globe, Shield } from 'lucide-react';

export default function Welcome() {
    const { t } = useTranslation();

    const features = [
        {
            icon: ShoppingBag,
            title: 'Easy Order Management',
            description: 'Submit product links and track your orders from request to delivery.',
        },
        {
            icon: Users,
            title: 'Personal Shopping Agent',
            description: 'Get professional assistance with your international purchases.',
        },
        {
            icon: Globe,
            title: 'Global Shopping',
            description: 'Access products from around the world with our shopping service.',
        },
        {
            icon: Shield,
            title: 'Secure & Reliable',
            description: '30-day trial and transparent pricing with no hidden fees.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="pt-20 pb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Your Personal <span className="text-primary-600">Shopping Agent</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Shop from anywhere in the world with our professional shopping agent service. 
                        Get quotes, track orders, and chat with experts - all in one platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="btn btn-primary text-lg px-8 py-4"
                        >
                            {t('Start Free Trial')}
                        </Link>
                        <Link
                            href="/login"
                            className="btn btn-secondary text-lg px-8 py-4"
                        >
                            {t('Login')}
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                                <feature.icon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="py-16 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">
                        Simple, Transparent Pricing
                    </h2>
                    <div className="max-w-md mx-auto card p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Monthly Plan
                            </h3>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary-600">$9.9</span>
                                <span className="text-gray-600 ml-2">{t('per month')}</span>
                            </div>
                            <div className="space-y-3 text-left mb-8">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                                    <span>30 days free trial</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Unlimited order submissions</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                                    <span>24/7 chat support</span>
                                </div>
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 text-green-500 mr-3" />
                                    <span>Order tracking & logistics</span>
                                </div>
                            </div>
                            <Link
                                href="/register"
                                className="btn btn-primary w-full"
                            >
                                {t('Get Started')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}