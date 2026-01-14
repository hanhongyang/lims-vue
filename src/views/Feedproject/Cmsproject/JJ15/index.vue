<template>
    <div class="app-container">
            <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px"
      @click="HDPada">返回检测任务列表</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addSample">增加样品</el-button>
        <div style="text-align: center;font-size: 20px;">{{ Details.modelNo }} {{ Details.modelName }}</div><br>
        <div class="stickytable">
            <div class="sticky-table" style="max-height: 72vh;">
                <table cellpadding="0" cellspacing="0" width="100%" id="exportTable" style="text-align: center;">
                    <tbody>
                        <tr>
                            <td>检测依据</td>
                            <td>主要仪器名称</td>
                            <td>仪器编号</td>
                            <td>检测地点</td>
                            <td colspan="2">计算公式</td>
                          </tr>
                        <tr>
                            <td rowspan="2"><el-input v-model="Details.testBasis"
                  :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNameArr[0]"
                  :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNoArr[0]"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
                            <td><el-input v-model="testLocationArr[0]"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
                            <td rowspan="2" colspan="2">
                                <div class="formula-container">
                                    试样风干物质含量f(%)=
                                    <span class="math-formula">
                                        <span class="math-fraction">
                                            <span class="math-numerator">
                                                m₃ - m₁
                                              </span>
                                            <span class="math-fraction-line"></span>
                                            <span class="math-denominator">
                                                m₂
                                              </span>
                                          </span>
                                        × 100;
                                      </span>
                                    <span>试样初水分含里M₁(%)=100-f</span>
                                  </div>
                              </td>

                          </tr>
                        <tr>
                            <td><el-input v-model="instrumentNameArr[1]"
                  :readonly="Details.status == '2' || isJCRY"></el-input></td>
                            <td><el-input v-model="instrumentNoArr[1]"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
                            <td><el-input v-model="testLocationArr[1]"
                  :readonly="Details.status == '2' || isJCRY"></el-input>
              </td>
                          </tr>
                        <tr>
                            <td colspan="6" style="padding:0;border:0">
                                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                                    <tbody>
                                                            <tr v-if="formulaTipsList">
                                            <td colspan="11" style="border:0;padding:0;text-align:left">
                                                <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList"  
                          type="warning" :closable="false" show-icon>
                                                  </el-alert>
                                              </td>
                                          </tr>
                                        <tr>
                                            <td>检测日期</td>
                                            <td>样品编号</td>
                                            <td>样品名称</td>
                                            <td>托盘号</td>
                                            <td>托盘重量 m₁（g）</td>
                                            <td>样品重 m₂（g）</td>
                                            <td>(盘+样)烘干重量 m₃（g）</td>
                                            <td>风干物质（%）</td>
                                            <td>初水分（%）</td>
                                            <td>烘干时间</td>
                      <td>操作</td>
                                         
                    </tr>
                                        <template v-for="(item, index) in Details.infoList">
                                            <tr :key="`row1-${index}`">
                                                <td><el-date-picker v-model="Details.testDate" type="date"  
                            class="custom-padding" :editable="false" :readonly="Details.status == '2' || isJCRY">
                                                    </el-date-picker></td>
                                                <td><el-input v-model="item.sampleNo"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                                                <td><el-input v-model="item.sampleName"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                                                <td><el-input v-model="item.clmh"
                            :readonly="Details.status == '2' || isJCRY"></el-input></td>
                                                <td><el-input v-model="item.m1" inputmode="decimal"  
                            @input="onNumberInput($event, item, 'm1')"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                                                <td><el-input v-model="item.m2" inputmode="decimal"  
                            @input="onNumberInput($event, item, 'm2')"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                                                <td><el-input v-model="item.m3" inputmode="decimal"  
                            @input="onNumberInput($event, item, 'm3')"
                            :readonly="Details.status == '2' || isJCRY"></el-input>
                        </td>
                                                <td>
                                                                              <el-input
                            :value="computeFengganWuzhi(item)" readonly></el-input>
                                                  </td>
                                                <td>
                                                                              <el-input :value="computeChushuifen(item)"
                            readonly></el-input>
                                                  </td>
                                                <td><el-input v-model="item.dryTimeBefore" class="HgTime"
                            :readonly="Details.status == '2' || isJCRY"></el-input>点~<el-input  
                            v-model="item.dryTimeAfter" class="HgTime"
                            :readonly="Details.status == '2' || isJCRY"></el-input>点
                        </td>
                                                                        <td>
                                                    <el-button type="danger" icon="el-icon-delete" size="mini"  
                            @click="deleteSample(index)" v-if="isRec">删除</el-button>
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
                                          </template>
                                      </tbody>
                                  </table>
                              </td>
                          </tr>
                      </tbody>
                  </table>

              </div>
          </div>

            <div class="footer" style="text-align:left;padding:5px;">
            <el-row>
                <el-col :span="10" :offset="2">
                    <span>检测人:</span>
                    <img v-if="signTypes.检测人" :src="signTypes.检测人" style="width:300px;height:150px;vertical-align:top">
                    <el-button @click="qzclick('检测人')" v-if="Details.status == '6'">签字</el-button>
                  </el-col>
                        <el-col :span="10" :offset="2" v-if="isShow">
                    <span>核对人:</span>
                    <img v-if="signTypes.核对人" :src="signTypes.核对人" style="width:300px;height:150px;vertical-align:top">
                              <el-button @click="qzclick('核对人')" v-if="Details.status == '2' && !isJCRY">签字</el-button>
                  </el-col>
              </el-row>
          </div>
                    <div class=" fixed-bottom">
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
           
      <electronic @closeCanvas="closeCanvas" :showCanvas="videoif" @savecanva="savecanva" :SignatureImg="SignatureImg"  
        :typename="currentSignType" v-if="videoif" @signature-done="onSignatureDone" />
         
    </el-dialog>

      </div>
</template>
<script>
import { downloadFile } from "@/api/common/common";
// *** 逻辑修改：导入 retest, testSubmit ***
import { feedwatertask, feedwatertaskUp, listTask, saveCheck, retest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue';
// (JJ15 不使用 mixin)
import { getTask } from "@/api/CentralLaboratory/task";
import Decimal from 'decimal.js'

export default {
  name: "JJ15",
  components: {
    "electronic": electronic,
  },
  data() {
    return {
      isJCRY: false,
      Details: {
        // 初始化Details结构，防止后续访问undefined
        infoList: [],
        modelNo: '',
        modelName: '',
        testBasis: '',
        instrumentName: '',
        instrumentNo: '',
        testLocation: '',

        testDate: null,
        itemId: '' // 确保 Details 中也有 itemId
      },
      /* 新增三个中间数组，专门给表格输入用 */
      instrumentNameArr: ['', ''],
      instrumentNoArr: ['', ''],
      testLocationArr: ['', ''],
      isPad: true,
      isRec: true, // 默认是新增
      isShow: false, // 默认不显示修改按钮
      testItemDialogVisible: false,
      testItemList: [],
      testItemQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        // isTest: '0',
        itemId: '' // 会在 initCsfhyPage 中设置
      },
      testItemTotal: 0,
      signtype: "",
      videoif: false,
      SignatureImg: "",
      itemId: '',
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
  },
  watch: {
    // 当 Details 从接口返回后，自动把字符串拆成数组
    Details: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) return;
        this.instrumentNameArr = (val.instrumentName || '').split(',').slice(0, 2);
        this.instrumentNoArr = (val.instrumentNo || '').split(',').slice(0, 2);
        this.testLocationArr = (val.testLocation || '').split(',').slice(0, 2);
      }
    }
  },
  // *** 逻辑修改：新增 computed ***
  computed: {
    formulaTipsList() {
      const tips = [];
      (this.Details.infoList || []).forEach((row, idx) => {
        const rowEmpty = [];
        if (!row.m1) rowEmpty.push(`第${idx + 1}行托盘重量 m₁`);
        if (!row.m2) rowEmpty.push(`第${idx + 1}行样品重 m₂`);
        if (!row.m3) rowEmpty.push(`第${idx + 1}行(盘+样)烘干重量 m₃`);

        if (rowEmpty.length) {
          tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
        }
      });
      return tips.length ? tips.join('；') : '';
    },
  },
  mounted() {

    this.initCsfhyPage();
    // this.dqID()
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
    /* 提交前把数组拼回字符串 */
    joinInstrumentFields() {
      this.Details.instrumentName = this.instrumentNameArr.join(',');
      this.Details.instrumentNo = this.instrumentNoArr.join(',');
      this.Details.testLocation = this.testLocationArr.join(',');
    },
    dqID() {
      usersign().then(res => {
        console.log('当前用户登录信息:', res.data.sign)
        console
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
        console.log('当前用户登录信息:', res.data.sign)
        if (this.Details.status == '2' && !this.isJCRY) {
          console.log('核对人')
          this.checkUserSignature = res.data.sign;
          downloadFile(this.checkUserSignature).then((res) => {
            this.signTypes.核对人 = URL.createObjectURL(res);
          })
        }
      });
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
      // 5. 修改为直接跳转到列表页
      this.$router.push('/feedTaskPad');
    },
    initData() {
      // (JJ15 没有 initData, 逻辑在 initCsfhyPage)
    },
    // *** 逻辑修改：新增必填校验 ***
    validateEmpty() {
      const empty = [];
      (this.Details.infoList || []).forEach((row, idx) => {
        if (!row.m1) empty.push(`第${idx + 1}行托盘重量 m₁`);
        if (!row.m2) empty.push(`第${idx + 1}行样品重 m₂`);
        if (!row.m3) empty.push(`第${idx + 1}行(盘+样)烘干重量 m₃`);
      });
      return empty; // 返回空字段数组
    },
    onNumberInput(val, row, key) {
      // 确保 row 存在
      if (row) {
        // 过滤掉除数字、小数点、负号以外的字符
        row[key] = val.replace(/[^-0-9.]/g, '')
          // 负号只能出现在最前面
          .replace(/(?!^)-/g, '')
          // 多个小数点只保留第一个
          .replace(/(\..*)\./g, '$1');
      }

      // 输入完成后自动触发计算
      this.$nextTick(() => {
        this.updateValues(row); // 确保调用这个方法来触发计算
      });
    },


    // 计算风干物质含量（%）的方法
    computeFengganWuzhi(item) {
      const requiredValues = [item.m1, item.m2, item.m3];
      if (!this.hasRequiredValues(requiredValues)) {
        const result = '';
        this.$set(item, 'fgwz', result);
        return '';
      }

      try {
        const m1 = new Decimal(item.m1); // 托盘重量
        const m2 = new Decimal(item.m2); // 样品重
        const m3 = new Decimal(item.m3); // (盘+样)烘干重量

        // 检查分母是否为0
        if (m2.equals(0)) {
          this.$set(item, 'fgwz', '0');
          return '0';
        }

        // 计算公式: (m₃ - m₁) / m₂ × 100
        const numerator = m3.minus(m1);
        const result = numerator.dividedBy(m2).times(100);

        const formattedResult = result.toFixed(2);
        // 保存计算结果到字段
        this.$set(item, 'fgwz', formattedResult);
        return formattedResult;
      } catch (error) {
        console.error('计算风干物质含量错误:', error);
        this.$set(item, 'fgwz', '');
        return '';
      }
    },

    // 计算初水分含量（%）的方法
    computeChushuifen(item) {
      const fgwz = this.computeFengganWuzhi(item);

      if (fgwz === '' || fgwz === null || fgwz === undefined) {
        this.$set(item, 'csf', '');
        return '';
      }

      try {
        const fgwzVal = new Decimal(fgwz);

        // 计算公式: 100 - f
        const result = new Decimal(100).minus(fgwzVal);

        const formattedResult = result.toFixed(2);
        // 保存计算结果到字段
        this.$set(item, 'csf', formattedResult);
        return formattedResult;
      } catch (error) {
        console.error('计算初水分含量错误:', error);
        this.$set(item, 'csf', '');
        return '';
      }
    },

    updateValues(item) {
      if (!item) return; // 增加安全检查
      // 重新计算所有值并保存到对应字段
      const fgwz = this.computeFengganWuzhi(item);
      const csf = this.computeChushuifen(item);

      // 确保计算结果保存到item中，供提交使用
      this.$set(item, 'fgwz', fgwz);
      this.$set(item, 'csf', csf);

      // *** 逻辑修改：新增负数校验 ***
      const fgwz_val = parseFloat(fgwz);
      const csf_val = parseFloat(csf);

      if ((!isNaN(fgwz_val) && fgwz_val < 0) ||
        (!isNaN(csf_val) && csf_val < 0)) {

        const now = Date.now();
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
      this.testItemQuery.queryCsf = '1'; // 化学法
      // 确保使用正确的 itemId 查询可选样品
      this.testItemQuery.itemId = this.Details.itemId;
      this.testItemQuery.entrustOrderType = '1'
      if (!this.testItemQuery.itemId) {
        console.error("无法获取 itemId，无法查询可选样品");
        this.$message.error("无法获取当前样品ID，无法加载可选样品");
        return;
      }
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
            "m1": "", // 托盘重量
            "m2": "", // 样品重
            "m3": "", // (盘+样)烘干重量
            "fgwz": "", // 风干物质
            "csf": "", // 初水分
            "dryTime": "", // 烘干时间
            "dryTimeBefore": "", // 烘干开始时间
            "dryTimeAfter": ""   // 烘干结束时间
          };
          this.Details.infoList.push(newSample);
        }
      });
      this.testItemDialogVisible = false;
    },

    // 增加样品
    addSample() {
      // 确保在调用 getTestItemList 之前 Details.itemId 有值
      if (!this.Details.itemId) {
        this.$message.warning("请等待页面初始化完成或检查样品ID");
        return;
      }
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
    // *** 逻辑修改：saveForm 调用 submitForm(true) ***
    saveForm() {
      this.submitForm(true); // true = prevent navigation
    },

    // *** 逻辑修改：submitForm 改造 ***
    async submitForm(preventNavigation = false) {
      this.joinInstrumentFields();
      // *** 逻辑修改：新增必填校验 ***
      const empty = this.validateEmpty();
      if (empty.length) {
        this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
        return { success: false, error: '数据未填完整' }; // 返回失败
      }

      // 提交前重新计算所有值
      this.Details.infoList.forEach(item => {
        this.updateValues(item); // 确保在提交前重新计算并保存
        // 组装烘干时间：将 dryTimeBefore 和 dryTimeAfter 合并为 dryTime
        if (item.dryTimeBefore && item.dryTimeAfter) {
          item.dryTime = item.dryTimeBefore + ',' + item.dryTimeAfter;
        } else if (item.dryTimeBefore) {
          item.dryTime = item.dryTimeBefore + ',';
        } else if (item.dryTimeAfter) {
          item.dryTime = ',' + item.dryTimeAfter;
        } else {
          item.dryTime = '';
        }
      });

      const submitItemId = this.Details.itemId;
      if (!submitItemId) {
        this.$message.error("缺少样品ID，无法保存");
        return { success: false, error: "Missing itemId" };
      }

      const submitData = {
        ...this.Details,
        itemId: submitItemId, // 确保itemId被设置
        testUserSignature: this.testUserSignature,
        checkUserSignature: this.checkUserSignature,
      };

      try {
        let result;
        if (this.isRec) { // isRec 判断是否为新增
          console.log("新增初水分数据:", submitData);
          result = await feedwatertask(submitData);
        } else { // 否则为修改
          console.log("修改初水分数据:", submitData);
          result = await feedwatertaskUp(submitData);
        }

        if (result.code == 200) {
          // 更新本地数据，特别是 opJczxFeedResultBaseId (用于后续可能的校对)
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
          if (preventNavigation) {
            this.$message.success('保存成功');
          } else {
            this.$message.success('已提交成功');
            this.$router.push('/feedTaskPad');
          }

          // 返回保存结果，供其他方法使用
          return { success: true, data: result.data };
        } else {
          this.$message.error(result.msg || '保存失败');
          return { success: false, error: result.msg };
        }
      } catch (error) {
        console.error('保存失败:', error);
        this.$message.error('保存失败: ' + (error.message || ''));
        return { success: false, error: error.message };
      }
    },
    // 6. 初始化方法 (核心修改)
    async initCsfhyPage() {
      console.log(this.$route.params, '111111111')
      if (this.$route.params.taskInfo) {
        this.dqID()
      } else if (this.$route.params.SjtaskInfo) {
        this.dqIDHD()
      }

      const fmt = d => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${dd}`
      }
      const today = fmt(new Date())

      // 6a. 从路由 params 获取数据
      const { taskInfo, jcList } = this.$route.params;
      console.log(this.$route.params.SjtaskInfo, '11111111111')
      if (this.$route.params.isJCRY) {
        this.isJCRY = this.$route.params.isJCRY
        console.log('检测人员查看详情', this.isJCRY)
      }
      // 6b. 检查路由参数
      if (taskInfo && jcList && jcList.length > 0) {

        // 6c. 从 jcList 获取 ItemId
        const currentItemId = jcList[0].IDD;
        if (!currentItemId) {
          this.$message.error('页面参数错误(缺少ItemID)，请从任务列表重新进入');
          this.$router.push('/feedTaskPad');
          return;
        }
        // 6d. 设置 data 中的 itemId (用于 addSample)
        this.itemId = currentItemId;



        // 6e. 检查 taskInfo (来自 getTask) 是否已经有关联的 baseId (opJczxFeedResultBaseId)
        if (taskInfo.opJczxFeedResultBaseId) {
          // --- 修改模式 ---
          console.log("初始化JJ15 (修改模式):", taskInfo, jcList);

          // 1. 准备 infoList
          const updatedInfoList = jcList.map(jcl => {
            const existingItem = taskInfo.infoList?.find(ti =>
              ti.entrustOrderSampleId === jcl.entrustOrderSampleId ||
              (!ti.entrustOrderSampleId && ti.sampleNo === jcl.sampleNo)
            );
            const dryTimes = existingItem?.dryTime?.split(',') || ['', ''];
            return {
              entrustOrderItemId: jcl.entrustOrderItemId,
              entrustOrderSampleId: jcl.entrustOrderSampleId,
              sampleNo: jcl.sampleNo,
              sampleName: jcl.sampleName,
              clmh: existingItem?.clmh || "", // *** 逻辑修正：增加 clmh ***
              m1: existingItem?.m1 || "",
              m2: existingItem?.m2 || "",
              m3: existingItem?.m3 || "",
              fgwz: existingItem?.fgwz || "",
              csf: existingItem?.csf || "",
              dryTime: existingItem?.dryTime || "",
              dryTimeBefore: dryTimes[0] || "",
              dryTimeAfter: dryTimes[1] || ""
            };
          });

          // 2. (修复响应式) 
          this.Details = {
            ...taskInfo,
            infoList: updatedInfoList, // 在赋值时包含 infoList
            itemId: currentItemId     // 在赋值时包含 itemId
          };

          this.isShow = true; // 显示修改按钮
          this.isRec = false; // 非新增状态
          this.testItemQuery.itemId = currentItemId; // 设置查询参数的itemId

          // 3. 重新计算现有数据
          if (this.Details.infoList) {
            this.$nextTick(() => {
              this.Details.infoList.forEach(item => this.updateValues(item));
            });
          }

        } else {
          // --- 新增模式 ---
          console.log("初始化JJ15 (新增模式):", taskInfo, jcList);

          // 1. 准备 infoList
          const newInfoList = jcList.map(item => ({
            entrustOrderItemId: item.entrustOrderItemId,
            entrustOrderSampleId: item.entrustOrderSampleId,
            sampleNo: item.sampleNo,
            sampleName: item.sampleName,
            clmh: "", m1: "", m2: "", m3: "", fgwz: "", csf: "", // *** 逻辑修正：增加 clmh ***
            dryTime: "", dryTimeBefore: "", dryTimeAfter: ""
          }));

          // 2. (修复响应式)
          this.Details = {
            ...taskInfo,
            infoList: newInfoList, // 在赋值时包含 infoList
            testDate: today,
            itemId: currentItemId // 在赋值时包含 itemId
          };

          this.isShow = false; // 不显示修改按钮
          this.isRec = true; // 新增状态
          this.testItemQuery.itemId = currentItemId; // 设置查询参数的itemId
        }

      } else if (this.$route.params.SjtaskInfo) {
        // --- 2b. 兼容旧的返回逻辑 (query) ---
        console.warn("初始化JJ15 (Query兼容模式):", this.$route.params.SjtaskInfo);
        this.Details = this.$route.params.SjtaskInfo; // *** 逻辑修正：JSON.parse ***
        this.isShow = true;
        this.isRec = false; // 从query返回的必定是已保存的

        if (this.Details.infoList) {
          this.Details.infoList.forEach(item => {
            if (item.dryTime) {
              const times = item.dryTime.split(',');
              item.dryTimeBefore = times[0] || '';
              item.dryTimeAfter = times[1] || '';
            } else {
              item.dryTimeBefore = '';
              item.dryTimeAfter = '';
            }
            this.updateValues(item); // 计算现有数据
          });
        }
        // 初始化 itemId (从 Details 或 默认值)
        this.Details.itemId = this.Details.itemId || this.itemId; // (this.itemId 此时为 '')
        this.itemId = this.Details.itemId; // 确保 data 中的 itemId 也被设置
        this.testItemQuery.itemId = this.Details.itemId;

      } else {
        // --- 2c. 参数错误 ---
        this.$message.error('缺少必要的页面参数，请从任务列表进入');
        this.$router.push('/feedTaskPad'); // 跳转回列表
        return;
      }

      // 确保所有样品数据都有必要的字段

      this.isPadPc();
      this.loadSignatureImages();
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

      // 4. 检查是否有基础ID (opJczxFeedResultBaseId)
      if (!this.Details.opJczxFeedResultBaseId) {
        // (已在 submitForm 中处理了, 但双重保险)
        this.$message.error('缺少必要参数(ID)，无法校对');
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
          this.$router.push(`/jczxFeedResultBasePad?tab=2`);
        } else {
          this.$message.error(res.msg || '校对失败');
        }
      } catch (error) {
        console.error('校对失败:', error);
        this.$message.error('校对操作失败');
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
/* 样式保持不变 */
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
  width: 80px !important;
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
  /* *** 逻辑修正：确保公式左对齐 *** */
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
</style>