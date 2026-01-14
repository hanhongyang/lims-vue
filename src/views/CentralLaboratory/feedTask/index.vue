<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回首页</el-button>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane :label="'化学法(' + tabCounts.chemistry + ')'" name="chemistry">
        <el-form
          v-show="showSearch"
          ref="queryFormChem"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="检测项目" prop="itemName">
            <el-input
              v-model="queryParams.itemName"
              placeholder="请输入检测项目"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料" prop="invbillName">
            <el-input
              v-model="queryParams.invbillName"
              placeholder="请输入物料"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input
              v-model="queryParams.entrustOrderNo"
              placeholder="请输入委托单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间" prop="receiveTimeRange">
            <el-date-picker
              v-model="queryParams.receiveTimeRange"
              clearable
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="!jcList.length || !isSame || beginTestLoading"
              @click="beginTest"
            >开始化验</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['labtest:task:begin']"
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table
          ref="chemTable"
          v-loading="loading"
          :data="taskList"
          :height="tableHeight"
          row-key="entrustOrderItemId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" :selectable="canSelect" reserve-selection />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <!-- <el-table-column label="物料" align="center" prop="invbillName" /> -->
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="检测项目" align="center" prop="itemName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收人" align="center" prop="receiverName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" />
          <el-table-column label="初水分化验状态" align="center" prop="primaryMoistureStatus">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.primaryMoistureStatus === '已校对'" type="success">{{ scope.row.primaryMoistureStatus
              }}</el-tag>
              <el-tag v-else-if="scope.row.primaryMoistureStatus === '无初水分'" type="info">{{
                scope.row.primaryMoistureStatus }}</el-tag>
              <el-tag v-else-if="scope.row.primaryMoistureStatus === '已化验'" type="warning">{{
                scope.row.primaryMoistureStatus }}</el-tag>
              <el-tag v-else type="danger">{{ scope.row.primaryMoistureStatus }}</el-tag>
            </template>
          </el-table-column>
          <!--   <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTestSingle(scope.row)"
                v-hasPermi="['labtest:task:begin']">开始化验</el-button>

            </template>
</el-table-column>-->
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          class="pagin"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane :label="'初水分(' + tabCounts.csf + ')'" name="csf">
        <el-form
          v-show="showSearch"
          ref="queryFormCsf"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <!-- <el-form-item label="检测人" prop="testUser">
            <el-input v-model="queryParams.testUser" placeholder="请输入检测人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>-->
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料" prop="invbillName">
            <el-input
              v-model="queryParams.invbillName"
              placeholder="请输入物料"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input
              v-model="queryParams.entrustOrderNo"
              placeholder="请输入委托单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间" prop="receiveTimeRange">
            <el-date-picker
              v-model="queryParams.receiveTimeRange"
              clearable
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              :disabled="!jcList.length || !isSame || beginTestLoading"
              :loading="beginTestLoading"
              @click="beginTest"
            >开始化验</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-hasPermi="['labtest:task:begin']"
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出</el-button>
          </el-col>
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table
          ref="csfTable"
          v-loading="loading"
          :data="taskList"
          :height="tableHeight"
          row-key="entrustOrderItemId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" :selectable="canSelect" reserve-selection />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <!-- <el-table-column label="物料" align="center" prop="invbillName" /> -->
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="检测项目" align="center" prop="itemName" />
          <!--<el-table-column label="检测人" align="center" prop="testUser" />-->
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收人" align="center" prop="receiverName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" />
          <!--    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTestSingle(scope.row)"
                v-hasPermi="['labtest:task:begin']">开始化验</el-button>

            </template>
          </el-table-column>-->
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          class="pagin"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane :label="'待提交(' + tabCounts.pending + ')'" name="1">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="DTJqueryParams"
          size="small"
          :inline="true"
          label-width="100px"
        >
          <el-form-item label="检测项目" prop="itemName">
            <el-input
              v-model="DTJqueryParams.itemName"
              placeholder="请输入检测项目"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="化验单号" prop="resultNo">
            <el-input
              v-model="DTJqueryParams.resultNo"
              placeholder="请输入化验单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测人" prop="testUser">
            <el-input
              v-model="DTJqueryParams.testUser"
              placeholder="请输入检测人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="检测完成时间">
            <el-date-picker
              v-model="DTJqueryParams.daterangeTestEndTime"
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
          <el-table-column label="检测项目" align="center" prop="itemName" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="检测人" align="center" prop="testUser" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_result_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检测完成时间" align="center" prop="testEndTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.testEndTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-upload2" @click="handleUpdate(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="DTJqueryParams.pageNum"
          :limit.sync="DTJqueryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
      <!--<el-tab-pane label="近红外" name="nir">
        <el-form :model="queryParams" ref="queryFormNir" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="检测项目" prop="itemName">
            <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="接收时间" prop="receiveTimeRange">
            <el-date-picker clearable v-model="queryParams.receiveTimeRange" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange" ref="nirTable"
          :height="tableHeight">
          <el-table-column type="selection" width="55" align="center" :selectable="canSelect" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="检测项目" align="center" prop="itemName" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="接收人" align="center" prop="receiverName" />
          <el-table-column label="报告" align="center" prop="fileId" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.fileId">
                <el-button size="mini" type="text" icon="el-icon-view"
                  @click="handlePreviewReport(scope.row)">预览</el-button>
                <el-button size="mini" type="text" icon="el-icon-download"
                  @click="handleDownloadReport(scope.row)">下载</el-button>
              </div>
              <span v-else>无</span>
            </template>
          </el-table-column>

          <el-table-column label="接收时间" align="center" prop="receiveTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTestSingle(scope.row)"
                v-hasPermi="['labtest:task:begin']">开始化验</el-button>

               <el-button size="mini" type="text" icon="el-icon-upload2"
                @click="handleUploadReport(scope.row)"
                v-hasPermi="['labtest:task:upload']">上传报告</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" class="pagin" />

      </el-tab-pane>
-->
    </el-tabs>

    <el-dialog
      title="上传近红外报告"
      :visible.sync="uploadReportDialogVisible"
      width="400px"
      append-to-body
      @close="closeUploadDialog"
    >
      <el-upload
        ref="uploadReport"
        :limit="1"
        :action="uploadReportActionUrl"
        :headers="uploadReportHeaders"
        :auto-upload="false"
        :before-upload="beforeUploadReport"
        :on-exceed="handleExceed"
        :on-change="handleFileChange"
        :on-error="handleUploadError"
        :http-request="handleHttpRequest"
        :file-list="reportFileList"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传1个文件，支持 pdf / doc / docx / xls / xlsx / png / jpg /
          jpeg
          格式，且不超过10MB
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUploadDialog">取 消</el-button>
        <el-button type="primary" :loading="uploadingReport" @click="submitUploadReport">确 定 上
          传</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文件预览" :visible.sync="previewVisible" width="70%" top="5vh" append-to-body>
      <div v-loading="previewLoading" style="height: 70vh; overflow: auto;">
        <img v-if="isPreviewImage && previewUrl" :src="previewUrl" style="max-width: 100%;">
        <iframe
          v-else-if="isPreviewPdf && previewUrl"
          :src="previewUrl"
          width="100%"
          height="100%"
          frameborder="0"
        />
        <div v-else-if="previewUrl === 'unsupported'" style="text-align: center; padding: 20px;">
          <p>在线预览暂不支持此文件格式，请下载后查看。</p>
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="handleDownloadReport(currentRowForUpload)"
          >点击下载</el-button>
        </div>
        <div v-else>无法加载预览</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 确保导入了 delTask 和 getTestingItemsList
import { listTask, getTask, updateTask, uploadNirReport, delTask } from '@/api/CentralLaboratory/task'
import { uploadAndGetFileId, downloadFile, previewFile } from '@/api/common/common'
import { getToken } from '@/utils/auth'
import * as XLSX from 'xlsx'
// 导入查询检测项目列表的API
import { getpagelist as getTestingItemsList } from '@/api/Basicdata/Testingitems'
import { listJczxFeedResultBase, getJczxFeedResultBase } from '@/api/CentralLaboratory/sampleTest'
export default {
  name: 'Task',
  dicts: ['result_add_type', 'feed_result_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 检测中心检测任务表格数据
      taskList: [],
      // 当前激活的Tab
      activeTab: 'chemistry', // 默认化学法
      // 查询参数 (共享)
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: null,
        testUser: null,
        sampleName: null,
        invbillName: null,
        sampleNo: null,
        entrustDeptName: null,
        entrustOrderNo: null,
        receiveTimeRange: [],
        beginReceiveTime: null,
        endReceiveTime: null,
        entrustOrderType: '1', // 1: 饲料委托单
        testMethod: '2', // 默认化学法
        queryCsf: '0' // 新增：初水分查询标识，化学法为'0'
      },
      beginTestLoading: false, // "开始化验" 按钮的 loading 状态
      // 查询初水分项目专用的查询参数
      csfItemQueryParams: {
        pageNum: 1,
        pageSize: 10, // 获取少量数据即可
        tag: '12' // 假设tag '12' 代表初水分项目
      },
      // (表单)
      form: {},
      isPad: true,
      isSame: false, // 用于标记选中的项目/物料是否一致
      tableHeight: window.innerHeight - 360,
      CCitemID: '', // 用于暂存选中的 itemId (化学法)
      CCinvbillCode: '', // 用于暂存选中的 invbillCode (化学法 & 初水分)
      jcList: [], // 选中的样品列表，传递给化验页面
      uploadReportDialogVisible: false,
      uploadingReport: false,
      reportFileList: [],
      currentRowForUpload: null,
      uploadReportHeaders: { Authorization: 'Bearer ' + getToken() },
      uploadReportActionUrl: process.env.VUE_APP_BASE_API + '/common/upload', // 实际未使用
      previewVisible: false,
      previewLoading: false,
      previewUrl: '',
      isPreviewImage: false,
      isPreviewPdf: false,
      jczxFeedResultBaseList: [],
      DTJqueryParams: {
        pageNum: 1,
        pageSize: 10,
        sampleNo: null,
        entrustOrderOrderNo: null,
        itemName: null,
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
      // 各Tab页的数量
      tabCounts: {
        chemistry: 0, // 化学法
        csf: 0, // 初水分
        pending: 0 // 待提交
      }
    }
  },
  created() {
    // 跳转页面
    const tabName = this.$route.query.tab || 'chemistry'
    this.handleTabClick({ name: tabName })

    // this.getTabCounts() // 新增：获取各Tab数量
  },
  mounted() {
    this.isPadPc()
    window.addEventListener('resize', () => {
      // 动态调整表格高度
      this.tableHeight = window.innerHeight - (this.showSearch ? 360 : 280)
    })
    this.tableHeight = window.innerHeight - (this.showSearch ? 360 : 280) // 初始化时也计算一次
  },
  methods: {
    /** 获取各Tab页的数量 */
    getTabCounts() {
      // 获取化学法数量
      listTask({
        pageNum: 1,
        pageSize: 1,
        entrustOrderType: '1',
        testMethod: '2',
        queryCsf: '0'
      }).then(res => {
        this.tabCounts.chemistry = res.total || 0
      })

      // 获取初水分数量
      listTask({
        pageNum: 1,
        pageSize: 1,
        entrustOrderType: '1',
        testMethod: '2',
        queryCsf: '1'
      }).then(res => {
        this.tabCounts.csf = res.total || 0
      })

      // 获取待提交数量 (状态 1,6)
      listJczxFeedResultBase({
        pageNum: 1,
        pageSize: 1,
        statusList: '1,6'
      }).then(res => {
        this.tabCounts.pending = res.total || 0
      })
    },
    // 获取初水分项目ID的方法
    async getCsfItemId() {
      try {
        const response = await getTestingItemsList(this.csfItemQueryParams)
        if (response.rows && response.rows.length > 0) {
          // 假设tag为'12'的项目只有一个，取第一个
          return response.rows[0].labtestItemsId
        } else {
          this.$modal.msgError('未查询到初水分项目，请在【基础数据】->【检测项目管理】中添加 tag 为 "12" 的初水分项目！')
          return null // 返回 null 表示未找到
        }
      } catch (error) {
        console.error('查询初水分项目ID失败:', error)
        this.$modal.msgError('查询初水分项目ID失败！')
        return null
      }
    },

    canSelect(row) {
      // 根据当前激活的 tab 决定是否可选
      if (this.activeTab === 'chemistry' || this.activeTab === 'csf') {
        return !row.testUser // 化学法和初水分：有检测人(testUser有值)时禁用
      } else if (this.activeTab === 'nir') {
        // 近红外：总是可选，或者根据特定逻辑判断
        return true // 假设近红外总是可选
      }
      return false // 默认不可选
    },
    setBodyHeight() {
      if (this.isPad) {
        document.documentElement.classList.add('is-pad')
        document.body.style.height = '97%'
      } else {
        document.documentElement.classList.remove('is-pad')
        document.body.style.height = '97%'
      }
    },
    isPadPc() {
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
      this.setBodyHeight()
    },
    HDPada() {
      this.$router.push('/Pad')
    },
    getList() {
      this.loading = true

      if (this.activeTab === '1') {
        // 待提交 Tab
        listJczxFeedResultBase(this.DTJqueryParams).then(response => {
          this.jczxFeedResultBaseList = response.rows
          this.total = response.total
          this.loading = false

          // ★★★ 直接更新当前Tab的数量为查询结果数量 ★★★
          this.tabCounts.pending = response.total || 0
        })
      } else if (this.activeTab === 'chemistry') {
        // 化学法 Tab
        listTask(this.queryParams).then(response => {
          const rows = response.rows || []
          rows.forEach(item => {
            if (item.isRetest === '1') {
              item.sampleNo = `${item.sampleNo}（复检）`
            }
          })
          this.taskList = rows
          this.total = response.total
          this.loading = false

          // ★★★ 直接更新当前Tab的数量为查询结果数量 ★★★
          this.tabCounts.chemistry = response.total || 0
        }).catch(() => {
          this.loading = false
        })
      } else if (this.activeTab === 'csf') {
        // 初水分 Tab
        listTask(this.queryParams).then(response => {
          const rows = response.rows || []
          rows.forEach(item => {
            if (item.isRetest === '1') {
              item.sampleNo = `${item.sampleNo}（复检）`
            }
          })
          this.taskList = rows
          this.total = response.total
          this.loading = false

          // ★★★ 直接更新当前Tab的数量为查询结果数量 ★★★
          this.tabCounts.csf = response.total || 0
        }).catch(() => {
          this.loading = false
        })
      }
    },
    handleTabClick(tab) {
      this.activeTab = tab.name
      if (tab.name === 'nir') {
        this.queryParams.testMethod = '1'
        this.queryParams.queryCsf = null // 近红外不需要queryCsf
      } else if (tab.name === 'chemistry') {
        this.queryParams.testMethod = '2'
        this.queryParams.queryCsf = '0' // 化学法
      } else if (tab.name === 'csf') {
        this.queryParams.testMethod = '2' // 初水分也属于化学法范畴，但有特殊标识
        this.queryParams.queryCsf = '1' // 初水分
      } else if (tab.name === '1') {
        this.queryParams.testMethod = '3' // 报告
      }
      // 【清空共享的查询条件】
      this.queryParams.itemName = null
      this.queryParams.testUser = null
      this.queryParams.sampleName = null
      this.queryParams.invbillName = null
      this.queryParams.sampleNo = null
      this.queryParams.entrustDeptName = null
      this.queryParams.entrustOrderNo = null
      this.queryParams.receiveTimeRange = [] // 日期范围也需要清空
      this.queryParams.beginReceiveTime = null
      this.queryParams.endReceiveTime = null

      this.queryParams.pageNum = 1 // 确保页码重置
      this.ids = []
      this.single = true
      this.multiple = true
      this.jcList = []
      this.isSame = false // 重置一致性状态
      this.CCitemID = ''
      this.CCinvbillCode = ''

      // ★★★ 重要：切换 Tab 时清空所有表格的选中状态 ★★★
      this.$nextTick(() => {
        ['chemTable', 'csfTable', 'nirTable'].forEach(refName => {
          if (this.$refs[refName]) {
            this.$refs[refName].clearSelection()
          }
        })
      })

      this.handleQuery()
    },
    handleUpdate(row) {
      localStorage.setItem('isCSF', 'false')
      console.log(row, '当前行数据')
      getJczxFeedResultBase(row.opJczxFeedResultBaseId).then(res => {
        console.log(res, '回显数据')
        if (res.data.modelNo === 'SHGM/JJ-01') {
          // 饲料中水分
          this.$router.push({
            name: 'JJ01Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-49') {
          // 棉籽中水分
          this.$router.push({
            name: 'JJ49Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-48') {
          // 玉米中水分
          this.$router.push({
            name: 'JJ48Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-15') {
          // 饲料中初水分
          this.$router.push({
            name: 'JJ15Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-02') {
          // 饲料中粗蛋白
          this.$router.push({
            name: 'JJ02Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-03') {
          // 饲料中粗灰分
          this.$router.push({
            name: 'JJ03Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-04') {
          // 饲料中粗脂肪
          this.$router.push({
            name: 'JJ04Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-06') {
          // 饲料中中性洗涤纤维
          this.$router.push({
            name: 'JJ06Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-07') {
          // 饲料中酸性洗涤纤维
          this.$router.push({
            name: 'JJ07Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-08') {
          // 饲料中钙
          this.$router.push({
            name: 'JJ08Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-10') {
          // 饲料中磷
          this.$router.push({
            name: 'JJ10Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-14') {
          // 饲料中粗纤维
          this.$router.push({
            name: 'JJ14Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-55') {
          // 饲料添加剂碳酸氢钠总碱量
          this.$router.push({
            name: 'JJ55Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-17') {
          // 饲料中三聚氰胺
          this.$router.push({
            name: 'JJ17Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-18') {
          // 饲料中玉米赤霉烯酮
          this.$router.push({
            name: 'JJ18Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-19') {
          // 饲料中赭曲霉毒素
          this.$router.push({
            name: 'JJ19Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-20') {
          // 饲料中淀粉糊化度
          this.$router.push({
            name: 'JJ20Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-47') {
          // 饲料中淀粉测定
          this.$router.push({
            name: 'JJ47Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-51') {
          // 饲料中呕吐毒素
          this.$router.push({
            name: 'JJ51Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-53') {
          // 饲料中黄曲霉毒素
          this.$router.push({
            name: 'JJ53Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-54') {
          // 饲料中WSC
          this.$router.push({
            name: 'JJ54Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-11') {
          // 饲料中黄曲霉毒素定性
          this.$router.push({
            name: 'JJ11Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else if (res.data.modelNo === 'SHGM/JJ-13') {
          console.log('饲料中水溶性氯化物')
          // 饲料中水溶性氯化物
          this.$router.push({
            name: 'JJ13Pad',
            params: {
              SjtaskInfo: res.data, // 直接传递对象
              isRev: false
            }
          })
        } else {
          console.log('res.data.modelNo', res.data.modelNo)
          this.$message.warning('暂无对应的平板页面，请联系管理员！')
        }
      })
    },
    handleQuery() {
      if (this.queryParams.receiveTimeRange && this.queryParams.receiveTimeRange.length === 2) {
        this.queryParams.beginReceiveTime = this.queryParams.receiveTimeRange[0] + ' 00:00:00' // 添加时分秒
        this.queryParams.endReceiveTime = this.queryParams.receiveTimeRange[1] + ' 23:59:59' // 添加时分秒
      } else {
        this.queryParams.beginReceiveTime = null
        this.queryParams.endReceiveTime = null
      }
      this.queryParams.pageNum = 1
      this.getList()
    },
    reset() {
      // 保留基础的重置逻辑，但 queryParams 的重置在 resetQuery 中处理
      this.form = {
        opJczxTestTaskId: null,
        entrustOrderItemId: null,
        status: null,
        result: null,
        testUserId: null,
        invbillCode: null,
        itemId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        deleteId: null
      }
      // this.resetForm("form"); // 这个form是用于修改的，不是queryForm
    },
    resetQuery() {
      // 保存当前的 testMethod 和 queryCsf
      const currentTestMethod = this.queryParams.testMethod
      const currentQueryCsf = this.queryParams.queryCsf

      // ★★★ 重置查询时也清空选择 ★★★
      this.$nextTick(() => {
        const currentTableRef = this.getCurrentTableRef()
        if (this.$refs[currentTableRef]) {
          this.$refs[currentTableRef].clearSelection()
        }
      })
      // 根据当前 Tab 重置对应的表单
      let formName = ''
      if (this.activeTab === 'chemistry') {
        formName = 'queryFormChem'
      } else if (this.activeTab === 'csf') {
        formName = 'queryFormCsf'
      } else if (this.activeTab === 'nir') {
        formName = 'queryFormNir'
      }
      if (formName && this.$refs[formName]) {
        this.$refs[formName].resetFields() // 只重置对应表单的字段
      } else {
        // 如果没有对应的 ref（例如切换tab后立刻重置），手动重置 queryParams 中与表单相关的字段
        this.queryParams.itemName = null
        this.queryParams.testUser = null
        this.queryParams.sampleName = null
        this.queryParams.invbillName = null
        this.queryParams.sampleNo = null
        this.queryParams.entrustDeptName = null
        this.queryParams.entrustOrderNo = null
        // this.queryParams.receiveTimeRange = []; // 这个是共享的，下面会清
      }

      // 清理日期范围参数（这些是共享的）
      this.queryParams.receiveTimeRange = []
      this.queryParams.beginReceiveTime = null
      this.queryParams.endReceiveTime = null

      // 清理共享的 queryParams 字段，除了分页和Tab控制字段
      this.queryParams.itemName = null
      this.queryParams.testUser = null
      this.queryParams.sampleName = null
      this.queryParams.invbillName = null
      this.queryParams.sampleNo = null
      this.queryParams.entrustDeptName = null
      this.queryParams.entrustOrderNo = null

      // 恢复 testMethod 和 queryCsf
      this.queryParams.testMethod = currentTestMethod
      this.queryParams.queryCsf = currentQueryCsf

      this.handleQuery()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.opJczxTestTaskId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      // 在 jcList 中增加 tag 和 itemName 字段
      this.jcList = selection.map(item => ({
        entrustOrderItemId: item.entrustOrderItemId,
        entrustOrderSampleId: item.entrustOrderSampleId,
        sampleNo: item.sampleNo,
        sampleName: item.sampleName,
        invbillName: item.invbillName,
        IDD: item.itemId,
        invbillCode: item.invbillCode,
        tag: item.tag, // 新增：物料类型标签 (1:饲料, 5:玉米, 6:棉籽)
        itemName: item.itemName, // 新增：用于判断是否为水分项目
        primaryMoistureStatus: item.primaryMoistureStatus
      }))

      // 清除非当前 tab 表格的选中状态
      const currentTableRef = this.getCurrentTableRef();
      ['chemTable', 'csfTable', 'nirTable'].forEach(refName => {
        if (this.$refs[refName] && refName !== currentTableRef) {
          this.$refs[refName].clearSelection()
        }
      })

      // 根据当前 Tab 执行不同的一致性检查
      if (selection.length > 0) {
        const firstItem = selection[0]
        // 总是暂存第一个选中项的 ID，以便 batch 操作使用
        this.CCitemID = firstItem?.itemId || ''
        this.CCinvbillCode = firstItem?.invbillCode || ''

        if (this.activeTab === 'chemistry') {
          // 化学法：只检查 itemId 是否一致
          const allItemsSame = selection.every(item => item.itemId === this.CCitemID)
          if (allItemsSame) {
            this.isSame = true
          } else {
            this.isSame = false
            this.$confirm('选中任务存在不同检测项目，请取消当前选中并重新选择。', '提示', {
              confirmButtonText: '确定',
              type: 'warning',
              showCancelButton: false
            }).catch(() => { })
          }
        } else if (this.activeTab === 'csf') {
          this.isSame = true
        } else {
          // 近红外：不检查一致性
          this.isSame = true
        }
      } else {
        // 没有选中项时，重置状态
        this.isSame = true // 允许按钮根据 single/multiple 状态正常禁用
        this.CCitemID = ''
        this.CCinvbillCode = ''
      }
    },
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
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase()
      const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent)
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent)
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
        (screenHeight >= 768 && screenHeight <= 1600)
      const hasEMUI = /emui/.test(userAgent)
      const isHuaweiPad = (isHuawei && isAndroidTablet) ||
        (isHuawei && isHuaweiTabletSize) ||
        (hasEMUI && isAndroidTablet)
      return isHuaweiPad
    },
    jumpByModel(resData, jcList) {
      const modelNo = resData.modelNo
      // 路由映射保持不变
      const routeMap = {
        'SHGM/JJ-01': 'JJ01Pad', 'SHGM/JJ-49': 'JJ49Pad', 'SHGM/JJ-48': 'JJ48Pad',
        'SHGM/JJ-15': 'JJ15Pad', 'SHGM/JJ-02': 'JJ02Pad', 'SHGM/JJ-03': 'JJ03Pad',
        'SHGM/JJ-04': 'JJ04Pad', 'SHGM/JJ-06': 'JJ06Pad', 'SHGM/JJ-07': 'JJ07Pad',
        'SHGM/JJ-08': 'JJ08Pad', 'SHGM/JJ-10': 'JJ10Pad', 'SHGM/JJ-14': 'JJ14Pad',
        'SHGM/JJ-55': 'JJ55Pad', 'SHGM/JJ-17': 'JJ17Pad', 'SHGM/JJ-18': 'JJ18Pad',
        'SHGM/JJ-19': 'JJ19Pad', 'SHGM/JJ-20': 'JJ20Pad', 'SHGM/JJ-47': 'JJ47Pad',
        'SHGM/JJ-51': 'JJ51Pad', 'SHGM/JJ-53': 'JJ53Pad', 'SHGM/JJ-54': 'JJ54Pad',
        'SHGM/JJ-11': 'JJ11Pad', 'SHGM/JJ-13': 'JJ13Pad', 'SHGM/JJ-50': 'JJ50Pad'
      }
      const routeName = routeMap[modelNo]
      if (!routeName) {
        this.$modal.msgWarning(`未找到型号 ${modelNo} 对应的化验页面`)
        return
      }
      this.$router.push({
        name: routeName,
        params: {
          taskInfo: resData,
          jcList: jcList,
          isBegin: true,
          isRev: ['SHGM/JJ-01', 'SHGM/JJ-49', 'SHGM/JJ-48'].includes(modelNo),
          CCinvbillCode: resData.invbillCode
        }
      })
    },

    async beginTestSingle(row) { // 添加 async
      this.beginTestLoading = true //  1. 在开始时设置 loading
      // 近红外逻辑不变
      if (this.activeTab === 'nir') {
        const nirRowData = [{ sampleNo: row.sampleNo, sampleName: row.sampleName }]
        this.exportNirExcel(nirRowData, `近红外检测_${row.sampleNo || '样品'}`)
      } else if (this.activeTab === 'csf') {
        // 初水分 Tab 逻辑
        const csfItemId = await this.getCsfItemId() // 获取初水分项目ID
        if (!csfItemId) return // 如果获取失败则中止

        getTask(row.invbillCode, csfItemId).then(res => { // 使用获取到的 csfItemId
          const jcList = [{
            entrustOrderItemId: row.entrustOrderItemId,
            entrustOrderSampleId: row.entrustOrderSampleId,
            sampleNo: row.sampleNo,
            sampleName: row.sampleName,
            IDD: csfItemId, // 传递正确的初水分 itemId
            invbillCode: row.invbillCode // 传递 invbillCode
          }]
          this.jumpByModel(res.data, jcList)
          this.beginTestLoading = false
        }).catch(err => {
          console.error('获取初水分任务详情失败:', err)
          this.$modal.msgError('获取任务详情失败: ' + (err.message || err))
        })
      } else { // 化学法逻辑 (保持不变)
        getTask(row.invbillCode, row.itemId).then(res => {
          const jcList = [{
            entrustOrderItemId: row.entrustOrderItemId,
            entrustOrderSampleId: row.entrustOrderSampleId,
            sampleNo: row.sampleNo,
            sampleName: row.sampleName,
            IDD: row.itemId,
            invbillCode: row.invbillCode
          }]
          this.jumpByModel(res.data, jcList)
          this.beginTestLoading = false
        }).catch(err => {
          console.error('获取化学法任务详情失败:', err)
          this.$modal.msgError('获取任务详情失败: ' + (err.message || err))
        })
      }
    },

    async beginTest() { // 添加 async
      localStorage.setItem('isCSF', 'true')

      // ★★★ 在开始化验前对 jcList 排序 ★★★
      this.jcList.sort((a, b) => {
        return (a.sampleNo || '').localeCompare(b.sampleNo || '', 'zh-CN', { numeric: true })
      })
      // 近红外逻辑不变
      if (this.activeTab === 'nir') {
        if (!this.jcList || this.jcList.length === 0) {
          this.$modal.msgWarning('请至少选择一个样品进行导出')
          return
        }
        this.exportNirExcel(this.jcList, '近红外批量检测')
      } else if (this.activeTab === 'csf') {
        // 初水分 Tab 逻辑
        this.reset()
        if (this.isSame) { // isSame 现在检查 invbillCode
          const csfItemId = await this.getCsfItemId() // 获取初水分项目ID
          if (!csfItemId) return

          // 检查 CCinvbillCode 是否有效
          if (!this.CCinvbillCode) {
            this.$modal.msgWarning('未能获取物料ID，请重新选择')
            return
          }

          getTask(this.CCinvbillCode, csfItemId).then(res => { // 使用获取到的 csfItemId
            // 更新 jcList 中的 IDD 为正确的初水分 itemId
            const updatedJcList = this.jcList.map(item => ({ ...item, IDD: csfItemId }))
            this.jumpByModel(res.data, updatedJcList) // 传递更新后的 jcList
          }).catch(err => {
            console.error('获取初水分任务详情失败:', err)
            this.$modal.msgError('获取任务详情失败: ' + (err.message || err))
          })
        } else {
          // 提示信息已在 handleSelectionChange 中显示
          console.log('isSame为false，批量操作被阻止 (csf)')
        }
      } else { // 化学法逻辑
        this.reset()
        if (this.isSame) { // isSame 现在检查 itemId
          // 检查 CCitemID 和 CCinvbillCode 是否有效
          if (!this.CCinvbillCode || !this.CCitemID) {
            this.$modal.msgWarning('未能获取项目ID或物料ID，请重新选择')
            return
          }

          // 遍历选中的每一个样品
          for (const item of this.jcList) {
            // 如果状态不是'已校对' 且 不是'无初水分' (不需要初水分的也不应该拦截)
            // 如果您的需求是“只要不是已校对就拦截(哪怕是无初水分)”，请去掉后面的 && 判断
            if (item.primaryMoistureStatus !== '已校对' && item.primaryMoistureStatus !== '无初水分') {
              this.$modal.msgError(`样品【${item.sampleNo}】初水分未校对，请等待初水分结果出来后，再化验该项目。`)
              return // 只要发现一个不满足，直接停止，不跳转
            }
          }

          // 1. 判断是否包含“水分”项目 (取第一个即可，因为handleSelectionChange已保证项目一致)
          const firstItem = this.jcList[0]
          // 注意：这里使用 includes模糊匹配，或者你可以使用 === 精确匹配，取决于数据库里项目名称是否叫"水分"或"水分测定"等
          const isMoisture = firstItem && firstItem.itemName && firstItem.itemName.includes('水分')

          if (isMoisture) {
            // 2. 提取所有选中项的 tag
            const tags = new Set(this.jcList.map(item => String(item.tag)))

            // 3. 定义互斥的标签集合：1(饲料), 5(玉米), 6(棉籽)
            const restrictedTags = ['1', '5', '6']

            // 4. 计算选中项中包含了几种受限标签
            let conflictCount = 0
            restrictedTags.forEach(targetTag => {
              if (tags.has(targetTag)) {
                conflictCount++
              }
            })

            // 5. 如果受限标签种类超过1种，则拦截
            if (conflictCount > 1) {
              this.$modal.msgError('水分化验单不能同时选择饲料、玉米、棉籽的样品，请分开化验。')
              return // 阻止后续代码执行
            }
          }

          getTask(this.CCinvbillCode, this.CCitemID).then(res => {
            this.jumpByModel(res.data, this.jcList)
          }).catch(err => {
            console.error('获取化学法任务详情失败:', err)
            this.$modal.msgError('获取任务详情失败: ' + (err.message || err))
          })
        } else {
          // 提示信息已在 handleSelectionChange 中显示
          console.log('isSame为false，批量操作被阻止 (chemistry)')
        }
      }
    },

    /** 提交按钮 */
    submitForm() {
      // 检查 'form' ref 是否存在
      if (!this.$refs['form']) {
        console.warn("this.$refs['form'] is not defined")
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.opJczxTestTaskId != null) {
            updateTask(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              //   this.open = false; // 'open' is not defined in data
              this.getList()
            })
          } else {
            // addTask 未导入
            console.error('addTask function is not imported')
            this.$modal.msgError('新增功能未实现')
            // addTask(this.form).then(response => {
            // this.$modal.msgSuccess("新增成功");
            // //   this.open = false;
            // this.getList();
            // });
          }
        }
      })
    },

    /** 导出按钮操作 */
    handleExport() {
      // 导出逻辑加入 queryCsf
      this.download('labtest/task/export', {
        ...this.queryParams // queryParams 包含 testMethod 和 queryCsf
      }, `task_${new Date().getTime()}.xlsx`)
    },

    /**
     * 新增：近红外导出Excel (前端生成)
     * @param {Array} data - 样品数据 (通常是 this.jcList 或单个 row)
     * @param {String} fileName - 导出的文件名
     */
    exportNirExcel(data, fileName) {
      // 近红外导出逻辑不变
      try {
        this.$modal.loading('正在生成Excel文件，请稍候...')
        const exportData = data.map(row => ({
          '样品编号': row.sampleNo,
          '样品描述': row.sampleName
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }]
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, '样品')
        const finalFileName = `${fileName}_${new Date().getTime()}.xlsx`
        XLSX.writeFile(wb, finalFileName)
        this.$modal.closeLoading()
        this.$modal.msgSuccess('导出成功')
      } catch (error) {
        this.$modal.closeLoading()
        console.error('近红外Excel导出失败:', error)
        this.$modal.msgError('导出失败，详情请查看控制台日志')
      }
    },
    // --- 近红外报告上传、预览、下载相关方法保持不变 ---
    handleUploadReport(row) {
      this.currentRowForUpload = row
      this.reportFileList = []
      this.uploadReportDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.uploadReport) {
          this.$refs.uploadReport.clearFiles()
        }
      })
    },
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        this.reportFileList = [fileList[fileList.length - 1]]
        this.$message.warning('只能上传一个文件')
      } else {
        this.reportFileList = fileList
      }
    },
    beforeUploadReport(file) {
      const isLt10M = file.size / 1024 / 1024 < 10
      const isAllowedType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg'
      ].includes(file.type)
      if (!isAllowedType) {
        this.$message.error('上传文件格式不支持!')
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isAllowedType && isLt10M
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件')
    },
    handleUploadError(err) {
      this.$message.error('文件上传失败: ' + (err.message || err))
      this.uploadingReport = false
    },
    closeUploadDialog() {
      this.uploadReportDialogVisible = false
      this.reportFileList = []
      this.currentRowForUpload = null
      this.uploadingReport = false
      if (this.$refs.uploadReport) {
        this.$refs.uploadReport.clearFiles() // 确保组件状态也被清空
      }
    },
    submitUploadReport() {
      if (this.reportFileList.length === 0) {
        this.$message.warning('请先选择要上传的文件')
        return
      }
      // 手动触发el-upload的上传，这将调用handleHttpRequest
      this.$refs.uploadReport.submit()
    },
    async handleHttpRequest(options) {
      const file = options.file
      const formData = new FormData()
      formData.append('file', file)
      this.uploadingReport = true
      try {
        // 1. 调用通用上传接口获取 fileId
        const uploadRes = await uploadAndGetFileId(formData)
        if (uploadRes.code === 200) {
          const fileId = uploadRes.data
          console.log('文件上传成功，File ID:', fileId)

          // 2. 调用后端接口关联 fileId 和 sampleId
          const reportData = {
            feedEntrustOrderId: this.currentRowForUpload.entrustOrderId, // 确保 entrustOrderId 存在于 row
            fileId: fileId
          }
          console.log('关联数据:', reportData)
          const reportRes = await uploadNirReport(reportData)

          if (reportRes.code === 200) {
            this.$message.success('报告上传并关联成功')
            this.closeUploadDialog()
            this.getList() // 刷新列表以显示报告链接
          } else {
            this.$message.error(reportRes.msg || '报告关联失败')
          }
        } else {
          this.$message.error(uploadRes.msg || '文件上传失败')
        }
      } catch (error) {
        console.error('上传或关联报告出错:', error)
        this.$message.error('操作失败: ' + (error.message || '未知错误'))
      } finally {
        this.uploadingReport = false
      }
    },
    async handlePreviewReport(row) {
      const fileId = row.fileId // *** 从 row 获取 fileId ***
      if (!fileId) {
        this.$message.error('未找到文件ID')
        return
      }
      this.currentRowForUpload = row // *** 存储当前行(订单)信息 ***
      this.previewLoading = true
      this.previewVisible = true
      this.previewUrl = ''
      this.isPreviewImage = false
      this.isPreviewPdf = false

      try {
        const response = await previewFile(fileId) // previewFile 应该返回 Blob

        if (response instanceof Blob) {
          const contentType = response.type
          this.previewUrl = URL.createObjectURL(response)

          if (contentType.startsWith('image/')) {
            this.isPreviewImage = true
          } else if (contentType === 'application/pdf') {
            this.isPreviewPdf = true
          } else {
            // 不支持的类型
            URL.revokeObjectURL(this.previewUrl)
            this.previewUrl = 'unsupported' // 使用特殊值标记
          }
        } else {
          throw new Error('无效的预览响应')
        }
      } catch (error) {
        console.error('预览文件失败:', error)
        this.$message.error('无法加载预览: ' + (error.message || '请检查网络或文件是否存在'))
        this.previewUrl = '' // 清空URL
        this.previewVisible = false // 关闭对话框
      } finally {
        this.previewLoading = false
      }
    },
    handleDownloadReport(row) {
      if (!row || !row.fileId) {
        this.$message.error('未找到文件信息')
        return
      }
      const fileId = row.fileId
      // *** 使用 entrustOrderNo 构造文件名 ***
      const fileName = row.reportFileName || `近红外报告_${row.entrustOrderNo || fileId}.unknown`

      this.$modal.loading('正在下载文件，请稍候...')
      downloadFile(fileId).then(response => { // downloadFile 应该返回 Blob
        const blob = new Blob([response])
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(link.href)
        this.$modal.closeLoading()
      }).catch(error => {
        console.error('下载文件失败:', error)
        this.$modal.closeLoading()
        this.$message.error('下载失败: ' + (error.message || '未知错误'))
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // 检查 delTask 是否已导入
      if (typeof delTask !== 'function') {
        this.$modal.msgError('删除功能未正确导入，请联系管理员')
        console.error('delTask is not imported or not a function')
        return
      }

      const idsToDelete = row.opJczxTestTaskId ? [row.opJczxTestTaskId] : this.ids
      if (!idsToDelete || idsToDelete.length === 0) {
        this.$modal.msgWarning('请选择要删除的任务')
        return
      }
      const taskNos = row.opJczxTestTaskId ? row.sampleNo : '选中的任务' // 简单提示
      this.$modal.confirm('是否确认删除任务编号为"' + taskNos + '"的数据项？').then(() => {
        return delTask(idsToDelete.join(',')) // 假设 delTask 支持逗号分隔的 ID 字符串
      }).then(() => {
        this.getList() // 重新加载列表
        this.$modal.msgSuccess('删除成功')
      }).catch((err) => {
        console.error('删除失败:', err)
        // this.$modal.msgError("删除失败"); // 确认框取消时也会进入catch
      })
    },

    // 获取当前活动 Tab 对应的表格引用名称
    getCurrentTableRef() {
      if (this.activeTab === 'chemistry') {
        return 'chemTable'
      } else if (this.activeTab === 'csf') {
        return 'csfTable'
      } else if (this.activeTab === 'nir') {
        return 'nirTable'
      }
      return 'chemTable' // 默认
    }
  }
}
</script>
<style lang="scss" scoped>
/* 样式保持不变 */
html,
body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  padding: 0 15px;
  margin: 0px 0px 0 !important;
}

.el-tabs {
  min-width: 1024px;
  max-width: 1680px;
}

@media (max-width: 1024px) {
  .app-container {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;

    .el-table {
      max-height: calc(100vh - 280px);
    }
  }
}

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

/* 为分页组件添加一些底部边距，防止被遮挡 */
.pagin {
  margin-bottom: 50px;
  /* 根据需要调整 */
}
</style>
