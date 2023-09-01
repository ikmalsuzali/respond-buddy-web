import { canNavigate } from '@layouts/plugins/casl'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
      path: '/',
      redirect: (to) => {
        let userData = null
        let token = null
        try {
          userData = JSON?.parse(localStorage?.getItem('userData') || '{}')
          token = JSON?.parse(localStorage?.getItem('accessToken') || '')
        } catch (error) {
          token = ''
        }

        if ((userData.user_id || userData.id) && token) {
          return { name: 'apps-tags' }
        }

        localStorage.removeItem('accessToken')
        localStorage.removeItem('userWorkspace')
        localStorage.removeItem('subscription')
        localStorage.removeItem('userData')

        return { name: 'login', query: to.query }
      },
    },
    {
      name: 'payment-process',
      path: '/payment/:paymentId/process',
      component: () => import('../pages/pages/misc/payment-process.vue'),
    },
    // {
    //   name: 'privacy-policy',
    //   path: '/privacy-policy',
    //   component: () => import('../pages/privacy-policy.vue'),
    //   meta: {
    //     public: true,
    //   },
    // },
    // {
    //   name: 'terms-of-service',
    //   path: '/terms-of-service',
    //   component: () => import('../pages/terms-of-service.vue'),
    //   meta: {
    //     public: true,
    //   },
    // },
    // {
    //   name: 'auth-callback',
    //   path: '/auth-callback',
    //   component: () => import('../pages/pages/misc/auth-callback.vue'),
    //   meta: {
    //     public: true,
    //   },
    // },
    // {
    //   path: '/pages/account-settings',
    //   redirect: () => ({
    //     name: 'pages-account-settings-tab',
    //     params: { tab: 'account' },
    //   }),
    // },
    ...setupLayouts(routes),
  ],
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
router.beforeEach((to) => {
  const isLoggedIn = isUserLoggedIn()

  /*

  ℹ️ Commented code is legacy code

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    // ℹ️ Only add `to` query param if `to` route is not index route
    if (!isLoggedIn)
      return next({ name: 'login', query: { to: to.name !== 'index' ? to.fullPath : undefined } })

    // If logged in => not authorized
    return next({ name: 'not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn)
    next('/')

  return next()

  */

  if (canNavigate(to)) {
    if (to.meta.redirectIfLoggedIn && isLoggedIn) return '/'
  } else {
    if (isLoggedIn) return { name: 'not-authorized' }
    else
      return {
        name: 'login',
        query: { to: to.name !== 'index' ? to.fullPath : undefined },
      }
  }
})

export default router
