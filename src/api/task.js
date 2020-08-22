import request from '@/utils/request'
// 查询任务列表
export function fetchList(data) {
  return request({
    url: '/task/listPage',
    method: 'post',
    data
  })
}
// 修改顺序
export function taskEditTree(data) {
  return request({
    url: '/task/editTree',
    method: 'post',
    data
  })
}
// 查询所属项目列表
export function fetchContractList(data) {
  return request({
    url: '/contract/query',
    method: 'post',
    data
  })
}
// 查询任务详情
export function fetchDetail(data) {
  return request({
    url: '/task/get',
    method: 'post',
    data
  })
}
// 编辑、新建任务
export function editTask(data) {
  return request({
    url: '/task/edit',
    method: 'post',
    data
  })
}
// 删除任务
export function deleteTask(data) {
  return request({
    url: '/task/delete',
    method: 'post',
    data
  })
}
// 修改任务状态
export function editTaskStatus(data) {
  return request({
    url: '/task/updateStatus',
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
    url: '/record/get',
    method: 'post',
    data
  })
}
// 编辑、新建实验记录
export function editRecord(data) {
  return request({
    url: '/record/edit',
    method: 'post',
    data
  })
}
// 导出任务列表
export function exportTask(data) {
  return request({
    url: '/task/export',
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

// 获取文件列表
export function fileList(data) {
  return request({
    url: '/file/listPage',
    method: 'post',
    data
  })
}

// 新增/修改文件
export function fileEdit(data) {
  return request({
    url: '/file/edit',
    method: 'post',
    data
  })
}

// 删除文件
export function fileDelete(data) {
  return request({
    url: '/file/delete',
    method: 'post',
    data
  })
}

// 批量下载文件
export function fileDownBatch(data) {
  return request({
    url: '/file/downBatch',
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 文件审核
export function fileUpdateStatus(data) {
  return request({
    url: 'file/updateStatus',
    method: 'post',
    data
  })
}

// 发送文件下载记录
export function fileDownloadRecord(data) {
  return request({
    url: '/experimentLog/add',
    method: 'post',
    data
  })
}

// 查询下载记录
export function queryDownloadRecord(data) {
  return request({
    url: '/experimentLog/query',
    method: 'post',
    data
  })
}
