<template>
  <div class="app-container">
    <!-- Tabs -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="饲料" name="feed" />
      <el-tab-pane label="PCR" name="pcr" />
      <el-tab-pane label="血样" name="blood" />
    </el-tabs>

    <!-- 查询表单 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="currentQueryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="委托单号">
        <el-input
          v-model="currentQueryParams.entrustOrderNo"
          placeholder="请输入委托单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="委托单位">
        <el-input
          v-model="currentQueryParams.entrustDeptName"
          placeholder="请输入委托单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="送检时间">
        <el-date-picker
          v-model="currentQueryParams.sendSampleDateRange"
          type="daterange"
          clearable
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
        />
      </el-form-item>

      <el-form-item label="状态">
        <el-select
          v-model="currentQueryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.entrust_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">
          导出
        </el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="currentList"
      height="70vh"
    >
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column prop="entrustOrderNo" label="委托单号" align="center" />
      <el-table-column prop="entrustDeptName" label="委托单位" align="center" />

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.entrust_order_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>

      <el-table-column label="送检时间" align="center" width="160">
        <template slot-scope="scope">
          {{ parseTime(scope.row.sendSampleDate, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>

      <el-table-column prop="entrustContact" label="联系人" align="center" />
      <el-table-column prop="entrustContactPhone" label="联系电话" align="center" />
      <el-table-column prop="totalSampleQuantity" label="样品数量" align="center" />
      <el-table-column prop="receiverName" label="接收人" align="center" />

      <el-table-column label="创建时间" align="center" width="160">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>

      <el-table-column label="退回状态" align="center">
        <template slot-scope="scope">
          {{ scope.row.isReturn === '1' ? '已退回' : '未退回' }}
        </template>
      </el-table-column>

      <el-table-column prop="createBy" label="创建人" align="center" />

      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="currentTotal > 0"
      :total="currentTotal"
      :page.sync="currentQueryParams.pageNum"
      :limit.sync="currentQueryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { listFeedEntrustOrder } from '@/api/CentralLaboratory/feedEntrustOrder'
import { listBloodEntrustOrder } from '@/api/CentralLaboratory/bloodEntrustOrder'
import { listPcrEntrustOrder } from '@/api/CentralLaboratory/pcrEntrustOrder'

export default {
  name: 'EntrustOrderTab',
  dicts: ['entrust_order_status'],
  data() {
    return {
      activeTab: 'feed',
      loading: false,
      showSearch: true,

      queryParamsMap: {
        feed: this.initQueryParams(),
        pcr: this.initQueryParams(),
        blood: this.initQueryParams()
      },

      listMap: {
        feed: [],
        pcr: [],
        blood: []
      },

      totalMap: {
        feed: 0,
        pcr: 0,
        blood: 0
      },

      apiMap: {
        feed: listFeedEntrustOrder,
        pcr: listPcrEntrustOrder,
        blood: listBloodEntrustOrder
      }
    }
  },
  computed: {
    currentQueryParams() {
      return this.queryParamsMap[this.activeTab]
    },
    currentList() {
      return this.listMap[this.activeTab]
    },
    currentTotal() {
      return this.totalMap[this.activeTab]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    initQueryParams() {
      return {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: null,
        entrustDeptName: null,
        sendSampleDateRange: [],
        sendSampleDateStart: null,
        sendSampleDateEnd: null,
        status: null
      }
    },

    handleTabClick() {
      this.currentQueryParams.pageNum = 1
      this.getList()
    },

    getList() {
      this.loading = true
      const api = this.apiMap[this.activeTab]
      api(this.currentQueryParams).then((res) => {
        this.listMap[this.activeTab] = res.rows
        this.totalMap[this.activeTab] = res.total
        this.loading = false
      })
    },

    handleQuery() {
      const p = this.currentQueryParams
      if (p.sendSampleDateRange?.length === 2) {
        p.sendSampleDateStart = p.sendSampleDateRange[0]
        p.sendSampleDateEnd = p.sendSampleDateRange[1]
      } else {
        p.sendSampleDateStart = null
        p.sendSampleDateEnd = null
      }
      p.pageNum = 1
      this.getList()
    },

    resetQuery() {
      Object.assign(this.currentQueryParams, this.initQueryParams())
      this.getList()
    },

    handleAdd() {
      this.$router.push(`/CentralLaboratory/${this.activeTab}EntrustOrderCreate`)
    },

    handleUpdate(row) {
      this.$router.push({
        path: `/CentralLaboratory/${this.activeTab}EntrustOrderCreate`,
        query: { id: row.id }
      })
    },

    handleExport() {
      this.download(
        `labtest/${this.activeTab}EntrustOrder/export`,
        this.currentQueryParams,
        `${this.activeTab}_entrust_order_${Date.now()}.xlsx`
      )
    }
  }
}
</script>
