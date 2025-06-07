import expenseData from '../mockData/expenses.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let expenses = [...expenseData]

export const expenseService = {
  async getAll() {
    await delay(300)
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
  },

  async getById(id) {
    await delay(200)
    const expense = expenses.find(item => item.id === id)
    if (!expense) {
      throw new Error('Expense not found')
    }
    return { ...expense }
  },

  async create(expenseData) {
    await delay(400)
    const newExpense = {
      id: Date.now().toString(),
      ...expenseData,
      createdAt: new Date().toISOString()
    }
    expenses.unshift(newExpense)
    return { ...newExpense }
  },

  async update(id, data) {
    await delay(350)
    const index = expenses.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    expenses[index] = { ...expenses[index], ...data }
    return { ...expenses[index] }
  },

  async delete(id) {
    await delay(250)
    const index = expenses.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Expense not found')
    }
    expenses.splice(index, 1)
    return true
  }
}