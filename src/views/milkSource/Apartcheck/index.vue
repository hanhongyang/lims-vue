<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="待取样" name="0" />
            <el-tab-pane label="已取样" name="1" />
            <el-tab-pane label="已审核" name="2" />
        </el-tabs>

        <!-- 查询区域 -->
        <el-form ref="queryForm" :model="queryParams" size="small" inline label-width="100px">
            <el-form-item label="车牌号" prop="licensePlateNumber">
                <el-input v-model="queryParams.licensePlateNumber" placeholder="请输入车牌号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="装奶时间" prop="sendSampleDateRange">
                <el-date-picker v-model="queryParams.sendSampleDateRange" type="daterange" range-separator="至"
                    start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" style="width: 240px" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!-- 表格区域 -->
        <el-table ref="multipleTable" v-loading="loading" :data="sampleReceiveList" height="70%" :row-key="getRowKeys">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="车牌号" align="center" prop="licensePlateNumber" />
            <el-table-column label="奶样质检单号" align="center" prop="milkSampleQualityInspectionNumber" width="180" />
            <el-table-column label="目的地" align="center" prop="destination" width="180" />
            <el-table-column label="进场时间" align="center" prop="entryTime" width="150" />
            <el-table-column label="检测人" align="center" prop="tester" />
            <el-table-column label="检测日期" align="center" prop="testDate" />
            <el-table-column label="取样人" align="center" prop="sampler" />
            <el-table-column label="取样时间" align="center" prop="samplingTime" width="150" />
            <el-table-column label="审核人" align="center" prop="reviewer" />
            <el-table-column label="审核日期" align="center" prop="reviewTime" width="150" />
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleUpdate(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { listmilkSampleQualityInspection } from '@/api/milkSource/Apartcheck'
export default {
    name: 'Apartcheck',
    dicts: [],
    data() {
        return {
            loading: true,
            activeTab: '0',
            total: 0,
            sampleReceiveList: [],
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                licensePlateNumber: null,
                // 用 status 待审核0 已审核 1
                status: null,
                sendSampleDateRange: [],
                sendSampleDateStart: null,
                sendSampleDateEnd: null
            },
            selectedRows: new Map(),
        }
    },
    created() {
        this.getList()
    },
    methods: {
        /* 获取列表 + 回显勾选 */
        getList() {
            this.loading = true
            // 状态随 tab 切换 -> 改为传 status
            this.queryParams.status = this.activeTab
            // 日期范围处理
            const dr = this.queryParams.sendSampleDateRange
            this.queryParams.sendSampleDateStart = dr && dr.length === 2 ? dr[0] : null
            this.queryParams.sendSampleDateEnd = dr && dr.length === 2 ? dr[1] : null
            listmilkSampleQualityInspection(this.queryParams).then(res => {
                this.sampleReceiveList = res.rows
                this.total = res.total
                this.loading = false
                // 关键：等 DOM 渲染完再回显
                this.$nextTick(() => {
                    // if (!this.$refs.multipleTable || !this.selectedRows.size) return
                    const tableRows = this.$refs.multipleTable.data
                    tableRows.forEach(row => {
                        if (this.selectedRows.has(this.getRowKeys(row))) {
                            this.$refs.multipleTable.toggleRowSelection(row, true)
                        }
                    })
                })
            })
        },
        /* 唯一 row-key */
        getRowKeys(row) {
            return row.id
        },

        /* 查询 / 重置 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        resetQuery() {
            this.queryParams = this.$options.data().queryParams
            this.selectedRows.clear()
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            this.handleQuery()
        },
        /* tab 切换 */
        handleTabClick() {
            this.selectedRows.clear()
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            this.queryParams.pageNum = 1
            this.getList()
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.opMilkSampleQualityInspectionId
            this.$router.push({ path: '/milkSource/Apartcheckcreate', query: { id: id } });
        },
        handleExport() {
            this.download('milkSampleQualityInspection/inspection/export', {
                ...this.queryParams
            }, `取样化验_${this.activeTab}_${new Date().getTime()}.xlsx`)
        },
    }
}
</script>