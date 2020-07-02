import Vue from 'vue'
import Router from 'vue-router'
import Head from 'vue-head'
import Home from '@/views/Home'
import CheckLogin from '@/views/CheckLogin'
import { isNil } from 'lodash'
import store from '@/store'

Vue.use(Router)

/* If you don't know about VueHead, please refer to https://github.com/ktquez/vue-head */

Vue.use(Head, {
  complement: process.env.VUE_APP_TITLE
})

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/check-login',
      name: 'check-login',
      component: CheckLogin,
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "client-chunk-login" */ '@/views/Login.vue'),
      meta: {
        authNotRequired: true
      }
    },
    {
      path: '/clients',
      name: 'clientList',
      component: () =>
          import(/* webpackChunkName: "client-chunk-products" */ '@/views/clients/Clients.vue'),
      meta: {
        title: 'Clients',
        breadcrumb: 'Timesheets / Clients'
      }
    },
    {
      path: '/clients/:clientid',
      name: 'editClient',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/clients/Client.vue'),
      meta: {
        title: 'Edit Client',
        breadcrumb: 'Timesheets / Client'
      }
    },
    {
      path: '/clients/add',
      name: 'addClient',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/clients/Client.vue'),
      meta: {
        title: 'Add Client',
        breadcrumb: 'Timesheets / Client'
      }
    },
    {
      path: '/projects',
      name: 'projectList',
      component: () =>
          import(/* webpackChunkName: "client-chunk-products" */ '@/views/projects/Projects.vue'),
      meta: {
        title: 'Projects',
        breadcrumb: 'Timesheets / Projects'
      }
    },
    {
      path: '/projects/:projectid',
      name: 'editProject',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/projects/Project.vue'),
      meta: {
        title: 'Edit Project',
        breadcrumb: 'Timesheets / Project'
      }
    },
    {
      path: '/projects/add',
      name: 'addProject',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/projects/Project.vue'),
      meta: {
        title: 'Add Project',
        breadcrumb: 'Timesheets / Project'
      }
    },
    {
      path: '/timesheets',
      name: 'addTimesheet',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/timesheets/Timesheet.vue'),
      meta: {
        title: 'Projects Timesheet',
        breadcrumb: 'Timesheets / Projects'
      }
    },
    {
      path: '/reports',
      name: 'reports',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/reports/Reports.vue'),
      meta: {
        title: 'Reports',
        breadcrumb: 'Timesheets / Reports'
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      props: true,
      component: () =>
          import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/dashboard/Dashboard.vue'),
      meta: {
        title: 'Dashboard',
        breadcrumb: 'Timesheets / Dashboard'
      }
    },
    { path: '*', redirect: '/home' }
  ]
})

/**
 * Handle user redirections
 */
// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  if (
    !(to.meta && to.meta.authNotRequired) &&
    isNil(store.state.authentication.user)
  ) {
    const path =
      store.state.authentication.user === null ? '/login' : '/check-login'
    return next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router
