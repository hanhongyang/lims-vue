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
              <th colspan="2">环境温湿度(℃/%)</th>
              <th>主要仪器名称</th>
              <td>{{ instrumentNameOne }}</td>
              <td>{{ instrumentNameTwo }}</td>
              <th colspan="2">检测地点</th>
              <th colspan="2">检测依据</th>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td colspan="2">{{ Details.temperature }}/ {{ Details.humidity }}</td>
              <th>仪器编号 </th>
              <td> {{ instrumentNoOne }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td>{{ testLocationOne }}</td>
              <td>{{ testLocationTwo }}</td>
              <td colspan="2">{{ Details.testBasis }}</td>
            </tr>
            <tr>
              <th colspan="2">主要使用试剂/(配制)批号</th>
              <th colspan="8">丙酮{{ sjhphOne }}
                中性洗涤剂{{ sjhphTwo }}
                淀粉酶{{ sjhphThree }}无水亚硫酸钠{{ sjhphFour }}</th>
            </tr>


            <tr>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>滤袋号</th>
              <th>滤袋质量 m₁（g）</th>
              <th>试样质量 m（g）</th>
              <th>袋+残渣总质量 m<sub>2</sub>（g）</th>
              <th>NDF 含量 x（%）</th>
              <th>平均值(g/kg)</th>
              <th>相对偏差(g/kg)</th>
              <th>鲜样中中 NDF 含量 (g/kg)</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.ldh }}</td>

                <td>{{ item.m1 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareLdh }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>
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
                      (m₀=处理前滤袋质量{{ Details.clqglzl }}g，
                      m<sub>A</sub>=处理后滤袋质量{{ Details.clhglzl }}g，
                      校正因子C₁{{ Details.x }})
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
