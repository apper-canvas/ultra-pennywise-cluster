import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className, required, step, ...rest }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
            required={required}
            step={step}
            {...rest}
        />
    );
};

export default Input;