import React from 'react';
import { motion } from 'framer-motion';
import Panel from '@/components/molecules/Panel';
import Button from '@/components/atoms/Button';
import ExpenseItem from '@/components/molecules/ExpenseItem';
import ApperIcon from '@/components/ApperIcon';

const RecentExpensesList = ({ expenses, categories, onAddExpense }) => {
    return (
        <Panel
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Expenses</h3>
                <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddExpense}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add</span>
                </Button>
            </div>
            
            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                {expenses.slice(0, 5).map((expense, index) => {
                    const category = categories.find(c => c.name === expense.category);
                    return (
                        <ExpenseItem
                            key={expense.id}
                            expense={expense}
                            category={category}
                            animationDelay={index * 0.1}
                        />
                    );
                })}
                
                {expenses.length === 0 && (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                        <ApperIcon name="Receipt" className="w-12 h-12 mx-auto mb-3" />
                        <p>No expenses yet</p>
                        <p className="text-sm">Add your first expense to get started</p>
                    </div>
                )}
            </div>
        </Panel>
    );
};

export default RecentExpensesList;