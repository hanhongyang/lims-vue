<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回首页</el-button>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待提交" name="1">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="100px"
        >

          <el-form-item label="化验单号" prop="resultNo">
            <el-input
              v-model="queryParams.resultNo"
              placeholder="请输入化验单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测人" prop="testUser">
            <el-input
              v-model="queryParams.testUser"
              placeholder="请输入检测人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测完成时间">
            <el-date-picker
              v-model="queryParams.daterangeTestEndTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="jczxFeedResultBaseList" :height="tableHeight">
          <el-table-column label="化验单号" align="center" prop="resultNo" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="检测人" align="center" prop="testUser" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_result_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="检测日期" align="center" prop="testDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测完成时间" align="center" prop="testEndTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testEndTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-upload2"
                @click="handleUpdate(scope.row)"
              >详情</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-upload2" @click="handleUpdate(scope.row)"
                                >提交</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane label="待校对" name="2">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="化验单号" prop="resultNo">
            <el-input
              v-model="queryParams.resultNo"
              placeholder="请输入化验单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测人" prop="testUser">
            <el-input
              v-model="queryParams.testUser"
              placeholder="请输入检测人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测完成时间">
            <el-date-picker
              v-model="queryParams.daterangeTestEndTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="jczxFeedResultBaseList" :height="tableHeight">
          <el-table-column label="化验单号" align="center" prop="resultNo" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="检测人" align="center" prop="testUser" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_result_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="检测日期" align="center" prop="testDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测完成时间" align="center" prop="testEndTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testEndTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-check" @click="handleUpdate(scope.row)"
                                >校对</el-button> -->
              <el-button
                v-if="authorizedCheckUser === currentUserName"
                size="mini"
                type="text"
                icon="el-icon-check"
                @click="handleUpdate(scope.row)"
              >校对</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-info"
                @click="handleXq(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane label="已校对" name="3">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="化验单号" prop="resultNo">
            <el-input
              v-model="queryParams.resultNo"
              placeholder="请输入化验单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测人" prop="testUser">
            <el-input
              v-model="queryParams.testUser"
              placeholder="请输入检测人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="校对人" prop="checkUser">
            <el-input
              v-model="queryParams.checkUser"
              placeholder="请输入校对人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测完成时间">
            <el-date-picker
              v-model="queryParams.daterangeTestEndTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="jczxFeedResultBaseList" :height="tableHeight">
          <el-table-column label="化验单号" align="center" prop="resultNo" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="检测人" align="center" prop="testUser" />
          <el-table-column label="校对人" align="center" prop="checkUser" />
          <el-table-column label="检测日期" align="center" prop="testDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测完成时间" align="center" prop="testEndTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testEndTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!--<el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)"
                                >详情</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-info"
                @click="handleXq(scope.row)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { listJczxFeedResultBase, getJczxFeedResultBaseJHW, listJhw } from '@/api/CentralLaboratory/sampleTest'
import { getConfigKey } from '@/api/system/config'
export default {
  name: 'JczxFeedResultBase',
  dicts: ['result_add_type', 'feed_result_status'],
  data() {
    return {
      // 激活的Tab页
      activeTab: '1',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 检测中心饲料检测结果基础表格数据
      jczxFeedResultBaseList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sampleNo: null,
        entrustOrderOrderNo: null,
        resultNo: null,
        testUser: null,
        // status: '1', // 默认状态为'1' (待提交)
        statusList: '1,6', // 开始化验和校对退回
        checkUser: null,
        checkTime: null,
        // examineUser: null, // 已移除
        testDate: null,
        testEndTime: null,
        daterangeTestEndTime: [],
        beginTestEndTime: null,
        endTestEndTime: null
      },
      isPad: true,
      tableHeight: window.innerHeight - 300, // 留出头、查询区、分页高度
      // 新增：用于存储从后端查回来的校对人用户名配置
      authorizedCheckUser: ''
    }
  },
  computed: {
    tableMaxHeight() {
      return this.isPad ? 300 : 1000
    },
    // 新增：获取当前登录用户的用户名
    currentUserName() {
      // 若依框架默认将用户名存储在这里
      return this.$store.state.user.name
    }
  },
  created() {
    const tabName = this.$route.query.tab || '1'
    this.handleTabClick({ name: tabName })
    this.getCheckUserConfig()
  },

  mounted() {
    this.isPadPc()
    // this.setBodyHeight();
    window.addEventListener('resize', () => {
      this.tableHeight = window.innerHeight - 280
    })
  },
  methods: {
    /** Tab页点击事件 */
    handleTabClick(tab) {
      this.activeTab = tab.name
      this.handleQuery() // 切换Tab时，清空非通用查询条件并重新查询
    },
    setBodyHeight() {
      // 给 <html> 挂类，方便 scoped 样式穿透
      if (this.isPad) {
        document.documentElement.classList.add('is-pad')
        document.body.style.height = '99%'
      } else {
        document.documentElement.classList.remove('is-pad')
        document.body.style.height = ''
      }
    },
    isPadPc() {
      // 使用若依的设备检测
      const device = this.$store.state.app.device
      // 检测是否为华为平板
      if (this.isHuaweiPad()) {
        console.log('华为')
        this.isPad = true
      } else if (this.isPADDevice()) {
        console.log('Pad')
        this.isPad = true
      } else {
        console.log('PC')
        this.isPad = false
      }
    },
    HDPada() {
      this.$router.push('/Pad')
    },
    /** 通用平板检测 */
    isPADDevice() {
      const userAgent = navigator.userAgent.toLowerCase()
      const isiPad = /ipad/.test(userAgent)
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent)
      const isWindowsTablet = /windows/.test(userAgent) && /touch/.test(userAgent)

      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const isTabletSize = (screenWidth >= 768 && screenWidth <= 1024) ||
                (screenHeight >= 768 && screenHeight <= 1024)

      return isiPad || isAndroidTablet || isWindowsTablet || isTabletSize
    },
    /** 专门检测华为平板 */
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase()

      // 华为平板特征检测
      const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent)
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent)

      // 屏幕尺寸检测（华为平板典型尺寸）
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
                (screenHeight >= 768 && screenHeight <= 1600)

      // 华为平板特有特征
      const hasEMUI = /emui/.test(userAgent)
      const isHuaweiPad = (isHuawei && isAndroidTablet) ||
                (isHuawei && isHuaweiTabletSize) ||
                (hasEMUI && isAndroidTablet)

      return isHuaweiPad
    },
    /** 查询检测中心饲料检测结果基础列表 */
    getList() {
      this.loading = true

      // 关键：设置当前Tab的状态
      // this.queryParams.status = this.activeTab;

      // 1. 构造请求参数（复制queryParams，排除daterangeTestEndTime）
      const requestParams = { ...this.queryParams }
      delete requestParams.daterangeTestEndTime // 关键：删除旧的日期数组参数，不传给后端

      if (this.activeTab === '1') {
        // 待提交 Tab：使用 statusList 查询 (1=开始化验, 6=校对退回)
        requestParams.status = null // 清空单状态，防止后端混淆
        requestParams.statusList = '1,6'
      } else {
        // 待校对('2') 和 已校对('3') Tab：使用 activeTab 作为单状态查询
        requestParams.status = this.activeTab
        requestParams.statusList = null // 清空列表状态
      }

      // 2. 给请求参数的begin/end赋值（从日期选择器的数组中取）
      if (this.queryParams.daterangeTestEndTime && this.queryParams.daterangeTestEndTime.length === 2) {
        requestParams.beginTestEndTime = this.queryParams.daterangeTestEndTime[0] // 新参数1
        requestParams.endTestEndTime = this.queryParams.daterangeTestEndTime[1]   // 新参数2
      } else {
        // 日期清空时，确保参数也为空（避免残留旧值）
        requestParams.beginTestEndTime = null
        requestParams.endTestEndTime = null
      }

      // 3. 调用接口时传处理后的requestParams，而非原queryParams
      listJhw(requestParams).then(response => {
        this.jczxFeedResultBaseList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      // 1. 重置当前激活的Tab页的表单
      // Vue会智能地将 this.$refs.queryForm 指向当前激活的Tab页中的表单
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields()
      }

      // 2. 手动清空日期选择器
      this.queryParams.daterangeTestEndTime = []
      // 3. 重置日期查询参数
      this.queryParams.beginTestEndTime = null
      this.queryParams.endTestEndTime = null
      // 4. 重置页码
      this.queryParams.pageNum = 1
      // 5. 执行查询
      this.handleQuery()
    },

    /** 导出按钮操作 */
    handleExport() {
      // 确保导出的参数与当前查询一致
      const exportParams = { ...this.queryParams }
      delete exportParams.daterangeTestEndTime
      if (this.queryParams.daterangeTestEndTime && this.queryParams.daterangeTestEndTime.length === 2) {
        exportParams.beginTestEndTime = this.queryParams.daterangeTestEndTime[0]
        exportParams.endTestEndTime = this.queryParams.daterangeTestEndTime[1]
      }

      this.download('labtest/jczxFeedResultBase/export', exportParams,
        `jczxFeedResultBase_${new Date().getTime()}.xlsx`)
    },
    handleUpdate(row) {
      console.log(row, '当前行数据')
      // 需要调取详情后再跳转
      getJczxFeedResultBaseJHW(row.opJczxFeedResultBaseId).then(res => {
        this.$router.push({
          name: 'JHYPad',
          params: {
            SjtaskInfo: res.data, // 直接传递对象
            isRev: false
          }
        })
      })
    },
    handleXq(row) {
      console.log(row, '当前行数据')
      // 需要调取详情后再跳转
      getJczxFeedResultBaseJHW(row.opJczxFeedResultBaseId).then(res => {
        this.$router.push({
          name: 'JHYPad',
          params: {
            SjtaskInfo: res.data, // 直接传递对象
            isJCRY: true
          }
        })
      })
    },
    /** 新增：获取近红外校对人配置 */
    getCheckUserConfig() {
      getConfigKey('jhw_check_user_name').then(response => {
        // 若依后端通常将参数值放在 msg 字段中返回
        this.authorizedCheckUser = response.msg
      })
    }

  }
}
</script>
<style lang="scss" scoped>
/* 基础样式 */
html,
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    /* 禁用横向滚动 */
}

.app-container {
    height: 100vh;
    width: 100vw;
    overflow: auto;
    padding: 0 15px;
    margin: 0px 0px 0 !important;
}

/* 平板设备特定样式 */
@media (max-width: 1024px) {
    .app-container {

        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;

        /* 调整表格高度 */
        .el-table {
            max-height: calc(100vh - 280px);
        }
    }
}

.el-tabs {
    min-width: 1024px;
    max-width: 1680px;
}

/* 通用表格样式 */
.el-table {
    max-height: 610px;

    overflow: auto;

    &::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
}
</style>
