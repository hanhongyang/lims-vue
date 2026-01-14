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
                            <td colspan="2">检测地点</td>
                            <td>20%甲醇/水配制批次</td>
                            <td>检测依据</td>
                            <td>环境温度/湿度(℃/%)</td>
                        </tr>
                        <tr>
                            <td>
                                <el-date-picker v-model="Details.testDate" type="date" class="custom-padding"
                                    :editable="false" :readonly="Details.status == '2' || isJCRY">
                                </el-date-picker>
                            </td>
                            <td><el-input v-model="Details.sjhph"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNameOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNoOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td colspan="2"><el-input v-model="testLocationOne"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="Details.xxspzpc"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="Details.testBasis"
                                    :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td>
                                <el-input v-model="Details.temperature" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>/
                                <el-input v-model="Details.humidity" class="tembum"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">振荡器提取时间</td>
                            <td colspan="3">静置时间</td>
                            <td colspan="3">反应时间</td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <el-input v-model="oneBeforeTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input> :
                                <el-input v-model="oneBeforeTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>-
                                <el-input v-model="oneAfterTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                                :
                                <el-input v-model="oneAfterTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td colspan="3">
                                <el-input v-model="twoBeforeTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input> :
                                <el-input v-model="twoBeforeTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>-
                                <el-input v-model="twoAfterTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                                :
                                <el-input v-model="twoAfterTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                            <td colspan="3">
                                <el-input v-model="threeBeforeTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input> :
                                <el-input v-model="threeBeforeTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>-
                                <el-input v-model="threeAfterTimeLeft" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input> :
                                <el-input v-model="threeAfterTimeRight" style="width: 50px;"
                                    :readonly="Details.status == '2' || isJCRY"></el-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="9" style="padding:0;border:0">
                                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                    <tbody>
                                        <tr v-if="formulaTipsList">
                                            <td colspan="10" style="border:0;padding:0;text-align:left">
                                                <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList"
                                                    type="warning" :closable="false" show-icon>
                                                </el-alert>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>管号</td>
                                            <td>样品编号</td>
                                            <td>样品名称</td>
                                            <td>试样质量 m（g）</td>
                                            <td>20%甲醇/水体积(mL)</td>
                                            <td>待测液体积(uL)</td>
                                            <td colspan="2">检测结果</td>
                                            <td>鲜样中结果</td>
                                            <td>操作</td>
                                        </tr>

                                        <template v-for="(item, index) in Details.infoList">
                                            <tr :key="`row-${index}`" class="sample-split"
                                                :class="{ 'first-sample': index === 0 }">
                                                <td><el-input v-model="item.clmh"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.sampleNo"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td><el-input v-model="item.sampleName"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.m" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'm')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.jcstj" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'jcstj')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.dcytj" inputmode="decimal"
                                                        @input="onNumberInput($event, item, 'dcytj')"
                                                        :readonly="Details.status == '2' || isJCRY"></el-input>
                                                </td>
                                                <td colspan="2">
                                                    <!-- 阴/阳单选 -->
                                                    <el-radio-group v-model="item.jcjg"
                                                        :readonly="Details.status == '2' || isJCRY"
                                                        @change="val => { item.showRangeSel = !!val; item.jcjgfw = ''; }">
                                                        <el-radio label="阳性">阳性</el-radio>
                                                        <el-radio label="阴性">阴性</el-radio>
                                                    </el-radio-group>

                                                    <el-select v-if="item.showRangeSel" v-model="item.jcjgfw"
                                                        placeholder="请选择范围" size="mini"
                                                        style="width:120px;margin-top:6px;margin-left: 10px;">
                                                        <!-- 关键：根据 jcjg 动态渲染选项 -->
                                                        <el-option v-for="opt in rangeOptions[item.jcjg] || []"
                                                            :key="opt" :label="opt" :value="opt" />
                                                    </el-select>
                                                </td>
                                                <td>
                                                    <el-input v-model="item.xyzhl"></el-input>
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
                                            <td colspan="2">备注</td>
                                            <td colspan="8" style="text-align:left">
                                                检出限&lt;2000μg/kg
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
                <el-table-column type="selection" align="center" :selectable="checkSelectable" reserve-selection></el-table-column>
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
// *** 逻辑修改：导入 retest, testSubmit ***
import { feedwatertask, feedwatertaskUp, listTask, saveCheck, saveExamine, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue';

export default {
    name: "melamine",
    components: {
        "electronic": electronic,
    },
    data() {
        return {
            isJCRY: false,
            // 时间输入变量
            oneBeforeTimeLeft: '',
            oneBeforeTimeRight: '',
            oneAfterTimeLeft: '',
            oneAfterTimeRight: '',
            twoBeforeTimeLeft: '',
            twoBeforeTimeRight: '',
            twoAfterTimeLeft: '',
            twoAfterTimeRight: '',
            threeBeforeTimeLeft: '',
            threeBeforeTimeRight: '',
            threeAfterTimeLeft: '',
            threeAfterTimeRight: '',

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
            instrumentNameOne: '',
            instrumentNoOne: '',
            testLocationOne: '',
            signTypes: {
                检测人: '',
                核对人: ''
            },
            currentSignType: '',
            testUserSignature: '',
            checkUserSignature: '',
        };
    },
    created() {
        // 初始化数据
    },
    // *** 逻辑修改：新增 computed ***
    computed: {
        formulaTipsList() {
            const tips = [];
            (this.Details.infoList || []).forEach((row, idx) => {
                const rowEmpty = [];
                if (!row.m) rowEmpty.push('试样质量 m');
                if (!row.jcstj) rowEmpty.push('20%甲醇/水体积');
                if (!row.dcytj) rowEmpty.push('待测液体积');
                if (row.jcjg === null || row.jcjg === undefined) rowEmpty.push('检测结果');

                if (rowEmpty.length) {
                    tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
                }
            });
            return tips.length ? tips.join('；') : '';
        },
        rangeOptions() {
            // 阴、阳分别给什么范围
            return {
                阴性: ['<2000μg/kg', '<1000μg/kg'],
                阳性: ['>2000μg/kg', '>1000μg/kg']
            };
        }
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
            // 转换检测结果数据类型
            // const convertedJcList = jcList.map(item => ({
            //     ...item,
            //     jcjg: item.jcjg === "true" || item.jcjg === true
            // }));
            this.Details.infoList = jcList
            this.Details.itemId = this.$route.params.jcList[0].IDD
            this.isShow = false
            this.isRec = true
            this.$set(this.Details, 'testDate', today)
        } else if (this.$route.params.SjtaskInfo) {
            this.dqIDHD()
            const sjTaskInfo = this.$route.params.SjtaskInfo;

            // 转换检测结果数据类型
            // if (sjTaskInfo.infoList) {
            //     sjTaskInfo.infoList = sjTaskInfo.infoList.map(item => ({
            //         ...item,
            //         jcjg: item.jcjg === "true" || item.jcjg === true
            //     }));
            // }

            this.Details = sjTaskInfo;
            this.isShow = true
            this.isRec = false
            if (this.$route.params.isJCRY) {
                this.isJCRY = this.$route.params.isJCRY
                console.log('检测人员查看详情', this.isJCRY)
            }
            // *** 逻辑修改：加载签名 ***
            if (this.$route.params.SjtaskInfo.testUserSignature) {
                downloadFile(this.$route.params.SjtaskInfo.testUserSignature).then((res) => {
                    this.signTypes.检测人 = URL.createObjectURL(res)
                    this.testUserSignature = this.Details.testUserSignature;
                })
            }
            if (this.$route.params.SjtaskInfo.checkUserSignature) {
                downloadFile(this.$route.params.SjtaskInfo.checkUserSignature).then((res1) => {
                    this.signTypes.核对人 = URL.createObjectURL(res1)
                    this.checkUserSignature = this.Details.checkUserSignature;
                })
            }
        } else if (this.$route.query.SjtaskInfo1) { // *** 逻辑修改：兼容 query 方式 ***
            const sjTaskInfo = this.$route.query.SjtaskInfo1;
            if (sjTaskInfo.infoList) {
                sjTaskInfo.infoList = sjTaskInfo.infoList.map(item => ({
                    ...item,
                    jcjg: item.jcjg === "true" || item.jcjg === true
                }));
            }
            this.Details = sjTaskInfo;
            this.isShow = true
            this.isRec = false
            if (this.Details.testUserSignature) {
                downloadFile(this.Details.testUserSignature).then((res) => {
                    this.signTypes.检测人 = URL.createObjectURL(res)
                    this.testUserSignature = this.Details.testUserSignature;
                })
            }
            if (this.Details.checkUserSignature) {
                downloadFile(this.Details.checkUserSignature).then((res1) => {
                    this.signTypes.核对人 = URL.createObjectURL(res1)
                    this.checkUserSignature = this.Details.checkUserSignature;
                })
            }
        }
        else {
            this.$message({
                message: '参数错误，请返回任务列表重新操作',
                type: 'warning',
                duration: 2000
            });
            this.$router.push('/jczxFeedResultBasePad')
            return
        }
        // 确保所有样品数据都有必要的字段

        this.isPadPc()
        this.initData();
        // 初始化范围
        // this.Details.infoList.forEach(row => {
        //     if (row.jcjgfw === undefined) this.$set(row, 'jcjgfw', '');
        //     if (row.showRangeSel === undefined) this.$set(row, 'showRangeSel', false);
        // });
        //  修复后的初始化范围代码
        this.Details.infoList.forEach(row => {
            // 初始化 jcjgfw
            if (row.jcjgfw === undefined) {
                this.$set(row, 'jcjgfw', '');
            }
            // 根据 jcjg 是否有值来决定是否显示范围选择器
            // 如果 jcjg 为 "阳性" 或 "阴性"，则显示范围下拉框
            const shouldShowRange = row.jcjg === '阳性' || row.jcjg === '阴性';
            this.$set(row, 'showRangeSel', shouldShowRange);
        });
        // (JJ17原始逻辑中没有 loadSignatureImages, 已在 SjtasInfo 逻辑中补充)
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
        // *** 逻辑修改：新增必填校验 ***
        validateEmpty() {
            const empty = [];
            /* ---- 逐行样品字段 ---- */
            (this.Details.infoList || []).forEach((row, idx) => {
                if (!row.m) empty.push(`第${idx + 1}行试样质量 m`);
                if (!row.jcstj) empty.push(`第${idx + 1}行20%甲醇/水体积`);
                if (!row.dcytj) empty.push(`第${idx + 1}行待测液体积`);
                // 检查 jcjg 是否为 null 或 undefined
                if (row.jcjg === null || row.jcjg === undefined) {
                    empty.push(`第${idx + 1}行检测结果`);
                }
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
            // 初始化时间数据
            if (this.Details.zdqtqsj) {
                const zdqtqsj = this.Details.zdqtqsj.split(/[-:]/);
                if (zdqtqsj.length === 4) {
                    this.oneBeforeTimeLeft = zdqtqsj[0] || '';
                    this.oneBeforeTimeRight = zdqtqsj[1] || '';
                    this.oneAfterTimeLeft = zdqtqsj[2] || '';
                    this.oneAfterTimeRight = zdqtqsj[3] || '';
                }
            }
            if (this.Details.jzsjd) {
                const jzsjd = this.Details.jzsjd.split(/[-:]/);
                if (jzsjd.length === 4) {
                    this.twoBeforeTimeLeft = jzsjd[0] || '';
                    this.twoBeforeTimeRight = jzsjd[1] || '';
                    this.twoAfterTimeLeft = jzsjd[2] || '';
                    this.twoAfterTimeRight = jzsjd[3] || '';
                }
            }
            if (this.Details.fysj) {
                const fysj = this.Details.fysj.split(/[-:]/);
                if (fysj.length === 4) {
                    this.threeBeforeTimeLeft = fysj[0] || '';
                    this.threeBeforeTimeRight = fysj[1] || '';
                    this.threeAfterTimeLeft = fysj[2] || '';
                    this.threeAfterTimeRight = fysj[3] || '';
                }
            }
            // 初始化仪器和检测地点数据
            const Name = (this.Details.instrumentName || '').split(',');
            this.instrumentNameOne = Name[0] || '';

            const No = (this.Details.instrumentNo || '').split(',');
            this.instrumentNoOne = No[0] || '';

            const Location = (this.Details.testLocation || '').split(',');
            this.testLocationOne = Location[0] || '';
        },
        updateDetails() {
            this.Details.instrumentName = this.instrumentNameOne;
            this.Details.instrumentNo = this.instrumentNoOne;
            this.Details.testLocation = this.testLocationOne;
        },
        onNumberInput(val, row, key) {
            // 过滤掉除数字、小数点以外的字符
            row[key] = val.replace(/[^0-9.]/g, '')
                // 多个小数点只保留第一个
                .replace(/(\..*)\./g, '$1')
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
                        "clmh": "", // 管号
                        "m": "", // 试样质量
                        "jcstj": "", // 甲醇/水体积
                        "dcytj": "", // 待测液体积
                        "jcjg": null, // 检测结果
                        "xyzhl": "", // 鲜样中结果
                        rangeVal: '',        // 范围值
                        showRangeSel: false  // 是否展开范围下拉
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

        // *** 逻辑修改：新增 saveForm ***
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

            // 组装时间数据
            this.Details.zdqtqsj = `${this.oneBeforeTimeLeft}:${this.oneBeforeTimeRight}-${this.oneAfterTimeLeft}:${this.oneAfterTimeRight}`;
            this.Details.jzsjd = `${this.twoBeforeTimeLeft}:${this.twoBeforeTimeRight}-${this.twoAfterTimeLeft}:${this.twoAfterTimeRight}`;
            this.Details.fysj = `${this.threeBeforeTimeLeft}:${this.threeBeforeTimeRight}-${this.threeAfterTimeLeft}:${this.threeAfterTimeRight}`;
            this.updateDetails();
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
                    // 手动拿到itemId传入
                    this.Details.itemId = this.$route.params.jcList[0].IDD
                    result = await feedwatertask(submitData);
                } else if (this.isShow) {
                    result = await feedwatertaskUp(submitData);
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

        // (JJ17 原始逻辑中没有 loadSignatureImages, 已在 mounted 中补充)

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

/* 时间输入框样式优化 */
.time-input {
    width: 120px !important;
    margin: 0 2px;
}

/* 检测结果单选框样式 */
.jcjg-radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

.jcjg-radio-group .el-radio {
    margin: 0 8px;
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