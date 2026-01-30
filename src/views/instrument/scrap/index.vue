<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报废申请人" prop="applicant">
        <el-input
          v-model="queryParams.applicant"
          placeholder="请输入报废申请人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批准人" prop="approver">
        <el-input
          v-model="queryParams.approver"
          placeholder="请输入批准人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['instrument:scrap:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['instrument:scrap:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['instrument:scrap:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['instrument:scrap:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="scrapList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备名称" align="center" prop="instrumentName" />
      <el-table-column label="报废申请日期" align="center" prop="applicationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.applicationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报废申请人" align="center" prop="applicant" />
      <el-table-column label="报废原因" align="center" prop="scrapReason" :show-overflow-tooltip="true"/>
      <el-table-column label="批准日期" align="center" prop="approvalDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.approvalDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批准人" align="center" prop="approver" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['instrument:scrap:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['instrument:scrap:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备报废记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="设备" prop="bsInstrumentsId">
            <el-select v-model="form.bsInstrumentsId" filterable placeholder="请选择设备" style="width: 100%">
              <el-option
                v-for="item in instrumentOptions"
                :key="item.bsInstrumentsId"
                :label="item.instrumentName"
                :value="item.bsInstrumentsId">
                <span style="float: left">{{ item.instrumentName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.instrumentCode }}</span>
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="报废申请日期" prop="applicationDate">
          <el-date-picker clearable
            v-model="form.applicationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择报废申请日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报废申请人" prop="applicant">
          <el-input v-model="form.applicant" placeholder="请输入报废申请人" />
        </el-form-item>
        <el-form-item label="报废原因" prop="scrapReason">
          <el-input v-model="form.scrapReason" type="textarea" placeholder="请输入报废原因" />
        </el-form-item>
        <el-form-item label="批准日期" prop="approvalDate">
          <el-date-picker clearable
            v-model="form.approvalDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择批准日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="批准人" prop="approver">
          <el-input v-model="form.approver" placeholder="请输入批准人" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="附件" prop="fileInfo">
          <file-upload v-model="form.fileInfo"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listScrap, getScrap, delScrap, addScrap, updateScrap, exportScrap } from "@/api/instrument/scrap";
import { listInstruments } from "@/api/instrument/instruments";

export default {
  name: "Scrap",
  data() {
    return {
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
      // 设备报废记录表格数据
      scrapList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        bsInstrumentsId: null,
        applicant: null,
        approver: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        bsInstrumentsId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        applicationDate: [
          { required: true, message: "报废申请日期不能为空", trigger: "blur" }
        ],
      },
      // 设备选项
      instrumentOptions: []
    };
  },
  created() {
    this.getList();
    this.getInstrumentList();
  },
  methods: {
    /** 查询设备报废记录列表 */
    getList() {
      this.loading = true;
      listScrap(this.queryParams).then(response => {
        this.scrapList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询设备列表 */
    getInstrumentList() {
        listInstruments().then(response => {
            this.instrumentOptions = response.rows;
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
        bsScrapRecordId: null,
        bsInstrumentsId: null,
        applicationDate: null,
        applicant: null,
        scrapReason: null,
        approvalDate: null,
        approver: null,
        remark: null,
        fileInfo: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        isDelete: null
      };
      this.resetForm("form");
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.bsScrapRecordId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备报废记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bsScrapRecordId = row.bsScrapRecordId || this.ids
      getScrap(bsScrapRecordId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备报废记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bsScrapRecordId != null) {
            updateScrap(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScrap(this.form).then(response => {
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
      const bsScrapRecordIds = row.bsScrapRecordId || this.ids;
      this.$modal.confirm('是否确认删除设备报废记录编号为"' + bsScrapRecordIds + '"的数据项？').then(function() {
        return delScrap(bsScrapRecordIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('instrument/scrap/export', {
        ...this.queryParams
      }, `scrap_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
