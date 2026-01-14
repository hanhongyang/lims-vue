<template>
    <div class="app-container">
        <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
            <span>{{ submitText }}</span>
            <!-- <span v-if="form.isEnable !== undefined" :style="{
                transform: 'rotate(-45deg)',
                display: 'inline-block',
                padding: '2px 6px',
                border: '1px solid',
                borderColor: form.isEnable === '1' ? '#67C23A' : '#F56C6B',
                color: form.isEnable === '1' ? '#67C23A' : '#F56C6B',
                borderRadius: '4px',
                fontSize: '22px',
                marginRight: '20px',
                fontWeight: '900'
            }">{{ form.isEnable === '1' ? '启用' : '停用' }}</span> -->
        </div>
        <el-form ref="form" :model="form" :rules="formrules" label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="指定部门" prop="deptName">
                        <el-select v-model="form.deptName" placeholder="指定部门" clearable style="width: 240px"
                            @change="handleCustomerSelect">
                            <el-option v-for="(item, index) in idData" :key="index" :label="item.deptName"
                                :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email" placeholder="邮箱" />
                    </el-form-item>
                </el-col> -->
            </el-row>

            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="创建人" prop="createBy">
                        <el-input v-model="form.createBy" placeholder="自动生成" disabled />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="创建时间" prop="createTime">
                        <el-input v-model="form.createTime" placeholder="自动生成" disabled />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="24">
                    <el-form-item label="备注" prop="remark">
                        <el-input type="textarea" v-model="form.remark" placeholder="备注" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="检测项目" name="检测项目">
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini"
                            @click="getlabtestItemsList()">添加</el-button>
                    </el-col>
                </el-row>
                <el-table style="width: 100%" :data="labtestItemsList">
                    <!-- <el-table-column type="index" align="center" label="序号" width="50" /> -->
                    <el-table-column label="检测项目编码" align="center" prop="itemCode" min-width="200" />
                    <el-table-column label="检测项目名称" align="center" prop="itemName" min-width="200" />
                    <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width"
                        fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete"
                                @click="labtestItemsDelete(scope.$index)" style="color: red">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <selectLandXM ref="selectLandXM" :labtestItemsList="labtestItemsList" @affirm="agriaffirm" />
        <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 20px;">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </div>
</template>

<script>
import {
    getpagelist,
    addobj,
    getdetail,
    updateobj,
    changestatus, requestID
} from "@/api/Basicdata/designatedDeptId";
import {
    getlabtestItemsList,
} from "@/api/Basicdata/RYJCXMcompare";
import selectLandXM from "./selectLandXM";
export default {
    dicts: ["is_enable", "email_receive_type"],
    name: "designatedDeptIdcreate",
    components: { selectLandXM },
    data() {
        return {
            activeName: "检测项目",
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
                deptId: localStorage.getItem("deptId"),
                deptName: "",
                // // 新增场景：给状态一个默认空值，让标签不显示
                // this.form.isEnable = undefined;
                createBy: "",
                createTime: "",
                remark: "",
            },
            // 表单校验
            formrules: {
                deptName: [
                    { required: true, message: "请输入公司名称", trigger: "blur" },
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                ],
                isEnable: [
                    { required: true, message: "请输入状态", trigger: "blur" },
                ],
            },
            tableData: [],
            idData: [],
            bsContactInfoList: [],
            labtestItemsList: [],
        };
    },
    created() {
        const op = this.$route.query.op;
        this.submitText = op === 'add' ? '指定部门检测新增' : '指定部门检测修改';

        const rowStr = this.$route.query.row;
        console.log(rowStr, 'rowStr');
        if (rowStr) {
            getdetail(rowStr).then((response) => {
                if (response.code == "200") {
                    console.log(response.data, '查询详细信息');
                    const d = response.data;

                    /* 1. 基础信息 */
                    this.form = {
                        deptId: localStorage.getItem("deptId"),   // 注意接口返回的是 designatedDeptId
                        designatedDeptId: d.designatedDeptId,   // 注意接口返回的是 designatedDeptId
                        deptName: d.designatedDeptName,                   // 先空，等 idData 加载完再补
                        remark: d.remark,
                        createBy: d.createBy,
                        createTime: d.createTime
                    };

                    /* 2. 检测项目（只有一条） */
                    this.labtestItemsList = [{
                        labtestItemsId: d.itemId,
                        itemName: d.itemName,
                        itemCode: d.itemCode
                    }];

                }
            });

        } else {
            // // 新增场景：给状态一个默认空值，让标签不显示
            // this.form.isEnable = undefined;
        }
        this.getList();
    },
    methods: {
        // 获取项目
        getlabtestItemsList() {
            this.$refs.selectLandXM.show();
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        /** 牧场列表新增按钮操作 */
        agriaffirm(selectData) {
            this.labtestItemsList = [selectData];
            console.log(this.labtestItemsList);

        },
        labtestItemsDelete() {
            // 不管点哪行，直接清空数组
            this.labtestItemsList = [];
        },
        /** 查询【请填写功能名称】列表 */
        getList() {
            this.loading = true;
            // getpagelist(this.queryParams).then((response) => {
            //     console.log(response, '11111111111');
            //     if (response.code == "200") {
            //         this.tablepagelist = response.rows;
            //         this.total = response.total;
            //         this.loading = false;
            //     }
            // });

            requestID().then((response) => {
                // console.log(response.data, '查询id');
                if (response.code == "200") {
                    this.idData = response.data
                }
            });
        },
        // 取消按钮
        cancel() {
            // 若页面有 tagsView 插件，删除当前视图并跳转到最后一个访问页；否则直接后退
            if (this.$store && this.$store.dispatch) {
                this.$store.dispatch('tagsView/delView', this.$route).then(({ visitedViews }) => {
                    const latestView = visitedViews && visitedViews.length ? visitedViews.slice(-1)[0] : null;
                    if (latestView) {
                        this.$router.push(latestView.fullPath);
                    } else {
                        this.$router.push('/');
                    }
                }).catch(() => {
                    // 兜底：直接返回上一页
                    this.$router.go(-1);
                });
            } else {
                this.$router.go(-1);
            }
        },
        // 表单重置
        reset() {
            this.form = {
                labtestItemsId: "",
                itemName: "",
                itemCode: "",
            };
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

                    // ********************
                    // ** 新增代码：调用表格校验 **
                    if (!this.validateContactsTable()) {
                        // 如果表格校验失败，则停止提交
                        return;
                    }
                    // ********************
                    /* ===== 检测项目拼接开始 ===== */
                    const names = [];
                    const codes = [];
                    const ids = [];
                    this.labtestItemsList.forEach(item => {
                        names.push(item.itemName);
                        codes.push(item.itemCode);
                        ids.push(item.labtestItemsId);   // 注意你这里是 labtestItemsId 不是 itemId
                    });
                    this.form.itemName = names.join(',');
                    this.form.itemCode = codes.join(',');
                    this.form.itemId = ids.join(',');
                    delete this.form.deptName;
                    if (this.submitText == "指定部门检测修改") {
                        this.form.opSamplingTestItemDeptId = this.$route.query.row;
                        updateobj(this.form).then((response) => {
                            console.log(response, '修改接口');
                            if (response.code == "200") {
                                this.$modal.msgSuccess("修改成功");
                                this.getList();
                                // this.tablepagelist = response.rows;
                                // this.total = response.total;
                                // this.loading = false;
                            }
                        });
                        // 修改后重新回显，且把 isReceive 转为 receiveTypes 数组
                        getdetail(this.$route.query.row).then((response) => {
                            if (response.code == "200") {
                                console.log(response.data, '查询详细信息');
                                const d = response.data;

                                /* 1. 基础信息 */
                                this.form = {
                                    deptId: localStorage.getItem("deptId"),   // 注意接口返回的是 designatedDeptId
                                    designatedDeptId: d.designatedDeptId,   // 注意接口返回的是 designatedDeptId
                                    deptName: '',                   // 先空，等 idData 加载完再补
                                    remark: d.remark,
                                    createBy: d.createBy,
                                    createTime: d.createTime
                                };

                                /* 2. 检测项目（只有一条） */
                                this.labtestItemsList = [{
                                    labtestItemsId: d.itemId,
                                    itemName: d.itemName,
                                    itemCode: d.itemCode
                                }];

                            }
                        });
                    } else {




                        this.loading = true;
                        addobj(this.form).then((response) => {
                            this.loading = false;
                            if (response.code == "200") {
                                this.$modal.msgSuccess("新增成功");
                                this.open = false;
                                // this.getList();
                            }
                        });
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
        // 选中公司后打印完整信息
        handleCustomerSelect(deptId) {
            const row = this.idData.find(item => item.deptId === deptId);
            console.log('选中公司信息：', row);

            this.form.designatedDeptId = row.deptId
            this.form.deptName = row.deptName
            // getdetail(row.deptId).then((response) => {
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
        },
        // 新增联系人行（默认无接收类型）
        addSample() {
            this.tableData.push({
                contactPerson: '',
                contactPhone: '',
                contactEmail: '',
                // 新字段：接收类型数组（多选）
                receiveTypes: [],
                // 新增字段：是否默认送样人，默认值为"0"（否）
                isDefaultSendSampleUser: '0'
            });
        },
        // 删除联系人行
        removeSample(index) {
            this.tableData.splice(index, 1);
        },
        /** 校验联系人表格 */
        validateContactsTable() {
            // 如果没有联系人数据，则跳过校验
            if (!this.tableData || this.tableData.length === 0) {
                return true;
            }

            let haveReceiver = false;
            // 简单的邮箱格式校验
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            for (let i = 0; i < this.tableData.length; i++) {
                const row = this.tableData[i];
                const rowIndex = i + 1; // 用于提示用户第几行

                // 必填：姓名、电话、邮箱
                if (!row.contactPerson || row.contactPerson.trim() === '') {
                    this.$modal.msgError(`联系人表格第 ${rowIndex} 行：请输入联系人`);
                    return false;
                }
                if (!row.contactPhone || row.contactPhone.trim() === '') {
                    this.$modal.msgError(`联系人表格第 ${rowIndex} 行：请输入电话`);
                    return false;
                }
                if (!row.contactEmail || row.contactEmail.trim() === '') {
                    this.$modal.msgError(`联系人表格第 ${rowIndex} 行：请输入邮箱`);
                    return false;
                }

                // 邮箱格式
                if (!emailRegex.test(row.contactEmail)) {
                    this.$modal.msgError(`联系人表格第 ${rowIndex} 行：邮箱格式不正确`);
                    return false;
                }

                // 至少有一个联系人选择了接收类型
                if (Array.isArray(row.receiveTypes) && row.receiveTypes.length > 0) {
                    haveReceiver = true;
                }
            }

            // 新规则：至少有一个联系人配置了接收报告类型
            if (!haveReceiver) {
                this.$modal.msgError('请至少为一个联系人指定接收报告类型');
                return false;
            }
            // 可以添加对默认送样人的额外校验逻辑
            // 例如：确保只有一个默认送样人
            const defaultSendSampleUsers = this.tableData.filter(row => row.isDefaultSendSampleUser === '1');
            if (defaultSendSampleUsers.length > 1) {
                this.$modal.msgError('只能设置一个默认送样人');
                return false;
            }

            // 所有校验通过
            return true;
        },




    },
};
</script>
