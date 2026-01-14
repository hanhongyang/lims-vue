import request from '@/utils/request'

// 查询成品，库存，垫料取样计划列表
export function planlist(query) {
    return request({
        url: '/sampling/plan/detailList',
        method: 'get',
        params: query
    })
}
// 修改
export function updatePlan(data) {
    return request({
        url: '/sampling/plan/updateDetail',
        method: 'put',
        data: data
    })
}
// 详情
export function getPlan(finishedProductSamplingPlanDetailId) {
    return request({
        url: '/sampling/plan/detail/' + finishedProductSamplingPlanDetailId,
        method: 'get',
    })
}