import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'  // se existir
import Dashboard from '../views/Dashboard.vue'

import store from '../store'  // sua store Vuex

const routes = [
  {
    path: '/',
    redirect: '/login'  // redireciona raiz para login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,  // remova se não tiver esta view
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard para proteger dashboard
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = !!store.state.user

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router

