import request from '@/utils/request'

// 查询列表
export function listmilkFilling(query) {
  return request({
    url: '/milkFilling/order/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getmilkFilling(id) {
  return request({
    url: '/milkFilling/order/' + id,
    method: 'get',
  })
}


