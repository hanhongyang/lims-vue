import request from '@/utils/request'

// 查询近红外汇总列表
export function listSummary(query) {
  return request({
    url: '/basicdata/summary/list',
    method: 'get',
    params: query
  })
}

// 查询近红外汇总详细
export function getSummary(dairylandId) {
  return request({
    url: '/basicdata/summary/' + dairylandId,
    method: 'get'
  })
}

// 新增近红外汇总
export function addSummary(data) {
  return request({
    url: '/basicdata/summary',
    method: 'post',
    data: data
  })
}

// 修改近红外汇总
export function updateSummary(data) {
  return request({
    url: '/basicdata/summary',
    method: 'put',
    data: data
  })
}

// 删除近红外汇总
export function delSummary(dairylandId) {
  return request({
    url: '/basicdata/summary/' + dairylandId,
    method: 'delete'
  })
}
