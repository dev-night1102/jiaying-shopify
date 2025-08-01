import { Link } from '@inertiajs/react';
import LoadingSpinner from './LoadingSpinner';

export default function Button({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    disabled = false,
    href,
    method = 'get',
    as = 'button',
    children,
    className = '',
    ...props 
}) {
    const baseClasses = 'btn';
    
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        ghost: 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
    };
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    } ${className}`;

    const content = (
        <>
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {children}
        </>
    );

    if (href) {
        return (
            <Link 
                href={href} 
                method={method}
                as={as}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {content}
            </Link>
        );
    }

    return (
        <button 
            className={classes} 
            disabled={disabled || loading}
            {...props}
        >
            {content}
        </button>
    );
}