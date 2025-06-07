import React from 'react';

const FormField = ({ label, id, children, className, labelClassName, hint }) => {
    return (
        <div className={className}>
            <label htmlFor={id} className={`block text-sm font-medium text-gray-700 mb-2 ${labelClassName || ''}`}>
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
};

export default FormField;