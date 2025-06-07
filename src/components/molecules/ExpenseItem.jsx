import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ExpenseItem = ({ expense, category, onDelete, animationDelay }) => {
    const categoryColor = category?.color || '#ccc'; // Default color if category not found

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
            <div className="flex items-center space-x-3">
                <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: categoryColor + '20' }}
                >
                    <ApperIcon 
                        name={category?.icon || 'DollarSign'} 
                        className="w-5 h-5"
                        style={{ color: categoryColor }}
                    />
                </div>
                <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{expense.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                </div>
            </div>
            <div className="text-right flex items-center space-x-3">
                <div className="hidden sm:block"> {/* Hide date on very small screens */}
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">${expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(expense.date), 'MMM dd')}</p>
                </div>
                <div className="sm:hidden text-gray-800 dark:text-gray-100 font-semibold">
                    ${expense.amount.toFixed(2)}
                </div>
                {onDelete && (
                    <Button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(expense.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </motion.div>
    );
};

export default ExpenseItem;