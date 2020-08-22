import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(needPermissions, permissions, route) {
  // 有权限控制的菜单列表 needPermissions
  if (route.disable && route.disable()) {
    return false
  }
  if (route.meta && route.meta.title && route.meta.title() &&
    needPermissions.includes(route.meta.title()) &&
    !permissions.includes(route.meta.title())) {
    route.redirect = '/401'
  }
  return true
  // if (route.meta && route.meta.title && arrRoute.includes(route.meta.title)) {
  //   return permissions.includes(route.meta.title)
  // } else {
  //   return true
  // }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, needPermissions, permissions) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(needPermissions, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, needPermissions, permissions)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, { needPermissions, permissions }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, needPermissions, permissions)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
