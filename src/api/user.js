import request from '@/utils/request'

// 获取部门
export function queryDept(data) {
  return request({
    url: '/dept/queryAll',
    method: 'post',
    data
  })
}

// 编辑部门 新建子部门
export function editDeptment(data) {
  return request({
    url: '/dept/editDept',
    method: 'post',
    data
  })
}

// 删除部门
export function delDept(data) {
  return request({
    url: '/dept/deleteDept',
    method: 'post',
    data
  })
}

// 员工列表查询
export function getDeptMember(data) {
  return request({
    url: '/employee/queryBysysId',
    method: 'post',
    data
  })
}

// 获取所有角色
export function getRoles(data) {
  return request({
    url: '/role/getAll',
    method: 'post',
    data
  })
}

// 编辑员工信息
export function editMember(data) {
  return request({
    url: '/employee/edit',
    method: 'post',
    data
  })
}

// 从部门删除人员
export function deptDelMember(data) {
  return request({
    url: '/dept/delEmp',
    method: 'post',
    data
  })
}

// 从企业删除人员
export function comDelMember(data) {
  return request({
    url: '/employee/delete',
    method: 'post',
    data
  })
}

// 邀请人员链接
export function inviteMember(data) {
  return request({
    url: '/register/invite',
    method: 'post',
    data
  })
}

// 查询部门、员工树结构
export function getTree(data) {
  return request({
    url: '/dept/getTree',
    method: 'post',
    data
  })
}

// 部门添加人员
export function deptAddMem(data) {
  return request({
    url: '/dept/addEmp',
    method: 'post',
    data
  })
}

// 获取微信公众号二维码
export function getQRCode(data) {
  return request({
    url: '/wx/getYbrWxCode',
    method: 'post',
    data
  })
}

// 获取正在进行的项目任务数
export function getConTaskCount(data) {
  return request({
    url: '/employee/getDoingInfo',
    method: 'post',
    data
  })
}

// 获取用户信息
export const getSession = () => request({
  url: '/login/getSession',
  method: 'post'
})

// 获取主页
export const getIndexData = () => request({
  url: '/employee/personal',
  method: 'post'
})

// 获取我的待办
export const getPending = data => request({
  url: '/employee/getPending',
  method: 'post',
  data
})

// 获取我发起的
export const getCreate = data => request({
  url: '/employee/getCreate',
  method: 'post',
  data
})

// 获取氚云合同
export const getJoinContract = data => request({
  url: '/contract/queryH3',
  method: 'post',
  data
})

// 获取票据
export const getInvoice = data => request({
  url: '/contract/queryH3Invoice',
  method: 'post',
  data
})

// 获取票据
export const getPaying = data => request({
  url: '/contract/queryH3RMoney',
  method: 'post',
  data
})

// 获取个人中心
export const gePerson = data => request({
  url: '/employee/get',
  method: 'post',
  data
})

// 获取修改个人信息
export const changePersonMsg = data => request({
  url: '/employee/updateInfo',
  method: 'post',
  data
})

// 微信解绑
export const wxUnbind = data => request({
  url: '/wx/unBind',
  method: 'post',
  data
})

// 关联微信
export const RelevanceWx = data => request({
  url: '/register/wxRelevanceYLab',
  method: 'post',
  data
})
