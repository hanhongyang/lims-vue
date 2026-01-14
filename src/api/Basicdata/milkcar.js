import request from '@/utils/request'

// 查询奶车信息列表
export function listInfo(query) {
    return request({
        url: '/basicdata/info/list',
        method: 'get',
        params: query
    })
}

// 查询奶车信息详细
export function getInfo(id) {
    return request({
        url: '/basicdata/info/' + id,
        method: 'get'
    })
}

// 新增奶车信息
export function addInfo(data) {
    return request({
        url: '/basicdata/info',
        method: 'post',
        data: data
    })
}

// 修改奶车信息
export function updateInfo(data) {
    return request({
        url: '/basicdata/info',
        method: 'put',
        data: data
    })
}

// 删除奶车信息
export function delInfo(id) {
    return request({
        url: '/basicdata/info/' + id,
        method: 'delete'
    })
}
