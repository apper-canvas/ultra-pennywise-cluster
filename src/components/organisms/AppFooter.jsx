import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const AppFooter = () => {
    return (
        <motion.footer 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16"
        >
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © 2024 PennyWise. Making expense tracking effortless.
                    </p>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <ApperIcon name="Shield" className="w-4 h-4" />
                            <span>Secure & Private</span>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            <ApperIcon name="Smartphone" className="w-4 h-4" />
                            <span>Mobile Ready</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default AppFooter;