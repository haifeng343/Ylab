import request from '@/utils/request'

// 获取逻辑树列表
export const getPeriod = data => request({
  url: '/period/listPage',
  method: 'post',
  data
})

// 审批逻辑树
export const approveProcess = data => request({
  url: '/contract/approveProcess',
  method: 'post',
  data
})

// 新建流程
export function editPeriod(data) {
  return request({
    url: '/period/edit',
    method: 'post',
    data
  })
}

// 保持为模板
export function periodTemplate(data) {
  return request({
    url: '/period/saveTemplate',
    method: 'post',
    data
  })
}

// 删除模板
export function deleteTemplate(data) {
  return request({
    url: '/period/delete',
    method: 'post',
    data
  })
}
