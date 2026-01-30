## 开发


```bash
# 克隆项目
git clone https://gitee.com/y_project/RuoYi-Vue

# 进入项目目录
cd ruoyi-ui

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev
```

浏览器访问 http://localhost:80

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```
# LIMS 实验室信息管理系统 (Vue前端)

## 📖 项目简介

本项目是一套基于 **Vue.js** + **Element UI** 开发的实验室信息管理系统（LIMS）。该系统在 [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) 的基础上进行了深度的业务定制，主要服务于农牧行业的质量检测与管理流程。

系统实现了从样品登记、任务分配、实验检测、报告生成到数据分析的全流程数字化管理，涵盖中心化验室、牧场、饲料厂及奶源等多个业务场景。

## 🛠 技术栈

| 技术 | 说明 | 官网/版本 |
| :--- | :--- | :--- |
| **Vue** | 前端框架 | [Vue 2.6.x](https://cn.vuejs.org/) |
| **Vuex** | 状态管理 | [Vuex 3.x](https://vuex.vuejs.org/zh/) |
| **Vue Router** | 路由管理 | [Vue Router 3.x](https://router.vuejs.org/zh/) |
| **Element UI** | UI 组件库 | [Element UI 2.15.x](https://element.eleme.cn/) |
| **Axios** | HTTP 请求库 | [Axios](http://www.axios-js.com/) |
| **ECharts** | 数据可视化 | [Apache ECharts](https://echarts.apache.org/) |
| **Hiprint** | 打印插件 | 用于生成实验报告和条码打印 |
| **JsBarcode** | 条形码生成 | 用于样品标签生成 |
| **Sass** | CSS 预处理器 | SCSS |

## 📦 核心功能模块

通过代码结构分析，本项目包含以下主要业务模块：

### 1. 🧪 中心化验室 (Central Laboratory)
核心业务区域，处理复杂的检测流程。
- **委托单管理**：血样、饲料、PCR、早孕等各类委托单的创建与管理。
- **任务管理**：检测任务的分配（`shTask`, `feedTask`, `pcrTask` 等）。
- **样品管理**：样品接收、流转与处理。
- **实验检测**：录入检测结果，支持多维度数据录入。
- **报告管理**：生成和打印各类检测报告（血样、饲料、PCR等）。

### 2. 🐄 牧场管理 (Ranch)
针对牧场端的特定检测需求。
- **计划管理**：检测计划的制定与接收。
- **检测任务**：牧场端的检测任务执行。
- **不合格品管理**：不合格检测结果的后续处理流程。

### 3. 🏭 饲料厂管理 (Feed Factory)
- **SAP集成**：与 SAP 系统对接相关数据。
- **检测计划**：饲料检测计划管理。
- **结果录入**：成品、原料的检测结果录入。

### 4. 🥛 奶源管理 (Milk Source)
- **车辆管理**：奶车、奶罐车管理。
- **仓库管理**：奶仓数据管理。
- **铅封记录**：运输过程中的铅封管理。

### 5. 📊 基础数据 & 系统监控
- **基础数据**：检测项目、检测方法、供应商、仓库、标准库等主数据维护。
- **系统监控**：在线用户、操作日志、定时任务监控等。
- **代码生成**：保留了若依的代码生成器工具。

## 🚀 快速开始

### 1. 环境准备
确保您的电脑已安装 [Node.js](https://nodejs.org/) (推荐 v14.x 或 v16.x) 和 git。

### 2. 克隆项目
```bash
git clone [https://github.com/hanhongyang/lims-vue.git](https://github.com/hanhongyang/lims-vue.git)
cd lims-vue

📂 目录结构说明
├── build/                  # 构建相关脚本
├── bin/                    # 执行脚本 (run-web.bat 等)
├── public/                 # 静态资源 (index.html, favicon.ico)
├── src/
│   ├── api/                # 所有请求接口，按业务模块划分
│   ├── assets/             # 静态资源 (图片、样式、图标)
│   ├── components/         # 通用组件 (Breadcrumb, FileUpload, RuoYi等)
│   ├── directive/          # 自定义指令 (权限控制等)
│   ├── layout/             # 布局组件 (Sidebar, Navbar)
│   ├── plugins/            # 插件配置 (download, modal, tab)
│   ├── router/             # 路由配置
│   ├── store/              # Vuex 状态管理
│   ├── utils/              # 工具类 (request.js, validate.js)
│   ├── views/              # 视图页面 (核心业务代码)
│   │   ├── CentralLaboratory  # 中心化验室模块
│   │   ├── Ranch              # 牧场模块
│   │   ├── Feedfactory        # 饲料厂模块
│   │   └── ...
│   ├── App.vue             # 入口组件
│   ├── main.js             # 入口文件
│   └── settings.js         # 全局配置
├── static/                 # 外部静态库 (hiprint, diagram, tinymce)
├── .env.development        # 开发环境配置
├── .env.production         # 生产环境配置
├── vue.config.js           # Vue CLI 配置 (代理、端口、别名)
└── package.json            # 项目依赖与脚本
