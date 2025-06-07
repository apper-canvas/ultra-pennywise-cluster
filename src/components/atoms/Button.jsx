import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, type = 'button', ...rest }) => {
    return (
        <motion.button 
            type={type} 
            onClick={onClick} 
            className={className}
            {...rest}
        >
            {children}
        </motion.button>
    );
};

export default Button;