// (文件: src/api/Ranch/testResult.js)
// 【请替换您已有的 testResult.js】
import request from '@/utils/request'

// (新) 查询 "待化验" 列表 (Tab 1)
export function listPendingTest(query) {
  return request({
    url: '/ranch/testResult/pendingList',
    method: 'get',
    params: query
  })
}

// 查询 "样品化验" 列表 (Tab 2, 3, 4)
export function listTestResult(query) {
  return request({
    url: '/ranch/testResult/list',
    method: 'get',
    params: query
  })
}

// (新) 查询所有Tab的角标数量
export function getTestCounts(query) {
  return request({
    url: '/ranch/testResult/counts',
    method: 'get',
    params: query
  })
}

// 查询样品化验详细
export function getTestResult(id) {
  return request({
    url: '/ranch/testResult/' + id,
    method: 'get'
  })
}

// (新) 开始化验
export function startTest(opSamplingPlanItemIds) {
  return request({
    url: '/ranch/testResult/startTest',
    method: 'post',
    data: opSamplingPlanItemIds // 传递 opSamplingPlanItemId 数组
  })
}

// 新增样品化验 (弹窗)
export function addTestResult(data) {
  return request({
    url: '/ranch/testResult',
    method: 'post',
    data: data
  })
}

// 修改样品化验 (弹窗 - 保存)
export function updateTestResult(data) {
  return request({
    url: '/ranch/testResult',
    method: 'put',
    data: data
  })
}

// (新) 提交审核 (弹窗 - 提交)
export function submitTestResult(data) {
  return request({
    url: '/ranch/testResult/submit',
    method: 'put',
    data: data
  })
}

// (新) 审核通过 (弹窗 - 通过)
export function approveTestResult(id) {
  return request({
    url: '/ranch/testResult/approve/' + id,
    method: 'put'
  })
}

// (新) 审核退回 (弹窗 - 退回)
export function rejectTestResult(data) {
  return request({
    url: '/ranch/testResult/reject',
    method: 'put',
    data: data // { id: "...", returnReason: "..." }
  })
}

// (新) 取消审核 (弹窗 - 取消审核)
export function cancelApprove(id) {
  return request({
    url: '/ranch/testResult/cancelApprove/' + id,
    method: 'put'
  })
}

// 删除样品化验
export function delTestResult(id) {
  return request({
    url: '/ranch/testResult/' + id,
    method: 'delete'
  })
}

export function retest(infoId) {
  return request({
    url: '/ranch/testResult/retest' ,
    method: 'post',
    data: infoId
  })
}

// 变更化验单
export function changeTestResult(data) {
  return request({
    url: '/ranch/testResult/resultChange',
    method: 'put',
    data: data
  })
}
// 查询变更记录
export function testResultChangeLog(query) {
  return request({
    url: '/ranch/testResultChangeLog/list',
    method: 'get',
    params: query
  })
}