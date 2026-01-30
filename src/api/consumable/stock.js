import request from '@/utils/request'

// 查询化验室耗材库存列表
export function listStock(query) {
  return request({
    url: '/consumable/stock/list',
    method: 'get',
    params: query
  })
}

// 查询化验室耗材库存详细
export function getStock(id) {
  return request({
    url: '/consumable/stock/' + id,
    method: 'get'
  })
}

// 新增化验室耗材库存
export function addStock(data) {
  return request({
    url: '/consumable/stock',
    method: 'post',
    data: data
  })
}

// 修改化验室耗材库存
export function updateStock(data) {
  return request({
    url: '/consumable/stock',
    method: 'put',
    data: data
  })
}

// 删除化验室耗材库存
export function delStock(id) {
  return request({
    url: '/consumable/stock/' + id,
    method: 'delete'
  })
}
