import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const AppHeader = ({ isDarkMode, toggleDarkMode }) => {
    return (
        <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 shadow-soft border-b border-gray-200 dark:border-gray-700"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg"
                        >
                            <ApperIcon name="Coins" className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                PennyWise
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Smart Expense Tracking</p>
                        </div>
                    </div>
                    
                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ApperIcon 
                            name={isDarkMode ? "Sun" : "Moon"} 
                            className="w-5 h-5 text-gray-600 dark:text-gray-300" 
                        />
                    </Button>
                </div>
            </div>
        </motion.header>
    );
};

export default AppHeader;