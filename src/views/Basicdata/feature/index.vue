<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="特性描述" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入特性描述" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="启用状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['basicdata:feature:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:feature:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="featureList" height="69vh">
      <el-table-column type="index" align="center" label="序号" width="50" />
      <el-table-column label="特性描述" align="center" prop="name" />
      <el-table-column label="是否启用" align="center" prop="isEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_enable" :value="scope.row.isEnable" />
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" prop="createBy" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="updateBy" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:feature:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleStatusChange(scope.row)"
            v-hasPermi="['basicdata:feature:edit']">启用/停用</el-button>
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

    <!-- 添加或修改检测特性对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="85px">
        <el-form-item label="特性描述" prop="name">
          <el-input v-model="form.name" placeholder="请输入特性描述" />
        </el-form-item>
      
        <el-form-item label="第一上限" prop="firstUpperLimit">
          <el-input v-model="form.firstUpperLimit" placeholder="请输入第一上限" clearable  />
        </el-form-item>

        <el-form-item label="第一下限" prop="firstLowerLimit">
          <el-input v-model="form.firstLowerLimit" placeholder="请输入第一下限" clearable  />
        </el-form-item>
        <!-- 上限 -->
        <el-form-item label="上限" prop="upperLimit">
          <el-input v-model="form.upperLimit" placeholder="请输入上限" clearable @input="clearLimit('upper')" />
        </el-form-item>

        <!-- 下限 -->
        <el-form-item label="下限" prop="lowerLimit">
          <el-input v-model="form.lowerLimit" placeholder="请输入下限" clearable @input="clearLimit('lower')" />
        </el-form-item>
        <el-form-item label="计量单位" prop="unitOfMeasurement">
          <el-select v-model="form.unitOfMeasurement" placeholder="请选择计量单位">
            <el-option v-for="dict in dict.type.unit_of_measurement" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="允许误差" prop="allowError">
          <el-input v-model="form.allowError" placeholder="请输入允许误差" />
        </el-form-item>
        <el-form-item label="误差判断值" prop="errorInfo">
          <el-input v-model="form.errorInfo" placeholder="自动拼接，可手动调整" />
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
import { listFeature, getFeature, changeEnable, addFeature, updateFeature } from "@/api/Basicdata/feature";

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
      // 检测特性表格数据
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
      form: {
        bsLabtestFeatureId: null,
        name: null,
        info: null,
        upperLimit: null,   // ← 补上
        lowerLimit: null,   // ← 补上
        unitOfMeasurement: null,
        allowError: null,
        errorInfo: null,
        deptId: null,
        createTime: null,
        createBy: null,
        updateTime: null,
        updateBy: null,
        isDelete: null,
        isEnable: null,
        qualitativeOrQuantitative: null,
        qualitativeType: null
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "特性描述不能为空", trigger: "blur" }
        ],
        unitOfMeasurement: [
          { required: true, message: "请选择计量单位", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  watch: {
    // 上限 / 下限 / 允许误差 任一变化就重算
    'form.upperLimit': 'calcErrorInfo',
    'form.lowerLimit': 'calcErrorInfo',
    'form.allowError': 'calcErrorInfo'
  },
  methods: {
    // 输入上限时清下限，输入下限时清上限
    clearLimit(side) {
      this.$nextTick(() => {
        if (side === 'upper') {
          if (this.form.lowerLimit) {          // 只有当下限原来有值才提示
            this.$message({
              message: '输入上限自动清空下限',
              type: 'info'
            });
          }
          this.form.lowerLimit = '';
        } else {
          if (this.form.upperLimit) {          // 只有上限原来有值才提示
            this.$message({
              message: '输入下限清空上限',
              type: 'info'
            });
          }
          this.form.upperLimit = '';
        }
      });
    },
    // 自动拼接误差判断值
    calcErrorInfo() {
      // 先把空字符串/undefined转为NaN，确保判断统一
      const upper = this.form.upperLimit ? Number(this.form.upperLimit) : NaN;
      const lower = this.form.lowerLimit ? Number(this.form.lowerLimit) : NaN;
      const error = this.form.allowError ? Number(this.form.allowError) : 0;

      // 1. 上下限都无值 → 清空
      if (isNaN(upper) && isNaN(lower)) {
        this.form.errorInfo = '';
        return;
      }

      // 2. 有上下限但无允许误差 → 清空
      if (error === 0 && (upper || lower)) {
        this.form.errorInfo = '';
        return;
      }

      // 3. 有上限 → 计算上限误差
      if (!isNaN(upper)) {
        this.form.errorInfo = `≤${upper + error}`;
      }
      // 4. 有下限 → 计算下限误差（覆盖/单独显示）
      if (!isNaN(lower)) {
        this.form.errorInfo = `≥${lower - error}`;
      }
    },
    /** 查询检测特性列表 */
    getList() {
      this.loading = true;
      listFeature(this.queryParams).then(response => {
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
        bsLabtestFeatureId: null,
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
      this.title = "添加检测特性";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.deptId);
      this.reset();
      console.log(row.deptId);
      const bsLabtestFeatureId = row.bsLabtestFeatureId;
      getFeature(bsLabtestFeatureId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改检测特性";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bsLabtestFeatureId != null) {
            updateFeature(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFeature(this.form).then(response => {
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
      this.download('basicdata/feature/export', {
        ...this.queryParams
      }, `检测特性_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
