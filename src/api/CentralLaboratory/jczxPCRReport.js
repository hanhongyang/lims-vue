import request from '@/utils/request'

// 查询检测中心饲料报告主列表
export function listjczxPcrReportBaseId(query) {
  return request({
    url: '/labtest/jczxPcrReport/list',
    method: 'get',
    params: query
  })
}

export function queryjczxPcrReportBaseId(query) {
  return request({
    url: '/labtest/jczxPcrReport/query',
    method: 'get',
    params: query
  })
}

// 查询检测中心饲料报告主详细
export function getjczxPcrReportBaseId(opjczxPcrReportBaseId) {
  return request({
    url: '/labtest/jczxPcrReport/' + opjczxPcrReportBaseId,
    method: 'get'
  })
}

// 新增检测中心饲料报告主
export function Reportpcrbc(data) {
  return request({
    url: '/labtest/jczxPcrReport',
    method: 'post',
    data: data
  })
}

// 修改检测中心饲料报告主
export function updatejczxPcrReportBaseId(data) {
  return request({
    url: '/labtest/jczxPcrReport',
    method: 'put',
    data: data
  })
}
// id查询检测报告信息 制作
export function Reportsl(entrustOrderSampleId) {
  return request({

    url: '/labtest/jczxPcrReport/getMakeinfo/' + entrustOrderSampleId,
    method: 'get'
  })
}
// id查询检测报告信息保存
export function Reportslbc(data) {
  return request({
    url: '/labtest/jczxPcrReport/save',
    method: 'put',
    data: data
  })
}
// 制作后回显
export function zzhhx(opjczxPcrReportBaseId) {
  return request({
    url: '/labtest/jczxPcrReport/' + opjczxPcrReportBaseId,
    method: 'get'
  })
}
// id查询检测报告信息通过审核
export function zzhhxbc(data) {
  return request({
    url: '/labtest/jczxPcrReport/verify',
    method: 'put',
    data: data
  })
}
// id查询检测报告信息校准
export function jzcommit(data) {
  return request({
    url: '/labtest/jczxPcrReport/commit',
    method: 'put',
    data: data
  })
}
// 查询
export function INfo(query) {
  return request({
    url: '/labtest/jczxPcrReport/getInfo',
    method: 'get',
    params: query
  })
}
// 新增：审核结果接口
export function examinePcrResultBase(data) {
  return request({
    url: '/labtest/jczxPcrReport/verify',
    method: 'post',
    data: data
  })
}

// 下载PCR Excel接口
export function downloadPcrReport(opPcrEntrustOrderId, pcrTaskItemType) {
  return request({
    url: '/labtest/jczxPcrReport/downloadPcrReport',
    method: 'post',
    data: { opPcrEntrustOrderId, pcrTaskItemType },
    responseType: 'blob'
  })
}

// 发送报告
export function sendPcrReport(data) {
  return request({
    url: '/labtest/jczxPcrReport/sendPcrReport',
    method: 'post',
    data // 传递数组参数
  })
}
// 批量发送
export function sendPcrReports(data) {
  return request({
    url: '/labtest/jczxPcrReport/batchSendPcrReport',
    method: 'post',
    data // 传递数组参数
  })
}

// 获取邮箱
export function emailList(opPcrEntrustOrderId) {
  return request({
    url: '/labtest/jczxPcrReport/emailList/' + opPcrEntrustOrderId,
    method: 'get'
  })
}
// 新增：获取PCR报告详情（用于预览弹窗）
export function getReportDetail(data) {
  return request({
    url: '/labtest/jczxPcrReport/getReportDetail',
    method: 'post',
    data: data
  })
}
