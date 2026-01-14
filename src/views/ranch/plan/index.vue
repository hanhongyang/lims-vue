<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="车牌号" prop="driverCode">
                <el-input v-model="queryParams.driverCode" placeholder="请输入车牌号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="司机" prop="driverName">
                <el-input v-model="queryParams.driverName" placeholder="请输入司机" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTimeRange">
                <el-date-picker clearable v-model="queryParams.createTimeRange" type="daterange"
                    value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                    style="width: 240px">
                </el-date-picker>
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
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>


        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="待取样计划" name="0" />
            <el-tab-pane label="已取样" name="1" />
        </el-tabs>
        <el-table v-loading="loading" :data="planlist" height="60vh">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="状态" align="center" prop="status" width="80">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sampling_plan_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="车牌号" align="center" prop="driverCode" />
            <!-- <el-table-column label="供应商" align="center" prop="supplierName" /> -->
            <el-table-column label="司机" align="center" prop="driverName" />
            <el-table-column label="消毒方式" align="center" prop="disinfection" />
            <el-table-column label="消毒药" align="center" prop="toxicide" />
            <el-table-column label="浓度" align="center" prop="density" />
            <!-- <el-table-column label="责任人" align="center" prop="personLiable" /> -->
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
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit"
                        @click="handleUpdate(scope.row)">详情</el-button>
                    <el-button size="mini" @click="openUploadDialog(scope.row)">
                        随车质检单补传
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog title="上传" :visible.sync="uploadVisible" width="400px" append-to-body @close="closeUpload">
            <el-upload ref="upload" :action="uploadAction" :headers="uploadHeaders" name="file"
                :on-success="handleUploadSuccess" :on-error="handleUploadError" :on-remove="handleRemove"
                list-type="picture-card" :limit="99" :file-list="uploadFileList"
                :on-exceed="() => $message.warning('最多上传1张')">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeUpload">关 闭</el-button>
                <el-button @click="BCUpload">补 传</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import { listFeedEntrustOrder, } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listPlan, getPlanZs,updatePlan } from "@/api/feedfactory/plan";
// import { getpagelist } from "@/api/Basicdata/Testingitems";
import { getToken } from '@/utils/auth'
export default {
    name: "sampling",
    dicts: ['entrust_order_status', 'sampling_plan_status'],
    data() {
        return {
            uploadVisible: false,   // 控制弹窗显隐
            uploadAction: `${process.env.VUE_APP_BASE_API}/file/uploadAndGetUrl`,
            uploadFileList: [],  // el-upload 的初始文件列表
            dialogImageUrl: '',
            activeTab: '0',   // 默认待取样计划
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
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                newSamplingTypes: '3',
                driverCode: null,
                driverName: null,
                supplierName: null,
                carInTime: null, // 新增开始时间
                carOutTime: null,   // 新增结束时间
                disinfection: null,
                status: null,
                createTimeRange: null,      // 新增：日期范围数组
                createStartTime: null,      // 新增：开始时间
                createEndTime: null         // 新增：结束时间
            },

        };
    },
    created() {
        this.queryParams.status = this.activeTab; // 默认第一次加载
        this.getList();
    },
    computed: {
        uploadHeaders() {
            return {
                Authorization: 'Bearer ' + getToken()
            };
        },
    },
    methods: {
        // 上传成功
        handleUploadSuccess(res, file) {
            console.log('上传成功返回数据：', res);
            if (res.code == 200 && res.data) {
                const { fileId, fileUrl } = res.data;

                // 1. 拆成数组（空字符串时变成空数组）
                let idArr = this.currentUploadRow.carFileId ? this.currentUploadRow.carFileId.split(',') : [];
                let urlArr = this.currentUploadRow.carFileUrl ? this.currentUploadRow.carFileUrl.split(',') : [];

                // 2. 追加新值
                idArr.push(fileId);
                urlArr.push(fileUrl);

                // 3. 重新拼成逗号字符串
                this.$set(this.currentUploadRow, 'carFileId', idArr.join(','));
                this.$set(this.currentUploadRow, 'carFileUrl', urlArr.join(','));
                console.log('保存后 currentUploadRow:', this.currentUploadRow);
                this.$message.success(`上传成功`);

            } else {
                this.$message.error(res.msg || '上传失败');
            }

        },
        // 上传失败
        handleUploadError(err) {
            console.error('上传失败：', err);
            this.$message.error('上传失败，请重试');
        },
        // 打开上传弹窗
        openUploadDialog(row) {
            console.log(row, '11111111111')
            this.currentUploadRow = row;
            this.uploadSampleName = row.name;
            this.uploadVisible = true;

            row.carFileUrl.split(',').forEach(item => {
                this.uploadFileList.push({
                    name: item,
                    url: item
                })
                // ★★★ 等数据设置完成后再打开弹窗 ★★★
                this.$nextTick(() => {
                    this.uploadVisible = true;
                });
            })

            // // ★★★ 关键：根据已保存的 fileUrl 恢复显示 ★★★
            // if (row.fileUrl) {
            //     this.uploadFileList = [{
            //         name: row.fileName || '已上传图片',
            //         url: URL.createObjectURL(blob)
            //     }];
            // } else {
            //     this.uploadFileList = [];
            // }





        },
        // 补传
        BCUpload() {
            console.log(this.currentUploadRow, '11111111111')
            updatePlan({
                opSamplingPlanId: this.currentUploadRow.opSamplingPlanId,
                carFileId: this.currentUploadRow.carFileId,
            }).then(res => {
                if (res.code == 200) {
                    this.$message.success(`补传成功`);
                    this.closeUpload();
                } else {
                    this.$message.error(res.msg || '补传失败');
                }
            })
        },
        // 关闭弹窗
        closeUpload() {
            // ★★★ 不需要 clearFiles，数据已保存在 row 中 ★★★
            this.currentUploadRow = null;
            this.uploadSampleName = '';
            this.uploadFileList = [];
            this.uploadVisible = false;
        },
        handleRemove(file, fileList) {
            const url = file.url || file.response?.data?.fileUrl;
            let urlArr = this.currentUploadRow.carFileUrl.split(',');
            let idArr = this.currentUploadRow.carFileId.split(',');
            const idx = urlArr.indexOf(url);
            if (idx > -1) {
                urlArr.splice(idx, 1);
                idArr.splice(idx, 1);
                this.$set(this.currentUploadRow, 'carFileUrl', urlArr.join(','));
                this.$set(this.currentUploadRow, 'carFileId', idArr.join(','));
            }
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },






        /** tab 切换 */
        handleTabClick() {
            this.queryParams.status = this.activeTab; // 0 或 1
            this.queryParams.pageNum = 1;             // 回到第一页
            this.getList();
        },
        /** 查询列表 */
        getList() {
            this.loading = true;
            delete this.queryParams.createTimeRange;
            listPlan(this.queryParams).then(response => {
                this.planlist = response.rows;
                this.total = response.total;
                this.loading = false;
            });
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
            // 处理日期范围
            if (this.queryParams.createTimeRange && this.queryParams.createTimeRange.length === 2) {
                this.queryParams.createStartTime = this.queryParams.createTimeRange[0];
                this.queryParams.createEndTime = this.queryParams.createTimeRange[1];
            } else {
                this.queryParams.createStartTime = null;
                this.queryParams.createEndTime = null;
            }
            this.queryParams.pageNum = 1;
            if (this.queryParams.status == 0) {
                this.activeTab = '0'
            } else {
                this.activeTab = '1'
            }
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            // 把非 tab 条件清掉，但保留当前页签
            this.queryParams.driverCode = null;
            this.queryParams.driverName = null;
            this.queryParams.supplierName = null;
            this.queryParams.carInTime = null;
            this.queryParams.carOutTime = null;
            this.queryParams.createTimeRange = null;    // 新增
            this.queryParams.createStartTime = null;    // 新增
            this.queryParams.createEndTime = null;      // 新增
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /** 新增按钮操作 */
        handleAdd() {
            this.$router.push('/ranch/plancreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const id = row.opSamplingPlanId || this.ids
            this.$router.push({ path: '/ranch/plancreate', query: { id: id } });
        },


        /** 导出按钮操作 */
        handleExport() {
            this.download('ranch/plan/export', {
                ...this.queryParams
            }, `原料取样_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>