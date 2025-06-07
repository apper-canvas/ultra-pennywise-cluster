import categoryData from '../mockData/categories.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let categories = [...categoryData]

export const categoryService = {
  async getAll() {
    await delay(250)
    return [...categories]
  },

  async getById(id) {
    await delay(200)
    const category = categories.find(item => item.id === id)
    if (!category) {
      throw new Error('Category not found')
    }
    return { ...category }
  },

  async create(categoryData) {
    await delay(300)
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData
    }
    categories.push(newCategory)
    return { ...newCategory }
  },

  async update(id, data) {
    await delay(300)
    const index = categories.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    categories[index] = { ...categories[index], ...data }
    return { ...categories[index] }
  },

  async delete(id) {
    await delay(250)
    const index = categories.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Category not found')
    }
    categories.splice(index, 1)
    return true
  }
}