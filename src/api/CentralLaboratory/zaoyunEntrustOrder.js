import request from '@/utils/request'

// 查询早孕样品委托单列表
export function listZaoyunEntrustOrder(query) {
  return request({
    url: '/CentralLaboratory/bloodEntrustOrder/list',
    method: 'get',
    params: query
  })
}

// 查询早孕样品委托单详细
export function getZaoyunEntrustOrder(opZaoyunEntrustOrderId) {
  return request({
    url: '/CentralLaboratory/bloodEntrustOrder/' + opZaoyunEntrustOrderId,
    method: 'get'
  })
}

// 新增早孕样品委托单
export function addZaoyunEntrustOrder(data) {
  return request({
    url: '/CentralLaboratory/bloodEntrustOrder',
    method: 'post',
    data: data
  })
}

// 修改早孕样品委托单
export function updateZaoyunEntrustOrder(data) {
  return request({
    url: '/CentralLaboratory/bloodEntrustOrder',
    method: 'put',
    data: data
  })
}

// 删除早孕样品委托单
export function delZaoyunEntrustOrder(opZaoyunEntrustOrderId) {
  return request({
    url: '/CentralLaboratory/bloodEntrustOrder/' + opZaoyunEntrustOrderId,
    method: 'delete'
  })
}
