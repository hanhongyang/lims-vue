<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane v-if="checkRole(['feed:report:dbz'])" :label="`待编制 (${tabCounts['0']})`" name="0">
        <!-- 待编制列表 -->
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker
              v-model="daterangeReceiveTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item label="送样时间">
            <el-date-picker
              v-model="daterangeSendSampleTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
              v-if="activeTab === '0'"
              type="primary"
              plain
              icon="el-icon-document-add"
              size="mini"
              :disabled="multiple"
              @click="handleAddAll"
            >一键编制</el-button>
          </el-col>

          <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" height="58vh" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
</el-table-column> -->
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="送样时间" align="center" prop="sendSampleDate" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.sendSampleDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退回原因" align="center" prop="returnReason" />

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">编制</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <!-- <el-tab-pane :label="`待提交 (${tabCounts['1']})`" name="1">

        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="报告编号" prop="reportNo">
            <el-input v-model="queryParams.reportNo" placeholder="请输入报告编号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input v-model="queryParams.sampleName" placeholder="请输入样品名称" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="报告时间">
            <el-date-picker v-model="daterangeReportTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="55" align="center" />
           <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="报告编号" align="center" prop="reportNo" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报告时间" align="center" prop="reportTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="退回原因" align="center" prop="returnReason" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
               <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)"
                >详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>-->

      <el-tab-pane v-if="checkRole(['feed:report:dsh'])" :label="`待审核 (${tabCounts['2']})`" name="2">
        <!-- 待审核列表 -->
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="报告编号" prop="reportNo">
            <el-input
              v-model="queryParams.reportNo"
              placeholder="请输入报告编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker
              v-model="daterangeReceiveTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <!-- 待审核列表的el-form内，新增报告时间表单项 -->
          <el-form-item label="报告时间">
            <el-date-picker
              v-model="daterangeReportTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList(activeTab)" />
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" height="55vh" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column> -->
          <el-table-column label="报告编号" align="center" prop="reportNo" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报告时间" align="center" prop="reportTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane v-if="checkRole(['feed:report:dpz'])" :label="`待批准 (${tabCounts['3']})`" name="3">
        <!-- 待批准列表 -->
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="报告编号" prop="reportNo">
            <el-input
              v-model="queryParams.reportNo"
              placeholder="请输入报告编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker
              v-model="daterangeReceiveTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <!-- 待批准列表的el-form内，新增报告时间表单项 -->
          <el-form-item label="报告时间">
            <el-date-picker
              v-model="daterangeReportTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="daterangeCheckTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>

          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="审核人" prop="checkUser">
            <el-input
              v-model="queryParams.checkUser"
              placeholder="请输入审核人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList(activeTab)" />
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" height="55vh" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column> -->
          <el-table-column label="报告编号" align="center" prop="reportNo" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报告时间" align="center" prop="reportTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.reportTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">批准</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane v-if="checkRole(['feed:report:dfs'])" :label="`待发送 (${tabCounts['4']})`" name="4">
        <!-- 待发送列表 -->
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <!-- <el-form-item label="报告编号" prop="reportNo">
            <el-input v-model="queryParams.reportNo" placeholder="请输入报告编号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input v-model="queryParams.sampleName" placeholder="请输入样品名称" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input v-model="queryParams.sampleNo" placeholder="请输入样品编号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item> -->
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input
              v-model="queryParams.entrustOrderNo"
              placeholder="请输入委托单号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!--  <el-form-item label="接收时间">
            <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="签发时间">
            <el-date-picker v-model="daterangeIssuanceTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="批准时间">
            <el-date-picker v-model="daterangeApproveTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="审核人" prop="checkUser">
            <el-input v-model="queryParams.checkUser" placeholder="请输入审核人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="批准人" prop="approveUser">
            <el-input v-model="queryParams.approveUser" placeholder="请输入批准人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
            <!-- 修改发送按钮，点击打开邮箱选择弹窗 -->
            <!-- <el-button type="success" icon="el-icon-message" size="mini" @click="openEmailDialog"
              :disabled="!sendList || sendList.length === 0">
              发送
            </el-button> -->
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList(activeTab)" />
        </el-row>
        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" height="58vh" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column> -->
          <!-- <el-table-column label="报告编号" align="center" prop="reportNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" /> -->
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托样品数量" align="center" prop="ypzCount" />
          <el-table-column label="已批准样品数量" align="center" prop="wpzCount" />

          <!-- <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="签发时间" align="center" prop="issuanceTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.issuanceTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批准时间" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="批准人" align="center" prop="approveUser" />-->
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-promotion"
                @click="openEmailDialog(scope.row)"
              >发送报告</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-notebook-2"
                @click="downloadPdf(scope.row)">下载报告</el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <el-tab-pane :label="`已发送 (${tabCounts['5']})`" name="5">
        <!-- 已发送列表 -->
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="报告编号" prop="reportNo">
            <el-input
              v-model="queryParams.reportNo"
              placeholder="请输入报告编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品名称" prop="sampleName">
            <el-input
              v-model="queryParams.sampleName"
              placeholder="请输入样品名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="样品编号" prop="sampleNo">
            <el-input
              v-model="queryParams.sampleNo"
              placeholder="请输入样品编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="委托单位" prop="entrustDeptName">
            <el-input
              v-model="queryParams.entrustDeptName"
              placeholder="请输入委托单位"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="接收时间">
            <el-date-picker
              v-model="daterangeReceiveTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="签发时间">
            <el-date-picker
              v-model="daterangeIssuanceTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="daterangeCheckTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="批准时间">
            <el-date-picker
              v-model="daterangeApproveTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="审核人" prop="checkUser">
            <el-input
              v-model="queryParams.checkUser"
              placeholder="请输入审核人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="批准人" prop="approveUser">
            <el-input
              v-model="queryParams.approveUser"
              placeholder="请输入批准人"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="fs(activeTab)">发送</el-button> -->
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :show-search.sync="showSearch" @queryTable="getList(activeTab)" />
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" height="50vh" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column> -->
          <el-table-column label="报告编号" align="center" prop="reportNo" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="样品名称" align="center" prop="sampleName" />
          <el-table-column label="样品编号" align="center" prop="sampleNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="签发时间" align="center" prop="issuanceTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.issuanceTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批准时间" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="批准人" align="center" prop="approveUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">查看报告</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-notebook-2"
                @click="downloadPdf(scope.row)"
              >下载报告</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

    </el-tabs>
    <!-- 邮箱选择弹窗 -->
    <el-dialog
      title="选择发送邮箱"
      :visible.sync="emailDialogVisible"
      width="800px"
      :close-on-click-modal="false"
      @close="handleEmailDialogClose"
    >
      <div class="email-dialog-content">
        <!-- 邮箱列表表格 -->
        <el-table
          ref="emailTable"
          v-loading="emailLoading"
          :data="emailList"
          style="width: 100%"
          max-height="400"
          @selection-change="handleEmailSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="用户名称" prop="userName" align="center" min-width="120">
            <template slot-scope="scope">
              <span>{{ scope.row.userName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="邮箱地址" prop="email" align="center" min-width="200">
            <template slot-scope="scope">
              <el-tag type="info" size="small">{{ scope.row.email }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">选择要发送的样品报告</el-divider>

        <el-table
          ref="sampleTable"
          v-loading="emailLoading"
          :data="baseList"
          border
          style="width: 100%; margin-top: 10px;"
          max-height="300"
          size="mini"
          @selection-change="handleSampleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" :selectable="checkReportSelectable" />

          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="样品编号" prop="sampleNo" align="center" show-overflow-tooltip />
          <el-table-column label="样品名称" prop="sampleName" align="center" show-overflow-tooltip />

          <el-table-column label="批准状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '3'" type="warning" size="mini">待批准</el-tag>
              <el-tag v-else-if="['4', '5'].includes(scope.row.status)" type="success" size="mini">已批准</el-tag>
              <el-tag v-else type="info" size="mini">未生成</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="发送状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '4'" type="primary" size="mini" effect="plain">待发送</el-tag>
              <el-tag v-else-if="scope.row.status === '5'" type="success" size="mini" effect="plain">已发送</el-tag>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 选中信息统计 -->

        <!-- 发送内容预览 -->
        <!-- <div class="send-preview" v-if="sendList && sendList.length > 0">
          <el-alert title="发送内容预览" type="warning" :closable="false" show-icon>
            <p>共选择 <span class="highlight">{{ sendList.length }}</span> 个报告发送：</p>
            <ul class="report-preview">
              <li v-for="(item, index) in sendList" :key="index">
                委托单号: {{ item.entrustOrderNo }}
                (已批准: {{ item.ypzCount }}, 未批准: {{ item.wpzCount }})
              </li>
            </ul>
          </el-alert>
        </div> -->
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="emailDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="sendLoading"
          size="small"
          :disabled="selectedEmails.length === 0"
          @click="handleSend"
        >
          {{ sendLoading ? '发送中...' : '确 定 发 送' }}
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listJczxFeedReportBaseId,
  getReportCounts,
  sendpdf,
  emailList,
  addAllFeedReport
} from '@/api/CentralLaboratory/jczxFeedReport'
import { checkRole } from '@/utils/permission'
export default {
  name: 'JczxFeedReportBaseId',
  dicts: ['feed_report_status'],
  data() {
    return {
      // 2. 将默认 activeTab 设为空，等待 created 中计算
      activeTab: '',
      // 新增：样品报告列表数据
      baseList: [],
      // 新增：选中的样品列表
      selectedSamples: [],
      // 新增：暂存当前的委托单ID（用于发送时使用）
      currentFeedEntrustOrderId: null,
      // 新增：用于存放所有tab的数量
      tabCounts: {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 0
      },
      // 激活的标签页
      activeTab: '0',
      // 遮罩层
      loading: true,
      // 邮箱弹窗相关
      emailDialogVisible: false,
      emailLoading: false,
      sendLoading: false,
      emailList: [], // 邮箱列表数据
      selectedEmails: [], // 选中的邮箱列表
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedOpJczxFeedReportInfo: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 检测中心饲料报告主表格数据
      jczxFeedReportBaseIdList: [],
      // 检测中心饲料报告子表格数据
      opJczxFeedReportInfoList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 删除id时间范围
      daterangeReceiveTime: [],
      // 删除id时间范围
      daterangeTestTime: [],
      // 删除id时间范围
      daterangeCheckTime: [],
      // 删除id时间范围
      daterangeApproveTime: [],
      // 新增：报告时间范围（绑定日期选择器，数组格式：[开始时间, 结束时间]）
      daterangeReportTime: [],
      // 新增：签发时间范围
      daterangeIssuanceTime: [],
      daterangeSendSampleTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reportNo: null,
        sampleName: null,
        sampleNo: null,
        entrustOrderNo: null,
        entrustDeptName: null,
        receiveTime: null,
        testTime: null,
        checkTime: null,
        approveTime: null,
        editUser: null,
        checkUser: null,
        approveUser: null,
        status: '0', // 状态
        beginSendSampleTime: null, // 新增：后端需要的送样开始时间
        endSendSampleTime: null, // 新增：后端需要的送样结束时间
        // 新增：报告开始/结束时间（与后端字段名完全一致）
        beginReportTime: null,
        endReportTime: null,
        // 新增：签发时间参数
        beginIssuanceTime: null,
        endIssuanceTime: null
      },
      sendList: []
    }
  },
  activated() {
    // 4. 每次路由激活时，重新计算Tab
    // this.initActiveTab()
  },
  created() {
    // 3. 页面加载时，先计算应该显示哪个Tab
    this.initActiveTab()
    this.getList()
    this.getTabCounts()
  },
  methods: {
    // 切换Tab时调用
    switchTab(tab) {
      this.activeTab = tab
    },
    downloadPdfHH(url, fileName) {
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = fileName || '检测报告.pdf'
          link.click()
          window.URL.revokeObjectURL(link.href)
        })
        .catch(err => {
          this.$message.error('下载失败:' + err)
        })
    },
    downloadPdf(row) {
      // console.log(process.env.VUE_APP_PROXY_TARGET + row.pdfFileInfo, '11111')
      // 调用
      this.downloadPdfHH(
        row.pdfFileInfo,
        '饲料检测报告.pdf'
      )
    },
    /** 打开发送邮箱选择弹窗 */
    /** 打开发送邮箱选择弹窗 */
    openEmailDialog(row) {
      // 记录当前操作的委托单ID
      this.currentFeedEntrustOrderId = row.feedEntrustOrderId

      this.emailDialogVisible = true
      this.emailLoading = true

      // 重置数据
      this.emailList = []
      this.baseList = []
      this.selectedEmails = []
      this.selectedSamples = []

      // 调用接口
      emailList(row.feedEntrustOrderId).then(response => {
        this.emailLoading = false
        const data = response.data || {}

        // 1. 处理邮箱列表
        this.emailList = data.emailList || []
        if (this.emailList.length > 0) {
          this.selectAllEmails() // 默认全选邮箱
        } else {
          this.$message.warning('未找到可用的邮箱地址')
        }

        // 2. 处理样品报告列表
        this.baseList = data.baseList || []

        // 3. 默认选中所有“可发送”的样品 (状态不为3的)
        this.$nextTick(() => {
          if (this.$refs.sampleTable) {
            this.baseList.forEach(row => {
              // 如果状态不是3(待批准)，则默认勾选
              if (row.status !== '3' && row.status !== '5') {
                this.$refs.sampleTable.toggleRowSelection(row, true)
              }
            })
          }
        })
      }).catch(error => {
        this.emailLoading = false
        console.error('加载详情失败:', error)
        this.$message.error('加载详情失败')
      })
    },

    /** 表格复选框是否可选逻辑 (新增) */
    checkReportSelectable(row, index) {
      // 如果状态是 '3' (待批准)，则返回 false (不可选)
      // 只有 4(待发送) 和 5(已发送) 可以选
      return row.status !== '3'
    },

    /** 样品列表选中变化 (新增) */
    handleSampleSelectionChange(selection) {
      this.selectedSamples = selection
    },

    // openEmailDialog() {
    //   // 验证是否有选中的数据
    //   if (!this.sendList || this.sendList.length === 0) {
    //     this.$message.warning('请先选择要发送的报告数据');
    //     return;
    //   }

    //   this.emailDialogVisible = true;
    //   this.emailLoading = true;

    //   // 调用邮箱列表接口
    //   emailList().then(response => {
    //     this.emailList = response.rows || [];
    //     this.emailLoading = false;
    //     if (this.emailList.length === 0) {
    //       this.$message.warning('未找到可用的邮箱地址');
    //     } else {
    //       this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
    //       // 数据加载完成后自动全选
    //       this.selectAllEmails();
    //     }

    //   }).catch(error => {
    //     this.emailLoading = false;
    //     console.error('加载邮箱列表失败:', error);
    //     this.$message.error('加载邮箱列表失败');
    //   });
    // },

    selectAllEmails() {
      this.$nextTick(() => {
        if (this.$refs.emailTable) {
          // 确保表格数据已经渲染完成
          setTimeout(() => {
            this.$refs.emailTable.toggleAllSelection()
          }, 100)
        }
      })
    },
    /** 邮箱选择变化 */
    handleEmailSelectionChange(selection) {
      this.selectedEmails = selection
    },

    /** 移除选中的邮箱 */
    removeSelectedEmail(email) {
      const index = this.selectedEmails.findIndex(item => item.email === email.email)
      if (index > -1) {
        this.selectedEmails.splice(index, 1)
      }
    },

    /** 处理发送 */
    handleSend() {
      // 校验
      if (this.selectedEmails.length === 0) {
        this.$message.warning('请选择至少一个收件邮箱')
        return
      }
      if (this.selectedSamples.length === 0) {
        this.$message.warning('请选择至少一个要发送的样品报告')
        return
      }

      // 构造发送数据
      // 注意：这里改为遍历“选中的样品列表”来构造数据
      const sendData = this.selectedSamples.map(sample => ({
        // 关键：传具体的报告ID
        opJczxFeedReportBaseId: sample.opJczxFeedReportBaseId,
        // 传委托单ID
        feedEntrustOrderId: this.currentFeedEntrustOrderId,
        // 拼接选中的邮箱
        emails: this.selectedEmails.map(email => email.email).join(',')
      }))

      // 如果后端需要的是列表形式
      this.sendLoading = true
      sendpdf(sendData).then((res) => {
        this.sendLoading = false
        if (res.code === 200) {
          this.$message.success('报告发送成功')
          this.emailDialogVisible = false
          this.getList() // 刷新主列表
        } else {
          this.$message.error(res.msg || '发送失败')
        }
      }).catch(error => {
        this.sendLoading = false
        this.$message.error('发送失败: ' + (error.message || '未知错误'))
      })
    },

    /** 邮箱弹窗关闭处理 */
    handleEmailDialogClose() {
      this.selectedEmails = []
      this.emailLoading = false
      this.sendLoading = false
    },
    handlebgdy(row) {
      if (row.status == 0) {
        const encodedData = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId))

        window.open(
          `/reportgensl?feedEntrustOrderSampleId=${encodedData}&status=${row.status}&feedEntrustOrderId=${row.feedEntrustOrderId}`,
          '_blank' // 新标签页
        )
      } else {
        const encodedData = encodeURIComponent(JSON.stringify(row.opJczxFeedReportBaseId))
        const encodedData1 = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId))
        window.open(
          `/reportgensl?opJczxFeedReportBaseId=${encodedData}&status=${row.status}&feedEntrustOrderSampleId=${encodedData1}`,
          '_blank' // 新标签页
        )
      }
    },

    // 5. 注册 checkRole 以便在 js 逻辑中使用 (如果只在 template 用可以不写这行，但下面 initActiveTab 要用)
    checkRole,

    /** 6. 初始化选中Tab (核心逻辑) */
    initActiveTab() {
      // 如果有route.tab参数，直接使用该值
      if (this.$route.query.tab) {
        this.activeTab = this.$route.query.tab
        return
      }
      // 按照 Tab 的顺序，判断用户是否有对应角色
      // 如果有 "待编制" 角色，默认选中 '0'
      if (this.checkRole(['feed:report:dbz'])) {
        this.activeTab = '0'
      } else if (this.checkRole(['feed:report:dsh'])) { // 否则，如果有 "待审核" 角色，选中 '2'
        this.activeTab = '2'
      } else if (this.checkRole(['feed:report:dpz'])) { // 否则，如果有 "待批准" 角色，选中 '3'
        this.activeTab = '3'
      } else if (this.checkRole(['feed:report:dfs'])) { // 否则，如果有 "待发送" 角色，选中 '4'
        this.activeTab = '4'
      } else { // 如果以上角色都没有，默认显示 "已发送" (因为这个Tab所有人都有权限)
        this.activeTab = '5'
      }
    },

    /** 查询检测中心饲料报告主列表 */
    getList() {
      // 防止 activeTab 为空时发请求报错
      if (!this.activeTab) return

      this.loading = true
      this.queryParams.params = {}
      this.queryParams.status = this.activeTab // 根据当前tab设置status
      if (this.daterangeReceiveTime !== null && this.daterangeReceiveTime !== '') {
        this.queryParams['beginReceiveTime'] = this.daterangeReceiveTime[0]
        this.queryParams['endReceiveTime'] = this.daterangeReceiveTime[1]
      } else {
        // 清空参数（避免上次查询的残留值）
        this.queryParams.beginReceiveTime = null
        this.queryParams.endReceiveTime = null
      }
      if (this.daterangeTestTime !== null && this.daterangeTestTime !== '') {
        this.queryParams['beginTestTime'] = this.daterangeTestTime[0]
        this.queryParams['endTestTime'] = this.daterangeTestTime[1]
      }
      if (this.daterangeCheckTime !== null && this.daterangeCheckTime !== '') {
        this.queryParams['beginCheckTime'] = this.daterangeCheckTime[0]
        this.queryParams['endCheckTime'] = this.daterangeCheckTime[1]
      }
      if (this.daterangeApproveTime !== null && this.daterangeApproveTime !== '') {
        this.queryParams['beginApproveTime'] = this.daterangeApproveTime[0]
        this.queryParams['endApproveTime'] = this.daterangeApproveTime[1]
      }
      // 新增：处理送样时间（核心逻辑）
      if (this.daterangeSendSampleTime && this.daterangeSendSampleTime.length) {
        // 直接赋值给 queryParams 的顶级属性
        this.queryParams.beginSendSampleTime = this.daterangeSendSampleTime[0]
        this.queryParams.endSendSampleTime = this.daterangeSendSampleTime[1]
      } else {
        // 清空参数（避免残留）
        this.queryParams.beginSendSampleTime = null
        this.queryParams.endSendSampleTime = null
      }

      // 新增：报告时间参数处理（核心）
      if (this.daterangeReportTime && this.daterangeReportTime.length) {
        this.queryParams.beginReportTime = this.daterangeReportTime[0] // 报告开始时间
        this.queryParams.endReportTime = this.daterangeReportTime[1] // 报告结束时间
      } else {
        // 未选择时清空参数，避免残留上次查询值
        this.queryParams.beginReportTime = null
        this.queryParams.endReportTime = null
      }

      // 新增：签发时间参数处理
      if (this.daterangeIssuanceTime && this.daterangeIssuanceTime.length) {
        this.queryParams.beginIssuanceTime = this.daterangeIssuanceTime[0] // 签发开始时间
        this.queryParams.endIssuanceTime = this.daterangeIssuanceTime[1] // 签发结束时间
      } else {
        // 未选择时清空参数，避免残留上次查询值
        this.queryParams.beginIssuanceTime = null
        this.queryParams.endIssuanceTime = null
      }

      listJczxFeedReportBaseId(this.queryParams).then(response => {
        this.jczxFeedReportBaseIdList = response.rows
        this.total = response.total
        this.loading = false
        this.tabCounts[this.activeTab] = response.total
      })
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
      this.getTabCounts()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReceiveTime = []
      this.daterangeTestTime = []
      this.daterangeCheckTime = []
      this.daterangeApproveTime = []
      this.daterangeSendSampleTime = []
      // 清空送样时间参数（避免残留）
      this.queryParams.beginSendSampleTime = null
      this.queryParams.endSendSampleTime = null
      // 清空送样时间参数（避免残留）
      this.queryParams.beginSendSampleTime = null
      this.queryParams.endSendSampleTime = null
      // 新增：重置报告时间范围变量
      this.daterangeReportTime = []
      // 新增：重置报告时间查询参数
      this.queryParams.beginReportTime = null
      this.queryParams.endReportTime = null
      // 新增：重置签发时间范围变量
      this.daterangeIssuanceTime = []
      // 新增：重置签发时间查询参数
      this.queryParams.beginIssuanceTime = null
      this.queryParams.endIssuanceTime = null
      this.resetForm('queryForm')
      this.handleQuery()
    },

    fs() {
      sendpdf(this.sendList).then((res) => {
        console.log(res, '22222222222')
      })
    },

    // 一键编制按钮操作
    handleAddAll() {
      const sampleIds = this.ids
      this.$modal.confirm('是否确认一键编制选中的 ' + sampleIds.length + ' 条数据项？').then(function() {
        // 构建传给后端的 DTO 参数
        return addAllFeedReport({
          sampleIdList: sampleIds
        })
      }).then(() => {
        this.getList() // 刷新列表
        // 刷新顶部的数量统计
        this.getTabCounts()
        this.$modal.msgSuccess('一键编制成功')
        this.ids = [] // 清空选中
      }).catch(() => { })
    },
    // handleSelectionChange(selection) {
    //   console.log('原始选择数据:', selection);

    //   // 检查是否有 wpzCount 不等于 0 的数据
    //   const invalidSelection = selection.filter(item => {
    //     return item.wpzCount !== 0; // 严格比较数字 0
    //   });

    //   if (invalidSelection.length > 0) {
    //     // 立即显示警告
    //     this.$message.warning(`请选择未批准样品数量为0的数据，当前选择了${invalidSelection.length}条不符合条件的数据`);

    //     // 可选：自动取消选择不符合条件的数据
    //     // this.$refs.table.clearSelection(); // 如果需要自动取消选择
    //   }

    //   // 过滤：只选择 wpzCount 等于 0 的数据
    //   const result = selection
    //     .filter(item => item.wpzCount === 0)  // 严格比较数字 0
    //     .map(item => ({
    //       ypzCount: item.ypzCount,
    //       wpzCount: item.wpzCount,
    //       feedEntrustOrderId: item.feedEntrustOrderId,
    //       entrustOrderNo: item.entrustOrderNo
    //     }));

    //   this.sendList = result;
    //   console.log('过滤后的发送列表:', result);

    //   // 更新选中状态
    //   this.ids = result.map(item => item.feedEntrustOrderId);
    //   this.single = result.length !== 1;
    //   this.multiple = !result.length;
    // },
    handleSelectionChange(selection) {
      console.log('原始选择数据:', selection)

      let result

      // 只有在待发送标签页(status=4)时才进行 wpzCount 验证
      if (this.activeTab === '4') {
        // 检查是否有 wpzCount 不等于 0 的数据
        const invalidSelection = selection.filter(item => item.wpzCount !== 0)

        if (invalidSelection.length > 0) {
          this.$message.warning(`请选择未批准样品数量为0的数据，当前选择了${invalidSelection.length}条不符合条件的数据`)
        }

        // 过滤：只选择 wpzCount 等于 0 的数据
        result = selection
          .filter(item => item.wpzCount === 0)
          .map(item => ({
            ypzCount: item.ypzCount,
            wpzCount: item.wpzCount,
            feedEntrustOrderId: item.feedEntrustOrderId,
            entrustOrderNo: item.entrustOrderNo
          }))
      } else {
        // 其他标签页不做过滤
        result = selection.map(item => ({
          ypzCount: item.ypzCount,
          wpzCount: item.wpzCount,
          feedEntrustOrderId: item.feedEntrustOrderId,
          entrustOrderNo: item.entrustOrderNo
        }))
      }

      this.sendList = result
      console.log('发送列表:', result)

      this.ids = selection.map(item => item.feedEntrustOrderSampleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** tab 点击事件 */
    handleTabClick(tab) {
      this.activeTab = tab.name
      this.getList()
    },

    /** 复选框选中数据 */
    handleOpJczxFeedReportInfoSelectionChange(selection) {
      this.checkedOpJczxFeedReportInfo = selection.map(item => item.index)
    },

    /** 查询所有Tab的角标数量 */
    getTabCounts() {
      // 准备查询参数 (复用 getList() 的逻辑)
      // 注意：不要传 pageNum 和 pageSize
      const countParams = { ...this.queryParams }
      countParams.pageNum = undefined
      countParams.pageSize = undefined

      // --- 复用 getList() 中的日期处理逻辑 ---
      if (this.daterangeReceiveTime !== null && this.daterangeReceiveTime !== '') {
        countParams['beginReceiveTime'] = this.daterangeReceiveTime[0]
        countParams['endReceiveTime'] = this.daterangeReceiveTime[1]
      }
      if (this.daterangeTestTime !== null && this.daterangeTestTime !== '') {
        countParams['beginTestTime'] = this.daterangeTestTime[0]
        countParams['endTestTime'] = this.daterangeTestTime[1]
      }
      if (this.daterangeCheckTime !== null && this.daterangeCheckTime !== '') {
        countParams['beginCheckTime'] = this.daterangeCheckTime[0]
        countParams['endCheckTime'] = this.daterangeCheckTime[1]
      }
      if (this.daterangeApproveTime !== null && this.daterangeApproveTime !== '') {
        countParams['beginApproveTime'] = this.daterangeApproveTime[0]
        countParams['endApproveTime'] = this.daterangeApproveTime[1]
      }
      if (this.daterangeSendSampleTime && this.daterangeSendSampleTime.length) {
        countParams.beginSendSampleTime = this.daterangeSendSampleTime[0]
        countParams.endSendSampleTime = this.daterangeSendSampleTime[1]
      }
      if (this.daterangeReportTime && this.daterangeReportTime.length) {
        countParams.beginReportTime = this.daterangeReportTime[0]
        countParams.endReportTime = this.daterangeReportTime[1]
      }
      if (this.daterangeIssuanceTime && this.daterangeIssuanceTime.length) {
        countParams.beginIssuanceTime = this.daterangeIssuanceTime[0]
        countParams.endIssuanceTime = this.daterangeIssuanceTime[1]
      }
      // --- 日期处理结束 ---

      // 调用后端新接口
      getReportCounts(countParams).then(response => {
        if (response.code === 200 && response.data) {
          const data = response.data
          // 确保给所有状态赋值 (即使后端没返回，也重置为 0)
          this.tabCounts['0'] = data.status_0 || 0
          this.tabCounts['1'] = data.status_1 || 0
          this.tabCounts['2'] = data.status_2 || 0
          this.tabCounts['3'] = data.status_3 || 0
          this.tabCounts['4'] = data.status_4 || 0
          this.tabCounts['5'] = data.status_5 || 0
        } else {
          // 失败时重置
          Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0)
        }
      }).catch(() => {
        // 异常时重置
        Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0)
      })
    }

  }
}
</script>
