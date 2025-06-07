import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import Chart from 'react-apexcharts'
import ApperIcon from './ApperIcon'
import { expenseService, categoryService, budgetService } from '../services'

const MainFeature = () => {
  // States
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // UI States
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Form states
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  })
  
  const [budgetForm, setBudgetForm] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly'
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [expensesData, categoriesData, budgetsData] = await Promise.all([
          expenseService.getAll(),
          categoryService.getAll(),
          budgetService.getAll()
        ])
        setExpenses(expensesData)
        setCategories(categoriesData)
        setBudgets(budgetsData)
      } catch (err) {
        setError(err.message || 'Failed to load data')
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculated values
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory
    const matchesPeriod = selectedPeriod === 'month' ? 
      isWithinInterval(expenseDate, { start: monthStart, end: monthEnd }) : true
    
    return matchesSearch && matchesCategory && matchesPeriod
  })

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const chartData = {
    series: Object.values(categoryTotals),
    options: {
      chart: { type: 'donut', fontFamily: 'Inter' },
      labels: Object.keys(categoryTotals),
      colors: ['#2E7D32', '#1565C0', '#F57C00', '#9C27B0', '#FF5722', '#607D8B'],
      legend: { position: 'bottom' },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: { width: 300 },
          legend: { position: 'bottom' }
        }
      }]
    }
  }

  // Handlers
  const handleAddExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.amount || !expenseForm.category) {
      toast.error('Please fill in required fields')
      return
    }

    try {
      const newExpense = await expenseService.create({
        ...expenseForm,
        amount: parseFloat(expenseForm.amount),
        tags: []
      })
      setExpenses(prev => [newExpense, ...prev])
      setExpenseForm({
        amount: '',
        category: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd')
      })
      setShowAddExpense(false)
      toast.success('Expense added successfully!')
    } catch (err) {
      toast.error('Failed to add expense')
    }
  }

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.delete(id)
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      toast.success('Expense deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete expense')
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()
    if (!budgetForm.categoryId || !budgetForm.amount) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const newBudget = await budgetService.create({
        ...budgetForm,
        amount: parseFloat(budgetForm.amount),
        spent: 0
      })
      setBudgets(prev => [newBudget, ...prev])
      setBudgetForm({ categoryId: '', amount: '', period: 'monthly' })
      setShowAddBudget(false)
      toast.success('Budget set successfully!')
    } catch (err) {
      toast.error('Failed to set budget')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-card"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-8 shadow-card text-center"
      >
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation Tabs */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl p-2 shadow-card mb-8"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
            { id: 'expenses', label: 'Expenses', icon: 'Receipt' },
            { id: 'budgets', label: 'Budgets', icon: 'Target' },
            { id: 'export', label: 'Export', icon: 'Download' }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Dashboard View */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <ApperIcon name="TrendingUp" className="w-8 h-8" />
                <span className="text-primary-light text-sm font-medium">This Month</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">${totalSpent.toFixed(2)}</h3>
              <p className="text-primary-light">Total Spent</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <ApperIcon name="Receipt" className="w-8 h-8" />
                <span className="text-secondary-light text-sm font-medium">Transactions</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">{filteredExpenses.length}</h3>
              <p className="text-secondary-light">This Month</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gradient-to-br from-accent to-orange-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <ApperIcon name="PieChart" className="w-8 h-8" />
                <span className="text-orange-200 text-sm font-medium">Categories</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">{Object.keys(categoryTotals).length}</h3>
              <p className="text-orange-200">Active</p>
            </motion.div>
          </div>

          {/* Chart and Recent Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Breakdown Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Spending Breakdown</h3>
              {Object.keys(categoryTotals).length > 0 ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="donut"
                  height={300}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <ApperIcon name="PieChart" className="w-16 h-16 mb-4" />
                  <p>No expenses to display</p>
                </div>
              )}
            </motion.div>

            {/* Recent Expenses */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddExpense(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add</span>
                </motion.button>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
                {filteredExpenses.slice(0, 5).map((expense, index) => {
                  const category = categories.find(c => c.name === expense.category)
                  return (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category?.color + '20' }}
                        >
                          <ApperIcon 
                            name={category?.icon || 'DollarSign'} 
                            className="w-5 h-5"
                            style={{ color: category?.color }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{expense.description}</p>
                          <p className="text-sm text-gray-500">{expense.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM dd')}</p>
                      </div>
                    </motion.div>
                  )
                })}
                
                {filteredExpenses.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <ApperIcon name="Receipt" className="w-12 h-12 mx-auto mb-3" />
                    <p>No expenses yet</p>
                    <p className="text-sm">Add your first expense to get started</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Expenses View */}
      {activeTab === 'expenses' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters and Search */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search expenses..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Expenses ({filteredExpenses.length})
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddExpense(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add Expense</span>
                </motion.button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredExpenses.map((expense, index) => {
                const category = categories.find(c => c.name === expense.category)
                return (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category}</p>
                        <p className="text-xs text-gray-400">{format(new Date(expense.date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-lg text-gray-800">
                        ${expense.amount.toFixed(2)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )
              })}
              
              {filteredExpenses.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ApperIcon name="Receipt" className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">No expenses found</p>
                  <p className="text-sm">Try adjusting your filters or add a new expense</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Budgets View */}
      {activeTab === 'budgets' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Budget Overview</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddBudget(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Set Budget</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget, index) => {
              const category = categories.find(c => c.id === budget.categoryId)
              const spent = categoryTotals[category?.name] || 0
              const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0
              const isOverBudget = percentage > 100
              
              return (
                <motion.div
                  key={budget.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-card"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: category?.color + '20' }}
                    >
                      <ApperIcon 
                        name={category?.icon || 'Target'} 
                        className="w-6 h-6"
                        style={{ color: category?.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{category?.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent</span>
                      <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-800'}`}>
                        ${spent.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
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
                      <span className="text-gray-600">Budget</span>
                      <span className="font-medium text-gray-800">${budget.amount.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Remaining</span>
                      <span className={`font-medium ${
                        isOverBudget ? 'text-red-600' : 'text-primary'
                      }`}>
                        ${isOverBudget ? '0.00' : (budget.amount - spent).toFixed(2)}
                      </span>
                    </div>
                    
                    {isOverBudget && (
                      <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                        Over budget by ${(spent - budget.amount).toFixed(2)}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
            
            {budgets.length === 0 && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="col-span-full text-center py-12 text-gray-400"
              >
                <ApperIcon name="Target" className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No budgets set</p>
                <p className="text-sm">Create your first budget to start tracking spending goals</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Export View */}
      {activeTab === 'export' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-card text-center"
        >
          <ApperIcon name="Download" className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Export Your Data</h2>
          <p className="text-gray-600 mb-8">Download your expense data for external analysis</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const csvData = expenses.map(expense => ({
                  Date: format(new Date(expense.date), 'yyyy-MM-dd'),
                  Amount: expense.amount,
                  Category: expense.category,
                  Description: expense.description
                }))
                
                const csv = [
                  Object.keys(csvData[0] || {}).join(','),
                  ...csvData.map(row => Object.values(row).join(','))
                ].join('\n')
                
                const blob = new Blob([csv], { type: 'text/csv' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `pennywise-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`
                a.click()
                
                toast.success('Data exported successfully!')
              }}
              className="flex flex-col items-center space-y-3 p-6 border-2 border-dashed border-primary rounded-xl hover:bg-primary-light hover:bg-opacity-5 transition-colors"
            >
              <ApperIcon name="FileText" className="w-8 h-8 text-primary" />
              <span className="font-medium text-primary">Export as CSV</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const jsonData = {
                  exportDate: new Date().toISOString(),
                  totalExpenses: expenses.length,
                  totalAmount: totalSpent,
                  expenses: expenses,
                  categories: categories,
                  budgets: budgets
                }
                
                const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `pennywise-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
                a.click()
                
                toast.success('Backup created successfully!')
              }}
              className="flex flex-col items-center space-y-3 p-6 border-2 border-dashed border-secondary rounded-xl hover:bg-secondary-light hover:bg-opacity-5 transition-colors"
            >
              <ApperIcon name="Database" className="w-8 h-8 text-secondary" />
              <span className="font-medium text-secondary">Full Backup</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddExpense(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Add Expense</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddExpense(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="What was this expense for?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddExpense(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Add Expense
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Budget Modal */}
      <AnimatePresence>
        {showAddBudget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowAddBudget(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Set Budget</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddBudget(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                  </motion.button>
                </div>
                
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={budgetForm.categoryId}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={budgetForm.amount}
                        onChange={(e) => setBudgetForm(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <select
                      value={budgetForm.period}
                      onChange={(e) => setBudgetForm(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddBudget(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Set Budget
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowAddExpense(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-30"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

export default MainFeature