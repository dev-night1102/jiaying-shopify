import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/Button';
import { useTranslation } from '@/Utils/i18n';

export default function Plans({ auth, hasUsedTrial, currentMembership }) {
    const { t } = useTranslation();
    const { post, processing } = useForm({
        payment_method: 'wallet'
    });

    const handleSubscribe = (plan) => {
        if (plan === 'trial' && hasUsedTrial) {
            alert(t('membership.trial_already_used'));
            return;
        }
        
        post('/membership/subscribe');
    };

    const plans = [
        {
            id: 'trial',
            name: t('membership.trial_plan'),
            price: t('membership.free'),
            duration: t('membership.days', { count: 7 }),
            features: [
                t('membership.limited_orders'),
                t('membership.basic_support'),
                t('membership.standard_processing')
            ],
            disabled: hasUsedTrial,
            buttonText: hasUsedTrial ? t('membership.trial_used') : t('membership.start_trial')
        },
        {
            id: 'monthly',
            name: t('membership.monthly_plan'),
            price: '$99',
            duration: t('membership.per_month'),
            features: [
                t('membership.unlimited_orders'),
                t('membership.priority_support'),
                t('membership.fast_processing'),
                t('membership.advanced_analytics')
            ],
            disabled: currentMembership?.type === 'paid',
            buttonText: currentMembership?.type === 'paid' ? t('membership.current_plan') : t('membership.subscribe')
        }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('membership.plans')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">{t('membership.choose_plan')}</h2>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {plans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`border rounded-lg p-6 ${
                                            plan.disabled ? 'opacity-60' : ''
                                        }`}
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                        <div className="mb-4">
                                            <span className="text-3xl font-bold">{plan.price}</span>
                                            <span className="text-gray-600 ml-2">{plan.duration}</span>
                                        </div>
                                        
                                        <ul className="mb-6 space-y-2">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <Button
                                            className="w-full"
                                            disabled={plan.disabled || processing}
                                            onClick={() => handleSubscribe(plan.id)}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-6 text-center">
                                <Link
                                    href="/membership"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    {t('common.back')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}