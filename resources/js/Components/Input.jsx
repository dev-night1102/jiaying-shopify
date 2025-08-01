import { forwardRef } from 'react';

const Input = forwardRef(({ 
    type = 'text',
    label,
    error,
    className = '',
    ...props 
}, ref) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="label">
                    {label}
                </label>
            )}
            <input
                type={type}
                ref={ref}
                className={`input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;