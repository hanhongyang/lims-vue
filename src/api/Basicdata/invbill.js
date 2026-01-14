import request from '@/utils/request'

// 查询物料档案列表
export function getinvbilllist(query) {
  return request({
    url: '/business/invbill/list',
    method: 'get',
    params: query
  })
}

// 同步物料档案
export function getsyncBaseInvbill(query) {
  return request({
    url: '/business/invbill/syncBaseInvbill',
    method: 'get',
    params: query
  })
}

// 查询物料档案信息详情
export function getinvbillInfo(query) {
  return request({
    url: '/business/invbill/getInfo/'+query,
    method: 'get',
  })
}
// 查询物料详细
export function getinvbill(id) {
  return request({
    url: '/business/invbill/' + id,
    method: 'get'
  })
}

// 修改物料
export function updateInvbill(data) {
  return request({
    url: '/business/invbill',
    method: 'put',
    data: data
  })
}
// 新增
export function addInvbill(data) {
  return request({
    url: '/business/invbill',
    method: 'post',
    data: data
  })
}
