import request from '@/utils/request'

// 获取消息列表
export const getMessages = data => request({
  url: '/notice/listPage',
  method: 'post',
  data
})

// 发送消息已读请求
export const sendMessageRead = data => request({
  url: '/notice/updateStatus',
  method: 'post',
  data
})

// 获取消息列表未读状态
export const getNotMsg = () => request({
  url: '/notice/getNotReadCount',
  method: 'post'
})

// 删除已读消息
export const delReadMsg = () => request({
  url: '/notice/deleteRead',
  method: 'post'
})

