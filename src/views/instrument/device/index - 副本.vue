<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
      @submit.native.prevent>
      <el-form-item label="公司" prop="ccustomername">
        <el-input v-model="queryParams.ccustomername" placeholder="请输入人员姓名" clearable style="width: 180px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="物料" prop="csgcarno">
        <el-input v-model="queryParams.csgcarno" placeholder="请输入物料" clearable style="width: 180px"
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
      <el-table-column label="是否启用" align="center" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="公司" align="center" prop="a" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备名称" align="center" prop="b" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备编号" align="center" prop="c" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备型号" align="center" prop="d" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="责任人" align="center" prop="e" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="设备类型" align="center" prop="f" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="u" min-width="160" :show-overflow-tooltip="true" />
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleJL(scope.row)"
            v-hasPermi="['']">使用记录</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-document" @click="handleqx(scope.row)"
            v-hasPermi="['']">详情</el-button>   
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" :page-sizes="[10, 20, 30, 50,100,200]" />
    <el-dialog title="使用记录" :visible.sync="openwl" width="1200px" append-to-body>
      <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true">
        <el-form-item label="检测方法" prop="supplierName">
          <el-input v-model="queryParams2.supplierName" placeholder="请输入检测方法" clearable style="width: 180px"
            @keyup.enter.native="handleQuery2" />
        </el-form-item>
        <el-form-item label="项目名称" prop="leader">
          <el-input v-model="queryParams2.leader" placeholder="请输入项目名称" clearable style="width: 240px"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery2">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery2">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table :data="supplierlist" ref="table" style="width: 100%" max-height="420" @row-click="supplierclick">
          <el-table-column label="使用时间" align="center" prop="a" />
          <el-table-column label="使用人" align="center" prop="s" />
          <el-table-column label="检测项目" align="center" prop="d" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getSupplier" />
      </el-row>
   
    </el-dialog>
  </div>
</template>

<script>
  // import { delClasInfo, ClasInfolist, ClasInfoStatus } from "@/api/agri/siagle/ClasInfo.js";
  // import { groupcontractList } from '@/api/agri/siagle/groupcontract';
  export default {
    name: "device",
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
            cstate: '启用',
            a: "滑县饲料",
            b: "电子天平",
            c: "YL2025040001",
            d: "DZTP321",
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
        queryParams2: {
        },
        ifxq: false,
        openwl: false,
        supplierlist: [
          {
            a: '2025-07-03 10:30:25',
            s: '小明',
            d: '钙',
          },
          {
            a: '2025-07-04 15:30:25',
            s: '王',
            d: '三聚氰胺',
          },
          {
            a: '2025-07-05 11:30:25',
            s: '李',
            d: '粗蛋白',
          },
          {
            a: '2025-07-06 16:30:25',
            s: '小明',
            d: '水份',
          },
        ]
      };
    },
    created() {
      // this.getList();
    },
    methods: {
      handleJL() {
        this.openwl = true
      },
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
        this.$router.push('/instrument/devicecreate');
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row.id;
        //直接跳转
        this.$router.push({
          path: '/instrument/devicecreate',
          query: { id },
        });
      },
      /** 修改按钮操作 */
      handleqx(row) {
        const id = row.id;
        const ifxq = "ifxq";
        this.$router.push({
          path: '/instrument/devicecreate',
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
          // 状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    },
  };
</script>