import request from '@/utils/request'
// 密码登录
export function loginPws(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}
// 验证码登录
export function loginCode(data) {
  return request({
    url: '/login/loginByCode',
    method: 'post',
    data
  })
}
// 获取短信验证码
export function getcode(data) {
  return request({
    url: '/login/getCode',
    method: 'post',
    data
  })
}
// 微信登录
export function wxLogin(info) {
  return request({
    url: '/login/wxLogin' + info,
    method: 'get'
  })
}
// 钉钉登录
export function dingLogin(info) {
  return request({
    url: '/login/dingLogin' + info,
    method: 'get'
  })
}
// 企业注册
export function registerCompany(data) {
  return request({
    url: '/register/addCompany',
    method: 'post',
    data
  })
}
// 人员注册
export function personRegister(data) {
  return request({
    url: '/register/addEmployee',
    method: 'post',
    data
  })
}
// 找回密码
export function findPws(data) {
  return request({
    url: '/login/findPassword',
    method: 'post',
    data
  })
}
// 查询企业信息
export function queryComInfo(info) {
  return request({
    url: '/company/get?companyId=' + info,
    method: 'post'
  })
}
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
// 关联微信
export function relatedWx(data) {
  return request({
    url: '/register/relevanceWx',
    method: 'post',
    data
  })
}
// 官网注册
export function website(data) {
  return request({
    url: '/register/registerYLab',
    method: 'post',
    data
  })
}
// 开通Ylab
export function openYLab(data) {
  return request({
    url: '/register/openYLab',
    method: 'post',
    data
  })
}
