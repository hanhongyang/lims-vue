<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="奶仓名称" prop="sapCode">
                <el-input v-model="queryParams.sapCode" placeholder="请输入车牌号" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="组织" prop="invbillName">
                <el-input v-model="queryParams.invbillName" placeholder="请输入状态" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-zoom-in" size="mini" @click="getInfoAll"
                    :loading="btnLoad">新增
                </el-button>
                <el-button type="primary" plain icon="el-icon-zoom-in" size="mini" @click="getInfoAll"
                    :loading="btnLoad">导出
                </el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-progress v-if="ifProgress" :percentage="percentage"></el-progress>

        <el-table v-loading="loading" :data="invbillList" max-height="610px" style="width: 100%;">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="奶仓名称" align="center" prop="sapCode" width="200" />
            <el-table-column label="组织" align="center" prop="invbillName" min-width="220" />

            <!-- <el-table-column label="是否上传随车报告" align="center" prop="isUploadReport" min-width="220">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.sys_yes_no2" :value="scope.row.isUploadReport" />
                </template>
</el-table-column>

<el-table-column label="标签" align="center" prop="tag" width="120">
    <template slot-scope="scope">
                    <div v-if="scope.row.tag">
                        <el-tag v-for="tagValue in scope.row.tag.split(',')" :key="tagValue" size="small"
                            style="margin: 2px;">
                            {{ getTagLabel(tagValue) }}
                        </el-tag>
                    </div>
                    <span v-else>-</span>
                </template>
</el-table-column> -->
            <!-- 
      <el-table-column label="使用部门" align="center" prop="invbillDepts" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.invbillDepts && scope.row.invbillDepts.length > 0">
            <el-tag v-for="dept in scope.row.invbillDepts" :key="dept.deptSapCode" size="small" style="margin: 2px;">
              {{ dept.deptName }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      -->
            <!-- <el-table-column label="制单时间" align="center" prop="createTime" width="200">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="修改人" align="center" prop="updateBy" width="200" :show-overflow-tooltip="true" />
            <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.updateTime) }}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['basicdata:feature:edit']">编辑
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['basicdata:feature:edit']">启用
                    </el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['basicdata:feature:edit']">停用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="奶仓名称" prop="sapCode">
                    <el-input v-model="form.sapCode" placeholder="请输入奶仓名称" />
                </el-form-item>
                <el-form-item label="组织" prop="sapCode">
                    <el-input v-model="form.sapCode" placeholder="请输入组织" />
                </el-form-item>

                <!-- <el-form-item label="状态" prop="tag">
                    <el-select v-model="form.tag" placeholder="请选择状态" style="width: 100%">
                        <el-option v-for="dict in dict.type.invbill_tag" :key="dict.value" :label="dict.label"
                            :value="dict.value" />
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="是否上传随车报告" prop="isUploadReport">
                    <el-radio-group v-model="form.isUploadReport">
                        <el-radio v-for="dict in dict.type.sys_yes_no2" :key="dict.value" :label="dict.value">
                            {{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <!-- 新增：使用部门选择 -->
                <!-- <el-form-item label="使用部门" prop="invbillDepts">
                    <el-button type="primary" size="small" @click="openDeptDialog" icon="el-icon-search">
                        选择部门
                    </el-button>
                    <div style="margin-top: 8px;">
                        <el-tag v-for="dept in selectedDeptNames" :key="dept.deptSapCode" closable
                            style="margin-right: 8px; margin-bottom: 8px;" @close="removeDept(dept.deptSapCode)">
                            {{ dept.deptName }}
                        </el-tag>
                        <span v-if="!selectedDeptNames || selectedDeptNames.length === 0" style="color: #909399;">
                            未选择部门
                        </span>
                    </div>
                </el-form-item> -->
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
        <!-- <el-dialog title="选择使用部门" :visible.sync="deptDialogVisible" width="800px" append-to-body>
            <el-tree ref="deptTree" :data="deptTreeData" show-checkbox node-key="deptSapCode" :props="defaultProps"
                :default-expand-all="true" :check-strictly="true" @check="handleCheck"
                style="max-height: 400px; overflow-y: auto;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="deptDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDeptConfirm">确 定</el-button>
            </div>
        </el-dialog> -->

    </div>
</template>

<script>

import func from '@/utils/func';
import { getinvbilllist, getsyncBaseInvbill, getinvbill, updateInvbill } from '@/api/Basicdata/invbill'
import { listDept } from "@/api/system/dept";

export default {
    name: 'materialindex',
    dicts: ['sys_yes_no2', 'invbill_tag'],
    data() {
        return {
            activeNames: ['1'],
            // 部门选择相关数据
            deptDialogVisible: false, // 部门弹窗显示状态
            deptTreeData: [], // 部门树形数据
            selectedDeptNames: [], // 选中的部门名称列表
            defaultProps: {
                children: 'children',
                label: 'deptName'
            },

            // 遮罩层
            loading: true,

            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 物料表格数据
            invbillList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                sapCode: '',
                ikz: '',
                invbillName: '',
            },
            // 表单参数
            form: {
                sapCode: "",
                invbillName: "",
                ikz: "",
                tag: "",
                invbillDepts: [],// 使用部门列表
                sealNumbers: ['', '', ''], //铅封号数组
            },

            // 表单校验
            rules: {

            },
            btnLoad: false,
            ifProgress: false,
            percentage: 0
        };
    },
    created() {
        this.getList();
        this.getDeptList(); // 预加载部门列表
    },
    methods: {
        handleChange(val) {
            console.log(val);
        },
        /** 部门选择相关方法 */

        /** 获取部门列表并转换为树形结构 */
        getDeptList() {
            return new Promise((resolve, reject) => {
                if (this.deptTreeData.length === 0) {
                    listDept().then(response => {
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

            this.deptDialogVisible = false;
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

        getInfoAll() {
            getsyncBaseInvbill(this.queryParams).then(response => {
                console.log(response, '列表')
                if (response.code == 200) {
                    this.getList();
                } else {
                    this.$modal.msgError(response.msg);
                }
            });
        },

        getList() {
            this.loading = true;
            getinvbilllist(this.queryParams).then(response => {
                console.log(response, '列表')
                this.invbillList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },

        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
            // 清空部门树的选中状态
            this.$nextTick(() => {
                if (this.$refs.deptTree) {
                    this.$refs.deptTree.setCheckedKeys([]);
                }
            });
        },

        // 表单重置
        reset() {
            this.form = {
                id: undefined,
                sapCode: "",
                invbillName: "",
                ikz: "",
                izj: "",
                isUploadReport: "",
                remark: "",
                invbillDepts: [], // 重置部门选择
                sealNumbers: ['', '', ''] // 重置为3个空字符串
            };
            this.selectedDeptNames = []; // 清空显示的部门标签
            this.resetForm("form");
        },

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

        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getinvbill(id).then(response => {
                // 暂时先注释掉
                // this.form = response.data;

                // 处理铅封号数据 - 确保总是有3个值
                // 确保sealNumbers是数组且长度正确
                // 1. 保证是数组
                if (!Array.isArray(this.form.sealNumbers)) {
                    this.form.sealNumbers = []
                }
                // 2. 补齐 3 位
                while (this.form.sealNumbers.length < 3) {
                    this.form.sealNumbers.push('')
                }
                if (this.form.sealNumbers.length > 3) {
                    this.form.sealNumbers = this.form.sealNumbers.slice(0, 3)
                }
                // 3. 用 $set 逐个写入，确保响应式
                this.$nextTick(() => {
                    this.form.sealNumbers.forEach((v, i) => {
                        this.$set(this.form.sealNumbers, i, v)
                    })
                })

                // 处理标签数据 - 将逗号分隔的字符串转换为数组
                if (this.form.tag && typeof this.form.tag === 'string') {
                    this.form.tag = this.form.tag.split(',');
                } else if (!this.form.tag) {
                    this.form.tag = [];
                }

                // 处理使用部门数据
                if (this.form.invbillDepts && this.form.invbillDepts.length > 0) {
                    this.selectedDeptNames = this.form.invbillDepts.map(dept => ({
                        deptSapCode: dept.deptSapCode,
                        deptName: dept.deptName
                    }));
                } else {
                    this.form.invbillDepts = [];
                    this.selectedDeptNames = [];
                }

                this.open = true;
                this.title = '修改铅封号';

                // 确保部门树数据已加载后设置选中状态
                this.$nextTick(() => {
                    if (this.$refs.deptTree && this.form.invbillDepts.length > 0) {
                        const selectedDeptSapCodes = this.form.invbillDepts.map(dept => dept.deptSapCode);
                        this.$refs.deptTree.setCheckedKeys(selectedDeptSapCodes);
                    }
                });

                console.log(this.form, '修改');
            });
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    // 转换标签格式 - 将数组转换为逗号分隔的字符串
                    const tagValue = Array.isArray(this.form.tag)
                        ? this.form.tag.join(',')
                        : this.form.tag || '';
                    this.form.tag = tagValue;

                    // 确保部门数据格式正确 - deptSapCode的值取自sapName
                    const submitData = {
                        ...this.form,
                        invbillDepts: this.form.invbillDepts.map(dept => ({
                            deptSapCode: dept.deptSapCode, // 保持字段名不变，值已经在handleDeptConfirm中设置为sapName
                            deptName: dept.deptName,
                            invbillSapCode: this.form.sapCode // 关联物料SAP编码
                        }))
                    };

                    updateInvbill(submitData).then(response => {
                        this.$modal.msgSuccess('修改成功');
                        this.open = false;
                        this.getList();
                    });
                }
            });
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