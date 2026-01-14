<template>
    <div class="app-container">
        <div class="aboustform">
            <div class="form-data-header" style="margin-bottom: 0; padding: 0">
                <div class="form-data-header-title" @click="goBack">
                    <i class="el-icon-back"></i>
                    返回
                    <span></span>
                </div>
                <div class="form-data-header-content"></div>
                <div class="form-data-header-tools">
                    <el-button @click="handlePass" size="mini" type="success" :loading="saving">
                        通过
                    </el-button>
                    <el-button @click="handleFail" size="mini" type="danger" :loading="saving">
                        不通过
                    </el-button>

                </div>
            </div>
        </div>

        <div style="padding-top: 40px">
            <el-form ref="form" :model="form" label-width="120px">
                <el-card class="test-config-card">
                    <div slot="header" class="clearfix">
                        <dict-tag v-if="dict.type.pcr_task_item_type && dict.type.pcr_task_item_type.length > 0"
                            :options="dict.type.pcr_task_item_type" :value="form.pcrTaskItemType" />
                        <el-tag v-if="tableData.length" type="info" style="float: right;">
                            共 {{ tableData.length }} 条记录
                        </el-tag>
                        <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading"
                            :row-class-name="tableRowClassName" max-height="calc(100vh - 280px)"
                            :header-cell-style="{ background: '#f8f9fa' }">
                            <!-- 第一列：所属牧场（固定） -->
                            <el-table-column prop="deptName" label="所属牧场" width="200" fixed="left" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.deptName }}</span>
                                </template>
                            </el-table-column>
                            <!-- 第二列：样品描述（固定） -->
                            <el-table-column prop="sampleNo" label="样品描述" width="180" fixed="left" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.sampleNo }}</span>
                                </template>
                            </el-table-column>
                            <!-- 后续列循环渲染（不包含前两列） -->
                            <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop"
                                :label="column.label" :width="column.width" align="center">
                                <template slot-scope="scope">
                                    <el-input v-if="column.isRemark" v-model="sampleRemarks[scope.row.sampleNo]"
                                        placeholder="请输入异议"
                                        @input="$set(sampleRemarks, scope.row.sampleNo, $event); $forceUpdate()" />
                                    <span v-else :class="column.isResult ? getResultClass(scope.row[column.prop]) : ''">
                                        {{ scope.row[column.prop] }}
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>

                </el-card>
            </el-form>
        </div>
        <!--<el-dialog title="Excel预览" :visible.sync="excelPreviewVisible" width="80%" top="5vh"
            :close-on-click-modal="true" :close-on-press-escape="true" @closed="handlePreviewClose">
            <div style="height: 70vh; overflow: auto;">
                <div v-html="previewHtml" v-loading="previewLoading"></div>
                </div>
            <div slot="footer">
                <el-button @click="excelPreviewVisible = false">关闭</el-button>
                </div>
            </el-dialog>-->

    </div>
</template>

<script>
// 导入 router
import router from '@/router';
// 注意: examinePcrResult 已重命名为 examinePcrResultBase
import { getBaseByResultNo, examinePcrResultBase, savePcrResultInfoList } from "@/api/CentralLaboratory/sampleTest";
import { previewExcel, downloadFile } from "@/api/common/common";
export default {

    name: "pcrResultInfo",
    dicts: ['pcr_result_status', 'pcr_task_item_type'],
    data() {

        return {
            form: {
                pcrTaskItemType: '', // 项目
                opJczxPcrResultInfoList: [], // 存储检测项目数据
            },
            originalData: [],
            excelPreviewVisible: false,
            previewLoading: false,
            previewHtml: '', // 用于存储预览的HTML内容
            currentFileId: '',
            loading: false, // 表格loading状态
            saving: false, // 保存/审核按钮loading状态
            sampleRemarks: {}, // 用于存储和编辑审核异议
        };
    },
    computed: {
        tableColumns() {
            // ... (保持不变)
            const pcrType = this.$route.query.pcrTaskItemType;
            const blTemplateType = this.$route.query.blTemplateType || '2'; // 默认为 '2'
            console.log('blTemplateType:', blTemplateType);
            const itemConfigs = {
                '4': ['金黄色葡萄球菌'],
                '5': ['牛冠状病毒', '牛轮状病毒', '隐孢子虫', '肠毒素型细菌-大肠杆菌'],
                '6': ['牛冠状病毒', '牛病毒性腹泻病毒', '牛呼吸道合胞体病毒', '牛副流感病毒3型', '牛支原体', '溶血性曼氏杆菌', '多杀巴斯德杆菌'],
                // '7' 将在下面动态处理，这里的 '7' 可以移除或保留为默认
                // '7': [...],
                '8': ['牛支原体'],
                '9': ['无乳链球菌']
            };

            const columns = [
                // { prop: 'tqsjh', label: '提取试剂盒批号', width: 180 },
                // { prop: 'kzsjh', label: '扩增试剂盒批号', width: 180 },
                // { prop: 'deptName', label: '所属牧场', width: 200, fixed: true },
                // { prop: 'sampleNo', label: '样品描述', width: 180, fixed: true }
            ];

            let items = [];
            if (pcrType === '7') {
                if (blTemplateType === '1') { // 中文
                    items = ['β-内酰胺酶抗性基因', '无乳链球菌', '绿脓杆菌', '克雷伯氏菌属', '停乳链球菌', '金黄色葡萄球菌', '大肠杆菌', '牛支原体'];
                } else { // 英文 (默认)
                    items = ['绿脓杆菌', '无乳链球菌', 'β-内酰胺酶抗性基因', '停乳链球菌', '克雷伯氏菌属', '牛支原体', '大肠杆菌', '金黄色葡萄球菌'];
                }
            } else {
                items = itemConfigs[pcrType] || [];
            }
            /* 计算单列宽度 */
            // const MIN_AUDIT_WIDTH = 200;               // 异议列固定宽度
            // const FIXED_TOTAL = 200 + 200 + 180 + MIN_AUDIT_WIDTH; // 固定列总和
            // const availWidth = (window.innerWidth - 30 - FIXED_TOTAL); // 30 留一点滚动条/边距容错
            // const singleWidth = Math.max(0, Math.floor(availWidth / items.length)); // 最小 90

            items.forEach(item => {
                columns.push({
                    prop: item,
                    label: item,
                    width: 140,
                    isResult: true
                });
            });

            // 审核异议列（可编辑）
            columns.push({
                prop: 'auditRemark',
                label: '审核异议',
                width: 200,
                isRemark: true,
                align: 'center',
                cellStyle: () => ({ paddingRight: '15px' }) // 增加右侧内边距
            });

            return columns;
        },

        // 计算表格数据 (已修改，确保最终顺序正确)
        tableData() {
            if (!this.originalData || !this.originalData.length) {
                return [];
            }

            const groupedData = {};
            const orderedSampleNos = []; // 用于存储排序后的样本编号

            // 1. 先对原始数据进行排序，确保处理顺序正确
            const sortedOriginalData = this.originalData
                .slice() // 复制数组以避免修改原数组
                .sort((a, b) => {
                    // 将 sequence 转换为数字，非数字/null/undefined 默认为 9999 (保证排在实际样本之后)
                    const seqA = parseInt(a.sequence) || (a.sequence === null || a.sequence === undefined || a.sequence === '' ? 9999 : 0);
                    const seqB = parseInt(b.sequence) || (b.sequence === null || b.sequence === undefined || b.sequence === '' ? 9999 : 0);

                    // 默认按 sequence 排序
                    if (seqA !== seqB) {
                        return seqA - seqB;
                    }

                    // sequence 相同时，按 sortOrder 排序 (如果 sortOrder 有定义)
                    const sortA = parseInt(a.sortOrder) || 0;
                    const sortB = parseInt(b.sortOrder) || 0;
                    if (sortA !== sortB) {
                        return sortA - sortB;
                    }

                    // sortOrder 也相同时，按 sampleNo 排序 (确保稳定性)
                    return String(a.sampleNo).localeCompare(String(b.sampleNo));
                });


            // 2. 分组，并收集样本编号的顺序
            sortedOriginalData.forEach(item => {
                const sampleNo = item.sampleNo;
                const itemKey = item.itemName;

                if (!groupedData[sampleNo]) {
                    // 确保 sequence 字段被添加到分组对象中，用于最终排序时的稳定性检查
                    const rowSequence = parseInt(item.sequence) || (item.sequence === null || item.sequence === undefined || item.sequence === '' ? 9999 : 0);

                    groupedData[sampleNo] = {
                        tqsjh: item.tqsjh,
                        kzsjh: item.kzsjh,
                        deptName: item.deptName,
                        sampleNo: sampleNo,
                        // 使用正确的 sequence 值，不再引用不存在的 seqA
                        sequence: rowSequence,
                        // 确保备注也使用响应式数据
                        auditRemark: this.sampleRemarks[sampleNo] || item.remark || '',
                        itemInfoList: []
                    };
                    // 收集样本编号（只有第一次出现时添加）
                    orderedSampleNos.push(sampleNo);
                }

                groupedData[sampleNo].itemInfoList.push({
                    opPcrEntrustOrderItemId: item.opPcrEntrustOrderItemId,
                    itemName: item.itemName,
                });

                groupedData[sampleNo][itemKey] = item.testResult;
            });

            // 3. 按照收集到的样本编号顺序生成最终数组
            // 注意：由于我们在步骤 1 已经对原始数据进行了强排序，
            // 并且 orderedSampleNos 是按照这个顺序生成的，Object.values() 不再是必要的风险，
            // 但为了确保万无一失，我们继续使用 map/filter 来保证顺序。
            const finalTableData = orderedSampleNos
                .map(sampleNo => groupedData[sampleNo]);

            // 最终返回之前，可以再次对 finalTableData 进行一次排序，以覆盖可能存在的迭代顺序问题
            return finalTableData.sort((a, b) => {
                if (a.sequence !== b.sequence) {
                    return a.sequence - b.sequence;
                }
                return String(a.sampleNo).localeCompare(String(b.sampleNo));
            });
        }
    },
    created() {
        this.getResultInfo();
    },
    methods: {
        /** 返回上一页 */
        goBack() {
            router.go(-1);
            this.$tab.closePage();
        },

        // tableRowClassName() 保持不变 ...
        tableRowClassName({ row, rowIndex }) {
            const remark = this.sampleRemarks[row.sampleNo];
            if (remark && remark.trim().length > 0) {
                return 'objection-row';
            }
            return '';
        },

        // getResultClass() 保持不变 ...
        getResultClass(result) {
            if (result == '+++') return 'result-btn result-danger';
            if (result == '++') return 'result-btn result-deep';
            if (result == '+') return 'result-btn result-yellow';
            return '';
        },

        getResultInfo() {
            const resultNo = this.$route.query.resultNo;
            const pcrTaskItemType = this.$route.query.pcrTaskItemType;
            const blTemplateType = this.$route.query.blTemplateType;
            this.loading = true;
            getBaseByResultNo(resultNo).then(response => {
                this.loading = false;
                if (response.code === 200 && response.data) {
                    this.originalData = response.data;
                    const remarks = {};
                    this.originalData.forEach(item => {
                        if (item.remark) {
                            // 使用 $set 确保响应性
                            this.$set(remarks, item.sampleNo, item.remark);
                        }
                    });
                    this.sampleRemarks = remarks;

                    this.form = {
                        ...this.form,
                        pcrTaskItemType: pcrTaskItemType,
                        blTemplateType: blTemplateType || response.data[0]?.blTemplateType || '2',
                        opJczxPcrResultInfoList: response.data,
                        fileId: response.data[0]?.fileId || ''
                    };
                } else {
                    this.$modal.msgError("获取数据失败");
                }
            }).catch(error => {
                this.loading = false;
                console.error("获取数据失败:", error);
                this.$modal.msgError("获取数据失败");
            });
        },

        submitAudit(examinePassFlag) {
            this.saving = true;
            const auditPayloadList = []; // 重命名以区分
            const resultNo = this.$route.query.resultNo;

            this.tableData.forEach(tableRow => {
                const rowRemark = this.sampleRemarks[tableRow.sampleNo] || '';
                // 遍历该 sampleNo 下所有 item，生成提交 payload
                tableRow.itemInfoList.forEach(item => {
                    auditPayloadList.push({
                        opPcrEntrustOrderItemId: item.opPcrEntrustOrderItemId,
                        sampleNo: tableRow.sampleNo,
                        remark: rowRemark
                    });
                });
            });

            if (auditPayloadList.length === 0) {
                this.$modal.msgWarning("无可提交的审核项目");
                this.saving = false;
                return;
            }

            // 构建最终的请求体
            const finalPayload = {
                testItem: auditPayloadList, // 原始的列表
                examinePassFlag: examinePassFlag, // 新增的标志
                resultNo: resultNo
            };

            // 调用审核接口 examinePcrResultBase，传递新的 payload 结构
            examinePcrResultBase(finalPayload).then(response => {
                this.saving = false;
                if (response.code === 200) {
                    const action = examinePassFlag === 1 ? '通过' : '不通过';
                    this.$modal.msgSuccess(`审核操作 (${action}) 成功`);
                    this.goBack(); // 操作成功后返回
                } else {
                    this.$modal.msgError("审核失败: " + response.msg);
                }
            }).catch(error => {
                this.saving = false;
                this.$modal.msgError("审核失败: " + (error.msg || '请检查网络连接'));
            });
        },

        // *** ADDED handlePass method ***
        handlePass() {
            this.$modal.confirm('确认审核通过吗？').then(() => {
                this.submitAudit(1); // 传递 1 表示通过
            }).catch(() => { }); // 用户取消则不执行任何操作
        },

        // *** ADDED handleFail method ***
        handleFail() {
            this.$modal.confirm('确认审核不通过吗？').then(() => {
                this.submitAudit(0); // 传递 0 表示不通过
            }).catch(() => { }); // 用户取消则不执行任何操作
        },
    }
};
</script>
<style scoped>
/* ... 样式保持不变 ... */
.app-container {
    padding: 20px;
}

/* 基本信息卡片样式 - 保持不变 */
.basic-info-card {
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


/* 检测项目配置卡片样式 */
.test-config-card {
    border-radius: 4px;
    border: 1px solid #e6ebf5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-top: 20px;
}

/* 检测结果样式 */
.positive-result {
    color: #F56C6C;
    font-weight: bold;
}

.negative-result {
    color: #67C23A;
    font-weight: bold;
}

/* 异议行样式 */
:deep(.el-table .objection-row) {
    background: #fef0f0 !important;
    /* light red/pink */
}

/* 表格样式优化 */
:deep(.test-config-card .el-table) {
    margin-top: 10px;
}

:deep(.test-config-card .el-table th) {
    background-color: #f8f9fa;
    color: #333;
    font-weight: 600;
}

:deep(.test-config-card .el-table .cell) {
    padding: 8px 12px;
}

/* Excel预览样式 */
:deep(.excel-preview table) {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

:deep(.excel-preview th),
:deep(.excel-preview td) {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

:deep(.excel-preview th) {
    background-color: #f2f2f2;
    font-weight: bold;
}

:deep(.excel-preview tr:nth-child(even)) {
    background-color: #f9f9f9;
}

:deep(.sheet-title) {
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0 10px 0;
    color: #333;
}

/* 调整表单项间距 - 保持Element UI默认样式 */
.el-form-item {
    margin-bottom: 18px;
}

/* 确保行内元素间距均匀 */
.el-row {
    margin-bottom: 10px;
}

.el-col {
    padding-left: 10px;
    padding-right: 10px;
}

.el-table .el-table__row {
    cursor: pointer;
}

/*添加行高亮显示样式 */
.el-table .el-table__row:hover {
    background-color: #f5f7fa;
}

/* 确保样式正确应用 */
.el-table__body tr {
    cursor: pointer;
}

.el-table__body tr:hover>td {
    background-color: #f5f7fa !important;
}

/* 禁用状态的样式 */
.el-input.is-disabled .el-input__inner {
    cursor: not-allowed;
    background-color: #f5f7fa;
    color: #c0c4cc;
}

/* 卡片标题样式 */
.el-card__header {
    background-color: #f5f7fa;
    border-bottom: 1px solid #e6ebf5;
    padding: 12px 20px;
    font-weight: bold;
}

/* 调整列宽比例 */
.el-col-7 {
    width: 29.1667%;
}

.el-col-5 {
    width: 20.8333%;
}

/* 固定列样式适配 */
:deep(.el-table__fixed) {
    height: 100% !important;
    /* 解决固定列高度不一致问题 */
}

:deep(.el-table__fixed-right) {
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
}

/* 确保表格主体有足够滚动空间 */
:deep(.test-config-card .el-table__body-wrapper) {
    overflow-x: auto;
}

/* 按钮化公共样式 */
.result-btn {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-weight: 600;
    color: #fff;
    line-height: 1;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .15);
}

/* 三个级别背景 */
.result-yellow {
    background: yellow;
    color: black;
}

.result-deep {
    background: darkred;
}

.result-danger {
    background: red;
}
</style>