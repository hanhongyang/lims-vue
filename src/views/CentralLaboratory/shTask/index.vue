<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" v-if="isPad" style="margin-bottom:10px"
      @click="HDPada">返回首页</el-button>

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="70px">
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
        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImportNew">导入结果</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" ref="tablePending" row-key="entrustOrderId" height="64vh">
      <el-table-column label="序号" type="index" align="center" width="50" />
      <el-table-column label="委托单号" align="center" prop="entrustOrderNo" min-width="140" />
      <el-table-column label="委托单位" align="center" prop="entrustDeptName" min-width="120" />
      <el-table-column label="样品数量" align="center" prop="sampleCount" width="80" />

      <el-table-column label="接收时间" align="center" prop="receiveTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="导入时间" align="center" prop="testEndTime" width="160">
        <template slot-scope="scope">
          <!-- <span>{{ parseTime(scope.row.testEndTime) }}</span> -->
          <span>{{ scope.row.testTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入人" align="center" prop="testUser" width="100" />
      <el-table-column label="导入文件名" align="center" prop="fileName" show-overflow-tooltip min-width="150" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-check" @click="handleUpdate(scope.row)"
            v-if="scope.row.resultNo">确认</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

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
import { listTask } from "@/api/CentralLaboratory/task";
import { getToken } from '@/utils/auth';

export default {
  name: "BloodTask",
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      taskList: [],

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bloodTaskItemType: '8', // 默认生化项目
        entrustDeptName: null,
        entrustOrderNo: null,
        entrustOrderType: '2', // 类型：血样
        isTest: '0',           // 状态：待化验
        beginReceiveTime: null,
        endReceiveTime: null,
      },
      receiveTimeRange: [], // 接收时间范围

      isPad: true,

      // 导入参数
      upload: {
        open: false,
        title: "生化结果导入",
        isUploading: false,
        headers: { Authorization: "Bearer " + getToken() },
        url: process.env.VUE_APP_BASE_API + "/labtest/jczxBloodResult/importShData"
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
    isPADDevice() {
      const userAgent = navigator.userAgent.toLowerCase();
      return /ipad/.test(userAgent) || (/android/.test(userAgent) && !/mobile/.test(userAgent)) || (/windows/.test(userAgent) && /touch/.test(userAgent));
    },
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase();
      return (/huawei/.test(userAgent) || /honor/.test(userAgent)) && /android/.test(userAgent) && !/mobile/.test(userAgent);
    },

    // 获取列表数据
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        this.taskList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        console.error("获取列表失败:", error);
        this.loading = false;
        this.$modal.msgError("获取列表失败: " + (error?.message || '未知错误'));
      });
    },

    // 搜索
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (this.receiveTimeRange && this.receiveTimeRange.length === 2) {
        this.queryParams.beginReceiveTime = this.receiveTimeRange[0];
        this.queryParams.endReceiveTime = this.receiveTimeRange[1];
      } else {
        this.queryParams.beginReceiveTime = null;
        this.queryParams.endReceiveTime = null;
      }
      this.getList();
    },

    // 重置
    resetQuery() {
      this.resetForm("queryForm");
      this.receiveTimeRange = [];
      this.handleQuery();
    },

    // 打开导入弹窗
    handleImportNew() {
      this.upload.open = true;
      this.$nextTick(() => {
        this.$refs.upload?.clearFiles();
      });
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

    // --- 上传相关方法 ---
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    submitUpload() {
      const fileList = this.$refs.upload?.uploadFiles;
      if (!fileList || fileList.length === 0) {
        this.$message.warning('请选择要上传的文件');
        return;
      }
      this.upload.isUploading = true;
      this.$refs.upload?.submit();
    },
    handleError(error) {
      this.upload.isUploading = false;
      this.$message.error('上传失败: ' + (error.message || error));
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件`);
    },
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isExcel) {
        this.$message.error('只能上传Excel文件!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB!');
        return false;
      }
      return true;
    },
    handleFileSuccess(response) {
      this.upload.isUploading = false;
      if (response.code === 200) {
        this.$message.success('导入成功');
        this.upload.open = false;
        this.$refs.upload?.clearFiles();
        if (response.msg) {
          this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
        }
        this.getList(); // 刷新列表以显示新的导入时间和确认按钮
      } else {
        this.$message.error(response.msg || '导入失败');
        this.$refs.upload?.clearFiles();
      }
    },
    handleReset() {
      this.$refs.upload?.clearFiles();
    },
    handleUploadClose() {
      this.upload.isUploading = false;
      this.$refs.upload?.clearFiles();
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  padding: 15px;
}
</style>