import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import StatusBadge from '@/Components/StatusBadge';
import { useState, useEffect } from 'react';
import { 
    Search, 
    Filter, 
    User, 
    Crown, 
    Calendar, 
    CreditCard, 
    Package,
    Eye,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Users
} from 'lucide-react';

export default function AdminUsersIndex({ auth, users = {}, filters = null }) {
    const { t } = useTranslation();
    
    // Comprehensive error handling and data validation
    if (!auth?.user) {
        return <div className="p-8">Authentication error. Please refresh the page.</div>;
    }
    
    // Safe data extraction with comprehensive null checks
    const userData = Array.isArray(users?.data) ? users.data : [];
    const safeFilters = filters || {};
    const [search, setSearch] = useState(safeFilters.search || '');
    const [roleFilter, setRoleFilter] = useState(safeFilters.role || '');
    const [sortBy, setSortBy] = useState(safeFilters.sort || 'latest');
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Handle search with debouncing
    const handleSearch = (value) => {
        setSearch(value);
        
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        const timeout = setTimeout(() => {
            router.get('/admin/users', {
                search: value,
                role: roleFilter,
                sort: sortBy
            }, {
                preserveState: true,
                preserveScroll: true
            });
        }, 500);
        
        setSearchTimeout(timeout);
    };

    // Handle filter changes
    const handleFilterChange = (filterType, value) => {
        if (filterType === 'role') {
            setRoleFilter(value);
        } else if (filterType === 'sort') {
            setSortBy(value);
        }
        
        router.get('/admin/users', {
            search,
            role: filterType === 'role' ? value : roleFilter,
            sort: filterType === 'sort' ? value : sortBy
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title={t('manage_users')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Users className="w-8 h-8 mr-3 text-emerald-600" />
                                    User Management
                                </h1>
                                <p className="text-gray-600 mt-1">Manage user accounts, roles, and access</p>
                            </div>
                            <div className="text-sm text-gray-500">
                                Total Users: <span className="font-semibold text-gray-900">{users?.total || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    />
                                </div>
                            </div>
                            
                            {/* Role Filter */}
                            <div className="min-w-48">
                                <select
                                    value={roleFilter}
                                    onChange={(e) => handleFilterChange('role', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">Users</option>
                                    <option value="admin">Administrators</option>
                                </select>
                            </div>
                            
                            {/* Sort */}
                            <div className="min-w-48">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                >
                                    <option value="latest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="name">By Name</option>
                                    <option value="orders">By Orders</option>
                                    <option value="balance">By Balance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
                        </div>

                        {Array.isArray(userData) && userData.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <User className="w-4 h-4 mr-2" />
                                                    User
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <Crown className="w-4 h-4 mr-2" />
                                                    Role
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <CreditCard className="w-4 h-4 mr-2" />
                                                    Balance
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <Package className="w-4 h-4 mr-2" />
                                                    Orders
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Joined
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {userData.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm mr-4">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                ID: {user.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        user.role === 'admin'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-teal-100 text-teal-800'
                                                    }`}>
                                                        {user.role === 'admin' ? (
                                                            <Crown className="w-3 h-3 mr-1" />
                                                        ) : (
                                                            <User className="w-3 h-3 mr-1" />
                                                        )}
                                                        {user.role === 'admin' ? 'Administrator' : 'User'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                                                        <span className="text-sm font-semibold text-gray-900">
                                                            {(user.balance || 0).toLocaleString('en-US', {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {user.orders_count || 0}
                                                        </div>
                                                        <span className="ml-2 text-xs text-gray-500">orders</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(user.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/admin/users/${user.id}`}
                                                            className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            View
                                                        </Link>
                                                        <button className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-teal-100 text-teal-700 hover:bg-teal-200 transition-colors">
                                                            <DollarSign className="w-4 h-4 mr-1" />
                                                            Balance
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                                <p className="text-gray-500 mb-4">
                                    {search || roleFilter 
                                        ? "Try adjusting your search or filter criteria" 
                                        : "No users have been registered yet"
                                    }
                                </p>
                                {(search || roleFilter) && (
                                    <button 
                                        onClick={() => {
                                            setSearch('');
                                            setRoleFilter('');
                                            router.get('/admin/users');
                                        }}
                                        className="text-emerald-600 hover:text-emerald-800 font-medium"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {/* Pagination */}
                        {Array.isArray(userData) && userData.length > 0 && users?.links && (
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Showing {users.from || 0} to {users.to || 0} of {users.total || 0} users
                                    </div>
                                    <div className="flex space-x-2">
                                        {Array.isArray(users.links) && users.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                    link.active
                                                        ? 'bg-emerald-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}