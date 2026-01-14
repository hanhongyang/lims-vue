import request from '@/utils/request'

// 查询检测中心饲料报告主列表
export function listJczxFeedReportBaseId(query) {
  return request({
    url: '/labtest/jczxBloodReport/list',
    method: 'get',
    params: query
  })
}

export function queryJczxDiseaseReportBaseId(query) {
  return request({
    url: '/labtest/jczxBloodReport/diseaseQuery',
    method: 'get',
    params: query
  })
}

export function queryEarlyPregnancyReportBaseId(query) {
  return request({
    url: '/labtest/jczxBloodReport/earlyPregnancyQuery',
    method: 'get',
    params: query
  })
}

export function queryBiochemistryReportBaseId(query) {
  return request({
    url: '/labtest/jczxBloodReport/biochemistryQuery',
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
export function Reportsl(query) {
  return request({
    url: '/labtest/jczxBloodReport/getInfo',
    method: 'get',
    params: query
  })
}
// id查询检测报告信息保存
export function Reportslbc(data) {
  return request({
    url: '/labtest/jczxBloodReport',
    method: 'post',
    data: data
  })
}
// 制作后回显
export function zzhhx(query) {
  return request({
    url: '/labtest/jczxBloodReport/getInfo',
    method: 'get',
    params: query
  })
}
export function ckbg(opJczxBloodReportBaseId) {
  return request({
    url: '/labtest/jczxBloodReport/getReport/' + opJczxBloodReportBaseId,
    method: 'get'
  })
}
// id查询检测报告信息通过
export function zzhhxbc(data) {
  return request({
    url: '/labtest/jczxBloodReport/verify',
    method: 'put',
    data: data
  })
}
// id查询检测报告信息校准
export function jzcommit(data) {
  return request({
    url: '/labtest/jczxBloodReport/commit',
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
export function savePdfzy(data) {
  return request({
    url: '/labtest/jczxBloodReport/savePdfFileInfo',
    method: 'post',
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
export function sendpdfzy(data) {
  return request({
    url: '/labtest/jczxBloodReport/send',
    method: 'post',
    data: data
  })
}
// 下载早孕 Excel接口
export function downloadXyReport(data) {
  return request({
    url: '/labtest/jczxBloodReport/downloadZaoyunReportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 生化
export function downloadXyReportsh(data) {
  return request({
    url: '/labtest/jczxBloodReport/downloadBiochemistryReportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function getReportCounts(query) {
  return request({
    url: '/labtest/jczxBloodReport/getStatusCount',
    method: 'get',
    params: query // 新增这一行，将参数传递给后端
  })
}
// 获取邮箱
export function emailList(bloodEntrustOrderId) {
  return request({
    url: '/labtest/jczxBloodReport/emailList/' + bloodEntrustOrderId,
    method: 'get'
  })
}
// 一键编制
export function addAll(data) {
  return request({
    url: '/labtest/jczxBloodReport/addAll',
    method: 'post',
    data: data
  })
}
// 退回
export function zyBack(data) {
  return request({
    url: '/labtest/jczxBloodReport/zyBack',
    method: 'post',
    data: data
  })
}
