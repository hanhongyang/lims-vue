import request from '@/utils/request'

// 查询检测中心饲料报告主列表
export function listJczxFeedReportBaseId(query) {
  return request({
    url: '/labtest/jczxFeedReport/list',
    method: 'get',
    params: query
  })
}

export function queryJczxFeedReportBaseId(query) {
  return request({
    url: '/labtest/jczxFeedReport/query',
    method: 'get',
    params: query
  })
}

// 查询检测中心饲料报告主详细
export function getJczxFeedReportBaseId(opJczxFeedReportBaseId) {
  return request({
    url: '/labtest/jczxFeedReport/' + opJczxFeedReportBaseId,
    method: 'get'
  })
}

// 新增检测中心饲料报告主
export function addJczxFeedReportBaseId(data) {
  return request({
    url: '/labtest/jczxFeedReport',
    method: 'post',
    data: data
  })
}

// 修改检测中心饲料报告主
export function updateJczxFeedReportBaseId(data) {
  return request({
    url: '/labtest/jczxFeedReport',
    method: 'put',
    data: data
  })
}
// id查询检测报告信息 制作
export function Reportsl(entrustOrderSampleId) {
  return request({

    url: '/labtest/jczxFeedReport/getMakeinfo/' + entrustOrderSampleId,
    method: 'get'
  })
}
// id查询检测报告信息保存
export function Reportslbc(data) {
  return request({
    url: '/labtest/jczxFeedReport/save',
    method: 'put',
    data: data
  })
}
// 一键编制 (新增)
export function addAllFeedReport(data) {
  return request({
    url: '/labtest/jczxFeedReport/addAll',
    method: 'post',
    data: data
  })
}
// 制作后回显
export function zzhhx(opJczxFeedReportBaseId) {
  return request({
    url: '/labtest/jczxFeedReport/' + opJczxFeedReportBaseId,
    method: 'get'
  })
}
export function ckbg(opJczxFeedReportBaseId) {
  return request({
    url: '/labtest/jczxFeedReport/getReport/' + opJczxFeedReportBaseId,
    method: 'get'
  })
}
// id查询检测报告信息通过
export function zzhhxbc(data) {
  return request({
    url: '/labtest/jczxFeedReport/verify',
    method: 'put',
    data: data
  })
}
// id查询检测报告信息校准
export function jzcommit(data) {
  return request({
    url: '/labtest/jczxFeedReport/commit',
    method: 'put',
    data: data
  })
}
export function savePdf(data) {
  return request({
    url: '/labtest/jczxFeedReport/savePdf',
    method: 'put',
    data: data
  })
}
export function sendpdf(data) {
  return request({
    url: '/labtest/jczxFeedReport/send',
    method: 'post',
    data: data
  })
}
// 获取邮箱
export function emailList(feedEntrustOrderId) {
  return request({
    url: '/labtest/jczxFeedReport/emailList/' + feedEntrustOrderId,
    method: 'get'
  })
}
export function getReportCounts() {
  return request({
    url: '/labtest/jczxFeedReport/getStatusCount',
    method: 'get'
  })
}
export function getResultBySampleNo(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/getResultBySampleNo',
    method: 'post',
    data: data
  })
}
export function getResultBySampleNo2(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/getResultBySampleNo2',
    method: 'post',
    data: data
  })
}
export function ZfReport(data) {
  return request({
    url: '/labtest/jczxFeedReport/invalidateReport',
    method: 'post',
    data: data
  })
}
// 样品来源
export function receiveList(query) {
  return request({
    url: '/ranch/plan/receiveList2',
    method: 'get',
    params: query
  })
}