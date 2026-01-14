import request from '@/utils/request'

// 查询检测特性列表
export function listFeature(query) {
  return request({
    url: '/basicdata/feature/list',
    method: 'get',
    params: query
  })
}

// 查询检测特性详细
export function getFeature(bsLabtestFeatureId) {
  return request({
    url: '/basicdata/feature/' + bsLabtestFeatureId,
    method: 'get'
  })
}

// 新增检测特性
export function addFeature(data) {
  return request({
    url: '/basicdata/feature',
    method: 'post',
    data: data
  })
}

// 修改检测特性
export function updateFeature(data) {
  return request({
    url: '/basicdata/feature',
    method: 'put',
    data: data
  })
}

// 删除检测特性
export function delFeature(bsLabtestFeatureId) {
  return request({
    url: '/basicdata/feature/' + bsLabtestFeatureId,
    method: 'delete'
  })
}
// 状态修改
export function changeEnable(id,status) {
var data={
  bsLabtestFeatureId:id,isEnable:status,
}
  return request({
    url: '/basicdata/feature/editEnable',
    method: 'put',
    data: data
  })
}