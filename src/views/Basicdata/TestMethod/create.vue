<template>
  <div class="app-container">
    <div class="aboustform">
      <div class="form-data-header" style="margin-bottom: 0; padding: 0">
        <div class="form-data-header-title" @click="goBack">
          <i class="el-icon-back"></i>
          返回
          <span></span>
        </div>
        <div class="form-data-header-content"></div>
        <div class="form-data-header-tools">
          <!-- 搜索条件 -->
          <el-button
            @click="saveForm"
            size="mini"
            type="primary"
            :disabled="BCZT">
            保存
          </el-button>
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleCreate"
            v-if="isregiet"
            v-hasPermi="['basicdata:labtestMethods:add']">新增</el-button>
        </div>
      </div>
    </div>
    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="检测项目" prop="itemName">
              <el-input
                v-model="form.itemName"
                style="width: 100%"
                placeholder="请选择检测项目名称"
                class="input-with-select"
                readonly>
                <template #append>
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="getlabTestList()"></el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="检测方法" prop="methodName">
              <el-input v-model="form.methodName" placeholder="检测方法" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="温度值(°C)" prop="temperatureMax">
              <div style="display: flex">
                <el-input
                  v-model="form.temperatureMax"
                  placeholder="温度高值"
                  oninput="value=value.replace(/[^\d.]/g,'');" />
                <span style="margin: 0 3px">——</span>
                <el-input
                  v-model="form.temperatureMin"
                  placeholder="温度低值"
                  oninput="value=value.replace(/[^\d.]/g,'');" />
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="温度低值(°C)" prop="temperatureMin">
              <el-input v-model="form.temperatureMin" placeholder="温度低值" />
            </el-form-item>
          </el-col> -->

          <el-col :span="8">
            <el-form-item label="湿度值" prop="humidityMax">
              <div style="display: flex">
                <el-input
                  v-model="form.humidityMax"
                  placeholder="湿度高值"
                  oninput="value=value.replace(/[^\d.]/g,'');" />
                <span style="margin: 0 3px">——</span>
                <el-input
                  v-model="form.humidityMin"
                  placeholder="湿度低值"
                  oninput="value=value.replace(/[^\d.]/g,'');" />
              </div>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="湿度低值" prop="humidityMin">
           
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="制单人" prop="createBy">
              <el-input
                v-model="form.createBy"
                placeholder="请输入制单人"
                disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单时间" prop="createTime">
              <el-input
                v-model="form.createTime"
                placeholder="请输入制单时间"
                disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="设备信息" name="设备信息">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="getinstruments()">添加</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="instrumentsList">
          <el-table-column
            label="设备名称"
            align="center"
            prop="instrumentName"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="设备编码"
            align="center"
            prop="instrumentCode"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="instrumentsDelete(scope.$index)"
                style="color: red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="检测公式" name="检测公式">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addattribute('检测公式')">添加</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="labtestMethodsFormulaList">
          <el-table-column
            label="公式表达式"
            align="center"
            prop="formulaContent"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="公式描述"
            align="center"
            prop="formulaDescription"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="testDelete(scope.$index)"
                style="color: red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="检测属性" name="检测属性">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="addattribute('检测属性')">添加</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="labtestMethodsAttributeList">
          <el-table-column
            label="属性名称"
            align="center"
            prop="attributeName"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="属性编号"
            align="center"
            prop="attributeCode"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="属性类型"
            align="center"
            prop="attributeType"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="序号"
            align="center"
            prop="seqNo"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="默认值"
            align="center"
            prop="defaultValue"
            :show-overflow-tooltip="true"
            min-width="120" />
          <!-- 这里需要问一下客户 -->

          <el-table-column
            label="最大值"
            align="center"
            prop="maxValue"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="最小值"
            align="center"
            prop="minValue"
            :show-overflow-tooltip="true"
            min-width="120" />
          <el-table-column
            label="操作"
            align="center"
            width="140"
            class-name="small-padding fixed-width"
            fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="AttributeDelete(scope.$index)"
                style="color: red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 检测项目 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1200px"
      append-to-body>
      <el-form
        :model="queryParams2"
        ref="queryForm2"
        size="small"
        :inline="true">
        <el-form-item label="检测项目名称" prop="itemName">
          <el-input
            v-model="queryParams2.itemName"
            placeholder="请输入项目名称"
            clearable
            style="width: 240px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini"
            @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table
          :data="labTestlist"
          ref="table"
          style="width: 100%"
          height="60vh"
          @row-click="labTestclick">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column
            label="检测项目名称"
            align="center"
            prop="itemName"
            min-width="200" />
          <el-table-column
            label="检测项目编码"
            align="center"
            prop="itemCode"
            min-width="200" />
          <el-table-column
            label="制单人"
            align="center"
            prop="createBy"
            width="100"
            :show-overflow-tooltip="true" />
          <el-table-column
            label="制单时间"
            align="center"
            prop="createTime"
            width="170">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="labtesttotal > 0"
          :total="labtesttotal"
          :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize"
          @pagination="getlabTestList" />
      </el-row>
    </el-dialog>

    <!-- 添加 -->
    <el-dialog
      :title="Formulatitle"
      :visible.sync="Formulaopen"
      width="500px"
      append-to-body>
      <el-form
        ref="testForm"
        :model="testFormula"
        :rules="testFormularules"
        label-width="100px"
        v-if="Formulatitle == '检测公式'">
        <el-form-item label="公式表达式" prop="formulaContent">
          <el-input
            v-model="testFormula.formulaContent"
            placeholder="公式表达式" />
        </el-form-item>
        <el-form-item label="公式描述" prop="formulaDescription">
          <el-input
            type="textarea"
            v-model="testFormula.formulaDescription"
            placeholder="公式描述" />
        </el-form-item>
      </el-form>
      <el-form
        ref="AttributeForm"
        :model="AttributeFormula"
        :rules="AttributeFormularules"
        label-width="100px"
        v-if="Formulatitle == '检测属性'">
        <el-form-item label="属性名称" prop="attributeName">
          <el-input
            v-model="AttributeFormula.attributeName"
            placeholder="属性名称" />
        </el-form-item>
        <el-form-item label="属性编号" prop="attributeCode">
          <el-input
            v-model="AttributeFormula.attributeCode"
            placeholder="属性编号" />
        </el-form-item>
        <el-form-item label="属性类型" prop="attributeType">
          <el-select
            v-model="AttributeFormula.attributeType"
            placeholder="状态"
            clearable
            style="width: 100%">
            <el-option label="字符" value="1" />
            <el-option label="数字" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="序号" prop="seqNo">
          <el-input v-model="AttributeFormula.seqNo" placeholder="序号" />
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input
            v-model="AttributeFormula.defaultValue"
            placeholder="默认值" />
        </el-form-item>
        <el-form-item label="最大值" prop="maxValue">
          <el-input v-model="AttributeFormula.maxValue" placeholder="最大值" />
        </el-form-item>
        <el-form-item label="最小值" prop="minValue">
          <el-input v-model="AttributeFormula.minValue" placeholder="最小值" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <selectlandsb
      ref="selectLandSb"
      :instrumentslist="instrumentsList"
      @affirm="agriaffirm" />
  </div>
</template>

<script>
import {
  getpagelabTestlist,
  getdetail,
  addobj,
  updateobj,
  getinstrumentslist,
} from "@/api/Basicdata/TestMethod";
import selectLandSb from "./selectLandSb";
export default {
  name: "TestMethodcreate",
  components: { selectLandSb },
  data() {
    return {
      isregiet: false,
      activeName: "设备信息",
      // 表单参数
      form: {
        bsLabtestItemsId: "",
        itemName: "",
        itemCode: "",

        methodName: "",
        temperatureMax: "",
        temperatureMin: "",
        humidityMax: "",
        humidityMin: "",
      },
      // 表单校验
      rules: {
        itemName: [{ required: true, message: "请选择检测项目" }],
        instrumentCode: [
          { required: true, message: "请选择设备", trigger: "blur" },
        ],
        methodName: [
          { required: true, message: "请输入检测方法", trigger: "blur" },
        ],
        temperatureMax: [
          { required: true, message: "请输入温度高值", trigger: "blur" },
        ],
        temperatureMin: [
          { required: true, message: "请输入温度低值", trigger: "blur" },
        ],
        humidityMax: [
          { required: true, message: "请输入湿度高值", trigger: "blur" },
        ],
        humidityMin: [
          { required: true, message: "请输入湿度低值", trigger: "blur" },
        ],
      },
      BCZT: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        bsysdel: "0",
      },
      labTestlist: [],
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        itemName: "",
      },

      labtesttotal: 0,
      instrumentsopen: false,
      instrumentstotal: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      instrumentsList: [],
      labtestMethodsFormulaList: [],
      testFormula: {
        formulaContent: "",
        formulaDescription: "",
      },
      // 表单校验
      testFormularules: {
        formulaContent: [{ required: true, message: "请输入公式表达式" }],
        formulaDescription: [
          { required: true, message: "请输入公式描述", trigger: "blur" },
        ],
      },
      Formulaopen: false,
      Formulatitle: "",
      labtestMethodsAttributeList: [],
      AttributeFormula: {
        attributeName: "",
        attributeCode: "",
        attributeType: "1",
        seqNo: "",
        defaultValue: "",
        maxValue: "",
        minValue: "",
      },
      // 表单校验
      AttributeFormularules: {
        attributeName: [{ required: true, message: "请输入属性名称" }],
        attributeCode: [
          { required: true, message: "请输入属性编号", trigger: "blur" },
        ],
        seqNo: [{ required: true, message: "请输入序号", trigger: "blur" }],
      },
    };
  },
  created() {
    const query = this.$route.query;
    this.form.bsLabtestMethodsId = query.id;
    if (query.id) {
      // 初始化数据
      this.getinfo();
    }
  },
  methods: {
    // 获取详情
    getinfo() {
      let id = this.$route.query.id;
      if (id != undefined) {
        getdetail(id).then((response) => {
          console.log(response, "详情");
          if (response.code == "200") {
            if (response.data) {
              this.form = response.data;
              if (this.form.labtestMethodsFormulaList) {
                this.labtestMethodsFormulaList =
                  this.form.labtestMethodsFormulaList;
              }
              if (this.form.labtestMethodsAttributeList) {
                this.labtestMethodsAttributeList =
                  this.form.labtestMethodsAttributeList;
              }
              if (this.form.instrumentsList) {
                this.instrumentsList = this.form.instrumentsList;
              }
            }
          }
        });
      }
    },
    // 获取设备
    getinstruments() {
      this.$refs.selectLandSb.show();
    },
    /** 牧场列表新增按钮操作 */
    agriaffirm(selectData) {
      console.log(this.instrumentsList);
      var queryland = [];
      for (var a = 0; a < this.instrumentsList.length; a++) {
        queryland.push(this.instrumentsList[a].bsInstrumentsId);
      }
      var templand = [];
      var newland = [];
      var oldland = [];
      var lanid = [];
      selectData.forEach((row, index) => {
        if (queryland.indexOf(row.bsInstrumentsId) >= 0) {
          lanid.push(row.bsInstrumentsId);
        } else {
          newland.push(row);
        }
      });
      this.instrumentsList.forEach((row, index) => {
        if (lanid.indexOf(row.bsInstrumentsId) >= 0) {
          templand.push(row);
        } else {
          oldland.push(row);
        }
      });
      this.instrumentsList = templand.concat(newland.concat(oldland));
      this.$refs.selectLandSb.hide();
    },

    // 获取检测项目
    getlabTestList() {
      this.loading = true;
      getpagelabTestlist(this.queryParams2).then((response) => {
        console.log(response);
        this.loading = false;
        if (response.code == "200") {
          this.labTestlist = response.rows;
          this.labtesttotal = response.total;
          this.open = true;
          this.title = "选择检测项目";
        }
      });
    },
    // 获取检测项目确认
    labTestclick(val) {
      console.log(val);
      this.form.itemName = val.itemName;
      this.form.itemCode = val.itemCode;
      this.form.bsLabtestItemsId = val.labtestItemsId;
      this.open = false;
      this.title = "";
    },
    /** 搜索按钮操作 */
    handleQuery2() {
      this.queryParams2.pageNum = 1;
      this.getlabTestList();
    },
    /** 重置按钮操作 */
    resetQuery2() {
      this.resetForm("queryForm");
      this.queryParams2 = {
        pageNum: 1,
        pageSize: 10,
        itemName: "",
      };
      this.getlabTestList();
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },

    goBack() {
      const obj = { path: "/Basicdata/TestMethod" };
      this.$tab.closeOpenPage(obj);
    },
    // 新增子表
    addattribute(type) {
      this.Formulatitle = type;
      this.Formulaopen = true;
      this.testFormula = {
        formulaContent: "",
        formulaDescription: "",
      };
      this.AttributeFormula = {
        attributeName: "",
        attributeCode: "",
        attributeType: "1",
        seqNo: "",
        defaultValue: "",
        maxValue: "",
        minValue: "",
      };
    },
    // 删除设备
    instrumentsDelete(index) {
      this.instrumentsList.splice(index, 1);
    },
    // 删除检测公式
    testDelete(index) {
      this.labtestMethodsFormulaList.splice(index, 1);
    },
    // 删除检测属性
    AttributeDelete(index) {
      this.labtestMethodsAttributeList.splice(index, 1);
    },
    // 保存子表
    submitForm() {
      if (this.Formulatitle == "检测公式") {
        console.log(this.testFormula);
        this.$refs["testForm"].validate((valid) => {
          if (valid) {
            this.labtestMethodsFormulaList.push(this.testFormula);
            this.Formulaopen = false;
          } else {
            this.$modal.msgError("请检查必填项是否填写");
          }
        });
      }
      if (this.Formulatitle == "检测属性") {
        this.$refs["AttributeForm"].validate((valid) => {
          if (valid) {
            this.labtestMethodsAttributeList.push(this.AttributeFormula);
            this.Formulaopen = false;
          } else {
            this.$modal.msgError("请检查必填项是否填写");
          }
        });
      }
    },
    // 关闭弹框
    cancel() {
      this.Formulaopen = false;
      this.testFormula = {
        formulaContent: "",
        formulaDescription: "",
      };
      this.AttributeFormula = {
        attributeName: "",
        attributeCode: "",
        attributeType: "1",
        seqNo: "",
        defaultValue: "",
        maxValue: "",
        minValue: "",
      };
    },
    /** 提交按钮 */
    saveForm: function () {
      if (Number(this.form.temperatureMax) < Number(this.form.temperatureMin)) {
        this.$modal.msgError("温度高值不能少于温度低值！");
        return;
      }
      if (Number(this.form.humidityMax) < Number(this.form.humidityMin)) {
        this.$modal.msgError("湿度高值不能少于湿度低值！");
        return;
      }
      if (this.instrumentsList.length == 0) {
        this.$modal.msgError("请添加设备信息");
        return;
      }
      if (this.labtestMethodsFormulaList.length == 0) {
        this.$modal.msgError("请添加检测公式");
        return;
      }
      if (this.labtestMethodsAttributeList.length == 0) {
        this.$modal.msgError("请添加检测属性");
        return;
      }
      this.form.labtestMethodsAttributeList = this.labtestMethodsAttributeList;
      this.form.labtestMethodsFormulaList = this.labtestMethodsFormulaList;
      this.form.instrumentsList = this.instrumentsList;
      this.BCZT = true;
      setTimeout(() => {
        this.BCZT = false;
      }, 2000);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.bsLabtestMethodsId != undefined) {
            this.loading = true;
            updateobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == 200) {
                this.$modal.msgSuccess("修改成功");
                this.getinfo();
              }
            });
          } else {
            this.loading = true;
            addobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == 200) {
                this.form.bsLabtestMethodsId = response.msg;
                const id = response.msg;
                this.$modal.msgSuccess("新增成功");
                this.$router.push({
                  path: "/Basicdata/TestMethodcreate",
                  query: { id },
                });
                this.getinfo();
              }
            });
          }
        } else {
          this.$modal.msgError("请检查必填项是否填写");
        }
      });
    },

    /** 新增按钮操作 */
    handleCreate() {
      //直接跳转
      const { path } = this.$route;
      this.$router.replace({
        path: "/redirect" + path,
      });
    },
  },
};
</script>

<style scoped>
.el-form-item {
  margin-bottom: 15px;
}
</style>