import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import StatusBadge from '@/Components/StatusBadge';

export default function MembershipIndex({ auth, membership, plans = [] }) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('membership')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">{t('current_membership')}</h2>
                            
                            {membership ? (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium capitalize">{membership.type} {t('plan')}</h3>
                                            <p className="text-gray-600 mt-2">
                                                {t('expires_at')}: {new Date(membership.expires_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusBadge status={membership.is_active ? 'active' : 'expired'} />
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-8 p-6 bg-yellow-50 rounded-lg">
                                    <p className="text-yellow-800">{t('no_active_membership')}</p>
                                </div>
                            )}

                            <h3 className="text-xl font-semibold mb-4">{t('available_plans')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {plans.map((plan) => (
                                    <div key={plan.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                                        <h4 className="text-lg font-semibold mb-2">{plan.name}</h4>
                                        <p className="text-3xl font-bold mb-4">
                                            ${plan.price}
                                            <span className="text-sm text-gray-600">/{plan.duration} {t('days')}</span>
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-sm">
                                                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button 
                                            variant="primary" 
                                            className="w-full"
                                            href="/membership/subscribe"
                                            method="post"
                                            data={{ plan_id: plan.id }}
                                        >
                                            {t('subscribe')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}