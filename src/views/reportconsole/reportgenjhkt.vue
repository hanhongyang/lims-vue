<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="PageStyle">
                <div class="biaotihdflex">
                    <div class="font15">报告编号（ReportID）：{{ feedReportBase.reportNo }}</div>
                </div>
                <div class="biaotihd" style=" margin-top: 130px;">
                    <div class="titlebold">动物疫病诊断（检验）报告书</div>
                </div>
                <div class="biaotihd" style="margin-top: 150px;">
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            送检单位：
                            <span class="content-line">{{ feedReportBase.entrustDeptName }}</span>
                        </div>
                    </div>
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            样品名称：
                            <span class="content-line">{{ feedReportBase.sampleName }}</span>
                        </div>
                    </div>
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            检验类别：
                            <span class="content-line">{{ feedReportBase.testType }}</span>
                        </div>
                    </div>
                </div>
                <div class="gongsift">
                    <div class="dibu1">检测单位：光明牧业有限公司检验测试中心</div>
                    <div class="dibu2">报告日期：{{ formattedReportDate }}</div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:10px">
                    <div class="dibu1 font30">声 明</div>
                </div>
                <div class="biaotihd" style=" margin-top: 0px;font-size:20px;text-align:left">
                    <div style="margin:13px 0">
                        1.报告无检验专用章无效；
                    </div>
                    <div style="margin:13px 0">
                        2.复制本报告未重新加盖本检验专用章无效；复印部分报告无效；
                    </div>
                    <div style="margin:13px 0">
                        3.报告无编制、审核、批准人签字无效；
                    </div>
                    <div style="margin:13px 0">
                        4.报告涂改无效；
                    </div>
                    <div style="margin:13px 0">
                        5.对检验报告若有异议，请在收到报告之日起十五日内向检验单位提出，逾期不予受理；
                    </div>
                    <div style="margin:13px 0">
                        6.本检验报告仅对来样负责；
                    </div>
                    <div style="margin:13px 0">
                        7.未经检验单位同意，本检验报告不得用于商业性广告。
                    </div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:20px">
                    <div class="dibu1 font30">动物疫病诊断（检验）报告单</div>
                </div>
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号: {{ feedReportBase.reportNo }}</div>
                            <div>共{{ totalPageCount }}页 第1页</div>
                        </div>
                    </div>
                    <table class="sample-table">
                        <tr>
                            <th colspan="1">送检单位</th>
                            <td colspan="1">{{ feedReportBase.entrustDeptName }}</td>
                            <th colspan="1">样品名称</th>
                            <td colspan="1">{{ feedReportBase.sampleName }}</td>
                            <th colspan="1">样品数量</th>
                            <td colspan="1">{{ feedReportBase.sampleAmount }}</td>
                        </tr>
                        <tr>
                            <th colspan="1">动物类别</th>
                            <td colspan="1">{{ feedReportBase.animalType }}</td>
                            <th colspan="1">收样日期</th>
                            <td colspan="1">{{ feedReportBase.receiveTime }}</td>
                            <th colspan="1">检验日期</th>
                            <td colspan="1">{{ feedReportBase.testTime }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">样品状态：</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">{{ feedReportBase.sampleState }}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">检测类别</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">牛分支杆菌抗体检测
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">检验方法及依据</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">{{ feedReportBase.testBasis }}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">仪器设备</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">{{ feedReportBase.insturment }}
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">检测结果与评价</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">
                                {{ feedReportBase.testEvaluation }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">判定标准<br>Conclusion</th>
                            <!-- <td colspan="5" rowspan="1" class="colspan-cell">11</td> -->
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">
                                {{ feedReportBase.testCriterion }}
                                <!-- &nbsp;根据委托方的要求，仅提供实测数据，详见检测结果汇总页。
                                <div style="border-bottom:1px solid black;width:100%;padding:5px 0"></div>
                                <div>
                                    S/P=（样品OD值-阴性对照的平均OD值）/（阳性对照的平均OD值-阴性对照的平均OD值）<br>
                                    标准阴性血清的OD值必须在小于0.150。标准阳性血清的OD值必须在1.500以上。<br>
                                    <div style="height:20px"></div>
                                    判定：S/P值≥0.5判为结核抗体阳性，用+表示；<br>
                                    S/P值＜0.5判为结核抗体阴性，用-表示。
                                </div> -->
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">标准对照</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">{{
                                feedReportBase.testReferStandard }}</td>
                        </tr>
                        <tr>
                            <th colspan="2">试剂来源及批号</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">{{ feedReportBase.sampleBatchNo
                            }}
                            </td>
                        </tr>
                    </table>
                    <div class="xfqm">
                        <div class="ttxf">编制人:<img :src="signTypes.编制人" class="qm" v-if="feedReportBase.editSign"></div>
                        <!-- <div class="ttxf">审核人:<img :src="signTypes.审核人" class="qm" v-if="feedReportBase.checkSign">
                        </div> -->
                        <div class="ttxf">批准人:<img :src="signTypes.批准人" class="qm" v-if="feedReportBase.approveSign">
                        </div>
                    </div>
                    <div class="xfqm" style="margin-top:10px">
                        <div class="ttxf">日期:{{ feedReportBase.editTime }}</div>
                        <!-- <div class="ttxf">日期:{{ feedReportBase.checkTime }}</div> -->
                        <div class="ttxf">日期:{{ feedReportBase.approveTime }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sta-main" v-if="combinedPagedList.length > 0">
            <div class="PageStyle" v-if="combinedPagedList[0] && combinedPagedList[0].length > 0">

                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号: {{ feedReportBase.reportNo }}</div>
                            <div>共{{ totalPageCount }}页 第2页</div>
                        </div>
                    </div>

                    <div style="text-align:left;font-size:20px">以下是检测结果汇总：</div>
                    <table class="sample-table" style=" font-size: 11px;">
                        <tr>
                            <td rowspan="2">编号</td>
                            <td rowspan="2">牛号</td>
                            <td colspan="2">结核ELISA抗体</td>
                        </tr>
                        <tr>
                            <td>S/P值</td>
                            <td>结果判定</td>
                        </tr>
                        <tr v-for="(item, index) in combinedPagedList[0]" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.sampleName }}</td>
                            <td>{{ item.sp }}</td>
                            <td>
                                {{ item.testResult == '0' ? '阴性' : '阳性' }}
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <template v-for="(page, pageIndex) in combinedPagedList.slice(1)">
                <div class="sta-main" :key="'page-' + pageIndex">
                    <div class="PageStyle">
                        <div class="report-container" style="margin:0">
                            <div class="report-header">
                                <div class="report-info">
                                    <div>报告编号: {{ feedReportBase.reportNo }}</div>
                                    <div>共{{ totalPageCount }}页 第{{ 3 + pageIndex }}页</div>
                                </div>
                            </div>

                            <table class="sample-table" style=" font-size: 11px;">
                                <tr v-for="(item, index) in page" :key="index">
                                    <td>{{ rowsPerPageFirst + pageIndex * rowsPerPageOther + index + 1 }}</td>
                                    <td>{{ item.sampleName }}</td>
                                    <td>{{ item.sp }}</td>
                                    <td>
                                        {{ item.testResult == '0' ? '阴性' : '阳性' }}
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <div class="pdfdown" style="z-index: 100;" v-if="isShowB">
            <el-button type="primary" @click="pdfbc" style="margin-left:10px" v-if="status == 0">保存</el-button>
            <el-button type="primary" @click="pdfMtj" v-if="this.isShow || status == 1">提交</el-button>

            <el-button type="primary" @click="pdfjz" style="margin-left:10px" v-if="this.status == 2">通过</el-button>
            <el-button type="primary" @click="pdfbjz" v-if="this.status == 2">不通过</el-button>

            <!-- <el-button type="primary" @click="pdfjz" style="margin-left:10px" v-if="this.status == 3">通过</el-button>
            <el-button type="primary" @click="pdfbjz" v-if="this.status == 3">不通过</el-button> -->


            <!-- <el-button type="primary" @click="pdftg" style="margin-left:10px" v-if="this.status == 2">通过</el-button>
            <el-button type="primary" @click="pdfbtg" v-if="this.status == 2">不通过</el-button>

            <el-button type="primary" @click="pdfjz" style="margin-left:10px" v-if="this.status == 3">通过</el-button>
            <el-button type="primary" @click="pdfbjz" v-if="this.status == 3">不通过</el-button> -->
            <!-- <el-button type="primary" @click="pdfMap">导出单页</el-button> -->
            <el-button type="primary" @click="pdfMap" v-if="this.status == 4">发送</el-button>
        </div>

        <el-dialog title="请输入不通过原因" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false"
            @close="handleDialogClose" append-to-body>
            <el-input type="textarea" :rows="4" v-model="returnReason" placeholder="请输入原因" ref="reasonInput"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleRejectConfirm" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择发送邮箱" :visible.sync="emailDialogVisible" width="800px" :close-on-click-modal="false"
            @close="handleEmailDialogClose">
            <div class="email-dialog-content">
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
                邮件标题：<el-input v-model="title" placeholder="请输入邮件标题" clearable></el-input>
                正文内容：<el-input type="textarea" v-model="content" placeholder="请输入正文内容" clearable></el-input>

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
import $ from 'jquery';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { XZPic } from "@/api/hyd";
import {
    Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, downloadXyReport, savePdfzy, ckbg, emailList,
    sendpdfzy,
} from "@/api/CentralLaboratory/jczxBloodReport";
import { upload, uploadPCR } from '@/api/common/common'
export default {
    data() {
        return {
            // 遮罩层
            loading: false,
            signTypes: {
                编制人: '',
                审核人: '',
                批准人: '',
            },
            rowsPerPage: 27, // 可以保留但不再用于分页计算
            rowsPerPageFirst: 27, // 首页数据行数 (匹配 30 行/页的样式，减去表头)
            rowsPerPageOther: 31, // 后续页数据行数    
            infoList: [{
                a: "3",
                b: "1",
                c: "1",
            }],
            // 阴性数据
            negativeList: [],
            // 新增阳性数据
            positiveList: [],
            status: '',
            isShowB: false,
            bloodEntrustOrderId: '',
            feedReportBase: {},
            dx: {},
            isShow: false,
            opJczxBloodReportBaseId: '',
            bloodTaskItemType: '',
            fsh: false,
            dialogVisible: false,
            returnReason: '',
            currentRejectAction: null, // 'btg' (审核不通过) or 'bjz' (批准不通过)
            fsEmail: '', // 有数据在详情里面
            // 邮箱弹窗相关
            emailDialogVisible: false,
            emailLoading: false,
            sendLoading: false,
            emailList: [], // 邮箱列表数据
            selectedEmails: [], // 选中的邮箱列表
            title: '', // 邮件标题
            content: '', // 正文内容
        }
    },
    mounted() {
        this.qmhx()
        this.status = this.$route.query.status
        this.bloodEntrustOrderId = this.$route.query.bloodEntrustOrderId
        this.bloodTaskItemType = this.$route.query.bloodTaskItemType
        this.opJczxBloodReportBaseId = this.$route.query.opJczxBloodReportBaseId
        console.log(this.status, this.bloodEntrustOrderId, '111111111111')
        const newAr = {
            bloodEntrustOrderId: this.bloodEntrustOrderId,
            status: this.status,
            bloodTaskItemType: this.bloodTaskItemType
        }
        const newAr1 = {
            bloodEntrustOrderId: this.bloodEntrustOrderId,
            status: '1',
            opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
            bloodTaskItemType: this.bloodTaskItemType
        }
        this.xqlist = newAr1
        if (this.status == 0) {
            console.log(newAr, '222222222222')
            Reportsl(newAr).then(res => {
                console.log(res, '888888888888')
                this.dx = res
                this.feedReportBase = res.data
                this.dx = res.data.opBloodJHReportSampleVo
                res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                    this.negativeList.push(item)
                })
                res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                    this.positiveList.push(item)
                })
                this.isShowB = true
            });
        } else {
            if (this.$route.query.isShowB) {
                console.log('33333')
                ckbg(this.$route.query.reportId).then((res) => {

                    this.feedReportBase = res.data
                    this.aisShow = res.data.aisShow
                    this.oisShow = res.data.oisShow
                    this.dx = res.data.opBloodJHReportSampleVo
                    res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                        this.negativeList.push(item)
                    })
                    res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                        this.positiveList.push(item)
                    })
                    this.infoList = res.data.opBloodJHReportSampleVo.ktyList
                    this.qmhx()
                    this.isShowB = true
                })
            } else {
                Reportsl(newAr1).then(res => {
                    console.log(res, '888888888888')
                    this.fsEmail = res.data
                    this.dx = res
                    this.feedReportBase = res.data
                    this.dx = res.data.opBloodJHReportSampleVo
                    res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                        this.negativeList.push(item)
                    })
                    res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                        this.positiveList.push(item)
                    })
                    this.$nextTick(() => {
                        this.qmhx();
                    });
                    this.isShowB = true
                });
            }

        }
    },
    computed: {
        totalPageCount() {
            // 实际内容总页数：
            // 1 (报告单主体页) + combinedPagedList.length (数据汇总页数)
            return 1 + this.combinedPagedList.length;
        },
        /** 新增：合并阳性列表和阴性列表并进行分页 */
        combinedPagedList() {
            // 1. 合并数据：阳性在前，阴性在后
            const combinedList = [...this.positiveList, ...this.negativeList];

            const pages = [];
            const rowsPerPageFirst = this.rowsPerPageFirst; // 27
            const rowsPerPageOther = this.rowsPerPageOther; // 31

            // 2. 第一页（带表头）：只取 27 条数据
            if (combinedList.length > 0) {
                pages.push(combinedList.slice(0, rowsPerPageFirst));
            }

            // 3. 剩余页：每页取 31 条
            const left = combinedList.slice(rowsPerPageFirst);
            for (let i = 0; i < left.length; i += rowsPerPageOther) {
                pages.push(left.slice(i, i + rowsPerPageOther));
            }

            return pages;
        },
        formattedReportDate() {
            if (!this.feedReportBase.reportDate) return '';
            const [year, month, day] = this.feedReportBase.reportDate.split('-');
            return `${year}年${parseInt(month)}月${parseInt(day)}日`;
        }
    },
    methods: {
        pdfbc() {
            const newReportData = {
                ...this.feedReportBase,
                opBloodJHReportSampleVo: this.dx,
                status: '1',
            };
            Reportslbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.isShow = true
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                }
                this.xqlist.opJczxBloodReportBaseId = res.msg
                console.log(this.xqlist)
                zzhhx(this.xqlist).then(res => {
                    console.log(res, '999999999999999999')
                    this.feedReportBase = res.data
                    this.qmhx()
                });

            })
        },
        pdfMtj() {
            const newReportData = {
                ...this.feedReportBase,
                opBloodJHReportSampleVo: this.dx,
                status: '2',
            };
            Reportslbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                }

            })
        },


        pdftg() {
            const newReportData = {
                status: '3',
                opJczxBloodReportBaseId: this.opJczxBloodReportBaseId
            };
            zzhhxbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '通过成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '通过失败',
                        type: 'error'
                    });
                }
            })
        },

        pdfbtg() {
            this.currentRejectAction = 'btg'; // 标记为"审核不通过"
            this.returnReason = ''; // 清空上次输入
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.reasonInput.focus(); // 弹窗打开后自动聚焦
            });
        },
        pdfjz() {
            const newReportData = {
                status: '4',
                opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
                bloodEntrustOrderId: this.bloodEntrustOrderId
            };
            jzcommit(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '批准成功',
                        type: 'success'
                    });
                    // this.pdfMap()
                } else {
                    this.$message({
                        message: '批准失败',
                        type: 'error'
                    });
                }
            })
        },

        pdfbjz() {
            this.currentRejectAction = 'bjz'; // 标记为"批准不通过"
            this.returnReason = ''; // 清空上次输入
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.reasonInput.focus(); // 弹窗打开后自动聚焦
            });
        },


        /** 处理弹窗关闭 */
        handleDialogClose() {
            this.dialogVisible = false;
            this.returnReason = '';
            this.currentRejectAction = null;
        },

        /** 处理不通过弹窗的“确定”按钮 */
        handleRejectConfirm() {
            if (!this.returnReason || this.returnReason.trim() === '') {
                this.$message.warning('请输入退回原因');
                return;
            }

            if (this.currentRejectAction === 'btg') {
                // 审核不通过
                const newReportData = {
                    status: '1', // 审核不通过，退回到状态 '1' (同源文件)
                    opJczxBloodReportBaseId: this.opJczxBloodReportBaseId, // 使用当前文件的ID
                    returnReason: this.returnReason // 附带原因
                };
                zzhhxbc(newReportData).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$message.success('不通过成功');
                        this.handleDialogClose(); // 关闭弹窗
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不通过失败');
                    }
                });

            } else if (this.currentRejectAction === 'bjz') {
                // 批准不通过
                const newReportData = {
                    status: '1', // 批准不通过，退回到状态 '1' (同源文件，源文件这里也是1)
                    opJczxBloodReportBaseId: this.opJczxBloodReportBaseId, // 使用当前文件的ID
                    returnReason: this.returnReason // 附带原因
                };
                jzcommit(newReportData).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$message.success('不批准成功');
                        this.handleDialogClose(); // 关闭弹窗
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不批准失败');
                    }
                });
            }
        },


        /** 下载报告（修正提示文案bug） */
        handleDownload() {
            console.log('下载报告', this.feedReportBase);
            const newdx = {
                bloodEntrustOrderId: this.feedReportBase.bloodEntrustOrderId,
                entrustDeptName: this.feedReportBase.entrustDeptName,
                receiveTime: this.feedReportBase.receiveTime,
                sampleAmount: this.feedReportBase.sampleAmount,
                reportDate: this.feedReportBase.reportDate,

            }
            console.log(newdx, '7')
            downloadXyReport(newdx).then(response => {
                this.downloadFile(response, this.feedReportBase.entrustOrderNo); // 传入委托单号构造文件名
                this.$modal.msgSuccess(`报告下载开始，委托单号：${this.feedReportBase.entrustOrderNo}`); // 修正提示文案
            }).catch(error => {
                this.$modal.msgError("文件下载失败");
            });
        },
        /** 下载文件工具方法（优化文件名） */
        downloadFile(response, entrustOrderNo) {
            if (response instanceof Blob) {
                const blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const url = window.URL.createObjectURL(blob);
                const time = new Date()
                // 用委托单号构造唯一文件名（避免重复）
                const fileName = `血样检测报告_${time}.xlsx`;

                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error('响应不是文件流格式');
                this.$modal.msgError("文件格式错误，无法下载");
            }
        },
        /** 导出单页 */
        pdfMap() {
            var title = this.csupname;
            var whiteImg = "";
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            var doc = "";
            var stamain = document.getElementsByClassName("sta-main");
            for (var i = 0; i < stamain.length; i++) {
                stamain[i].style.border = "0";
            }

            $(".sta-main").css("margin-top", "0", "padding", "0px 20px");
            $(".pdfdown").css("display", "none");
            $(".uedbtn").css("display", "none");
            var stalength = $(".sta-main").length;
            var mpddfcont = 0;
            var jspdfsize = ['580', '841.89'];
            this.PDF = new jsPDF('p', 'pt', jspdfsize);
            this.getpdf(stalength, mpddfcont);

        },
        getpdf(stalength, mpddfcont) {
            var pdfheight = 841.89;
            html2canvas($(".sta-main")[mpddfcont], {
                allowTaint: true,
                scale: 2,
                logging: true,
                background: "#ffffff",
                imageTimeout: 0,
                removeContainer: true,
                scrollX: 0,
            }).then(canvas => {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                var pageData = canvas.toDataURL("image/jpeg", 1);
                console.log(contentWidth, "22tree");
                if (contentHeight != 0) {
                    this.PDF.addImage(pageData, "jpeg", 0, 0, 580, 841.89);
                }
                if (mpddfcont == stalength - 1) {
                    $(".sta-main").css("margin-top", "10px", "padding", "10px 20px");
                    // this.PDF.save('血样检测报告' + ".pdf");
                    $(".pdfdown").css("display", "block");
                    $(".uedbtn").css("display", "block");

                    const pdfBlob = this.PDF.output('blob');
                    console.log(pdfBlob, 'bolb')
                    const pdfFile = new File(
                        [pdfBlob],
                        "检测报告.pdf",
                        { type: "application/pdf" }
                    );
                    const formData = new FormData();
                    formData.append('file', pdfFile, '检测报告.pdf');
                    upload(formData).then((res) => {
                        console.log(res, '11112221111111')
                        const newA = {
                            pdfFileInfo: res.fileName,
                            opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
                            bloodEntrustOrderId: this.bloodEntrustOrderId
                        }
                        savePdfzy(newA).then((res) => {
                            if (res.code == 200) {
                                this.$message({
                                    message: '上传文件成功',
                                    type: 'success'
                                });
                                // setTimeout(() => {
                                //     window.close()
                                // }, 1000)
                                console.log(this.fsEmail, 'this.fsEmail')
                                if (this.fsEmail) {
                                    this.sendList = [{
                                        opJczxBloodReportBaseId: this.fsEmail.opJczxBloodReportBaseId, // 必须字段
                                        bloodEntrustOrderId: this.fsEmail.bloodEntrustOrderId, // 必须字段
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
                                // 调用邮箱接口
                                emailList(this.bloodEntrustOrderId).then(response => {
                                    console.log(response, 'response')
                                    this.emailList = response.rows || [];
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
                            } else {
                                this.$message({
                                    message: '上传文件失败',
                                    type: 'error'
                                });
                            }

                        })
                    })
                    return;
                }
                mpddfcont++;

                if (mpddfcont < stalength) {
                    console.log(mpddfcont);
                    this.PDF.addPage('580', '841.89');
                    if ($(".sta-main:eq(" + mpddfcont + ") #containtree").length != 0) {
                        this.getstpdf(stalength, mpddfcont);
                    } else {
                        this.getpdf(stalength, mpddfcont);
                    }
                }
            });
        },
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
        /** 邮箱弹窗关闭处理 */
        handleEmailDialogClose() {
            this.selectedEmails = [];
            this.emailLoading = false;
            this.sendLoading = false;
        },
        /** 邮箱选择变化 */
        handleEmailSelectionChange(selection) {
            this.selectedEmails = selection;
        },
        /** 处理发送 */
        handleSend() {
            if (this.selectedEmails.length === 0) {
                this.$message.warning('请选择至少一个收件邮箱');
                return;
            }

            // 准备发送数据
            const sendData = this.sendList.map(item => ({
                opJczxBloodReportBaseId: item.opJczxBloodReportBaseId, // 必须字段
                bloodEntrustOrderId: item.bloodEntrustOrderId, // 必须字段
                emails: this.selectedEmails.map(email => email.email).join(','), // 邮箱地址用逗号分隔
                title: this.title, // 邮件标题
                content: this.content // 正文内容
            }));

            this.sendLoading = true;
            // console.log(sendData, 'sendData')
            sendpdfzy(sendData).then((res) => {
                this.sendLoading = false;
                if (res.code === 200) {
                    this.$message.success('报告发送成功');
                    // 关闭弹窗
                    this.emailDialogVisible = false;
                    // 清空选择
                    this.sendList = [];
                    this.selectedEmails = [];
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message.error(res.msg || '发送失败');
                }
            }).catch(error => {
                this.sendLoading = false;
                console.error('发送失败:', error);
                this.$message.error('发送失败: ' + (error.message || '未知错误'));
            });
        },
        // 签名回显
        qmhx() {
            if (this.feedReportBase.editSign) {
                XZPic(this.feedReportBase.editSign).then((res) => {
                    this.signTypes.编制人 = URL.createObjectURL(res)
                })
            }
            if (this.feedReportBase.checkSign) {
                XZPic(this.feedReportBase.checkSign).then((res) => {
                    this.signTypes.审核人 = URL.createObjectURL(res)
                })
            }
            if (this.feedReportBase.approveSign) {
                XZPic(this.feedReportBase.approveSign).then((res) => {
                    this.signTypes.批准人 = URL.createObjectURL(res)
                })
            }
        }
    }
}
</script>
<style scoped>
@import "~@/assets/styles/BreedingReportxy.css";

.xingzhuanginput {
    width: 100%;
    border: 0;
    background: #fff;
    height: 25px;
    outline: none;
}
</style>
<style scoped>
* {
    font-family: "宋体"
}

.mutable * {
    font-family: "宋体";
}

.elevator {
    right: 50px;
    top: 70%;
    margin-top: -45px;
    display: none;
    position: fixed;
    z-index: 5;
    width: 30px;
}

ul,
li {
    padding: 0;
    margin: 0;
    list-style: none;
}

.layui-upload-drag {
    width: 100% !important;
}

.modal-backdrop {
    height: 100%;
}

.modal {
    z-index: 10;
}

.expandIcon {
    display: none !important;
}

#treecont .line>.line-right {
    width: 20px !important;
    border-bottom: solid 2px #000 !important;
}

#treecont>.node-cell {
    position: relative;
}

.treecatalog {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    text-align: center;
    left: 0;
}

.treecatalog b {
    display: inline-block;
    padding: 10px 15px;
    background-color: moccasin;
}

.contpage3tree {
    min-height: 1020px;
    padding-top: 20px;
    width: auto;
    min-width: 500pt;
    display: inline-block;
    padding-left: 30px;
}

.contpage3tree .node-parent,
.contpage3tree .node-childrens {
    vertical-align: top !important;
}

.contpage3tree .line {
    vertical-align: top !important;
}

.contpage3tree .line .line-right {
    margin-top: 11px !important;

}

.node-lines .linechild {
    position: absolute;
    top: 11px;
    width: 20px;
    border-bottom: solid 2px #000;
}

.contpage3tree .line-top {
    border-bottom: 0 !important;
    height: 11px !important;
}

.contpage3tree .line-bottom {
    border-bottom: 0 !important;
    height: calc(100% - 11px) !important;
}

#treecont .line-bottom.last,
#treecont .line-top.first {
    border: 0 !important;
}

#treecont .line-top.first {
    margin-top: 1px !important;
}

#treecont .line-top,
#treecont .line-bottom {
    border-left: solid 2px #000 !important;
}

/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
.contpage3tree::-webkit-scrollbar {
    width: 12px;
}

/* 滚动槽 */
.contpage3tree::-webkit-scrollbar-track {
    -webkit-box-shadow: inset rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

/* 滚动条滑块 */
.contpage3tree::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset rgba(0, 0, 0, 0.5);
}

.contpage3tree::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
}


.Page9td {
    text-align: center;
    width: 10%
}

.mulutext {
    line-height: 32px;
}
</style>
