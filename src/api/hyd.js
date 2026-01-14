import request from '@/utils/request'
// 饲料中水分新增
export function feedwatertask(data) {
  return request({
    url: '/labtest/jczxFeedResultBase',
    method: 'post',
    data: data
  })
}
// 饲料中水分修改
export function feedwatertaskUp(data) {
  return request({
    url: '/labtest/jczxFeedResultBase',
    method: 'put',
    data: data
  })
}
// 饲料中水分增加项目
export function listTask(query) {
  return request({
    url: '/labtest/task/list',
    method: 'get',
    params: query
  })
}
// 饲料中水分上传
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data
  })
}

// 校对接口
export function saveCheck(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/saveCheck',
    method: 'post',
    data: data
  })
}
// 审核接口
export function saveExamine(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/saveExamine',
    method: 'post',
    data: data
  })
}

//校对
export function JD(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/saveCheck',
    method: 'post',
    data: data
  })
}
// 下载图片
export function XZPic(query) {
  return request({
    url: '/file/download/'+query,
    method: 'get',
    // params: query,
    responseType: 'blob'
  })
}
// 初水分化验
export function csfhy(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/getCsfInfoBySampleList/',
    method: 'post',
    data: data
  })
}
export function csfhyJHY(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/getJhwCsfInfoBySampleList/',
    method: 'post',
    data: data
  })
}


// 复测
export function retest(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/retest/',
    method: 'post',
    data: data
  })
}
// 近红外复测
export function jhwRetest(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/jhwRetest/',
    method: 'post',
    data: data
  })
}

// 复测
export function testSubmit(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/testSubmit',
    method: 'post',
    data: data
  })
}
// 获取用户当前登录信息
export function usersign(query) {
  return request({
    url: '/system/user/sign',
    method: 'get',
    params: query
  })
}
// 饲料中近红外新增
export function addjhw(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/addjhw',
    method: 'post',
    data: data
  })
}
// 饲料中近红外修改
export function editJhw(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/editJhw',
    method: 'put',
    data: data
  })
}
//校对退回
export function backToSubmit(data) {
  return request({
    url: '/labtest/jczxFeedResultBase/backToSubmit',
    method: 'post',
    data: data
  })
}
