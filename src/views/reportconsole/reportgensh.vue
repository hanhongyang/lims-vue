<template>
    <div id="printId" v-loading="loading">
        <!-- 第一页：带表头 -->
        <div class="sta-main" v-if="pagedList.length > 0">
            <div class="PageStyle">
                <div class="report-container">
                    <h1 style="font-weight:bold">
                        光明牧业有限公司检验测试中心
                    </h1>
                    <h2 style="font-weight:bold;margin-top:10px">
                        生化检测结果
                    </h2>
                    <div style="text-align:left;font-size:20px">送样单位：{{ feedReportBase.entrustDeptName }}</div>
                    <table class="sample-table" style=" font-size: 11px;">
                        <tr>
                            <td>序号</td>
                            <td>牛号</td>

                            <td v-for="c in showCols" :key="'h-' + c.key">{{ c.label }}</td>
                        </tr>
                        <tr>
                            <td>单位</td>
                            <td>/</td>

                            <td v-for="c in showCols" :key="'u-' + c.key" v-html="c.unit.replace('\\n', '<br>')"></td>
                        </tr>
                        <tr>
                            <td>参考范围</td>
                            <td>/</td>

                            <td v-for="c in showCols" :key="'r-' + c.key" v-html="c.ref.replace('\\n', '<br>')"></td>
                        </tr>
                        <tr v-for="(item, index) in pagedList[0]" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.sampleName }}</td>

                            <td v-for="c in showCols" :key="'v-' + c.key">{{ item[c.key] }}</td>
                        </tr>

                    </table>
                    <!-- 在最后一页添加签收日期 -->
                    <div v-if="isLastPage(0)" style="text-align:left;font-size:20px;width: 60%;">备注：{{
                        feedReportBase.remark }}</div>
                    <div v-if="isLastPage(0)" style="text-align:right;margin-top: 10px;">
                        <strong>日期：</strong> {{ feedReportBase.reportDate }}
                    </div>
                </div>
            </div>
        </div>
        <template v-for="(page, pageIndex) in pagedList.slice(1)">
            <div class="sta-main" :key="'page-' + pageIndex">
                <div class="PageStyle">
                    <div class="report-container" style="margin:0">
                        <div class="report-header">
                            <div class="report-info">
                                <div></div>

                            </div>
                        </div>

                        <table class="sample-table" style=" font-size: 11px;">
                            <tr v-for="(item, index) in page" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td v-for="c in showCols" :key="'pv-' + c.key">{{ item[c.key] }}</td>

                            </tr>
                        </table>
                        <!-- 在最后一页添加签收日期 -->
                        <div v-if="pageIndex === pagedList.slice(1).length - 1" style="text-align:right">
                            <strong>签收日期：</strong> {{ feedReportBase.reportDate }}
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="pdfdown" style="z-index: 100;">
            <el-button type="primary" @click="pdfbc" style="margin-left:10px" v-if="status == 0">保存</el-button>
            <el-button type="primary" @click="pdfMtj" v-if="this.isShow || status == 1">提交</el-button>

            <el-button type="primary" @click="pdftg" style="margin-left:10px" v-if="this.status == 2">通过</el-button>
            <el-button type="primary" @click="pdfbtg" v-if="this.status == 2">不通过</el-button>

            <el-button type="primary" @click="pdfjz" style="margin-left:10px" v-if="this.status == 3">通过</el-button>
            <el-button type="primary" @click="pdfbjz" v-if="this.status == 3">不通过</el-button>
            <el-button type="primary" @click="pdfMapTrue" v-if="this.status == 5">下载报告</el-button>
            <!-- <el-button type="primary" @click="handleDownload">下载excel</el-button> -->
            <el-button type="primary" @click="pdfMap" v-if="this.status != 5">发送</el-button>
        </div>
        <el-dialog title="请输入不通过原因" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false"
            @close="handleDialogClose" append-to-body>
                        <el-input type="textarea" :rows="4" v-model="returnReason" placeholder="请输入原因"
                ref="reasonInput"></el-input>
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
                <div style="margin-top: 15px;">
                    <div style="margin-bottom: 5px;">邮件标题：</div>
                    <el-input v-model="title" placeholder="请输入邮件标题" clearable style="margin-bottom: 10px;"></el-input>
                    <div style="margin-bottom: 5px;">正文内容：</div>
                    <el-input type="textarea" :rows="10" v-model="content" placeholder="请输入正文内容" clearable></el-input>
                </div>
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
    Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, downloadXyReportsh, savePdfzy, ckbg, emailList, sendpdfzy,
} from "@/api/CentralLaboratory/jczxBloodReport";
import { upload, uploadPCR } from '@/api/common/common'
export default {
    dicts: ['biochemistry_item_type', 'biochemistry_item_unit', 'biochemistry_item_range'],
    data() {
        return {
            // 遮罩层
            loading: false,
            signTypes: {
                编制人: '',
                审核人: '',
                批准人: '',
            },
            rowsPerPage: 22,
            infoList: [],
            status: '',
            bloodEntrustOrderId: '',
            bloodTaskItemType: '',
            opJczxBloodReportBaseId: '',
            feedReportBase: {},
            isShow: false,
            xqlist: {},
            fsh: false,
            dialogVisible: false,
            returnReason: '',
            currentRejectAction: null, // 用于区分是 'btg' (审核不通过) 还是 'bjz' (批准不通过)
            dynamicCols: [

            ],
            showCols: [], // 最终要显示的列

            fsEmail: '', // 有数据在详情里面
            // 邮箱弹窗相关
            emailDialogVisible: false,
            emailLoading: false,
            sendLoading: false,
            emailList: [], // 邮箱列表数据
            selectedEmails: [], // 选中的邮箱列表
            sendList: [],
            // 【新增】邮件标题和正文默认值
            title: '生化检测结果',
            content: `生化结果烦请见附件
--------------------------
 
光明牧业有限公司 奶研所
 
手机：
邮箱：
地址：上海市闵行区万源路2729号309室`
        }
    },
    // mounted() {

    //     this.status = this.$route.query.status

    //     this.bloodEntrustOrderId = this.$route.query.bloodEntrustOrderId

    //     this.bloodTaskItemType = this.$route.query.bloodTaskItemType
    //     this.opJczxBloodReportBaseId = this.$route.query.opJczxBloodReportBaseId
    //     console.log(this.status, this.bloodEntrustOrderId, '111111111111')
    //     const newAr = {
    //         bloodEntrustOrderId: this.bloodEntrustOrderId,
    //         status: this.status,
    //         bloodTaskItemType: this.bloodTaskItemType
    //     }
    //     const newAr1 = {
    //         bloodEntrustOrderId: this.bloodEntrustOrderId,
    //         status: '1',
    //         opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
    //         bloodTaskItemType: this.bloodTaskItemType
    //     }
    //     this.xqlist = newAr1
    //     if (this.status == 0) {
    //         console.log(newAr, '222222222222')
    //         Reportsl(newAr).then(res => {
    //             console.log(res, '888888888888')
    //             this.dx = res

    //             this.feedReportBase = res.data
    //             this.aisShow = res.data.aisShow
    //             this.oisShow = res.data.oisShow
    //             this.dx = res.data.opBloodJHReportSampleVo
    //             res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
    //                 this.negativeList.push(item.sampleName)
    //             })
    //             res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
    //                 this.positiveList.push(item.sampleName)
    //             })

    //             this.infoList = res.data.opBloodJHReportSampleVo.shList
    //             this.calcShowCols();


    //         });
    //     } else {

    //         if (this.$route.query.isShowB) {
    //             console.log('33333')
    //             ckbg(this.$route.query.reportId).then((res) => {
    //                 console.log(res, '88888888888888888')

    //                 this.feedReportBase = res.data
    //                 this.aisShow = res.data.aisShow
    //                 this.oisShow = res.data.oisShow
    //                 this.dx = res.data.opBloodJHReportSampleVo
    //                 res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
    //                     this.negativeList.push(item.sampleName)
    //                 })
    //                 res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
    //                     this.positiveList.push(item.sampleName)
    //                 })

    //                 this.infoList = res.data.opBloodJHReportSampleVo.ktyList
    //                 this.qmhx()
    //             })
    //         } else {
    //             Reportsl(newAr1).then(res => {
    //                 console.log(res, '888888888888')
    //                 this.fsEmail = res.data
    //                 this.dx = res

    //                 this.feedReportBase = res.data
    //                 this.dx = res.data.opBloodJHReportSampleVo
    //                 res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
    //                     this.negativeList.push(item.sampleName)
    //                 })
    //                 res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
    //                     this.positiveList.push(item.sampleName)
    //                 })

    //                 this.infoList = res.data.opBloodJHReportSampleVo.shList
    //                 this.calcShowCols();

    //             });
    //         }

    //         this.$nextTick(() => {
    //             if (this.dict && this.dict.type) {
    //                 this.generateDynamicCols();
    //             } else {
    //                 this.$watch('dict.type', (newVal) => {
    //                     if (newVal) {
    //                         this.generateDynamicCols();
    //                     }
    //                 }, { immediate: true });
    //             }
    //         });
    //     }
    // },
    mounted() {
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

        // 统一处理：等待字典加载完成后再生成动态列和加载数据
        this.$nextTick(() => {
            // 检查字典是否已加载
            const checkAndLoad = () => {
                if (this.dict && this.dict.type && this.dict.type.biochemistry_item_type) {
                    // 字典已加载，生成动态列
                    this.generateDynamicCols();
                    // 然后加载数据
                    this.loadReportData(newAr, newAr1);
                }
            };

            // 立即检查一次
            checkAndLoad();

            // 如果字典还未加载，监听字典变化
            if (!this.dict || !this.dict.type || !this.dict.type.biochemistry_item_type) {
                const unwatch = this.$watch(
                    () => this.dict && this.dict.type && this.dict.type.biochemistry_item_type,
                    (newVal) => {
                        if (newVal) {
                            this.generateDynamicCols();
                            this.loadReportData(newAr, newAr1);
                            unwatch(); // 取消监听
                        }
                    }
                );
            }
        });
    },
    computed: {
        pagedList() {
            const pages = [];

            /* ---------- 第一页 27 条 ---------- */
            pages.push(this.infoList.slice(0, 22));

            /* ---------- 剩余 30 条/页 ---------- */
            const left = this.infoList.slice(22);
            for (let i = 0; i < left.length; i += 31) {
                pages.push(left.slice(i, i + 31));
            }
            return pages;
        }
    },
    methods: {
        /** 加载报告数据 */
        loadReportData(newAr, newAr1) {
            if (this.status == 0) {
                console.log(newAr, '222222222222')
                Reportsl(newAr).then(res => {
                    console.log(res, '888888888888')
                    this.dx = res
                    this.feedReportBase = res.data
                    this.aisShow = res.data.aisShow
                    this.oisShow = res.data.oisShow
                    this.dx = res.data.opBloodJHReportSampleVo
                    res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                        this.negativeList.push(item.sampleName)
                    })
                    res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                        this.positiveList.push(item.sampleName)
                    })
                    this.infoList = res.data.opBloodJHReportSampleVo.shList
                    this.calcShowCols();
                });
            } else {
                if (this.$route.query.isShowB) {
                    console.log('33333')
                    ckbg(this.$route.query.reportId).then((res) => {
                        console.log(res, '88888888888888888')
                        this.feedReportBase = res.data
                        this.aisShow = res.data.aisShow
                        this.oisShow = res.data.oisShow
                        this.dx = res.data.opBloodJHReportSampleVo
                        res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                            this.negativeList.push(item.sampleName)
                        })
                        res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                            this.positiveList.push(item.sampleName)
                        })
                        this.infoList = res.data.opBloodJHReportSampleVo.ktyList
                        this.calcShowCols();
                        this.qmhx()
                    })
                } else {
                    Reportsl(newAr1).then(res => {
                        console.log(res, '888888888888')
                        this.fsEmail = res.data
                        this.dx = res
                        this.feedReportBase = res.data
                        this.dx = res.data.opBloodJHReportSampleVo
                        res.data.opBloodJHReportSampleVo.yinList.forEach((item) => {
                            this.negativeList.push(item.sampleName)
                        })
                        res.data.opBloodJHReportSampleVo.yangList.forEach((item) => {
                            this.positiveList.push(item.sampleName)
                        })
                        this.infoList = res.data.opBloodJHReportSampleVo.shList
                        this.calcShowCols();
                    });
                }
            }
        },
        /** 根据字典生成dynamicCols数组 */
        /** 根据字典生成dynamicCols数组 */
        generateDynamicCols() {
            // ✅ 统一字段名称
            const keys = [
                'shZdb',    // 总蛋白
                'shTlz',    // 铜离子
                'shTielz',  // 铁离子 ← 注意这里
                'shXlz',    // 锌离子
                'shGysz',    // 甘油三酯
                'shQds',    // β-羟丁酸
                'shFzhx',   // 非酯化脂肪酸
                'shPpt',    // 葡萄糖 ← 注意这里
                'shXynsd',  // 血清尿素氮
                'shGczam',  // 谷草转氨酶
                'shGbzam',  // 谷丙转氨酶
                'shBdb',    // 白蛋白
                'shJxlsm', //碱性磷酸酶
                'shZg',     // 总钙
                'shLzg',    // 离子钙
                'shMlz',    // 镁离子
                'shWjl',    // 无机磷
                'shJlz',    // 钾离子
                'shNlz',    // 钠离子
                'shLlz',    // 氯离子
            ];

            // 获取三个字典数据
            const typeDict = this.dict.type.biochemistry_item_type || [];
            const unitDict = this.dict.type.biochemistry_item_unit || [];
            const rangeDict = this.dict.type.biochemistry_item_range || [];

            this.dynamicCols = keys.map(key => {
                const typeItem = typeDict.find(item => item.value === key);
                const unitItem = unitDict.find(item => item.value === key);
                const rangeItem = rangeDict.find(item => item.value === key);

                return {
                    key: key,
                    label: typeItem ? typeItem.label : this.getDefaultLabel(key),
                    unit: unitItem ? unitItem.label : this.getDefaultUnit(key),
                    ref: rangeItem ? rangeItem.label : this.getDefaultRef(key)
                };
            });

            console.log('生成的dynamicCols:', this.dynamicCols);

            if (this.infoList && this.infoList.length > 0) {
                this.calcShowCols();
            }
        },

        /** 默认标签 - 修正字段名 */
        getDefaultLabel(key) {
            const labelMap = {
                'shZdb': '总蛋白',
                'shBdb': '白蛋白',
                'shZg': '总钙',
                'shLzg': '离子钙',
                'shMlz': '镁离子',
                'shWjl': '无机磷',
                'shJlz': '钾离子',
                'shNlz': '钠离子',
                'shLlz': '氯离子',
                'shTlz': '铜离子',
                'shTielz': '铁离子',    // ✅ 修正：shT1lz → shTielz
                'shXlz': '锌离子',
                'shGysz': '谷氨酸脱氢酶',
                'shQds': 'β-羟丁酸',
                'shFzhx': '非酯化脂肪酸',
                'shPpt': '碱性磷酸酶',  // ✅ 修正：shPtt → shPpt
                'shXynsd': '血清尿素氮',
                'shGczam': '谷草转氨酶',
                'shGbzam': '谷丙转氨酶',
                'shJxlsm': '肌酸激酶'
            };
            return labelMap[key] || key;
        },

        /** 默认单位 - 修正字段名 */
        getDefaultUnit(key) {
            const unitMap = {
                'shZdb': 'g/L',
                'shBdb': 'g/L',
                'shZg': 'mmol/L',
                'shLzg': 'mmol/L',
                'shMlz': 'mmol/L',
                'shWjl': 'mmol/L',
                'shJlz': 'mmol/L',
                'shNlz': 'mmol/L',
                'shLlz': 'mmol/L',
                'shTlz': 'μmol/L',
                'shTielz': 'μmol/L',   // ✅ 修正
                'shXlz': 'μmol/L',
                'shGysz': 'U/L',
                'shQds': 'mmol/L',
                'shFzhx': 'mmol/L',
                'shPpt': 'U/L',        // ✅ 修正
                'shXynsd': 'mmol/L',
                'shGczam': 'U/L',
                'shGbzam': 'U/L',
                'shJxlsm': 'U/L'
            };
            return unitMap[key] || '';
        },

        /** 默认参考范围 - 修正字段名 */
        getDefaultRef(key) {
            const refMap = {
                'shZdb': '60-80',
                'shBdb': '25-40',
                'shZg': '2.1-2.8',
                'shLzg': '1.0-1.3',
                'shMlz': '0.75-1.0',
                'shWjl': '1.3-2.6',
                'shJlz': '3.5-5.8',
                'shNlz': '134-145',
                'shLlz': '90-110',
                'shTlz': '9-20',
                'shTielz': '14-36',    // ✅ 修正
                'shXlz': '12-24',
                'shGysz': '0-10',
                'shQds': '产前＜0.8\\n产后＜1.2',
                'shFzhx': '产前＜0.5\\n产后＜1.0',
                'shPpt': '0-150',      // ✅ 修正
                'shXynsd': '2.5-7.5',
                'shGczam': '45-110',
                'shGbzam': '6.9-35',
                'shJxlsm': '0-150'
            };
            return refMap[key] || '';
        },
        calcShowCols() {
            this.showCols = this.dynamicCols.filter(col =>
                this.infoList.some(item => item[col.key] != null && String(item[col.key]).trim() !== '')
            );
        },
        pdfbc() {
            const newReportData = {
                ...this.feedReportBase,
                opBloodJHReportSampleVo: this.dx,
                status: '1',
                // feedEntrustOrderSampleId: JSON.parse(this.$route.query.feedEntrustOrderSampleId),
                // // opJczxFeedReportBaseId: JSON.parse(this.$route.query.opJczxFeedReportBaseId)
                opJczxBloodReportBaseId: this.opJczxBloodReportBaseId

            };
            Reportslbc(newReportData).then(res => {
                console.log(res, '111111111111111')
                this.opJczxBloodReportBaseId = res.msg
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
                    // this.SourText = res.data.feedReportBase.sampleSource
                    // this.noteText = res.data.feedReportBase.remark
                    // this.displayText = res.data.feedReportBase.conclusion
                    // this.feedReportBase = res.data.feedReportBase
                    // this.infoList = res.data.opJczxFeedReportInfoList
                    // this.isShow = true
                });

            })
        },
        pdfMtj() {
            const newReportData = {
                ...this.feedReportBase,
                opBloodJHReportSampleVo: this.dx,
                status: '2',
                // feedEntrustOrderSampleId: JSON.parse(this.$route.query.feedEntrustOrderSampleId),
                // // opJczxFeedReportBaseId: JSON.parse(this.$route.query.opJczxFeedReportBaseId)
                // opJczxFeedReportBaseId: this.opJczxFeedReportBaseId

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
                    // this.fsh = true

                } else {
                    this.$message({
                        message: '批准失败',
                        type: 'error'
                    });
                }
            })
            // setTimeout(()=>{
            //     window.close()
            // })

        },
        pdfbjz() {
            this.currentRejectAction = 'bjz'; // 标记为"批准不通过"
            this.returnReason = ''; // 清空上次输入
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.reasonInput.focus(); // 弹窗打开后自动聚焦
            });
        },
        /** 下载报告（修正提示文案bug） */
        handleDownload() {
            console.log('下载报告', this.feedReportBase);
            const newdx = {
                bloodEntrustOrderId: this.feedReportBase.bloodEntrustOrderId,
                entrustDeptName: this.feedReportBase.entrustDeptName,
                reportDate: this.feedReportBase.reportDate,

            }
            // console.log(newdx, '7')
            downloadXyReportsh(newdx).then(response => {
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
        /** 判断是否是最后一页 */
        isLastPage(pageIndex) {
            return pageIndex === this.pagedList.length - 1;
        },
        /** 导出单页 */
        pdfMap() {
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            var stamain = document.getElementsByClassName("sta-main");
            for (var i = 0; i < stamain.length; i++) {
                stamain[i].style.border = "0";
            }

            $(".sta-main").css({
                "margin-top": "0",
                "padding": "30px 40px"  // 保持内边距
            });
            $(".pdfdown").css("display", "none");
            $(".uedbtn").css("display", "none");

            var stalength = $(".sta-main").length;
            var mpddfcont = 0;

            // 横向 A4
            this.PDF = new jsPDF('l', 'pt', [841.89, 595.28]);


            this.getpdf(stalength, mpddfcont);

        },
        getpdf(stalength, mpddfcont) {
            // 横向 A4 尺寸 (单位: pt)
            var pdfWidth = 841.89;
            var pdfHeight = 595.28;

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

                // ========== 关键修改：按比例缩放 ==========
                // 计算宽度缩放比例
                var scaleX = pdfWidth / contentWidth;
                // 计算高度缩放比例
                var scaleY = pdfHeight / contentHeight;
                // 取较小的缩放比例，确保内容完全显示且不变形
                var scale = Math.min(scaleX, scaleY);

                // 计算实际图片尺寸
                var imgWidth = contentWidth * scale;
                var imgHeight = contentHeight * scale;

                // 计算居中偏移量
                var offsetX = (pdfWidth - imgWidth) / 2;
                var offsetY = (pdfHeight - imgHeight) / 2;

                console.log('canvas尺寸:', contentWidth, contentHeight);
                console.log('缩放后尺寸:', imgWidth, imgHeight);
                console.log('偏移量:', offsetX, offsetY);

                if (contentHeight != 0) {
                    // 使用计算后的尺寸和偏移量
                    this.PDF.addImage(pageData, "jpeg", offsetX, offsetY, imgWidth, imgHeight);
                }
                // ========== 关键修改结束 ==========
                if (mpddfcont == stalength - 1) {
                    $(".sta-main").css("margin-top", "10px", "padding", "10px 20px");
                    //this.PDF.save('生化检测报告' + ".pdf");
                    $(".pdfdown").css("display", "block");
                    $(".uedbtn").css("display", "block");

                    // 生成 Blob
                    const pdfBlob = this.PDF.output('blob');
                    console.log(pdfBlob, 'bolb')
                    const pdfFile = new File(
                        [pdfBlob],
                        "检测报告.pdf",
                        { type: "application/pdf" }
                    );

                    console.log(pdfFile, 'flie')
                    const formData = new FormData();
                    formData.append('file', pdfFile, '检测报告.pdf');
                    upload(formData).then((res) => {
                        console.log(res, '11112221111111')
                        const newA = {
                            pdfFileInfo: res.fileName,
                            opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,

                        }
                        savePdfzy(newA).then((res) => {
                            console.log(res, '111111111')
                            if (res.code == 200) {
                                this.$message({
                                    message: '上传文件成功',
                                    type: 'success'
                                });
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
                // 【新增】带上标题和内容
                title: this.title,
                content: this.content
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
        /** 导出单页 */
        pdfMapTrue() {
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;

            var stamain = document.getElementsByClassName("sta-main");
            for (var i = 0; i < stamain.length; i++) {
                stamain[i].style.border = "0";
            }

            $(".sta-main").css({
                "margin-top": "0",
                "padding": "30px 40px"  // 保持内边距
            });
            $(".pdfdown").css("display", "none");
            $(".uedbtn").css("display", "none");

            var stalength = $(".sta-main").length;
            var mpddfcont = 0;

            // 横向 A4
            this.PDF = new jsPDF('l', 'pt', [841.89, 595.28]);
            this.getpdfTrue(stalength, mpddfcont);
        },

        getpdfTrue(stalength, mpddfcont) {
            // 横向 A4 尺寸 (单位: pt)
            var pdfWidth = 841.89;
            var pdfHeight = 595.28;

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

                // ========== 关键修改：按比例缩放 ==========
                // 计算宽度缩放比例
                var scaleX = pdfWidth / contentWidth;
                // 计算高度缩放比例
                var scaleY = pdfHeight / contentHeight;
                // 取较小的缩放比例，确保内容完全显示且不变形
                var scale = Math.min(scaleX, scaleY);

                // 计算实际图片尺寸
                var imgWidth = contentWidth * scale;
                var imgHeight = contentHeight * scale;

                // 计算居中偏移量
                var offsetX = (pdfWidth - imgWidth) / 2;
                var offsetY = (pdfHeight - imgHeight) / 2;

                console.log('canvas尺寸:', contentWidth, contentHeight);
                console.log('缩放后尺寸:', imgWidth, imgHeight);
                console.log('偏移量:', offsetX, offsetY);

                if (contentHeight != 0) {
                    // 使用计算后的尺寸和偏移量
                    this.PDF.addImage(pageData, "jpeg", offsetX, offsetY, imgWidth, imgHeight);
                }
                // ========== 关键修改结束 ==========

                if (mpddfcont == stalength - 1) {
                    $(".sta-main").css("margin-top", "10px", "padding", "10px 20px");
                    this.PDF.save('生化检测报告' + ".pdf");
                    $(".pdfdown").css("display", "block");
                    $(".uedbtn").css("display", "block");
                    return;
                }
                mpddfcont++;

                if (mpddfcont < stalength) {
                    console.log(mpddfcont);
                    this.PDF.addPage([pdfWidth, pdfHeight], 'l');
                    this.getpdfTrue(stalength, mpddfcont);
                }
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
                    status: '1', // 按照源文件逻辑，退回到状态 '1'
                    opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
                    returnReason: this.returnReason
                };
                zzhhxbc(newReportData).then(res => {
                    if (res.code == 200) {
                        this.$message.success('不通过成功');
                        this.handleDialogClose();
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不通过失败');
                    }
                });

            } else if (this.currentRejectAction === 'bjz') {
                // 批准不通过
                const newReportData = {
                    status: '1', // 重点：按照源文件(reportgensl)逻辑，批准不通过也退回到状态 '1'
                    opJczxBloodReportBaseId: this.opJczxBloodReportBaseId,
                    returnReason: this.returnReason
                };
                jzcommit(newReportData).then(res => {
                    if (res.code == 200) {
                        this.$message.success('不批准成功');
                        this.handleDialogClose();
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不批准失败');
                    }
                });
            }
        },









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
.sample-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.sample-table td {
    width: 8.33%;
    /* 100% ÷ 12 = 8.33% */
    text-align: center;
    border: 1px solid #000;
    padding: 4px;
    word-wrap: break-word;
}

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

/* 打印专用样式 */
@media print {
    @page {
        /* 设置为横向，边距设小一点，避免浏览器默认边距叠加导致换行 */
        size: A4 landscape;
        margin: 5mm;
    }

    body,
    html,
    #app,
    .app-container {
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        background-color: #fff;
        overflow: visible !important;
    }

    /* 隐藏所有不需要打印的按钮和遮罩 */
    .pdfdown,
    .el-button,
    .el-dialog__wrapper,
    .v-modal,
    .elevator,
    .uedbtn {
        display: none !important;
    }

    /* 核心修复：重置容器样式 */
    .sta-main {
        width: 100% !important;
        /* ★★★ 关键：不要用 1120px，否则会横向溢出多一张纸 */
        max-width: 100% !important;
        margin: 0 !important;
        /* ★★★ 关键：去除外边距 */
        padding: 0 !important;
        /* 交给 PageStyle 处理内边距 */
        border: none !important;
        box-shadow: none !important;
        min-height: auto !important;
        /* 去除最小高度限制 */

        /* 强制分页设置 */
        page-break-after: always;
        page-break-inside: avoid;
    }

    /* 最后一个元素不要分页，防止最后多出一张白纸 */
    .sta-main:last-child {
        page-break-after: auto !important;
        margin-bottom: 0 !important;
    }

    /* 调整内部样式适应打印 */
    .PageStyle {
        width: 100% !important;
        padding: 10px 20px !important;
        /* 适当减少内边距 */
        box-sizing: border-box;
    }

    /* 确保表格不被切断 */
    table {
        page-break-inside: auto;
    }

    tr {
        page-break-inside: avoid;
        page-break-after: auto;
    }
}

/* 横向页面容器 - 关键修改 */
.sta-main {
    width: 1120px;
    /* 横向宽度 */
    min-height: 700px;
    /* 横向高度 */
    margin: 10px auto;
    background: #fff;
    box-sizing: border-box;
}

.PageStyle {
    width: 100%;
    height: 100%;
    padding: 30px 40px;
    box-sizing: border-box;
}

.report-container {
    width: 100%;
}

.sample-table {
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

.sample-table td {
    text-align: center;
    border: 1px solid #000;
    padding: 4px 2px;
    word-wrap: break-word;
    font-size: 11px;
}
</style>
