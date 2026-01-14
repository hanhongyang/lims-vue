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
                    <el-button @click="saveForm" size="mini" type="primary" :loading="saving">
                        确认
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
                         
                    </div>
                    <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading">

                        <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop"
                             :label="column.label" :width="column.width" align="center">
                            <template slot-scope="scope">
                                <span
                                    v-if="column.prop === 'deptName' || column.prop === 'sampleNo' || column.prop === 'sampleName'">
                                    {{ scope.row[column.prop] }}
                                </span>
                                <el-input v-else v-model="scope.row[column.prop]"
                                    :class="getInputClass(scope.row[column.prop])" />
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-form>
        </div>
        <el-dialog title="Excel预览" :visible.sync="excelPreviewVisible" width="80%" top="5vh"  
            :close-on-click-modal="true" :close-on-press-escape="true" @closed="handlePreviewClose">
            <div style="height: 70vh; overflow: auto;">
                <div v-html="previewHtml" v-loading="previewLoading"></div>
            </div>
            <div slot="footer">
                <el-button @click="excelPreviewVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

import { getBaseByResultNo, examinePcrResult, savePcrResultInfoList } from "@/api/CentralLaboratory/sampleTest";
import { previewExcel, downloadFile } from "@/api/common/common";
export default {

    name: "pcrTaskInfo",
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
            saving: false, // 保存按钮loading状态
            blTemplateType: null
        };
    },
    computed: {
        // 计算表格列配置 (已修改)
        tableColumns() {
            // (!! 修改 !!) 使用 form 中的数据，而不是 $route.query
            const pcrType = this.form.pcrTaskItemType;

            const itemConfigs = {
                '4': ['金黄色葡萄球菌'],
                '5': ['牛冠状病毒', '牛轮状病毒', '隐孢子虫', '肠毒素型细菌-大肠杆菌'],
                '6': ['牛冠状病毒', '牛病毒性腹泻病毒', '牛呼吸道合胞体病毒', '牛副流感病毒3型', '牛支原体', '溶血性曼氏杆菌', '多杀巴斯德杆菌'],
                // '7' 将在下面动态处理
                '8': ['牛支原体'],
                '9': ['无乳链球菌']
            };

            const columns = [
                // { prop: 'tqsjh', label: '提取试剂盒批号', width: 180 },
                // { prop: 'kzsjh', label: '扩增试剂盒批号', width: 180 },
                { prop: 'deptName', label: '所属牧场', width: 200 },
                { prop: 'sampleNo', label: '样品编号', width: 180 },
                { prop: 'sampleName', label: '样品名称', width: 180 },
            ];

            // --- (!! 新增：动态处理 Type 7 !!) ---
            let items = [];
            if (pcrType === '7') {
                // 从 form 中读取 blTemplateType (在 getResultInfo 中设置)
                const blTemplateType = this.form.blTemplateType || '2'; // 默认为英文 '2'
                if (blTemplateType === '1') { // 中文
                    items = ['β-内酰胺酶抗性基因', '无乳链球菌', '绿脓杆菌', '克雷伯氏菌属', '停乳链球菌', '金黄色葡萄球菌', '大肠杆菌', '牛支原体'];
                } else { // 英文
                    items = ['绿脓杆菌', '无乳链球菌', 'β-内酰胺酶抗性基因', '停乳链球菌', '克雷伯氏菌属', '牛支原体', '大肠杆菌', '金黄色葡萄球菌'];
                }
            } else {
                items = itemConfigs[pcrType] || [];
            }
            // --- 结束新增 ---

            items.forEach(item => {
                columns.push({
                    prop: item,
                    label: item,
                    width: 80
                });
            });
            //columns.push({ prop: 'remark', label: '审核异议', width: 180 });
            columns.push({ prop: 'tqsjh', label: '提取试剂盒批号', width: 180 });
            columns.push({ prop: 'kzsjh', label: '扩增试剂盒批号', width: 180 });
            return columns;
        },

        // 计算表格数据 (已修改)
        tableData() {
            if (!this.originalData || !this.originalData.length) {
                return [];
            }

            // 使用 this.originalData 处理数据
            const groupedData = {};
            this.originalData
                // .sort((a, b) => (a.sequence || 0) - (b.sequence || 0)) // 排序逻辑移到后端SQL
                .forEach(item => {
                    if (!groupedData[item.sampleNo]) {
                        groupedData[item.sampleNo] = {
                            tqsjh: item.tqsjh,
                            kzsjh: item.kzsjh,
                            deptName: item.deptName,
                            sampleNo: item.sampleNo,
                            sampleName: item.sampleName
                            // *** ADDED HERE: Include remark in grouped data ***
                            //remark: item.remark
                        };
                    }
                    // 将检测结果添加到对应的项目列
                    groupedData[item.sampleNo][item.itemName] = item.testResult;
                });

            return Object.values(groupedData);
        }
    },
    created() {
        // 初始化数据
        this.getResultInfo();
    },
    methods: {
        getInputClass(val) {
            if (val == '+++') return 'input-positive-3';
            if (val == '++') return 'input-positive-2';
            if (val == '+') return 'input-positive-1';
            if (val == '-') return 'input-negative';
            return '';
        },
        /** 返回上一页 */
        goBack() {
            // 返回上一路由并关闭当前标签
            // 注意：您可能需要导入 router 实例, 例如: import router from '@/router';
            this.$router.go(-1); // 使用 this.$router
            this.$tab.closePage();
        },
        getResultClass(result) {
            if (!result) return 'unknown-result';
            // 先匹配最长前缀，避免 +++ 被当成 +
            if (result.startsWith('+++')) return 'positive-result-3';
            if (result.startsWith('++')) return 'positive-result-2';
            if (result.startsWith('+')) return 'positive-result-1';
            if (result === '-') return 'negative-result';
            return 'unknown-result';
        },
        getResultInfo() {
            const resultNo = this.$route.query.resultNo;
            // (!! 修改 !!) 优先从路由获取，因为路由可能更新了
            const pcrTaskItemType = this.$route.query.pcrTaskItemType;
            const blTemplateType = this.$route.query.blTemplateType; // 从路由获取

            console.log("Fetching data for resultNo:", resultNo);
            getBaseByResultNo(resultNo).then(response => {
                if (response.code === 200 && response.data) {

                    this.originalData = response.data;

                    // (!! 修改 !!) 设置表单数据
                    this.form = {
                        ...this.form,
                        pcrTaskItemType: pcrTaskItemType, // 使用路由的
                        opJczxPcrResultInfoList: response.data,
                        // (!! 修改 !!) 优先使用路由的，其次是API返回的，最后是默认 '2'
                        blTemplateType: blTemplateType || response.data[0]?.blTemplateType || '2',
                        fileId: response.data[0]?.fileId || ''
                    };
                } else {
                    this.$modal.msgError("获取数据失败");
                }
            }).catch(error => {
                console.error("获取数据失败:", error);
                this.$modal.msgError("获取数据失败");
            });

        },
        previewExcel(fileId) {
            if (!fileId) {
                this.$modal.msgWarning("文件不存在");
                return;
            }

            this.currentFileId = fileId;
            this.previewLoading = true;
            this.excelPreviewVisible = true;

            // 调用API获取HTML内容
            previewExcel(fileId).then(response => {
                this.previewHtml = response;
                this.previewLoading = false;
            }).catch(error => {
                console.error('预览失败:', error);
                this.previewLoading = false;
                this.$modal.msgError("预览失败: " + error.message);
                this.excelPreviewVisible = false;
            });
        },

        handlePreviewClose() {
            this.previewHtml = '';
            this.currentFileId = '';
            this.previewLoading = false;
        },


        // 完善下载文件方法
        downloadFile(fileId) {
            if (!fileId) {
                this.$modal.msgWarning("文件不存在");
                return;
            }

            // 显示下载中提示
            const loading = this.$loading({
                lock: true,
                text: '文件下载中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            downloadFile(fileId).then(response => {
                // 若依框架返回的response是已经处理过的，直接使用blob数据
                console.log('下载响应:', response);

                // 创建Blob对象
                const blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                // 创建下载链接
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;

                // 设置文件名 - 从form中获取原始文件名或使用默认名
                let filename = 'excel-file.xlsx';
                if (this.form.fileId === fileId) {
                    // 如果有文件信息，可以在这里设置更具体的文件名
                    // 假设 this.form.resultNo 存在 (如果不存在，需要从路由或其他地方获取)
                    const resultNo = this.$route.query.resultNo;
                    filename = `PCR结果_${resultNo || '文件'}.xlsx`;
                }

                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 释放URL对象
                window.URL.revokeObjectURL(downloadUrl);

                loading.close();
                this.$modal.msgSuccess("文件下载成功");

            }).catch(error => {
                console.error('下载失败:', error);
                loading.close();
                this.$modal.msgError("文件下载失败: " + (error.message || '请检查网络连接'));
            });
        },
        saveForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    const infoList = [];

                    // 遍历表格数据，更新原始数据中的testResult
                    this.tableData.forEach(tableRow => {
                        this.tableColumns.forEach(column => {
                            // 找到对应的原始数据记录
                            // 使用 find 查找时，确保比较的是原始数据中的 itemName
                            const originalItem = this.originalData.find(
                                item => item.sampleNo === tableRow.sampleNo && item.itemName === column.label
                            );
                            if (originalItem) {
                                // 只更新检测结果列，跳过只读列
                                if (column.prop !== 'tqsjh' && column.prop !== 'kzsjh' && column.prop !== 'deptName'
                                    && column.prop !== 'sampleNo' && column.prop !== 'sampleName') {
                                    // 更新检测结果 (使用 column.prop 而不是 column.label)
                                    originalItem.testResult = tableRow[column.prop];
                                }
                                // 确保所有修改过的 originalItem 都被加入列表（去重）
                                if (!infoList.some(li => li === originalItem)) {
                                    infoList.push(originalItem);
                                }
                            }

                            // 处理 tqsjh 和 kzsjh (单独处理，避免重复添加)
                            if (column.prop === 'tqsjh' || column.prop === 'kzsjh') {
                                this.originalData
                                    .filter(item => item.sampleNo === tableRow.sampleNo)
                                    .forEach(itemToUpdate => {
                                        itemToUpdate[column.prop] = tableRow[column.prop];
                                        // 确保更新后的 item 加入列表 (去重)
                                        if (!infoList.some(li => li === itemToUpdate)) {
                                            infoList.push(itemToUpdate);
                                        }
                                    });
                            }
                            // Remark 列是只读的，不需要处理
                        });
                    });

                    this.form.opJczxPcrResultInfoList = infoList;
                    this.saving = true; // 开始保存，设置保存按钮loading状态
                    // 调用保存接口
                    // 构建最终的请求体
                    const resultNo = this.$route.query.resultNo;
                    const finalPayload = {
                        testItem: this.form.opJczxPcrResultInfoList,
                        resultNo: resultNo
                    };
                    savePcrResultInfoList(finalPayload).then(response => {
                        this.$modal.msgSuccess('保存成功');
                        this.$tab.closePage();
                        this.saving = false; // 保存完成后取消保存按钮loading状态
                        this.getResultInfo(); // 重新加载数据
                    }).catch(error => {
                        console.error('保存失败:', error);
                        this.saving = false; // 保存失败后取消保存按钮loading状态
                        this.$modal.msgError("保存失败: " + (error.message || '请检查网络连接'));
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },

        examine() {
            // 这个页面是修改，不是审核，examine 逻辑可能不适用
            // const entrustOrderNo = this.$route.query.entrustOrderNo; // 如果是从 index1 跳转过来
            const resultNo = this.$route.query.resultNo; // 如果是从 index2 跳转过来
            // 确认审核接口需要哪个参数
            // examinePcrResult({ entrustOrderNo }).then(response => {
            // examinePcrResult({ resultNo }).then(response => { // 假设接口使用 resultNo
            // this.$modal.msgSuccess("审核成功");
            // this.getResultInfo();
            // });
            this.$modal.msgWarning("审核功能请在列表页操作");
        }

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

/* 使物料输入框整体可点击 */
.el-input.readonly-input {
    cursor: pointer;
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

/* 一个 + */
.positive-result-1 {
    color: #f56c6c;
    font-weight: bold;
}

/* 两个 + */
.positive-result-2 {
    color: #ff0000;
    font-weight: bold;
    font-size: 15px;
}

/* 三个 + */
.positive-result-3 {
    color: #990000;
    font-weight: bold;
    font-size: 16px;
    text-shadow: 0 0 1px #990000;
}

.negative-result {
    color: #67c23a;
    font-weight: bold;
}

.unknown-result {
    color: #909399;
}

/* 1. 单个加号 (+)：背景黄色，字体黑色 */
::v-deep .input-positive-1 .el-input__inner {
    background-color: #FFFF00 !important; /* 纯黄背景 */
    color: #000000 !important;            /* 黑色字体 */
    border: 1px solid #d4d400;            /* 边框稍微深一点的黄色 */
}

/* 2. 两个加号 (++)：背景棕色，字体白色 (特殊要求) */
::v-deep .input-positive-2 .el-input__inner {
    background-color: #8B4513 !important; /* 棕色 (SaddleBrown) */
    color: #FFFFFF !important;            /* 白色字体 */
    border: 1px solid #8B4513;
}

/* 3. 三个加号 (+++)：背景红色，字体黑色 */
::v-deep .input-positive-3 .el-input__inner {
    background-color: #FF0000 !important; /* 红色背景 */
    color: #000000 !important;            /* 黑色字体 */
    border: 1px solid #FF0000;
}

/* 4. 阴性 (-)：保持清晰，或者您可以自定义 */
::v-deep .input-negative .el-input__inner {
    background-color: #ffffff !important;
    color: #606266 !important;            /* 标准字体颜色 */
    font-weight: bold;
}
</style>