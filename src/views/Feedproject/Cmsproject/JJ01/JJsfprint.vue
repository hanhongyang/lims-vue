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
              <th colspan="2" style="width:10%">检测日期</th>
              <th colspan="2" style="width:10%">环境温度/湿度 (℃/%)</th>
              <th style="width:10%">第一次烘干时间</th>
              <th style="width:15%">第二次烘干时间</th>
              <th style="width:15%">主要仪器名称</th>
              <th style="width:10%">仪器编号</th>
              <th colspan="2" style="width:14%">检测依据</th>
              <th colspan="2" style="width:14%">检测地点</th>
            </tr>
            <tr>
              <td rowspan="2" colspan="2">{{ Details.testDate }}</td>
              <td rowspan="2" colspan="2">{{ Details.temperature }}/{{ Details.humidity }}</td>
              <td rowspan="2">{{ oneBeforeTime }}点~{{ oneAfterTime }}点</td>
              <td rowspan="2">{{ twoBeforeTime }}点~{{ twoAfterTime }}点</td>
              <td>{{ instrumentNameOne }}</td>
              <td>{{ instrumentNoOne }}</td>
              <td rowspan="2" colspan="2">{{ Details.testBasis }}</td>
              <td colspan="2">{{ testLocationOne }}</td>
            </tr>
            <tr>
              <td>{{ instrumentNameTwo }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td colspan="2">{{ testLocationTwo }}</td>
            </tr>
            <tr>
              <th colspan="2">样品信息</th>
              <th colspan="6">未作预处理样</th>
              <th colspan="2">经过预处理样</th>
              <th colspan="2">结果值</th>
            </tr>
            <tr>
              <th style="white-space: nowrap;">样品编号</th>
              <th style="white-space: nowrap;">样品名称</th>
              <th style="white-space: nowrap;">称量皿号</th>
              <th style="white-space: nowrap;">试样质量<br>m₂ (g)</th>
              <th>称量皿的质量m₁ (g)</th>
              <th>第一次干燥后称量皿+试样的质量 m₃ (g)</th>
              <th>第二次干燥后称量皿+试样的质量 m₄ (g)</th>
              <th>试样水分含量 X (%)</th>
              <th>初水分含量 M₁ (%)</th>
              <th>水分含量 Xᵢ (%)</th>
              <th>平均值 (%)</th>
              <th>绝对差值/相对偏差 (%)</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m3 }}</td>
                <td>{{ item.m4 }}</td>
                <td>{{ item.x }}</td>
                <td>{{ item.upperM1 }}</td>
                <td>{{ item.x1 }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
              </tr>
              <tr>
                <td>{{ item.compareClmh }}</td>
                <td>{{ item.compareM2 }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareM3 }}</td>
                <td>{{ item.compareM4 }}</td>
                <td>{{ item.compareX }}</td>
                <td>{{ item.compareUpperM1 }}</td>
                <td>{{ item.compareX1 }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="2">未作预处理样</td>
              <td colspan="4">
                <div class="formula-container">
                  试样水分含量 X（%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        m<span class="math-sub">2</span> − <span class="math-bracket-left">(</span>m<span
                          class="math-sub">3</span>
                        − m<span class="math-sub">1</span><span class="math-bracket-right">)</span>
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        m<span class="math-sub">2</span>
                      </span>
                    </span>
                    <span class="math-times">×</span> 100
                  </span>
                </div>
              </td>
              <td>作预处理样</td>
              <td colspan="5">
                <div class="formula-container">
                  试样水分含量 X<span class="math-sub">1</span>（%） = M<span class="math-sub">1</span> +
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        <span class="math-bracket-left">(</span>100 − M<span class="math-sub">1</span><span
                          class="math-bracket-right">)</span>
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        100
                      </span>
                    </span>
                    <span class="math-times">×</span> <span class="math-var">X</span>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">允许误差</td>
              <td colspan="10" style="text-align:left">
                <span>水分&lt;15%时，两个平行样测定绝对值相差≤0.2%；水分≥15%时，相对偏差≤1.0%。</span>
              </td>
            </tr>
            <tr>
              <td colspan="2">备注</td>
              <td colspan="10" style="text-align:left">如果 m₃ 与 m₄ 的变化小于试样质量的 0.1%，以 m₃ 计算水分；否则需第三次干燥。</td>
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
      signatureImage: '',
      Details: { infoList: [] },
      forindex: 0,
      fgmumber: 7,
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
