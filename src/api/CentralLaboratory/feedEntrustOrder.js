import request from '@/utils/request'

// 查询饲料样品委托单列表
export function listFeedEntrustOrder(query) {
  return request({
    url: '/labtest/feedEntrustOrder/list',
    method: 'get',
    params: query
  })
}

// 查询饲料样品委托单详细
export function getFeedEntrustOrder(opFeedEntrustOrderId) {
  return request({
    url: '/labtest/feedEntrustOrder/' + opFeedEntrustOrderId,
    method: 'get'
  })
}

// 新增饲料样品委托单
export function addFeedEntrustOrder(data) {
  return request({
    url: '/labtest/feedEntrustOrder',
    method: 'post',
    data: data
  })
}

// 修改饲料样品委托单
export function updateFeedEntrustOrder(data) {
  return request({
    url: '/labtest/feedEntrustOrder',
    method: 'put',
    data: data
  })
}

// 删除饲料样品委托单
export function delFeedEntrustOrder(opFeedEntrustOrderId) {
  return request({
    url: '/labtest/feedEntrustOrder/' + opFeedEntrustOrderId,
    method: 'delete'
  })
}
// 直接打印
export function getprintFeedEntrustOrder(opFeedEntrustOrderId) {
  return request({
    url: '/labtest/feedEntrustOrder/print/' + opFeedEntrustOrderId,
    method: 'get'
  })
}
// 样品退回
export function returnFeedEntrustOrder(data) {
  return request({
    url: '/labtest/sampleReceive/returnSample',
    method: 'post',
    data: data
  })
}