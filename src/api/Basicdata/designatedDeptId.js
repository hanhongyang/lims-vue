import request from '@/utils/request'

// 查询列表
export function getpagelist(query) {
  return request({
    url: '/basicdata/dept/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/basicdata/dept',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/basicdata/dept',
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
    url: '/basicdata/contact/enable',
    method: 'put',
    data: data
  })
}
// 查询详细信息
export function getdetail(opSamplingTestItemDeptId) {
  return request({
    url: '/basicdata/dept/' + opSamplingTestItemDeptId,
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