<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form v-show="showSearch" ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="100px">
      <el-form-item label="主取样码" prop="mainSamplingCode">
        <el-input v-model="queryParams.mainSamplingCode" placeholder="请输入主取样码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-date-picker v-model="queryParams.year" type="year" placeholder="年度" style="width: 180px;"
          value-format="yyyy" format="yyyy">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-hasPermi="['generate:code:create']" type="primary" plain icon="el-icon-plus" size="mini"
          @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-hasPermi="['generate:code:export']" type="warning" plain icon="el-icon-download" size="mini"
          @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 消毒池列表区域 -->
    <el-table v-loading="loading" :data="disinfectionList">
      <el-table-column label="序号" type="index" align="center" width="60" />

      <el-table-column label="生成数量" align="center" prop="generationQuantity" show-overflow-tooltip />
      <el-table-column label="生成时间" align="center" prop="generationTime" show-overflow-tooltip />
      <el-table-column label="年度" align="center" prop="year" show-overflow-tooltip />
      <el-table-column label="牧场名称" align="center" prop="cztname" show-overflow-tooltip />
      <el-table-column label="牧场简码" align="center" prop="ccorpcode" show-overflow-tooltip />
      <el-table-column label="公司名称" align="center" prop="companyName" show-overflow-tooltip />
      <el-table-column label="部门名称" align="center" prop="deptName" show-overflow-tooltip />
      <el-table-column label="是否生成取样码" align="center" prop="isSamplingCode" show-overflow-tooltip />
      <el-table-column label="是否打印" align="center" prop="whetherToPrint" show-overflow-tooltip />
      <!-- 操作列 -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-hasPermi="['generate:code:query']" size="mini" type="text" icon="el-icon-document"
            @click="handleqx(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script>
import { getsamplinglist, addobj } from '@/api/Basicdata/samplingcode'
export default {
  name: 'samplingcode',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      disinfectionList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        poolName: null
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询消毒池管理列表 */
    getList() {
      this.loading = true
      getsamplinglist(this.queryParams).then((response) => {
        this.disinfectionList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 新增
    handleAdd() {
      this.$router.push({
        path: '/samplingcode/create',
      });
    },
    /** 修改按钮操作 */
    handleqx(row) {
      const id = row.generateSamplingCodeId;
      this.$router.push({
        path: '/samplingcode/create',
        query: { id },
      });
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
      this.ids = selection.map((item) => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/generate/sampling/code/export',
        {
          ...this.queryParams
        },
        `库存取样_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
