import { Link } from '@inertiajs/react';
import { useTranslation } from '@/Utils/i18n';
import LanguageSwitcher from '@/Components/LanguageSwitcher';

export default function GuestLayout({ children }) {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            
            <div>
                <Link href="/">
                    <h1 className="text-3xl font-bold text-primary-600">Shopping Agent</h1>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}