import request from '@/utils/request'

// 查询设备维修记录列表
export function listRepair(query) {
  return request({
    url: '/instrument/repair/list',
    method: 'get',
    params: query
  })
}

// 查询设备维修记录详细
export function getRepair(bsRepairRecordId) {
  return request({
    url: '/instrument/repair/' + bsRepairRecordId,
    method: 'get'
  })
}

// 新增设备维修记录
export function addRepair(data) {
  return request({
    url: '/instrument/repair',
    method: 'post',
    data: data
  })
}

// 修改设备维修记录
export function updateRepair(data) {
  return request({
    url: '/instrument/repair',
    method: 'put',
    data: data
  })
}

// 删除设备维修记录
export function delRepair(bsRepairRecordId) {
  return request({
    url: '/instrument/repair/' + bsRepairRecordId,
    method: 'delete'
  })
}

// 导出设备维修记录
export function exportRepair(query) {
  return request({
    url: '/instrument/repair/export',
    method: 'post',
    params: query
  })
}
