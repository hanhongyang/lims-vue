<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模板编码" prop="templateCode">
        <el-input v-model="queryParams.templateCode" placeholder="请输入模板编码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="queryParams.templateName" placeholder="请输入模板名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="featureList">
      <el-table-column type="index" align="center" label="序号" width="50" />
      <el-table-column label="模板编码" align="center" prop="templateCode" />
      <el-table-column label="模板名称" align="center" prop="templateName" />
      <el-table-column label="模板类型" align="center" prop="templateType">
        <template slot-scope="scope">
          {{ scope.row.templateType == 0 ? '饲料检验模板' : scope.row.templateType }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="修改时间" align="center" prop="updateTime" />
      <!-- <el-table-column label="是否删除" align="center" prop="isDelete" />
      <el-table-column label="文件信息" align="center" prop="fileInfo" /> -->

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:feature:edit']">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleStatusChange(scope.row)"
            v-hasPermi="['basicdata:feature:edit']">启用/停用</el-button> -->
          <!--<el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['basicdata:feature:edit']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleStatusChange" icon="el-icon-circle-check"
                v-hasPermi="['basicdata:feature:edit']">启用/停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改报告模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="判断依据" prop="basisForJudgment">
          <el-input v-model="form.basisForJudgment" placeholder="请输入判断依据" />
        </el-form-item>
        <el-form-item label="主要仪器" prop="mainInstruments">
          <el-input v-model="form.mainInstruments" placeholder="请输入主要仪器" />
        </el-form-item>
        <el-form-item label="检验方法" prop="inspectionMethod">
          <el-input v-model="form.inspectionMethod" placeholder="请输入检验方法" />
        </el-form-item>
        <el-form-item label="感官性状" prop="sensoryTraits">
          <el-input v-model="form.sensoryTraits" placeholder="请输入感官性状" />
        </el-form-item>
        <el-form-item label="检验类别" prop="inspectionCategory">
          <el-input v-model="form.inspectionCategory" placeholder="请输入检验类别" />
        </el-form-item>
        <el-form-item label="包装规格" prop="packagingSpecifications">
          <el-input v-model="form.packagingSpecifications" placeholder="请输入包装规格" />
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
import { listreport, getreport, changeEnable, addreport, updatereport } from "@/api/Basicdata/reportMB";

export default {
  name: "Feature",
  dicts: ['qualitative_or_quantitative', 'is_enable', 'unit_of_measurement'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 报告模板表格数据
      featureList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        info: null,
        upperLimit: null,
        lowerLimit: null,
        unitOfMeasurement: null,
        deptId: null,
        isDelete: null,
        isEnable: null,
        qualitativeOrQuantitative: null,
        qualitativeType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        info: [
          { required: true, message: "信息字段不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询报告模板列表 */
    getList() {
      this.loading = true;
      listreport(this.queryParams).then(response => {
        this.featureList = response.rows;
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
        name: null,
        info: null,
        upperLimit: null,
        lowerLimit: null,
        unitOfMeasurement: null,
        deptId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        isDelete: null,
        isEnable: null,
        qualitativeOrQuantitative: null,
        qualitativeType: null
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报告模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row.deptId);
      this.reset();
      // console.log(row.deptId);

      getreport(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报告模板";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatereport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addreport(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 状态修改
    handleStatusChange(row) {
      // 确定目标状态：如果当前是启用(1)，则要停用(0)；如果当前是停用(0)，则要启用(1)
      const targetStatus = row.isEnable === "1" ? "0" : "1";
      const text = targetStatus === "0" ? "停用" : "启用";

      this.$modal
        .confirm('确认要"' + text + '""' + row.name + '"吗？')
        .then(() => {
          // 传递目标状态给后端
          return changeEnable(row.bsLabtestFeatureId, targetStatus);
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
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleStatusChange":
          console.log(row.isEnable);
          this.handleStatusChange(row);
          break;
        default:
          break;
      }
    },    /** 导出按钮操作 */
    handleExport() {
      this.download('basicdata/template/export', {
        ...this.queryParams
      }, `报告模板_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
