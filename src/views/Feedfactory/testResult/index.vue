<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane :label="`待化验 (${tabCounts['1']})`" name="1"></el-tab-pane>
            <el-tab-pane :label="`待提交 (${tabCounts['2']})`" name="2"></el-tab-pane>
            <!-- <el-tab-pane :label="`待审核 (${tabCounts['3']})`" name="3"></el-tab-pane>
            <el-tab-pane :label="`已审核 (${tabCounts['4']})`" name="4"></el-tab-pane> -->
        </el-tabs>

        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <div v-if="activeTab === '1'">
                <el-form-item label="样品编号" prop="sampleNo">
                    <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="物料" prop="invbillName">
                    <el-input v-model="queryParams.invbillName" placeholder="请输入物料" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="检测项目" prop="itemName">
                    <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="收样时间" prop="receiveTime">
                    <el-date-picker v-model="queryParams.receiveTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择收样时间"></el-date-picker>
                </el-form-item>
            </div>

            <div v-else>
                <el-form-item label="化验单号" prop="resultNo">
                    <el-input v-model="queryParams.resultNo" placeholder="请输入化验单号" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="检测项目" prop="itemName">
                    <el-input v-model="queryParams.itemName" placeholder="请输入项目名称" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="检测人" prop="testUser">
                    <el-input v-model="queryParams.testUser" placeholder="请输入检测人" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="审核人" prop="examineUser" v-if="activeTab === '4'">
                    <el-input v-model="queryParams.examineUser" placeholder="请输入审核人" clearable
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5" v-if="activeTab === '1'">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" :disabled="multiple"
                    @click="handleStartTest(null)" v-hasPermi="['ranch:testResult:add']">批量开始化验</el-button>
            </el-col>
            <el-col :span="1.5" v-if="activeTab !== '1'">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['ranch:testResult:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" :key="activeTab">
            <el-table-column type="selection" width="55" align="center" />

            <template v-if="activeTab === '1'">
                <el-table-column label="样品编号" align="center" prop="sampleNo" />
                <el-table-column label="物料" align="center" prop="invbillName" />
                <el-table-column label="检测项目" align="center" prop="itemName" />
                <el-table-column label="收样时间" align="center" prop="receiveTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d} {h}:{i}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" @click="handleStartTest(scope.row)"
                            v-hasPermi="['ranch:testResult:add']">开始化验</el-button>
                    </template>
                </el-table-column>
            </template>

            <template v-if="activeTab === '2'">
                <el-table-column label="化验单号" align="center" prop="resultNo" />
                <el-table-column label="检测项目" align="center" prop="itemName" />

                <el-table-column label="退回原因" align="center" prop="returnReason">
                    <template slot-scope="scope">
                        <el-popover v-if="scope.row.returnReason" placement="top-start" title="退回原因" width="200"
                            trigger="hover" :content="scope.row.returnReason">
                            <span slot="reference" style="color: #F56C6C; cursor: pointer;">
                                (已退回) <i class="el-icon-info"></i>
                            </span>
                        </el-popover>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column label="检测人" align="center" prop="testUser" />
                <el-table-column label="开始时间" align="center" prop="testTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.testTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                            v-hasPermi="['ranch:testResult:edit']">编辑</el-button>
                    </template>
                </el-table-column>
            </template>

            <template v-if="activeTab === '3'">
                <el-table-column label="化验单号" align="center" prop="resultNo" />
                <el-table-column label="检测项目" align="center" prop="itemName" />
                <el-table-column label="检测人" align="center" prop="testUser" />
                <el-table-column label="检测完成时间" align="center" prop="testTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.testTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-check" @click="handleReview(scope.row)"
                            v-hasPermi="['ranch:testResult:approve']">审核</el-button>
                    </template>
                </el-table-column>
            </template>

            <template v-if="activeTab === '4'">
                <el-table-column label="化验单号" align="center" prop="resultNo" />
                <el-table-column label="检测人" align="center" prop="testUser" />
                <el-table-column label="检测项目" align="center" prop="itemName" />
                <el-table-column label="检测完成时间" align="center" prop="testTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.testTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="审核人" align="center" prop="examineUser" />
                <el-table-column label="审核时间" align="center" prop="examineTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.examineTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)"
                            v-hasPermi="['ranch:testResult:query']">详情</el-button>
                    </template>
                </el-table-column>
            </template>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">

                <el-card header="基础信息">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="化验单号" prop="resultNo">
                                <el-input v-model="form.resultNo" placeholder="请输入化验单号"
                                    :disabled="form.status !== '2'" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检测项目" prop="itemName">
                                <el-input v-model="form.itemName" placeholder="请输入项目名称" :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="检测日期" prop="testTime">
                                <el-date-picker clearable v-model="form.testTime" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择检测时间" :disabled="form.status !== '2'"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="取样日期" prop="sampleTime">
                                <el-input :value="getSampleExtraInfo('sampleTime')" placeholder="取样日期"
                                    :disabled="true" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="取样人" prop="samplerName">
                                <el-input :value="getSampleExtraInfo('samplerName')" placeholder="取样人"
                                    :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <el-card header="样品信息" class="mt10">
                    <el-table :data="form.opTestResultInfoList">
                        <el-table-column label="样品编号" prop="sampleNo" />
                        <el-table-column label="样品名称" prop="sampleName" />
                        <el-table-column :label="getTestTypeLabel" prop="result">
                            <template slot-scope="scope">
                                <!-- 情况A: 定性 (通常是下拉框选择 阴性/阳性，或者 合格/不合格) -->
                                <!-- 判断逻辑：先确保对象存在，再判断值为 '1' -->
                                <div
                                    v-if="form.opSamplingPlanItem && form.opSamplingPlanItem.qualitativeOrQuantitative === '1'">
                                    <!-- 如果你有定性的字典，可以用 el-select，没有的话还是用 el-input -->
                                    <!-- <el-input v-model="scope.row.result" placeholder="请输入定性结果"
                                        :disabled="form.status !== '2'" /> -->

                                    <el-select v-model="scope.row.result" placeholder="请选择定性结果">
                                        <el-option label="阴性" value="阴性"></el-option>
                                        <el-option label="阳性" value="阳性"></el-option>
                                    </el-select>

                                </div>

                                <!-- 情况B: 定量 (输入数字) -->
                                <!-- 判断逻辑：默认情况，或者值为 '0' -->
                                <div v-else>
                                    <el-input v-model="scope.row.result" placeholder="请输入数值" type="number"
                                        :disabled="form.status !== '2'" @input="handleResultChange(scope.row)" />
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="是否合格" align="center" width="100">
                            <template slot-scope="scope">
                                <!-- 1=合格, 2=不合格, 3=让步接收 -->
                                <el-tag type="success" v-if="scope.row.checkResult === '1'">合格</el-tag>
                                <el-tag type="danger" v-else-if="scope.row.checkResult === '2'">不合格</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.checkResult === '3'">让步接收</el-tag>

                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="结果判定" prop="checkResult"
                            v-if="form.status === '3' || form.status === '4'">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.checkResult" placeholder="请选择判定结果" style="width: 100%;">
                                    <el-option v-for="item in checkResultOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="试剂批号" prop="sjph">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.sjph" placeholder="试剂批号" :disabled="form.status !== '2'" />
                            </template>
                        </el-table-column>

                        <el-table-column label="试剂条(照片)" prop="sjtFileId" width="220">
                            <template slot-scope="scope">

                                <el-image v-if="scope.row.sjtFileId"
                                    style="width: 60px; height: 60px; vertical-align: middle; margin-right: 10px; border:1px solid #eee;"
                                    :src="scope.row.sjtFileUrl || getPreviewUrl(scope.row.sjtFileId)"
                                    :preview-src-list="[scope.row.sjtFileUrl || getPreviewUrl(scope.row.sjtFileId)]"
                                    fit="cover">
                                    <div slot="error" class="image-slot"
                                        style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background: #f5f7fa; color: #909399;">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>

                                <div style="display: inline-block; vertical-align: middle;">
                                    <el-upload :action="uploadActionUrl" :headers="uploadHeaders"
                                        :show-file-list="false" :before-upload="beforeSjtUpload"
                                        :on-success="(response, file) => handleSjtSuccess(response, file, scope.row)"
                                        :on-error="handleSjtError" :on-progress="handleSjtProgress"
                                        :disabled="form.status !== '2' || sjtUploading" :limit="1" name="file"
                                        style="display: inline-block;">
                                        <el-button size="small" type="primary" :loading="sjtUploading"
                                            :disabled="form.status !== '2'">
                                            {{ scope.row.sjtFileId ? '重新上传' : '点击上传' }}
                                        </el-button>
                                    </el-upload>

                                    <el-button v-if="scope.row.sjtFileId && form.status === '2'" type="text"
                                        icon="el-icon-delete"
                                        @click="scope.row.sjtFileId = null; scope.row.sjtFileUrl = null;"
                                        style="color: #F56C6C; margin-left: 5px;"></el-button>
                                </div>

                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="100">
                            <template slot-scope="scope">
                                <el-button
                                    v-if="(form.status === '2' || form.status === '3') && (scope.row.retestFlag == 0 || scope.row.retestFlag == null)"
                                    size="mini" type="text" icon="el-icon-refresh" @click="handleRetest(scope.row)">
                                    复检
                                </el-button>
                                <span v-if="scope.row.retestFlag == 1" style="color: #E6A23C;">
                                    已复检
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-card header="审核信息" class="mt10"
                    v-if="form.status === '3' || (form.status === '4' && form.returnReason)">
                    <el-row>
                        <el-col :span="24" v-if="form.status === '3'">
                            <el-form-item label="退回原因" prop="returnReason">
                                <el-input v-model="form.returnReason" type="textarea" placeholder="请输入退回原因" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="form.status === '4' && form.returnReason">
                            <el-form-item label="退回原因" prop="returnReason">
                                <el-input v-model="form.returnReason" type="textarea" :disabled="true" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <template v-if="form.status === '2'">
                    <el-button type="primary" @click="submitForm('save')">保 存</el-button>
                    <el-button type="success" @click="submitForm('submit')">提 交</el-button>
                </template>
                <template v-if="form.status === '3'">
                    <el-button type="danger" @click="handleReject">退 回</el-button>
                    <el-button type="success" @click="handleApprove">通 过</el-button>
                </template>
                <template v-if="form.status === '4'">
                    <el-button type="warning" @click="handleCancelApprove">取消审核</el-button>
                </template>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// (修复) 引入所有正确的API
import {
    listTestResult,
    listPendingTest,   // (新)
    getTestCounts,     // (新)
    getTestResult,
    addTestResult,
    updateTestResult,
    delTestResult,     // (保留)
    startTest,         // (新)
    submitTestResult,  // (新)
    approveTestResult, // (新)
    rejectTestResult,  // (新)
    cancelApprove,      // (新)
    retest      // (新)
} from "@/api/Ranch/testResult"; // (确保 testResult.js 已更新)

// (变更) 移除 FileUpload，引入 getToken 和 uploadAndGetFileId
// import FileUpload from '@/components/FileUpload'; 
import { getToken } from '@/utils/auth';
//import { uploadAndGetFileId, uploadAndGetUrl } from '@/api/common/common';

export default {
    name: "TestResult",
    // (变更) 移除 FileUpload
    components: {},
    data() {
        return {
            // (新) 角标
            tabCounts: {
                '1': 0, // 待化验
                '2': 0, // 待提交
                '3': 0, // 待审核
                '4': 0  // 已审核
            },
            loading: true,
            ids: [],
            taskIds: [],
            single: true,
            multiple: true,
            showSearch: true,
            total: 0,
            dataList: [],
            title: "",
            open: false,
            activeTab: "1",
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                sampleNo: null,
                invbillName: null,
                receiveTime: null,
                itemName: null,
                resultNo: null,
                testUser: null,
                examineUser: null,
                status: null
            },
            form: {
                opTestResultInfoList: []
            },
            // (新) 结果判定选项
            checkResultOptions: [
                { label: "合格", value: "1" },
                { label: "不合格", value: "2" },
                { label: "让步接收", value: "3" },
            ],
            rules: {
                returnReason: [
                    { required: true, message: "退回原因不能为空", trigger: "blur" }
                ],
            },

            // (变更) 新增 action URL
            uploadActionUrl: process.env.VUE_APP_BASE_API + "/file/uploadAndGetUrl", // 匹配 FileController.java
            // (变更) 
            uploadHeaders: { Authorization: "Bearer " + getToken() },
            sjtUploading: false, // 试剂条上传loading
        };
    },
    created() {
        this.getList();
        this.getTabCounts();
    },
    computed: {
        getSampleExtraInfo() {
            return (fieldName) => {
                if (this.form.opTestResultInfoList && this.form.opTestResultInfoList.length > 0) {
                }
                return '';
            }
        },
        getTestTypeLabel() {
            // 安全判断：防止 opSamplingPlanItem 为空导致报错
            if (this.form && this.form.opSamplingPlanItem) {
                // 假设字典定义：'1' 为定性，'0' 为定量
                if (this.form.opSamplingPlanItem.qualitativeOrQuantitative == null) {
                    return '定性';
                }
            }
            return '定量'; // 默认显示
        },
    },
    methods: {
        handleResultChange(row) {
            // ★★★ 核心修正：从当前行 row 中获取标准对象
            const planItem = row.opSamplingPlanItem;

            // 调试日志，确认能拿到了
            console.log('当前行标准对象:', planItem);

            if (!planItem) {
                console.warn('当前行缺少 opSamplingPlanItem 数据');
                return;
            }

            // 获取输入值
            const val = row.result;

            // --- 判定逻辑 ---

            // 情况A: 定量 (qualitativeOrQuantitative不是'1')
            if (planItem.qualitativeOrQuantitative !== '1') {
                // 输入为空时不判定
                if (val === '' || val === null || val === undefined) return;

                const numVal = parseFloat(val);
                if (isNaN(numVal)) return;

                // 获取上下限 (处理 null 为无穷大/小)
                const lower = (planItem.lowerLimit === null || planItem.lowerLimit === '') ? -Infinity : parseFloat(planItem.lowerLimit);
                const upper = (planItem.upperLimit === null || planItem.upperLimit === '') ? Infinity : parseFloat(planItem.upperLimit);

                console.log(`判定范围: ${lower} ~ ${upper}, 输入值: ${numVal}`);

                // 判定合格/不合格
                if (numVal >= lower && numVal <= upper) {
                    this.$set(row, 'checkResult', '1'); // 合格
                } else {
                    this.$set(row, 'checkResult', '2'); // 不合格
                }
            }

            // 情况B: 定性 (如果是下拉框选阴阳性)
            else {
                if (val === '阴性') {
                    this.$set(row, 'checkResult', '1');
                } else if (val === '阳性') {
                    this.$set(row, 'checkResult', '2');
                }
            }
        },
        /** (修复) 切换Tab */
        handleTabClick(tab) {
            this.activeTab = tab.name;
            this.queryParams.pageNum = 1;
            this.resetQuery(false);
            this.getList();
            this.ids = [];
            this.taskIds = [];
            this.handleSelectionChange([]);
        },

        /** (新) 获取文件预览URL (用于加载旧数据) */
        getPreviewUrl(fileId) {
            if (!fileId) return '';
            // VUE_APP_BASE_API 对应您 vue.config.js 中的 proxy 代理
            return process.env.VUE_APP_BASE_API + "/file/preview/" + fileId;
        },
        /** (新) 查询所有Tab的角标数量 */
        getTabCounts() {
            const countParams = { ...this.queryParams };
            countParams.pageNum = undefined;
            countParams.pageSize = undefined;

            getTestCounts(countParams).then(response => {
                if (response.code === 200 && response.data) {
                    const data = response.data;
                    this.tabCounts['1'] = data.status_1 || 0;
                    this.tabCounts['2'] = data.status_2 || 0;
                    this.tabCounts['3'] = data.status_3 || 0;
                    this.tabCounts['4'] = data.status_4 || 0;
                } else {
                    Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
                }
            }).catch(() => {
                Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
            });
        },

        /** (修复) 查询列表 */
        getList() {
            this.loading = true;
            let queryStatus = null;
            if (this.activeTab === '2') queryStatus = '2';
            else if (this.activeTab === '3') queryStatus = '3';
            else if (this.activeTab === '4') queryStatus = '4';

            const params = { ...this.queryParams };
            params.status = queryStatus;

            if (this.activeTab === '1') {
                listPendingTest(params).then(response => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            } else {
                listTestResult(params).then(response => {
                    this.dataList = response.rows;
                    this.total = response.total;
                    this.loading = false;
                });
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                resultNo: null,
                itemName: null,
                testTime: null,
                status: "2",
                returnReason: null,
                opTestResultInfoList: []
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
            this.getTabCounts();
        },
        /** (修复) 重置按钮操作 */
        resetQuery(search = true) {
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                sampleNo: null,
                invbillName: null,
                itemName: null,
                receiveTime: null,
                resultNo: null,
                testUser: null,
                examineUser: null,
                status: null
            };
            this.resetForm("queryForm");
            if (search) {
                this.handleQuery();
            }
        },

        /** (【【【 关键Bug修复 】】】) 多选框选中数据 */
        handleSelectionChange(selection) {
            if (this.activeTab === '1') {
                this.taskIds = selection.map(item => item.opSamplingPlanItemId);
                this.ids = [];
            } else {
                this.ids = selection.map(item => item.id);
                this.taskIds = [];
            }
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },

        /** (修复) "开始化验" 按钮操作 */
        handleStartTest(row) {
            const ids = row ? [row.opSamplingPlanItemId] : this.taskIds;
            if (!ids || ids.length === 0) {
                this.$modal.msgWarning("请选择要开始化验的任务");
                return;
            }

            this.$modal.confirm(`是否确认开始化验选中的 ${ids.length} 项任务？`).then(function () {
                return startTest(ids);
            }).then((response) => {
                this.$modal.msgSuccess("操作成功，请填写化验单");
                this.getList();
                this.getTabCounts();
                this.openTestResultForm(response.data, "新增化验单");
            }).catch(() => { });
        },

        /** (新) 统一打开化验单弹窗 */
        openTestResultForm(id, title) {
            this.reset();
            getTestResult(id).then(response => {
                this.form = response.data;
                if (!this.form.opTestResultInfoList) {
                    this.form.opTestResultInfoList = [];
                }

                // (变更) 
                // 【【【 恢复此循环 】】】
                // 这是为了确保 "编辑" 模式加载的数据也能显示预览。
                // 它会为所有只有 fileId 而没有 fileUrl 的行，
                // 响应式地添加 'sjtFileUrl' 属性。
                if (this.form.opTestResultInfoList) {
                    this.form.opTestResultInfoList.forEach(row => {
                        if (row.sjtFileId && !row.sjtFileUrl) {
                            // 使用 $set 确保 Vue 能够 "看到" 这个新添加的属性
                            this.$set(row, 'sjtFileUrl', this.getPreviewUrl(row.sjtFileId));
                        }
                    });
                }
                // (变更) 结束

                this.open = true;
                this.title = title;
            });
        },

        /** 待提交 - 编辑 */
        handleUpdate(row) {
            this.openTestResultForm(row.id, "修改化验单");
        },
        /** 待审核 - 审核 */
        handleReview(row) {
            this.openTestResultForm(row.id, "审核化验单");
        },
        /** 已审核 - 详情 */
        handleView(row) {
            this.openTestResultForm(row.id, "化验单详情");
        },

        /** 提交按钮 (弹窗内) */
        submitForm(action) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (action === 'save') {
                        updateTestResult(this.form).then(response => {
                            this.$modal.msgSuccess("保存成功");
                            this.open = false;
                            this.getList();
                            this.getTabCounts();
                        });
                    } else if (action === 'submit') {
                        submitTestResult(this.form).then(response => {
                            this.$modal.msgSuccess("提交成功");
                            this.open = false;
                            this.getList();
                            this.getTabCounts();
                        });
                    }
                }
            });
        },
        /** (新) 审核通过 */
        handleApprove() {
            this.$modal.confirm('是否确认通过该化验单？').then(() => {
                return approveTestResult(this.form.id);
            }).then(() => {
                this.$modal.msgSuccess("审核通过");
                this.open = false;
                this.getList();
                this.getTabCounts();
            }).catch(() => { });
        },
        /** (新) 审核退回 */
        handleReject() {
            this.$refs["form"].validate(valid => {
                if (!this.form.returnReason) {
                    this.$modal.msgError("请输入退回原因");
                    return;
                }
                if (valid) {
                    this.$modal.confirm('是否确认退回该化验单？').then(() => {
                        return rejectTestResult({ id: this.form.id, returnReason: this.form.returnReason });
                    }).then(() => {
                        this.$modal.msgSuccess("退回成功");
                        this.open = false;
                        this.getList();
                        this.getTabCounts();
                    }).catch(() => { });
                }
            });
        },
        /** (新) 取消审核 */
        handleCancelApprove() {
            this.$modal.confirm('是否确认取消审核该化验单？').then(() => {
                return cancelApprove(this.form.id);
            }).then(() => {
                this.$modal.msgSuccess("取消审核成功");
                this.open = false;
                this.getList();
                this.getTabCounts();
            }).catch(() => { });
        },

        /** 导出按钮操作 */
        handleExport() {
            if (this.activeTab === '1') return;

            const queryParams = { ...this.queryParams };
            if (this.activeTab === '2') queryParams.status = '2';
            else if (this.activeTab === '3') queryParams.status = '3';
            else if (this.activeTab === '4') queryParams.status = '4';

            this.download('ranch/testResult/export', {
                ...queryParams
            }, `testResult_${this.activeTab}_${new Date().getTime()}.xlsx`)
        },
        /** (新) 复检按钮操作 */
        handleRetest(row) {
            const infoId = row.id; // 假设样品行的唯一ID是 'id'
            if (!infoId) {
                this.$modal.msgError("样品ID缺失，无法复检");
                return;
            }

            // 弹窗确认
            this.$modal.confirm('确定要复检此样品吗？该样品化验数据将作废。').then(() => {
                // 调用后端 retest 接口，注意后端需要的是一个数组
                return retest([infoId]);
            }).then(response => {
                this.$modal.msgSuccess('申请复检成功，请前往待化验列表查看该样品');
                // 将当前行状态更新为 "已复检"
                this.$set(row, 'retestFlag', '1');

                // 可选：刷新角标
                this.getTabCounts();

                // 可选：如果复检后需要关闭弹窗并刷新列表
                // this.open = false;
                // this.getList();
            }).catch(() => { });
        },
        // (变更) 新增 试剂条上传-前置校验
        beforeSjtUpload(file) {
            const isImage = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
            const isLt5M = file.size / 1024 / 1024 < 5;

            if (!isImage) {
                this.$message.error('上传文件只能是 PNG, JPG, JPEG 格式!');
            }
            if (!isLt5M) {
                this.$message.error('上传文件大小不能超过 5MB!');
            }
            return isImage && isLt5M;
        },
        // (变更) 新增 on-success 回调
        handleSjtSuccess(response, file, row) {
            this.sjtUploading = false;
            if (response.code === 200 && response.data) {
                row.sjtFileId = response.data.fileId;
                // (重要) handleSjtSuccess 必须设置 sjtFileUrl
                this.$set(row, 'sjtFileUrl', response.data.fileUrl);
                this.$modal.msgSuccess("上传成功");
            } else {
                row.sjtFileId = null;
                this.$set(row, 'sjtFileUrl', null);
                this.$modal.msgError(response.msg || '文件上传失败');
            }
        },

        // (变更) 新增 on-error 回调
        handleSjtError(err, file, fileList) {
            this.sjtUploading = false;
            this.$modal.msgError('上传失败: ' + (err.message || '未知错误'));
        },

        // (变更) 新增 on-progress 回调
        handleSjtProgress(event, file, fileList) {
            this.sjtUploading = true;
        },
        // (变更) 新增 试剂条上传-http-request
        async handleSjtUpload(options, row) {
            // (变更) 
            const file = options.file;
            // (变更) 

            if (!file) {
                this.$modal.msgError("未找到文件");
                return;
            }

            const formData = new FormData();
            // 这里的 'file' 必须匹配后端 uploadAndGetUrl(MultipartFile file) 的参数名 'file'
            formData.append('file', file);

            this.sjtUploading = true;

            try {
                // 调用 /file/uploadAndGetUrl 接口
                const uploadRes = await uploadAndGetUrl(formData);

                // uploadRes.data 现在是 { fileId, fileUrl }
                if (uploadRes.code === 200 && uploadRes.data) {
                    // 同时存储 fileId 和 fileUrl
                    row.sjtFileId = uploadRes.data.fileId;
                    // 使用 $set 确保 sjtFileUrl 属性是响应式的
                    this.$set(row, 'sjtFileUrl', uploadRes.data.fileUrl);

                    this.$modal.msgSuccess("上传成功");
                } else {
                    // 如果上传失败，清除旧的 fileId
                    row.sjtFileId = null;
                    this.$set(row, 'sjtFileUrl', null);
                    this.$modal.msgError(uploadRes.msg || '文件上传失败');
                }
            } catch (error) {
                row.sjtFileId = null;
                this.$set(row, 'sjtFileUrl', null);
                this.$modal.msgError('上传失败: ' + (error.message || '未知错误'));
            } finally {
                this.sjtUploading = false;
            }
        }






    }
};
</script>