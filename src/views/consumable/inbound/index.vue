<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="90px">
      <!-- 入库单号 -->
      <el-form-item label="入库单号" prop="inboundNo">
        <el-input v-model="queryParams.inboundNo" placeholder="请输入入库单号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- 供应商 -->
      <el-form-item label="供应商" prop="supplier">
        <el-input v-model="queryParams.supplier" placeholder="请输入供应商" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- 入库经办人 -->
      <el-form-item label="入库经办人" prop="operator">
        <el-input v-model="queryParams.operator" placeholder="请输入入库经办人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- 入库类型 -->
      <el-form-item label="入库类型" prop="inboundType">
        <el-select v-model="queryParams.inboundType" placeholder="请选择入库类型" clearable>
          <el-option
            v-for="dict in dict.type.consumable_inbound_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择入库单状态" clearable>
          <el-option
            v-for="dict in dict.type.consumable_inbound_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['consumable:inbound:add']"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['consumable:inbound:edit']"
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
          v-hasPermi="['consumable:inbound:remove']"
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
          v-hasPermi="['consumable:inbound:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="inboundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" type="index" width="80" align="center" />
      <el-table-column label="入库单号" align="center" prop="inboundNo" />
      <el-table-column label="入库日期" align="center" prop="inboundDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.inboundDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库类型" align="center">
        <template slot-scope="scope">
          {{
            dict.type.consumable_inbound_type.find(
              item => item.value === scope.row.inboundType
            )
              ? dict.type.consumable_inbound_type.find(
                item => item.value === scope.row.inboundType
              ).label
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{
            dict.type.consumable_inbound_status.find(
              item => item.value === scope.row.status
            )
              ? dict.type.consumable_inbound_status.find(
                item => item.value === scope.row.status
              ).label
              : '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="入库经办人" align="center" prop="operator" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['consumable:inbound:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-hasPermi="['consumable:inbound:remove']"
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

    <!-- 添加或修改耗材入库单主对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1080px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <!-- 入库单号 -->
        <el-form-item label="入库单号" prop="inboundNo">
          <el-input v-model="form.inboundNo" placeholder="请输入入库单号" />
        </el-form-item>
        <!-- 入库日期 -->
        <el-form-item label="入库日期" prop="inboundDate">
          <el-date-picker
            v-model="form.inboundDate"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入库日期"
          />
        </el-form-item>
        <!-- 入库类型 -->
        <el-form-item label="入库类型" prop="inboundType">
          <el-select v-model="form.inboundType" placeholder="请选择入库类型" clearable>
            <el-option
              v-for="dict in dict.type.consumable_inbound_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="入库经办人" prop="operator">
          <el-input v-model="form.operator" placeholder="请输入入库经办人" />
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择入库单状态" clearable>
            <el-option
              v-for="dict in dict.type.consumable_inbound_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">耗材入库单明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAddBsConsumableInboundDetail"
            >添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDeleteBsConsumableInboundDetail"
            >删除</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="bsConsumableInboundDetail"
          :data="bsConsumableInboundDetailList"
          :row-class-name="rowBsConsumableInboundDetailIndex"
          @selection-change="handleBsConsumableInboundDetailSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="耗材名称" align="center" prop="consumableId" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.consumableId" size="mini" placeholder="请选择耗材名称" clearable>
                <el-option
                  v-for="item in archiveOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="批号" align="center" prop="batchNo" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNo" size="mini" placeholder="请输入批号" />
            </template>
          </el-table-column>
          <el-table-column label="有效期" align="center" prop="expiryDate" width="240">
            <template slot-scope="scope">
              <el-date-picker
                v-model="scope.row.expiryDate"
                clearable
                type="date"
                size="mini"
                value-format="yyyy-MM-dd"
                placeholder="请选择有效期"
              />
            </template>
          </el-table-column>
          <el-table-column label="单价" align="center" prop="price" width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.price" size="mini" :min="0" :precision="2" placeholder="请输入单价" />
            </template>
          </el-table-column>
          <el-table-column label="入库数量" align="center" prop="quantity" width="140">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.quantity" size="mini" :min="0" :precision="0" placeholder="请输入入库数量" />
            </template>
          </el-table-column>
          <el-table-column v-if="form.inboundId" label="总价格" align="center" prop="totalAmount" width="140">
            <template slot-scope="scope">
              <el-input v-model="scope.row.totalAmount" size="mini" disabled />
            </template>
          </el-table-column>
          <el-table-column label="备注" align="center" prop="remark" width="170">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" size="mini" type="textarea" placeholder="请输入备注" />
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
import { listInbound, getInbound, delInbound, addInbound, updateInbound } from '@/api/consumable/inbound'
import { listAllArchive } from '@/api/consumable/archive'

export default {
  name: 'Inbound',
  dicts: ['consumable_inbound_type', 'consumable_inbound_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedBsConsumableInboundDetail: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 耗材入库单主表格数据
      inboundList: [],
      // 耗材入库单明细表格数据
      bsConsumableInboundDetailList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        inboundNo: null,
        supplier: null,
        operator: null,
        status: null,
        inboundType: null
      },
      // 表单参数
      form: {},
      // 档案选项
      archiveOptions: [],
      // 表单校验
      rules: {
        inboundNo: [
          { required: true, message: '入库单号不能为空', trigger: 'blur' }
        ],
        inboundDate: [
          { required: true, message: '入库日期不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getArchiveList()
  },
  methods: {
    /** 查询耗材入库单主列表 */
    getList() {
      this.loading = true
      listInbound(this.queryParams).then(response => {
        this.inboundList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 查询全部耗材档案列表列表
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
        inboundId: null,
        inboundNo: null,
        inboundDate: null,
        inboundType: null,
        supplier: null,
        operator: null,
        status: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isDelete: null
      }
      this.bsConsumableInboundDetailList = []
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
      this.ids = selection.map(item => item.inboundId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加耗材入库单主'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const inboundId = row.inboundId || this.ids
      getInbound(inboundId).then(response => {
        this.form = response.data
        this.bsConsumableInboundDetailList = response.data.bsConsumableInboundDetailList
        this.open = true
        this.title = '修改耗材入库单主'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.bsConsumableInboundDetailList = this.bsConsumableInboundDetailList
          if (this.form.inboundId != null) {
            updateInbound(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addInbound(this.form).then(response => {
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
      const inboundIds = row.inboundId || this.ids
      this.$modal.confirm('是否确认删除耗材入库单编号为"' + inboundIds + '"的数据项？').then(function() {
        return delInbound(inboundIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => { })
    },
    /** 耗材入库单明细序号 */
    rowBsConsumableInboundDetailIndex({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    /** 耗材入库单明细添加按钮操作 */
    handleAddBsConsumableInboundDetail() {
      const obj = {}
      obj.consumableId = ''
      obj.batchNo = ''
      obj.expiryDate = ''
      obj.price = ''
      obj.quantity = ''
      obj.totalAmount = ''
      obj.remark = ''
      this.bsConsumableInboundDetailList.push(obj)
    },
    /** 耗材入库单明细删除按钮操作 */
    handleDeleteBsConsumableInboundDetail() {
      if (this.checkedBsConsumableInboundDetail.length === 0) {
        this.$modal.msgError('请先选择要删除的耗材入库单明细数据')
      } else {
        const bsConsumableInboundDetailList = this.bsConsumableInboundDetailList
        const checkedBsConsumableInboundDetail = this.checkedBsConsumableInboundDetail
        this.bsConsumableInboundDetailList = bsConsumableInboundDetailList.filter(function(item) {
          return checkedBsConsumableInboundDetail.indexOf(item.index) === -1
        })
      }
    },
    /** 复选框选中数据 */
    handleBsConsumableInboundDetailSelectionChange(selection) {
      this.checkedBsConsumableInboundDetail = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('consumable/inbound/export', {
        ...this.queryParams
      }, `inbound_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
