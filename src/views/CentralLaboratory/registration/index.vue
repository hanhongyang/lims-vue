<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="组织" prop="deptName">
                <el-input v-model="queryParams.deptName" placeholder="请输入组织" clearable @keyup.enter.native="handleQuery"
                    style="width: 180px" />
            </el-form-item>
            <el-form-item label="编号" prop="Number">
                <el-input v-model="queryParams.Number" placeholder="请输入编号" clearable @keyup.enter.native="handleQuery"
                    style="width: 180px" />
            </el-form-item>
            <el-form-item label="物料" prop="Material">
                <el-input v-model="queryParams.Material" placeholder="请输入物料" clearable @keyup.enter.native="handleQuery"
                    style="width: 180px" />
            </el-form-item>
            <!-- 新增：送样时间描述 + 日期选择器 -->
            <el-form-item label="送样时间" prop="sendSampleDateRange">
                <el-date-picker 
                v-model="queryParams.sendSampleDateRange"
                type="daterange" 
                range-separator="至" 
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="handleDateChange"
                style="width: 320px"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery"
                    style="margin-left:20px">查询</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['basicdata:labTestItems:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['basicdata:labTestItems:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="wbList" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
             <el-table-column label="送检单号" align="center" prop="entrustOrderNo" />
            <el-table-column label="组织" align="center" prop="deptName" />
            <el-table-column label="送样时间" align="center" prop="entrustTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.entrustTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark" />
            <!--<el-table-column label="状态" align="center" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.isEnable === '1' ? 'primary' : 'success'" disable-transitions>
                        {{ scope.row.isEnable === '1' ? '已审核' : '已弃审' }}
                    </el-tag>
                </template>
            </el-table-column>-->
            <!-- <el-table-column label="委托方联系电话" align="center" prop="entrustContactPhone" /> -->
            <el-table-column label="样品数量" align="center" prop="sampleQuantity" />
            <el-table-column label="创建人" align="center" prop="createBy" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:pcrEntrustOrder:edit']">修改</el-button>
                    <!--<el-button size="mini" type="text" icon="el-icon-delete" @click="handleStatusChange(scope.row)"
                        v-hasPermi="['labtest:pcrEntrustOrder:remove']">审核</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleStatusChange(scope.row)"
                        v-hasPermi="['labtest:pcrEntrustOrder:remove']">弃审</el-button>-->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import {
    getpagelist,
    addobj,
    getdetail,
    updateobj,
    changestatus,
} from "@/api/CentralLaboratory/registration";
// import { values } from "core-js/core/array";
export default {
    dicts: ["is_verify"],
    name: "registration",
    data() {
        return {
            // 遮罩层
            loading: false,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 【请填写功能名称】表格数据
            tablepagelist: [],
            // 弹出层标题
            title: "",
            isregiet: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deptName: "",
                entrustOrderNo: "",
                Material: "",
                isEnable: "",
                // 新增：送样时间相关字段（替换原 dateRange/startDate/endDate）
                sendSampleDateRange: [],    // 日期选择器绑定的范围数组
                sendSampleDateStart: "",    // 传递给后端的开始时间（新字段名）
                sendSampleDateEnd: "",       // 传递给后端的结束时间（新字段名）
                value1: ''
            },
            value1: '',
            // 表格数据
            wbList: [],
            // 多选框选中数据
            handleSelectionChange(selection) {
                this.ids = selection.map(item => item.opPcrEntrustOrderId)
                this.single = selection.length !== 1
                this.multiple = !selection.length
            },
        }
    },
    created() {
        this.getList();
    },
    methods: {
        handleStatusChange(row) {
            console.log(row, '8888888888888888');
            // 修正：区分“审核”和“弃审”的目标状态（原逻辑有错误，总是切换到1或0）
            // 假设：isEnable=1 代表已审核，isEnable=0 代表已弃审
            const currentStatus = row.isEnable;
            // 根据点击的按钮判断是“审核”还是“弃审”（后续需要优化按钮逻辑）
            // 临时处理：如果当前是弃审(0)，则审核；如果是审核(1)，则弃审
            const targetStatus = currentStatus === "0" ? "1" : "0";
            const text = targetStatus === "1" ? "审核" : "弃审";

            this.$confirm(`确认要${text}"${row.deptName}"吗？`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
            })
            .then(() => {
            return changestatus(row.id, targetStatus);
            })
            .then(() => {
            this.$message.success(`${text}成功`); // 替换 $modal.msgSuccess
            this.getList();
            })
            .catch(() => {
            this.$message.info("已取消操作"); // 替换 $modal.msgInfo（核心修复）
            });
        },
        /** 查询【请填写功能名称】列表 */
        getList() {
            this.loading = true;
            // 关键：将 queryParams 作为参数传递给 getpagelist 接口
            getpagelist(this.queryParams).then((response) => {
            console.log(response, '外部送检查询列表1111');
            if (response.code == "200") {
                this.wbList = response.rows; // 赋值表格数据
                this.total = response.total; // 赋值总条数
            }
            this.loading = false; // 无论成功失败，都关闭加载状态
            }).catch(error => {
            this.loading = false;
            this.$message.error("查询失败：" + (error.message || "网络异常"));
            });
        },
        handleDateChange() {
            const dateRange = this.queryParams.sendSampleDateRange;
            if (dateRange && dateRange.length === 2) {
            // 拆分范围数组，赋值给新的开始/结束时间字段
            this.queryParams.sendSampleDateStart = dateRange[0];
            this.queryParams.sendSampleDateEnd = dateRange[1];
            } else {
            // 未选择日期时清空
            this.queryParams.sendSampleDateStart = "";
            this.queryParams.sendSampleDateEnd = "";
            }
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1; // 重置页码为第1页
            this.handleDateChange(); // 强制处理日期参数（确保字段赋值）
            this.getList(); // 调用查询接口（自动携带新字段）
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm"); // 重置表单输入
            // 手动重置查询参数（避免残留空值）
            this.queryParams = {
            pageNum: 1,
            pageSize: 10,
            deptName: "",
            entrustOrderNo: "",
            Material: "",
            isEnable: "",
            sendSampleDateRange: [],    // 清空日期选择范围
            sendSampleDateStart: "",    // 清空开始时间
            sendSampleDateEnd: ""       // 清空结束时间
            };
            this.value1 = ""; // 重置日期选择器绑定值
            this.getList(); // 重置后查询全量数据
        },
        handleExport() {
            this.download(
                "/basicdata/labTestItems/export",
                {
                    ...this.queryParams,
                },
                `检测项目_${new Date().getTime()}.xlsx`
            );
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push({
                path: '/CentralLaboratory/registrationcreate',
                query: { op: 'add' }   // 新增并默认启用
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            console.log(row, '修改点击这一行的数据')
            // this.reset();
            // const labtestItemsId = row.labtestItemsId;
            // getdetail(labtestItemsId).then((response) => {
            //   if (response.code == "200") {
            //     if (response.data) {
            //       this.form = response.data;
            //       this.open = true;
            //       this.isregiet = true;
            //       this.title = "修改";
            //     }
            //   }
            // });
            // const id = row.id;
            //直接跳转
            this.$router.push({
                path: '/CentralLaboratory/registrationcreate',
                query: { op: 'edit', row: JSON.stringify(row) }   // 整行数据序列化后带过去
            });
        },
    }
}
</script>