import LoginPage from './pages/Login'
import PageIndex from './pages/Index'
import TwoFactor from './pages/twoFactor'

export default [
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/twoFactor',
    component: TwoFactor
  },
  {
    path: '/',
    component: PageIndex
  }
]
