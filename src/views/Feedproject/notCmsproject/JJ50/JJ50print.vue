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
          <div style="text-align:right">第D版0次修订</div>
        </div>
        <div class="pageheader">{{ Details.modelNo }} {{ Details.modelName }}</div>
        <table cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <td style="width: 10%;">检测日期</td>
              <td style="width: 10%;">温湿度(℃/%)</td>
              <td style="width: 10%;">主要使用仪器</td>
              <td style="width: 10%;">{{ instrumentNameOne }}</td>
              <td style="width: 10%;">检测依据</td>
              <td style="width: 10%;">检测地点</td>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td>{{ Details.temperature }}/{{ Details.humidity }}</td>
              <td>仪器编号</td>
              <td>{{ instrumentNoOne }}</td>
              <td>{{ Details.testBasis }}</td>
              <td style="width: 10%;">{{ testLocationOne }}</td>
            </tr>
            <tr>
              <td>样品编号</td>
              <td>样品名称</td>
              <td colspan="2">容重（g/L）</td>
              <td>平均值（ g/L ）</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * 8 > index && (forindex - 1) * 8 <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2" >{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td colspan="2">{{ item.a }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2"></td>
              </tr>
              <tr :key="`row2-${index}`">
                <td colspan="2">{{ item.compareA }}</td>
              </tr>
            </template>
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
      testLocationThree: '',
      signatureImage: '',
      Details: { infoList: [] },
      forindex: 0,
      signTypes: {
        检测人: '',
        核对人: ''
      },
      xxryphArr: ['', ''],  // 0-浓度 1-批号
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
      fourBeforeTimeLeft: '',
      fourBeforeTimeRight: '',
      fourAfterTimeLeft: '',
      fourAfterTimeRight: '',
      // 吸光度数据
      xgdOne: '',
      xgdTwo: '',
      xgdThree: '',
      xgdFour: '',
      xgdFive: '',
      xgd1: '',
      xgd2: '',
      xgd3: '',
      xgd4: '',
      xgd5: '',
      xgd6: '',
      c: '',
      ph: '',
    };
  },
  created() {

  },
  mounted() {
    if (this.$route.params.SjtaskInfo) {
      console.log('888888888888888888888888888')
      this.Details = this.$route.params.SjtaskInfo
      // 设置数据
      localStorage.setItem('SjtaskInfo', JSON.stringify(this.Details));
    } else {
      this.Details = JSON.parse(localStorage.getItem('SjtaskInfo'))
    }
    const arr = (this.Details.xxryph || '').split(',');
    this.xxryphArr = [arr[0] || '', arr[1] || ''];
    this.initTimes();
    // this.Details.infoList = this.Details.infoList.concat(this.Details.infoList)
    // this.Details.infoList = this.Details.infoList.concat(this.Details.infoList)
    if (this.Details.infoList.length < 8) {
      this.forindex = 1
    }
    else if (this.Details.infoList.length % 8 == 0) {
      this.forindex = parseInt(this.Details.infoList.length / 8)
    } else {
      this.forindex = parseInt(this.Details.infoList.length / 8) + 1
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
    this.initData();
  },

  watch: {

  },
  methods: {
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
      if (this.Details.fuyusj) {
        const fuyusj = this.Details.fuyusj.split(/[-:]/);
        if (fuyusj.length === 4) {
          this.threeBeforeTimeLeft = fuyusj[0] || '';
          this.threeBeforeTimeRight = fuyusj[1] || '';
          this.threeAfterTimeLeft = fuyusj[2] || '';
          this.threeAfterTimeRight = fuyusj[3] || '';
        }
      }
      if (this.Details.fysj) {
        const fysj = this.Details.fysj.split(/[-:]/);
        if (fysj.length === 4) {
          this.fourBeforeTimeLeft = fysj[0] || '';
          this.fourBeforeTimeRight = fysj[1] || '';
          this.fourAfterTimeLeft = fysj[2] || '';
          this.fourAfterTimeRight = fysj[3] || '';
        }
      }
      // 初始化仪器和检测地点数据
      const Name = (this.Details.instrumentName || '').split(',');
      this.instrumentNameOne = Name[0] || '';

      const No = (this.Details.instrumentNo || '').split(',');
      this.instrumentNoOne = No[0] || '';

      const Location = (this.Details.testLocation || '').split(',');
      this.testLocationOne = Location[0] || '';
      this.testLocationTwo = Location[1] || '';
      this.testLocationThree = Location[2] || '';

      // 初始化吸光度数据
      const xgdValues = (this.Details.xgd || '').split(',');
      this.xgdOne = xgdValues[0] || '';
      this.xgdTwo = xgdValues[1] || '';
      this.xgdThree = xgdValues[2] || '';
      this.xgdFour = xgdValues[3] || '';
      this.xgdFive = xgdValues[4] || '';

      const Xg = (this.Details.sjhph || '').split(',');
      this.xgd1 = Xg[0] || '';
      this.xgd2 = Xg[1] || '';
      this.xgd3 = Xg[2] || '';
      this.xgd4 = Xg[3] || '';
      this.xgd5 = Xg[4] || '';
      this.xgd6 = Xg[5] || '';

      const arr = (this.Details.xxryph || '').split('/');
      this.c = arr[0] || '';
      this.ph = arr[1] || '';
    },
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
@media print {

  /* 让框架隐藏的输入框重新出现 */
  .print-checkbox .el-checkbox__input {
    display: inline-block !important;
    visibility: visible !important;
  }

  /* 勾选状态下显示“√” */
  .print-checkbox .el-checkbox__inner::after {
    content: "✓";
    position: absolute;
    left: 2px;
    top: -2px;
    font-size: 12px;
    color: #fff;
  }

  /* 未勾选状态留空框 */
  .print-checkbox .el-checkbox__inner {
    border: 1px solid #000;
    width: 14px;
    height: 14px;
    background: transparent;
  }

  /* 勾选时填充背景 */
  .print-checkbox.is-checked .el-checkbox__inner {
    background: #000;
  }
}
</style>