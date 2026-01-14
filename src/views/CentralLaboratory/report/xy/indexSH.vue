<template>
  <div class="app-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <!-- <el-tab-pane :label="`待编制 (${tabCounts['0']})`" name="0">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">

          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入样品名称" clearable
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

          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange">
  
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
          <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
</el-table-column>
<el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
  <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
</el-table-column>
<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
  <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">报告打印</el-button>
            </template>
</el-table-column>
</el-table>

<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
  @pagination="getList" />
</el-tab-pane>

<el-tab-pane :label="`制作中 (${tabCounts['1']})`" name="1">
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="委托单号" prop="entrustOrderNo">
      <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入样品名称" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="委托单位" prop="entrustDeptName">
      <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="接收时间">
      <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="检测项目" prop="bloodTaskItemType">
      <el-select v-model="queryParams.bloodTaskItemType" placeholder="请选择检测项目" clearable>
        <el-option v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.label"
          :value="dict.value" />
      </el-select>
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

    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
    <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
    <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
      <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
    </el-table-column>
    <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
      <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
    </el-table-column>
    <el-table-column label="退回原因" align="center" prop="returnReason" />
    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">报告打印</el-button>
            </template>
    </el-table-column>
  </el-table>
  <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
    @pagination="getList" />
</el-tab-pane>

<el-tab-pane :label="`待审核 (${tabCounts['2']})`" name="2">
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="委托单号" prop="entrustOrderNo">
      <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入报告编号" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="委托单位" prop="entrustDeptName">
      <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="接收时间">
      <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="检测项目" prop="bloodTaskItemType">
      <el-select v-model="queryParams.bloodTaskItemType" placeholder="请选择检测项目" clearable>
        <el-option v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.label"
          :value="dict.value" />
      </el-select>
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

    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
    <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
    <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
      <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
    </el-table-column>
    <el-table-column label="接收时间" align="center" prop="receiveTime" width="180">
      <template slot-scope="scope">
              <span>{{ parseTime(scope.row.receiveTime, '{y}-{m}-{d}') }}</span>
            </template>
    </el-table-column>
    <el-table-column label="编制人" align="center" prop="editUser" />

    <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">报告打印</el-button>
            </template>
    </el-table-column>
  </el-table>
  <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
    @pagination="getList" />
</el-tab-pane>

<el-tab-pane :label="`待批准 (${tabCounts['3']})`" name="3">
  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
    <el-form-item label="委托单号" prop="entrustOrderNo">
      <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入报告编号" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="委托单位" prop="entrustDeptName">
      <el-input v-model="queryParams.entrustDeptName" placeholder="请输入委托单位" clearable
        @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="接收时间">
      <el-date-picker v-model="daterangeReceiveTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="检测项目" prop="bloodTaskItemType">
      <el-select v-model="queryParams.bloodTaskItemType" placeholder="请选择检测项目" clearable>
        <el-option v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.label"
          :value="dict.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="审核时间">
      <el-date-picker v-model="daterangeCheckTime" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
    </el-form-item>
    <el-form-item label="编制人" prop="editUser">
      <el-input v-model="queryParams.editUser" placeholder="请输入编制人" clearable @keyup.enter.native="handleQuery" />
    </el-form-item>
    <el-form-item label="审核人" prop="checkUser">
      <el-input v-model="queryParams.checkUser" placeholder="请输入审核人" clearable @keyup.enter.native="handleQuery" />
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

    <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
    <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
    <el-table-column label="检测项目" align="center" prop="bloodTaskItemType">
      <template slot-scope="scope">
              <dict-tag :options="dict.type.blood_task_item_type" :value="scope.row.bloodTaskItemType" />
            </template>
    </el-table-column>

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
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">报告打印</el-button>
            </template>
    </el-table-column>
  </el-table>
  <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
    @pagination="getList" />
</el-tab-pane> -->

      <el-tab-pane :label="`待发送 (${tabCounts['4']})`" name="4">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入报告编号" clearable
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
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange"
          height="54vh">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
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
              <!-- <el-button style="font-size: 14px;" size="mini" type="text" icon="el-icon-s-promotion"
                @click="openEmailDialog(scope.row)">发送报告</el-button> -->
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">查看报告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

      <el-tab-pane :label="`已发送 (${tabCounts['5']})`" name="5">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
          label-width="68px">
          <el-form-item label="委托单号" prop="entrustOrderNo">
            <el-input v-model="queryParams.entrustOrderNo" placeholder="请输入报告编号" clearable
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
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery(activeTab)">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery(activeTab)">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList(activeTab)"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="jczxFeedReportBaseIdList" @selection-change="handleSelectionChange"
          height="54vh">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="委托单号" align="center" prop="entrustOrderNo" />
          <el-table-column label="委托单位" align="center" prop="entrustDeptName" />
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
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlebgdy(scope.row)">查看报告</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-tab-pane>

    </el-tabs>
    <el-dialog title="选择发送邮箱" :visible.sync="emailDialogVisible" width="800px" :close-on-click-modal="false"
      @close="handleEmailDialogClose">
      <div class="email-dialog-content">
        <el-table ref="emailTable" :data="emailList" v-loading="emailLoading"
          @selection-change="handleEmailSelectionChange" style="width: 100%" max-height="400">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
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
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="emailDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleSend" :loading="sendLoading" size="small"
          :disabled="selectedEmails.length === 0">
          {{ sendLoading ? '发送中...' : '确 定 发 送' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listJczxFeedReportBaseId,
  getJczxFeedReportBaseId,
  delJczxFeedReportBaseId,
  addJczxFeedReportBaseId,
  updateJczxFeedReportBaseId,
  emailList,
  sendpdfzy,
  getReportCounts
} from "@/api/CentralLaboratory/jczxBloodReport";

export default {
  name: "jczxXyReport",
  dicts: ['blood_task_item_type'],
  data() {
    return {

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
      activeTab: '4',
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
      daterangeReportTime: [],
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
        status: '0', // 状态
        beginReceiveTime: null,
        endReceiveTime: null,
        beginReportTime: null,
        endReportTime: null,
        bloodTaskItemType: '8'
      },
      sendList: [],
      // 邮箱弹窗相关
      emailDialogVisible: false,
      emailLoading: false,
      sendLoading: false,
      emailList: [], // 邮箱列表数据
      selectedEmails: [], // 选中的邮箱列表
    };
  },
  created() {
    this.getList();

    this.getTabCounts();
  },
  methods: {
    /** 打开发送邮箱选择弹窗 */
    openEmailDialog(row) {
      if (row) {
        this.sendList = [{
          opJczxBloodReportBaseId: row.opJczxBloodReportBaseId, // 必须字段
          bloodEntrustOrderId: row.bloodEntrustOrderId, // 必须字段
          emails: this.selectedEmails.map(email => email.email).join(',') // 邮箱地址用逗号分隔
        }];
      } else {
        // 验证是否有选中的数据
        if (!this.sendList || this.sendList.length === 0) {
          this.$message.warning('请先选择要发送的报告数据');
          return;
        }
      }

      this.emailDialogVisible = true;
      this.emailLoading = true;

      // 调用邮箱列表接口
      emailList(row.bloodEntrustOrderId).then(response => {
        this.emailList = response.rows || [];
        this.emailLoading = false;

        if (this.emailList.length === 0) {
          this.$message.warning('未找到可用的邮箱地址');
        } else {
          this.$message.success(`加载了 ${this.emailList.length} 个邮箱地址`);
          // 数据加载完成后自动全选
          this.selectAllEmails();
        }
      }).catch(error => {
        this.emailLoading = false;
        console.error('加载邮箱列表失败:', error);
        this.$message.error('加载邮箱列表失败');
      });
    },
    /** 处理发送 */
    handleSend() {
      if (this.selectedEmails.length === 0) {
        this.$message.warning('请选择至少一个收件邮箱');
        return;
      }

      // 准备发送数据
      const sendData = this.sendList.map(item => ({
        opJczxBloodReportBaseId: item.opJczxBloodReportBaseId, // 必须字段
        bloodEntrustOrderId: item.bloodEntrustOrderId, // 必须字段
        emails: this.selectedEmails.map(email => email.email).join(',') // 邮箱地址用逗号分隔
      }));

      this.sendLoading = true;
      sendpdfzy(sendData).then((res) => {
        this.sendLoading = false;
        if (res.code === 200) {
          this.$message.success('报告发送成功');
          // 关闭弹窗
          this.emailDialogVisible = false;
          // 清空选择
          this.sendList = [];
          this.selectedEmails = [];
          // 刷新列表
          this.getList();
          // 刷新角标
          this.getTabCounts();
        } else {
          this.$message.error(res.msg || '发送失败');
        }
      }).catch(error => {
        this.sendLoading = false;
        console.error('发送失败:', error);
        this.$message.error('发送失败: ' + (error.message || '未知错误'));
      });
    },
    selectAllEmails() {
      this.$nextTick(() => {
        if (this.$refs.emailTable) {
          // 确保表格数据已经渲染完成
          setTimeout(() => {
            this.$refs.emailTable.toggleAllSelection();
          }, 100);
        }
      });
    },
    /** 邮箱弹窗关闭处理 */
    handleEmailDialogClose() {
      this.selectedEmails = [];
      this.emailLoading = false;
      this.sendLoading = false;
    },
    /** 邮箱选择变化 */
    handleEmailSelectionChange(selection) {
      this.selectedEmails = selection;
    },

    /** 移除选中的邮箱 */
    removeSelectedEmail(email) {
      const index = this.selectedEmails.findIndex(item => item.email === email.email);
      if (index > -1) {
        this.selectedEmails.splice(index, 1);
      }
    },
    handlebgdy(row) {
      console.log(row.bloodTaskItemType, '111111111')
      if (row.status == 0) {
        const encodedData = encodeURIComponent(JSON.stringify(row.bloodEntrustOrderId));
        if (row.bloodTaskItemType == 2) {
          window.open(
            `/reportgenjh?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 6) {
          window.open(
            `/reportgenjhkt?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 0) {
          window.open(
            `/reportgenkty?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );

        } else if (row.bloodTaskItemType == 9) {
          window.open(
            `/reportgenzy?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 8) {
          window.open(
            `/reportgensh?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        }

      } else {
        const encodedData = encodeURIComponent(JSON.stringify(row.bloodEntrustOrderId));
        const encodedData1 = encodeURIComponent(JSON.stringify(row.opJczxBloodReportBaseId));
        if (row.bloodTaskItemType == 2) {
          window.open(
            `/reportgenjh?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&opJczxBloodReportBaseId=${row.opJczxBloodReportBaseId}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 6) {
          window.open(
            `/reportgenjhkt?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&opJczxBloodReportBaseId=${row.opJczxBloodReportBaseId}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 0) {
          window.open(
            `/reportgenkty?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&opJczxBloodReportBaseId=${row.opJczxBloodReportBaseId}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 9) {
          window.open(
            `/reportgenzy?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&opJczxBloodReportBaseId=${row.opJczxBloodReportBaseId}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        } else if (row.bloodTaskItemType == 8) {
          window.open(
            `/reportgensh?bloodEntrustOrderId=${row.bloodEntrustOrderId}&status=${row.status}&opJczxBloodReportBaseId=${row.opJczxBloodReportBaseId}&bloodTaskItemType=${row.bloodTaskItemType}`,
            '_blank' // 新标签页
          );
        }
      }
    },
    /** 查询检测中心饲料报告主列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      this.queryParams.status = this.activeTab; // 根据当前tab设置status

      // 清空所有日期参数，然后再根据 daterange 赋值
      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.queryParams.beginTestTime = null;
      this.queryParams.endTestTime = null;
      this.queryParams.beginCheckTime = null;
      this.queryParams.endCheckTime = null;
      this.queryParams.beginApproveTime = null;
      this.queryParams.endApproveTime = null;
      this.queryParams.beginReportTime = null;
      this.queryParams.endReportTime = null;

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
      if (null != this.daterangeReportTime && '' != this.daterangeReportTime) {
        this.queryParams["beginReportTime"] = this.daterangeReportTime[0];
        this.queryParams["endReportTime"] = this.daterangeReportTime[1];
      }

      listJczxFeedReportBaseId(this.queryParams).then(response => {
        this.jczxFeedReportBaseIdList = response.rows;
        this.total = response.total;
        this.loading = false;
        this.tabCounts[this.activeTab] = response.total;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();

      this.getTabCounts();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReceiveTime = [];
      this.daterangeTestTime = [];
      this.daterangeCheckTime = [];
      this.daterangeApproveTime = [];
      this.daterangeReportTime = [];
      // 清空所有日期参数
      this.queryParams.beginReceiveTime = null;
      this.queryParams.endReceiveTime = null;
      this.queryParams.beginTestTime = null;
      this.queryParams.endTestTime = null;
      this.queryParams.beginCheckTime = null;
      this.queryParams.endCheckTime = null;
      this.queryParams.beginApproveTime = null;
      this.queryParams.endApproveTime = null;
      this.queryParams.beginReportTime = null;
      this.queryParams.endReportTime = null;

      this.resetForm("queryForm");
      this.queryParams.bloodTaskItemType = '8'
      this.handleQuery(); // handleQuery 会自动调用 getList 和 getTabCounts
    },
    fs() {
      sendpdf(this.sendList).then((res) => {
        console.log(res, '22222222222')
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      const result = selection.map(item => ({
        opJczxFeedReportBaseId: item.opJczxFeedReportBaseId,
        feedEntrustOrderSampleId: item.feedEntrustOrderSampleId
      }));
      this.sendList = result
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

    /* ============================================================
      修改点 7: 增加 getTabCounts 方法
      (复制自 Source.vue 并适配 Target.vue 的 queryParams)
      ============================================================
    */
    /** 查询所有Tab的角标数量 */
    getTabCounts() {
      // 准备查询参数
      const countParams = { ...this.queryParams };
      countParams.pageNum = undefined;
      countParams.pageSize = undefined;
      // 如果 queryParams 里被清空了，这里强制补上默认值 '8'
      if (!countParams.bloodTaskItemType) {
        countParams.bloodTaskItemType = '8';
      }
      // --- 复用 getList() 中的日期处理逻辑 ---
      // (注意：这里只复制了 Target.vue 中 getList() 用到的日期)
      if (null != this.daterangeReceiveTime && '' != this.daterangeReceiveTime) {
        countParams["beginReceiveTime"] = this.daterangeReceiveTime[0];
        countParams["endReceiveTime"] = this.daterangeReceiveTime[1];
      }
      if (null != this.daterangeTestTime && '' != this.daterangeTestTime) {
        countParams["beginTestTime"] = this.daterangeTestTime[0];
        countParams["endTestTime"] = this.daterangeTestTime[1];
      }
      if (null != this.daterangeCheckTime && '' != this.daterangeCheckTime) {
        countParams["beginCheckTime"] = this.daterangeCheckTime[0];
        countParams["endCheckTime"] = this.daterangeCheckTime[1];
      }
      if (null != this.daterangeApproveTime && '' != this.daterangeApproveTime) {
        countParams["beginApproveTime"] = this.daterangeApproveTime[0];
        countParams["endApproveTime"] = this.daterangeApproveTime[1];
      }
      if (null != this.daterangeReportTime && '' != this.daterangeReportTime) {
        countParams["beginReportTime"] = this.daterangeReportTime[0];
        countParams["endReportTime"] = this.daterangeReportTime[1];
      }
      // --- 日期处理结束 ---

      // 调用后端新接口
      getReportCounts(countParams).then(response => {
        if (response.code === 200 && response.data) {
          const data = response.data;
          // 确保给所有状态赋值 (即使后端没返回，也重置为 0)
          this.tabCounts['0'] = data.status_0 || 0;
          this.tabCounts['1'] = data.status_1 || 0;
          this.tabCounts['2'] = data.status_2 || 0;
          this.tabCounts['3'] = data.status_3 || 0;
          this.tabCounts['4'] = data.status_4 || 0;
          this.tabCounts['5'] = data.status_5 || 0;
          this.tabCounts['6'] = data.status_6 || 0;
        } else {
          // 失败时重置
          Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
        }
      }).catch(() => {
        // 异常时重置
        Object.keys(this.tabCounts).forEach(key => this.tabCounts[key] = 0);
      });
    },
  }
};
</script>