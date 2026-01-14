<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" v-if="isPad" style="margin-bottom:10px"
      @click="HDPada">返回首页</el-button>
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待化验" name="0">
        <el-form :model="queryParams" ref="queryForm0" size="small" :inline="true" v-show="showSearch"
          label-width="70px">
          <el-form-item label="检测项目" prop="pcrTaskItemType">
            <el-select v-model="queryParams.pcrTaskItemType" placeholder="请输入检测项目" clearable
              @keyup.enter.native="handleQuery" style="width: 180px">
              <el-option v-for="dict in dict.type.pcr_task_item_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="检测人" prop="testUser">
            <el-input v-model="queryParams.testUser" placeholder="请输入检测人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
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
        <el-table v-loading="loading" :data="taskList" ref="tablePending" row-key="uiKey"
          @select="handleRowSelect" @select-all="handleSelectAll" :reserve-selection="true" height="64vh">
          <el-table-column type="selection" width="55" align="center" :selectable="canSelect"
            :reserve-selection="true" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="检测项目" align="center" prop="pcrTaskItemType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.pcr_task_item_type" :value="scope.row.pcrTaskItemType" />
            </template>
          </el-table-column>
          <el-table-column label="检测人" align="center" prop="testUser" />
          <el-table-column label="样品数量" align="center" prop="sampleCount" />
          <el-table-column label="接收人" align="center" prop="receiverName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="beginTest(scope.row)"
                :loading="beginTestLoading">开始化验</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">作废</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
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
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="beginTest()"
              :loading="beginTestLoading">开始化验</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="taskList" ref="tableTested"
          @selection-change="handleSelectionChange_Tested" height="64vh">
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
          </el-table-column> <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click=" handleUpdate(scope.row)">确认</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">作废</el-button> -->
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
    <el-dialog title="选择模板类型" :visible.sync="templateDialogVisible" width="300px" append-to-body
      :close-on-click-modal="false">
      <el-form :model="templateForm" ref="templateForm" label-width="80px">
        <el-form-item label="模板" prop="blTemplateType">
          <el-radio-group v-model="templateForm.blTemplateType">
            <el-radio label="1">TIANLONG (中文)</el-radio>
            <el-radio label="2">Mx3005P (英文)</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleTemplateConfirm">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listTask, beginPcrTask, downloadPcrTask, savePcrResultInfoList } from "@/api/CentralLaboratory/task";
import { getToken } from '@/utils/auth' // 导入 getToken

export default {
  dicts: ["pcr_task_item_type", "is_pass"],
  name: "Task",
  data() {
    return {
      // 激活的标签页
      activeTab: '0',
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
      // 新增：用于维护有序勾选
      orderedSelectedRows: [], // 按顺序存放勾选的完整行数据
      orderedSelectedIds: new Set(), // 辅助 Set，用于快速查找 (使用 entrustOrderId)
      // 查询参数 (已修改)
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pcrTaskItemType: null,
        testUser: null,
        sampleName: null,
        invbillName: null,
        sampleNo: null,
        entrustDeptName: null,
        entrustOrderNo: null,
        beginReceiveTime: null, // 接收时间开始
        endReceiveTime: null,   // 接收时间结束
        // *** MODIFIED HERE ***
        beginTestEndTime: null, // 导入时间开始
        endTestEndTime: null,   // 导入时间结束
        // *********************
        entrustOrderType: '3', // 委托单类型，"1", "饲料","2", "血样","3", "PCR"
        isTest: '0',
        fileName: null, // 新增：文件名
        fileSize: null  // 新增：导入条数
      },
      receiveTimeRange: [],
      testTimeRange: [],
      isPad: true,
      // ** 修复：isSame 在未选择时应为 true (代表"无冲突") **
      isSame: true,
      selectedRows: [], // 新增，保存选中的行
      // 导入参数 (从 index.vue 复制)
      upload: {
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/labtest/jczxPcrResult/importData"
      },
      uploadResult: {
        visible: false,
        successNum: 0,
        failureNum: 0
      },
      beginTestLoading: false,
      // --- 新增：模板弹窗状态 ---
      templateDialogVisible: false,
      templateForm: {
        blTemplateType: '1', // 默认中文
      },
      // 用于暂存 "开始化验" 的数据
      pendingTestData: null
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    this.isPadPc()
  },
  methods: {
    canSelect(row) {
      return !row.testUser;   // 有值时返回 false，即禁用
    },
    isPadPc() {
      // 使用若依的设备检测
      const device = this.$store.state.app.device;
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
        // PC端保持原逻辑

      }
    },
    HDPada() {
      this.$router.push('/Pad')
    },
    /** 查询检测中心检测任务列表 */
    getList() {
      this.loading = true;
      this.queryParams.isTest = this.activeTab;

      const requestMethod = listTask; // 两个tab都用 listTask
      requestMethod(this.queryParams).then(response => {


        // 前端手动生成一个唯一的 uiKey (组合ID + 类型 + 索引)
        this.taskList = response.rows.map((item, index) => {
          return {
            ...item,
            // 构造唯一标识：ID_类型_索引
            uiKey: `${item.entrustOrderId}_${item.pcrTaskItemType || ''}_${index}`
          };
        });

        this.total = response.total;
        this.loading = false;

        // ** 新增：勾选状态回显 **
        this.$nextTick(() => {
          if (this.activeTab === '0' && this.$refs.tablePending) {
            // 找出当前页(taskList)中，哪些行在我们的“已选”列表(orderedSelectedIds)里
            // 注意：这里业务逻辑依然判断 entrustOrderId 即可
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
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // 处理日期范围
      if (this.receiveTimeRange && this.receiveTimeRange.length === 2) {
        if (this.activeTab === '0') {
          // 待化验 (isTest: '0') 过滤接收时间
          this.queryParams.beginReceiveTime = this.receiveTimeRange[0];
          this.queryParams.endReceiveTime = this.receiveTimeRange[1];
          this.queryParams.beginTestEndTime = null;
          this.queryParams.endTestEndTime = null;
        }
      } else {
        this.queryParams.beginReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }

      // (activeTab === '1' 的日期处理)
      if (this.testTimeRange && this.testTimeRange.length === 2) {
        if (this.activeTab === '1') {
          // 已化验 (isTest: '1') 过滤导入时间 (即 testEndTime)
          this.queryParams.beginTestEndTime = this.testTimeRange[0];
          this.queryParams.endTestEndTime = this.testTimeRange[1];
          this.queryParams.beginReceiveTime = null;
          this.queryParams.endReceiveTime = null;
        }
      } else {
        this.queryParams.beginTestEndTime = null;
        this.queryParams.endTestEndTime = null;
      }

      this.queryParams.pageNum = 1;
      this.getList();
    },


    /** 重置按钮操作 (已修改) */
    resetQuery() {
      // ** 修复：根据 activeTab 重置对应的表单 **
      if (this.activeTab === '0') {
        this.resetForm("queryForm0"); // "待化验" 表单
      } else {
        this.resetForm("queryForm");  // "已化验" 表单
      }
      this.receiveTimeRange = [];
      this.testTimeRange = [];
      this.queryParams.pageNum = 1;
      this.queryParams.beginReceiveTime = null;
      this.queryParams.pcrTaskItemType = null;
      this.queryParams.endReceiveTime = null;
      this.queryParams.beginTestEndTime = null;
      this.queryParams.endTestEndTime = null;
      this.queryParams.entrustDeptName = null;
      this.queryParams.entrustOrderNo = null;
      this.queryParams.fileName = null;
      this.queryParams.fileSize = null;
      this.handleQuery();
    },
    /** tab 点击事件 */
    handleTabClick(tab) {
      this.activeTab = tab.name;
      // 清除选择状态
      this.isSame = true;
      this.selectedRows = [];
      this.ids = [];
      this.single = true;
      this.multiple = true;

      // ** 修复语法错误，并移到 data() { return { ... } } 中 **
      this.beginTestLoading = false;

      // ** 新增：清空有序列表 **
      this.orderedSelectedRows = [];
      this.orderedSelectedIds.clear();

      // 重置查询条件
      this.resetQuery();
    },
    /** 通用平板检测 */
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

    // 多选框选中数据
    handleSelectionChange_Tested(selection) {
      this.ids = selection.map(item => item.entrustOrderId)
      this.single = selection.length !== 1 // 使用标准逻辑
      this.multiple = !selection.length
      this.selectedRows = selection
      // ... "已化验" tab 不需要 isSame 检查，可以简化 ...
    },
    // *** 新增：用于 "待化验" Tab 的 HhandleSelectionChange (手动调用) ***
    handleSelectionChange(selection) {
      // 1. 基础状态更新
      this.ids = selection.map(item => item.entrustOrderId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRows = selection;

      // 2. 冲突检测逻辑
      if (selection.length > 1) {
        // 获取第一个选中项的项目类型，转为字符串，处理 null/undefined 为空串
        const firstType = String(selection[0].pcrTaskItemType || '');

        // 查找是否存在与第一项不一致的数据
        const hasDiff = selection.some(item => {
          const currentType = String(item.pcrTaskItemType || '');
          return currentType !== firstType;
        });

        if (hasDiff) {
          this.isSame = false;

          // 弹出提示
          this.$confirm('检测到您勾选了不同的检测项目！\n为了保证化验流程规范，请确保勾选的委托单属于同一检测项目。', '项目冲突提示', {
            confirmButtonText: '我知道了',
            showCancelButton: false, // 这种错误通常强制用户修正，不需要取消按钮
            type: 'warning',
            center: true
          }).then(() => {
            // (可选优化) 在这里可以自动取消刚才勾选的那一行，但这需要知道刚才操作的是哪一行。
            // 简单的做法是保留当前状态，让用户自己去取消。
          }).catch(() => { });

        } else {
          this.isSame = true;
        }
      } else {
        // 选中0个或1个时，默认为一致
        this.isSame = true;
      }
    },
    /** 开始化验操作 */
    beginTest(row) {
      this.beginTestLoading = true;

      // 确定要处理的行 - 修复逻辑
      let rowsToProcess = [];
      if (row) {
        // 行内按钮点击：直接使用当前行
        rowsToProcess = [row];
      } else {
        // 顶部按钮点击：使用选中的行
        rowsToProcess = this.selectedRows;
      }

      if (rowsToProcess.length === 0) {
        this.$modal.msgWarning("请选择要操作的数据");
        this.beginTestLoading = false;
        return;
      }

      // 提取通用信息
      const firstItem = rowsToProcess[0];
      const pcrTaskItemType = firstItem.pcrTaskItemType;
      const itemName = this.selectDictLabel(this.dict.type.pcr_task_item_type, pcrTaskItemType);
      const entrustOrderNoList = rowsToProcess.map(item => item.entrustOrderNo);
      const resultNo = firstItem.resultNo; // 用于"已化验"


      // '7' 是 8联。假设 '5' 是4联，'6' 是7联
      const needTemplateTypes = ['7', '5', '6']; // <--- 请修改这里的 '4', '5' 为实际值

      // 检查是否属于需要选择模板（中文/英文）的类型
      if (needTemplateTypes.includes(pcrTaskItemType)) {
        // 1. 暂存数据
        this.pendingTestData = {
          rowsToProcess,
          pcrTaskItemType,
          itemName,
          entrustOrderNoList,
          resultNo,
          activeTab: this.activeTab,
          row: row // 暂存 row 状态，用于判断是单行还是批量
        };
        // 2. 重置选项并打开弹窗
        // 后端逻辑：1=中文(TIANLONG), 2=英文(Mx3005P)
        this.templateForm.blTemplateType = '1';
        this.templateDialogVisible = true;
        this.beginTestLoading = false; // 停止 loading，等待用户选择
        return; // 中断执行，等待弹窗回调
      }
      // 【关键修改结束】

      // --- (如果不是上述类型, 执行原逻辑) ---
      // (但需要指定 blTemplateType 为 null)
      this.proceedWithBeginTest(rowsToProcess, pcrTaskItemType, itemName, entrustOrderNoList, resultNo, this.activeTab, row, null);
    },

    // *** 新增方法：处理模板选择确认 ***
    handleTemplateConfirm() {
      const {
        rowsToProcess,
        pcrTaskItemType,
        itemName,
        entrustOrderNoList,
        resultNo,
        activeTab,
        row
      } = this.pendingTestData;

      const blTemplateType = this.templateForm.blTemplateType;

      this.templateDialogVisible = false;
      this.pendingTestData = null;
      this.beginTestLoading = true; // 重新开始 loading

      // 调用重构后的"开始化验"主逻辑
      this.proceedWithBeginTest(rowsToProcess, pcrTaskItemType, itemName, entrustOrderNoList, resultNo, activeTab, row, blTemplateType);
    },
    // *** 新增方法：执行"开始化验"的主逻辑 ***
    proceedWithBeginTest(rowsToProcess, pcrTaskItemType, itemName, entrustOrderNoList, resultNo, activeTab, row, blTemplateType) {

      if (activeTab === '0') {
        // ** 待化验逻辑 **
        let checkIsSame = !row;
        if (checkIsSame && !this.isSame) {
          this.$modal.msgWarning('选中检验项目下存在不同项目，请确保所有选中的任务项目一致才能开始化验。');
          this.beginTestLoading = false;
          return;
        }

        // (!! 关键修改：构造 DTO !!)
        const dto = {
          entrustOrderNoList: entrustOrderNoList,
          pcrTaskItemType: pcrTaskItemType,
          blTemplateType: blTemplateType // (!! 必须包含此字段 !!)
        };

        // (!! 关键修改：传入 DTO !!)
        beginPcrTask(dto).then(response => {
          const newResultNo = response.data.resultNo;

          this.downloadPcrExcel(entrustOrderNoList, pcrTaskItemType, itemName, newResultNo, activeTab, blTemplateType);
          // (loading 移到 downloadPcrExcel 中关闭)
        }).catch(error => {
          console.error('开始化验失败:', error);
          this.$modal.msgError("开始化验失败: " + (error?.response?.data?.msg || error?.message || '未知错误'));
          this.beginTestLoading = false;
        });

      } else if (activeTab === '1') {
        // ** 已化验逻辑 (直接下载) **
        if (!resultNo) {
          // (保持原有校验)
          this.$modal.msgError("无法获取化验单号，无法导出");
          this.beginTestLoading = false;
          return;
        }

        // (!! 修改 !!) 直接调用下载，传递 blTemplateType
        this.downloadPcrExcel(entrustOrderNoList, pcrTaskItemType, itemName, resultNo, activeTab, blTemplateType).finally(() => {
          this.beginTestLoading = false;
        });

      } else {
        console.error("未知的 activeTab:", this.activeTab);
        this.beginTestLoading = false;
      }
    },

    handleUpdate(row) {
      const resultNo = row.resultNo;
      const pcrTaskItemType = row.pcrTaskItemType;
      // (!! 新增 !!) 获取 blTemplateType。
      // (注意: 这要求 listTask 的 "已化验" 查询必须返回 blTemplateType 字段)
      const blTemplateType = row.blTemplateType;

      this.$router.push({
        path: '/CentralLaboratory/pcrTaskInfo',
        query: {
          resultNo: resultNo,
          pcrTaskItemType: pcrTaskItemType,
          blTemplateType: blTemplateType, // (!! 新增 !!) 传递给 info 页面
          t: Date.now()
        }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },

    /** 下载PCR Excel文件 */
    downloadPcrExcel(entrustOrderNoList, pcrTaskItemType, itemName, resultNo, activeTab, blTemplateType) { // 1. 添加入参
      console.log('downloadPcrTask, templateType:', blTemplateType);
      // (!! 关键修改：构造 DTO !!)
      const dto = {
        entrustOrderNoList: entrustOrderNoList,
        pcrTaskItemType: pcrTaskItemType,
        resultNo: resultNo,
        blTemplateType: blTemplateType // (!! 必须包含此字段 !!)
      };
      if (activeTab === '0') {
        console.log('待化验下载');
        // 2. 修改 downloadPcrTask 调用 (第4个参数是 blTemplateType)
        downloadPcrTask(dto).then(response => {
          this.downloadFile(response, itemName, resultNo);
          this.$modal.msgSuccess(`开始化验成功`);
          this.clearAllSelections();
          this.getList();
          this.beginTestLoading = false;
        }).catch(error => {
          this.$modal.msgError("文件下载失败");
          this.clearAllSelections();
          this.getList();
        });
      } else if (activeTab === '1') {
        downloadPcrTask(dto).then(response => {
          this.downloadFile(response, itemName, resultNo);
        }).catch(error => {
          this.$modal.msgError("文件下载失败");
        });
      }
    },
    // *** 新增方法：处理手动勾选行 ***
    handleRowSelect(selection, row) {
      const isSelected = selection.some(item => item.entrustOrderId === row.entrustOrderId);

      if (isSelected) {
        // ** 新增预检查逻辑 **
        if (this.orderedSelectedRows.length > 0) {
          // 取出已选列表的第一个作为基准
          const baseType = String(this.orderedSelectedRows[0].pcrTaskItemType || '');
          const currentType = String(row.pcrTaskItemType || '');

          if (baseType !== currentType) {
            this.$message.warning(`不能选择该行！它属于[${this.selectDictLabel(this.dict.type.pcr_task_item_type, row.pcrTaskItemType)}]，而您已选的项目是[${this.selectDictLabel(this.dict.type.pcr_task_item_type, this.orderedSelectedRows[0].pcrTaskItemType)}]`);

            // 关键：让表格取消这一行的勾选视觉效果
            this.$refs.tablePending.toggleRowSelection(row, false);
            return; // 阻断，不加入 orderedSelectedRows
          }
        }

        // 如果检查通过，再加入列表
        if (!this.orderedSelectedIds.has(row.entrustOrderId)) {
          this.orderedSelectedRows.push(row);
          this.orderedSelectedIds.add(row.entrustOrderId);
        }
      } else {
        // 取消勾选逻辑不变
        this.orderedSelectedRows = this.orderedSelectedRows.filter(item => item.entrustOrderId !== row.entrustOrderId);
        this.orderedSelectedIds.delete(row.entrustOrderId);
      }

      // 调用通用的 change 方法更新按钮状态
      this.handleSelectionChange(this.orderedSelectedRows);
    },

    // *** 新增方法：处理“全选/全不选” ***
    handleSelectAll(selection) {
      // selection 是当前页被“全选”的行列表 (如果全不选，则为空数组)
      const currentPageRows = this.taskList; // 获取当前页的所有行

      if (selection.length > 0) {
        // ** 全选当前页 **
        selection.forEach(row => {
          if (!this.orderedSelectedIds.has(row.entrustOrderId)) {
            this.orderedSelectedRows.push(row);
            this.orderedSelectedIds.add(row.entrustOrderId);
          }
        });
      } else {
        // ** 全不选当前页 **
        const currentPageIds = new Set(currentPageRows.map(r => r.entrustOrderId));

        this.orderedSelectedRows = this.orderedSelectedRows.filter(row => !currentPageIds.has(row.entrustOrderId));
        // 重建 Set
        this.orderedSelectedIds = new Set(this.orderedSelectedRows.map(r => r.entrustOrderId));
      }

      // 2. 手动调用 handleSelectionChange，更新按钮状态和 isSame
      this.handleSelectionChange(this.orderedSelectedRows);
    },

    // *** 新增方法：处理“已选”标签的关闭按钮 ***
    removeSelectedItem(itemToRemove) {
      // 1. 从我们的有序列表和 Set 中移除
      this.orderedSelectedRows = this.orderedSelectedRows.filter(item => item.entrustOrderId !== itemToRemove.entrustOrderId);
      this.orderedSelectedIds.delete(itemToRemove.entrustOrderId);

      // 2. 通知 el-table 取消该行的勾选状态
      if (this.$refs.tablePending) {
        this.$refs.tablePending.toggleRowSelection(itemToRemove, false);
      }

      // 3. 手动调用 handleSelectionChange，更新按钮状态和 isSame
      this.handleSelectionChange(this.orderedSelectedRows);
    },

    // *** 新增方法：清空所有勾选状态 ***
    clearAllSelections() {
      // 1. 清空我们的有序列表和 Set
      this.orderedSelectedRows = [];
      this.orderedSelectedIds.clear();

      // 2. 清空 el-table 的内部勾选状态
      if (this.$refs.tablePending) {
        this.$refs.tablePending.clearSelection();
      }

      // 3. 手动调用 handleSelectionChange，更新按钮状态
      this.handleSelectionChange(this.orderedSelectedRows); // 传入空数组
    },
    downloadFile(response, itemName, resultNo) {
      if (response instanceof Blob) {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const lastNineDigits = String(resultNo).slice(-9);
        const fileName = `PCR${itemName}检测表格_${lastNineDigits}.xlsx`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('响应不是文件流格式');
      }
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('labtest/task/export', {
        ...this.queryParams
      }, `task_${new Date().getTime()}.xlsx`)
    },
    // 导入功能相关方法 (START)
    /** 导入按钮操作 (从 pcrResultBase 复制) */
    handleAdd() {
      this.upload.title = "PCR检测结果导入";
      this.upload.open = true;
      this.uploadResult.visible = false; // 隐藏结果
      // 添加：清空之前的文件
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles();
        }
      });
    },
    // 文件上传中处理 (从 pcrResultBase 复制)
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    // 提交上传 (从 pcrResultBase 复制)
    submitUpload() {
      const fileList = this.$refs.upload.uploadFiles;
      if (fileList.length === 0) {
        this.$message.warning('请选择要上传的文件');
        return;
      }
      this.upload.isUploading = true;
      this.$refs.upload.submit();
    },

    // 上传失败处理 (从 pcrResultBase 复制)
    handleError(error) {
      this.upload.isUploading = false;
      this.$message.error('上传失败: ' + error)
    },

    // 文件超出限制 (从 pcrResultBase 复制)
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 上传前校验 (从 pcrResultBase 复制)
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
    // 文件上传成功处理 (从 pcrResultBase 复制)
    handleFileSuccess(response) {
      this.upload.isUploading = false;

      // 添加响应状态判断
      if (response.code === 200) {
        this.$message.success('导入成功');
        this.upload.open = false;
        this.$refs.upload.clearFiles();

        // 显示导入结果信息
        if (response.data) {
          this.uploadResult = {
            visible: true,
            successNum: response.data.successNum || 0,
            failureNum: response.data.failureNum || 0
          };

          // 根据后端返回数据显示相应信息
          if (response.data.failureNum > 0) {
            this.$alert(`导入完成！成功：${response.data.successNum} 条，失败：${response.data.failureNum} 条`, '导入结果', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          } else {
            this.$message.success(`导入完成！成功：${response.data.successNum} 条`);
          }
        }

        // 刷新列表
        this.getList();
      } else {
        this.$message.error(response.msg || '导入失败');
        this.$refs.upload.clearFiles();
      }
    },
    // 重置 (从 pcrResultBase 复制)
    handleReset() {
      this.uploadResult.visible = false
      this.$refs.upload.clearFiles()
    },

    // 对话框关闭时重置状态 (从 pcrResultBase 复制)
    handleUploadClose() {
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },
    // 导入功能相关方法 (END)
  }
};
</script>

<style lang="scss" scoped>
/* 仅平板生效 */
html.is-pad {
  .app-container {
    padding: 0 15px 0;
    margin: 5px 15px 0;
    height: 600px;
  }


}

/* PC 时这些规则不存在，自然恢复为 0 */
</style>