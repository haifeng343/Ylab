import request from '@/utils/request'
// 编辑、新镇、删除角色
export const editRole = data => request({
  url: `/role/edit`,
  method: 'post',
  data
})

// 获取角色列表
export const getRolesList = data => request({
  url: '/role/getAll',
  method: 'post',
  data
})

// 新建、编辑、删除角色
export const roleManage = data => request({
  url: '/role/edit',
  method: 'post',
  data
})

// 查询角色权限
export const getRolePower = data => request({
  url: '/permission/getPermissionsByRole',
  method: 'post',
  data
})

// 单角色添加多人员
export const roleAddMember = data => request({
  url: '/employee/editRoleEmp',
  method: 'post',
  data
})

// 分配角色权限
export const editRolePower = data => request({
  url: '/permission/edit',
  method: 'post',
  data
})

// 切换公司
export function switchCompany(info) {
  return request({
    url: '/company/change?companyId=' + info,
    method: 'post'
  })
}
