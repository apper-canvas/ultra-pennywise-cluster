import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Panel from '@/components/molecules/Panel';

const BudgetProgressCard = ({ budget, category, spentAmount, animationDelay }) => {
    const categoryColor = category?.color || '#ccc'; // Default color if category not found
    const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
    const isOverBudget = percentage > 100;

    return (
        <Panel
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
        >
            <div className="flex items-center space-x-3 mb-4">
                <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: categoryColor + '20' }}
                >
                    <ApperIcon 
                        name={category?.icon || 'Target'} 
                        className="w-6 h-6"
                        style={{ color: categoryColor }}
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">{category?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{budget.period}</p>
                </div>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Spent</span>
                    <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-800 dark:text-gray-100'}`}>
                        ${spentAmount.toFixed(2)}
                    </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: animationDelay + 0.1 }}
                        className={`h-3 rounded-full ${
                          isOverBudget 
                            ? 'bg-gradient-to-r from-red-400 to-red-600' 
                            : percentage > 80
                            ? 'bg-gradient-to-r from-accent to-orange-600'
                            : 'bg-gradient-to-r from-primary to-primary-dark'
                        }`}
                    />
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Budget</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">${budget.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Remaining</span>
                    <span className={`font-medium ${
                        isOverBudget ? 'text-red-600' : 'text-primary'
                    }`}>
                        ${isOverBudget ? '0.00' : (budget.amount - spentAmount).toFixed(2)}
                    </span>
                </div>
                
                {isOverBudget && (
                    <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900 px-3 py-2 rounded-lg">
                        Over budget by ${(spentAmount - budget.amount).toFixed(2)}
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default BudgetProgressCard;