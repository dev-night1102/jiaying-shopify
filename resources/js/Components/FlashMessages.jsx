import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function FlashMessages() {
    const { flash = {} } = usePage().props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newMessages = [];
        
        if (flash?.success) {
            newMessages.push({ type: 'success', message: flash.success, id: Date.now() + 1 });
        }
        if (flash?.error) {
            newMessages.push({ type: 'error', message: flash.error, id: Date.now() + 2 });
        }
        if (flash?.warning) {
            newMessages.push({ type: 'warning', message: flash.warning, id: Date.now() + 3 });
        }
        if (flash?.info) {
            newMessages.push({ type: 'info', message: flash.info, id: Date.now() + 4 });
        }
        
        setMessages(newMessages);
        
        if (newMessages.length > 0) {
            const timer = setTimeout(() => {
                setMessages([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const removeMessage = (id) => {
        setMessages(messages.filter(msg => msg.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return CheckCircle;
            case 'error': return XCircle;
            case 'warning': return AlertTriangle;
            case 'info': return Info;
            default: return Info;
        }
    };

    const getClasses = (type) => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
            default: return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    if (messages.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2">
            {messages.map((msg) => {
                const Icon = getIcon(msg.type);
                return (
                    <div
                        key={msg.id}
                        className={`max-w-sm w-full shadow-lg rounded-lg border p-4 animate-slide-in ${getClasses(msg.type)}`}
                    >
                        <div className="flex items-start">
                            <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 text-sm">{msg.message}</div>
                            <button
                                onClick={() => removeMessage(msg.id)}
                                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}