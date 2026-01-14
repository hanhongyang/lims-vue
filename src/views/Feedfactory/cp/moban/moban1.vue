<!-- BreedingReport.vue -->
<template>

    <div class="report-a4">
        <el-button type="primary" @click="print" v-if="!printing">打印报告</el-button>
        <!-- 顶部公司 / 报告标题 -->
        <div class="header-title">
            <div class="company">滑县光明牧业饲料有限公司</div>
            <div class="report-name">产品出厂检验报告</div>
        </div>

        <!-- 报告编号 -->
        <div class="report-no">
            记录编号：{{ data.reportId }}
        </div>

        <!-- 主信息表 -->
        <table class="main-table">
            <col style="width: 24%">
            <col style="width: 31%">
            <col style="width: 18%">
            <col style="width: 27%">
            <tr>
                <th>产品名称</th>
                <td>{{ data.invbillName }}</td>
                <th>检验日期</th>
                <td>{{ data.testTime }}</td>
            </tr>
            <tr>
                <th>样品编号</th>
                <td contenteditable @blur="syncField('invbillCode', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.invbillCode }}
                </td>
                <th>样品状态</th>
                <td contenteditable @blur="syncField('status', $event)" @keydown.enter.prevent="$event.target.blur()">
                    {{ data.status }}
                </td>
            </tr>
            <tr>
                <th>生产日期/批号</th>
                <td contenteditable @blur="syncField('productionDate', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.productionDate }}
                </td>
                <th>判定依据</th>
                <td contenteditable @blur="syncField('basisForJudgment', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.basisForJudgment }}
                </td>
            </tr>
            <tr>
                <th>主要仪器</th>
                <td colspan="3" contenteditable @blur="syncField('mainInstruments', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.mainInstruments }}
                </td>
            </tr>
            <tr>
                <th>检验方法</th>
                <td colspan="3" contenteditable @blur="syncField('inspectionMethod', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.inspectionMethod }}
                </td>
            </tr>
            <tr>
                <th>感官性状</th>
                <td colspan="3" contenteditable @blur="syncField('sensoryTraits', $event)"
                    @keydown.enter.prevent="$event.target.blur()">
                    {{ data.sensoryTraits }}
                </td>
            </tr>
            <tr>
                <th colspan="4">检测数据</th>
            </tr>
        </table>

        <!-- 检测项目结果表 -->
        <table class="result-table">
            <thead>
                <tr>
                    <th style="width: 24%">检验项目</th>
                    <th style="width: 24%">标准值</th>
                    <th style="width: 24%">判定值</th>
                    <th style="width: 11%">实测值</th>
                    <th style="width: 17%">检验结论</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, idx) in data.items" :key="idx">
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.feature.standardValue }}</td>
                    <td>{{ item.feature.judgeValue }}</td>
                    <td>{{ item.checkResult }}</td>
                    <td>{{ item.result }}</td>
                </tr>
            </tbody>
            <tr style="height: 50px;line-height: 50px;">
                <th>检测结论</th>
                <td colspan="4">{{ data.remark }}</td>
            </tr>
        </table>
        <!-- 报告编号 -->
        <div class="bottom">
            <div style="display: flex; align-items: center;">
                <span>编制：</span>
                <span style="width: 100px;"></span> <!-- 100 px 空白 -->
                <span>审核：</span>
            </div>
            <div>
                报告日期：{{ new Date() | dateFormat }}
            </div>

        </div>
    </div>
</template>

<script>
import { printReport } from '@/api/feedfactory/plan'
export default {

    filters: {
        dateFormat(val) {
            const d = new Date(val)
            return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
        }
    },
    props: {
        // 外部传入的报告数据
        reportData: {
            type: Object,
            default: () => ({

            })
        }
    },
    data() {
        return {
            localData: this.reportData,
            printing: false   // 控制按钮显隐
        }
    },

    computed: {
        // 本地统一用 data 指向 props，模板无需改动
        data() {
            return this.localData
        }
    },
    created() {
        this.mergeData()
    },
    mounted() {
        const printKey = this.$route.query.printKey;
        window.addEventListener('beforeunload', () => {
            if (printKey) localStorage.removeItem(printKey);
        });
    },
    methods: {
        print() {
            this.printing = true          // 1. 隐藏按钮
            this.$nextTick(() => {
                window.print()              // 2. 调出打印窗口
            })

            // 3. 打印窗口关闭后恢复按钮
            const afterPrint = () => {
                this.printing = false
                window.removeEventListener('afterprint', afterPrint)
            }
            window.addEventListener('afterprint', afterPrint)
        },
        /* 统一合并数据 */
        mergeData() {
            const query = this.$route.query

            // 1. 先拿本地“半成品”
            let draft = {}
            if (query.printKey) {
                const str = localStorage.getItem(query.printKey)
                if (str) draft = JSON.parse(str)
            }

            // 2. 再拿接口“实测结果”
            if (query.opSamplingPlanSampleId) {
                printReport({ opSamplingPlanSampleId: query.opSamplingPlanSampleId }).then(res => {
                    if (res.code === 200) {
                        // 3. 合并：draft 覆盖默认值，接口数据覆盖 draft
                        this.localData = Object.assign(
                            {},                       // 空对象，防止改 props
                            // this.getDefaultReport(),  // 默认兜底
                            draft,                    // 本地半成品
                            res.data                  // 接口实测
                        )
                    }
                })
            } else {
                // 没有接口时，也做一次合并，防止本地数据丢失
                this.localData = Object.assign(
                    {},
                    // this.getDefaultReport(),
                    draft
                )
            }
            console.log(this.localData, '11111111')
        },

        // 统一把 contenteditable 的值同步到 reportData
        syncField(key, evt) {
            this.reportData[key] = evt.target.textContent.trim()
        }
    }
}
</script>

<style scoped>
/* ===== 全局 A4 版心 ===== */
.report-a4 {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 20mm;
    padding-top: 10mm;
    box-sizing: border-box;
    /* font-family: 'SimSun', serif; */
    font-size: 16px;
    color: #000;
    background: #fff;
}

/* ===== 顶部标题 ===== */
.header-title {
    text-align: center;
    margin-bottom: 12px;
}

.company {
    font-size: 22px;
    font-weight: bold;
    /* font-family: 'KaiTi', serif; */
    margin-bottom: 6px;
}

.report-name {
    font-size: 20px;
    font-weight: bold;
    /* font-family: 'KaiTi', serif; */
    letter-spacing: 2px;
}

/* ===== 报告编号 ===== */
.report-no {
    text-align: right;
    margin-bottom: 10px;
    font-size: 12px;
}

.main-table {
    margin-bottom: 0;
}

.main-table tr:last-child th,
.main-table tr:last-child td {
    border-bottom: none;
}

/* ===== 表格通用 ===== */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
}

th,
td {
    border: 1px solid #000;
    text-align: center;
    /* 仅保留黑色边框 */
    padding: 8px;
    /* vertical-align: top; */
    vertical-align: middle;
}

th {
    vertical-align: middle;
    font-weight: normal;
    text-align: center;
    background: none;
    /* 去掉灰底 */
}


th span {
    font-family: Arial, sans-serif;
    font-size: 10px;
}

/* ===== 结果表 ===== */
.result-table td {
    text-align: center;
}

/* ===== 结论栏 ===== */
.conclusion-cell {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    min-height: 80px;
}

.seal-area {
    text-align: center;
    white-space: nowrap;
}

.seal {
    display: none;
    /* 隐藏彩色公章 */
}

.seal-text {
    font-size: 10px;
    margin-top: 2px;
}

.issue-date {
    font-size: 12px;
    margin-top: 4px;
}

/* ===== 签名区 ===== */
.sign-table td {
    text-align: center;
    vertical-align: middle;
}

.sign-img {
    max-width: 120px;
    max-height: 50px;
    object-fit: contain;
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* ===== 打印微调 ===== */
/* @media print {
    .report-a4 {
        padding: 0;
        margin: 0;
        box-shadow: none;
    }

    @page {
        size: A4 portrait;
        margin: 20mm;
    }
} */
</style>