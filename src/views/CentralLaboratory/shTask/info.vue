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

                <el-card class="test-config-card" v-for="table in groupedTables" :key="table.type"
                    style="margin-bottom: 20px;">
                    <div slot="header" class="clearfix">
                        <span>{{ table.title }}</span>
                        <el-tag v-if="table.data.length" type="info" style="float: right;">
                            共 {{ table.data.length }} 条记录
                        </el-tag>
                    </div>

                    <el-table :data="table.data" border stripe style="width: 100%" v-loading="loading">

                        <el-table-column v-for="column in table.columns" :key="column.prop" :prop="column.prop"
                            :label="column.label" :width="column.width" align="center">

                            <template slot-scope="scope">
                                <span v-if="!column.editable">
                                    {{ scope.row[column.prop] }}
                                </span>

                                <el-input v-else v-model="scope.row[column.prop]" size="mini" placeholder="请输入...">
                                </el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-empty v-if="!groupedTables.length && !loading" description="暂无检测数据"></el-empty>

            </el-form>
        </div>



    </div>
</template>

<script>

import { getBloodBaseByResultNo, saveBloodResultInfoList } from "@/api/CentralLaboratory/sampleTest";
export default {

    name: "bloodTaskInfo",
    dicts: ['blood_result_status', 'blood_task_item_type'],
    data() {
        return {
            form: {
                // fileId: '', // fileId 将在 getResultInfo 中设置
            },
            allSampleData: [], // 存储从API获取的原始扁平数组，用于保存
            //groupedTables: [], // 存储按项目分组后的数据，用于UI渲染
            loading: false, // 表格loading状态
            saving: false, // 保存按钮loading状态

            // 动态列配置
            itemConfigs: {
                '0': [
                    { prop: 'aypxj', label: 'A型口蹄疫样品效价' },
                    { prop: 'atestResult', label: 'A型口蹄疫结果判定' },
                    { prop: 'oypxj', label: 'O型口蹄疫样品效价' },
                    { prop: 'otestResult', label: 'O型口蹄疫结果判定' },
                ],
                '1': [],
                '2': [
                    { prop: 'testResult', label: '结果判定' }
                ],
                '3': [],
                '4': [],
                '5': [],
                '6': [
                    { prop: 'sp', label: 'S/P值' },
                    { prop: 'testResult', label: '结果判定' }
                ],
                '7': [],
                '8': [
                    { prop: 'shZdb', label: '总蛋白' },
                    { prop: 'shTlz', label: '铜离子' },
                    { prop: 'shTielz', label: '铁离子' },
                    { prop: 'shXlz', label: '锌离子' },
                    { prop: 'shGysz', label: '甘油三酯' },
                    { prop: 'shQds', label: 'β-羟丁酸' },
                    { prop: 'shFzhx', label: '非酯化性脂肪酸' },
                    { prop: 'shPpt', label: '葡萄糖' },
                    { prop: 'shXynsd', label: '血液尿素氮' },
                    { prop: 'shGczam', label: '谷草转氨酶' },
                    { prop: 'shGbzam', label: '谷丙转氨酶' },
                    { prop: 'shBdb', label: '白蛋白' },
                    { prop: 'shJxlsm', label: '碱性磷酸酶' },
                    { prop: 'shZg', label: '总钙' },
                    { prop: 'shLzg', label: '离子钙' },
                    { prop: 'shMlz', label: '镁离子' },
                    { prop: 'shWjl', label: '无机磷' },
                    { prop: 'shJlz', label: '钾离子' },
                    { prop: 'shNlz', label: '钠离子' },
                    { prop: 'shLlz', label: '氯离子' },
                ],
                '9': [
                    { prop: 'importCowNo', label: '导入牛号' },
                    { prop: 'od', label: 'BioPRYN OD' },
                    { prop: 'zaoyunTestResult', label: '结果' },
                    { prop: 'testRemark', label: '备注' },
                ]
            }
        };
    },
    computed: {
        // ** 新增 groupedTables 计算属性 **
        groupedTables() {
            if (!this.allSampleData || this.allSampleData.length === 0 || !this.dict.type.blood_task_item_type || this.dict.type.blood_task_item_type.length === 0) {
                return []; // 如果数据或字典未就绪，返回空数组
            }

            // 1. 按 bloodTaskItemType 分组
            const groups = {};
            this.allSampleData.forEach(sample => {
                const type = this.$route.query.bloodTaskItemType;
                if (!groups[type]) {
                    groups[type] = [];
                }
                groups[type].push(sample);
            });

            // 2. 构造成 groupedTables (用于 v-for 渲染)
            return Object.keys(groups).map(type => {
                // 从字典中查找项目名称
                const dictItem = this.dict.type.blood_task_item_type.find(d => d.value === type);
                const title = dictItem ? dictItem.label : `未知项目 (${type})`;
                console.log('dictItem:', this.dict.type.blood_task_item_type);
                const groupData = groups[type]; // [!code ++] // 获取当前分组的数据
                return {
                    type: type,
                    title: title, // 现在可以在字典加载后正确获取
                    data: groupData, // data 数组中的对象引用自 allSampleData
                    columns: this.getColumnsForType(type, groupData)
                };
            });
        }
    },
    created() {
        // 初始化数据
        this.getResultInfo();
    },
    methods: {

        /** 返回上一页 */
        goBack() {
            // 返回上一路由并关闭当前标签
            this.$router.go(-1);
            this.$tab.closePage();
        },

        /** 获取数据并按项目分组 */
        getResultInfo() {
            this.loading = true;
            const resultNo = this.$route.query.resultNo;

            getBloodBaseByResultNo(resultNo).then(response => {
                if (response.code === 200 && response.data) {

                    // 1. 存储原始扁平数据
                    //    (v-model将直接修改这个数组里的对象)
                    this.allSampleData = response.data;

                } else {
                    this.$modal.msgError("获取数据失败: " + (response.msg || '未知错误'));
                }
            }).catch(error => {
                console.error("获取数据失败:", error);
                this.$modal.msgError("获取数据失败");
            }).finally(() => {
                this.loading = false;
            });
        },

        /** 根据项目类型获取列配置 */
        getColumnsForType(bloodType, data) {
            // 固定的前三列
            const baseColumns = [
                { prop: 'entrustDeptName', label: '委托单位', width: 180, editable: false },
                { prop: 'gh', label: '管号', width: 180, editable: false },
                { prop: 'sampleName', label: '牛号', width: 180, editable: false },
                { prop: 'sampleNo', label: '样品编号', width: 180, editable: false }
            ];

            // 动态的项目特定列 (可编辑)
            const allDynamicColumns = (this.itemConfigs[bloodType] || []).map(col => ({
                ...col,
                editable: true,
                width: 150 // 动态列的默认宽度
            }));

            let filteredDynamicColumns;

            //  关键判断：只对 '8' (生化) 并且有数据时进行过滤，因为生化项目不固定
            if (bloodType === '8' && data && data.length > 0) {
                // (仅对类型 '8' 执行过滤)
                filteredDynamicColumns = allDynamicColumns.filter(column => {
                    // 检查 'data' 数组中是否 *至少有一行* 在 'column.prop' 字段上有值
                    const hasValue = data.some(row => {
                        const value = row[column.prop];
                        // "有值" 定义为：不是 null, 不是 undefined, 也不是空字符串
                        return value !== null && value !== undefined && value !== '';
                    });
                    return hasValue; // 如果有值，保留该列
                });
            } else {
                // 对于其他类型(如 '0', '2', '9'等)，或没有数据时，显示所有配置的列
                filteredDynamicColumns = allDynamicColumns;
            }

            //const remarkColumn = { prop: 'examineNote', label: '审核异议', width: 200, editable: false };
            return [...baseColumns, ...filteredDynamicColumns]; // [!code focus] // 4. 使用过滤后的列
        },

        /** 保存表单 */
        saveForm() {
            this.saving = true;
            // 调用保存接口
            // 构建最终的请求体
            const resultNo = this.$route.query.resultNo;
            const finalPayload = {
                sampleList: this.allSampleData,
                resultNo: resultNo
            };
            // 由于 v-model 的双向绑定，this.allSampleData 
            saveBloodResultInfoList(finalPayload).then(response => {
                if (response.code === 200) {
                    this.$modal.msgSuccess("保存成功");
                    this.$tab.closePage();
                    // 重新加载数据，以防后端有其他更新
                    this.getResultInfo();
                } else {
                    this.$modal.msgError(response.msg || "保存失败");
                }
            }).catch(error => {
                console.error("保存失败:", error);
                this.$modal.msgError("保存失败");
            }).finally(() => {
                this.saving = false;
            });
        },

        /** (假设) Excel 预览关闭句柄 */
        handlePreviewClose() {
            this.previewHtml = '';
        }
    }
};
</script>

<style scoped>
/* (您的样式保持不变) */
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
</style>