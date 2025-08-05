import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, memberships, isAdmin, membershipPlans }) {
    const handleSubscribe = (planType) => {
        router.post(route('memberships.subscribe'), { type: planType });
    };

    const handleTopUp = (amount) => {
        router.post(route('memberships.top-up'), { amount });
    };

    const handleCancel = (membershipId) => {
        if (confirm('Are you sure you want to cancel this membership?')) {
            router.post(route('memberships.cancel', membershipId));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Memberships</h2>}
        >
            <Head title="Memberships" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Current Balance */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Account Balance</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold text-green-600">
                                    ${auth.user.balance}
                                </span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleTopUp(50)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add $50
                                    </button>
                                    <button
                                        onClick={() => handleTopUp(100)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Add $100
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Current Membership */}
                    {auth.user.membership && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                            <div className="p-6 text-gray-900">
                                <h3 className="text-lg font-medium mb-4">Current Membership</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-blue-600">
                                            {auth.user.membership.type.charAt(0).toUpperCase() + auth.user.membership.type.slice(1)}
                                        </span>
                                        <p className="text-gray-600">
                                            {auth.user.membership.days_remaining} days remaining
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">
                                            Expires: {new Date(auth.user.membership.expires_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Membership Plans */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {Object.entries(membershipPlans).map(([key, plan]) => (
                                    <div key={key} className="border rounded-lg p-4">
                                        <h4 className="font-bold text-lg mb-2">{plan.name}</h4>
                                        <p className="text-2xl font-bold text-green-600 mb-4">
                                            ${plan.price}
                                            <span className="text-sm text-gray-500">/month</span>
                                        </p>
                                        <ul className="text-sm text-gray-600 mb-4">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="mb-1">• {feature}</li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => handleSubscribe(key)}
                                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            disabled={auth.user.membership?.type === key}
                                        >
                                            {auth.user.membership?.type === key ? 'Current Plan' : 'Subscribe'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Membership History */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Membership History</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Started
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expires
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            {!isAdmin && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {memberships.data.map((membership) => (
                                            <tr key={membership.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {membership.type.charAt(0).toUpperCase() + membership.type.slice(1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        membership.status === 'active' 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {membership.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(membership.started_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(membership.expires_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${membership.amount_paid}
                                                </td>
                                                {!isAdmin && membership.status === 'active' && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleCancel(membership.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}