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
              <th>环境温度/湿度(℃/%)</th>
              <th>主要使用仪器</th>
              <td>{{ instrumentNameOne }}</td>
              <td> {{ instrumentNameTwo }} </td>
              <th colspan="3">检测依据</th>
              <th colspan="2">检测地点</th>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td>{{ Details.temperature }}/{{ Details.humidity }}</td>
              <th>仪器编号</th>
              <td>{{ instrumentNameOne }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td colspan="3">{{ Details.testBasis }}</td>
              <td>{{ testLocationOne }}</td>
              <td>{{ testLocationTwo }}</td>

            </tr>
            <tr>
              <th>样品编号</th>
              <th>样品名称</th>
              <th>坩埚号</th>
              <th>空坩埚质量m<sub>0</sub>(g)</th>
              <th>试样质量m(g)</th>
              <th>灰化后灰分+坩埚质量m<sub>1</sub>(g)</th>
              <th>粗灰分含量w (%)</th>
              <th>平均值(%)</th>
              <th>绝对差值(%)</th>
              <th>鲜样中灰分含量(%)</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.compareGgh }}</td>
                <td>{{ item.m0 }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.w }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.clmh }}</td>
                <td>{{ item.compareM0 }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareM1 }}</td>
                <td>{{ item.compareW }}</td>
              </tr>
            </template>
            <tr>
              <td>计算公式</td>
              <td colspan="2">
                <div class="formula-container">
                  W（%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        <span class="math-bracket-left">(</span>m<span class="math-sub">1</span>
                        − m<span class="math-sub">0</span><span class="math-bracket-right">)</span>
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        m
                      </span>
                    </span>
                    <span class="math-times">×</span> 100
                  </span>
                </div>
              </td>
              <td>允许误差</td>
              <td colspan="3" style="text-align:left">粗灰分含量在 5%以上时，允许绝对差值≤0.21%;<br />粗灰分含量在 5%以下时，允许绝对差值≤0.09%</td>
              <td colspan="3" style="text-align:left">箱式电炉第一次{{ oneBeforeTime }}点~{{ oneAfterTime
              }}点<br />箱式电炉第二次{{ twoBeforeTime }}点~{{ twoAfterTime }}点
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
      localStorage.setItem('jj03SjtaskInfo', JSON.stringify(this.Details));


    } else {
      this.Details = JSON.parse(localStorage.getItem('jj03SjtaskInfo'))
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
