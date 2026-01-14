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
                    <!-- <el-button @click="examine" size="mini" type="primary"
                        v-hasPermi="['basicdata:jczxPcrReport:verify']" :loading="saving">
                        审核
                    </el-button> -->
                    <el-button @click="pdfbc" size="mini" type="primary" :loading="saving"
                        v-if="status == 0 || status == 1">
                        保存
                    </el-button>
                    <el-button @click="examine" size="mini" type="primary" :loading="saving" v-if="this.isShow">
                        提交
                    </el-button>
                    <el-button @click="pdftg" size="mini" type="primary" v-hasPermi="['basicdata:jczxPcrReport:verify']"
                        :loading="saving" v-if="this.status == 2">
                        审核
                    </el-button>
                    <el-button @click="pdfbtg" size="mini" type="primary"
                        v-hasPermi="['basicdata:jczxPcrReport:verify']" :loading="saving" v-if="this.status == 2">
                        不审核
                    </el-button>
                    <el-button @click="pdfjz" size="mini" type="primary" v-hasPermi="['basicdata:jczxPcrReport:commit']"
                        :loading="saving" v-if="this.status == 3">
                        校准
                    </el-button>
                    <el-button @click="pdfbjz" size="mini" type="primary"
                        v-hasPermi="['basicdata:jczxPcrReport:commit']" :loading="saving" v-if="this.status == 3">
                        不校准
                    </el-button>
                </div>
            </div>
        </div>

        <div style="padding-top: 40px">
            <el-form ref="form" :model="form" label-width="120px">
                <el-card class="test-config-card" v-for="(group, index) in originalData" :key="index"
                    style="margin-bottom: 20px;">
                    <div slot="header" class="clearfix">
                        <dict-tag :options="dict.type.pcr_task_item_type" :value="group.itemType" />
                        <el-tag type="info" style="float: right;">
                            共 {{ group.opPcrEntrustOrderItemList.length }} 条记录
                        </el-tag>
                    </div>

                    <el-table :data="flattenItemList(group.opPcrEntrustOrderItemList)" border stripe style="width: 100%"
                        height="400" :row-class-name="tableRowClassName">
                        <el-table-column v-for="column in getTableColumns(group.itemType)" :key="column.prop"
                            :prop="column.prop" :label="column.label" :width="column.width" align="center">
                            <template slot-scope="scope">
                                <el-input v-if="column.isRemark" v-model="sampleRemarks[scope.row.sampleNo]"
                                    placeholder="请输入异议" @input="$set(sampleRemarks, scope.row.sampleNo, $event)" />
                                <span v-else :class="column.isResult ? getResultClass(scope.row[column.prop]) : ''">
                                    {{ scope.row[column.prop] }}
                                </span>
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
// 导入 router
import router from '@/router';
import { previewExcel, downloadFile } from "@/api/common/common";
import {
    INfo, examinePcrResultBase, Reportpcrbc, zzhhxbc, jzcommit
} from "@/api/CentralLaboratory/jczxPCRReport";
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
            saving: false, // 保存按钮loading状态
            // 新增：用于存储和编辑审核异议，以 sampleNo 为键，实现响应式
            sampleRemarks: {},
            xqlist: [],
            opJczxFeedReportBaseId: '',
            isShow: false
        };
    },
    computed: {
        // // 计算表格列配置 (保持不变)
        // tableColumns() {
        //     const pcrType = this.$route.query.pcrTaskItemType;
        //     const itemConfigs = {
        //         '4': ['金黄色葡萄球菌'],
        //         '5': ['牛冠状病毒', '牛轮状病毒', '隐孢子虫', '肠毒素型细菌-大肠杆菌'],
        //         '6': ['牛冠状病毒', '牛病毒性腹泻病毒', '牛呼吸道合胞体病毒', '牛副流感病毒3型', '牛支原体', '溶血性曼氏杆菌', '多杀巴斯德杆菌'],
        //         '7': ['绿脓杆菌', '无乳链球菌', 'β-内酰胺酶抗性基因', '停乳链球菌', '克雷伯氏菌属', '牛支原体', '大肠杆菌', '金黄色葡萄球菌'],
        //         '8': ['牛支原体'],
        //         '9': ['无乳链球菌']
        //     };

        //     const columns = [
        //         // 固定列：只读显示
        //         { prop: 'tqsjh', label: '提取试剂盒批号', width: 180 },
        //         { prop: 'kzsjh', label: '扩增试剂盒批号', width: 180 },
        //         { prop: 'deptName', label: '所属牧场', width: 200 },
        //         { prop: 'sampleNo', label: '样品编号', width: 180 }
        //     ];

        //     const items = itemConfigs[pcrType] || [];
        //     items.forEach(item => {
        //         columns.push({
        //             prop: item,
        //             label: item,
        //             width: 150,
        //             isResult: true // 标记为结果列
        //         });
        //     });

        //     // 新增：审核异议列（可编辑）
        //     columns.push({
        //         prop: 'auditRemark',
        //         label: '审核异议',
        //         width: 200,
        //         isRemark: true
        //     });

        //     return columns;
        // },

        // 计算表格数据 (已修正，确保使用 opPcrEntrustOrderItemId)
        tableData() {
            if (!this.originalData || !this.originalData.length) {
                return [];
            }

            const groupedData = {};
            this.originalData
                .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                .forEach(item => {
                    const sampleNo = item.sampleNo;
                    const itemKey = item.itemName;

                    if (!groupedData[sampleNo]) {
                        groupedData[sampleNo] = {
                            tqsjh: item.tqsjh,
                            kzsjh: item.kzsjh,
                            deptName: item.deptName,
                            sampleNo: sampleNo,
                            // 从 reactive map 或原始数据中初始化异议
                            auditRemark: this.sampleRemarks[sampleNo] || item.remark || '',
                            // 存储项目 ID 列表用于提交
                            itemInfoList: []
                        };
                    }

                    // 存储该 sampleNo 下所有 item 的 ID (修正为使用正确的字段名)
                    groupedData[sampleNo].itemInfoList.push({
                        opPcrEntrustOrderItemId: item.opPcrEntrustOrderItemId, // 修正后的字段名
                        itemName: item.itemName,
                    });

                    // 设置检测结果
                    groupedData[sampleNo][itemKey] = item.testResult;

                });

            return Object.values(groupedData);
        }
    },
    created() {
        // 初始化数据
        this.getResultInfo();
    },
    mounted() {
        this.status = this.$route.query.status
        this.opJczxFeedReportBaseId = this.$route.query.row.opPcrEntrustOrderId
        console.log(this.$route.query.row, this.opJczxFeedReportBaseId, '传过来的状态')
        // if (this.status == 0) {
        //     // Reportsl(JSON.parse(this.$route.query.feedEntrustOrderSampleId)).then(res => {
        //     //     console.log(res, '888888888888')
        //     //     this.SourText = res.data.feedReportBase.sampleSource
        //     //     this.noteText = res.data.feedReportBase.remark
        //     //     this.displayText = res.data.feedReportBase.conclusion
        //     //     this.feedReportBase = res.data.feedReportBase
        //     //     this.infoList = res.data.opJczxFeedReportInfoList

        //     // });
        // } else {
        //     this.opJczxFeedReportBaseId = JSON.parse(this.$route.query.opJczxFeedReportBaseId)
        //     console.log(JSON.parse(this.$route.query.opJczxFeedReportBaseId), 'aaaaaaaaaaaaaaaaaaaa')
        //     console.log(JSON.parse(this.$route.query.feedEntrustOrderSampleId), 'aaaaaaaaaaaaaaaaaaaa')
        //     // this.opJczxFeedReportBaseId = JSON.stringify(this.$route.query.row.opJczxFeedReportBaseId)
        //     // this.feedEntrustOrderSampleId = JSON.stringify(this.$route.query.row.feedEntrustOrderSampleId)
        //     // console.log(JSON.parse(this.$route.query.row).opJczxFeedReportBaseId, 'qqqqqqqqqqqqqqqqqqqqqq')
        //     // zzhhx(JSON.parse(this.$route.query.opJczxFeedReportBaseId)).then(res => {
        //     //     console.log(res, '999999999999999999')
        //     //     this.SourText = res.data.feedReportBase.sampleSource
        //     //     this.noteText = res.data.feedReportBase.remark
        //     //     this.displayText = res.data.feedReportBase.conclusion
        //     //     this.feedReportBase = res.data.feedReportBase
        //     //     this.infoList = res.data.opJczxFeedReportInfoList
        //     // });
        // }
    },
    methods: {
        pdfbc() {
            const newReportData = {
                ...this.$route.query.row,
                pcrReportInfoList: [...this.xqlist],
                status: '1',
            };
            console.log(newReportData, '新对象')
            Reportpcrbc(newReportData).then(res => {
                console.log(res)
                this.opJczxFeedReportBaseId = res.msg
                if (res.code == 200) {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '保存失败',
                        type: 'error'
                    });
                }
                // zzhhx(res.msg).then(res => {
                //     console.log(res, '999999999999999999')
                //     this.SourText = res.data.feedReportBase.sampleSource
                //     this.noteText = res.data.feedReportBase.remark
                //     this.displayText = res.data.feedReportBase.conclusion
                //     this.feedReportBase = res.data.feedReportBase
                //     this.infoList = res.data.opJczxFeedReportInfoList
                //     this.isShow = true
                // });

            })
        },
        pdfMtj() {
            const newReportData = {
                ...this.$route.query.row,
                pcrReportInfoList: [...this.xqlist],
                status: '2',
            };
            Reportslbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '提交成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '提交失败',
                        type: 'error'
                    });
                }

            })
        },
        pdftg() {
            const newReportData = {
                status: '3',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId
            };
            console.log(newReportData, '审核通过')
            zzhhxbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '通过成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '通过失败',
                        type: 'error'
                    });
                }
            })


        },
        pdfbtg() {
            const newReportData = {
                status: '2',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId
            };
            console.log(newReportData, '审核不通过')
            zzhhxbc(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '不通过成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '不通过失败',
                        type: 'error'
                    });
                }
            })
            // window.close()
        },
        pdfjz() {
            const newReportData = {
                status: '4',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId
            };
            jzcommit(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '校准成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '校准失败',
                        type: 'error'
                    });
                }
            })
            // setTimeout(()=>{
            //     window.close()
            // })

        },
        pdfbjz() {
            const newReportData = {
                status: '3',
                opJczxFeedReportBaseId: this.opJczxFeedReportBaseId
            };
            jzcommit(newReportData).then(res => {
                console.log(res)
                if (res.code == 200) {
                    this.$message({
                        message: '不校准成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        window.close()
                    }, 1000)
                } else {
                    this.$message({
                        message: '不校准失败',
                        type: 'error'
                    });
                }
            })
            // window.close()
        },
        // 展平函数
        flattenItemList(list) {
            const map = {};
            list.forEach(item => {
                const key = item.sampleNo;
                if (!map[key]) {
                    map[key] = {
                        sampleNo: item.sampleNo,
                        tqsjh: item.tqsjh,
                        kzsjh: item.kzsjh,
                        deptName: item.deptName,
                    };
                }
                // 把每个检测项目作为字段
                map[key][item.itemName] = item.testResult;
            });
            return Object.values(map);
        },
        getTableColumns(itemType) {
            const itemConfigs = {
                '4': ['金黄色葡萄球菌'],
                '5': ['牛冠状病毒', '牛轮状病毒', '隐孢子虫', '肠毒素型细菌-大肠杆菌'],
                '6': ['牛冠状病毒', '牛病毒性腹泻病毒', '牛呼吸道合胞体病毒', '牛副流感病毒3型', '牛支原体', '溶血性曼氏杆菌', '多杀巴斯德杆菌'],
                '7': ['绿脓杆菌', '无乳链球菌', 'β-内酰胺酶抗性基因', '停乳链球菌', '克雷伯氏菌属', '牛支原体', '大肠杆菌', '金黄色葡萄球菌'],
                '8': ['牛支原体'],
                '9': ['无乳链球菌']
            };

            const columns = [
                { prop: 'tqsjh', label: '提取试剂盒批号', width: 180 },
                { prop: 'kzsjh', label: '扩增试剂盒批号', width: 180 },
                { prop: 'deptName', label: '所属牧场', width: 200 },
                { prop: 'sampleNo', label: '样品编号', width: 180 }
            ];

            const items = itemConfigs[itemType] || [];
            items.forEach(item => {
                columns.push({
                    prop: item,
                    label: item,
                    width: 150,
                    isResult: true
                });
            });

            // columns.push({
            //     prop: 'auditRemark',
            //     label: '审核异议',
            //     width: 200,
            //     isRemark: true
            // });

            return columns;
        },
        /** 返回上一页 */
        goBack() {
            // 返回上一路由并关闭当前标签
            router.go(-1);
            this.$tab.closePage();
        },

        // 新增：行样式，用于标记异议行
        tableRowClassName({ row, rowIndex }) {
            // 检查当前行的 sampleNo 在 sampleRemarks 中是否有值
            const remark = this.sampleRemarks[row.sampleNo];
            if (remark && remark.trim().length > 0) {
                return 'objection-row';
            }
            return '';
        },

        getResultClass(result) {
            if (result === '+') {
                return 'positive-result';
            } else if (result === '-') {
                return 'negative-result';
            }
            return '';
        },

        getResultInfo() {
            const pcrEntrustOrderld = this.$route.query.pcrEntrustOrderld;
            const orderNo = this.$route.query.orderNo;
            this.loading = true;
            //
            INfo({ pcrEntrustOrderId: pcrEntrustOrderld, orderNo: orderNo }).then(response => {
                console.log(response, '1111111111111')
                this.xqlist = response.data
                this.loading = false;
                if (response.code === 200 && response.data) {

                    // 接口返回的数据是 OpPcrEntrustOrderItem 列表
                    this.originalData = response.data;

                    // 初始化 sampleRemarks
                    const remarks = {};
                    this.originalData.forEach(item => {
                        // 优先使用后端返回的 remark
                        if (item.remark) {
                            remarks[item.sampleNo] = item.remark;
                        }
                    });
                    this.sampleRemarks = remarks; // 初始化 reactive object

                    this.form = {
                        ...this.form,
                        // pcrTaskItemType: pcrTaskItemType,
                        opJczxPcrResultInfoList: response.data,
                        fileId: response.data[0]?.fileId || ''
                    };
                } else {
                    this.$modal.msgError("获取数据失败1");
                }
            }).catch(error => {
                this.loading = false;
                console.error("获取数据失败:", error);
                this.$modal.msgError("获取数据失败2");
            });

        },

        // 审核方法
        // 审核方法
        examine() {
            this.saving = true;
            const auditPayload = [];

            // ✅ 遍历原始数据，每条就是一个检测项目
            this.originalData.forEach(tableRow => {
                console.log(tableRow, '11111111111111')
                const rowRemark = this.sampleRemarks[tableRow.sampleNo] || '';
                // 遍历该 sampleNo 下所有 item，生成提交 payload
                tableRow.opPcrEntrustOrderItemList.forEach(item => {
                    // 提交的数据结构: opPcrEntrustOrderItemId 和 remark 的数组
                    auditPayload.push({
                        opPcrEntrustOrderItemId: item.opPcrEntrustOrderItemId, // 使用实际的 item ID
                        remark: rowRemark // 统一使用该 sampleNo 的异议
                    });
                });
                // auditPayload.push({
                //     opPcrEntrustOrderItemId: item.opPcrEntrustOrderItemId,
                //     remark: rowRemark
                // });
            });

            if (auditPayload.length === 0) {
                this.$modal.msgWarning("无可提交的审核项目");
                this.saving = false;
                return;
            }
            examinePcrResultBase(auditPayload).then(response => {
                this.saving = false;
                if (response.code === 200) {
                    this.$modal.msgSuccess("审核操作成功");
                    this.goBack();
                } else {
                    this.$modal.msgError("审核失败: " + response.msg);
                }
            }).catch(error => {
                this.saving = false;
                this.$modal.msgError("审核失败: " + (error.msg || '请检查网络连接'));
            });
        },

        // 以下方法（预览和下载）保持不变...
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
                // 创建Blob对象
                const blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                let filename = `PCR结果_${this.form.resultNo || '文件'}.xlsx`;

                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);

                loading.close();
                this.$modal.msgSuccess("文件下载成功");

            }).catch(error => {
                console.error('下载失败:', error);
                loading.close();
                this.$modal.msgError("文件下载失败: " + (error.message || '请检查网络连接'));
            });
        },
    }
};
</script>
<style scoped>
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

/* 新增：异议行样式 */
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
</style>