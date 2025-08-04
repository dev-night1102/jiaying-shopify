import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Utils/i18n';
import Button from '@/Components/Button';
import Input from '@/Components/Input';

export default function ChatCreate({ auth, orders = [] }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        subject: '',
        order_id: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/chats');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t('new_chat')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold mb-6">{t('start_new_chat')}</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('subject')}
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        error={errors.subject}
                                        placeholder={t('enter_subject')}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('related_order')} ({t('optional')})
                                    </label>
                                    <select
                                        value={data.order_id}
                                        onChange={(e) => setData('order_id', e.target.value)}
                                        className="input w-full"
                                    >
                                        <option value="">{t('select_order')}</option>
                                        {orders.map((order) => (
                                            <option key={order.id} value={order.id}>
                                                #{order.order_number} - {order.product_link.substring(0, 50)}...
                                            </option>
                                        ))}
                                    </select>
                                    {errors.order_id && (
                                        <p className="text-sm text-red-600 mt-1">{errors.order_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('message')}
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        rows="4"
                                        className="input w-full"
                                        placeholder={t('describe_your_issue')}
                                        required
                                    />
                                    {errors.message && (
                                        <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button href="/chats" variant="secondary">
                                        {t('cancel')}
                                    </Button>
                                    <Button type="submit" variant="primary" loading={processing}>
                                        {t('start_chat')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}