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
                    <!-- 搜索条件 -->
                    <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT">
                        保存
                    </el-button>

                </div>
            </div>
        </div>
        <div style="padding-top: 40px">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="检测项目" prop="itemName">
                            <el-input v-model="form.itemName" style="width: 100%" placeholder="请选择检测项目"
                                class="input-with-select" readonly>
                                <template #append>
                                    <el-button slot="append" icon="el-icon-search" @click="getListitem()"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="制单人" prop="createBy">
                            <el-input v-model="form.createBy" placeholder="制单人" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="制单时间" prop="createTime">
                            <el-input v-model="form.createTime" placeholder="制单时间" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input type="textarea" v-model="form.remark" placeholder="备注" :rows="3" maxlength="500"
                                show-word-limit />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="特性配置" name="特性配置">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="showFeatureDialog">
                            添加
                        </el-button>
                    </el-col>
                </el-row>

                <el-table :data="featureList" style="width: 100%">
                    <el-table-column type="index" align="center" label="序号" width="50" />
                    <el-table-column label="特性名称" align="center" prop="featureName" min-width="200" />
                    <el-table-column label="下限" align="center" prop="lowerLimit" width="100" />
                    <el-table-column label="上限" align="center" prop="upperLimit" width="100" />
                    <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width"
                        fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete"
                                @click="removeFeature(scope.$index)" style="color: red">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 特性选择对话框 -->
        <el-dialog :title="featureDialogTitle" :visible.sync="featureDialogVisible" width="1200px" append-to-body>
            <el-form :model="featureQueryParams" ref="featureQueryForm" size="small" :inline="true"
                @submit.native.prevent>
                <el-form-item label="特性名称" prop="featureName">
                    <el-input v-model="featureQueryParams.featureName" placeholder="请输入特性名称" clearable
                        style="width: 240px" @keyup.enter.native="handleFeatureQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleFeatureQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetFeatureQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-row>
                <el-table :data="featureOptions" ref="featureTable" style="width: 100%" height="60vh"
                    @selection-change="handleFeatureSelectionChange" @row-click="handleRowClick"
                    row-key="bsLabtestFeatureId">
                    <el-table-column type="selection" width="55" :reserve-selection="true" />
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column label="特性名称" align="center" prop="name" min-width="150" />
                    <el-table-column label="下限" align="center" prop="lowerLimit" width="100" />
                    <el-table-column label="上限" align="center" prop="upperLimit" width="100" />
                    <el-table-column label="状态" align="center" width="80">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.isEnable === '1' ? 'success' : 'danger'" size="small">
                                {{ scope.row.isEnable === '1' ? '启用' : '停用' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="featureTotal > 0" :total="featureTotal" :page.sync="featureQueryParams.pageNum"
                    :limit.sync="featureQueryParams.pageSize" @pagination="getFeatureOptions" />
            </el-row>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmFeatureSelection">确 定</el-button>
                <el-button @click="featureDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!--项目弹窗-->
        <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
            <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true" @submit.native.prevent>
                <el-form-item label="检测项目" prop="itemName">
                    <el-input v-model="queryParams2.itemName" placeholder="请输入检测项目" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery2" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
                </el-form-item>
            </el-form>
            <el-row>
                <el-table :data="itemlist" ref="table" style="width: 100%" height="60vh" @row-click="itemclick">
                    <el-table-column type="index" label="序号" width="50" />
                    <el-table-column label="检测项目名称" align="center" prop="itemName" min-width="200" />
                    <el-table-column label="检测项目编码" align="center" prop="itemCode" min-width="200" />
                </el-table>
                <pagination v-show="labtesttotal > 0" :total="labtesttotal" :page.sync="queryParams2.pageNum"
                    :limit.sync="queryParams2.pageSize" @pagination="getListitem" />
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { batchAddItemFeature, batchUpdateItemFeature, getItemFeatureByItemId } from "@/api/Basicdata/itemFeature";
import { listFeature } from "@/api/Basicdata/feature";
import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    name: "ItemFeatureCreate",
    data() {
        return {
            // 表单参数
            form: {
                itemId: null,
                itemName: null,
                featureIds: [],
                remark: '',
                createBy: '',
                createTime: ''
            },
            // 表单校验
            rules: {
                // 可根据需要添加校验规则
            },
            // 加载状态
            loading: false,
            // 活动标签页
            activeName: "特性配置",
            // 特性列表（用于表格展示）
            featureList: [],
            // 模式：add/edit
            mode: 'add',
            // 标题
            title: "项目特性配置",

            // 特性选择对话框相关
            featureDialogVisible: false,
            featureDialogTitle: "选择特性",
            featureOptions: [],
            featureQueryParams: {
                pageNum: 1,
                pageSize: 10,
                featureName: '',
                isEnable: '1'
            },
            featureTotal: 0,
            selectedFeatures: [],
            // 存储已选特性用于弹窗默认选中
            selectedFeatureIds: new Set(),

            // 查询参数
            queryParams2: {
                pageNum: 1,
                pageSize: 20,
                itemName: "",
                isEnable: "1",
            },
            itemlist: [],
            labtesttotal: 0,
            labtestItemsopen: false,

            // 是否显示弹出层
            open: false,
        };
    },
    created() {
        const query = this.$route.query;
        this.mode = query.mode || 'add';
        this.form.itemId = query.itemId;
        this.form.itemName = query.itemName;

        // 设置标题
        this.title = `${this.mode === 'add' ? '添加' : '配置'}【${this.form.itemName}】的特性`;

        // 如果是编辑模式，加载已配置的特性
        if (this.mode === 'edit') {
            this.loadItemFeatures();
        }


    },
    methods: {
        /** 返回上一页 */
        goBack() {
            this.$router.push('/Basicdata/itemFeature').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },

        /** 加载项目已配置的特性 */
        loadItemFeatures() {
            getItemFeatureByItemId(this.form.itemId).then(response => {
                if (response.data && response.data.length > 0) {
                    this.featureList = response.data;
                    this.form.featureIds = response.data.map(item => item.featureId);
                    // 将已选特性ID存入Set中，用于弹窗默认选中
                    this.selectedFeatureIds = new Set(this.form.featureIds);
                    this.form.createBy = response.data[0].createBy;
                    this.form.createTime = response.data[0].createTime;
                }
            }).catch(error => {
                console.error("获取项目特性失败:", error);
                this.$modal.msgError("获取项目特性失败");
            });
        },

        /** 显示特性选择对话框 */
        showFeatureDialog() {
            this.featureDialogVisible = true;
            this.featureQueryParams.pageNum = 1;
            this.getFeatureOptions();
        },

        /** 获取特性选项列表 */
        getFeatureOptions() {
            listFeature(this.featureQueryParams).then(response => {
                this.featureOptions = response.rows;
                this.featureTotal = response.total;

                // 设置默认选中已选的特性
                this.$nextTick(() => {
                    if (this.$refs.featureTable) {

                        // 遍历当前页的特性，如果已选则设置为选中状态
                        this.featureOptions.forEach(row => {
                            if (this.selectedFeatureIds.has(row.bsLabtestFeatureId)) {
                                this.$refs.featureTable.toggleRowSelection(row, true);
                            }
                        });
                    }
                });
            }).catch(error => {
                console.error("获取特性列表失败:", error);
                this.$modal.msgError("获取特性列表失败");
            });
        },

        /** 特性查询 */
        handleFeatureQuery() {
            this.featureQueryParams.pageNum = 1;
            this.getFeatureOptions();
        },

        /** 重置特性查询 */
        resetFeatureQuery() {
            this.featureQueryParams = {
                pageNum: 1,
                pageSize: 10,
                featureName: '',
                isEnable: '1'
            };
            this.handleFeatureQuery();
        },

        /** 处理特性选择变化 */
        handleFeatureSelectionChange(selection) {
            this.selectedFeatures = selection;
        },

        /** 处理行点击事件 */
        handleRowClick(row, column, event) {
            // 如果点击的是复选框列，不处理，避免重复触发
            if (column && column.type === 'selection') return;

            // 切换当前行的选中状态
            this.$refs.featureTable.toggleRowSelection(row);
        },

        /** 确认特性选择 */
        confirmFeatureSelection() {
            // 获取所有选中的特性
            const selectedFeatures = this.$refs.featureTable.selection;

            if (selectedFeatures.length === 0) {
                this.$message.warning('请至少选择一个特性');
                return;
            }

            // 1. 用完整的勾选数据重新生成 Set
            this.selectedFeatureIds = new Set(selectedFeatures.map(f => f.bsLabtestFeatureId));

            // 2. 【关键】清空主列表，用完整的勾选数据重新填充
            this.featureList = [];
            selectedFeatures.forEach(feature => {
                this.featureList.push({
                    featureId: feature.bsLabtestFeatureId,
                    featureName: feature.name,
                    featureCode: feature.featureCode,
                    lowerLimit: feature.lowerLimit,
                    upperLimit: feature.upperLimit
                });
            });

            // 3. 从 Set 更新表单的ID数组
            this.form.featureIds = Array.from(this.selectedFeatureIds);

            this.featureDialogVisible = false;
        },

        /** 移除特性 */
        removeFeature(index) {
            const removedFeatureId = this.featureList[index].featureId;
            this.featureList.splice(index, 1);

            // 从已选特性ID集合中移除
            this.selectedFeatureIds.delete(removedFeatureId);
            this.form.featureIds = Array.from(this.selectedFeatureIds);
        },

        /** 提交表单 */
        saveForm() {
            if (this.featureList.length === 0) {
                this.$modal.msgError("请至少添加一个特性");
                return;
            }

            this.loading = true;

            const submitData = {
                itemId: this.form.itemId,
                remark: this.form.remark,
                featureIds: this.form.featureIds,
                isEnable: "1"
            };

            const submitPromise = this.mode === 'add'
                ? batchAddItemFeature(submitData)
                : batchUpdateItemFeature(submitData);

            submitPromise.then(response => {
                this.loading = false;
                this.$modal.msgSuccess(this.mode === 'add' ? "新增成功" : "修改成功");
                this.goBack();
            }).catch(error => {
                this.loading = false;
                console.error("提交失败:", error);
                this.$modal.msgError("提交失败: " + (error.message || "未知错误"));
            });
        },
        // 获取项目
        getListitem() {
            this.loading = true;
            getpagelist(this.queryParams2).then((response) => {
                this.loading = false;
                if (response.code == "200") {
                    this.itemlist = response.rows;
                    this.labtesttotal = response.total;
                    this.open = true;
                    this.title = "选择检测项目";
                }
            });
        },
        // 确认
        itemclick(val) {
            this.form.itemId = val.labtestItemsId;
            this.form.itemCode = val.itemCode;
            this.form.itemName = val.itemName;
            this.open = false;
            this.title = "";
            // 如果是新增模式，清空之前选择的特性
            if (this.mode === 'add') {
                this.featureList = [];
                this.form.featureIds = [];
                this.selectedFeatureIds = new Set();
            }
        },
        /** 搜索按钮操作 */
        handleQuery2() {
            this.queryParams2.pageNum = 1;
            this.getListitem();
        },
        /** 重置按钮操作 */
        resetQuery2() {
            this.resetForm("queryForm");
            this.queryParams2 = {
                pageNum: 1,
                pageSize: 10,
                itemName: "",
                isEnable: "0",
            };
            this.getListitem();
        }
    }
};
</script>

<style scoped>
.el-form-item {
    margin-bottom: 15px;
}



/* 表格样式 */
.el-table {
    margin-top: 10px;
}



/* 弹窗表格行样式 - 添加点击效果 */
.el-table>>>.el-table__row {
    cursor: pointer;
}

.el-table>>>.el-table__row:hover {
    background-color: #f5f7fa;
}
</style>