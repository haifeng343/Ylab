import request from '@/utils/request'
// 查询仪器列表
export function fetchList(data) {
  return request({
    url: '/machine/query',
    method: 'post',
    data
  })
}
// 查询仪器详情
export function fetchDetail(data) {
  return request({
    url: '/machine/get',
    method: 'post',
    data
  })
}
// 编辑、新建仪器信息
export function editAnalyzer(data) {
  return request({
    url: '/machine/edit',
    method: 'post',
    data
  })
}
// 修改仪器状态
export function changeDeviceStatus(data) {
  return request({
    url: '/machine/updateStatus',
    method: 'post',
    data
  })
}
// 删除仪器信息
export function deleteDevice(data) {
  return request({
    url: '/machine/delete',
    method: 'post',
    data
  })
}

// 新建预约
export function editAppointment(data) {
  return request({
    url: '/machine/editAppointment',
    method: 'post',
    data
  })
}
// 查询预约
export function queryAppointment(data) {
  return request({
    url: '/machine/queryAppointment',
    method: 'post',
    data
  })
}
// 删除预约
export function deleteAppointment(data) {
  return request({
    url: '/machine/deleteAppointment',
    method: 'post',
    data
  })
}
