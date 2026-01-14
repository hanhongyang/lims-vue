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
      <el-form-item label="工厂" prop="WERK">
        <el-input v-model="queryParams.WERK" placeholder="请输入工厂" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="检验批次" prop="PRUEFLOS">
        <el-input
          v-model="queryParams.PRUEFLOS"
          placeholder="请输入检验批次"
          clearable
          @keyup.enter.native="handleQuery"
        />

      </el-form-item>
      <el-form-item label="检验类型" prop="HERKUNFT">
        <el-input
          v-model="queryParams.HERKUNFT"
          placeholder="请输入检验类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="SELMATNR">
        <el-input
          v-model="queryParams.SELMATNR"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="KTEXTMAT">
        <el-input
          v-model="queryParams.KTEXTMAT"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <!-- 合并为单个时间范围选择框 -->
      <el-form-item label="到厂日期" prop="testTime">
        <el-date-picker
          v-model="queryParams.ENSTEHDAT"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="决策日期" prop="BUDAT">
        <el-date-picker v-model="queryParams.BUDAT" type="date" value-format="yyyyMMdd" placeholder="选择日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" height="70vh">
      <el-table-column prop="sample_no" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="WERK" label="工厂" width="150" align="center" />
      <el-table-column prop="PRUEFLOS" label="检验批次" width="100" align="center" />
      <el-table-column prop="SELMATNR" label="物料编码" width="150" align="center" />
      <el-table-column prop="KTEXTMAT" label="物料描述" width="120" align="center" />
      <el-table-column prop="ZNUM" label="样品编号" width="120" align="center" />
      <el-table-column prop="ENSTEHDAT" label="到厂日期" width="120" align="center" />
      <el-table-column prop="BUDAT" label="决策日期" width="160" align="center" />
      <el-table-column prop="SELLIFNR" label="供应商编码" width="160" align="center" />
      <el-table-column prop="NAM1" label="供应商" width="160" align="center" />
      <el-table-column prop="EBELN" label="采购凭证编号" width="160" align="center" />
      <el-table-column prop="EBELP" label="行项目号" width="160" align="center" />
      <el-table-column prop="AUFNR" label="生产订单号" width="160" align="center" />
      <el-table-column prop="LOSMENGE" label="批数量" width="160" align="center" />
      <el-table-column prop="ZJS" label="在接收标准范围内" width="160" align="center" />
      <el-table-column prop="ZKJS" label="在可接收标准范围内" width="160" align="center" />
      <el-table-column prop="ZCJS" label="在超收货范围内" width="160" align="center" />
      <el-table-column prop="VCODE" label="判定结果" width="160" align="center" />
      <el-table-column prop="KURZTEXT" label="判定结果描述" width="160" align="center" />
      <el-table-column prop="KDAUF" label="销售订单" width="160" align="center" />
      <el-table-column prop="KDPOS" label="SO项目" width="160" align="center" />
      <el-table-column prop="LS_VBELN" label="交货单号" width="160" align="center" />
      <el-table-column prop="LS_POSNR" label="交货单行项目" width="160" align="center" />
      <el-table-column prop="KUNNR" label="客户" width="160" align="center" />
      <el-table-column prop="KUNNR_T" label="客户名称" width="160" align="center" />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { queryFrozenSemenQc } from '@/api/report/report'

export default {
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
        WERK: '8380'
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      queryFrozenSemenQc([this.queryParams]).then(response => {
        this.tableData = response.data
        this.loading = false
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
      this.ids = selection.map(item => item.disinfectionManagementId)
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
      getManagement(disinfectionManagementId).then(response => {
        this.form = response.data
        this.opDisinfectionManagementRecordList = response.data.opDisinfectionManagementRecordList
        this.open = true
        this.title = '修改消毒管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.opDisinfectionManagementRecordList = this.opDisinfectionManagementRecordList
          if (this.form.disinfectionManagementId != null) {
            updateManagement(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addManagement(this.form).then(response => {
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
      const disinfectionManagementIds = row.disinfectionManagementId || this.ids
      this.$modal.confirm('是否确认删除消毒管理编号为"' + disinfectionManagementIds + '"的数据项？').then(function() {
        return delManagement(disinfectionManagementIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => { })
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
      if (this.checkedOpDisinfectionManagementRecord.length == 0) {
        this.$modal.msgError('请先选择要删除的消毒管理记录数据')
      } else {
        const opDisinfectionManagementRecordList = this.opDisinfectionManagementRecordList
        const checkedOpDisinfectionManagementRecord = this.checkedOpDisinfectionManagementRecord
        this.opDisinfectionManagementRecordList = opDisinfectionManagementRecordList.filter(function(item) {
          return checkedOpDisinfectionManagementRecord.indexOf(item.index) == -1
        })
      }
    },
    /** 复选框选中数据 */
    handleOpDisinfectionManagementRecordSelectionChange(selection) {
      this.checkedOpDisinfectionManagementRecord = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      // 导出时同步传递区间参数
      const exportParams = { ...this.queryParams }
      if (this.queryParams.disinfectionTimeRange) {
        exportParams.disinfectionStartTime = this.queryParams.disinfectionTimeRange[0]
        exportParams.disinfectionEndTime = this.queryParams.disinfectionTimeRange[1]
      }
      this.download('disinfectionmanagement/management/export', exportParams, `management_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
