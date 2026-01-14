<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="待接收" name="1" />
            <el-tab-pane label="已接收" name="2" />
        </el-tabs>

        <!-- 查询区域 -->
        <el-form ref="queryForm" :model="queryParams" size="small" inline label-width="100px">
            <el-form-item label="样品编号" prop="entrustOrderNo">
                <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入样品编号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="物料" prop="deptName">
                <el-input v-model="queryParams.deptName" placeholder="请输入物料" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item label="送检时间" prop="sendSampleDateRange">
                <el-date-picker v-model="queryParams.sendSampleDateRange" type="daterange" range-separator="至"
                    start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 240px" />
            </el-form-item>

            <!-- <el-form-item label="类型" prop="type">
                <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
                    <el-option v-for="dict in dict.type.entrust_order_type" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item> -->

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 按钮区域 -->
        <el-row :gutter="10" class="mb8">
            <el-col v-if="activeTab === '1'" :span="1.5">
                <el-button type="primary" plain icon="el-icon-printer" @click="plReceive">批量接收</el-button>
            </el-col>
            <!-- <el-col v-if="activeTab === '2'" :span="1.5">
                <el-button type="primary" plain icon="el-icon-printer" @click="dyyl">打印样品标识卡</el-button>
            </el-col> -->
            <!-- <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" @click="handleExport">导出</el-button>
            </el-col> -->
        </el-row>

        <!-- 表格区域 -->
        <el-table ref="multipleTable" v-loading="loading" :data="sampleReceiveList" height="70%" :row-key="getRowKeys"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :reserve-selection="true" />
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="样品编号" align="center" prop="sampleNo" />
            <el-table-column label="物料" align="center" prop="invbillName" />
            <el-table-column label="感官检测结果" align="center" prop="ggQualityResult">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.quality_result" :value="scope.row.ggQualityResult" />
                </template>
            </el-table-column>
            <!-- <el-table-column label="随车检测报告" align="center" prop="carFileId">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleAdd(scope.$index)">
                        上传<i class="el-icon-upload el-icon--right" />
                    </el-button>
                    <el-button type="success" size="mini" @click="handlePreview(scope.row)">预览</el-button>
                </template>
            </el-table-column> -->
            <el-table-column label="化验项目" align="center" prop="itemNames" />
            <el-table-column label="取样人" align="center" prop="samplerName" />
            <el-table-column label="取样时间" align="center" prop="sampleTime" />
            <el-table-column label="生产时间" align="center" prop="productionDate" />
            <el-table-column label="保质期" align="center" prop="shelfLife" />
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="plReceive(scope.row)"
                        v-if="activeTab == '1'">接收</el-button>
                    <el-button size="mini" type="text" @click="handleUpdate(scope.row)">{{ activeTab === '1' ? '修改' :
                        '详情' }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 预览弹窗 -->
        <el-dialog title="随车检测报告预览" :visible.sync="previewDialogVisible" width="600px" append-to-body>
            <div style="text-align: center">
                <img :src="previewUrl" style="max-width: 100%; max-height: 70vh">
            </div>
            <span slot="footer">
                <el-button @click="previewDialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>


        <!-- ① 编辑主弹窗 -->
        <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" append-to-body>
            <el-form label-width="100px">
                <!-- 物料 -->
                <el-form-item label="物料">
                    <el-input v-model="editForm.invbillName" readonly type="textarea" />
                    <div style="text-align:right;margin-top:6px;">
                        <el-button type="text" @click="showMaterialDetail" v-if="activeTab == '1'">修改物料</el-button>
                    </div>
                </el-form-item>

                <!-- 检测项目 -->
                <el-form-item label="检测项目">
                    <el-input v-model="editForm.itemNames" readonly type="textarea" />
                    <div style="text-align:right;margin-top:6px;">
                        <el-button type="text" @click="showItemDetail" v-if="activeTab == '1'">修改检测项目</el-button>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- ② 物料详情弹窗 -->
        <el-dialog title="物料详情" :visible.sync="detailMaterialVisible" width="500px" append-to-body>
            <el-form :model="materialQueryParams" ref="materialQueryForm" size="small" :inline="true"
                @submit.native.prevent>
                <el-form-item label="物料名称" prop="invbillName">
                    <el-input v-model="materialQueryParams.invbillName" placeholder="请输入物料名称" clearable
                        style="width: 240px" @keyup.enter.native="handleMaterialQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleMaterialQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetMaterialQuery">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="materialOptions" height="400" @row-dblclick="handleMaterialDblClick">
                <el-table-column label="物料名称" align="center" prop="invbillName" />
                <el-table-column label="物料编码" align="center" prop="sapCode" />
                <el-table-column label="部门" align="center" prop="deptName" />
            </el-table>


            <!-- 物料对话框分页 -->
            <div class="pagination-container">
                <el-pagination small :current-page="materialQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
                    :page-size="materialQueryParams.pageSize" layout="total, sizes, prev, pager, next"
                    :total="materialTotal" @size-change="handleMaterialSizeChange"
                    @current-change="handleMaterialCurrentChange">
                </el-pagination>
            </div>
            <span slot="footer">
                <el-button @click="detailMaterialVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

        <!-- ③ 检测项目详情弹窗 -->
        <el-dialog title="检测项目详情" :visible.sync="detailItemVisible" width="500px" append-to-body>
            <el-form :model="testItemQuery" ref="testItemQueryForm" size="small" :inline="true" @submit.native.prevent>
                <el-form-item label="项目名称" prop="itemName">
                    <el-input v-model="testItemQuery.itemName" placeholder="请输入项目名称" clearable style="width: 240px"
                        @keyup.enter.native="getTestItemList" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getTestItemList">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetTestItemQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table ref="testItemTable" :data="testItemList" height="400"
                @selection-change="handleTestItemSelectionChange" :row-key="row => row.itemId">
                <el-table-column type="selection" align="center" :reserve-selection="true"></el-table-column>
                <el-table-column prop="itemCode" label="项目编码" align="center"></el-table-column>
                <el-table-column prop="itemName" label="项目名称" align="center"></el-table-column>
            </el-table>

            <!-- 检测项目对话框分页 -->
            <div class="pagination-container">
                <el-pagination small :current-page="testItemQuery.pageNum" :page-sizes="[10, 20, 30, 50]"
                    :page-size="testItemQuery.pageSize" layout="total, sizes, prev, pager, next" :total="testItemTotal"
                    @size-change="handleTestItemSizeChange" @current-change="handleTestItemCurrentChange">
                </el-pagination>
            </div>
            <span slot="footer">
                <el-button @click="detailItemVisible = false">关 闭</el-button>
                <el-button type="primary" @click="confirmTestItems">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { listSampleReceive, jieshou } from '@/api/Ranch/acceptancelist'
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getItemByInvbillCode } from "@/api/Basicdata/Testingitems";
import { getToken } from '@/utils/auth'
export default {
    name: 'SampleReceive',
    dicts: ['quality_result', 'entrust_order_type', 'feed_test_method'],
    data() {
        return {
            title: '',
            loading: true,
            activeTab: '1',
            total: 0,
            sampleReceiveList: [],
            previewDialogVisible: false,
            previewUrl: '',
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                entrustOrderNo: null,
                deptName: null,
                type: null,
                // status: null,
                // 用 isReceive 替代 status：待接收传 0，已接收传 1
                isReceive: null,
                sendSampleDateRange: [],
                sendSampleDateStart: null,
                sendSampleDateEnd: null
            },
            selectedRows: new Map(),// 跨页记忆
            dialogVisible: false,
            innerVisible: false,      // 控制第二层弹窗
            editForm: {               // 回显用
                invbillName: '',
                itemNames: ''
            },
            detailMaterialVisible: false,   // 物料详情弹窗
            detailItemVisible: false,       // 检测项目详情弹窗
            detailMaterial: '',             // 物料详细内容
            detailItem: '',              // 检测项目详细内容
            materialQueryParams: {
                pageNum: 1,
                pageSize: 10,
                invbillName: '',
                isEnable: '1',
                tag: '1',//标签为饲料
            },
            materialOptions: [],
            materialTotal: 0,
            currentEditIndex: null,   // 正在编辑的行索引
            testItemList: [],
            testItemQuery: {
                pageNum: 1,
                pageSize: 10,
                itemName: '',
                tag: '1',
                isEnable: '1'
            },
            testItemTotal: 0,
            allSelectedTestItems: new Map(),   // 跨页记忆检测项目
            currentInvbillCode: '',   // <-- 新增：当前选中行的物料编码
        }
    },
    created() {
        this.getList()
    },
    methods: {

        // 在获取检测项目列表时设置选中状态
        getTestItemList() {
            // 组装参数
            const send = {
                ...this.testItemQuery,
                invbillCode: this.currentInvbillCode   // <-- 关键字段
            }
            getItemByInvbillCode(send).then(response => {
                this.testItemList = response.rows.map(item => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }));

                this.testItemTotal = response.total;

                // 设置选中状态
                this.$nextTick(() => {
                    // this.$refs.testItemTable.clearSelection(); // ✅ 清空表格选中状态
                    this.testItemList.forEach(row => {
                        if (this.allSelectedTestItems.has(row.itemId)) {
                            this.$refs.testItemTable.toggleRowSelection(row, true);
                        }
                    });
                });
            });
        },
        // 重置检测项目查询
        resetTestItemQuery() {
            this.testItemQuery = {
                pageNum: 1,
                pageSize: 10,
                itemName: '',
                tag: '1',
                isEnable: '1'
            };
            this.getTestItemList();
        },
        // 确认选择的检测项目
        confirmTestItems() {
            // 1. 把 Map 里所有选中的项目名称拼成字符串
            const names = [...this.allSelectedTestItems.values()]
                .map(i => i.itemName)
                .join(',')
            // 2. 写回输入框
            this.editForm.itemNames = names
            // 3. 关闭弹窗 & 清空记忆（可选）
            this.detailItemVisible = false
            this.allSelectedTestItems.clear()
        },
        // 检测项目分页大小变化
        handleTestItemSizeChange(val) {
            this.testItemQuery.pageSize = val;
            this.getTestItemList();
        },

        // 检测项目当前页变化
        handleTestItemCurrentChange(val) {
            this.testItemQuery.pageNum = val;
            this.getTestItemList();
        },
        // 处理检测项目选择变化
        handleTestItemSelectionChange(selection) {
            // 更新当前页的选中状态
            const currentPageKeys = this.testItemList.map(item => item.itemId);

            // 先移除当前页之前选中的但当前未选中的项目
            currentPageKeys.forEach(key => {
                if (this.allSelectedTestItems.has(key) && !selection.some(item => item.itemId === key)) {
                    this.allSelectedTestItems.delete(key);
                }
            });

            // 添加当前页新选中的项目
            selection.forEach(item => {
                this.allSelectedTestItems.set(item.itemId, item);
            });
        },
        /** 获取物料列表 */
        getMaterialList() {
            // 确保查询参数中包含部门ID
            // this.materialQueryParams.ownDeptId = this.form.entrustDeptId;
            getinvbilllist(this.materialQueryParams).then(response => {
                this.materialOptions = response.rows;
                this.materialTotal = response.total;
                
            }).catch(error => {
                console.error("获取物料列表失败:", error);
            });
        },
        /** 物料查询 */
        handleMaterialQuery() {
            this.materialQueryParams.pageNum = 1;
            this.getMaterialList();
        },

        /** 重置物料查询 */
        resetMaterialQuery() {
            this.materialQueryParams = {
                pageNum: 1,
                pageSize: 10,
                invbillName: '',
                // ownDeptId: this.form.deptId, // 保留部门ID
                isEnable: '1'
            };
            this.handleMaterialQuery();
        },
        /** 物料分页大小变化 */
        handleMaterialSizeChange(val) {
            this.materialQueryParams.pageSize = val;
            this.getMaterialList();
        },

        /** 物料当前页变化 */
        handleMaterialCurrentChange(val) {
            this.materialQueryParams.pageNum = val;
            this.getMaterialList();
        },
        // 双击选中物料
        handleMaterialDblClick(row) {
            // 1. 回显到输入框
            this.editForm.invbillName = row.invbillName
            // 2. 实时写回主表格
            const targetRow = this.sampleReceiveList[this.currentEditIndex]
            if (targetRow) {
                targetRow.invbillCode = row.sapCode
                targetRow.invbillName = row.invbillName
                targetRow.materialCode = row.sapCode   // 如需编码一起带
            }
            // 3. 记住物料编码（用于检测项目查询）
            this.currentInvbillCode = row.sapCode
            // 3. 关闭物料弹窗
            this.detailMaterialVisible = false
        },
        // 编辑主弹窗【确定】回调
        handleEditConfirm() {
            const idx = this.currentEditIndex
            // 1. 整行替换 → 触发 Vue 响应式
            this.sampleReceiveList.splice(idx, 1, {
                ...this.sampleReceiveList[idx],
                invbillName: this.editForm.invbillName,
                itemNames: this.editForm.itemNames
            })
            // 2. 关闭编辑弹窗
            this.dialogVisible = false
        },
        /* 唯一 row-key */
        getRowKeys(row) {
            return row.samplingPlanSampleId
        },

        /* 当页选中变化时，同步到 selectedRows */
        handleSelectionChange(val) {
            // 先删除当前页未再选中的
            const currentKeys = this.sampleReceiveList.map(r => this.getRowKeys(r))
            currentKeys.forEach(k => {
                if (!val.some(r => this.getRowKeys(r) === k)) this.selectedRows.delete(k)
            })
            // 再存入当前页选中的
            val.forEach(r => this.selectedRows.set(this.getRowKeys(r), r))

            console.log(Array.from(this.selectedRows.values()), '批量接收候选');
        },

        /* 获取列表 + 回显勾选 */
        getList() {
            this.loading = true
            // 状态随 tab 切换 -> 改为传 isReceive
            this.queryParams.isReceive = this.activeTab === '1' ? '0' : '1'
            // 日期范围处理
            const dr = this.queryParams.sendSampleDateRange
            this.queryParams.sendSampleDateStart = dr && dr.length === 2 ? dr[0] : null
            this.queryParams.sendSampleDateEnd = dr && dr.length === 2 ? dr[1] : null

            listSampleReceive(this.queryParams).then(res => {
                this.sampleReceiveList = res.rows
                this.total = res.total
                this.loading = false

                // 关键：等 DOM 渲染完再回显
                this.$nextTick(() => {
                    // if (!this.$refs.multipleTable || !this.selectedRows.size) return
                    const tableRows = this.$refs.multipleTable.data
                    tableRows.forEach(row => {
                        if (this.selectedRows.has(this.getRowKeys(row))) {
                            this.$refs.multipleTable.toggleRowSelection(row, true)
                        }
                    })
                })
            })
        },

        /* 查询 / 重置 */
        handleQuery() {
            this.queryParams.pageNum = 1
            this.getList()
        },
        resetQuery() {
            this.queryParams = this.$options.data().queryParams
            this.selectedRows.clear()
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            this.handleQuery()
        },

        /* tab 切换 */
        handleTabClick() {
            this.selectedRows.clear()
            this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
            this.queryParams.pageNum = 1
            this.getList()
        },

        /* 其他按钮示例（空实现） */
        plReceive(row) {
            // 关键修复：排除鼠标点击事件（避免批量按钮误传事件对象）
            if (row && row.type === 'click') {
                row = null; // 点击批量按钮时，清空错误的事件参数
            }

            // 第一步：区分单行还是批量（row存在则为单行，否则取selectedRows中的批量数据）
            let receiveData = [];
            if (row) {
                // 单行接收：直接传入当前行
                receiveData = [row];
            } else {
                // 批量接收：获取selectedRows中的所有选中数据
                receiveData = Array.from(this.selectedRows.values());
                // 批量校验：至少选择一条数据
                if (receiveData.length === 0) {
                    return this.$message.warning('请至少勾选一条数据进行批量接收');
                }
            }
            console.log(receiveData, '1111111')
            const idList = receiveData.map(r => r.samplingPlanSampleId)
            // 第二步：调用接收接口（根据接口是否支持批量调整）
            jieshou(idList).then((res) => {
                if (res.code === 200) { // 按实际接口成功状态码调整
                    this.$message.success(row ? '单行接收成功' : '批量接收成功');
                    // 第三步：清除已接收数据的选中状态
                    receiveData.forEach(item => {
                        this.selectedRows.delete(this.getRowKeys(item));
                    });
                    // 第四步：刷新列表
                    this.getList();
                } else {
                    this.$message.error(res.msg || '接收失败，请重试');
                }
            }).catch(error => {
                console.error('接收接口调用失败：', error);
                this.$message.error('接收失败，请联系技术人员');
            });
        },
        dyyl() {
            if (!this.selectedRows.size) return this.$message.warning('请先勾选数据')
            // 业务过滤示例
            const list = Array.from(this.selectedRows.values()).filter(r => r.type === '1' && r.sampleNo)
            console.log(list,'1111111')
            //if (!list.length) return this.$message.error('没有可打印的已接收饲料样品')
            // window.open(`/test?printData=${encodeURIComponent(JSON.stringify(list))}`, '_blank')
        },
        handlePreview() {
            this.previewUrl = 'https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525~'
            this.previewDialogVisible = true
        },
        handleExport() {
            this.download('/labtest/sampleReceive/export', { ...this.queryParams }, `sampleReceive_${Date.now()}.xlsx`)
        },
        handleUpdate(row) {
            this.currentEditIndex = this.sampleReceiveList.findIndex(
                r => r.samplingPlanSampleId === row.samplingPlanSampleId
            )
            this.editForm.invbillName = row.invbillName
            this.editForm.itemNames = row.itemNames
            console.log(this.editForm.invbillName,'111')
            this.materialQueryParams.invbillName = this.editForm.invbillName
            getinvbilllist(this.materialQueryParams).then(res => {
                if (res.code === 200) {
                    console.log(res.rows[0].sapCode,'1111111')
                    this.currentInvbillCode = res.rows[0].sapCode
                }else{
                    this.$message.error(res.msg || '查询物料失败，请重试')
                }
            })
            this.dialogVisible = true
            if(this.activeTab === '1'){
                this.title = '修改'
            }else{
                this.title = '详情'
            }
        },
        // 物料详情
        showMaterialDetail() {
            this.getMaterialList()

            this.detailMaterialVisible = true
        },

        // 检测项目详情
        showItemDetail() {
            console.log(this.currentInvbillCode,'1111111')
            if (!this.currentInvbillCode) {
                this.$message.warning('请先选择物料！')
                return
            }
            this.getTestItemList()
            this.detailItemVisible = true
        }
    }
}
</script>