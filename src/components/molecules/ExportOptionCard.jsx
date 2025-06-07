import React from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ExportOptionCard = ({ iconName, title, onClick, colorClass }) => {
    return (
        <Button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex flex-col items-center space-y-3 p-6 border-2 border-dashed rounded-xl hover:bg-opacity-5 transition-colors 
            ${colorClass === 'primary' ? 'border-primary hover:bg-primary-light' : 'border-secondary hover:bg-secondary-light'}`}
        >
            <ApperIcon name={iconName} className={`w-8 h-8 ${colorClass === 'primary' ? 'text-primary' : 'text-secondary'}`} />
            <span className={`font-medium ${colorClass === 'primary' ? 'text-primary' : 'text-secondary'}`}>{title}</span>
        </Button>
    );
};

export default ExportOptionCard;