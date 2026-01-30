import request from '@/utils/request'

// 查询耗材出库单主列表
export function listOutbound(query) {
  return request({
    url: '/consumable/outbound/list',
    method: 'get',
    params: query
  })
}

// 查询耗材出库单主详细
export function getOutbound(outboundId) {
  return request({
    url: '/consumable/outbound/' + outboundId,
    method: 'get'
  })
}

// 新增耗材出库单主
export function addOutbound(data) {
  return request({
    url: '/consumable/outbound',
    method: 'post',
    data: data
  })
}

// 修改耗材出库单主
export function updateOutbound(data) {
  return request({
    url: '/consumable/outbound',
    method: 'put',
    data: data
  })
}

// 删除耗材出库单主
export function delOutbound(outboundId) {
  return request({
    url: '/consumable/outbound/' + outboundId,
    method: 'delete'
  })
}
