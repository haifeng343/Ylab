import request from '@/utils/request'

// 查询项目列表
export function fetchList(data) {
  return request({
    url: '/contract/query',
    method: 'post',
    data
  })
}

// // 查询子任务列表
// export function fetchTaskList(data) {
//   return request({
//     url: '/task/listPage',
//     method: 'post',
//     data
//   })
// }

// 编辑、新建项目
export function editProject(data) {
  return request({
    url: '/contract/edit',
    method: 'post',
    data
  })
}
// 删除项目
export function deleteProject(data) {
  return request({
    url: '/contract/delete',
    method: 'post',
    data
  })
}

// 项目详情查询
export function fetchDetail(data) {
  return request({
    url: '/contract/get',
    method: 'post',
    data
  })
}
// 修改项目状态
export function editContractStatus(data) {
  return request({
    url: '/contract/updateStatus',
    method: 'post',
    data
  })
}
// 获取业务合同
export function queryBusinessContract(data) {
  return request({
    url: '/contract/queryAllH3Page',
    method: 'post',
    data
  })
}
// 提交异常
export function exception(data) {
  return request({
    url: '/exception/edit',
    method: 'post',
    data
  })
}
// 解决异常
export function solveException(data) {
  return request({
    url: '/exception/updateStatus',
    method: 'post',
    data
  })
}

// 项目审批
export function contractPermit(data) {
  return request({
    url: '/contract/updateStatus',
    method: 'post',
    data
  })
}
