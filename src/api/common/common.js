import request from '@/utils/request'
// 上传
export function upload(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 通用文件上传
export function uploadAndGetFileId(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function uploadAndGetFileIds(data) {
  return request({
    url: '/file/uploads',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 通用文件上传
export function uploadPCR(data) {
  return request({
    url: '/labtest/jczxFeedReport/send',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 文件下载 - 返回文件流
export function downloadFile(fileId) {
  return request({
    url: `/file/download/${fileId}`,
    method: 'get',
    responseType: 'blob' // 重要：指定响应类型为blob
  })
}

// 文件预览
export function previewFile(fileId) {
  return request({
    url: `/file/preview/${fileId}`,
    method: 'get'
  })
}
// excel文件预览
export function previewExcel(fileId) {
  return request({
    url: `/file/previewExcel/${fileId}`,
    method: 'get'
  })
}
// 删除文件
export function deleteFile(fileId) {
  return request({
    url: `/file/${fileId}`,
    method: 'delete'
  })
}

/**
 * (新) 上传文件并返回 FileId 和 Url
 * (对应 FileController.java 的 /file/uploadAndGetUrl)
 */
export function uploadAndGetUrl(formData) {
  return request({
    url: '/file/uploadAndGetUrl', // 匹配您后端的 URL
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
    // headers: { 'Content-Type': 'multipart/form-data' } // request 拦截器通常会自动处理
  })
}