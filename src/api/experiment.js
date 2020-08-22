import request from '@/utils/request'

export function experimentFetchList(data) {
  return request({
    url: '/experiment/listPage',
    method: 'post',
    data
  })
}
// 修改顺序
export function experimentEditTree(data) {
  return request({
    url: '/experiment/editTree',
    method: 'post',
    data
  })
}
export function fetchContractList(data) {
  return request({
    url: '/contract/query',
    method: 'post',
    data
  })
}

export function fetchDetail(data) {
  return request({
    url: '/experiment/get',
    method: 'post',
    data
  })
}

export function editExperiment(data) {
  return request({
    url: '/experiment/edit',
    method: 'post',
    data
  })
}

export function deleteExperiment(data) {
  return request({
    url: '/experiment/delete',
    method: 'post',
    data
  })
}

export function editExperimentStatus(data) {
  return request({
    url: '/experiment/updateStatus',
    method: 'post',
    data
  })
}
// 查询实验记录列表
export function fetchRecordList(data) {
  return request({
    url: '/record/listPage',
    method: 'post',
    data
  })
}
// 查询实验记录详情
export function fetchRecordDetail(data) {
  return request({
    url: '/task/get',
    method: 'post',
    data
  })
}
// 编辑、新增实验记录
export function editRecord(data) {
  return request({
    url: '/record/edit',
    method: 'post',
    data
  })
}

export function exportExperiment(data) {
  return request({
    url: '/experiment/export',
    method: 'post',
    data
  })
}

// 删除实验记录
export function delRecord(data) {
  return request({
    url: '/record/delete',
    method: 'post',
    data
  })
}
