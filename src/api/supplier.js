import request from '@/utils/request'
// 查询供应商列表
export function fetchList(data, config) {
  return request({
    url: '/supplier/query',
    method: 'post',
    data,
    config
  })
}
// 查询供应商详情
export function fetchDetail(data) {
  return request({
    url: '/supplier/get',
    method: 'post',
    data
  })
}
// 编辑、新建供应商
export function editSupplier(data) {
  return request({
    url: '/supplier/edit',
    method: 'post',
    data
  })
}
// 删除供应商
export function deleteSupplier(data) {
  return request({
    url: '/supplier/delete',
    method: 'post',
    data
  })
}
