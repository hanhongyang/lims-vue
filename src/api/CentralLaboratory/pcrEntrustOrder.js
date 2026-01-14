import request from '@/utils/request'

// 查询PCR样品委托单列表
export function listPcrEntrustOrder(query) {
  return request({
    url: '/labtest/pcrEntrustOrder/list',
    method: 'get',
    params: query
  })
}

// 查询PCR样品委托单详细
export function getPcrEntrustOrder(opPcrEntrustOrderId) {
  return request({
    url: '/labtest/pcrEntrustOrder/' + opPcrEntrustOrderId,
    method: 'get'
  })
}

// 新增PCR样品委托单
export function addPcrEntrustOrder(data) {
  return request({
    url: '/labtest/pcrEntrustOrder',
    method: 'post',
    data: data
  })
}

// 修改PCR样品委托单
export function updatePcrEntrustOrder(data) {
  return request({
    url: '/labtest/pcrEntrustOrder',
    method: 'put',
    data: data
  })
}

// 删除PCR样品委托单
export function delPcrEntrustOrder(opPcrEntrustOrderId) {
  return request({
    url: '/labtest/pcrEntrustOrder/' + opPcrEntrustOrderId,
    method: 'delete'
  })
}
