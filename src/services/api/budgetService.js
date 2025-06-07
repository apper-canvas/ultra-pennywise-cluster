import budgetData from '../mockData/budgets.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let budgets = [...budgetData]

export const budgetService = {
  async getAll() {
    await delay(280)
    return [...budgets]
  },

  async getById(id) {
    await delay(200)
    const budget = budgets.find(item => item.id === id)
    if (!budget) {
      throw new Error('Budget not found')
    }
    return { ...budget }
  },

  async create(budgetData) {
    await delay(350)
    const newBudget = {
      id: Date.now().toString(),
      ...budgetData
    }
    budgets.push(newBudget)
    return { ...newBudget }
  },

  async update(id, data) {
    await delay(320)
    const index = budgets.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Budget not found')
    }
    budgets[index] = { ...budgets[index], ...data }
    return { ...budgets[index] }
  },

  async delete(id) {
    await delay(250)
    const index = budgets.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Budget not found')
    }
    budgets.splice(index, 1)
    return true
  }
}