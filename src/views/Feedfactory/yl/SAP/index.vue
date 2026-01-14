<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="样品名称" prop="sampleName">
                <el-input v-model="queryParams.sampleName" placeholder="请输入样品名称" clearable
                    @keyup.enter.native="handleQuery" />
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
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleDy"
                    v-hasPermi="['labtest:feedEntrustOrder:export']">打印二维码</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="planlist" max-height="610px">
            <el-table-column type="index" align="center" label="序号" width="50" />

            <el-table-column label="样品名称" align="center" prop="invbillName" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="更新时间" align="center" prop="updateTime" />
            <el-table-column label="接收人" align="center" prop="receiverName" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:feedEntrustOrder:edit']">修改</el-button>

                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 打印二维码弹出框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            请输入打印张数：
            <el-input v-model="scsl"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="scslSub">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 详情/修改弹窗 -->
        <el-dialog title="样品信息" :visible.sync="detailOpen" width="600px" append-to-body>
            <el-form :model="detailRow" label-width="100px">
                <el-form-item label="物料">{{ detailRow.invbillName }}</el-form-item>
                <el-form-item label="是否推送SAP">
                    <el-tag :type="detailRow.pushSap === '1' ? 'success' : 'info'">
                        {{ detailRow.pushSap === '1' ? '已推送' : '未推送' }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="入库检验批次">{{ detailRow.PRUEFLOS || '--' }} <el-button type="text" size="mini"
                        icon="el-icon-edit" @click="openBatchDialog" style="margin-left:10px;">
                        选择批次
                    </el-button></el-form-item>
                <el-form-item label="是否合格">
                    <el-radio-group v-model="detailRow.qualified" :disabled="detailRow.pushSap === '1'">
                        <el-radio label="1">合格</el-radio>
                        <el-radio label="0">不合格</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 子表占位 -->
                <el-divider content-position="left">子表信息</el-divider>
                <el-table :data="detailRow.opTestResultInfoList" border style="width: 100%">
                    <el-table-column label="检验项目" prop="itemName" />
                    <el-table-column label="化验时间" prop="createTime" />
                </el-table>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="TSsap" type="primary">推送SAP</el-button>
                <el-button @click="detailOpen = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 选择入库检验批次弹窗 -->
        <el-dialog title="选择入库检验批次" :visible.sync="batchDialogOpen" width="700px" append-to-body>
            <!-- 搜索区 -->
            <el-form :model="batchQuery" size="small" inline label-width="90px">
                <el-form-item label="检验批次">
                    <el-input v-model="batchQuery.PRUEFLOS" placeholder="请输入批次号" clearable />
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker v-model="batchQuery.PASTRTERM" type="date" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="检验类型">
                    <el-select v-model="batchQuery.HERKUNFT" placeholder="请选择">
                        <el-option label="型式检验" value="TYPE" />
                        <el-option label="出厂检验" value="OUT" />
                        <el-option label="入库检验" value="IN" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料凭证">
                    <el-input v-model="batchQuery.MBLNR" placeholder="请输入凭证号" clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getBatchList">查询</el-button>
                    <el-button icon="el-icon-refresh" @click="resetBatchQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <!-- 卡片列表 -->
            <div v-loading="batchLoading" style="max-height:400px; overflow-y:auto; padding-right:6px;">
                <el-row :gutter="12">
                    <el-col v-for="item in batchList" :key="item.PRUEFLOS" :span="12" style="margin-bottom:12px">
                        <div class="batch-card">
                            <div class="card-head">入库检验批次：{{ item.PRUEFLOS }}</div>
                            <div class="card-foot">
                                <el-button type="primary" size="mini" @click="selectBatch(item)">
                                    选择
                                </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-empty v-if="batchList.length === 0" description="暂无数据" />
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="batchDialogOpen = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listPlan, getPlanZs, unPushSapList, sampleTestDetail, getInboundTestBatch, updateSapSampleInfo, pushSap } from "@/api/feedfactory/plan";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    name: "sampling",
    dicts: ['entrust_order_status', 'sampling_plan_status'],
    data() {
        return {
            scsl: 0,
            dialogVisible: false,
            testItemList: [],
            batchLoading: true,
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
                newSamplingTypes: '3',

            },
            detailOpen: false,          // 控制弹窗
            detailRow: {},           // 当前行副本
            batchDialogOpen: false,      // 控制批次搜索弹窗
            batchQuery: [{                // 批次搜索条件
                WERK: '8380',             // 工厂
                PRUEFLOS: '',             // 检验批次（支持模糊）
                PASTRTERM: '',             // 检验开始时间
                HERKUNFT: '',             // 检验类型（下拉）
                MBLNR: ''          // 物料凭证
            }],
            batchList: [],               // 卡片列表
            id: ''
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 推送SAP */
        TSsap() {
            pushSap(this.id).then(response => {
                if (response.code === 200) {
                    this.$message.success('推送成功');
                    this.getList(); // 刷新列表

                } else {
                    this.$message.error('推送失败：' + response.msg);
                }
            });
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            unPushSapList(this.queryParams).then(response => {
                this.planlist = response.data;
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
            this.$router.push('/feedMill/yl/ylPlanCreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row, '打印row')
            this.id = row.opSamplingPlanSampleId
            sampleTestDetail(this.id).then((res) => {
                console.log(res, '打印二维码')
                this.detailRow = res.data
                this.detailOpen = true;

            })
        },
        // 打开批次搜索弹窗
        openBatchDialog() {
            this.batchQuery = [{ WERK: '8380', PRUEFLOS: '', PASTRTERM: '', HERKUNFT: '', MBLNR: '' }];
            this.batchList = [];
            this.batchDialogOpen = true;
            this.getBatchList();
        },
        // 查询卡片列表（调你自己的接口）
        getBatchList() {
            this.batchLoading = true;
            // 例：/api/batch/list
            getInboundTestBatch(this.batchQuery).then(res => {
                this.batchList = res.data || [];
                this.batchLoading = false;
            });
        },
        // 重置查询条件
        resetBatchQuery() {
            this.batchQuery = [{ WERK: '8380', PRUEFLOS: '', PASTRTERM: '', HERKUNFT: '', MBLNR: '' }];
            this.getBatchList();
        },
        // 选中当前卡片
        selectBatch(item) {
            this.detailRow.PRUEFLOS = item.PRUEFLOS;
            updateSapSampleInfo({ PRUEFLOS: this.detailRow.PRUEFLOS, opSamplingPlanSampleId: this.id }).then((res) => {
                if (res.code == 200) {
                    this.$message.success('修改成功');
                    this.getList();
                }
            })
            this.batchDialogOpen = false;
        },

        /** 导出按钮操作 */
        handleExport() {
            // this.download('labtest/feedEntrustOrder/export', {
            //     ...this.queryParams
            // }, `feedEntrustOrder_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>