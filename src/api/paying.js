import request from '@/utils/request'

// 获取付款列表
export const getPayList = data => request({
  url: '/payment/query',
  method: 'post',
  data
})

// 获取付款详情
export const getPayDetail = data => request({
  url: '/payment/get',
  method: 'post',
  data
})

// 取消付款
export const changePayStatus = data => request({
  url: '/payment/updateStatus',
  method: 'post',
  data
})

// 改变付款批次
export const changePayInfoStatus = data => request({
  url: '/paymentInfo/updateStatus',
  method: 'post',
  data
})

// 采购报价申请付款
export const applayPay = data => request({
  url: '/payment/edit',
  method: 'post',
  data
})
