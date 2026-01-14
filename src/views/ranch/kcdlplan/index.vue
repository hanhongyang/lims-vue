<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- ====== 待取样 ====== -->
            <el-tab-pane label="待取样" name="first">
                <el-form :model="searchFormPlan" size="small" inline>
                    <el-form-item label="计划类型" prop="planType">
                        <el-select v-model="searchFormPlan.planType" clearable>
                            <el-option label="库存" value="1" />
                            <el-option label="垫料" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="取样计划单号" prop="samplingOrderNumber">
                        <el-input v-model="searchFormPlan.samplingOrderNumber" placeholder="请输入取样计划单号" />
                    </el-form-item>
                    <el-form-item label="计划时间" prop="planTime">
                        <el-date-picker v-model="searchFormPlan.planTime" type="date" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini"
                            @click="handleExport">导出</el-button>
                    </el-col>
                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>
                <!-- 待取样表格 -->
                <el-table v-loading="loading" :data="planlistWait" max-height="610px">
                    <el-table-column label="状态" align="center" prop="status" width="80">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.sampling_plan_status" :value="scope.row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="取样计划单号" align="center" prop="samplingOrderNumber" />
                    <el-table-column label="物料" align="center"
                        prop="opFinishedProductSamplingPlanDetailList[0].materialName" />
                    <el-table-column label="计划时间" align="center" prop="planTime" />
                    <el-table-column label="计划类型" align="center" width="80">
                        <template #default="{ row }">
                            <span>{{ row.planType == 1 ? '库存' : row.planType == 2 ? '垫料' : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人" align="center" prop="createBy" />
                </el-table>

                <pagination v-show="totalWait > 0" :total="totalWait" :page.sync="queryParamsWait.pageNum"
                    :limit.sync="queryParamsWait.pageSize" @pagination="getList" />
            </el-tab-pane>

            <!-- ====== 已取样 ====== -->
            <el-tab-pane label="已取样" name="second">
                <el-form :model="searchFormDone" size="small" inline>
                    <el-form-item label="物料" prop="invbillName">
                        <el-input v-model="searchFormDone.invbillName" placeholder="请输入物料名称" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini"
                            @click="handleAdd">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini"
                            @click="handleExportYQY">导出</el-button>
                    </el-col>

                    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>

                <!-- 已取样表格 -->
                <el-table v-loading="loading" :data="planlistDone" max-height="610px">
                    <el-table-column label="物料" align="center" prop="invbillName" />
                    <el-table-column label="计划生产量" align="center" prop="plannedProductionVolume" />
                    <el-table-column label="计划取样份数" align="center" prop="plannedSampleQuantity" />
                    <el-table-column label="已取样份数" align="center" prop="haveSampleCopies" />
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit"
                                @click="handleUpdate(scope.row)">详情</el-button>
                            <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:feedEntrustOrder:edit']">打印</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="totalDone > 0" :total="totalDone" :page.sync="queryParamsDone.pageNum"
                    :limit.sync="queryParamsDone.pageSize" @pagination="getList" />
            </el-tab-pane>
        </el-tabs>




        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />



    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { sampleList, getPlanZs, samplingList } from "@/api/feedfactory/plan";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    name: "sampling",
    dicts: ['entrust_order_status', 'sampling_plan_status'],
    data() {
        return {
            activeName: 'first',
            loading: true,
            showSearch: true,

            /* 待取样维度 */
            planlistWait: [],
            totalWait: 0,
            queryParamsWait: { pageNum: 1, pageSize: 10 },

            /* 已取样维度 */
            planlistDone: [],
            totalDone: 0,
            queryParamsDone: { pageNum: 1, pageSize: 10 },

            /* 搜索栏表单 - 与之前完全一致 */
            searchFormPlan: { planType: null, samplingOrderNumber: '', planTime: '' },
            searchFormDone: { invbillName: '' },

            /* 其他弹窗/按钮字段保持原样 */
            scsl: 0,
            dialogVisible: false,
            activeName: 'first',
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', date);
                    }
                }]
            },
            searchFormPlan: {
                pageNum: 1,
                pageSize: 10,
                planType: null,
            },
            searchFormDone: {             // 已取样查询条件
                invbillName: ''
            },
            scsl: 0,
            dialogVisible: false,
            testItemList: [],
            testItemQuery: {
                pageNum: 1,
                pageSize: 10,
                keyword: '',
                tag: '1',
                isEnable: '1'
            },
            testItemTotal: 0,
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
            planlist: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                newSamplingTypes: '2'
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {

        handleClick(tab, event) {
            // 切换页签时把对面条件清空，避免串扰
            if (this.activeName === 'first') {
                this.searchFormDone.invbillName = ''
            } else {
                this.searchFormPlan = { planType: null, samplingOrderNumber: '', planTime: '' }
            }
            this.getList()
        },
        getList() {
            this.loading = true
            if (this.activeName === 'first') {
                // —— 待取样 ——
                const planType = this.searchFormPlan.planType || '2,1'
                samplingList({
                    pageNum: this.queryParamsWait.pageNum,
                    pageSize: this.queryParamsWait.pageSize,
                    planType,
                    samplingOrderNumber: this.searchFormPlan.samplingOrderNumber,
                    planTime: this.searchFormPlan.planTime
                }).then(res => {
                    this.planlistWait = res.rows
                    this.totalWait = res.total
                }).finally(() => { this.loading = false })
            } else {
                // —— 已取样 ——
                sampleList({
                    pageNum: this.queryParamsDone.pageNum,
                    pageSize: this.queryParamsDone.pageSize,
                    samplingType: '2,1',
                    invbillName: this.searchFormDone.invbillName
                }).then(res => {
                    this.planlistDone = res.rows
                    this.totalDone = res.total
                }).finally(() => { this.loading = false })
            }
        },
        handleDy() {
            this.dialogVisible = true
            this.getTestItemList()
        },
        // 在获取检测项目列表时设置选中状态
        getTestItemList() {
            getpagelist(this.testItemQuery).then(response => {
                this.testItemList = response.rows.map(item => ({
                    labtestItemsId: item.labtestItemsId,
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }));

                this.testItemTotal = response.total;

                // 设置选中状态
                this.$nextTick(() => {
                    this.$refs.testItemTable.clearSelection(); // ✅ 清空表格选中状态
                    this.testItemList.forEach(row => {
                        if (this.allSelectedTestItems.has(row.labtestItemsId)) {
                            this.$refs.testItemTable.toggleRowSelection(row, true);
                        }
                    });
                });
            });
        },
        // 处理检测项目选择变化
        handleTestItemSelectionChange(selection) {
            // 更新当前页的选中状态
            const currentPageKeys = this.testItemList.map(item => item.labtestItemsId);

            // 先移除当前页之前选中的但当前未选中的项目
            currentPageKeys.forEach(key => {
                if (this.allSelectedTestItems.has(key) && !selection.some(item => item.labtestItemsId === key)) {
                    this.allSelectedTestItems.delete(key);
                }
            });

            // 添加当前页新选中的项目
            selection.forEach(item => {
                this.allSelectedTestItems.set(item.labtestItemsId, item);
            });
        },
        // 检测项目分页大小变化
        handleTestItemSizeChange(val) {
            this.testItemQuery.pageSize = val;
            this.getTestItemList();
        },

        // 检测项目当前页变化
        handleTestItemCurrentChange(val) {
            this.testItemQuery.pageNum = val;
            this.getTestItemList();
        },
        // 重置检测项目查询
        resetTestItemQuery() {
            this.testItemQuery = {
                pageNum: 1,
                pageSize: 10,
                keyword: '',
                tag: '1',
                isEnable: '1'
            };
            this.getTestItemList();
        },
        scslSub() {
            getPlanZs(this.scsl).then((res) => {
                console.log(res, '打印二维码')
                if (res.code == 200) {
                    const encodedData = encodeURIComponent(JSON.stringify(res.data));
                    window.open(`/testewm?printData=${encodedData}`, '_blank');
                }

            })
        },



        /** 搜索按钮操作 */
        handleQuery() {
            const temp = { pageNum: 1, pageSize: this.queryParams.pageSize };
            if (this.activeName === 'first') {
                // 待取样
                Object.assign(temp, {
                    planType: this.searchFormPlan.planType,
                    samplingOrderNumber: this.searchFormPlan.samplingOrderNumber,
                    planTime: this.searchFormPlan.planTime
                });
            } else {
                // 已取样
                temp.invbillName = this.searchFormDone.invbillName;
            }
            this.queryParams = temp;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            if (this.activeName === 'first') {
                this.searchFormPlan = { planType: null, samplingOrderNumber: '', planTime: '' };
            } else {
                this.searchFormDone.invbillName = '';
            }
            this.handleQuery();
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/feedMill/cp/cpPlanCreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.opSamplingPlanSampleId || this.ids
            this.$router.push({ path: '/ranch/kcdlplanCreate', query: { id: id } });
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download('sampling/plan/export', {
                pageNum: 1,
                pageSize: 10,
                planType: '2,1'

            }, `samplingPlan_${new Date().getTime()}.xlsx`)
        },
        /** 导出按钮操作 */
        handleExportYQY() {
            this.download('sampling/plan/sampleExport', {
                pageNum: 1,
                pageSize: 10,
                samplingType: '2,1'

            }, `samplingPlan_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>