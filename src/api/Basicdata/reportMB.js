import request from '@/utils/request'

// 查询报告模板
export function listreport(query) {
  return request({
    url: '/basicdata/template/list',
    method: 'get',
    params: query
  })
}

// 查询检测特性详细
export function getreport(id) {
  return request({
    url: '/basicdata/template/' + id,
    method: 'get'
  })
}

// 新增报告模板
export function addreport(data) {
  return request({
    url: '/basicdata/template',
    method: 'post',
    data: data
  })
}

// 修改报告模板
export function updatereport(data) {
  return request({
    url: '/basicdata/template',
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
export function changeEnable(id, status) {
  var data = {
    bsLabtestFeatureId: id, isEnable: status,
  }
  return request({
    url: '/basicdata/feature/editEnable',
    method: 'put',
    data: data
  })
}