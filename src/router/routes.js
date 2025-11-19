const routes = [
  // Redirect '/' to login
  { path: '/', redirect: '/login' },

  // Login page at '/login'
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  // Landing page at 'welcome'
  {
    path: '/landing',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },
  {
    path: '/service-item',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/WarrantyCard.vue') }],
  },
  {
    path: '/create-customer',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CustomerCard.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
