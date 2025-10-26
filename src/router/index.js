// src/router/index.js
import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import axios from 'axios'

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
    Router.beforeEach(async (to, from, next) => {
      const publicPages = ['/login'] // protected removed
      const authRequired = !publicPages.includes(to.path)

      if (authRequired) {
        try {
          const res = await axios.get('/api/login/session', { withCredentials: true })
          if (!res.data.loggedIn) return next('/login')
        } catch {
          return next('/login')
        }
      }

      next()
    })
  }

  return Router
})
