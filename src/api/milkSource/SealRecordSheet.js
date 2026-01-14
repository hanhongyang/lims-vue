import request from '@/utils/request'

// 查询列表
export function listleadsealsheet(query) {
  return request({
    url: '/leadsealsheet/sheet/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getleadsealsheet(id) {
  return request({
    url: '/leadsealsheet/sheet/' + id,
    method: 'get',
  })
}


