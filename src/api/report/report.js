import request from '@/utils/request'

// 查询出场检测报表列表
export function exitInspectionReportList(query) {
    return request({
        url: '/milkSampleQualityInspection/inspection/exitInspectionReport/list',
        method: 'get',
        params: query
    })
}
// 查询牧场饲料检测记录
export function JCKCTestList(query) {
    return request({
        url: '/ranch/testResult/getJCKCTest',
        method: 'get',
        params: query
    })
}
// 冻精
export function queryFrozenSemenQc(data) {
    return request({
        url: '/sap/queryFrozenSemenQc',
        method: 'post',
        data: data
    })
}