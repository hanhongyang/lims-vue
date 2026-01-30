import request from '@/utils/request'

// 查询耗材退库单主列表
export function listReturn(query) {
  return request({
    url: '/consumable/return/list',
    method: 'get',
    params: query
  })
}

// 查询耗材退库单主详细
export function getReturn(returnId) {
  return request({
    url: '/consumable/return/' + returnId,
    method: 'get'
  })
}

// 新增耗材退库单主
export function addReturn(data) {
  return request({
    url: '/consumable/return',
    method: 'post',
    data: data
  })
}

// 修改耗材退库单主
export function updateReturn(data) {
  return request({
    url: '/consumable/return',
    method: 'put',
    data: data
  })
}

// 删除耗材退库单主
export function delReturn(returnId) {
  return request({
    url: '/consumable/return/' + returnId,
    method: 'delete'
  })
}
