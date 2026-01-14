<template>
    <div class="app-container">
        <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px;" @click="HDPada">返回检测任务</el-button>
        <el-button type="success" icon="el-icon-back" @click="HDPadb">返回样品化验</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addSample">增加样品</el-button>
        <div style="text-align: center;font-size: 20px;">{{ Details.modelNo }} {{ Details.modelName }}</div><br>

        <div class="stickytable">
            <div class="sticky-table">
                <table cellpadding="0" cellspacing="0" width="100%" id="exportTable" style="text-align: center;">
                    <tbody>
                        <tr>
                            <td>检测日期</td>
                            <td>试剂盒批号</td>
                            <td>主要仪器名称</td>
                            <td>仪器编号</td>
                            <td>检测地点</td>
                            <td>甲醇试剂批号</td>
                            <td>60%甲醇/水配制批次</td>
                            <td>检测依据</td>
                            <td colspan="2">环境温度/湿度(℃%)</td>
                        </tr>
                        <tr>
                            <td rowspan="2">
                                <el-date-picker v-model="Details.testDate" type="date" class="custom-padding"
                                    :editable="false" :readonly="Details.status == '2' || isJCRY">
                                </el-date-picker>
                            </td>
                            <td rowspan="2"><el-input v-model="Details.sjhph"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNameOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNoOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="testLocationOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td rowspan="2"><el-input v-model="Details.xxryph"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td rowspan="2"><el-input v-model="Details.xxspzpc"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td rowspan="2"><el-input v-model="Details.testBasis"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td rowspan="2" colspan="2"><el-input v-model="Details.temperature" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>/<el-input
                                    v-model="Details.humidity" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        </tr>
                        <tr>
                            <td><el-input v-model="instrumentNameTwo" updateDetails
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNoTwo" updateDetails
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="testLocationTwo" updateDetails
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        </tr>
                        <tr>
                            <td colspan="10" style="padding: 0; border: 0;">
                                <table cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr>
                                        <td style="width: 16.65%;">DON标准液浓度（mg/kg）</td>
                                        <td style="width: 13.33%;">0</td>
                                        <td style="width: 13.33%;">0.2</td>
                                        <td style="width: 13.33%;">0.7</td>
                                        <td style="width: 13.33%;">2.1</td>
                                        <td style="width: 13.33%;">7.0</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" style="padding: 0; border: 0;">
                                <table cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr>
                                        <td style="width: 16.65%;">吸光度A值(450-620nm)</td>
                                        <td style="width: 13.33%;"><el-input v-model="xgdOne"
                                                :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                        <td style="width: 13.33%;"><el-input v-model="xgdTwo"
                                                :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                        <td style="width: 13.33%;"><el-input v-model="xgdThree"
                                                :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                        <td style="width: 13.33%;"><el-input v-model="xgdFour"
                                                :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                        <td style="width: 13.33%;"><el-input v-model="xgdFive"
                                                :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td colspan="2">标准曲线相关系数</td>
                            <td colspan="8" class="regression-row">
                                R=<el-input v-model="Details.bzqxfcjxgxs" style="width: 600px;"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="10" style="padding:0;border:0">
                                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                    <tbody>
                                        <tr v-if="formulaTipsList">
                                            <td colspan="12" style="border:0;padding:0;text-align:left">
                                                <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList"
                                                    type="warning" :closable="false" show-icon>
                                                </el-alert>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>管号</td>
                                            <td colspan="2">样品编号</td>
                                            <td>样品名称</td>
                                            <td>试样质量 m（g）</td>
                                            <td>试样吸光度A值（450-620mm）</td>
                                            <td>待测液中DON含量C（μg/ml）</td>
                                            <td colspan="2">样品中DON含量（mg/kg）</td>
                                            <td colspan="2">鲜样中DON含量（mg/kg）</td>
                                            <td>操作</td>
                                        </tr>

                                        <template v-for="(item, index) in Details.infoList">
                                            <tr :key="`row-${index}`" class="sample-split"
                                                :class="{ 'first-sample': index === 0 }">
                                                <td><el-input v-model="item.clmh"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td colspan="2"><el-input v-model="item.sampleNo"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td><el-input v-model="item.sampleName"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.m" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'm')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.syxgdaz" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'syxgdaz')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.c" inputmode="decimal"
                                                        @input="bringCtoSample(item)"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td colspan="2">
                                                    <el-input v-model="item.ypzxxhl"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td colspan="2">
                                                    <el-input v-model="item.xyzhl"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                                        @click="deleteSample(index)" v-if="isRec">删除</el-button>
                                                    <template v-if="isShow">
                                                        <el-button type="warning" icon="el-icon-refresh" size="mini"
                                                            @click="retestSample(index)"
                                                            v-if="item.isReset == 0 || item.isReset == '0'">复检</el-button>

                                                        <span v-if="item.isReset == 1 || item.isReset == '1'"
                                                            style="color: #E6A23C; font-size: 12px;">
                                                            已申请复检
                                                        </span>
                                                    </template>
                                                </td>
                                            </tr>
                                        </template>

                                        <tr>
                                            <td colspan="2">计算</td>
                                            <td colspan="10">
                                                <div class="formula-container">
                                                    DON含量(mg/kg) =
                                                    <span class="math-formula">
                                                        <span class="math-fraction">
                                                            <span class="math-numerator">
                                                                C
                                                            </span>
                                                            <span class="math-fraction-line"></span>
                                                            <span class="math-denominator">
                                                                25
                                                            </span>
                                                        </span>
                                                    </span>
                                                    ×
                                                    <span class="math-formula">
                                                        <span class="math-fraction">
                                                            <span class="math-numerator">
                                                                V₁
                                                            </span>
                                                            <span class="math-fraction-line"></span>
                                                            <span class="math-denominator">
                                                                m
                                                            </span>
                                                        </span>
                                                    </span>
                                                    × D
                                                    （加入提取液体积V₁=25mL；样品溶液稀释倍数D=5；标准品上机时实际稀释了25倍）
                                                    检出限&lt;0.2(mg/kg)
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer" style="text-align:left;padding:5px;">
                <el-row>
                    <el-col :span="10" :offset="2">
                        <span>检测人:</span>
                        <img v-if="signTypes.检测人" :src="signTypes.检测人"
                            style="width:300px;height:150px;vertical-align:top">
                        <el-button @click="qzclick('检测人')"
                            v-if="isRec || (isShow && (Details.status == '1' || Details.status == '6'))">签字</el-button>
                    </el-col>
                    <el-col :span="10" :offset="2" v-if="isShow">
                        <span>核对人:</span>
                        <img v-if="signTypes.核对人" :src="signTypes.核对人"
                            style="width:300px;height:150px;vertical-align:top">
                        <el-button @click="qzclick('核对人')" v-if="Details.status == '2' && !isJCRY">签字</el-button>
                    </el-col>
                </el-row>
            </div>

            <div class="fixed-bottom">
                <div style="margin-top: 20px; text-align: center;">
                    <el-button type="primary" icon="el-icon-check" @click="saveForm"
                        v-if="isRec || (isShow && (Details.status == '1' || Details.status == '6'))">保存</el-button>
                    <el-button type="success" icon="el-icon-upload2" @click="submitTest"
                        v-if="isRec || (isShow && (Details.status == '1' || Details.status == '6'))">提交</el-button>
                    <el-button type="success" icon="el-icon-check" @click="submitCheck"
                        v-if="isShow && Details.status == '2' && !isJCRY">校对</el-button>
                    <el-button type="danger" icon="el-icon-refresh-left" @click="handleBack"
                        v-if="isShow && Details.status == '2' && !isJCRY">退回</el-button>
                </div>
            </div>
        </div>

        <el-dialog title="选择检测样品" :visible.sync="testItemDialogVisible" width="80%">
            <el-table ref="testItemTable" :data="testItemList" height="400"
                @selection-change="handleTestItemSelectionChange" row-key="sampleNo">
                <el-table-column type="selection" align="center" :selectable="checkSelectable"
                    reserve-selection></el-table-column>
                <el-table-column prop="sampleNo" label="样品编码" align="center"></el-table-column>
                <el-table-column prop="sampleName" label="样品名称" align="center"></el-table-column>
            </el-table>

            <div class="pagination-container">
                <el-pagination small :current-page="testItemQuery.pageNum" :page-sizes="[10, 20, 30, 50]"
                    :page-size="testItemQuery.pageSize" layout="total, sizes, prev, pager, next" :total="testItemTotal"
                    @size-change="handleTestItemSizeChange" @current-change="handleTestItemCurrentChange">
                </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="testItemDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmTestItems">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="签字板" :visible.sync="videoif" width="80%">
            <electronic @closeCanvas="closeCanvas" :showCanvas="videoif" @savecanva="savecanva"
                :SignatureImg="SignatureImg" :typename="currentSignType" v-if="videoif"
                @signature-done="onSignatureDone" />
        </el-dialog>
    </div>
</template>

<script>
import { downloadFile } from "@/api/common/common";
// *** 逻辑修改：导入 retest 和 testSubmit ***
import { feedwatertask, feedwatertaskUp, listTask, saveCheck, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue';
import csfhyMixin from "@/views/Feedproject/csfhyMixin";

import Decimal from 'decimal.js'

export default {
    name: "JJ53", // (name 仍然是 JJ53, 但文件名是 JJ51, Vue 内部以 name 为准, 但不影响)
    mixins: [csfhyMixin],
    components: {
        "electronic": electronic,
    },
    data() {
        return {
            isJCRY: false,
            Details: {},
            isPad: true,
            isRec: true,
            isShow: true,
            testItemDialogVisible: false,
            testItemList: [],
            testItemQuery: {
                pageNum: 1,
                pageSize: 10,
                keyword: '',
                // isTest: '0',
                itemId: ''
            },
            testItemTotal: 0,
            signtype: "",
            videoif: false,
            SignatureImg: "",

            // 仪器和检测地点数据
            instrumentNameOne: '',
            instrumentNameTwo: '',
            instrumentNoOne: '',
            instrumentNoTwo: '',
            testLocationOne: '',
            testLocationTwo: '',

            // 吸光度数据
            xgdOne: '',
            xgdTwo: '',
            xgdThree: '',
            xgdFour: '',
            xgdFive: '',

            signatureImage: '',
            signTypes: {
                检测人: '',
                核对人: ''
            },
            currentSignType: '',
            testUserSignature: '',
            checkUserSignature: '',
            // *** 逻辑修改：新增负数校验节流阀 ***
            lastWarningTime: 0,
            warningThrottleMs: 2000
        };
    },
    created() {
        // 初始化数据
    },
    computed: {
        // 返回空字段的中文名，用顿号连接；若无空字段返回空串
        formulaTipsList() {
            const tips = [];

            /* ---------- 2. 逐行字段 ---------- */
            (this.Details.infoList || []).forEach((row, idx) => {
                const rowEmpty = [];
                if (!row.c) rowEmpty.push('待测液中DON含量');
                if (!row.m) rowEmpty.push('试样质量 m');

                if (rowEmpty.length) {
                    tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
                }
            });

            /* ---------- 3. 返回 ---------- */
            return tips.length ? tips.join('；') : '';
        },
    },
    mounted() {
        const fmt = d => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const dd = String(d.getDate()).padStart(2, '0')
            return `${y}-${m}-${dd}`
        }
        const today = fmt(new Date())

        if (this.$route.params.taskInfo) {
            this.dqID()
            const task = this.$route.params.taskInfo || {}
            this.Details = { ...task, infoList: [] }
            const jcList = this.$route.params.jcList || []
            this.Details.infoList = jcList
            this.Details.itemId = this.$route.params.jcList[0].IDD
            this.isShow = false
            this.isRec = true
            this.$set(this.Details, 'testDate', today)
        } else if (this.$route.params.SjtaskInfo) {
            this.dqIDHD()
            this.Details = this.$route.params.SjtaskInfo
            this.isShow = true
            this.isRec = false
            if (this.$route.params.isJCRY) {
                this.isJCRY = this.$route.params.isJCRY
                console.log('检测人员查看详情', this.isJCRY)
            }
        } else {
            this.$message.error('未获取到任务信息，请返回任务列表重新进入！')
            this.$router.push('/taskList')
            return
        }
        // 确保所有样品数据都有必要的字段
        if (this.Details.infoList) {
            this.Details.infoList.forEach(item => {
                if (!item.hasOwnProperty('clmh')) this.$set(item, 'clmh', '');
                if (!item.hasOwnProperty('sampleNo')) this.$set(item, 'sampleNo', '');
                if (!item.hasOwnProperty('sampleName')) this.$set(item, 'sampleName', '');
                if (!item.hasOwnProperty('m')) this.$set(item, 'm', '');
                if (!item.hasOwnProperty('syxgdaz')) this.$set(item, 'syxgdaz', '');
                if (!item.hasOwnProperty('c')) this.$set(item, 'c', '');
                if (!item.hasOwnProperty('ypzxxhl')) this.$set(item, 'ypzxxhl', '');
                if (!item.hasOwnProperty('xyzhl')) this.$set(item, 'xyzhl', '');
            });
        }
        // 确保所有样品数据都有必要的字段

        console.log('传入参数:', this.$route.params);
        this.isPadPc()
        this.initData();
        console.log('精度参数:', {
            decimalPlaces: this.Details.decimalPlaces,
            significantDigits: this.Details.significantDigits
        });

        // 直接调用
        this.loadSignatureImages();
        // 在初始化后查询初水分数据并计算鲜样含量
        // this.$nextTick(() => {
        //     setTimeout(() => {
        //         this.loadCsfhyDataAndCalculate();
        //     }, 100);
        // });
    },
    beforeDestroy() {
        // 清理 Blob URL 防止内存泄漏
        if (this.signTypes.检测人 && this.signTypes.检测人.startsWith('blob:')) {
            URL.revokeObjectURL(this.signTypes.检测人);
        }
        if (this.signTypes.核对人 && this.signTypes.核对人.startsWith('blob:')) {
            URL.revokeObjectURL(this.signTypes.核对人);
        }
    },
    methods: {
        bringCtoSample(item) {
            this.$set(item, 'ypzxxhl', item.c);
        },
        dqID() {
            usersign().then(res => {
                if (!this.isRev) {
                    console.log('检测人')
                    this.testUserSignature = res.data.sign;
                    downloadFile(this.testUserSignature).then((res) => {
                        this.signTypes.检测人 = URL.createObjectURL(res);
                    })
                }
            });
        },
        dqIDHD() {
            usersign().then(res => {
                if (this.Details.status == '2' && !this.isJCRY) {
                    console.log('核对人')
                    this.checkUserSignature = res.data.sign;
                    downloadFile(this.checkUserSignature).then((res) => {
                        this.signTypes.核对人 = URL.createObjectURL(res);
                    })
                }
            });
        },
        // *** 逻辑修改：必填校验 ***
        /* 通用：收集所有空字段 */
        validateEmpty() {
            const empty = [];

            /* ---- 逐行样品字段 ---- */
            (this.Details.infoList || []).forEach((row, idx) => {
                if (!row.c) empty.push(`第${idx + 1}行待测液中DON含量`);
                if (!row.m) empty.push(`第${idx + 1}行试样质量 m`);
            });

            return empty; // 返回空字段数组
        },
        /** 通用平板检测 */
        isPADDevice() {
            const userAgent = navigator.userAgent.toLowerCase();
            const isiPad = /ipad/.test(userAgent);
            const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
            const isWindowsTablet = /windows/.test(userAgent) && /touch/.test(userAgent);

            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const isTabletSize = (screenWidth >= 768 && screenWidth <= 1024) ||
                (screenHeight >= 768 && screenHeight <= 1024);

            return isiPad || isAndroidTablet || isWindowsTablet || isTabletSize;
        },
        /** 专门检测华为平板 */
        isHuaweiPad() {
            const userAgent = navigator.userAgent.toLowerCase();

            // 华为平板特征检测
            const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent);
            const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

            // 屏幕尺寸检测（华为平板典型尺寸）
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
                (screenHeight >= 768 && screenHeight <= 1600);

            // 华为平板特有特征
            const hasEMUI = /emui/.test(userAgent);
            const isHuaweiPad = (isHuawei && isAndroidTablet) ||
                (isHuawei && isHuaweiTabletSize) ||
                (hasEMUI && isAndroidTablet);

            return isHuaweiPad;
        },
        isPadPc() {
            // 使用若依的设备检测
            const device = this.$store.state.app.device;
            // 检测是否为华为平板
            if (this.isHuaweiPad()) {
                console.log('华为')
                this.isPad = true
            } else if (this.isPADDevice()) {
                console.log('Pad')
                this.isPad = true
            } else {
                console.log('PC')
                this.isPad = false
            }
        },
        HDPada() {
            this.$router.push('feedTaskPad')
        },
        HDPadb() {
            this.$router.push('jczxFeedResultBasePad')
        },
        initData() {
            // 初始化仪器数据
            const Name = (this.Details.instrumentName || '').split(',');
            this.instrumentNameOne = Name[0] || '';
            this.instrumentNameTwo = Name[1] || '';

            const No = (this.Details.instrumentNo || '').split(',');
            this.instrumentNoOne = No[0] || '';
            this.instrumentNoTwo = No[1] || '';

            const Location = (this.Details.testLocation || '').split(',');
            this.testLocationOne = Location[0] || '';
            this.testLocationTwo = Location[1] || '';

            // 初始化吸光度数据
            const xgdValues = (this.Details.xgd || '').split(',');
            this.xgdOne = xgdValues[0] || '';
            this.xgdTwo = xgdValues[1] || '';
            this.xgdThree = xgdValues[2] || '';
            this.xgdFour = xgdValues[3] || '';
            this.xgdFive = xgdValues[4] || '';
        },
        updateDetails() {
            this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
            this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
            this.Details.testLocation = `${this.testLocationOne},${this.testLocationTwo}`;
            this.Details.xgd = `${this.xgdOne},${this.xgdTwo},${this.xgdThree},${this.xgdFour},${this.xgdFive}`;
        },
        onNumberInput(val, row, key) {
            // 过滤掉除数字、小数点、负号以外的字符
            row[key] = val.replace(/[^-0-9.]/g, '')
                // 负号只能出现在最前面
                .replace(/(?!^)-/g, '')
                // 多个小数点只保留第一个
                .replace(/(\..*)\./g, '$1')

            // 输入完成后自动触发计算
            this.$nextTick(() => {
                this.updateDONValues(row);
            });
        },

        // 计算DON含量的方法
        computeDON(item) {
            const requiredValues = [item.c, item.m];
            if (!this.hasRequiredValues(requiredValues)) {
                this.$set(item, 'ypzxxhl', ''); // 清空
                return '';
            }

            try {
                const C = new Decimal(item.c);        // 待测液中DON含量 (ng/mL)
                const m = new Decimal(item.m);        // 试样质量 (g)

                // 检查分母是否为0
                if (m.equals(0)) {
                    this.$set(item, 'ypzxxhl', '0');
                    return '0';
                }

                // 计算公式: (C / 25) × (V₁ / m) × D
                // 其中 V₁ = 25mL, D = 5
                const V1 = new Decimal(25);
                const D = new Decimal(5);

                // 计算公式: (C / 25) × (25 / m) × 5 = (C × 5) / m
                const numerator = C.times(D);
                const result = numerator.dividedBy(m);

                const formattedResult = this.formatPrecision(result);

                // *** 逻辑修改：新增负数校验 ***
                if (new Decimal(formattedResult).lessThan(0)) {
                    const now = Date.now();
                    if (now - this.lastWarningTime > this.warningThrottleMs) {
                        this.$message.warning('计算结果为负数，请检查输入数据是否正确');
                        this.lastWarningTime = now;
                    }
                }

                // 检出限处理：(JJ51 检出限 <0.2)
                const finalResult = new Decimal(formattedResult).lessThan(0.2) ? '<0.2' : formattedResult;

                // 保存计算结果到字段
                this.$set(item, 'ypzxxhl', finalResult);
                return finalResult;
            } catch (error) {
                console.error('计算DON含量错误:', error);
                this.$set(item, 'ypzxxhl', '');
                return '';
            }
        },
        csfhy() {
            this.csfhyMixinHandler();
        },
        loadCsfhyDataAndCalculate() {
            this.loadCsfhyDataAndCalculateMixin();
        },
        calculateFreshSampleForItem(item) {
            // this.calculateFreshSampleForItemMixin(item);
            // 1. 检查 JJ53 的主要计算结果 ypzxxhl 是否已存在
            const primaryValue = item.ypzxxhl;

            if (primaryValue === null || primaryValue === undefined || primaryValue === '') {
                // this.$set(item, 'xyzhl', '');
                return;
            }

            let csfValue = null;

            // 2. 查找初水分数据 (采用 Mixin 的查找逻辑)
            if (this.cachedCsfhyData && this.cachedCsfhyData.infoList) {
                const csfItem = this.cachedCsfhyData.infoList.find(csf =>
                    // 使用样品 ID 或样品编号进行匹配
                    (csf.entrustOrderSampleId && csf.entrustOrderSampleId === item.entrustOrderSampleId) ||
                    (csf.sampleNo && csf.sampleNo === item.sampleNo)
                );

                if (csfItem && (csfItem.csf || csfItem.csf === 0)) {
                    csfValue = csfItem.csf;
                }
            }

            if (csfValue !== null) {
                // 3. 找到初水分，调用覆盖后的单个计算方法
                this.calculateSingleFreshSample(item, csfValue);
            } else {
                // this.$set(item, 'xyzhl', '');
            }
        },
        calculateSingleFreshSample(item, csfValue) {
            // *** 逻辑修改：JJ51/JJ53的鲜样计算依赖 ypzxxhl (样品中含量)，而非 average ***
            try {
                // 检查 ypzxxhl 是否有效
                if (item.ypzxxhl === null || item.ypzxxhl === undefined || item.ypzxxhl === '' || String(item.ypzxxhl).startsWith('<')) {
                    console.log(`样品 ${item.sampleNo} 含量无效或低于检出限 (${item.ypzxxhl})，跳过鲜样含量计算`);
                    // this.$set(item, 'xyzhl', ''); // 确保清空旧值
                    return;
                }
                const ypzxxhl = new Decimal(item.ypzxxhl); // average 应该是计算后的值
                const csf = new Decimal(csfValue);

                // 公式： 鲜样含量 = 样品中含量 * (100 - 初水分) / 100
                const result = ypzxxhl.times(new Decimal(100).minus(csf)).dividedBy(100);

                // 假设 formatPrecision 方法存在于主组件或另一个 Mixin 中
                const formattedResult = typeof this.formatPrecision === 'function'
                    ? this.formatPrecision(result)
                    : result.toFixed(2); // 默认保留两位小数

                console.log(`计算样品 ${item.sampleNo} 鲜样含量: ${ypzxxhl} * (100 - ${csf}) / 100 = ${formattedResult}`);
                // this.$set(item, 'xyzhl', formattedResult);
            } catch (error) {
                console.error(`计算样品 ${item.sampleNo} 的单个鲜样含量错误:`, error);
                // this.$set(item, 'xyzhl', ''); // 出错时清空
            }
        },
        calculateFreshSample(csfhyData) {
            this.calculateFreshSampleMixin(csfhyData);
        },
        updateDONValues(item) {
            // 重新计算DON含量并保存到对应字段
            // this.computeDON(item);
            // 计算鲜样含量
            //this.calculateFreshSampleForItem(item);
            // 1. 同步计算样品中 DON 含量 (computeDON 内部会设置 item.ypzxxhl)
            // this.computeDON(item);

            // 2. 【核心修复】：将鲜样含量计算移入 $nextTick
            this.$nextTick(() => {
                // 负数校验已在 computeDON 内部执行

                // 调用 Mixin 计算鲜样含量
                // this.calculateFreshSampleForItem(item);
            });

        },

        // 检测样品分页大小变化
        handleTestItemSizeChange(val) {
            this.testItemQuery.pageSize = val;
            this.getTestItemList();
        },
        // 检测样品当前页变化
        handleTestItemCurrentChange(val) {
            this.testItemQuery.pageNum = val;
            this.getTestItemList();
        },
        getTestItemList() {
            this.testItemQuery.testMethod = '2';
            this.testItemQuery.queryCsf = '0'; // 化学法
            this.testItemQuery.itemId = this.Details.itemId
            this.testItemQuery.entrustOrderType = '1'
            listTask(this.testItemQuery).then(res => {
                this.testItemList = res.rows
                this.testItemTotal = res.total;
                // 数据加载后，自动勾选已存在的样品 ---
                this.$nextTick(() => {
                    if (this.$refs.testItemTable && this.testItemList) {
                        this.testItemList.forEach(row => {
                            // 检查当前行是否已在详情列表中
                            const isExist = this.Details.infoList.some(item => item.sampleNo === row.sampleNo);
                            if (isExist) {
                                // toggleRowSelection(row, selected): 
                                // row: 当前行数据, true: 选中状态
                                this.$refs.testItemTable.toggleRowSelection(row, true);
                            }
                        });
                    }
                });
            });
        },
        // 处理检测样品选择变化
        handleTestItemSelectionChange(selection) {
            this.selectedTestItems = selection;
        },
        // 【新增】判断行是否可选（置灰逻辑）
        // 返回 true 表示可选，返回 false 表示不可选（置灰）
        checkSelectable(row) {
            // 如果当前样品编号已存在于化验单详情列表中，则不可选（置灰）
            // 使用 some 方法查找是否存在匹配的 sampleNo
            const isExist = this.Details.infoList.some(item => item.sampleNo === row.sampleNo);
            return !isExist;
        },
        confirmTestItems() {
            this.selectedTestItems.forEach(item => {
                // ---再次校验，只添加新样品 ---
                const isExist = this.Details.infoList.some(existing => existing.sampleNo === item.sampleNo);
                // 只有当样品不存在时，才推入数组
                if (!isExist) {
                    const newSample = {
                        "entrustOrderItemId": item.entrustOrderItemId,
                        "entrustOrderSampleId": item.entrustOrderSampleId,
                        "sampleNo": item.sampleNo,
                        "sampleName": item.sampleName,
                        "clmh": "",
                        "m": "",
                        "syxgdaz": "",
                        "c": "",
                        "ypzxxhl": "",
                        "xyzhl": ""
                    };
                    this.Details.infoList.push(newSample);
                }
            });
            this.testItemDialogVisible = false;
        },
        // 增加样品
        addSample() {
            this.getTestItemList()
            this.testItemDialogVisible = true
        },

        // 删除样品
        deleteSample(index) {
            this.$confirm('确定要删除这个样品吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.Details.infoList.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },

        qzclick(type) {
            this.currentSignType = type
            this.videoif = true
        },
        onSignatureDone({ type, data, fileId }) {
            this.signTypes[type] = data;

            // 根据签名类型保存fileId
            if (fileId) {
                if (type === '检测人') {
                    this.testUserSignature = fileId;
                    console.log('检测人签名文件ID:', fileId);
                } else if (type === '核对人') {
                    this.checkUserSignature = fileId;
                    console.log('核对人签名文件ID:', fileId);
                }
            }
        },

        // 关闭
        closeCanvas(val) {
            this.videoif = val
        },
        // 保存
        savecanva(val) {
            var imgUrl = ""
            var that = this
            console.log(val.indexOf("http://"))
            if (val.indexOf("data:image/png;base64,") == 0) {
                var file = this.base.getFileFromBase64(val) // 得到File对象
                console.log(file)
                imgUrl = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file) // imgUrl图片网络路径	
            } else {
                imgUrl = val
            }
            const data = {
                path: imgUrl
            }
        },
        // *** 逻辑修改：saveForm 调用 submitForm(true) ***
        saveForm() {
            this.submitForm(true); // true = prevent navigation
        },

        // *** 逻辑修改：submitForm 改造 ***
        async submitForm(preventNavigation = false) {

            // *** 逻辑修改：新增必填校验 ***
            //const empty = this.validateEmpty();
            // if (empty.length) {
            //     this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
            //     return { success: false, error: '数据未填完整' }; // 返回失败
            // }

            // 组装数据
            this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
            this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
            this.Details.testLocation = `${this.testLocationOne},${this.testLocationTwo}`;
            this.Details.xgd = `${this.xgdOne},${this.xgdTwo},${this.xgdThree},${this.xgdFour},${this.xgdFive}`;

            // 提交前重新计算所有值
            this.Details.infoList.forEach(item => {
                this.updateDONValues(item);
            });
            // 确保鲜样含量也重新计算
            if (this.cachedCsfhyData) {
                this.calculateFreshSample(this.cachedCsfhyData);
            }
            const submitData = {
                ...this.Details,
                testUserSignature: this.testUserSignature,
                checkUserSignature: this.checkUserSignature
            };

            if (!submitData.opJczxFeedResultBaseId && this.Details.opJczxFeedResultBaseId) {
                submitData.opJczxFeedResultBaseId = this.Details.opJczxFeedResultBaseId;
            }

            try {
                let result;
                if (this.isRec) {
                    this.Details.itemId = this.$route.params.jcList[0].IDD;
                    result = await feedwatertask(submitData);
                } else if (this.isShow) {
                    result = await feedwatertaskUp(submitData);
                }

                if (result.code == 200) {
                    // 更新本地数据，特别是 opJczxFeedResultBaseId
                    if (result.data && result.data.opJczxFeedResultBaseId) {
                        this.Details.opJczxFeedResultBaseId = result.data.opJczxFeedResultBaseId;
                    }
                    // *** 逻辑修改：首次保存后设置状态 ***
                    if (this.isRec) { // 只有在新增保存成功后
                        if (!this.Details.status) {
                            this.Details.status = '1';
                        }
                        this.isRec = false; // 切换为修改模式
                        this.isShow = true;
                    }
                    // 新增时 (isRec 刚被设为 false)，回写后端返回的 infoList 中的 ID 和 isReset 状态
                    if (this.isRec === false && // 检查是否是刚执行完 create
                        result.data &&
                        result.data.infoList &&
                        result.data.infoList.length > 0
                    ) {
                        // 校验返回的列表长度是否与本地一致
                        if (result.data.infoList.length === this.Details.infoList.length) {
                            console.log('回写新增的样品ID...');
                            result.data.infoList.forEach((returnedItem, index) => {
                                const localItem = this.Details.infoList[index];

                                // 1. 回写 opJczxFeedResultInfoId
                                if (returnedItem.opJczxFeedResultInfoId) {
                                    this.$set(localItem, 'opJczxFeedResultInfoId', returnedItem.opJczxFeedResultInfoId);
                                }

                                // 2. 回写 isReset 状态 (处理 null，将其视为 '0')
                                this.$set(localItem, 'isReset', returnedItem.isReset || '0');
                            });
                        } else {
                            console.warn('Returned infoList from server does not match local infoList length. IDs may not be set correctly.');
                        }
                    }
                    if (!preventNavigation) {
                        this.$message.success(this.isRec ? '已提交成功' : '已修改成功');
                        this.$router.push('/jczxFeedResultBasePad');
                    } else {
                        this.$message.success('保存成功');
                    }

                    // 返回保存结果，供其他方法使用
                    return { success: true, data: result.data };
                } else {
                    this.$message.error(result.msg || '保存失败');
                    return { success: false, error: result.msg };
                }
            } catch (error) {
                console.error('保存失败:', error);
                this.$message.error('保存失败');
                return { success: false, error: error.message };
            }
        },

        // 下载签名图片
        async loadSignatureImages() {
            console.log('开始加载签名图片...');
            console.log('testUserSignature:', this.Details.testUserSignature);
            console.log('checkUserSignature:', this.Details.checkUserSignature);
            try {
                // 下载检测人签名
                if (this.Details.testUserSignature) {
                    console.log('下载检测人签名:', this.Details.testUserSignature);
                    const response = await downloadFile(this.Details.testUserSignature);
                    console.log('检测人签名响应:', response);
                    const blob = new Blob([response], { type: 'image/png' });
                    this.signTypes.检测人 = URL.createObjectURL(blob);
                    this.testUserSignature = this.Details.testUserSignature; // 保存fileId
                }

                // 下载核对人签名
                if (this.Details.checkUserSignature) {
                    const response = await downloadFile(this.Details.checkUserSignature);
                    const blob = new Blob([response], { type: 'image/png' });
                    this.signTypes.核对人 = URL.createObjectURL(blob);
                    this.checkUserSignature = this.Details.checkUserSignature; // 保存fileId
                }
            } catch (error) {
                console.error('加载签名图片失败:', error);
            }
        },

        // *** 逻辑修改：submitCheck 改造 ***
        async submitCheck() {
            // 1. 先调用保存逻辑
            const saveResult = await this.submitForm(true);

            // 2. 检查保存是否成功
            if (!saveResult || !saveResult.success) {
                this.$message.error('数据保存失败，无法校对。请检查填写内容。');
                return;
            }

            // 3. 检查是否已上传核对人签名
            if (!this.checkUserSignature) {
                this.$message.error('请先进行核对人签字');
                return;
            }

            // 4. 检查是否有基础ID
            if (!this.Details.opJczxFeedResultBaseId) {
                this.$message.error('缺少必要参数');
                return;
            }

            try {
                const submitData = {
                    opJczxFeedResultBaseId: this.Details.opJczxFeedResultBaseId,
                    checkUserSignature: this.checkUserSignature
                };

                const res = await saveCheck(submitData);
                if (res.code === 200) {
                    this.$message.success('校对成功');
                    // 5. 校对成功后返回列表
                    this.$router.push('/jczxFeedResultBasePad');
                } else {
                    this.$message.error(res.msg || '校对失败');
                }
            } catch (error) {
                this.$message.error('校对失败');
            }
        },

        // 精度格式化方法
        formatPrecision(value) {
            if (value === null || value === undefined || value === '') {
                return '';
            }

            let num = new Decimal(value);

            // 优先使用小数位，其次使用有效数字位
            if (this.Details.decimalPlaces) {
                const decimalPlaces = parseInt(this.Details.decimalPlaces);
                return num.toDecimalPlaces(decimalPlaces).toString();
            } else if (this.Details.significantDigits) {
                const significantDigits = parseInt(this.Details.significantDigits);
                return num.toSignificantDigits(significantDigits).toString();
            } else {
                // 默认保留2位小数
                return num.toDecimalPlaces(2).toString();
            }
        },

        // 检查是否所有必需的值都已输入
        hasRequiredValues(values) {
            return values.every(val =>
                val !== null && val !== undefined && val !== '' && !isNaN(val)
            );
        },
        // 检查是否有样品已申请复检
        hasRetestSample() {
            const list = this.Details.infoList || [];
            return list.length > 0 && list.every(item => item.isReset === '1');
        },
        // *** 逻辑修改：新增 submitTest 方法 ***
        /** 提交检测 */
        async submitTest() {
            const empty = this.validateEmpty();
            if (empty.length) {
                this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
                return { success: false, error: '数据未填完整' }; // 返回失败
            }
            if (this.hasRetestSample()) {
                this.$message.error('已全部申请复检，化验单中不存在可提交数据。');
                return;
            }
            // 1. 校验检测人签名
            if (!this.testUserSignature) {
                this.$message.error('请先进行检测人签字后再提交');
                return;
            }

            // 2. 先调用保存逻辑（传入 true 阻止保存后的消息提示）
            const saveResult = await this.submitForm(true);

            // 3. 检查保存是否成功
            if (!saveResult || !saveResult.success) {
                this.$message.error('数据保存失败，无法提交。请检查填写内容。');
                return;
            }

            // 4. 获取 opJczxFeedResultBaseId
            const baseId = this.Details.opJczxFeedResultBaseId;
            if (!baseId) {
                this.$message.error('保存成功但未获取到任务ID，无法提交');
                return;
            }

            // 5. 调用提交接口
            try {
                const res = await testSubmit({ opJczxFeedResultBaseId: baseId });
                if (res.code === 200) {
                    this.$message.success('提交成功');
                    // 6. 提交成功后返回列表
                    this.$router.push('/jczxFeedResultBasePad');
                } else {
                    this.$message.error(res.msg || '提交失败');
                }
            } catch (error) {
                console.error('提交失败:', error);
                this.$message.error('提交接口调用失败');
            }
        },

        // *** 逻辑修改：新增 retestSample 方法 ***
        /** 复测样品 */
        retestSample(index) {
            // 1. 获取当前行的数据
            const item = this.Details.infoList[index];
            const infoId = item.opJczxFeedResultInfoId;

            // 2. 检查是否有ID (只有已保存的才能复检)
            if (!infoId) {
                this.$message.warning('此样品尚未保存，无法复检。');
                return;
            }

            // 3. 弹窗确认
            this.$confirm('确定要复检此样品吗？该样品化验数据将作废。', '复检确认', {
                confirmButtonText: '确定复检',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 4. 调用后端 retest 接口
                retest([infoId]).then(response => {
                    if (response.code === 200) {
                        this.$message.success('申请复检成功，请前往检测任务列表查看该样品');
                        this.$set(this.Details.infoList[index], 'isReset', '1');
                    } else {
                        this.$message.error(response.msg || '申请复检失败');
                    }
                }).catch(error => {
                    console.error("复检接口失败:", error);
                    this.$message.error('复检请求失败');
                });

            }).catch(() => {
                this.$message.info('已取消复检');
            });
        },
        // 【新增】整单退回
        handleBack() {
            this.$confirm('确定要退回当前化验单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (!this.Details.opJczxFeedResultBaseId) {
                    this.$message.error('未获取到任务ID');
                    return;
                }
                // 调用接口，传参 opJczxFeedResultBaseId
                backToSubmit({ opJczxFeedResultBaseId: this.Details.opJczxFeedResultBaseId }).then(res => {
                    if (res.code === 200) {
                        this.$message.success('退回成功');
                        // 退回成功后返回列表页
                        this.$router.push('/jczxFeedResultBasePad');
                    } else {
                        this.$message.error(res.msg || '退回失败');
                    }
                }).catch(err => {
                    console.error(err);
                    this.$message.error('调用退回接口失败');
                });
            }).catch(() => {
                // 取消操作
            });
        },
    },
};
</script>

<style scoped src="../../../../assets/styles/tablescroll.css"></style>
<style scoped lang="scss">
.app-container {
    position: relative;
}

.fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    padding: 16px 20px;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    border-top: 1px solid #e8e8e8;
    z-index: 1000;
    display: flex;
    justify-content: center;
    gap: 16px;
}

.fixed-bottom button {
    padding: 10px 24px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

.fixed-bottom button:first-child {
    background: #1890ff;
    color: white;
}

.fixed-bottom button:last-child {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #d9d9d9;
}

.sticky-table th {
    background: #fff;
    line-height: 23px;
}

.sticky-table th:last-child {
    background: #fff;
    right: auto;
}

.sticky-table td {
    min-width: 50px;
    line-height: 23px;
    color: #606266;
}

.sticky-table td:first-child {
    position: relative;
}

.sticky-table td:last-child {
    position: relative;
    background: transparent !important;
}

/* 确保日期选择器不溢出 */
.el-date-editor.el-input {
    width: 100% !important;
    max-width: 100%;
}

table {
    table-layout: fixed;
    width: 100%;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
    .el-date-editor.el-input {
        min-width: 100px !important;
    }

    td {
        padding: 2px !important;
        font-size: 12px;
    }
}

.tembum {
    width: 100% !important;
    max-width: 80%;
}

.custom-padding ::v-deep {
    .el-input__inner {
        padding-right: 0;
        width: calc(100% - 1px);
    }

    .el-input__suffix {
        display: none !important;
    }
}

table td,
table th {
    border-right: 1px solid #dcdfe6;
}

.formula-container {
    text-align: left;
    white-space: normal;
    font-size: 14px;
    line-height: 1.4;
}

.math-formula {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    font-family: 'Cambria Math', 'Times New Roman', serif;
}

.math-fraction {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    vertical-align: middle;
    margin: 0 6px;
}

.math-numerator,
.math-denominator {
    padding: 0 15px;
    font-size: 13px;
    line-height: 1.3;
    font-style: italic;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    letter-spacing: 0.5px;
}

.math-fraction-line {
    width: 100%;
    height: 1.2px;
    background: #333;
    margin: 3px 0;
    box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.1);
}

/* 修复下标重叠的关键 */
.math-sub {
    font-size: 0.65em;
    vertical-align: sub;
    position: relative;
    bottom: -0.1em;
    display: inline-block;
    margin: 0 -0.05em;
    line-height: 1;
}

/* 乘号样式 - 确保明显区分 */
.math-times {
    font-weight: 900;
    margin: 0 5px;
    font-size: 15px;
    font-family: 'Times New Roman', serif;
    color: #333;
}

/* 变量X加粗 */
.math-var {
    font-weight: bold;
    font-style: italic;
    margin: 0 2px;
    color: #333;
}

/* 为括号添加额外间距 */
.math-numerator,
.math-denominator {
    word-spacing: 0.3em;
}

/* 确保括号有足够空间 */
.math-numerator::before,
.math-numerator::after {
    content: '';
    display: inline-block;
    width: 0.2em;
}

/* 左括号右边距 */
.math-bracket-left {
    margin-right: 0.2em;
    display: inline-block;
}

/* 右括号左边距 */
.math-bracket-right {
    margin-left: 0.3em;
    display: inline-block;
}

/* 回归方程行样式 */
.regression-row {
    white-space: nowrap;
}

.regression-row .el-input {
    width: 80px !important;
    margin: 0 5px;
}

/* 计算公式样式调整 */
.formula-container .el-input {
    width: 60px !important;
    margin: 0 5px;
}

/* 吸光度输入框样式 */
.xgd-input {
    width: 60px !important;
    margin: 0 2px;
}

/* 第一个样品块不加上边框 */
.first-sample>td {
    border-top: none !important;
}

/* 其余样品块加粗上边框 */
.sample-split:not(.first-sample)>td {
    border-top: 1px solid #606266 !important;
}
</style>