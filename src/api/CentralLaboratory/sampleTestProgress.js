import request from '@/utils/request'



/** 查询样品接收列表 */
export function listSampleTestProgress(params) {
    return request({
        url: '/labtest/sampleTestProgress/list',
        method: 'get',
        params: params
    });
}