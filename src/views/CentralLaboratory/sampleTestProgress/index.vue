<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="饲料" name="1">
                <el-form :model="queryParams1" ref="queryForm1" size="small" :inline="true" v-show="showSearch"
                    label-width="70px">
                    <el-form-item label="委托单号" prop="entrustOrderNo">
                        <el-input v-model="queryParams1.entrustOrderNo" placeholder="请输入委托单号" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="收样时间">
                        <el-date-picker clearable v-model="receiveTimeRange1" type="daterange" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="委托单位" prop="deptName">
                        <el-input v-model="queryParams1.deptName" placeholder="请输入委托单位" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="化验进度" prop="progress">
                        <el-select v-model="queryParams1.progress" placeholder="请选择" clearable>
                            <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
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
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                            v-hasPermi="['labtest:sampleTestProgress:export']">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="baseList1" height="63vh">
                    <el-table-column label="样品编号" align="center" prop="sampleNo" />
                    <el-table-column label="样品名称" align="center" prop="sampleName" />
                    <el-table-column label="已化验项目" align="center" prop="startedItems" />
                    <el-table-column label="未化验项目" align="center" prop="notStartedItems" />
                    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
                    <el-table-column label="委托公司" align="center" prop="deptName" />
                    <el-table-column label="收样时间" align="center" prop="receiveTime" />
                </el-table>

                <pagination v-show="total1 > 0 && activeTab === '1'" :total="total1" :page.sync="queryParams1.pageNum"
                    :limit.sync="queryParams1.pageSize" @pagination="getList" />
            </el-tab-pane>

            <el-tab-pane label="血样" name="2">
                <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true" v-show="showSearch"
                    label-width="70px">
                    <el-form-item label="委托单号" prop="entrustOrderNo">
                        <el-input v-model="queryParams2.entrustOrderNo" placeholder="请输入委托单号" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="收样时间">
                        <el-date-picker clearable v-model="receiveTimeRange2" type="daterange" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="委托单位" prop="deptName">
                        <el-input v-model="queryParams2.deptName" placeholder="请输入委托单位" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="化验进度" prop="progress">
                        <el-select v-model="queryParams2.progress" placeholder="请选择" clearable>
                            <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
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
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                            v-hasPermi="['labtest:sampleTestProgress:export']">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="baseList2" height="63vh">
                    <el-table-column label="样品编号" align="center" prop="sampleNo" />
                    <el-table-column label="样品名称" align="center" prop="sampleName" />
                    <el-table-column label="化验进度" align="center" prop="progress">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.test_progress" :value="scope.row.progress" />
                        </template>
                    </el-table-column>
                    <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
                        </template>
                    </el-table-column>
                    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
                    <el-table-column label="委托公司" align="center" prop="deptName" />
                    <el-table-column label="收样时间" align="center" prop="receiveTime" />
                </el-table>

                <pagination v-show="total2 > 0 && activeTab === '2'" :total="total2" :page.sync="queryParams2.pageNum"
                    :limit.sync="queryParams2.pageSize" @pagination="getList" />
            </el-tab-pane>

            <el-tab-pane label="PCR" name="3">
                <el-form :model="queryParams3" ref="queryForm3" size="small" :inline="true" v-show="showSearch"
                    label-width="70px">
                    <el-form-item label="委托单号" prop="entrustOrderNo">
                        <el-input v-model="queryParams3.entrustOrderNo" placeholder="请输入委托单号" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="收样时间">
                        <el-date-picker clearable v-model="receiveTimeRange3" type="daterange" value-format="yyyy-MM-dd"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="委托单位" prop="deptName">
                        <el-input v-model="queryParams3.deptName" placeholder="请输入委托单位" clearable
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="化验进度" prop="progress">
                        <el-select v-model="queryParams3.progress" placeholder="请选择" clearable>
                            <el-option v-for="dict in dict.type.test_progress" :key="dict.value" :label="dict.label"
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
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                            v-hasPermi="['labtest:sampleTestProgress:export']">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <el-table v-loading="loading" :data="baseList3" height="63vh">
                    <el-table-column label="样品编号" align="center" prop="sampleNo" />
                    <el-table-column label="样品名称" align="center" prop="sampleName" />
                    <el-table-column label="已化验项目" align="center" prop="startedItems" />
                    <el-table-column label="未化验项目" align="center" prop="notStartedItems" />
                    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
                    <el-table-column label="委托公司" align="center" prop="deptName" />
                    <el-table-column label="收样时间" align="center" prop="receiveTime" />
                </el-table>

                <pagination v-show="total3 > 0 && activeTab === '3'" :total="total3" :page.sync="queryParams3.pageNum"
                    :limit.sync="queryParams3.pageSize" @pagination="getList" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { listSampleTestProgress } from "@/api/CentralLaboratory/sampleTestProgress";

export default {
    name: "sampleTestProgress",
    dicts: ['test_progress', 'blood_task_item_type'],
    data() {
        return {
            activeTab: '1',
            loading: true,
            showSearch: true,

            // 饲料标签页数据
            baseList1: [],
            total1: 0,
            queryParams1: {
                pageNum: 1,
                pageSize: 10,
                entrustOrderNo: '',
                deptName: '',
                progress: '',
                type: '1', // 饲料类型
                beginReceiveTime: '',
                endReceiveTime: ''
            },
            receiveTimeRange1: [],

            // 血样标签页数据
            baseList2: [],
            total2: 0,
            queryParams2: {
                pageNum: 1,
                pageSize: 10,
                entrustOrderNo: '',
                deptName: '',
                progress: '',
                type: '2', // 血样类型
                beginReceiveTime: '',
                endReceiveTime: ''
            },
            receiveTimeRange2: [],

            // PCR标签页数据
            baseList3: [],
            total3: 0,
            queryParams3: {
                pageNum: 1,
                pageSize: 10,
                entrustOrderNo: '',
                deptName: '',
                progress: '',
                type: '3', // PCR类型
                beginReceiveTime: '',
                endReceiveTime: ''
            },
            receiveTimeRange3: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 获取当前激活 Tab 的查询参数 */
        getCurrentQueryParams() {
            switch (this.activeTab) {
                case '1':
                    return this.queryParams1;
                case '2':
                    return this.queryParams2;
                case '3':
                    return this.queryParams3;
                default:
                    return this.queryParams1;
            }
        },

        /** 获取当前激活 Tab 的日期范围 */
        getCurrentReceiveTimeRange() {
            switch (this.activeTab) {
                case '1':
                    return this.receiveTimeRange1;
                case '2':
                    return this.receiveTimeRange2;
                case '3':
                    return this.receiveTimeRange3;
                default:
                    return this.receiveTimeRange1;
            }
        },

        /** 获取当前激活 Tab 的数据列表 */
        getCurrentList() {
            switch (this.activeTab) {
                case '1':
                    return this.baseList1;
                case '2':
                    return this.baseList2;
                case '3':
                    return this.baseList3;
                default:
                    return this.baseList1;
            }
        },

        /** 设置当前激活 Tab 的数据列表 */
        setCurrentList(data) {
            switch (this.activeTab) {
                case '1':
                    this.baseList1 = data;
                    break;
                case '2':
                    this.baseList2 = data;
                    break;
                case '3':
                    this.baseList3 = data;
                    break;
                default:
                    this.baseList1 = data;
            }
        },

        /** 获取当前激活 Tab 的总数 */
        getCurrentTotal() {
            switch (this.activeTab) {
                case '1':
                    return this.total1;
                case '2':
                    return this.total2;
                case '3':
                    return this.total3;
                default:
                    return this.total1;
            }
        },

        /** 设置当前激活 Tab 的总数 */
        setCurrentTotal(total) {
            switch (this.activeTab) {
                case '1':
                    this.total1 = total;
                    break;
                case '2':
                    this.total2 = total;
                    break;
                case '3':
                    this.total3 = total;
                    break;
                default:
                    this.total1 = total;
            }
        },

        /** 获取当前激活 Tab 的查询表单引用 */
        getCurrentQueryFormRef() {
            switch (this.activeTab) {
                case '1':
                    return "queryForm1";
                case '2':
                    return "queryForm2";
                case '3':
                    return "queryForm3";
                default:
                    return "queryForm1";
            }
        },

        /** 查询样品化验进度列表 */
        getList() {
            this.loading = true;
            const queryParams = this.getCurrentQueryParams();
            const receiveTimeRange = this.getCurrentReceiveTimeRange();

            // 设置收样时间范围
            if (receiveTimeRange && receiveTimeRange.length === 2) {
                queryParams.beginReceiveTime = receiveTimeRange[0];
                queryParams.endReceiveTime = receiveTimeRange[1];
            } else {
                queryParams.beginReceiveTime = null;
                queryParams.endReceiveTime = null;
            }

            listSampleTestProgress(queryParams).then(response => {
                this.setCurrentList(response.rows || []);
                this.setCurrentTotal(response.total || 0);
                this.loading = false;
            }).catch(error => {
                console.error("查询失败", error);
                this.loading = false;
                this.setCurrentList([]);
                this.setCurrentTotal(0);
            });
        },

        /** 处理 Tab 切换 */
        handleTabClick(tab) {
            this.activeTab = tab.name;
            this.getCurrentQueryParams().pageNum = 1;
            this.getList();
        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.getCurrentQueryParams().pageNum = 1;
            this.getList();
        },

        /** 重置按钮操作 */
        resetQuery() {
            const formRef = this.getCurrentQueryFormRef();
            this.resetForm(formRef);

            // 重置日期范围
            switch (this.activeTab) {
                case '1':
                    this.receiveTimeRange1 = [];
                    break;
                case '2':
                    this.receiveTimeRange2 = [];
                    break;
                case '3':
                    this.receiveTimeRange3 = [];
                    break;
            }

            // 重置查询参数（保留分页大小）
            const currentParams = this.getCurrentQueryParams();
            Object.assign(currentParams, {
                pageNum: 1,
                entrustOrderNo: '',
                deptName: '',
                progress: '',
                beginReceiveTime: '',
                endReceiveTime: ''
            });

            this.getList();
        },

        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.getCurrentQueryParams();
            const receiveTimeRange = this.getCurrentReceiveTimeRange();

            // 设置收样时间范围
            if (receiveTimeRange && receiveTimeRange.length === 2) {
                queryParams.beginReceiveTime = receiveTimeRange[0];
                queryParams.endReceiveTime = receiveTimeRange[1];
            } else {
                queryParams.beginReceiveTime = null;
                queryParams.endReceiveTime = null;
            }

            this.download('/labtest/sampleTestProgress/export', {
                ...queryParams
            }, `sample_test_progress_${new Date().getTime()}.xlsx`);
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },

        // 重置表单
        resetForm(formName) {
            if (this.$refs[formName]) {
                this.$refs[formName].resetFields();
            }
        },

        // 重置表单数据
        reset() {
            this.form = {
                id: '',
                // 添加其他表单字段
            };
        }
    }
};
</script>

<style scoped>
.app-container {
    padding: 20px;
}
</style>