<template>
  <div id="maxContainer" style="margin:15px">
    <div class="noprint">
      <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回检测任务</el-button>
      <el-button type="success" icon="el-icon-back" @click="HDPadb">返回样品化验</el-button>
      <el-button type="success" @click="print">打印</el-button>
    </div>
    <div class="print-page" id='printBill'>
      <div class="pagemain" v-for="forindex in forindex" :key="'forindex' + forindex">
        <div class="pagesubheader">
          <div style="text-align:left">光明牧业有限公司检验测试中心</div>
          <div style="text-align:center">技术记录</div>
          <div style="text-align:right">第D版1次修订</div>
        </div>
        <div class="pageheader">{{ Details.modelNo }} {{ Details.modelName }}</div>


        <table cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th>检测日期</th>
              <th>温湿度(℃/%)</th>
              <th colspan="2">磷标准溶液批号/浓度</th>
              <th colspan="2">主要仪器</th>
              <th>{{ instrumentNameOne }}</th>
              <th>{{ instrumentNameTwo }}</th>
              <th>{{ instrumentNameThree }}</th>
              <th colspan="2">检测地点</th>
              <th colspan="2">检测依据</th>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td>{{ Details.temperature }}/{{ Details.humidity }}</td>
              <td colspan="2">{{ Details.xxryph }}/(1mg/mL)</td>
              <th colspan="2">仪器编号</th>
              <td>{{ instrumentNoOne }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td>{{ instrumentNoThree }}</td>
              <td>{{ testLocationOne }}</td>
              <td>{{ testLocationTwo }}</td>
              <td colspan="2">{{ Details.testBasis }}</td>
            </tr>
            <tr>
              <td style="width: 19.93%;" colspan="2">磷标液浓度(ug/mL)</td>
              <td style="width: 13.33%;" colspan="2">0</td>
              <td style="width: 13.33%;" colspan="2">1</td>
              <td style="width: 13.33%;" colspan="2">2</td>
              <td style="width: 13.33%;" colspan="2">5</td>
              <td style="width: 13.33%;" colspan="2">10</td>
              <td style="width: 13.33%;" colspan="2">15</td>
            </tr>
            <tr>
              <td style="width: 19.93%;" colspan="2">吸光度(400nm)</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd1 }}</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd2 }}</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd3 }}</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd4 }}</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd5 }}</td>
              <td style="width: 13.33%;" colspan="2">{{ xgd6 }}</td>
            </tr>
            <tr>
              <td colspan="2">磷标准曲线方程及相关系数</td>
              <td colspan="12"><span style=" margin-right: 20px; font-size: 16px;">
                  {{ regression.equation || 'y = ax + b' }}
                </span> R={{ bzqxfcjxgxs }}</td>
            </tr>
            <tr>
              <td>样品编号</td>
              <td>样品名称</td>
              <td>样液号</td>
              <td colspan="2">试样质量 m（g）</td>
              <td colspan="2">测试液吸光度A</td>
              <td colspan="2">测试液磷浓度X(ug/mL)</td>
              <td colspan="2">试样中P含量 （%）</td>
              <td>平均值（%）</td>
              <td>相对相差（%）</td>
              <td>鲜样中P含量 （%）</td>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.yyh }}</td>
                <td colspan="2">{{ item.m }}</td>
                <td colspan="2">{{ item.syxgdaz }}</td>
                <td colspan="2">{{ item.x }}</td>
                <td colspan="2">{{ item.p }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareYyh }}</td>
                <td colspan="2">{{ item.compareM }}</td>
                <td colspan="2">{{ item.compareSyxgdaz }}</td>
                <td colspan="2">{{ item.compareX }}</td>
                <td colspan="2">{{ item.compareP }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="1">计算公式</td>
              <td colspan="7">
                <div class="formula-container">
                  P（%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        X × <span class="math-bracket-left"></span>V<span class="math-sub">0</span>
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        m × <span class="math-bracket-left"></span>V<span class="math-sub">1</span>× <span
                          class="math-bracket-left"></span>10<sup>6</sup>
                      </span>
                    </span>
                    <span class="math-times">×</span> 100
                  </span>
                  （试样分解液的总体积V<span class="math-sub">0</span>={{ Details.v0 }}mL 移取试样液的体积V<span
                    class="math-sub">1</span>={{
                      Details.v1 }}ml）
                </div>

              </td>
              <td colspan="5" style="text-align:left">
                磷标准滴定溶液配制批号{{ Details.edtabzddryph }}
                <br>钒钼酸铵溶液配制批号{{ Details.fmsarypzph }}

              </td>
            </tr>
            <tr>
              <td>允许相对偏差</td>
              <td colspan="6" style="text-align:left">磷含量≤0.5%时，允许相对相差≤10%;磷含量>0.5%时，允许相对相差≤3%。</td>
              <td colspan="7" style="text-align:left">样品前处理方法为干法,<br>
                箱式电炉{{ oneBeforeTime }}点~{{ oneAfterTime }}点，{{ twoBeforeTime }}点~{{ twoAfterTime }}点。
              </td>
            </tr>
          </tbody>
        </table>
        <div class="footer" style="text-align:left;padding:5px;">
          <el-row>
            <el-col :span="10" :offset="2">
              <span>检测人:</span>
              <img v-if="signTypes.检测人" :src="signTypes.检测人" style="height:40px;vertical-align:top">
            </el-col>
            <el-col :span="10" :offset="2">
              <span>核对人:</span>
              <img v-if="signTypes.核对人" :src="signTypes.核对人" style="height:40px;vertical-align:top">
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { XZPic } from "@/api/hyd";
export default {
  name: "JJsfprint",

  data() {
    return {
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
        isTest: '0',
        itemId: ''
      },
      testItemTotal: 0,
      signtype: "",
      videoif: false,
      SignatureImg: "",
      instrumentNameOne: '',
      instrumentNameTwo: '',
      instrumentNameThree: '',
      instrumentNoOne: '',
      instrumentNoTwo: '',
      instrumentNoThree: '',
      testLocationOne: '',
      testLocationTwo: '',
      signatureImage: '',
      Details: { infoList: [] },
      forindex: 0,
      fgmumber: 6,
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
      bzqxfcjxgxs: '', // *** 逻辑修改：bzqxfcjxgxs 不在 Details 中 ***
      firstId: '',
      testUserSignature: '',
      checkUserSignature: '',
      // *** 逻辑修改：新增负数校验节流阀 ***
      lastWarningTime: 0,
      warningThrottleMs: 2000,
      stdConcs: [0, 1, 2, 5, 10, 15],   // 磷标液浓度（X 轴）
      regression: {                     // 计算结果
        a: 0,// 斜率
        b: 0,// 截距
        r2: 0,
        equation: ''
      },
    };
  },
  created() {

  },

  mounted() {
    if (this.$route.params.SjtaskInfo) {
      console.log('888888888888888888888888888')
      this.Details = this.$route.params.SjtaskInfo
      // 设置数据
      localStorage.setItem('jj01SjtaskInfo', JSON.stringify(this.Details));


    } else {
      this.Details = JSON.parse(localStorage.getItem('jj01SjtaskInfo'))
    }
    this.initTimes();
    // this.Details.infoList = this.Details.infoList.concat(this.Details.infoList)
    // this.Details.infoList = this.Details.infoList.concat(this.Details.infoList)
    if (this.Details.infoList.length < this.fgmumber) {
      this.forindex = 1
    }
    else if (this.Details.infoList.length % this.fgmumber == 0) {
      this.forindex = parseInt(this.Details.infoList.length / this.fgmumber)
    } else {
      this.forindex = parseInt(this.Details.infoList.length / this.fgmumber) + 1
    }
    console.log(this.forindex)
    // *** 逻辑修改：加载签名 ***
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
  },

  watch: {

  },
  methods: {
    // 返回检测任务
    HDPada() {
      this.$router.push('/feedTaskPad')
    },
    // 时间处理
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
      this.instrumentNameThree = Name[2] || '';
      const No = (this.Details.instrumentNo || '').split(',');
      this.instrumentNoOne = No[0] || '';
      this.instrumentNoTwo = No[1] || '';
      this.instrumentNoThree = No[2] || '';
      const Location = (this.Details.testLocation || '').split(',');
      this.testLocationOne = Location[0] || '';
      this.testLocationTwo = Location[1] || '';
      const Xg = (this.Details.xgd || '').split(',');
      this.xgd1 = Xg[0] || '';
      this.xgd2 = Xg[1] || ''; // *** 逻辑修正：Xg[1] ***
      this.xgd3 = Xg[2] || ''; // *** 逻辑修正：Xg[2] ***
      this.xgd4 = Xg[3] || ''; // *** 逻辑修正：Xg[3] ***
      this.xgd5 = Xg[4] || ''; // *** 逻辑修正：Xg[4] ***
      this.xgd6 = Xg[5] || ''; // *** 逻辑修正：Xg[5] ***
      // *** 逻辑修改：bzqxfcjxgxs 不在 Details 中 ***
      this.bzqxfcjxgxs = this.Details.bzqxfcjxgxs || '';
    },
    // 返回样品化验
    HDPadb() {
      this.$router.push('jczxFeedResultBasePad')
    },
    // 打印
    print() {
      window.print()
    },
  },
};
</script>
<style scoped>
@import "~@/assets/styles/printjc.css";
</style>
