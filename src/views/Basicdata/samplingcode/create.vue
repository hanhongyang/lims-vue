<template>
  <div class="app-container">
    <div class="aboustform">
      <div class="form-data-header" style="margin-bottom: 0;padding: 0;">
        <div class="form-data-header-title" @click="goBack">
          <i class="el-icon-back"></i>
          返回
          <span></span>
        </div>
        <div class="form-data-header-content"></div>
        <div class="form-data-header-tools">
          <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT" v-if="!ifxq">
            保存
          </el-button>
          <el-button @click="printbtn" size="mini" type="primary">
            打印
          </el-button>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate" v-if="ifxq"
            v-hasPermi="['generate:code:create']">新增</el-button>
        </div>
      </div>
    </div>
    <div style="padding-top:40px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>

          <el-col :span="8">
            <el-form-item label="生成数量" prop="generationQuantity">
              <el-input v-model="form.generationQuantity" placeholder="请输入生成数量" oninput="if(value>500)value=500"
                :disabled="ifxq" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生成时间" prop="generationTime">
              <el-input v-model="form.generationTime" placeholder="系统自动生成" readonly="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="年度" prop="year">
              <el-date-picker v-model="form.year" type="year" placeholder="系统自动生成" value-format="yyyy" format="yyyy">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="牧场名称" prop="cztname">
              <el-input v-model="form.cztname" placeholder="系统自动生成" readonly="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="牧场简码" prop="ccorpcode">
              <el-input v-model="form.ccorpcode" placeholder="系统自动生成" readonly="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公司名称" prop="companyName">
              <el-input v-model="form.companyName" placeholder="系统自动生成" readonly="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="系统自动生成" readonly="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider content-position="left" class="mb40-mt24">
        <i class="el-icon-s-operation" style="font-size: 16px;"></i> <b style="font-size: 16px;">取样码</b>
      </el-divider>
      <el-table :data="ensilingbillList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" style="width: 100%"
        ref="multipleTable" row-key="id" height="400">
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="使用状态" align="center" prop="whetherUse">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_yes_no2" :value="scope.row.whetherUse" />
          </template>
        </el-table-column>
        <el-table-column label="取样码" align="center" prop="code" :show-overflow-tooltip="true" min-width="200" />
      </el-table>
      <el-pagination class="pagination" @current-change="cellhandleCurrentChange" @size-change="cellhandleSizeChange"
        :page-size="pageSize" layout="total, prev, pager, next" :total="celltotal" style="float: right;">
      </el-pagination>

    </div>


  </div>
</template>

<script>
import { getdetail, updateobj, addobj } from '@/api/Basicdata/samplingcode';

export default {
  name: 'addsamplingcode',
  dicts: ['sys_yes_no2'],
  data() {
    return {
      // 表单参数
      form: {
        mainSamplingCode: "",
        generationQuantity: "",
        generationTime: "",
        year: "",
        companyName: "",
        deptName: "",
      },
      celltotal: 0,
      currentPage: 1,
      pageSize: 50,
      // 表单校验
      rules: {
        generationQuantity: [{ required: true, message: "请输入单据数量", trigger: "blur" }],
      },
      isuse: [
        {
          value: 0,
          label: "否"
        },
        {
          value: 1,
          label: "是"
        },
      ],
      loading: false,
      BCZT: false,
      ifxq: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10000,
        bsysdel: "0",
      },
      ensilingbillList: [],
      total: 0,
      formprint: {
        pageNum: 1,
        currentPage4: 1,
        total: 0,
        censilingcode1: "",
        censilingcode2: "",
        nowTime: "",
        ccaozuo: ""
      },
    };
  },
  created() {
    this.getinfo();
  },
  methods: {
    cellhandleSizeChange(val) {
      this.pageSize = val;
    },
    cellhandleCurrentChange(val) {
      this.currentPage = val;
    },
    // 获取详情
    getinfo() {
      let id = this.$route.query.id;
      this.ensilingbillList = [];
      if (id != undefined) {
        this.ifxq = true
        getdetail(id).then((response) => {
          console.log(response, '详情')
          this.ifxq = true;
          this.form = response.data;
          if (this.form.opSamplingCodeList != null) {
            this.ensilingbillList = this.form.opSamplingCodeList;
            this.celltotal = this.ensilingbillList.length;
          }

        });
      }
    },

    /** 提交按钮 */
    saveForm: function () {
      console.log(this.form, '保存')
      this.BCZT = true;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.generateSamplingCodeId != undefined) {
            updateobj(this.form).then((response) => {
              this.BCZT = false;
              if (response.code == 200) {
                this.$modal.msgSuccess('修改成功');
                this.getinfo();
              }
            });
          } else {
            addobj(this.form).then((response) => {
              this.BCZT = false;
              if (response.code == 200) {
                this.form.generateSamplingCodeId = response.msg;
                const id = response.msg;
                this.$modal.msgSuccess("新增成功");
                this.$router.push({
                  path: '/samplingcode/create',
                  query: { id },
                });
                this.getinfo();
              }
            });
          }
        } else {
          this.$modal.msgError("请检查必填项是否填写");
          this.BCZT = false;
        }
      });
    },
    // 返回
    goBack() {
      const obj = { path: '/samplingcode' };
      this.$tab.closeOpenPage(obj);
    },
    /** 新增按钮操作 */
    handleCreate() {
      //直接跳转
      const { path } = this.$route;
      this.$router.replace({
        path: '/redirect' + path
      });
    },
    printbtn() {
      var id = this.form.generateSamplingCodeId;
      let routeUrl = this.$router.resolve({
        path: "/samplingcode/FastReport",
        query: {
          id: id
        }
      });
      window.open(routeUrl.href, '_blank');
    },

  },
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
</style>