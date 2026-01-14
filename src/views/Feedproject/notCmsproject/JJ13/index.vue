<template>
    <div class="app-container">
        <!-- 返回按钮 -->
        <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px;" @click="HDPada">返回检测任务</el-button>
        <el-button type="success" icon="el-icon-back" @click="HDPadb">返回样品化验</el-button>
        <!-- 添加样品按钮 -->
        <el-button type="primary" icon="el-icon-plus" @click="addSample" v-if="!isJCRY">增加样品</el-button>
        <!-- 废弃初水分化验按钮
        <el-button type="primary" icon="el-icon-plus" @click="csfhy">初水分化验</el-button>
-->
        <!-- 标题 -->
        <div style="text-align: center;font-size: 20px;">{{ Details.modelNo }} {{ Details.modelName }}</div><br>

        <!-- 主表格 -->
        <div class="stickytable">
            <div class="sticky-table">
                <table cellpadding="0" cellspacing="0" width="100%" id="exportTable" style="text-align: center;">
                    <tbody>
                        <!-- 表头信息行 -->
                        <tr>
                            <td>检测日期</td>
                            <td>硝酸银溶液浓度C(mol/L)/批号</td>
                            <td>10%铬酸钾配制批号</td>
                            <td>主要使用仪器</td>
                            <td><el-input v-model="instrumentNameOne" @input="updateDetails"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td>检测依据</td>
                            <td>检测地点</td>
                            <td>温湿度(℃/%)</td>
                        </tr>
                        <tr>
                            <td>
                                <el-date-picker v-model="Details.testDate" type="date" class="custom-padding"
                                    :editable="false" :readonly="Details.status == '2' || isJCRY">
                                </el-date-picker>
                            </td>
                            <td style="padding: 0">
                                <div style="display: flex;">
                                    <el-input v-model="xxryphArr[0]" style="width: 50%; border-right: 1px solid #dcdfe6"
                                        :readonly="isJCRY" @input="joinXxryph" />
                                    <el-input v-model="xxryphArr[1]" style="width: 50%"
                                        :readonly="Details.status == '2' || isJCRY" @input="joinXxryph" />
                                </div>
                            </td>
                            <td><el-input v-model="Details.fmsarypzph"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td>仪器编号</td>
                            <td><el-input v-model="instrumentNoOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="Details.testBasis"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="testLocationOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td>
                                <el-input v-model="Details.temperature" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>/
                                <el-input v-model="Details.humidity" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="8" style="padding:0;border:0">
                                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                    <tbody>
                                        <!-- 公式提示行 -->
                                        <tr v-if="formulaTipsList">
                                            <td colspan="13" style="border:0;padding:0;text-align:left">
                                                <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList"
                                                    type="warning" :closable="false" show-icon>
                                                </el-alert>
                                            </td>
                                        </tr>
                                        <!-- 样品表头 -->
                                        <tr>
                                            <td colspan="2">样品编号</td>
                                            <td>样品名称</td>
                                            <td>瓶号</td>
                                            <td>试样质量 m（g）</td>
                                            <td>样品消耗硝酸银标准溶液消耗体积V(mL)</td>
                                            <td>空白消耗硝酸银标准溶液消耗体积V₀(mL)</td>
                                            <td>水溶性氯化物含量X(%)</td>
                                            <td>平均值（%）</td>
                                            <td>相对偏差（%）</td>
                                            <td>允许相差(绝对值)</td>
                                            <td>鲜样中水溶性氯化物含量x(%)</td>
                                            <td>操作</td>
                                        </tr>

                                        <!-- 样品数据行 -->
                                        <template v-for="(item, index) in Details.infoList">
                                            <tr :key="`row1-${index}`" class="sample-split"
                                                :class="{ 'first-sample': index === 0 }">
                                                <td rowspan="2" colspan="2"><el-input v-model="item.sampleNo"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td rowspan="2"><el-input v-model="item.sampleName"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.clmh"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td>
                                                    <el-input v-model="item.m" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'm')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.v" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'v')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.v0" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'v0')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input :value="item.x" readonly></el-input>
                                                </td>
                                                <td rowspan="2">
                                                    <el-input :value="item.average" readonly></el-input>
                                                </td>
                                                <td rowspan="2">
                                                    <el-input :value="item.absoluteDifference" readonly></el-input>
                                                </td>
                                                <td rowspan="2">
                                                    <el-input :value="item.yxxc" readonly></el-input>
                                                </td>
                                                <td rowspan="2">
                                                    <el-input v-model="item.xyzhl" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'xyzhl')"
                                                        readonly></el-input>
                                                </td>
                                                <td rowspan="2">
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
                                            <tr :key="`row2-${index}`">
                                                <td><el-input v-model="item.compareClmh"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td>
                                                    <el-input v-model="item.compareM" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareM')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.compareV" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareV')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.compareV0" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'compareV0')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input :value="item.compareX" readonly></el-input>
                                                </td>
                                            </tr>
                                        </template>

                                        <!-- 计算公式行 -->
                                        <tr>
                                            <td colspan="2">计算公式</td>
                                            <td colspan="11">
                                                <div class="formula-container">
                                                    NaCl（%） =
                                                    <span class="math-formula">
                                                        <span class="math-fraction">
                                                            <span class="math-numerator">
                                                                (V - V₀) × C × 0.05845 × 100 × 100
                                                            </span>
                                                            <span class="math-fraction-line"></span>
                                                            <span class="math-denominator">
                                                                10 × m
                                                            </span>
                                                        </span>
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- 备注行 -->
                                        <tr>
                                            <td colspan="2">备注</td>
                                            <td colspan="11" style="text-align:left">
                                                每个试样取两个平行样进行测定，以其算术平均值为结果。<br>
                                                氯化钠含量在5%以下时，允许相差（绝对值）为0.05。<br>
                                                氯化钠含量在5%以上时，允许相对偏差为5%。
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- 签名区域 -->
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

            <!-- 底部按钮 -->
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

        <!-- 选择样品对话框 -->
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

        <!-- 电子签名对话框 -->
        <el-dialog title="签字板" :visible.sync="videoif" width="80%">
            <electronic @closeCanvas="closeCanvas" :showCanvas="videoif" @savecanva="savecanva"
                :SignatureImg="SignatureImg" :typename="currentSignType" v-if="videoif"
                @signature-done="onSignatureDone" />
        </el-dialog>
    </div>
</template>

<script>
import { downloadFile, previewFile } from "@/api/common/common";
import { feedwatertask, feedwatertaskUp, listTask, saveCheck, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue';
import csfhyMixin from "@/views/Feedproject/csfhyMixin";

import Decimal from 'decimal.js'
import json from "highlight.js/lib/languages/json";

export default {
    name: "watersoluble",
    mixins: [csfhyMixin],

    components: {
        "electronic": electronic,
    },
    data() {
        return {
            xxryphArr: ['', ''],  // 0-浓度 1-批号
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
            isJCRY: false,
            videoif: false,
            SignatureImg: "",
            instrumentNameOne: '',
            instrumentNameTwo: '',
            instrumentNoOne: '',
            instrumentNoTwo: '',
            testLocationOne: '',
            testLocationTwo: '',
            signatureImage: '',
            signTypes: {
                检测人: '',
                核对人: ''
            },
            currentSignType: '',
            testUserSignature: '',
            checkUserSignature: '',
            lastWarningTime: 0, // 上次警告时间
            warningThrottleMs: 2000 // 警告节流时间 (2秒)
        };
    },
    created() {
        // 初始化数据
    },
    computed: {
        // 返回空字段的中文名，用顿号连接；若无空字段返回空串
        formulaTipsList() {
            const tips = [];
            // const empty = [];
            // if (!this.Details.c) empty.push('批号');
            /* ---------- 2. 逐行字段 ---------- */
            (this.Details.infoList || []).forEach((row, idx) => {
                const rowEmpty = [];
                if (!row.v || !row.compareV) rowEmpty.push('样品消耗体积');
                if (!row.m || !row.compareM) rowEmpty.push('试样质量 m');
                if (!row.v0 || !row.compareV0) rowEmpty.push('空白消耗体积');

                if (rowEmpty.length) {
                    tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
                }
            });

            /* ---------- 3. 返回 ---------- */
            return tips.length ? tips.join('；') : '';
        },
        formulaTips() {
            const empty = [];
            if (!this.Details.xxryph) empty.push('批号');


            return empty.length ? empty.join('、') : '';
        }
    },
    mounted() {
        // console.log(JSON.stringify(this.$route.query.SjtaskInfo1), '13中接收的数据')
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
        } else if (this.$route.query.SjtaskInfo1) {
            this.Details = this.$route.query.SjtaskInfo1
            this.isShow = true
            this.isRec = false
        }
        else {
            this.$message.error('未获取到任务信息，请返回任务列表重新进入！')
            // this.$router.push('/taskList')
            return
        }

        // 确保所有样品数据都有必要的字段
        if (this.Details.infoList) {
            this.Details.infoList.forEach(item => {
                if (!item.hasOwnProperty('x')) this.$set(item, 'x', '');
                if (!item.hasOwnProperty('compareX')) this.$set(item, 'compareX', '');
                if (!item.hasOwnProperty('average')) this.$set(item, 'average', '');
                if (!item.hasOwnProperty('absoluteDifference')) this.$set(item, 'absoluteDifference', '');
                if (!item.hasOwnProperty('yxxc')) this.$set(item, 'yxxc', '');
                if (!item.hasOwnProperty('isReset')) this.$set(item, 'isReset', '0');
            });
        }
        this.splitXxryph();
        console.log('传入参数:', this.$route.params);
        this.isPadPc()
        this.initTimes();
        console.log('精度参数:', {
            decimalPlaces: this.Details.decimalPlaces,
            significantDigits: this.Details.significantDigits
        });


        // 直接调用
        this.loadSignatureImages();
        // 在初始化后查询初水分数据并计算鲜样含量
        this.$nextTick(() => {
            setTimeout(() => {
                this.loadCsfhyDataAndCalculate();
            }, 100);
        });
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
    watch: {
        'Details.xxryph'(newVal) {
            if (this.Details.infoList && this.Details.infoList.length > 0) {
                this.Details.infoList.forEach(item => {
                    this.updateCompareValues(item);
                });
            }
        }
    },
    methods: {
        // 把 Details.xxryph 拆成两个框
        splitXxryph() {
            const arr = (this.Details.xxryph || '').split(',');
            this.xxryphArr = [arr[0] || '', arr[1] || ''];
        },
        // 把两个框合并回 Details.xxryph
        joinXxryph() {
            this.Details.xxryph = this.xxryphArr.join(',');
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
        /* 通用：收集所有空字段 */
        validateEmpty() {
            const empty = [];

            /* ---- 全局字段 ---- */
            if (!this.Details.xxryph) empty.push('批号');


            /* ---- 逐行样品字段 ---- */

            (this.Details.infoList || []).forEach((row, idx) => {
                if (!row.v) empty.push(`第${idx + 1}行样品消耗体积`);
                if (!row.m) empty.push(`第${idx + 1}行试样质量 m`);
                if (!row.v0) empty.push(`第${idx + 1}行空白消耗体积`);
                if (!row.compareV) empty.push(`第${idx + 1}行对比样品消耗体积`);
                if (!row.compareM) empty.push(`第${idx + 1}行对比试样质量 m`);
                if (!row.compareV0) empty.push(`第${idx + 1}行对比空白消耗体积`);
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
            // 添加空值检查
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
        },
        updateDetails() {
            this.Details.xxFirstTime = `${this.oneBeforeTime},${this.oneAfterTime}`;
            this.Details.xxFirstTime = `${this.twoBeforeTime},${this.twoAfterTime}`;
            this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
            this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
            this.Details.instrumentNo = `${this.testLocationOne},${this.testLocationTwo}`;
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
                this.updateCompareValues(row);
            });
        },

        // 计算NaCl含量（%）的方法 - 根据新公式
        computeNaCl(item) {
            // 检查必需的值是否都已输入
            const requiredValues = [item.v, item.v0, item.m];
            if (!this.hasRequiredValues(requiredValues) || !this.Details.xxryph) {
                return '';
            }

            try {
                const V = new Decimal(item.v);
                const V0 = new Decimal(item.v0);
                const m = new Decimal(item.m);
                const C = new Decimal(this.xxryphArr[0] || 0);

                // 检查分母是否为0
                if (m.equals(0)) {
                    this.$set(item, 'x', '0');
                    return '0';
                }

                // 计算公式: (V - V0) × C × 0.05845 × 100 × 100 / (10 × m)
                const numerator = V.minus(V0).times(C).times(0.05845).times(100).times(100);
                const denominator = new Decimal(10).times(m);
                const result = numerator.dividedBy(denominator);

                const formattedResult = this.formatPrecision(result);
                // 保存计算结果到字段
                this.$set(item, 'x', formattedResult);
                return formattedResult;
            } catch (error) {
                console.error('计算x错误:', error);
                this.$set(item, 'x', '');
                return '';
            }
        },

        // 计算对比NaCl含量（%）的方法
        computeCompareNaCl(item) {
            // 检查必需的值是否都已输入
            const requiredValues = [item.compareV, item.compareV0, item.compareM];
            if (!this.hasRequiredValues(requiredValues) || !this.Details.xxryph) {
                this.$set(item, 'compareX', '');
                return '';
            }

            try {
                const V = new Decimal(item.compareV);
                const V0 = new Decimal(item.compareV0);
                const m = new Decimal(item.compareM);
                const C = new Decimal(this.xxryphArr[0] || 0);

                // 检查分母是否为0
                if (m.equals(0)) {
                    this.$set(item, 'compareX', '0');
                    return '0';
                }

                // 计算公式: (V - V0) × C × 0.05845 × 100 × 100 / (10 × m)
                const numerator = V.minus(V0).times(C).times(0.05845).times(100).times(100);
                const denominator = new Decimal(10).times(m);
                const result = numerator.dividedBy(denominator);

                const formattedResult = this.formatPrecision(result);
                // 保存计算结果到字段
                this.$set(item, 'compareX', formattedResult);
                return formattedResult;
            } catch (error) {
                console.error('计算平行样x错误:', error);
                this.$set(item, 'compareX', '');
                return '';
            }
        },

        // 计算平均值
        computeAverage(item) {
            const x1 = this.computeNaCl(item);
            const x2 = this.computeCompareNaCl(item);

            if (!x1 || !x2) {
                this.$set(item, 'average', '');
                return '';
            }

            try {
                const x1Val = new Decimal(x1);
                const x2Val = new Decimal(x2);
                const average = x1Val.plus(x2Val).dividedBy(2);

                const formattedAverage = average.toFixed(2);
                // 保存平均值到字段
                this.$set(item, 'average', formattedAverage);
                return formattedAverage;
            } catch (error) {
                console.error('计算平均值错误:', error);
                this.$set(item, 'average', '');
                return '';
            }
        },

        // 计算相对相差
        computeRelativeDifference(item) {
            const x1 = this.computeNaCl(item);        // 第一组 NaCl 含量
            const avg = this.computeAverage(item);    // 平均值

            if (!x1 || !avg) {
                this.$set(item, 'absoluteDifference', '');
                return '';
            }

            try {
                const x1Val = new Decimal(x1);
                const avgVal = new Decimal(avg);

                if (avgVal.equals(0)) {                 // 避免除 0
                    this.$set(item, 'absoluteDifference', '0');
                    return '0';
                }

                const diff = x1Val.minus(avgVal).abs(); // |X - 平均值|
                const relativeDiff = diff.dividedBy(avgVal).times(100);

                // 保留 2 位小数（与之前保持一致）
                const formatted = relativeDiff.toFixed(2);
                this.$set(item, 'absoluteDifference', formatted);
                return formatted;
            } catch (e) {
                console.error('计算相对偏差错误:', e);
                this.$set(item, 'absoluteDifference', '');
                return '';
            }
        },

        // 计算允许相差
        computeAllowedDifference(item) {
            // const average = this.computeAverage(item);

            // if (!average) {
            //     this.$set(item, 'yxxc', '');
            //     return '';
            // }

            // try {
            //     const avgVal = new Decimal(average);

            //     // 根据备注规则：
            //     // 氯化钠含量在5%以下时，允许相差（绝对值）为0.05
            //     // 氯化钠含量在5%以上时，允许相对偏差为5%
            //     let allowedDifference;
            //     if (avgVal.lessThan(5)) {
            //         allowedDifference = '0.05';
            //     } else {
            //         allowedDifference = '5%';
            //     }
            //     // 保存允许相差到字段
            //     this.$set(item, 'yxxc', allowedDifference);
            //     return allowedDifference;
            // } catch (error) {
            //     console.error('计算允许相差错误:', error);
            //     this.$set(item, 'yxxc', '');
            //     return '';
            // }
            const x1 = item.x;        // 第一行X
            const x2 = item.compareX; // 第二行X（对比样）

            if (!x1 || !x2 || x1 === '' || x2 === '') {
                this.$set(item, 'yxxc', '');
                return '';
            }

            try {
                const x1Val = new Decimal(x1);
                const x2Val = new Decimal(x2);

                // 计算绝对差值 |X1 - X2|
                const absoluteDiff = x1Val.minus(x2Val).abs();

                const formattedResult = absoluteDiff.toFixed(2);
                this.$set(item, 'yxxc', formattedResult);
                return formattedResult;
            } catch (error) {
                console.error('计算允许相差错误:', error);
                this.$set(item, 'yxxc', '');
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
            this.calculateFreshSampleForItemMixin(item);
        },
        calculateSingleFreshSample(item, csfValue) {
            this.calculateSingleFreshSampleMixin(item, csfValue);
        },
        calculateFreshSample(csfhyData) {
            this.calculateFreshSampleMixin(csfhyData);
        },
        updateCompareValues(item) {
            // 如果 C 值不存在，清空所有计算字段
            if (!this.Details.xxryph) {
                this.$set(item, 'x', '');
                this.$set(item, 'compareX', '');
                this.$set(item, 'average', '');
                this.$set(item, 'absoluteDifference', '');
                this.$set(item, 'yxxc', '');
                this.$set(item, 'xyzhl', '');
                return;
            }

            // 重新计算所有值并保存到对应字段
            this.computeNaCl(item);
            this.computeCompareNaCl(item);
            this.computeAverage(item);
            this.computeRelativeDifference(item);
            this.computeAllowedDifference(item);
            /* ===== 二选一：把结果放到正确字段 ===== */
            if (item.x && item.x !== '' && !isNaN(parseFloat(item.x))) {
                try {
                    if (new Decimal(item.x).gte(5)) {
                        // ≥5 %：用相对偏差，absoluteDifference 已有了，把 yxxc 清空
                        this.$set(item, 'yxxc', '');
                    } else {
                        // <5 %：用绝对差值，yxxc 已有了，把 relativeDifference 清空
                        this.$set(item, 'absoluteDifference', '');
                    }
                } catch (e) {
                    console.warn('Decimal 转换失败:', item.x, e);
                }
            }
            // if (new Decimal(item.x).gte(5)) {
            //     // ≥5 %：用相对偏差，absoluteDifference 已有了，把 yxxc 清空
            //     this.$set(item, 'yxxc', '');
            // } else {
            //     // <5 %：用绝对差值，yxxc 已有了，把 relativeDifference 清空
            //     this.$set(item, 'absoluteDifference', '');
            // }
            // 计算鲜样含量
            this.calculateFreshSampleForItem(item);
            // 检查关键计算结果是否为负数
            const x_val = parseFloat(item.x);
            const compareX_val = parseFloat(item.compareX);
            const average_val = parseFloat(item.average);

            if ((!isNaN(x_val) && x_val < 0) ||
                (!isNaN(compareX_val) && compareX_val < 0) ||
                (!isNaN(average_val) && average_val < 0)) {

                const now = Date.now();
                // 节流：2秒内只提示一次，防止用户输入时重复弹窗
                if (now - this.lastWarningTime > this.warningThrottleMs) {
                    this.$message.warning('计算结果为负数，请检查输入数据是否正确');
                    this.lastWarningTime = now;
                }
            }
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
                        "v": "",
                        "v0": "",
                        "x": "",
                        "compareClmh": "",
                        "compareM": "",
                        "compareV": "",
                        "compareV0": "",
                        "compareX": "",
                        "average": "",
                        "absoluteDifference": "",
                        "yxxc": "",
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
        onSignatureDone({ type, data, fileId, close }) {
            this.signTypes[type] = data;
            this.videoif = close
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

        saveForm() {
            this.submitForm(true); // true 表示只保存，不跳转
        },
        // 提交表单
        async submitForm(preventNavigation = false) { // 默认不阻止导航
            //if (this.isShow) {
            //    const empty = this.validateEmpty();
            //    if (empty.length) {
            //        this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
            //        return { success: false, error: '数据未填完整' }; // 返回失败
            //   }
            //}
            this.Details.xxFirstTime = this.oneBeforeTime + ',' + this.oneAfterTime
            this.Details.xxSecondTime = this.twoBeforeTime + ',' + this.twoAfterTime
            this.Details.instrumentName = this.instrumentNameOne + ',' + this.instrumentNameTwo
            this.Details.instrumentNo = this.instrumentNoOne + ',' + this.instrumentNoTwo
            this.Details.testLocation = this.testLocationOne + ',' + this.testLocationTwo
            // 提交前重新计算所有值并保存到字段
            if (this.xxryphArr.every(it => it && !isNaN(it))) {
                this.Details.infoList.forEach(item => this.updateCompareValues(item));
            }

            const submitData = {
                ...this.Details,
                testUserSignature: this.testUserSignature, // 检测人签名文件ID
                checkUserSignature: this.checkUserSignature // 核对人签名文件ID
            };
            // 确保包含基础ID
            if (!submitData.opJczxFeedResultBaseId && this.Details.opJczxFeedResultBaseId) {
                submitData.opJczxFeedResultBaseId = this.Details.opJczxFeedResultBaseId;
            }

            try {
                let result;
                if (this.isRec) {
                    this.Details.itemId = this.$route.params.jcList[0].IDD;
                    result = await feedwatertask(submitData);
                    this.isRec = false;
                    this.isShow = true;
                } else if (this.isShow) {
                    result = await feedwatertaskUp(submitData);
                }

                if (result.code == 200) {
                    // 更新本地数据，特别是 opJczxFeedResultBaseId
                    if (result.data && result.data.opJczxFeedResultBaseId) {
                        this.Details.opJczxFeedResultBaseId = result.data.opJczxFeedResultBaseId;
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
                    //首次保存后，手动将状态更新为 '1' (待提交)
                    // 这样 v-if="isShow && Details.status == '1'" 才能正确显示按钮
                    if (!this.Details.status) { // 仅在首次创建成功时(status为空)设置
                        this.Details.status = '1';
                    }

                    // 只有在 preventNavigation 为 true 时（即点击保存按钮时）才显示提示
                    if (preventNavigation) {
                        this.$message.success('保存成功');
                    }

                    // 无论如何都返回成功结果
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
            if (this.Details.status == '1') {
                console.log('检测人1111111111111111111111111111111111111111')
            } else if (this.Details.status == '2') {
                console.log('核对人222222222222222222222222222222222222222222222')
            }
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

        // 校对方法
        async submitCheck() {
            // 1. 先调用保存逻辑 (submitForm会返回 { success: true/false })
            // 传入 true 表示 "只保存，不提示，不跳转"
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

            // 4. 检查是否有基础ID (保存成功后必定存在)
            const baseId = this.Details.opJczxFeedResultBaseId;
            if (!baseId) {
                this.$message.error('保存成功但未获取到任务ID，无法校对');
                return;
            }

            // 5. 调用校对接口
            try {
                const submitData = {
                    opJczxFeedResultBaseId: baseId,
                    checkUserSignature: this.checkUserSignature
                };

                const res = await saveCheck(submitData);
                if (res.code === 200) {
                    this.$message.success('校对成功');
                    // 6. 成功后返回列表
                    this.$router.push('/jczxFeedResultBasePad');

                } else {
                    this.$message.error(res.msg || '校对失败');
                }
            } catch (error) {
                console.error('校对失败:', error);
                this.$message.error('校对接口调用失败');
            }
        },


        // 精度格式化方法
        formatPrecision(value) {
            if (value === null || value === undefined || value === '') {
                return '';
            }
            if (value === null || value === undefined || value === '') return '';
            // 优先取后台配置的小数位，没有就用 3 位
            const dp = this.Details.decimalPlaces ? parseInt(this.Details.decimalPlaces) : 3;
            return new Decimal(value).toFixed(dp);   // toFixed 会自动补 0

            // let num = new Decimal(value);

            // // 优先使用小数位，其次使用有效数字位
            // if (this.Details.decimalPlaces) {
            //     const decimalPlaces = parseInt(this.Details.decimalPlaces);
            //     return num.toDecimalPlaces(decimalPlaces).toString();
            // } else if (this.Details.significantDigits) {
            //     const significantDigits = parseInt(this.Details.significantDigits);
            //     return num.toSignificantDigits(significantDigits).toString();
            // } else {
            //     // 默认保留2位小数
            //     return num.toDecimalPlaces(2).toString();
            // }
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

        /** 复检样品 */
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

/* 样品中间分割线加粗 */
// .sample-split>td {
//     border-top: 2px solid #606266 !important; // 想再粗就改 3px
// }

/* 第一个样品块不加上边框 */
.first-sample>td {
    border-top: none !important;
}

/* 其余样品块加粗上边框 */
.sample-split:not(.first-sample)>td {
    border-top: 1px solid #606266 !important;
}
</style>