import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  // 考试
  // {
  //   path: '/OnlineExamcreate',
  //   component: () => import('@/views/examination/OnlineExam/create'),
  //   hidden: true
  // },
  // 大屏
  // {
  //   path: '/dataScreenranch',
  //   component: () => import('@/views/reportcenter/datascreen/dataScreenranch'),
  //   hidden: true
  // },
  // 测试
  {
    path: '/test',
    component: () => import('@/views/Test/index'),
    hidden: true
  },
  {
    path: '/testewm',
    component: () => import('@/views/TestEwm/index'),
    hidden: true
  },
  // pad
  {
    path: '/Pad',
    component: () => import('@/views/Pad/PadIndex/padrouter'),
    hidden: true
  },
  // 样品接收
  {
    path: '/ypjs',
    component: () => import('@/views/CentralLaboratory/ypjs/index'),
    hidden: true
  },
  // 样品接收详情
  {
    path: '/ypjsXq',
    component: () => import('@/views/CentralLaboratory/ypjs/indexXq'),
    hidden: true
  },
  // 检测任务
  {
    path: '/feedTaskPad',
    component: () => import('@/views/CentralLaboratory/feedTask/index'),
    hidden: true
  },
  // pad端检测任务（近红外）
  {
    path: '/JHYTaskPad',
    component: () => import('@/views/CentralLaboratory/JHYTask/index'),
    hidden: true
  },
  // 检测任务
  {
    path: '/pcrTaskPad',
    component: () => import('@/views/CentralLaboratory/pcrTask/index'),
    hidden: true
  },
  // 检测任务
  {
    path: '/bloodTaskPad',
    component: () => import('@/views/CentralLaboratory/bloodTask/index'),
    hidden: true
  },
  // 检测化验
  {
    path: '/jczxFeedResultBasePad',
    component: () => import('@/views/CentralLaboratory/sampleTest/feed/index'),
    hidden: true
  },
  // 饲料中水分检测单
  {
    name: 'JJ01Pad',
    path: '/JJ01Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ01/index'),
    hidden: true
  },
  {
    name: 'JJsfprint',
    path: '/JJsfprint',
    component: () => import('@/views/Feedproject/Cmsproject/JJ01/JJsfprint'),
    hidden: true
  },
  // 棉籽中水分检测单
  {
    name: 'JJ49Pad',
    path: '/JJ49Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ49/index'),
    hidden: true
  },
  {
    name: 'JJ49print',
    path: '/JJ49print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ49/JJ49print'),
    hidden: true
  },
  // 玉米中水分检测单
  {
    name: 'JJ48Pad',
    path: '/JJ48Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ48/index'),
    hidden: true
  },
  {
    name: 'JJ48print',
    path: '/JJ48print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ48/JJ48print'),
    hidden: true
  },
  // 饲料中初水分
  {
    name: 'JJ15Pad',
    path: '/JJ15Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ15/index'),
    hidden: true
  },
  // 饲料中初水分
  {
    name: 'JJ15print',
    path: '/JJ15print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ15/JJ15print'),
    hidden: true
  },
  // 饲料中粗蛋白
  {
    name: 'JJ02Pad',
    path: '/JJ02Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ02/index'),
    hidden: true
  },
  {
    name: 'JJ02print',
    path: '/JJ02print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ02/JJ02print'),
    hidden: true
  },
  // 饲料中粗灰分
  {
    name: 'JJ03Pad',
    path: '/JJ03Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ03/index'),
    hidden: true
  },
  {
    name: 'JJ03print',
    path: '/JJ03print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ03/JJ03print'),
    hidden: true
  },
  // 饲料中粗脂肪
  {
    name: 'JJ04Pad',
    path: '/JJ04Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ04/index'),
    hidden: true
  },
  {
    name: 'JJ04print',
    path: '/JJ04print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ04/JJ04print'),
    hidden: true
  },
  // 饲料中中性洗涤纤维
  {
    name: 'JJ06Pad',
    path: '/JJ06Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ06/index'),
    hidden: true
  },
  {
    name: 'JJ06print',
    path: '/JJ06print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ06/JJ06print'),
    hidden: true
  },
  // 饲料中酸性洗涤纤维
  {
    name: 'JJ07Pad',
    path: '/JJ07Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ07/index'),
    hidden: true
  },
  {
    name: 'JJ07print',
    path: '/JJ07print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ07/JJ07print'),
    hidden: true
  },
  // 饲料中钙
  {
    name: 'JJ08Pad',
    path: '/JJ08Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ08/index'),
    hidden: true
  },
  {
    name: 'JJ08print',
    path: '/JJ08print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ08/JJ08print'),
    hidden: true
  },
  // 饲料中磷
  {
    name: 'JJ10Pad',
    path: '/JJ10Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ10/index'),
    hidden: true
  },
  {
    name: 'JJ10print',
    path: '/JJ10print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ10/JJ10print'),
    hidden: true
  },
  // 饲料中粗纤维
  {
    name: 'JJ14Pad',
    path: '/JJ14Pad',
    component: () => import('@/views/Feedproject/Cmsproject/JJ14/index'),
    hidden: true
  },
  {
    name: 'JJ14print',
    path: '/JJ14print',
    component: () => import('@/views/Feedproject/Cmsproject/JJ14/JJ14print'),
    hidden: true
  },
  // 饲料中水溶性氯化物
  {
    name: 'JJ13Pad',
    path: '/JJ13Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ13/index'),
    hidden: true
  },
  {
    name: 'JJ13print',
    path: '/JJ13print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ13/JJ13print'),
    hidden: true
  },
  // 饲料中黄曲毒素B₁（AFB₁）
  {
    name: 'JJ11Pad',
    path: '/JJ11Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ11/index'),
    hidden: true
  },
  {
    name: 'JJ11print',
    path: '/JJ11print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ11/JJ11print'),
    hidden: true
  },
  // 饲料中呕吐毒素(DON)
  {
    name: 'JJ51Pad',
    path: '/JJ51Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ51/index'),
    hidden: true
  },
  {
    name: 'JJ51print',
    path: '/JJ51print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ51/JJ51print'),
    hidden: true
  },

  // 饲料中WSC
  {
    name: 'JJ54Pad',
    path: '/JJ54Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ54/index'),
    hidden: true
  },
  {
    name: 'JJ54print',
    path: '/JJ54print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ54/JJ54print'),
    hidden: true
  },
  // 饲料中黄曲毒素(AFB₁)
  {
    name: 'JJ53Pad',
    path: '/JJ53Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ53/index'),
    hidden: true
  },
  {
    name: 'JJ53print',
    path: '/JJ53print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ53/JJ53print'),
    hidden: true
  },
  // 饲料中玉米赤霉烯酮(ZEN)
  {
    name: 'JJ18Pad',
    path: '/JJ18Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ18/index'),
    hidden: true
  },
  {
    name: 'JJ18print',
    path: '/JJ18print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ18/JJ18print'),
    hidden: true
  },
  // 饲料中三聚氰胺
  {
    name: 'JJ17Pad',
    path: '/JJ17Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ17/index'),
    hidden: true
  },
  {
    name: 'JJ17print',
    path: '/JJ17print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ17/JJ17print'),
    hidden: true
  },
  // 饲料中赭曲霉毒素(0A)
  {
    name: 'JJ19Pad',
    path: '/JJ19Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ19/index'),
    hidden: true
  },
  {
    name: 'JJ19print',
    path: '/JJ19print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ19/JJ19print'),
    hidden: true
  },
  // 饲料添加剂碳酸氢钠总碱量
  {
    name: 'JJ55Pad',
    path: '/JJ55Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ55/index'),
    hidden: true
  },
  {
    name: 'JJ55print',
    path: '/JJ55print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ55/JJ55print'),
    hidden: true
  },
  // 饲料中淀粉糊化度
  {
    name: 'JJ20Pad',
    path: '/JJ20Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ20/index'),
    hidden: true
  },
  {
    name: 'JJ20print',
    path: '/JJ20print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ20/JJ20print'),
    hidden: true
  },
  // 饲料中淀粉测定(双酶法)
  {
    name: 'JJ47Pad',
    path: '/JJ47Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ47/index'),
    hidden: true
  },
  {
    name: 'JJ47print',
    path: '/JJ47print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ47/JJ47print'),
    hidden: true
  },
  // 饲料检测报告
  {
    path: '/reportgensl',
    component: () => import('@/views/reportconsole/reportgensl'),
    hidden: true
  },
  // 血样检测报告
  {
    path: '/reportgenxy',
    component: () => import('@/views/reportconsole/reportgenxy'),
    hidden: true
  },
  // 结核检测报告
  {
    path: '/reportgenjh',
    component: () => import('@/views/reportconsole/reportgenjh'),
    hidden: true
  },
  // 结核抗体报告
  {
    path: '/reportgenjhkt',
    component: () => import('@/views/reportconsole/reportgenjhkt'),
    hidden: true
  },
  // 口蹄疫报告
  {
    path: '/reportgenkty',
    component: () => import('@/views/reportconsole/reportgenkty'),
    hidden: true
  },
  // BVDV报告
  {
    path: '/reportgenBVDV',
    component: () => import('@/views/reportconsole/reportgenBVDV'),
    hidden: true
  },
  // 副结核报告
  {
    path: '/reportgenfjh',
    component: () => import('@/views/reportconsole/reportgenfjh'),
    hidden: true
  },
  // 早孕报告
  {
    path: '/reportgenzy',
    component: () => import('@/views/reportconsole/reportgenzy'),
    hidden: true
  },
  // 生化报告
  {
    path: '/reportgensh',
    component: () => import('@/views/reportconsole/reportgensh'),
    hidden: true
  },
  // 打印预览
  {
    path: '/dyylprintSl',
    component: () => import('@/views/CentralLaboratory/feedEntrustOrder/dyylprintSl'),
    hidden: true
  },
  {
    path: '/dyylprint',
    component: () => import('@/views/CentralLaboratory/feedEntrustOrderPrint/dyylprint'),
    hidden: true
  },
  {
    path: '/dyylprintPcr',
    component: () => import('@/views/CentralLaboratory/pcrEntrustOrder/dyylprintPcr'),
    hidden: true
  },
  {
    path: '/dyylprintXy',
    component: () => import('@/views/CentralLaboratory/bloodEntrustOrder/dyylprintXy'),
    hidden: true
  },
  {
    path: '/dyylprintZy',
    component: () => import('@/views/CentralLaboratory/bloodEntrustOrder/dyylprintZy'),
    hidden: true
  },
  {
    path: '/dyylprintSh',
    component: () => import('@/views/CentralLaboratory/bloodEntrustOrder/dyylprintSh'),
    hidden: true
  },
  // 饲料厂质检模板
  {
    path: '/slcMB1',
    component: () => import('@/views/Feedfactory/cp/moban/moban1'),
    hidden: true
  },
  {
    path: '/slcMB2',
    component: () => import('@/views/Feedfactory/cp/moban/moban2'),
    hidden: true
  },
  // 近红外化验
  {
    name: 'JHYPad',
    path: '/JHYPad',
    component: () => import('@/views/Feedproject/JHY/index'),
    hidden: true
  },
  // 样品化验（近红外）
  {
    path: '/JHYResultPad',
    component: () => import('@/views/CentralLaboratory/JHYTask/indexHY'),
    hidden: true
  },
  // 玉米中容重
  {
    name: 'JJ50Pad',
    path: '/JJ50Pad',
    component: () => import('@/views/Feedproject/notCmsproject/JJ50/index'),
    hidden: true
  },
  {
    name: 'JJ50print',
    path: '/JJ50print',
    component: () => import('@/views/Feedproject/notCmsproject/JJ50/JJ50print'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index/:jobId(\\d+)',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
const routerPush = Router.prototype.push
const routerReplace = Router.prototype.replace
// push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}
// replace
Router.prototype.replace = function push(location) {
  return routerReplace.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
