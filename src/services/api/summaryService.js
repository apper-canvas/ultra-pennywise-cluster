const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const summaryService = {
  async getMonthlyummary(expenses, categories) {
    await delay(200)
    
    const currentMonth = new Date()
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })
    
    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    const categoryBreakdown = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})
    
    return {
      period: 'monthly',
      totalSpent,
      categoryBreakdown,
      expenseCount: monthlyExpenses.length
    }
  },

  async getWeeklySummary(expenses, categories) {
    await delay(200)
    
    const currentDate = new Date()
    const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()))
    const weekEnd = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 6))
    
    const weeklyExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= weekStart && expenseDate <= weekEnd
    })
    
    const totalSpent = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    const categoryBreakdown = weeklyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})
    
    return {
      period: 'weekly',
      totalSpent,
      categoryBreakdown,
      expenseCount: weeklyExpenses.length
    }
  }
}