<template>
    <div class="app-container">
        <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
            <span>{{ submitText }}</span>
            <!--<span v-if="form.isEnable !== undefined" :style="{
                transform: 'rotate(-45deg)',
                display: 'inline-block',
                padding: '6px 6px',
                border: '1px solid',
                borderColor: form.isEnable === '1' ? '#67C23A' : '#F56C6B',
                color: form.isEnable === '1' ? '#67C23A' : '#F56C6B',
                borderRadius: '4px',
                fontSize: '22px',
                marginRight: '20px',
                fontWeight: '900',
                marginTop: '10px'
            }">{{ form.isEnable === '1' ? '已审核' : '已弃审' }}</span>-->
        </div>
        <el-form ref="form" :model="form" :rules="formrules" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="组织" prop="deptName">
                        <!-- <el-select v-model="form.deptName" placeholder="请选择组织" clearable style="width: 100%"
                            @change="handleCustomerSelect">
                            <el-option v-for="(item, index) in idData" :key="index" :label="item.deptName"
                                :value="item.deptId" />
                        </el-select> -->
                        <el-autocomplete v-model="form.deptName" :fetch-suggestions="querySearchAsync"
                            placeholder="请输入内容" @select="handleSelect"></el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="委托单号" prop="entrustOrderNo">
                        <el-input v-model="form.entrustOrderNo" placeholder="自动生成" style="width: 100%" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="状态设置" prop="isEnable">
                        <el-select v-model="form.isEnable" placeholder="状态" clearable style="width: 240px"
                            @clear="form.isEnable = ''">
                            <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row> -->
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="委托时间" prop="entrustTime">
                        <el-date-picker v-model="form.entrustTime" type="datetime" placeholder="选择日期时间"
                            format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="样品数量" prop="sampleQuantity">
                        <el-input v-model="form.sampleQuantity" placeholder="请输入样品数量" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="委托化验室" prop="entrustLab">
                        <el-input v-model="form.entrustLab" placeholder="请输入委托化验室" style="width: 100%" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="上传报告" prop="entrustLab">
                        <el-button type="primary" size="mini" @click="handleImport" v-hasPermi="['system:user:import']">上传报告</el-button>
                        <a :href="uploadUrl" target="_blank" style="color:blue;font-weight:bold">点击下载</a>
                    </el-form-item>

                    <!-- <el-form-item label="上传报告">
                        <el-upload class="upload-demo" :headers="upload.headers" action="upload.url"
                            :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple
                            :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-form-item> -->

                </el-col>

            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="form.remark" placeholder="请输入备注" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="margin-bottom:20px">送检样品</div>

        <!-- 样品明细表格 -->
        <div class="form-section">
            <el-table :data="sjList" border style="width: 100%">
                <el-table-column prop="reportNo" label="序号" min-width="60" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.$index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="样品编号" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.sampleNo" placeholder="自动生成" disabled></el-input>
                    </template>
                </el-table-column>

                <el-table-column label="物料" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleMaterialClick(scope.$index)">选择物料</el-button>
                        <div v-if="scope.row.sampleName" class="selected-material">
                            {{ scope.row.sampleName }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="testItem" label="化验项目" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="openTestItemDialog(scope.$index)">选择检测项目</el-button>
                        <div v-if="scope.row.testItem && scope.row.testItem.length > 0" class="selected-items">
                            <el-tag v-for="item in scope.row.testItem" :key="item.itemId" size="small"
                                style="margin: 2px;">
                                {{ item.itemName }}
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="80" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-delete"
                            @click="removeSample(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addSample"
                style="margin-top: 10px;">添加样品</el-button>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 20px;">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>


        <!-- 物料选择对话框 -->
        <el-dialog title="选择物料" :visible.sync="showMaterialDialog" width="800px" append-to-body
            @open="handleMaterialDialogOpen">
            <el-form :model="materialQueryParams" ref="materialQueryForm" size="small" :inline="true"
                @submit.native.prevent>
                <el-form-item label="物料名称" prop="invbillName">
                    <el-input v-model="materialQueryParams.invbillName" placeholder="请输入物料名称" clearable
                        style="width: 240px" @keyup.enter.native="handleMaterialQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleMaterialQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetMaterialQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="materialOptions" height="400" @row-dblclick="handleMaterialDblClick">
                <el-table-column label="物料名称" align="center" prop="invbillName" />
                <el-table-column label="物料编码" align="center" prop="sapCode" />
                <el-table-column label="部门" align="center" prop="deptName" />
            </el-table>

            <!-- 物料对话框分页 -->
            <div class="pagination-container">
                <el-pagination small :current-page="materialQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
                    :page-size="materialQueryParams.pageSize" layout="total, sizes, prev, pager, next"
                    :total="materialTotal" @size-change="handleMaterialSizeChange"
                    @current-change="handleMaterialCurrentChange">
                </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmMaterialSelection">确 定</el-button>
                <el-button @click="showMaterialDialog = false">取 消</el-button>
            </div>
        </el-dialog>
        <!-- 检测项目选择弹窗 -->
        <el-dialog title="选择检测项目" :visible.sync="testItemDialogVisible" width="800px" append-to-body>
            <el-form :model="testItemQuery" ref="testItemQueryForm" size="small" :inline="true" @submit.native.prevent>
                <el-form-item label="项目名称" prop="keyword">
                    <el-input v-model="testItemQuery.keyword" placeholder="请输入项目名称" clearable style="width: 240px"
                        @keyup.enter.native="getTestItemList" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="getTestItemList">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetTestItemQuery">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table ref="testItemTable" :data="testItemList" height="400"
                @selection-change="handleTestItemSelectionChange">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="itemCode" label="项目编码" align="center"></el-table-column>
                <el-table-column prop="itemName" label="项目名称" align="center"></el-table-column>
            </el-table>

            <!-- 检测项目对话框分页 -->
            <div class="pagination-container">
                <el-pagination small :current-page="testItemQuery.pageNum" :page-sizes="[10, 20, 30, 50]"
                    :page-size="testItemQuery.pageSize" layout="total, sizes, prev, pager, next" :total="testItemTotal"
                    @size-change="handleTestItemSizeChange" @current-change="handleTestItemCurrentChange">
                </el-pagination>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="testItemDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmTestItems">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                    <div class="el-upload__tip" slot="tip">
                        <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                    </div>
                    <span>仅允许导入xls、xlsx格式文件。</span>
                    <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline"
                        @click="importTemplate">下载模板</el-link>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="upload.open = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {

    addobj,
    getdetail,
    updateobj,
    changestatus, requestID
} from "@/api/CentralLaboratory/registration";
import { upload } from "@/api/common/common"
import { getToken } from "@/utils/auth";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getpagelist } from "@/api/Basicdata/Testingitems";
export default {
    dicts: ["is_enable"],
    name: "contactcreate",
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
                email: "",
                isEnable: "",
            },
            submitText: '',
            // 表单参数
            form: {
                deptName: "",
                // // 新增场景：给状态一个默认空值，让标签不显示
                // this.form.isEnable = undefined;
                entrustOrderNo: "",
                entrustTime: "",
                sampleQuantity: "",
                entrustLab: "",
                remark: "",
            },
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/common/upload"
            },
            dateTime: '', // 绑定值，格式如：2025-09-08 10:02
            uploadUrl: "",
            // 表单校验
            formrules: {
                deptName: [
                    { required: true, message: "请选择组织", trigger: "change" },
                ],
                entrustTime: [
                    { required: true, message: "请选择委托时间", trigger: "change" },
                ],
                entrustLab: [
                    { required: true, message: "请输入委托化验室", trigger: "blur" },
                    { min: 1, max: 100, message: "委托化验室长度不能超过100个字符", trigger: "blur" }
                ],
                sampleQuantity: [
                    { required: true, message: "请输入样品数量", trigger: "blur" },
                    { pattern: /^[1-9]\d*$/, message: "样品数量必须是正整数", trigger: "blur" }
                ],
            },
            fileList: [],
            // 搜索框
            restaurants: [],
            state: '',
            timeout: null,
            tableData: [],
            idData: [],
            sjList: [],
            sampleList: [], // 防止误用兜底
            // 物料选择相关
            showMaterialDialog: false,
            currentMaterialIndex: null, // 当前操作的物料行索引
            materialOptions: [],
            materialQueryParams: {
                pageNum: 1,
                pageSize: 10,
                invbillName: '',
                ownDeptId: null, // 添加部门ID参数
                isEnable: '1'
            },
            materialTotal: 0,
            selectedMaterial: null,
            // 检测项目弹窗相关
            testItemDialogVisible: false,
            currentSampleIndex: -1,
            testItemList: [],
            testItemQuery: {
                pageNum: 1,
                pageSize: 10,
                keyword: ''
            },
            testItemTotal: 0,
            selectedTestItems: [],
        };
    },
    created() {
        const op = this.$route.query.op;
        this.submitText = op === 'add' ? '外部送样登记新增' : '外部送样登记修改';

        const rowStr = this.$route.query.row;
        if (rowStr) {
            this.form = JSON.parse(rowStr);   // 反序列化后直接回显
            // 修改场景：如果已带回客户，立即触发打印
            if (this.form.deptName) {
                this.$nextTick(() => {
                    this.handleCustomerSelect(this.form);
                });
            }
        } else {
            // // 新增场景：给状态一个默认空值，让标签不显示
            // this.form.isEnable = undefined;
        }
        this.getList();
        // 默认先加一条空样品行，让表格立即渲染出按钮和输入框
        this.sjList.push({ name: '', materialName: '', testItem: [] });
    },

    methods: {
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            // upload(file).then(() => {
            //     console.log(file, '1111111111111111111')
            // })
            console.log(file);
        },
        handleExceed(files, fileList) {
            // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        handleSelect(item) {
            console.log(item);
        },
        /** 查询【请填写功能名称】列表 */
        getList() {
            this.loading = true;
            // getOutEntrustRegisterpagelist(this.queryParams).then((response) => {
            //     console.log(response, '11111111111');
            //     if (response.code == "200") {
            //         this.tablepagelist = response.rows;
            //         this.total = response.total;
            //         this.loading = false;
            //     }
            // });

            requestID().then((response) => {
                console.log(response.data, '查询id');
                if (response.code == "200") {
                    this.idData = response.data
                    this.restaurants = response.data.map(item => ({
                        value: item.deptName,
                        id: item.deptId
                    }));
                }
            });
        },
        // 新增：定义 reset 方法，用于重置表单和状态
        reset() {
            // 1. 重置表单数据（恢复初始值）
            this.form = {
            deptName: "",
            entrustOrderNo: "",
            entrustTime: "",
            sampleQuantity: "",
            entrustLab: "",
            remark: "",
            isEnable: undefined, // 新增场景默认不显示审核状态标签
            fileAddres: "" // 重置报告上传地址
            };

            // 2. 重置样品列表（保留1条空行，与 created 钩子逻辑一致）
            this.sjList = [{ name: "", materialName: "", testItem: [] }];

            // 3. 重置表单校验状态（如果有表单引用）
            if (this.$refs.form) {
            this.$refs.form.resetFields();
            }

            // 4. 重置物料/检测项目选择相关状态
            this.selectedMaterial = null;
            this.currentMaterialIndex = null;
            this.selectedTestItems = [];
            this.currentSampleIndex = -1;

            // 5. 重置上传组件状态
            this.upload.open = false;
            this.upload.isUploading = false;
            this.uploadUrl = ""; // 重置报告下载地址
        },
        // 取消按钮
        cancel() {
            this.reset(); // 重置表单
            // 关键：删除当前页签并返回列表页
            this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
            // 列表页路由（根据实际路由调整）
            const listRoute = '/CentralLaboratory/registration';
            // 如果列表页已在标签栏中，直接跳转；否则打开列表页
            if (visitedViews.some(view => view.path === listRoute)) {
                this.$router.push(listRoute);
            } else {
                this.$router.replace(listRoute);
            }
            });
        },
        /** 导入按钮操作 */
        handleImport() {
            this.upload.title = "用户导入";
            this.upload.open = true;
        },
        /** 下载模板操作 */
        importTemplate() {
            this.download('system/user/importTemplate', {
            }, `user_template_${new Date().getTime()}.xlsx`)
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
            // console.log(response.url, '111111188555')
            this.uploadUrl = response.url
        },
        // 提交上传文件
        submitFileForm() {
            this.$refs.upload.submit();
        },
        // 点击物料按钮
        handleMaterialClick(index) {
            this.currentMaterialIndex = index; // 记录当前操作的行索引
            this.showMaterialDialog = true;
        },
        /** 获取物料列表 */
        getMaterialList() {
            // 确保查询参数中包含部门ID
            this.materialQueryParams.ownDeptId = this.form.entrustDeptId;
            getinvbilllist(this.materialQueryParams).then(response => {
                this.materialOptions = response.rows;
                this.materialTotal = response.total;
            }).catch(error => {
                console.error("获取物料列表失败:", error);
            });
        },
        /** 物料对话框打开时自动查询 */
        handleMaterialDialogOpen() {
            this.getMaterialList();
            this.selectedMaterial = null; // 清空之前的选择
        },
        // 物料行双击事件
        handleMaterialDblClick(row) {
            this.selectedMaterial = row;
            this.confirmMaterialSelection();
        },
        // 确认物料选择
        confirmMaterialSelection() {
            if (!this.selectedMaterial) {
                this.$message.warning('请选择一个物料');
                return;
            }

            // 将物料信息赋值到当前行的物料字段
            if (this.currentMaterialIndex !== null) {
                const sample = this.sjList[this.currentMaterialIndex];   // ← 改成 sjList
                sample.materialName = this.selectedMaterial.invbillName;
                sample.materialCode = this.selectedMaterial.sapCode;
                sample.invillId = this.selectedMaterial.id;
                sample.invbillName = this.selectedMaterial.invbillName;

                // 清除之前选择的项目，避免显示不一致
                sample.testItem = [];
                const renamed = {
                    ...sample,
                    sampleName: sample.invbillName,
                    sampleId: sample.invillId,
                    sampleCode: sample.materialCode,
                };
                // sample.itemName = itemNames
                // sample.itemId = itemIds
                sample.sampleName = this.selectedMaterial.invbillName;
                sample.sampleCode = this.selectedMaterial.sapCode;
                sample.sampleId = this.selectedMaterial.id;
            }

            this.showMaterialDialog = false;
            this.selectedMaterial = null;
            this.currentMaterialIndex = null;
        },
        /** 物料分页大小变化 */
        handleMaterialSizeChange(val) {
            this.materialQueryParams.pageSize = val;
            this.getMaterialList();
        },

        /** 物料当前页变化 */
        handleMaterialCurrentChange(val) {
            this.materialQueryParams.pageNum = val;
            this.getMaterialList();
        },
        /** 物料查询 */
        handleMaterialQuery() {
            this.materialQueryParams.pageNum = 1;
            this.getMaterialList();
        },

        /** 重置物料查询 */
        resetMaterialQuery() {
            this.materialQueryParams = {
                pageNum: 1,
                pageSize: 10,
                invbillName: '',
                ownDeptId: this.form.deptId, // 保留部门ID
                isEnable: '1'
            };
            this.handleMaterialQuery();
        },
        // 打开检测项目选择弹窗
        openTestItemDialog(index) {
            this.currentSampleIndex = index;
            this.testItemDialogVisible = true;

            // 初始化已选项目
            if (this.sjList[index].testItem) {
                this.selectedTestItems = [...this.sjList[index].testItem];
            } else {
                this.selectedTestItems = [];
            }

            // 获取检测项目列表
            this.getTestItemList();
        },

        // 在获取检测项目列表时设置选中状态
        getTestItemList() {
            getpagelist(this.testItemQuery).then(response => {
                this.testItemList = response.rows.map(item => ({
                    labtestItemsId: item.labtestItemsId, // 使用 API 返回的字段名
                    itemName: item.itemName,
                    itemCode: item.itemCode
                }));

                this.testItemTotal = response.total;

                // 设置已选项目的选中状态
                this.$nextTick(() => {
                    if (this.selectedTestItems.length > 0) {
                        this.testItemList.forEach(row => {
                            const isSelected = this.selectedTestItems.some(
                                selectedItem => selectedItem.labtestItemsId === row.labtestItemsId // 使用 labtestItemsId 比较
                            );
                            if (isSelected) {
                                this.$refs.testItemTable.toggleRowSelection(row, true);
                            }
                        });
                    }
                });
            });
        },

        // 处理检测项目选择变化
        handleTestItemSelectionChange(selection) {
            this.selectedTestItems = selection;
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
                keyword: ''
            };
            this.getTestItemList();
        },

        // 确认选择的检测项目
        confirmTestItems() {
            if (this.currentSampleIndex !== -1) {
                const sample = this.sjList[this.currentSampleIndex];

                // 保存检测项目信息，将 labtestItemsId 赋值给 itemId
                sample.testItem = this.selectedTestItems.map(item => ({
                    itemId: item.labtestItemsId, // 这里将 labtestItemsId 赋值给 itemId
                    itemName: item.itemName,
                    itemCode: item.itemCode,

                }));
                const itemNames = sample.testItem.map(item => item.itemName).join(',');
                const itemIds = sample.testItem.map(item => item.itemId).join(',');
                console.log('itemName:', itemNames);
                // this.form.itemName = itemNames
                // this.form.itemId = itemIds
                console.log('itemId:', itemIds);
                sample.itemName = itemNames
                sample.itemId = itemIds
                // const renamed = {
                //     ...sample,
                //     sampleName: sample.invbillName,
                //     sampleId: sample.invillId,
                //     sampleCode: sample.materialCode,
                // };
                // delete sample.testItem;

                // delete renamed.userName;

                // console.log(renamed, '新增接口表单');

                // console.log('保存的检测项目:', sample.testItem); // 添加调试日志
                // 分开打印名称和ID

            }
            this.testItemDialogVisible = false;
        },

        /** 新增按钮操作 */
        handleAdd() {
            // this.reset();
            // this.open = true;
            // this.isregiet = false;
            // this.title = "通讯方式创建";
            this.$router.push('/basicdata/contactcreate');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const labtestItemsId = row.labtestItemsId;
            getdetail(labtestItemsId).then((response) => {
                if (response.code == "200") {
                    if (response.data) {
                        this.form = response.data;
                        this.open = true;
                        this.isregiet = true;
                        this.title = "修改";
                    }
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            console.log(this.form);
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    if (this.submitText == "外部送样登记修改") {
                        // 调取修改接口
                        this.form.opOutentrustRegisterSampleList = this.sjList
                        console.log(this.form, '11111222222')
                        // updateobj(this.form).then((response) => {
                        //     console.log(response, '修改接口');
                        //     if (response.code == "200") {
                        //         this.getList();
                        //         // this.tablepagelist = response.rows;
                        //         // this.total = response.total;
                        //         // this.loading = false;
                        //     }
                        // });

                        this.form.fileAddres = this.uploadUrl


                        this.loading = true;
                        updateobj(this.form).then((response) => {
                            this.loading = false;
                            if (response.code == "200") {
                                this.$modal.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            }
                        });
                    } else {
                        // 调取新增接口

                        this.form.opOutentrustRegisterSampleList = this.sjList
                        console.log(this.form, '新增接口表单')
                        const renamed = {
                            ...this.form,
                            sampleName: this.form.invbillName,
                            sampleId: this.form.invillId,
                            sampleCode: this.form.materialCode,
                        };
                        delete renamed.materialName;
                        delete renamed.opOutentrustRegisterSampleList.testItem;
                        delete renamed.name;

                        this.form.fileAddres = this.uploadUrl

                        console.log(renamed, '改后新增接口表单');
                        // this.form = Object.assign({}, this.form, this.sjList);
                        addobj(this.form).then((response) => {
                            // console.log(response, '外部送检新增接口');
                            if (response.code == "200") {
                                // this.$modal.msgSuccess("新增成功");
                                this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                                    // 返回上一页或首页
                                    const latestView = visitedViews.slice(-1)[0];
                                    if (latestView) {
                                        this.$router.push(latestView.fullPath);
                                    } else {
                                        this.$router.push('/');
                                    }
                                });
                                // this.getList();
                                // this.tablepagelist = response.rows;
                                // this.total = response.total;
                                // this.loading = false;
                            }
                        });



                        // this.loading = true;
                        // addobj(this.form).then((response) => {
                        //     this.loading = false;
                        //     if (response.code == "200") {
                        //         this.$modal.msgSuccess("新增成功");
                        //         this.open = false;
                        //         this.getList();
                        //     }
                        // });
                    }
                } else {
                    this.$modal.msgError("请检查必填项是否填写");
                }
            });
        },
        // 状态修改
        handleStatusChange(row) {
            let text = row.isEnable === "1" ? "启用" : "停用";
            this.$modal
                .confirm('确认要"' + text + '""' + row.itemName + '"角色吗？')
                .then(function () {
                    return changestatus(row.labtestItemsId, row.isEnable);
                })
                .then(() => {
                    this.$modal.msgSuccess(text + "成功");
                    this.getList();
                })
                .catch(function () {
                    row.isEnable = row.isEnable === "0" ? "1" : "0";
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                "/basicdata/labTestItems/export",
                {
                    ...this.queryParams,
                },
                `检测项目_${new Date().getTime()}.xlsx`
            );
        },
        /** 表格选中行 **/
        handleSelectionChange(val) {
            console.log('当前选中行：', val);
        },
        // 选中客户后打印完整信息
        handleCustomerSelect(row) {
            // const row = this.idData.find(item => item.deptId === deptId);
            console.log('选中客户信息：', row);
            this.uploadUrl = row.fileAddres || "";
            // getdetail(1).then((response) => {
            //     if (response.code == "200") {
            //         if (response.data) {
            //             console.log(response.data.bsContactInfoList, '联系人')
            //             this.tableData = response.data.bsContactInfoList
            //             // this.form = response.data;
            //             // this.open = true;
            //             // this.isregiet = true;
            //             // this.title = "修改";
            //         }
            //     }
            // });
            getdetail(row.id).then((response) => {
                if (response.code == "200") {
                    console.log(response.data.opOutentrustRegisterSampleList, '11111111111111111111111')
                    if (response.data) {
                        this.sjList = response.data.opOutentrustRegisterSampleList
                        console.log(this.sjList, '222222222222222')
                        // this.form = response.data;
                        // this.open = true;
                        // this.isregiet = true;
                        // this.title = "修改";
                    }
                }
            });
        },
        // 添加样品
        addSample() {
            this.sjList.push({
                name: '',
                model: '',
                produceDate: '',
                testItem: [],
                remark: ''
            });
        },
        // 删除样品
        removeSample(index) {
            this.sjList.splice(index, 1);
        },
    },
};
</script>

<style scoped>
.el-form-item {
    margin-bottom: 20px;
}

.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
}

.el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
}
</style>
