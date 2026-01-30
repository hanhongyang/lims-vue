import request from '@/utils/request'

// 查询耗材入库单主列表
export function listInbound(query) {
  return request({
    url: '/consumable/inbound/list',
    method: 'get',
    params: query
  })
}

// 查询耗材入库单主详细
export function getInbound(id) {
  return request({
    url: '/consumable/inbound/' + id,
    method: 'get'
  })
}

// 新增耗材入库单主
export function addInbound(data) {
  return request({
    url: '/consumable/inbound',
    method: 'post',
    data: data
  })
}

// 修改耗材入库单主
export function updateInbound(data) {
  return request({
    url: '/consumable/inbound',
    method: 'put',
    data: data
  })
}

// 删除耗材入库单主
export function delInbound(id) {
  return request({
    url: '/consumable/inbound/' + id,
    method: 'delete'
  })
}
