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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['labtest:feedEntrustOrder:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['labtest:feedEntrustOrder:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="feedEntrustOrderList" height="69vh">
      <el-table-column type="index" align="center" label="序号" width="50" />
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
      <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
      <el-table-column label="委托方联系电话" align="center" prop="entrustContactPhone" />
      <el-table-column label="样品数量" align="center" prop="totalSampleQuantity" />
      <el-table-column label="接收人" align="center" prop="receiverName" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { listFeedEntrustOrder, getprintFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";

export default {
  name: "FeedEntrustOrder",
  dicts: ['entrust_order_status'],
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
      // 饲料样品委托单表格数据
      feedEntrustOrderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: null,
        entrustDeptName: null,
        sendSampleDateRange: [],
        sendSampleDateStart: null, // 新增开始时间
        sendSampleDateEnd: null,   // 新增结束时间
        status: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询饲料样品委托单列表 */
    getList() {
      this.loading = true;
      listFeedEntrustOrder(this.queryParams).then(response => {
        this.feedEntrustOrderList = response.rows;
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
      this.$router.push('/CentralLaboratory/FeedEntrustOrderCreate').catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },
    /** 打印按钮操作 */
    handleUpdate(row) {
      const id = row.opFeedEntrustOrderId || this.ids
      
      // const encodedData = encodeURIComponent(id);
      const routeUrl = this.$router.resolve({
        path: '/dyylprint',
        query: { id: id }
      });
      window.open(routeUrl.href, '_blank');
      // getprintFeedEntrustOrder(id).then(res => {
      //   console.log(res, '11111111111')
      //   if (res.code == 200) {
      //     // this.$router.push({ path: '/dyylprint', query: { Details: res.data } });
      //     const encodedData = encodeURIComponent(JSON.stringify(res.data));
      //     // 使用路由生成完整URL，避免history模式路径问题
      //     const routeUrl = this.$router.resolve({
      //       path: '/dyylprint',
      //       query: { Details: encodedData }
      //     });
      //     window.open(routeUrl.href, '_blank'); // 用路由生成的href，而非手动拼接
      //   }

      // })

      // this.$router.push({ path: '/CentralLaboratory/FeedEntrustOrderCreate', query: { id: id } });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('labtest/feedEntrustOrder/export', {
        ...this.queryParams
      }, `feedEntrustOrder_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>