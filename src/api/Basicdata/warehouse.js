import request from '@/utils/request'

// 查询奶仓档案列表
export function listWarehouse(query) {
  return request({
    url: '/basicdata/warehouse/list',
    method: 'get',
    params: query
  })
}

// 查询奶仓档案详细
export function getWarehouse(id) {
  return request({
    url: '/basicdata/warehouse/' + id,
    method: 'get'
  })
}

// 新增奶仓档案
export function addWarehouse(data) {
  return request({
    url: '/basicdata/warehouse',
    method: 'post',
    data: data
  })
}

// 修改奶仓档案
export function updateWarehouse(data) {
  return request({
    url: '/basicdata/warehouse',
    method: 'put',
    data: data
  })
}

// 删除奶仓档案
export function delWarehouse(id) {
  return request({
    url: '/basicdata/warehouse/' + id,
    method: 'delete'
  })
}
