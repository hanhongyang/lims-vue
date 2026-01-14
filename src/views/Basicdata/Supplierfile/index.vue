<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="SAP系统编号" label-width="auto" prop="sapCode">
        <el-input v-model="queryParams.sapCode" placeholder="请输入SAP系统编号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <!-- <el-form-item label="简称" prop="abbreviation">
        <el-input v-model="queryParams.abbreviation" placeholder="请输入简称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系人" prop="linkman">
        <el-input v-model="queryParams.linkman" placeholder="请输入联系人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="邮箱" prop="mailbox">
        <el-input v-model="queryParams.mailbox" placeholder="请输入邮箱" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="联系手机号" prop="phone" label-width="auto">
        <el-input v-model="queryParams.phone" placeholder="请输入联系手机号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-zoom-in" size="mini" @click="getInfoAll"
          :loading="btnLoad">获取供应商/客户信息
        </el-button>
      </el-col>

      <el-col :span="1.5">

      </el-col>
      <!--    <el-col :span="1.5">
           <el-button
             type="success"
             plain
             icon="el-icon-edit"
             size="mini"
             :disabled="single"
             @click="handleUpdate"
             v-hasPermi="['business:supplier:edit']"
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
             v-hasPermi="['business:supplier:remove']"
           >删除</el-button>
         </el-col>
         <el-col :span="1.5">
           <el-button
             type="warning"
             plain
             icon="el-icon-download"
             size="mini"
             @click="handleExport"
             v-hasPermi="['business:supplier:export']"
           >导出</el-button>
         </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-progress v-if="ifProgress" :percentage="percentage"></el-progress>

    <el-table v-loading="loading" :data="supplierList" max-height="610px" style="width: 100%;">
      <el-table-column type="index" align="center" label="序号" width="50" />
      <el-table-column label="SAP系统编号" align="center" prop="sapCode" width="120">
        <template slot-scope="scope">
          {{ removeLeadingZeros(scope.row.sapCode) }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="name" min-width="220" />
      <el-table-column label=" 简称" align="center" prop="abbreviation" min-width="150" />
      <el-table-column label="联系人" align="center" prop="linkman" min-width="140" />
      <el-table-column label="邮箱" align="center" prop="mailbox" min-width="140" />
      <el-table-column label="联系手机号" align="center" prop="phone" min-width="140" />
      <el-table-column label="备注" align="center" prop="remark" min-width="160" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="updateBy" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['business:supplier:edit']">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改供应商对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="SAP系统编号" prop="sapCode">
          <el-input v-model="form.sapCode" placeholder="请输入SAP系统编号" :disabled="true" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="简称" prop="abbreviation">
          <el-input v-model="form.abbreviation" placeholder="请输入简称" />
        </el-form-item>
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="form.linkman" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mailbox">
          <el-input v-model="form.mailbox" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="联系手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系手机号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="请输入备注" />
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
import {
  listSupplier,
  getSupplier,
  delSupplier,
  addSupplier,
  updateSupplier,
  getInfo,
  assignedAccount
} from '@/api/Basicdata/supplier';
import func from '@/utils/func';


export default {
  name: 'Supplier',
  dicts: ['supplier_type'],
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
      // 供应商表格数据
      supplierList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sapCode: null,
        name: null,
        abbreviation: null,
        linkman: null,
        mailbox: null,
        phone: null,
        type: null
      },
      // 表单参数
      form: {},

      // 表单校验
      rules: {
        remark: [
          { min: 0, max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
        ],
        mailbox: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, validator: this.validatePhone, trigger: 'blur' }
        ]
      },
      btnLoad: false,
      ifProgress: false,
      percentage: 0
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getInfoAll() {
      JSON.stringify();
      this.ifProgress = true;
      this.btnLoad = true;
      getInfo().then(res => {
        this.percentag = 0;
        const data = res.data;
        //计算耗时
        const numb = ((data * 23 + 10) / 1000);
        let time = 0;
        const timeObj = setInterval(() => {
          time += 1;
          const number = Math.floor((time / numb) * 100);
          this.percentage = number >= 100 ? 100 : number;
          if (this.percentage >= 100) {
            clearInterval(timeObj);
          }
        }, 1000);
        setTimeout(() => {
          clearInterval(timeObj);
          this.btnLoad = false;
          this.ifProgress = false;
          this.getList();
        }, data * 23 + 2000);
        //执行时间到达的时候
        this.$once('hook:beforeDestroy', () => {
          clearInterval(timeObj);
        });

      }).catch(error => {
        this.ifProgress = false;
        this.btnLoad = false;
      });
    },
    /**手机号校验规则*/
    validatePhone(rule, value, callback) {
      if (!value) {
        callback(new Error('手机号不能为空'));
      } else
        //使用正则表达式进行验证手机号码
        if (func.isVehiclePhone(value)) {
          callback(new Error('手机号不正确！'));
        } else {
          callback();
        }
    },
    /** 查询供应商列表 */
    getList() {
      this.loading = true;
      listSupplier(this.queryParams).then(response => {
        this.supplierList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        id: null,
        sapCode: null,
        name: null,
        abbreviation: null,
        linkman: null,
        mailbox: null,
        phone: null
      };
      this.resetForm('form');
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

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加供应商';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSupplier(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改供应商';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSupplier(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addSupplier(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除供应商名称为"' + row.name + '"的数据项？').then(function () {
        return delSupplier(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess('删除成功');
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('business/supplier/export', {
        ...this.queryParams
      }, `supplier_${new Date().getTime()}.xlsx`);
    },
    restAccForm() {
      this.accForm = {
        ids: [],
        id: null,
        sapCode: null,
        password: null
      };
    },
    assignedAccountSign(row) {
      //重置
      this.restAccForm();
      this.batchAcc = false;
      this.accForm.sapCode = row.sapCode;
      this.acc = true;
      this.accForm.id = row.id;
    },
    //批量分配账号
    assignedAccountAll() {
      this.restAccForm();
      this.batchAcc = true;
      this.acc = true;
      this.accForm.ids = this.ids;
    },
    assignedAccount() {
      const isEmpty = func.isEmpty(this.accForm.id);
      let ids = this.ids;
      if (!isEmpty) {
        ids = [this.accForm.id];
      }
      this.accForm.ids = ids;
      assignedAccount(this.accForm).then(res => {
        this.$modal.msgSuccess('分派成功');
        this.acc = false;
        this.getList();
      }).catch(err => {

      });
    },
    closeAccDialog() {
      this.acc = false;
    },
    // 去除字符串前面的0
    removeLeadingZeros(value) {
      if (!value) return value;
      // 转换为字符串并去除前导零
      return value.toString().replace(/^0+/, '');
    }
  }
}
</script>