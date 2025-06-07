import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Panel from '@/components/molecules/Panel';
import ExportOptionCard from '@/components/molecules/ExportOptionCard';
import ApperIcon from '@/components/ApperIcon';

const ExportSection = ({ expenses, categories, budgets, totalSpent }) => {
    const exportCsv = () => {
        const csvData = expenses.map(expense => ({
            Date: format(new Date(expense.date), 'yyyy-MM-dd'),
            Amount: expense.amount,
            Category: expense.category,
            Description: expense.description
        }));
        
        const csv = [
            Object.keys(csvData[0] || {}).join(','),
            ...csvData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pennywise-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        
        toast.success('Data exported successfully!');
    };

    const exportJson = () => {
        const jsonData = {
            exportDate: new Date().toISOString(),
            totalExpenses: expenses.length,
            totalAmount: totalSpent,
            expenses: expenses,
            categories: categories,
            budgets: budgets
        };
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pennywise-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
        a.click();
        
        toast.success('Backup created successfully!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Panel className="text-center">
                <ApperIcon name="Download" className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Export Your Data</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">Download your expense data for external analysis</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                    <ExportOptionCard 
                        iconName="FileText" 
                        title="Export as CSV" 
                        onClick={exportCsv} 
                        colorClass="primary"
                    />
                    <ExportOptionCard 
                        iconName="Database" 
                        title="Full Backup" 
                        onClick={exportJson} 
                        colorClass="secondary"
                    />
                </div>
            </Panel>
        </motion.div>
    );
};

export default ExportSection;