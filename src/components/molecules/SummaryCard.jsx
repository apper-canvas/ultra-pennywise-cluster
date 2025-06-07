import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SummaryCard = ({ iconName, title, value, subtext, bgColorClass, textColorClass, ...rest }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className={`rounded-2xl p-6 text-white shadow-lg ${bgColorClass}`}
            {...rest}
        >
            <div className="flex items-center justify-between mb-4">
                <ApperIcon name={iconName} className="w-8 h-8" />
                <span className={`text-sm font-medium ${textColorClass}`}>{subtext}</span>
            </div>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            <p className={textColorClass}>{title}</p>
        </motion.div>
    );
};

export default SummaryCard;