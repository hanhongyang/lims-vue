<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" v-if="isPad" style="margin-bottom:10px"
      @click="HDPada">返回首页</el-button>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待化验" name="0">
        <el-form :model="queryParams" ref="queryForm0" size="small" :inline="true" v-show="showSearch"
          label-width="70px">
          <!-- <el-form-item label="检测项目" prop="bloodTaskItemType">
            <el-select v-model="queryParams.bloodTaskItemType" placeholder="请选择检测项目" clearable style="width: 180px">
              <el-option v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="检测人" prop="testUser">
            <el-input v-model="queryParams.testUser" placeholder="请输入检测人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item> -->
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker clearable v-model="receiveTimeRange" type="daterange" value-format="yyyy-MM-dd"
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
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="multiple" @click="beginTest()"
              :loading="beginTestLoading">开始化验</el-button>
          </el-col>
          <el-col :span="1.5">
            <!--<el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
              >导出</el-button>-->
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <div v-if="activeTab === '0' && orderedSelectedRows.length > 0" class="selection-display mb8"
          style="padding: 8px 12px; border: 1px solid #dcdfe6; border-radius: 4px; background-color: #fcfcfc;">
          <span style="font-weight: bold; margin-right: 10px; color: #606266; font-size: 13px;">
            已选 ({{ orderedSelectedRows.length }}):
          </span>
          <el-tag v-for="(item, index) in orderedSelectedRows" :key="item.entrustOrderId" closable
            @close="removeSelectedItem(item)" style="margin-right: 5px; margin-bottom: 5px;">
            {{ index + 1 }}. {{ item.entrustOrderNo }}
          </el-tag>
        </div>
        <el-table v-loading="loading" :data="taskList" ref="tablePending" row-key="entrustOrderId"
          @select="handleRowSelect" @select-all="handleSelectAll" :reserve-selection="true" height="64vh">
          <el-table-column type="selection" width="55" align="center" :selectable="canSelect"
            :reserve-selection="true" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="检测人" align="center" prop="testUser" /> -->
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="接收人" align="center" prop="receiverName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTest(scope.row)"
                :loading="beginTestLoading">开始化验</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0 && activeTab === '0'" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="已化验" name="1">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="70px">
          <el-form-item label="导入人" prop="testUser"> <el-input v-model="queryParams.testUser" placeholder="请输入导入人"
              clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="导入时间">
            <el-date-picker clearable v-model="testTimeRange" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="文件名" prop="fileName"> <el-input v-model="queryParams.fileName" placeholder="请输入文件名"
              clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="导入条数" prop="fileSize"> <el-input v-model="queryParams.fileSize" placeholder="请输入导入条数"
              clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">导入结果</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="beginTest"
              :loading="beginTestLoading">开始化验</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="taskList" ref="tableTested" @selection-change="handleSelectionChange"
          height="64vh">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="导入时间" align="center" prop="testEndTime" />
          <el-table-column label="导入人" align="center" prop="testUser" />
          <el-table-column label="导入文件名" align="center" prop="fileName" />
          <el-table-column label="导出文件名" align="center" prop="exportFileName" />
          <el-table-column label="导出条数" align="center" prop="fileSize" />
          <el-table-column label="审核结果" align="center" prop="examinePassFlag">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.is_pass" :value="scope.row.examinePassFlag" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click=" handleUpdate(scope.row)">确认</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete1(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body
      @close="handleUploadClose">
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url"
        :disabled="upload.isUploading" :before-upload="beforeUpload" :on-error="handleError" :on-exceed="handleExceed"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传一个文件，且不超过10M</div>
        <div class="el-upload__tip" slot="tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div style="margin-top: 20px; text-align: center;">
        <el-button type="primary" :loading="upload.isUploading" @click="submitUpload">
          上传到服务器
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

    </el-dialog>
  </div>
</template>
<script>
// 导入需要的 API 函数
// 假设 downloadBloodTask 需要 entrustOrderSampleId 列表
import { listTask, beginBloodTask, downloadBloodTask } from "@/api/CentralLaboratory/task";
import { getToken } from '@/utils/auth'; // 导入 getToken 用于上传

export default {
  dicts: ["blood_task_item_type", "is_pass"], // 使用血样项目字典
  name: "BloodTask",
  data() {
    return {
      activeTab: '0', // 默认激活 '待化验'
      loading: true,
      ids: [],        // 存储选中的 entrustOrderId (用于 beginTask)
      orderIds: [],  // 存储选中的 opBloodEntrustOrderId (用于 downloadTask)
      single: true,
      multiple: true, // “开始化验”按钮初始禁用 (multiple is true when !selection.length)
      showSearch: true,
      total: 0,
      taskList: [],
      beginTestLoading: false, // "开始化验" 按钮的 loading 状态
      // 新增：用于维护有序勾选
      orderedSelectedRows: [], // 按顺序存放勾选的完整行数据
      orderedSelectedIds: new Set(), // 辅助 Set，用于快速查找
      // ** 合并为一个查询参数对象 **
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bloodTaskItemType: '9', // 检测项目 (用于 tab 0)
        testUser: null,          // 检测人/导入人
        entrustDeptName: null,   // 委托单位 (用于 tab 0)
        entrustOrderNo: null,    // 委托单号 (用于 tab 0)
        entrustOrderType: '2',   // 类型：血样 (固定)
        isTest: '0',             // 状态：默认 '0' (待化验)
        // 日期范围由 handleQuery 设置
        beginReceiveTime: null,
        endReceiveTime: null,
        beginTestEndTime: null, // 对应已化验的导入时间开始
        endTestEndTime: null,   // 对应已化验的导入时间结束
        // 已化验 Tab 新增字段
        fileName: null,
        fileSize: null,
        // examinePassFlag: null // 审核结果字段仅用于显示，不用于查询
      },
      // ** 日期范围移到根级别 **
      receiveTimeRange: [], // 用于 '待化验' 的接收时间选择器
      testTimeRange: [],    // 用于 '已化验' 的导入时间选择器

      isPad: true,
      isSame: false, // 检查选中项的项目类型是否一致
      selectedRows: [], // 存储选中的完整行数据
      // 导入参数
      upload: {
        open: false,
        title: "",
        isUploading: false,
        headers: { Authorization: "Bearer " + getToken() },
        // !!请将 URL 替换为实际的血样结果导入接口!!
        url: process.env.VUE_APP_BASE_API + "/labtest/jczxBloodResult/importData"
      },
      uploadResult: {
        visible: false,
        successNum: 0,
        failureNum: 0
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.isPadPc()
  },
  methods: {
    // 不再需要 getCurrentQueryParams
    // getCurrentQueryParams() { ... },

    // 判断行是否可选 (仅在'待化验'tab且未化验时可选)
    canSelect(row) {
      return this.activeTab === '0' && !row.testUser;
    },
    // 判断设备类型
    isPadPc() {
      const device = this.$store.state.app.device;
      if (this.isHuaweiPad()) { this.isPad = true }
      else if (this.isPADDevice()) { this.isPad = true }
      else { this.isPad = false }
    },
    // Pad 返回首页
    HDPada() {
      this.$router.push('/Pad')
    },

    // 获取列表数据 (已修改)
    getList() {
      this.loading = true;
      this.queryParams.isTest = this.activeTab; // 根据当前 tab 设置 isTest

      // 准备最终发送给后端的参数 (不包含日期范围数组)
      const finalParams = { ...this.queryParams };


      listTask(finalParams).then(response => {
        this.taskList = response.rows; // 两个 tab 共用 taskList
        this.total = response.total;
        this.loading = false;
        // ** 新增：勾选状态回显 **
        // 确保 DOM 更新后，根据我们的有序列表，勾选当前页上应被选中的行
        this.$nextTick(() => {
          if (this.activeTab === '0' && this.$refs.tablePending) {
            // 找出当前页(taskList)中，哪些行在我们的“已选”列表(orderedSelectedIds)里
            const rowsToSelect = this.taskList.filter(taskRow =>
              this.orderedSelectedIds.has(taskRow.entrustOrderId)
            );
            // 遍历并设置勾选
            if (rowsToSelect.length > 0) {
              rowsToSelect.forEach(row => {
                this.$refs.tablePending.toggleRowSelection(row, true);
              });
            }
          } else if (this.activeTab === '1' && this.$refs.tableTested) {
            // "已化验" tab 保持原样，清空选择
            this.$refs.tableTested.clearSelection();
          }
        });
      }).catch(error => {
        console.error("获取列表失败:", error);
        this.loading = false;
        this.$modal.msgError("获取列表失败: " + (error?.message || '未知错误'));
      });
    },

    // 处理 tab 点击事件 (已修改)
    handleTabClick(tab) {
      this.activeTab = tab.name;
      // 清除选择状态
      this.ids = [];
      this.orderIds = [];
      this.selectedRows = [];
      this.single = true;
      this.multiple = true;
      this.isSame = false; // 重置项目一致性状态

      // ** 新增：清空有序列表 **
      this.orderedSelectedRows = [];
      this.orderedSelectedIds.clear();

      // 重置查询条件并获取新 tab 的数据
      this.resetQuery(); // resetQuery 内部会调用 handleQuery -> getList
    },

    // 处理搜索按钮点击 (已修改)
    handleQuery() {
      this.queryParams.pageNum = 1; // 重置页码

      // 根据激活的 tab 处理对应的日期范围
      if (this.activeTab === '0') {
        if (this.receiveTimeRange && this.receiveTimeRange.length === 2) {
          this.queryParams.beginReceiveTime = this.receiveTimeRange[0];
          this.queryParams.endReceiveTime = this.receiveTimeRange[1];
        } else {
          this.queryParams.beginReceiveTime = null;
          this.queryParams.endReceiveTime = null;
        }
        // 清除非当前 tab 的日期参数
        this.queryParams.beginTestEndTime = null;
        this.queryParams.endTestEndTime = null;
      } else { // activeTab === '1'
        if (this.testTimeRange && this.testTimeRange.length === 2) {
          this.queryParams.beginTestEndTime = this.testTimeRange[0];
          this.queryParams.endTestEndTime = this.testTimeRange[1];
        } else {
          this.queryParams.beginTestEndTime = null;
          this.queryParams.endTestEndTime = null;
        }
        // 清除非当前 tab 的日期参数
        this.queryParams.beginReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
      this.getList(); // 重新获取数据
    },

    // 处理重置按钮点击 (已修改)
    resetQuery() {
      // 重置表单项 (对应 ref="queryForm")
      this.resetForm("queryForm"); // 假设两个 tab 的 form 都叫 queryForm
      // 清空日期选择器 v-model 绑定的变量
      this.receiveTimeRange = [];
      this.testTimeRange = [];
      // 手动重置 queryParams 中非表单项或需要特殊处理的项
      this.queryParams.pageNum = 1;

 
      this.queryParams.testUser = null;
      this.queryParams.entrustDeptName = null;
      this.queryParams.entrustOrderNo = null;
      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.queryParams.beginTestEndTime = null;
      this.queryParams.endTestEndTime = null;
      this.queryParams.fileName = null;
      this.queryParams.fileSize = null;
      // entrustOrderType 和 isTest 会在 handleQuery/getList 中根据 activeTab 设置，无需在此重置

      this.handleQuery(); // 触发搜索，内部会设置日期并调用 getList
    },

    // 通用平板设备检测
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
    /** 专门检测华为平板 */
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase();

      // 华为平板特征检测
      const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent);
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

      // 屏幕尺寸检测（华为平板典型尺寸）
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
        (screenHeight >= 768 && screenHeight <= 1600);

      // 华为平板特有特征
      const hasEMUI = /emui/.test(userAgent);
      const isHuaweiPad = (isHuawei && isAndroidTablet) ||
        (isHuawei && isHuaweiTabletSize) ||
        (hasEMUI && isAndroidTablet);

      return isHuaweiPad;
    },
    // 处理表格多选框变化 (已修改)
    // *** 注意：此方法现在由 handleRowSelect 和 handleSelectAll 手动调用 ***
    handleSelectionChange(selection) {
      // 这里的 selection 将是我们的 this.orderedSelectedRows (带顺序)

      // 提取 ID (现在会按顺序提取)
      this.ids = selection.map(item => item.entrustOrderId);
      this.orderIds = selection.map(item => item.opBloodEntrustOrderId); // 用于下载

      this.selectedRows = selection; // this.selectedRows 现在也是有序的
      this.single = selection.length !== 1;
      this.multiple = !selection.length;

      // 检查项目类型是否一致 (逻辑保持不变)
      if (selection.length > 0) {
        const firstItemType = selection[0].bloodTaskItemType;
        this.isSame = selection.every(item => item.bloodTaskItemType === firstItemType);
        if (!this.isSame && this.activeTab === '0') {
          this.$modal.msgWarning('选中的任务包含不同的检测项目，请确保所有选中的任务项目一致才能开始化验。');
        }
      } else {
        this.isSame = false;
      }
    },

    // 开始化验按钮点击处理 (已修改)
    beginTest(row) {
      this.beginTestLoading = true; //  1. 在开始时设置 loading
      // 确定要处理的行
      const rowsToProcess = row && row.entrustOrderId ? [row] : this.selectedRows;

      if (rowsToProcess.length === 0) {
        this.$modal.msgWarning("请选择要操作的数据");
        this.beginTestLoading = false; //  // 2. 在校验失败时重置
        return;
      }

      // 提取通用信息
      const firstItem = rowsToProcess[0];
      const bloodTaskItemType = firstItem.bloodTaskItemType;
      const itemName = this.selectDictLabel(this.dict.type.blood_task_item_type, bloodTaskItemType);
      // ** 确认后端返回字段名，用于 downloadBloodTask **
      const entrustOrderIdList = rowsToProcess.map(item => item.opBloodEntrustOrderId).filter(id => id); // 用于 downloadBloodTask, 过滤掉可能为空的id

      // --- 根据 activeTab 执行不同逻辑 ---
      if (this.activeTab === '0') {
        // ** 待化验逻辑 (保持不变) **
        // 检查项目一致性
        if (!this.isSame && rowsToProcess.length > 1) { // 多选时检查 isSame
          this.$modal.msgWarning('选中的任务包含不同的检测项目，请确保所有选中的任务项目一致才能开始化验。');
          this.beginTestLoading = false; //  // 2. 在校验失败时重置
          return;
        } else if (rowsToProcess.length > 1) { // 单选时，如果传入了row，则内部比较（保险起见）
          const allSameType = rowsToProcess.every(item => item.bloodTaskItemType === bloodTaskItemType);
          if (!allSameType) {
            this.$modal.msgWarning('选中的任务包含不同的检测项目，请确保所有选中的任务项目一致才能开始化验。');
            this.beginTestLoading = false; //  // 2. 在校验失败时重置
            return;
          }
        }

        // ** 关键修改：直接使用 map，不再用 Set，以保留顺序 **
        // 确保 handleRowSelect 已经处理了重复添加，这里是安全的
        const entrustOrderIdList = rowsToProcess.map(item => item.entrustOrderId);
        // 调用 beginBloodTask 获取 resultNo
        beginBloodTask(entrustOrderIdList).then(response => {
          const resultNo = response.data.resultNo;
          // 调用下载
          this.downloadBloodExcel(entrustOrderIdList, itemName, resultNo, this.activeTab);
        }).finally(() => { // 
          this.beginTestLoading = false;
        }).catch(error => {
          console.error('开始化验失败:', error);
          this.$modal.msgError("开始化验失败: " + (error?.response?.data?.msg || error?.message || '未知错误'));
          this.beginTestLoading = false;
        });

      } else if (this.activeTab === '1') {
        // ** 已化验逻辑 (直接下载) **
        // 检查 resultNo 是否存在 (假设后端在已化验列表返回了 resultNo)
        const resultNo = firstItem.resultNo;
        if (!resultNo) {
          this.$modal.msgError("无法获取化验单号，无法导出");
          console.error("Missing resultNo in row data for '已化验' tab:", firstItem);
          this.beginTestLoading = false;
          return;
        }
        // 确认所有选中的行都有相同的 resultNo (如果支持多选导出的话)
        if (rowsToProcess.length > 1) {
          const allSameResultNo = rowsToProcess.every(item => item.resultNo === resultNo);
          if (!allSameResultNo) {
            this.$modal.msgWarning("请选择具有相同化验单号的记录进行导出");
            this.beginTestLoading = false;
            return;
          }

        }
        // 直接调用下载，传递 resultNo
        this.downloadBloodExcel(entrustOrderIdList, itemName, resultNo, this.activeTab)
          .finally(() => { // 
            this.beginTestLoading = false; // 
          });

      } else {
        console.error("未知的 activeTab:", this.activeTab);
        this.beginTestLoading = false;
      }
    },
    // *** 新增方法：处理手动勾选行 ***
    handleRowSelect(selection, row) {
      // selection 是 el-table 内部维护的跨页总列表
      // row 是当前点击的行

      // 1. 判断当前行是“勾选”还是“取消勾选”
      const isSelected = selection.some(item => item.entrustOrderId === row.entrustOrderId);

      if (isSelected) {
        // ** 勾选 **
        // 只有当它不在我们的有序列表里时，才添加
        if (!this.orderedSelectedIds.has(row.entrustOrderId)) {
          this.orderedSelectedRows.push(row);
          this.orderedSelectedIds.add(row.entrustOrderId);
        }
      } else {
        // ** 取消勾选 **
        // 从我们的有序列表中移除
        this.orderedSelectedRows = this.orderedSelectedRows.filter(item => item.entrustOrderId !== row.entrustOrderId);
        this.orderedSelectedIds.delete(row.entrustOrderId);
      }

      // 2. 手动调用 handleSelectionChange，传入我们有序的列表，更新按钮状态
      this.handleSelectionChange(this.orderedSelectedRows);
    },

    // *** 新增方法：处理“全选/全不选” ***
    handleSelectAll(selection) {
      // selection 是当前页被“全选”的行列表 (如果全不选，则为空数组)
      const currentPageRows = this.taskList; // 获取当前页的所有行

      if (selection.length > 0) {
        // ** 全选当前页 **
        // 遍历当前页被选中的行
        selection.forEach(row => {
          // 只有当它不在我们的有序列表里时，才添加
          if (!this.orderedSelectedIds.has(row.entrustOrderId)) {
            this.orderedSelectedRows.push(row);
            this.orderedSelectedIds.add(row.entrustOrderId);
          }
        });
      } else {
        // ** 全不选当前页 **
        // 遍历当前页所有行，将它们从我们的有序列表中移除
        const currentPageIds = new Set(currentPageRows.map(r => r.entrustOrderId));

        this.orderedSelectedRows = this.orderedSelectedRows.filter(row => !currentPageIds.has(row.entrustOrderId));
        // 重建 Set
        this.orderedSelectedIds = new Set(this.orderedSelectedRows.map(r => r.entrustOrderId));
      }

      // 2. 手动调用 handleSelectionChange，更新按钮状态
      this.handleSelectionChange(this.orderedSelectedRows);
    },
    // *** 新增方法：清空所有勾选状态 ***
    clearAllSelections() {
      // 1. 清空我们的有序列表和 Set
      this.orderedSelectedRows = [];
      this.orderedSelectedIds.clear();

      // 2. 清空 el-table 的内部勾选状态
      // (确保 ref="tablePending" 在 '待化验' tab 的 el-table 上)
      if (this.$refs.tablePending) {
        this.$refs.tablePending.clearSelection();
      }

      // 3. 手动调用 handleSelectionChange，更新按钮状态和 selectedRows
      this.handleSelectionChange(this.orderedSelectedRows); // 传入空数组
    },
    // *** 新增方法：处理“已选”标签的关闭按钮 ***
    removeSelectedItem(itemToRemove) {
      // 1. 从我们的有序列表和 Set 中移除
      this.orderedSelectedRows = this.orderedSelectedRows.filter(item => item.entrustOrderId !== itemToRemove.entrustOrderId);
      this.orderedSelectedIds.delete(itemToRemove.entrustOrderId);

      // 2. 通知 el-table 取消该行的勾选状态
      // (即使行在其他页面，reserve-selection 也能处理)
      if (this.$refs.tablePending) {
        this.$refs.tablePending.toggleRowSelection(itemToRemove, false);
      }

      // 3. 手动调用 handleSelectionChange，更新按钮状态
      this.handleSelectionChange(this.orderedSelectedRows);
    },
    // 封装调用下载血样表格接口 (已修改)
    // 参数改为 entrustOrderIdList
    downloadBloodExcel(entrustOrderIdList, itemName, resultNo, activeTab) {
      if (activeTab === '0') {
        return downloadBloodTask(entrustOrderIdList, null).then(response => { // 
          this.downloadFile(response, itemName, resultNo);

          // ** 关键修改：在 getList() 之前清空勾选 **
          this.clearAllSelections();

          this.getList(); // 下载成功后刷新列表
        }).catch(error => {
          console.error("下载血样表格失败:", error);
          this.$modal.msgError("文件下载失败");

          // ** 关键修改：在 getList() 之前清空勾选 **
          // (因为 beginBloodTask 已成功, 状态已变, 刷新列表前必须清空)
          this.clearAllSelections();

          this.getList(); // 下载失败也要刷新
          return Promise.reject(error); //  // 抛出错误以触发 .finally
        });
      } else if (activeTab === '1') {
        return downloadBloodTask(null, resultNo).then(response => { // 
          this.downloadFile(response, itemName, resultNo);
        }).catch(error => {
          console.error("下载血样表格失败:", error);
          this.$modal.msgError("文件下载失败");
          return Promise.reject(error); //  // 抛出错误以触发 .finally
        });
      }
      return Promise.resolve();
    },


    // 处理文件下载 (保持不变)
    downloadFile(response, itemName, resultNo) {
      if (response instanceof Blob) {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const fileName = `血样${itemName}检测表格_${resultNo}.xlsx`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('下载响应不是 Blob 类型');
        this.$modal.msgError("下载失败，响应格式不正确");
      }
    },

    // 处理作废按钮点击
    handleDelete(row) {
      // 确认后端作废接口需要的 ID (entrustOrderId? entrustOrderSampleId?)
      const idToDelete = row.entrustOrderId; // 假设用委托单ID
      this.$modal.confirm('是否确认作废委托单号为"' + row.entrustOrderNo + '"的检测任务？').then(() => {
        // TODO: 调用后端作废接口，例如 deleteTask(idToDelete)
        console.log("调用作废接口，ID:", idToDelete);
        return Promise.resolve(); // 模拟成功
      }).then(() => {
        this.$modal.msgSuccess("作废成功");
        this.getList(); // 刷新列表
      }).catch(() => { }); // 捕获取消操作或接口失败
    },
    handleDelete1(row) {
      // 确认后端作废接口需要的 ID (entrustOrderId? entrustOrderSampleId?)
      const idToDelete = row.entrustOrderId; // 假设用委托单ID
      this.$modal.confirm('是否确认作废该检测任务？').then(() => {
        // TODO: 调用后端作废接口，例如 deleteTask(idToDelete)
        console.log("调用作废接口，ID:", idToDelete);
        return Promise.resolve(); // 模拟成功
      }).then(() => {
        this.$modal.msgSuccess("作废成功");
        this.getList(); // 刷新列表
      }).catch(() => { }); // 捕获取消操作或接口失败
    },

    // 处理导出按钮点击 (已修改)
    handleExport() {
      // ** 使用若依的通用下载方法 this.download **
      const queryParams = { ...this.queryParams }; // 复制当前查询参数

      // 手动设置日期参数，因为 this.download 不会自动处理
      if (this.activeTab === '0') {
        if (this.receiveTimeRange && this.receiveTimeRange.length === 2) {
          queryParams.beginReceiveTime = this.receiveTimeRange[0];
          queryParams.endReceiveTime = this.receiveTimeRange[1];
        } else {
          queryParams.beginReceiveTime = null;
          queryParams.endReceiveTime = null;
        }
        // 清除不相关的日期
        delete queryParams.beginTestEndTime;
        delete queryParams.endTestEndTime;
      } else { // activeTab === '1'
        if (this.testTimeRange && this.testTimeRange.length === 2) {
          queryParams.beginTestEndTime = this.testTimeRange[0];
          queryParams.endTestEndTime = this.testTimeRange[1];
        } else {
          queryParams.beginTestEndTime = null;
          queryParams.endTestEndTime = null;
        }
        // 清除不相关的日期
        delete queryParams.beginReceiveTime;
        delete queryParams.endReceiveTime;
      }
      // 移除分页参数，导出通常不需要
      delete queryParams.pageNum;
      delete queryParams.pageSize;

      this.download(
        'labtest/task/export', // 确认导出接口 URL
        queryParams, // 传递处理后的查询参数
        `血样任务_${this.activeTab === '0' ? '待化验' : '已化验'}_${new Date().getTime()}.xlsx` // 文件名
      );
    },

    /** 导入按钮操作 */

    handleAdd() {

      this.upload.title = "血样检测结果导入"; // 修改标题

      this.upload.open = true;

      this.uploadResult.visible = false; // 隐藏结果

      this.$nextTick(() => {

        this.$refs.upload?.clearFiles(); // 使用可选链操作符

      });

    },

    // 文件上传中处理

    handleFileUploadProgress() {

      this.upload.isUploading = true;

    },

    // 提交上传

    submitUpload() {

      const fileList = this.$refs.upload?.uploadFiles; // 使用可选链操作符

      if (!fileList || fileList.length === 0) {

        this.$message.warning('请选择要上传的文件');

        return;

      }

      this.upload.isUploading = true;

      this.$refs.upload?.submit(); // 使用可选链操作符

    },

    // 上传失败处理

    handleError(error) {

      this.upload.isUploading = false;

      this.$message.error('上传失败: ' + (error.message || error)) // 显示更详细错误

    },

    // 文件超出限制

    handleExceed(files, fileList) {

      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + (fileList ? fileList.length : 0)} 个文件`)

    },

    // 上传前校验

    beforeUpload(file) {

      const isExcel = file.type === 'application/vnd.ms-excel' ||

        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      const isLt10M = file.size / 1024 / 1024 < 10



      if (!isExcel) {

        this.$message.error('只能上传Excel文件!')

        return false

      }

      if (!isLt10M) {

        this.$message.error('上传文件大小不能超过10MB!')

        return false

      }

      return true

    },

    // 文件上传成功处理

    handleFileSuccess(response) {

      this.upload.isUploading = false;



      if (response.code === 200) {

        this.$message.success('导入成功');

        this.upload.open = false;

        this.$refs.upload?.clearFiles(); // 使用可选链操作符



        // 显示导入结果信息 (如果后端返回了 data)

        if (response.data) {

          this.uploadResult = {

            visible: true,

            successNum: response.data.successNum || 0,

            failureNum: response.data.failureNum || 0

          };

          // 根据失败数量显示不同提示

          if (response.data.failureNum > 0) {

            this.$alert(`导入完成！成功：${response.data.successNum} 条，失败：${response.data.failureNum} 条`, '导入结果', {

              confirmButtonText: '确定'

            });

          } else {

            this.$message.success(`导入完成！成功：${response.data.successNum} 条`);

          }

        }

        this.getList(); // 刷新列表

      } else {

        this.$message.error(response.msg || '导入失败');

        this.$refs.upload?.clearFiles(); // 使用可选链操作符

      }

    },

    // 重置上传组件

    handleReset() {

      this.uploadResult.visible = false

      this.$refs.upload?.clearFiles() // 使用可选链操作符

    },

    // 对话框关闭时重置状态

    handleUploadClose() {

      this.upload.isUploading = false;

      this.$refs.upload?.clearFiles(); // 使用可选链操作符

    },
    // --- 修改按钮操作 (已化验 Tab) ---
    handleUpdate(row) {
      const resultNo = row.resultNo;
      const bloodTaskItemType = row.bloodTaskItemType; // 可能也需要项目类型

      this.$router.push({
        path: '/CentralLaboratory/bloodTaskInfo', // 确认跳转路径
        query: {
          resultNo: resultNo,
          bloodTaskItemType: bloodTaskItemType,
          t: Date.now()
        }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },
  }
};
</script>



<style lang="scss" scoped>
/* 如果需要，可以在这里添加特定于此页面的样式 */
.app-container {
  padding: 15px;
}
</style>