import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Panel from '@/components/molecules/Panel';

const ErrorState = ({ message, onRetry }) => {
    return (
        <Panel
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
        >
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">Something went wrong</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
            <Button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
                Try Again
            </Button>
        </Panel>
    );
};

export default ErrorState;