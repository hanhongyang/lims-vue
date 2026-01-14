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
              <th colspan="2" style="width:14%">检测依据</th>
              <th style="width:15%">主要仪器名称</th>
              <th style="width:10%">仪器编号</th>
              <th colspan="2" style="width:14%">检测地点</th>
              <th colspan="7">计算公式</th>
            </tr>
            <tr>
              <td rowspan="2" colspan="2">{{ Details.testBasis }}</td>
              <td>{{ instrumentNoOne }}</td>
              <td>{{ instrumentNameOne }}</td>
              <td colspan="2">{{ testLocationOne }}</td>
              <td colspan="7" rowspan="2">
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
              <td>{{ instrumentNoTwo }}</td>
              <td>{{ instrumentNameTwo }}</td>

              <td colspan="2">{{ testLocationTwo }}</td>
            </tr>
            <tr>
              <th style="white-space: nowrap;">检测日期</th>
              <th style="white-space: nowrap;">样品编号</th>
              <th style="white-space: nowrap;">样品名称</th>
              <th style="white-space: nowrap;">托盘号</th>
              <th style="white-space: nowrap;">托盘重量 m₁(g)</th>
              <th>样品重 m₂(g)</th>
              <th>(盘+样)烘干重量 m₃(g)</th>
              <th>风干物质(%)</th>
              <th>初水分(%)</th>
              <th>烘干时间</th>
              <th>检测人</th>
              <th>校对人</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td>{{ Details.testDate }}</td>
                <td>{{ item.sampleNo }}</td>
                <td>{{ item.sampleName }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.m1 }}</td>
                <td>{{ item.m2 }}</td>
                <td>{{ item.m3 }}</td>
                <td>{{ item.fgwz }}</td>
                <td>{{ item.csf }}</td>
                <td>{{ item.dryTime.split(',')[0] }}点~{{ item.dryTime.split(',')[1] }}点</td>
                <td>{{ item.testUser }}</td>
                <td>{{ item.checkUser }}</td>
              </tr>

            </template>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JJsfprint",

  data() {
    return {

      instrumentNameOne: '',
      instrumentNameTwo: '',
      instrumentNoOne: '',
      instrumentNoTwo: '',
      testLocationOne: '',
      testLocationTwo: '',
      Details: { infoList: [] },
      forindex: 0,
      fgmumber: 13
    };
  },
  created() {

  },

  mounted() {
    if (this.$route.params.SjtaskInfo) {

      this.Details = this.$route.params.SjtaskInfo
      // 设置数据
      localStorage.setItem('jj15SjtaskInfo', JSON.stringify(this.Details));


    } else {
      this.Details = JSON.parse(localStorage.getItem('jj15SjtaskInfo'))
    }
    console.log(this.Details, '888888888888888888888888888')
    this.initTimes();
    if (this.Details.infoList.length < this.fgmumber) {
      this.forindex = 1
    }
    else if (this.Details.infoList.length % this.fgmumber == 0) {
      this.forindex = parseInt(this.Details.infoList.length / this.fgmumber)
    } else {
      this.forindex = parseInt(this.Details.infoList.length / this.fgmumber) + 1
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
