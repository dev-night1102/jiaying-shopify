import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    Menu, 
    X, 
    ShoppingBag, 
    User, 
    CreditCard, 
    MessageSquare, 
    Package, 
    LogOut, 
    Globe,
    Bell,
    Search,
    Settings,
    ChevronDown,
    Home,
    Crown,
    Activity,
    Sparkles
} from 'lucide-react';
import { useTranslation } from '@/Utils/i18n';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import FlashMessages from '@/Components/FlashMessages';

export default function AuthenticatedLayout({ user, children }) {
    const { auth, notifications } = usePage().props;
    const currentUser = user || auth?.user;
    const { t } = useTranslation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const isAdmin = currentUser?.role === 'admin';

    const navigation = isAdmin ? [
        { name: t('Admin Dashboard'), href: '/admin/dashboard', icon: Home },
        { 
            name: t('Orders'), 
            href: '/admin/orders', 
            icon: Package,
            badge: (notifications?.pending_orders || 0) + (notifications?.quoted_orders || 0) + (notifications?.paid_orders || 0)
        },
        { 
            name: t('Chats'), 
            href: '/admin/chats', 
            icon: MessageSquare,
            badge: notifications?.unread_chats || 0
        },
        { name: t('Users'), href: '/admin/users', icon: User },
    ] : [
        { name: t('Dashboard'), href: '/dashboard', icon: Home },
        { 
            name: t('Orders'), 
            href: '/orders', 
            icon: Package,
            badge: notifications?.order_updates || 0
        },
        { name: t('Membership'), href: '/memberships', icon: Crown },
        { 
            name: t('Chats'), 
            href: '/chats', 
            icon: MessageSquare,
            badge: notifications?.unread_chats || 0
        },
        { name: t('Payments'), href: '/payments', icon: CreditCard },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <ShoppingBag className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        ShopAgent Pro
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        {isAdmin ? 'Admin Portal' : 'Client Dashboard'}
                                    </p>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                    <span>{item.name}</span>
                                    {item.badge > 0 && (
                                        <div className="relative">
                                            <span className="absolute -top-2 -right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-lg">
                                                {item.badge}
                                            </span>
                                            <div className="absolute -top-2 -right-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-ping opacity-75">
                                                {item.badge}
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Search Button */}
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                                <Search className="w-5 h-5" />
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200">
                                <Bell className="w-5 h-5" />
                                {(notifications?.total || 0) > 0 && (
                                    <div className="absolute -top-1 -right-1">
                                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse">
                                            {notifications.total}
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                )}
                            </button>

                            {/* Language Switcher */}
                            <div className="hidden sm:block">
                                <LanguageSwitcher />
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    className="flex items-center space-x-3 p-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all duration-200"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-semibold">{currentUser?.name}</p>
                                        <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Member'}</p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Dropdown */}
                                {userDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 animate-slide-down z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <User className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                                                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                                    <div className="flex items-center mt-1">
                                                        {isAdmin ? (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                                                <Crown className="w-3 h-3 mr-1" />
                                                                Admin
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                                <Activity className="w-3 h-3 mr-1" />
                                                                Member
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="py-2">
                                            <Link
                                                href="/profile"
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                            >
                                                <Settings className="w-4 h-4 mr-3" />
                                                Profile Settings
                                            </Link>
                                            {!isAdmin && (
                                                <Link
                                                    href="/memberships"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
                                                >
                                                    <Crown className="w-4 h-4 mr-3" />
                                                    Upgrade Plan
                                                    <Sparkles className="w-3 h-3 ml-auto text-yellow-500" />
                                                </Link>
                                            )}
                                        </div>
                                        
                                        <div className="border-t border-gray-100 py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-down">
                        <div className="px-4 py-3 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.badge > 0 && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <div className="pt-16">
                {/* Flash Messages */}
                <FlashMessages />
                
                {/* Page Content */}
                <main className="py-6">
                    {children}
                </main>
            </div>

            {/* Background click handler for dropdowns */}
            {(userDropdownOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setUserDropdownOpen(false);
                    }}
                />
            )}
        </div>
    );
}