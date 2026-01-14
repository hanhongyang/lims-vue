<template>
    <div class="app-container">
        <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回样品接收列表</el-button>
        <el-descriptions title="送检样品接收信息">
            <el-descriptions-item label="送检编码">{{ feedEntrustOrder.entrustOrderNo || "" }}</el-descriptions-item>
            <el-descriptions-item label="生产企业">{{ feedEntrustOrder.producerUnitName || "" }}</el-descriptions-item>
            <el-descriptions-item label="委托单位">{{ feedEntrustOrder.producerUnitName || "" }}</el-descriptions-item>
            <el-descriptions-item label="委托方地址">{{ feedEntrustOrder.reportMailingAddress || "" }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ feedEntrustOrder.entrustContactPhone || "" }}</el-descriptions-item>
            <el-descriptions-item label="委托方邮箱">{{ feedEntrustOrder.entrustContactEmail || "" }}</el-descriptions-item>
            <el-descriptions-item label="送样日期">{{ feedEntrustOrder.sendSampleDate || "" }}</el-descriptions-item>
            <el-descriptions-item label="接收人">{{ feedEntrustOrder.receiverName || "" }}</el-descriptions-item>
        </el-descriptions>
        <div class="ypxx">
            <el-card class="box-card" v-for="(item, index) in slList" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{ item.name }}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">作废</el-button>
                </div>
                <div class="text item">
                    <div class="jx"><span class="font">规格：</span> {{ item.model }}</div>
                    <div class="jx"><span class="font">生产日期或采样日期：</span> {{ item.model }}</div>
                    <div class="jx jx-items">
                        <span class="font">检验项目：</span> {{ formatItems(index) }}<el-button type="primary"
                            style="margin-left:10px" @click="toggle">修改</el-button>
                    </div>
                    <div class="jx"><span class="font">样品包装：</span>
                        <el-select v-model="item.packaging" placeholder="样品包装">
                            <el-option v-for="dict in dict.type.sample_packaging" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </div>
                    <div class="jx"><span class="font">样品状况：</span>
                        <el-select v-model="item.status" placeholder="样品状况">
                            <el-option v-for="dict in dict.type.sample_state" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </div>
                    <div class="jx"><span class="font">储存要求：</span>
                        <el-select v-model="item.storageRequirement" placeholder="储存要求">
                            <el-option v-for="dict in dict.type.storage_requirement" :key="dict.value"
                                :label="dict.label" :value="dict.value" />
                        </el-select>
                    </div>
                    <div class="jx"><span class="font">检验标准/方法：</span> {{ item.model }}</div>
                </div>
            </el-card>
            <el-dialog title="修改检验项目" :visible.sync="dialogTableVisible">
                <div style="display:flex">
                    <el-input v-model="searchForm.itemName" placeholder="请输入要搜索的项目名称"></el-input>
                    <el-button type="primary" style="margin-left:10px" @click="ss">搜索</el-button>
                </div>


                <el-table :data="gridData">
                    <el-table-column property="date" label="日期" width="150"></el-table-column>
                    <el-table-column property="name" label="姓名" width="200"></el-table-column>
                    <el-table-column property="address" label="地址"></el-table-column>
                </el-table>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { GetqualityTestinfo, labTestItemslist } from '@/api/CentralLaboratory/sampleReceive'
export default {
    dicts: ['sample_packaging', 'sample_state', 'storage_requirement'],
    data() {
        return {
            entrustOrderNo: '',
            type: '',
            feedEntrustOrder: {},
            slList: [],
            selectedItemsBySample: [],
            gridData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }],
            dialogTableVisible: false,
            tableData: [],
            searchForm: {
                pageNum: 1,
                pageSize: 10,
                itemName: ''
            },









            xyList: [],
            pcrList: [],
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        HDPada() {
            this.$router.go(-1)
        },
        getList() {
            this.entrustOrderNo = this.$route.query.entrustOrderNo
            this.type = this.$route.query.type
            GetqualityTestinfo(this.$route.query.entrustOrderNo, this.$route.query.type).then(res => {
                console.log(res, '样品接收列表')
                if (res.code == 200) {
                    if (this.type == 1) {
                        this.feedEntrustOrder = res.data.feedEntrustOrder;
                        this.slList = this.feedEntrustOrder.sampleList
                        //  保存每个样本的 testItem
                        this.slList.forEach((item, index) => {
                            if (item.testItem && item.testItem.length > 0) {
                                this.$set(this.selectedItemsBySample, index, [...item.testItem]);
                            }
                        });
                        console.log(this.selectedItemsBySample, 'selectedItemsBySample')
                    } else if (this.type == 3) {
                        this.pcrLt = res.data
                        // this.pcrList = this.pcrLt.pcrEntrustOrder.sampleList
                        this.pcrList = this.pcrLt.pcrEntrustOrder.sampleList.map(item => ({
                            ...item,
                            pcrTaskItemType: Number(item.pcrTaskItemType) || undefined
                        }));
                    } else {
                        this.boolLt = res.data
                        this.boolList = this.boolLt.bloodEntrustVo.sampleList
                        console.log(this.boolList, 'boolList')
                        this.checkedDisease = Number(this.boolLt.bloodEntrustVo.itemCode)
                        this.checkedFmd = Number(this.boolLt.bloodEntrustVo.itemTy)
                        this.checkedBbktjc = Number(this.boolLt.bloodEntrustVo.itemBbkt)
                    }
                }
            });
        },
        formatItems(idx) {
            const arr = this.selectedItemsBySample[idx] || [];
            return arr.map(item => item.itemName).join('，');
        },
        toggle() {
            this.dialogTableVisible = true
            labTestItemslist(searchForm).then((res) => {
                console.log(res, '检测项目列表')
            })
        },
    }
}
</script>
<style>
/* 基础样式 */
html,
body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    /* 禁用横向滚动 */
}

.app-container {
    height: 100vh;
    width: 100vw;
    overflow: auto;
    padding: 0 15px;
    margin: 0px 0px 0 !important;
}

.el-descriptions {
    border: 1px solid black;
    padding: 10px;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 50%;
    /* height: 300px; */
}

.jx {
    margin: 5px 0;
}

.jx-items {
    word-break: break-all;
    /* 长单词/编号强制换行 */
    white-space: normal;
    /* 允许换行 */
    line-height: 1.5;
    /* 行距美观 */
}

.ypxx {
    display: flex;
    flex-wrap: wrap;
    height: 400px;
    overflow-y: auto;
}

.font {
    font-size: 16px;
    /* font-weight: bold; */
}
</style>