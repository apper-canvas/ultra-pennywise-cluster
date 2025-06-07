import React from 'react';

const Select = ({ value, onChange, className, children, required, ...rest }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
            required={required}
            {...rest}
        >
            {children}
        </select>
    );
};

export default Select;