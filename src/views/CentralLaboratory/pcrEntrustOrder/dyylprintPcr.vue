<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="page">
                <div id="captureArea" class="capture-area">

                    <div class="form-title">PCR检测送检单</div>

                    <!-- 整体容器 -->
                    <div class="print-block">
                        <div><label>送检单位：</label><span class="underline">{{ Details.entrustDeptName }}</span></div>
                        <div><label>送检时间：</label><span class="underline">{{ Details.createTime }}</span></div>
                        <div>
                            <label>送检数量：</label><span class="underline short">{{ Details.totalSampleQuantity }}</span>
                            <label class="gap">送样人：</label><span class="underline short">{{ Details.sendSampleUserName
                                }}</span>
                        </div>
                        <div>
                            <label>邮箱：</label><span class="underline">{{ Details.entrustContactEmail }}</span>
                            <label class="gap">电话：</label><span class="underline short">{{ Details.entrustContactPhone }}</span>
                        </div>
                        <div>

                            <label >地址：</label><span class="underline long">{{ Details.address }}</span>
                        </div>
                    </div>

                    <!-- 表头信息 -->


                    <!-- 样品明细 -->
                    <table class="detail-table">
                        <colgroup>
                            <!-- 9 列，占比总和 100 % -->
                            <col style="width: 5.8%" /> <!-- 报告编号 -->

                            <col style="width: 9%" /> <!-- 型号规格 -->
                            <col style="width: 25%" /> <!-- 生产日期或批号 -->
                            <col style="width: 18.3%" /> <!-- 检验项目 -->

                        </colgroup>
                        <thead>
                            <tr>
                                <th>编号</th>
                                <!-- <th>物料</th> -->
                                <th>样品名称</th>
                                <th>检验项目</th>
                                <th>备注(个体样/缸样)</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in samples" :key="index">
                                <td>{{ index + 1 }}</td>
                                <!-- <td>{{ item.invbillName }}</td> -->
                                <td>{{ item.name }}</td>
                                <!-- <td>
                                    <div style="display:flex">
                                        <div v-for="dict in dict.type.pcr_task_item_type" :key="dict.value"
                                            :label="dict.value" class="marRI"
                                            @click="item.pcrTaskItemType = dict.value">
                                            <span class="check-box">{{
                                                dict.label }}</span>
                                            <div>
                                                <input type="radio" :value=dict.value v-model="item.pcrTaskItemType">
                                                <span class="square-radio"></span>
                                            </div>
                                        </div>
                                    </div>
                                </td> -->

                                <td>{{ feedTestMethodLabel(item.pcrTaskItemType) }}</td>
                                <td>{{ item.remark }}</td>
                            </tr>
                        </tbody>
                    </table>


                </div>
            </div>
        </div>

        <div class="pdfdown" style="z-index: 100;">
            <!-- <el-button type="primary" @click="pdfMap"></el-button> -->
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
// import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export default {
    dicts: ['pcr_task_item_type', 'allows', 'report_receive_type', 'sample_return_policy', 'sample_packaging', 'storage_requirement', 'sample_state', 'testing_service_level', 'feed_test_method'],
    data() {
        return {
            // 遮罩层
            loading: false,
            Details: {},
            samples: [],
            paymentStatus: '0',
            paymentMethod: '0',
            requiresJudgement: '0',
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
            (this.dict.type.pcr_task_item_type || []).forEach(d => {
                map[d.value] = d.label;
            });
            return map;
        }
    },
    methods: {
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
    width: 1000pt;
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

.form-title {
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
    /* border-top: none; */

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
    cursor: pointer;
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

.print-block {
    line-height: 2.6;
    /* 行高，可调大 */
    margin-bottom: 20px;
    /* 整块与下方表格距离 */
}

.print-block div {
    margin-bottom: 12px;
    /* 每行间距 */
}

.print-block label {
    display: inline-block;
    width: 5em;
    /* 字段名等宽 */
    text-align: justify;
    text-align-last: justify;
    /* 两端对齐 */
    margin-right: 0.5em;
}

.print-block .gap {
    margin-left: 3em;
    /* 同一行两个字段中间空距 */
}

/* 下划线长度控制 */
.underline {
    display: inline-block;
    border-bottom: 1px solid #000;
    min-width: 12em;
    /* 长下划线 */
    padding-right: 1em;
}

.underline.short {
    /* min-width: 8em; */
    /* 短下划线 */
}

.underline.long {
    min-width: 20em;
    /* 更长下划线 */
}
</style>
