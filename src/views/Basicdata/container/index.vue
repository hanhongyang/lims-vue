<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="容器名称" prop="containerName">
        <el-input v-model="queryParams.containerName" placeholder="请输入容器名称" clearable @keyup.enter.native="handleQuery"
          style="width: 180px;" />
      </el-form-item>
      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.qi_ting_type" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['basicdata:labTestItems:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:labTestItems:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
      style="width: 100%;min-height: 200px;">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="容器名称" align="center" prop="containerName" min-width="200" />
      <el-table-column label="容器编码" align="center" prop="containerCode" min-width="200" />
      <el-table-column label="公司" align="center" prop="companyName" min-width="200" />
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" active-value="1" inactive-value="0"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:labTestItems:edit']">修改</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="formrules" label-width="80px">
        <el-form-item label="容器名称" prop="containerName">
          <el-input v-model="form.containerName" placeholder="容器名称" />
        </el-form-item>
        <el-form-item label="容器编码" prop="containerCode">
          <el-input v-model="form.containerCode" placeholder="容器编码" />
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
import { getpagelist, addobj, getdetail, updateobj, changestatus } from '@/api/Basicdata/container';
export default {
  dicts: ["qi_ting_type"],
  name: "container",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      tablepagelist: [],
      // 弹出层标题
      title: "",
      isregiet: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        containerName: "",
        isEnable: "",
      },
      // 表单参数
      form: {
        bsContainerId: "",
        containerName: "",
        containerCode: "",
        companyName: "",
        companyId: "",
      },
      // 表单校验
      formrules: {
        containerName: [
          { required: true, message: '请输入容器名称', trigger: 'blur' },
        ],
        containerCode: [
          { required: true, message: '请输入容器编码', trigger: 'blur' },
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      getpagelist(this.queryParams).then(response => {
        console.log(response);
        if (response.code == '200') {
          this.tablepagelist = response.rows;
          this.total = response.total;
          this.loading = false;
        }
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
        bsContainerId: "",
        containerName: "",
        containerCode: "",
        companyName: "",
        companyId: "",
      };
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isregiet = false;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const labtestItemsId = row.labtestItemsId;
      getdetail(labtestItemsId).then(response => {
        this.form = response.data;
        this.open = true;
        this.isregiet = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.labtestItemsId != "") {
            this.loading = true
            updateobj(this.form).then(response => {
              this.loading = false
              if (response.code == '200') {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.loading = true
            addobj(this.form).then(response => {
              this.loading = false
              if (response.code == '200') {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        } else {
          this.$modal.msgError("请检查必填项是否填写");
        }
      });
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.isEnable === "1" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.itemName + '"角色吗？').then(function () {
        return changestatus(row.labtestItemsId, row.isEnable);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function () {
        row.isEnable = row.isEnable === "0" ? "1" : "0";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/basicdata/labTestItems/export', {
        ...this.queryParams
      }, `容器档案_${new Date().getTime()}.xlsx`);
    },

  }
};
</script>