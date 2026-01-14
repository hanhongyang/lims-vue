<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="物料" prop="materialName">
                <el-input v-model="queryParams.materialName" placeholder="请输入物料" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="未处理" name="1" />
            <el-tab-pane label="处理中" name="2" />
            <el-tab-pane label="已处理" name="3" />
        </el-tabs>
        <el-table v-loading="loading" :data="planlist" height="60vh">
            <!-- <el-table-column label="状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sampling_plan_status" :value="scope.row.status" />
                </template>
</el-table-column> -->
            <el-table-column label="物料" align="center" prop="materialName" />
            <el-table-column label="不合格类别" align="center" prop="ctype" />
            <el-table-column label="处理方式" align="center" prop="ccltype" />
            <el-table-column label="创建者" align="center" prop="createBy" />
            <el-table-column label="创建时间" align="center" prop="createTime" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <el-dialog title="不合格处理单详情" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px">

                <el-card header="基础信息">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="物料" prop="materialName">
                                <el-input v-model="form.materialName" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 不合格类别" prop="ctype">
                                <el-input v-model="form.ctype" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检测日期" prop="createTime">
                                <el-date-picker clearable v-model="form.createTime" type="datetime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 不合格描述" prop="cunqualityinfo">
                                <el-input v-model="form.cunqualityinfo" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 扣重" prop="ikjweight">
                                <el-input v-model="form.ikjweight" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 扣款" prop="ikjmoney">
                                <el-input v-model="form.ikjmoney" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 按比例扣重" prop="iProportionkjweight">
                                <el-input v-model="form.iProportionkjweight" />
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label=" 创建人" prop="createBy">
                                <el-input v-model="form.createBy" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label=" 创建时间" prop="createTime">
                                <el-input v-model="form.createTime" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card header="检测项目信息" class="mt10">
                    <el-table :data="form.opSampleUnqualityDetailList">
                        <!-- <el-table-column label="样品编号" prop="sampleNo" /> -->
                        <el-table-column label="项目名称" prop="itemName" />
                        <el-table-column label="特性" prop="ctx" />
                        <el-table-column label="检测结果" prop="ctestresult" />

                    </el-table>
                </el-card>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <template v-if="form.status === '2'">
                    <el-button type="primary" @click="submitForm('save')">保 存</el-button>
                    <el-button type="success" @click="submitForm('submit')">提 交</el-button>
                </template>
                <template v-if="form.status === '3'">
                    <el-button type="danger" @click="handleReject">退 回</el-button>
                    <el-button type="success" @click="handleApprove">通 过</el-button>
                </template>
                <template v-if="form.status === '4'">
                    <el-button type="warning" @click="handleCancelApprove">取消审核</el-button>
                </template> -->
                <el-button type="primary" @click="handleProcess(form.opSampleUnqualityId)">处 理</el-button>
                <el-button @click="open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listunquality, unqualityDetail, updateUnquality } from "@/api/feedfactory/plan";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    name: "sampling",
    dicts: ['entrust_order_status', 'sampling_plan_status'],
    data() {
        return {
            activeTab: '1',
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
                status: 0,
                processingType: 1
            },
            open: false,
            form: {},
        };
    },
    created() {

        this.getList();
    },
    methods: {
        handleProcess(id) {
            console.log(id)
            this.$confirm('确认处理该不合格处理单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                updateUnquality(id).then(response => {
                    if (response.code === 200) {
                        this.$message({
                            message: '处理成功',
                            type: 'success'
                        });
                        this.open = false;
                        this.getList();
                    } else {
                        this.$message({
                            message: response.msg || '处理失败',
                            type: 'error'
                        });
                    }
                });
            });
        },
        /** tab 切换 */
        handleTabClick() {
            if (this.activeTab === '1') {
                this.queryParams.status = 0;
                this.queryParams.processingType = 1;
                this.queryParams.pageNum = 1;             // 回到第一页
                this.getList();
            } else if (this.activeTab === '2') {
                this.queryParams.status = 0;
                this.queryParams.processingType = 2;
                this.queryParams.pageNum = 1;             // 回到第一页
                this.getList();
            } else if (this.activeTab === '3') {
                this.queryParams.status = 1;
                delete this.queryParams.processingType;
                this.queryParams.pageNum = 1;             // 回到第一页
                this.getList();
            }
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            listunquality(this.queryParams).then(response => {
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
            this.queryParams.pageNum = 1;
            this.getList();

        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            // 把非 tab 条件清掉，但保留当前页签
            this.queryParams.driverCode = null;
            this.queryParams.driverName = null;
            this.queryParams.supplierName = null;
            this.queryParams.carInTime = null;
            this.queryParams.carOutTime = null;
            this.queryParams.pageNum = 1;
            this.getList();
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
            unqualityDetail(row.opSampleUnqualityId).then((res) => {
                if (res.code == 200) {
                    this.form = res.data;
                    this.open = true;
                }
            })
            // const id = row.opSamplingPlanId || this.ids
            // this.$router.push({ path: '/ranch/plancreate', query: { id: id } });
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download('unquality/unquality/export', {
                ...this.queryParams
            }, `不合格处理单_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>