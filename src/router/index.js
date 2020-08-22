import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import contractManagerRouter from './modules/contract'
import analyzerManagerRouter from './modules/analyzer'
import systemManagerRouter from './modules/system'
import purchaseManagerRouter from './modules/purchase'
import storeManagerRouter from './modules/store'
import messageManagerRouter from './modules/message'
import saleManagerRouter from './modules/sale'
import payingManagerRouter from './modules/paying'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * disable: false                 if set true, item will not load
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: () => 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    meta: {
      title: () => ''
    },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/testlogin',
    component: () => import('@/views/login/index2'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/wx-login',
    component: () => import('@/views/login/loginByWx'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/related',
    component: () => import('@/views/login/related'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/blank',
    component: () => import('@/views/login/blank'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
    meta: {
      title: () => ''
    }
  },
  {
    component: Layout,
    path: '/',
    redirect: '/dashboard',
    meta: {
      title: () => ''
    },
    children: [
      {
        path: 'dashboard',
        // component: () => import('@/views/dashboard/index'),
        component: () => {
          if (store.getters.platform === 'enterprise') {
            return import('@/pages/enterprise/views/dashboard/index')
          } else if (store.getters.platform === 'standard') {
            return import('@/pages/standard/views/dashboard/index')
          }
        },
        name: 'Dashboard',
        meta: { title: () => '总览', icon: 'dashboard', affix: true, noCache: true }
      },
      {
        path: 'await-approve',
        // component: () => import('@/views/dashboard/awaitApprove'),
        component: () => {
          if (store.getters.platform === 'enterprise') {
            return import('@/pages/enterprise/views/dashboard/awaitApprove')
          } else if (store.getters.platform === 'standard') {
            return import('@/pages/standard/views/dashboard/awaitApprove')
          }
        },
        name: 'AwaitApprove',
        hidden: true,
        meta: { title: () => '我的审核' }
      },
      {
        path: 'my-create',
        component: () => import('@/views/dashboard/myCreate'),
        name: 'MyCreate',
        hidden: true,
        meta: { title: () => '我发起的' }
      },
      {
        path: 'invoice-content',
        component: () => import('@/views/dashboard/InvoiceContent'),
        name: 'InvoiceContent',
        hidden: true,
        meta: {
          title: () => '具体发票明细',
          noCache: true
        }
      },
      {
        path: 'person',
        component: () => import('@/views/dashboard/person'),
        name: 'Person',
        hidden: true,
        meta: { title: () => '个人中心' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  contractManagerRouter,
  purchaseManagerRouter,
  storeManagerRouter,
  payingManagerRouter,
  analyzerManagerRouter,
  saleManagerRouter,
  systemManagerRouter,
  messageManagerRouter,
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    meta: {
      title: () => 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        meta: { title: () => '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        meta: { title: () => '404', noCache: true }
      }
    ]
  },
  {
    component: Layout,
    path: '/batch',
    hidden: true,
    meta: {
      title: () => '其它'
    },
    children: [
      {
        path: '',
        component: () => import('@/views/batch/data-import'),
        meta: {
          title: () => '导入数据'
        }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      title: () => ''
    }
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: (to, from, savedPosition) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 500)
    })
  },
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
