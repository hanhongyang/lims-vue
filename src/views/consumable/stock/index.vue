<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="耗材名称" prop="consumableId">
        <el-select
          v-model="queryParams.consumableId"
          placeholder="请选择耗材名称"
        >
          <el-option
            v-for="item in archiveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="批号" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="请输入批号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="存放位置" prop="location">
        <el-input
          v-model="queryParams.location"
          placeholder="请输入存放位置"
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
          v-hasPermi="['consumable:stock:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['consumable:stock:edit']"
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
          v-hasPermi="['consumable:stock:remove']"
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
          v-hasPermi="['consumable:stock:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="stockList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" align="center" prop="stockId" />
      <el-table-column label="耗材名称" width="180" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{
            archiveOptions.find(
              item => item.value === scope.row.consumableId
            ).label || '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="批号" width="180" align="center" prop="batchNo" show-overflow-tooltip />
      <el-table-column label="有效期至" align="center" prop="expiryDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前库存数量" width="120" align="center" prop="quantity" />
      <el-table-column label="入库单价" width="120" align="center" prop="price" />
      <el-table-column label="存放位置" align="center" prop="location" show-overflow-tooltip width="180" />
      <el-table-column label="最后更新时间" align="center" prop="updateTime" width="180" />
      <el-table-column label="操作" fixed="right" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['consumable:stock:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['consumable:stock:remove']"
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

    <!-- 添加或修改化验室耗材库存对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="耗材档案" prop="consumableId">
          <el-select v-model="form.consumableId" placeholder="请选择耗材档案">
            <el-option
              v-for="item in archiveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="批号" prop="batchNo">
          <el-input v-model="form.batchNo" placeholder="请输入批号" />
        </el-form-item>
        <el-form-item label="有效期至" prop="expiryDate">
          <el-date-picker
            v-model="form.expiryDate"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择有效期至"
          />
        </el-form-item>
        <el-form-item label="当前库存数量" prop="quantity">
          <el-input-number v-model="form.quantity" placeholder="请输入当前库存数量" />
        </el-form-item>
        <el-form-item label="入库单价" prop="price">
          <el-input-number v-model="form.price" precision="2" placeholder="请输入入库单价" />
        </el-form-item>
        <el-form-item label="存放位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入存放位置" />
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
import { listStock, getStock, delStock, addStock, updateStock } from '@/api/consumable/stock'
import { listAllArchive } from '@/api/consumable/archive'

export default {
  name: 'Stock',
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
      // 化验室耗材库存表格数据
      stockList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        consumableId: null,
        batchNo: null
      },
      // 表单参数
      form: {},
      // 档案列表
      archiveOptions: [],
      // 表单校验
      rules: {
        consumableId: [
          { required: true, message: '耗材ID不能为空', trigger: 'blur' }
        ],
        batchNo: [
          { required: true, message: '批号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getArchiveList()
  },
  methods: {
    /** 查询化验室耗材库存列表 */
    getList() {
      this.loading = true
      listStock(this.queryParams).then(response => {
        this.stockList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询全部化验室耗材档案列表 */
    getArchiveList() {
      listAllArchive().then(response => {
        this.archiveOptions = response.data.map(item => ({
          label: item.consumableName,
          value: item.consumableId
        }))
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
        stockId: null,
        consumableId: null,
        batchNo: null,
        expiryDate: null,
        quantity: null,
        price: null,
        location: null,
        createTime: null,
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
      this.ids = selection.map(item => item.stockId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加化验室耗材库存'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const stockId = row.stockId || this.ids
      getStock(stockId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改化验室耗材库存'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.stockId != null) {
            updateStock(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addStock(this.form).then(response => {
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
      const stockIds = row.stockId || this.ids
      this.$modal.confirm('是否确认删除化验室耗材库存编号为"' + stockIds + '"的数据项？').then(function() {
        return delStock(stockIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('consumable/stock/export', {
        ...this.queryParams
      }, `stock_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
