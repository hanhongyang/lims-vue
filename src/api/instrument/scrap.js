import request from '@/utils/request'

// 查询设备报废记录列表
export function listScrap(query) {
  return request({
    url: '/instrument/scrap/list',
    method: 'get',
    params: query
  })
}

// 查询设备报废记录详细
export function getScrap(bsScrapRecordId) {
  return request({
    url: '/instrument/scrap/' + bsScrapRecordId,
    method: 'get'
  })
}

// 新增设备报废记录
export function addScrap(data) {
  return request({
    url: '/instrument/scrap',
    method: 'post',
    data: data
  })
}

// 修改设备报废记录
export function updateScrap(data) {
  return request({
    url: '/instrument/scrap',
    method: 'put',
    data: data
  })
}

// 删除设备报废记录
export function delScrap(bsScrapRecordId) {
  return request({
    url: '/instrument/scrap/' + bsScrapRecordId,
    method: 'delete'
  })
}

// 导出设备报废记录
export function exportScrap(query) {
  return request({
    url: '/instrument/scrap/export',
    method: 'post',
    params: query
  })
}
