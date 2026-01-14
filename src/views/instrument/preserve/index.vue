<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
      @submit.native.prevent>
      <el-form-item label="公司" prop="ccustomername">
        <el-input v-model="queryParams.ccustomername" placeholder="请输入人员姓名" clearable style="width: 180px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="设备名称" prop="csgcarno">
        <el-input v-model="queryParams.csgcarno" placeholder="请输入设备名称" clearable style="width: 180px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate"
          v-hasPermi="['']">新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleQYM"
          v-hasPermi="['']">打印取样码</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handlePLSH"
          v-hasPermi="['']">批量审核</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" border :data="datasetList" style="width: 100%;min-height: 200px;"
      height="calc(100vh - 360px)">
      <el-table-column type="index" align="center" label="序号" width="50" />
      <el-table-column label="单据编号" align="center" prop="cstate" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="公司" align="center" prop="a" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" align="center" prop="b" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备编号" align="center" prop="c" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="保养日期" align="center" prop="d" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="u" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleqx(scope.row)"
            v-hasPermi="['']">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-check" @click="updateSupplierEnable('是', scope.row)"
            v-hasPermi="['']">启用</el-button>
          <el-button size="mini" type="text" icon="el-icon-close" @click="updateSupplierEnable('否', scope.row)"
            v-hasPermi="['']">禁用</el-button>
          <!-- <el-dropdown size="mini" @command="(command) => updateSupplierEnable(command, scope.row)" v-hasPermi="['']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="是">
                <svg-icon icon-class="extend-qiyong" class-name="margin-right-5" style="color: #333;" />启用
              </el-dropdown-item>
              <el-dropdown-item command="否">
                <svg-icon icon-class="extend-tingyong" class-name="margin-right-5" style="color: #333;" />禁用
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" :page-sizes="[10, 20, 30, 50, 100, 200]" />

  </div>
</template>

<script>
// import { delClasInfo, ClasInfolist, ClasInfoStatus } from "@/api/agri/siagle/ClasInfo.js";
// import { groupcontractList } from '@/api/agri/siagle/groupcontract';
export default {
  name: "Inspectioninputindex",
  dicts: ["qi_ting_type"],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      datasetList: [
        {
          cstate: 'BY00001',
          a: "滑县饲料",
          b: "电子天平",
          c: "YL2025040001",
          d: "2025-07-04",
          e: "王",
          f: "电子仪器",
          createBy: "王",
        }
      ],
      // 农事项目
      brandList: [],
      // 弹出层标题
      title: "",
      // 总条数
      total: 0,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 查询参数
      queryParams: {
        ccustomername: "",
        ccarno: "",
        cyear: "",
        iclass: "",
        ctypecode: "",
        cgroupcontractname: "",
        cissure: "",
        cisstart: "是",
        pageNum: 1,
        pageSize: 10,
      },
      ifxq: false,

    };
  },
  created() {
    // this.getList();
  },
  methods: {
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/ensiling/record/ClasInfo/export",
        {
          ...this.queryParams,
        },
        `收贮车辆信息_${new Date().getTime()}.xlsx`
      );
    },
    /** 查询公司项目列表 */
    getactiveList() {
      this.loading = true;
      var qulist = {
        pageNum: 1,
        pageSize: 100,
        bsysdel: 0,
        cisstart: "是"
      };
      this.brandList = [];
      groupcontractList(qulist).then((response) => {
        this.brandList = response.rows;
        if (this.brandList.length == 1) {
          this.queryParams.cgroupcontractid = this.brandList[0].cgroupcontractid;
          this.queryParams.cgroupcontractname = this.brandList[0].cgroupcontractname;

        }
        this.getList();
      });
    },
    cgroupclear() {
      this.queryParams.cgroupcontractid = "";
      this.queryParams.cgroupcontractname = "";
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      ClasInfolist(this.queryParams).then((response) => {
        console.log(response, '列表');
        this.datasetList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleCreate() {
      //直接跳转
      this.$router.push('/instrument/preservecreate');
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const id = row.id;
      //直接跳转
      this.$router.push({
        path: '/instrument/preservecreate',
        query: { id },
      });
    },
    /** 修改按钮操作 */
    handleqx(row) {
      const id = row.id;
      const ifxq = "ifxq";
      this.$router.push({
        path: '/instrument/preservecreate',
        query: { id, ifxq },
      });
    },
    handleDelete(row) {
      const abnormalId = row.id;
      this.$modal
        .confirm("是否确认删除该收割车辆信息")
        .then(function () {
          return delClasInfo(abnormalId);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {
        });
    },
    /** 更新状态操作 */
    updateSupplierEnable(val, row) {
      let enableFlag = val;
      let text;
      if (enableFlag == '是') {
        text = '启用';
        if (row.cissure == enableFlag) {
          this.$modal.msgError('已经"' + text + '"');
          return;
        }
        this.$modal
          .confirm('确定要【' + text + '】' + "该条信息" + '？')
          .then(function () {
            return ClasInfoStatus(row.id);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess(text + '成功');
          })
          .catch(() => {
          });
      }
      if (enableFlag == '否') {
        text = '禁用';
        if (row.cissure == enableFlag) {
          this.$modal.msgError('已经"' + text + '"');
          return;
        }
        this.$modal
          .confirm('确定要【' + text + '】' + "该条信息" + '？')
          .then(function () {
            return ClasInfoStatus(row.id);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess(text + '成功');
          })
          .catch(() => {
          });
      }
    },
  },
};
</script>