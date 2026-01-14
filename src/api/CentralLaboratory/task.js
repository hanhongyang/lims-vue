import request from '@/utils/request'

// 查询检测中心检测任务列表
export function listTask(query) {
  return request({
    url: '/labtest/task/list',
    method: 'get',
    params: query
  })
}
// 查询检测中心检测任务（近红外）列表
export function listJHYTask(query) {
  return request({
    url: '/labtest/task/jhwList',
    method: 'get',
    params: query
  })
}
// 查询检测中心检测任务详细
// export function getTask(opJczxTestTaskId) {
//   return request({
//     url: '/labtest/task/' + opJczxTestTaskId,
//     method: 'get'
//   })
// }

// 新增检测中心检测任务
export function addTask(data) {
  return request({
    url: '/labtest/task',
    method: 'post',
    data: data
  })
}

// 修改检测中心检测任务
export function updateTask(data) {
  return request({
    url: '/labtest/task',
    method: 'put',
    data: data
  })
}

// 删除检测中心检测任务
export function delTask(opJczxTestTaskId) {
  return request({
    url: '/labtest/task/' + opJczxTestTaskId,
    method: 'delete'
  })
}

// 开始化验查询化验单详情
export function getTask(invbillCode,itemId) {
  return request({
    url: '/labtest/jczxFeedResultBase/getInitInfo/' + invbillCode + '/' + itemId,
    method: 'get'
  })
}



// 开始化验接口 - 返回化验单号
export function beginPcrTask(data) {
  return request({
    url: '/labtest/task/beginPcrTask',
      method: 'post',
      data: data
  })
}

// 开始化验接口 - 血样返回化验单号
export function beginBloodTask(entrustOrderIdList) {
  return request({
    url: '/labtest/task/beginBloodTask',
    method: 'post',
    data: entrustOrderIdList
  })
}

// 下载PCR Excel接口
export function downloadPcrTask(data) {
  return request({
    url: '/labtest/task/downloadPcrTask',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


// 下载血样 Excel接口
export function downloadBloodTask(entrustOrderIdList,resultNo) {
  return request({
    url: '/labtest/task/downloadBloodTask',
    method: 'post',
    data: { entrustOrderIdList,resultNo },
    responseType: 'blob'
  })
}

//上传近红外报告
export function uploadNirReport(data) {
  return request({
    url: '/labtest/task/uploadNirReport',
    method: 'post',
    data: data
  })
}
// 开始化验接口 近红外
export function beginJHYTask(data) {
  return request({
    url: '/labtest/feedEntrustOrder/jhwItemList',
      method: 'post',
      data: data
  })
}
// 开始化验详情 近红外
export function getdetail(id) {
  return request({
    url: '/basicdata/labTestItems/' + id,
    method: 'get'
  })
}