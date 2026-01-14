import request from '@/utils/request'

// 查询检测项目特性对应列表
export function listItemFeature(query) {
  return request({
    url: '/basicdata/itemFeature/list',
    method: 'get',
    params: query
  })
}

// 查询检测项目特性对应详细
export function getItemFeature(bsLabtestItemFeatureId) {
  return request({
    url: '/basicdata/itemFeature/' + bsLabtestItemFeatureId,
    method: 'get'
  })
}

// 新增检测项目特性对应
export function addItemFeature(data) {
  return request({
    url: '/basicdata/itemFeature',
    method: 'post',
    data: data
  })
}

// 修改检测项目特性对应
export function updateItemFeature(data) {
  return request({
    url: '/basicdata/itemFeature',
    method: 'put',
    data: data
  })
}

// 删除检测项目特性对应
export function delItemFeature(bsLabtestItemFeatureId) {
  return request({
    url: '/basicdata/itemFeature/' + bsLabtestItemFeatureId,
    method: 'delete'
  })
}
// 批量添加项目特性关联
export function batchAddItemFeature(data) {
  return request({
    url: '/basicdata/itemFeature/batchAdd',
    method: 'post',
    data: data
  })
}
// 批量更新项目特性关联
export function batchUpdateItemFeature(data) {
  return request({
    url: '/basicdata/itemFeature/batchUpdate',
    method: 'post',
    data: data
  })
}

// 查询检测项目id查询特性
export function getItemFeatureByItemId(itemId) {
  return request({
    url: '/basicdata/itemFeature/getInfoByItemId/' + itemId,
    method: 'get'
  })
}