<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="130px">
            <el-form-item label="生产订单号" prop="dairylandId">
                <el-input v-model="queryParams.dairylandId" placeholder="请输入生产订单号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="计划时间" prop="dateProcessed">
                <el-date-picker clearable v-model="queryParams.dateProcessed" type="date" value-format="yyyy-MM-dd"
                    placeholder="请选择计划时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['basicdata:summary:edit']"
        >修改</el-button>
      </el-col> -->
            <!-- <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleAdd">新增</el-button>
            </el-col> -->
            <!-- <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
                    @click="handleDelete" v-hasPermi="['basicdata:summary:remove']">删除</el-button>
            </el-col> -->
            <!-- 新增导入按钮 -->
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="downImport">下载模板</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="summaryList" @selection-change="handleSelectionChange" height="70vh">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="生产订单号" align="center" prop="productionOrderNumber" />
            <el-table-column label="计划生产量" align="center" prop="plannedProductionVolume" />
            <el-table-column label="物料" align="center" prop="materialName" />
            <el-table-column label="计划取样份数" align="center" prop="plannedSampleQuantity" />
            <el-table-column label="已取样份数" align="center" prop="haveSampleCopies" />
            <!-- <el-table-column label="状态" align="center" prop="status" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.status == '0' ? '待取样' : '已取样' }}</span>
                </template>
</el-table-column> -->
            <el-table-column label="计划类型" align="center" prop="planType" width="180">
                <template slot-scope="scope">
                    <span>{{ scope.row.planType == '0' ? '成品' : scope.row.planType == '1' ? '库存' : scope.row.planType ==
                        '2' ? '垫料' : '原料' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="导入人" align="center" prop="importBy" />
            <!-- <el-table-column label="已取样份数" align="center" prop="haveSampleCopies" /> -->
            <el-table-column label="计划时间" align="center" prop="planTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.planTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">修改</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-delete"
                        @click="handleAduit(scope.row)">审核</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 新增导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls, .csv" :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">
                    <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据 -->
                    <!-- <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link> -->
                </div>
                <div class="el-upload__tip" style="color:red" slot="tip">
                    提示：仅允许导入xlsx、xls、csv格式文件！导入时间可能较长请您耐心等待，弹出完成提示框即导入完成。
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" label-width="100px">
                <!-- 这里只展示部分表单字段作为示例，实际使用时需要根据需求添加 -->
                <el-form-item label="生产订单号" prop="productionOrderNumber">
                    <el-input v-model="form.productionOrderNumber" placeholder="请输入生产订单号" />
                </el-form-item>
                <el-form-item label="计划生产量" prop="plannedProductionVolume">
                    <el-input v-model="form.plannedProductionVolume" placeholder="请输入计划生产量" />

                </el-form-item>
                <el-form-item label="物料" prop="materialName">
                    <el-input v-model="form.materialName" placeholder="请输入物料" />
                </el-form-item>
                <el-form-item label="计划取样份数" prop="plannedSampleQuantity">
                    <el-input v-model="form.plannedSampleQuantity" placeholder="请输入计划取样份数" />
                </el-form-item>
                <el-form-item label="已取样份数" prop="haveSampleCopies">
                    <el-input v-model="form.haveSampleCopies" placeholder="请输入已取样份数" />
                </el-form-item>

                <el-form-item label="计划时间" prop="planTime">
                    <el-date-picker clearable v-model="form.planTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择计划时间">
                    </el-date-picker>
                </el-form-item>

                <!-- 其他表单字段按照相同方式添加 -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listSummary, getSummary, delSummary, addSummary, updateSummary } from "@/api/CentralLaboratory/summary";
import { planlist, updatePlan, getPlan } from "@/api/feedfactory/excel";
import { getToken } from "@/utils/auth";

export default {
    name: "Summary",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 取样计划表格数据
            summaryList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            // 表单参数
            form: {
                productionOrderNumber: '',
                plannedProductionVolume: '',
                materialName: '',
                plannedSampleQuantity: '',
                haveSampleCopies: '',
                planTime: '',
            },
            // 表单校验
            rules: {
            },
            // 导入参数
            upload: {
                // 是否显示弹出层
                open: false,
                // 弹出层标题
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/sampling/plan/importData"
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {

        getList() {
            this.loading = true;
            planlist(this.queryParams).then(response => {
                this.summaryList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {

                importTime: null,
                importBy: null
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.dairylandId)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加取样计划";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row, '111111')
            this.reset();
            const dairylandId = row.finishedProductSamplingPlanDetailId
            getPlan(dairylandId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改取样计划";
            });
        },
        /** 提交按钮 */
        submitForm() {
            updatePlan(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
            });

        },
        handleAduit(row) {
            console.log(row, '111111')
            // AudioData().then((res) => {

            // })
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const dairylandIds = row.dairylandId || this.ids;
            this.$modal.confirm('是否确认删除计划编号为"' + dairylandIds + '"的数据项？').then(function () {
                return delSummary(dairylandIds);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('sampling/plan/detailExport', {
                ...this.queryParams
            }, `取样计划_${new Date().getTime()}.xlsx`)
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "取样计划导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        downImport() {
            this.download('sampling/plan/exportTemplate', {}, `取样计划导入模板_${new Date().getTime()}.xlsx`)
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.$refs.upload.clearFiles();
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.getList();
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        }
    }
};
</script>
