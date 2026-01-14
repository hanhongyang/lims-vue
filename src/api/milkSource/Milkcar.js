import request from '@/utils/request'

// 查询列表
export function listmilkTankInspection(query) {
  return request({
    url: '/milkTankInspection/inspection/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getmilkTankInspection(id) {
  return request({
    url: '/milkTankInspection/inspection/' + id,
    method: 'get',
  })
}


