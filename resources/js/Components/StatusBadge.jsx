import { useTranslation } from '@/Utils/i18n';

export default function StatusBadge({ status, type = 'order' }) {
    const { t } = useTranslation();
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'quoted':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'paid':
                return 'bg-purple-100 text-purple-800';
            case 'purchased':
                return 'bg-indigo-100 text-indigo-800';
            case 'inspected':
                return 'bg-cyan-100 text-cyan-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'refunded':
            case 'cancelled':
                return 'bg-gray-100 text-gray-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'trial':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`badge ${getStatusColor(status)}`}>
            {t(status.charAt(0).toUpperCase() + status.slice(1))}
        </span>
    );
}