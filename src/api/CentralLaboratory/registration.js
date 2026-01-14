import request from '@/utils/request'

// 查询列表
export function getpagelist(query) {
  return request({
    url: '/labtest/outEntrustRegister/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/labtest/outEntrustRegister',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/labtest/outEntrustRegister',
    method: 'put',
    data: data
  })
}
// // 查询部详细
// export function getdetail(id) {
//   return request({
//     url: '/basicdata/labTestItems/' + id,
//     method: 'get'
//   })
// }
// 状态修改
export function changestatus(id,status) {
var data={
  id:id,isEnable:status,
}
  return request({
    url: '/labtest/outEntrustRegister/enable',
    method: 'put',
    data: data
  })
}
// 获取外部委托检测单详细信息
export function getdetail(id) {
  return request({
    url: '/labtest/outEntrustRegister/' + id,
    method: 'get'
  })
}
// 查询id
export function requestID(query) {
  return request({
    url: '/system/dept//list',
    method: 'get',
    params: query
  })
}