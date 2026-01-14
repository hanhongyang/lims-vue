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
              <td colspan="2">环境温湿度(℃/%)</td>
              <td>主要仪器名称</td>
              <td><el-input v-model="instrumentNameOne" updateDetails
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
              <td><el-input v-model="instrumentNameTwo" updateDetails
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
              <td colspan="2">检测地点</td>
              <td>检测依据</td>
            </tr>
            <tr>
              <td><el-date-picker v-model="Details.testDate" type="date" class="custom-padding" :editable="false">
                </el-date-picker></td>
              <td colspan="2"><el-input v-model="Details.temperature" class="tembum"
                  :readonly="Details.status == '2' || isJCRY"></el-input>/<el-input v-model="Details.humidity"
                  class="tembum" :readonly="Details.status == '2' || isJCRY"></el-input></td>
              <td>仪器编号</td>
              <td><el-input v-model="instrumentNoOne" :readonly="Details.status == '2' || isJCRY"></el-input></td>
              <td><el-input v-model="instrumentNoTwo" :readonly="Details.status == '2' || isJCRY"></el-input></td>
              <td><el-input v-model="testLocationOne" :readonly="Details.status == '2' || isJCRY"></el-input></td>
              <td><el-input v-model="testLocationTwo" :readonly="Details.status == '2' || isJCRY"></el-input></td>
              <td><el-input v-model="Details.testBasis" :readonly="Details.status == '2' || isJCRY"></el-input></td>
            </tr>
            <tr>
              <td colspan="2">主要使用试剂/(配制)批号</td>
              <td colspan="7">丙酮<el-input v-model="sjhphOne" style="width:130px"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
                中性洗涤剂<el-input v-model="sjhphTwo" style="width:130px"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
                淀粉酶<el-input v-model="sjhphThree" style="width:130px"
                  :readonly="Details.status == '2' || isJCRY"></el-input>无水亚硫酸钠<el-input v-model="sjhphFour"
                  style="width:130px" :readonly="Details.status == '2' || isJCRY"></el-input></td>
            </tr>
            <tr>
              <td colspan="9" style="padding:0;border:0">
                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                  <tbody>
                    <tr v-if="formulaTipsList">
                      <td colspan="11" style="border:0;padding:0;text-align:left">
                        <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList" type="warning" :closable="false"
                          show-icon>
                        </el-alert>
                      </td>
                    </tr>
                    <tr>
                      <td>样品编号</td>
                      <td>样品名称</td>
                      <td>滤袋号</td>
                      <td>滤袋质量 m₁（g）</td>
                      <td>试样质量 m（g）</td>
                      <td>袋+残渣总质量 m<sub>2</sub>（g）</td>
                      <td>NDF 含量 x（%）</td>
                      <td>平均值(g/kg)</td>
                      <td>相对偏差(g/kg)</td>
                      <td>鲜样中中 NDF 含量 (g/kg)</td>
                      <td>操作</td>
                    </tr>
                    <template v-for="(item, index) in Details.infoList">
                      <tr :key="`row1-${index}`" class="sample-split" :class="{ 'first-sample': index === 0 }">
                        <td rowspan="2"><el-input v-model="item.sampleNo"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td rowspan="2"><el-input v-model="item.sampleName"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td><el-input v-model="item.ldh" :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                        <td><el-input v-model="item.m1" inputmode="decimal" @input="onNumberInput($event, item, 'm1')"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                        <td><el-input v-model="item.m" inputmode="decimal" @input="onNumberInput($event, item, 'm')"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td><el-input v-model="item.m2" inputmode="decimal" @input="onNumberInput($event, item, 'm2')"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                        <td><el-input :value="item.x" readonly @blur="updateCompareValues(item)"></el-input></td>
                        <td rowspan="2"><el-input v-model="item.average" inputmode="decimal" readonly></el-input></td>
                        <td rowspan="2"><el-input v-model="item.absoluteDifference" inputmode="decimal"
                            readonly></el-input></td>
                        <td rowspan="2"><el-input v-model="item.xyzhl" inputmode="decimal" readonly></el-input></td>
                        <td rowspan="2">
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSample(index)"
                            v-if="isRec">删除</el-button>
                          <template v-if="isShow">
                            <el-button type="warning" icon="el-icon-refresh" size="mini" @click="retestSample(index)"
                              v-if="item.isReset == 0 || item.isReset == '0'">复检</el-button>

                            <span v-if="item.isReset == 1 || item.isReset == '1'"
                              style="color: #E6A23C; font-size: 12px;">
                              已申请复检
                            </span>
                          </template>
                        </td>
                      </tr>
                      <tr :key="`row2-${index}`">
                        <td><el-input v-model="item.compareLdh" :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                        <td><el-input v-model="item.compareM1" inputmode="decimal"
                            @input="onNumberInput($event, item, 'compareM1')"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td><el-input v-model="item.compareM" inputmode="decimal"
                            @input="onNumberInput($event, item, 'compareM')"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td><el-input v-model="item.compareM2" inputmode="decimal"
                            @input="onNumberInput($event, item, 'compareM2')"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                        <td><el-input :value="item.compareX" readonly @blur="updateCompareValues(item)"></el-input></td>
                      </tr>
                    </template>
                    <tr v-if="formulaTips">
                      <td colspan="11" style="border:0;padding:0">
                        <el-alert title="以下字段为空，公式无法计算：" :description="formulaTips" type="warning" :closable="false"
                          show-icon>
                        </el-alert>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">计算公式</td>
                      <td colspan="10">
                        <div class="formula-container">
                          ADF含量X（%） =
                          <span class="math-formula">
                            <span class="math-fraction">
                              <span class="math-numerator">
                                <span class="math-bracket-left"></span>m<span class="math-sub">2</span>— (m<span
                                  class="math-sub">1</span>
                                × C<span class="math-sub">1</span>)
                              </span>
                              <span class="math-fraction-line"></span>
                              <span class="math-denominator">m</span>
                            </span>
                            <span class="math-times">×</span> 100,
                          </span>

                          <div class="formula-note" style="margin-top: 6px; font-size: 14px; white-space: normal;">
                            校正因子C₁ = <span class="frac">
                              <span class="num">m<sup>A</sup></span>
                              <span class="den">m<sub>0</sub></span>
                            </span>
                            <span style="margin-left:10px">
                              (m₀=处理前滤袋质量<el-input v-model="Details.clqglzl" inputmode="decimal" style="width:100px"
                                @input="onNumberInput($event, Details, 'clqglzl')"></el-input>g，
                              m<sub>A</sub>=处理后滤袋质量<el-input v-model="Details.clhglzl" inputmode="decimal"
                                style="width:100px" @input="onNumberInput($event, Details, 'clhglzl')"></el-input>g，
                              校正因子C₁<el-input :value="computeC1(item)" style="width:100px" readonly
                                @blur="updateCompareValues(item)"></el-input>)
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">允许相对偏差</td>
                      <td colspan="10" style="text-align:left">NDF 含量≤10%，允许相对偏差≤5%;NDF 含量&lt;10%，允许相对偏差≤3%。</td>
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
            <img v-if="signTypes.检测人" :src="signTypes.检测人" style="width:300px;height:150px;vertical-align:top">
            <el-button @click="qzclick('检测人')"
              v-if="isRec || (isShow && Details.status == '1' || Details.status == '6')">签字</el-button>
          </el-col>
          <el-col :span="10" :offset="2" v-if="isShow">
            <span>核对人:</span>
            <img v-if="signTypes.核对人" :src="signTypes.核对人" style="width:300px;height:150px;vertical-align:top">
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
        <electronic @closeCanvas="closeCanvas" :showCanvas="videoif" @savecanva="savecanva" :SignatureImg="SignatureImg"
          :typename="currentSignType" v-if="videoif" @signature-done="onSignatureDone" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
// *** 逻辑修改：导入 retest, testSubmit, saveCheck (替换 JD) ***
import { feedwatertask, feedwatertaskUp, listTask, XZPic, saveCheck, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue'
import Decimal from 'decimal.js';
import { downloadFile } from "@/api/common/common";
import csfhyMixinone from "@/views/Feedproject/csfhyMixinone";
export default {
  name: "CrudeNDFfeed",
  mixins: [csfhyMixinone],
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
      signatureImage: '',
      signTypes: {
        检测人: '',
        核对人: ''
      },
      currentSignType: '',
      sjhphOne: '',
      sjhphTwo: '',
      sjhphThree: '',
      sjhphFour: '',
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
        if (!row.m1 || !row.compareM1) rowEmpty.push('滤袋质量 m₁');
        if (!row.m || !row.compareM) rowEmpty.push('试样质量 m');
        if (!row.m2 || !row.compareM2) rowEmpty.push('袋+残渣总质量 m₂');


        if (rowEmpty.length) {
          tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
        }
      });

      /* ---------- 3. 返回 ---------- */
      return tips.length ? tips.join('；') : '';
    },
    formulaTips() {
      const empty = [];
      if (!this.Details.clqglzl) empty.push('处理前滤袋质量');
      if (!this.Details.clhglzl) empty.push('处理后滤袋质量');
      return empty.length ? empty.join('、') : '';
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
    } else if (this.$route.query.SjtaskInfo1) {
      this.Details = this.$route.query.SjtaskInfo1
      this.isShow = true
      this.isRec = false
      // *** 逻辑修改：兼容 query 方式 ***
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
    } else {
      this.$message.error('未获取到任务信息，请返回任务列表重新进入！')
      return
    }
    // 确保所有样品数据都有必要的字段

    this.isPadPc()
    this.initTimes();
    // 在初始化后查询初水分数据并计算鲜样含量
    this.$nextTick(() => {
      // *** 逻辑修改：确保 infoList 存在 ***
      if (this.Details.infoList && this.Details.infoList.length) {
        this.Details.infoList.forEach(item => {
          this.updateCompareValues(item);
        });
      }
      setTimeout(() => {
        this.loadCsfhyDataAndCalculate();
      }, 100);
    });
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
    /* 通用：收集所有空字段 */
    validateEmpty() {
      const empty = [];

      /* ---- 全局字段 ---- */
      if (!this.Details.clqglzl) empty.push('处理前滤袋质量');
      if (!this.Details.clhglzl) empty.push('处理后滤袋质量');

      /* ---- 逐行样品字段 ---- */
      (this.Details.infoList || []).forEach((row, idx) => {
        if (!row.m1) empty.push(`第${idx + 1}行滤袋质量 m₁`);
        if (!row.m) empty.push(`第${idx + 1}行试样质量 m`);
        if (!row.m2) empty.push(`第${idx + 1}行袋+残渣总质量 m₂`);
        if (!row.compareM1) empty.push(`第${idx + 1}行对比滤袋质量 m₁`);
        if (!row.compareM) empty.push(`第${idx + 1}行对比试样质量 m`);
        if (!row.compareM2) empty.push(`第${idx + 1}行对比袋+残渣总质量 m₂`);
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
      // 试剂批号
      const sjhphTk = (this.Details.sjhph || '').split(',');
      this.sjhphOne = sjhphTk[0] || '';
      this.sjhphTwo = sjhphTk[1] || '';
      this.sjhphThree = sjhphTk[2] || '';
      this.sjhphFour = sjhphTk[3] || '';
      // 仪器
      const Name = (this.Details.instrumentName || '').split(',');
      this.instrumentNameOne = Name[0] || '';
      this.instrumentNameTwo = Name[1] || '';
      // 仪器编号
      const No = (this.Details.instrumentNo || '').split(',');
      this.instrumentNoOne = No[0] || '';
      this.instrumentNoTwo = No[1] || '';
      // 检测地点
      const Location = (this.Details.testLocation || '').split(',');
      this.testLocationOne = Location[0] || '';
      this.testLocationTwo = Location[1] || '';
    },
    updateDetails() {
      this.Details.sjhph = `${this.sjhphOne},${this.sjhphTwo},${this.sjhphThree},${this.sjhphFour}`;
      this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
      this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
      this.Details.testLocation = `${this.testLocationOne},${this.testLocationTwo}`;
    },
    // *** 逻辑修改：onNumberInput 更新 ***
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

      // *** 逻辑修改：全局字段需要特殊处理 ***
      if (key === 'clqglzl' || key === 'clhglzl') {
        this.$set(this.Details, key, cleaned);
      } else {
        row[key] = cleaned;
      }

      this.$nextTick(() => {
        // *** 逻辑修改：如果修改的是全局 C1 因子, 必须更新所有行 ***
        if (key === 'clqglzl' || key === 'clhglzl') {
          if (this.Details.infoList && this.Details.infoList.length) {
            this.Details.infoList.forEach(item => {
              this.updateCompareValues(item);
            });
          }
        } else {
          this.updateCompareValues(row);
        }
      });
    },
    // 计算X值的方法
    computex(item) {
      const c1Raw = this.computeC1();
      if (c1Raw === '' || c1Raw === null) return ''; // 如果C1没算出来，先不计算
      const C1 = new Decimal(c1Raw);
      // 检查必需的值是否都已输入
      const requiredValues = [item.m1, item.m, item.m2]; // *** 逻辑修改：C1 已在外部检查 ***
      if (!this.hasRequiredValues(requiredValues)) {
        this.$set(item, 'x', ''); // *** 逻辑修改：确保清空 ***
        return '';
      }

      try {
        const m2 = new Decimal(item.m2);
        const m1 = new Decimal(item.m1);
        const m = new Decimal(item.m);

        // 检查分母是否为0
        if (m.equals(0)) {
          this.$set(item, 'x', '0'); // *** 逻辑修改：确保赋值 ***
          return '0';
        }
        const numerator = m1.times(C1)
        const numerator1 = m2.minus(numerator)
        const numerator2 = numerator1.dividedBy(m);
        const result = numerator2.times(100);

        // const formattedResult = this.formatPrecision(result);
        const formattedResult = this.formatPrecision(result, 'x');;
        this.$set(item, 'x', formattedResult); // *** 逻辑修改：确保保存 ***
        return formattedResult;
      } catch (error) {
        console.error('计算X值错误:', error);
        this.$set(item, 'x', '');
        return '';
      }
    },
    // 计算对比X值的方法
    computeCompareX(item) {
      const c1Raw = this.computeC1();
      if (c1Raw === '' || c1Raw === null) return ''; // 如果C1没算出来，先不计算
      const C1 = new Decimal(c1Raw);
      // 检查必需的值是否都已输入
      // *** 逻辑修改：compareM 字段名修正 ***
      const requiredValues = [item.compareM1, item.compareM, item.compareM2];
      if (!this.hasRequiredValues(requiredValues)) {
        this.$set(item, 'compareX', ''); // *** 逻辑修改：确保清空 ***
        return '';
      }

      try {
        const m2 = new Decimal(item.compareM2);
        const m1 = new Decimal(item.compareM1);
        const m = new Decimal(item.compareM);

        // 检查分母是否为0
        if (m.equals(0)) {
          this.$set(item, 'compareX', '0'); // *** 逻辑修改：确保赋值 ***
          return '0';
        }

        const numerator = m1.times(C1)
        const numerator1 = m2.minus(numerator)
        const numerator2 = numerator1.dividedBy(m);
        const result = numerator2.times(100);

        // const formattedResult = this.formatPrecision(result);
        const formattedResult = this.formatPrecision(result, 'x');
        this.$set(item, 'compareX', formattedResult); // *** 逻辑修改：确保保存 ***
        return formattedResult;
      } catch (error) {
        console.error('计算X值错误:', error);
        this.$set(item, 'compareX', '');
        return '';
      }
    },
    computeC1(item) {
      // 检查必需的值是否都已输入
      const requiredValues = [this.Details.clqglzl, this.Details.clhglzl,];
      if (!this.hasRequiredValues(requiredValues)) {
        return '';
      }
      try {
        const q = new Decimal(this.Details.clqglzl);
        const h = new Decimal(this.Details.clhglzl);


        // 检查分母是否为0
        if (q.equals(0)) {
          return '0';
        }
        return h.dividedBy(q).toDecimalPlaces(4).toString();

        // const result = h.dividedBy(q);
        // return this.formatPrecision(result);
      } catch (error) {
        console.error('计算X值错误:', error);
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
        // NDF 含量：2 位小数，强制补 0
        return num.toFixed(2);
      }
      if (field === 'average') {
        // 平均值：1 位小数，强制补 0
        return num.toFixed(1);
      }
      if (field === 'absoluteDifference') {
        // 相对偏差：2 位小数，强制补 0
        return num.toFixed(2);
      }
      if (field === 'xyzhl') {
        // 鲜样中 NDF 含量：1 位小数，强制补 0
        return num.toFixed(1);
      }
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
    updateCompareValues(item) {
      // *** 逻辑修改：确保 item.x/compareX 被赋值 ***
      item.x = this.computex(item);
      item.compareX = this.computeCompareX(item);

      this.$nextTick(() => {
        const x = item.x;
        const compareX = item.compareX;

        if (x !== '' && compareX !== '' && x !== null && compareX !== null) {
          const avg = new Decimal(x).plus(new Decimal(compareX)).dividedBy(2);
          const absoluteDiff = Decimal.abs(new Decimal(x).minus(new Decimal(compareX)));
          // *** 逻辑修改：使用 avg 计算相对相差 ***
          const relativeDiff = avg.equals(0) ? new Decimal(0) : absoluteDiff.dividedBy(avg).times(100);
          const relDiff = avg.isZero()
            ? new Decimal(0)
            : Decimal.abs(new Decimal(x).minus(avg)).dividedBy(avg).times(100);
          this.$set(item, 'absoluteDifference', relDiff ? relDiff.toFixed(2) : '');
          // this.$set(item, 'average', this.formatPrecision(avg)); // *** 逻辑修改：使用精度格式化 ***
          this.$set(item, 'average', this.formatPrecision(avg, 'average'));
          // this.$set(item, 'absoluteDifference', this.formatPrecision(relativeDiff, 'absoluteDifference'));

          // *** 逻辑修改：新增负数校验 ***
          const average_val = parseFloat(item.average);
          if ((new Decimal(x).lessThan(0)) || (new Decimal(compareX).lessThan(0)) || (!isNaN(average_val) && average_val < 0)) {
            const now = Date.now();
            if (now - this.lastWarningTime > this.warningThrottleMs) {
              this.$message.warning('计算结果为负数，请检查输入数据是否正确');
              this.lastWarningTime = now;
            }
          }
          // 2. 【修复：将 Mixin 调用移入】在平均值计算完成后，调用 Mixin 计算鲜样含量
          this.calculateFreshSampleForItem(item);

        } else {
          this.$set(item, 'average', '');
          this.$set(item, 'absoluteDifference', '');
          // 3. 【修复：确保清空】如果值不完整，也调用 Mixin 清空鲜样含量
          this.calculateFreshSampleForItem(item);
        }
      });
      // 计算鲜样含量
      this.calculateFreshSampleForItem(item);
    },
    qzclick(type) {
      this.currentSignType = type
      this.videoif = true
    },
    onSignatureDone({ type, data, fileId, close }) {
      this.signTypes[type] = data       // 根据类型写入对应变量
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
      //  this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
      //  return { success: false, error: '数据未填完整' }; // 返回失败
      //}

      // 提交前可再强制更新一遍，防止漏算
      this.Details.infoList.forEach(item => {
        this.updateCompareValues(item);
      });
      // 确保鲜样含量也重新计算
      if (this.cachedCsfhyData) {
        this.calculateFreshSample(this.cachedCsfhyData);
      }

      // *** 逻辑修改：调用 updateDetails ***
      this.updateDetails(); // 确保 instrumentName, sjhph 等字段被组合

      // *** 逻辑修改：合并签名ID ***
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

    // *** 逻辑修改：JDForm -> submitCheck ***
    async submitCheck() {
      const saveResult = await this.submitForm(true);
      if (!saveResult || !saveResult.success) {
        this.$message.error('数据保存失败，无法校对。请检查填写内容。');
        return;
      }
      if (!this.checkUserSignature) {
        this.$message.error('请先进行核对人签字');
        return;
      }
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
  max-width: 45%;
}

.HgTime {
  width: 100% !important;
  max-width: 60%;
}

.custom-padding ::v-deep {
  .el-input__inner {
    padding-right: 0;
    padding-left: 24px;
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