<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="送检单号" prop="entrustOrderNo">
        <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入送检单号" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="委托单位" prop="entrustDeptName">
        <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="送检时间" prop="sendSampleDateRange">
        <el-date-picker clearable v-model="queryParams.sendSampleDateRange" type="daterange" value-format="yyyy-MM-dd"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option v-for="dict in dict.type.entrust_order_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="检测项目" prop="bloodTaskItemType">
        <el-select v-model="queryParams.bloodTaskItemType" placeholder="请选择检测项目" clearable style="width: 180px">
          <el-option v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item> -->
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


    <el-table v-loading="loading" :data="bloodEntrustOrderList" @selection-change="handleSelectionChange" height="70vh">

      <el-table-column label="送检单号" align="center" prop="entrustOrderNo" />
      <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.entrust_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="送样时间" align="center" prop="sendSampleDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sendSampleDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
        </template>
      </el-table-column> -->
      <el-table-column label="样品数量" align="center" prop="totalSampleQuantity" />
      <el-table-column label="送样人" align="center" prop="sendSampleUserName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退回状态" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.isReturn === '1' ? '已退回' : '未退回' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { listBloodEntrustOrder } from "@/api/CentralLaboratory/bloodEntrustOrder";

export default {
  name: "BloodEntrustOrder",
  dicts: ['entrust_order_status', 'blood_task_item_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 血样样品委托单表格数据
      bloodEntrustOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // jibing: '1',
        entrustOrderNo: null,
        entrustDeptName: null,
        sendSampleDateRange: [],
        sendSampleDateStart: null, // 新增开始时间
        sendSampleDateEnd: null,   // 新增结束时间
        sendSampleUserName: null,
        status: null,
        bloodTaskItemType: '8',
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询血样样品委托单列表 */
    getList() {
      this.loading = true;
      listBloodEntrustOrder(this.queryParams).then(response => {
        this.bloodEntrustOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // 处理日期范围
      if (this.queryParams.sendSampleDateRange && this.queryParams.sendSampleDateRange.length === 2) {
        this.queryParams.sendSampleDateStart = this.queryParams.sendSampleDateRange[0];
        this.queryParams.sendSampleDateEnd = this.queryParams.sendSampleDateRange[1];
      } else {
        this.queryParams.sendSampleDateStart = null;
        this.queryParams.sendSampleDateEnd = null;
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.sendSampleDateRange = []; // 重置日期范围
      this.queryParams.sendSampleDateStart = null;
      this.queryParams.sendSampleDateEnd = null;
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push('/CentralLaboratory/shEntrustOrderCreate').catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.opBloodEntrustOrderId || this.ids
      this.$router.push({ path: '/CentralLaboratory/shEntrustOrderCreate', query: { id: id } });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('labtest/bloodEntrustOrder/export', {
        ...this.queryParams
      }, `bloodEntrustOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
