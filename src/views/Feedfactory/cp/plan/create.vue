<template>
  <div class="app-container">
    <div class="entrust-form">
      <!-- 表头 -->
      <div class="form-header">
        <h1>成品饲料取样计划详情</h1>
      </div>
      <!-- 委托单位信息 -->
      <div class="form-section">
        <table class="info-table">
          <tr>
            <td width="15%">生产订单号</td>
            <td width="35%">
              <el-input v-model="form.productionOrderNumber"></el-input>
            </td>
            <td width="15%">取样人</td>
            <td width="35%">
              <el-input v-model="form.samplerName"></el-input>
            </td>
          </tr>


          <tr>
            <!-- <td>取样时间</td>
            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.carInTime" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.carInTime }">
                </el-date-picker>
                <span v-if="!form.carInTime" class="required-star">请选择进场时间</span>
              </div>
            </td> -->
            <td>取样时间</td>
            <td>
              <div style="position: relative;">
                <el-date-picker v-model="form.carOutTime" type="date" placeholder="选择取样时间" value-format="yyyy-MM-dd"
                  style="width: 100%;" :class="{ 'required-field': !form.carOutTime }">
                </el-date-picker>

              </div>
            </td>
            <td>是否是主样本</td>
            <td>
              <el-radio-group v-model="form.isMainSample">
                <el-radio label="0">主样</el-radio>
                <el-radio label="1">辅样</el-radio>
              </el-radio-group>

            </td>
          </tr>
          <tr>
            <td>是否销毁</td>
            <td >
              <el-radio-group v-model="form.isDestroy">
                <el-radio label="0">未销毁</el-radio>
                <el-radio label="1">已销毁</el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <td>备注</td>
            <td colspan="3">
              <el-input v-model="form.remark"></el-input>
            </td>
          </tr>


          <!-- <tr>
            <td>随车检测报告</td>
            <td>
              <div style="display: flex; gap: 8px; align-items: center;">
                <el-button type="primary" size="small" @click="handleCarReportUpload">
                  上传<i class="el-icon-upload el-icon--right" />
                </el-button>
                <el-button type="success" size="small" @click="handleCarReportPreview">
                  预览<i class="el-icon-files el-icon--right" />
                </el-button>
                <span v-if="form.opSamplingPlanSampleList[0].carFileId">
                  已上传：{{ form.opSamplingPlanSampleList[0].reportFileName || '文件' }}
                </span>
              </div>
              
            </td>
          </tr> -->

        </table>


      </div>


      <!-- 样品信息（平铺形式） -->
      <div class="form-section">
        <el-form :model="form" label-width="100px">
          <!-- <div class="section-title">样品信息</div> -->

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="样品编号" prop="sampleNo">
                <el-input v-model="form.sampleNo" placeholder="请输入样品编号" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="物料" prop="invillId">
                <el-button size="mini" @click="handleMaterialClick" :type="form.invillId ? 'success' : 'warning'"
                  style="width: 100%;">
                  {{ form.invillId ? '已选物料' : '选择物料' }}
                </el-button>
                <div v-if="form.invillId" class="selected-material">
                  {{ form.invbillName }}
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="生产日期" prop="productionDate">
                <el-date-picker v-model="form.productionDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="保质期" prop="shelfLife">
                <el-select v-model="form.shelfLife" placeholder="选择月数" style="width: 100%;">
                  <el-option v-for="item in shelfLifeOptions" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="样品状况" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="dict in dict.type.sample_state" :key="dict.value" :label="dict.value">
                    {{ dict.label }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="检测项目" prop="opSamplingPlanItemList">
                <el-button size="mini" @click="openTestItemDialog">选择检测项目</el-button>
                <div v-if="form.opSamplingPlanItemList && form.opSamplingPlanItemList.length" class="selected-items">
                  <el-tag v-for="item in form.opSamplingPlanItemList" :key="item.itemId" size="small"
                    style="margin: 2px;">
                    {{ item.itemName }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="随车检测报告">
                <el-button size="mini" @click="handleAdd">上传</el-button>
                <el-button size="mini" @click="handlePreview">预览</el-button>
                <span v-if="form.carFileId" style="margin-left: 10px;">
                  已上传：{{ form.reportFileName || '文件' }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" :loading="submitLoading" @click="handleSave">保存</el-button>
        <el-button type="success" :loading="submitLoading" @click="handleComplete">
          取样完成
        </el-button>
        <el-button type="warning" :loading="submitLoading" @click="handleSkip">
          无需取样
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-button @click="dqyzf" type="danger">作废</el-button>
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
        :row-key="row => row.itemId">
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
import { listDept, getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { listUser } from "@/api/system/user";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getItemByInvbillCode } from "@/api/Basicdata/Testingitems";
import { listSupplier } from '@/api/Basicdata/supplier';
import QRCode from 'qrcodejs2';
import {
  Reportsl, Reportslbc, zzhhx, zzhhxbc, jzcommit, savePdf, ckbg
} from "@/api/CentralLaboratory/jczxFeedReport";
import {
  sampleInfo,
  addSapSample,
  updateSapSample, // [新增] 
  completePlan, // [新增]
  skipPlan,     // [新增]
  cancelPlan
} from "@/api/feedfactory/plan";
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
      // [!! 新增 !!] 保质期下拉选项
      shelfLifeOptions: [
        { value: '1个月', label: '1个月' },
        { value: '2个月', label: '2个月' },
        { value: '3个月', label: '3个月' },
        { value: '6个月', label: '6个月' },
        { value: '9个月', label: '9个月' },
        { value: '12个月', label: '12个月' },
        { value: '18个月', label: '18个月' },
        { value: '24个月', label: '24个月' },
      ],
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
        isEnable: '1',
        invbillCode: ''   // ← 新增
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
    this.id = id
    this.isZS = this.$route.query.isShow
    // ✅ 强制初始化一条空样品数据
    this.form.opSamplingPlanSampleList = [];
    this.addSample();
    // 获取当前机构信息
    this.getCurrentDeptInfo();

    if (id) {
      this.loadData(id);
    }
    this.getSupplierList();


  },
  mounted() {

  },
  methods: {
    dqyzf() {
      cancelPlan(this.id).then(res => {
        if (res.code == 200) {
          this.$modal.msgSuccess("作废成功成功");
        } else {
          this.$modal.msgError(res.msg)
        }
      })
    },
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
      // row.carFileId = this.tempUnquality.carFileId || '';

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
      sampleInfo({
        opSamplingPlanSampleId: id
      }).then(response => {
        this.form = response.data;
        console.log(this.form, '1')
        // 关键保护
        if (!this.form.opSamplingPlanSampleList) {
          this.$set(this.form, 'opSamplingPlanSampleList', []);
        }
        // ✅ 兜底：如果后台返回空数组，就默认塞一条
        if (this.form.opSamplingPlanSampleList.length === 0) {
          this.addSample();   // 直接调用已有方法
        }
        // this.form = { ...this.$options.data().form, ...res.data }
      });
    },
    /**
         * 1. [重构] 核心保存方法
         * @param {boolean} isChained - true: 表示这是自动调用(如“取样完成”前的保存)，不显示成功提示。
         * @returns {Promise<String>} - 返回一个 Promise，成功时 resolve(opSamplingPlanSampleId)
         */
    handleSave(isChained = false) {
      // 返回一个 Promise，以便 handleComplete/handleSkip 可以 await 它
      return new Promise((resolve, reject) => {

        this.submitLoading = true;

        // const submitData1 = {

        //   opSamplingPlanSampleList: this.form.opSamplingPlanSampleList.map(sample => {
        //     return {
        //       ...sample,
        //       newSamplingTypes: '2',
        //       samplingType: '0'
        //     };
        //   })
        // };
        this.form.newSamplingTypes = '2'
        this.form.samplingType = '0'
        delete this.form.opSamplingPlanSampleList
        // const submitData = submitData1.opSamplingPlanSampleList[0]
        // this.submitData.newSamplingTypes = '2'
        console.log(this.form, '传给后端')

        let apiCall;
        const isUpdate = !!this.form.opSamplingPlanSampleId;

        if (isUpdate) {
          apiCall = updateSapSample(this.form);

        } else {
          apiCall = addSapSample(this.form);

        }

        apiCall
          .then(response => {
            let planId = this.form.opSamplingPlanSampleId;

            // [!! 关键 !!]
            // response 是完整的 AjaxResult ( {code, msg, data} )
            // response.data 是后端返回的 OpSamplingPlan 对象
            if (!isUpdate && response.data && response.data.opSamplingPlanSampleId) {
              // 把新 ID 赋值给 VUE 的 form
              this.form.opSamplingPlanSampleId = response.data.opSamplingPlanSampleId;
              // 把新 ID 传递给 promise 链
              planId = response.data.opSamplingPlanSampleId;
            }

            if (!isChained) {
              this.$modal.msgSuccess(isUpdate ? "修改成功" : "新增成功");
            }

            this.submitLoading = false;
            resolve(planId); // 向 await handleSave(true) 返回 planId
          })
          .catch(error => {
            console.error('保存失败:', error);
            if (!isChained) { // 链式调用时，错误由外层处理
              this.$modal.msgError("保存失败");
            }
            this.submitLoading = false;
            reject(error); // [关键] Promise 失败
          });
      });
    },

    /**
     * 2. [重构] 取样完成按钮
     * (会先自动保存)
     */
    async handleComplete() {
      // 1. 先校验样品列表是否为空
      if (!this.form.opSamplingPlanSampleList || this.form.opSamplingPlanSampleList.length === 0) {
        this.$modal.msgWarning("请至少添加一个样品后再操作");
        return;
      }

      this.submitLoading = true;
      let planId;

      try {
        // 2. [关键] 先调用保存，并等待它完成
        planId = await this.handleSave(true); // true = 链式调用，不弹窗

      } catch (error) {
        // 保存失败，直接停止
        this.submitLoading = false;
        this.$modal.msgError("保存失败，无法完成取样");
        return;
      }

      // 3. 保存成功，planId 肯定有值了，现在执行“取样完成”
      this.$modal.confirm('是否确认将此计划标记为“取样完成”？').then(() => {
        return completePlan(planId); // 调用新 API
      }).then(() => {
        this.form.status = '1'; // 1 = 已提交 (取样完成)
        this.$modal.msgSuccess("取样完成");
        // 你可以根据需要决定是否跳转
        // this.$router.push({ path: '/Ranch/plan' }); 
      }).catch(() => {
        // 用户点了“取消”或接口失败
      }).finally(() => {
        this.submitLoading = false;
      });
    },

    /**
     * 3. [重构] 无需取样按钮
     * (会先自动保存)
     */
    async handleSkip() {
      this.submitLoading = true;
      let planId;

      try {
        // 1. [关键] 先调用保存，并等待它完成
        planId = await this.handleSave(true); // true = 链式调用

      } catch (error) {
        // 保存失败，直接停止
        this.submitLoading = false;
        this.$modal.msgError("保存失败，无法标记为“无需取样”");
        return;
      }

      // 2. 保存成功，planId 肯定有值了，现在执行“无需取样”
      this.$modal.confirm('是否确认将此计划标记为“无需取样”？').then(() => {
        return skipPlan(planId); // 调用新 API
      }).then(() => {
        this.form.status = '2'; // 2 = 无需取样
        this.$modal.msgSuccess("操作成功");
      }).catch(() => {
        // 用户点了“取消”或接口失败
      }).finally(() => {
        this.submitLoading = false;
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

        currentSample.carFileId = fileId;
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
        const sample = this.form.opSamplingPlanSampleList[0]; // 只有这一条
        sample.carFileId = res.data;
        sample.reportFileName = file.name;
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
          this.tempUnquality.carFileId = fileIds;

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
        carFileId: row.ggQualityFileIds || '' // 注意字段名是 ggQualityFileIds
      };

      // 如果有图片文件ID，需要初始化上传组件显示
      if (this.tempUnquality.carFileId && this.tempUnquality.carFileId.length > 0) {
        this.initSensoryFileList(this.tempUnquality.carFileId);
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

      // 关键：直接改 this.form（它就是表格里的 scope.row）
      this.form.invillId = this.selectedMaterial.id
      this.form.invbillName = this.selectedMaterial.invbillName
      this.form.invbillCode = this.selectedMaterial.sapCode

      // 自动带出品名
      if (!this.form.sampleNo) this.form.sampleNo = this.selectedMaterial.invbillName

      // 刷新检测项目
      this.testItemQuery.invbillCode = this.selectedMaterial.sapCode
      this.showMaterialDialog = false
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
      this.testItemDialogVisible = true;
      this.isEchoingData = true;

      // 清空并重新填充 Map
      this.allSelectedTestItems.clear();
      const currentSample = this.form;  // 现在只有一条

      if (currentSample && currentSample.opSamplingPlanItemList && currentSample.opSamplingPlanItemList.length > 0) {
        currentSample.opSamplingPlanItemList.forEach(item => {
          this.allSelectedTestItems.set(item.itemId, item);
        });
      }

      this.testItemQuery.pageNum = 1;

      this.$nextTick(() => {
        if (this.$refs.testItemTable) {
          this.$refs.testItemTable.clearSelection();
        }
        this.getTestItemList();
      });
    },

    // 在获取检测项目列表时设置选中状态
    getTestItemList() {
      // 再次确保上锁（防止翻页时漏锁）
      this.isEchoingData = true;
      getItemByInvbillCode(this.testItemQuery).then(response => {
        this.testItemList = response.rows
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
        keyword: '',
        tag: '1',
        isEnable: '1'
      };
      this.getTestItemList();
    },

    // 确认选择的检测项目
    confirmTestItems() {
      const selectedItems = Array.from(this.allSelectedTestItems.values());
      this.form.opSamplingPlanItemList = selectedItems;
      this.allSelectedTestItems.clear();
      this.$forceUpdate();
      this.testItemDialogVisible = false;
    },

    // 添加样品
    addSample() {
      this.form.opSamplingPlanSampleList.push({
        /* ===== 原来主表的字段现在全部放这里 ===== */
        driverCode: '',          // 生产订单号
        samplerName: '',        // 取样人
        carOutTime: '',          // 取样时间
        remark: '',              // 备注
        carFileId: '',           // 随车检测报告文件ID
        reportFileName: '',      // 随车检测报告文件名

        /* ===== 样品本身需要的字段 ===== */
        sampleNo: '',            // 样品编号
        invillId: null,          // 物料ID
        invbillName: '',         // 物料名称
        productionDate: '',      // 生产日期
        shelfLife: '',           // 保质期
        opSamplingPlanItemList: [],   // 检测项目
        // 新增：后端样品对象中已有的字段，初始化为 null 即可
        PRUEFLOS: null,
        debitAmount: null,
        debitResult: null,
        debitWeight: null,
        ggQualityDescribe: null,
        ggQualityResult: null,
        ggQualityFileIds: null,
        ggQualityFileUrls: null,
        qualityDescribe: null,
        carFileId: null,
        qualityType: null,
        sampleStatus: null,
        whetherQualified: null,
        weight: null,     // 如果要让前端可改重量，也可以初始化
      });
      // 把整条数据变成响应式对象
      // this.form = this.$options.data().form   // 先拿一份干净的空壳
      // Object.assign(this.form, emptyRow)       // 再合并
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


    // 取消按钮
    cancel() {
      this.$tab.closePage();
    },

    // 表单验证方法
    validateForm() {


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