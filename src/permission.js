import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect', '/testlogin', '/ding-login', '/register', '/related', '/wx-login', '/blank', '/dingBlank', '/401', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  if (to.meta.title) {
    document.title = getPageTitle(to.meta.title())
  }
  const hasRoles = store.getters.roles && store.getters.roles.length > 0
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    if (hasRoles) {
      next()
    } else {
      try {
        // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
        // eslint-disable-next-line
        const { needPermissions, permissions } = await store.dispatch('user/getInfo')
        // generate accessible routes map based on roles
        const accessRoutes = await store.dispatch('permission/generateRoutes', { needPermissions, permissions })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)
        // hack method to ensure that addRoutes is complete
        // set the replace: true, so the navigation will not leave a history record
        next({ ...to, replace: true })
      } catch (error) {
        // remove token and go to login page to re-login
        Message.error(error || 'Has Error')
        next(`/login?redirect_url=${to.fullPath}`)
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
