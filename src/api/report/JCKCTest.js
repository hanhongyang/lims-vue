import request from '@/utils/request'

// 查询牧场饲料检测记录
export function JCKCTestList(query) {
    return request({
        url: '/ranch/testResult/getJCKCTest',
        method: 'get',
        params: query
    })
}
