<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="工厂" prop="deptName">
                <el-input v-model="queryParams.deptName" placeholder="请选择工厂" clearable @keyup.enter.native="handleQuery"
                    readonly>
                    <template #append>
                        <el-button slot="append" icon="el-icon-search" @click="getDept()"></el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="车牌号" prop="cartLicensePlateNumber">
                <el-input v-model="queryParams.cartLicensePlateNumber" placeholder="请输入车牌号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="状态" prop="cartStatus">
                <el-input v-model="queryParams.cartStatus" placeholder="请输入状态" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-zoom-in" size="mini" @click="handleAdd"
                    :loading="btnLoad">新增
                </el-button>
                <el-button type="primary" plain icon="el-icon-zoom-in" size="mini" @click="getInfoAll"
                    :loading="btnLoad">导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-progress v-if="ifProgress" :percentage="percentage"></el-progress>

        <el-table v-loading="loading" :data="milkcarlist" max-height="610px" style="width: 100%;">

            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="车牌号" align="center" prop="cartLicensePlateNumber" width="200" />
            <el-table-column label="状态" align="center" prop="cartStatus" min-width="220" />
            <el-table-column label="司机姓名" align="center" prop="cartDriverName" min-width="220" />
            <el-table-column label="司机电话" align="center" prop="cartDriverPhone" min-width="220" />
            <el-table-column label="铅封号" align="center" prop="cartLeadSealNumber" min-width="220" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 修改铅封号对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="工厂" prop="deptName">
                    <el-input v-model="form.deptName" placeholder="请选择工厂" clearable
                        @keyup.enter.native="handleQuery" readonly>
                        <template #append>
                            <el-button slot="append" icon="el-icon-search" @click="getDept()"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="车牌号" prop="cartLicensePlateNumber">
                    <el-input v-model="form.cartLicensePlateNumber" placeholder="请输入车牌号" />
                </el-form-item>
                <el-form-item label="司机姓名" prop="cartDriverName">
                    <el-input v-model="form.cartDriverName" placeholder="请输入司机姓名" />
                </el-form-item>
                <el-form-item label="司机电话" prop="cartDriverPhone">
                    <el-input v-model="form.cartDriverPhone" placeholder="请输入司机电话" />
                </el-form-item>
                <el-form-item label="铅封号">
                    <el-card v-for="(item, index) in form.milkCartInfoLeadSealList" :key="index" shadow="hover"
                        style="margin-bottom:12px;">
                        <el-row :gutter="12">
                            <el-col :span="10">
                                <el-input v-model="item.cartLeadSealNumber" placeholder="铅封号" clearable />
                            </el-col>
                            <el-col :span="10">
                                <el-input v-model="item.cartBarrelNumber" placeholder="灌口号" clearable />
                            </el-col>
                            <el-col :span="4" style="text-align:right;">
                                <el-button type="text" icon="el-icon-delete" style="color:#F56C6C"
                                    :disabled="form.milkCartInfoLeadSealList.length === 1"
                                    @click="removeSeal(index)">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-card>

                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addSeal">添加</el-button>
                </el-form-item>
                <el-form-item label="状态" prop="cartStatus">
                    <el-input v-model="form.cartStatus" placeholder="请输入状态" />
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }"
                        placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 部门选择弹窗 -->
        <el-dialog title="选择使用部门" :visible.sync="opendpt" width="800px" append-to-body>
            <!-- <el-form :model="queryParams2" ref="queryParams2" size="small" :inline="true">
                <el-form-item label="工厂名称" prop="deptName">
                    <el-input v-model="queryParams2.deptName" placeholder="请输入工厂名称" clearable style="width: 240px"
                        @keyup.enter.native="handleQuery2" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
                </el-form-item>
            </el-form> -->
            <el-row>
                <el-table :data="deptList" ref="table" style="width: 100%" height="60vh" @row-click="deptclick">
                    <el-table-column label="工厂名称" align="center" prop="deptName" :show-overflow-tooltip="true" />
                </el-table>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>

import func from '@/utils/func';

import { listInfo, addInfo, updateInfo, delInfo, getInfo } from '@/api/Basicdata/milkcar'
// import { listDept } from "@/api/system/dept";
import { getLoginUserDept, listDept } from "@/api/system/dept";

export default {
    name: 'materialindex',
    dicts: ['sys_yes_no2', 'invbill_tag'],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 奶车列表数据
            milkcarlist: [],
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                cartLicensePlateNumber: '',
                cartStatus: '',
            },
            // 详情参数
            form: {
                // 不设置这个数组会报错
                // 关键：初始即有一张卡片
                milkCartInfoLeadSealList: [
                    { cartLeadSealNumber: '', cartBarrelNumber: '' }
                ]

            },
            isEdit: false,
            deptId: '',
            deptList: [],
            // 工厂查询参数
            queryParams2: {
                pageNum: 1,
                pageSize: 20,
                deptName: ""
            },
            opendpt: false,




            activeNames: ['1'],
            // 部门选择相关数据
            deptDialogVisible: false, // 部门弹窗显示状态
            deptTreeData: [], // 部门树形数据
            selectedDeptNames: [], // 选中的部门名称列表
            defaultProps: {
                children: 'children',
                label: 'deptName'
            },





            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,


            // 表单校验
            rules: {

            },
            btnLoad: false,
            ifProgress: false,
            percentage: 0
        };
    },
    created() {

        this.getCurrentDeptInfo(); // 预加载部门列表
        this.getDeptList(); // 预加载部门列表

    },
    methods: {
        /** 查询工厂列表 */
        getDept() {
            this.loading = true;
            // 设置不分页参数
            const params = {
                pageNum: 1,
                pageSize: 999, // 设置足够大的pageSize获取所有数据
                // deptName: this.queryParams2.deptName || ""
            };
            listDept(params).then((response) => {
                this.deptList = response.data || [];
                this.depttotal = response.total || 0;
                this.loading = false;
                this.opendpt = true;
                this.title = "选择工厂";
            })
        },
        // 新增一张卡片
        addSeal() {
            // 如果数组不存在，先初始化为空数组
            if (!this.form.milkCartInfoLeadSealList) {
                this.$set(this.form, 'milkCartInfoLeadSealList', []);
            }
            this.form.milkCartInfoLeadSealList.push({
                cartLeadSealNumber: '',
                cartBarrelNumber: ''
            });
        },
        // 删除指定卡片
        removeSeal(index) {
            this.form.milkCartInfoLeadSealList.splice(index, 1);
        },
        /** 搜索按钮操作 */
        handleQuery2() {
            this.getDept();
        },
        /** 重置按钮操作 */
        resetQuery2() {
            this.resetForm("queryForm");
            this.queryParams2.deptName = ""; // 只重置搜索条件
            this.getDept();
        },
        deptclick(val) {
            // this.queryParams.deptId = val.deptId
            this.form.deptName = val.deptName
            this.opendpt = false;
        },
        // 获取当前机构信息
        getCurrentDeptInfo() {
            getLoginUserDept().then(response => {
                console.log(response, '当前登录信息')
                if (response.code === 200) {
                    // this.form.deptId = response.data.deptId
                    this.queryParams.deptId = response.data.deptId
                    this.currentDept = response.data;
                    this.getList(); //奶车列表数据
                }
            });
        },
        /** 获取部门列表并转换为树形结构 */
        getDeptList() {
            return new Promise((resolve, reject) => {
                if (this.deptTreeData.length === 0) {
                    listDept().then(response => {
                        console.log(response, '信息2')
                        if (response.code === 200) {
                            // 将扁平数据转换为树形结构
                            this.deptTreeData = this.buildDeptTree(response.data);
                            resolve(this.deptTreeData);
                        } else {
                            reject(new Error('获取部门列表失败'));
                        }
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    // 如果已经加载过，直接返回现有数据
                    resolve(this.deptTreeData);
                }
            });
        },
        // 获取奶车信息列表
        getList() {
            this.loading = true;
            delete this.queryParams.deptName;
            listInfo(this.queryParams).then(response => {
                console.log(response, '列表')
                this.milkcarlist = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.isEdit = false;
            this.title = '新增奶车信息';
            this.open = true;
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            getInfo(row.id).then((res) => {
                console.log(res, '详情')
                if (res.code === 200) {
                    this.form = res.data
                }
            })
            this.isEdit = true;
            this.title = '编辑奶车信息';

            // 1. 把后端返回的逗号分隔字符串拆成数组，并补够 3 条
            const sealNumberArray = row.cartLeadSealNumber
                ? row.cartLeadSealNumber.split(',').slice(0, 3)
                : [];
            while (sealNumberArray.length < 3) {
                sealNumberArray.push('');
            }

            // 2. 回显表单
            // this.form = {
            //     ...this.form,
            //     id: row.id,
            //     cartStatus: row.cartStatus,
            //     cartLicensePlateNumber: row.cartLicensePlateNumber,
            //     cartDriverName: row.cartDriverName,
            //     cartDriverPhone: row.cartDriverPhone,
            //     remark: row.remark,
            //     // 关键：把铅封号数组赋进来
            //     milkCartInfoLeadSealList: sealNumberArray.map(num => ({
            //         cartLeadSealNumber: num,
            //         cartBarrelNumber: ''   // 如果后端也返回灌口号，同理处理
            //     }))
            // };

            this.open = true;
        },
        // 删除按钮操作
        handleDelete(row) {
            delInfo(row.id).then((res) => {
                this.getDept()
                this.$message({
                    message: '删除成功',
                    type: 'success'
                });
            })
        },
        /** 提交表单 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    const formData = {
                        ...this.form,
                    };
                    console.log(formData, '提交数据')

                    if (this.isEdit) {
                        // 编辑操作
                        updateInfo(formData).then(response => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        // 新增操作
                        addInfo(formData).then(response => {
                            this.$modal.msgSuccess('新增成功');
                            this.open = false;
                            this.getList();
                        });
                    }
                }
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
                id: undefined,
                cartLicensePlateNumber: '',
                cartDriverName: '',
                cartDriverPhone: '',
                cartStatus: '',
                remark: '',

            };
            this.resetForm("form");
            this.isEdit = false;
        },
        getInfoAll() {
            this.download('/basicdata/info/export', {
                ...this.queryParams
            }, `奶车信息_${new Date().getTime()}.xlsx`)
        },









        handleChange(val) {
            console.log(val);
        },
        /** 部门选择相关方法 */



        /** 打开部门选择弹窗 */
        openDeptDialog() {
            this.deptDialogVisible = true;
            this.$nextTick(() => {
                if (this.$refs.deptTree) {
                    // 设置已选中的部门 - deptSapCode 的值取自 sapName
                    const selectedDeptSapCodes = this.form.invbillDepts.map(dept => dept.deptSapCode) || [];
                    this.$refs.deptTree.setCheckedKeys(selectedDeptSapCodes);
                }
            });
        },

        /** 部门选择确认 */
        handleDeptConfirm() {
            // 只获取明确勾选的节点，不包含半选状态
            const checkedNodes = this.$refs.deptTree.getCheckedNodes();


            // 更新表单中的部门数据 - deptSapCode 的值取自 sapName
            this.form.invbillDepts = checkedNodes.map(node => ({
                deptSapCode: node.sapName, // 这里修改：deptSapCode的值取sapName
                deptName: node.deptName
            }));

            // 更新显示的部门名称
            this.selectedDeptNames = [...this.form.invbillDepts];
            console.log(this.selectedDeptNames)
            // this.open = false;
        },

        /** 移除已选部门 */
        removeDept(deptSapCode) {
            // 从表单数据中移除
            this.form.invbillDepts = this.form.invbillDepts.filter(dept =>
                dept.deptSapCode !== deptSapCode
            );

            // 从显示列表中移除
            this.selectedDeptNames = this.selectedDeptNames.filter(dept =>
                dept.deptSapCode !== deptSapCode
            );

            // 更新树形组件的选中状态
            if (this.$refs.deptTree) {
                this.$refs.deptTree.setChecked(deptSapCode, false);
            }
        },

        /** 构建部门树形结构 */
        buildDeptTree(deptList) {
            const deptMap = {};
            const tree = [];

            // 创建映射
            deptList.forEach(dept => {
                // 确保 deptId 和 parentId 都是字符串类型，便于比较
                deptMap[dept.deptId] = {
                    ...dept,
                    deptId: String(dept.deptId), // 转换为字符串
                    deptSapCode: dept.sapName, // 这里修改：deptSapCode的值取sapName
                    parentId: String(dept.parentId), // 转换为字符串
                    children: []
                };
            });

            // 构建树形结构
            deptList.forEach(dept => {
                const deptIdStr = String(dept.deptId);
                const parentIdStr = String(dept.parentId);

                if (parentIdStr === "0") {
                    tree.push(deptMap[deptIdStr]);
                } else {
                    const parent = deptMap[parentIdStr];
                    if (parent) {
                        parent.children.push(deptMap[deptIdStr]);
                    }
                }
            });

            return tree;
        },

        /** 处理复选框点击事件 */
        handleCheck(checkedNode, checkedState) {

            // this.$nextTick(() => {
            //   this.$refs.deptTree.setChecked(checkedNode.deptSapCode, false);
            // });

        },



        /** 原有方法 */







        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm('queryForm');
            this.queryParams.type = null;
            this.handleQuery();
        },





        /** 导出按钮操作 */
        handleExport() {
            this.download('business/supplier/export', {
                ...this.queryParams
            }, `supplier_${new Date().getTime()}.xlsx`);
        },

        // 获取标签的显示文本
        getTagLabel(tagValue) {
            const tagOption = this.dict.type.invbill_tag.find(item => item.value === tagValue);
            return tagOption ? tagOption.label : tagValue;
        },
    }
}
</script>

<style></style>