import React from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import Panel from '@/components/molecules/Panel';
import SummaryCard from '@/components/molecules/SummaryCard';
import RecentExpensesList from '@/components/organisms/RecentExpensesList';
import ApperIcon from '@/components/ApperIcon';

const DashboardSection = ({ 
    totalSpent, 
    filteredExpensesLength, 
    categoryTotals, 
    chartData, 
    filteredExpenses, 
    categories, 
    onAddExpense 
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard 
                    iconName="TrendingUp" 
                    title="Total Spent" 
                    value={`$${totalSpent.toFixed(2)}`} 
                    subtext="This Month" 
                    bgColorClass="from-primary to-primary-dark"
                    textColorClass="text-primary-light"
                />
                <SummaryCard 
                    iconName="Receipt" 
                    title="Transactions" 
                    value={filteredExpensesLength} 
                    subtext="This Month" 
                    bgColorClass="from-secondary to-secondary-dark"
                    textColorClass="text-secondary-light"
                />
                <SummaryCard 
                    iconName="PieChart" 
                    title="Categories" 
                    value={Object.keys(categoryTotals).length} 
                    subtext="Active" 
                    bgColorClass="from-accent to-orange-600"
                    textColorClass="text-orange-200"
                />
            </div>

            {/* Chart and Recent Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Breakdown Chart */}
                <Panel
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Spending Breakdown</h3>
                    {Object.keys(categoryTotals).length > 0 ? (
                        <Chart
                            options={chartData.options}
                            series={chartData.series}
                            type="donut"
                            height={300}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                            <ApperIcon name="PieChart" className="w-16 h-16 mb-4" />
                            <p>No expenses to display</p>
                        </div>
                    )}
                </Panel>

                {/* Recent Expenses */}
                <RecentExpensesList 
                    expenses={filteredExpenses} 
                    categories={categories} 
                    onAddExpense={onAddExpense} 
                />
            </div>
        </motion.div>
    );
};

export default DashboardSection;