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
          <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT">
            保存
          </el-button>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate" v-if="isregiet"
            v-hasPermi="['basicdata:labtestMethods:add']">新增</el-button>
        </div>
      </div>
    </div>
    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="人员名称" prop="nickName">
              <el-input v-model="form.nickName" style="width: 100%" placeholder="请选择人员名称" class="input-with-select"
                readonly>
                <template #append>
                  <el-button slot="append" icon="el-icon-search" @click="getListuser()"
                    :disabled="form.userLabtestItemId != undefined">
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="制单人" prop="createBy">
              <el-input v-model="form.createBy" placeholder="请输入制单人" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="制单时间" prop="createTime">
              <el-input v-model="form.createTime" placeholder="请输入制单时间" disabled />
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="检测项目" name="检测项目">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini"
              @click="getlabtestItemsList()">添加</el-button>
          </el-col>
        </el-row>
        <el-table style="width: 100%" :data="labtestItemsList">
          <el-table-column type="index" align="center" label="序号" width="50" />
          <el-table-column label="检测项目编码" align="center" prop="itemCode" min-width="200" />
          <el-table-column label="检测项目名称" align="center" prop="itemName" min-width="200" />
          <el-table-column label="人员类型" align="center" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.userType" placeholder="请选择" size="mini">
                <el-option label="检测人" value="1"></el-option>
                <el-option label="校对人" value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete" @click="labtestItemsDelete(scope.$index)"
                style="color: red">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 人员 -->
    <el-dialog :title="title" :visible.sync="open" width="1200px" append-to-body>
      <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true">
        <el-form-item label="用户名称" prop="nickName">
          <el-input v-model="queryParams2.nickName" placeholder="请输入用户名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table :data="urserlist" ref="table" style="width: 100%" height="60vh" @row-click="labuserclick">
          <el-table-column type="index" label="序号" width="50" />
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
          <el-table-column label="用户名称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" :show-overflow-tooltip="true" />
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
            :show-overflow-tooltip="true" />
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" width="120" />
        </el-table>
        <pagination v-show="labtesttotal > 0" :total="labtesttotal" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getListuser" />
      </el-row>
    </el-dialog>

    <selectLandXM ref="selectLandXM" :labtestItemsList="labtestItemsList" @affirm="agriaffirm" />
  </div>
</template>

<script>
import {
  getuserlist,
  getdetail,
  addobj,
  updateobj,
  getlabtestItemsList,
} from "@/api/Basicdata/RYJCXMcompare";
import selectLandXM from "./selectLandXM";
export default {
  name: "RYJCXMcomparecreate",
  components: { selectLandXM },
  data() {
    return {
      isregiet: false,
      activeName: "检测项目",
      // 表单参数
      form: {
        nickName: "",
        userLabtestItemId: "",
        labtestItemsIdList: "",
        userId: "",
      },
      // 表单校验
      rules: {
        nickName: [{ required: true, message: "请选择人员名称" }],
      },
      BCZT: false,
      // 查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 20,
        nickName: "",
        status: "0",
      },
      urserlist: [],

      labtesttotal: 0,
      labtestItemsopen: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      labtestItemsList: [],
    };
  },
  created() {
    const query = this.$route.query;
    this.form.userLabtestItemId = query.id;
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
              if (this.form.labtestItemsList) {
                this.labtestItemsList = this.form.labtestItemsList;
              }
            }
          }
        });
      }
    },
    // 获取项目
    getlabtestItemsList() {
      this.$refs.selectLandXM.show();
    },
    /** 牧场列表新增按钮操作 */
    agriaffirm(selectData) {
      console.log(this.labtestItemsList);
      var queryland = [];
      for (var a = 0; a < this.labtestItemsList.length; a++) {
        queryland.push(this.labtestItemsList[a].labtestItemsId);
      }
      var templand = [];
      var newland = [];
      var oldland = [];
      var lanid = [];
      selectData.forEach((row, index) => {
        if (queryland.indexOf(row.labtestItemsId) >= 0) {
          lanid.push(row.labtestItemsId);
        } else {
          // 【新增】如果是新添加的项目，给它赋默认值：1 (检测人)
          // 使用 $set 或者直接赋值确保响应式
          if (!row.userType) {
            row.userType = '1';
          }
          newland.push(row);
        }
      });
      this.labtestItemsList.forEach((row, index) => {
        if (lanid.indexOf(row.labtestItemsId) >= 0) {
          templand.push(row);
        } else {
          oldland.push(row);
        }
      });
      this.labtestItemsList = templand.concat(newland.concat(oldland));
      this.$refs.selectLandXM.hide();
    },

    // 获取人员
    getListuser() {
      this.loading = true;
      getuserlist(this.queryParams2).then((response) => {
        console.log(response);
        this.loading = false;
        if (response.code == "200") {
          this.urserlist = response.rows;
          this.labtesttotal = response.total;
          this.open = true;
          this.title = "选择人员";
        }
      });
    },
    // 获取人员确认
    labuserclick(val) {
      this.form.userId = val.userId;
      this.form.nickName = val.nickName;
      this.open = false;
      this.title = "";
    },
    /** 搜索按钮操作 */
    handleQuery2() {
      this.queryParams2.pageNum = 1;
      this.getListuser();
    },
    /** 重置按钮操作 */
    resetQuery2() {
      this.resetForm("queryForm");
      this.queryParams2 = {
        pageNum: 1,
        pageSize: 10,
        nickName: "",
        status: "0",
      };
      this.getListuser();
    },

    handleClick(tab, event) {
      // console.log(tab, event);
    },

    goBack() {
      const obj = { path: "/Basicdata/RYJCXMcompare" };
      this.$tab.closeOpenPage(obj);
    },

    // 删除检测项目
    labtestItemsDelete(index) {
      this.labtestItemsList.splice(index, 1);
    },

    /** 提交按钮 */
    saveForm: function () {
      if (this.labtestItemsList.length == 0) {
        this.$modal.msgError("请添加检测项目");
        return;
      }
      var templist = []
      for (let index = 0; index < this.labtestItemsList.length; index++) {
        const element = this.labtestItemsList[index];
        element.labtestItemsId
        templist.push(element.labtestItemsId)

      }
      this.form.labtestItemsIdList = templist.join(',')
      this.form.labtestItemsList = this.labtestItemsList;
      this.BCZT = true;
      setTimeout(() => {
        this.BCZT = false;
      }, 2000);
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userLabtestItemId != undefined) {
            this.loading = true;
            updateobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == 200) {
                this.$modal.msgSuccess("修改成功");
                this.goBack();
              }
            });
          } else {
            this.loading = true;
            addobj(this.form).then((response) => {
              this.loading = false;
              if (response.code == 200) {
                this.form.userLabtestItemId = response.msg;
                const id = response.msg;
                this.$modal.msgSuccess("新增成功");
                this.$router.push({
                  path: "/Basicdata/RYJCXMcomparecreate",
                  query: { id },
                });
                this.goBack();
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