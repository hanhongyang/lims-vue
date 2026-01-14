<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="公司" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery"
          style="width: 180px" />
      </el-form-item>

      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
        <!-- <el-button type="primary" @click="handleAdd">新增</el-button> -->
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
      style="width: 100%; min-height: 200px" @selection-change="handleSelectionChange">
      <el-table-column label="项目名称" align="center" prop="itemName" min-width="200" />
      <!-- <el-table-column label="是否删除" align="center" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isDelete === '1' ? 'primary' : 'success'" disable-transitions>
            {{ scope.row.isDelete === '0' ? '已删除' : '未删除' }}
          </el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="创建人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleStatusChange(scope.row)"
            v-hasPermi="['basicdata:contact:edit']">启用/停用</el-button> -->
          <!-- <el-button size="mini" type="text" icon="el-icon-document" @click="handleStatusChange(scope.row)"
            v-hasPermi="['']">更改</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
import {
  getpagelist,
  addobj,
  getdetail,
  updateobj,
  changestatus,
} from "@/api/Basicdata/designatedDeptId";
export default {
  dicts: ["is_enable"],
  name: "Testingitems",
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
        deptName: "",
        email: "",
        isEnable: "",
      },
      // 表单参数
      form: {
        labtestItemsId: "",
        itemName: "",
        itemCode: "",
      },
      // 表单校验
      formrules: {
        deptName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        isEnable: [
          { required: true, message: "请输入状态", trigger: "blur" },
        ],
        createBy: [
          { required: true, message: "请输入创建人", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "请输入创建时间", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      getpagelist(this.queryParams).then((response) => {
        console.log(response, '查询列表');
        if (response.code == "200") {
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
        labtestItemsId: "",
        itemName: "",
        itemCode: "",
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
      this.$router.push({
        path: '/basicdata/designatedDeptIdcreate',
        query: { op: 'add', isEnable: '1' }   // 新增并默认启用
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row, '修改点击这一行的数据')
      // this.reset();
      // const labtestItemsId = row.labtestItemsId;
      // getdetail(labtestItemsId).then((response) => {
      //   if (response.code == "200") {
      //     if (response.data) {
      //       this.form = response.data;
      //       this.open = true;
      //       this.isregiet = true;
      //       this.title = "修改";
      //     }
      //   }
      // });
      const id = row.opSamplingTestItemDeptId;
      //直接跳转
      this.$router.push({
        path: '/basicdata/designatedDeptIdcreate',
        query: { op: 'edit', row: String(id) }   // 或者直接 id: id
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.labtestItemsId != "") {
            this.loading = true;
            updateobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == "200") {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.loading = true;
            addobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == "200") {
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
    // // 状态修改
    // handleStatusChange(row) {
    //   let text = row.isEnable === "0" ? "启用" : "停用";
    //   console.log(row, '111111111111111')
    //   this.$modal
    //     .confirm('确认要"' + text + '""' + row.deptName + '"角色吗？')
    //     .then(function () {
    //       console.log(row.id, '222222222222222')
    //       return changestatus(row.id, row.isEnable);

    //     })
    //     .then(() => {
    //       // 调取更改状态接口




    //       this.$modal.msgSuccess(text + "成功");
    //       this.getList();
    //     })
    //     .catch(function () {
    //       // row.isEnable = row.isEnable === "0" ? "1" : "0";
    //     });
    // },
    handleStatusChange(row) {
      // 确定目标状态：如果当前是启用(1)，则要停用(0)；如果当前是停用(0)，则要启用(1)
      const targetStatus = row.isEnable === "1" ? "0" : "1";
      const text = targetStatus === "0" ? "停用" : "启用";

      this.$modal
        .confirm('确认要"' + text + '""' + row.deptName + '"吗？')
        .then(() => {
          // 传递目标状态给后端
          return changestatus(row.id, targetStatus);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");

          // 重新获取列表数据
          this.getList();
        })
        .catch(() => {
          // 取消操作，不需要做任何改变
          this.$modal.msgInfo("已取消操作");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/basicdata/dept/export",
        {
          ...this.queryParams,
        },
        `检测项目_${new Date().getTime()}.xlsx`
      );
    },
    /** 表格选中行 **/
    handleSelectionChange(val) {
      console.log('当前选中行：', val);
    }
  },
};
</script>