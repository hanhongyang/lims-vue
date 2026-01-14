<template>
    <div class="app-container">
        <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回检测任务</el-button>
        <el-button type="success" icon="el-icon-back" @click="HDPadb">返回样品化验</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addSample">增加样品</el-button>
        <div style="text-align: center;font-size: 20px;">{{ Details.modelNo }} {{ Details.modelName }}</div><br>
        <div class="stickytable">
            <div class="sticky-table">
                <table cellpadding="0" cellspacing="0" width="100%" id="exportTable" style="text-align: center;">
                    <tbody>
                        <tr>
                            <td>检测日期</td>
                            <td>温湿度(℃/%)</td>
                            <td>主要仪器</td>
                            <td><el-input v-model="instrumentNameOne" updateDetails
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNameTwo" updateDetails
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td colspan="3">检测地点</td>
                            <td>检测依据</td>
                        </tr>
                        <tr>
                            <td><el-date-picker v-model="Details.testDate" type="date" class="custom-padding"
                                    :editable="false" :readonly="isJCRY">
                                </el-date-picker></td>
                            <td><el-input v-model="Details.temperature" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>/<el-input
                                    v-model="Details.humidity" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td>仪器编号</td>
                            <td><el-input v-model="instrumentNoOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td><el-input v-model="instrumentNoTwo"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td><el-input v-model="testLocationOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td><el-input v-model="testLocationTwo"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td><el-input v-model="testLocationThree"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td><el-input v-model="Details.testBasis"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="9" style="padding: 0; border: 0;">
                                <table cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr>
                                        <td style="width: 9.97%;">主要使用试剂</td>
                                        <td style="width: 13.33%;">乙酸盐缓冲溶液（pH4.5±0.05）</td>
                                        <td style="width: 13.33%;">硫酸锌溶液（0.1g/ml）</td>
                                        <td style="width: 13.33%;">氢氧化钠溶液（0.5mol/L）</td>
                                        <td style="width: 13.33%;">显色液A</td>
                                        <td style="width: 13.33%;">显色液B</td>
                                        <td style="width: 13.33%;">淀粉葡萄糖苷酶</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="9" style="padding: 0; border: 0;">
                                <table cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                                    <tr>
                                        <td style="width: 9.97%;">（配制）批号</td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd1"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd2"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd3"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd4"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd5"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                        <td style="width: 13.33%;"><el-input v-model="xgd6"
                                                :readonly="Details.status == '2' || isJCRY"></el-input>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="9" style="padding:0;border:0">
                                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                    <tbody>
                                        <tr v-if="formulaTipsList">
                                            <td colspan="9" style="border:0;padding:0;text-align:left">
                                                <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList"
                                                    type="warning" :closable="false" show-icon>
                                                </el-alert>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>样品编号</td>
                                            <td>样品名称</td>
                                            <td>空白试样溶液吸光度A<sub>0</sub></td>
                                            <td>待测试样溶液吸光度A<sub>1</sub></td>
                                            <td>全糊化试样溶液吸光度A<sub>2</sub></td>
                                            <td>糊化度x(%)</td>
                                            <td>平均值（%）</td>
                                            <td>相对相差（%）</td>
                                            <td>操作</td>
                                        </tr>
                                        <template v-for="(item, index) in Details.infoList">
                                            <tr :key="`row1-${index}`" class="sample-split"
                                                :class="{ 'first-sample': index === 0 }">
                                                <td rowspan="2"><el-input v-model="item.sampleNo"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td rowspan="2"><el-input v-model="item.sampleName"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.a0" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'a0')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.a1" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'a1')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.a2" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'a2')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input :value="computex(item)" readonly
                                                        @blur="updateCompareValues(item)"></el-input></td>
                                                <td rowspan="2"><el-input :value="item.average" readonly></el-input>
                                                </td>
                                                <td rowspan="2"><el-input v-model="item.absoluteDifference"
                                                        inputmode="decimal" readonly></el-input>
                                                </td>
                                                <td rowspan="2">
                                                    <el-button type="danger" icon="el-icon-delete" size="mini"
                                                        @click="deleteSample(index)" v-if="isRec">删除</el-button>
                                                    <template v-if="true">
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
                                            <tr :key="`row2-${index}`">
                                                <td><el-input v-model="item.compareA0" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareA0')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td><el-input v-model="item.compareA1" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareA1')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td><el-input v-model="item.compareA2" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareA2')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td><el-input :value="computeCompareX(item)" readonly
                                                        @blur="updateCompareValues(item)"></el-input>
                                                </td>
                                            </tr>
                                        </template>

                                        <tr>
                                            <td colspan="2">计算公式</td>
                                            <td colspan="7">
                                                <div class="formula-container">
                                                    X =
                                                    <span class="math-formula">
                                                        <span class="math-fraction">
                                                            <span class="math-numerator">
                                                                A<span class="math-sub">1</span>
                                                                − A<span class="math-sub">0</span>
                                                            </span>
                                                            <span class="math-fraction-line"></span>
                                                            <span class="math-numerator">
                                                                A<span class="math-sub">2</span>
                                                                − A<span class="math-sub">0</span>
                                                            </span>
                                                        </span>
                                                        <span class="math-times">×</span> 100
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">结果</td>
                                            <td colspan="7" style="text-align:left">允许相对相差≤10%</td>
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
        <el-dialog title="选择检测样品" :visible.sync="testItemDialogVisible" width="800px" append-to-body>
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
// *** 逻辑修改：导入 retest, testSubmit, saveCheck (替换 JD) ***
import { feedwatertask, feedwatertaskUp, listTask, saveCheck, XZPic, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import Decimal from 'decimal.js';
import electronic from '@/views/Feedproject/electronic.vue'
import { downloadFile } from "@/api/common/common";
export default {
    name: "starch",
    components: {
        "electronic": electronic,
    },
    data() {
        return {
            isJCRY: false,
            oneBeforeTime: '',
            oneAfterTime: '',
            twoBeforeTime: '',
            twoAfterTime: '',
            Details: {},
            isPad: true,
            PjcList: [],
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
            instrumentNameOne: '',
            instrumentNameTwo: '',
            instrumentNoOne: '',
            instrumentNoTwo: '',
            testLocationOne: '',
            testLocationTwo: '',
            testLocationThree: '',
            signatureImage: '',
            signTypes: {
                检测人: '',
                核对人: ''
            },
            currentSignType: '',
            xgd1: '',
            xgd2: '',
            xgd3: '',
            xgd4: '',
            xgd5: '',
            xgd6: '',
            firstId: '',
            testUserSignature: '',
            checkUserSignature: '',
            // *** 逻辑修改：新增负数校验节流阀 ***
            lastWarningTime: 0,
            warningThrottleMs: 2000
        };
    },
    created() {

    },
    computed: {
        // 返回空字段的中文名，用顿号连接；若无空字段返回空串
        formulaTipsList() {
            const tips = [];

            /* ---------- 2. 逐行字段 ---------- */
            (this.Details.infoList || []).forEach((row, idx) => {
                const rowEmpty = [];
                if (!row.a1 || !row.compareA1) rowEmpty.push('待测试样溶液吸光度 A₁');
                if (!row.a0 || !row.compareA0) rowEmpty.push('空白试样溶液吸光度 A₀');
                if (!row.a2 || !row.compareA2) rowEmpty.push('全糊化试样溶液吸光度 A₂');


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
            if (this.$route.params.SjtaskInfo.testUserSignature) {
                XZPic(this.$route.params.SjtaskInfo.testUserSignature).then((res) => {
                    this.signTypes.检测人 = URL.createObjectURL(res)
                    this.testUserSignature = this.Details.testUserSignature; // *** 逻辑修改：加载签名ID ***
                })
            }
            if (this.$route.params.SjtaskInfo.checkUserSignature) {
                XZPic(this.$route.params.SjtaskInfo.checkUserSignature).then((res1) => {
                    this.signTypes.核对人 = URL.createObjectURL(res1)
                    this.checkUserSignature = this.Details.checkUserSignature; // *** 逻辑修改：加载签名ID ***
                })
            }
        } else if (this.$route.query.SjtaskInfo1) { // *** 逻辑修改：兼容 query 方式 ***
            this.Details = this.$route.query.SjtaskInfo1
            this.isShow = true
            this.isRec = false
            if (this.Details.testUserSignature) {
                XZPic(this.Details.testUserSignature).then((res) => {
                    this.signTypes.检测人 = URL.createObjectURL(res)
                    this.testUserSignature = this.Details.testUserSignature;
                })
            }
            if (this.Details.checkUserSignature) {
                XZPic(this.Details.checkUserSignature).then((res1) => {
                    this.signTypes.核对人 = URL.createObjectURL(res1)
                    this.checkUserSignature = this.Details.checkUserSignature;
                })
            }
        }
        else {
            this.$message.error('未获取到任务信息，请返回任务列表重新进入！')
            return
        }
        // 确保所有样品数据都有必要的字段
        // if (this.Details.infoList) {
        //     this.Details.infoList.forEach(item => {
        //         if (!item.isReset) {
        //             this.$set(item, 'isReset', '0');
        //         }
        //     });
        // }
        console.log(this.isRec, '111111111')
        this.isPadPc()
        this.initTimes();

    },
    // *** 逻辑修改：新增 beforeDestroy ***
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
        /* 通用：收集所有空字段 */
        validateEmpty() {
            const empty = [];
            /* ---- 逐行样品字段 ---- */
            (this.Details.infoList || []).forEach((row, idx) => {
                if (!row.a1) empty.push(`第${idx + 1}行待测试样溶液吸光度 A₁`);
                if (!row.a0) empty.push(`第${idx + 1}行空白试样溶液吸光度 A₀`);
                if (!row.a2) empty.push(`第${idx + 1}行全糊化试样溶液吸光度 A₂`);
                if (!row.compareA1) empty.push(`第${idx + 1}行对比待测试样溶液吸光度 A₁`);
                if (!row.compareA0) empty.push(`第${idx + 1}行对比空白试样溶液吸光度 A₀`);
                if (!row.compareA2) empty.push(`第${idx + 1}行对比全糊化试样溶液吸光度 A₂`);
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
        initTimes() {
            const Onetimes = (this.Details.xxFirstTime || '').split(',');
            this.oneBeforeTime = Onetimes[0] || '';
            this.oneAfterTime = Onetimes[1] || '';
            const Twotimes = (this.Details.xxSecondTime || '').split(',');
            this.twoBeforeTime = Twotimes[0] || '';
            this.twoAfterTime = Twotimes[1] || '';
            const Name = (this.Details.instrumentName || '').split(',');
            this.instrumentNameOne = Name[0] || '';
            this.instrumentNameTwo = Name[1] || '';
            const No = (this.Details.instrumentNo || '').split(',');
            this.instrumentNoOne = No[0] || '';
            this.instrumentNoTwo = No[1] || '';
            const Location = (this.Details.testLocation || '').split(',');
            this.testLocationOne = Location[0] || '';
            this.testLocationTwo = Location[1] || '';
            this.testLocationThree = Location[2] || '';

            // *** 逻辑修改：sjhph 存的是6个批号 ***
            const Xg = (this.Details.sjhph || '').split(',');
            this.xgd1 = Xg[0] || '';
            this.xgd2 = Xg[1] || '';
            this.xgd3 = Xg[2] || '';
            this.xgd4 = Xg[3] || '';
            this.xgd5 = Xg[4] || '';
            this.xgd6 = Xg[5] || '';
        },
        updateDetails() {
            this.Details.xxFirstTime = `${this.oneBeforeTime},${this.oneAfterTime}`;
            this.Details.xxSecondTime = `${this.twoBeforeTime},${this.twoAfterTime}`;
            this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
            this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
            this.Details.testLocation = `${this.testLocationOne},${this.testLocationTwo},${this.testLocationThree}`;
            this.Details.sjhph = `${this.xgd1},${this.xgd2},${this.xgd3},${this.xgd4},${this.xgd5},${this.xgd6}`; // *** 逻辑修改：sjhph 存的是6个批号 ***
        },
        onNumberInput(val, row, key) {
            // 1. 去掉非法字符（保留数字、负号、小数点）
            let cleaned = val.replace(/[^-0-9.]/g, '');

            // 2. 负号只能出现在最前面
            cleaned = cleaned.replace(/(?!^)-/g, '');

            // 3. 多个小数点只保留第一个
            const parts = cleaned.split('.');
            if (parts.length > 2) {
                cleaned = parts[0] + '.' + parts.slice(1).join('');
            }

            // 4. 禁止以小数点开头，强制补 0
            if (cleaned.startsWith('.')) {
                cleaned = '0' + cleaned;
            }

            // 5. 禁止以负号+小数点开头的输入，如 "-."
            if (cleaned.startsWith('-.')) {
                cleaned = '-0.';
            }

            row[key] = cleaned;

            this.$nextTick(() => {
                this.updateCompareValues(row);
            });
        },
        // 计算X值的方法
        computex(item) {
            // 检查必需的值是否都已输入
            const requiredValues = [item.a1, item.a2, item.a0];
            if (!this.hasRequiredValues(requiredValues)) {
                this.$set(item, 'x', ''); // *** 逻辑修改：确保清空 ***
                return '';
            }

            try {
                const a1 = new Decimal(item.a1);
                const a2 = new Decimal(item.a2);
                const a0 = new Decimal(item.a0);

                // 检查分母是否为0
                if (a2.minus(a0).equals(0)) {
                    this.$set(item, 'x', '0'); // *** 逻辑修改：确保赋值 ***
                    return '0';
                }

                const numerator = a2.minus(a0)
                const numerator1 = a1.minus(a0)
                const result = numerator1.dividedBy(numerator).times(100);

                // const formattedResult = this.formatPrecision(result);
                // this.$set(item, 'x', formattedResult); // *** 逻辑修改：确保保存 ***

                const formattedResult = new Decimal(result).toDecimalPlaces(3).toFixed(3);
                this.$set(item, 'x', formattedResult);
                return formattedResult;
            } catch (error) {
                console.error('计算X值错误:', error);
                this.$set(item, 'x', '');
                return '';
            }
        },
        // 计算对比X值的方法
        computeCompareX(item) {
            // 检查必需的值是否都已输入
            const requiredValues = [item.compareA1, item.compareA2, item.compareA0];
            if (!this.hasRequiredValues(requiredValues)) {
                this.$set(item, 'compareX', ''); // *** 逻辑修改：确保清空 ***
                return '';
            }

            try {
                const a1 = new Decimal(item.compareA1);
                const a2 = new Decimal(item.compareA2);
                const a0 = new Decimal(item.compareA0);

                // 检查分母是否为0
                if (a2.minus(a0).equals(0)) {
                    this.$set(item, 'compareX', '0'); // *** 逻辑修改：确保赋值 ***
                    return '0';
                }

                const numerator = a2.minus(a0)
                const numerator1 = a1.minus(a0)
                const result = numerator1.dividedBy(numerator).times(100);

                // const formattedResult = this.formatPrecision(result);
                // this.$set(item, 'compareX', formattedResult); // *** 逻辑修改：确保保存 ***
                // *** 逻辑修改：糊化度x保留3位小数 ***
                const formattedResult = new Decimal(result).toDecimalPlaces(3).toFixed(3);
                this.$set(item, 'compareX', formattedResult);
                return formattedResult;
            } catch (error) {
                console.error('计算对比X值错误:', error);
                this.$set(item, 'compareX', '');
                return '';
            }
        },
        // 精度格式化方法
        formatPrecision(value, field = '') {
            if (value === null || value === undefined || value === '') {
                return '';
            }

            let num = new Decimal(value);
            /* ---------- 特殊位数字段 ---------- */
            if (field === 'x' || field === 'compareX') {
                // 糊化度：3 位小数，强制补 0
                return num.toFixed(3);
            }
            // if (field === 'average') {
            //     // 平均值：3 位小数，强制补 0
            //     // return num.toFixed(3);
            // }
            // if (field === 'absoluteDifference') {
            //     // 相对相差：3 位小数，强制补 0
            //     return num.toFixed(3);
            // }

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
        formatBankerRounding(value, digits) {
            if (value === null || value === undefined || value === '') {
                return '';
            }

            try {
                const num = new Decimal(value);

                // 处理0的特殊情况
                if (num.isZero()) {
                    return digits > 1 ? '0.' + '0'.repeat(digits - 1) : '0';
                }

                // 使用银行家舍入 (ROUND_HALF_EVEN) 进行有效数字舍入
                const rounded = num.toSignificantDigits(digits, Decimal.ROUND_HALF_EVEN);

                // 获取舍入后的字符串
                let str = rounded.toString();

                // 计算当前有效数字位数
                let absStr = str.replace('-', '');        // 移除负号
                let noPoint = absStr.replace('.', '');    // 移除小数点
                let noLeadingZeros = noPoint.replace(/^0+/, '');  // 移除前导0

                let currentDigits = noLeadingZeros.length;

                // 需要补的0数量
                let zerosToAdd = digits - currentDigits;

                if (zerosToAdd > 0) {
                    if (str.includes('.')) {
                        // 已有小数点，直接在后面补0
                        str = str + '0'.repeat(zerosToAdd);
                    } else {
                        // 没有小数点，加小数点再补0
                        str = str + '.' + '0'.repeat(zerosToAdd);
                    }
                }

                return str;
            } catch (error) {
                console.error('格式化错误:', error);
                return '';
            }
        },
        // 检查是否所有必需的值都已输入
        hasRequiredValues(values) {
            return values.every(val =>
                val !== null && val !== undefined && val !== '' && !isNaN(val)
            );
        },
        updateCompareValues(item) {
            this.$nextTick(() => {
                // *** 逻辑修改：确保 item.x/compareX 被赋值 ***
                item.x = this.computex(item);
                item.compareX = this.computeCompareX(item);

                const x = item.x;
                const compareX = item.compareX;

                if (x !== '' && compareX !== '' && x !== null && compareX !== null) {
                    const avg = new Decimal(x).plus(new Decimal(compareX)).dividedBy(2);
                    const absoluteDiff = Decimal.abs(new Decimal(x).minus(new Decimal(compareX)));
                    // *** 逻辑修改：使用 avg 计算相对相差 ***
                    const relativeDiff = avg.equals(0) ? new Decimal(0) : absoluteDiff.dividedBy(avg).times(100);

                    // this.$set(item, 'average', this.formatPrecision(avg)); // *** 逻辑修改：使用精度格式化 ***
                    this.$set(item, 'average', this.formatBankerRounding(avg, 3));
                    // this.$set(item, 'absoluteDifference', this.formatBankerRounding(relativeDiff, 2)); 
                    this.$set(item, 'absoluteDifference', relativeDiff.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN).toFixed(2));

                    // *** 逻辑修改：新增负数校验 ***
                    const average_val = parseFloat(item.average);
                    if ((new Decimal(x).lessThan(0)) || (new Decimal(compareX).lessThan(0)) || (!isNaN(average_val) && average_val < 0)) {
                        const now = Date.now();
                        if (now - this.lastWarningTime > this.warningThrottleMs) {
                            this.$message.warning('计算结果为负数，请检查输入数据是否正确');
                            this.lastWarningTime = now;
                        }
                    }

                } else {
                    this.$set(item, 'average', '');
                    this.$set(item, 'absoluteDifference', '');
                }

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
                        "average": '',
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
        onSignatureDone({ type, data, fileId, close }) {
            console.log(type, fileId, '111111111111')
            this.signTypes[type] = data       // 根据类型写入对应变量
            this.videoif = close
            // 根据签名类型保存fileId
            if (fileId) {
                if (type == '检测人') {
                    this.testUserSignature = fileId;
                    console.log('检测人签名文件ID:', fileId);
                } else if (type == '核对人') {
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
            //if (empty.length) {
            //    this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
            //    return { success: false, error: '数据未填完整' }; // 返回失败
            //}

            // 提交前可再强制更新一遍，防止漏算
            this.Details.infoList.forEach(item => {
                this.updateCompareValues(item);
            });

            // *** 逻辑修改：调用 updateDetails ***
            this.updateDetails(); // 确保 instrumentName, sjhph 等字段被组合

            const submitData = {
                ...this.Details,
                testUserSignature: this.testUserSignature,
                checkUserSignature: this.checkUserSignature
            };

            if (!submitData.opJczxFeedResultBaseId && this.Details.opJczxFeedResultBaseId) {
                submitData.opJczxFeedResultBaseId = this.Details.opJczxFeedResultBaseId;
            }

            console.log(this.Details, '提交表单')
            try {
                let result;
                if (this.isRec) {
                    this.Details.itemId = this.$route.params.jcList[0].IDD;
                    result = await feedwatertask(submitData); // *** 逻辑修改：使用 submitData ***
                } else if (this.isShow) {
                    result = await feedwatertaskUp(submitData); // *** 逻辑修改：使用 submitData ***
                }

                if (result.code == 200) {
                    if (result.data && result.data.opJczxFeedResultBaseId) {
                        this.Details.opJczxFeedResultBaseId = result.data.opJczxFeedResultBaseId;
                    }
                    if (this.isRec) {
                        if (!this.Details.status) {
                            this.Details.status = '1';
                        }
                        this.isRec = false;
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
                        this.$message.success('已提交成功');
                        this.$router.push('/jczxFeedResultBasePad');
                    } else {
                        this.$message.success('保存成功');
                    }
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

        // *** 逻辑修改：JDForm -> submitCheck ***
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

                const res = await saveCheck(submitData); // *** 逻辑修改：调用 saveCheck ***
                if (res.code === 200) {
                    this.$message.success('校对成功');
                    this.$router.push('/jczxFeedResultBasePad'); // Navigate back
                } else {
                    this.$message.error(res.msg || '校对失败');
                }
            } catch (error) {
                this.$message.error('校对失败');
            }
        },
        // 检查是否有样品已申请复检
        hasRetestSample() {
            const list = this.Details.infoList || [];
            return list.length > 0 && list.every(item => item.isReset === '1');
        },
        // *** 逻辑修改：新增 submitTest 方法 ***
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
            if (!this.testUserSignature) {
                this.$message.error('请先进行检测人签字后再提交');
                return;
            }
            const saveResult = await this.submitForm(true);
            if (!saveResult || !saveResult.success) {
                this.$message.error('数据保存失败，无法提交。请检查填写内容。');
                return;
            }
            const baseId = this.Details.opJczxFeedResultBaseId;
            if (!baseId) {
                this.$message.error('保存成功但未获取到任务ID，无法提交');
                return;
            }
            try {
                const res = await testSubmit({ opJczxFeedResultBaseId: baseId });
                if (res.code === 200) {
                    this.$message.success('提交成功');
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
    // min-height: 100vh;
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

.stickytable {
    overflow-x: auto;
    width: 100%;
}

.sticky-table {
    min-width: 1000px;
    /* 根据内容设置最小宽度 */
    width: 100%;
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

.HgTime {
    width: 100% !important;
    max-width: 60%;
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
    white-space: nowrap;
    font-size: 14px;
    line-height: 1.4;
    text-align: left;
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
    /* 增加内边距 */
    font-size: 13px;
    line-height: 1.3;
    font-style: italic;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
    letter-spacing: 0.5px;
    /* 增加字母间距 */
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
    /* 微调边距 */
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
    /* 增加单词间距 */
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

/* 分数容器 */
.frac {
    display: inline-flex;
    /* 让子元素纵向排列 */
    flex-direction: column;
    text-align: center;
    line-height: 1.2;
    vertical-align: middle;
    /* 与左右文字居中对齐 */
    font-size: inherit;
    /* 想多大就改这里 */
}

/* 分子 */
.num {
    border-bottom: 1px solid #000;
    /* 分数线 */
    padding: 0 4px;
    /* 左右留点空 */
}

/* 分母 */
.den {
    padding: 0 4px;
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