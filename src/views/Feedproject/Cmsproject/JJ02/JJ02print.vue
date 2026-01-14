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
              <th>盐酸标准溶液浓度c(mol/L)/批号</th>
              <th>主要使用仪器</th>
              <td>{{ instrumentNameOne }}</td>
              <td> {{ instrumentNameTwo }} </td>
              <th>检测依据</th>
              <th colspan="2">检测地点</th>
              <th>温湿度(℃/%)</th>       
            </tr>
            <tr>
              <td>{{ Details.testDate }}</td>
              <td>{{ c }}/{{ ph }}</td>
              <th>仪器编号</th>
              <td>{{ instrumentNoOne }}</td>
              <td>{{ instrumentNoTwo }}</td>
              <td>{{ Details.testBasis }}</td>
              <td>{{ testLocationOne }}</td>
              <td>{{ testLocationTwo }}</td>
              <td>{{ Details.temperature }}/{{ Details.humidity }}</td>
            </tr>
            <tr>
              <th>主要使用试剂/(配制)批号</th>
              <th colspan="2">氢氧化钠溶液{{ sjhphOne }} </th>
              <th colspan="2">硼酸吸收液{{ sjhphTwo }}</th>
              <th colspan="2">混合催化剂{{ sjhphThree }}</th>
              <th colspan="2">硫酸{{ sjhphFour }}</th>
            </tr>
            <tr>
              <th style="white-space: nowrap;">样品编号</th>
              <th style="white-space: nowrap;">样品名称</th>
              <th>消化管号</th>
              <th>试样质量m(g)</th>
              <th>盐酸标准溶液消耗体积 V<sub>2</sub>(mL)</th>
              <th>CP 含量(%)</th>
              <th>平均值(%)</th>
              <th>相对偏差(%)</th>
              <th>鲜样中CP含量(%)</th>
            </tr>
          </thead>
          <tbody>
            <!-- 数据行：共10行，可根据需要增减 -->
            <template v-for="(item, index) in Details.infoList"
              v-if="forindex * fgmumber > index && (forindex - 1) * fgmumber <= index">
              <tr :key="`row1-${index}`">
                <td rowspan="2">{{ item.sampleNo }}</td>
                <td rowspan="2">{{ item.sampleName }}</td>
                <td>{{ item.xhgh }}</td>
                <td>{{ item.m }}</td>
                <td>{{ item.v2 }}</td>
                <td>{{ item.cp }}</td>
                <td rowspan="2">{{ item.average }}</td>
                <td rowspan="2">{{ item.absoluteDifference }}</td>
                <td rowspan="2">{{ item.xyzhl }}</td>
              </tr>
              <tr :key="`row2-${index}`">
                <td>{{ item.compareXhgh }}</td>
                <td>{{ item.compareM }}</td>
                <td>{{ item.compareV2 }}</td>
                <td>{{ item.compareCp }}</td>
              </tr>
            </template>
            <tr>
              <td>计算公式</td>
              <td colspan="5">
                <div class="formula-container">
                  CP （%） =
                  <span class="math-formula">
                    <span class="math-fraction">
                      <span class="math-numerator">
                        <span class="math-bracket-left">(</span>V<span class="math-sub">2</span>
                        −
                        V<span class="math-sub">1</span><span class="math-bracket-right">)</span> × <span>c</span>
                        ×
                        <span class="frac">
                          <span class="num">14</span>
                          <span class="den">1000</span>
                        </span>
                        × 6.25
                      </span>
                      <span class="math-fraction-line"></span>
                      <span class="math-denominator">
                        m × <span class="frac">
                          <span class="num">V<sup>’</sup></span>
                          <span class="den">V</span>
                        </span>
                      </span>
                    </span>
                    <span class="math-times">×</span> 100</span>

                  <div class="formula-note" style="margin-top: 6px; font-size: 14px; white-space: normal;">
                    <span class="frac">
                      <span class="num">V<sup>’</sup></span>
                      <span class="den">V</span>
                    </span>
                    <span>表示试样分解液蒸馏用体积与分解液总体积的壁纸,为1：1</span>
                  </div>
                </div>
              </td>
              <td colspan="3" style="text-align:left">空白消耗盐酸标准溶液体积V<sub>1</sub>{{ Details.kbxhys }}ml</td>
            </tr>
            <tr>
              <td>允许相对偏差</td>
              <td colspan="5" style="text-align:left">粗蛋白质含量在 25%以上时，允许相对偏差为1%。<br>粗蛋白质含量在
                10%~25%之间时，允许相对偏差为2%:<br>
                粗蛋白质含量在 10%以下时，允许相对偏差为3%。</td>
              <td colspan="3" style="text-align:left">备注:粗蛋白质含量用凯氏定氮蒸馏系统采用常量蒸馏法测定:<br>粗蛋白质含量 CP(%)由仪器自动计算得出。</td>
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
      fgmumber: 5,
      signTypes: {
        检测人: '',
        核对人: ''
      },
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
      localStorage.setItem('jj02SjtaskInfo', JSON.stringify(this.Details));


    } else {
      this.Details = JSON.parse(localStorage.getItem('jj02SjtaskInfo'))
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

      const arr = (this.Details.xxryph || '').split('/');
      this.c = arr[0] || '';
      this.ph = arr[1] || '';
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

.formula-container {
  text-align: left;
  white-space: normal;
  /* *** 逻辑修正：允许换行 *** */
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
</style>
