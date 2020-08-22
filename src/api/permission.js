import request from '@/utils/request'
// 获取审批列表
export function getPermitList(data) {
  return request({
    url: '/process/listPage',
    method: 'post',
    data
  })
}
// 获取审批应用流程
export function getProcess(data) {
  return request({
    url: '/form/queryForm',
    method: 'post',
    data
  })
}
// 新建、编辑审批
export function editPermit(data) {
  return request({
    url: '/process/edit',
    method: 'post',
    data
  })
}
// 删除审批
export function delPermit(data) {
  return request({
    url: '/process/delete',
    method: 'post',
    data
  })
}
// 获取审批详情
export function getPermit(data) {
  return request({
    url: '/process/get',
    method: 'post',
    data
  })
}
// 获取流程列表
export function getProcessList(data) {
  return request({
    url: '/period/listPage',
    method: 'post',
    data
  })
}
// 获取流程详情
export function getProcessDetail(data) {
  return request({
    url: '/period/get',
    method: 'post',
    data
  })
}
// 审批流程
export function processPermit(data) {
  return request({
    url: '/contract/approveProcess',
    method: 'post',
    data
  })
}
// 新建、编辑审批
export function PermitEdit(data) {
  return request({
    url: '/period/edit',
    method: 'post',
    data
  })
}
