<template>
  <div class="app-container">
    <!-- Tabs -->
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="饲料检测" name="feed" />
      <el-tab-pane label="PCR检测" name="pcr" />
      <el-tab-pane label="疾病检测" name="disease" />
      <el-tab-pane label="早孕检测" name="earlyPregnancy" />
      <el-tab-pane label="生化检测" name="biochemistry" />
    </el-tabs>

    <!-- 查询表单 -->
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="currentConfig.queryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item
        v-for="item in currentConfig.queryForm"
        :key="item.prop"
        :label="item.label"
      >
        <el-input
          v-if="item.type === 'input'"
          v-model="currentConfig.queryParams[item.prop]"
          :placeholder="item.placeholder"
          clearable
        />

        <el-date-picker
          v-else-if="item.type === 'daterange'"
          v-model="currentConfig.queryParams[item.prop]"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
        />

        <el-select
          v-else-if="item.type === 'select'"
          v-model="currentConfig.queryParams[item.prop]"
          clearable
          :placeholder="item.placeholder || '请选择'"
          style="width: 180px"
        >
          <el-option
            v-for="opt in dict.type[item.dictType]"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select></el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="handleQuery">
          搜索
        </el-button>
        <el-button size="mini" icon="el-icon-refresh" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list">
      <el-table-column
        v-for="col in currentConfig.tableColumns"
        :key="col.prop"
        :label="col.label"
        :prop="col.prop"
        align="center"
      >
        <template slot-scope="scope">
          <dict-tag
            v-if="col.type === 'dict'"
            :options="dict.type[col.dictType]"
            :value="scope.row[col.prop]"
          />
          <span v-else>
            {{ scope.row[col.prop] || '---' }}
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="currentConfig.queryParams.pageNum"
      :limit.sync="currentConfig.queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { queryJczxFeedReportBaseId } from '@/api/CentralLaboratory/jczxFeedReport'
import { queryjczxPcrReportBaseId } from '@/api/CentralLaboratory/jczxPCRReport'
import {
  queryJczxDiseaseReportBaseId,
  queryEarlyPregnancyReportBaseId,
  queryBiochemistryReportBaseId
} from '@/api/CentralLaboratory/jczxBloodReport'

export default {
  name: 'JczxReportQuery',
  dicts: ['feed_report_status', 'blood_task_item_type'],

  data() {
    return {
      activeTab: 'feed',
      loading: false,
      showSearch: true,
      total: 0,
      list: [],

      TAB_CONFIG: {
        feed: {
          api: queryJczxFeedReportBaseId,
          queryParams: {
            pageNum: 1,
            pageSize: 10,

            sampleName: null,
            reportNo: null,
            entrustDeptName: null,

            // 表单用
            receiveTime: [],
            sendSampleTime: [],

            // 后端用
            beginReceiveTime: null,
            endReceiveTime: null,
            beginSendSampleTime: null,
            endSendSampleTime: null
          },
          queryForm: [
            { label: '样品名称', prop: 'sampleName', type: 'input', placeholder: '请输入样品名称' },
            { label: '报告编号', prop: 'reportNo', type: 'input', placeholder: '请输入报告编号' },
            { label: '委托单位', prop: 'entrustDeptName', type: 'input', placeholder: '请输入委托单位' },
            { label: '接收时间', prop: 'receiveTime', type: 'daterange' },
            { label: '发样时间', prop: 'sendSampleTime', type: 'daterange' }
          ],
          tableColumns: [
            { label: '报告编号', prop: 'reportNo' },
            { label: '委托单号', prop: 'entrustOrderNo' },
            { label: '样品编号', prop: 'sampleNo' },
            { label: '样品名称', prop: 'sampleName' },
            { label: '委托单位', prop: 'entrustDeptName' },
            { label: '接收时间', prop: 'receiveTime' },
            { label: '状态', prop: 'status', type: 'dict', dictType: 'feed_report_status' },
            { label: '报告时间', prop: 'reportTime' },
            { label: '编制人', prop: 'editUser' }
          ]
        },

        pcr: {
          api: queryjczxPcrReportBaseId,
          queryParams: {
            pageNum: 1,
            pageSize: 10,

            entrustOrderNo: null,
            entrustDeptName: null,

            testTime: [],
            begintestTime: null,
            endtestTime: null
          },
          queryForm: [
            { label: '委托单号', prop: 'entrustOrderNo', type: 'input', placeholder: '请输入委托单号' },
            { label: '委托单位', prop: 'entrustDeptName', type: 'input', placeholder: '请输入委托单位' },
            { label: '检测时间', prop: 'testTime', type: 'daterange' }
          ],
          tableColumns: [
            { label: '委托单号', prop: 'entrustOrderNo' },
            { label: '检测项目', prop: 'pcrTaskItemType' },
            { label: '委托单位', prop: 'entrustDeptName' },
            { label: '样品数量', prop: 'sampleQuantity' },
            { label: '状态', prop: 'status', type: 'dict', dictType: 'feed_report_status' },
            { label: '检测时间', prop: 'testTime' },
            { label: '检测人', prop: 'testUser' }
          ]
        },

        disease: {
          api: queryJczxDiseaseReportBaseId,
          queryParams: {
            pageNum: 1,
            pageSize: 10,

            entrustOrderNo: null,
            entrustDeptName: null,
            bloodTaskItemType: null,

            receiveTime: [],
            beginReceiveTime: null,
            endReceiveTime: null
          },
          queryForm: [
            { label: '委托单号', prop: 'entrustOrderNo', type: 'input', placeholder: '请输入委托单号' },
            { label: '委托单位', prop: 'entrustDeptName', type: 'input', placeholder: '请输入委托单位' },
            { label: '检测项目', prop: 'bloodTaskItemType', type: 'select', dictType: 'blood_task_item_type', placeholder: '请选择检测项目' },
            { label: '接收时间', prop: 'receiveTime', type: 'daterange' }
          ],
          tableColumns: [
            { label: '委托单号', prop: 'entrustOrderNo' },
            { label: '委托单位', prop: 'entrustDeptName' },
            { label: '检测项目', prop: 'bloodTaskItemType', type: 'dict', dictType: 'blood_task_item_type' },
            { label: '状态', prop: 'status', type: 'dict', dictType: 'feed_report_status' },
            { label: '接收', prop: 'receiveTime' }
          ]
        },

        earlyPregnancy: {
          api: queryEarlyPregnancyReportBaseId,
          queryParams: {
            pageNum: 1,
            pageSize: 10,

            receiveTime: [],
            beginReceiveTime: null,
            endReceiveTime: null,

            checkTime: [],
            beginCheckTime: null,
            endCheckTime: null,

            approveTime: [],
            beginApproveTime: null,
            endApproveTime: null,

            editUser: null,
            checkUser: null,
            approveUser: null
          },
          queryForm: [
            { label: '委托单号', prop: 'entrustOrderNo', type: 'input', placeholder: '请输入委托单号' },
            { label: '委托单位', prop: 'entrustDeptName', type: 'input', placeholder: '请输入委托单位' },
            { label: '接收时间', prop: 'receiveTime', type: 'daterange' },
            { label: '审核时间', prop: 'checkTime', type: 'daterange' },
            { label: '批准时间', prop: 'approveTime', type: 'daterange' },
            { label: '编制人', prop: 'editUser', type: 'input', placeholder: '请输入编制人' },
            { label: '审核人', prop: 'checkUser', type: 'input', placeholder: '请输入审核人' },
            { label: '批准人', prop: 'approveUser', type: 'input', placeholder: '请输入批准人' }
          ],
          tableColumns: [
            { label: '委托单号', prop: 'entrustOrderNo' },
            { label: '委托单位', prop: 'entrustDeptName' },
            { label: '接收时间', prop: 'receiveTime' },
            { label: '审核时间', prop: 'checkTime' },
            { label: '批准时间', prop: 'approveTime' },
            { label: '编制人', prop: 'editUser' },
            { label: '审核人', prop: 'checkUser' },
            { label: '批准人', prop: 'approveUser' }
          ]
        },

        biochemistry: {
          api: queryBiochemistryReportBaseId,
          queryParams: { pageNum: 1, pageSize: 10 },
          queryForm: [
            { label: '委托单号', prop: 'entrustOrderNo', type: 'input', placeholder: '请输入委托单号' },
            { label: '委托单位', prop: 'entrustDeptName', type: 'input', placeholder: '请输入委托单位' },
            { label: '接收时间', prop: 'receiveTime', type: 'daterange' },
            { label: '审核时间', prop: 'checkTime', type: 'daterange' },
            { label: '批准时间', prop: 'approveTime', type: 'daterange' },
            { label: '编制人', prop: 'editUser', type: 'input', placeholder: '请输入编制人' },
            { label: '审核人', prop: 'checkUser', type: 'input', placeholder: '请输入审核人' },
            { label: '批准人', prop: 'approveUser', type: 'input', placeholder: '请输入批准人' }
          ],
          tableColumns: [
            { label: '委托单号', prop: 'entrustOrderNo' },
            { label: '委托单位', prop: 'entrustDeptName' },
            { label: '接收时间', prop: 'receiveTime' },
            { label: '审核时间', prop: 'checkTime' },
            { label: '批准时间', prop: 'approveTime' },
            { label: '编制人', prop: 'editUser' },
            { label: '审核人', prop: 'checkUser' },
            { label: '批准人', prop: 'approveUser' }
          ]
        }
      }
    }
  },

  computed: {
    currentConfig() {
      return this.TAB_CONFIG[this.activeTab]
    }
  },

  created() {
    this.getList()
  },

  methods: {
    /** 统一处理 daterange → begin/end */
    handleDateRange(params) {
      const map = [
        { field: 'receiveTime', begin: 'beginReceiveTime', end: 'endReceiveTime' },
        { field: 'sendSampleTime', begin: 'beginSendSampleTime', end: 'endSendSampleTime' },
        { field: 'testTime', begin: 'begintestTime', end: 'endtestTime' },
        { field: 'checkTime', begin: 'beginCheckTime', end: 'endCheckTime' },
        { field: 'approveTime', begin: 'beginApproveTime', end: 'endApproveTime' }
      ]

      map.forEach(({ field, begin, end }) => {
        if (params[field]) {
          params[begin] = params[field][0] || null
          params[end] = params[field][1] || null
          delete params[field]
        }
      })
    },
    getList() {
      this.loading = true
      const { api, queryParams } = this.currentConfig

      this.handleDateRange(queryParams)

      api(queryParams)
        .then(res => {
          this.list = res.rows || []
          this.total = res.total || 0
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleQuery() {
      this.currentConfig.queryParams.pageNum = 1
      this.getList()
    },

    resetQuery() {
      Object.keys(this.currentConfig.queryParams).forEach(key => {
        if (key !== 'pageNum' && key !== 'pageSize') {
          this.currentConfig.queryParams[key] =
            Array.isArray(this.currentConfig.queryParams[key]) ? [] : null
        }
      })
      this.handleQuery()
    },

    handleTabClick() {
      this.getList()
    }
  }
}
</script>
