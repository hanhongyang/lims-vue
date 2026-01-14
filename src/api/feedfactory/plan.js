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
// 查询SAP
export function unPushSapList(query) {
    return request({
        url: '/ranch/testResult/unPushSapList',
        method: 'get',
        params: query
    })
}
// 查询SAP详情
export function sampleTestDetail(data) {
    return request({
        url: '/ranch/testResult/sampleTestDetail/' + data,
        method: 'get',

    })
}
// 查询入库检验批次
export function getInboundTestBatch(data) {
    return request({
        url: '/sap/queryInboundInspection',
        method: 'post',
        data: data
    })
}
// 修改SAP信息
export function updateSapSampleInfo(data) {
    return request({
        url: '/ranch/testResult/updateSampleInfo',
        method: 'put',
        data: data
    })
}
// 推送SAP
export function pushSap(data) {
    return request({
        url: '/ranch/testResult/pushSap',
        method: 'post',
        data: data
    })
}
// 成品取样单列表
export function sampleList(query) {
    return request({
        url: '/sampling/plan/sampleList',
        method: 'get',
        params: query
    })
}
// 新增取样单
export function addSapSample(data) {
    return request({
        url: '/sampling/plan/addSample',
        method: 'post',
        data: data
    })
}
// 修改取样单
export function updateSapSample(data) {
    return request({
        url: '/sampling/plan/updateSample',
        method: 'post',
        data: data
    })
}
// 查询取样单
export function sampleInfo(query) {
    return request({
        url: '/sampling/plan/sampleInfo',
        method: 'get',
        params: query
    })
}
// 查询报告打印
export function printReport(opSamplingPlanSampleId) {
    return request({
        url: '/ranch/testResult/printReport',
        method: 'get',
        params: opSamplingPlanSampleId
    })
}
// 查询库存垫料取样计划
export function samplingList(query) {
    return request({
        url: '/sampling/plan/list',
        method: 'get',
        params: query
    })
}
// 查询不合格处理单
export function listunquality(query) {
    return request({
        url: '/unquality/unquality/list',
        method: 'get',
        params: query
    })
}
// 查询不合格处理单信息
export function unqualityDetail(data) {
    return request({
        url: '/unquality/unquality/' + data,
        method: 'get',

    })
}
// 处理不合格处理单
export function updateUnquality(data) {
    return request({
        url: '/unquality/unquality/manualUpdate/' + data,
        method: 'put',
    })
}