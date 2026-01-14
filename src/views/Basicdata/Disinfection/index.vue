<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="消毒池名称" prop="poolName">
        <el-input
          v-model="queryParams.poolName"
          placeholder="请输入消毒池名称"
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

    <!-- 操作按钮区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['basicdata:disinfection:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['basicdata:disinfection:edit']"
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
          v-hasPermi="['basicdata:disinfection:remove']"
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
          v-hasPermi="['basicdata:disinfection:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 消毒池列表区域 -->
    <el-table
      v-loading="loading"
      :data="disinfectionList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="消毒池名称" align="center" prop="poolName" show-overflow-tooltip />
      <el-table-column label="所属部门" align="center" prop="deptName" show-overflow-tooltip />
      <el-table-column label="消毒池类型" align="center" prop="poolType">
        <template slot-scope="scope">
          {{ scope.row.poolType ? scope.row.poolType : '---' }}
        </template>
      </el-table-column>
      <el-table-column label="容量" align="center" prop="capacity">
        <template slot-scope="scope">
          {{ scope.row.capacity ? scope.row.capacity : '---' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <div v-for="item in dict.type.disinfection_pool_status" :key="item.value">
            <span v-if="item.value === scope.row.status">{{ item.label }}</span>
          </div>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['basicdata:disinfection:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['basicdata:disinfection:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改消毒池管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="消毒池名称" prop="poolName">
          <el-input v-model="form.poolName" placeholder="请输入消毒池名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择所属部门" :disabled="form.deptId !== null">
            <el-option
              :key="dept.deptId"
              :label="dept.deptName"
              :value="dept.deptId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="容量" prop="capacity">
          <el-input v-model="form.capacity" placeholder="请输入容量" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
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
import {
  listDisinfection,
  getDisinfection,
  delDisinfection,
  addDisinfection,
  updateDisinfection
} from '@/api/Basicdata/disinfection'
import { getLoginUserDept } from '@/api/system/dept'

export default {
  name: 'Disinfection',
  dicts: ['disinfection_pool_status'],
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
      // 消毒池管理表格数据
      disinfectionList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 部门列表
      dept: {
        deptId: null,
        deptName: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        poolName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        poolName: [
          { required: true, message: '消毒池名称不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '请选择所属部门', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getCurrentDept()
  },
  methods: {
    /** 查询消毒池管理列表 */
    getList() {
      this.loading = true
      listDisinfection(this.queryParams).then((response) => {
        this.disinfectionList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询部门列表 */
    getCurrentDept() {
      getLoginUserDept().then((response) => {
        this.dept.deptId = response.data.deptId
        this.dept.deptName = response.data.deptName
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
        id: null,
        poolName: null,
        deptId: null,
        poolType: null,
        capacity: null,
        status: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
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
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加消毒池管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDisinfection(id).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改消毒池管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDisinfection(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDisinfection(this.form).then((response) => {
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
      const ids = row.id || this.ids
      this.$modal
        .confirm('是否确认删除消毒池管理编号为"' + ids + '"的数据项？')
        .then(function() {
          return delDisinfection(ids)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'basicData/disinfection/export',
        {
          ...this.queryParams
        },
        `disinfection_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
