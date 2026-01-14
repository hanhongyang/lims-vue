import request from '@/utils/request'

// 查询设备档案列表
export function listInstruments(query) {
  return request({
    url: '/instrument/instruments/list',
    method: 'get',
    params: query
  })
}

// 查询设备档案详细
export function getInstruments(bsInstrumentsId) {
  return request({
    url: '/instrument/instruments/' + bsInstrumentsId,
    method: 'get'
  })
}

// 新增设备档案
export function addInstruments(data) {
  return request({
    url: '/instrument/instruments',
    method: 'post',
    data: data
  })
}

// 修改设备档案
export function updateInstruments(data) {
  return request({
    url: '/instrument/instruments',
    method: 'put',
    data: data
  })
}

// 删除设备档案
export function delInstruments(bsInstrumentsId) {
  return request({
    url: '/instrument/instruments/' + bsInstrumentsId,
    method: 'delete'
  })
}
