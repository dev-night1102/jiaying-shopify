import React from 'react';
import { Link } from '@inertiajs/react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Jia Ying
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted shopping agent for quality products and exceptional service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-emerald-400">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/orders" className="text-gray-400 hover:text-white transition-colors">
                                    Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/memberships" className="text-gray-400 hover:text-white transition-colors">
                                    Memberships
                                </Link>
                            </li>
                            <li>
                                <Link href="/chats" className="text-gray-400 hover:text-white transition-colors">
                                    Support Chat
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-emerald-400">Services</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">Product Sourcing</li>
                            <li className="text-gray-400">Quality Assurance</li>
                            <li className="text-gray-400">Fast Shipping</li>
                            <li className="text-gray-400">24/7 Support</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-emerald-400">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Mail className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">contact@jiaying.com</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <Phone className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">123 Business Ave, Suite 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm">
                            © 2025 Jia Ying. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                            <span>by Jia Ying Team</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}