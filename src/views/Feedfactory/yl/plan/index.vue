<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="车牌号" prop="driverCode">
                <el-input v-model="queryParams.driverCode" placeholder="请输入车牌号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="供应商" prop="supplierName">
                <el-input v-model="queryParams.supplierName" placeholder="请输入供应商" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="司机" prop="driverName">
                <el-input v-model="queryParams.driverName" placeholder="请输入司机" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>

          <el-form-item label="进场时间" prop="carInTime">
            <el-date-picker
              clearable
              v-model="dateRange.carInRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 240px"
            @change="handleCarInRangeChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出场时间" prop="carOutTime">
            <el-date-picker
              clearable
              v-model="dateRange.carOutRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              @change="handleCarOutRangeChange">
            </el-date-picker>
          </el-form-item>
            <el-form-item label="消毒方式" prop="disinfection">
                <el-input v-model="queryParams.disinfection" placeholder="请输入消毒方式" clearable
                    @keyup.enter.native="handleQuery" />
                <!-- <el-select v-model="queryParams.disinfection" placeholder="请选择状态" clearable>
                    <el-option v-for="dict in dict.type.entrust_order_status" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select> -->
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                    <el-option v-for="dict in dict.type.sampling_plan_status" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['labtest:feedEntrustOrder:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['labtest:feedEntrustOrder:export']">导出</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleDy"
                    v-hasPermi="['labtest:feedEntrustOrder:export']">打印二维码</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="planlist" max-height="610px">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sampling_plan_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="车牌号" align="center" prop="driverCode" />
            <el-table-column label="供应商" align="center" prop="supplierName" />
            <el-table-column label="司机" align="center" prop="driverName" />
            <el-table-column label="消毒方式" align="center" prop="disinfection" />
            <!-- <template slot-scope="scope">
                    <dict-tag :options="dict.type.entrust_order_status" :value="scope.row.disinfection" />
                </template>
</el-table-column> -->
            <el-table-column label="进场时间" align="center" prop="carInTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.carInTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="出场时间" align="center" prop="carOutTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.carOutTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="消毒药" align="center" prop="toxicide" />
            <el-table-column label="浓度" align="center" prop="density" />
            <el-table-column label="责任人" align="center" prop="personLiable" />
            <el-table-column label="备注" align="center" prop="remark" />

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:feedEntrustOrder:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['labtest:feedEntrustOrder:edit']">打印</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 打印二维码弹出框 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            请输入打印张数：
            <el-input v-model="scsl"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="scslSub">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listPlan, getPlanZs } from "@/api/feedfactory/plan";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
  name: 'sampling',
  dicts: ['entrust_order_status', 'sampling_plan_status'],
  data() {
    return {
      scsl: 0,
      dialogVisible: false,
      testItemList: [],
      testItemQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        tag: '1',
        isEnable: '1'
      },
      testItemTotal: 0,
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
      // 饲料样品委托单表格数据
      planlist: [],
      // 临时存储日期范围（不传递给后端）
      dateRange: {
        carInRange: null,  // 入场时间范围
        carOutRange: null  // 出场时间范围
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        newSamplingTypes: '3',
        driverCode: null,
        driverName: null,
        supplierName: null,
        carInTime: null, // 新增开始时
        carOutTime: null,   // 新增结束时间
        disinfection: null,
        status: null,
        carInStartTime: null,
        carInEndTime: null,
        carOutStartTime: null,
        carOutEndTime: null
      }

        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询列表 */
        getList() {
            this.loading = true;
            listPlan(this.queryParams).then(response => {
                this.planlist = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
      // 拆分入场时间范围为开始/结束时间
      handleCarInRangeChange(val) {
        if (val && val.length === 2) {
          this.queryParams.carInStartTime = val[0];
          this.queryParams.carInEndTime = val[1];
        } else {
          this.queryParams.carInStartTime = null;
          this.queryParams.carInEndTime = null;
        }
      },
      // 拆分出场时间范围为开始/结束时间
      handleCarOutRangeChange(val) {
        if (val && val.length === 2) {
          this.queryParams.carOutStartTime = val[0]
          this.queryParams.carOutEndTime = val[1]
        } else {
          this.queryParams.carOutStartTime = null
          this.queryParams.carOutEndTime = null
        }
      },
        handleDy() {
            this.dialogVisible = true
            this.getTestItemList()
        },
        // 在获取检测项目列表时设置选中状态
        getTestItemList() {
            getpagelist(this.testItemQuery).then(response => {
                this.testItemList = response.rows.map(item => ({
                    labtestItemsId: item.labtestItemsId,
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }));

                this.testItemTotal = response.total;

                // 设置选中状态
                this.$nextTick(() => {
                    this.$refs.testItemTable.clearSelection(); // ✅ 清空表格选中状态
                    this.testItemList.forEach(row => {
                        if (this.allSelectedTestItems.has(row.labtestItemsId)) {
                            this.$refs.testItemTable.toggleRowSelection(row, true);
                        }
                    });
                });
            });
        },
        // 处理检测项目选择变化
        handleTestItemSelectionChange(selection) {
            // 更新当前页的选中状态
            const currentPageKeys = this.testItemList.map(item => item.labtestItemsId);

            // 先移除当前页之前选中的但当前未选中的项目
            currentPageKeys.forEach(key => {
                if (this.allSelectedTestItems.has(key) && !selection.some(item => item.labtestItemsId === key)) {
                    this.allSelectedTestItems.delete(key);
                }
            });

            // 添加当前页新选中的项目
            selection.forEach(item => {
                this.allSelectedTestItems.set(item.labtestItemsId, item);
            });
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
        // 重置检测项目查询
        resetTestItemQuery() {
            this.testItemQuery = {
                pageNum: 1,
                pageSize: 10,
                keyword: '',
                tag: '1',
                isEnable: '1'
            };
            this.getTestItemList();
        },
        scslSub() {
            getPlanZs(this.scsl).then((res) => {
                console.log(res, '打印二维码')
                if (res.code == 200) {
                    const encodedData = encodeURIComponent(JSON.stringify(res.data));
                    window.open(`/testewm?printData=${encodedData}`, '_blank');
                }

            })
        },



        /** 搜索按钮操作 */
        handleQuery() {
            this.$refs.queryForm.validate((valid) => {
                if (valid) {
                    // 处理日期范围
                    if (this.queryParams.sendSampleDateRange && this.queryParams.sendSampleDateRange.length === 2) {
                        this.queryParams.sendSampleDateStart = this.queryParams.sendSampleDateRange[0];
                        this.queryParams.sendSampleDateEnd = this.queryParams.sendSampleDateRange[1];
                    } else {
                        this.queryParams.sendSampleDateStart = null;
                        this.queryParams.sendSampleDateEnd = null;
                    }
                    this.queryParams.pageNum = 1;
                    this.getList();
                } else {
                    this.$message.warning('表单验证失败，请检查输入内容');
                    return false;
                }
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.queryParams.sendSampleDateRange = []; // 重置日期范围
            this.queryParams.sendSampleDateStart = null;
            this.queryParams.sendSampleDateEnd = null;
            this.queryParams.status = null;
            this.handleQuery();
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/feedMill/yl/ylPlanCreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.opSamplingPlanId || this.ids
            this.$router.push({ path: '/feedMill/yl/ylPlanCreate', query: { id: id } });
        },

        /** 导出按钮操作 */
        handleExport() {
            // this.download('labtest/feedEntrustOrder/export', {
            //     ...this.queryParams
            // }, `feedEntrustOrder_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
