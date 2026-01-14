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
                @select="handleSelect" style="width:100%" :disabled="isZS"></el-autocomplete>
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
              <el-input v-model="form.reportMailingAddress" placeholder="请输入报告寄送地址" :disabled="isZS"></el-input>
            </td>

            <td>委托方联系方式</td>
            <td>
              <el-select v-model="selectedContactId" placeholder="请选择联系方式" style="width: 100%;"
                @change="handleContactChange" :disabled="isZS">

                <el-option v-for="(contact, index) in bsContactInfoList" :key="contact.bsContactInfoId"
                  :label="`联系人：${contact.contactPerson}      电话：${contact.contactPhone}      邮箱：${contact.contactEmail}`"
                  :value="contact.bsContactInfoId" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td>送样日期</td>
            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.sendSampleDate" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.sendSampleDate }" :disabled="isZS">
                </el-date-picker>
                <span v-if="!form.sendSampleDate" class="required-star">请选择送样日期</span>
              </div>
            </td>
            <td>收样人</td>
            <td>
              <el-input v-model="form.receiverName" readonly :disabled="isZS"></el-input>
            </td>
          </tr>
          <tr>
            <td>发票抬头</td>
            <td>
              <el-input v-model="form.invoiceTitle" placeholder="请输入发票抬头" :disabled="isZS"></el-input>
            </td>
            <td width="15%">付款</td>
            <td width="35%">
              <div style="display: flex; align-items: center;">
                <el-radio-group v-model="form.paymentStatus" style="margin-right: 10px;" :disabled="isZS">
                  <el-radio :label="1" @click.native.prevent="togglePaymentStatus(1)">已付</el-radio>
                  <el-radio :label="0" @click.native.prevent="togglePaymentStatus(0)">未付</el-radio>
                </el-radio-group>
                <el-radio-group v-model="form.paymentMethod" :disabled="isZS">
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
                  @click.native.prevent="toggleRadio('invoiceType', dict.value)" :disabled="isZS">{{
                    dict.label }}</el-radio>
              </el-radio-group>
            </td>
            <td>取报告人</td>
            <td>
              <el-input v-model="form.reportReceiver" :disabled="isZS"></el-input>
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
                      @click.native.prevent="toggleRadio('requiresJudgement', dict.value)" :disabled="isZS">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                </p>
                <p style="display: flex; align-items: center; margin: 8px 0;">
                  <span style="min-width: 120px;">2. 是否同意分包：</span>

                  <el-radio-group v-model="form.allowsSubcontracting" size="mini">
                    <el-radio v-for="dict in dict.type.allows" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('allowsSubcontracting', dict.value)" :disabled="isZS">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                </p>
                <p style="display: flex; align-items: center; margin: 8px 0;">
                  <span style="min-width: 120px;">3. 报告领取方式：</span>

                  <el-radio-group v-model="form.reportReceiveType" size="mini">
                    <el-radio v-for="dict in dict.type.report_receive_type" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('reportReceiveType', dict.value)" :disabled="isZS">{{
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
                    @click.native.prevent="toggleRadio('sampleReturnPolicy', dict.value)" :disabled="isZS">{{
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
          <tr v-if="form.isReturn === '1'">
            <td style="color: red;">退回原因</td>
            <td colspan="3">
              <el-input type="textarea" v-model="form.returnReason" :disabled="isZS"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <!-- 样品明细表格 -->

      <div class="form-section">
        <el-table :data="form.sampleList" border style="width: 100%">
          <el-table-column prop="reportNo" label="样品编号" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleNo" placeholder="自动生成" readonly></el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料" width="120" align="center">
            <template slot-scope="scope">
              <div class="material-required" style="position: relative; min-height: 60px;">
                <el-button size="mini" @click="handleMaterialClick(scope.$index)"
                  :type="scope.row.materialName ? 'success' : 'warning'"
                  :class="{ 'required-field': !scope.row.materialName || scope.row.materialName.trim() === '' }"
                  style="width: 100%; margin-bottom: 5px;">
                  {{ scope.row.materialName ? '已选物料' : '选择物料' }}
                </el-button>
                <div v-if="scope.row.materialName" class="selected-material">
                  {{ scope.row.materialName }}
                </div>
                <span v-if="!scope.row.materialName || scope.row.materialName.trim() === ''"
                  class="required-star">请选择物料</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="类别" width="200" align="center">
            <template slot-scope="scope">
              <div style="position: relative;">
                <el-input v-model="scope.row.name" placeholder="类别" :required="true" clearable
                  :class="{ 'required-field': !scope.row.name || scope.row.name.trim() === '' }"
                  @clear="handleClearSample(scope.$index)">
                </el-input>
                <span v-if="!scope.row.name || scope.row.name.trim() === ''" class="required-star">请先输入类别</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="model" label="样品数量" width="120" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.model" placeholder="样品数量"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="batchNo" label="生产日期或批号" width="140" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.batchNo"></el-input>
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
              <span v-if="!scope.row.testItem || scope.row.testItem.length === 0" class="required-star">
                请选择检测项目
              </span>
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
          <el-table-column prop="model" label="供应商" width="200" align="center" v-if="!isZS && isActiveTab !== '1'">
            <template slot-scope="scope">
              <el-input v-model="scope.row.producerUnit" placeholder="请选择供应商" readonly>
                <el-button slot="append" icon="el-icon-search"
                  @click="openSupplierDialogForSample(scope.$index)"></el-button>
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="备注" width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleRemark" placeholder="备注"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"
                @click="removeSample(scope.$index)">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-info" @click="viewReport(scope.row)">查看报告</el-button>

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
              <el-input v-model="form.receiverName" readonly></el-input>
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
          <p>地址：上海市闵行区万源路2729号309室 光明牧业有限公司检验测试中心 邮政编码：201103 电话：021-56481688 转8105 传真：021-66521157</p>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="!isZS">提交</el-button>
        <el-button @click="cancel" v-if="!isZS">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="isActiveTab === '2'">保存</el-button>
        <el-button @click="dytz">打印</el-button>
        <el-button type="primary" @click="jsForm" v-if="isZS && isActiveTab === '1'">接收</el-button>
        <el-button type="danger" @click="thForm" v-if="isZS && isActiveTab === '1'">退回</el-button>
      </div>
    </div>

    <!-- 检测项目选择弹窗 -->
    <el-dialog title="选择检测项目" :visible.sync="testItemDialogVisible" width="800px" append-to-body>
      <el-form :model="testItemQuery" ref="testItemQueryForm" size="small" :inline="true" @submit.native.prevent>
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="testItemQuery.itemName" placeholder="请输入项目名称" clearable style="width: 240px"
            @keyup.enter.native="getTestItemList" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getTestItemList">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetTestItemQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="testItemTable" :data="testItemList" height="485" @selection-change="handleTestItemSelectionChange"
        :row-key="row => row.itemId" @row-click="handleTestRowClick">
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
        <el-form-item label="物料编码" prop="sapCode">
          <el-input v-model="materialQueryParams.sapCode" placeholder="请输入物料编码" clearable style="width: 240px"
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
        <el-table-column label="类别" align="center" prop="materialType" :formatter="formatMaterialType">
        </el-table-column>
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
    <el-dialog title="请输入退回原因" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-input type="textarea" v-model="returnReason"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="qdth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFeedEntrustOrder, addFeedEntrustOrder, updateFeedEntrustOrder, returnFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listDept, getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getpagelist, getItemByInvbillCode } from "@/api/Basicdata/Testingitems";
import { listSupplier } from '@/api/Basicdata/supplier';
import QRCode from 'qrcodejs2';
import {
  Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, ckbg
} from "@/api/CentralLaboratory/jczxFeedReport";
export default {
  name: "FeedEntrustOrderCreate",
  dicts: ['invoice_type', 'requires_judgement', 'allows', 'sample_return_policy',
    'testing_service_level', 'storage_requirement', 'sample_state', 'sample_packaging', 'report_receive_type', 'entrust_order_status', 'feed_test_method', 'material_type'],

  data() {
    return {
      allSelectedTestItems: new Map(), // 使用 Map 来存储所有选中的项目
      qrcode: null,  // 二维码
      // 搜索框
      restaurants: [],
      dialogVisible: false,
      returnReason: '',
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
        producerUnitName: '/',
        sendSampleDate: new Date().toISOString().slice(0, 10), // 默认当天 yyyy-MM-dd
        senderUserId: null,
        senderUserName: null,
        invoiceTitle: "/",
        invoiceType: null,
        paymentStatus: null,
        paymentMethod: null,
        totalFee: null,
        totalSampleQuantity: 0,
        requiresJudgement: "0",
        allowsSubcontracting: "0",
        allowsTestMethods: "1",
        sampleReturnPolicy: "2",
        reportReceiveType: "3",
        testingServiceLevel: "1",
        remark: null,
        operatorUserId: null,
        operatorName: null,

        reportReceiveDate: null,
        rejectReason: null,
        status: "1",
        sampleList: [],

        reportReceiver: "",
        receiverName: ""

      },
      qrcodeDataUrl: '', // 二维码图片的Data URL

      bsContactInfoList: [], // 委托方联系信息列表
      //selectedContactIndex: null, // 选中的联系方式索引
      selectedContactId: null,       // 【新增这个】用于绑定下拉框 IDselectedContactId: null,       // 【新增这个】用于绑定下拉框 ID
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
        itemName: '',
        tag: '1',
        isEnable: '1',
        isSapType: '0',
        filterTag: '12'
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
        sapCode: '',
        isEnable: '1',
        //不查标签，根据标签无法查询出饲料、玉米、棉籽来
        //tag: '1',//标签为饲料
        isSapType: '0',//sap物料
        materialTypeNotEmpty: '1'
      },
      materialTotal: 0,
      selectedMaterial: null,
      // 生产企业弹窗相关
      supplierDialogVisible: false,
      supplierList: [],
      supplierQuery: {
        pageNum: 1,
        pageSize: 10,
        itemName: ''
      },
      supplierTotal: 0,

      // 联系人列表
      contactPersons: [],
      allowsTestMethodsBool: true, // 同意测试方法复选框
      submitLoading: false, // 提交按钮 loading 状态
      isEchoingData: false, // 【新增】用于标记是否正在回显数据
      currentSupplierIndex: null, // 当前正在选择供应商的样品行索引
      isActiveTab: '',//当前激活的tab
      isZS: true,
    };
  },
  watch: {
    'bsContactInfoList': {
      handler(newList) {
        // 只有当处于编辑状态时才自动设置回显
        if (this.form.opFeedEntrustOrderId) {
          this.$nextTick(() => {
            this.setContactSelections();
          });
        }
        // 新增状态下不自动设置，由 getDeptContactInfo 方法处理
      },
      deep: true
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
    this.isZS = this.$route.query.isShow === 'true' || this.$route.query.isShow === true;
    // console.log(this.isZS, '11111111111111111111')
    this.isActiveTab = this.$route.query.isActiveTab
    // 获取当前机构信息
    this.getCurrentDeptInfo();

    if (id) {
      this.loadData(id);
    } else {
      // 新增时初始化样品列表
      this.addSample();
      // 注意：默认联系人会在 getDeptContactInfo 方法中自动设置
    }
    this.getSupplierList();

  },
  mounted() {

  },
  methods: {
    formatMaterialType(row, column, cellValue) {
      // cellValue 就是 row.materialType
      const item = (this.dict.type.material_type || []).find(d => d.value === String(cellValue));
      return item ? item.label : cellValue;
    },
    // 点击行时，切换该行的选中状态（勾选/取消勾选）
    handleTestRowClick(row, column, event) {
      // 如果是程序在做回显（isEchoingData=true），不处理，避免干扰
      if (this.isEchoingData) return;

      // 避免点到选择框那一列导致 toggle 两次（可选）
      if (column && column.type === 'selection') return;

      // 切换这一行的勾选状态
      this.$refs.testItemTable.toggleRowSelection(row);
      // toggleRowSelection 会自动触发 @selection-change，
      // 你的 handleTestItemSelectionChange 里已经在处理 Map 了
    },

    viewReport(row) {
      ckbg(row.reportId).then((res) => {
        if (res.code == 200) {
          console.log(row, '1')
          const encodedData = encodeURIComponent(JSON.stringify(this.form.opFeedEntrustOrderId));
          const encodedData1 = encodeURIComponent(JSON.stringify(row.opFeedEntrustOrderSampleId));
          const encodedData3 = Boolean(false);
          const encodedData4 = encodeURIComponent(JSON.stringify(row.reportId));
          window.open(
            `/reportgensl?opJczxFeedReportBaseId=${encodedData}&status=${row.status}&feedEntrustOrderSampleId=${encodedData1}&isShowB=${encodedData3}&reportId=${encodedData4}`,
            '_blank' // 新标签页
          );
        }
        // console.log(res, '88888888888888888')
        // console.log(res, '888888888888')
        // console.log('feedReportBase 数据:', res.data.feedReportBase)
        // console.log('结论数据 conclusion:', res.data.feedReportBase.conclusion)
        // this.SourText = res.data.feedReportBase.sampleSource
        // this.noteText = res.data.feedReportBase.remark
        // this.displayText = res.data.feedReportBase.conclusion
        // this.feedReportBase = res.data.feedReportBase
        // this.infoList = res.data.opJczxFeedReportInfoList
        // this.feedEntrustOrderId = res.data.feedReportBase.feedEntrustOrderId
        // this.qmhx()
      })

    },

    handleClearSample(index) {
      const sample = this.form.sampleList[index];

      // ✅ 清空物料相关信息
      this.$set(this.form.sampleList, index, {
        ...sample,
        materialName: '',
        materialCode: '',
        invbillCode: null,
        invbillName: '', // 样品名称输入框绑定的字段
      });

      // ✅ 强制刷新响应式
      this.form.sampleList = [...this.form.sampleList];
    },
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
      // 1. 生成唯一 Key
      const printKey = 'print_data_' + new Date().getTime();
      // 送检单位
      this.form.deptName = this.currentDept.deptName || '';
      // 2. 存入 localStorage (容量大，支持跨页)
      localStorage.setItem(printKey, JSON.stringify(this.form));
      const routeUrl = this.$router.resolve({
        path: '/dyylprintSl',
        query: { printKey: printKey }
      });
      window.open(routeUrl.href, '_blank');




      // const id =  this.ids
      // const routeUrl = this.$router.resolve({
      //   path: '/dyylprint',
      //   query: { id: this.$route.query.id }
      // });
      // window.open(routeUrl.href, '_blank');
      // // 生成唯一 Key
      // const printKey = 'print_data_' + new Date().getTime();

      // // 【修改】改为 localStorage，数据更稳定，允许跨标签页调试
      // localStorage.setItem(printKey, JSON.stringify(this.form));

      // const routeUrl = this.$router.resolve({
      //   path: '/dyylprint',
      //   query: { printKey: printKey }
      // });

      // window.open(routeUrl.href, '_blank');
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
    handleContactChange(contactId) {
      if (contactId) {
        // 根据 ID 查找对象
        const contactInfo = this.bsContactInfoList.find(
          item => item.bsContactInfoId === contactId
        );

        if (contactInfo) {
          this.form.entrustContactInfoId = contactInfo.bsContactInfoId;
          this.form.entrustContact = contactInfo.contactPerson;
          this.form.entrustContactPhone = contactInfo.contactPhone;
          this.form.entrustContactEmail = contactInfo.contactEmail;
        }
      } else {
        // 清空联系方式
        this.form.entrustContactInfoId = null;
        this.form.entrustContact = null;
        this.form.entrustContactPhone = null;
        this.form.entrustContactEmail = null;
      }
    },

    // 修改获取机构联系信息的方法
    // 修改获取机构联系信息的方法
    getDeptContactInfo(deptId) {
      getDeptContactInfoByDeptId(deptId).then(response => {
        this.bsContactInfoList = response.data.bsContactInfoList || [];

        // 新增逻辑：如果是新增委托单，默认选择 isDefaultSendSampleUser=1 的联系方式
        if (!this.form.opFeedEntrustOrderId) {
          const defaultContact = this.bsContactInfoList.find(
            contact => contact.isDefaultSendSampleUser === '1'
          );

          if (defaultContact) {
            this.selectedContactId = defaultContact.bsContactInfoId;
            // 自动填充联系方式信息
            this.form.entrustContactInfoId = defaultContact.bsContactInfoId;
            this.form.entrustContact = defaultContact.contactPerson;
            this.form.entrustContactPhone = defaultContact.contactPhone;
            this.form.entrustContactEmail = defaultContact.contactEmail;
          }
        } else {
          // 编辑状态：联系信息加载完成后，如果有ID需要回显，在这里处理
          if (this.form.entrustContactInfoId) {
            const index = this.bsContactInfoList.findIndex(
              contact => contact.bsContactInfoId === this.form.entrustContactInfoId
            );
            if (index !== -1) {
              this.selectedContactIndex = index;
            }
          }
        }
      });
    },
    // 【新增方法】强制回显逻辑
    setContactSelections() {
      // 1. 如果是新增状态且已经设置了默认联系人，直接返回
      if (!this.form.opFeedEntrustOrderId && this.selectedContactId) {
        return;
      }

      // 2. 优先取名字回显 (entrustContact)，如果没有则取 entrustContactInfoId 对应的名字
      const backendName = this.form.entrustContact;
      const backendId = this.form.entrustContactInfoId;

      // 如果名字和ID都没，清空
      if (!backendName && !backendId) {
        this.selectedContactId = null;
        return;
      }

      // 3. 确保列表已初始化
      if (!this.bsContactInfoList) {
        this.bsContactInfoList = [];
      }

      // 4. 尝试在列表中查找 (优先匹配 ID，其次匹配名字)
      let targetOption = this.bsContactInfoList.find(item =>
        (backendId && item.bsContactInfoId === backendId) ||
        (backendName && item.contactPerson === backendName)
      );

      // 5. 【关键】如果没找到，手动构造一个临时选项 push 进去
      if (!targetOption) {
        // 如果有 ID 用 ID，没 ID 生成一个临时的，确保 v-model 能选中
        const tempId = backendId || ('TEMP_' + new Date().getTime());

        targetOption = {
          bsContactInfoId: tempId,
          contactPerson: backendName || "未知联系人", // 显示的名字
          contactPhone: this.form.entrustContactPhone || '', // 回显电话
          contactEmail: this.form.entrustContactEmail || ''  // 回显邮箱
        };

        this.bsContactInfoList.push(targetOption);
      }

      // 6. 赋值给 v-model，触发回显
      this.selectedContactId = targetOption.bsContactInfoId;
      this.$forceUpdate();
    },
    // 获取当前机构信息
    getCurrentDeptInfo() {
      // 获取送检单位信息
      getLoginUserDept().then(response => {
        this.currentDept = response.data;
        this.form.entrustDeptId = this.currentDept.deptId;

        // 获取机构联系信息
        this.getDeptContactInfo(this.currentDept.deptId);

        // 新增：如果是新增状态，设置默认收样人
        if (!this.form.opFeedEntrustOrderId) {
          // this.form.receiverName = this.currentDept.leader || '待指定';
        }
      });
    },


    // 打开生产企业选择弹窗
    openSupplierDialogForSample(index) {
      this.currentSupplierIndex = index;
      this.supplierDialogVisible = true;
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
      if (this.currentSupplierIndex !== null) {
        // 回填到样品行的供应商字段
        const sample = this.form.sampleList[this.currentSupplierIndex];
        this.$set(sample, 'producerUnit', row.name); // 供应商名称
        this.currentSupplierIndex = null; // 清空索引
      } else {
        // 回填到顶部“生产企业”字段（保留原有逻辑）
        this.form.producerUnit = row.id;
        this.form.producerUnitName = row.name;
        this.form.reportMailingAddress = row.name;
      }
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

        // 【修改点】：数据一回来，立即尝试回显联系人
        this.$nextTick(() => {
          this.setContactSelections();
        });
        // 处理物料和项目数据格式
        if (this.form.sampleList) {
          this.form.sampleList.forEach(sample => {
            // 物料名称回显
            if (sample.invbillName) {
              sample.materialName = sample.invbillName;
            }
            if (sample.testItem && sample.testItem.length > 0) {
              sample.testItem = sample.testItem
              // .map(item => ({
              //   itemId: item.itemId, // 保持原样
              //   itemName: item.itemName,
              //   itemCode: item.itemCode
              // }));
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
      this.confirmMaterialSelection(row);
    },
    // 确认物料选择
    confirmMaterialSelection(row) {
      console.log('选中的物料：', row);
      if (!this.selectedMaterial) {
        this.$message.warning('请选择一个物料');
        return;
      }
      // 1. 先把字典里对应的文本找出来
      const dictItem = (this.dict.type.material_type || []).find(
        d => d.value === String(row.materialType)   // 统一转字符串再比对
      );
      const typeLabel = dictItem ? dictItem.label : row.materialType;
      console.log('物料类型标签：', typeLabel);
      // 将物料信息赋值到当前行的物料字段
      // if (this.currentMaterialIndex !== null) {
      //   const sample = this.form.sampleList[this.currentMaterialIndex];
      //   sample.materialName = this.selectedMaterial.invbillName;
      //   sample.materialCode = this.selectedMaterial.sapCode;
      //   sample.invbillCode = this.selectedMaterial.id;
      //   sample.invbillName = this.selectedMaterial.invbillName; // 确保后端字段也设置

      //   // 如果样品名称为空，自动填充物料名称作为样品名称
      //   if (!sample.name || sample.name.trim() === '') {
      //     sample.name = this.selectedMaterial.invbillName;
      //   }
      // }
      const index = this.currentMaterialIndex;
      if (index === null) return;

      const oldSample = this.form.sampleList[index];

      // ✅ 构造新样品对象，自动填充样品名（若用户没填过）
      const newSample = {
        ...oldSample,
        materialName: this.selectedMaterial.invbillName,
        materialCode: this.selectedMaterial.sapCode,
        invbillCode: this.selectedMaterial.sapCode,
        invbillName: this.selectedMaterial.invbillName,
        materialType: row.materialType,        // 存数字（后端需要）
        name: typeLabel,           // 存文本（纯展示）

      };

      // ✅ 关键：用 $set 触发响应式更新
      this.$set(this.form.sampleList, index, newSample);
      this.form.sampleList = [...this.form.sampleList];
      console.log('新样品名称：', newSample);
      newSample.status = row.sampleState;
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


      // 1. 【关键】立刻上锁！防止后续 clearSelection 触发删除逻辑
      this.isEchoingData = true;

      // 2. 清空并重新填充 Map
      this.allSelectedTestItems.clear();
      const currentSample = this.form.sampleList[index];
      console.log('当前样品：', currentSample);
      const invbillCode = currentSample.invbillCode || currentSample.materialCode;
      // ✅ 设置查询参数
      this.testItemQuery = {
        ...this.testItemQuery,
        invbillCode: invbillCode || '', // 确保不传 undefined
        pageNum: 1,
      };
      if (currentSample && currentSample.testItem && currentSample.testItem.length > 0) {
        currentSample.testItem.forEach(item => {
          // 注意：保存的数据里通常叫 itemId
          this.allSelectedTestItems.set(item.itemId, item);
        });
      }

      // 3. 重置查询并刷新
      this.testItemQuery.pageNum = 1;

      this.$nextTick(() => {
        // 这里的 clearSelection 会触发 selection-change，
        // 但因为上面设置了 isEchoingData = true，所以 handle 方法会直接 return，不会误删数据
        if (this.$refs.testItemTable) {
          this.$refs.testItemTable.clearSelection();
        }

        // 4. 获取列表（锁会在获取完数据后的 setTimeout 里解开）
        this.getTestItemList();
      });
    },

    // 在获取检测项目列表时设置选中状态
    getTestItemList() {
      // 再次确保上锁（防止翻页时漏锁）
      this.isEchoingData = true;

      getpagelist(this.testItemQuery).then(response => {
        this.testItemList = response.rows.map(item => ({
          itemId: item.labtestItemsId,
          itemName: item.itemName,
          itemCode: item.itemCode
        }));
        this.testItemTotal = response.total;

        this.$nextTick(() => {
          if (this.testItemList && this.testItemList.length > 0) {
            this.testItemList.forEach(row => {
              // 如果 Map 里有这个 ID，就勾选
              // 注意：这里用 row.itemId 来匹配 Map 的 key
              if (this.allSelectedTestItems.has(row.itemId)) {
                this.$refs.testItemTable.toggleRowSelection(row, true);
              }
            });
          }
          if (this.shouldSelectAllCurrentPage) {
            this.$nextTick(() => {          // 再推迟一帧，保证所有行已渲染
              this.$refs.testItemTable.toggleAllSelection();
              this.shouldSelectAllCurrentPage = false; // 用完就关
            });
          }
          // 【关键】延迟解锁！
          // 必须给 Element UI 一点时间处理 toggleRowSelection 触发的事件
          setTimeout(() => {
            this.isEchoingData = false;
          }, 200);
        });
      }).catch(() => {
        this.isEchoingData = false;
      });
    },

    // 处理检测项目选择变化
    handleTestItemSelectionChange(selection) {
      // 【重点】如果是程序正在自动回显，不要执行任何增删操作，直接返回
      if (this.isEchoingData) return;

      // 容错处理
      if (!this.testItemList || this.testItemList.length === 0) return;

      // 1. 找出当前页面的所有 ID (用于判断哪些是取消勾选)
      const currentPageIds = this.testItemList.map(item => item.itemId);

      // 2. 找出当前被选中的 ID 集合
      const selectedIds = selection.map(item => item.itemId);

      // 3. 遍历当前页的每一行数据，决定是 添加 还是 删除
      this.testItemList.forEach(row => {
        const rowId = row.itemId;

        if (selectedIds.includes(rowId)) {
          // Case A: 当前行被选中 -> 加入 Map (如果已存在会覆盖，没关系)
          if (!this.allSelectedTestItems.has(rowId)) {
            this.allSelectedTestItems.set(rowId, row);
          }
        } else {
          // Case B: 当前行未被选中 -> 检查 Map 里有没有，有则删除
          // 【关键】只删除属于“当前页”且“未被选中”的项
          if (this.allSelectedTestItems.has(rowId)) {
            this.allSelectedTestItems.delete(rowId);
          }
        }
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
        itemName: '',
        tag: '1',
        isEnable: '1',
        isSapType: '0',
        filterTag: '12'
      };
      this.getTestItemList();
    },

    // 确认选择的检测项目
    confirmTestItems() {
      if (this.currentSampleIndex !== -1) {
        const selectedItems = Array.from(this.allSelectedTestItems.values());

        this.form.sampleList[this.currentSampleIndex].testItem = selectedItems
        // .map(item => ({
        //   // 【绝对关键】必须同时兼容 labtestItemsId 和 itemId
        //   // 如果是刚勾选的，它是 labtestItemsId；如果是回显的旧数据，它是 itemId
        //   itemId: item.labtestItemsId || item.itemId,
        //   itemName: item.itemName,
        //   itemCode: item.itemCode
        // }));
      }

      this.allSelectedTestItems.clear();
      this.testItemDialogVisible = false;
    },

    // 添加样品
    addSample() {
      this.form.sampleList.push({
        opFeedEntrustOrderSampleId: null,
        feedEntrustOrderId: null,
        invbillCode: null,
        name: '',
        model: '300g',
        batchNo: '',
        testItem: [], // 统一使用 testItem
        packaging: '',
        status: '',
        storageRequirement: '1',
        testMethod: '',
        sequence: this.form.sampleList.length + 1,
        materialCode: '',
        materialName: '', // 确保物料名称字段存在
        invbillName: '' // 确保后端字段也存在
      });
    },

    // 删除样品
    removeSample(index) {
      this.$confirm('确定要删除这个样品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.sampleList.splice(index, 1);
        // 重新排序
        this.form.sampleList.forEach((item, idx) => {
          item.sequence = idx + 1;
        });
        this.$message.success('删除成功');
      }).catch(() => {
        // 用户取消删除
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
      this.submitLoading = true; // 开始 loading
      // 如果是新增，不发送收样人和中心负责人
      if (!this.form.opFeedEntrustOrderId) {
        this.form.operatorUserId = null;
        this.form.receiverName = null;
      }

      const submitData = {
        ...this.form,
        sampleList: this.form.sampleList.map(sample => ({
          ...sample,
          testItem: sample.testItem || []
        }))
      };
      console.log(submitData, '提交数据')
      // const apiCall = this.form.opFeedEntrustOrderId
      //   ? updateFeedEntrustOrder(submitData)
      //   : addFeedEntrustOrder(submitData);

      // apiCall
      //   .then(response => {
      //     this.$modal.msgSuccess(this.form.opFeedEntrustOrderId ? "修改成功" : "新增成功");
      //     // 关闭当前路由对应的标签页
      //     this.$tab.closePage();
      //     this.$router.push({ path: '/CentralLaboratory/Order/feedEntrustOrder' });
      //   })
      //   .catch(() => {
      //     // 可选：错误提示已在拦截器中处理
      //   })
      //   .finally(() => {
      //     this.submitLoading = false; // 结束 loading
      //   });

      if (this.form.opFeedEntrustOrderId != null) {
        updateFeedEntrustOrder(submitData).then(response => {

          this.$modal.msgSuccess("修改成功");
          this.submitLoading = false;
          this.$router.push({ path: '/CentralLaboratory/Order/feedEntrustOrder' });
        }).catch(() => {
          this.submitLoading = false;
        });
      } else {
        addFeedEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.$router.push({ path: '/CentralLaboratory/Order/feedEntrustOrder' });
        }).catch(() => {
          this.submitLoading = false;
        });;
      }
    },
    // 接收
    jsForm() {
      const submitData = {
        ...this.form,
        sampleList: this.form.sampleList.map(sample => ({
          ...sample,
          testItem: (sample.testItem || []).map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            itemCode: item.itemCode
          }))
        }))
      };
      submitData.isReceive = '1'
      console.log(submitData, '接收列表')
      updateFeedEntrustOrder(submitData).then(response => {
        this.$modal.msgSuccess("接收成功");
        // this.$router.go(-1); // 使用 this.$router
        this.$tab.closePage();
        this.$router.push({ path: '/CentralLaboratory/sampleReceive/SL' });
      });
    },
    // 取消按钮
    cancel() {
      this.$tab.closePage();
      this.$router.push({ path: '/CentralLaboratory/Order/feedEntrustOrder' });
    },
    handleClose(done) {
      this.returnReason = ''; // 清空输入框
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    thForm() {
      this.returnReason = ''; // 清空输入框
      this.dialogVisible = true;

    },
    qdth() {
      if (!this.returnReason) {
        this.$message.error('请输入退回原因');
        return false;
      }
      returnFeedEntrustOrder({
        opEntrustOrderId: this.form.opFeedEntrustOrderId,
        returnReason: this.returnReason,
        type: '1',
        isReturn: '1'
      }).then(response => {
        if (response.code === 200) {
          this.$modal.msgSuccess("退回成功");
          this.$tab.closePage();
        } else {
          this.$modal.msgError(response.msg);
        }
      });
    },
    // 表单验证方法
    validateForm() {
      // 验证送样日期
      if (!this.form.sendSampleDate) {
        this.$message.error('请选择送样日期');
        return false;
      }

      // 验证委托方联系方式
      if (!this.form.entrustContact || !this.form.entrustContactPhone) {
        this.$message.error('请选择委托方联系方式');
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
        // 验证物料
        if (!sample.materialName || sample.materialName.trim() === '') {
          this.$message.error(`第 ${i + 1} 个样品的物料不能为空，请选择物料`);
          this.highlightSampleRow(i);
          return false;
        }

        // 逻辑：只有当 testMethod 不等于 '1' (近红外) 时，才校验 testItem 是否为空
        // 如果 testMethod 为 '1'，则跳过此校验
        if (sample.testMethod !== '1') {
          if (!sample.testItem || sample.testItem.length === 0) {
            this.$message.error(`第 ${i + 1} 个样品（检测方法非近红外）检测项目不能为空，请选择检测项目`);
            this.highlightSampleRow(i);
            return false;
          }
        }


        // 验证检测方法
        if (!sample.testMethod) {
          this.$message.error(`第 ${i + 1} 个样品的检验检测方法不能为空，请选择检测方法`);
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

/* 必填字段视觉提示 */
.required-field .el-input__inner {
  border-color: #f56c6c;
}

.required-field .el-select .el-input__inner {
  border-color: #f56c6c;
}

.error-highlight {
  background-color: #fef0f0 !important;
  border: 1px solid #f56c6c !important;
}

/* 委托方联系方式必填提示 */
.contact-required {
  position: relative;
}

.contact-required .required-star {
  position: absolute;
  left: 0;
  bottom: -20px;
  font-size: 12px;
  color: #f56c6c;
}

/* 检测方法必填提示 */
.test-method-required .el-select {
  width: 100%;
}

/* 物料按钮必填样式 */
.required-field.el-button {
  border-color: #f56c6c !important;
  color: #f56c6c !important;
}

.required-field.el-button:hover {
  border-color: #f78989 !important;
  color: #f78989 !important;
}

.required-field.el-button:focus {
  border-color: #f56c6c !important;
  color: #f56c6c !important;
}

/* 物料选择区域样式 */
.selected-material {
  margin-top: 5px;
  padding: 5px;
  background-color: #f0f9ff;
  border: 1px solid #409eff;
  border-radius: 4px;
  font-size: 12px;
  color: #409eff;
}

/* 物料必填提示 */
.material-required .required-star {
  position: absolute;
  left: 0;
  bottom: -18px;
  font-size: 12px;
  color: #f56c6c;
  width: 100%;
  text-align: center;
}
</style>
