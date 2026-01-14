import request from '@/utils/request'

// 查询检测项目列表
export function getpagelabTestlist(query) {
  return request({
    url: '/basicdata/labTestItems/list',
    method: 'get',
    params: query
  })
}
// 查询设备管理列表
export function getuserlist(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
// 查询列表
export function getpagelist(query) {
  return request({
    url: '/basicdata/userLabTestItem/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/basicdata/userLabTestItem',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/basicdata/userLabTestItem',
    method: 'put',
    data: data
  })
}
// 删除物料项目标准
export function deleteUserLabTestItem(id) {
  return request({
    url: '/basicdata/userLabTestItem/' + id,
    method: 'delete'
  })
}
// 删除物料项目标准
// 
export function deleteAllUserLabTestItem(id) {
  return request({
    url: '/basicdata/userLabTestItem/removeAll/' + id,
    method: 'delete'
  })
}
// 查询部详细
export function getdetail(id) {
  return request({
    url: '/basicdata/userLabTestItem/' + id,
    method: 'get'
  })
}
// 状态修改   
export function changestatus(id, status) {
  var data = {
    bsuserLabTestItemId: id, isEnable: status,
  }
  return request({
    url: '/basicdata/userLabTestItem/editEnable',
    method: 'put',
    data: data
  })
}

export function getCheckItemList() {
  return request({
    url: '/basicdata/userLabTestItem/getCheckItemList',
    method: 'get'
  })
}