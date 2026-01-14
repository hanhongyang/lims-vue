<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="85px">
            <el-form-item label="生产订单号" prop="productionOrderNumber">
                <el-input v-model="queryParams.productionOrderNumber" placeholder="请输入生产订单号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>



            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['labtest:feedEntrustOrder:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['labtest:feedEntrustOrder:export']">导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleDy"
                    v-hasPermi="['labtest:feedEntrustOrder:export']">打印二维码</el-button>
            </el-col> -->
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="planlist" max-height="610px">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <!-- <el-table-column label="状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sampling_plan_status" :value="scope.row.status" />
                </template>
</el-table-column> -->
            <el-table-column label="生产订单号" align="center" prop="productionOrderNumber" />
            <el-table-column label="物料" align="center" prop="invbillName" />
            <el-table-column label="备注" align="center" prop="remark" />
            <!-- <template slot-scope="scope">
                    <dict-tag :options="dict.type.entrust_order_status" :value="scope.row.disinfection" />
                </template>
</el-table-column> -->
            <el-table-column label="生产时间" align="center" prop="productionDate" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="备注" align="center" prop="remark" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:feedEntrustOrder:edit']">修改</el-button> -->
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">打印</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 打印二维码弹出框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
            请选择打印模板：
            <el-table :data="tableData" style="width: 100%" @row-dblclick="handleRowDbclick">
                <el-table-column type="index" align="center" label="序号" width="50" />
                <el-table-column label="模板编码" align="center" prop="templateCode" />
                <el-table-column label="模板名称" align="center" prop="templateName" />
                <el-table-column label="模板类型" align="center" prop="templateType">
                    <template slot-scope="scope">
                        {{ scope.row.templateType == 0 ? '饲料检验模板' : scope.row.templateType }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" />
                <el-table-column label="修改时间" align="center" prop="updateTime" />
            </el-table>
        </el-dialog>

    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { sampleList, } from "@/api/feedfactory/plan";
import { listreport, getreport, changeEnable, addreport, updatereport } from "@/api/Basicdata/reportMB";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    name: "sampling",
    dicts: ['entrust_order_status', 'sampling_plan_status'],
    data() {
        return {
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
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
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

            },
            opSamplingPlanSampleId: '',
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            sampleList(this.queryParams).then(response => {
                this.planlist = response.rows;
                this.total = response.total;
                this.loading = false;
            });
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
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
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
                } else {
                    this.$message.warning('表单验证失败，请检查输入内容');
                    return false;
                }
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.queryParams.sendSampleDateRange = []; // 重置日期范围
            this.queryParams.sendSampleDateStart = null;
            this.queryParams.sendSampleDateEnd = null;
            this.queryParams.status = null;
            this.handleQuery();
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/ranch/plancreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row.opSamplingPlanSampleId, '打印')
            this.opSamplingPlanSampleId = row.opSamplingPlanSampleId
            listreport(this.queryParams).then(response => {
                if (response.code == 200) {
                    this.tableData = response.rows;
                    this.total = response.total;
                    this.loading = false;
                } else {
                    this.$message.error(response.msg);
                }
            });
            this.dialogVisible = true

        },
        handleRowDbclick(row) {
            // console.log(row, '模板数据')
            // localStorage.setItem('templateName', row)
            // // const id = row.opSamplingPlanId || this.ids

            // this.$router.push({ path: '/slcMB1', query: { opSamplingPlanSampleId: row.opSamplingPlanSampleId } });
            // 1. 生成唯一 Key
            const printKey = 'templateName' + new Date().getTime();

            localStorage.setItem(printKey, JSON.stringify(row));
            if (row.templateName == '模板1') {
                const routeUrl = this.$router.resolve({
                    path: '/slcMB1',
                    query: { opSamplingPlanSampleId: this.opSamplingPlanSampleId, printKey: printKey }
                });
                window.open(routeUrl.href, '_blank');
            }else if(row.templateName == '模板2'){
                const routeUrl = this.$router.resolve({
                    path: '/slcMB2',
                    query: { opSamplingPlanSampleId: this.opSamplingPlanSampleId, printKey: printKey }
                });
                window.open(routeUrl.href, '_blank');
            }

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