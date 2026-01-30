import request from '@/utils/request'

// 查询设备校准记录列表
export function listCalibration(query) {
  return request({
    url: '/instrument/calibration/list',
    method: 'get',
    params: query
  })
}

// 查询设备校准记录详细
export function getCalibration(bsCalibrationRecordId) {
  return request({
    url: '/instrument/calibration/' + bsCalibrationRecordId,
    method: 'get'
  })
}

// 新增设备校准记录
export function addCalibration(data) {
  return request({
    url: '/instrument/calibration',
    method: 'post',
    data: data
  })
}

// 修改设备校准记录
export function updateCalibration(data) {
  return request({
    url: '/instrument/calibration',
    method: 'put',
    data: data
  })
}

// 删除设备校准记录
export function delCalibration(bsCalibrationRecordId) {
  return request({
    url: '/instrument/calibration/' + bsCalibrationRecordId,
    method: 'delete'
  })
}

// 导出设备校准记录
export function exportCalibration(query) {
  return request({
    url: '/instrument/calibration/export',
    method: 'post',
    params: query
  })
}
