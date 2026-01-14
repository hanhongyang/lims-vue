<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="设备名称" prop="instrumentName">
        <el-input v-model="queryParams.instrumentName" placeholder="请输入设备名称" clearable @keyup.enter.native="handleQuery"
          style="width: 180px;" />
      </el-form-item>
      <el-form-item label="设备编码" prop="instrumentCode">
        <el-input v-model="queryParams.instrumentCode" placeholder="请输入设备编码" clearable @keyup.enter.native="handleQuery"
          style="width: 180px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['instrument:instruments:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['instrument:instruments:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
      style="width: 100%;min-height: 200px;">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="设备名称" align="center" prop="instrumentName" min-width="200" />
      <el-table-column label="设备编码" align="center" prop="instrumentCode" min-width="200" />
      <el-table-column label="设备型号" align="center" prop="mdoelNumber" min-width="200" />
      <el-table-column label="设备类型" align="center" prop="type" min-width="200" />
      <el-table-column label="安装地点" align="center" prop="installationLocation" min-width="200" />
      <el-table-column label="用途" align="center" prop="purpose" min-width="200" />
      <el-table-column label="公司名称" align="center" prop="deptName" min-width="200" />
      <el-table-column label="负责人" align="center" prop="responsiblePerson" width="100" :show-overflow-tooltip="true" />
      <!-- <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" active-value="1" inactive-value="0"
            @change="handleStatusChange(scope.row)"></el-switch>
        </template>
</el-table-column> -->
      <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" active-value="1" inactive-value="0"
            @change="handleStatusChange(scope.row)" style="padding-right:10px"></el-switch>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['instrument:instruments:edit']">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import { listInstrument } from '@/api/instrument/device';
export default {
  dicts: ["qi_ting_type"],
  name: "device",
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
        instrumentName: "",
        isEnable: "",
        instrumentCode: "",
      },
      openwl: false,

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listInstrument(this.queryParams).then(response => {
        console.log(response);
        if (response.code == '200') {
          this.tablepagelist = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      });
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
    // 使用记录
    handleJL() {
      this.openwl = true
    },
    /** 新增按钮操作 */
    handleAdd() {
      //直接跳转
      this.$router.push('/instrument/devicecreate');
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.bsInstrumentsId;
      //直接跳转
      this.$router.push({
        path: '/instrument/devicecreate',
        query: { id },
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/instrument/instruments/export', {
        ...this.queryParams
      }, `设备档案_${new Date().getTime()}.xlsx`);
    },

  }
};
</script>
<style>
.el-switch {
  margin-right: 10px;
}
</style>