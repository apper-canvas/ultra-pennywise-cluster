import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import BudgetProgressCard from '@/components/molecules/BudgetProgressCard';

const BudgetsSection = ({ budgets, categories, categoryTotals, onSetBudget }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Overview</h2>
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSetBudget}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Set Budget</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {budgets.map((budget, index) => {
                    const category = categories.find(c => c.id === budget.categoryId);
                    const spent = categoryTotals[category?.name] || 0;
                    
                    return (
                        <BudgetProgressCard
                            key={budget.id || index}
                            budget={budget}
                            category={category}
                            spentAmount={spent}
                            animationDelay={index * 0.1}
                        />
                    );
                })}
                
                {budgets.length === 0 && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="col-span-full text-center py-12 text-gray-400 dark:text-gray-500"
                    >
                        <ApperIcon name="Target" className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-lg">No budgets set</p>
                        <p className="text-sm">Create your first budget to start tracking spending goals</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default BudgetsSection;