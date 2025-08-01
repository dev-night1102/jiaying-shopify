import { router, usePage } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher() {
    const { locale } = usePage().props;
    const [isOpen, setIsOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'zh', name: '中文' },
    ];

    const switchLanguage = (langCode) => {
        router.post('/language', { language: langCode }, {
            preserveState: true,
            preserveScroll: true,
        });
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
            >
                <Globe className="h-5 w-5" />
                <span>{languages.find(lang => lang.code === locale)?.name}</span>
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => switchLanguage(lang.code)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                    locale === lang.code 
                                        ? 'bg-gray-100 text-gray-900' 
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}