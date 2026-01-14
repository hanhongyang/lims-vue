import request from '@/utils/request'

// 查询出场检测报表列表
export function exitInspectionReportList(query) {
    return request({
        url: '/milkSampleQualityInspection/inspection/exitInspectionReport/list',
        method: 'get',
        params: query
    })
}
