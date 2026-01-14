<template>
    <div class="app-container">
        <div class="entrust-form">

            <div class="form-header">
                <h1>奶罐车检查详情</h1>
            </div>
            <div class=" form-section">
                <table class="info-table">
                    <tr>
                        <td width="15%">车牌号:</td>
                        <td width="35%"> {{ form.licensePlateNumber }} </td>
                        <td>铅封号:</td>
                        <td>{{ form.leadSealNumber }}</td>

                    </tr>
                    <tr>
                        <td>铅封人:</td>
                        <td> {{ form.sealedMan }} </td>
                        <td width="15%">制单人:</td>
                        <td width="35%">{{ form.createByName }}</td>

                    </tr>
                    <tr>
                        <td>制单时间:</td>
                        <td colspan="3">{{ form.createTime }}</td>

                    </tr>
                    <tr>
                        <td width="15%">铅封照片:</td>
                        <td colspan="3">
                            <div v-for="(f, idx) in jcbgFiles" :key="idx" style="position:relative;" class="qfimg">
                                <img class="thumb" :src="f" mode="aspectFill" @click="handleCarReportPreview(f, idx)" />
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
import { getleadsealsheet } from '@/api/milkSource/SealRecordSheet'
export default {
    name: "MilkTankerCreate",
    dicts: [],

    data() {
        return {
            formid: "",
            form: {},
            previewUrlList: [],
            previewDialogVisible: false,
            jcbgFiles: [],
        };
    },
    watch: {

    },

    created() {
        // 获取路由参数
        const id = this.$route.query.opLeadSealSheetId;
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
            getleadsealsheet(this.formid).then(response => {
                this.form = response.data;
                console.log(this.form, '1')
                this.jcbgFiles = Array.isArray(response.data.sealedPhotoUrl) ? response.data.sealedPhotoUrl : [];

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

.qfimg {
    width: 33%;
    float: left;
    margin-bottom: 10px;
}

.form-header {
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    margin: 8px 0px 25px 0px;
}

.form-header h1 {
    font-size: 20px;
    font-weight: bold;
    margin: 0 auto;
    /* 居中显示 */
    display: inline-block;
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