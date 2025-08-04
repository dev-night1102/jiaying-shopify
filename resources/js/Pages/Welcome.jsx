import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import { 
    ShoppingBag, 
    Users, 
    Globe, 
    Shield, 
    Star, 
    ChevronLeft, 
    ChevronRight,
    CheckCircle,
    ArrowRight,
    Package,
    CreditCard,
    MessageSquare,
    TrendingUp
} from 'lucide-react';

export default function Welcome() {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Fashion Enthusiast",
            content: "Amazing service! I was able to get exclusive items from Japan that I couldn't find anywhere else. The process was smooth and transparent.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bb?w=64&h=64&fit=crop&crop=face"
        },
        {
            name: "Michael Chen",
            role: "Tech Collector",
            content: "Professional and reliable. They handled my electronics purchase perfectly, including all the customs and shipping details.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
        },
        {
            name: "Emma Davis",
            role: "Small Business Owner",
            content: "Great for sourcing products for my business. The bulk ordering feature and competitive pricing has helped grow my company.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
        }
    ];

    const features = [
        {
            icon: ShoppingBag,
            title: 'Smart Order Management',
            description: 'Advanced order tracking from submission to delivery with real-time updates.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Expert Shopping Agents',
            description: 'Professional team with expertise in international commerce and logistics.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Globe,
            title: 'Global Marketplace Access',
            description: 'Shop from any website worldwide with our comprehensive service network.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Shield,
            title: 'Secure & Guaranteed',
            description: 'Money-back guarantee, secure payments, and comprehensive insurance coverage.',
            color: 'from-orange-500 to-red-500'
        },
    ];

    const stats = [
        { number: '10,000+', label: 'Happy Customers', icon: Users },
        { number: '50,000+', label: 'Orders Completed', icon: Package },
        { number: '99.9%', label: 'Success Rate', icon: TrendingUp },
        { number: '24/7', label: 'Support Available', icon: MessageSquare },
    ];

    const howItWorks = [
        {
            step: '01',
            title: 'Submit Your Order',
            description: 'Paste any product link and tell us what you want to buy',
            icon: ShoppingBag
        },
        {
            step: '02',
            title: 'Get Instant Quote',
            description: 'Receive transparent pricing with no hidden fees',
            icon: CreditCard
        },
        {
            step: '03',
            title: 'We Handle Everything',
            description: 'Our experts purchase, inspect, and ship your items',
            icon: Package
        },
        {
            step: '04',
            title: 'Track & Receive',
            description: 'Monitor your package and receive it at your doorstep',
            icon: CheckCircle
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="absolute top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    ShopAgent Pro
                                </h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: '0.05'
                }}></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
                            Your Global
                            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Shopping Agent
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
                            Shop from any website worldwide with our professional shopping agent service. 
                            Get instant quotes, track orders in real-time, and chat with experts.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
                            <Link
                                href="/register"
                                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            >
                                Start Free 30-Day Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-gray-700 border-2 border-gray-300 text-lg px-8 py-4 rounded-full hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
                            >
                                See How It Works
                            </Link>
                        </div>
                        
                        {/* Trust Indicators */}
                        <div className="mt-12 flex justify-center items-center space-x-8 animate-fade-in-up animation-delay-600">
                            <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                                <span className="ml-2 text-gray-600">4.9/5 from 1000+ reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why Choose ShopAgent Pro?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Advanced features designed to make global shopping simple, secure, and efficient.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-r ${feature.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Get started in minutes with our simple 4-step process.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-8">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                                        {step.step}
                                    </div>
                                    {index < howItWorks.length - 1 && (
                                        <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform -translate-y-0.5"></div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <step.icon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-300">
                            Join thousands of happy customers worldwide.
                        </p>
                    </div>
                    
                    <div className="relative">
                        <div className="overflow-hidden rounded-2xl">
                            <div 
                                className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                            >
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="w-full flex-shrink-0 px-8 py-12 text-center">
                                        <div className="flex justify-center mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <blockquote className="text-xl italic mb-8 leading-relaxed">
                                            "{testimonial.content}"
                                        </blockquote>
                                        <div className="flex items-center justify-center">
                                            <img 
                                                src={testimonial.avatar} 
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full mr-4"
                                            />
                                            <div className="text-left">
                                                <div className="font-semibold">{testimonial.name}</div>
                                                <div className="text-gray-400">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Carousel Controls */}
                        <button 
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-200"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-200"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                        
                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                        index === currentSlide ? 'bg-white' : 'bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Start Shopping Globally?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of customers who trust us with their international shopping needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-blue-600 text-lg px-8 py-4 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold"
                        >
                            Start Your Free Trial
                        </Link>
                        <Link
                            href="/login"
                            className="border-2 border-white text-white text-lg px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
                        >
                            Login to Your Account
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                                ShopAgent Pro
                            </h3>
                            <p className="text-gray-400 mb-6">
                                Your trusted partner for global shopping. Professional, secure, and reliable.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <Shield className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Services</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>Global Shopping</div>
                                <div>Order Management</div>
                                <div>Price Quotes</div>
                                <div>Shipping & Logistics</div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>24/7 Chat Support</div>
                                <div>Order Tracking</div>
                                <div>Help Center</div>
                                <div>Contact Us</div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <div className="space-y-2 text-gray-400">
                                <div>About Us</div>
                                <div>Privacy Policy</div>
                                <div>Terms of Service</div>
                                <div>Security</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 ShopAgent Pro. All rights reserved. Made with ❤️ for global shoppers.</p>
                    </div>
                </div>
            </footer>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fade-in-up {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }
                
                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }
                
                .animation-delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}