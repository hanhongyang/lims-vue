<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="耗材编号" prop="consumableCode">
        <el-input
          v-model="queryParams.consumableCode"
          placeholder="请输入耗材编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="耗材名称" prop="consumableName">
        <el-input
          v-model="queryParams.consumableName"
          placeholder="请输入耗材名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格型号" prop="specModel">
        <el-input
          v-model="queryParams.specModel"
          placeholder="请输入规格型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计量单位" prop="unit">
        <el-input
          v-model="queryParams.unit"
          placeholder="请输入计量单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产厂家" prop="manufacturer">
        <el-input
          v-model="queryParams.manufacturer"
          placeholder="请输入生产厂家"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存储条件" prop="storageCondition">
        <el-input
          v-model="queryParams.storageCondition"
          placeholder="请输入存储条件"
          clearable
          @keyup.enter.native="handleQuery"
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
          v-hasPermi="['consumable:archive:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['consumable:archive:edit']"
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
          v-hasPermi="['consumable:archive:remove']"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['consumable:archive:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="archiveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="耗材编号" align="center" width="180" prop="consumableCode" />
      <el-table-column label="耗材名称" align="center" width="180" prop="consumableName" />
      <el-table-column label="耗材分类" align="center" width="120" prop="consumableType" />
      <el-table-column label="规格型号" align="center" width="180" prop="specModel" />
      <el-table-column label="计量单位" align="center" width="80" prop="unit" />
      <el-table-column label="生产厂家" align="center" width="180" prop="manufacturer" />
      <el-table-column label="安全库存预警值" align="center" width="180" prop="safetyStock" />
      <el-table-column label="存储条件" align="center" width="180" prop="storageCondition" />
      <el-table-column label="最后更新时间" align="center" width="180" prop="updateTime" />
      <el-table-column label="操作" align="center" width="120" fixed="right" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['consumable:archive:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['consumable:archive:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改化验室耗材档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="耗材编号" prop="consumableCode">
          <el-input v-model="form.consumableCode" placeholder="请输入耗材编号" />
        </el-form-item>
        <el-form-item label="耗材名称" prop="consumableName">
          <el-input v-model="form.consumableName" placeholder="请输入耗材名称" />
        </el-form-item>
        <el-form-item label="规格型号" prop="specModel">
          <el-input v-model="form.specModel" placeholder="请输入规格型号" />
        </el-form-item>
        <el-form-item label="耗材分类" prop="consumableType">
          <el-input v-model="form.consumableType" placeholder="请输入耗材分类" />
        </el-form-item>
        <el-form-item label="计量单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入计量单位" />
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家" />
        </el-form-item>
        <el-form-item label="安全库存预警值" prop="safetyStock">
          <el-input v-model="form.safetyStock" placeholder="请输入安全库存预警值" />
        </el-form-item>
        <el-form-item label="存储条件" prop="storageCondition">
          <el-input v-model="form.storageCondition" placeholder="请输入存储条件" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArchive, getArchive, delArchive, addArchive, updateArchive } from '@/api/consumable/archive'

export default {
  name: 'Archive',
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
      // 化验室耗材档案表格数据
      archiveList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        consumableCode: null,
        consumableName: null,
        consumableType: null,
        specModel: null,
        unit: null,
        manufacturer: null,
        storageCondition: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        consumableCode: [
          { required: true, message: '耗材编号不能为空', trigger: 'blur' }
        ],
        consumableName: [
          { required: true, message: '耗材名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询化验室耗材档案列表 */
    getList() {
      this.loading = true
      listArchive(this.queryParams).then(response => {
        this.archiveList = response.rows
        this.total = response.total
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
        consumableId: null,
        consumableCode: null,
        consumableName: null,
        consumableType: null,
        specModel: null,
        unit: null,
        manufacturer: null,
        safetyStock: null,
        storageCondition: null,
        remark: null
      }
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
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.consumableId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加化验室耗材档案'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const consumableId = row.consumableId || this.ids
      getArchive(consumableId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改化验室耗材档案'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.consumableId != null) {
            updateArchive(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addArchive(this.form).then(response => {
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
      const consumableIds = row.consumableId || this.ids
      this.$modal.confirm('是否确认删除化验室耗材档案编号为"' + consumableIds + '"的数据项？').then(function() {
        return delArchive(consumableIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('consumable/archive/export', {
        ...this.queryParams
      }, `archive_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
