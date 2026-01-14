<template>
  <div class="app-container">
    <div class="entrust-form">
      <!-- 表头 -->
      <div class="form-header">
        <h1>样品化验详情</h1>
      </div>
      <!-- 委托单位信息 -->
      <div class="form-section">
        <table class="info-table">
          <tr>
            <td width="15%">检测项目</td>
            <td width="35%">
              <el-input v-model="form.driverCode"></el-input>
            </td>
            <td>检测日期</td>
            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.carInTime" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.carInTime }">
                </el-date-picker>
                <span v-if="!form.carInTime" class="required-star">请选择检测日期</span>
              </div>
            </td>
            <td>取样日期</td>
          </tr>
          <tr>
            <td>司机</td>
            <td>
              <el-input v-model="form.driverName"></el-input>
            </td>

            <td>消毒药</td>
            <td>
              <el-input v-model="form.toxicide"></el-input>
            </td>
          </tr>
          <tr>
            <td>浓度</td>
            <td>
              <el-input v-model="form.density"></el-input>
            </td>
            <td>责任人</td>
            <td>
              <el-input v-model="form.personLiable"></el-input>
            </td>


          </tr>
          <tr>

            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.carOutTime" type="date" placeholder="选择出场时间" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.carOutTime }">
                </el-date-picker>
                <span v-if="!form.carOutTime" class="required-star">请选择取样日期</span>
              </div>
            </td>
          </tr>

          <tr>
            <td width="15%">消毒方式</td>
            <td width="35%">
              <!-- <el-radio-group v-model="form.disinfection">
                <el-radio v-for="dict in dict.type.invoice_type" :key="dict.value" :label="dict.value"
                  @click.native.prevent="toggleRadio('disinfection', dict.value)">{{
                    dict.label }}</el-radio>
              </el-radio-group> -->
              <el-input v-model="form.disinfection"></el-input>
            </td>
            <td>备注</td>
            <td>
              <el-input v-model="form.remark"></el-input>
            </td>
          </tr>
          <tr>

            <td>随车检测报告</td>
            <td>
              <div style="display: flex; gap: 8px; align-items: center;">
                <el-button type="primary" size="small" @click="handleCarReportUpload">
                  上传<i class="el-icon-upload el-icon--right" />
                </el-button>
                <el-button type="success" size="small" @click="handleCarReportPreview">
                  预览<i class="el-icon-files el-icon--right" />
                </el-button>
                <span v-if="form.carFileId" style="margin-left: 10px; color: #67C23A;">
                  已上传：{{ form.reportFileName || '文件' }}
                </span>
              </div>
            </td>
          </tr>

        </table>


      </div>


      <!-- 样品明细表格 -->
      <div class="form-section">
        <el-table :data="form.opSamplingPlanSampleList" border style="width: 100%" height="40vh">
          <el-table-column prop="reportNo" label="样品编号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleNo" placeholder="编号"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料" align="center">
            <template slot-scope="scope">
              <div class="material-required" style="position: relative; min-height: 60px;">
                <el-button size="mini" @click="handleMaterialClick(scope.$index)"
                  :type="scope.row.invillId ? 'success' : 'warning'"
                  :class="{ 'required-field': !scope.row.invillId || scope.row.invillId.trim() === '' }"
                  style="width: 100%; margin-bottom: 5px;">
                  {{ scope.row.invillId ? '已选物料' : '选择物料' }}
                </el-button>
                <div v-if="scope.row.invillId" class="selected-material">
                  {{ scope.row.invbillName }}
                </div>
                <span v-if="!scope.row.invillId || scope.row.invillId.trim() === ''" class="required-star">请选择物料</span>
              </div>
            </template>
          </el-table-column>

          <!-- <el-table-column prop="name" label="样品名称" width="200" align="center">
            <template slot-scope="scope">
              <div style="position: relative;">
                <el-input v-model="scope.row.name" placeholder="样品名称" :required="true" clearable
                  :class="{ 'required-field': !scope.row.name || scope.row.name.trim() === '' }"
                  @clear="handleClearSample(scope.$index)">
                </el-input>
                <span v-if="!scope.row.name || scope.row.name.trim() === ''" class="required-star">请先输入样品名称</span>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="ijweight" label="净重" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.ijweight" placeholder="净重" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="productionDate" label="生产日期" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.productionDate"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="shelfLife" label="保质期" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.shelfLife"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="重量" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="规格" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.model"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="opSamplingPlanItemList" label="化验项目" width="140" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="openTestItemDialog(scope.$index)">选择检测项目</el-button>
              <div v-if="scope.row.opSamplingPlanItemList && scope.row.opSamplingPlanItemList.length > 0"
                class="selected-items">
                <el-tag v-for="item in scope.row.opSamplingPlanItemList" :key="item.itemId" size="small"
                  style="margin: 2px;">
                  {{ item.itemName }}
                </el-tag>
              </div>
              <span v-if="!scope.row.opSamplingPlanItemList || scope.row.opSamplingPlanItemList.length === 0"
                class="required-star">
                请选择检测项目
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="produceDate" label="随车检测报告" width="200" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.produceDate" v-if="false"></el-input>
              <div style="display: flex; gap: 8px; justify-content: flex-start;">
 
                <el-button type="primary" size="mini" @click="handleAdd(scope.$index)">
                  上传<i class="el-icon-upload el-icon--right" />
                </el-button>
                <el-button type="success" size="mini" @click="handlePreview(scope.row)">
                  预览<i class="el-icon-files el-icon--right" />
                </el-button>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"
                @click="removeSample(scope.$index)">删除</el-button>
              <el-button size="mini" type="text" icon="el-icon-info"
                @click="viewReport(scope.row, scope.$index)">感官质检</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addSample"
          style="margin-top: 10px;">添加样品</el-button>
      </div>
      <!-- 感官质检 -->
      <el-dialog title="感官质检详情" :visible.sync="dialogVisible" width="30%">
        <el-form ref="tempForm" :model="tempUnquality" label-width="80px">
          <el-form-item label="感官性状">
            <!-- <template slot-scope="scope">
              <el-input v-model="scope.row.ggQualityDescribe" placeholder="编号"></el-input>
            </template> -->
            <el-input v-model="tempUnquality.ggQualityDescribe"></el-input>
          </el-form-item>
          <el-form-item label="是否合格">
            <el-select v-model="tempUnquality.ggQualityResult" placeholder="请选择是否合格">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="处理结果" v-if="tempUnquality.ggQualityResult == '0'">
            <el-select v-model="tempUnquality.debitResult" placeholder="请选择处理结果" clearable>
              <el-option v-for="dict in dict.type.unquality_method" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>

          </el-form-item>
          <el-form-item label="扣款金额" v-if="tempUnquality.debitResult == '1' && tempUnquality.ggQualityResult == '0'">
            <el-input v-model="tempUnquality.debitAmount"></el-input>
          </el-form-item>
          <el-form-item label="扣款重量" v-if="tempUnquality.debitResult == '0' && tempUnquality.ggQualityResult == '0'">
            <el-input v-model="tempUnquality.debitWeight"></el-input>
          </el-form-item> -->

          <el-form-item label="上传照片" v-if="tempUnquality.ggQualityResult == '0'">
            <el-upload ref="uploadP" accept=".jpg, .png" :action="uploadP.Url" :headers="uploadP.headers"
              :before-upload="beforeAvatarUpload" :file-list="uploadP.fileList" list-type="picture-card"
              :on-success="handleFileUploadSuccess" :on-preview="handleFilePreview"
              :before-remove="handleImgRemoveSensory" :auto-upload="false" :disabled="uploadP.isUploading">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-button type="primary" size="mini" style="margin-top: 10px;" :loading="uploadP.isUploading"
              @click="submitSensoryUpload">
              确认上传
            </el-button>
            <el-dialog :visible.sync="dialogFileOpen">
              <img width="100%" :src="dialogFileImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelUnquality">取 消</el-button>
          <el-button type="primary" @click="handleSaveUnquality">确 定</el-button>
        </span>
      </el-dialog>







      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" :loading="submitLoading" @click="submitForm('bc')">保存</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm('tj')">提交</el-button>
        <el-button @click="cancel">取消</el-button>
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
    <!-- 上传弹出框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body
      @close="handleUploadClose">
      <el-upload ref="upload" :limit="1" :headers="upload.headers" :disabled="upload.isUploading"
        :before-upload="beforeUpload" :on-error="handleError" :on-exceed="handleExceed"
        :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传一个文件，且不超过10M</div>
        <!-- <div class="el-upload__tip" slot="tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div> -->
      </el-upload>
      <div style="margin-top: 20px; text-align: center;">
        <el-button type="primary" :loading="upload.isUploading" @click="submitUpload">
          上传
        </el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-dialog>
    <!-- 上传预览 -->
    <el-dialog title="随车检测报告预览" :visible.sync="previewDialogVisible" width="600px" append-to-body center>
      <div style="text-align: center;">
        <img :src="previewUrl" style="max-width: 100%; max-height: 70vh;" />
      </div>
      <span slot="footer">
        <el-button @click="previewDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'




// import { getFeedEntrustOrder, addPlan, addPlan } from "@/api/CentralLaboratory/feedEntrustOrder";
import { listDept, getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getpagelist } from "@/api/Basicdata/Testingitems";
import { listSupplier } from '@/api/Basicdata/supplier';
import QRCode from 'qrcodejs2';
import {
  Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, ckbg
} from "@/api/CentralLaboratory/jczxFeedReport";
import { getPlan, addPlan, } from "@/api/Ranch/plan";
import { uploadAndGetFileId, uploadAndGetFileIds } from '@/api/common/common'
import { XZPic } from "@/api/hyd";
import { status } from 'nprogress';
export default {
  name: "FeedEntrustOrderCreate",
  dicts: ['quality_type', 'unquality_method', 'requires_judgement', 'allows', 'sample_return_policy',
    'testing_service_level', 'storage_requirement', 'sample_state', 'sample_packaging', 'report_receive_type', 'entrust_order_status', 'feed_test_method'],

  data() {
    return {
      carFileId: null,        // 随车检测报告文件ID
      reportFileName: '',     // 随车检测报告文件名
      opSamplingPlanSampleList: [],
      // 上传参数
      upload: {
        open: false,// 是否显示弹出层
        title: "",// 弹出层标题
        isUploading: false,// 是否禁用上传
        headers: { Authorization: "Bearer " + getToken() },// 设置上传的请求头部
        url: process.env.VUE_APP_BASE_API + "/common/upload"// 上传的地址
      },
      previewDialogVisible: false,   // 预览弹窗开关
      previewUrl: '',                // 图片地址（真实场景换成后端返回的 url）
      dialogVisible: false,//感官质检框
      tempUnquality: {               // 临时副本（原 form1）
        ggQualityDescribe: '',
        qualified: '',
        debitResult: '',
        debitAmount: '',
        debitWeight: '',
        // 文件 ID 数组
      },
      form1: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        m: '',
        w: ''
      },
      // 感官质检上传图片
      uploadP: {
        headers: { Authorization: 'Bearer ' + getToken() },
        isUploading: false,
        url: process.env.VUE_APP_BASE_API + "/common/uploads",// 上传的地址
        fileList: []        // 已传完的文件（含 url、fileId）
      },
      // 感官质检专属：文件列表和状态（独立于随车报告）
      sensoryUploadState: {
        fileList: [], // 感官质检图片列表（独立）
        isUploading: false // 感官上传加载状态（独立）
      },
      dialogFileOpen: false,
      dialogFileImageUrl: undefined,
      currentUploadSampleIndex: -1, // 新增：当前上传随车报告的样品行索引



      allSelectedTestItems: new Map(), // 使用 Map 来存储所有选中的项目
      qrcode: null,  // 二维码
      // 搜索框
      restaurants: [],

      // 表单参数
      form: {
        opSamplingPlanSampleList: [] // 必须初始化，否则 addSample 无法push
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
      isZS: false,
      submitLoading: false, // 提交按钮 loading 状态
    };
  },
  watch: {
    'form1.qualified'(val) {
      if (val !== '2') this.form1.handleResult = '';
    },
    // 'form1.qualified'(val) {
    //   if (val !== '2') this.form1.handleResult = '';
    // },
    // 'form1.qualified'(val) {
    //   if (val !== '2') this.form1.handleResult = '';
    // },
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
    'form.opSamplingPlanSampleList': {
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
    this.isZS = this.$route.query.isShow
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
    // 上传按钮
    handleCarReportUpload() {
      this.upload.title = '上传随车检测报告';
      this.upload.open = true;
      this.$nextTick(() => this.$refs.upload.clearFiles());
    },

    // 预览按钮
    handleCarReportPreview() {
      // if (!this.form.carFileId) {
      //   this.$message.warning('请先上传报告');
      //   return;
      // }
      // 真实场景：this.previewUrl = `/file/preview/${this.form.carFileId}`;
      this.previewUrl = '';
      this.previewDialogVisible = true;
    },
    // 确定
    handleSaveUnquality() {
      const row = this.form.opSamplingPlanSampleList[this.currentSampleIndex];
      console.log(row, '1')

      row.ggQualityDescribe = this.tempUnquality.ggQualityDescribe;
      row.ggQualityResult = this.tempUnquality.ggQualityResult;
      row.debitResult = this.tempUnquality.debitResult;
      row.debitAmount = this.tempUnquality.debitAmount;
      row.debitWeight = this.tempUnquality.debitWeight;
      // ✅ 2. 关键：把上传后的文件ID数组写回样品行
      row.qualityFileIds = this.tempUnquality.qualityFileIds || '';

      // // 如果该行没有 opSampleUnquality，先初始化
      // if (!row.opSampleUnquality) {
      //   this.$set(row, 'opSampleUnquality', {});
      // }

      // // 再整包写入临时数据（含 qualityFileIds）
      // row.opSampleUnquality = {
      //   ...this.tempUnquality
      // };

      this.dialogVisible = false;
    },

    // 取消
    handleCancelUnquality() {
      this.dialogVisible = false;
      // 不需要任何操作，副本直接丢弃
    },
    // 加载委托单数据
    loadData(id) {
      getPlan(id).then(response => {
        this.form = response.data;
        // 关键保护
        if (!this.form.opSamplingPlanSampleList) {
          this.$set(this.form, 'opSamplingPlanSampleList', []);
        }
        // this.$nextTick(() => {
        //   // console.log('【qr text】', this.form.entrustOrderNo); // 必须是非空字符串
        //   if (this.form.entrustOrderNo) {
        //     this.qrcode = new QRCode(this.$refs.qrcode, {
        //       text: this.form.entrustOrderNo,
        //       width: 80,
        //       height: 80,
        //       colorDark: '#000',
        //       colorLight: '#fff',
        //       correctLevel: QRCode.CorrectLevel.H
        //     });
        //   } else {
        //     console.warn('entrustOrderNo 为空，二维码未生成');
        //   }
      });
      // 数据类型转换
      // this.form.paymentStatus = parseInt(this.form.paymentStatus);
      // this.form.paymentMethod = parseInt(this.form.paymentMethod);

      // // 回显委托方联系方式
      // if (this.form.entrustContactInfoId && this.bsContactInfoList.length > 0) {
      //   // 根据 contactInfoId 找到对应的索引
      //   const index = this.bsContactInfoList.findIndex(
      //     contact => contact.bsContactInfoId === this.form.entrustContactInfoId
      //   );
      //   if (index !== -1) {
      //     this.selectedContactIndex = index;
      //   }
      // }

      // // 处理物料和项目数据格式
      // if (this.form.opSamplingPlanSampleList) {
      //   this.form.opSamplingPlanSampleList.forEach(sample => {
      //     // 物料名称回显
      //     if (sample.invbillName) {
      //       sample.materialName = sample.invbillName;
      //     }

      //     if (sample.opSamplingPlanItemList && sample.opSamplingPlanItemList.length > 0) {
      //       sample.opSamplingPlanItemList = sample.opSamplingPlanItemList.map(item => ({
      //         itemId: item.itemId, // 保持原样
      //         itemName: item.itemName,
      //         itemCode: item.itemCode
      //       }));
      //     } else {
      //       sample.opSamplingPlanItemList = [];
      //     }
      //   });
      // }

      // // 如果样品为空，添加一个空样品
      // if (!this.form.opSamplingPlanSampleList || this.form.opSamplingPlanSampleList.length === 0) {
      //   this.addSample();
      // }

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
    //  样品表上传
    handleAdd(sampleIndex) {
      if (sampleIndex === undefined || sampleIndex < 0) {
        this.$message.warning('未找到有效的样品行');
        return;
      }
      this.currentUploadSampleIndex = sampleIndex; // 明确赋值索引
      this.upload.title = "上传随车检测报告";
      this.upload.open = true;
      // 清空之前的文件
      this.$nextTick(() => {
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles();
        }
      });
    },
    // 文件上传中处理 (从 pcrResultBase 复制)
    handleFileUploadProgress() {
      this.upload.isUploading = true;
    },
    // 提交上传（修正：FormData 包装文件流）
    submitUpload() {
      const fileList = this.$refs.upload.uploadFiles;
      if (fileList.length === 0) {
        this.$message.warning('请选择要上传的文件');
        return;
      }

      const file = fileList[0].raw;
      this.upload.isUploading = true;

      this.uploadFile(file, (fileId) => {
        const currentSample = this.form;
        if (!currentSample) return;

        currentSample.qualityFileIds = fileId;
        // currentSample.reportFileName = file.name;
        this.$message.success(`上传成功：${file.name}`);
        this.upload.open = false;
        this.upload.isUploading = false;
      }, () => {
        this.upload.isUploading = false;
      });
    },

    // 上传失败处理 (从 pcrResultBase 复制)
    handleError(error) {
      this.upload.isUploading = false;
      this.$message.error('上传失败: ' + error)
    },

    // 文件超出限制 (从 pcrResultBase 复制)
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // 上传前校验 (从 pcrResultBase 复制)
    beforeUpload(file) {
      const isExcel = file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const isLt10M = file.size / 1024 / 1024 < 10

      // if (!isExcel) {
      //   this.$message.error('只能上传Excel文件!')
      //   return false
      // }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB!')
        return false
      }
      return true
    },
    // 文件上传成功处理（修复：先判断索引和样品行，避免 undefined）
    handleFileSuccess(response, file) {
      this.upload.isUploading = false;
      if (res.code === 200 && res.data) {
        this.form.carFileId = res.data;           // 文件ID
        this.form.reportFileName = file.name;     // 文件名
        console.log(this.form, '111111')
        this.upload.open = false;
        this.$refs.upload.clearFiles();
        this.$message.success('上传成功');
      } else {
        this.$message.error(res.msg || '上传失败');
        this.$refs.upload.clearFiles();
      }
    },
    // 重置 (从 pcrResultBase 复制)
    handleReset() {
      this.uploadResult.visible = false
      this.$refs.upload.clearFiles()
    },

    // 对话框关闭时重置状态 (从 pcrResultBase 复制)
    handleUploadClose() {
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
    },
    // 预览随车报告
    handlePreview(row) {
      // ① 如果后台已给过图片地址，直接拿来用
      // this.previewUrl = row.reportUrl;

      // ② 演示：用一张固定图代替，真实场景换成 row 里的字段
      this.previewUrl = 'https://ts1.tc.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0';
      this.previewDialogVisible = true;
    },
    // 图片上传
    beforeAvatarUpload(file) {
      let _this = this
      return new Promise((resolve, reject) => {
        let isLt2M = file.size / 1024 / 1024 < 2 // 判定图片大小是否小于2MB
        if (isLt2M) {
          resolve(file)
        } else {
          let image = new Image(),
            resultBlob = ''
          image.src = URL.createObjectURL(file)
          image.onload = () => {
            // 调用压缩方法（保持原有逻辑，若没有该方法需确保引入）
            resultBlob = compressUpload(image, file)
            resolve(resultBlob)
          }
          image.onerror = () => {
            reject()
          }
        }
      })
    },
    // 感官质检图片上传成功处理（核心修改：换接口、FormData 传参）
    handleFileUploadSuccess(response, file, fileList) {
      console.log('11111222')
      // 清空原有文件列表，避免重复
      this.uploadP.fileList = [];
      this.uploadP.isUploading = true;

      // 1. 用 FormData 包装文件流（和随车报告上传一致）
      const formData = new FormData();
      formData.append('file', file.raw || file); // 兼容压缩后的文件格式

      // 2. 调用 uploadAndGetFileId 接口（替换原 XZPic 接口）

      uploadAndGetFileId(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: "Bearer " + getToken()
        }
      }).then(res => {
        console.log(res, '11111111')
        if (res.code === 200 && res.data) {
          // 3. 存储接口返回的文件ID（存入 form 表单，方便提交）
          this.form.sensoryPicFileId = res.data; // 自定义字段，需和后端确认字段名

          // 4. 构造图片预览数据（保留原有视觉效果）
          let imgObj = {
            uid: file.uid,
            url: URL.createObjectURL(file.raw || file), // 本地预览地址
            fileId: res.data, // 存储文件ID，删除时可用
            name: file.name
          };
          this.uploadP.fileList.push(imgObj);
          this.$message.success('图片上传成功');
        } else {
          this.$message.error(res.msg || '图片上传失败');
        }
      }).catch(error => {
        this.$message.error('上传失败: ' + (error.msg || error.message));
      }).finally(() => {
        this.uploadP.isUploading = false; // 结束加载
      });
    },
    // 返回 Promise，resolve 拿到 fileId
    uploadFile(file, onSuccess) {
      const fd = new FormData();
      fd.append('file', file);
      return uploadAndGetFileId(fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + getToken()
        }
      }).then(res => {
        if (res.code === 200 && res.data) {
          return onSuccess ? onSuccess(res.data) : res.data;
        }
        return Promise.reject(res.msg || '上传失败');
      });
    },
    // 批量上传 → 返回 fileId 数组
    uploadFiles(files) {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f)); // 接口要求字段名 files
      return uploadAndGetFileIds(fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + getToken()
        }
      }).then(res => {
        console.log(res, '感官质检')

        if (res.code === 200 && res.data) return res.data; // 返回数组
        return Promise.reject(res.msg || '批量上传失败');
      });
    },
    // 感官质检 → 确认上传（多图 → uploadAndGetFileIds）
    submitSensoryUpload() {
      const rawFiles = this.$refs.uploadP?.uploadFiles || [];
      if (!rawFiles.length) return this.$message.warning('请先选择图片');

      this.uploadP.isUploading = true;
      const files = rawFiles.map(f => f.raw);

      this.uploadFiles(files)
        .then(fileIds => {
          console.log(fileIds, '感官质检上传的文件ID数组');

          // ✅ 关键：将文件ID数组保存到临时对象中
          this.tempUnquality.qualityFileIds = fileIds;

          console.log(this.tempUnquality, '44444444444444444444')
          // 组装本地预览列表
          // const newImgs = fileIds.map((id, idx) => ({
          //   fileId: id,
          //   name: rawFiles[idx].name,
          //   url: URL.createObjectURL(rawFiles[idx].raw)
          // }));

          // this.uploadP.fileList = [...this.uploadP.fileList, ...newImgs];
          this.$refs.uploadP.clearFiles();
          this.$message.success(`成功上传图片`);
        })
        .catch(msg => this.$message.error(msg))
        .finally(() => this.uploadP.isUploading = false);
    },
    // 新增：根据文件ID初始化感官质检文件列表
    initSensoryFileList(fileIds) {
      this.uploadP.fileList = fileIds.map((fileId, index) => ({
        uid: -index - 1, // 使用负值避免冲突
        fileId: fileId,
        name: `感官质检图片${index + 1}`,
        url: this.getFileUrl(fileId) // 需要实现根据文件ID获取预览URL的方法
      }));
    },

    // 新增：根据文件ID获取文件预览URL
    getFileUrl(fileId) {
      // 这里需要根据您的实际文件服务接口来实现
      // 示例：return `${process.env.VUE_APP_BASE_API}/file/preview/${fileId}`;
      return ''; // 暂时返回空，您需要根据实际情况实现
    },
    // 文件预览操作
    handleFilePreview(file) {
      this.dialogFileImageUrl = file.url
      this.dialogFileOpen = true
    },
    handleImgRemoveSensory(file) {
      return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.uploadP.fileList = this.uploadP.fileList.filter(i => i.fileId !== file.fileId);
      }).catch(() => { });
    },
    // 文件删除操作
    handleImgRemove(file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let index = this.upload.fileList.findIndex((fileItem) => {
            return fileItem.uid === file.uid
          })
          console.log(index)
          return this.upload.fileList.splice(index, 1)
        })
        .catch(() => {
          // 点击取消，什么也不做！
        })
      return false // 这一句相当重要！！
    },
















    viewReport(row, index) {
      this.currentSampleIndex = index;

      // 直接从样品行数据中获取感官质检信息
      this.tempUnquality = {
        ggQualityDescribe: row.ggQualityDescribe || '',
        ggQualityResult: row.ggQualityResult || '',
        debitResult: row.debitResult || '',
        debitAmount: row.debitAmount || '',
        debitWeight: row.debitWeight || '',
        qualityFileIds: row.ggQualityFileIds || '' // 注意字段名是 ggQualityFileIds
      };

      // 如果有图片文件ID，需要初始化上传组件显示
      if (this.tempUnquality.qualityFileIds && this.tempUnquality.qualityFileIds.length > 0) {
        this.initSensoryFileList(this.tempUnquality.qualityFileIds);
      } else {
        this.uploadP.fileList = []; // 清空文件列表
      }

      this.dialogVisible = true;
    },
    handleClearSample(index) {
      const sample = this.form.opSamplingPlanSampleList[index];

      // ✅ 清空物料相关信息
      this.$set(this.form.opSamplingPlanSampleList, index, {
        ...sample,
        materialName: '',
        materialCode: '',
        invillId: null,
        invbillName: '', // 样品名称输入框绑定的字段
      });

      // ✅ 强制刷新响应式
      this.form.opSamplingPlanSampleList = [...this.form.opSamplingPlanSampleList];
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
      console.log(this.form, '1111111111')
      const encodedData = encodeURIComponent(JSON.stringify(this.form));
      // 使用路由生成完整URL，避免history模式路径问题
      const routeUrl = this.$router.resolve({
        path: '/dyylprint',
        query: { Details: encodedData }
      });
      window.open(routeUrl.href, '_blank');
      // this.$router.push({ path: '/dyyl', query: { Details: this.form } });
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




    /** 物料对话框打开时自动查询 */
    handleMaterialDialogOpen() {
      this.getMaterialList();
      this.selectedMaterial = null; // 清空之前的选择
    },
    // 物料行双击事件
    handleMaterialDblClick(row) {
      console.log(row, '11111')
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
      // if (this.currentMaterialIndex !== null) {
      //   const sample = this.form.opSamplingPlanSampleList[this.currentMaterialIndex];
      //   sample.materialName = this.selectedMaterial.invbillName;
      //   sample.materialCode = this.selectedMaterial.sapCode;
      //   sample.invillId = this.selectedMaterial.id;
      //   sample.invbillName = this.selectedMaterial.invbillName; // 确保后端字段也设置

      //   // 如果样品名称为空，自动填充物料名称作为样品名称
      //   if (!sample.name || sample.name.trim() === '') {
      //     sample.name = this.selectedMaterial.invbillName;
      //   }
      // }
      const index = this.currentMaterialIndex;
      if (index === null) return;

      const oldSample = this.form.opSamplingPlanSampleList[index];

      // ✅ 构造新样品对象，自动填充样品名（若用户没填过）
      const newSample = {
        ...oldSample,
        materialName: this.selectedMaterial.invbillName,
        materialCode: this.selectedMaterial.sapCode,
        invillId: this.selectedMaterial.id,
        invbillName: this.selectedMaterial.invbillName,
        name: oldSample.name && oldSample.name.trim() !== ''
          ? oldSample.name
          : this.selectedMaterial.invbillName, // ✅ 仅当用户没填时才自动填充
      };

      // ✅ 关键：用 $set 触发响应式更新
      this.$set(this.form.opSamplingPlanSampleList, index, newSample);
      this.form.opSamplingPlanSampleList = [...this.form.opSamplingPlanSampleList];
      console.log('新样品名称：', newSample.invbillName);
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

      // ✅ 清空上次的选择状态
      this.allSelectedTestItems.clear();

      // ✅ 如果当前样品已有选中项目，回显它们
      if (this.form.opSamplingPlanSampleList[index].opSamplingPlanItemList) {
        this.form.opSamplingPlanSampleList[index].opSamplingPlanItemList.forEach(item => {
          this.allSelectedTestItems.set(item.itemId, item);
        });
      }

      // ✅ 获取检测项目列表并设置选中状态
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
          this.$refs.testItemTable.clearSelection(); // ✅ 清空表格选中状态
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
      console.log(this.currentSampleIndex)
      if (this.currentSampleIndex !== -1) {
        // 将 Map 转换为数组
        const selectedItems = Array.from(this.allSelectedTestItems.values());

        this.form.opSamplingPlanSampleList[this.currentSampleIndex].opSamplingPlanItemList = selectedItems.map(item => ({
          itemId: item.labtestItemsId,
          itemName: item.itemName,
          itemCode: item.itemCode
        }));
        console.log(this.form.opSamplingPlanSampleList[this.currentSampleIndex].opSamplingPlanItemList)
      }

      // 清空全局选中状态
      this.allSelectedTestItems.clear();
      this.testItemDialogVisible = false;
    },

    // 添加样品
    addSample() {
      this.form.opSamplingPlanSampleList.push({
        opFeedEntrustOrderSampleId: null,
        feedEntrustOrderId: null,

        // ✅ 正确字段名，与后端保持一致
        invillId: null, // 物料ID

        name: '',
        model: '',
        batchNo: '',
        opSamplingPlanItemList: [],
        packaging: '',
        status: '',
        storageRequirement: '',
        testMethod: '',
        sequence: this.form.opSamplingPlanSampleList.length + 1,
        produceDate: '',

        // ✅ 这些是你本地用的辅助字段，也可以保留
        materialCode: '',
        materialName: '',
        invbillName: ''
      });
    },

    // 删除样品
    removeSample(index) {
      this.$confirm('确定要删除这个样品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.opSamplingPlanSampleList.splice(index, 1);
        // 重新排序
        this.form.opSamplingPlanSampleList.forEach((item, idx) => {
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
    // 提交表单
    submitForm(actionType) {
      this.submitLoading = true;

      const submitData = {
        ...this.form,
        status: actionType === 'bc' ? '0' : '1', // 保存为0，提交为1
        opSamplingPlanSampleList: this.form.opSamplingPlanSampleList.map(sample => {
          const sampleData = {
            ...sample,
            opSamplingPlanItemList: (sample.opSamplingPlanItemList || []).map(item => ({
              itemId: item.itemId,
              itemName: item.itemName,
              itemCode: item.itemCode
            }))
          };

          // ✅ 保留感官质检相关字段
          // 这些字段已经在样品行中，不需要特殊处理

          return sampleData;
        })
      };

      console.log('提交的数据:', submitData);
      console.log('操作类型:', actionType, '状态:', submitData.status);

      const apiCall = this.form.opSamplingPlanId
        ? addPlan(submitData)
        : addPlan(submitData);

      apiCall
        .then(response => {
          const successMsg = this.form.opSamplingPlanId ? "修改成功" : "新增成功";
          this.$modal.msgSuccess(successMsg);
          // this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
        })
        .catch(error => {
          console.error('提交失败:', error);
          this.$modal.msgError("提交失败");
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },
    // 接收
    jsForm() {
      const submitData = {
        ...this.form,
        opSamplingPlanSampleList: this.form.opSamplingPlanSampleList.map(sample => ({
          ...sample,
          opSamplingPlanItemList: (sample.opSamplingPlanItemList || []).map(item => ({
            itemId: item.itemId,
            itemName: item.itemName,
            itemCode: item.itemCode
          }))
        }))
      };
      submitData.isReceive = '1'
      console.log(submitData, '接收列表')
      addPlan(submitData).then(response => {
        this.$modal.msgSuccess("接收成功");
        this.$router.go(-1); // 使用 this.$router
        this.$tab.closePage();
        // this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
      });
    },
    // 取消按钮
    cancel() {
      this.$router.push({ path: '/CentralLaboratory/feedEntrustOrder' });
    },

    // 表单验证方法
    validateForm() {
      // 验证送样日期
      // if (!this.form.sendSampleDate) {
      //   this.$message.error('请选择送样日期');
      //   return false;
      // }

      // // 验证委托方联系方式
      // if (!this.form.entrustContact || !this.form.entrustContactPhone) {
      //   this.$message.error('请选择委托方联系方式');
      //   return false;
      // }

      // 验证样品列表
      // if (!this.form.opSamplingPlanSampleList || this.form.opSamplingPlanSampleList.length === 0) {
      //   this.$message.error('请至少添加一个样品');
      //   return false;
      // }

      // // 验证每个样品的样品名称
      // for (let i = 0; i < this.form.opSamplingPlanSampleList.length; i++) {
      //   const sample = this.form.opSamplingPlanSampleList[i];
      //   if (!sample.name || sample.name.trim() === '') {
      //     this.$message.error(`第 ${i + 1} 个样品的样品名称不能为空`);
      //     // 可选：滚动到对应的样品行
      //     this.highlightSampleRow(i);
      //     return false;
      //   }
      //   // 验证物料
      //   if (!sample.materialName || sample.materialName.trim() === '') {
      //     this.$message.error(`第 ${i + 1} 个样品的物料不能为空，请选择物料`);
      //     this.highlightSampleRow(i);
      //     return false;
      //   }
      //   // 验证样品名称
      //   if (!sample.name || sample.name.trim() === '') {
      //     this.$message.error(`第 ${i + 1} 个样品的样品名称不能为空`);
      //     this.highlightSampleRow(i);
      //     return false;
      //   }


      //   // 验证每个样品是否选择了检测项目
      //   if (!sample.opSamplingPlanItemList || sample.opSamplingPlanItemList.length === 0) {
      //     this.$message.error(`第 ${i + 1} 个样品的检测项目不能为空，请选择检测项目`);
      //     this.highlightSampleRow(i);
      //     return false;
      //   }

      //   // 验证检测方法
      //   if (!sample.testMethod) {
      //     this.$message.error(`第 ${i + 1} 个样品的检验检测方法不能为空，请选择检测方法`);
      //     this.highlightSampleRow(i);
      //     return false;
      //   }
      // }

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