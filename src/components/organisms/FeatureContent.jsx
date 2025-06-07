import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { expenseService, categoryService, budgetService } from '@/services';

import TabButton from '@/components/molecules/TabButton';
import Panel from '@/components/molecules/Panel';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

import LoadingState from '@/components/organisms/LoadingState';
import ErrorState from '@/components/organisms/ErrorState';
import DashboardSection from '@/components/organisms/DashboardSection';
import ExpensesSection from '@/components/organisms/ExpensesSection';
import BudgetsSection from '@/components/organisms/BudgetsSection';
import ExportSection from '@/components/organisms/ExportSection';
import ExpenseFormModal from '@/components/organisms/ExpenseFormModal';
import BudgetFormModal from '@/components/organisms/BudgetFormModal';


const FeatureContent = () => {
  // States
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Form states
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [budgetForm, setBudgetForm] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly'
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [expensesData, categoriesData, budgetsData] = await Promise.all([
          expenseService.getAll(),
          categoryService.getAll(),
          budgetService.getAll()
        ]);
        setExpenses(expensesData);
        setCategories(categoriesData);
        setBudgets(budgetsData);
      } catch (err) {
        setError(err.message || 'Failed to load data');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculated values
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesPeriod = selectedPeriod === 'month' ? 
      isWithinInterval(expenseDate, { start: monthStart, end: monthEnd }) : true;
    
    return matchesSearch && matchesCategory && matchesPeriod;
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = {
    series: Object.values(categoryTotals),
    options: {
      chart: { type: 'donut', fontFamily: 'Inter' },
      labels: Object.keys(categoryTotals),
      colors: ['#2E7D32', '#1565C0', '#F57C00', '#9C27B0', '#FF5722', '#607D8B'],
      legend: { position: 'bottom', labels: { colors: 'var(--text-gray-400)' } },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }],
      theme: {
        mode: 'light', // This will be overridden by tailwind dark class on html
        // However, ApexCharts itself doesn't dynamically change its theme without a re-render or option update.
        // For actual dark mode in ApexCharts, you would need to update the options dynamically based on isDarkMode.
        // Given the constraints, we'll keep it simple as it is.
      }
    }
  };

  // Handlers
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.category) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      const newExpense = await expenseService.create({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        tags: []
      });
      setExpenses(prev => [newExpense, ...prev]);
      setExpenseForm({
        amount: '',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      });
      setShowAddExpense(false);
      toast.success('Expense added successfully!');
    } catch (err) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success('Expense deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!budgetForm.categoryId || !budgetForm.amount) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newBudget = await budgetService.create({
        ...budgetForm,
        amount: parseFloat(budgetForm.amount),
        spent: 0
      });
      setBudgets(prev => [newBudget, ...prev]);
      setBudgetForm({ categoryId: '', amount: '', period: 'monthly' });
      setShowAddBudget(false);
      toast.success('Budget set successfully!');
    } catch (err) {
      toast.error('Failed to set budget');
    }
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <Panel
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-2 mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
            { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
            { id: 'budgets', label: 'Budgets', icon: 'Target' },
            { id: 'export', label: 'Export', icon: 'Download' }
          ].map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              iconName={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </Panel>

      {/* Conditional Content based on activeTab */}
      {activeTab === 'dashboard' && (
        <DashboardSection
          totalSpent={totalSpent}
          filteredExpensesLength={filteredExpenses.length}
          categoryTotals={categoryTotals}
          chartData={chartData}
          filteredExpenses={filteredExpenses}
          categories={categories}
          onAddExpense={() => setShowAddExpense(true)}
        />
      )}

      {activeTab === 'expenses' && (
        <ExpensesSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          categories={categories}
          filteredExpenses={filteredExpenses}
          onDeleteExpense={handleDeleteExpense}
          onAddExpense={() => setShowAddExpense(true)}
        />
      )}

      {activeTab === 'budgets' && (
        <BudgetsSection
          budgets={budgets}
          categories={categories}
          categoryTotals={categoryTotals}
          onSetBudget={() => setShowAddBudget(true)}
        />
      )}

      {activeTab === 'export' && (
        <ExportSection
          expenses={expenses}
          categories={categories}
          budgets={budgets}
          totalSpent={totalSpent}
        />
      )}

      {/* Modals */}
      <ExpenseFormModal
        show={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        expenseForm={expenseForm}
        setExpenseForm={setExpenseForm}
        categories={categories}
        onSubmit={handleAddExpense}
      />

      <BudgetFormModal
        show={showAddBudget}
        onClose={() => setShowAddBudget(false)}
        budgetForm={budgetForm}
        setBudgetForm={setBudgetForm}
        categories={categories}
        onSubmit={handleAddBudget}
      />

      {/* Floating Action Button */}
      <Button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-30"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FeatureContent;