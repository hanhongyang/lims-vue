import request from '@/utils/request'

// 查询PCR样品委托单列表
export function listBloodEntrustOrder(query) {
  return request({
    url: '/labtest/bloodEntrustOrder/list',
    method: 'get',
    params: query
  })
}

// 查询PCR样品委托单详细
export function getBloodEntrustOrder(opBloodEntrustOrderId) {
  return request({
    url: '/labtest/bloodEntrustOrder/' + opBloodEntrustOrderId,
    method: 'get'
  })
}

// 新增PCR样品委托单
export function addBloodEntrustOrder(data) {
  return request({
    url: '/labtest/bloodEntrustOrder',
    method: 'post',
    data: data
  })
}

// 修改PCR样品委托单
export function updateBloodEntrustOrder(data) {
  return request({
    url: '/labtest/bloodEntrustOrder',
    method: 'put',
    data: data
  })
}

