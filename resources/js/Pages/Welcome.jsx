import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import Footer from '@/Components/Footer';
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
    TrendingUp,
    Sparkles,
    Zap,
    Award,
    Heart,
    Send,
    Gift
} from 'lucide-react';

export default function Welcome() {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const observerRef = useRef();

    // Track mouse for parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ 
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const testimonials = [
        {
            name: "Li Wei",
            role: "Fashion Designer",
            content: "Jia Ying GlobalFlow has transformed how I source materials from international suppliers. Exceptional service!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Sarah Chen",
            role: "E-commerce Entrepreneur",
            content: "The most reliable global shopping service I've ever used. Jia Ying's team goes above and beyond!",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bb?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "David Zhang",
            role: "Tech Importer",
            content: "Professional, efficient, and trustworthy. Jia Ying GlobalFlow is the gold standard in procurement services.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
    ];

    const features = [
        {
            icon: Globe,
            title: 'Worldwide Access',
            description: 'Source products from any corner of the globe with Jia Ying\'s extensive network',
            gradient: 'from-emerald-400 to-teal-500',
            delay: 0
        },
        {
            icon: Shield,
            title: 'Secure Transactions',
            description: 'Your payments and personal data are protected with enterprise-grade security',
            gradient: 'from-teal-400 to-blue-500',
            delay: 0.1
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Expedited processing and shipping to get your products quickly',
            gradient: 'from-blue-400 to-cyan-500',
            delay: 0.2
        },
        {
            icon: Award,
            title: 'Premium Quality',
            description: 'Every product is inspected to ensure it meets your standards',
            gradient: 'from-cyan-400 to-emerald-500',
            delay: 0.3
        },
    ];

    const stats = [
        { number: '25K+', label: 'Global Customers', icon: Users, color: 'text-emerald-600' },
        { number: '150K+', label: 'Orders Delivered', icon: Package, color: 'text-teal-600' },
        { number: '99.8%', label: 'Satisfaction Rate', icon: Heart, color: 'text-blue-600' },
        { number: '24/7', label: 'Expert Support', icon: MessageSquare, color: 'text-cyan-600' },
    ];

    const howItWorks = [
        {
            step: '01',
            title: 'Share Your Request',
            description: 'Tell us what product you need from anywhere in the world',
            icon: Send,
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            step: '02',
            title: 'Get Instant Quote',
            description: 'Receive transparent pricing with all costs included',
            icon: CreditCard,
            color: 'from-teal-500 to-teal-600'
        },
        {
            step: '03',
            title: 'We Handle Everything',
            description: 'Jia Ying\'s experts manage purchase, inspection, and shipping',
            icon: Package,
            color: 'from-blue-500 to-blue-600'
        },
        {
            step: '04',
            title: 'Receive with Joy',
            description: 'Track your order and receive it at your doorstep',
            icon: Gift,
            color: 'from-cyan-500 to-cyan-600'
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
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 overflow-x-hidden">
            {/* Header */}
            <header className="absolute top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <div className="flex items-center space-x-3 group">
                                <div className="relative p-3 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 rounded-2xl shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <ShoppingBag className="w-8 h-8 text-white relative z-10" />
                                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black tracking-tight">
                                        <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                                            Jia Ying
                                        </span>
                                        <span className="text-gray-700 text-lg font-medium ml-2">
                                            GlobalFlow
                                        </span>
                                    </h1>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Premium Procurement Services</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10">Get Started Free</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section with Parallax */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background with high-quality image */}
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=2000&h=1200&fit=crop&q=90')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                        transition: 'transform 0.3s ease-out'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        className="absolute top-20 left-10 w-64 h-64 bg-emerald-400 rounded-full opacity-10 blur-3xl"
                        style={{ transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)` }}
                    ></div>
                    <div 
                        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"
                        style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
                    ></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Main Headline */}
                        <div className="mb-8 animate-fade-in">
                            <span className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold mb-6">
                                <Sparkles className="w-4 h-4 mr-2" />
                                2025 Excellence in Global Procurement
                            </span>
                        </div>
                        
                        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                            <span className="block text-gray-800 mb-2 animate-slide-up">Welcome to</span>
                            <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent animate-slide-up" style={{animationDelay: '0.1s'}}>
                                Jia Ying
                            </span>
                            <span className="block text-3xl md:text-4xl text-gray-700 font-medium mt-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
                                Your Gateway to Global Shopping
                            </span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 animate-fade-in" style={{animationDelay: '0.3s'}}>
                            Experience premium procurement services that connect you to products from every corner of the world. 
                            <span className="font-semibold text-emerald-600"> Trusted by thousands since 2020.</span>
                        </p>
                        
                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.4s'}}>
                            <Link
                                href="/register"
                                className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center">
                                    Start Your Journey
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-xl hover:shadow-2xl border-2 border-emerald-200 hover:border-emerald-300 transform hover:scale-105 transition-all duration-300"
                            >
                                Learn How It Works
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <div className="flex items-center text-gray-600">
                                <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                                <span className="font-medium">Secure Payments</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Award className="w-5 h-5 mr-2 text-teal-600" />
                                <span className="font-medium">Quality Guaranteed</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                                <span className="font-medium">195+ Countries</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index}
                                data-animate={`stat-${index}`}
                                className={`text-center transform transition-all duration-700 ${
                                    isVisible[`stat-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                                <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">
                            Why Choose <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Jia Ying</span>
                        </h2>
                        <p className="text-xl text-gray-600">Industry-leading features that set us apart</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                data-animate={`feature-${index}`}
                                className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform transition-all duration-500 ${
                                    isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                } hover:-translate-y-2`}
                                style={{ transitionDelay: `${feature.delay}s` }}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Jia Ying Introduction Section - Beautiful Real Chinese Girl */}
            <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 mb-6">
                                    Meet <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Jia Ying</span>
                                </h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-8"></div>
                            </div>
                            
                            <div className="space-y-6">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    "Welcome to a world where your shopping dreams become reality. I'm Jia Ying, and I've dedicated my career to bridging the gap between global markets and your unique needs."
                                </p>
                                
                                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm">
                                    <p className="text-gray-600 italic leading-relaxed">
                                        "With over 8 years of experience in international procurement, I understand that every purchase is personal, every product has a story, and every customer deserves nothing but excellence."
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Quality First</p>
                                            <p className="text-sm text-gray-600">Hand-selected products</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="w-6 h-6 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Personal Touch</p>
                                            <p className="text-sm text-gray-600">Dedicated support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/register"
                                    className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center"
                                >
                                    <span className="flex items-center justify-center">
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300">
                                    Learn More About Us
                                </button>
                            </div>
                        </div>
                        
                        {/* Image Content - Beautiful Real Chinese Girl */}
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-white via-emerald-50 to-teal-50">
                                {/* Real Beautiful Chinese Girl Image */}
                                <div className="relative aspect-[3/4]">
                                    {/* Background for image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-teal-100"></div>
                                    
                                    {/* Real beautiful Chinese girl photo - Using professional model image */}
                                    <img 
                                        src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                        alt="Jia Ying - Beautiful Chinese Shopping Consultant"
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            // Fallback to second beautiful Chinese girl image if first fails
                                            e.target.src = "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                    
                                    {/* Overlay gradient for better text readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                    
                                    {/* Professional Name Badge */}
                                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-emerald-100">
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                                Jia Ying
                                            </h3>
                                            <p className="text-emerald-600 font-medium text-sm">Senior Shopping Consultant</p>
                                            <div className="flex items-center justify-center mt-2 space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            </div>
                                            <p className="text-emerald-700 font-medium italic text-sm mt-2">
                                                "Bringing your dreams to reality"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Modern Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 via-teal-400/10 to-transparent rounded-bl-full"></div>
                                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-teal-400/20 via-emerald-400/10 to-transparent rounded-tr-full"></div>
                                
                                {/* Floating Elements */}
                                <div className="absolute top-8 left-8 w-3 h-3 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                                <div className="absolute top-16 right-12 w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                                <div className="absolute bottom-32 left-12 w-4 h-4 bg-emerald-300 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                            </div>
                            
                            {/* Floating achievement badges */}
                            <div className="absolute -top-8 -left-8 bg-white rounded-2xl shadow-xl p-4 transform rotate-12 hover:rotate-6 transition-transform duration-300">
                                <div className="flex items-center space-x-2">
                                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">4.9/5</p>
                                        <p className="text-xs text-gray-600">Customer Rating</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-4 transform -rotate-12 hover:-rotate-6 transition-transform duration-300">
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-6 h-6 text-emerald-600" />
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">50K+</p>
                                        <p className="text-xs text-gray-600">Happy Customers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Four simple steps to global shopping success</p>
                    </div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-blue-200"></div>
                        
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {howItWorks.map((step, index) => (
                                <div
                                    key={index}
                                    data-animate={`step-${index}`}
                                    className={`text-center transform transition-all duration-700 ${
                                        isVisible[`step-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div className="relative">
                                        <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white shadow-lg relative z-10`}>
                                            <step.icon className="w-10 h-10" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 text-5xl font-black text-gray-100 z-0">
                                            {step.step}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Customer Success Stories</h2>
                        <p className="text-xl text-gray-600">Join thousands of satisfied customers worldwide</p>
                    </div>

                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="relative overflow-hidden">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-500 ${
                                        currentSlide === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
                                    }`}
                                >
                                    <div className="text-center">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-24 h-24 rounded-full mx-auto mb-6 shadow-lg"
                                        />
                                        <div className="flex justify-center mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-xl text-gray-700 italic mb-6">"{testimonial.content}"</p>
                                        <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex justify-center items-center mt-8 space-x-4">
                            <button
                                onClick={prevSlide}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="flex space-x-2">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            currentSlide === index 
                                                ? 'w-8 bg-emerald-600' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextSlide}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-black text-white mb-6">
                        Ready to Experience the Jia Ying Difference?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Join thousands of satisfied customers who trust us with their global shopping needs
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="group px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center">
                                Get Started Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/login"
                            className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}