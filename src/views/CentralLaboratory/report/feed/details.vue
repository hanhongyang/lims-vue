<template>
    <div class="app-container">
        <!-- 待审核列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="报告编号" prop="reportNo">
                <el-input v-model="queryParams.reportNo" placeholder="请输入报告编号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="样品名称" prop="sampleName">
                <el-input v-model="queryParams.sampleName" placeholder="请输入样品名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="样品编号" prop="sampleNo">
                <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="委托单位" prop="entrustDeptName">
                <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="接收时间">
                <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd"
                    type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- 待审核列表的el-form内，新增报告时间表单项 -->
            <el-form-item label="报告时间">
                <el-date-picker v-model="daterangeReportTime" style="width: 240px" value-format="yyyy-MM-dd"
                    type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="编制人" prop="editUser">
                <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini"
                    @click="handleQuery(activeTab)">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
            <el-table-column label="报告编号" align="center" prop="reportNo" />
            <el-table-column label="样品编号" align="center" prop="sampleNo" />
            <el-table-column label="样品名称" align="center" prop="sampleName" />
            <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
            <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报告时间" align="center" prop="reportTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="编制人" align="center" prop="editUser" />
            <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">审核</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 邮箱选择弹窗 -->
        <el-dialog title="选择发送邮箱" :visible.sync="emailDialogVisible" width="800px" :close-on-click-modal="false"
            @close="handleEmailDialogClose">
            <div class="email-dialog-content">
                <!-- 邮箱列表表格 -->
                <el-table ref="emailTable" :data="emailList" v-loading="emailLoading"
                    @selection-change="handleEmailSelectionChange" style="width: 100%" max-height="400">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column label="用户名称" prop="userName" align="center" min-width="120">
                        <template slot-scope="scope">
                            <span>{{ scope.row.userName || '-' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="邮箱地址" prop="email" align="center" min-width="200">
                        <template slot-scope="scope">
                            <el-tag type="info" size="small">{{ scope.row.email }}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="emailDialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleSend" :loading="sendLoading" size="small"
                    :disabled="selectedEmails.length === 0">
                    {{ sendLoading ? '发送中...' : '确 定 发 送' }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listJczxFeedReportBaseId,
    getReportCounts,
    sendpdf,
    emailList
} from "@/api/CentralLaboratory/jczxFeedReport";

export default {
    name: "JczxFeedReportBaseId",
    dicts: ['feed_report_status'],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 邮箱弹窗相关
            emailDialogVisible: false,
            emailLoading: false,
            sendLoading: false,
            emailList: [], // 邮箱列表数据
            selectedEmails: [], // 选中的邮箱列表
            // 选中数组
            ids: [],
            // 子表选中数据
            checkedOpJczxFeedReportInfo: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 检测中心饲料报告主表格数据
            jczxFeedReportBaseIdList: [],
            // 检测中心饲料报告子表格数据
            opJczxFeedReportInfoList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 删除id时间范围
            daterangeReceiveTime: [],
            // 删除id时间范围
            daterangeTestTime: [],
            // 删除id时间范围
            daterangeCheckTime: [],
            // 删除id时间范围
            daterangeApproveTime: [],
            // 新增：报告时间范围（绑定日期选择器，数组格式：[开始时间, 结束时间]）
            daterangeReportTime: [],
            // 新增：签发时间范围
            daterangeIssuanceTime: [],
            daterangeSendSampleTime: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                reportNo: null,
                sampleName: null,
                sampleNo: null,
                entrustDeptName: null,
                receiveTime: null,
                testTime: null,
                checkTime: null,
                approveTime: null,
                editUser: null,
                checkUser: null,
                approveUser: null,
                status: '3', // 状态
                beginSendSampleTime: null, // 新增：后端需要的送样开始时间
                endSendSampleTime: null,    // 新增：后端需要的送样结束时间
                // 新增：报告开始/结束时间（与后端字段名完全一致）
                beginReportTime: null,
                endReportTime: null,
                // 新增：签发时间参数
                beginIssuanceTime: null,
                endIssuanceTime: null
            },
            sendList: []
        };
    },
    created() {
        this.getList();
        this.getTabCounts();
    },
    methods: {

        /** 打开发送邮箱选择弹窗 */
        /** 打开发送邮箱选择弹窗 */
        openEmailDialog(row) {
            if (row) {
                this.sendList = [{
                    opJczxFeedReportBaseId: row.opJczxFeedReportBaseId, // 必须字段
                    feedEntrustOrderId: row.feedEntrustOrderId, // 必须字段
                    emails: this.selectedEmails.map(email => email.email).join(',') // 邮箱地址用逗号分隔
                }];
            } else {
                // 验证是否有选中的数据
                if (!this.sendList || this.sendList.length === 0) {
                    this.$message.warning('请先选择要发送的报告数据');
                    return;
                }
            }


            this.emailDialogVisible = true;
            this.emailLoading = true;

            // 调用邮箱列表接口
            emailList(row.feedEntrustOrderId).then(response => {
                this.emailList = response.data || [];
                this.emailLoading = false;

                if (this.emailList.length === 0) {
                    this.$message.warning('未找到可用的邮箱地址');
                } else {
                    this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
                    // 数据加载完成后自动全选
                    this.selectAllEmails();
                }
            }).catch(error => {
                this.emailLoading = false;
                console.error('加载邮箱列表失败:', error);
                this.$message.error('加载邮箱列表失败');
            });
        },
        // openEmailDialog() {
        //   // 验证是否有选中的数据
        //   if (!this.sendList || this.sendList.length === 0) {
        //     this.$message.warning('请先选择要发送的报告数据');
        //     return;
        //   }

        //   this.emailDialogVisible = true;
        //   this.emailLoading = true;

        //   // 调用邮箱列表接口
        //   emailList().then(response => {
        //     this.emailList = response.rows || [];
        //     this.emailLoading = false;
        //     if (this.emailList.length === 0) {
        //       this.$message.warning('未找到可用的邮箱地址');
        //     } else {
        //       this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
        //       // 数据加载完成后自动全选
        //       this.selectAllEmails();
        //     }


        //   }).catch(error => {
        //     this.emailLoading = false;
        //     console.error('加载邮箱列表失败:', error);
        //     this.$message.error('加载邮箱列表失败');
        //   });
        // },

        selectAllEmails() {
            this.$nextTick(() => {
                if (this.$refs.emailTable) {
                    // 确保表格数据已经渲染完成
                    setTimeout(() => {
                        this.$refs.emailTable.toggleAllSelection();
                    }, 100);
                }
            });
        },
        /** 邮箱选择变化 */
        handleEmailSelectionChange(selection) {
            this.selectedEmails = selection;
        },

        /** 移除选中的邮箱 */
        removeSelectedEmail(email) {
            const index = this.selectedEmails.findIndex(item => item.email === email.email);
            if (index > -1) {
                this.selectedEmails.splice(index, 1);
            }
        },


        /** 处理发送 */
        handleSend() {
            if (this.selectedEmails.length === 0) {
                this.$message.warning('请选择至少一个收件邮箱');
                return;
            }

            // 准备发送数据
            const sendData = this.sendList.map(item => ({
                opJczxFeedReportBaseId: item.opJczxFeedReportBaseId, // 必须字段
                feedEntrustOrderId: item.feedEntrustOrderId, // 必须字段
                emails: this.selectedEmails.map(email => email.email).join(',') // 邮箱地址用逗号分隔
            }));
            //  sendpdf(this.sendList).then((res) => {
            //   console.log(res, '22222222222')
            //   console.log(sendList, '55555')
            // })

            // console.log('发送数据:', sendData);

            this.sendLoading = true;
            sendpdf(sendData).then((res) => {
                this.sendLoading = false;
                if (res.code === 200) {
                    this.$message.success('报告发送成功');
                    // 关闭弹窗
                    this.emailDialogVisible = false;
                    // 清空选择
                    this.sendList = [];
                    this.selectedEmails = [];
                    // 刷新列表
                    this.getList();
                } else {
                    this.$message.error(res.msg || '发送失败');
                }
            }).catch(error => {
                this.sendLoading = false;
                console.error('发送失败:', error);
                this.$message.error('发送失败: ' + (error.message || '未知错误'));
            });
        },

        /** 邮箱弹窗关闭处理 */
        handleEmailDialogClose() {
            this.selectedEmails = [];
            this.emailLoading = false;
            this.sendLoading = false;
        },
        handlebgdy(row) {

            if (row.status == 0) {
                console.log(row, '55666666')
                const encodedData = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId));

                window.open(
                    `/reportgensl?feedEntrustOrderSampleId=${encodedData}&status=${row.status}&feedEntrustOrderId=${row.feedEntrustOrderId}`,
                    '_blank' // 新标签页
                );
            } else {
                const encodedData = encodeURIComponent(JSON.stringify(row.opJczxFeedReportBaseId));
                const encodedData1 = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId));
                window.open(
                    `/reportgensl?opJczxFeedReportBaseId=${encodedData}&status=${row.status}&feedEntrustOrderSampleId=${encodedData1}`,
                    '_blank' // 新标签页
                );
            }

        },
        /** 查询检测中心饲料报告主列表 */
        getList() {
            this.loading = true;
            this.queryParams.params = {};
           
            if (null != this.daterangeReceiveTime && '' != this.daterangeReceiveTime) {
                this.queryParams["beginReceiveTime"] = this.daterangeReceiveTime[0];
                this.queryParams["endReceiveTime"] = this.daterangeReceiveTime[1];
            } else {
                // 清空参数（避免上次查询的残留值）
                this.queryParams.beginReceiveTime = null;
                this.queryParams.endReceiveTime = null;
            }
            if (null != this.daterangeTestTime && '' != this.daterangeTestTime) {
                this.queryParams["beginTestTime"] = this.daterangeTestTime[0];
                this.queryParams["endTestTime"] = this.daterangeTestTime[1];
            }
            if (null != this.daterangeCheckTime && '' != this.daterangeCheckTime) {
                this.queryParams["beginCheckTime"] = this.daterangeCheckTime[0];
                this.queryParams["endCheckTime"] = this.daterangeCheckTime[1];
            }
            if (null != this.daterangeApproveTime && '' != this.daterangeApproveTime) {
                this.queryParams["beginApproveTime"] = this.daterangeApproveTime[0];
                this.queryParams["endApproveTime"] = this.daterangeApproveTime[1];
            }
            // 新增：处理送样时间（核心逻辑）
            if (this.daterangeSendSampleTime && this.daterangeSendSampleTime.length) {
                // 直接赋值给 queryParams 的顶级属性
                this.queryParams.beginSendSampleTime = this.daterangeSendSampleTime[0];
                this.queryParams.endSendSampleTime = this.daterangeSendSampleTime[1];
            } else {
                // 清空参数（避免残留）
                this.queryParams.beginSendSampleTime = null;
                this.queryParams.endSendSampleTime = null;
            }

            // 新增：报告时间参数处理（核心）
            if (this.daterangeReportTime && this.daterangeReportTime.length) {
                this.queryParams.beginReportTime = this.daterangeReportTime[0]; // 报告开始时间
                this.queryParams.endReportTime = this.daterangeReportTime[1];   // 报告结束时间
            } else {
                // 未选择时清空参数，避免残留上次查询值
                this.queryParams.beginReportTime = null;
                this.queryParams.endReportTime = null;
            }

            // 新增：签发时间参数处理
            if (this.daterangeIssuanceTime && this.daterangeIssuanceTime.length) {
                this.queryParams.beginIssuanceTime = this.daterangeIssuanceTime[0]; // 签发开始时间
                this.queryParams.endIssuanceTime = this.daterangeIssuanceTime[1];   // 签发结束时间
            } else {
                // 未选择时清空参数，避免残留上次查询值
                this.queryParams.beginIssuanceTime = null;
                this.queryParams.endIssuanceTime = null;
            }

            listJczxFeedReportBaseId(this.queryParams).then(response => {
                this.jczxFeedReportBaseIdList = response.rows;
                this.total = response.total;
                this.loading = false;
                this.tabCounts[this.activeTab] = response.total;
            });

        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
            this.getTabCounts();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.daterangeReceiveTime = [];
            this.daterangeTestTime = [];
            this.daterangeCheckTime = [];
            this.daterangeApproveTime = [];
            this.daterangeSendSampleTime = [];
            // 清空送样时间参数（避免残留）
            this.queryParams.beginSendSampleTime = null;
            this.queryParams.endSendSampleTime = null;
            // 清空送样时间参数（避免残留）
            this.queryParams.beginSendSampleTime = null;
            this.queryParams.endSendSampleTime = null;
            // 新增：重置报告时间范围变量
            this.daterangeReportTime = [];
            // 新增：重置报告时间查询参数
            this.queryParams.beginReportTime = null;
            this.queryParams.endReportTime = null;
            // 新增：重置签发时间范围变量
            this.daterangeIssuanceTime = [];
            // 新增：重置签发时间查询参数
            this.queryParams.beginIssuanceTime = null;
            this.queryParams.endIssuanceTime = null;
            this.resetForm("queryForm");
            this.handleQuery();
        },





        fs() {


            sendpdf(this.sendList).then((res) => {
                console.log(res, '22222222222')
                console.log(sendList, '55555')
            })
        },
        // 多选框选中数据
        // handleSelectionChange(selection) {
        //    console.log(selection, '+++++++++')
        //   console.log(selection)
        //   const result = selection.map(item => ({
        //     ypzCount: item.ypzCount,
        //     wpzCount: item.wpzCount,
        //     feedEntrustOrderId: item.feedEntrustOrderId
        //   }));
        //   this.sendList = result
        //    console.log(selection, '+++++++++')
        //   console.log(result);
        //   // this.ids = selection.map(item => item.opJczxFeedReportBaseId)
        //   // this.single = selection.length !== 1
        //   // this.multiple = !selection.length
        // },

        // handleSelectionChange(selection) {
        //   console.log('原始选择数据:', selection);

        //   // 检查是否有 wpzCount 不等于 0 的数据
        //   const invalidSelection = selection.filter(item => {
        //     return item.wpzCount !== 0; // 严格比较数字 0
        //   });

        //   if (invalidSelection.length > 0) {
        //     // 立即显示警告
        //     this.$message.warning(`请选择未批准样品数量为0的数据，当前选择了${invalidSelection.length}条不符合条件的数据`);

        //     // 可选：自动取消选择不符合条件的数据
        //     // this.$refs.table.clearSelection(); // 如果需要自动取消选择
        //   }

        //   // 过滤：只选择 wpzCount 等于 0 的数据
        //   const result = selection
        //     .filter(item => item.wpzCount === 0)  // 严格比较数字 0
        //     .map(item => ({
        //       ypzCount: item.ypzCount,
        //       wpzCount: item.wpzCount,
        //       feedEntrustOrderId: item.feedEntrustOrderId,
        //       entrustOrderNo: item.entrustOrderNo
        //     }));

        //   this.sendList = result;
        //   console.log('过滤后的发送列表:', result);

        //   // 更新选中状态
        //   this.ids = result.map(item => item.feedEntrustOrderId);
        //   this.single = result.length !== 1;
        //   this.multiple = !result.length;
        // },
        handleSelectionChange(selection) {
            console.log('原始选择数据:', selection);

            let result;

            // 只有在待发送标签页(status=4)时才进行 wpzCount 验证
            if (this.activeTab === '4') {
                // 检查是否有 wpzCount 不等于 0 的数据
                const invalidSelection = selection.filter(item => item.wpzCount !== 0);

                if (invalidSelection.length > 0) {
                    this.$message.warning(`请选择未批准样品数量为0的数据，当前选择了${invalidSelection.length}条不符合条件的数据`);
                }

                // 过滤：只选择 wpzCount 等于 0 的数据
                result = selection
                    .filter(item => item.wpzCount === 0)
                    .map(item => ({
                        ypzCount: item.ypzCount,
                        wpzCount: item.wpzCount,
                        feedEntrustOrderId: item.feedEntrustOrderId,
                        entrustOrderNo: item.entrustOrderNo
                    }));
            } else {
                // 其他标签页不做过滤
                result = selection.map(item => ({
                    ypzCount: item.ypzCount,
                    wpzCount: item.wpzCount,
                    feedEntrustOrderId: item.feedEntrustOrderId,
                    entrustOrderNo: item.entrustOrderNo
                }));
            }

            this.sendList = result;
            console.log('发送列表:', result);

            // 更新选中状态
            this.ids = result.map(item => item.feedEntrustOrderId);
            this.single = result.length !== 1;
            this.multiple = !result.length;
        },


        /** tab 点击事件 */
        handleTabClick(tab) {
            this.activeTab = tab.name;
            this.getList();
        },

        /** 复选框选中数据 */
        handleOpJczxFeedReportInfoSelectionChange(selection) {
            this.checkedOpJczxFeedReportInfo = selection.map(item => item.index)
        },


        /** 查询所有Tab的角标数量 */
        getTabCounts() {
            // 准备查询参数 (复用 getList() 的逻辑)
            // 注意：不要传 pageNum 和 pageSize
            const countParams = { ...this.queryParams };
            countParams.pageNum = undefined;
            countParams.pageSize = undefined;

            // --- 复用 getList() 中的日期处理逻辑 ---
            if (null != this.daterangeReceiveTime && '' != this.daterangeReceiveTime) {
                countParams["beginReceiveTime"] = this.daterangeReceiveTime[0];
                countParams["endReceiveTime"] = this.daterangeReceiveTime[1];
            }
            if (null != this.daterangeTestTime && '' != this.daterangeTestTime) {
                countParams["beginTestTime"] = this.daterangeTestTime[0];
                countParams["endTestTime"] = this.daterangeTestTime[1];
            }
            if (null != this.daterangeCheckTime && '' != this.daterangeCheckTime) {
                countParams["beginCheckTime"] = this.daterangeCheckTime[0];
                countParams["endCheckTime"] = this.daterangeCheckTime[1];
            }
            if (null != this.daterangeApproveTime && '' != this.daterangeApproveTime) {
                countParams["beginApproveTime"] = this.daterangeApproveTime[0];
                countParams["endApproveTime"] = this.daterangeApproveTime[1];
            }
            if (this.daterangeSendSampleTime && this.daterangeSendSampleTime.length) {
                countParams.beginSendSampleTime = this.daterangeSendSampleTime[0];
                countParams.endSendSampleTime = this.daterangeSendSampleTime[1];
            }
            if (this.daterangeReportTime && this.daterangeReportTime.length) {
                countParams.beginReportTime = this.daterangeReportTime[0];
                countParams.endReportTime = this.daterangeReportTime[1];
            }
            if (this.daterangeIssuanceTime && this.daterangeIssuanceTime.length) {
                countParams.beginIssuanceTime = this.daterangeIssuanceTime[0];
                countParams.endIssuanceTime = this.daterangeIssuanceTime[1];
            }
            // --- 日期处理结束 ---

            // 调用后端新接口
            getReportCounts(countParams).then(response => {
                if (response.code === 200 && response.data) {
                    const data = response.data;
                    // 确保给所有状态赋值 (即使后端没返回，也重置为 0)
                    this.tabCounts['0'] = data.status_0 || 0;
                    this.tabCounts['1'] = data.status_1 || 0;
                    this.tabCounts['2'] = data.status_2 || 0;
                    this.tabCounts['3'] = data.status_3 || 0;
                    this.tabCounts['4'] = data.status_4 || 0;
                    this.tabCounts['5'] = data.status_5 || 0;
                } else {
                    // 失败时重置
                    Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
                }
            }).catch(() => {
                // 异常时重置
                Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
            });
        },
    }
};
</script>
