<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="100px">

            <!-- 合并为单个时间范围选择框 -->
            <el-form-item label="测试时间" prop="testTime">
                <el-date-picker v-model="testTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="部门名称" prop="deptName">
                <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
<!--            <el-col :span="1.5">-->
<!--                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"-->
<!--                    v-hasPermi="['disinfectionmanagement:management:add']">新增</el-button>-->
<!--            </el-col>-->
<!--            <el-col :span="1.5">-->
<!--                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"-->
<!--                    v-hasPermi="['disinfectionmanagement:management:edit']">修改</el-button>-->
<!--            </el-col>-->
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['disinfectionmanagement:management:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table :data="tableData" style="width: 100%" height="70vh">
            <el-table-column prop="phosphateTest" label="磷酸盐试验（＋/-）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="acidity" label="酸度（°T）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="antibioticResidue" label="解抗剂（读数＜0.9）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="aflatoxinM1" label="黄曲霉毒素M1（读数≥1.2）" width="120" align="center">
            </el-table-column>
            <el-table-column label="快抗（读数≥1.2）" align="center">
                <el-table-column prop="betaLactam" label="β-内酰胺" width="120" align="center">
                </el-table-column>
                <el-table-column prop="tetracyclines" label="四环素类" width="120" align="center">
                </el-table-column>
                <el-table-column prop="ceftiofur" label="头孢噻呋" width="120" align="center">
                </el-table-column>
                <el-table-column prop="cefalexin" label="头孢氨苄" width="120" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="读数≥1.2" align="center">
                <el-table-column prop="flunixin" label="氟尼辛" width="120" align="center">
                </el-table-column>
                <el-table-column prop="meloxicam" label="美洛昔康" width="120" align="center">
                </el-table-column>
                <el-table-column prop="streptomycin" label="链霉素/双氢链霉素" width="120" align="center">
                </el-table-column>
                <el-table-column prop="quinolone" label="喹诺酮" width="120" align="center">
                </el-table-column>
                <el-table-column prop="kanamycin" label="卡那" width="120" align="center">
                </el-table-column>
                <el-table-column prop="monensin" label="莫能菌素" width="120" align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column prop="roseBengal" label="玫瑰红（＋/-）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="bromothymolBlue" label="溴百里香酚蓝（＋/-）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="ferricChloride" label="三氯化铁（＋/-）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="methyleneBlueTest" label="美兰试验（4小时）合格“√”/不合格“×”" width="120" align="center">
            </el-table-column>
            <el-table-column prop="bloodMilkTest" label="血奶检测（合格“√”/不合格“×”）" width="120" align="center">
            </el-table-column>
            <el-table-column prop="freezingPoint" label="冰点" width="120" align="center">
            </el-table-column>
            <el-table-column prop="e50" label="E50 " width="120" align="center">
            </el-table-column>
            <el-table-column prop="sensoryIndex" label="感官指标" width="120" align="center">
            </el-table-column>
            <el-table-column prop="sampler" label="采样人" width="120" align="center">
            </el-table-column>
            <el-table-column prop="tester" label="检测人" width="120" align="center">
            </el-table-column>

        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改消毒管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="消毒池名称" prop="disinfectionTankName">
                    <el-input v-model="form.disinfectionTankName" placeholder="请输入消毒池名称" />
                </el-form-item>
                <el-form-item label="浓度" prop="concentration">
                    <el-input v-model="form.concentration" placeholder="请输入浓度" />
                </el-form-item>
                <el-form-item label="消毒时间" prop="disinfectionTime">
                    <el-date-picker v-model="form.disinfectionTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="请选择消毒时间" style="width: 100%" />
                </el-form-item>
                <el-form-item label="消毒方式" prop="disinfectionMethod">
                    <el-input v-model="form.disinfectionMethod" placeholder="请输入消毒方式" />
                </el-form-item>
                <el-form-item label="消毒液" prop="disinfectant">
                    <el-input v-model="form.disinfectant" placeholder="请输入消毒液" />
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input v-model="form.deptName" :disabled="true" />
                </el-form-item>
                <el-divider content-position="center">消毒管理记录信息</el-divider>
                <el-row :gutter="10" class="mb8">
                </el-row>
                <el-table :data="opDisinfectionManagementRecordList"
                    :row-class-name="rowOpDisinfectionManagementRecordIndex"
                    @selection-change="handleOpDisinfectionManagementRecordSelectionChange"
                    ref="opDisinfectionManagementRecord">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="序号" align="center" prop="index" width="50" />
                    <el-table-column label="消毒池名称" prop="disinfectionTankName" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.disinfectionTankName" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column label="浓度" prop="concentration" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.concentration" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column label="消毒时间" prop="disinfectionTime" width="180">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.disinfectionTime" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column label="消毒方式" prop="disinfectionMethod" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.disinfectionMethod" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column label="消毒液" prop="disinfectant" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.disinfectant" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column label="部门名称" prop="deptId" width="120">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.deptName" :disabled="true" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { exitInspectionReportList } from "@/api/report/exitInspectionReport";

export default {
    name: "Management",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 子表选中数据
            checkedOpDisinfectionManagementRecord: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 消毒管理表格数据
            managementList: [],
            // 消毒管理记录表格数据
            opDisinfectionManagementRecordList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,

                testStartTime: null,
                testEndTime: null,

            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            tableData: [],
            testTime: null,
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            exitInspectionReportList(this.queryParams).then(response => {
                this.tableData = response.rows;
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
                disinfectionManagementId: null,
                disinfectionManagementStatus: null,
                disinfectionTankName: null,
                concentration: null,
                disinfectionTime: null,
                disinfectionMethod: null,
                disinfectant: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                deptId: null,
                isDelete: null
            };
            this.opDisinfectionManagementRecordList = [];
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            console.log(this.queryParams);
            // 拆分时间范围数组，赋值给后端需要的字段
            if (this.testTime) {
                this.queryParams.testStartTime = this.testTime[0];
                this.queryParams.testEndTime = this.testTime[1];
            } else {
                // 清空时间范围时，同时清空区间字段
                this.queryParams.testStartTime = null;
                this.queryParams.testEndTime = null;
            }
            console.log(this.queryParams);

            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            // 重置后清空区间字段
            this.queryParams.disinfectionStartTime = null;
            this.queryParams.disinfectionEndTime = null;
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.disinfectionManagementId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加消毒管理";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const disinfectionManagementId = row.disinfectionManagementId || this.ids;
            getManagement(disinfectionManagementId).then(response => {
                this.form = response.data;
                this.opDisinfectionManagementRecordList = response.data.opDisinfectionManagementRecordList;
                this.open = true;
                this.title = "修改消毒管理";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.opDisinfectionManagementRecordList = this.opDisinfectionManagementRecordList;
                    if (this.form.disinfectionManagementId != null) {
                        updateManagement(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addManagement(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const disinfectionManagementIds = row.disinfectionManagementId || this.ids;
            this.$modal.confirm('是否确认删除消毒管理编号为"' + disinfectionManagementIds + '"的数据项？').then(function () {
                return delManagement(disinfectionManagementIds);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 消毒管理记录序号 */
        rowOpDisinfectionManagementRecordIndex({ row, rowIndex }) {
            row.index = rowIndex + 1;
        },
        /** 消毒管理记录添加按钮操作 */
        handleAddOpDisinfectionManagementRecord() {
            let obj = {};
            obj.disinfectionManagementStatus = "";
            obj.disinfectionTankName = "";
            obj.concentration = "";
            obj.disinfectionTime = "";
            obj.disinfectionMethod = "";
            obj.disinfectant = "";
            obj.deptId = "";
            obj.isDelete = "";
            this.opDisinfectionManagementRecordList.push(obj);
        },
        /** 消毒管理记录删除按钮操作 */
        handleDeleteOpDisinfectionManagementRecord() {
            if (this.checkedOpDisinfectionManagementRecord.length == 0) {
                this.$modal.msgError("请先选择要删除的消毒管理记录数据");
            } else {
                const opDisinfectionManagementRecordList = this.opDisinfectionManagementRecordList;
                const checkedOpDisinfectionManagementRecord = this.checkedOpDisinfectionManagementRecord;
                this.opDisinfectionManagementRecordList = opDisinfectionManagementRecordList.filter(function (item) {
                    return checkedOpDisinfectionManagementRecord.indexOf(item.index) == -1;
                });
            }
        },
        /** 复选框选中数据 */
        handleOpDisinfectionManagementRecordSelectionChange(selection) {
            this.checkedOpDisinfectionManagementRecord = selection.map(item => item.index);
        },
        /** 导出按钮操作 */
        handleExport() {
            // 导出时同步传递区间参数
            const exportParams = { ...this.queryParams };
            if (this.queryParams.disinfectionTimeRange) {
                exportParams.disinfectionStartTime = this.queryParams.disinfectionTimeRange[0];
                exportParams.disinfectionEndTime = this.queryParams.disinfectionTimeRange[1];
            }
            this.download('disinfectionmanagement/management/export', exportParams, `management_${new Date().getTime()}.xlsx`);
        }
    }
};
</script>
