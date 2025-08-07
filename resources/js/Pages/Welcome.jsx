import React, { useState, useEffect, useRef } from 'react';
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
    const [isVisible, setIsVisible] = useState({});
    const observerRef = useRef();

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
            color: 'bg-slate-50'
        },
        {
            icon: Users,
            title: 'Expert Shopping Agents',
            description: 'Professional team with expertise in international commerce and logistics.',
            color: 'bg-gray-100'
        },
        {
            icon: Globe,
            title: 'Global Marketplace Access',
            description: 'Shop from any website worldwide with our comprehensive service network.',
            color: 'bg-teal-50'
        },
        {
            icon: Shield,
            title: 'Secure & Guaranteed',
            description: 'Money-back guarantee, secure payments, and comprehensive insurance coverage.',
            color: 'bg-amber-50'
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

    // Intersection Observer for scroll animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const animateKey = entry.target.dataset.animate;
                        if (animateKey) {
                            setIsVisible(prev => ({
                                ...prev,
                                [animateKey]: true
                            }));
                        }
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        // Observe all animated elements
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => observerRef.current.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    // Carousel timer
    useEffect(() => {
        if (testimonials.length === 0) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

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
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-slate-800 bg-clip-text text-transparent">
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
                                className="bg-gradient-to-r from-indigo-600 to-slate-700 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 overflow-hidden" style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 hero-title">
                            <span className="inline-block hero-word-1">Professional</span>{' '}
                            <span className="inline-block hero-word-2">Global</span>
                            <span className="block text-slate-700 hero-word-3">
                                Procurement Service
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed hero-subtitle font-light">
                            Streamline your international purchasing with our expert procurement specialists. 
                            We handle sourcing, logistics, and compliance - delivering seamless cross-border transactions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
                            <Link
                                href="/register"
                                className="group bg-slate-700 text-white text-lg px-8 py-4 rounded-lg hover:bg-slate-800 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            >
                                Get Started Today
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="text-gray-700 border-2 border-gray-300 text-lg px-8 py-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                            >
                                Learn More
                            </Link>
                        </div>
                        
                        {/* Trust Indicators */}
                        <div className="mt-12 flex justify-center items-center space-x-8 hero-trust">
                            <div className="flex items-center text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                                <span className="ml-2 text-gray-600">4.9/5 from 10,000+ clients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div 
                        className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
                            isVisible.stats ? 'animate-stats-reveal' : 'opacity-0 translate-y-20'
                        }`}
                        data-animate="stats">
                        {stats.map((stat, index) => (
                            <div key={index} 
                                 className={`text-center group animate-stat-item transition-all duration-700 ${
                                     isVisible.stats ? '' : 'opacity-0 translate-y-10'
                                 }`}
                                 style={{ animationDelay: `${index * 150}ms` }}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4 group-hover:scale-110 transition-all duration-500 stat-icon-bounce shadow-lg">
                                    <stat.icon className="w-8 h-8 text-slate-700" />
                                </div>
                                <div className="text-3xl font-bold mb-2 stat-number" data-number={stat.number}>0</div>
                                <div className="text-gray-300">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div 
                        className={`text-center mb-16 transition-all duration-1000 ${
                            isVisible['features-title'] ? 'animate-slide-up' : 'opacity-0 translate-y-20'
                        }`}
                        data-animate="features-title">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Enterprise-Grade Procurement Solutions
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                            Comprehensive tools and expertise for efficient global sourcing operations.
                        </p>
                    </div>
                    
                    <div 
                        className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${
                            isVisible.features ? 'animate-features-cascade' : ''
                        }`}
                        data-animate="features">
                        {features.map((feature, index) => (
                            <div key={index} 
                                 className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 feature-card ${
                                     isVisible.features ? '' : 'opacity-0 translate-y-20 rotate-3'
                                 }`}
                                 style={{ 
                                     animationDelay: `${index * 200}ms`,
                                     transformOrigin: 'center bottom'
                                 }}>
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${feature.color} group-hover:scale-110 transition-all duration-500 feature-icon-float`}>
                                    <feature.icon className="w-8 h-8 text-gray-700 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-slate-700 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.description}
                                </p>
                                <div className="absolute inset-0 bg-slate-100/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                            Streamlined Process
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                            Experience our efficient 4-step procurement workflow.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative mb-8">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-full text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                                        {step.step}
                                    </div>
                                    {index < howItWorks.length - 1 && (
                                        <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-slate-300 transform -translate-y-0.5"></div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <step.icon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-slate-700 transition-colors duration-300" />
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
                            Client Success Stories
                        </h2>
                        <p className="text-xl text-gray-300 font-light">
                            Trusted by leading businesses globally.
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
            <section className="py-20 bg-slate-800 text-white">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Optimize Your Global Sourcing?
                    </h2>
                    <p className="text-xl mb-8 opacity-90 font-light">
                        Join leading companies that rely on our procurement expertise.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-slate-800 text-lg px-8 py-4 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-medium"
                        >
                            Start Your Free Trial
                        </Link>
                        <Link
                            href="/login"
                            className="border-2 border-white text-white text-lg px-8 py-4 rounded-lg hover:bg-white hover:text-slate-800 transition-all duration-300"
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
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Global Procurement Pro
                            </h3>
                            <p className="text-gray-400 mb-6 font-light">
                                Enterprise procurement solutions for seamless international sourcing.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
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
                /* Hero Animations */
                .hero-title {
                    animation: hero-reveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                
                .hero-word-1 {
                    animation: word-slide-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
                    transform: translateX(-100px) rotateY(-30deg);
                }
                
                .hero-word-2 {
                    animation: word-slide-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    animation-delay: 0.4s;
                    opacity: 0;
                    transform: translateX(100px) rotateY(30deg);
                }
                
                .hero-word-3 {
                    animation: gradient-reveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    animation-delay: 0.6s;
                    opacity: 0;
                    transform: translateY(50px) scale(0.8);
                }
                
                .hero-subtitle {
                    animation: subtitle-fade-in 1s ease-out forwards;
                    animation-delay: 1s;
                    opacity: 0;
                    transform: translateY(30px);
                }
                
                .hero-buttons {
                    animation: buttons-bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    animation-delay: 1.2s;
                    opacity: 0;
                    transform: translateY(40px) scale(0.8);
                }
                
                .hero-trust {
                    animation: trust-slide-in 0.6s ease-out forwards;
                    animation-delay: 1.4s;
                    opacity: 0;
                    transform: translateY(20px);
                }

                /* Stats Animations */
                @keyframes stats-reveal {
                    0% {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-stats-reveal {
                    animation: stats-reveal 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }
                
                .stat-icon-bounce {
                    animation: icon-bounce 2s infinite;
                }
                
                @keyframes icon-bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0) scale(1);
                    }
                    40% {
                        transform: translateY(-8px) scale(1.05);
                    }
                    60% {
                        transform: translateY(-4px) scale(1.02);
                    }
                }

                /* Feature Cards */
                .feature-card {
                    animation: card-reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                    position: relative;
                    overflow: hidden;
                }
                
                .feature-icon-float {
                    animation: float 3s ease-in-out infinite;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    33% {
                        transform: translateY(-5px) rotate(1deg);
                    }
                    66% {
                        transform: translateY(-3px) rotate(-1deg);
                    }
                }

                /* Keyframe Definitions */
                @keyframes hero-reveal {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes word-slide-in {
                    to {
                        opacity: 1;
                        transform: translateX(0) rotateY(0deg);
                    }
                }
                
                @keyframes gradient-reveal {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes subtitle-fade-in {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes buttons-bounce-in {
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes trust-slide-in {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes card-reveal {
                    to {
                        opacity: 1;
                        transform: translateY(0) rotate(0deg);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-up {
                    animation: slide-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                }

                /* Hover Effects */
                .feature-card:hover {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                .feature-card:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transition: left 0.5s;
                }
                
                .feature-card:hover:before {
                    left: 100%;
                }

                /* Parallax Effect */
                @media (prefers-reduced-motion: no-preference) {
                    .hero-title {
                        transform-style: preserve-3d;
                    }
                    
                    .feature-card {
                        transform-style: preserve-3d;
                        backface-visibility: hidden;
                    }
                }

                /* Loading Animation */
                @keyframes pulse-glow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 40px rgba(99, 102, 241, 0.6);
                    }
                }
                
                .group:hover .feature-icon-float {
                    animation: pulse-glow 1.5s infinite, float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}