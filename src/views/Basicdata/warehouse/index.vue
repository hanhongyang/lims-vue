<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="奶仓名称" prop="warehouseName">
        <el-input v-model="queryParams.warehouseName" placeholder="请输入奶仓名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="奶仓地址" prop="warehouseAddress">
        <el-input
          v-model="queryParams.warehouseAddress"
          placeholder="请输入奶仓地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="奶仓编号" prop="warehouseNumber">
        <el-input v-model="queryParams.warehouseNumber" placeholder="请输入奶仓编号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['basicdata:warehouse:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['basicdata:warehouse:edit']">修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['basicdata:warehouse:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:warehouse:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehouseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="奶仓信息表主键" align="center" prop="id" /> -->
      <el-table-column label="奶仓状态" align="center">
        <template slot-scope="warehouseList">
          <el-tag type="success" effect="dark" v-if="warehouseList.row.warehouseStatus == 0">启用</el-tag>
          <el-tag type="danger" effect="dark" v-if="warehouseList.row.warehouseStatus == 1">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="奶仓名称" align="center" prop="warehouseName" />
      <el-table-column label="奶仓地址" align="center" prop="warehouseAddress" />
      <el-table-column label="奶仓编号" align="center" prop="warehouseNumber" />
      <!-- <el-table-column label="部门id" align="center" prop="deptId" /> -->
      <el-table-column label="部门名称" align="center" prop="deptName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:warehouse:edit']">修改</el-button>
          <el-button size="mini" type="text" :icon="scope.row.warehouseStatus == 0 ? 'el-icon-close' : 'el-icon-check'"
            :type="scope.row.warehouseStatus == 0 ? 'danger' : 'success'" @click="handleStatus(scope.row)"
            v-hasPermi="['basicdata:warehouse:edit']">
            {{ scope.row.warehouseStatus == 0 ? '停用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改奶仓档案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="奶仓名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" placeholder="请输入奶仓名称" @input="handleInput" />
        </el-form-item>
        <el-form-item label="奶仓地址" prop="warehouseAddress">
          <el-input v-model="form.warehouseAddress" placeholder="请输入奶仓地址" />
        </el-form-item>
        <el-form-item label="奶仓编号" prop="warehouseNumber">
          <el-input v-model="form.warehouseNumber" placeholder="请输入奶仓编号" @input="handleInputwarehouseNumber" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehouse, getWarehouse, delWarehouse, addWarehouse, updateWarehouse } from "@/api/Basicdata/warehouse";

export default {
  name: "Warehouse",
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
      // 奶仓档案表格数据
      warehouseList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        warehouseStatus: null,
        warehouseName: null,
        warehouseAddress: null,
        warehouseNumber: null,
        deptId: null,
        deptName: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        warehouseName: [
          { required: true, message: '奶仓名称不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '奶仓名称不能以 0 开头', trigger: 'blur' }
        ],
        warehouseNumber: [
          { required: true, message: '奶仓编号不能为空', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/, message: '奶仓编号不能以 0 开头', trigger: 'blur' }
        ],
        warehouseAddress: [
          { required: true, message: '奶仓地址不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleInput(val) {
      // 实时去掉开头的 0
      this.$nextTick(() => {
        this.form.warehouseName = val.replace(/^0+/, '').replace(/[^\d]/g, '');
      });
    },
    handleInputwarehouseNumber(val) {
      this.$nextTick(() => {
        this.form.warehouseNumber = val.replace(/^0+/, '').replace(/[^\d]/g, '');
      });
    },
    /** 查询奶仓档案列表 */
    getList() {
      this.loading = true;
      listWarehouse(this.queryParams).then(response => {
        this.warehouseList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        warehouseStatus: null,
        warehouseName: null,
        warehouseAddress: null,
        warehouseNumber: null,
        deptId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        deptName: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加奶仓档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWarehouse(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改奶仓档案";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehouse(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除奶仓档案编号为"' + ids + '"的数据项？').then(function () {
        return delWarehouse(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    handleStatus(row) {
      console.log(row.warehouseStatus + "----");
      const status = row.warehouseStatus === "0" ? 1 : 0;
      console.log(status + "+++++");
      const text = status === 0 ? '启用' : '停用';

      this.$modal.confirm(`确认${text}该奶仓档案吗？`).then(() => {
        return updateWarehouse({
          id: row.id,
          warehouseStatus: status
        });
      }).then(() => {
        this.$modal.msgSuccess(`${text}成功`);
        this.getList();
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('basicdata/warehouse/export', {
        ...this.queryParams
      }, `warehouse_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
