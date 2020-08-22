import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const routes = [
  {
    path: '/',
    redirect: '/product',
    meta: {
      title: () => ''
    }
  },
  {
    path: '/product',
    component: () => import('../views/product'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/resource',
    component: () => import('../views/resource'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/lab',
    component: () => import('../views/lab'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/price',
    component: () => import('../views/price'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/case',
    component: () => import('../views/case'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/lab-live',
    component: () => import('../views/lab-live'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/lab-detail',
    component: () => import('../views/lab-detail'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/register',
    component: () => import('../views/register'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/login',
    component: () => import('../views/login'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/wx-login',
    component: () => import('../views/loginByWx'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/dredge',
    component: () => import('../views/dredge'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/privacy',
    component: () => import('../views/privacy'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/onlineSign',
    component: () => import('../views/onlineSign'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/signPdf',
    component: () => import('../views/SignPdf'),
    meta: {
      title: () => ''
    }
  },
  {
    path: '/certification',
    component: () => import('../views/certification'),
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
    path: '/setting',
    component: () => import('../views/setting'),
    meta: {
      title: () => '个人账号设置中心'
    }
  },
  { path: '*',
    redirect: '/404',
    hidden: true,
    meta: {
      title: () => ''
    }
  }
]
const router = new VueRouter({
  routes
})

export default router
