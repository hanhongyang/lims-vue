margin:8px 0<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="page">
                <div id="captureArea" class="capture-area">

                    <div class="form-title">SHGM-ZI-29-06 饲料样品委托检测单</div>

                    <!-- 表头信息 -->
                    <table class="info-table">
                        <colgroup>
                            <col style="width:6%"> <!-- 第1列 -->
                            <col style="width:30.3%"> <!-- 第2列 -->
                            <col style="width:16.67%"><!-- 第3列 -->
                            <col style="width:16.67%"><!-- 第4列 -->
                            <col style="width:15.67%"><!-- 第5列 -->
                            <col style="width:17.67%"><!-- 第6列 -->
                            <col style="width:15.67%"><!-- 第6列 -->
                        </colgroup>
                        <tr>
                            <td>生产企业</td>
                            <td>{{ Details.producerUnitName }}</td>
                            <td>送检单位</td>
                            <td>{{ currentDept.deptName }}</td>
                            <td rowspan="2">商标</td>
                            <td rowspan="2">/</td>
                        </tr>
                        <tr>
                            <td>报告寄送地址</td>
                            <td>{{ Details.reportMailingAddress }}</td>
                            <td>委托方电话/邮箱</td>
                            <td>{{ Details.entrustContactPhone + '/' + Details.entrustContactEmail }}</td>
                        </tr>
                        <tr>
                            <td>送样时间</td>
                            <td>{{ Details.sendSampleDate }}</td>
                            <td>联系人</td>
                            <td>{{ Details.entrustContact }}</td>
                            <td>接收人</td>
                            <td>{{ Details.receiverName }}</td>
                        </tr>
                    </table>
                    <table class="info-table"
                        style="border-top: none !important; border-collapse: collapse;table-layout:fixed;">
                        <colgroup>
                            <col style="width:6.65%"> <!-- 第1列 -->
                            <col style="width:20.9%"> <!-- 第2列 -->
                            <col style="width:16.67%"><!-- 第3列 -->
                            <col style="width:16.67%"><!-- 第4列 -->
                            <col style="width:16.67%"><!-- 第5列 -->
                            <col style="width:16.67%"><!-- 第6列 -->
                            <col style="width:16.67%">第6列
                        </colgroup>
                        <tr>
                            <td>发票抬头</td>
                            <td colspan="3">
                                {{ Details.invoiceTitle }}
                            </td>
                            <td colspan="3">
                                <div style="margin-bottom:5px;display:flex">
                                    付款:
                                    <div class="marRI" @click="paymentStatus = '1'">
                                        <span class="check-box">已付</span>
                                        <div>
                                            <input type="radio" name="option" value="1" v-model="paymentStatus">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                    <div class="marRI" @click="paymentStatus = '0'">
                                        <span class="check-box">未付</span>
                                        <div>
                                            <input type="radio" name="option" value="0" v-model="paymentStatus">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                    <div class="marRI" @click="paymentMethod = '1'">
                                        <span class="check-box">(转账</span>
                                        <div>
                                            <input type="radio" name="option" value="1" v-model="paymentMethod">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                    <div class="marRI" @click="paymentMethod = '2'">
                                        <span class="check-box">现金</span>
                                        <div>
                                            <input type="radio" name="option" value="2" v-model="paymentMethod">
                                            <span class="square-radio"></span>
                                        </div>)
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table class="info-table"
                        style="border-top: none !important; border-collapse: collapse;table-layout:fixed;">
                        <colgroup>
                            <col style="width:5.7%"> <!-- 第1列 -->
                            <col style="width:32.6%"> <!-- 第2列 -->
                            <col style="width:13.67%"><!-- 第3列 -->
                            <col style="width:8.67%"><!-- 第4列 -->
                            <col style="width:16.67%"><!-- 第5列 -->
                            <col style="width:8.67%"><!-- 第6列 -->
                            <col style="width:8.67%"><!-- 第6列 -->
                        </colgroup>
                        <tr>
                            <td>发票抬头</td>
                            <td colspan="2" rowspan="3">
                                <div style="margin-bottom:5px;display:flex"> 1.报告是否需要判定:
                                    <div v-for="dict in dict.type.requires_judgement" :key="dict.value"
                                        :label="dict.value" class="marRI"
                                        @click="Details.requiresJudgement = dict.value">
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value v-model="Details.requiresJudgement">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-bottom:5px;display:flex"> 2.是否同意分包:
                                    <div v-for="dict in dict.type.allows" :key="dict.value" :label="dict.value"
                                        class="marRI" @click="Details.allowsSubcontracting = dict.value">
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value
                                                v-model="Details.allowsSubcontracting">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>
                                <div style="margin-bottom:5px;display:flex"> 3.报告领取方式:
                                    <div v-for="dict in dict.type.report_receive_type" :key="dict.value"
                                        :label="dict.value" class="marRI"
                                        @click="Details.reportReceiveType = dict.value">
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value v-model="Details.reportReceiveType">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td colspan="1">样品要求</td>
                            <td colspan="1">
                                <div style="margin-bottom:5px;display:flex">
                                    <div v-for="dict in dict.type.sample_return_policy" :key="dict.value"
                                        :label="dict.value" class="marRI"
                                        @click="Details.sampleReturnPolicy = dict.value">
                                        <span class="check-box">{{
                                            dict.label }}</span>
                                        <div>
                                            <input type="radio" :value=dict.value v-model="Details.sampleReturnPolicy">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                </div>

                            </td>
                            <td colspan="1">样品数量</td>
                            <td colspan="1">{{ Details.sampleList.length }}个</td>
                        </tr>
                    </table>
                    <!-- 样品明细 -->
                    <table class="detail-table">
                        <colgroup>
                            <!-- 9 列，占比总和 100 % -->
                            <col style="width: 5.8%" /> <!-- 报告编号 -->
                            <col style="width: 10%" /> <!-- 样品名称 -->
                            <col style="width: 9%" /> <!-- 型号规格 -->
                            <col style="width: 10%" /> <!-- 生产日期或批号 -->
                            <col style="width: 18.3%" /> <!-- 检验项目 -->
                            <col style="width: 10.8%" /> <!-- 样品包装 -->
                            <col style="width: 15.9%" /> <!-- 样品状况 -->
                            <col style="width: 10.9%" /> <!-- 储存要求 -->
                            <col style="width: 6%" /> <!-- 检验标准/方法 -->
                        </colgroup>
                        <thead>
                            <tr>
                                <th>报告编号</th>
                                <th>样品名称</th>
                                <th>型号规格</th>
                                <th>生产日期或批号</th>
                                <th>检验项目</th>
                                <th>样品包装</th>
                                <th>样品状况</th>
                                <th>储存要求</th>
                                <th>检验标准/方法</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in samples" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.model }}</td>
                                <td>{{ item.batchNo }}</td>
                                <td>{{item.testItem.map(i => i.itemName).join(' / ')}}</td>
                                <td>
                                    <div style="display:flex">
                                        <div v-for="dict in dict.type.sample_packaging" :key="dict.value"
                                            :label="dict.value" class="marRI" @click="item.packaging = dict.value">
                                            <span class="check-box">{{
                                                dict.label }}</span>
                                            <div>
                                                <input type="radio" :value=dict.value v-model="item.packaging">
                                                <span class="square-radio"></span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style="display:flex;flex-wrap: wrap;row-gap: 12px; ">
                                        <div v-for="dict in dict.type.sample_state" :key="dict.value"
                                            :label="dict.value" class="marRI" @click="item.status = dict.value"
                                            style="width:27.5%">
                                            <span class="check-box">{{
                                                dict.label }}</span>
                                            <div>
                                                <input type="radio" :value=dict.value v-model="item.status">
                                                <span class="square-radio"></span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style="display:flex">
                                        <div v-for="dict in dict.type.storage_requirement" :key="dict.value"
                                            :label="dict.value" class="marRI"
                                            @click="item.storageRequirement = dict.value">
                                            <span class="check-box">{{
                                                dict.label }}</span>
                                            <div>
                                                <input type="radio" :value=dict.value v-model="item.storageRequirement">
                                                <span class="square-radio"></span>
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td>{{ feedTestMethodLabel(item.testMethod) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="info-table" style="border-top:none">

                        <tr>
                            <td>
                                <div style="display:flex">
                                    <div class="marRI" @click="Details.allowsTestMethods = '1'">
                                        <span class="check-box">同意实验室所选定的测试方法</span>
                                        <div>
                                            <input type="radio" value="1" v-model="Details.allowsTestMethods">
                                            <span class="square-radio"></span>
                                        </div>
                                    </div>
                                    <span style="margin-left:40px"> 备注:</span>
                                </div>

                            </td>

                        </tr>
                        <tr>
                            <td>
                                <div style="display:flex;flex-direction: column;justify-content: space-between;">
                                    <p style="font-size:blod"> 测试服务要求:</p>
                                    <div style="display:flex;justify-content: space-between;">
                                        <div v-for="dict in dict.type.testing_service_level" :key="dict.value"
                                            :label="dict.value" class="marRI"
                                            @click="Details.testingServiceLevel = dict.value">
                                            <span class="check-box">{{
                                                dict.label }}</span>
                                            <div>
                                                <input type="radio" :value=dict.value
                                                    v-model="Details.testingServiceLevel">
                                                <span class="square-radio"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <p style="font-size:blod"> 加急测试需在测试申请前和实验室事前确认</p>
                                </div>
                            </td>
                        </tr>
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getprintFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import { getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
export default {
    dicts: ['requires_judgement', 'allows', 'report_receive_type', 'sample_return_policy', 'sample_packaging', 'storage_requirement', 'sample_state', 'testing_service_level', 'feed_test_method'],
    data() {
        return {
            // 遮罩层
            loading: false,
            Details: {
                sampleList: []
            },
            paymentStatus: '0',
            paymentMethod: '0',
            requiresJudgement: '0',
            samples: [

            ],
            // 当前机构信息
            currentDept: {
                deptId: null,
                deptName: ''
            },
        }
    },
    mounted() {
        const qs = this.$route.query.id
        if (!qs) return
        // 获取当前机构信息
        this.getCurrentDeptInfo();
        getprintFeedEntrustOrder(qs).then(res => {
            console.log(res, '11111111111')
            if (res.code == 200) {
                this.Details = res.data
                this.paymentStatus = String(res.data.paymentStatus ?? '0')
                this.paymentMethod = String(res.data.paymentMethod ?? '0')
                this.samples = res.data.sampleList || []   // ✅ 这里一定是数组
            } else {
                this.$message.error('数据查询失败，无法打印，请联系管理员。')
            }

        })



        console.log(this.samples, '111111111111111111')
        if (this.samples) {
            setTimeout(() => {
                window.print()
            }, 2000)
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
            (this.dict.type.feed_test_method || []).forEach(d => {
                map[d.value] = d.label;
            });
            return map;
        }
    },
    methods: {

        // 获取当前机构信息
        getCurrentDeptInfo() {
            // 获取送检单位信息
            getLoginUserDept().then(response => {
                this.currentDept = response.data;
                console.log(this.currentDept, '当前机构信息')
                // this.form.entrustDeptId = this.currentDept.deptId;

                // 获取机构联系信息
                this.getDeptContactInfo(this.currentDept.deptId);

                // 新增：如果是新增状态，设置默认收样人
                if (!this.form.opFeedEntrustOrderId) {
                    // this.form.receiverName = this.currentDept.leader || '待指定';
                }
            });
        },
        // 修改获取机构联系信息的方法
        getDeptContactInfo(deptId) {
            getDeptContactInfoByDeptId(deptId).then(response => {
                this.bsContactInfoList = response.data.bsContactInfoList || [];
                console.log(this.bsContactInfoList, '机构联系信息')
                // 新增逻辑：如果是新增委托单，默认选择 isDefaultSendSampleUser=1 的联系方式
                // if (!this.form.opFeedEntrustOrderId) {
                //     const defaultContact = this.bsContactInfoList.find(
                //         contact => contact.isDefaultSendSampleUser === '1'
                //     );

                //     if (defaultContact) {
                //         this.selectedContactId = defaultContact.bsContactInfoId;
                //         // 自动填充联系方式信息
                //         this.form.entrustContactInfoId = defaultContact.bsContactInfoId;
                //         this.form.entrustContact = defaultContact.contactPerson;
                //         this.form.entrustContactPhone = defaultContact.contactPhone;
                //         this.form.entrustContactEmail = defaultContact.contactEmail;
                //     }
                // } else {
                //     // 编辑状态：联系信息加载完成后，如果有ID需要回显，在这里处理
                //     if (this.form.entrustContactInfoId) {
                //         const index = this.bsContactInfoList.findIndex(
                //             contact => contact.bsContactInfoId === this.form.entrustContactInfoId
                //         );
                //         if (index !== -1) {
                //             this.selectedContactIndex = index;
                //         }
                //     }
                // }
            });
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
    border-top: none;

    /* 去掉顶边 */
}

.info-table {
    border-top: 1px solid rgb(0, 0, 0);
}

/* 3. 再把 .detail-table 的顶边补回来（只补它自己的） */
.detail-table th,
.detail-table td {
    border-top: none;
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
    .sta-main {
        width: 760pt !important;
        margin: 0 !important;
        box-shadow: none !important;
        border: none !important;
    }

    /* 关键：覆盖单元格上的 14px */
    .info-table td,
    .detail-table th,
    .detail-table td {
        font-size: 10px !important;
        /* 你可以根据需要改成 9 / 11 */
    }

    table {
        word-break: break-all !important;
    }

    @page {
        size: A4 landscape;
        margin: 10mm;
        /* 建议不要再用 5mm 200mm 这种极端值 */
    }

    .pdfdown {
        display: none !important;
    }
}
</style>
