<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="page">

                <div id="captureArea" class="capture-area">
                    <div class="entrust-info" style="position: absolute; right: 10px; top: 0px; text-align: center;">
                        <div class="qrcode-container" v-show="Details.entrustOrderNo">
                            <div style="justify-content: center;align-items: center;display: flex;" ref="qrcode"></div>
                        </div>
                        <div class="entrust-no" style="margin-top: 10px; font-size: 14px; font-weight: bold;">
                            委托单编码: {{ Details.entrustOrderNo || '待生成' }}
                        </div>
                    </div>
                    <div class="Details-title">SHGM-ZI-29-15 疫病检测送检单</div>
                    <div style="text-align:center; line-height: 1.8;">
                        送检单位：
                        <span style="border-bottom: 1px solid #000;margin-right:10px">
                            {{ Details.entrustDeptName }}
                        </span>
                        送检时间：
                        <span style="border-bottom: 1px solid #000;">
                            {{ Details.sendSampleDate }}
                        </span>
                    </div>
                    <div style="margin-left:30px">
                        送检数量: <span style="border-bottom: 1px solid #000;">
                            {{ Details.totalSampleQuantity }}
                        </span>
                    </div>
                    <div style="margin-left:30px">
                        检测项目:<br>

                    </div>
                    <div style="margin-bottom:5px;display:flex;flex-wrap:wrap;">
                        <div v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.value"
                            class="marRI">
                            <span class="check-box">{{
                                dict.label }}</span>
                            <div>
                                <input type="radio" :value=dict.value v-model="Details.itemCode">
                                <span class="square-radio"></span>
                            </div>
                        </div>
                    </div>
                    <div style="margin-bottom:5px;margin-left:80px" v-if="Details.itemCode == '8'">
                        生化项目类别:
                        <div style="display:flex;flex-wrap:wrap;">
                            <div v-for="dict in dict.type.biochemistry_item_type" :key="dict.value" :label="dict.value"
                                class="marRI">
                                <span class="check-box">
                                    {{ dict.label }}
                                </span>
                                <div>
                                    <input type="radio" :value="dict.value" :checked="isBiochemistryChecked(dict.value)"
                                        readonly>
                                    <span class="square-radio"></span>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div v-else style="margin-left:80px">
                        <div style="margin-bottom:5px;">
                            1.若是检查口蹄疫:
                            <br>
                            <div style="display:flex">
                                样品为免疫后：
                                <div style="display:flex">
                                    <div v-for="dict in dict.type.fmd_time" :key="dict.value" :label="dict.value"
                                        class="marRI">
                                        <!--  @click="Details.itemTy = dict.value" -->
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value v-model="Details.itemTy">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-left:-50px">
                                最近一次免疫时间: <span style="border-bottom: 1px solid #000;">
                                    {{ Details.totalSampleQuantity }}
                                </span>
                            </div>
                        </div>
                        <div style="margin-bottom:5px;">
                            2.若是检测布病抗体:
                            <div style="display:flex">
                                样品为：
                                <div style="display:flex">
                                    <div v-for="dict in dict.type.bbktjc_type" :key="dict.value" :label="dict.value"
                                        class="marRI">
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value v-model="Details.itemBbkt">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-left:-50px">
                                免疫后的样品免疫时间: <span style="border-bottom: 1px solid #000;">
                                    {{ Details.immunityTime }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style="margin-left:30px;display:flex;justify-content:space-between;">
                        <div style="flex:1; max-width:50%; white-space:nowrap;"> 地址：<span
                                style="border-bottom: 1px solid #000;">
                                {{ Details.address }}
                            </span></div>
                        <div style="flex:1; max-width:50%; white-space:nowrap;"> 电话：<span
                                style="border-bottom: 1px solid #000;">
                                {{ Details.entrustContactPhone }}
                            </span></div>
                    </div>
                    <div style="margin-left:30px;display:flex;justify-content:space-between;">
                        <div style="flex:1; max-width:50%; white-space:nowrap;"> 送样人：<span
                                style="border-bottom: 1px solid #000;">
                                {{ Details.sendSampleUserName }}
                            </span></div>
                        <div style="flex:1; max-width:50%; white-space:nowrap;"> 邮箱：<span
                                style="border-bottom: 1px solid #000;">
                                {{ Details.entrustContactEmail }}
                            </span></div>
                    </div>
                    <!-- 表头信息 -->


                    <!-- 样品明细 -->
                    <table class="detail-table" style="margin-top:10px">
                        <colgroup>
                            <!-- 9 列，占比总和 100 % -->
                            <col style="width: 5.8%" /> <!-- 报告编号 -->


                        </colgroup>
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>管号</th>
                                <th>牛号</th>

                                <th v-if="Details.itemCode != '8' || Details.itemCode != '9'">类别
                                </th>
                                <th v-if="Details.itemCode == '9'">配种天数</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in samples" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.gh }}</td>
                                <td>{{ item.sampleName }}</td>

                                <td v-if="Details.itemCode != '8' || Details.itemCode != '9'">{{
                                    feedTestMethodLabel(item.sampleType) }}</td>
                                <td v-if="Details.itemCode == '9'">{{ item.pzts }}</td>
                                <td>{{ item.remark }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div class="pdfdown" style="z-index: 100;">
                <!-- <el-button type="primary" @click="pdfMap"></el-button> -->
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
// import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getBloodEntrustOrder, addBloodEntrustOrder, updateBloodEntrustOrder } from "@/api/CentralLaboratory/bloodEntrustOrder";
import QRCode from 'qrcodejs2';
export default {
    dicts: ['blood_task_item_type', 'biochemistry_item_type', 'fmd_time', 'bbktjc_type', 'sample_packaging', 'cattle_type', 'sample_state', 'biochemistry_item_type', 'feed_test_method'],
    data() {
        return {
            // 遮罩层
            loading: false,
            Details: {},
            paymentStatus: '0',
            paymentMethod: '0',
            requiresJudgement: '0',
            samples: [

            ],
            qrcode: null,  // 二维码
        }
    },
    mounted() {
        // 1. 获取 URL 中的 Key
        const printKey = this.$route.query.printKey;
        // 兼容旧逻辑
        const urlDetails = this.$route.query.Details;
        window.addEventListener('beforeunload', () => {
            if (printKey) localStorage.removeItem(printKey);
        });
        let src = null;
        window.addEventListener('beforeunload', () => {
            if (printKey) localStorage.removeItem(printKey);
        });
        // 2. 优先从 localStorage 获取
        if (printKey) {
            try {
                const storageData = localStorage.getItem(printKey);
                if (storageData) {
                    src = JSON.parse(storageData);
                    // 开发环境建议保留，生产环境可取消注释来清理垃圾数据
                    // localStorage.removeItem(printKey); 
                }
            } catch (e) {
                console.error("Storage 解析失败", e);
            }
        } else if (urlDetails) {
            // 旧逻辑兼容
            try {
                src = JSON.parse(decodeURIComponent(urlDetails));
            } catch (e) {
                console.error("URL参数解析失败", e);
            }
        }
        // 3. 校验数据
        if (!src) {
            this.$message.error("未找到打印数据，请重新点击打印");
            return;
        }
        // 4. 赋值
        this.Details = src;
        this.paymentStatus = String(src.paymentStatus ?? '0');
        this.paymentMethod = String(src.paymentMethod ?? '0');

        // 确保 samples 是数组
        this.samples = src.sampleList || [];
        this.generateQR();
        // 5. 延迟打印
        if (this.samples.length >= 0) {
            setTimeout(() => {
                window.print();
            }, 1000); // 稍微延时一点，等待 DOM 渲染
        }
    },
    computed: {
        // 回显 + 提交都用它
        judgeProxy: {
            get() {
                // 后端字段 → 字符串
                return String(this.Details.requiresJudgement ?? 0);
            },
            set(val) {
                // 提交时写回原对象
                this.Details.requiresJudgement = Number(val);
            }
        },
        // 把字典变成 Map，查一次就够了
        feedTestMethodMap() {
            const map = {};
            (this.dict.type.cattle_type || []).forEach(d => {
                map[d.value] = d.label;
            });
            return map;
        }
    },
    methods: {
        generateQR() {
            if (this.qrcode) {
                this.qrcode.clear();
                this.qrcode.makeCode(this.Details.entrustOrderNo);
            } else {
                this.$refs.qrcode.innerHTML = '';
                this.qrcode = new QRCode(this.$refs.qrcode, {
                    text: this.Details.entrustOrderNo,
                    width: 80,
                    height: 80,
                    colorDark: '#000',
                    colorLight: '#fff',
                    correctLevel: QRCode.CorrectLevel.H
                });
            }
        },
        isBiochemistryChecked(value) {
            return (this.Details.itemCode || []).includes(value);
        },
        // 模板里调用的函数
        feedTestMethodLabel(code) {
            return this.feedTestMethodMap[code] || code; // 没匹配上就回显原值
        },
        /** 导出单页 */
        pdfMap() {
            /* 1. 想横着打：方向=l，尺寸=A4横向 */
            const pageWidth = 1040;   // A4 横向宽
            const pageHeight = 555;  // A4 横向高
            const orientation = 'l'; // landscape

            /* 2. 隐藏按钮、去边框（你已有） */
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            $('.sta-main').css({ border: 0, 'margin-top': 0, padding: '0 20px' });
            $('.pdfdown,.uedbtn').hide();

            /* 3. 创建横向 PDF */
            // const stalength = $('.sta-main').length;
            // this.PDF = new jsPDF(orientation, 'pt', [pageWidth, pageHeight]);

            /* 4. 递归截图 */
            // this.getpdf(stalength, 0, pageWidth, pageHeight);

        },

        /** 递归生成每一页 */
        getpdf(stalength, mpddfcont, pageWidth, pageHeight) {
            html2canvas($('.sta-main')[mpddfcont], {
                allowTaint: true,
                scale: 2,
                background: '#ffffff',
                scrollX: 0
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                /* 5. 整张图铺满横向页面 */
                this.PDF.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);

                if (mpddfcont === stalength - 1) {
                    /* 6. 恢复样式 & 下载 */
                    $('.sta-main').css({ 'margin-top': '10px', padding: '10px 20px' });
                    $('.pdfdown,.uedbtn').show();
                    this.PDF.save('委托单.pdf');
                    return;
                }
                mpddfcont++;
                this.PDF.addPage(pageWidth, pageHeight); // 同一横向尺寸
                this.getpdf(stalength, mpddfcont, pageWidth, pageHeight);
            });
        }

    }
}
</script>
<style scoped>
/* @import "~@/assets/styles/BreedingReport.css"; */

.sta-main {
    min-height: 300pt;
    width: 900pt;
    position: relative;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #ebeef5;
}

/* 整体纸张 */
.capture-area {
    width: 100%;
    /* 打印A4 宽度 */
    margin: 0 auto;
    padding: 20px 0;
    background: #fff;
    box-shadow: 0 0 8px rgba(0, 0, 0, .1);
    /* font-family: "SimSun", serif; */
    color: #000;
}

.Details-title {
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 15px;
}

table {
    width: 100%;
    border-collapse: collapse;
    /* margin-bottom: 12px; */
}

/* 1. 先给所有单元格统一打底 */
.info-table td,
.detail-table th,
.detail-table td {
    border: 1px solid #333;
    padding: 6px 8px;
    font-size: 14px;
}

/* 2. 用“否定伪类”把 .info-table 的顶边收回 */
.info-table td {
    border-top: none;

    /* 去掉顶边 */
}

.info-table {
    border-top: 1px solid rgb(0, 0, 0);
}

/* 3. 再把 .detail-table 的顶边补回来（只补它自己的） */
.detail-table th,
.detail-table td {
    /* border-top: none; */
    /* border-top: 1px solid #333; */
    text-align: center;
    /* 水平居中 */
    vertical-align: middle;
    /* 垂直居中 */
}

.detail-table th {
    /* background: #f5f5f5; */
    text-align: center;

    /* 强制黑色文字 */
}

.check-box {
    display: inline-block;
    margin-right: 5px;
    /* padding: 0 4px; */
    /* border-bottom: 1px solid #333; */
    /* min-width: 60px; */
}

.check-box.checked {
    position: relative;
}

.check-box.checked::after {
    content: "√";
    position: absolute;
    right: -10px;
    top: -4px;
    color: red;
    font-weight: bold;
}

.footer {
    margin-top: 15px;
    font-size: 14px;
    line-height: 1.8;
}

.flexG {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100px;
}

input[type="radio"] {
    display: none;
}


.square-radio {
    display: flex;
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid #333;
    /* cursor: pointer; */
}


.square-radio::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: #333;
    display: none;
}


input[type="radio"]:checked+.square-radio::after {
    color: #000000;
    display: block;
}

.marRI {
    display: flex;
    align-items: center;
    margin-right: 10px;
}

@media print {

    /* 1. 去掉阴影、边框、边距 */
    .sta-main {
        width: 760pt !important;
        /* A4 横向可用宽度 */
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
    }

    /* 2. 让最外层打印容器撑满纸张 */
    /* #printId,
    .capture-area {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
    } */

    /* 3. 强制表格不换行、字体略缩小一点，防止列宽超标 */
    table {
        font-size: 12px !important;
        word-break: break-all !important;
    }

    /* 4. 隐藏无关按钮 */
    .pdfdown {
        display: none !important;
    }

    /* 5. 取消浏览器默认页眉页脚（可选） */
    @page {
        size: A4 landscape;
        /* 横向 */
        margin: 5mm 200mm;
        /* 四周留 5 mm 即可 */
    }
}
</style>
