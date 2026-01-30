<template>
  <div class="app-container">
   

    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="委托单号" prop="entrustOrderNo">
        <el-input
          v-model="queryParams.entrustOrderNo"
          placeholder="请输入委托单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="委托单位" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入委托单位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="送检时间" prop="sendSampleDateRange">
        <el-date-picker
          v-model="queryParams.sendSampleDateRange"
          clearable
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
        />
      </el-form-item>
      <!-- <el-form-item label="类型" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
                    <el-option v-for="dict in dict.type.sample_receive_type" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item> -->
      <el-form-item v-if="false" label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.entrust_order_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <template v-if="activeTab === '1'" />
      <template v-if="activeTab === '2'">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-printer" size="mini" @click="dyyl">打印样品标识卡</el-button>
        </el-col>
      </template>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row> -->

    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="sampleReceiveList"
      height="75%"
      style="max-height:75%;overflow-y: auto;"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >

      <el-table-column type="selection" width="55" :reserve-selection="true" :row-key="getRowKeys" />
      <el-table-column type="index" align="center" label="序号" width="50" />

      <el-table-column key="col_order" label="委托单号" align="center" prop="entrustOrderNo" min-width="140" />

      <el-table-column
        v-if="activeTab === '1'"
        key="col_amount"
        label="样品数量"
        align="center"
        prop="sampleAmount"
        width="100"
      />

      <el-table-column
        v-if="activeTab === '2'"
        key="col_sNo"
        label="样品编号"
        align="center"
        prop="jhwNo"
        min-width="140"
      />
      <el-table-column
        v-if="activeTab === '2'"
        key="col_sBatchNo"
        label="批号"
        align="center"
        prop="batchNo"
        min-width="140"
      />
      <el-table-column
        v-if="activeTab === '2'"
        key="col_sName"
        label="样品名称"
        align="center"
        prop="sampleName"
        min-width="120"
      />

      <el-table-column key="col_dept" label="委托单位" align="center" prop="deptName" min-width="150" />

     

      <el-table-column
        v-if="activeTab === '2'"
        key="col_time"
        label="收样时间"
        align="center"
        prop="receiveTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column key="col_status" label="状态" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.entrust_order_status" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column key="col_remark" label="备注" align="center" prop="remark" min-width="120" />

      <!-- <el-table-column key="col_opt" label="操作" align="center" class-name="small-padding fixed-width" width="100">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >详情</el-button>
        </template>
      </el-table-column> -->

    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { jhwlistSampleReceive } from '@/api/CentralLaboratory/sampleReceive'

export default {
  name: 'SampleReceive',
  dicts: ['entrust_order_status', 'sample_receive_type', 'feed_test_method'],
  data() {
    return {
      activeTab: '2', // 默认待接收 (status=1)
      // 遮罩层
      loading: true,
      // 选中数组
      // ids: [], // 移除 ids, 使用 selectedRows Map
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 样品接收表格数据
      sampleReceiveList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        entrustOrderNo: null,
        deptName: null,
        sendSampleDateRange: [],
        sendSampleDateStart: null, // 新增开始时间
        sendSampleDateEnd: null, // 新增结束时间
        // type: '1'
      },
      selectedRows: new Map(), // 使用Map来存储所有选中的行 { key: row }
      multipleSelection: [] // 当前页选中的行
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 格式化类型字段 (类型 + 测试方法) */
    formatType(row) {
      // 1. 确保类型字典已加载
      if (!this.dict.type.sample_receive_type) {
        return row.type // 字典未加载时返回原始值
      }
      // 2. 查找类型标签
      const typeDict = this.dict.type.sample_receive_type.find(d => d.value == row.type)
      const typeLabel = typeDict ? typeDict.label : ''

      // 3. 检查 testMethod 是否存在 (处理 null, undefined, '')
      if (!row.testMethod) {
        return typeLabel
      }

      // 4. 确保方法字典已加载
      if (!this.dict.type.feed_test_method) {
        return typeLabel // 字典未加载时返回类型标签
      }
      // 5. 查找方法标签
      const methodDict = this.dict.type.feed_test_method.find(d => d.value == row.testMethod)
      const methodLabel = methodDict ? methodDict.label : ''

      // 6. 拼接
      if (methodLabel) {
        return `${typeLabel}(${methodLabel})`
      } else {
        // 找到了 testMethod 但没找到对应标签，也只返回 typeLabel
        return typeLabel
      }
    },
    handleUpdate(row) {
      console.log(this.activeTab, '1111')
      if (this.activeTab == '1') {
        if (row.type == '1') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/FeedEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '3') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/PcrEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '2') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/BloodEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '4') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/zaoyunEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/shEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        }
      } else {
        if (row.type == '1') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/FeedEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '3') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/PcrEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '2') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/BloodEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else if (row.type == '4') {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/zaoyunEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        } else {
          const id = row.opEntrustOrderId || this.ids
          this.$router.push({ path: '/CentralLaboratory/shEntrustOrderCreate', query: { id: id, isShow: true, isActiveTab: this.activeTab }})
        }
      }
    },
    // 获取行的唯一标识
    getRowKeys(row) {
      return row.opFeedEntrustOrderSampleId || row.opEntrustOrderId
    },
    // 处理选中状态变化
    handleSelectionChange(val) {
      this.multipleSelection = val

      // 既然现在一行就是一个委托单，逻辑变得很简单
      const currentPageKeys = this.sampleReceiveList.map(row => this.getRowKeys(row))

      // 1. 移除当前页未选中的
      currentPageKeys.forEach(key => {
        const isCurrentPageSelected = val.some(row => this.getRowKeys(row) === key)
        if (!isCurrentPageSelected) {
          this.selectedRows.delete(key)
        }
      })

      // 2. 添加当前页选中的
      val.forEach(row => {
        const rowKey = this.getRowKeys(row)
        // 存储整个 row 对象，或者你需要打印的字段
        this.selectedRows.set(rowKey, row)
      })
    },

    // 打印样品标识卡
    dyyl() {
      if (this.selectedRows.size === 0) {
        this.$message.warning('请至少选择一行数据')
        return
      }

      const selectedData = Array.from(this.selectedRows.values())
      const validData = selectedData.filter(item => item.type === '1')
      const invalidTypeData = selectedData.filter(item => item.type !== '1')
      const unReceivedData = validData.filter(item => !item.sampleNo)
      const errorMessages = []

      // 收集错误信息
      if (invalidTypeData.length > 0) {
        const names = invalidTypeData.map(item => item.sampleName).join('、')
        errorMessages.push(`非饲料类型样品（${names}）不可打印`)
      }

      // 显示合并后的错误提示
      if (errorMessages.length > 0) {
        this.$message.error(errorMessages.join('；'))
        return
      }

      // 检查是否有可打印数据
      if (validData.length === 0) {
        this.$message.error('暂无符合条件的可打印数据（仅已接收的饲料类型可打印）')
        return
      }
      // 执行打印
      console.log(validData, '111111')
      const encodedData = encodeURIComponent(JSON.stringify(validData))
      window.open(`/test?printData=${encodedData}`, '_blank')
    },
    handleTabClick(tab) {
      this.queryParams.pageNum = 1
      // 清空所有选中的行，并清除表格选中状态
      this.selectedRows = new Map()
      this.multipleSelection = []
      this.$refs.multipleTable.clearSelection()
      this.getList()
    },
    /** 查询样品接收列表 */
    getList() {
      // this.loading = true;

      // 1. 清空状态条件
      this.queryParams.isReceive = null

      // 2. 根据 Tab 设置状态
      if (this.activeTab === '1') {
        this.queryParams.isReceive = '0' // 待接收
      } else {
        this.queryParams.isReceive = '1' // 已接收
      }

      // 处理日期范围
      if (this.queryParams.sendSampleDateRange && this.queryParams.sendSampleDateRange.length === 2) {
        this.queryParams.sendSampleDateStart = this.queryParams.sendSampleDateRange[0]
        this.queryParams.sendSampleDateEnd = this.queryParams.sendSampleDateRange[1]
      } else {
        this.queryParams.sendSampleDateStart = null
        this.queryParams.sendSampleDateEnd = null
      }

      jhwlistSampleReceive(this.queryParams).then(response => {
        // 【核心修改】：直接赋值，不需要 Map 聚合了
        this.sampleReceiveList = response.rows
        this.total = response.total // 这里的 total 现在是委托单总数，分页是准确的
        this.loading = false

        // 3. 处理勾选回显
        setTimeout(() => {
          if (this.$refs.multipleTable) {
            this.sampleReceiveList.forEach(row => {
              const rowKey = this.getRowKeys(row)
              if (rowKey && this.selectedRows.has(rowKey)) {
                this.$refs.multipleTable.toggleRowSelection(row, true)
              }
            })
          }
        }, 100)
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      // 处理日期范围已移到 getList 中，这里只处理页码和调用 getList
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.sendSampleDateRange = [] // 重置日期范围
      this.queryParams.sendSampleDateStart = null
      this.queryParams.sendSampleDateEnd = null
      this.handleQuery()
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('/labtest/sampleReceive/export', {
        ...this.queryParams
      }, `sampleReceive_${new Date().getTime()}.xlsx`)
    }
    /** 移除化验编辑，已无用 */
    // editTest() {
    //     this.$router.push('/CentralLaboratory/FeedEntrustOrderCreate').catch(err => {
    //         if (err.name !== 'NavigationDuplicated') {
    //             console.error('路由跳转错误:', err);
    //         }
    //     });
    // }
  }
}
</script>
