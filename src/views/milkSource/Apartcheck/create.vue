<template>
    <div class="app-container">
        <div class="entrust-form">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="奶仓质检明细" name="0" />
                <el-tab-pane label="检测结果" name="1" />
            </el-tabs>
            <!-- 委托单位信息 -->
            <div class="form-section" v-if="activeTab == '0'">
                <table class="info-table">
                    <tr>
                        <td width="15%">化验单号:</td>
                        <td width="35%"> {{ form.milkSampleQualityInspectionNumber }} </td>
                        <td>奶源计划:</td>
                        <td>{{ form.milkSourcePlanOrderNumber }}</td>
                    </tr>
                    <tr>
                        <td>车牌号:</td>
                        <td> {{ form.licensePlateNumber }} </td>
                        <td width="15%">进场时间:</td>
                        <td width="35%">{{ form.entryTime }}</td>

                    </tr>
                    <tr>
                        <td>取样人:</td>
                        <td>{{ form.sampler }}</td>
                        <td>取样时间:</td>
                        <td>{{ form.samplingTime }}</td>
                    </tr>
                    <tr>
                        <td>检测人:</td>
                        <td>{{ form.tester }}</td>
                        <td>检测日期:</td>
                        <td>{{ form.testTime }}</td>
                    </tr>
                    <tr>
                        <td>制单人:</td>
                        <td>{{ form.createByName }}</td>
                        <td>制单时间:</td>
                        <td>{{ form.createTime }}</td>
                    </tr>
                    <tr>
                        <td>备注:</td>
                        <td colspan="3">{{ form.remark }}</td>
                    </tr>
                    <tr>
                        <td>奶温照片:</td>
                        <td colspan="3">
                            <img :src="form.milkTempPhotoUrl" @click="handleCarReportPreview(form.milkTempPhotoUrl)"
                                style="max-height:80px" />
                        </td>
                    </tr>
                </table>
            </div>

            <div class="form-section" v-if="activeTab == '1'">
                <table class="info-table">
                    <tr>
                        <td width="15%">酒精类型:</td>
                        <td width="35%"> {{ form.alcoholType }} </td>
                        <td>酒精值:</td>
                        <td width="35%"> {{ form.alcoholValue }} </td>
                    </tr>
                    <tr>
                        <td>酒精照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.alcoholPhotoUrl" @click="handleCarReportPreview(form.alcoholPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>磷酸盐试验（＋/-）:</td>
                        <td>{{ form.phosphateTest }}</td>
                    </tr>
                    <tr>
                        <td width="15%">磷酸盐试验照片:</td>
                        <td width="35%">
                            <div style="position: relative;">
                                <img :src="form.phosphateTestPhotoUrl"
                                    @click="handleCarReportPreview(form.phosphateTestPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>血奶检测:</td>
                        <td>{{ form.bloodMilkTest }}</td>
                    </tr>
                    <tr>
                        <td width="15%">血奶检测照片:</td>
                        <td width="35%">
                            <div style="position: relative;">
                                <img :src="form.bloodMilkTestPhotoUrl"
                                    @click="handleCarReportPreview(form.bloodMilkTestPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>感官指标:</td>
                        <td>{{ form.sensoryIndex }}</td>
                    </tr>
                    <tr>
                        <td>感官指标照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.sensoryIndexPhotoUrl"
                                    @click="handleCarReportPreview(form.sensoryIndexPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td width="15%">黄曲霉毒素M1:</td>
                        <td>{{ form.aflatoxinM1 }}</td>
                    </tr>
                    <tr>
                        <td>黄曲霉毒素M1照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.aflatoxinM1PhotoUrl"
                                    @click="handleCarReportPreview(form.aflatoxinM1PhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                        <td width="15%">β-内酰胺:</td>
                        <td>{{ form.betaLactam }}</td>
                    </tr>
                    <tr>
                        <td>β-内酰胺照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.betaLactamPhotoUrl"
                                    @click="handleCarReportPreview(form.betaLactamPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                        <td>四环素类:</td>
                        <td>{{ form.tetracyclines }}</td>
                    </tr>

                    <tr>
                        <td>四环素类照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.tetracyclinesPhotoUrl"
                                    @click="handleCarReportPreview(form.tetracyclinesPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>头孢噻呋:</td>
                        <td>{{ form.ceftiofur }}</td>
                    </tr>
                    <tr>
                        <td>头孢噻呋照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.ceftiofurPhotoUrl"
                                    @click="handleCarReportPreview(form.ceftiofurPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                        <td>四环素类:</td>
                        <td>{{ form.tetracyclines }}</td>
                    </tr>
                    <tr>
                        <td>四环素类照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.tetracyclinesPhotoUrl"
                                    @click="handleCarReportPreview(form.tetracyclinesPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>头孢氨苄:</td>
                        <td>{{ form.cefalexin }}</td>
                    </tr>
                    <tr>
                        <td>头孢氨苄照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.cefalexinPhotoUrl"
                                    @click="handleCarReportPreview(form.cefalexinPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                        <td>喹诺酮:</td>
                        <td>{{ form.quinolone }}</td>
                    </tr>
                    <tr>
                        <td>喹诺酮照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.quinolonePhotoUrl"
                                    @click="handleCarReportPreview(form.quinolonePhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                        <td>冰点:</td>
                        <td>{{ form.freezingPoint }}</td>
                    </tr>
                    <tr>
                        <td>冰点照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.freezingPointPhotoUrl"
                                    @click="handleCarReportPreview(form.freezingPointPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>抗生素照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.antibioticPhotoUrl"
                                    @click="handleCarReportPreview(form.antibioticPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>酸度（°T）:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.acidity" @click="handleCarReportPreview(form.acidity)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                        <td>酸度照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.acidityPhotoUrl" @click="handleCarReportPreview(form.acidityPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>脂肪%:</td>
                        <td>{{ form.fatPercent }}</td>
                        <td>脂肪%照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.fatPercentPhotoUrl"
                                    @click="handleCarReportPreview(form.fatPercentPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>蛋白%:</td>
                        <td>{{ form.proteinPercent }}</td>
                        <td>蛋白%照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.proteinPercentPhotoUrl"
                                    @click="handleCarReportPreview(form.proteinPercentPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>玫瑰红（＋/-）:</td>
                        <td>{{ form.roseBengal }}</td>
                        <td>玫瑰红照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.roseBengalPhotoUrl"
                                    @click="handleCarReportPreview(form.roseBengalPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>


                    </tr>
                    <tr>
                        <td>溴百里香酚蓝（＋/-）:</td>
                        <td>{{ form.bromothymolBlue }}</td>
                        <td>溴百里香酚蓝照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.bromothymolBluePhotoUrl"
                                    @click="handleCarReportPreview(form.bromothymolBluePhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>三氯化铁（＋/-）:</td>
                        <td>{{ form.ferricChloride }}</td>
                        <td>三氯化铁照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.ferricChloridePhotoUrl"
                                    @click="handleCarReportPreview(form.ferricChloridePhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>美兰试验（4小时）:</td>
                        <td>{{ form.methyleneBlueTest }}</td>
                        <td>美兰试验照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.methyleneBlueTestPhotoUrl"
                                    @click="handleCarReportPreview(form.methyleneBlueTestPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>E50:</td>
                        <td>{{ form.e50 }}</td>
                        <td>E50照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.e50PhotoUrl" @click="handleCarReportPreview(form.e50PhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                    </tr>



                    <tr>
                        <td>解抗剂:</td>
                        <td>{{ form.antibioticResidue }}</td>
                        <td>解抗剂照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.antibioticResiduePhotoUrl"
                                    @click="handleCarReportPreview(form.antibioticResiduePhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>氟尼辛:</td>
                        <td>{{ form.flunixin }}</td>
                        <td>氟尼辛照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.flunixinPhotoUrl" @click="handleCarReportPreview(form.flunixinPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>美洛昔康:</td>
                        <td>{{ form.meloxicam }}</td>
                        <td>美洛昔康照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.meloxicamPhotoUrl"
                                    @click="handleCarReportPreview(form.meloxicamPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>链霉素/双氢链霉素:</td>
                        <td>{{ form.streptomycin }}</td>
                        <td>链霉素/双氢链霉素照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.streptomycinPhotoUrl"
                                    @click="handleCarReportPreview(form.streptomycinPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>


                    <tr>
                        <td>卡那:</td>
                        <td>{{ form.kanamycin }}</td>
                        <td>卡那照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.kanamycinPhotoUrl"
                                    @click="handleCarReportPreview(form.kanamycinPhotoUrl)" style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                    <tr>
                        <td>莫能菌素:</td>
                        <td>{{ form.monensin }}</td>
                        <td>莫能菌素照片:</td>
                        <td>
                            <div style="position: relative;">
                                <img :src="form.monensinPhotoUrl" @click="handleCarReportPreview(form.monensinPhotoUrl)"
                                    style="max-height:80px" />
                            </div>
                        </td>

                    </tr>
                </table>
            </div>

        </div>
        <el-dialog title="附件预览" :visible.sync="previewDialogVisible" width="700px" append-to-body center>
            <!-- 轮播：只有一张时自动隐藏指示器 -->
            <el-carousel v-if="previewUrlList.length" indicator-position="outside" height="400px">
                <el-carousel-item v-for="(url, index) in previewUrlList" :key="index">
                    <!-- 图片 -->
                    <div style="text-align:center;line-height:400px;">
                        <img :src="url" style="max-width:100%;max-height:100%;vertical-align:middle;" />
                    </div>
                </el-carousel-item>
            </el-carousel>

            <!-- 空数据 -->
            <div v-else style="text-align:center;color:#999;">暂无文件</div>

            <span slot="footer">
                <el-button @click="previewDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getmilkSampleQualityInspection } from '@/api/milkSource/Apartcheck'
export default {
    name: "ApartcheckCreate",
    dicts: [],

    data() {
        return {
            activeTab: "0",
            formid: "",
            form: {},
            previewUrlList: [],
            previewDialogVisible: false
        };
    },
    watch: {

    },

    created() {
        // 获取路由参数
        const id = this.$route.query.id;
        if (id) {
            this.formid = id
            this.loadData();
        }
    },
    mounted() {

    },
    methods: {

        // 加载委托单数据
        loadData() {
            getmilkSampleQualityInspection(this.formid).then(response => {
                this.form = response.data;
                console.log(this.form, '1')
            });
        },

        // 预览按钮
        handleCarReportPreview(type) {
            console.log(type)
            this.previewUrlList = []
            this.previewUrlList.push(type)
            this.previewDialogVisible = true
        },
    }
};
</script>

<style scoped>
.app-container {
    padding: 20px;
    background-color: #f5f5f5;
    position: relative;
}



.entrust-form {
    background: white;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: relative;
}

.form-section {
    margin-bottom: 20px;
    border: 1px solid #e6e6e6;
    /* padding: 10px; */
}

.info-table {
    width: 100%;
    border-collapse: collapse;
}

.info-table td {
    border: 1px solid #e6e6e6;
    padding: 8px;
    vertical-align: top;
}

.info-table tr:first-child td {
    border-top: none;
}

.info-table tr td:first-child,
.info-table tr td:nth-child(3) {
    border-left: none;
    background-color: #f9f9f9;
    font-weight: bold;
    text-align: center;
    color: #333;
    width: 15%;
    font-size: 14px;
}

.info-table tr:last-child td {
    border-bottom: none;
}

.info-table tr td:last-child {
    border-right: none;
}
</style>