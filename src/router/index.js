// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login      from '@/views/Login.vue'
import Register   from '@/views/Register.vue'
import Dashboard  from '@/views/Dashboard.vue'
import store      from '@/store'

const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }          // bloqueia acesso se já logado
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }       // só logado
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ---------- GUARD GLOBAL ----------
router.beforeEach((to, _from, next) => {
  const logged = store.getters.isLogged

  if (to.meta.requiresAuth && !logged) {
    return next('/login')
  }
  if (to.meta.guestOnly && logged) {
    return next('/dashboard')
  }
  next()
})

export default router
