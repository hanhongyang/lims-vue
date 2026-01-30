import request from '@/utils/request'


// 查询生成取样码列表
export function getsamplinglist(query) {
  return request({
    url: '/generate/sampling/code/list',
    method: 'get',
    params: query
  })
}
// 新增
export function addobj(data) {
  return request({
    url: '/generate/sampling/code',
    method: 'post',
    data: data
  })
}
// 修改
export function updateobj(data) {
  return request({
    url: '/generate/sampling/code',
    method: 'put',
    data: data
  })
}
// 查询详细
export function getdetail(id) {
  return request({
    url: '/generate/sampling/code//' + id,
    method: 'get'
  })
}
