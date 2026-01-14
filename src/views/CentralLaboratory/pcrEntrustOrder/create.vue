<template>
  <div class="app-container">
    <div class="entrust-form">
      <!-- 表头 -->
      <div class="form-header">
        <div class="form-data-header-title" @click="goBack" style="float: left; margin-right: 20px;">
          <i class="el-icon-back"></i>
          返回
        </div>
        <h1> PCR检测送检单</h1>
        <span :style="statusStyle">
          {{ statusText }}
        </span>
        <!-- 添加委托单编码和二维码 -->
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
            <td width="10%">送检单位</td>
            <td width="10%">
              <el-input :value="form.opPcrEntrustOrderId ? form.entrustDeptName : currentDept.deptName"
                :disabled="isZS"></el-input>
            </td>
            <td width="10%">送检时间</td>
            <td width="10%" align="center">
              <div style="position: relative;">
                <el-date-picker v-model="form.sendSampleDate" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :disabled="isZS" :class="{ 'required-field': !form.sendSampleDate }">
                </el-date-picker>
                <span v-if="!form.sendSampleDate" class="required-star" style="color:red;">请选择送样日期</span>
              </div>
            </td>
            <td width="10%" align="center">送检数量</td>
            <td width="10%" align="center">
              <el-input-number v-model="form.totalSampleQuantity" :min="1" :max="99999" size="small" :disabled="isZS">
              </el-input-number>
            </td>
          </tr>
          <!-- 第二行 -->
          <tr>
            <td width="10%">地址</td>
            <td width="10%">
              <el-input :value="form.opPcrEntrustOrderId ? form.address : currentDept.address" :disabled="isZS">
              </el-input>
            </td>
            <td width="10%">送样人</td>
            <td width="10%">
              <div style="position: relative;">
                <el-select v-model="selectedContactId" placeholder="请选择送样人" style="width: 100%;"
                  @change="handleSenderChange" :disabled="isZS" :class="{ 'required-field': !selectedContactId }">
                  <el-option v-for="contact in bsContactInfoList" :key="contact.bsContactInfoId"
                    :label="contact.contactPerson" :value="contact.bsContactInfoId" />
                </el-select>
                <span v-if="!selectedContactId" class="required-star" style="color:red;">请选择送样人</span>
              </div>
            </td>
            <td width="10%" align="center">电话</td>
            <td width="10%" align="center">
              <!-- 【修改点】: 电话改为只读输入框 -->
              <el-input v-model="form.entrustContactPhone" placeholder="- 随送样人关联 -" :disabled="true"></el-input>
            </td>
            <td width="10%">邮箱</td>
            <td width="10%">
              <!-- 【修改点】: 邮箱改为只读输入框 -->
              <el-input v-model="form.entrustContactEmail" placeholder="- 随送样人关联 -" :disabled="true"></el-input>
            </td>
          </tr>


          <!-- 动态生成行：一行4组（项目名称+数量输入框） -->
          <tr v-for="(row, rowIndex) in taskTypeRows" :key="rowIndex">
            <td v-for="(item, colIndex) in row" :key="colIndex" width="10%"
              :align="colIndex % 2 === 0 ? 'left' : 'center'">
              <template v-if="colIndex % 2 === 0">
                <!-- 奇数列：显示项目名称（带"数量"后缀） -->
                <template v-if="item">
                  {{ item.label }}数量
                </template>
                <template v-else>
                  <span>&nbsp;</span>
                </template>
              </template>
              <template v-else>
                <!-- 偶数列：数量输入框（绑定到 taskTypeQuantities） -->
                <el-input-number v-if="item" v-model="taskTypeQuantities[item.value]" placeholder="0" size="small"
                  :disabled="isZS" :min="0" :max="99999" @change="handleQuantityChange"></el-input-number>
                <template v-else>
                  <span>&nbsp;</span>
                </template>
              </template>
            </td>
          </tr>
          <tr v-if="form.isReturn === '1'">
            <td style="color: red;">退回原因</td>
            <td colspan="7">
              <el-input type="textarea" v-model="form.returnReason" :disabled="isZS"></el-input>
            </td>
          </tr>
        </table>
      </div>

      <!-- 样品明细表格 -->
      <div class="form-section">
        <el-table :data="form.sampleList" border style="width: 100%" height="30vh">
          <el-table-column prop="reportNo" label="序号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="样品编号" width="180" align="center">
            <template slot-scope="scope">
              <el-input :value="scope.row.sampleNo" placeholder="自动生成" :disabled="true" size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="物料" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleMaterialClick(scope.$index)">选择物料</el-button>
              <div v-if="scope.row.materialName" class="selected-material">
                {{ scope.row.materialName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="样品描述" width="220" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.name" placeholder="样品描述"></el-input>
              <span v-if="!scope.row.name || scope.row.name.trim() === ''" class="required-star"
                style="color:red;">请先输入样品描述</span>
            </template>
          </el-table-column>
          <el-table-column prop="pcrTaskItemType" label="检验项目" width="400" align="center">
            <template slot-scope="scope">
              <el-select v-model="scope.row.pcrTaskItemType" placeholder="请选择检验项目" style="width: 100%;">
                <el-option v-for="dict in dict.type.pcr_task_item_type" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注" width="400" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-delete"
                @click="removeSample(scope.$index)">删除</el-button>
              <!-- <el-button size="mini" type="text" icon="el-icon-info" @click="viewReport(scope.row)">查看报告</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addSample"
          style="margin-top: 10px;">添加样品</el-button>
        <el-button type="warning" icon="el-icon-document" size="small" @click="openBatchInputDialog"
          style="margin-left: 10px;">批量输入</el-button>
        <!-- <el-button type="info" icon="el-icon-download" size="small" :loading="downloadLoading"
          @click="handleDownloadTemplate">下载模板</el-button> -->

      </div>

      <!-- 物料选择对话框 -->
      <el-dialog title="选择物料" :visible.sync="showMaterialDialog" width="800px" append-to-body
        @open="handleMaterialDialogOpen">
        <el-form :model="materialQueryParams" ref="materialQueryForm" size="small" :inline="true"
          @submit.native.prevent>
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

      <!-- 批量输入弹窗 -->
      <el-dialog title="批量输入样品" :visible.sync="batchInputDialogVisible" width="600px" append-to-body>
        <el-form label-width="100px">
          <el-form-item label="样品描述与备注">
            <el-input type="textarea" v-model="batchInputText" :rows="8" placeholder="可直接粘贴 Excel 多行（每行：描述[TAB]备注）" />
          </el-form-item>
          <el-form-item label="物料">
            <el-button type="primary" @click="openBatchMaterialDialog">选择物料</el-button>
            <span v-if="batchSelectedMaterial">{{ batchSelectedMaterial.invbillName }}</span>
          </el-form-item>
          <el-form-item label="检验项目">
            <el-select v-model="batchSelectedItemType" placeholder="请选择检验项目" style="width: 200px;">
              <el-option v-for="dict in dict.type.pcr_task_item_type" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmBatchInput">确定</el-button>
          <el-button @click="batchInputDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="!isZS">提交</el-button>
        <el-button @click="printForm" type="success" icon="el-icon-printer">打印</el-button>
        <el-button @click="viewReport" type="success" icon="el-icon-printer"
          v-if="!isAdd && form.status == '5'">下载报告</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="isActiveTab === '2'">保存</el-button>
        <el-button @click="cancel" v-if="!isZS">取消</el-button>
        <el-button type="primary" @click="jsForm" v-if="isZS && isActiveTab === '1'">接收</el-button>
        <el-button type="danger" @click="thForm" v-if="isZS && isActiveTab === '1'"">退回</el-button>
      </div>
    </div>
    <el-dialog title=" 请输入退回原因" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
          <el-input type="textarea" v-model="returnReason"></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="qdth">确 定</el-button>
          </span>
          </el-dialog>
      </div>
</template>

<script>
import { getPcrEntrustOrder, addPcrEntrustOrder, updatePcrEntrustOrder } from "@/api/CentralLaboratory/pcrEntrustOrder";
import { returnFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import { getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { getpagelist } from "@/api/Basicdata/Testingitems";
import {

  downloadPcrReport,
  sendPcrReport  // 确保导入发送报告接口
} from "@/api/CentralLaboratory/jczxPCRReport";
import QRCode from 'qrcodejs2';
import { download } from "@/utils/request"; // 新增：download 工具
export default {
  name: "PcrEntrustOrderCreate",
  dicts: ["pcr_task_item_type", 'entrust_order_status'],
  data() {
    return {
      
      isActiveTab: '',//当前激活的tab
      isZS: true,
      taskTypeQuantities: {}, // 新增这行
      canEditBasicInfo: true, // 是否可以编辑基础信息
      qrcode: null,  // 二维码
      // 表单参数
      form: {
        opPcrEntrustOrderId: null,
        entrustOrderNo: null,
        entrustDeptId: null,
        address: "",
        sendSampleUserName: "",
        entrustContact: "",
        sendSampleDate: new Date().toISOString().slice(0, 10),
        totalSampleQuantity: 0,
        remark: "",
        sampleList: [],
        entrustContactPhone: "",
        entrustContactEmail: ""
      },
      bsContactInfoList: [], // 委托方联系信息列表
      selectedContactId: null, // 【修改点】: 选中的联系人ID
      // 【移除】: selectedPhoneIndex: null, 
      // 【移除】: selectedEmailIndex: null,
      // 物料选择相关
      showMaterialDialog: false,
      currentMaterialIndex: null, // 当前操作的物料行索引
      materialOptions: [],
      materialQueryParams: {
        pageNum: 1,
        pageSize: 10,
        invbillName: '',
        ownDeptId: null, // 添加部门ID参数
        isEnable: '1',
        tag: '3',
        isSapType: '0'
      },
      materialTotal: 0,
      selectedMaterial: null,
      // 检测项目弹窗相关
      testItemDialogVisible: false,
      currentSampleIndex: -1,
      testItemList: [],
      testItemQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        tag: '3',
        isEnable: '1',
        isSapType: '0'
      },
      testItemTotal: 0,
      selectedTestItems: [],
      // 当前机构信息
      currentDept: {
        deptId: null,
        deptName: '',
        address: ''
      },
      isZS: false,
      submitLoading: false, // 提交按钮 loading 状态
      downloadLoading: false, // 新增：下载模板 loading 状态
      // 批量输入相关
      batchInputDialogVisible: false,
      batchInputText: '',
      batchSelectedMaterial: null,
      batchSelectedItemType: null,
      dialogVisible: false,
      returnReason: '',
      isAdd: true,
    };
  },
  watch: {
    // 'form.sampleList': {
    //   handler(newVal) {
    //     this.form.totalSampleQuantity = newVal.length;
    //   },
    //   deep: true
    // },
    'form.sampleList': { // 改为监听整个样品列表，覆盖添加/删除/修改场景
      handler() {
        this.calcTaskTypeQuantities();
      },
      deep: true,
      immediate: true // 初始化时计算
    },

    // 监听联系人列表的变化
    bsContactInfoList: {
      handler(newVal) {
        // 列表更新了，且当前处于编辑状态，且没有选中人（或者选中的人不在新列表里了）
        // 再次运行 setContactSelections 确保回显不丢失
        if (this.form.opPcrEntrustOrderId) {
          this.$nextTick(() => {
            // 只有当 v-model 为空，或者当前选中的 ID 在新列表里不存在时，才去强制回显
            // 避免用户正在选的时候被重置
            const currentSelectionExists = newVal.some(item => item.bsContactInfoId === this.selectedContactId);
            if (!this.selectedContactId || !currentSelectionExists) {
              this.setContactSelections();
            }
          });
        }
      },
      deep: true
    },

  },
  computed: {
    statusText() {
      const item = this.dict.type.entrust_order_status.find(d => d.value === this.form.status);
      return item ? item.label : '待受理';
    },
    statusStyle() {
      const green = ['2', '3', '4', '5',];  // 检测中、检测完成、已审核、已发送
      const red = ['1', '6', '7'];      // 已驳回、作废、待受理（0 或空）

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
    },
    // 动态将 pcr_task_item_type 字典按一行4组拆分（每组：名称+输入框）
    taskTypeRows() {
      const taskTypes = this.dict.type.pcr_task_item_type || [];
      const rows = [];
      // 按一行4组拆分（每组对应2列：名称列+输入框列）
      for (let i = 0; i < taskTypes.length; i += 4) {
        const row = [
          taskTypes[i],    // 第1组名称
          taskTypes[i],    // 第1组输入框（关联同一个字典项，仅用于判断是否显示输入框）
          taskTypes[i + 1],// 第2组名称
          taskTypes[i + 1],// 第2组输入框
          taskTypes[i + 2],// 第3组名称
          taskTypes[i + 2],// 第3组输入框
          taskTypes[i + 3],// 第4组名称
          taskTypes[i + 3] // 第4组输入框
        ];
        rows.push(row);
      }
      return rows;
    }
  },
  created() {
    // 获取路由参数
    const id = this.$route.query.id;
    this.isZS = this.$route.query.isShow
    this.isActiveTab = this.$route.query.isActiveTab
    // 获取当前机构信息
    this.getCurrentDeptInfo();

    if (id) {
      this.loadData(id);
      this.isAdd = false
    } else {
      this.isAdd = true
      // 新增时初始化样品列表
      this.addSample();
    }
  },
  methods: {
    thForm() {
      this.dialogVisible = true;
    },
    qdth() {
      if (!this.returnReason) {
        this.$message.error('请输入退回原因');
        return false;
      }
      returnFeedEntrustOrder({
        opEntrustOrderId: this.form.opPcrEntrustOrderId,
        returnReason: this.returnReason,
        type: '3',
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
    handleClose(done) {
      this.returnReason = ''; // 清空输入框
      done();
    },
    /**
   * 计算每个检测项目的数量（根据样品列表自动统计）
   * 同时同步送检总数
   */
    calcTaskTypeQuantities() {
      const quantities = {};
      let total = 0; // 新增：统计总数量

      this.form.sampleList.forEach(sample => {
        const taskType = sample.pcrTaskItemType;
        if (taskType) {
          quantities[taskType] = (quantities[taskType] || 0) + 1;
          total++; // 每个有检测项目的样品计数+1
        }
      });

      // 赋值项目数量
      this.taskTypeQuantities = quantities;
      // 同步送检总数（关键：替代原来的重复监听）
      this.form.totalSampleQuantity = total;
    },


    /**
     * 手动修改数量输入框时的回调（可选：如果需要手动调整数量，同步到样品总数）
     */
    handleQuantityChange() {
      // 计算所有项目数量的总和，同步到送检总数
      const total = Object.values(this.taskTypeQuantities).reduce((sum, num) => sum + (num || 0), 0);
      this.form.totalSampleQuantity = total;
    },
    viewReport() {

      downloadPcrReport(this.$route.query.id).then(response => {
        this.downloadFile(response, this.form.entrustOrderNo); // 传入委托单号构造文件名
        this.$modal.msgSuccess(`报告下载开始，委托单号：${this.form.entrustOrderNo}`); // 修正提示文案
      }).catch(error => {
        this.$modal.msgError("文件下载失败");
      });
    },


    /** 下载文件工具方法（优化文件名） */
    downloadFile(response, entrustOrderNo) {
      if (response instanceof Blob) {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);

        // 用委托单号构造唯一文件名（避免重复）
        const fileName = `PCR检测报告_${entrustOrderNo}.xlsx`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('响应不是文件流格式');
        this.$modal.msgError("文件格式错误，无法下载");
      }
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
    /** 返回上一页 */
    goBack() {
      const obj = { path: "/CentralLaboratory/pcrEntrustOrder" };
      this.$tab.closeOpenPage(obj);
    },

    // 【新增】: 处理送样人选择变化
    handleSenderChange(contactId) {
      if (contactId) {
        const selectedContact = this.bsContactInfoList.find(
          contact => contact.bsContactInfoId === contactId
        );

        if (selectedContact) {
          // 【重点】存名字！存名字！
          this.form.entrustContact = selectedContact.contactPerson;
          this.form.sendSampleUserName = selectedContact.contactPerson; // 兼容旧字段

          this.form.entrustContactPhone = selectedContact.contactPhone;
          this.form.entrustContactEmail = selectedContact.contactEmail;
        }
      } else {
        this.form.entrustContact = "";
        this.form.sendSampleUserName = "";
        this.form.entrustContactPhone = "";
        this.form.entrustContactEmail = "";
      }
    },

    // 获取机构联系信息
    getDeptContactInfo(deptId) {
      getDeptContactInfoByDeptId(deptId).then(response => {
        this.bsContactInfoList = response.data.bsContactInfoList || [];

        // 新增逻辑：如果是新增委托单，默认选择 isDefaultSendSampleUser=1 的联系人作为送样人
        if (!this.form.opPcrEntrustOrderId) {
          const defaultContact = this.bsContactInfoList.find(
            contact => contact.isDefaultSendSampleUser === '1'
          );

          if (defaultContact) {
            // 设置送样人默认值
            this.selectedContactId = defaultContact.bsContactInfoId;
            this.form.entrustContact = defaultContact.contactPerson;
            this.form.sendSampleUserName = defaultContact.contactPerson;
            this.form.entrustContactPhone = defaultContact.contactPhone;
            this.form.entrustContactEmail = defaultContact.contactEmail;

            console.log('设置默认送样人:', defaultContact.contactPerson);
          } else {
            console.log('未找到默认送样人联系人');
          }
        }

        // 【修改】: 获取联系信息后设置选中项
        if (this.form.opPcrEntrustOrderId) {
          this.setContactSelections();
        }
      });
    },

    // 获取当前机构信息
    getCurrentDeptInfo() {
      getLoginUserDept().then(response => {
        this.currentDept = response.data;
        this.currentDept.address = response.data.address || '';
        this.form.entrustDeptId = this.currentDept.deptId;

        // 如果是新增，默认可以编辑基础信息，并设置默认送样日期
        if (!this.form.opPcrEntrustOrderId) {
          this.canEditBasicInfo = true;
          this.form.sendSampleDate = new Date().toISOString().slice(0, 10);
        }

        // 获取机构联系信息
        this.getDeptContactInfo(this.currentDept.deptId);
      });
    },

    // 添加样品
    addSample() {
      this.form.sampleList.push({
        name: '',
        model: '',
        produceDate: '',
        pcrTaskItemType: '',
        remark: '',
        materialName: '',
        invbillCode: '',
        invillId: '',
        invbillName: '',
        sequence: null // 新增 sequence 字段占位
      });
      // 立即更新所有序号
      this.updateSequences();
      this.$nextTick(() => {
        this.calcTaskTypeQuantities(); // 新增样品后重新计算数量
      });
    },

    // 删除样品
    removeSample(index) {
      this.form.sampleList.splice(index, 1);
      // 删除后更新序号
      this.updateSequences();
      this.calcTaskTypeQuantities(); // 删除样品后重新计算数量
    },

    // 提交表单
    submitForm() {
      // 先进行完整表单验证
      if (!this.validateSamples()) {
        return;
      }


      // 校验必填字段
      if (!this.validateSamples()) {
        return;
      }
      // 确保地址字段有正确的值
      const address = this.form.opPcrEntrustOrderId
        ? this.form.address
        : this.currentDept.address;
      this.submitLoading = true; // 开始 loading
      const submitData = {
        address: this.form.opPcrEntrustOrderId
          ? this.form.address
          : this.currentDept.address,
        entrustDeptId: this.form.entrustDeptId,
        entrustDeptName: this.form.opPcrEntrustOrderId ? this.form.entrustDeptName : this.currentDept.deptName,
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

      const apiCall = this.form.opPcrEntrustOrderId
        ? updatePcrEntrustOrder(submitData)
        : addPcrEntrustOrder(submitData);

      apiCall
        .then(response => {
          this.$modal.msgSuccess(this.form.opPcrEntrustOrderId ? "修改成功" : "新增成功");
          // 关闭当前路由对应的标签页
          this.$tab.closePage();
          this.$router.push({ path: '/CentralLaboratory/Order/pcrEntrustOrder' });
        })
        .catch(() => {
          // 可选：错误提示已在拦截器中处理
        })
        .finally(() => {
          this.submitLoading = false; // 结束 loading
        });
      // if (this.form.opPcrEntrustOrderId != null) {
      //   updatePcrEntrustOrder(submitData).then(response => {
      //     this.$modal.msgSuccess("修改成功");
      //     // this.$router.push({ path: '/CentralLaboratory/pcrEntrustOrder' });
      //   });
      // } else {
      //   addPcrEntrustOrder(submitData).then(response => {
      //     this.$modal.msgSuccess("新增成功");
      //     this.$tab.closePage();
      //     this.$router.push({ path: '/CentralLaboratory/pcrEntrustOrder' });
      //   });
      // }
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
      updatePcrEntrustOrder(submitData).then(response => {
        this.$modal.msgSuccess("接收成功");
        // this.$router.go(-1); // 使用 this.$router
        this.$tab.closePage();
        this.$router.push({ path: '/CentralLaboratory/sampleReceive/PCR' });
      });
    },
    // 取消按钮
    cancel() {
      this.$tab.closePage();
      this.$router.push({ path: '/CentralLaboratory/Order/pcrEntrustOrder' });
    },
    // 加载委托单数据
    loadData(id) {
      getPcrEntrustOrder(id).then(response => {
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
        // 确保地址字段有值
        if (!this.form.address && this.currentDept.address) {
          this.form.address = this.currentDept.address;
        }

        // 检查是否可以编辑基础信息
        if (this.form.opPcrEntrustOrderId && this.form.entrustDeptId) {
          this.canEditBasicInfo = (this.currentDept.deptId === this.form.entrustDeptId);
        } else {
          this.canEditBasicInfo = true; // 新增时默认可以编辑
        }

        // 【必须】数据一回来，不管列表有没有加载完，先尝试回显
        // 如果此时 bsContactInfoList 还是空的，上面的方法会自动塞入一个临时选项
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
              sample.testItem = sample.testItem.map(item => ({
                itemId: item.itemId, // 保持原样
                itemName: item.itemName,
                itemCode: item.itemCode
              }));
            } else {
              sample.testItem = [];
            }
          });
        }

        // 如果样品为空，添加一个空样品
        if (!this.form.sampleList || this.form.sampleList.length === 0) {
          this.addSample();
        } else {
          // 确保每个样品都有 sequence，并更新序号
          this.form.sampleList = this.form.sampleList.map(s => ({ ...s, sequence: s.sequence || null }));
          this.updateSequences();
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

      if (this.currentMaterialIndex !== null) {
        // 单行选择：赋值到指定样品行
        const sample = this.form.sampleList[this.currentMaterialIndex];
        this.$set(sample, 'materialName', this.selectedMaterial.invbillName);
        this.$set(sample, 'invbillCode', this.selectedMaterial.sapCode);
        this.$set(sample, 'invillId', this.selectedMaterial.id);
        this.$set(sample, 'invbillName', this.selectedMaterial.invbillName);
        // 清除之前选择的项目，避免显示不一致
        sample.testItem = [];
      } else {
        // 批量选择：赋值到批量弹窗的选中物料
        this.batchSelectedMaterial = this.selectedMaterial;
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

      // 初始化已选项目
      if (this.form.sampleList[index].testItem) {
        this.selectedTestItems = [...this.form.sampleList[index].testItem];
      } else {
        this.selectedTestItems = [];
      }

      // 获取检测项目列表
      this.getTestItemList();
    },

    // 在获取检测项目列表时设置选中状态
    getTestItemList() {
      getpagelist(this.testItemQuery).then(response => {
        this.testItemList = response.rows.map(item => ({
          labtestItemsId: item.labtestItemsId, // 使用 API 返回的字段名
          itemName: item.itemName,
          itemCode: item.itemCode
        }));

        this.testItemTotal = response.total;

        // 设置已选项目的选中状态
        this.$nextTick(() => {
          if (this.selectedTestItems.length > 0) {
            this.testItemList.forEach(row => {
              const isSelected = this.selectedTestItems.some(
                selectedItem => selectedItem.labtestItemsId === row.labtestItemsId // 使用 labtestItemsId 比较
              );
              if (isSelected) {
                this.$refs.testItemTable.toggleRowSelection(row, true);
              }
            });
          }
        });
      });
    },

    // 处理检测项目选择变化
    handleTestItemSelectionChange(selection) {
      this.selectedTestItems = selection;
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
        tag: '3',
        isEnable: '1',
        isSapType: '0'
      };
      this.getTestItemList();
    },

    // 确认选择的检测项目
    confirmTestItems() {
      if (this.currentSampleIndex !== -1) {
        const sample = this.form.sampleList[this.currentSampleIndex];

        // 保存检测项目信息，将 labtestItemsId 赋值给 itemId
        sample.testItem = this.selectedTestItems.map(item => ({
          itemId: item.labtestItemsId, // 这里将 labtestItemsId 赋值给 itemId
          itemName: item.itemName,
          itemCode: item.itemCode
        }));

        console.log('保存的检测项目:', sample.testItem); // 添加调试日志
      }
      this.testItemDialogVisible = false;
    },


    // 【强制回显】直接使用后端返回的名字构造选项
    setContactSelections() {
      // 如果是新增状态且已经设置了默认送样人，直接返回
      if (!this.form.opPcrEntrustOrderId && this.selectedContactId) {
        return;
      }

      // 1. 获取后端返回的姓名 (优先 entrustContact，其次 sendSampleUserName)
      const backendName = this.form.entrustContact || this.form.sendSampleUserName;

      // 如果没有名字，直接清空
      if (!backendName) {
        this.selectedContactId = null;
        return;
      }

      // 2. 确保列表已初始化，防止报错
      if (!this.bsContactInfoList) {
        this.bsContactInfoList = [];
      }

      // 3. 尝试在现有列表中查找（万一列表里有呢）
      let targetOption = this.bsContactInfoList.find(item => item.contactPerson === backendName);

      // 4. 【关键步骤】如果列表为空 或者 没找到这个人，手动造一个临时选项 push 进去
      if (!targetOption) {
        // 生成一个临时 ID，只要不跟现有 ID 重复即可，用于绑定 v-model
        const tempId = 'TEMP_DISPLAY_' + new Date().getTime();

        targetOption = {
          bsContactInfoId: tempId, // 临时 ID
          contactPerson: backendName, // 显示的名字
          contactPhone: this.form.entrustContactPhone || '', // 回显电话
          contactEmail: this.form.entrustContactEmail || ''  // 回显邮箱
        };

        // 把这个"假"数据塞进下拉列表，这样 el-select 就能认出它了
        this.bsContactInfoList.push(targetOption);
      }

      // 5. 赋值给 v-model，触发回显
      this.selectedContactId = targetOption.bsContactInfoId;

      // 6. (可选) 强制刷新一下视图
      this.$forceUpdate();
    },


    // 打印表单
    printForm() {
      // 1. 生成唯一 Key
      const printKey = 'pcr_print_data_' + new Date().getTime();

      // 2. 存入 localStorage (容量大，支持跨页)
      localStorage.setItem(printKey, JSON.stringify(this.form));

      // 3. 路由跳转只传 Key
      const routeUrl = this.$router.resolve({
        path: '/dyylprintPcr',
        query: { printKey: printKey }
      });
      window.open(routeUrl.href, '_blank');
    },

    // 校验样品必填字段
    validateSamples() {
      // 验证送样人
      if (!this.selectedContactId) {
        this.$message.error('请选择送样人');
        return false;
      }

      // 验证送样日期
      if (!this.form.sendSampleDate) {
        this.$message.error('请选择送样日期');
        return false;
      }

      for (let i = 0; i < this.form.sampleList.length; i++) {
        const sample = this.form.sampleList[i];

        // 校验物料是否选择
        if (!sample.invbillName || !sample.materialName) {
          this.$message.error(`第 ${i + 1} 行样品未选择物料`);
          return false;
        }

        // 校验样品描述是否填写
        if (!sample.name || sample.name.trim() === '') {
          this.$message.error(`第 ${i + 1} 行样品描述不能为空`);
          return false;
        }

        // 校验检验项目是否选择
        if (!sample.pcrTaskItemType) {
          this.$message.error(`第 ${i + 1} 行样品未选择检验项目`);
          return false;
        }
      }
      return true;
    },

    // 新增：下载模板方法（调用 /labtest/pcrEntrustOrder/downloadImportModel）
    handleDownloadTemplate() {


      const itemLabel = (this.dict.type && this.dict.type.pcr_task_item_type
        ? this.dict.type.pcr_task_item_type.find(d => d.value === this.form.itemCode)?.label
        : null) || '样品';
      const fileName = `${itemLabel}导入模板.xlsx`;

      this.downloadLoading = true;
      this.$modal.loading("正在生成模板，请稍候...");

      // 参数名按约定使用 pcrTaskItemType（可根据后端调整）
      download('/labtest/pcrEntrustOrder/downloadImportModel', {
        pcrTaskItemType: this.form.itemCode
      }, fileName).then(() => {
        this.$modal.closeLoading();
        this.downloadLoading = false;
      }).catch(() => {
        this.$modal.closeLoading();
        this.downloadLoading = false;
        this.$modal.msgError("下载模板失败，请联系管理员");
      });
    },

    // 批量输入确认
    confirmBatchInput() {
      // 解析批量输入的文本
      const lines = this.batchInputText.split('\n').map(line => line.trim()).filter(line => line !== '');
      const newSamples = [];

      for (const line of lines) {
        // 跳过空行
        if (line.trim() === '') {
          continue;
        }

        // 解析描述和备注
        const [description, remark] = line.split('\t').map(part => part.trim());

        // 创建新样品对象
        const newSample = {
          name: description,
          remark: remark || '',
          materialName: this.batchSelectedMaterial ? this.batchSelectedMaterial.invbillName : '',
          invbillCode: this.batchSelectedMaterial ? this.batchSelectedMaterial.sapCode : '',
          invillId: this.batchSelectedMaterial ? this.batchSelectedMaterial.id : '',
          invbillName: this.batchSelectedMaterial ? this.batchSelectedMaterial.invbillName : '',
          pcrTaskItemType: this.batchSelectedItemType || ''
        };

        newSamples.push(newSample);
      }

      // 关键改动：先移除样品列表中“完全为空”的占位行，避免保留空行在最前面
      const isEmptySample = s => {
        const emptyName = !(s.name && s.name.toString().trim());
        const emptyMaterial = !(s.materialName && s.materialName.toString().trim()) && !(s.invbillName && s.invbillName.toString().trim());
        const emptyRemark = !(s.remark && s.remark.toString().trim());
        const emptyItem = !(s.pcrTaskItemType);
        // 当描述、物料、备注和项目均为空时视为占位空行
        return emptyName && emptyMaterial && emptyRemark && emptyItem;
      };

      // 过滤掉占位空行（保留已有有效样品）
      this.form.sampleList = this.form.sampleList.filter(s => !isEmptySample(s));

      // 将新样品添加到表单中
      if (newSamples.length > 0) {
        this.form.sampleList.push(...newSamples.map(s => ({ ...s, sequence: null })));
        this.updateSequences();
        this.$nextTick(() => {
          this.calcTaskTypeQuantities(); // 批量添加后计算数量
        });
      }

      this.batchInputDialogVisible = false;
      this.batchInputText = '';
      this.batchSelectedMaterial = null;
      this.batchSelectedItemType = null;
    },

    // 新增：打开批量输入弹窗（解决弹窗不显示的问题）
    openBatchInputDialog() {
      this.batchInputDialogVisible = true;
      // 重置批量输入相关字段，确保弹窗展示为初始状态
      this.batchInputText = '';
      this.batchSelectedMaterial = null;
      this.batchSelectedItemType = null;
    },

    // 打开批量物料选择对话框
    openBatchMaterialDialog() {
      // 改为复用已有的物料选择对话框，currentMaterialIndex === null 表示批量选择
      this.currentMaterialIndex = null;
      this.selectedMaterial = null;
      this.showMaterialDialog = true;
    },

    // 新增方法：更新样品序号
    updateSequences() {
      if (!Array.isArray(this.form.sampleList)) return;
      this.form.sampleList.forEach((s, idx) => {
        // 使用 Vue.set 保持响应式
        this.$set(s, 'sequence', idx + 1);
      });
      // 同步 totalSampleQuantity（watch 也会处理，但这里保证即时同步）
      this.form.totalSampleQuantity = this.form.sampleList.length;
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
  padding: 10px;
}

/* .info-table {
  width: 100%;

}

.info-table td {
  border: 1px solid #e6e6e6;
  padding: 10px;
  vertical-align: top;
} */

/* 让表格合并边框，消除列间空白 */
.info-table {
  border-collapse: collapse !important;
  border-spacing: 0 !important;
}

/* 去掉 td 里默认的左右留白，只保留需要的上下 */
.info-table td {
  padding: 10px !important;
  /* line-height: 57px; */
  /* 自己调 */
  border: 1px solid #e6e6e6;
  /* vertical-align: top; */
  vertical-align: middle;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
}

@media print {
  .app-container {
    background-color: white !important;
    padding: 0 !important;
  }

  .entrust-form {
    box-shadow: none !important;
    padding: 15px !important;
  }

  .el-button,
  .form-actions {
    display: none !important;
  }

  .el-input__inner,
  .el-select__input {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}

/* 必填字段视觉提示 */
.required-field .el-input__inner,
.required-field .el-select .el-input__inner,
.required-field .el-date-editor .el-input__inner {
  border-color: #f56c6c !important;
}

.required-star {
  position: absolute;
  left: 0;
  bottom: -18px;
  font-size: 12px;
  color: #f56c6c;
  width: 100%;
  text-align: center;
}

/* 送样人选择器必填样式 */
.el-select.required-field ::v-deep .el-input__inner {
  border-color: #f56c6c;
}

/* 送样日期选择器必填样式 */
.el-date-editor.required-field ::v-deep .el-input__inner {
  border-color: #f56c6c;
}

/* 错误高亮效果 */
.error-highlight {
  background-color: #fef0f0 !important;
  animation: blink 0.5s ease-in-out 3;
}

@keyframes blink {

  0%,
  100% {
    background-color: #fef0f0;
  }

  50% {
    background-color: #fde2e2;
  }
}

/* 让整个表格滚动区域轨道变宽 */
::v-deep .el-table__body-wrapper {



  /* 纵向滚动条 */
  /* &::-webkit-scrollbar {
    width: 12px;
  
  } */

  /* 横向滚动条 */
  &::-webkit-scrollbar:horizontal {
    height: 12px;
    /* 横向滚动条高度 */
  }

  /* 拖动条本身 */
  &::-webkit-scrollbar-thumb {
    background-color: #c0c4cc;
    border-radius: 6px;
  }

  /* 轨道背景 */
  &::-webkit-scrollbar-track {
    background-color: #f5f7fa;
  }
}

操作列左靠
::v-deep .el-table__fixed-right {

  margin-right: 8px !important;

}


</style>
