import request from '@/utils/request'

// 查询物料项目标准列表
export function listStandard(query) {
  return request({
    url: '/basicdata/standard/list',
    method: 'get',
    params: query
  })
}

// 查询物料项目标准详细
export function getStandard(bsInvbillItemStandardId) {
  return request({
    url: '/basicdata/standard/' + bsInvbillItemStandardId,
    method: 'get'
  })
}

// 根据物料id获取物料项目标准详细信息
export function getStandardByInvbillCode(invbillCode) {
  return request({
    url: `/basicdata/standard/getStandardByInvbillCode/${invbillCode}`,
    method: 'get'
  })
}

// 新增物料项目标准
export function addStandard(data) {
  return request({
    url: '/basicdata/standard',
    method: 'post',
    data: data
  })
}

// 修改物料项目标准
export function updateStandard(data) {
  return request({
    url: '/basicdata/standard',
    method: 'put',
    data: data
  })
}

// 删除物料项目标准
export function delStandard(bsInvbillItemStandardId) {
  return request({
    url: '/basicdata/standard/' + bsInvbillItemStandardId,
    method: 'delete'
  })
}
// 批量新增
export function addStandardBatch(data) {
  return request({
    url: '/basicdata/standard/batch',
    method: 'post',
    data: data
  })
}

// 批量更新
export function updateStandardBatch(data) {
  return request({
    url: '/basicdata/standard/batch',
    method: 'put',
    data: data
  })
}