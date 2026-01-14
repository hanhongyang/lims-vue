<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="消毒池名称" prop="disinfectionTankName">
        <el-input
          v-model="queryParams.disinfectionTankName"
          placeholder="请输入消毒池名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- 合并为单个时间范围选择框 -->
      <el-form-item label="消毒时间范围" prop="disinfectionTimeRange">
        <el-date-picker
          v-model="queryParams.disinfectionTimeRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="请选择开始时间"
          end-placeholder="请选择结束时间"
          clearable
          @change="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['disinfectionmanagement:management:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['disinfectionmanagement:management:edit']"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['disinfectionmanagement:management:export']"
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
      v-loading="loading"
      :data="managementList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="消毒池名称"
        align="center"
        prop="disinfectionTankName"
      />
      <el-table-column label="浓度" align="center" prop="concentration" />
      <el-table-column
        label="消毒时间"
        align="center"
        prop="disinfectionTime"
      />
      <el-table-column
        label="消毒方式"
        align="center"
        prop="disinfectionMethod"
      />
      <el-table-column label="是否通过" align="center" prop="passed">
        <template slot-scope="scope">
          <div v-for="item in dict.type.sys_yes_no2" :key="item.value">
            <span v-if="item.value === scope.row.passed">{{ item.label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="消毒液" align="center" prop="disinfectant" />
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['disinfectionmanagement:management:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
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

    <!-- 添加或修改消毒管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="消毒池名称" prop="disinfectionTankName">
          <el-select
            v-model="form.disinfectionTankName"
            placeholder="请选择消毒池名称"
          >
            <el-option
              v-for="item in disinfectionTankList"
              :key="item.id"
              :label="item.poolName"
              :value="item.poolName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="浓度" prop="concentration">
          <el-select v-model="form.concentration" placeholder="请选择浓度">
            <el-option
              v-for="item in dict.type.disinfection_concentration"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消毒时间" prop="disinfectionTime">
          <el-date-picker
            v-model="form.disinfectionTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择消毒时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="消毒方式" prop="disinfectionMethod">
          <el-select
            v-model="form.disinfectionMethod"
            placeholder="请选择消毒方式"
          >
            <el-option
              v-for="item in dict.type.disinfection_method"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消毒液" prop="disinfectant">
          <el-select v-model="form.disinfectant" placeholder="请选择消毒液">
            <el-option
              v-for="item in dict.type.disinfectant"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" :disabled="true" />
        </el-form-item>
        <el-form-item label="是否通过" prop="passed">
          <el-select v-model="form.passed" placeholder="请选择是否通过">
            <el-option
              v-for="item in dict.type.sys_yes_no2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 提示 -->
        <el-alert
          type="info"
          :closable="false"
          show-icon
        >
          <span>
            每个部门仅允许设置一条“已通过”的消毒管理记录，
            若存在多条，系统将随机选取其中一条生效。
          </span>
        </el-alert>
        <el-divider content-position="center">消毒管理记录信息</el-divider>
        <el-row :gutter="10" class="mb8" />
        <el-table
          ref="opDisinfectionManagementRecord"
          :data="opDisinfectionManagementRecordList"
          :row-class-name="rowOpDisinfectionManagementRecordIndex"
          @selection-change="
            handleOpDisinfectionManagementRecordSelectionChange
          "
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="序号"
            align="center"
            prop="index"
            width="50"
          />
          <el-table-column
            label="消毒池名称"
            prop="disinfectionTankName"
            width="150"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.disinfectionTankName"
                :disabled="true"
              />
            </template>
          </el-table-column>
          <el-table-column label="浓度" prop="concentration" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.concentration" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="消毒时间" prop="disinfectionTime" width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.disinfectionTime" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column
            label="消毒方式"
            prop="disinfectionMethod"
            width="150"
          >
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.disinfectionMethod"
                :disabled="true"
              />
            </template>
          </el-table-column>
          <el-table-column label="消毒液" prop="disinfectant" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.disinfectant" :disabled="true" />
            </template>
          </el-table-column>
          <el-table-column label="部门名称" prop="deptId" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.deptName" :disabled="true" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listManagement,
  getManagement,
  delManagement,
  addManagement,
  updateManagement
} from '@/api/disinfectionmanagement/management'
import { listDisinfection } from '@/api/Basicdata/disinfection'

export default {
  dicts: [
    'disinfection_method',
    'disinfection_concentration',
    'disinfectant',
    'sys_yes_no2'
  ],
  name: 'Management',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedOpDisinfectionManagementRecord: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 消毒池列表
      disinfectionTankList: [],
      // 消毒管理表格数据
      managementList: [],
      // 消毒管理记录表格数据
      opDisinfectionManagementRecordList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        disinfectionManagementStatus: null,
        disinfectionTankName: null,
        concentration: null,
        disinfectionMethod: null,
        disinfectant: null,
        deptId: null,
        isDelete: null,
        deptName: null,
        // 时间范围数组（[开始时间, 结束时间]）
        disinfectionTimeRange: null,
        // 传给后端的区间字段
        disinfectionStartTime: null,
        disinfectionEndTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    }
  },
  created() {
    this.getList()
    this.getDisinfectionTankList()
  },
  methods: {
    /** 查询消毒管理列表 */
    getList() {
      this.loading = true
      listManagement(this.queryParams).then((response) => {
        this.managementList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询消毒池列表 */
    getDisinfectionTankList() {
      listDisinfection().then((response) => {
        this.disinfectionTankList = response.rows
        console.log(this.disinfectionTankList, 111)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        disinfectionManagementId: null,
        disinfectionManagementStatus: null,
        disinfectionTankName: null,
        concentration: null,
        disinfectionTime: null,
        disinfectionMethod: null,
        disinfectant: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deptId: null,
        isDelete: null
      }
      this.opDisinfectionManagementRecordList = []
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // 拆分时间范围数组，赋值给后端需要的字段
      if (this.queryParams.disinfectionTimeRange) {
        this.queryParams.disinfectionStartTime =
          this.queryParams.disinfectionTimeRange[0]
        this.queryParams.disinfectionEndTime =
          this.queryParams.disinfectionTimeRange[1]
      } else {
        // 清空时间范围时，同时清空区间字段
        this.queryParams.disinfectionStartTime = null
        this.queryParams.disinfectionEndTime = null
      }
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      // 重置后清空区间字段
      this.queryParams.disinfectionStartTime = null
      this.queryParams.disinfectionEndTime = null
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.disinfectionManagementId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加消毒管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const disinfectionManagementId = row.disinfectionManagementId || this.ids
      getManagement(disinfectionManagementId).then((response) => {
        this.form = response.data
        this.opDisinfectionManagementRecordList =
          response.data.opDisinfectionManagementRecordList
        this.open = true
        this.title = '修改消毒管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.opDisinfectionManagementRecordList =
            this.opDisinfectionManagementRecordList
          if (this.form.disinfectionManagementId != null) {
            updateManagement(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addManagement(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const disinfectionManagementIds =
        row.disinfectionManagementId || this.ids
      this.$modal
        .confirm(
          '是否确认删除消毒管理编号为"' +
            disinfectionManagementIds +
            '"的数据项？'
        )
        .then(function() {
          return delManagement(disinfectionManagementIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 消毒管理记录序号 */
    rowOpDisinfectionManagementRecordIndex({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    /** 消毒管理记录添加按钮操作 */
    handleAddOpDisinfectionManagementRecord() {
      const obj = {}
      obj.disinfectionManagementStatus = ''
      obj.disinfectionTankName = ''
      obj.concentration = ''
      obj.disinfectionTime = ''
      obj.disinfectionMethod = ''
      obj.disinfectant = ''
      obj.deptId = ''
      obj.isDelete = ''
      this.opDisinfectionManagementRecordList.push(obj)
    },
    /** 消毒管理记录删除按钮操作 */
    handleDeleteOpDisinfectionManagementRecord() {
      if (this.checkedOpDisinfectionManagementRecord.length === 0) {
        this.$modal.msgError('请先选择要删除的消毒管理记录数据')
      } else {
        const opDisinfectionManagementRecordList =
          this.opDisinfectionManagementRecordList
        const checkedOpDisinfectionManagementRecord =
          this.checkedOpDisinfectionManagementRecord
        this.opDisinfectionManagementRecordList =
          opDisinfectionManagementRecordList.filter(function(item) {
            return (
              checkedOpDisinfectionManagementRecord.indexOf(item.index) === -1
            )
          })
      }
    },
    /** 复选框选中数据 */
    handleOpDisinfectionManagementRecordSelectionChange(selection) {
      this.checkedOpDisinfectionManagementRecord = selection.map(
        (item) => item.index
      )
    },
    /** 导出按钮操作 */
    handleExport() {
      // 导出时同步传递区间参数
      const exportParams = { ...this.queryParams }
      if (this.queryParams.disinfectionTimeRange) {
        exportParams.disinfectionStartTime =
          this.queryParams.disinfectionTimeRange[0]
        exportParams.disinfectionEndTime =
          this.queryParams.disinfectionTimeRange[1]
      }
      this.download(
        'disinfectionmanagement/management/export',
        exportParams,
        `management_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
