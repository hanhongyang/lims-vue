import request from '@/utils/request'

// 查询设备温湿度监控列表
export function listMonitor(query) {
  return request({
    url: '/basicdata/monitor/list',
    method: 'get',
    params: query
  })
}

// 查询设备温湿度监控详细
export function getMonitor(id) {
  return request({
    url: '/basicdata/monitor/' + id,
    method: 'get'
  })
}

// 新增设备温湿度监控
export function addMonitor(data) {
  return request({
    url: '/basicdata/monitor',
    method: 'post',
    data: data
  })
}

// 修改设备温湿度监控
export function updateMonitor(data) {
  return request({
    url: '/basicdata/monitor',
    method: 'put',
    data: data
  })
}

// 删除设备温湿度监控
export function delMonitor(id) {
  return request({
    url: '/basicdata/monitor/' + id,
    method: 'delete'
  })
}

// 新增：获取修改记录列表接口（关键！）
export function listMonitorEditRecord(query) {
  return request({
    url: '/basicdata/monitor/editRecord/list', // 后端接口地址（需与后端一致）
    method: 'get',
    params: query
  })
}

// 导出修改记录接口（使用POST请求）
export function exportMonitorEditRecord(data) {
  return request({
    url: '/basicdata/monitor/editRecord/export', // 后端接口地址（需与后端一致）
    method: 'post', // 改为POST请求
    data: data, // POST请求用data传递参数（请求体中）
    responseType: 'blob' // 必须保留，确保正确解析文件流（导出文件专用）
  })
}
