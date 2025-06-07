import Home from '../pages/Home'
import NotFound from '../pages/NotFound'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    component: Home,
    path: '/'
  },
  expenses: {
    id: 'expenses',
    label: 'Expenses',
    icon: 'Receipt',
    component: Home,
    path: '/expenses'
  },
  budgets: {
    id: 'budgets',
    label: 'Budgets',
    icon: 'Target',
    component: Home,
    path: '/budgets'
  },
  export: {
    id: 'export',
    label: 'Export',
    icon: 'Download',
    component: Home,
    path: '/export'
  }
}

export const routeArray = Object.values(routes)