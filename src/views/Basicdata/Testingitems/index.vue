<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="项目名称" prop="itemName">
                <el-input v-model="queryParams.itemName" placeholder="请输入项目名称" clearable
                    @keyup.enter.native="handleQuery" style="width: 180px" />
            </el-form-item>
            <el-form-item label="标签" prop="tag">
                <el-select v-model="queryParams.tag" placeholder="请输入标签" clearable @keyup.enter.native="handleQuery"
                    style="width: 180px">
                    <el-option v-for="dict in dict.type.item_tag" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="isEnable">
                <el-select v-model="queryParams.isEnable" placeholder="状态" clearable style="width: 240px">
                    <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label"
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
                    v-hasPermi="['basicdata:items:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['basicdata:items:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
            style="width: 100%; min-height: 200px">
            <el-table-column type="index" align="center" label="序号" width="50" />
            <el-table-column label="排序" align="center" prop="sortOrder" width="80" />
            <el-table-column label="项目编码" align="center" prop="itemCode" min-width="150" />
            <el-table-column label="项目名称" align="center" prop="itemName" min-width="150" />
            <el-table-column prop="isEnable" label="状态" width="100">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.is_enable" :value="scope.row.isEnable" />
                </template>
            </el-table-column>
            <el-table-column label="标签" align="center" prop="tag" width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.tag">
                        <el-tag v-for="tagValue in scope.row.tag.split(',')" :key="tagValue" size="small"
                            style="margin: 2px;">
                            {{ getTagLabel(tagValue) }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="220" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['basicdata:items:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-download"
                        @click="handleDownload(scope.row)">下载</el-button>
                    <el-button size="mini" type="text" icon="el-icon-circle-check"
                        @click="handleStatusChange(scope.row)">启用/停用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- <el-upload ref="hiddenUpload" style="display:none" action="#" :auto-upload="false" :on-change="onFileChange"
            :before-upload="beforeUpload" :http-request="customUpload" multiple :limit="5">
        </el-upload> -->
        <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="formrules" label-width="110px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="项目名称" prop="itemName">
                            <el-input v-model="form.itemName" placeholder="项目名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="sortOrder">
                            <el-input-number v-model="form.sortOrder" controls-position="right" :min="0"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目编码" prop="itemCode">
                            <el-input v-model="form.itemCode" placeholder="项目编码" />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="标签" prop="tag">
                            <el-select v-model="form.tag" multiple placeholder="请选择标签" style="width: 100%">
                                <el-option v-for="dict in dict.type.item_tag" :key="dict.value" :label="dict.label"
                                    :value="dict.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="定性或定量" prop="qualitativeOrQuantitative">
                            <el-radio-group v-model="form.qualitativeOrQuantitative" size="small">
                                <el-radio v-for="dict in dict.type.qualitative_or_quantitative" :key="dict.value"
                                    :label="dict.value">{{ dict.label }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item label="保留小数位" prop="decimalPlaces">
                            <el-input v-model="form.decimalPlaces" placeholder="" size="small" style="width: 100%;"
                                @input="handleDecimalPlacesInput" clearable>
                                <template slot="append">位</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="有效数字位" prop="significantDigits">
                            <el-input v-model="form.significantDigits" placeholder="" size="small" style="width: 100%;"
                                @input="handleSignificantDigitsInput" clearable>
                                <template slot="append">位</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="执行标准" prop="zxbz" v-if="form.tag && form.tag.includes('1')">
                    <el-input v-model="form.zxbz" placeholder="请输入执行标准" />
                </el-form-item>
                <!-- ===== 新增：附件上传 ===== -->
                <el-form-item label="检测标准文件">
                    <!-- 上传按钮 -->
                    <el-upload ref="attachUpload" class="attach-upload" action="#" :auto-upload="false" :multiple="true"
                        :limit="1" :file-list="form.attachList" :before-upload="beforeAttachUpload"
                        :on-change="onAttachChange" :http-request="uploadAttach" :show-file-list="false">
                        <el-button slot="trigger" size="mini" type="primary" icon="el-icon-upload">选择文件</el-button>
                        <span slot="tip" class="el-upload__tip" style="margin-left:10px;">
                            支持 PDF / 图片 / Word / Excel，单个≤10MB
                        </span>
                    </el-upload>

                    <!-- 已上传列表（可删除） -->
                    <div v-show="(form.attachList && form.attachList.length) || form.fileInfo" style="margin-top:8px;">
                        <div class="attach-item">
                            {{ form.fileInfo }}附件
                            <el-button size="mini" type="text" style="color:#F56C6C;margin-left:10px;"
                                @click="delAttach()" icon="el-icon-delete"></el-button>
                        </div>
                    </div>
                </el-form-item>
                <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                    <div
                        style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span
                            style="font-weight: bold; font-size: 15px; border-left: 4px solid #1890ff; padding-left: 8px;">适用部门及资源配置</span>
                        <el-button type="primary" size="mini" icon="el-icon-plus"
                            @click="openDeptSelectDialog">添加适用部门</el-button>
                    </div>

                    <el-table :data="form.deptConfigList" border size="small" style="width: 100%"
                        empty-text="请点击上方按钮添加适用部门">
                        <el-table-column label="部门名称" prop="deptName" align="center" width="180" />

                        <el-table-column label="关联设备" align="left" min-width="200">
                            <template slot-scope="scope">
                                <div v-if="scope.row.instrumentList && scope.row.instrumentList.length > 0">
                                    <el-tag type="info" size="mini" v-for="(inst, idx) in scope.row.instrumentList"
                                        :key="idx" style="margin-right:4px; margin-bottom:4px;">
                                        {{ inst.name }}
                                    </el-tag>
                                </div>
                                <span v-else style="color:#999; font-size:12px; padding-left: 5px;">暂无设备</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="关联地点" align="left" min-width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.locationList && scope.row.locationList.length > 0">
                                    <el-tag type="success" size="mini" v-for="(loc, idx) in scope.row.locationList"
                                        :key="idx" style="margin-right:4px; margin-bottom:4px;">
                                        {{ loc.name }}
                                    </el-tag>
                                </div>
                                <span v-else style="color:#999; font-size:12px; padding-left: 5px;">暂无地点</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" icon="el-icon-setting"
                                    @click="openResourceDialog(scope.row, scope.$index)">配置资源</el-button>
                                <el-button type="text" size="mini" icon="el-icon-delete" style="color: #F56C6B"
                                    @click="removeDeptRow(scope.$index)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加适用部门" :visible.sync="deptSelectVisible" width="600px" append-to-body>
            <el-tree ref="deptTree" :data="deptTreeData" show-checkbox node-key="deptId" :props="defaultProps"
                :default-expand-all="true" :check-strictly="true" style="max-height: 400px; overflow-y: auto;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="deptSelectVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDeptConfirm">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="resourceDialogTitle" :visible.sync="resourceDialogVisible" width="700px" append-to-body
            :close-on-click-modal="false">
            <el-form label-position="top" size="small">

                <el-form-item label="选择设备 (注：列表中仅显示归属于该部门的启用设备)">
                    <el-select v-model="tempResourceConfig.selectedInstrumentIds" multiple filterable
                        placeholder="请选择设备" style="width: 100%">
                        <el-option v-for="item in currentDeptInstruments" :key="item.bsInstrumentsId"
                            :label="`${item.instrumentName} (${item.instrumentCode})`" :value="item.bsInstrumentsId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择实验地点 (温湿度监控点)">
                    <el-select v-model="tempResourceConfig.selectedLocationIds" multiple filterable
                        placeholder="请选择实验地点" style="width: 100%">
                        <el-option v-for="item in labLocationOptions" :key="item.id" :label="item.monitoringPoint"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resourceDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveResourceConfig">保存配置</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
// 请根据实际项目路径调整引用
import { getpagelist, addobj, getdetail, updateobj, changestatus } from "@/api/Basicdata/Testingitems";
import { listDept } from "@/api/system/dept";
import { listInstrument } from "@/api/instrument/device";
import { listMonitor } from "@/api/environment/monitor";
import { uploadAndGetUrl, downloadFile } from '@/api/common/common'
export default {
    name: "Testingitems",
    dicts: ["is_enable", 'qualitative_or_quantitative', 'item_tag'],
    data() {
        return {
            // --- 基础变量 ---
            loading: false,
            showSearch: true,
            total: 0,
            tablepagelist: [],
            title: "",
            open: false,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                itemName: "",
                isEnable: "1",
                tag: "",
            },
            attachList: [],
            uploading: false,       // 防止重复提交
            // --- 主表单数据 ---
            form: {
                attachList: [],        // el-upload 的 file-list
                labtestItemsId: undefined,
                itemName: "",
                itemCode: "",
                tag: [],
                sortOrder: 0,
                qualitativeOrQuantitative: "2", // 默认定量
                decimalPlaces: "",
                significantDigits: "",
                zxbz: "",

                // 【核心变量】：存储部门及其配置
                // 结构: [{ deptId, deptName, instrumentList: [{id,name}], locationList: [{id,name}] }]
                deptConfigList: []
            },
            formrules: {
                itemName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
                itemCode: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
            },

            // --- 部门树相关 ---
            deptSelectVisible: false,
            deptTreeData: [],
            defaultProps: { children: 'children', label: 'deptName' },

            // --- 资源配置弹窗相关 ---
            resourceDialogVisible: false,
            resourceDialogTitle: "",
            labLocationOptions: [],       // 所有地点选项 (公用)
            currentDeptInstruments: [],   // 当前选中部门的设备选项 (动态加载)

            // 临时变量：用于编辑时的存储
            tempResourceConfig: {
                rowIndex: -1,
                deptId: "",
                deptName: "",
                selectedInstrumentIds: [],
                selectedLocationIds: []
            }
        };
    },
    created() {
        this.getList();
        this.getDeptList();      // 预加载部门树
        this.getLabLocationList(); // 预加载地点列表
    },
    methods: {
        // 校验
        beforeAttachUpload(file) {
            const allow = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx'];
            const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!allow.includes(ext)) {
                this.$message.error('仅支持 ' + allow.join('/') + ' 格式');
                return false;
            }
            if (!isLt10M) {
                this.$message.error('文件大小不能超过 10MB');
                return false;
            }
            return true;
        },

        // 选择文件后自动上传
        onAttachChange(file) {
            if (this.beforeAttachUpload(file)) {
                this.$refs.attachUpload.submit();   // 立即上传
            }
        },

        // 真正上传（走你自己的接口）
        uploadAttach(opts) {
            if (this.uploading) return;
            this.uploading = true;
            const file = opts.file;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('labtestItemsId', this.form.labtestItemsId); // 当前项目主键
            uploadAndGetUrl(formData).then(res => {
                this.form.fileInfo = res.data.fileId
                this.$set(this.form, 'attachList', [{
                    id: res.data.fileId,
                    uid: Date.now()  // 添加唯一标识
                }]);
                this.$nextTick(() => {
                    this.$message.success(`${fileName} 上传成功`);
                });
                // this.form.attachList = [{ id: res.data.fileId, name: res.data.fileId }]

                this.$message.success(`${file.name} 上传成功`);
            }).finally(() => {
                this.uploading = false;
                this.$refs.attachUpload.clearFiles(); // 清空临时列表
            });
        },

        // 删除已上传附件
        delAttach() {
            this.$confirm('确定删除该附件？', '提示').then(() => {
                this.form.fileInfo = '';
            });
        },

        handleDownload(row) {
            if (!row || !row.fileInfo) {
                this.$message.warning('文件信息不存在');
                return;
            }

            this.$modal.loading("下载中...");

            downloadFile(row.fileInfo).then(response => {
                this.downloadFileFromResponse(response, row);
            }).catch(error => {
                console.error("下载文件失败:", error);
                this.$modal.closeLoading();
                this.$message.error("下载失败: " + (error.message || '未知错误'));
            });
        },

        // 处理文件下载
        downloadFileFromResponse(response, row) {
            try {
                // 1. 获取文件名
                let filename = '';
                if (row && row.itemName) {
                    filename = row.itemName.trim();
                } else {
                    filename = 'download';
                }

                // 2. 处理响应数据
                let blobData, contentType = 'application/octet-stream';

                if (response instanceof Blob) {
                    blobData = response;
                    contentType = response.type || contentType;
                } else if (response.data && response.data instanceof Blob) {
                    blobData = response.data;
                    contentType = response.data.type || contentType;

                    // 尝试从响应头获取文件名
                    if (response.headers) {
                        const contentDisposition = response.headers['content-disposition'] ||
                            response.headers['Content-Disposition'];

                        if (contentDisposition) {
                            const utf8Filename = this.getFilenameFromContentDisposition(contentDisposition);
                            if (utf8Filename) {
                                filename = utf8Filename;
                            }
                        }
                    }
                } else {
                    // 如果都不是Blob，尝试转换为Blob
                    blobData = new Blob([response]);
                }

                // 3. 如果没有扩展名，根据contentType添加
                if (!filename.includes('.')) {
                    filename = this.addFileExtension(filename, contentType);
                }

                // 4. 创建并触发下载
                this.createAndTriggerDownload(blobData, filename, contentType);

                this.$modal.closeLoading();
                this.$message.success('下载完成');

            } catch (error) {
                console.error("处理文件下载时出错:", error);
                this.$modal.closeLoading();
                this.$message.error("下载处理失败");
            }
        },

        // 从Content-Disposition解析文件名
        getFilenameFromContentDisposition(contentDisposition) {
            try {
                // 处理UTF-8编码的文件名
                let filename = '';

                if (contentDisposition.includes("filename*=")) {
                    // 处理RFC 5987编码 filename*=UTF-8'lang'%E4%B8%AD%E6%96%87.txt
                    const matches = contentDisposition.match(/filename\*=utf-8''([^;]+)/i) ||
                        contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
                    if (matches && matches[1]) {
                        filename = decodeURIComponent(matches[1]);
                    }
                } else if (contentDisposition.includes("filename=")) {
                    // 处理普通文件名 filename="中文.txt"
                    const matches = contentDisposition.match(/filename="([^"]+)"/i) ||
                        contentDisposition.match(/filename=([^;]+)/i);
                    if (matches && matches[1]) {
                        filename = matches[1].trim();
                        // 解码URL编码
                        try {
                            filename = decodeURIComponent(filename);
                        } catch (e) {
                            // 如果不是URL编码，保持原样
                        }
                    }
                }

                return filename;
            } catch (error) {
                console.error("解析文件名失败:", error);
                return '';
            }
        },

        // 根据内容类型添加文件扩展名
        addFileExtension(filename, contentType) {
            if (!contentType) return filename;

            const extensionMap = {
                'application/pdf': '.pdf',
                'image/jpeg': '.jpg',
                'image/jpg': '.jpg',
                'image/png': '.png',
                'image/gif': '.gif',
                'image/webp': '.webp',
                'application/msword': '.doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
                'application/vnd.ms-excel': '.xls',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
                'application/vnd.ms-powerpoint': '.ppt',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
                'text/plain': '.txt',
                'text/html': '.html',
                'application/json': '.json',
                'application/zip': '.zip',
                'application/x-rar-compressed': '.rar',
                'application/x-7z-compressed': '.7z'
            };

            for (const [mimeType, ext] of Object.entries(extensionMap)) {
                if (contentType.includes(mimeType.split('/')[1]) ||
                    contentType === mimeType) {
                    return filename + ext;
                }
            }

            // 如果找不到匹配，使用时间戳
            const timestamp = new Date().getTime();
            return `${filename}_${timestamp}`;
        },

        // 创建并触发下载
        createAndTriggerDownload(blob, filename, contentType) {
            // 创建Blob URL
            const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: contentType }));

            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';

            // 添加到文档并触发点击
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                window.URL.revokeObjectURL(blobUrl);
            }, 100);
        },
        /** 1. 查询列表 */
        getList() {
            this.loading = true;
            getpagelist(this.queryParams).then((response) => {
                if (response.code == "200") {
                    this.tablepagelist = response.rows;
                    this.total = response.total;
                    this.loading = false;
                }
            });
        },
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },

        // ================== 2. 部门选择逻辑 ==================

        /** 打开部门选择弹窗 */
        openDeptSelectDialog() {
            this.deptSelectVisible = true;
            this.$nextTick(() => {
                // 回显已选择的部门
                if (this.$refs.deptTree) {
                    const keys = this.form.deptConfigList.map(item => item.deptId);
                    this.$refs.deptTree.setCheckedKeys(keys);
                }
            });
        },

        /** 确认选择部门 */
        handleDeptConfirm() {
            // 获取选中的节点
            const checkedNodes = this.$refs.deptTree.getCheckedNodes();

            // 构造新的列表，保留已有配置
            const newDeptConfigList = [];

            checkedNodes.forEach(node => {
                // 排除根节点或不需要的节点（可选逻辑）
                if (node.deptId === 0) return;

                const deptIdStr = String(node.deptId);

                // 检查该部门是否已经在列表中
                const exist = this.form.deptConfigList.find(item => item.deptId === deptIdStr);

                if (exist) {
                    // 如果已存在，保留原有的设备和地点配置
                    newDeptConfigList.push(exist);
                } else {
                    // 如果是新勾选的，初始化空配置
                    newDeptConfigList.push({
                        deptId: deptIdStr,
                        deptName: node.deptName,
                        instrumentList: [], // 存对象 {id, name}
                        locationList: []    // 存对象 {id, name}
                    });
                }
            });

            this.form.deptConfigList = newDeptConfigList;
            this.deptSelectVisible = false;
        },

        /** 移除部门行 */
        removeDeptRow(index) {
            this.form.deptConfigList.splice(index, 1);
        },

        // ================== 3. 资源配置逻辑 (设备 & 地点) ==================

        /** 打开配置弹窗 */
        async openResourceDialog(row, index) {
            this.tempResourceConfig.rowIndex = index;
            this.tempResourceConfig.deptId = row.deptId;
            this.tempResourceConfig.deptName = row.deptName;
            this.resourceDialogTitle = `配置资源 - [${row.deptName}]`;

            // 1. 回显数据：从 row 中提取 ID 数组
            this.tempResourceConfig.selectedInstrumentIds = row.instrumentList.map(i => i.id);
            this.tempResourceConfig.selectedLocationIds = row.locationList.map(l => l.id);

            // 2. 加载该部门下的设备列表
            // 注意：此处调用设备列表接口，必须传入 deptId 进行过滤
            this.currentDeptInstruments = [];
            await listInstrument({
                pageNum: 1,
                pageSize: 999,
                deptId: row.deptId, // 关键过滤条件
                isEnable: "1"       // 只选启用状态的设备 (根据你的字典调整，0通常是启用，或者1)
            }).then(res => {
                if (res.rows) {
                    this.currentDeptInstruments = res.rows;
                }
            }).catch(err => {
                console.error("加载设备失败", err);
                // 即使加载失败，也要打开弹窗，至少能操作地点
            });

            this.resourceDialogVisible = true;
        },
        // 保存资源配置
        saveResourceConfig() {
            const index = this.tempResourceConfig.rowIndex;
            // 获取当前编辑的行引用
            const targetRow = this.form.deptConfigList[index];

            // 1. 处理设备：根据选中的ID，找到对应的名称
            const newInstrumentList = [];
            this.tempResourceConfig.selectedInstrumentIds.forEach(id => {
                // 尝试从当前加载的列表中找
                const findItem = this.currentDeptInstruments.find(item => item.bsInstrumentsId === id);
                if (findItem) {
                    newInstrumentList.push({ id: findItem.bsInstrumentsId, name: findItem.instrumentName });
                } else {
                    // 如果列表里没找到（可能设备被禁用或列表加载不全），尝试从旧数据里保留名字
                    const oldItem = targetRow.instrumentList.find(old => old.id === id);
                    newInstrumentList.push({ id: id, name: oldItem ? oldItem.name : '未知设备' });
                }
            });

            // 2. 处理地点
            const newLocationList = [];
            this.tempResourceConfig.selectedLocationIds.forEach(id => {
                const findItem = this.labLocationOptions.find(item => item.id === id);
                if (findItem) {
                    newLocationList.push({ id: findItem.id, name: findItem.monitoringPoint });
                } else {
                    const oldItem = targetRow.locationList.find(old => old.id === id);
                    newLocationList.push({ id: id, name: oldItem ? oldItem.name : '未知地点' });
                }
            });

            // 更新行数据
            targetRow.instrumentList = newInstrumentList;
            targetRow.locationList = newLocationList;

            this.resourceDialogVisible = false;
        },
        /** 保存配置 */
        saveConfig() {
            const index = this.tempResourceConfig.rowIndex;
            // 获取当前编辑的行引用
            const targetRow = this.form.deptConfigList[index];

            // 1. 处理设备：根据选中的ID，找到对应的名称
            const newInstrumentList = [];
            this.tempResourceConfig.selectedInstrumentIds.forEach(id => {
                // 尝试从当前加载的列表中找
                const findItem = this.currentDeptInstruments.find(item => item.bsInstrumentsId === id);
                if (findItem) {
                    newInstrumentList.push({ id: findItem.bsInstrumentsId, name: findItem.instrumentName });
                } else {
                    // 如果列表里没找到（可能设备被禁用或列表加载不全），尝试从旧数据里保留名字
                    const oldItem = targetRow.instrumentList.find(old => old.id === id);
                    newInstrumentList.push({ id: id, name: oldItem ? oldItem.name : '未知设备' });
                }
            });

            // 2. 处理地点
            const newLocationList = [];
            this.tempResourceConfig.selectedLocationIds.forEach(id => {
                const findItem = this.labLocationOptions.find(item => item.id === id);
                if (findItem) {
                    newLocationList.push({ id: findItem.id, name: findItem.monitoringPoint });
                } else {
                    const oldItem = targetRow.locationList.find(old => old.id === id);
                    newLocationList.push({ id: id, name: oldItem ? oldItem.name : '未知地点' });
                }
            });

            // 更新行数据
            targetRow.instrumentList = newInstrumentList;
            targetRow.locationList = newLocationList;

            this.resourceDialogVisible = false;
        },

        // ================== 4. 增删改查基础逻辑 ==================

        /** 新增 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加检测项目";
            this.form.deptConfigList = []; // 确保清空
        },

        /** 修改 - 核心回显逻辑 */
        handleUpdate(row) {
            this.reset();
            const id = row.labtestItemsId;
            getdetail(id).then(response => {
                // this.form = response.data;
                this.form = { ...this.form, ...response.data, attachList: response.data.attachList || [] }
                // 处理标签
                if (this.form.tag && typeof this.form.tag === 'string') {
                    this.form.tag = this.form.tag.split(',');
                } else {
                    this.form.tag = [];
                }


                // 回显逻辑优化：直接利用后端返回的拼接字符串
                const flatList = response.data.bsItemDeptConfigList || [];
                const deptList = [];

                flatList.forEach(item => {
                    const deptObj = {
                        deptId: String(item.deptId),
                        deptName: item.deptName, // 后端需保证关联查出此字段
                        instrumentList: [],
                        locationList: []
                    };

                    // 解析设备 (ID, Name, Code 都是逗号分隔，按索引对应)
                    if (item.instrumentId) {
                        const ids = item.instrumentId.split(',');
                        const names = item.instrumentName ? item.instrumentName.split(',') : [];
                        const codes = item.instrumentCode ? item.instrumentCode.split(',') : [];

                        ids.forEach((id, idx) => {
                            deptObj.instrumentList.push({
                                id: id,
                                name: names[idx] || '未知设备', // 对应索引的名字
                                code: codes[idx] || ''        // 对应索引的编码
                            });
                        });
                    }

                    // 解析地点
                    if (item.locationId) {
                        const ids = item.locationId.split(',');
                        const names = item.locationName ? item.locationName.split(',') : [];

                        ids.forEach((id, idx) => {
                            deptObj.locationList.push({
                                id: id,
                                name: names[idx] || '未知地点'
                            });
                        });
                    }

                    deptList.push(deptObj);
                });

                this.form.deptConfigList = deptList;
                this.open = true;
                this.title = "修改检测项目";
            });
        },

        /** 提交表单 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    const submitData = { ...this.form };
                    submitData.tag = Array.isArray(this.form.tag) ? this.form.tag.join(',') : this.form.tag;

                    const configList = [];

                    this.form.deptConfigList.forEach(dept => {
                        // 1. 处理设备数据拼接
                        const instIds = dept.instrumentList.map(i => i.id).join(',');
                        const instNames = dept.instrumentList.map(i => i.name).join(',');
                        const instCodes = dept.instrumentList.map(i => i.code).join(',');

                        // 2. 处理地点数据拼接
                        const locIds = dept.locationList.map(l => l.id).join(',');
                        const locNames = dept.locationList.map(l => l.name).join(',');

                        // 生成一条记录，包含所有拼接好的字符串
                        configList.push({
                            deptId: dept.deptId,
                            // ID 字段
                            instrumentId: instIds || null,
                            locationId: locIds || null,
                            // 【新增】名称和编码字段
                            instrumentName: instNames || null,
                            instrumentCode: instCodes || null,
                            locationName: locNames || null
                        });
                    });

                    submitData.bsItemDeptConfigList = configList;
                    delete submitData.deptConfigList;

                    // 发送请求
                    if (this.form.labtestItemsId) {
                        updateobj(submitData).then(res => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addobj(submitData).then(res => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },

        // 主弹窗的取消
        cancel() {
            this.open = false;
            this.reset();
        },

        /** 启用/停用状态修改 */
        handleStatusChange(row) {
            const targetStatus = row.isEnable === "1" ? "0" : "1";
            const text = targetStatus === "0" ? "停用" : "启用";
            this.$modal.confirm('确认要"' + text + '""' + row.itemName + '"吗？').then(() => {
                return changestatus(row.labtestItemsId, targetStatus);
            }).then(() => {
                this.$modal.msgSuccess(text + "成功");
                this.getList();
            }).catch(() => { });
        },

        /** 导出 */
        handleExport() {
            this.download("/basicdata/labTestItems/export", { ...this.queryParams }, `检测项目_${new Date().getTime()}.xlsx`);
        },

        // ================== 5. 辅助方法 ==================

        reset() {
            this.form = {
                labtestItemsId: undefined,
                itemName: undefined,
                itemCode: undefined,
                sortOrder: 0,
                tag: [],
                qualitativeOrQuantitative: "2",
                deptConfigList: [] // 重置
            };
            this.resetForm("form");
        },

        /** 加载部门树 */
        getDeptList() {
            listDept().then(response => {
                if (response.code === 200) {
                    // 假设您有 handleTree 方法，如果没有，使用下方的 buildDeptTree
                    this.deptTreeData = this.handleTree ? this.handleTree(response.data, "deptId") : this.buildDeptTree(response.data);
                }
            });
        },

        /** 加载所有实验地点 */
        getLabLocationList() {
            listMonitor({ pageNum: 1, pageSize: 9999, isEnable: '0' }).then(res => {
                this.labLocationOptions = res.rows || [];
            });
        },

        getTagLabel(val) {
            const found = this.dict.type.item_tag.find(d => d.value == val);
            return found ? found.label : val;
        },
        // 保存资源配置
        saveResourceConfig() {
            const index = this.tempResourceConfig.rowIndex;
            const targetRow = this.form.deptConfigList[index];

            // 1. 处理设备：保存 ID, Name, 和 Code
            const newInstrumentList = [];
            this.tempResourceConfig.selectedInstrumentIds.forEach(id => {
                // 尝试从当前加载的列表中找
                const findItem = this.currentDeptInstruments.find(item => item.bsInstrumentsId === id);
                if (findItem) {
                    newInstrumentList.push({
                        id: findItem.bsInstrumentsId,
                        name: findItem.instrumentName,
                        code: findItem.instrumentCode // 【新增】保存设备编码
                    });
                } else {
                    // 如果列表里没找到（回显时的旧数据），尝试从旧数据里保留
                    const oldItem = targetRow.instrumentList.find(old => old.id === id);
                    newInstrumentList.push({
                        id: id,
                        name: oldItem ? oldItem.name : '未知设备',
                        code: oldItem ? oldItem.code : '' // 【新增】保留旧编码
                    });
                }
            });

            // 2. 处理地点：保存 ID 和 Name
            const newLocationList = [];
            this.tempResourceConfig.selectedLocationIds.forEach(id => {
                const findItem = this.labLocationOptions.find(item => item.id === id);
                if (findItem) {
                    newLocationList.push({ id: findItem.id, name: findItem.monitoringPoint });
                } else {
                    const oldItem = targetRow.locationList.find(old => old.id === id);
                    newLocationList.push({ id: id, name: oldItem ? oldItem.name : '未知地点' });
                }
            });

            // 更新行数据
            targetRow.instrumentList = newInstrumentList;
            targetRow.locationList = newLocationList;

            this.resourceDialogVisible = false;
        },
        handleDecimalPlacesInput(val) { this.form.decimalPlaces = val.replace(/[^\d]/g, ''); },
        handleSignificantDigitsInput(val) { this.form.significantDigits = val.replace(/[^\d]/g, ''); },

        // 简单的构建树方法 (备用)
        buildDeptTree(data) {
            const map = {};
            const tree = [];
            data.forEach(item => { map[item.deptId] = { ...item, children: [] }; });
            data.forEach(item => {
                const node = map[item.deptId];
                if (item.parentId && map[item.parentId]) {
                    map[item.parentId].children.push(node);
                } else {
                    tree.push(node);
                }
            });
            return tree;
        }
    }
};
</script>

<style scoped>
/* 样式微调 */
.el-tag {
    margin-right: 5px;
}
</style>