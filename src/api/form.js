import request from '@/utils/request'

// 查询字段列表
export function fetchColumnList(data) {
  return request({
    url: '/formColumn/queryFormColumn',
    method: 'post',
    data
  })
}

// 编辑、新建表单列
export function editColumn(data) {
  return request({
    url: '/formColumn/saveFormColumn',
    method: 'post',
    data
  })
}

// 删除表单列
export function delColumn(data) {
  return request({
    url: '/formColumn/deleteFormColumn',
    method: 'post',
    data
  })
}

// 查询类别列表
export function fetchTypeList(data) {
  return request({
    url: '/contractType/queryType',
    method: 'post',
    data
  })
}

// 新镇类别
export function addType(data) {
  return request({
    url: '/contractType/addType',
    method: 'post',
    data
  })
}

// 修改类别
export function editType(data) {
  return request({
    url: '/contractType/updateType',
    method: 'post',
    data
  })
}

// 删除类别
export function delType(data) {
  return request({
    url: '/contractType/deleteType',
    method: 'post',
    data
  })
}
