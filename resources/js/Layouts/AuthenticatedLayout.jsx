import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ShoppingBag, User, CreditCard, MessageSquare, Package, LogOut, Globe } from 'lucide-react';
import { useTranslation } from '@/Utils/i18n';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import FlashMessages from '@/Components/FlashMessages';

export default function AuthenticatedLayout({ user, children }) {
    const { auth } = usePage().props;
    const currentUser = user || auth?.user;
    const { t } = useTranslation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isAdmin = currentUser?.role === 'admin';

    const navigation = isAdmin ? [
        { name: t('Admin Dashboard'), href: '/admin/dashboard', icon: ShoppingBag },
        { name: t('Orders'), href: '/admin/orders', icon: Package },
        { name: t('Chat'), href: '/admin/chats', icon: MessageSquare },
        { name: t('User Management'), href: '/admin/users', icon: User },
    ] : [
        { name: t('Dashboard'), href: '/dashboard', icon: ShoppingBag },
        { name: t('Orders'), href: '/orders', icon: Package },
        { name: t('Membership'), href: '/membership', icon: CreditCard },
        { name: t('Chat'), href: '/chats', icon: MessageSquare },
        { name: t('Payments'), href: '/payments', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="lg:hidden">
                <div className="fixed inset-0 z-40 flex" style={{ display: sidebarOpen ? 'flex' : 'none' }}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                            <div className="flex flex-shrink-0 items-center px-4">
                                <h1 className="text-xl font-bold text-primary-600">Shopping Agent</h1>
                            </div>
                            <nav className="mt-5 space-y-1 px-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                                    >
                                        <item.icon className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                            <div className="flex items-center">
                                <div>
                                    <p className="text-base font-medium text-gray-700">{currentUser?.name}</p>
                                    <p className="text-sm font-medium text-gray-500">{currentUser?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex flex-shrink-0 items-center px-4">
                            <h1 className="text-xl font-bold text-primary-600">Shopping Agent</h1>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                                >
                                    <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <div className="flex items-center w-full">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                                <p className="text-xs font-medium text-gray-500">{currentUser?.email}</p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="ml-3 p-2 text-gray-400 hover:text-gray-500"
                            >
                                <LogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col lg:pl-64">
                <div className="sticky top-0 z-10 bg-white shadow">
                    <div className="flex h-16 justify-between px-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center">
                            <LanguageSwitcher />
                            {currentUser?.membership && (
                                <div className="ml-4 flex items-center text-sm">
                                    <span className="badge bg-primary-100 text-primary-800">
                                        {currentUser?.membership?.type === 'trial' ? t('Trial') : t('Paid')}
                                    </span>
                                    <span className="ml-2 text-gray-500">
                                        {currentUser?.membership?.days_remaining} {t('days remaining')}
                                    </span>
                                </div>
                            )}
                            <span className="ml-4 text-sm text-gray-700">
                                {t('Balance')}: ${currentUser?.balance || '0.00'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <main className="flex-1">
                    <FlashMessages />
                    <div className="py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}