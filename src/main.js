import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import '@/assets/styles/index-extend.scss'; // global css extend
import '@/assets/styles/plansup.scss'; // global css extend
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'
// ================================================
// 【新增代码开始】引入 pako 并挂载到全局
// ================================================
import pako from 'pako'
// 强制挂载到 window 对象，这样 jsPDF 内部检查 window.pako 时就能找到了
window.pako = pako 
import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
// 禁止 Backspace 键导致页面后退
document.addEventListener('keydown', function(e) {
  // ✅ 使用 e.key 替代已弃用的 e.keyCode
  if (e.key === 'Backspace') {
    const target = e.target || e.srcElement
    const tagName = target.tagName.toUpperCase()
    
    // 允许的输入类型
    const allowedInputTypes = [
      'TEXT', 'PASSWORD', 'FILE', 'SEARCH', 
      'EMAIL', 'NUMBER', 'DATE', 'TEL', 'URL'
    ]
    
    // 判断是否是可编辑元素
    const isInput = tagName === 'INPUT' && 
                    allowedInputTypes.includes((target.type || '').toUpperCase())
    const isTextarea = tagName === 'TEXTAREA'
    const isContentEditable = target.isContentEditable
    
    const isEditable = isInput || isTextarea || isContentEditable
    
    // 如果是只读或禁用状态，也要阻止
    if (isEditable && (target.readOnly || target.disabled)) {
      e.preventDefault()
      return false
    }
    
    // 如果不是可编辑元素，阻止默认行为
    if (!isEditable) {
      e.preventDefault()
      return false
    }
  }
})