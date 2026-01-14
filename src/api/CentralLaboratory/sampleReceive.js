import request from '@/utils/request'

/** 查询样品接收列表 */
export function listSampleReceive(params) {
    return request({
        url: '/labtest/sampleReceive/list',
        method: 'get',
        params: params
    });
}
/** 查询样品接收列表详细信息 */
export function GetqualityTestinfo(entrustOrderNo, type) {
    return request({
        url: '/labtest/sampleReceive/' + entrustOrderNo + '?type=' + type,
        method: 'get',

    });
}
/** 检测项目列表 */
export function labTestItemslist(params) {
    return request({
        url: '/basicdata/labTestItems/list',
        method: 'get',
        params: params
    });
}