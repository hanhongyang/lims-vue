import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

// 查询部门详细
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

// 查询当前用户部门详细
export function getLoginUserDept() {
  return request({
    url: '/system/dept/getLoginUserDept/',
    method: 'get'
  })
}

// 查询当前用户部门详细（包含子部门）
export function getLoginUserDeptAndChildren() {
  return request({
    url: '/system/dept/getLoginUserDeptAndChildren',
    method: 'get'
  })
}

// 查询部门联系方式
export function getDeptContactInfoByDeptId(deptId) {
  return request({
    url: '/basicdata/contact/getInfoByDeptId/' + deptId,
    method: 'get'
  })
}
// 新增部门
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

// 修改部门
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

// 删除部门
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
