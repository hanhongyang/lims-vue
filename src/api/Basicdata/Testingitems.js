import request from '@/utils/request'

// 查询列表
export function getpagelist(query) {
  return request({
    url: '/basicdata/labTestItems/list',
    method: 'get',
    params: query
  })
}
// 根据物料查询检测项目
export function getItemByInvbillCode(query) {
  return request({
    url: '/basicdata/standard/getItemByInvbillCode',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/basicdata/labTestItems',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/basicdata/labTestItems',
    method: 'put',
    data: data
  })
}
// 查询部详细
export function getdetail(id) {
  return request({
    url: '/basicdata/labTestItems/' + id,
    method: 'get'
  })
}
// 状态修改
export function changestatus(id,status) {
var data={
  labtestItemsId:id,isEnable:status,
}
  return request({
    url: '/basicdata/labTestItems/editEnable',
    method: 'put',
    data: data
  })
}