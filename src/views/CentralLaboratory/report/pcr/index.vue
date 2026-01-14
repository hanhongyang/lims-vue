<template>
  <div class="app-container">

    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane label="待发送" name="pending"></el-tab-pane>
      <el-tab-pane label="已发送" name="sent"></el-tab-pane>
    </el-tabs>

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="委托单号" prop="entrustOrderNo">
        <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检测项目" prop="pcrTaskItemType">
        <el-select v-model="queryParams.pcrTaskItemType" placeholder="请输入检测项目" clearable
          @keyup.enter.native="handleQuery" style="width: 180px">
          <el-option v-for="dict in dict.type.pcr_task_item_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="委托单位" prop="entrustDeptName">
        <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检测时间">
        <el-date-picker v-model="daterangeTestTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
          range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-s-promotion" size="mini" :disabled="multiple"
          @click="openBatchEmailDialog" v-if="activeTabName === 'pending'">
          批量发送 ({{ selectedRows.length }})
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="jczxPcrReportBaseIdList" row-key="opPcrEntrustOrderId"
      @selection-change="handleSelectionChange" height="61vh">
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true" />
      <el-table-column label="委托单号" align="center" prop="entrustOrderNo" min-width="160" />
      <el-table-column label="检测项目" align="center" prop="pcrTaskItemType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.pcr_task_item_type" :value="scope.row.pcrTaskItemType" />
        </template>
      </el-table-column>
      <el-table-column label="委托单位" align="center" prop="entrustDeptName" min-width="180" />
      <el-table-column label="样品数量" align="center" prop="sampleQuantity" />
      <el-table-column label="检测时间" align="center" prop="testTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.testTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="检测人" align="center" prop="testUser" min-width="100" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="280">
        <template slot-scope="scope">
          <el-button style="font-size: 14px;" size="mini" type="text" icon="el-icon-view"
            @click="handleDetail(scope.row)">详情</el-button>
          <el-button style="font-size: 14px;" size="mini" type="text" icon="el-icon-download"
            @click="handleDownload(scope.row)">下载报告</el-button>

          <el-button v-if="activeTabName === 'pending'" style="font-size: 14px;" size="mini" type="text"
            icon="el-icon-s-promotion" @click="openEmailDialog(scope.row)">发送报告</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <el-dialog title="选择发送邮箱" :visible.sync="emailDialogVisible" width="800px" :close-on-click-modal="false"
      @close="handleEmailDialogClose">
      <div class="email-dialog-content">
        <el-table ref="emailTable" :data="emailList" v-loading="emailLoading"
          @selection-change="handleEmailSelectionChange" style="width: 100%" max-height="400">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="用户名称" prop="userName" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.userName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱地址" prop="email" align="center" min-width="200">
            <template slot-scope="scope">
              <el-tag type="info" size="small">{{ scope.row.email }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSend" :loading="sendLoading" size="small"
          :disabled="selectedEmails.length === 0">
          {{ sendLoading ? '发送中...' : '确 定 发 送' }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="detailTitle" :visible.sync="detailDialogVisible" width="1200px" append-to-body>
      <el-table v-loading="detailLoading" :data="detailList" border stripe height="500">
        <el-table-column label="提取试剂盒批号" prop="tqsjh" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="扩增试剂盒批号" prop="kzsjh" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span v-if="!['空白样', '阳性对照', '阴性对照'].includes(scope.row.sampleNo)">
              {{ scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="所属牧场" prop="entrustDeptName" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="样品名称" prop="invbillName" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="样品描述" prop="name" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="委托备注" prop="remark" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="样品编号" prop="sampleNo" min-width="140" align="center" show-overflow-tooltip />

        <el-table-column v-for="item in dynamicColumns" :key="item" :label="item" align="center" min-width="100">
          <template slot-scope="scope">
            <span :class="getResultClass(scope.row.results[item])">
              {{ scope.row.results[item] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import {
  listjczxPcrReportBaseId,
  previewPcrReport,
  downloadPcrReport,
  sendPcrReport,// 确保导入发送报告接口
  emailList,
  getReportDetail,
  sendPcrReports
} from "@/api/CentralLaboratory/jczxPCRReport";


export default {
  name: "JczxPcrReportBaseId",
  dicts: ['entrust_order_status', 'pcr_task_item_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中ID数组（原有）
      ids: [],
      // 新增：选中的完整行数据（用于构造发送参数）
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用（无选中时为true，控制按钮禁用）
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      jczxPcrReportBaseIdList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      daterangeReceiveTime: [],
      daterangeTestTime: [],
      daterangeExamineTime: [],

      // 新增：Tab 页控制
      activeTabName: 'pending', // 默认激活 'pending' (待发送)
      // 跨页选中相关
      ids: [],
      selectedRows: [],
      single: true,
      multiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: null,
        entrustDeptName: null,
        receiveTime: null,
        testTime: null,
        // 修改：默认状态为 '4' (待发送)
        status: '4',
        pcrTaskItemType: null
      },
      // 邮箱弹窗相关
      emailDialogVisible: false,
      emailLoading: false,
      sendLoading: false,
      emailList: [], // 邮箱列表数据
      selectedEmails: [], // 选中的邮箱列表
      sendList: [],

      // === 新增详情弹窗相关变量 ===
      detailDialogVisible: false,
      detailLoading: false,
      detailTitle: "",
      detailList: [], // 表格数据
      dynamicColumns: [], // 动态表头（检测项目名称）
      plfs: false, // 批量发送标志
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 新增：Tab 点击事件 */
    handleTabClick(tab, event) {
      // tab.name 即为 'pending' 或 'sent'
      if (tab.name === 'pending') {
        this.queryParams.status = '4';
      } else {
        this.queryParams.status = '5';
      }
      // 切换 Tab 后，重置页码为 1 并重新查询
      this.clearSelection();
      this.handleQuery();
    },

    /** 全选邮箱 */
    selectAllEmails() {
      this.$nextTick(() => {
        if (this.$refs.emailTable && this.emailList.length > 0) {
          // 确保表格数据已经渲染完成
          setTimeout(() => {
            this.$refs.emailTable.toggleAllSelection();
          }, 100);
        }
      });
    },
    /** 打开发送邮箱选择弹窗 */
    /** 批量发送 - 打开邮箱选择弹窗 */
    openBatchEmailDialog() {
      this.plfs = true
      if (this.selectedRows.length === 0) {
        this.$message.warning('请先选择要发送的报告');
        return;
      }

      // 构造发送列表
      this.sendList = this.selectedRows.map(item => ({
        entrustOrderNo: item.entrustOrderNo,
        opPcrEntrustOrderId: item.opPcrEntrustOrderId,
        pcrTaskItemType: item.pcrTaskItemType
      }));

      this.emailDialogVisible = true;
      this.emailLoading = true;

      // 批量发送时，可以取第一条的邮箱列表，或者合并所有邮箱
      const firstOrderId = this.selectedRows[0].opPcrEntrustOrderId;

      emailList(firstOrderId).then(response => {
        this.emailList = response.data || [];
        this.emailLoading = false;

        if (this.emailList.length === 0) {
          this.$message.warning('未找到可用的邮箱地址');
        } else {
          this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
          this.selectAllEmails();
        }
      }).catch(error => {
        this.emailLoading = false;
        this.$message.error('加载邮箱列表失败');
      });
    },
    /** 打开发送邮箱选择弹窗 */
    openEmailDialog(row) {
      this.plfs = false
      if (row) {
        this.sendList = [{
          entrustOrderNo: row.entrustOrderNo,
          opPcrEntrustOrderId: row.opPcrEntrustOrderId,
          pcrTaskItemType: row.pcrTaskItemType
        }];
      } else {
        // 验证是否有选中的数据
        if (!this.sendList || this.sendList.length === 0) {
          this.$message.warning('请先选择要发送的报告数据');
          return;
        }
        console.log(this.selectedRows, '2')
        this.sendList = this.selectedRows.map(item => ({
          entrustOrderNo: item.entrustOrderNo,
          opPcrEntrustOrderId: item.opPcrEntrustOrderId,
          pcrTaskItemType: item.pcrTaskItemType
        }));
      }
      console.log(this.sendList, '3')
      this.emailDialogVisible = true;
      this.emailLoading = true;

      // 调用邮箱列表接口
      emailList(row.opPcrEntrustOrderId).then(response => {
        this.emailList = response.data || [];
        this.emailLoading = false;

        console.log(response, '响应数据');

        console.log(this.emailList, '邮箱列表');

        if (this.emailList.length === 0) {
          this.$message.warning('未找到可用的邮箱地址');
        } else {
          this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
          // 数据加载完成后自动全选
          this.selectAllEmails();
        }
      }).catch(error => {
        this.emailLoading = false;
        console.error('加载邮箱列表失败:', error);
        this.$message.error('加载邮箱列表失败');
      });

    },
    // openEmailDialog() {
    //   // 验证是否有选中的数据
    //   // if (!this.sendList || this.sendList.length === 0) {
    //   //   this.$message.warning('请先选择要发送的报告数据');
    //   //   return;
    //   // }

    //   this.emailDialogVisible = true;
    //   this.emailLoading = true;

    //   // 调用邮箱列表接口
    //   emailList().then(response => {
    //     this.emailList = response.rows || [];
    //     this.emailLoading = false;
    //     if (this.emailList.length === 0) {
    //       this.$message.warning('未找到可用的邮箱地址');
    //     } else {
    //       this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
    //     }
    //   }).catch(error => {
    //     this.emailLoading = false;
    //     console.error('加载邮箱列表失败:', error);
    //     this.$message.error('加载邮箱列表失败');
    //   });
    // },
    /** 邮箱选择变化 */
    handleEmailSelectionChange(selection) {
      this.selectedEmails = selection;
    },

    /** 移除选中的邮箱 */
    removeSelectedEmail(email) {
      const index = this.selectedEmails.findIndex(item => item.email === email.email);
      if (index > -1) {
        this.selectedEmails.splice(index, 1);
      }
    },


    /** 处理发送 */
    handleSend() {
      if (this.selectedEmails.length === 0) {
        this.$message.warning('请选择至少一个收件邮箱');
        return;
      }
      if (this.plfs) {
        // 准备发送数据
        const sendData = this.sendList.map(item => (
          {
            entrustOrderNo: item.entrustOrderNo, // 必须字段
            opPcrEntrustOrderId: item.opPcrEntrustOrderId, // 必须字段
            pcrTaskItemType: item.pcrTaskItemType // 新增字段
          }
        ));
        const emailsList = []
        this.sendList.forEach(item => {
          emailsList.push({
            opJczxPcrReportBase: [{
              entrustOrderNo: item.entrustOrderNo, // 必须字段
              opPcrEntrustOrderId: item.opPcrEntrustOrderId, // 必须字段
              pcrTaskItemType: item.pcrTaskItemType // 新增字段
            }],
            emails: this.selectedEmails.map(email => email.email).join(',')
          })
        })
        console.log(emailsList, '1')
        sendPcrReports(emailsList).then((res) => {
          this.sendLoading = false;
          if (res.code === 200) {
            this.$message.success('报告发送成功');
            // 关闭弹窗
            this.emailDialogVisible = false;
            // 清空选择
            this.sendList = [];
            this.selectedEmails = [];
            // 刷新列表
            this.getList();
          } else {
            this.$message.error(res.msg || '发送失败');
          }
        }).catch(error => {
          this.sendLoading = false;
          console.error('发送失败:', error);
          this.$message.error('发送失败: ' + (error.message || '未知错误'));
        });
      } else {
        // 准备发送数据
        const sendData = this.sendList.map(item => (
          {
            entrustOrderNo: item.entrustOrderNo, // 必须字段
            opPcrEntrustOrderId: item.opPcrEntrustOrderId, // 必须字段
            pcrTaskItemType: item.pcrTaskItemType // 新增字段
          }
        ));
        console.log(sendData, '2')
        // emails: this.selectedEmails.map(email => email.email).join(',') // 邮箱地址用逗号分隔
        const fsdx = {
          opJczxPcrReportBase: sendData,
          emails: this.selectedEmails.map(email => email.email).join(',')
        }
        console.log('发送数据:', fsdx);

        this.sendLoading = true;
        sendPcrReport(fsdx).then((res) => {
          this.sendLoading = false;
          if (res.code === 200) {
            this.$message.success('报告发送成功');
            // 关闭弹窗
            this.emailDialogVisible = false;
            // 清空选择
            this.sendList = [];
            this.selectedEmails = [];
            // 刷新列表
            this.getList();
          } else {
            this.$message.error(res.msg || '发送失败');
          }
        }).catch(error => {
          this.sendLoading = false;
          console.error('发送失败:', error);
          this.$message.error('发送失败: ' + (error.message || '未知错误'));
        });
      }
    },

    /** 邮箱弹窗关闭处理 */
    handleEmailDialogClose() {
      this.selectedEmails = [];
      this.emailLoading = false;
      this.sendLoading = false;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};

      // 处理日期范围
      if (null != this.daterangeReceiveTime && '' != this.daterangeReceiveTime) {
        this.queryParams["beginReceiveTime"] = this.daterangeReceiveTime[0];
        this.queryParams["endReceiveTime"] = this.daterangeReceiveTime[1];
      }

      if (null != this.daterangeExamineTime && '' != this.daterangeExamineTime) {
        this.queryParams["beginExamineTime"] = this.daterangeExamineTime[0];
        this.queryParams["endExamineTime"] = this.daterangeExamineTime[1];
      }
      // 优化检测时间处理逻辑
      if (this.daterangeTestTime && this.daterangeTestTime.length > 0) {
        this.queryParams["begintestTime"] = this.daterangeTestTime[0];
        this.queryParams["endtestTime"] = this.daterangeTestTime[1];
      } else {
        // 增加 else 分支：当日期为空时，强制清空查询参数
        this.queryParams["begintestTime"] = null;
        this.queryParams["endtestTime"] = null;
      }
      // getList 方法现在会根据 this.queryParams.status (由 Tab 切换设置) 来获取数据
      listjczxPcrReportBaseId(this.queryParams).then(response => {
        this.jczxPcrReportBaseIdList = response.rows;
        // this.sendList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      // 1. 清空 UI 控件绑定的数组
      this.daterangeReceiveTime = [];
      this.daterangeTestTime = [];
      this.daterangeExamineTime = [];

      // 2. 显式清空 queryParams 中的具体时间字段
      // 注意：必须操作 queryParams 对象下的属性，而不是 this 下的属性
      this.queryParams.begintestTime = null;
      this.queryParams.endtestTime = null;

      this.queryParams.beginExamineTime = null;
      this.queryParams.endExamineTime = null;

      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;

      // resetForm 会重置 queryForm 中定义的 prop
      // 因为 status 已经从 queryForm 中移除，所以 this.queryParams.status 不会被重置
      this.resetForm("queryForm");

      // 重置时清空选择
      this.clearSelection();
      this.handleQuery();
    },

    /** 多选框选中数据（更新选中ID和完整行数据） */
    handleSelectionChange(selection) {
      // 存储选中的ID数组
      this.ids = selection.map(item => item.opPcrEntrustOrderId);
      // 存储完整行数据
      this.selectedRows = selection;
      // 控制按钮状态
      this.single = selection.length !== 1;
      this.multiple = selection.length === 0;

      // 构造发送列表
      this.sendList = selection.map(item => ({
        opPcrEntrustOrderId: item.opPcrEntrustOrderId,
        entrustOrderNo: item.entrustOrderNo,
        pcrTaskItemType: item.pcrTaskItemType
      }));

      console.log('当前选中数量:', selection);
    },
    /** 清空选择（切换Tab或重置时调用） */
    clearSelection() {
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection();
      }
      this.ids = [];
      this.selectedRows = [];
      this.sendList = [];
    },

    /** 预览报告（待实现） */
    handlePreview(row) {
      console.log('预览报告', row);
      this.$message.info('预览报告功能待实现');
    },

    /** 下载报告（修正提示文案bug） */
    handleDownload(row) {
      console.log('下载报告', row);
      downloadPcrReport(row.opPcrEntrustOrderId, row.pcrTaskItemType).then(response => {
        this.downloadFile(response, row.entrustOrderNo); // 传入委托单号构造文件名
        this.$modal.msgSuccess(`报告下载开始，委托单号：${row.entrustOrderNo}`); // 修正提示文案
      }).catch(error => {
        this.$modal.msgError("文件下载失败");
      });
    },

    /** 下载文件工具方法（优化文件名） */
    downloadFile(response, entrustOrderNo) {
      if (response instanceof Blob) {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);

        // 用委托单号构造唯一文件名（避免重复）
        const fileName = `PCR检测报告_${entrustOrderNo}.xlsx`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('响应不是文件流格式');
        this.$modal.msgError("文件格式错误，无法下载");
      }
    },

    /** 单个发送报告（转数组传参） */
    // handleSend(row) {
    //   this.$modal.confirm("是否确认发送该报告给委托单位？").then(() => {
    //     // 构造单个对象的数组，匹配后端List<OpPcrEntrustOrder>参数
    //     const sendList = [{
    //       opPcrEntrustOrderId: row.opPcrEntrustOrderId, // 核心ID（与下载一致）
    //       entrustOrderNo: row.entrustOrderNo, // 可选：传递后端可能需要的其他字段
    //       entrustDeptName: row.entrustDeptName,
    //       status: row.status
    //     }];

    //     // 调用发送接口
    //     sendPcrReport(sendList).then(response => {
    //       if (response.code === 200) {
    //         this.$modal.msgSuccess("报告发送成功");
    //         this.getList(); // 刷新列表，更新状态（如status变为“已发送”）
    //       } else {
    //         this.$modal.msgError("发送失败：" + (response.msg || "未知错误"));
    //       }
    //     }).catch(error => {
    //       console.error('单个发送报告错误：', error);
    //       this.$modal.msgError("发送接口调用失败，请重试");
    //     });
    //   }).catch(() => { });
    // },

    /** 批量发送报告（新增方法） */
    handleBatchSend() {
      this.$modal.confirm(`是否确认发送选中的 ${this.selectedRows.length} 条报告给委托单位？`).then(() => {
        // 构造多对象数组，匹配后端List<OpPcrEntrustOrder>参数
        const sendList = this.selectedRows.map(row => ({
          opPcrEntrustOrderId: row.opPcrEntrustOrderId, // 核心ID
          entrustOrderNo: row.entrustOrderNo, // 可选：传递后端需要的字段
          entrustDeptName: row.entrustDeptName,
          status: row.status
        }));

        // 调用发送接口（与单个发送共用）
        sendPcrReport(sendList).then(response => {
          if (response.code === 200) {
            this.$modal.msgSuccess(`批量发送成功，共 ${this.selectedRows.length} 条报告`);
            this.getList(); // 刷新列表，更新状态
          } else {
            this.$modal.msgError("批量发送失败：" + (response.msg || "未知错误"));
          }
        }).catch(error => {
          console.error('批量发送报告错误：', error);
          this.$modal.msgError("批量发送接口调用失败，请重试");
        });
      }).catch(() => { });
    },

    /** 新增：点击详情按钮 */
    handleDetail(row) {
      this.detailDialogVisible = true;
      this.detailLoading = true;
      this.detailTitle = `PCR报告详情 - ${row.entrustOrderNo}`;
      this.detailList = [];
      this.dynamicColumns = [];

      const params = {
        opPcrEntrustOrderId: row.opPcrEntrustOrderId,
        pcrTaskItemType: row.pcrTaskItemType
      };

      getReportDetail(params).then(response => {
        this.detailLoading = false;
        if (response.data) {
          // 1. 直接使用后端返回的排序表头
          this.dynamicColumns = response.data.headerList || [];

          // 2. 传入 orderData 进行处理
          if (response.data.orderData) {
            this.processDetailData(response.data.orderData);
          }
        }
      }).catch(err => {
        this.detailLoading = false;
        console.error(err);
      });
    },

    /** 新增：处理详情数据（核心逻辑） */
    processDetailData(orderData) {
      const sampleList = orderData.sampleList || [];
      const entrustDeptName = orderData.entrustDeptName || '';

      // 1. 构造表格行数据
      const formattedList = sampleList.map(sample => {
        const testItems = sample.testItem || [];

        // 提取试剂盒批号 (去重 + 拼接)
        const tqsjh = testItems
          .map(item => item.tqsjh)
          .filter(v => v && v.trim() !== '') // 过滤掉 null, undefined 和 空字符串
          .filter((v, i, a) => a.indexOf(v) === i) // 去重
          .join(", ");

        const kzsjh = testItems
          .map(item => item.kzsjh)
          .filter(v => v && v.trim() !== '') // 过滤掉 null, undefined 和 空字符串
          .filter((v, i, a) => a.indexOf(v) === i) // 去重
          .join(", ");

        // --- 修复开始：填充 resultsMap ---
        const resultsMap = {};
        testItems.forEach(item => {
          // 确保有 itemName 且有值
          if (item.itemName) {
            // 这里的 key (item.itemName) 必须和 this.dynamicColumns (后端返回的 headerList) 里的字符串完全一致
            resultsMap[item.itemName] = item.testResult;
          }
        });
        // --- 修复结束 ---

        return {
          tqsjh: tqsjh,
          kzsjh: kzsjh,
          entrustDeptName: entrustDeptName,
          invbillName: sample.invbillName,
          name: sample.name,
          remark: sample.remark,
          sampleNo: sample.sampleNo,
          results: resultsMap // 界面通过 scope.row.results['金黄色葡萄球菌'] 取值
        };
      });

      this.detailList = formattedList;
    },

    /** 新增：获取结果样式类 */
    getResultClass(result) {
      if (result === '+') return 'result-plus-one';
      if (result === '++') return 'result-plus-two';
      if (result === '+++') return 'result-plus-three';
      return '';
    }










  }
};
</script>

<style scoped>
/* 按钮样式微调 */
.el-table .el-button--text {
  padding: 0 8px;
  /* 增大按钮点击区域 */
}

/* 批量发送按钮间距优化 */
.el-row .el-button:first-child {
  margin-left: 2px;
}

/* 确保 Tabs 下方有一定间距 */
.el-tabs {
  margin-bottom: 15px;
}

/* 新增：检测结果样式 */
.result-plus-one {
  background-color: yellow;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.result-plus-two {
  background-color: darkred;
  color: white;
  /* 深红背景配白字更清晰 */
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.result-plus-three {
  background-color: red;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}
</style>