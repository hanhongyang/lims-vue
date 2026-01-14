import request from '@/utils/request'

// 查询工作日配置列表
export function listWorkdayConfig(query) {
  return request({
    url: '/basicdata/workdayConfig/list',
    method: 'get',
    params: query
  })
}

// 根据年月查询工作日配置
export function listByYearMonth(year, month) {
  return request({
    url: `/basicdata/workdayConfig/listByYearMonth/${year}/${month}`,
    method: 'get'
  })
}

// 查询工作日配置详细
export function getWorkdayConfig(bsWorkdayConfigId) {
  return request({
    url: '/basicdata/workdayConfig/' + bsWorkdayConfigId,
    method: 'get'
  })
}

// 根据日期查询工作日配置
export function getWorkdayConfigByDate(dateStr) {
  return request({
    url: '/basicdata/workdayConfig/date/' + dateStr,
    method: 'get'
  })
}

// 新增工作日配置
export function addWorkdayConfig(data) {
  return request({
    url: '/basicdata/workdayConfig',
    method: 'post',
    data: data
  })
}

// 修改工作日配置
export function updateWorkdayConfig(data) {
  return request({
    url: '/basicdata/workdayConfig',
    method: 'put',
    data: data
  })
}

// 更新工作日状态
export function updateWorkdayStatus(data) {
  return request({
    url: '/basicdata/workdayConfig/updateWorkdayStatus',
    method: 'put',
    data: data
  })
}

// 删除工作日配置
export function delWorkdayConfig(bsWorkdayConfigId) {
  return request({
    url: '/basicdata/workdayConfig/' + bsWorkdayConfigId,
    method: 'delete'
  })
}

// 从节假日API初始化数据
export function initFromHolidayApi(year) {
  return request({
    url: '/basicdata/workdayConfig/initFromHoliday',
    method: 'post',
    data: { year: year }
  })
}