import React from 'react';
import { motion } from 'framer-motion';
import Panel from '@/components/molecules/Panel';

const LoadingState = ({ count = 3 }) => {
    return (
        <div className="space-y-6">
            {[...Array(count)].map((_, i) => (
                <Panel
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </Panel>
            ))}
        </div>
    );
};

export default LoadingState;