import request from '@/utils/request'

// 查询取样计划主列表
export function statistics() {
  return request({
    url: '/dashboard/statistics',
    method: 'get'
  })
}
