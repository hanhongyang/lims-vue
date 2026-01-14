<template>
    <div class="app-container">
        <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回首页</el-button>
        <el-button type="primary" v-if="isPad" style="margin-bottom:10px">扫码</el-button>
        <el-form :model="searchForm" ref="queryFormNir" size="small" :inline="true" label-width="68px">
            <el-form-item label="送检单号" prop="entrustOrderNo">
                <el-input v-model="searchForm.entrustOrderNo" placeholder="请输入委托单号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="委托单位" prop="deptName">
                <el-input v-model="searchForm.deptName" placeholder="请输入委托单位" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="检测项目" prop="itemName">
                <el-input v-model="searchForm.itemName" placeholder="请输入检测项目" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待受理" name="first">
                <el-table :data="tableData" style="width: 100%" border :header-cell-style="{ textAlign: 'center' }"
                    :height="tableHeight">
                    <el-table-column prop="entrustOrderNo" label="送检单号" width="180">
                    </el-table-column>
                    <el-table-column prop="deptName" label="送检单位" width="180">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="180">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.entrust_order_type" :value="scope.row.type" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="sampleName" label="样品名称" width="180">
                    </el-table-column>
                    <el-table-column prop="itemName" label="检测项目">
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center" header-align="center">
                        <template slot-scope="{ row }">
                            <el-button type="success" round @click="XZbtn(row)">详情接收</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="searchForm.pageNum"
                    :limit.sync="searchForm.pageSize" @pagination="getList" class="pagin" />
            </el-tab-pane>
            <el-tab-pane label="已受理" name="second">
                <el-table :data="tableData" style="width: 100%" border :header-cell-style="{ textAlign: 'center' }"
                    :height="tableHeight">
                    <el-table-column prop="entrustOrderNo" label="送检单号" width="180">
                    </el-table-column>
                    <el-table-column prop="deptName" label="送检单位" width="180">
                    </el-table-column>
                    <el-table-column prop="type" label="类型" width="180">
                        <template slot-scope="scope">
                            <dict-tag :options="dict.type.entrust_order_type" :value="scope.row.type" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="sampleName" label="样品名称" width="180">
                    </el-table-column>
                    <el-table-column prop="itemName" label="检测项目">
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center" header-align="center">
                        <template slot-scope="{ row }">
                            <el-button type="success" round @click="XZbtn(row)">详情接收</el-button>
                        </template>
                    </el-table-column>

                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="searchForm.pageNum"
                    :limit.sync="searchForm.pageSize" @pagination="getList" class="pagin" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { listSampleReceive } from '@/api/CentralLaboratory/sampleReceive'

export default {
    dicts: ['entrust_order_type'],
    data() {
        return {
            isPad: false,
            searchForm: {
                pageNum: 1,
                pageSize: 10,
                status: '',
                isReceive: '0',
                entrustOrderNo: '',
                deptName: '',
                itemName: '',
            },
            activeName: 'first',
            tableData: [],
            tableHeight: window.innerHeight - 220,  // 留出头、查询区、分页高度
            // 总条数
            total: 0,
            isReceive: 0
        }
    },
    mounted() {
        this.isPadPc()
        this.getList()
        window.addEventListener('resize', () => {
            this.tableHeight = window.innerHeight - 280;
        });
    },
    methods: {
        /** 通用平板检测 */
        isPADDevice() {
            const userAgent = navigator.userAgent.toLowerCase();
            const isiPad = /ipad/.test(userAgent);
            const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
            const isWindowsTablet = /windows/.test(userAgent) && /touch/.test(userAgent);

            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const isTabletSize = (screenWidth >= 768 && screenWidth <= 1024) ||
                (screenHeight >= 768 && screenHeight <= 1024);

            return isiPad || isAndroidTablet || isWindowsTablet || isTabletSize;
        },
        /** 专门检测华为平板 */
        isHuaweiPad() {
            const userAgent = navigator.userAgent.toLowerCase();

            // 华为平板特征检测
            const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent);
            const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

            // 屏幕尺寸检测（华为平板典型尺寸）
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
                (screenHeight >= 768 && screenHeight <= 1600);

            // 华为平板特有特征
            const hasEMUI = /emui/.test(userAgent);
            const isHuaweiPad = (isHuawei && isAndroidTablet) ||
                (isHuawei && isHuaweiTabletSize) ||
                (hasEMUI && isAndroidTablet);

            return isHuaweiPad;
        },
        isPadPc() {
            // 使用若依的设备检测
            const device = this.$store.state.app.device;
            // 检测是否为华为平板
            if (this.isHuaweiPad()) {
                console.log('华为')
                this.isPad = true

            } else if (this.isPADDevice()) {
                console.log('Pad')
                this.isPad = true

            } else {
                console.log('PC')
                this.isPad = false
                // PC端保持原逻辑

            }
            // 检测完再同步一次高度
            // this.setBodyHeight();
        },
        HDPada() {
            this.$router.push('/Pad')
        },
        handleClick(tab) {
            if (tab.label == '待受理') {
                this.searchForm.isReceive = 0
            } else {
                this.searchForm.isReceive = 1
            }
            this.getList();
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.searchForm.pageNum = 1;
            this.getList();
        },
        getList() {
            this.loading = true;
            listSampleReceive(this.searchForm).then(res => {
                console.log(res, '样品接收列表')
                this.tableData = res.rows
                this.total = res.total;
            });
        },
        resetQuery() {
            this.$refs.queryFormNir.resetFields()
        },
        XZbtn(row) {
            console.log(row)
            this.$router.push({
                path: '/ypjsXq',
                query: {
                    entrustOrderNo: row.entrustOrderNo,
                    type: row.type
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
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

/* 平板设备特定样式 */
@media (max-width: 1024px) {
    .app-container {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;

        /* 调整表格高度 */
        .el-table {
            max-height: calc(100vh - 280px);
        }
    }
}

/* 通用表格样式 */
.el-table {
    max-height: 610px;
    overflow: auto;

    &::before {
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0px;
    }
}
</style>