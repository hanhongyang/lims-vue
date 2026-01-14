import request from '@/utils/request'

// 查询列表
export function listinspectionMilk(query) {
  return request({
    url: '/inspectionMilk/tankers/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getinspectionMilk(id) {
  return request({
    url: '/inspectionMilk/tankers/' + id,
    method: 'get',
  })
}


