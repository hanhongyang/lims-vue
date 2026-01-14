import request from '@/utils/request'

// 查询列表
export function listmilkbinqualityinspection(query) {
  return request({
    url: '/milkbinqualityinspection/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getmilkbinqualityinspection(id) {
  return request({
    url: '/milkbinqualityinspection/' + id,
    method: 'get',
  })
}


