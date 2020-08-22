import request from '@/utils/request'

// 查询库存列表
export function fetchList(data) {
  return request({
    url: '/buyInfo/store/query',
    method: 'post',
    data
  })
}
// 新建库存
export function editStore(data) {
  return request({
    url: '/buyInfo/edit',
    method: 'post',
    data
  })
}
// 新建入库
export function addStoreLog(data) {
  return request({
    url: '/buyInfo//store/addStoreLog',
    method: 'post',
    data
  })
}
// 获取库存物品详情
export function queryStoreDetail(data) {
  return request({
    url: '/buyInfo/get',
    method: 'post',
    data
  })
}
// 库存物品领用申请
export function storeReceive(data) {
  return request({
    url: '/buyInfo/store/getUse',
    method: 'post',
    data
  })
}
// 库存物品领用审批
export function storeReceivePermit(data) {
  return request({
    url: '/buyInfo/store/approveUse',
    method: 'post',
    data
  })
}
// 获取入库记录、领用记录
export function queryStorage(data) {
  return request({
    url: '/buyInfo/store/getUseList',
    method: 'post',
    data
  })
}

// 删除采购需求、报价信息、库存信息
export function delBuyStoreData(data) {
  return request({
    url: '/buyInfo/delete',
    method: 'post',
    data
  })
}

// 开启设置双规格
export function setDoubleSpecs(data) {
  return request({
    url: '/buyInfo/store/changeDouble',
    method: 'post',
    params: data
  })
}
