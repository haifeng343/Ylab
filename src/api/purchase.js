import request from '@/utils/request'
// 查询采购列表
export function fetchList(data) {
  return request({
    url: '/buy/query',
    method: 'post',
    data
  })
}

// 新建编辑采购订单
export function editPurchaseForm(data) {
  return request({
    url: '/buy/edit',
    method: 'post',
    data
  })
}

// 获取采购订单详情
export function getPurchaseDetail(data) {
  return request({
    url: '/buy/get',
    method: 'post',
    data
  })
}

// 删除采购订单
export function deletePurchase(data) {
  return request({
    url: '/buy/delete',
    method: 'post',
    data
  })
}

// 查询采购需求，报价 供应商采购记录
export function queryPurchaseDemand(data) {
  return request({
    url: '/buyInfo/query',
    method: 'post',
    data
  })
}

// 查询常用采购物品列表
export function querycommonProduct(data) {
  return request({
    url: '/buySupplier/query',
    method: 'post',
    data
  })
}

// 新建、编辑常用采购物品列表
export function editcommonProduct(data) {
  return request({
    url: '/buySupplier/edit',
    method: 'post',
    data
  })
}

// 删除常用采购物品列表
export function delcommonProduct(data) {
  return request({
    url: '/buySupplier/delete',
    method: 'post',
    data
  })
}

// 新建、编辑采购需求、报价信息
export function editPriceInfo(data) {
  return request({
    url: '/buyInfo/edit',
    method: 'post',
    data
  })
}
// 修改报价状态
export function updatePriceStatus(data) {
  return request({
    url: '/buyInfo/updateStatus',
    method: 'post',
    data
  })
}
// 修改采购订单状态
export function updatePurchaseStatus(data) {
  return request({
    url: '/buy/updateStatus',
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

// 获取第二采购信息
export function getSecondStorage(data) {
  return request({
    url: '/buyInfo/getSecondPrice',
    method: 'post',
    data
  })
}
