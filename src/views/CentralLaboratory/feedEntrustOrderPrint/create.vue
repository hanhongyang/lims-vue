<template>
  <div class="app-container">
    <div class="entrust-form">
      <!-- 表头 -->
      <div class="form-header">
        <h1>{{ 'GMMY-ZJ-29-06' }} 饲料样品委托检测单</h1>

        <span :style="statusStyle">
          {{ statusText }}
        </span>
        <div class="entrust-info" style="position: absolute; right: 0px; top: -20px; text-align: center;">

          <div class="qrcode-container" v-show="form.entrustOrderNo">
            <!-- <img :src="qrcodeDataUrl" alt="委托单二维码" style="width: 80px; height: 80px;"> -->
            <div style="justify-content: center;align-items: center;display: flex;" ref="qrcode"></div>
          </div>
          <div class="entrust-no" style="margin-top: 10px; font-size: 14px; font-weight: bold;">
            委托单编码: {{ form.entrustOrderNo || '待生成' }}
          </div>
        </div>
      </div>

      <!-- 委托单位信息 -->
      <div class="form-section">
        <table class="info-table">
          <tr>
            <td width="15%">生产企业</td>
            <td width="35%">
              <el-autocomplete v-model="form.producerUnitName" :fetch-suggestions="querySearchAsync" placeholder="请输入内容"
                @select="handleSelect" style="width:100%"></el-autocomplete>
              <!-- <el-input v-model="form.producerUnitName" placeholder="请选择生产企业" readonly>
                <el-button slot="append" icon="el-icon-search" @click="openSupplierDialog"></el-button>
              </el-input> -->
            </td>
            <td width="15%">送检单位</td>
            <td width="35%">
              <el-input v-model="currentDept.deptName" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td>报告寄送地址</td>
            <td>
              <el-input v-model="form.reportMailingAddress" placeholder="请输入报告寄送地址"></el-input>
            </td>

            <td>委托方联系方式</td>
            <td>
              <el-select v-model="selectedContactIndex" placeholder="请选择联系方式" style="width: 100%;"
                @change="handleContactChange">
                <el-option v-for="(contact, index) in bsContactInfoList" :key="index"
                  :label="`联系人：${contact.contactPerson}       电话：${contact.contactPhone}       邮箱：${contact.contactEmail}`"
                  :value="index" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td>送样日期</td>
            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.sendSampleDate" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.sendSampleDate }">
                </el-date-picker>
                <span v-if="!form.sendSampleDate" class="required-star">请选择送样日期</span>
              </div>
            </td>
            <td>收样人</td>
            <td>
              <el-input v-model="form.receiverName" :disabled="!form.opFeedEntrustOrderId"></el-input>
            </td>
          </tr>
          <tr>
            <td>发票抬头</td>
            <td>
              <el-input v-model="form.invoiceTitle" placeholder="请输入发票抬头"></el-input>
            </td>
            <td width="15%">付款</td>
            <td width="35%">
              <div style="display: flex; align-items: center;">
                <el-radio-group v-model="form.paymentStatus" style="margin-right: 10px;">
                  <el-radio :label="1" @click.native.prevent="togglePaymentStatus(1)">已付</el-radio>
                  <el-radio :label="0" @click.native.prevent="togglePaymentStatus(0)">未付</el-radio>
                </el-radio-group>
                <el-radio-group v-model="form.paymentMethod">
                  <el-radio :label="1" @click.native.prevent="togglepaymentMethod(1)">转账</el-radio>
                  <el-radio :label="2" @click.native.prevent="togglepaymentMethod(2)">现金</el-radio>
                </el-radio-group>
              </div>
            </td>
          </tr>
          <tr>
            <td width="15%">发票</td>
            <td width="35%">
              <el-radio-group v-model="form.invoiceType">
                <el-radio v-for="dict in dict.type.invoice_type" :key="dict.value" :label="dict.value"
                  @click.native.prevent="toggleRadio('invoiceType', dict.value)">{{
                    dict.label }}</el-radio>
              </el-radio-group>
            </td>
            <td>取报告人</td>
            <td>
              <el-input v-model="form.reportReceiver"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <!-- 备注和样品要求 -->
      <div class="form-section">
        <table class="info-table">
          <tr>
            <td width="15%">备注</td>
            <td width="35%">
              <div class="remarks">
                <p style="display: flex; align-items: center; margin: 8px 0;">
                  <span style="min-width: 120px;">1. 报告是否需判定：</span>

                  <el-radio-group v-model="form.requiresJudgement" size="mini">
                    <el-radio v-for="dict in dict.type.requires_judgement" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('requiresJudgement', dict.value)">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                </p>
                <p style="display: flex; align-items: center; margin: 8px 0;">
                  <span style="min-width: 120px;">2. 是否同意分包：</span>

                  <el-radio-group v-model="form.allowsSubcontracting" size="mini">
                    <el-radio v-for="dict in dict.type.allows" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('allowsSubcontracting', dict.value)">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                </p>
                <p style="display: flex; align-items: center; margin: 8px 0;">
                  <span style="min-width: 120px;">3. 报告领取方式：</span>

                  <el-radio-group v-model="form.reportReceiveType" size="mini">
                    <el-radio v-for="dict in dict.type.report_receive_type" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('reportReceiveType', dict.value)">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                </p>
              </div>
            </td>
            <td width="15%">样品要求</td>
            <td width="35%">
              <div class="sample-requirements">

                <el-radio-group v-model="form.sampleReturnPolicy">
                  <el-radio v-for="dict in dict.type.sample_return_policy" :key="dict.value" :label="dict.value"
                    @click.native.prevent="toggleRadio('sampleReturnPolicy', dict.value)">{{
                      dict.label }}</el-radio>
                </el-radio-group>
              </div>
            </td>
          </tr>
          <tr>
            <td>样品数量</td>
            <td colspan="3">
              <el-input-number v-model="form.totalSampleQuantity" :min="1" :max="100" size="small"
                :disabled="true"></el-input-number>
            </td>
          </tr>
        </table>
      </div>

      <!-- 样品明细表格 -->

      <div class="form-section">
        <el-table :data="form.sampleList" border style="width: 100%">
          <el-table-column prop="reportNo" label="报告编号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="物料" width="120" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleMaterialClick(scope.$index)">选择物料</el-button>
              <div v-if="scope.row.materialName" class="selected-material">
                {{ scope.row.materialName }}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="样品名称" width="200" align="center">
            <template slot-scope="scope">
              <div style="position: relative;">
                <el-input v-model="scope.row.name" placeholder="样品名称" :required="true" clearable
                  :class="{ 'required-field': !scope.row.name || scope.row.name.trim() === '' }">
                </el-input>
                <span v-if="!scope.row.name || scope.row.name.trim() === ''" class="required-star">请先输入样品名称</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="型号规格" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.model" placeholder="型号规格"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="produceDate" label="生产日期或批号" width="140" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.produceDate"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="testItem" label="检验项目" width="240" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="openTestItemDialog(scope.$index)">选择检测项目</el-button>
              <div v-if="scope.row.testItem && scope.row.testItem.length > 0" class="selected-items">
                <el-tag v-for="item in scope.row.testItem" :key="item.itemId" size="small" style="margin: 2px;">
                  {{ item.itemName }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="packaging" label="样品包装" width="110" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.packaging">
                <el-radio v-for="dict in dict.type.sample_packaging" :key="dict.value" :label="dict.value"
                  @click.native.prevent="toggleCellRadio(scope.row, 'packaging', dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="样品状况" width="180" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.status">
                <el-radio v-for="dict in dict.type.sample_state" :key="dict.value" :label="dict.value"
                  @click.native.prevent="toggleCellRadio(scope.row, 'status', dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="storageRequirement" label="存储要求" width="100" align="center">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.storageRequirement">
                <el-radio v-for="dict in dict.type.storage_requirement" :key="dict.value" :label="dict.value"
                  @click.native.prevent="toggleCellRadio(scope.row, 'storageRequirement', dict.value)">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column prop="testMethod" label="检验检测方法" width="200" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.testMethod" placeholder="请选择检验检测方法" style="width: 100%;">
                <el-option v-for="dict in dict.type.feed_test_method" :key="dict.value" :label="dict.label"
                  :value="dict.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"
                @click="removeSample(scope.$index)">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-info" @click="viewReport(scope.$index)">查看报告</el-button>

            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addSample"
          style="margin-top: 10px;">添加样品</el-button>
      </div>



      <!-- 检测费用和服务要求 -->
      <div class="form-section">
        <div class="agreement">
          <el-checkbox v-model="allowsTestMethodsBool">同意实验室所选定的测试方法</el-checkbox>
        </div>
        <div class="cost-service">
          <div class="cost">
            <span>检测费用合计人民币：</span>
            <el-input-number v-model="form.totalFee" :min="0" :precision="2" size="small"></el-input-number>
          </div>
          <div class="service">
            <span>测试服务要求：</span>
            <el-radio-group v-model="form.testingServiceLevel">
              <el-radio v-for="dict in dict.type.testing_service_level" :key="dict.value" :label="dict.value">{{
                dict.label }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 重要提示 -->
      <div class="form-section important-notice">
        <h3>重要提示：</h3>
        <p>1. 送样人应逐项认真填写本单，选择项目"√" 选定，无内容划"√" 或填"不详"，并提供有关技术资料。</p>
        <p>2. 本单同时作为领取报告凭证，请妥善保管，遗失不补。</p>
        <p>3. 未经本中心同意，本检验报告不得用于商业性宣传。本检验报告不构成本中心承担法律责任的依据，也不作为中心承担法律责任的依据。</p>
        <p>以上内容经送样人确认后签字认可</p>
      </div>

      <!-- 底部信息 -->
      <div class="form-section">
        <table class="footer-table">
          <tr>
            <td width="16%">中心负责人</td>
            <td width="17%">
              <el-input v-model="form.reportReceiver" :disabled="!form.opFeedEntrustOrderId"></el-input>
            </td>
            <td width="16%">取报告日期</td>
            <td width="18%">
              <el-date-picker v-model="form.reportReceiveDate" type="date" placeholder="取报告日期" value-format="yyyy-MM-dd"
                style="width: 100%;">
              </el-date-picker>
            </td>
          </tr>
        </table>
        <div class="footer-address">
          <p>地址：上海市上海市闵行区万峰路2729号昌昌大道300室光明牧业有限公司检测中心 邮政编码：200436 电话：021-56481688 转8105 传真：021-66521157</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="dytz">打印</el-button>
      </div>
    </div>

    <!-- 检测项目选择弹窗 -->
    <el-dialog title="选择检测项目" :visible.sync="testItemDialogVisible" width="800px" append-to-body>
      <el-form :model="testItemQuery" ref="testItemQueryForm" size="small" :inline="true" @submit.native.prevent>
        <el-form-item label="项目名称" prop="keyword">
          <el-input v-model="testItemQuery.keyword" placeholder="请输入项目名称" clearable style="width: 240px"
            @keyup.enter.native="getTestItemList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getTestItemList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetTestItemQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="testItemTable" :data="testItemList" height="400" @selection-change="handleTestItemSelectionChange"
        :row-key="row => row.labtestItemsId">
        <el-table-column type="selection" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column prop="itemCode" label="项目编码" align="center"></el-table-column>
        <el-table-column prop="itemName" label="项目名称" align="center"></el-table-column>
      </el-table>

      <!-- 检测项目对话框分页 -->
      <div class="pagination-container">
        <el-pagination small :current-page="testItemQuery.pageNum" :page-sizes="[10, 20, 30, 50]"
          :page-size="testItemQuery.pageSize" layout="total, sizes, prev, pager, next" :total="testItemTotal"
          @size-change="handleTestItemSizeChange" @current-change="handleTestItemCurrentChange">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="testItemDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmTestItems">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物料选择对话框 -->
    <el-dialog title="选择物料" :visible.sync="showMaterialDialog" width="800px" append-to-body
      @open="handleMaterialDialogOpen">
      <el-form :model="materialQueryParams" ref="materialQueryForm" size="small" :inline="true" @submit.native.prevent>
        <el-form-item label="物料名称" prop="invbillName">
          <el-input v-model="materialQueryParams.invbillName" placeholder="请输入物料名称" clearable style="width: 240px"
            @keyup.enter.native="handleMaterialQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleMaterialQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetMaterialQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="materialOptions" height="400" @row-dblclick="handleMaterialDblClick">
        <el-table-column label="物料名称" align="center" prop="invbillName" />
        <el-table-column label="物料编码" align="center" prop="sapCode" />
        <el-table-column label="部门" align="center" prop="deptName" />
      </el-table>

      <!-- 物料对话框分页 -->
      <div class="pagination-container">
        <el-pagination small :current-page="materialQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
          :page-size="materialQueryParams.pageSize" layout="total, sizes, prev, pager, next" :total="materialTotal"
          @size-change="handleMaterialSizeChange" @current-change="handleMaterialCurrentChange">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmMaterialSelection">确 定</el-button>
        <el-button @click="showMaterialDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 生产企业选择弹窗 -->
    <el-dialog title="选择生产企业" :visible.sync="supplierDialogVisible" width="800px">
      <div class="dialog-container">
        <div class="selection-panel" style="width: 100%;">
          <el-input v-model="supplierQuery.name" placeholder="搜索生产企业" style="margin-bottom: 15px;">
            <el-button slot="append" icon="el-icon-search" @click="getSupplierList"></el-button>
          </el-input>

          <el-table :data="supplierList" height="400" @row-dblclick="selectSupplier">
            <el-table-column prop="sapCode" label="供应商编码" width="120"></el-table-column>
            <el-table-column prop="name" label="供应商名称"></el-table-column>
          </el-table>

          <pagination v-show="supplierTotal > 0" :total="supplierTotal" :page.sync="supplierQuery.pageNum"
            :limit.sync="supplierQuery.pageSize" @pagination="getSupplierList" />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="supplierDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="supplierDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFeedEntrustOrder, addFeedEntrustOrder, updateFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listDept, getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getpagelist } from "@/api/Basicdata/Testingitems";
import { listSupplier } from '@/api/Basicdata/supplier';
import QRCode from 'qrcodejs2';

export default {
  name: "FeedEntrustOrderCreate",
  dicts: ['invoice_type', 'requires_judgement', 'allows', 'sample_return_policy',
    'testing_service_level', 'storage_requirement', 'sample_state', 'sample_packaging', 'report_receive_type', 'entrust_order_status', 'feed_test_method'],

  data() {
    return {
      allSelectedTestItems: new Map(), // 使用 Map 来存储所有选中的项目
      qrcode: null,  // 二维码
      // 搜索框
      restaurants: [],

      // 表单参数
      form: {
        opFeedEntrustOrderId: null,
        entrustOrderNo: null,
        entrustDeptId: null,
        reportMailingAddress: null,
        entrustContact: null,
        entrustContactInfoId: null,
        entrustContactPhone: null,
        entrustContactEmail: null,
        producerUnit: null,
        sendSampleDate: new Date().toISOString().slice(0, 10), // 默认当天 yyyy-MM-dd
        senderUserId: null,
        senderUserName: null,
        invoiceTitle: "/",
        invoiceType: '1',
        paymentStatus: 1,
        paymentMethod: null,
        totalFee: null,
        totalSampleQuantity: 0,
        requiresJudgement: "0",
        allowsSubcontracting: "0",
        allowsTestMethods: "1",
        sampleReturnPolicy: "1",
        reportReceiveType: "3",
        testingServiceLevel: "1",
        remark: null,
        operatorUserId: null,
        operatorName: null,
        reportReceiver: null,
        reportReceiveDate: null,
        rejectReason: null,
        status: "1",
        sampleList: [],

        reportReceiver: "",
        receiverName: ""

      },
      qrcodeDataUrl: '', // 二维码图片的Data URL

      bsContactInfoList: [], // 委托方联系信息列表
      selectedContactIndex: null, // 选中的联系方式索引

      currentMaterialIndex: null, // 当前操作的物料行索引

      // 当前机构信息
      currentDept: {
        deptId: null,
        deptName: ''
      },
      // 联系人电话列表
      contactPhones: [],
      // 联系人邮箱列表
      contactEmails: [],
      // 检测项目弹窗相关
      testItemDialogVisible: false,
      currentSampleIndex: -1,
      testItemList: [],
      testItemQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        tag: '1',
        isEnable: '1'
      },
      testItemTotal: 0,
      selectedTestItems: [],
      // 物料选择相关
      showMaterialDialog: false,
      materialOptions: [],
      materialQueryParams: {
        pageNum: 1,
        pageSize: 10,
        invbillName: '',
        isEnable: '1',
        tag: '1',//标签为饲料
      },
      materialTotal: 0,
      selectedMaterial: null,
      // 生产企业弹窗相关
      supplierDialogVisible: false,
      supplierList: [],
      supplierQuery: {
        pageNum: 1,
        pageSize: 99999,
        keyword: ''
      },
      supplierTotal: 0,

      // 联系人列表
      contactPersons: [],
      allowsTestMethodsBool: true, // 同意测试方法复选框
    };
  },
  watch: {
    'bsContactInfoList': {
      handler(newList) {
        // 当联系信息列表加载完成后，重新设置选中项
        if (this.form.entrustContactInfoId && newList.length > 0) {
          const index = newList.findIndex(
            contact => contact.bsContactInfoId === this.form.entrustContactInfoId
          );
          if (index !== -1) {
            this.selectedContactIndex = index;
          }
        }
      },
      immediate: true
    },
    'form.sampleList': {
      handler(newVal) {
        this.form.totalSampleQuantity = newVal.length;
      },
      deep: true
    },
    // 监听布尔值变化，同步到表单
    allowsTestMethodsBool(newVal) {
      this.form.allowsTestMethods = newVal ? "1" : "0";
    },
    // 监听表单值变化，同步到布尔值（用于编辑时回显）
    'form.allowsTestMethods': {
      immediate: true,
      handler(newVal) {
        this.allowsTestMethodsBool = newVal === "1";
      }
    }
  },
  computed: {
    statusText() {
      const item = this.dict.type.entrust_order_status.find(d => d.value === this.form.status);
      return item ? item.label : '';
    },
    statusStyle() {
      const green = ['2', '3', '4', '5',];   // 检测中、检测完成、已审核、已发送
      const red = ['1', '6', '7'];        // 已驳回、作废、待受理（0 或空）

      const color = green.includes(this.form.status) ? '#67C23A' :
        red.includes(this.form.status) ? '#F56C6B' : '#F56C6B';

      return {
        transform: 'rotate(-45deg)',
        display: 'inline-block',
        padding: '6px 6px',
        border: `1px solid ${color}`,
        color,
        borderRadius: '4px',
        fontSize: '22px',
        marginRight: '20px',
        fontWeight: '900',
        marginTop: '10px',
        marginLeft: '20px',
      };
    }
  },
  created() {
    // 获取路由参数
    const id = this.$route.query.id;

    // 获取当前机构信息
    this.getCurrentDeptInfo();

    if (id) {
      this.loadData(id);
    } else {
      // 新增时初始化样品列表
      this.addSample();
    }
    this.getSupplierList();


  },
  mounted() {

  },
  methods: {
    getRowKeys(row) {
      return row.id //选择一个唯一标识
    },
    togglePaymentStatus(val) {
      this.form.paymentStatus = this.form.paymentStatus === val ? null : val;
    },
    togglepaymentMethod(val) {
      this.form.paymentMethod = this.form.paymentMethod === val ? null : val;
    },
    // 普通字典
    toggleRadio(field, val) {
      this.form[field] = this.form[field] === val ? null : val;
    },
    // scope中字典
    toggleCellRadio(row, field, val) {
      row[field] = row[field] === val ? null : val;
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      // console.log(item);
      // newItem = {
      //   id: item.id,
      //   name: item.value
      // }
      this.selectSupplier({
        id: item.id,
        name: item.value
      })
    },
    dytz() {
      this.$router.push({ path: '/dyyl', query: { Details: this.form } });
    },
    // 封装成方法，方便复用
    generateQR() {
      // 清空旧码
      if (this.qrcode) {
        this.qrcode.clear();
        this.qrcode.makeCode(this.form.entrustOrderNo);
      } else {
        this.$refs.qrcode.innerHTML = '';
        this.qrcode = new QRCode(this.$refs.qrcode, {
          text: this.form.entrustOrderNo,
          width: 80,
          height: 80,
          colorDark: '#000',
          colorLight: '#fff',
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    },
    // 新增/编辑后单号变化时调用
    onOrderNoChanged(newVal) {
      if (newVal) {
        this.$nextTick(() => this.generateQR());
      }
    },

    // 处理联系方式选择变化
    handleContactChange(index) {
      if (index !== null && this.bsContactInfoList[index]) {
        const contactInfo = this.bsContactInfoList[index];
        this.form.entrustContactInfoId = contactInfo.bsContactInfoId;
        this.form.entrustContact = contactInfo.contactPerson;
        this.form.entrustContactPhone = contactInfo.contactPhone;
        this.form.entrustContactEmail = contactInfo.contactEmail;
      } else {
        // 清空联系方式
        this.form.entrustContactId = null;
        this.form.entrustContact = null;
        this.form.entrustContactPhone = null;
        this.form.entrustContactEmail = null;
      }
    },

    // 修改获取机构联系信息的方法
    getDeptContactInfo(deptId) {
      getDeptContactInfoByDeptId(deptId).then(response => {
        this.bsContactInfoList = response.data.bsContactInfoList || [];

        // 联系信息加载完成后，如果有ID需要回显，在这里处理
        if (this.$route.query.id && this.form.entrustContactInfoId) {
          const index = this.bsContactInfoList.findIndex(
            contact => contact.bsContactInfoId === this.form.entrustContactInfoId
          );
          if (index !== -1) {
            this.selectedContactIndex = index;
          }
        }
      });
    },
    // 获取当前机构信息
    getCurrentDeptInfo() {
      // 获取送检单位信息
      getLoginUserDept().then(response => {
        this.currentDept = response.data;
        this.form.entrustDeptId = this.currentDept.deptId;

        // 获取机构联系信息
        this.getDeptContactInfo(this.currentDept.deptId);
      });
    },


    // 打开生产企业选择弹窗
    openSupplierDialog() {
      this.supplierDialogVisible = true;
      this.supplierQuery.pageNum = 1;
      this.getSupplierList();
    },

    // 获取生产企业列表
    getSupplierList() {
      listSupplier(this.supplierQuery).then(response => {
        this.supplierList = response.rows;
        this.supplierTotal = response.total;
        this.restaurants = response.rows.map(item => ({
          value: item.name,
          id: item.id
        }));
      });
    },

    // 选择生产企业（双击行时触发）
    selectSupplier(row) {
      this.form.producerUnit = row.id; // 提交时传id
      this.form.producerUnitName = row.name; // 显示名称
      this.form.reportMailingAddress = row.name; // 将企业名称同步到报告寄送地址
      this.supplierDialogVisible = false;
    },


    // 加载委托单数据
    loadData(id) {
      getFeedEntrustOrder(id).then(response => {
        this.form = response.data;
        this.$nextTick(() => {
          // console.log('【qr text】', this.form.entrustOrderNo); // 必须是非空字符串
          if (this.form.entrustOrderNo) {
            this.qrcode = new QRCode(this.$refs.qrcode, {
              text: this.form.entrustOrderNo,
              width: 80,
              height: 80,
              colorDark: '#000',
              colorLight: '#fff',
              correctLevel: QRCode.CorrectLevel.H
            });
          } else {
            console.warn('entrustOrderNo 为空，二维码未生成');
          }
        });
        // 数据类型转换
        this.form.paymentStatus = parseInt(this.form.paymentStatus);
        this.form.paymentMethod = parseInt(this.form.paymentMethod);

        // 回显委托方联系方式
        if (this.form.entrustContactInfoId && this.bsContactInfoList.length > 0) {
          // 根据 contactInfoId 找到对应的索引
          const index = this.bsContactInfoList.findIndex(
            contact => contact.bsContactInfoId === this.form.entrustContactInfoId
          );
          if (index !== -1) {
            this.selectedContactIndex = index;
          }
        }

        // 处理物料和项目数据格式
        if (this.form.sampleList) {
          this.form.sampleList.forEach(sample => {
            // 物料名称回显
            if (sample.invbillName) {
              sample.materialName = sample.invbillName;
            }

            if (sample.testItem && sample.testItem.length > 0) {
              sample.testItem = sample.testItem
            } else {
              sample.testItem = [];
            }
          });
        }

        // 如果样品为空，添加一个空样品
        if (!this.form.sampleList || this.form.sampleList.length === 0) {
          this.addSample();
        }
      });
    },

    // 点击物料按钮
    handleMaterialClick(index) {
      this.currentMaterialIndex = index; // 记录当前操作的行索引
      this.showMaterialDialog = true;
    },
    /** 获取物料列表 */
    getMaterialList() {
      // 确保查询参数中包含部门ID
      this.materialQueryParams.ownDeptId = this.form.entrustDeptId;
      getinvbilllist(this.materialQueryParams).then(response => {
        this.materialOptions = response.rows;
        this.materialTotal = response.total;
      }).catch(error => {
        console.error("获取物料列表失败:", error);
      });
    },

    /** 物料对话框打开时自动查询 */
    handleMaterialDialogOpen() {
      this.getMaterialList();
      this.selectedMaterial = null; // 清空之前的选择
    },
    // 物料行双击事件
    handleMaterialDblClick(row) {
      this.selectedMaterial = row;
      this.confirmMaterialSelection();
    },
    // 确认物料选择
    confirmMaterialSelection() {
      if (!this.selectedMaterial) {
        this.$message.warning('请选择一个物料');
        return;
      }

      // 将物料信息赋值到当前行的物料字段
      if (this.currentMaterialIndex !== null) {
        const sample = this.form.sampleList[this.currentMaterialIndex];
        sample.materialName = this.selectedMaterial.invbillName;
        sample.materialCode = this.selectedMaterial.sapCode;
        sample.invillId = this.selectedMaterial.id;
        sample.invbillName = this.selectedMaterial.invbillName; // 确保后端字段也设置

        // 清除之前选择的项目，避免显示不一致
        sample.testItem = [];
      }

      this.showMaterialDialog = false;
      this.selectedMaterial = null;
      this.currentMaterialIndex = null;
    },
    /** 物料分页大小变化 */
    handleMaterialSizeChange(val) {
      this.materialQueryParams.pageSize = val;
      this.getMaterialList();
    },

    /** 物料当前页变化 */
    handleMaterialCurrentChange(val) {
      this.materialQueryParams.pageNum = val;
      this.getMaterialList();
    },
    /** 物料查询 */
    handleMaterialQuery() {
      this.materialQueryParams.pageNum = 1;
      this.getMaterialList();
    },

    /** 重置物料查询 */
    resetMaterialQuery() {
      this.materialQueryParams = {
        pageNum: 1,
        pageSize: 10,
        invbillName: '',
        ownDeptId: this.form.deptId, // 保留部门ID
        isEnable: '1'
      };
      this.handleMaterialQuery();
    },




    // 打开检测项目选择弹窗
    openTestItemDialog(index) {
      this.currentSampleIndex = index;
      this.testItemDialogVisible = true;

      // 初始化当前样品的选中项目
      if (this.form.sampleList[index].testItem) {
        // 将当前样品的选中项目存入 allSelectedTestItems
        this.form.sampleList[index].testItem.forEach(item => {
          this.allSelectedTestItems.set(item.itemId, item);
        });
      }

      this.getTestItemList();
    },

    // 在获取检测项目列表时设置选中状态
    getTestItemList() {
      getpagelist(this.testItemQuery).then(response => {
        this.testItemList = response.rows.map(item => ({
          labtestItemsId: item.labtestItemsId,
          itemName: item.itemName,
          itemCode: item.itemCode
        }));

        this.testItemTotal = response.total;

        // 设置选中状态
        this.$nextTick(() => {
          this.testItemList.forEach(row => {
            if (this.allSelectedTestItems.has(row.labtestItemsId)) {
              this.$refs.testItemTable.toggleRowSelection(row, true);
            }
          });
        });
      });
    },

    // 处理检测项目选择变化
    handleTestItemSelectionChange(selection) {
      // 更新当前页的选中状态
      const currentPageKeys = this.testItemList.map(item => item.labtestItemsId);

      // 先移除当前页之前选中的但当前未选中的项目
      currentPageKeys.forEach(key => {
        if (this.allSelectedTestItems.has(key) && !selection.some(item => item.labtestItemsId === key)) {
          this.allSelectedTestItems.delete(key);
        }
      });

      // 添加当前页新选中的项目
      selection.forEach(item => {
        this.allSelectedTestItems.set(item.labtestItemsId, item);
      });
    },

    // 检测项目分页大小变化
    handleTestItemSizeChange(val) {
      this.testItemQuery.pageSize = val;
      this.getTestItemList();
    },

    // 检测项目当前页变化
    handleTestItemCurrentChange(val) {
      this.testItemQuery.pageNum = val;
      this.getTestItemList();
    },

    // 重置检测项目查询
    resetTestItemQuery() {
      this.testItemQuery = {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        tag: '1',
        isEnable: '1'
      };
      this.getTestItemList();
    },

    // 确认选择的检测项目
    confirmTestItems() {
      if (this.currentSampleIndex !== -1) {
        // 将 Map 转换为数组
        const selectedItems = Array.from(this.allSelectedTestItems.values());

        this.form.sampleList[this.currentSampleIndex].testItem = selectedItems
      }

      // 清空全局选中状态
      this.allSelectedTestItems.clear();
      this.testItemDialogVisible = false;
    },

    // 添加样品
    addSample() {
      this.form.sampleList.push({
        opFeedEntrustOrderSampleId: null,
        feedEntrustOrderId: null,
        invillId: null,
        name: '',
        model: '',
        batchNo: '',
        testItem: [], // 统一使用 testItem
        packaging: '',
        status: '',
        storageRequirement: '',
        testMethod: '',
        sequence: this.form.sampleList.length + 1,
        produceDate: '',
        materialCode: '',
        materialName: ''
      });
    },
    // 删除样品
    removeSample(index) {
      this.form.sampleList.splice(index, 1);
      // 重新排序
      this.form.sampleList.forEach((item, idx) => {
        item.sequence = idx + 1;
      });
    },
    // 修改转换方法，确保正确处理各种情况
    convertStringToNumber(obj, fields) {
      fields.forEach(field => {
        if (obj[field] !== null && obj[field] !== undefined) {
          // 如果是字符串数字，转换为数字
          if (typeof obj[field] === 'string' && !isNaN(obj[field])) {
            obj[field] = parseInt(obj[field]);
          }
          // 如果是其他类型，保持原样
        }
      });
    },
    // 提交表单
    submitForm() {

      // 先进行表单验证
      if (!this.validateForm()) {
        return;
      }
      // 如果是新增，不发送收样人和中心负责人
      if (!this.form.opFeedEntrustOrderId) {
        this.form.operatorUserId = null;
        this.form.reportReceiver = null;
      }

      const submitData = {
        ...this.form,
        sampleList: this.form.sampleList.map(sample => ({
          ...sample,
          testItem: sample.testItem || []
        }))
      };

      console.log(submitData);
      if (this.form.opFeedEntrustOrderId != null) {
        updateFeedEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
        });
      } else {
        addFeedEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
        });
      }
    },
    // 取消按钮
    cancel() {
      this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
    },

    // 表单验证方法
    validateForm() {
      // 验证送样日期
      if (!this.form.sendSampleDate) {
        this.$message.error('请选择送样日期');
        return false;
      }

      // 验证样品列表
      if (!this.form.sampleList || this.form.sampleList.length === 0) {
        this.$message.error('请至少添加一个样品');
        return false;
      }

      // 验证每个样品的样品名称
      for (let i = 0; i < this.form.sampleList.length; i++) {
        const sample = this.form.sampleList[i];
        if (!sample.name || sample.name.trim() === '') {
          this.$message.error(`第 ${i + 1} 个样品的样品名称不能为空`);
          // 可选：滚动到对应的样品行
          this.highlightSampleRow(i);
          return false;
        }

        // 验证每个样品是否选择了检测项目
        if (!sample.testItem || sample.testItem.length === 0) {
          this.$message.error(`第 ${i + 1} 个样品的检测项目不能为空，请选择检测项目`);
          this.highlightSampleRow(i);
          return false;
        }
      }

      return true;
    },

    // 高亮显示有问题的样品行
    highlightSampleRow(index) {
      // 这里可以添加滚动到对应行的逻辑
      // 由于表格可能较长，可以添加滚动效果
      const table = document.querySelector('.el-table__body-wrapper');
      if (table) {
        const rows = table.querySelectorAll('tr');
        if (rows[index]) {
          rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
          // 添加临时高亮样式
          rows[index].classList.add('error-highlight');
          setTimeout(() => {
            rows[index].classList.remove('error-highlight');
          }, 3000);
        }
      }
    },














  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f5f5;
  position: relative;
}

.required-star {
  text-align: left;
  color: red;
}

.entrust-form {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  margin: 8px 0px 25px 0px;
}

.form-header h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 0 auto;
  /* 居中显示 */
  display: inline-block;
}

.entrust-info {
  position: absolute;
  right: 20px;
  top: 0;
  text-align: center;
  z-index: 10;
}

.qrcode-container {
  padding: 5px;
  background: white;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.entrust-no {
  margin-top: 8px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.form-section {
  margin-bottom: 20px;
  border: 1px solid #e6e6e6;
  /* padding: 10px; */
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  border: 1px solid #e6e6e6;
  padding: 10px;
  vertical-align: top;
}

.info-table tr:first-child td {
  border-top: none;
}

.info-table tr td:first-child,
.info-table tr td:nth-child(3) {
  border-left: none;
  background-color: #f9f9f9;
  font-weight: bold;
  text-align: center;
  color: #333;
  width: 15%;
}

.info-table tr:last-child td {
  border-bottom: none;
}

.info-table tr td:last-child {
  border-right: none;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.remarks p {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.sample-requirements {
  display: flex;
  flex-direction: column;
}

.selected-items {
  margin-top: 5px;
}

.selected-items .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.selected-material {
  margin-top: 5px;
  padding: 5px;
  background-color: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
}

.agreement {
  margin-bottom: 15px;
}

.cost-service {
  display: flex;
  justify-content: space-between;
}

.cost,
.service {
  display: flex;
  align-items: center;
}

.important-notice {
  background-color: #f0f9ff;
}

.important-notice h3 {
  margin-top: 0;
  color: #409EFF;
}

.important-notice p {
  margin: 5px 0;
  line-height: 1.5;
}

.footer-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.footer-table td {
  border: 1px solid #e6e6e6;
  padding: 8px;
  text-align: center;
}

.footer-table tr:first-child td {
  border-top: none;
}

.footer-table tr td:first-child {
  border-left: none;
  background-color: #f9f9f9;
  font-weight: bold;
}

.footer-table tr:last-child td {
  border-bottom: none;
}

.footer-table tr td:last-child {
  border-right: none;
}

.footer-address {
  text-align: center;
  font-size: 12px;
  color: #666;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}

/* 调整Element UI组件样式 */
.el-input__inner,
.el-textarea__inner {
  border: 1px solid #dcdfe6;
}

.el-radio,
.el-checkbox {
  margin-right: 15px;
}

.el-radio.is-bordered,
.el-checkbox.is-bordered {
  margin-right: 10px;
  margin-bottom: 5px;
}

.dialog-container {
  display: flex;
  height: 500px;
}

.selection-panel {
  flex: 3;
  padding-right: 15px;
  border-right: 1px solid #e6e6e6;
}

.selected-panel {
  flex: 1;
  padding-left: 15px;
}

.selected-list {
  max-height: 400px;
  overflow-y: auto;
}

.selected-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 5px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

.selected-item .el-icon-close {
  cursor: pointer;
  color: #f56c6c;
}

.contact-display {
  margin-top: 10px;
  border: 1px solid #e6e6e6;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
}
</style>