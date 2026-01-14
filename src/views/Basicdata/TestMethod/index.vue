<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="检测项目" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" clearable
          @keyup.enter.native="handleQuery" style="width: 180px;" />
      </el-form-item>
      <el-form-item label="检测方法" prop="methodName">
        <el-input v-model="queryParams.methodName" placeholder="请输入检测方法" clearable
          @keyup.enter.native="handleQuery" style="width: 180px;" />
      </el-form-item>
              <el-form-item label="状态" prop="isEnable">
                <el-select v-model="queryParams.isEnable" placeholder="状态" clearable style="width: 240px">
                  <el-option v-for="dict in dict.type.qi_ting_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          v-hasPermi="['basicdata:labtestMethods:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:labtestMethods:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
      style="width: 100%;min-height: 200px;">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="检测项目" align="center" prop="itemName" min-width="200" />
       <el-table-column label="检测方法" align="center" prop="methodName" width="200" :show-overflow-tooltip="true" />
       <!-- <el-table-column label="设备名称" align="center" prop="instrumentName" width="200" :show-overflow-tooltip="true" /> -->
      <el-table-column label="温度最大值(°C)" align="center" prop="temperatureMax" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="温度最小值(°C)" align="center" prop="temperatureMin" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="湿度最大值" align="center" prop="humidityMax" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="湿度最小值" align="center" prop="humidityMin" width="120" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isEnable" active-value="1" inactive-value="0" @change="handleStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:labtestMethods:edit']">修改</el-button>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  
  </div>
</template>

<script>
  import { getpagelist,changestatus} from '@/api/Basicdata/TestMethod';
  export default {
     dicts: ["qi_ting_type"],
    name: "TestMethod",
    data() {
      return {
        // 遮罩层
        loading: false,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 【请填写功能名称】表格数据
        tablepagelist: [ ],
        // 弹出层标题
        title: "",
        isregiet: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          itemName: "",
          isEnable: "",
          methodName: "",
        },
    
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询【请填写功能名称】列表 */
      getList() {
        this.loading = true;
        getpagelist(this.queryParams).then(response => {
          console.log(response);
          if(response.code=='200'){
          this.tablepagelist = response.rows;
          this.total = response.total;
          this.loading = false;
          }
        });
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

     /** 新增按钮操作 */
      handleAdd() {
        //直接跳转
        this.$router.push('/Basicdata/TestMethodcreate');
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        const id = row.bsLabtestMethodsId;
        //直接跳转
        this.$router.push({
          path: '/Basicdata/TestMethodcreate',
          query: { id },
        });
      },
   // 状态修改
    handleStatusChange(row) {
      let text = row.isEnable === "1" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.methodName + '"角色吗？').then(function() {
        return changestatus(row.bsLabtestMethodsId, row.isEnable);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
           this.getList();
      }).catch(function() {
        row.isEnable = row.isEnable === "0" ? "1" : "0";
      });
    },
      /** 导出按钮操作 */
      handleExport() {
        this.download('/basicdata/labtestMethods/export', {
          ...this.queryParams
        }, `检测方法_${new Date().getTime()}.xlsx`);
      },

    }
  };
</script>