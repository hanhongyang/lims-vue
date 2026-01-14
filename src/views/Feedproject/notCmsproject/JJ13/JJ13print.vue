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
              <td>检测日期</td>
              <td colspan="2">硝酸银溶液浓度C(mol/L)/批号</td>
              <td>10%铬酸钾配制批号</td>
              <td>主要仪器名称</td>
              <td>{{ instrumentNameOne }}</td>
              <td colspan="2">检测依据</td>
              <td>检测地点</td>
              <td colspan="2">温湿度(℃/%)</td>
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td colspan="2">{{ xxryphArr[0] }}/{{ xxryphArr[1] }}</td>
              <td>{{ Details.fmsarypzph }}</td>
              <td>仪器编号</td>
              <td>{{ instrumentNoOne }}</td>
              <td colspan="2">{{ Details.testBasis }}</td>
              <td>{{ testLocationOne }}</td>
              <td colspan="2">{{ Details.temperature }}/{{ Details.humidity }}</td>
            </tr>
            <tr>
              <th style="white-space: nowrap;width: 150px;">样品编号</th>
              <th style="white-space: nowrap;width: 150px;">样品名称</th>
              <th style="white-space: nowrap;">瓶号</th>
              <th style="white-space: nowrap;">试样质量 m（g）</th>
              <th>样品消耗硝酸银标准溶液消耗体积V(mL)</th>
              <th>空白消耗硝酸银标准溶液消耗体积V₀(mL)</th>
              <th>水溶性氯化物含量X(%)</th>
              <th>平均值 (%)</th>
              <th>相对偏差（%）</th>
              <th>允许相差(绝对值)</th>
              <th>鲜样中水溶性氯化物含量x(%)</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * 5 > index && (forindex - 1) * 5 <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.clmh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v }}</td>
                <td>{{ item.v0 }}</td>
                <td>{{ item.x }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.yxxc }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr>
                <td>{{ item.compareClmh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV }}</td>
                <td>{{ item.compareV0 }}</td>
                <td>{{ item.compareX }}</td>
              </tr>
            </template>

            <tr>
              <td colspan="2">计算公式</td>
              <td colspan="10" style="text-align:left">
                <div class="formula-container">
                  NaCl（%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        (V - V₀) × C × 0.05845 × 100 × 100
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        10 × m
                      </span>
                    </span>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">备注</td>
              <td colspan="10" style="text-align:left">
                每个试样取两个平行样进行测定，以其算术平均值为结果。<br>
                氯化钠含量在5%以下时，允许相差（绝对值）为0.05。<br>
                氯化钠含量在5%以上时，允许相对偏差为5%。
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
      signTypes: {
        检测人: '',
        核对人: ''
      },
      xxryphArr: ['', ''],  // 0-浓度 1-批号
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
    if (this.Details.infoList.length < 5) {
      this.forindex = 1
    }
    else if (this.Details.infoList.length % 5 == 0) {
      this.forindex = parseInt(this.Details.infoList.length / 5)
    } else {
      this.forindex = parseInt(this.Details.infoList.length / 5) + 1
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
