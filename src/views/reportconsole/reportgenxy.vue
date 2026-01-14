<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="PageStyle">
                <div class="biaotihdflex">
                    <div class="font15">报告编号（ReportID）：2025N-213</div>
                </div>
                <div class="biaotihd" style=" margin-top: 130px;">
                    <div class="titlebold">动物疫病诊断（检验）报告书</div>
                </div>
                <div class="biaotihd" style="margin-top: 150px;">
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            送检单位：
                            <span class="content-line">德州牧场</span>
                        </div>
                    </div>
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            样品名称：
                            <span class="content-line">血清</span>
                        </div>
                    </div>
                    <div class="lefttitle">
                        <div class="gongsi flex-line">
                            检验类别：
                            <span class="content-line">牛结核抗体检测</span>
                        </div>
                    </div>
                </div>
                <div class="gongsift">
                    <div class="dibu1">检测单位：光明牧业有限公司检验测试中心</div>
                    <div class="dibu2">报告日期：__2025___年__5_月___9__日</div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:10px">
                    <div class="dibu1 font30">声 明</div>
                </div>
                <div class="biaotihd" style=" margin-top: 0px;font-size:20px;text-align:left">
                    <div style="margin:13px 0">
                        1.报告无检验专用章无效；
                    </div>
                    <div style="margin:13px 0">
                        2.复制本报告未重新加盖本检验专用章无效；复印部分报告无效；
                    </div>
                    <div style="margin:13px 0">
                        3.报告无编制、审核、批准人签字无效；
                    </div>
                    <div style="margin:13px 0">
                        4.报告涂改无效；
                    </div>
                    <div style="margin:13px 0">
                        5.对检验报告若有异议，请在收到报告之日起十五日内向检验单位提出，逾期不予受理；
                    </div>
                    <div style="margin:13px 0">
                        6.本检验报告仅对来样负责；
                    </div>
                    <div style="margin:13px 0">
                        7.未经检验单位同意，本检验报告不得用于商业性广告。
                    </div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:20px">
                    <div class="dibu1 font30">动物疫病诊断（检验）报告单</div>
                </div>
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号: 250917009</div>
                            <div>共{{ pagedList.length + 1 }}页 第1页</div>
                        </div>
                    </div>
                    <table class="sample-table">
                        <tr>
                            <th colspan="1">送检单位</th>
                            <td colspan="1">德州牧场</td>
                            <th colspan="1">样品名称</th>
                            <td colspan="1">血清</td>
                            <th colspan="1">样品数量</th>
                            <td colspan="1">460</td>
                        </tr>
                        <tr>
                            <th colspan="1">动物类别</th>
                            <td colspan="1">牛</td>
                            <th colspan="1">收样日期</th>
                            <td colspan="1">2025/5/9</td>
                            <th colspan="1">检验日期</th>
                            <td colspan="1">2025/5/9</td>
                        </tr>
                        <tr>
                            <th colspan="2">样品状态：</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">血清清亮</td>
                        </tr>
                        <tr>
                            <th colspan="2">检测类别</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">牛分支杆菌抗体检测</td>
                        </tr>
                        <tr>
                            <th colspan="2">检验方法及依据</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">牛分支杆菌抗体检测技术规范</td>
                        </tr>
                        <tr>
                            <th colspan="2">仪器设备</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">FC酶标仪</td>
                        </tr>
                        <tr>
                            <th colspan="2">检测结果与评价</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">
                                牛结核病抗体ELISA检测：检测460份，阳性0份，阳性率0.0%</td>
                        </tr>
                        <tr>
                            <th colspan="2">判定标准<br>Conclusion</th>
                            <!-- <td colspan="5" rowspan="1" class="colspan-cell">11</td> -->
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">
                                &nbsp;根据委托方的要求，仅提供实测数据，详见检测结果汇总页。
                                <div style="border-bottom:1px solid black;width:100%;padding:5px 0"></div>
                                <div>
                                    S/P=（样品OD值-阴性对照的平均OD值）/（阳性对照的平均OD值-阴性对照的平均OD值）<br>
                                    标准阴性血清的OD值必须在小于0.150。标准阳性血清的OD值必须在1.500以上。<br>
                                    <div style="height:20px"></div>
                                    判定：S/P值≥0.5判为结核抗体阳性，用+表示；<br>
                                    S/P值＜0.5判为结核抗体阴性，用-表示。
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th colspan="2">标准对照</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">以上实验标准对照均成立</td>
                        </tr>
                        <tr>
                            <th colspan="2">试剂来源及批号</th>
                            <td colspan="4" class="colspan-cell" style="padding:10px 0">牛结核病抗体ELISA检测：安世佳合（4304P056）
                            </td>
                        </tr>
                    </table>
                    <div class="xfqm">
                        <div class="ttxf">编制人:<img :src="signTypes.编制人" class="qm"></div>
                        <div class="ttxf">审核人:<img :src="signTypes.审核人" class="qm"></div>
                        <div class="ttxf">批准人:<img :src="signTypes.批准人" class="qm"></div>
                    </div>
                    <div class="xfqm" style="margin-top:10px">
                        <div class="ttxf">日期:2025/5/9</div>
                        <div class="ttxf">日期:2025/5/9</div>
                        <div class="ttxf">日期:2025/5/9</div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 第一页：带表头 -->
        <div class="sta-main" v-if="pagedList.length > 0">
            <div class="PageStyle">
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号: 250917009</div>
                            <div>共{{ pagedList.length + 1 }}页 第2页</div>
                        </div>
                    </div>

                    <div style="text-align:left;font-size:20px">以下是检测结果汇总：</div>
                    <table class="sample-table" style=" font-size: 11px;">
                        <tr>
                            <td rowspan="2">编号</td>
                            <td rowspan="2">牛号</td>
                            <td colspan="2">结核ELISA抗体</td>
                        </tr>
                        <tr>
                            <td>S/P值</td>
                            <td>结果判定</td>
                        </tr>
                        <tr v-for="(item, index) in pagedList[0]" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.a }}</td>
                            <td>{{ item.b }}</td>
                            <td>{{ item.c }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <template v-for="(page, pageIndex) in pagedList.slice(1)">
            <div class="sta-main" :key="'page-' + pageIndex">
                <div class="PageStyle">
                    <div class="report-container" style="margin:0">
                        <div class="report-header">
                            <div class="report-info">
                                <div></div>
                                <div>共{{ 1 + pagedList.length }}页 第{{ 3 + pageIndex }}页</div>
                            </div>
                        </div>

                        <table class="sample-table" style=" font-size: 11px;">

                            <tr v-for="(item, index) in page" :key="index">
                                <td>{{ rowsPerPage + pageIndex * 30 + index + 1 }}</td>
                                <td>{{ item.a || '' }}</td>
                                <td>{{ item.b || '' }}</td>
                                <td>{{ item.c || '' }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </template>

        <div class="pdfdown" style="z-index: 100;">
            <el-button type="primary" @click="pdfMap">导出单页</el-button>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { XZPic } from "@/api/hyd";
export default {
    data() {
        return {
            // 遮罩层
            loading: false,
            signTypes: {
                编制人: '',
                审核人: '',
                批准人: '',
            },
            rowsPerPage: 27,
            infoList: [{
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }, {
                a: "1",
                b: "1",
                c: "1",
            }, {
                a: "2",
                b: "1",
                c: "1",
            }, {
                a: "3",
                b: "1",
                c: "1",
            }]
        }
    },
    mounted() {
        this.qmhx()
    },
    computed: {
        pagedList() {
            const pages = [];

            /* ---------- 第一页 27 条 ---------- */
            pages.push(this.infoList.slice(0, 27));

            /* ---------- 剩余 30 条/页 ---------- */
            const left = this.infoList.slice(27);
            for (let i = 0; i < left.length; i += 31) {
                pages.push(left.slice(i, i + 31));
            }
            return pages;
        }
    },
    methods: {
        /** 导出单页 */
        pdfMap() {
            var title = this.csupname;
            var whiteImg = "";
            window.pageYOffset = 0;
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            var doc = "";
            var stamain = document.getElementsByClassName("sta-main");
            for (var i = 0; i < stamain.length; i++) {
                stamain[i].style.border = "0";
            }

            $(".sta-main").css("margin-top", "0", "padding", "0px 20px");
            $(".pdfdown").css("display", "none");
            $(".uedbtn").css("display", "none");
            var stalength = $(".sta-main").length;
            var mpddfcont = 0;
            var jspdfsize = ['580', '841.89'];
            this.PDF = new jsPDF('p', 'pt', jspdfsize);
            this.getpdf(stalength, mpddfcont);

        },
        getpdf(stalength, mpddfcont) {
            var pdfheight = 841.89;
            html2canvas($(".sta-main")[mpddfcont], {
                allowTaint: true,
                scale: 2,
                logging: true,
                background: "#ffffff",
                imageTimeout: 0,
                removeContainer: true,
                scrollX: 0,
            }).then(canvas => {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                var pageData = canvas.toDataURL("image/jpeg", 1);
                console.log(contentWidth, "22tree");
                if (contentHeight != 0) {
                    this.PDF.addImage(pageData, "jpeg", 0, 0, 580, 841.89);
                }
                if (mpddfcont == stalength - 1) {
                    $(".sta-main").css("margin-top", "10px", "padding", "10px 20px");
                    this.PDF.save('血样检测报告' + ".pdf");
                    $(".pdfdown").css("display", "block");
                    $(".uedbtn").css("display", "block");
                    return;
                }
                mpddfcont++;

                if (mpddfcont < stalength) {
                    console.log(mpddfcont);
                    this.PDF.addPage('580', '841.89');
                    if ($(".sta-main:eq(" + mpddfcont + ") #containtree").length != 0) {
                        this.getstpdf(stalength, mpddfcont);
                    } else {
                        this.getpdf(stalength, mpddfcont);
                    }
                }
            });
        },
        // 签名回显
        qmhx() {
            XZPic("63aa2f6864b8410c8861f637bca8edbb").then((res) => {
                this.signTypes.编制人 = URL.createObjectURL(res)
            })
            XZPic("63aa2f6864b8410c8861f637bca8edbb").then((res) => {
                this.signTypes.审核人 = URL.createObjectURL(res)
            })
            XZPic("63aa2f6864b8410c8861f637bca8edbb").then((res) => {
                this.signTypes.批准人 = URL.createObjectURL(res)
            })
        }
    }
}
</script>
<style scoped>
@import "~@/assets/styles/BreedingReportxy.css";

.xingzhuanginput {
    width: 100%;
    border: 0;
    background: #fff;
    height: 25px;
    outline: none;
}
</style>
<style scoped>
* {
    font-family: "宋体"
}

.mutable * {
    font-family: "宋体";
}

.elevator {
    right: 50px;
    top: 70%;
    margin-top: -45px;
    display: none;
    position: fixed;
    z-index: 5;
    width: 30px;
}

ul,
li {
    padding: 0;
    margin: 0;
    list-style: none;
}

.layui-upload-drag {
    width: 100% !important;
}

.modal-backdrop {
    height: 100%;
}

.modal {
    z-index: 10;
}

.expandIcon {
    display: none !important;
}

#treecont .line>.line-right {
    width: 20px !important;
    border-bottom: solid 2px #000 !important;
}

#treecont>.node-cell {
    position: relative;
}

.treecatalog {
    position: absolute;
    top: 0;
    width: 100%;
    text-align: center;
    text-align: center;
    left: 0;
}

.treecatalog b {
    display: inline-block;
    padding: 10px 15px;
    background-color: moccasin;
}

.contpage3tree {
    min-height: 1020px;
    padding-top: 20px;
    width: auto;
    min-width: 500pt;
    display: inline-block;
    padding-left: 30px;
}

.contpage3tree .node-parent,
.contpage3tree .node-childrens {
    vertical-align: top !important;
}

.contpage3tree .line {
    vertical-align: top !important;
}

.contpage3tree .line .line-right {
    margin-top: 11px !important;

}

.node-lines .linechild {
    position: absolute;
    top: 11px;
    width: 20px;
    border-bottom: solid 2px #000;
}

.contpage3tree .line-top {
    border-bottom: 0 !important;
    height: 11px !important;
}

.contpage3tree .line-bottom {
    border-bottom: 0 !important;
    height: calc(100% - 11px) !important;
}

#treecont .line-bottom.last,
#treecont .line-top.first {
    border: 0 !important;
}

#treecont .line-top.first {
    margin-top: 1px !important;
}

#treecont .line-top,
#treecont .line-bottom {
    border-left: solid 2px #000 !important;
}

/*里面的代码可以根据自己需求去进行更改*/
/* 设置滚动条的样式 */
.contpage3tree::-webkit-scrollbar {
    width: 12px;
}

/* 滚动槽 */
.contpage3tree::-webkit-scrollbar-track {
    -webkit-box-shadow: inset rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

/* 滚动条滑块 */
.contpage3tree::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset rgba(0, 0, 0, 0.5);
}

.contpage3tree::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(255, 0, 0, 0.4);
}


.Page9td {
    text-align: center;
    width: 10%
}

.mulutext {
    line-height: 32px;
}
</style>
