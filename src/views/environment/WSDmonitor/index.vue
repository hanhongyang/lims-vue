<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="监控点" prop="monitoringPoint">
        <el-input v-model="queryParams.monitoringPoint" placeholder="请输入监控点" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="温度" prop="temperature">
        <el-input v-model="queryParams.temperature" placeholder="请输入温度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="湿度" prop="humidity">
        <el-input v-model="queryParams.humidity" placeholder="请输入湿度" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="请选择是否启用" clearable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 功能按钮栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['basicdata:monitor:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['basicdata:monitor:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:monitor:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 主表格 -->
    <el-table v-loading="loading" :data="monitorList" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope">
          {{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="监控点" align="center" prop="monitoringPoint" />
      <el-table-column label="温度" align="center" prop="temperature" />
      <el-table-column label="湿度" align="center" prop="humidity" />
      <el-table-column label="是否启用" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable === '0' ? 'success' : 'info'">
            {{ scope.row.isEnable === '0' ? '启用' : scope.row.isEnable === '1' ? '禁用' : scope.row.isEnable }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 操作列（含新增的“查看修改记录”按钮） -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:monitor:edit']">修改</el-button>
          <el-button size="mini" :type="scope.row.isEnable === '0' ? 'danger' : 'success'"
            :icon="scope.row.isEnable === '0' ? 'el-icon-circle-close' : 'el-icon-circle-check'"
            @click="handleToggleEnable(scope.row)" v-hasPermi="['basicdata:monitor:edit']">
            {{ scope.row.isEnable === '0' ? '禁用' : '启用' }}
          </el-button>
          <!-- 新增：查看修改记录按钮 -->
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleViewEditRecord(scope.row)"
            v-hasPermi="['basicdata:monitor:viewRecord']">查看修改记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 新增/修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="companyName" help="自动获取当前登录人部门，无需手动输入">
          <!-- 新增：添加disabled，禁止手动输入 -->
          <el-input v-model="form.companyName" placeholder="自动获取当前登录人部门" disabled />
        </el-form-item>
        <el-form-item label="监控点" prop="monitoringPoint">
          <el-input v-model="form.monitoringPoint" placeholder="请输入监控点" />
        </el-form-item>
        <el-form-item label="温度" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入温度" />
        </el-form-item>
        <el-form-item label="湿度" prop="humidity">
          <el-input v-model="form.humidity" placeholder="请输入湿度" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新增：修改记录查看对话框 -->
    <el-dialog title="设备温湿度监控修改记录" :visible.sync="showEditRecordDialog" width="1000px" append-to-body>
      <!-- 导出修改记录按钮 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="2">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExportEditRecord"
            v-hasPermi="['basicdata:monitor:exportRecord']">导出修改记录</el-button>
        </el-col>
      </el-row>
      <!-- 修改记录表格 -->
      <el-table v-loading="recordLoading" :data="editRecordList" border stripe max-height="500">
        <el-table-column label="序号" align="center" width="60">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="修改人" align="center" prop="updateBy" width="120" />
        <el-table-column label="修改时间" align="center" prop="updateTime" width="180">
          <template slot-scope="scope">
            {{ scope.row.updateTime || '无记录' }}
          </template>
        </el-table-column>
        <el-table-column label="公司名称-修改前" align="center" prop="companyName" width="150" />
        <el-table-column label="公司名称-修改后" align="center" prop="companyNameNew" width="150" />
        <el-table-column label="监控点-修改前" align="center" prop="monitoringPoint" width="150" />
        <el-table-column label="监控点-修改后" align="center" prop="monitoringPointNew" width="150" />
        <el-table-column label="温度-修改前" align="center" prop="temperature" width="120" />
        <el-table-column label="温度-修改后" align="center" prop="temperatureNew" width="120" />
        <el-table-column label="湿度-修改前" align="center" prop="humidity" width="120" />
        <el-table-column label="湿度-修改后" align="center" prop="humidityNew" width="120" />
        <el-table-column label="是否启用-修改前" align="center" width="140">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isEnable === '0' ? 'success' : 'info'">
              {{ scope.row.isEnable === '0' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否启用-修改后" align="center" width="140">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isEnableNew === '0' ? 'success' : 'info'">
              {{ scope.row.isEnableNew === '0' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditRecordDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口：新增修改记录相关接口（需确保后端接口地址匹配）
import {
  listMonitor, getMonitor, delMonitor, addMonitor, updateMonitor,
  listMonitorEditRecord, // 获取修改记录列表
  exportMonitorEditRecord // 导出修改记录
} from "@/api/environment/monitor";
import { getLoginUserDept, listDept } from "@/api/system/dept";

export default {
  name: "Monitor",
  data() {
    return {
      // 下拉框选项
      options: [
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ],
      currentDept: null, // 存储当前用户部门信息
      // 主表加载状态
      loading: true,
      // 选中数据（主表）
      ids: [],
      single: true, // 主表单选控制
      multiple: true, // 主表多选控制
      // 搜索相关
      showSearch: true,
      total: 0,
      monitorList: [], // 主表数据
      // 新增/修改对话框
      title: "",
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyName: null,
        monitoringPoint: null,
        temperature: null,
        humidity: null,
        isEnable: null,
      },
      // 表单数据
      form: {
        id: null,
        companyName: null,
        monitoringPoint: null,
        temperature: null,
        humidity: null,
        isEnable: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        deptId: null,
        updateTime: null
      },
      // 表单校验
      rules: {},

      // 新增：修改记录相关变量
      showEditRecordDialog: false, // 修改记录对话框显隐
      recordLoading: false, // 修改记录表格加载状态
      editRecordList: [], // 修改记录数据
      currentParentId: null // 当前查看记录的主表主键（关联修改记录的parentId）
    };
  },
  created() {
    this.getList(); // 初始化加载主表数据
    this.getCurrentDeptInfo(); // 获取当前用户部门信息
  },
  methods: {
    /** 主表数据查询 */
    getList() {
      this.loading = true;
      listMonitor(this.queryParams).then(response => {
        this.monitorList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    /** 取消（新增/修改对话框） */
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 表单重置（新增/修改） */
    reset() {
      this.form = {
        id: null,
        companyName: null,
        deptId: null,
        monitoringPoint: null,
        temperature: null,
        humidity: null,
        isEnable: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 重置搜索 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.isEnable = null; // 手动清空下拉框值
      this.handleQuery();
    },

    /** 主表多选事件 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 新增操作 */
    async handleAdd() { // <--- 1. 添加 async
      this.reset(); // 2. 重置表单

      // 3. 确保部门信息已加载
      if (!this.currentDept) {
        try {
          // 4. 等待异步获取部门信息
          await this.getCurrentDeptInfo();
        } catch (error) {
          this.$modal.msgError("获取当前部门信息失败");
          return; // 获取失败则终止操作
        }
      }

      // 5. 填充部门信息
      if (this.currentDept) {
        this.form.companyName = this.currentDept.deptName;
        this.form.deptId = this.currentDept.deptId; // 关键：填充deptId
      }

      this.open = true; // 6. 打开弹窗
      this.title = "添加设备温湿度监控";
    },

    /** 修改操作 */
    handleUpdate(row) {
      this.reset();
      const id = row?.id || this.ids; // 支持单行点击和批量选择
      getMonitor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备温湿度监控";
      });
    },

    /** 提交（新增/修改） */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          const promise = this.form.id ? updateMonitor(this.form) : addMonitor(this.form);
          promise.then(() => {
            this.$modal.msgSuccess(this.form.id ? "修改成功" : "新增成功");
            this.open = false;
            this.getList(); // 重新加载主表
          });
        }
      });
    },
    // 获取当前机构信息
    getCurrentDeptInfo() {
      getLoginUserDept().then(response => {
        if (response.code === 200) {
          this.currentDept = response.data;
        }
      });
    },
    /** 删除操作 */
    handleDelete(row) {
      const ids = row?.id || this.ids;
      this.$modal.confirm(`是否确认删除设备温湿度监控编号为"${ids}"的数据？`).then(() => {
        return delMonitor(ids);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.getList();
      }).catch(() => { });
    },

    /** 启用/禁用切换 */
    handleToggleEnable(row) {
      const targetEnable = row.isEnable === '0' ? '1' : '0';
      const confirmText = targetEnable === '1' ? '禁用' : '启用';
      this.$modal.confirm(`是否确认${confirmText}该设备温湿度监控？`).then(() => {
        return updateMonitor({
          id: row.id,
          isEnable: targetEnable,
          companyName: row.companyName,
          monitoringPoint: row.monitoringPoint,
          temperature: row.temperature,
          humidity: row.humidity
        });
      }).then(() => {
        this.$modal.msgSuccess(`${confirmText}成功`);
        this.getList();
      }).catch(() => { });
    },

    /** 主表导出 */
    handleExport() {
      this.download(
        'basicdata/monitor/export',
        { ...this.queryParams },
        `monitor_${new Date().getTime()}.xlsx`
      );
    },

    // ---------------------- 新增：修改记录相关方法 ----------------------
    /** 打开修改记录对话框 */
    async handleViewEditRecord(row) { // <--- 1. 添加 async
      // 确保当前部门信息已加载
      if (!this.currentDept) {
        try {
          await this.getCurrentDeptInfo(); // 2. 现在 await 可以正常工作
        } catch (error) {
          this.$modal.msgError("获取当前部门信息失败");
        }
      }
      this.currentParentId = row.id; // 存储当前主表ID（作为修改记录的parentId）
      this.getEditRecordList(); // 加载修改记录数据
      this.showEditRecordDialog = true;
    },

    /** 获取修改记录列表 */
    getEditRecordList() {
      this.recordLoading = true;
      listMonitorEditRecord({ parentId: this.currentParentId }).then(response => {
        this.editRecordList = response.rows;
        this.recordLoading = false;
      }).catch(() => {
        this.recordLoading = false;
        this.$modal.msgError("获取修改记录失败");
      });
    },

    handleExportEditRecord() {
      this.download(
        '/basicdata/monitor/editRecord/export', // 第一个参数：接口URL字符串（关键！）
        { parentId: this.currentParentId }, // 第二个参数：请求参数
        `monitor_edit_record_${this.currentParentId}_${new Date().getTime()}.xlsx`, // 第三个参数：文件名
        'post' // 第四个参数：指定请求方法（POST，根据接口要求）
      );
    }
  }
};
</script>

<style scoped>
/* 可选：调整表格样式，优化显示 */
.small-padding .el-button {
  padding: 0 6px;
  margin-right: 4px;
}

.fixed-width {
  width: 320px;
  /* 操作列固定宽度，避免按钮换行 */
}
</style>