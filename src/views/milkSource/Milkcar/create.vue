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
                        <td>前车牌号:</td>
                        <td> {{ form.licensePlateNumber }} </td>
                        <td width="15%">司机:</td>
                        <td width="35%">{{ form.driverName }}</td>

                    </tr>
                    <tr>
                        <td>挂车牌号:</td>
                        <td> {{ form.trailerNumber }} </td>
                        <td width="15%">进场时间:</td>
                        <td width="35%">{{ form.entryTime }}</td>

                    </tr>
                    <tr>
                        <td>目的地:</td>
                        <td>{{ form.destination }}</td>
                        <td>采样人:</td>
                        <td>{{ form.sampler }}</td>
                    </tr>
                    <tr>
                        <td>采样时间:</td>
                        <td>{{ form.samplingTime }}</td>
                        <td>检测人:</td>
                        <td>{{ form.tester }}</td>

                    </tr>
                    <tr>
                        <td>检测日期:</td>
                        <td>{{ form.testTime }}</td>
                        <td>制单人:</td>
                        <td>{{ form.createByName }}</td>

                    </tr>
                    <tr>
                        <td>制单时间:</td>
                        <td colspan="3">{{ form.createTime }}</td>
                    </tr>
                    <tr>
                        <td>备注:</td>
                        <td colspan="3">{{ form.remark }}</td>
                    </tr>
                </table>
            </div>

            <div class="form-section" v-if="activeTab == '1'">
                <table class="info-table">
                    <tr>
                        <td width="15%">菌落总数:</td>
                        <td width="35%"> {{ form.colonyCount }} </td>
                        <td>嗜冷菌:</td>
                        <td width="35%"> {{ form.psychrophilicBacteria }} </td>
                    </tr>
                    <tr>
                        <td width="15%">需氧芽孢:</td>
                        <td width="35%"> {{ form.aerobicSpores }} </td>
                        <td>耐热芽孢:</td>
                        <td width="35%"> {{ form.thermotolerantSpores }} </td>
                    </tr>
                    <tr>
                        <td width="15%">嗜热芽孢:</td>
                        <td width="35%"> {{ form.thermophilicSpores }} </td>
                        <td>耐热+嗜热芽孢:</td>
                        <td width="35%"> {{ form.thermotolerantThermophilicSpores }} </td>
                    </tr>
                    <tr>
                        <td width="15%">涂抹部位:</td>
                        <td width="35%"> {{ form.applicationArea }} </td>
                        <td>涂抹总菌落数:</td>
                        <td width="35%"> {{ form.smearTotalColony }} </td>
                    </tr>
                    <tr>
                        <td width="15%">涂抹嗜冷菌:</td>
                        <td width="35%"> {{ form.applyPsychrophilicBacteria }} </td>
                        <td>pH残留:</td>
                        <td width="35%"> {{ form.residualpH }} </td>
                    </tr>
                    <tr>
                        <td width="15%">外观（奶车肉眼检查是否干净）:</td>
                        <td width="35%"> {{ form.appearance }} </td>
                        <td>涂抹人:</td>
                        <td width="35%"> {{ form.smearPerson }} </td>
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
import { getmilkTankInspection } from '@/api/milkSource/Milkcar'
export default {
    name: "MilkcarCreate",
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
            getmilkTankInspection(this.formid).then(response => {
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