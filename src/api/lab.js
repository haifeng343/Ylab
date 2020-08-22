import request from '@/utils/request'
// 实验室列表
export function labList(data) {
  return request({
    url: '/lab/listPage',
    method: 'post',
    data
  })
}

// 实验室详情
export function labDetail(data) {
  return request({
    url: '/lab/get',
    method: 'post',
    data
  })
}

// 摄像头列表
export function cameraList(data) {
  return request({
    url: '/camera/listPage',
    method: 'post',
    data
  })
}

// 获取摄像头Token
export function cameraToken(data) {
  return request({
    url: '/camera/getAccessToken',
    method: 'post',
    data
  })
}

// 获取实验室类型
export function labType() {
  return request({
    url: '/contractType/queryType',
    method: 'post',
    data: { code: 'lab', pageNo: 1, pageSize: 100 }
  })
}

// 获取列队
export function getQueue(data) {
  return request({
    url: '/camera/getQueue',
    method: 'post',
    data
  })
}

// 进入观看
export function addToQueue(data) {
  return request({
    url: '/camera/addToQueue',
    method: 'post',
    data
  })
}
// 实名认证
export function makeSureCard(data) {
  return request({
    url: '/yqb/updateCardInfo',
    method: 'post',
    data
  })
}
// 获取实名认证手机号验证码
export function getPhoneCode(data) {
  return request({
    url: '/yqb/getCode',
    method: 'post',
    data
  })
}
// 提交实名认证手机号验证码
export function submitPhoneCode(data) {
  return request({
    url: '/yqb/verifyCode',
    method: 'post',
    data
  })
}
// 获取验证码验证结果
export function getCodeResult(data) {
  return request({
    url: '/yqb/getVerifyCodeResult',
    method: 'post',
    data
  })
}
// 获取人脸识别跳转地址
export function getface(data) {
  return request({
    url: '/yqb/getFaceUrl',
    method: 'post',
    data
  })
}
// 文件签署
export function signPdf(data) {
  return request({
    url: '/yqb/signPdf',
    method: 'post',
    data
  })
}
// 发送客户通知
export function sendSms(data) {
  return request({
    url: '/yqb/sendSms',
    method: 'post',
    data
  })
}
// 获取人脸识别结果
export function getFaceResult(data) {
  return request({
    url: '/yqb/getFaceResult',
    method: 'post',
    data
  })
}
// 发送签署短信验证
export function sendSignCode(data) {
  return request({
    url: '/yqb/sendSignCode',
    method: 'post',
    data
  })
}
