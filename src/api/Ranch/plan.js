import request from '@/utils/request'

// 查询取样计划主列表
export function listPlan(query) {
    return request({
        url: '/ranch/plan/list',
        method: 'get',
        params: query
    })
}

// 查询取样计划主详细
export function getPlan(opSamplingPlanId) {
    return request({
        url: '/ranch/plan/' + opSamplingPlanId,
        method: 'get'
    })
}
// 查询张数
export function getPlanZs(count) {
    return request({
        url: '/ranch/plan/getQRCode/' + count,
        method: 'get'
    })
}

// 新增取样计划主
export function addPlan(data) {
    return request({
        url: '/ranch/plan',
        method: 'post',
        data: data
    })
}

// 修改取样计划主
export function updatePlan(data) {
    return request({
        url: '/ranch/plan',
        method: 'put',
        data: data
    })
}

// 删除取样计划主
export function delPlan(opSamplingPlanId) {
    return request({
        url: '/ranch/plan/' + opSamplingPlanId,
        method: 'delete'
    })
}

/**
 * 查询待检任务列表 (Tab 1)
 */
export function listSampleTask(query) {
    return request({
        url: '/ranch/plan/sampleTaskList', // 确保这个URL正确
        method: 'get',
        params: query
    })
}


/**
 * 状态变更为：取样完成
 * @param {string} opSamplingPlanId 计划ID
 */
export function completePlan(opSamplingPlanId) {
    return request({
        url: '/ranch/plan/complete/' + opSamplingPlanId, // 后端需要实现这个新 PUT 接口
        method: 'put'
    })
}

/**
 * 状态变更为：无需取样
 * @param {string} opSamplingPlanId 计划ID
 */
export function skipPlan(opSamplingPlanId) {
    return request({
        url: '/ranch/plan/skip/' + opSamplingPlanId, // 后端需要实现这个新 PUT 接口
        method: 'put'
    })
}

// 作废
export function cancelPlan(opSamplingPlanId) {
    return request({
        url: '/ranch/plan/cancel/' + opSamplingPlanId,
        method: 'put'
    })
}