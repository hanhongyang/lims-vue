import request from '@/utils/request'

const prefix = '/basicData/disinfection'

// 查询消毒池管理列表
export function listDisinfection(query) {
  return request({
    url: prefix + '/list',
    method: 'get',
    params: query
  })
}

// 查询消毒池管理详细
export function getDisinfection(id) {
  return request({
    url: prefix + '/' + id,
    method: 'get'
  })
}

// 新增消毒池管理
export function addDisinfection(data) {
  return request({
    url: prefix,
    method: 'post',
    data: data
  })
}

// 修改消毒池管理
export function updateDisinfection(data) {
  return request({
    url: prefix,
    method: 'put',
    data: data
  })
}

// 删除消毒池管理
export function delDisinfection(id) {
  return request({
    url: prefix + '/' + id,
    method: 'delete'
  })
}
