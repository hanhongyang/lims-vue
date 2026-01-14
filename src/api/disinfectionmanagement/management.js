import request from '@/utils/request'

// 查询消毒管理列表
export function listManagement(query) {
  return request({
    url: '/disinfectionmanagement/management/list',
    method: 'get',
    params: query
  })
}

// 查询消毒管理详细
export function getManagement(disinfectionManagementId) {
  return request({
    url: '/disinfectionmanagement/management/' + disinfectionManagementId,
    method: 'get'
  })
}

// 新增消毒管理
export function addManagement(data) {
  return request({
    url: '/disinfectionmanagement/management',
    method: 'post',
    data: data
  })
}

// 修改消毒管理
export function updateManagement(data) {
  return request({
    url: '/disinfectionmanagement/management',
    method: 'put',
    data: data
  })
}

// 删除消毒管理
export function delManagement(disinfectionManagementId) {
  return request({
    url: '/disinfectionmanagement/management/' + disinfectionManagementId,
    method: 'delete'
  })
}
