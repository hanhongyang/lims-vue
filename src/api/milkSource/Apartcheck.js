import request from '@/utils/request'

// 查询列表
export function listmilkSampleQualityInspection(query) {
  return request({
    url: '/milkSampleQualityInspection/inspection/list',
    method: 'get',
    params: query
  })
}
// 详情
export function getmilkSampleQualityInspection(id) {
  return request({
    url: '/milkSampleQualityInspection/inspection/' + id,
    method: 'get',
  })
}


