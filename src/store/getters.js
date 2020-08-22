const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  platform: state => state.app.platform,
  buttonPermission: state => state.app.buttonPermission,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.id,
  buttonPermissions: state => state.user.buttonPermissions,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  column: state => state.column
}
export default getters
