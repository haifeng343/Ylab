import request from '@/utils/request'

// 查询人员
export function fetchPersonList(data) {
  return request({
    url: '/employee/queryById',
    method: 'post',
    data
  })
}

// 查询部门
export function queryDept(data) {
  return request({
    url: 'dept/query',
    method: 'post',
    data
  })
}

// 个人数据存储
export function setMyQuery(data) {
  return request({
    url: '/employee/setMyQuery',
    method: 'post',
    data
  })
}

// 获取个人数据
export function getMyQuery(data) {
  return request({
    url: '/employee/getMyQuery',
    method: 'post',
    data
  })
}

// 删除文件
export function deleteFile(data) {
  return request({
    url: '/test/deleteFile',
    method: 'post',
    data
  })
}
