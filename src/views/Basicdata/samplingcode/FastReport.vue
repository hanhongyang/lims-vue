<template>
  <div class="maxContainer" v-loading="loading">
    <div class="print-page" id='printBill' v-if="ensilingbillList.length != 0">
      <div class="pagemain" style="text-align:center;width:100%;padding:20px 0; page-break-after: always"
        v-for="(item, i) in ensilingbillList" :key="i">
        <div class="qrcodimg" :id="'qrcodimg' + i" style="width: 80px; height: 80px;margin: 0 auto;"></div>
        <span>{{ item.code }}</span><br>
        <span>{{ form.cztname }}</span>
      </div>
    </div>
    <div class=" noprint" id="printIgnore" style="position: absolute;top: 20px;right: 20px;">
      <el-button type="primary" @click="print">打印
      </el-button>
    </div>
  </div>
</template>

<script>
import { getdetail } from '@/api/Basicdata/samplingcode';
import { parseTime } from '@/utils/ruoyi.js';
import QRCode from 'qrcodejs2'; // 导入项目中使用
export default {
  name: 'fastreport',
  data() {
    return {
      ensilingbillList: [],
      form: {},
      nowTime: "",
      loading: false,
      Operation: ""
    };
  },
  created() {
    this.getinfo();
  },
  mounted() {

  },
  destroyed() {
  },
  methods: {
    // 获取详情
    getinfo() {
      let id = this.$route.query.id;
      this.loading = true;
      this.ensilingbillList = [];
      if (id != undefined) {
        getdetail(id).then((response) => {
          console.log(response, '详情');
          this.isregiet = true;
          this.form = response.data;
          if (this.form.opSamplingCodeList != null) {
            this.ensilingbillList = this.form.opSamplingCodeList;
          }
          this.nowTime = parseTime(new Date().getTime(), '{y}-{m}-{d} {h}:{m}:{s}');
          console.log(this.nowTime);
          setTimeout(() => {
            for (let index = 0; index < this.ensilingbillList.length; index++) {
              const element = this.ensilingbillList[index];
              document.getElementById("qrcodimg" + index).innerHTML = "";
              var qrcode = new QRCode(document.getElementById("qrcodimg" + index), {
                text: element.code, // 需要转换为二维码的内容
                width: 80,
                height: 80,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
              });
            }
          }, 500);

          this.loading = false;
        });
      }
    },
    print() {

      window.print()
    },

  }
};
</script>
<style scoped>
.pagemain {
  width: 80mm;
  margin: 0 auto;
  page-break-before: auto;
  /* 默认值，根据需要调整 */
  /* page-break-after: always; */
}

@media print {
  .noprint {
    display: none;
  }


}
</style>