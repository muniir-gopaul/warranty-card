// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // 🛡️ Client-side route guard only
  if (process.env.CLIENT) {
    Router.beforeEach((to, from, next) => {
      const publicPages = ['/login']
      const authRequired = !publicPages.includes(to.path)

      let isLoggedIn = false
      try {
        isLoggedIn = !!localStorage.getItem('token')
      } catch (e) {
        console.warn('[ROUTER GUARD] localStorage not accessible:', e)
      }

      if (authRequired && !isLoggedIn) {
        console.log('[ROUTER GUARD] 🔒 Redirecting to /login')
        return next('/login')
      }

      next()
    })
  }

  return Router
})
