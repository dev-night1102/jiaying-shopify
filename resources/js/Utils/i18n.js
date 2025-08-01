import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

const translations = {
    en: () => import('../../lang/en/app.json'),
    zh: () => import('../../lang/zh/app.json'),
};

let loadedTranslations = {};

export async function loadTranslations(locale) {
    if (!loadedTranslations[locale]) {
        const module = await translations[locale]();
        loadedTranslations[locale] = module.default || module;
    }
    return loadedTranslations[locale];
}

export function useTranslation() {
    const { locale } = usePage().props;
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        loadTranslations(locale).then(setTranslations);
    }, [locale]);

    const t = (key, replacements = {}) => {
        let translation = translations[key] || key;
        
        Object.keys(replacements).forEach(key => {
            translation = translation.replace(`:${key}`, replacements[key]);
        });
        
        return translation;
    };

    return { t, locale };
}