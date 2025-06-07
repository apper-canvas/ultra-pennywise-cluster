import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const BudgetFormModal = ({ show, onClose, budgetForm, setBudgetForm, categories, onSubmit }) => {
    if (!show) return null;

    return (
        <AnimatePresence>
            {show && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Set Budget</h3>
                                <Button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ApperIcon name="X" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </Button>
                            </div>
                            
                            <form onSubmit={onSubmit} className="space-y-4">
                                <FormField label="Category *" id="budget-category">
                                    <Select
                                        id="budget-category"
                                        value={budgetForm.categoryId}
                                        onChange={(e) => setBudgetForm(prev => ({ ...prev, categoryId: e.target.value }))}
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Select>
                                </FormField>
                                
                                <FormField label="Budget Amount *" id="budget-amount">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                                        <Input
                                            id="budget-amount"
                                            type="number"
                                            step="0.01"
                                            value={budgetForm.amount}
                                            onChange={(e) => setBudgetForm(prev => ({ ...prev, amount: e.target.value }))}
                                            className="pl-8 pr-4"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </FormField>
                                
                                <FormField label="Period" id="budget-period">
                                    <Select
                                        id="budget-period"
                                        value={budgetForm.period}
                                        onChange={(e) => setBudgetForm(prev => ({ ...prev, period: e.target.value }))}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="yearly">Yearly</option>
                                    </Select>
                                </FormField>
                                
                                <div className="flex space-x-3 pt-4">
                                    <Button
                                        type="button"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all"
                                    >
                                        Set Budget
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BudgetFormModal;