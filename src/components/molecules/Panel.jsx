import React from 'react';
import { motion } from 'framer-motion';

const Panel = ({ children, className, ...rest }) => {
    return (
        <motion.div 
            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card ${className || ''}`}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default Panel;