<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="instrumentName">
        <el-input v-model="queryParams.instrumentName" placeholder="请输入设备名称" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备编码" prop="instrumentCode">
        <el-input v-model="queryParams.instrumentCode" placeholder="请输入设备编码" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备型号" prop="modelNumber">
        <el-input v-model="queryParams.modelNumber" placeholder="请输入设备型号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="安装地点" prop="installationLocation">
        <el-input v-model="queryParams.installationLocation" placeholder="请输入安装地点" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="用途" prop="purpose">
        <el-input v-model="queryParams.purpose" placeholder="请输入用途" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['instrument:instruments:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['instrument:instruments:edit']">修改</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['instrument:instruments:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['instrument:instruments:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!-- 设备列表表格 -->
    <el-table v-loading="loading" :data="instrumentsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="instrumentName" />
      <el-table-column label="设备编码" align="center" prop="instrumentCode" />
      <el-table-column label="保管人" align="center" prop="responsiblePerson" />
      <el-table-column label="设备型号(规格型号)" align="center" prop="modelNumber" />
      <el-table-column label="备注" align="center" prop="remark" />
      <!-- <el-table-column label="是否启用" align="center" prop="isEnable" />
      <el-table-column label="是否删除" align="center" prop="isDelete" /> -->
      <el-table-column label="安装地点" align="center" prop="installationLocation" />
      <el-table-column label="用途" align="center" prop="purpose" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['instrument:instruments:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['instrument:instruments:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 设备表单弹窗 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- 工厂选择（关键：确保DOM结构完整） -->
        <el-form-item label="工厂" prop="deptName">
          <el-input v-model="form.deptName" style="width: 100%" placeholder="请选择工厂" class="input-with-select" readonly>
            <template #append>
              <el-button slot="append" icon="el-icon-search" @click="getDept()"></el-button>
            </template>
          </el-input>
        </el-form-item>

        <!-- 设备名称 -->
        <el-form-item label="设备名称" prop="instrumentName">
          <el-input v-model="form.instrumentName" placeholder="请输入设备名称" />
        </el-form-item>

        <!-- 设备编码 -->
        <el-form-item label="设备编码" prop="instrumentCode">
          <el-input v-model="form.instrumentCode" placeholder="请输入设备编码" />
        </el-form-item>

        <!-- 公司id（隐藏） -->
        <el-form-item label="公司id" prop="deptId" hidden>
          <el-input v-model="form.deptId" placeholder="请输入公司id" />
        </el-form-item>

        <!-- 保管人id -->
        <el-form-item label="保管人" prop="responsiblePerson">
          <el-input v-model="form.responsiblePerson" placeholder="请输入保管人" />
        </el-form-item>

        <!-- 设备型号 -->
        <el-form-item label="设备型号(规格型号)" prop="modelNumber">
          <el-input v-model="form.modelNumber" placeholder="请输入设备型号(规格型号)" />
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>

        <!-- 安装地点 -->
        <el-form-item label="安装地点" prop="installationLocation">
          <el-input v-model="form.installationLocation" placeholder="请输入安装地点" />
        </el-form-item>

        <!-- 用途 -->
        <el-form-item label="用途" prop="purpose">
          <el-input v-model="form.purpose" placeholder="请输入用途" />
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="form.status" placeholder="请选择活动区域">
            <el-option label="正常" value="0"></el-option>
            <el-option label="维修" value="1"></el-option>
            <el-option label="送检" value="2"></el-option>
            <el-option label="报废" value="3"></el-option>
          </el-select>
        </el-form-item>

        <!-- 图片/文件上传（已完整注释，避免破坏DOM结构） -->
        <!-- <el-form-item label="图片/文件" prop="file">
          <el-upload
            class="upload-demo"
            action="/common/upload"
            accept="image/*,application/pdf,application/msword"
            :headers="uploadHeaders"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :file-list="fileList"
            :limit="1"
            :auto-upload="true"
            :disabled="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传图片（jpg/png/jpeg）、PDF、Word等文件
            </div>
          </el-upload>

          图片预览
          <el-image
            v-if="form.file && (form.file.includes('jpg') || form.file.includes('png') || form.file.includes('jpeg'))"
            :src="form.file"
            style="width: 100px; height: 100px; margin-top: 10px"
            fit="contain"
            :preview-src-list="[form.file]"
          ></el-image>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 工厂选择弹窗 -->
    <el-dialog :title="deptDialogTitle" :visible.sync="openDeptDialog" width="1200px" append-to-body>
      <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true">
        <el-form-item label="工厂名称" prop="deptName">
          <el-input v-model="queryParams2.deptName" placeholder="请输入工厂名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table :data="deptList" ref="deptTable" style="width: 100%" height="60vh" @row-click="deptclick">
          <el-table-column label="工厂名称" align="center" prop="deptName" :show-overflow-tooltip="true" />
          <!-- <el-table-column 
            label="工厂ID" 
            align="center" 
            prop="deptId" 
            :show-overflow-tooltip="true" 
          /> -->
        </el-table>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
// 设备接口
import {
  listInstruments,
  getInstruments,
  delInstruments,
  addInstruments,
  updateInstruments
} from "@/api/instrument/instruments";
// 工厂接口（路径根据实际项目调整）
import { listDept } from "@/api/system/dept";
// Token工具（已注释上传功能，若不需要可删除）
// import { getToken } from "@/utils/auth";

export default {
  name: "Instruments",
  data() {
    return {
      // 工厂相关
      deptList: [],
      depttotal: 0,
      deptDialogTitle: "选择工厂",
      openDeptDialog: false,

      // 设备列表相关
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      instrumentsList: [],
      title: "",
      open: false,

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        instrumentName: null,
        instrumentCode: null,
        deptId: null,
        type: null,
        responsiblePerson: null,
        modelNumber: null,
        isEnable: null,
        isDelete: null,
        installationLocation: null,
        purpose: null,
        // file: null  // 已注释上传功能，删除冗余字段
      },

      // 工厂查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 20,
        deptName: ""
      },

      // 表单数据（删除上传相关冗余字段）
      form: {
        bsInstrumentsId: null,
        instrumentName: null,
        instrumentCode: null,
        deptId: null,
        deptName: null,  // 工厂名称（关键回显字段）
        responsiblePerson: null,
        modelNumber: null,  // 设备型号（与后端一致）
        remark: null,
        isEnable: 1,
        isDelete: 0,
        installationLocation: null,
        purpose: null,
        // file: null  // 已注释上传功能，删除冗余字段
      },

      // 上传相关（已注释上传功能，删除冗余数据）
      // fileList: [],

      // 表单校验（删除上传相关校验规则）
      rules: {
        instrumentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        instrumentCode: [
          { required: true, message: "设备编码不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "请选择工厂", trigger: "blur" }
        ],
        modelNumber: [
          { required: true, message: "设备型号不能为空", trigger: "blur" }
        ]
        // file: [  // 已注释上传功能，删除冗余校验
        //   { required: false, message: "请选择文件", trigger: "change" }
        // ]
      }
    };
  },
  // 上传相关计算属性（已注释上传功能，删除冗余代码）
  // computed: {
  //   uploadHeaders() {
  //     const headers = {
  //       "Content-Type": "multipart/form-data"
  //     };
  //     const token = this.getToken();
  //     if (token) {
  //       headers.Authorization = `Bearer ${token}`;
  //     }
  //     return headers;
  //   }
  // },
  created() {
    this.getList();
  },
  methods: {
    // 上传相关Token方法（已注释上传功能，删除冗余代码）
    // getToken() {
    //   if (typeof getToken === 'function') {
    //     return getToken() || "";
    //   }
    //   return localStorage.getItem('token') || "";
    // },

    /** 查询设备列表 */
    getList() {
      this.loading = true;
      listInstruments(this.queryParams).then(response => {
        this.instrumentsList = response.rows || [];
        this.total = response.total || 0;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },

    /** 取消操作 */
    cancel() {
      this.open = false;
      this.reset();
    },

    /** 查询工厂列表（关键：确保方法正常） */
    getDept() {
      this.loading = true;
      const params = {
        pageNum: 1,
        pageSize: 999,
        deptName: this.queryParams2.deptName || ""
      };
      listDept(params).then((response) => {
        this.deptList = response.data || response.rows || [];
        this.depttotal = response.total || this.deptList.length;
        this.loading = false;
        this.openDeptDialog = true;
      }).catch((error) => {
        this.loading = false;
        this.$modal.msgError("获取工厂列表失败：" + (error.message || ""));
      });
    },

    /** 工厂搜索 */
    handleQuery2() {
      this.queryParams2.pageNum = 1;
      this.getDept();
    },

    /** 工厂查询重置 */
    resetQuery2() {
      this.resetForm("queryForm2");
      this.queryParams2.deptName = "";
      this.getDept();
    },

    /** 选择工厂 */
    deptclick(val) {
      this.form.deptId = val.deptId;
      this.form.deptName = val.deptName;
      this.openDeptDialog = false;
    },

    /** 表单重置（删除上传相关冗余逻辑） */
    reset() {
      this.form = {
        bsInstrumentsId: null,
        instrumentName: null,
        instrumentCode: null,
        deptId: null,
        deptName: null,
        responsiblePerson: null,
        modelNumber: null,
        remark: null,
        isEnable: 1,
        isDelete: 0,
        installationLocation: null,
        purpose: null
        // file: null  // 已注释上传功能
      };
      // this.fileList = [];  // 已注释上传功能，删除冗余逻辑
      this.resetForm("form");
    },

    /** 设备搜索 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 设备查询重置 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 多选框选中 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.bsInstrumentsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 新增设备 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备档案";
    },

    /** 修改设备（修复工厂回显） */
    handleUpdate(row) {
      this.reset();
      const bsInstrumentsId = row ? row.bsInstrumentsId : (this.ids[0] || "");
      getInstruments(bsInstrumentsId).then(response => {
        const data = response.data || {};
        // 强制回显工厂信息
        this.form = {
          ...data,
          deptId: data.deptId || "",
          deptName: data.deptName || "",
          modelNumber: data.modelNumber || ""
        };
        // 上传相关回显逻辑（已注释上传功能，删除冗余代码）
        // if (this.form.file) {
        //   this.fileList = [{ name: '已上传文件', url: this.form.file }];
        // }
        this.open = true;
        this.title = "修改设备档案";
      }).catch(error => {
        console.error("获取设备详情失败：", error);
        this.$modal.msgError("加载设备信息失败");
      });
    },

    /** 提交表单（删除上传相关冗余逻辑） */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          console.log("提交数据：", this.form);
          if (this.form.bsInstrumentsId) {
            updateInstruments(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInstruments(this.form).then(() => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 上传相关方法（已注释上传功能，删除冗余代码） */
    // handleUploadSuccess(response, file, fileList) {
    //   console.log("上传返回：", response);
    //   if (response.code === 200 && response.data?.url) {
    //     this.form.file = response.data.url;
    //     this.fileList = fileList;
    //     this.$message.success("上传成功");
    //   } else {
    //     this.$message.error("上传失败：" + (response.msg || "接口返回格式错误"));
    //   }
    // },
    // handleUploadError(error) {
    //   console.error("上传错误：", error);
    //   this.$message.error("上传失败，请检查接口地址或网络");
    // },

    /** 删除设备 */
    handleDelete(row) {
      const ids = row ? [row.bsInstrumentsId] : this.ids;
      this.$modal.confirm(`是否确认删除选中的${ids.length}条数据？`).then(() => {
        return delInstruments(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },

    /** 导出数据 */
    handleExport() {
      this.download('instrument/instruments/export', {
        ...this.queryParams
      }, `instruments_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>