import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TabButton = ({ label, iconName, isActive, onClick }) => {
    return (
        <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
            <ApperIcon name={iconName} className="w-4 h-4" />
            <span className="font-medium">{label}</span>
        </Button>
    );
};

export default TabButton;