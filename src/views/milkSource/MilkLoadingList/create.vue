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
                        <td>装奶时间:</td>
                        <td>{{ form.milkFillingTime }}</td>

                    </tr>
                    <tr>
                        <td>最早一滴挤奶时间:</td>
                        <td> {{ form.firstMilkingTime }} </td>
                        <td width="15%">装奶量:</td>
                        <td width="35%">{{ form.milkCapacity }}</td>

                    </tr>
                    <tr>
                        <td>制单人:</td>
                        <td>{{ form.createByName }}</td>
                        <td>制单时间:</td>
                        <td>{{ form.createTime }}</td>
                    </tr>
                </table>
            </div>
            <el-table ref="multipleTable" :data="cardList">
                <el-table-column type="index" align="center" label="序号" width="50" />
                <el-table-column label="奶仓名称" align="center" prop="milkWarehouseName" />
                <el-table-column label="装奶量" align="center" prop="milkCapacity" />
            </el-table>
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
import { getmilkFilling } from '@/api/milkSource/MilkLoadingList'
export default {
    name: "MilkTankerCreate",
    dicts: [],

    data() {
        return {
            formid: "",
            form: {},
            previewUrlList: [],
            previewDialogVisible: false,
            cardList: [],
        };
    },
    created() {
        // 获取路由参数
        const id = this.$route.query.opMilkFillingOrderId;
        if (id) {
            this.formid = id
            this.loadData();
        }
    },
    methods: {

        // 加载委托单数据
        loadData() {
            getmilkFilling(this.formid).then(response => {
                this.form = response.data;
                this.cardList = this.form.opMilkFillingOrderDetailList;
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