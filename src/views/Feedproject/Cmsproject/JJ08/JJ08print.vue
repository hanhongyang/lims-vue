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
              <th>钙标准溶液批号/浓度</th>
              <th>主要仪器</th>
              <th>{{ instrumentNameOne }}</th>
              <th>{{ instrumentNameTwo }}</th>
              <th colspan="2">检测地点</th>
              <th>检测依据</th>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td>{{ Details.temperature }}/{{ Details.humidity }}</td>
              <td>{{ Details.xxryph }}/(1mg/mL)</td>
              <th>仪器编号</th>
              <td>{{ instrumentNoOne }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td>{{ testLocationOne }}</td>
              <td>{{ testLocationTwo }}</td>
              <td>{{ Details.testBasis }}</td>
            </tr>
            <tr>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>样液号</th>
              <th>试样质量 m（g）</th>
              <th>消耗 EDTA 标准液的体积 V<sub>2</sub>(mL)</th>
              <th>Ca 含量 （%）</th>
              <th>平均值（%）</th>
              <th>相对相差（%）</th>
              <th>鲜样中Ca 含量 （%）</th>
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
                <td>{{ item.m }}</td>
                <td>{{ item.v2 }}</td>
                <td>{{ item.ca }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareYyh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV2 }}</td>
                <td>{{ item.compareCa }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="1">计算公式</td>
              <td colspan="10">
                <div class="formula-container">
                  Ca（%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        T × <span class="math-bracket-left"></span>V<span class="math-sub">2</span>
                        × V<span class="math-sub">0</span><span class="math-bracket-right"></span>
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        m × <span class="math-bracket-left"></span>V<span class="math-sub">1</span>
                      </span>
                    </span>
                    <span class="math-times">×</span> 100
                  </span>
                  （试样分解液的总体积V<span class="math-sub">0</span>={{ Details.v0 }}mL 移取试样液的体积V<span
                    class="math-sub">1</span>={{
                      Details.v1 }}ml）
                  <span style="margin-left: 200px;">
                    EDTA标准滴定溶液批号{{ Details.edtabzddryph }}
                    对钙的滴定度T{{ Details.dgdddd }}×10<sup>-6</sup>g/mL
                  </span>

                </div>
              </td>
            </tr>
            <tr>
              <td>允许相对偏差</td>
              <td colspan="6" style="text-align:left">含钙量 10%以上，允许相对相差≤3%;含钙量在 5%~10%时，允许相对相差≤5%;
                含钙量 1%~5%时，允许相对相差≤9%;含量在1%以下，允许相对相差≤18%。</td>
              <td colspan="4" style="text-align:left">样品前处理方法为干法,
                箱式电炉{{ oneBeforeTime }}点~{{ oneAfterTime }}点，{{ twoBeforeTime }}点~{{ twoAfterTime
                }}点。滴定管编号{{ Details.ddgbh }}
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
      instrumentNameOne: '',
      instrumentNameTwo: '',
      instrumentNoOne: '',
      instrumentNoTwo: '',
      testLocationOne: '',
      testLocationTwo: '',
      sjhphOne: '',
      sjhphTwo: '',
      sjhphThree: '',
      sjhphFour: '',
      signatureImage: '',
      Details: { infoList: [] },
      forindex: 0,
      fgmumber: 6,
      signTypes: {
        检测人: '',
        核对人: ''
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
      const No = (this.Details.instrumentNo || '').split(',');
      this.instrumentNoOne = No[0] || '';
      this.instrumentNoTwo = No[1] || '';
      const Location = (this.Details.testLocation || '').split(',');
      this.testLocationOne = Location[0] || '';
      this.testLocationTwo = Location[1] || '';
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
