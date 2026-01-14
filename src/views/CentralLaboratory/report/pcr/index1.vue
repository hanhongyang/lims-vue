<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="待制作" name="0">
        <!-- 待制作列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <!-- <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
</el-table-column> -->
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">报告打印</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="制作中" name="1">
        <!-- 制作中列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="报告编号" prop="reportNo">
            <el-input v-model="queryParams.reportNo" placeholder="请输入报告编号" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>

          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">报告打印</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="待审核" name="2">
        <!-- 待审核列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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


          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">报告打印</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="已审核" name="3">
        <!-- 已审核列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item label="审核时间">
            <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>

          <el-form-item label="编制人" prop="editUser">
            <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="审核人" prop="checkUser">
            <el-input v-model="queryParams.checkUser" placeholder="请输入审核人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
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
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">报告打印</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="已校准" name="4">
        <!-- 已校准列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item label="接收时间">
            <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd"
              type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="检测时间">
            <el-date-picker v-model="daterangeTestTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="校准时间">
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
          <el-form-item label="校准人" prop="approveUser">
            <el-input v-model="queryParams.approveUser" placeholder="请输入校准人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="校准时间" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="校准人" align="center" prop="approveUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="已发送" name="5">
        <!-- 已发送列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item label="审核时间">
            <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="校准时间">
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
          <el-form-item label="校准人" prop="approveUser">
            <el-input v-model="queryParams.approveUser" placeholder="请输入校准人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="校准时间" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="校准人" align="center" prop="approveUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane label="作废" name="6">
        <!-- 作废列表 -->
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托方联系人" prop="entrustContact">
            <el-input v-model="queryParams.sampleName" placeholder="委托方联系人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入委托单号" clearable
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

          <el-form-item label="审核时间">
            <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="校准时间">
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
          <el-form-item label="校准人" prop="approveUser">
            <el-input v-model="queryParams.approveUser" placeholder="请输入校准人" clearable
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['labtest:jczxFeedReport:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>
          </el-col>

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.feed_report_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托方联系人" align="center" prop="entrustContact" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="审核时间" align="center" prop="checkTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="校准时间" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="编制人" align="center" prop="editUser" />
          <el-table-column label="审核人" align="center" prop="checkUser" />
          <el-table-column label="校准人" align="center" prop="approveUser" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['labtest:jczxFeedReport:edit']">修改</el-button>

            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  listjczxPcrReportBaseId,
  getJczxPcrReportBaseId,
  delJczxPcrReportBaseId,
  addJczxPcrReportBaseId,
  updateJczxPcrReportBaseId
} from "@/api/CentralLaboratory/jczxPCRReport";

export default {
  name: "JczxFeedReportBaseId1",
  dicts: ['feed_report_status'],
  data() {
    return {
      // 激活的标签页
      activeTab: '0',
      // 遮罩层
      loading: true,
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
      title: "",
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        reportNo: null,
        sampleName: null,
        sampleNo: null,
        entrustDeptName: null,
        receiveTime: null,
        testTime: null,
        checkTime: null,
        approveTime: null,
        editUser: null,
        checkUser: null,
        approveUser: null,
        status: '0' // 状态
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handlebgdy(row) {
      console.log(row, '111111111')
      this.$router.push({
        path: '/CentralLaboratory/jczxPcrReportXq',
        query: {
          row: row,
          status: row.status,


        }
      })
      // if (row.status == 0) {
      //   const encodedData = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId));
      //   window.open(
      //     `/reportgensl?feedEntrustOrderSampleId=${encodedData}&status=${row.status}`,
      //     '_blank' // 新标签页
      //   );
      // } else {
      //   const encodedData = encodeURIComponent(JSON.stringify(row.opJczxFeedReportBaseId));
      //   const encodedData1 = encodeURIComponent(JSON.stringify(row.feedEntrustOrderSampleId));
      //   window.open(
      //     `/reportgensl?opJczxFeedReportBaseId=${encodedData}&status=${row.status}&feedEntrustOrderSampleId=${encodedData1}`,
      //     '_blank' // 新标签页
      //   );
      // }

    },
    /** 查询检测中心饲料报告主列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      this.queryParams.status = this.activeTab; // 根据当前tab设置status
      if (null != this.daterangeReceiveTime && '' != this.daterangeReceiveTime) {
        this.queryParams["beginReceiveTime"] = this.daterangeReceiveTime[0];
        this.queryParams["endReceiveTime"] = this.daterangeReceiveTime[1];
      }
      if (null != this.daterangeTestTime && '' != this.daterangeTestTime) {
        this.queryParams["beginTestTime"] = this.daterangeTestTime[0];
        this.queryParams["endTestTime"] = this.daterangeTestTime[1];
      }
      if (null != this.daterangeCheckTime && '' != this.daterangeCheckTime) {
        this.queryParams["beginCheckTime"] = this.daterangeCheckTime[0];
        this.queryParams["endCheckTime"] = this.daterangeCheckTime[1];
      }
      if (null != this.daterangeApproveTime && '' != this.daterangeApproveTime) {
        this.queryParams["beginApproveTime"] = this.daterangeApproveTime[0];
        this.queryParams["endApproveTime"] = this.daterangeApproveTime[1];
      }

      listjczxPcrReportBaseId(this.queryParams).then(response => {
        this.jczxFeedReportBaseIdList = response.rows;
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
      this.daterangeReceiveTime = [];
      this.daterangeTestTime = [];
      this.daterangeCheckTime = [];
      this.daterangeApproveTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.opJczxFeedReportBaseId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** tab 点击事件 */
    handleTabClick(tab) {
      this.activeTab = tab.name;
      this.getList();
    },

    /** 复选框选中数据 */
    handleOpJczxFeedReportInfoSelectionChange(selection) {
      this.checkedOpJczxFeedReportInfo = selection.map(item => item.index)
    },
  }
};
</script>
</script>
