<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回首页</el-button>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">


      <el-form :model="queryParams" ref="queryFormChem" size="small" :inline="true" v-show="showSearch"
        label-width="68px">

        <!--<el-form-item label="检测人" prop="testUser">
            <el-input v-model="queryParams.testUser" placeholder="请输入检测人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>-->
        <el-form-item label="物料" prop="invbillName">
          <el-input v-model="queryParams.invbillName" placeholder="请输入物料" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="样品名称" prop="sampleName">
          <el-input v-model="queryParams.sampleName" placeholder="请输入样品名称" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="样品编号" prop="sampleNo">
          <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="委托单位" prop="entrustDeptName">
          <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="委托单号" prop="entrustOrderNo">
          <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" @click="beginTest">开始化验</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['labtest:task:begin']">导出</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange" ref="chemTable"
        :height="tableHeight" row-key="entrustOrderId">
        <el-table-column type="selection" width="55" align="center" :selectable="canSelect" reserve-selection />
        <el-table-column label="样品编号" align="center" prop="sampleNo" />
        <el-table-column label="物料" align="center" prop="invbillName" />
        <el-table-column label="样品名称" align="center" prop="sampleName" />
        <el-table-column label="检测项目" align="center" prop="itemName" />

        <!--<el-table-column label="检测人" align="center" prop="testUser" />-->
        <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
        <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
        <el-table-column label="接收人" align="center" prop="receiverName" />
        <el-table-column label="接收时间" align="center" prop="receiveTime" />
        <!--   <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTestSingle(scope.row)"
                v-hasPermi="['labtest:task:begin']">开始化验</el-button>

            </template>
</el-table-column>-->
      </el-table>


      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" class="pagin" />

    </el-tabs>

    <el-dialog title="上传近红外报告" :visible.sync="uploadReportDialogVisible" width="400px" append-to-body
      @close="closeUploadDialog">
      <el-upload ref="uploadReport" :limit="1" :action="uploadReportActionUrl" :headers="uploadReportHeaders"
        :auto-upload="false" :before-upload="beforeUploadReport" :on-exceed="handleExceed" :on-change="handleFileChange"
        :on-error="handleUploadError" :http-request="handleHttpRequest" :file-list="reportFileList" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传1个文件，支持 pdf / doc / docx / xls / xlsx / png / jpg /
          jpeg
          格式，且不超过10MB
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUploadDialog">取 消</el-button>
        <el-button type="primary" @click="submitUploadReport" :loading="uploadingReport">确 定 上
          传</el-button>
      </div>
    </el-dialog>

    <el-dialog title="文件预览" :visible.sync="previewVisible" width="70%" top="5vh" append-to-body>
      <div v-loading="previewLoading" style="height: 70vh; overflow: auto;">
        <img v-if="isPreviewImage && previewUrl" :src="previewUrl" style="max-width: 100%;" />
        <iframe v-else-if="isPreviewPdf && previewUrl" :src="previewUrl" width="100%" height="100%"
          frameborder="0"></iframe>
        <div v-else-if="previewUrl === 'unsupported'" style="text-align: center; padding: 20px;">
          <p>在线预览暂不支持此文件格式，请下载后查看。</p>
          <el-button type="primary" icon="el-icon-download"
            @click="handleDownloadReport(currentRowForUpload)">点击下载</el-button>
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
import { listTask, getTask, updateTask, uploadNirReport, delTask, listJHYTask, beginJHYTask, getdetail } from "@/api/CentralLaboratory/task";
import { uploadAndGetFileId, downloadFile, previewFile } from '@/api/common/common';
import { getToken } from '@/utils/auth';
import * as XLSX from 'xlsx';
// 导入查询检测项目列表的API
import { getpagelist as getTestingItemsList } from "@/api/Basicdata/Testingitems";

export default {
  name: "Task",
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
        // entrustOrderType: '1', // 1: 饲料委托单
        // testMethod: '2', // 默认化学法
        // queryCsf: '0' // 新增：初水分查询标识，化学法为'0'
      },
      beginTestLoading: false, // "开始化验" 按钮的 loading 状态
      // 查询初水分项目专用的查询参数
      csfItemQueryParams: {
        pageNum: 1,
        pageSize: 10, // 获取少量数据即可
        tag: "12", // 假设tag '12' 代表初水分项目
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
      uploadReportHeaders: { Authorization: "Bearer " + getToken() },
      uploadReportActionUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 实际未使用
      previewVisible: false,
      previewLoading: false,
      previewUrl: '',
      isPreviewImage: false,
      isPreviewPdf: false
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.isPadPc()
    window.addEventListener('resize', () => {
      // 动态调整表格高度
      this.tableHeight = window.innerHeight - (this.showSearch ? 360 : 280);
    });
    this.tableHeight = window.innerHeight - (this.showSearch ? 360 : 280); // 初始化时也计算一次
  },
  methods: {
    // 获取初水分项目ID的方法
    async getCsfItemId() {
      try {
        const response = await getTestingItemsList(this.csfItemQueryParams);
        if (response.rows && response.rows.length > 0) {
          // 假设tag为'12'的项目只有一个，取第一个
          return response.rows[0].labtestItemsId;
        } else {
          this.$modal.msgError('未查询到初水分项目，请在【基础数据】->【检测项目管理】中添加 tag 为 "12" 的初水分项目！');
          return null; // 返回 null 表示未找到
        }
      } catch (error) {
        console.error("查询初水分项目ID失败:", error);
        this.$modal.msgError('查询初水分项目ID失败！');
        return null;
      }
    },

    canSelect(row) {
      // 根据当前激活的 tab 决定是否可选
      if (this.activeTab === 'chemistry' || this.activeTab === 'csf') {
        return !row.testUser; // 化学法和初水分：有检测人(testUser有值)时禁用
      } else if (this.activeTab === 'nir') {
        // 近红外：总是可选，或者根据特定逻辑判断
        return true; // 假设近红外总是可选
      }
      return false; // 默认不可选
    },
    setBodyHeight() {
      if (this.isPad) {
        document.documentElement.classList.add('is-pad');
        document.body.style.height = '97%';
      } else {
        document.documentElement.classList.remove('is-pad');
        document.body.style.height = '97%';
      }
    },
    isPadPc() {
      const device = this.$store.state.app.device;
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
      this.setBodyHeight();
    },
    HDPada() {
      this.$router.push('/Pad')
    },
    getList() {
      this.loading = true;
      // queryParams 已包含 testMethod 和 queryCsf
      listJHYTask(this.queryParams).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false; // 确保出错时也取消加载状态
      });
    },
    handleTabClick(tab) {
      this.activeTab = tab.name;
      if (tab.name === 'nir') {
        this.queryParams.testMethod = '1';
        this.queryParams.queryCsf = null; // 近红外不需要queryCsf
      } else if (tab.name === 'chemistry') {
        this.queryParams.testMethod = '2';
        this.queryParams.queryCsf = '0'; // 化学法
      } else if (tab.name === 'csf') {
        this.queryParams.testMethod = '2'; // 初水分也属于化学法范畴，但有特殊标识
        this.queryParams.queryCsf = '1'; // 初水分
      }
      // 【清空共享的查询条件】
      this.queryParams.itemName = null;
      this.queryParams.testUser = null;
      this.queryParams.sampleName = null;
      this.queryParams.invbillName = null;
      this.queryParams.sampleNo = null;
      this.queryParams.entrustDeptName = null;
      this.queryParams.entrustOrderNo = null;
      this.queryParams.receiveTimeRange = []; // 日期范围也需要清空
      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;

      this.queryParams.pageNum = 1; // 确保页码重置
      this.ids = [];
      this.single = true;
      this.multiple = true;
      this.jcList = [];
      this.isSame = false; // 重置一致性状态
      this.CCitemID = '';
      this.CCinvbillCode = '';


      // ★★★ 重要：切换 Tab 时清空所有表格的选中状态 ★★★
      this.$nextTick(() => {
        ['chemTable', 'csfTable', 'nirTable'].forEach(refName => {
          if (this.$refs[refName]) {
            this.$refs[refName].clearSelection();
          }
        });
      });

      this.handleQuery();
    },
    handleQuery() {
      if (this.queryParams.receiveTimeRange && this.queryParams.receiveTimeRange.length === 2) {
        this.queryParams.beginReceiveTime = this.queryParams.receiveTimeRange[0] + ' 00:00:00'; // 添加时分秒
        this.queryParams.endReceiveTime = this.queryParams.receiveTimeRange[1] + ' 23:59:59'; // 添加时分秒
      } else {
        this.queryParams.beginReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
      this.queryParams.pageNum = 1;
      this.getList();
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
      };
      // ★★★ 重置查询时也清空选择 ★★★
      this.$nextTick(() => {
        const currentTableRef = this.getCurrentTableRef();
        if (this.$refs[currentTableRef]) {
          this.$refs[currentTableRef].clearSelection();
        }
      });
      // this.resetForm("form"); // 这个form是用于修改的，不是queryForm
    },
    resetQuery() {
      // 保存当前的 testMethod 和 queryCsf
      const currentTestMethod = this.queryParams.testMethod;
      const currentQueryCsf = this.queryParams.queryCsf;

      // 根据当前 Tab 重置对应的表单
      let formName = '';
      if (this.activeTab === 'chemistry') {
        formName = "queryFormChem";
      } else if (this.activeTab === 'csf') {
        formName = "queryFormCsf";
      } else if (this.activeTab === 'nir') {
        formName = "queryFormNir";
      }
      if (formName && this.$refs[formName]) {
        this.$refs[formName].resetFields(); // 只重置对应表单的字段
      } else {
        // 如果没有对应的 ref（例如切换tab后立刻重置），手动重置 queryParams 中与表单相关的字段
        this.queryParams.itemName = null;
        this.queryParams.testUser = null;
        this.queryParams.sampleName = null;
        this.queryParams.invbillName = null;
        this.queryParams.sampleNo = null;
        this.queryParams.entrustDeptName = null;
        this.queryParams.entrustOrderNo = null;
        // this.queryParams.receiveTimeRange = []; // 这个是共享的，下面会清
      }


      // 清理日期范围参数（这些是共享的）
      this.queryParams.receiveTimeRange = [];
      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;

      // 清理共享的 queryParams 字段，除了分页和Tab控制字段
      this.queryParams.itemName = null;
      this.queryParams.testUser = null;
      this.queryParams.sampleName = null;
      this.queryParams.invbillName = null;
      this.queryParams.sampleNo = null;
      this.queryParams.entrustDeptName = null;
      this.queryParams.entrustOrderNo = null;


      // 恢复 testMethod 和 queryCsf
      this.queryParams.testMethod = currentTestMethod;
      this.queryParams.queryCsf = currentQueryCsf;

      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.opJczxTestTaskId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.jcList = selection;
      // this.jcList = selection.map(item => ({
      //   entrustOrderItemId: item.entrustOrderItemId,
      //   entrustOrderSampleId: item.entrustOrderSampleId,
      //   sampleNo: item.sampleNo,
      //   sampleName: item.sampleName,
      //   invbillName: item.invbillName,
      //   IDD: item.itemId, // 初始 IDD
      //   invbillCode: item.invbillCode // 添加 invbillCode 到 jcList 中，方便后续使用
      // }));

      // 清除非当前 tab 表格的选中状态
      const currentTableRef = this.getCurrentTableRef();
      ['chemTable', 'csfTable', 'nirTable'].forEach(refName => {
        // 确保 ref 存在并且不是当前活动的 ref
        if (this.$refs[refName] && refName !== currentTableRef) {
          this.$refs[refName].clearSelection();
        }
      });

      // 根据当前 Tab 执行不同的一致性检查
      if (selection.length > 0) {
        const firstItem = selection[0];
        // 总是暂存第一个选中项的 ID，以便 batch 操作使用
        this.CCitemID = firstItem?.itemId || '';
        this.CCinvbillCode = firstItem?.invbillCode || '';


      } else {
        // 没有选中项时，重置状态
        this.isSame = true; // 允许按钮根据 single/multiple 状态正常禁用
        this.CCitemID = '';
        this.CCinvbillCode = '';
      }
    },
    isPADDevice() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isiPad = /ipad/.test(userAgent);
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
      const isWindowsTablet = /windows/.test(userAgent) && /touch/.test(userAgent);
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const isTabletSize = (screenWidth >= 768 && screenWidth <= 1024) ||
        (screenHeight >= 768 && screenHeight <= 1024);
      return isiPad || isAndroidTablet || isWindowsTablet || isTabletSize;
    },
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent);
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
        (screenHeight >= 768 && screenHeight <= 1600);
      const hasEMUI = /emui/.test(userAgent);
      const isHuaweiPad = (isHuawei && isAndroidTablet) ||
        (isHuawei && isHuaweiTabletSize) ||
        (hasEMUI && isAndroidTablet);
      return isHuaweiPad;
    },
    jumpByModel(resData, jcList) {

      console.log(resData, jcList, '跳转数据')
      this.$router.push({
        name: 'JHYPad',          // ①固定路由
        params: {
          taskInfo: jcList,     // 后端返回的完整任务头
          jcList: resData,        // 选中的样品数组
          isRev: false,          // ②如需区分复核/普通，可在这里加标志
          // CCinvbillCode: resData.invbillCode
        }
      });
    },

    async beginTestSingle(row) { // 添加 async
      this.beginTestLoading = true; //  1. 在开始时设置 loading
      // 近红外逻辑不变
      if (this.activeTab === 'nir') {
        const nirRowData = [{ sampleNo: row.sampleNo, sampleName: row.sampleName }];
        this.exportNirExcel(nirRowData, `近红外检测_${row.sampleNo || '样品'}`);
      } else if (this.activeTab === 'csf') {
        // 初水分 Tab 逻辑
        const csfItemId = await this.getCsfItemId(); // 获取初水分项目ID
        if (!csfItemId) return; // 如果获取失败则中止

        getTask(row.invbillCode, csfItemId).then(res => { // 使用获取到的 csfItemId
          const jcList = [{
            entrustOrderItemId: row.entrustOrderItemId,
            entrustOrderSampleId: row.entrustOrderSampleId,
            sampleNo: row.sampleNo,
            sampleName: row.sampleName,
            IDD: csfItemId, // 传递正确的初水分 itemId
            invbillCode: row.invbillCode // 传递 invbillCode
          }];
          this.jumpByModel(res.data, jcList);
          this.beginTestLoading = false;
        }).catch(err => {
          console.error("获取初水分任务详情失败:", err);
          this.$modal.msgError("获取任务详情失败: " + (err.message || err));
        });
      } else { // 化学法逻辑 (保持不变)
        getTask(row.invbillCode, row.itemId).then(res => {
          const jcList = [{
            entrustOrderItemId: row.entrustOrderItemId,
            entrustOrderSampleId: row.entrustOrderSampleId,
            sampleNo: row.sampleNo,
            sampleName: row.sampleName,
            IDD: row.itemId,
            invbillCode: row.invbillCode
          }];
          this.jumpByModel(res.data, jcList);
          this.beginTestLoading = false;
        }).catch(err => {
          console.error("获取化学法任务详情失败:", err);
          this.$modal.msgError("获取任务详情失败: " + (err.message || err));
        });
      }
    },

    async beginTest() { // 添加 async
      console.log('当前勾选的样品数组 jcList:', this.jcList);
      const sampleIds = this.jcList.map(item => item.entrustOrderSampleId);
      beginJHYTask(sampleIds).then(res => {
        console.log('开始化验成功:', res);
        getdetail(res.data[0].testItem[0].itemId).then(resHead => {
          console.log('开始化验详情成功:', resHead);
          this.jumpByModel(res.data, resHead.data);
        })

      }).catch(err => {
        // console.error("开始化验失败:", err);
        this.$modal.msgError("开始化验失败: " + (err.message || err));
      });

    },

    /** 提交按钮 */
    submitForm() {
      // 检查 'form' ref 是否存在
      if (!this.$refs["form"]) {
        console.warn("this.$refs['form'] is not defined");
        return;
      }
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.opJczxTestTaskId != null) {
            updateTask(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              //   this.open = false; // 'open' is not defined in data
              this.getList();
            });
          } else {
            // addTask 未导入
            console.error("addTask function is not imported");
            this.$modal.msgError("新增功能未实现");
            // addTask(this.form).then(response => {
            // this.$modal.msgSuccess("新增成功");
            // //   this.open = false;
            // this.getList();
            // });
          }
        }
      });
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
        this.$modal.loading("正在生成Excel文件，请稍候...");
        const exportData = data.map(row => ({
          "样品编号": row.sampleNo,
          "样品描述": row.sampleName
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '样品');
        const finalFileName = `${fileName}_${new Date().getTime()}.xlsx`;
        XLSX.writeFile(wb, finalFileName);
        this.$modal.closeLoading();
        this.$modal.msgSuccess("导出成功");
      } catch (error) {
        this.$modal.closeLoading();
        console.error("近红外Excel导出失败:", error);
        this.$modal.msgError("导出失败，详情请查看控制台日志");
      }
    },
    // --- 近红外报告上传、预览、下载相关方法保持不变 ---
    handleUploadReport(row) {
      this.currentRowForUpload = row;
      this.reportFileList = [];
      this.uploadReportDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.uploadReport) {
          this.$refs.uploadReport.clearFiles();
        }
      });
    },
    handleFileChange(file, fileList) {
      if (fileList.length > 1) {
        this.reportFileList = [fileList[fileList.length - 1]];
        this.$message.warning('只能上传一个文件');
      } else {
        this.reportFileList = fileList;
      }
    },
    beforeUploadReport(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      const isAllowedType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg'
      ].includes(file.type);
      if (!isAllowedType) {
        this.$message.error('上传文件格式不支持!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return isAllowedType && isLt10M;
    },
    handleExceed() {
      this.$message.warning('只能上传一个文件');
    },
    handleUploadError(err) {
      this.$message.error('文件上传失败: ' + (err.message || err));
      this.uploadingReport = false;
    },
    closeUploadDialog() {
      this.uploadReportDialogVisible = false;
      this.reportFileList = [];
      this.currentRowForUpload = null;
      this.uploadingReport = false;
      if (this.$refs.uploadReport) {
        this.$refs.uploadReport.clearFiles(); // 确保组件状态也被清空
      }
    },
    submitUploadReport() {
      if (this.reportFileList.length === 0) {
        this.$message.warning('请先选择要上传的文件');
        return;
      }
      // 手动触发el-upload的上传，这将调用handleHttpRequest
      this.$refs.uploadReport.submit();
    },
    async handleHttpRequest(options) {
      const file = options.file;
      const formData = new FormData();
      formData.append('file', file);
      this.uploadingReport = true;
      try {
        // 1. 调用通用上传接口获取 fileId
        const uploadRes = await uploadAndGetFileId(formData);
        if (uploadRes.code === 200) {
          const fileId = uploadRes.data;
          console.log("文件上传成功，File ID:", fileId);

          // 2. 调用后端接口关联 fileId 和 sampleId
          const reportData = {
            feedEntrustOrderId: this.currentRowForUpload.entrustOrderId, // 确保 entrustOrderId 存在于 row
            fileId: fileId
          };
          console.log("关联数据:", reportData);
          const reportRes = await uploadNirReport(reportData);

          if (reportRes.code === 200) {
            this.$message.success('报告上传并关联成功');
            this.closeUploadDialog();
            this.getList(); // 刷新列表以显示报告链接
          } else {
            this.$message.error(reportRes.msg || '报告关联失败');
          }
        } else {
          this.$message.error(uploadRes.msg || '文件上传失败');
        }
      } catch (error) {
        console.error("上传或关联报告出错:", error);
        this.$message.error('操作失败: ' + (error.message || '未知错误'));
      } finally {
        this.uploadingReport = false;
      }
    },
    async handlePreviewReport(row) {
      const fileId = row.fileId; // *** 从 row 获取 fileId ***
      if (!fileId) {
        this.$message.error('未找到文件ID');
        return;
      }
      this.currentRowForUpload = row; // *** 存储当前行(订单)信息 ***
      this.previewLoading = true;
      this.previewVisible = true;
      this.previewUrl = '';
      this.isPreviewImage = false;
      this.isPreviewPdf = false;

      try {
        const response = await previewFile(fileId); // previewFile 应该返回 Blob

        if (response instanceof Blob) {
          const contentType = response.type;
          this.previewUrl = URL.createObjectURL(response);

          if (contentType.startsWith('image/')) {
            this.isPreviewImage = true;
          } else if (contentType === 'application/pdf') {
            this.isPreviewPdf = true;
          } else {
            // 不支持的类型
            URL.revokeObjectURL(this.previewUrl);
            this.previewUrl = 'unsupported'; // 使用特殊值标记
          }
        } else {
          throw new Error("无效的预览响应");
        }
      } catch (error) {
        console.error("预览文件失败:", error);
        this.$message.error("无法加载预览: " + (error.message || '请检查网络或文件是否存在'));
        this.previewUrl = ''; // 清空URL
        this.previewVisible = false; // 关闭对话框
      } finally {
        this.previewLoading = false;
      }
    },
    handleDownloadReport(row) {
      if (!row || !row.fileId) {
        this.$message.error('未找到文件信息');
        return;
      }
      const fileId = row.fileId;
      // *** 使用 entrustOrderNo 构造文件名 ***
      const fileName = row.reportFileName || `近红外报告_${row.entrustOrderNo || fileId}.unknown`;

      this.$modal.loading("正在下载文件，请稍候...");
      downloadFile(fileId).then(response => { // downloadFile 应该返回 Blob
        const blob = new Blob([response]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
        this.$modal.closeLoading();
      }).catch(error => {
        console.error("下载文件失败:", error);
        this.$modal.closeLoading();
        this.$message.error("下载失败: " + (error.message || '未知错误'));
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      // 检查 delTask 是否已导入
      if (typeof delTask !== 'function') {
        this.$modal.msgError("删除功能未正确导入，请联系管理员");
        console.error("delTask is not imported or not a function");
        return;
      }

      const idsToDelete = row.opJczxTestTaskId ? [row.opJczxTestTaskId] : this.ids;
      if (!idsToDelete || idsToDelete.length === 0) {
        this.$modal.msgWarning("请选择要删除的任务");
        return;
      }
      const taskNos = row.opJczxTestTaskId ? row.sampleNo : '选中的任务'; // 简单提示
      this.$modal.confirm('是否确认删除任务编号为"' + taskNos + '"的数据项？').then(() => {
        return delTask(idsToDelete.join(',')); // 假设 delTask 支持逗号分隔的 ID 字符串
      }).then(() => {
        this.getList(); // 重新加载列表
        this.$modal.msgSuccess("删除成功");
      }).catch((err) => {
        console.error("删除失败:", err);
        // this.$modal.msgError("删除失败"); // 确认框取消时也会进入catch
      });
    },


    // 获取当前活动 Tab 对应的表格引用名称
    getCurrentTableRef() {
      if (this.activeTab === 'chemistry') {
        return 'chemTable';
      } else if (this.activeTab === 'csf') {
        return 'csfTable';
      } else if (this.activeTab === 'nir') {
        return 'nirTable';
      }
      return 'chemTable'; // 默认
    }
  }
};
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