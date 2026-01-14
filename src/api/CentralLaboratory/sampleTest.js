import request from '@/utils/request'

// 查询检测中心饲料检测结果基础列表
export function listJczxFeedResultBase(query) {
  return request({
    url: '/labtest/jczxFeedResultBase/list',
    method: 'get',
    params: query
  })
}
export function listJhw(query) {
  return request({
    url: '/labtest/jczxFeedResultBase/jhwList',
    method: 'get',
    params: query
  })
}
// 查询检测中心饲料检测结果基础详细
export function getJczxFeedResultBase(opJczxFeedResultBaseId) {
  return request({
    url: '/labtest/jczxFeedResultBase/' + opJczxFeedResultBaseId,
    method: 'get'
  })
}
// 查询近红外
export function getJczxFeedResultBaseJHW(opJczxFeedResultBaseId) {
  return request({
    url: '/labtest/jczxFeedResultBase/jhw/' + opJczxFeedResultBaseId,
    method: 'get'
  })
}

// 新增检测中心饲料检测结果基础
export function addJczxFeedResultBase(data) {
  return request({
    url: '/labtest/jczxFeedResultBase',
    method: 'post',
    data: data
  })
}

// 修改检测中心饲料检测结果基础
export function updateJczxFeedResultBase(data) {
  return request({
    url: '/labtest/jczxFeedResultBase',
    method: 'put',
    data: data
  })
}
// 更新状态
export function updateJczxFeedResultBaseStatus(opJczxFeedResultBaseId, status) {
  return request({
    url: '/labtest/jczxFeedResultBase/' + opJczxFeedResultBaseId + '/status',
    method: 'put',
    data: { status: status }
  })
}




// 查询样品化验PCR列表
export function listBase(query) {
  return request({
    url: '/labtest/jczxPcrResult/list',
    method: 'get',
    params: query
  })
}

// 查询样品化验PCR详细
export function getBase(opJczxPcrResultBaseId) {
  return request({
    url: '/labtest/jczxPcrResult/' + opJczxPcrResultBaseId,
    method: 'get'
  })
}

// 保存
export function savePcrResult(data) {
  return request({
    url: '/labtest/jczxPcrResult',
    method: 'put',
    data: data
  })
}
// 更新状态
export function examinePcrResult(data) {
  return request({
    url: '/labtest/jczxPcrResult/examine',
    method: 'post',
    data: data
  })
}

// 新增：审核结果接口
export function examinePcrResultBase(data) {
  return request({
    url: '/labtest/jczxPcrResult/examineBase', 
    method: 'post',
    data: data
  })
}
export function cancelExaminePcrResult(data) {  
  return request({
    url: '/labtest/jczxPcrResult/cancelExamine',
    method: 'post',
    data: data
  })
}

// 查询样品化验PCR详细
export function getBaseByResultNo(resultNo) {
  return request({
    url: '/labtest/jczxPcrResult/getBaseByResultNo',
    method: 'get',
    params: { resultNo: resultNo }
  })
}
//保存
export function savePcrResultInfoList(data) {
  return request({
    url: '/labtest/task/savePcrResultInfoList',
    method: 'post',
    data: data
  })
}

// 查询血液化验结果基础详细
export function getBloodBaseByResultNo(resultNo) {
  return request({
    url: '/labtest/jczxBloodResult/getBaseByResultNo',
    method: 'get',
    params: { resultNo: resultNo }
  })
}

//保存
export function saveBloodResultInfoList(data) {
  return request({
    url: '/labtest/task/saveBloodResultInfoList',
    method: 'post',
    data: data
  })
}


// 审核结果接口
export function examineBloodResultBase(data) {
  return request({
    url: '/labtest/jczxBloodResult/examineBase',
    method: 'post',
    data: data
  })
}
export function cancelExamineBloodResult(data) {
  return request({
    url: '/labtest/jczxBloodResult/cancelExamine',
    method: 'post',
    data: data
  })
}

