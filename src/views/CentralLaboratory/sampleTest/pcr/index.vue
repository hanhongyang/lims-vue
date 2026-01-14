<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">

      <el-tab-pane label="待审核" name="2">
        <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true" v-show="showSearch"
          label-width="70px">
          <el-form-item label="导入人" prop="testUser">
            <el-input v-model="queryParams2.testUser" placeholder="请输入导入人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="导入时间">
            <el-date-picker clearable v-model="testTimeRange" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文件名" prop="fileName">
            <el-input v-model="queryParams2.fileName" placeholder="请输入文件名" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="baseListPending" height="64vh">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="导入时间" align="center" prop="testEndTime" />
          <el-table-column label="导入人" align="center" prop="testUser" />
          <el-table-column label="导入文件名" align="center" prop="fileName" />
          <el-table-column label="导出文件名" align="center" prop="exportFileName" />
          <el-table-column label="导出条数" align="center" prop="fileSize" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-info" @click="getInfo(scope.row)">详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>


        <pagination v-show="total > 0 && activeTab === '2'" :total="total" :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize" @pagination="getList" />

      </el-tab-pane>

      <el-tab-pane label="已审核" name="3">
        <el-form :model="queryParams3" ref="queryForm3" size="small" :inline="true" v-show="showSearch"
          label-width="70px">
          <el-form-item label="导入人" prop="testUser">
            <el-input v-model="queryParams3.testUser" placeholder="请输入导入人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="审核日期">
            <el-date-picker clearable v-model="daterangeExamineDate" type="daterange" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 240px">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="文件名" prop="fileName">
            <el-input v-model="queryParams3.fileName" placeholder="请输入文件名" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="导入条数" prop="fileSize">
            <el-input v-model="queryParams3.fileSize" placeholder="请输入导入条数" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="baseListAudited" height="64vh">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="导入时间" align="center" prop="testEndTime" />
          <el-table-column label="导入人" align="center" prop="testUser" />
          <el-table-column label="导入文件名" align="center" prop="fileName" />
          <el-table-column label="导出文件名" align="center" prop="exportFileName" />
          <el-table-column label="导出条数" align="center" prop="fileSize" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-refresh-left"
                @click="handleCancelExamine(scope.row)">取消审核</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">作废</el-button>
            </template>
          </el-table-column>
        </el-table>


        <pagination v-show="total > 0 && activeTab === '3'" :total="total" :page.sync="queryParams3.pageNum"
          :limit.sync="queryParams3.pageSize" @pagination="getList" />

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { listTask } from "@/api/CentralLaboratory/task";
import { cancelExaminePcrResult } from "@/api/CentralLaboratory/sampleTest";
export default {
  name: "pcrResultBase",
  dicts: ['pcr_result_status', 'pcr_task_item_type'],
  data() {
    return {
      activeTab: '2',
      loading: true,
      showSearch: true,
      total: 0,
      baseListPending: [],
      baseListAudited: [],

      // 待审核查询参数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        testUser: null,
        entrustOrderType: '3',
        status: '2',
        fileName: null,
        fileSize: null,
        beginTestDate: null,
        endTestDate: null
      },
      // 已审核查询参数 (日期字段已还原)
      queryParams3: {
        pageNum: 1,
        pageSize: 10,
        testUser: null,
        entrustOrderType: '3',
        status: '3',
        fileName: null,
        fileSize: null,
        // *** 还原为审核日期字段 ***
        beginExamineDate: null, // 审核时间开始
        endExamineDate: null// 审核时间结束
        // 移除导入日期字段
        // beginTestDate: null,
        // endTestDate: null
      },

      testTimeRange: [], // 待审核 - 导入时间范围
      // testTimeRangeAudited: [], // 不再需要
      daterangeExamineDate: [], // 已审核 - 审核日期范围 (还原)

      form: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 获取当前激活 Tab 的查询参数 */
    getCurrentQueryParams() {
      return this.activeTab === '2' ? this.queryParams2 : this.queryParams3;
    },

    /** 查询样品化验PCR列表 */
    getList() {
      this.loading = true;
      let queryParams = this.getCurrentQueryParams();

      listTask(queryParams).then(response => {
        this.total = response.total;
        if (this.activeTab === '2') {
          this.baseListPending = response.rows;
        } else {
          this.baseListAudited = response.rows;
        }
        this.loading = false;
      }).catch(error => {
        console.error("查询失败", error);
        this.loading = false;
      });
    },

    // 处理 Tab 切换
    handleTabClick(tab) {
      this.getCurrentQueryParams().pageNum = 1;
      this.resetQuery(); // 调用重置，它会处理日期并调用 getList
    },

    // 取消按钮 (保留)
    cancel() {
      this.open = false;
      this.reset();
    },

    // resetForm 辅助方法
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    },

    /** 搜索按钮操作 (日期逻辑已还原) */
    handleQuery() {
      let queryParams = this.getCurrentQueryParams();
      queryParams.pageNum = 1;

      // 根据 Tab 设置日期范围
      if (this.activeTab === '2') {
        // 待审核：使用 testTimeRange 设置 beginTestDate / endTestDate
        if (this.testTimeRange && this.testTimeRange.length === 2) {
          queryParams.beginTestDate = this.testTimeRange[0];
          queryParams.endTestDate = this.testTimeRange[1];
        } else {
          queryParams.beginTestDate = null;
          queryParams.endTestDate = null;
        }
      } else { // activeTab === '3'
        // 已审核：使用 daterangeExamineDate 设置 beginExamineDate / endExamineDate
        if (this.daterangeExamineDate && this.daterangeExamineDate.length === 2) {
          queryParams.beginExamineDate = this.daterangeExamineDate[0];
          queryParams.endExamineDate = this.daterangeExamineDate[1];
        } else {
          queryParams.beginExamineDate = null;
          queryParams.endExamineDate = null;
        }
        // 清空不再使用的导入日期参数
        // queryParams.beginTestDate = null;
        // queryParams.endTestDate = null;
      }
      this.getList();
    },

    /** 重置按钮操作 (日期逻辑已还原) */
    resetQuery() {
      if (this.activeTab === '2') {
        this.resetForm("queryForm2");
        this.testTimeRange = []; // 重置待审核的日期选择器
        // 重置 queryParams2
        this.queryParams2 = {
          pageNum: 1,
          pageSize: this.queryParams2.pageSize, // 保留 pageSize
          testUser: null,
          entrustOrderType: '3',
          status: '2',
          fileName: null,
          fileSize: null,
          beginTestDate: null,
          endTestDate: null
        };
      } else { // activeTab === '3'
        this.resetForm("queryForm3");
        this.daterangeExamineDate = []; // 重置已审核的日期选择器
        // 重置 queryParams3
        this.queryParams3 = {
          pageNum: 1,
          pageSize: this.queryParams3.pageSize, // 保留 pageSize
          testUser: null,
          entrustOrderType: '3',
          status: '3',
          fileName: null,
          fileSize: null,
          beginExamineDate: null, // 还原为审核日期
          endExamineDate: null    // 还原为审核日期
        };
      }
      this.handleQuery(); // 调用 handleQuery 会自动调用 getList
    },

    // 详情按钮操作 (待审核 Tab)
    getInfo(row) {
      const resultNo = row.resultNo;
      // ** 注意：如果 getInfo 跳转的页面需要 pcrTaskItemType， **
      // ** 而已审核列表的 row 中不再包含它，需要额外处理 **
      // const pcrTaskItemType = row.pcrTaskItemType; // 可能为 undefined

      // 临时方案：如果 pcrTaskItemType 缺失，可以尝试从 queryParams3 获取（如果用户已选择）
      // 或提示用户无法跳转，或修改后端让已审核列表也返回 pcrTaskItemType
      const pcrTaskItemType = row.pcrTaskItemType || this.queryParams3.pcrTaskItemType;
      if (!pcrTaskItemType && this.activeTab === '3') {
        this.$modal.msgWarning("无法确定检测项目类型，请先在查询条件中选择");
        return;
      }
      const blTemplateType = row.blTemplateType || this.queryParams3.blTemplateType;
      this.$router.push({
        path: '/CentralLaboratory/pcrResultInfo',
        query: {
          resultNo: resultNo,
          pcrTaskItemType: pcrTaskItemType,
          blTemplateType: blTemplateType,
          t: Date.now()
        }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },

    // 取消审核按钮操作（已审核 Tab）
    handleCancelExamine(row) {
      // 确认后端接口需要的参数 (假设需要 resultNo)
      const resultNo = row.resultNo;
      this.$modal.confirm('是否确认取消审核化验单号为"' + resultNo + '"的检测结果？').then(() => {
        return cancelExaminePcrResult({ resultNo: resultNo });
      }).then(() => {
        this.$modal.msgSuccess("取消审核成功");
        this.getList();
      }).catch((err) => {
        if (err !== 'cancel') {
          this.$modal.msgError(err.msg || "取消审核失败");
        }
      });
    },

    // 作废按钮操作（待审核/已审核 Tab）
    handleDelete(row) {
      // 确认后端接口需要的参数 (假设需要 resultNo)
      const resultNo = row.resultNo;
      this.$modal.confirm('是否确认作废化验单号为"' + resultNo + '"的检测结果？').then(() => {
        // TODO: 确认并调用作废接口
        // return deletePcrResult(resultNo);
        this.$modal.msgSuccess("作废成功 (模拟)");
        this.getList();
      }).catch(() => { });
    },

    /** 导出按钮操作 (日期逻辑已还原) */
    handleExport() {
      let queryParams = this.getCurrentQueryParams();

      // 确保日期范围参数被正确传递
      if (this.activeTab === '2') {
        if (this.testTimeRange && this.testTimeRange.length === 2) {
          queryParams.beginTestDate = this.testTimeRange[0];
          queryParams.endTestDate = this.testTimeRange[1];
        } else {
          queryParams.beginTestDate = null;
          queryParams.endTestDate = null;
        }
      } else { // activeTab === '3'
        if (this.daterangeExamineDate && this.daterangeExamineDate.length === 2) {
          queryParams.beginExamineDate = this.daterangeExamineDate[0];
          queryParams.endExamineDate = this.daterangeExamineDate[1];
        } else {
          queryParams.beginExamineDate = null;
          queryParams.endExamineDate = null;
        }
        // 移除不再需要的导入日期参数
        // delete queryParams.beginTestDate;
        // delete queryParams.endTestDate;
      }

      this.download('labtest/base/export', {
        ...queryParams // 发送当前 tab 的查询参数
      }, `base_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>