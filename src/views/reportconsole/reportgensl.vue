<template>
    <div id="printId" v-loading="loading">
        <div class="sta-main">
            <div class="seal-corner">
                <canvas ref="canvas1" width="50" height="200"></canvas>
            </div>

            <div class="PageStyle">
                <div class="biaotihdflex">
                    <img class="imgniu" src="../../assets/images/hst.png">
                    <img ref="sealImg" src="../../assets/images/seal2.png" style="display: none;">
                    <div class="font15">报告编号（ReportID）：{{ feedReportBase.reportNo }}</div>
                </div>
                <div class="biaotihd" style=" margin-top: 130px;">
                    <div class="titlebold">检 测 报 告</div>
                    <div class="titlebold1">Testing Report</div>
                </div>
                <div class="biaotihd" style="margin-top: 150px;">
                    <div class="lefttitle">
                        <p class="gongsi">样品名称</p>
                        <div class="gongsi flex-line">
                            (Sample Description)
                            <span class="content-line">{{ feedReportBase.sampleName }}</span>
                        </div>
                    </div>
                    <div class="lefttitle">
                        <p class="gongsi">委托单位</p>
                        <div class="gongsi flex-line">
                            (Applicant)
                            <span class="content-line">{{ feedReportBase.entrustDeptName }}</span>
                        </div>
                    </div>
                </div>
                <div class="gongsift">
                    <div class="dibu1">{{ feedReportBase.testLocation }}</div>
                    <div class="dibu2">Testing Center of Bright Farming Co., Ltd.</div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="seal-corner">
                <canvas ref="canvas2" width="50" height="200"></canvas>
            </div>
            <div class="PageStyle">
                <div class="biaotihdflex">
                    <img class="imgniu" src="../../assets/images/hst.png">
                </div>

                <div class="gongsift" style="position:relative;top:-80px">
                    <div class="dibu1 font30">声 明</div>
                    <div class="dibu2 font30">Statement</div>
                </div>
                <div class="biaotihd" style=" margin-top: -110px;font-size:16px;text-align:left">
                    <div style="display:flex;">
                        <div>1、</div>
                        <div>本《检测报告》无光明牧业有限公司检验测试中心专用章和批准人签章无效。<br>
                            <div style="margin:8px 0">This report is invalid without signature of approver
                                and special seal for inspection of Testing
                                Center of
                                Bright Farming Co., Ltd.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>2、</div>
                        <div>委托单位对检测结果如有异议，请于《检测报告》完成之日起十五日内向检测单位书
                            面提出复检申请，同时附之《检测报告》原件及复检费。<br>
                            <div style="margin:8px 0">If the applicant has any questions about the results, shall
                                provide written retest application with the
                                original report and retest fees to investigation testing group within fifteen days from
                                the approval date.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>3、</div>
                        <div>委托单位办理完以上手续后，本检测单位尽快安排复检，如果复检结果与异议内容相
                            符，本检测单位将退还委托单位的复检费，否则委托单位将缴纳复检费。<br>
                            <div style="margin:8px 0">After the applicant finished the procedure above, investigation
                                testing group shall arrange the retest as
                                soon as possible. If the retest result conforms with the applicant dissent,
                                investigation testing group shall
                                refund all test and retest fees. Otherwise, the applicant shall pay the retest charge.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>4、</div>
                        <div>不可重复性试验、不能进行复检的，不进行复检，委托单位放弃异议权利。<br>
                            <div style="margin:8px 0">The unreduplicative test shall not be retested. The applicant
                                shall give up the rights of dissent.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>5、</div>
                        <div>委托单位对样品的代表性和资料的真实性负责，否则本单位不承担任何相关责任。<br>
                            <div style="margin:8px 0">The applicant should undertake responsibility for the validity and
                                representativeness of sample and
                                information. Otherwise, investigation testing group has not any relevant
                                responsibilities.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>6、</div>
                        <div>本《检测报告》仅对样品负责，检测结果仅反映对该样品的评价，对于检测结果的使
                            用、使用所产生的直接或间接损失及一切法律后果，本检测单位不承担任何经济和法
                            律责任。<br>
                            <div style="margin:8px 0">Unless the results in the report refer appreciation to the sample
                                tested. Investigation testing group shall not
                                have any economic and legal responsibility because the use of testing result, as direct
                                and indirect losses,
                                and all legal consequences because of the result.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>7、</div>
                        <div>本检测单位有权在完成《检测报告》，对超过客户申诉期的送检样品给予处理。<br>
                            <div style="margin:8px 0">Investigation testing group is entitled to treat the sample if
                                beyond the period of complaint after finishing
                                the inspection.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>8、</div>
                        <div>本检测单位保证检测的客观公正性，对委托单位的商业信息、技术文件、检测报告等
                            商业秘密履行保密义务。<br>
                            <div style="margin:8px 0">Investigation testing group assures objectivity and justness of
                                the test, and fulfills the duty of
                                confidentiality for applicant’s commercial information, technique documentation, and
                                analysis report.
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;">
                        <div>9、</div>
                        <div>本《检测报告》部分复制，私自转让、盗用、冒用、涂改或以其他任何形式篡改的均
                            属无效，全文复制除外。<br>
                            <div style="margin:8px 0">Any unauthorized reproduce to full or part, privacy alienation,
                                forgery, or falsification of the concern is
                                unlawful,except full text copying.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lineU">
                    <div class="twoleft">
                        <div>光明牧业有限公司检验测试中心
                        </div>
                        <div>
                            Testing Center of Bright Farming Co., Ltd.
                        </div>

                    </div>
                    <div style="border-left:1px solid black;height:110px"></div>
                    <div class="twoleft">
                        <div> 地址：上海市闵行区万源路2729号309室</div>
                        <div> Add: Room 309, No. 2729 Wanyuan Road,Minhang District,
                            Shanghai</div>
                        <div> 电话（Tel）：021-56481688-8105</div>
                        <div>传真（Fax）：021-56030602</div>
                        <div> 邮箱（Email）：bftc@brightdairy.com</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sta-main">
            <div class="seal-corner">
                <canvas ref="canvas3" width="50" height="200"></canvas>
            </div>
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:0px">
                    <div class="dibu1 font30">检测报告</div>
                    <div class="dibu2 font30">Testing Report</div>
                </div>
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号<br> (ReportID): {{ feedReportBase.reportNo }}</div>
                            <div>第 1 页，共 {{ pagedList.length + 1 }} 页 (Page 1 of {{ pagedList.length + 1 }})</div>
                        </div>
                    </div>

                    <table class="sample-table">
                        <tr>
                            <th>样品名称<br>Sample Description</th>
                            <td>{{ feedReportBase.sampleName || '/' }}</td>
                            <th>样品编号<br>Sample Number</th>
                            <td>{{ feedReportBase.sampleNo || '/' }}</td>
                        </tr>
                        <tr>
                            <th>样品规格<br>Sample Model</th>
                            <td>/ </td>
                            <!--<td>{{ feedReportBase.sampleModel || '/' }}</td>-->
                            <th>样品状态<br>Sample State</th>
                            <td> {{ stateText || '/' }}</td>
                        </tr>
                        <tr>
                            <th>商标<br>Trademark</th>
                            <td>{{ feedReportBase.trademark || '/' }}</td>
                            <th>样品数量<br>Sample Amount</th>
                            <td>{{ feedReportBase.sampleAmount || '/' }}</td>
                        </tr>
                        <tr>
                            <th>委托单位<br>Applicant</th>
                            <td>{{ feedReportBase.entrustDeptName || '/' }}</td>
                            <th>委托方地址<br>Address of Applicant</th>
                            <td>{{ feedReportBase.address || '/' }}</td>
                        </tr>
                        <tr>
                            <th>样品来源<br>Sample Source</th>
                            <td @dblclick="enableSourceEdit">
                                <span v-if="!isSourceEditing">{{ SourText || '/' }}</span>
                                <span v-else ref="sourceEditSpan" contenteditable @blur="saveSourceEdit"
                                    @keydown.enter="saveSourceEdit"></span>
                            </td>
                            <th>生产日期或批号<br>Product of Date or Lot No.</th>
                            <td>{{ feedReportBase.sampleBatchNo || '/' }}</td>
                        </tr>
                        <tr>
                            <th>接收日期<br>Received Date</th>
                            <td>{{ feedReportBase.receiveTime || '/' }}</td>
                            <th>检测类型<br>Kind of Test</th>
                            <td>委托检测</td>
                        </tr>
                        <tr>
                            <th>检测日期<br>Test Date</th>
                            <td>{{ testDateRange }}</td>
                            <th>检测地点<br>Site For Test</th>
                            <td>{{ feedReportBase.testLocation || '/' }}</td>
                        </tr>
                        <tr>
                            <th>检测项目<br>Test Item</th>
                            <td colspan="3" class="colspan-cell">{{ feedReportBase.itemName || '/' }}</td>
                        </tr>
                        <tr>
                            <th>所用主要仪器<br>Main Instrument</th>
                            <td colspan="3" class="colspan-cell">{{ feedReportBase.mainInstrument || '/' }}</td>
                        </tr>
                        <tr>
                            <th>检测结论<br>Conclusion</th>
                            <td colspan="3" class="colspan-cell" @dblclick="enableEdit">

                                <span>{{ feedReportBase.conclusion || displayText }}</span>
                                <div class="jcbgz">
                                    <img src="../../assets/images/seal2.png" class="sealpost">
                                    （检测报告专用章）
                                    <br>
                                    签发日期(Issued Date)：{{ computedIssuanceTime }}
                                </div>

                            </td>
                        </tr>
                        <tr>
                            <th>备注</th>
                            <td colspan="3" @dblclick="enableNoteEdit">
                                <span v-if="!isNoteEditing">{{ noteText }}</span>
                                <span v-else ref="noteEditSpan" contenteditable @blur="saveNoteEdit"
                                    @keydown.enter="saveNoteEdit"></span>
                            </td>
                        </tr>

                        <tr>
                            <th>编制人<br>Edited by
                            </th>
                            <td colspan="3"><img :src="signTypes.编制人" class="qm" v-if="this.feedReportBase.editSign">
                            </td>
                        </tr>
                        <tr>
                            <th>审核人<br>Checked by</th>
                            <td colspan="3"><img :src="signTypes.审核人" class="qm" v-if="this.feedReportBase.checkSign">
                            </td>
                        </tr>
                        <tr>
                            <th>批准人<br>Approved by</th>
                            <td colspan="3">
                                <img :src="signTypes.批准人" class="qm" v-if="signTypes.批准人">
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="sta-main" v-if="pagedList.length > 0">
            <div class="seal-corner">
                <canvas ref="canvas4" width="50" height="200"></canvas>
            </div>
            <div class="PageStyle">
                <div class="gongsift" style="position:relative;top:0px">
                    <div class="dibu1 font30">检测报告</div>
                    <div class="dibu2 font30">Testing Report</div>
                </div>
                <div class="report-container">
                    <div class="report-header">
                        <div class="report-info">
                            <div>报告编号<br> (ReportID): {{ feedReportBase.reportNo }}</div>
                            <div>第 2 页，共 {{ pagedList.length + 1 }} 页 (Page 2 of {{ pagedList.length +
                                1 }})</div>
                        </div>
                    </div>

                    <table class="sample-table">
                        <colgroup>
                            <col style="width: 20%;" />
                            <col style="width: 20%;" />
                            <col style="width: 20%;" />
                            <col style="width: 20%;" />
                            <col style="width: 20%;" />
                        </colgroup>
                        <tr>
                            <td colspan="5">检 测 结 果 汇 总<br>Results</td>
                        </tr>
                        <tr>
                            <th>检测项目<br>Test Item</th>
                            <th>单位<br>Unit</th>
                            <th>技术要求<br>Specification</th>
                            <th>实测值<br>Value of testing</th>
                            <th>检测依据<br>Standard</th>
                        </tr>

                        <tr v-for="(item, index) in pagedList[0]" :key="index">
                            <td>{{ item.itemName || '/' }}</td>
                            <td>{{ item.unit || '/' }}</td>
                            <td>{{ item.sapecification || '/' }}</td>
                            <td>{{ item.valueOfTest || '/' }}</td>
                            <td>{{ item.standard || '/' }}</td>
                            <td v-if="isshowEdit">
                                <i class="el-icon-edit edit-icon" @click="editItem(item)"></i>
                            </td>
                        </tr>
                        <tr v-if="infoList.length <= 20">
                            <td colspan="5" class="blank-row" :style="{ height: blankRowHeight + 'px' }">以下空白
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <template v-for="(page, pageIndex) in pagedList.slice(1)">
            <div class="sta-main" :key="'page-' + pageIndex">
                <div class="seal-corner" style="z-index: 80;">
                    <canvas ref="canvas4" width="50" height="200"></canvas>
                </div>
                <div style="display:none;">{{ currentPageIndex = pageIndex + 1 }}</div>
                <div class="PageStyle">
                    <div class="report-container">
                        <div class="report-header">
                            <div class="report-info">
                                <div>报告编号<br> (ReportID): {{ feedReportBase.reportNo }}</div>
                                <div>第 {{ 3 + pageIndex }} 页，共 {{ pagedList.length + 1 }} 页 (Page {{ 3 + pageIndex }} of
                                    {{
                                        pagedList.length + 1 }})</div>
                            </div>
                        </div>
                        <table class="sample-table">
                            <colgroup>
                                <col style="width: 20%;" />
                                <col style="width: 20%;" />
                                <col style="width: 20%;" />
                                <col style="width: 20%;" />
                                <col style="width: 20%;" />
                            </colgroup>
                            <tr>
                                <td colspan="5">检 测 结 果 汇 总<br>Results</td>
                            </tr>
                            <tr>
                                <th>检测项目<br>Test Item</th>
                                <th>单位<br>Unit</th>
                                <th>技术要求<br>Specification</th>
                                <th>实测值<br>Value of testing</th>
                                <th>检测依据<br>Standard</th>
                            </tr>
                            <tr v-for="(item, index) in page" :key="index">
                                <td>{{ item.itemName || '/' }}</td>
                                <td>{{ item.unit || '/' }}</td>
                                <td>{{ item.sapecification || '/' }}</td>
                                <td>{{ item.valueOfTest || '/' }}</td>
                                <td>{{ item.standard || '/' }}</td>
                                <td v-if="isshowEdit">
                                    <i class="el-icon-edit edit-icon" @click="editItem(item)"></i>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="5" class="blank-row" :style="{ height: blankRowHeight + 'px' }">以下空白
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </template>
        <div class="pdfdown" style="z-index: 100;" v-if="this.isShowB">
            <el-button type="primary" @click="pdfbc" style="margin-left:10px" v-if="this.status == 0">保存</el-button>
            <!-- <el-button type="primary" @click="pdfMtj" v-if="this.isShow || status == 1">提交</el-button> -->
            <el-button type="primary" @click="pdftg" style="margin-left:10px" v-if="this.status == 2">通过</el-button>
            <el-button type="primary" @click="pdfbtg" v-if="this.status == 2">不通过</el-button>
            <el-button type="primary" @click="pdfMap" style="margin-left:10px" v-if="this.status == 3">通过</el-button>
            <el-button type="primary" @click="pdfbjz" v-if="this.status == 3">不通过</el-button>
            <el-button type="primary" @click="reportZF" v-if="this.status != 0">作废</el-button>
            <!-- <el-button type="primary" @click="pdfMap" >发送</el-button> -->
        </div>

        <el-dialog title="请输入不通过原因" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false"
            @close="handleDialogClose" append-to-body>
            <el-input type="textarea" :rows="4" v-model="returnReason" placeholder="请输入原因" ref="reasonInput"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="handleRejectConfirm" size="small">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 放在 </template> 最下面即可 -->
        <el-dialog :title="currentItemType + '检测项目信息'" :visible.sync="editDialogVisible" width="80vw" append-to-body>
            <div class="detail-table-container">
                <table class="detail-table" v-if="currentItemType == '水分'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>称量皿号</th>
                            <th>试样质量m₂ (g)</th>
                            <th>称量皿的质量m₁ (g)</th>
                            <th>第一次干燥后称量皿+试样的质量 m₃ (g)</th>
                            <th>第二次干燥后称量皿+试样的质量 m₄ (g)</th>
                            <th>试样水分含量 X (%)</th>
                            <th>初水分含量 M₁ (%)</th>
                            <th>水分含量 Xᵢ (%)</th>
                            <th>平均值 (%)</th>
                            <th>绝对差值/相对偏差 (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.m2 }}</td>
                                <td>{{ item.m1 }}</td>
                                <td>{{ item.m3 }}</td>
                                <td>{{ item.m4 }}</td>
                                <td>{{ item.x }}</td>
                                <td>{{ item.upperM1 }}</td>
                                <td>{{ item.x1 }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareClmh }}</td>
                                <td>{{ item.compareM2 }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareM3 }}</td>
                                <td>{{ item.compareM4 }}</td>
                                <td>{{ item.compareX }}</td>
                                <td>{{ item.compareUpperM1 }}</td>
                                <td>{{ item.compareX1 }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-if="currentItemType == '容重'">
                    <thead>
                        <tr>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th colspan="2">容重（g/L）</th>
                            <th>平均值（ g/L ）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ item.sampleNo }}</td>
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
                <table class="detail-table" v-else-if="currentItemType == '粗蛋白'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
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
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
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
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '粗灰分'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>坩埚号</th>
                            <th>空坩埚质量m<sub>0</sub>(g)</th>
                            <th>试样质量m(g)</th>
                            <th>灰化后灰分+坩埚质量m<sub>1</sub>(g)</th>
                            <th>粗灰分含量w (%)</th>
                            <th>平均值(%)</th>
                            <th>绝对差值(%)</th>
                            <th>鲜样中灰分含量(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.compareGgh }}</td>
                                <td>{{ item.m0 }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.m1 }}</td>
                                <td>{{ item.w }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.compareM0 }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareW }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '粗脂肪'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>滤袋号</th>
                            <th>试样质量 m(g)</th>
                            <th>提取前烘干后样品+滤袋+硅藻土质量m<sub>1</sub>（g）</th>
                            <th>提取后烘干后样品+滤袋+硅藻土质量m<sub>2</sub>（g）</th>
                            <th>试样中粗脂肪含量 EE%</th>
                            <th>平均值%</th>
                            <th>绝对差值/相对相差%</th>
                            <th>鲜样中粗脂肪含量 EE%</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.ldh }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.m1 }}</td>
                                <td>{{ item.m2 }}</td>
                                <td>{{ item.ee }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr>
                                <td>{{ item.compareLdh }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareM2 }}</td>
                                <td>{{ item.compareEe }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '中性洗涤纤维'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>滤袋号</th>
                            <th>滤袋质量 m₁（g）</th>
                            <th>试样质量 m（g）</th>
                            <th>袋+残渣总质量 m<sub>2</sub>（g）</th>
                            <th>NDF 含量 x（%）</th>
                            <th>平均值(g/kg)</th>
                            <th>相对偏差(g/kg)</th>
                            <th>鲜样中中 NDF 含量 (g/kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.ldh }}</td>

                                <td>{{ item.m1 }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.m2 }}</td>
                                <td>{{ item.x }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr>
                                <td>{{ item.compareLdh }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareM2 }}</td>
                                <td>{{ item.compareX }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '酸性洗涤纤维'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>滤袋号</th>
                            <th>滤袋质量 m₁（g）</th>
                            <th>试样质量 m（g）</th>
                            <th>袋+残渣总质量 m₂（g）</th>
                            <th>ADF 含量 x（%）</th>
                            <th>平均值(g/kg)</th>
                            <th>相对相差/绝对偏差(g/kg)</th>
                            <th>鲜样中中 ADF 含量 (g/kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.ldh }}</td>
                                <td>{{ item.m1 }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.m2 }}</td>
                                <td>{{ item.x }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr>
                                <td>{{ item.compareLdh }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareM2 }}</td>
                                <td>{{ item.compareX }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '钙'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>样液号</th>
                            <th>试样质量 m（g）</th>
                            <th>消耗 EDTA 标准液的体积 V<sub>2</sub>(mL)</th>
                            <th>Ca 含量 （%）</th>
                            <th>平均值（%）</th>
                            <th>相对相差（%）</th>
                            <th>鲜样中Ca 含量 （%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.yyh }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.v2 }}</td>
                                <td>{{ item.ca }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr>
                                <td>{{ item.compareYyh }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareV2 }}</td>
                                <td>{{ item.compareCa }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '磷'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>样液号</th>
                            <th>试样质量 m（g）</th>
                            <th>测试液吸光度A</th>
                            <th>测试液磷浓度X(ug/mL)</th>
                            <th>试样中P含量 （%）</th>
                            <th>平均值(%)</th>
                            <th>相对相差（%）</th>
                            <th>鲜样中P含量 （%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.yyh }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.syxgdaz }}</td>
                                <td>{{ item.x }}</td>
                                <td>{{ item.p }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr>
                                <td>{{ item.compareYyh }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareSyxgdaz }}</td>
                                <td>{{ item.compareX }}</td>
                                <td>{{ item.compareP }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '粗纤维'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>滤袋坩埚号</th>
                            <th>滤袋质量 m₁（g）</th>
                            <th>试样质量 m（g）</th>
                            <th>坩埚+袋+试样残渣烘干后总质量 m<sub>2</sub>(g)</th>
                            <th>坩埚+试样残渣灰化后总质量 m<sub>3</sub>(g)(g)</th>
                            <th>CF含量x(%)</th>
                            <th>平均值(%)</th>
                            <th>相对相差/绝对偏差(%)</th>
                            <th>鲜样中CF含量(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.ldh }}</td>
                                <td>{{ item.m1 }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.m2 }}</td>
                                <td>{{ item.m3 }}</td>
                                <td>{{ item.x }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareLdh }}</td>
                                <td>{{ item.compareM1 }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareM2 }}</td>
                                <td>{{ item.compareM3 }}</td>
                                <td>{{ item.compareX }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '碳酸氢钠'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>锥形瓶号</th>
                            <th>试样质量 m（g）</th>
                            <th>盐酸标准溶液消耗体积 V<sub>2</sub>(mL)</th>
                            <th>总碱量 （%）</th>
                            <th>平均值(%)</th>
                            <th>绝对差值(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.zxph }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.v2 }}</td>
                                <td>{{ item.w }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareZxph }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareV2 }}</td>
                                <td>{{ item.compareW }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '三聚氰胺'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>20%甲醇/水体积(mL)</th>
                            <th>待测液体积(uL)</th>
                            <th>检测结果</th>
                            <th>鲜样中结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.jcstj }}</td>
                                <td>{{ item.dcytj }}</td>
                                <td>
                                    {{ item.jcjg === '阴性' ? '✔' : '□' }}阴性
                                    {{ item.jcjg === '阳性' ? '✔' : '□' }}阳性
                                    {{ item.jcjgfw }}
                                </td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '玉米赤霉烯酮'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>试样吸光度A值（450-620mm）</th>
                            <th>待测液中DON含量C（μg/ml）</th>
                            <th>样品中DON含量（mg/kg）</th>
                            <th>鲜样中DON含量（mg/kg）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.syxgdaz }}</td>
                                <td>{{ item.c }}</td>
                                <td>{{ item.ypzxxhl }}</td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '赭曲霉毒素'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>试样吸光度A值（450-620mm）</th>
                            <th>待测液中DON含量C（μg/ml）</th>
                            <th>样品中DON含量（mg/kg）</th>
                            <th>鲜样中DON含量（mg/kg）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.syxgdaz }}</td>
                                <td>{{ item.c }}</td>
                                <td>{{ item.ypzxxhl }}</td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '淀粉糊化度'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>空白试样溶液吸光度A<sub>0</sub></th>
                            <th>待测试样溶液吸光度A<sub>1</sub></th>
                            <th>全糊化试样溶液吸光度A<sub>2</sub></th>
                            <th>糊化度x(%)</th>
                            <th>平均值（%）</th>
                            <th>相对相差（%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.a0 }}</td>
                                <td>{{ item.a1 }}</td>
                                <td>{{ item.a2 }}</td>
                                <td>{{ item.x }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareA0 }}</td>
                                <td>{{ item.compareA1 }}</td>
                                <td>{{ item.compareA2 }}</td>
                                <td>{{ item.compareX }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '淀粉测定（双酶法）'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>样液号</th>
                            <th>试样质量 m（g）</th>
                            <th>样液稀释倍数n</th>
                            <th>试样吸光度 A1</th>
                            <th>试样D-葡萄糖含量(ug/0.1mL)</th>
                            <th>淀粉含量(g/100g)</th>
                            <th>平均值（%）</th>
                            <th>相对相差（%）</th>
                            <th>鲜样中淀粉含量（%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`" class="sample-split" :class="{ 'first-sample': index === 0 }">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2">{{ item.sampleName }}</td>
                                <td>{{ item.yyh }}</td>
                                <td>{{ item.m }}</td>
                                <td rowspan="2">{{ item.n }}</td>
                                <td>{{ item.a1 }}</td>
                                <td>{{ item.g }}</td>
                                <td>{{ item.dfhl }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareYyh }}</td>
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareA1 }}</td>
                                <td>{{ item.compareG }}</td>
                                <td>{{ item.compareDfhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '呕吐毒素'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>试样吸光度A值（450-620mm）</th>
                            <th>待测液中DON含量C（μg/ml）</th>
                            <th>样品中DON含量（mg/kg）</th>
                            <th>鲜样中DON含量（mg/kg）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.syxgdaz }}</td>
                                <td>{{ item.c }}</td>
                                <td>{{ item.ypzxxhl }}</td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '黄曲霉毒素B1'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>试样吸光度A值（450-620mm）</th>
                            <th>待测液中DON含量C（μg/ml）</th>
                            <th>样品中DON含量（mg/kg）</th>
                            <th>鲜样中DON含量（mg/kg）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.syxgdaz }}</td>
                                <td>{{ item.c }}</td>
                                <td>{{ item.ypzxxhl }}</td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == 'WSC'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>移取萃取液体积V₁(mL)</th>
                            <th>显色吸光度值A</th>
                            <th>萃取液WSC含量C(mg/mL)</th>
                            <th>试样中WSC含量(%)</th>
                            <th>平均值（%）</th>
                            <th>相对偏差（%）</th>
                            <th>鲜样中WSC含量（%）</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
                                <td rowspan="2">{{ item.sampleNo }}</td>
                                <td rowspan="2"> {{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.v1 }}</td>
                                <td>{{ item.a }}</td>
                                <td>{{ item.c }}</td>
                                <td>{{ item.syzwschl }}</td>
                                <td rowspan="2">{{ item.average }}</td>
                                <td rowspan="2">{{ item.absoluteDifference }}</td>
                                <td rowspan="2">{{ item.xyzhl }}</td>
                            </tr>
                            <tr :key="`row2-${index}`">
                                <td>{{ item.compareM }}</td>
                                <td>{{ item.compareV1 }}</td>
                                <td>{{ item.compareA }}</td>
                                <td>{{ item.compareC }}</td>
                                <td>{{ item.compareSyzwschl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '黄曲霉毒素定性'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>管号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>试样质量 m（g）</th>
                            <th>50%乙醇/水体积(mL)</th>
                            <th>稀释液体积(uL)</th>
                            <th>待测液体积(uL)</th>
                            <th>检测结果</th>
                            <th>鲜样中结果</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.clmh }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <td>{{ item.m }}</td>
                                <td>{{ item.ycstj }}</td>
                                <td>{{ item.xsytj }}</td>
                                <td>{{ item.dcytj }}</td>
                                <td>
                                    {{ item.jcjg === '阴性' ? '✔' : '□' }}阴性
                                    {{ item.jcjg === '阳性' ? '✔' : '□' }}阳性
                                    {{ item.jcjgfw }}
                                </td>
                                <td>{{ item.xyzhl }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <table class="detail-table" v-else-if="currentItemType == '水溶性氯化物'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <th>瓶号</th>
                            <th>试样质量 m（g）</th>
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
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td rowspan="2">{{ Details.resultNo }}</td>
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
                    </tbody>
                </table>
                <table class="detail-table"
                    v-else-if="currentItemType == '粗灰分（近红外）' || currentItemType == '中性洗涤纤维（近红外）' || currentItemType == '粗脂肪（近红外）' || currentItemType == '酸性洗涤纤维（近红外）'">
                    <thead>
                        <tr>
                            <th>化验单号</th>
                            <th>样品编号</th>
                            <th>样品名称</th>
                            <!-- <th>项目名称</th> -->
                            <th>结果</th>
                            <th>鲜样中含量</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item, index) in detailList">
                            <tr :key="`row1-${index}`">
                                <td>{{ Details.resultNo }}</td>
                                <td>{{ item.sampleNo }}</td>
                                <td>{{ item.sampleName }}</td>
                                <!-- <td>{{ item.itemName }}</td> -->
                                <td>{{ item.average }}</td>
                                <td>{{ item.remark }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>

                <!-- 无数据提示 -->
                <div v-if="detailList.length === 0" class="no-data">
                    暂无检测数据
                </div>
            </div>
            <span slot="footer">
                <el-button @click="handleEditCancel">取消</el-button>
                <!-- <el-button type="primary" @click="handleEditSave">保存</el-button> -->
            </span>
        </el-dialog>
    </div>
</template>
<script>
import $ from 'jquery';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { XZPic } from "@/api/hyd";
import {
    Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, ckbg, getResultBySampleNo, ZfReport
} from "@/api/CentralLaboratory/jczxFeedReport";

// import { ElStep } from 'element-ui/types/step';
import { upload, uploadPCR } from '@/api/common/common'
export default {
    dicts: ['sample_state'],
    data() {
        return {
            dc: false,
            // 遮罩层
            loading: false,
            signTypes: {
                编制人: '',
                审核人: '',
                批准人: '',
            },
            locasign: localStorage.getItem("sign"),
            feedReportBase: {},
            isSourceEditing: false,
            SourText: "/",
            isEditing: false,
            displayText: "/",
            isNoteEditing: false,
            noteText: "/",
            infoList: [],
            opJczxFeedReportBaseId: '',
            currentPageIndex: 0, // 当前页索引
            status: '',
            feedEntrustOrderSampleId: '',
            isShow: false,
            fsh: false,
            feedEntrustOrderId: '',
            // --- 弹窗相关 data ---
            dialogVisible: false,
            returnReason: '',
            currentRejectAction: null,// 用于区分是 'btg' (审核不通过) 还是 'bjz' (批准不通过)
            isShowB: false,
            isshowEdit: false,
            editDialogVisible: false,   // 控制弹窗显示
            currentEditItem: {},        // 当前正在编辑的行数据
            // 检测项目类型映射配置
            currentItemType: '',      // 当前检测项目类型
            Details: {},
            detailList: [],           // 详细数据列表
            itemTypeMap: {
                '水分': '水分',
                '粗蛋白': '粗蛋白',
                '粗灰分': '粗灰分',
                '粗脂肪': '粗脂肪',
                '中性洗涤纤维': '中性洗涤纤维',
                '酸性洗涤纤维': '酸性洗涤纤维',
                '钙': '钙',
                '磷': '磷',
                '粗纤维': '粗纤维',
                '碳酸氢钠': '碳酸氢钠',
                '三聚氰胺': '三聚氰胺',
                '玉米赤霉烯酮': '玉米赤霉烯酮',
                '赭曲霉毒素': '赭曲霉毒素',
                '淀粉糊化度': '淀粉糊化度',
                '淀粉测定（双酶法）': '淀粉测定（双酶法）',
                '呕吐毒素': '呕吐毒素',
                '黄曲霉毒素B1': '黄曲霉毒素B1',
                'WSC': 'WSC',
                '黄曲霉毒素定性': '黄曲霉毒素定性',
                '水溶性氯化物': '水溶性氯化物',
                '粗灰分（近红外）': '粗灰分（近红外）',
                '中性洗涤纤维（近红外）': '中性洗涤纤维（近红外）',
                '粗脂肪（近红外）': '粗脂肪（近红外）',
                '酸性洗涤纤维（近红外）': '酸性洗涤纤维（近红外）',
                '容重': '容重',
            }
        }
    },
    mounted() {

        this.status = this.$route.query.status
        console.log(this.status, 'this.status')
        console.log('路由参数:', this.$route.query) // 查看所有路由参数
        this.isshowEdit = true

        // this.$route.query.isShowB = false

        // this.isShowB = Boolean(this.$route.query.isShowB)
        // console.log(Boolean(this.$route.query.isShowB), '111111111')
        if (this.status == 0) {
            Reportsl(JSON.parse(this.$route.query.feedEntrustOrderSampleId)).then(res => {
                console.log(res, '888888888888')
                console.log('feedReportBase 数据:', res.data.feedReportBase)
                console.log('结论数据 conclusion:', res.data.feedReportBase.conclusion)
                this.SourText = res.data.feedReportBase.sampleSource
                this.noteText = res.data.feedReportBase.remark
                this.displayText = res.data.feedReportBase.conclusion
                this.feedReportBase = res.data.feedReportBase
                this.infoList = res.data.opJczxFeedReportInfoList
                this.feedEntrustOrderId = res.data.feedReportBase.feedEntrustOrderId
                this.isShowB = true
            });
        }
        else {
            if (this.$route.query.isShowB) {
                this.isShowB = false
                ckbg(JSON.parse(this.$route.query.reportId)).then((res) => {
                    // console.log(res, '88888888888888888')
                    // console.log(res, '888888888888')
                    // console.log('feedReportBase 数据:', res.data.feedReportBase)
                    // console.log('结论数据 conclusion:', res.data.feedReportBase.conclusion)
                    this.SourText = res.data.feedReportBase.sampleSource
                    this.noteText = res.data.feedReportBase.remark
                    this.displayText = res.data.feedReportBase.conclusion
                    this.feedReportBase = res.data.feedReportBase
                    this.infoList = res.data.opJczxFeedReportInfoList
                    this.feedEntrustOrderId = res.data.feedReportBase.feedEntrustOrderId
                    this.qmhx()
                    this.isShowB = true
                })
            } else {
                this.opJczxFeedReportBaseId = JSON.parse(this.$route.query.opJczxFeedReportBaseId)
                console.log(JSON.parse(this.$route.query.opJczxFeedReportBaseId), 'aaaaaaaaaaaaaaaaaaaa')
                console.log(JSON.parse(this.$route.query.feedEntrustOrderSampleId), 'aaaaaaaaaaaaaaaaaaaa')
                // this.opJczxFeedReportBaseId = JSON.stringify(this.$route.query.row.opJczxFeedReportBaseId)
                // this.feedEntrustOrderSampleId = JSON.stringify(this.$route.query.row.feedEntrustOrderSampleId)
                // console.log(JSON.parse(this.$route.query.row).opJczxFeedReportBaseId, 'qqqqqqqqqqqqqqqqqqqqqq')
                zzhhx(JSON.parse(this.$route.query.opJczxFeedReportBaseId)).then(res => {
                    console.log(res, '999999999999999999')
                    this.SourText = res.data.feedReportBase.sampleSource
                    this.noteText = res.data.feedReportBase.remark
                    this.displayText = res.data.feedReportBase.conclusion
                    this.feedReportBase = res.data.feedReportBase
                    this.infoList = res.data.opJczxFeedReportInfoList
                    this.feedEntrustOrderId = res.data.feedReportBase.feedEntrustOrderId
                    // 数据设置完成后调用 qmhx
                    this.$nextTick(() => {
                        this.qmhx();
                    });
                    this.isShowB = true
                });
            }
        }
        this.qgGz()
        // this.qmhx()
    },
    computed: {
        // 获取字典对应的文本
        stateText() {
            const dictItem = this.dict.type.sample_state.find(
                item => item.value == this.feedReportBase.sampleState
            );
            return dictItem ? dictItem.label : '';
        },
        // 1. 核心逻辑：获取签发日期（如果为空，返回当天）
        computedIssuanceTime() {
            const issuanceTime = this.feedReportBase.issuanceTime;
            if (issuanceTime) {
                return issuanceTime;
            }
            // 如果为空，获取当天日期 yyyy-MM-dd
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        // 2. 检测日期范围（直接复用上面的 computedIssuanceTime）
        testDateRange() {
            const receiveTime = this.feedReportBase.receiveTime;
            // 复用计算好的签发日期
            const endTime = this.computedIssuanceTime;

            if (!receiveTime) {
                return '/';
            }
            return `${receiveTime}到${endTime}`;
        },
        blankRowHeight() {
            // 基础高度（当没有数据时的默认高度）
            const baseHeight = 800;
            // 每行数据占用的高度（根据实际情况调整）
            const rowHeight = 36;
            // 最小高度（确保至少有一定空白）
            const minHeight = 0;
            // 使用当前页的数据长度计算
            const currentPageLength = this.currentPageRows;
            console.log(currentPageLength, '当前页')
            // 计算剩余高度
            const calculatedHeight = baseHeight - (currentPageLength * rowHeight);

            // 返回计算高度，但不小于最小高度
            return Math.max(minHeight, calculatedHeight);
        },
        currentPageRows() {
            const pageIndex = this.currentPageIndex;
            const page = this.pagedList[pageIndex];
            return page ? page.length : 0;
        },
        currentPageItems() {
            // 返回当前页的数据数组
            return this.pagedList[this.currentPageIndex] || [];
        },
        pagedList() {
            const pages = [];

            /* ---------- 第一页 20 条 ---------- */
            pages.push(this.infoList.slice(0, 17));

            /* ---------- 剩余 22 条/页 ---------- */
            const left = this.infoList.slice(17);
            for (let i = 0; i < left.length; i += 20) {
                pages.push(left.slice(i, i + 20));
            }
            return pages;
        }
    },
    methods: {
        reportZF() {
            this.$confirm('确定作废吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 调用作废接口
                ZfReport({
                    opJczxFeedReportBaseId: this.feedReportBase.opJczxFeedReportBaseId
                }).then(res => {
                    console.log(res, '作废接口返回')
                    if (res.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '作废成功'
                        });
                        setTimeout(() => {
                            window.close()
                        }, 1500);
                        // this.$router.go(0);
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.msg || '作废失败'
                        });
                    }
                });
            }).catch(() => {
                // 用户取消操作
            });
        },
        // 根据检测项目名称获取表格类型
        getItemType(itemName) {
            if (!itemName) return 'default';
            console.log(itemName, '检测项目名称')
            // 将 keys 按长度从长到短排序，确保更精确的匹配优先
            const sortedKeys = Object.keys(this.itemTypeMap).sort((a, b) => b.length - a.length);

            for (const key of sortedKeys) {
                if (itemName.includes(key)) {
                    console.log(this.itemTypeMap[key], '匹配到的类型');
                    return this.itemTypeMap[key];
                }
            }
            return 'default';
        },
        editItem(item) {
            console.log(item, '详情')
            this.currentEditItem = item;
            this.currentItemType = this.getItemType(item.itemName);
            getResultBySampleNo({
                entrustOrderItemId: item.entrustOrderItemId,
                sampleNo: item.sampleNo
            }).then(res => {
                console.log(res, '检测项目信息')
                this.Details = res.data
                this.detailList = res.data.infoList || [];
                if (this.detailList.length > 0) {
                    this.editDialogVisible = true;
                } else {
                    this.$message({
                        message: '该项目暂无原始记录',
                        type: 'error'
                    });
                }


            })
        },
        // 取消
        handleEditCancel() {
            this.editDialogVisible = false;
            this.Details = {}
            this.detailList = [];
            this.currentItemType = '';
        },
        pdfbc() {
            const newReportData = {
                ...this.feedReportBase,
                opJczxFeedReportInfoList: [...this.infoList],
                status: '1',
                feedEntrustOrderSampleId: JSON.parse(this.$route.query.feedEntrustOrderSampleId),

                feedEntrustOrderId: this.feedEntrustOrderId  // 使用最终计算的值
            };
            Reportslbc(newReportData).then(res => {
                console.log('保存接口返回:', res)
                this.opJczxFeedReportBaseId = res.msg
                if (res.code == 200) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.pdfMtj()
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                }
                zzhhx(res.msg).then(res => {
                    console.log('重新查询后的数据:', res)
                    this.SourText = res.data.feedReportBase.sampleSource
                    this.noteText = res.data.feedReportBase.remark
                    this.displayText = res.data.feedReportBase.conclusion
                    this.feedReportBase = res.data.feedReportBase
                    this.infoList = res.data.opJczxFeedReportInfoList

                    this.isShow = true
                    this.qmhx()
                    // 重新设置 feedEntrustOrderId
                    this.feedEntrustOrderId = res.data.feedReportBase.feedEntrustOrderId
                    console.log('重新设置后的 feedEntrustOrderId:', this.feedEntrustOrderId)
                });
            }).catch(error => {
                console.error('保存接口错误:', error)
            })
        },
        pdfMtj() {
            const newReportData = {
                ...this.feedReportBase,
                opJczxFeedReportInfoList: [...this.infoList],
                status: '2',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId,
                feedEntrustOrderSampleId: JSON.parse(this.$route.query.feedEntrustOrderSampleId),
                feedEntrustOrderId: this.feedEntrustOrderId
            };
            Reportslbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                }

            })
        },


        pdftg() {
            const newReportData = {
                status: '3',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId
            };
            zzhhxbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '通过成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '通过失败',
                        type: 'error'
                    });
                }
            })


        },
        pdfbtg() {
            this.currentRejectAction = 'btg'; // 标记为"审核不通过"
            this.returnReason = ''; // 清空上次输入
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.reasonInput.focus(); // 弹窗打开后自动聚焦
            });
        },
        pdfjz() {
            const newReportData = {
                status: '4',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId,
                feedEntrustOrderSampleId: JSON.parse(this.$route.query.feedEntrustOrderSampleId),
            };

            // 先弹出提示
            this.$alert('正在批准报告，请勿关闭页面', '提示', {
                confirmButtonText: '执行中...',
                showClose: false,
                closeOnClickModal: false,
                closeOnPressEscape: false,
                beforeClose: (action, instance, done) => {
                    // 不调用 done()，阻止用户手动关闭
                }
            });

            // 等待 DOM 渲染后禁用按钮
            this.$nextTick(() => {
                // 直接通过 document 查询 MessageBox
                const msgBox = document.querySelector('.el-message-box');
                if (msgBox) {
                    const btn = msgBox.querySelector('.el-message-box__btns .el-button--primary');
                    if (btn) {
                        btn.disabled = true;
                        btn.classList.add('is-disabled');
                        // 添加 loading 图标
                        btn.innerHTML = '<i class="el-icon-loading"></i> 执行中...';
                    }
                }

                // 执行实际的批准操作
                jzcommit(newReportData).then(res => {
                    // 直接移除弹窗 DOM
                    this.closeMessageBox();

                    if (res.code == 200) {
                        this.closeMessageBox();
                        this.$message.success('报告已批准');

                        //setTimeout(() => window.close(), 1000);
                    } else {
                        this.closeMessageBox();
                        this.$message.error(res.msg);
                    }
                }).catch(() => {
                    this.closeMessageBox();
                    this.$message.error('批准失败');
                });
            });
        },
        // 添加关闭弹窗的方法
        closeMessageBox() {
            // 移除弹窗
            const msgBox = document.querySelector('.el-message-box__wrapper');
            if (msgBox) {
                msgBox.remove();
            }
            // 移除遮罩层
            const overlay = document.querySelector('.v-modal');
            if (overlay) {
                overlay.remove();
            }
            // 恢复 body 滚动
            document.body.classList.remove('el-popup-parent--hidden');
            document.body.style.overflow = '';
        },
        pdfbjz() {
            this.currentRejectAction = 'bjz'; // 标记为"批准不通过"
            this.returnReason = ''; // 清空上次输入
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.reasonInput.focus(); // 弹窗打开后自动聚焦
            });
        },
        enableSourceEdit() {
            this.isSourceEditing = true;
            this.$nextTick(() => {
                this.$refs.sourceEditSpan.innerText = this.SourText;
                this.$refs.sourceEditSpan.focus();
            });
        },

        /** 处理弹窗关闭 */
        handleDialogClose() {
            this.dialogVisible = false;
            this.returnReason = '';
            this.currentRejectAction = null;
        },

        /** 处理不通过弹窗的“确定”按钮 */
        handleRejectConfirm() {
            if (!this.returnReason || this.returnReason.trim() === '') {
                this.$message.warning('请输入退回原因');
                return;
            }

            if (this.currentRejectAction === 'btg') {
                const newReportData = {
                    status: '6', // 审核不通过，退回到状态 '6'
                    opJczxFeedReportBaseId: this.opJczxFeedReportBaseId,
                    returnReason: this.returnReason // 附带原因
                };
                zzhhxbc(newReportData).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$message.success('不通过成功');
                        this.handleDialogClose(); // 关闭弹窗
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不通过失败');
                    }
                });

            } else if (this.currentRejectAction === 'bjz') {
                const newReportData = {
                    status: '6', // 批准不通过，退回到状态 '6'
                    opJczxFeedReportBaseId: this.opJczxFeedReportBaseId,
                    returnReason: this.returnReason // 附带原因
                };
                jzcommit(newReportData).then(res => {
                    console.log(res)
                    if (res.code == 200) {
                        this.$message.success('不批准成功');
                        this.handleDialogClose(); // 关闭弹窗
                        setTimeout(() => window.close(), 1000);
                    } else {
                        this.$message.error('不批准失败');
                    }
                });
            }
        },
        saveSourceEdit(e) {
            this.SourText = e.target.innerText;
            console.log(this.SourText)
            // this.$emit('update:source', e.target.innerText);
            this.isSourceEditing = false;

        },
        enableEdit() {
            this.isEditing = true;
            this.$nextTick(() => {
                this.$refs.editSpan.innerText = this.displayText;
                this.$refs.editSpan.focus();
            });
        },
        saveEdit(e) {
            this.displayText = e.target.innerText;
            this.feedReportBase.conclusion = this.displayText
            this.isEditing = false;
            // 这里可以添加保存到后台的逻辑
        },
        enableNoteEdit() {
            this.isNoteEditing = true;
            this.$nextTick(() => {
                this.$refs.noteEditSpan.innerText = this.noteText;
                this.$refs.noteEditSpan.focus();
            });
        },
        saveNoteEdit(e) {
            this.noteText = e.target.innerText;
            this.feedReportBase.remark = this.noteText
            this.isNoteEditing = false;

        },
        // 切割
        qgGz() {
            const sealImg = this.$refs.sealImg;

            sealImg.onload = () => {
                const width = sealImg.naturalWidth || sealImg.width;
                const height = sealImg.naturalHeight || sealImg.height;

                // 获取四个canvas元素
                const canvases = [
                    this.$refs.canvas1, // 左1/4部分
                    this.$refs.canvas2, // 左2/4部分  
                    this.$refs.canvas3, // 左3/4部分
                    this.$refs.canvas4  // 右4/4部分
                ];

                // 计算竖向切割的宽度（四等分）
                const quarterWidth = width / 4;

                // 为每个canvas绘制对应的竖向部分
                canvases.forEach((canvas, index) => {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // 竖向切割：x坐标递增，宽度为1/4，高度保持完整
                    ctx.drawImage(
                        sealImg,
                        index * quarterWidth, 0, quarterWidth, height, // 源图像区域
                        0, 0, canvas.width, canvas.height             // 目标canvas区域
                    );
                });
            };
        },
        /** 导出单页 */
        pdfMap() {
            this.isshowEdit = false
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
            // $(".pdfdown").css("display", "none");
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
                // console.log(contentWidth, "22tree");
                if (contentHeight != 0) {
                    this.PDF.addImage(pageData, "jpeg", 0, 0, 580, 841.89);
                }
                if (mpddfcont == stalength - 1) {
                    $(".sta-main").css("margin-top", "10px", "padding", "10px 20px");
                    this.isshowEdit = false
                    // this.PDF.save('饲料检测报告' + ".pdf");
                    // this.PDF.save = () => { };
                    $(".pdfdown").css("display", "block");
                    $(".uedbtn").css("display", "block");
                    // 生成 Blob
                    const pdfBlob = this.PDF.output('blob');
                    console.log(pdfBlob, 'bolb')
                    const pdfFile = new File(
                        [pdfBlob],
                        "检测报告.pdf",
                        { type: "application/pdf" }
                    );

                    console.log(pdfFile, 'flie')
                    const formData = new FormData();
                    formData.append('file', pdfFile, '检测报告.pdf');
                    upload(formData).then((res) => {
                        console.log(res, '11112221111111')
                        const newA = {
                            pdfFileInfo: res.fileName,
                            opJczxFeedReportBaseId: this.opJczxFeedReportBaseId,
                            feedEntrustOrderId: this.feedEntrustOrderId
                        }
                        savePdf(newA).then((res) => {
                            console.log(res, '111111111')
                            if (res.code == 200) {
                                this.$message({
                                    message: '上传文件成功',
                                    type: 'success'
                                });
                                this.pdfjz()
                                this.isshowEdit = true
                                // setTimeout(() => {
                                //     window.close()
                                // }, 1000)
                            } else {
                                this.$message({
                                    message: res.msg,
                                    type: 'error'
                                });
                            }

                        })
                    })

                    // const newCs = {
                    //     file: pdfBlob,
                    //     emailDTO: [{ "opJczxFeedReportBaseId": JSON.parse(this.$route.query.opJczxFeedReportBaseId), "feedEntrustOrderSampleId": JSON.parse(this.$route.query.feedEntrustOrderSampleId) }]

                    // }
                    // console.log(newCs, '文件上传')
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
            console.log("完整的 feedReportBase:", this.feedReportBase);
            if (this.feedReportBase.editSign) {
                XZPic(this.feedReportBase.editSign).then((res) => {
                    // console.log(this.feedReportBase.editSign)
                    this.signTypes.编制人 = URL.createObjectURL(res)
                })
            }

            if (this.feedReportBase.checkSign) {
                XZPic(this.feedReportBase.checkSign).then((res) => {
                    this.signTypes.审核人 = URL.createObjectURL(res)
                })
            }
            // if (this.feedReportBase.approveSign || localStorage.getItem("sign")) {
            //     console.log(this.feedReportBase.approveSign || localStorage.getItem("sign"), '批准人')
            //     XZPic(this.feedReportBase.approveSign || localStorage.getItem("sign")).then((res) => {
            //         console.log(res, 'weguooooooooooooooooooooqi')
            //         this.signTypes.批准人 = URL.createObjectURL(res)
            //     })
            // }
            // 1. 如果数据库里已经有了 approveSign，直接显示 (对应已批准后的查看)
            // 2. 如果数据库没签名，但是当前状态是 3 (待批准)，且本地有签名，则回显当前登录人签名 (对应批准操作时预览)
            let approveSignId = this.feedReportBase.approveSign;

            if (!approveSignId && this.status == 3) {
                approveSignId = localStorage.getItem("sign");
            }

            if (approveSignId) {
                console.log(approveSignId, '批准人ID')
                XZPic(approveSignId).then((res) => {
                    console.log(res, '获取到批准人签名图片')
                    this.signTypes.批准人 = URL.createObjectURL(res)
                })
            }
            // XZPic("63aa2f6864b8410c8861f637bca8edbb").then((res) => {
            //     this.signTypes.编制人 = URL.createObjectURL(res)
            // })


        }
    }
}
</script>
<style scoped>
@import "~@/assets/styles/BreedingReport.css";

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

.sample-table {
    width: 100%;
    table-layout: fixed;
    /* 按列宽固定布局 */
}

.sample-table th,
.sample-table td {
    word-break: break-all;
    /* 文本太长就折行，避免把列撑开 */
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

/* ========== 弹窗详情表格样式 ========== */
.detail-table-container {
    max-height: 500px;
    overflow-x: auto;
    overflow-y: auto;
    padding: 10px 0;

}

.detail-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    min-width: 800px;
    table-layout: auto;
    /* 改为 auto，让列宽根据内容自适应 */
    /* 确保表格有最小宽度，避免挤压 */
}

.detail-table th,
.detail-table td {
    border: 1px solid #e0e0e0;
    padding: 10px 8px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
}

.detail-table th {
    background-color: #f5f7fa;
    font-weight: bold;
    color: #333;
    white-space: nowrap;
}

.detail-table td {
    background-color: #fff;
}

.detail-table tbody tr:nth-child(even) td {
    /* background-color: #fafafa; */
}

.detail-table tbody tr:hover td {
    /* background-color: #ecf5ff; */
}

.no-data {
    text-align: center;
    padding: 40px 20px;
    color: #909399;
    font-size: 14px;
    background-color: #fafafa;
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
}

.seal-corner {
    z-index: 1 !important;
    /* 设置较低的层级 */
    /* position: relative; */
    /* 确保 z-index 生效 */
}

.seal-corner canvas {
    z-index: 1 !important;
}

/* 编辑图标样式 */
.edit-icon {
    position: relative;
    z-index: 100;
    cursor: pointer;
    font-size: 16px;
    /* color: #409EFF; */
}

.edit-icon:hover {
    color: #66b1ff;
}
</style>
