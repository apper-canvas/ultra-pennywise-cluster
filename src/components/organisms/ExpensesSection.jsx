import React from 'react';
import { motion } from 'framer-motion';
import Panel from '@/components/molecules/Panel';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ExpenseItem from '@/components/molecules/ExpenseItem';
import ApperIcon from '@/components/ApperIcon';

const ExpensesSection = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedPeriod,
    setSelectedPeriod,
    categories,
    filteredExpenses,
    onDeleteExpense,
    onAddExpense,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Filters and Search */}
            <Panel>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Search">
                        <div className="relative">
                            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search expenses..."
                                className="pl-10 pr-4"
                            />
                        </div>
                    </FormField>
                    
                    <FormField label="Category">
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </Select>
                    </FormField>
                    
                    <FormField label="Period">
                        <Select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                        >
                            <option value="month">This Month</option>
                            <option value="all">All Time</option>
                        </Select>
                    </FormField>
                </div>
            </Panel>

            {/* Expenses List */}
            <Panel className="overflow-hidden p-0">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Expenses ({filteredExpenses.length})
                        </h3>
                        <Button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onAddExpense}
                            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                            <ApperIcon name="Plus" className="w-4 h-4" />
                            <span>Add Expense</span>
                        </Button>
                    </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                    {filteredExpenses.map((expense, index) => {
                        const category = categories.find(c => c.name === expense.category);
                        return (
                            <motion.div
                                key={expense.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div 
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: category?.color + '20' }}
                                    >
                                        <ApperIcon 
                                            name={category?.icon || 'DollarSign'} 
                                            className="w-6 h-6"
                                            style={{ color: category?.color }}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-100">{expense.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.category}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                                        ${expense.amount.toFixed(2)}
                                    </span>
                                    <Button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onDeleteExpense(expense.id)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                    >
                                        <ApperIcon name="Trash2" className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                    
                    {filteredExpenses.length === 0 && (
                        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                            <ApperIcon name="Receipt" className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-lg">No expenses found</p>
                            <p className="text-sm">Try adjusting your filters or add a new expense</p>
                        </div>
                    )}
                </div>
            </Panel>
        </motion.div>
    );
};

export default ExpensesSection;