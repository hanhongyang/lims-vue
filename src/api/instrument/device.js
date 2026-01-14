import request from '@/utils/request'


// 查询列表
export function listInstrument(query) {
  return request({
   url: '/instrument/instruments/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/instrument/instruments',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/instrument/instruments',
    method: 'put',
    data: data
  })
}
// 查询部详细
export function getdetail(id) {
  return request({
    url: '/instrument/instruments/' + id,
    method: 'get'
  })
}
// 状态修改   
export function changestatus(id,status) {
var data={
  bsLabtestMethodsId:id,isEnable:status,
}
  return request({
    url: '/instrument/instruments/editEnable',
    method: 'put',
    data: data
  })
}