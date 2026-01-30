import request from '@/utils/request'

// 查询设备保养记录列表
export function listMaintenance(query) {
  return request({
    url: '/instrument/maintenance/list',
    method: 'get',
    params: query
  })
}

// 查询设备保养记录详细
export function getMaintenance(bsMaintenanceRecordId) {
  return request({
    url: '/instrument/maintenance/' + bsMaintenanceRecordId,
    method: 'get'
  })
}

// 新增设备保养记录
export function addMaintenance(data) {
  return request({
    url: '/instrument/maintenance',
    method: 'post',
    data: data
  })
}

// 修改设备保养记录
export function updateMaintenance(data) {
  return request({
    url: '/instrument/maintenance',
    method: 'put',
    data: data
  })
}

// 删除设备保养记录
export function delMaintenance(bsMaintenanceRecordId) {
  return request({
    url: '/instrument/maintenance/' + bsMaintenanceRecordId,
    method: 'delete'
  })
}

// 导出设备保养记录
export function exportMaintenance(query) {
  return request({
    url: '/instrument/maintenance/export',
    method: 'post',
    params: query
  })
}
