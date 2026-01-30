import request from '@/utils/request'

// 查询化验室耗材档案列表
export function listArchive(query) {
  return request({
    url: '/consumable/archive/list',
    method: 'get',
    params: query
  })
}

// 查询全部化验室耗材档案
export function listAllArchive() {
  return request({
    url: '/consumable/archive/listAll',
    method: 'get'
  })
}

// 查询化验室耗材档案详细
export function getArchive(id) {
  return request({
    url: '/consumable/archive/' + id,
    method: 'get'
  })
}

// 新增化验室耗材档案
export function addArchive(data) {
  return request({
    url: '/consumable/archive',
    method: 'post',
    data: data
  })
}

// 修改化验室耗材档案
export function updateArchive(data) {
  return request({
    url: '/consumable/archive',
    method: 'put',
    data: data
  })
}

// 删除化验室耗材档案
export function delArchive(consumableId) {
  return request({
    url: '/consumable/archive/' + consumableId,
    method: 'delete'
  })
}
