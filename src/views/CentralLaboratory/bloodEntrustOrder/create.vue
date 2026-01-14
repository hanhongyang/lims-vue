<template>
  <div class="app-container">
    <div class="entrust-form">
      <div class="form-header">
        <div class="form-data-header-title" @click="goBack" style="float: left; margin-right: 20px;">
          <i class="el-icon-back"></i>
          返回
        </div>
        <h1>{{ 'GMMY-ZJ-29-15' }} 血样检测送检单</h1>
        <span :style="statusStyle">
          {{ statusText }}
        </span>
        <div class="entrust-info" style="position: absolute; right: 0px; top: -20px; text-align: center;">
          <div class="qrcode-container" v-show="form.entrustOrderNo">
            <div style="justify-content: center;align-items: center;display: flex;" ref="qrcode"></div>
          </div>
          <div class="entrust-no" style="margin-top: 10px; font-size: 14px; font-weight: bold;">
            委托单编码: {{ form.entrustOrderNo || '待生成' }}
          </div>
        </div>
      </div>

      <div class="form-section">
        <table class="info-table">
          <tr>
            <td width="12%">送检单位</td>
            <td width="23%">
              <el-input :value="form.opBloodEntrustOrderId ? form.entrustDeptName : currentDept.deptName"
                :disabled="true"></el-input>
            </td>
            <td width="12%">送检时间</td>
            <td width="23%" align="center">
              <div style="position: relative;">
                <el-date-picker v-model="form.sendSampleDate" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                  style="width: 100%;" :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId"
                  :class="{ 'required-field': !form.sendSampleDate }">
                </el-date-picker>
                <span v-if="!form.sendSampleDate" class="required-star" style="color:red;">请选择送样日期</span>
              </div>
            </td>
            <td width="15%" align="center">送检数量</td>
            <td width="15%" align="center">
              <el-input-number v-model="form.totalSampleQuantity" :min="1" :max="99999" size="small" style="width: 100%"
                :disabled="true">
              </el-input-number>
            </td>
          </tr>
          <tr>
            <td width="12%">地址</td>
            <td width="23%">
              <el-input :value="form.opBloodEntrustOrderId ? form.address : currentDept.address"
                :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
              </el-input>
            </td>
            <td width="12%">送样人</td>
            <td width="23%">
              <div style="position: relative;">
                <el-select v-model="selectedContactId" placeholder="请选择送样人" style="width: 100%;"
                  @change="handleSenderChange" :class="{ 'required-field': !selectedContactId }" :disabled="isZS">
                  <el-option v-for="contact in bsContactInfoList" :key="contact.bsContactInfoId"
                    :label="contact.contactPerson" :value="contact.bsContactInfoId" :disabled="isZS" />
                </el-select>
                <span v-if="!selectedContactId" class="required-star" style="color:red;">请选择送样人</span>
              </div>
            </td>
            <td width="15%" align="center">电话</td>
            <td width="15%" align="center">
              <el-input v-model="form.entrustContactPhone" placeholder="- 随送样人关联 -" :disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td width="12%">邮箱</td>
            <td width="23%">
              <el-input v-model="form.entrustContactEmail" placeholder="- 随送样人关联 -" :disabled="true"></el-input>
            </td>
            <td colspan="4"></td>
          </tr>
          <tr>
            <td width="12%">检测项目</td>
            <td colspan="5">
              <div class="remarks">
                <p style="display: flex; align-items: center; margin: 8px 0; position: relative;">
                  <el-radio-group v-model="form.itemCode" :class="{ 'required-field': !form.itemCode }">
                    <el-radio v-for="dict in dict.type.blood_task_item_type" :key="dict.value" :label="dict.value"  
                      @click.native.prevent="toggleRadio('itemCode', dict.value)">{{
                        dict.label }}</el-radio>
                  </el-radio-group>
                  <span v-if="!form.itemCode" class="required-star"
                    style="color:red; position: absolute; left: 8px; bottom: -15px;">请选择检测项目</span>

                </p>
                <!-- <p style="display: flex; align-items: center; margin: 8px 0; position: relative;"
                  v-if="isShenghuaSelected">
                  <span style="min-width: 120px; font-weight: bold;">生化项目类别：</span>
                  <el-checkbox-group v-model="form.biochemistryItemType" size="mini"
                    :class="{ 'required-field': !form.biochemistryItemType.length }">
                    <el-checkbox v-for="dict in dict.type.biochemistry_item_type" :key="dict.value" :label="dict.value"
                      border>{{
                        dict.label }}</el-checkbox>
                  </el-checkbox-group>
                  <span v-if="isShenghuaSelected && !form.biochemistryItemType.length" class="required-star"
                    style="color:red; position: absolute; left: 128px; bottom: -15px;">请选择生化项目类别</span>
                </p> -->
                <p style="display: flex; align-items: center; margin: 8px 0;"      
                  v-if="!isZaoyunSelected && !isShenghuaSelected">
                        <span style="min-width: 120px;">1、若是检查口蹄疫：</span>

                           <el-radio-group v-model="form.itemTy" size="mini">

                         <el-radio v-for="dict in dict.type.fmd_time" :key="dict.value" :label="dict.value" border
                             @click.native.prevent="toggleRadio('itemTy', dict.value)">{{
                        dict.label }}</el-radio>

                          </el-radio-group>     </p>

                <p style="display: flex; align-items: center; margin: 8px 0;"
                  v-if="!isZaoyunSelected && !isShenghuaSelected"> <span style="min-width: 120px;">2、若是检测布病抗体：</span>

                  <el-radio-group v-model="form.itemBbkt" size="mini">

                    <el-radio v-for="dict in dict.type.bbktjc_type" :key="dict.value" :label="dict.value" border
                      @click.native.prevent="toggleRadio('itemBbkt', dict.value)">{{

                        dict.label }}</el-radio>

                  </el-radio-group>

                </p>

                <p style="display: flex; align-items: center; margin: 8px 0;"
                  v-if="!isZaoyunSelected && !isShenghuaSelected"><span style="min-width: 180px;">免疫时间(免疫后的样品)</span>
                  <el-input v-model="form.immunityTime" placeholder="请输入免疫时间" style="width: 200px;"></el-input>
                </p>
              </div>
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

      <div class="form-section">
        <el-table :data="form.sampleList" border style="width: 100%" height="47vh">
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

          <el-table-column label="管号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.gh" placeholder="管号"></el-input>
              <span v-if="!scope.row.gh || scope.row.gh.trim() === ''" class="required-star"
                style="color:red;">请先输入管号</span>
            </template>
          </el-table-column>
          <el-table-column label="牛号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleName" placeholder="牛号"
                @blur="checkDuplicate(scope.row.sampleName, scope.$index)" />
              <span v-if="!scope.row.sampleName || scope.row.sampleName.trim() === ''" class="required-star"
                style="color:red;">请先输入牛号</span>
            </template>
          </el-table-column>
          <el-table-column label="母牛号" align="center" v-if="form.itemCode == '4'">
            <template slot-scope="scope">
              <el-input v-model="scope.row.mnh" placeholder="请输入母牛号"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="类别" align="center" v-if="!isZaoyunSelected && !isShenghuaSelected">
            <template slot-scope="scope">
              <el-select v-model="scope.row.sampleType" placeholder="请选择类别" clearable>
                <el-option v-for="dict in dict.type.cattle_type" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="配种天数" align="center" v-if="isZaoyunSelected">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pzts" placeholder="请输入配种天数"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="备注" align="center" v-if="!isZaoyunSelected">
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
              <span v-if="showBvdvRemarkTip && !scope.row.remark.trim()" class="required-star"  style="color:red;">请填写备注</span>
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
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addSample">添加样品</el-button>
          </el-col>

          <el-col :span="1.5" v-if="!isZS && isActiveTab != '1'">
            <el-tooltip content="请先选择上方的“检测项目”" :disabled="form.itemCode != null" placement="top">
              <div> <el-button type="info" icon="el-icon-download" size="small" :loading="downloadLoading"
                  :disabled="!form.itemCode" @click="handleDownloadTemplate">下载模板</el-button>
              </div>
            </el-tooltip>
          </el-col>

          <el-col :span="1.5" v-if="!isZS && isActiveTab != '1'">
            <el-tooltip content="请先选择上方的“检测项目”" :disabled="form.itemCode != null" placement="top">
              <div>
                <el-upload ref="upload" action="#" :show-file-list="false" :before-upload="handleImport"
                  :disabled="!form.itemCode" accept=".xlsx, .xls" style="display: inline-block;">
                  <el-button type="success" icon="el-icon-upload2" size="small" :loading="importLoading"
                    :disabled="!form.itemCode">导入样品</el-button>
                </el-upload>
              </div>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>

      <div class="form-actions">
        <el-button type="primary" @click="submitForm" :loading="submitLoading" v-if="!isZS">提交</el-button>
        <el-button @click="printForm" type="success" icon="el-icon-printer" v-if="isAdd != 'add'">打印</el-button>
        <el-button @click="viewReport" type="success" icon="el-icon-printer" v-if="form.status == '5'">查看报告</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="isActiveTab === '2'">保存</el-button>
        <el-button @click="cancel" v-if="!isZS">取消</el-button>
        <el-button type="primary" @click="jsForm" :loading="jsLoading" v-if="isZS && isActiveTab === '1'">接收</el-button>
        <el-button type="danger" @click="thForm" v-if="isZS && isActiveTab === '1'">退回</el-button>
      </div>

    </div>
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
import { getBloodEntrustOrder, addBloodEntrustOrder, updateBloodEntrustOrder } from "@/api/CentralLaboratory/bloodEntrustOrder";
import { returnFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import {
  ckbg
} from "@/api/CentralLaboratory/jczxBloodReport";
import { getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import QRCode from 'qrcodejs2';
import { download } from "@/utils/request"; // 假定您使用若依的 download 工具
import * as XLSX from 'xlsx';
export default {
  name: "BloodEntrustOrderCreate",

  dicts: ['blood_task_item_type', 'fmd_time', 'bbktjc_type', 'entrust_order_status', 'cattle_type', 'biochemistry_item_type'],
  data() {
    // ... (data 属性保持不变) ...
    return {
      isActiveTab: '',//当前激活的tab
      isZS: true,
      dialogVisible: false,
      returnReason: '',
      qrcode: null,  // 二维码
      canEditBasicInfo: true, // 是否可以编辑基础信息
      qrcodeDataUrl: '', // 二维码图片的Data URL
      // 表单参数
      form: {
        opBloodEntrustOrderId: null,
        entrustOrderNo: null,
        entrustDeptId: null,
        address: "",
        sendSampleUserName: "",
        sendSampleDate: new Date().toISOString().slice(0, 10),
        totalSampleQuantity: 0,
        remark: "",
        sampleList: [],
        entrustContactPhone: "",
        entrustContactEmail: "",
        itemCode: null,
        itemBbkt: null,
        itemTy: null,
        biochemistryItemType: [],
      },
      bsContactInfoList: [], // 委托方联系信息列表
      selectedContactId: null, // 【修改点】: 选中的联系人ID

      // 当前机构信息
      currentDept: {
        deptId: null,
        deptName: '',
        address: ''
      },
      submitLoading: false, //// 提交/保存按钮 loading
      jsLoading: false,   //// 接收按钮 loading
      isZS: false,
      // 按钮加载状态 
      downloadLoading: false,
      importLoading: false,
      isAdd: ''
    };
  },
  watch: {
    // ... (watchers 保持不变) ...
    bsContactInfoList: {
      handler(newVal) {
        // 只要处于编辑模式 (有 ID) 且列表有数据，就尝试回显
        if (this.form.opBloodEntrustOrderId) {
          this.$nextTick(() => {
            this.setContactSelections();
          });
        }
      },
      deep: true
    },

    'form.sampleList': {
      handler(newVal) {
        if (newVal) {
          this.form.totalSampleQuantity = newVal.length;
        } else {
          this.form.totalSampleQuantity = 0;
        }
      },
      deep: true
    },

    'form.itemCode'(newValue) {
      if (!this.dict.type.blood_task_item_type) return;

      const zaoyunDict = this.dict.type.blood_task_item_type.find(d => d.label === '早孕');
      const zaoyunValue = zaoyunDict ? zaoyunDict.value : null;

      const shenghuaDict = this.dict.type.blood_task_item_type.find(d => d.label === '生化');
      const shenghuaValue = shenghuaDict ? shenghuaDict.value : null;

      if (newValue === zaoyunValue) {
        // --- 选中早孕 ---
        this.form.itemTy = null;
        this.form.itemBbkt = null;
        this.form.immunityTime = "";
        this.form.biochemistryItemType = []; // 清空生化
      } else if (newValue === shenghuaValue) {
        // --- 选中生化 ---
        this.form.itemTy = null;
        this.form.itemBbkt = null;
        this.form.immunityTime = "";
        // 清空样品中的配种天数
        this.form.sampleList.forEach(sample => {
          if (sample.pzts) {
            sample.pzts = null;
          }
        });
      } else {
        // --- 选中其他 (或清空) ---
        // 清空早孕相关
        this.form.sampleList.forEach(sample => {
          if (sample.pzts) {
            sample.pzts = null;
          }
        });
        // 清空生化相关
        this.form.biochemistryItemType = [];
      }
    }
  },
  computed: {
    // ... (computed 属性 保持不变) ...
    statusText() {
      const item = this.dict.type.entrust_order_status.find(d => d.value === this.form.status);
      // console.log(this.form.status,'1111111');
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
    isZaoyunSelected() {
      if (!this.dict.type.blood_task_item_type) {
        return false;
      }
      const zaoyunDict = this.dict.type.blood_task_item_type.find(d => d.label === '早孕');
      if (zaoyunDict) {
        return this.form.itemCode === zaoyunDict.value;
      }
      return false;
    },
    isShenghuaSelected() {
      if (!this.dict.type.blood_task_item_type) {
        return false;
      }
      const shenghuaDict = this.dict.type.blood_task_item_type.find(d => d.label === '生化');
      if (shenghuaDict) {
        return this.form.itemCode === shenghuaDict.value;
      }
      return false;
    },
    // 是否显示 BVDV 抗原备注必填提示
    showBvdvRemarkTip() {
      return this.form.itemCode === '4';   // BVDV抗原 value=4
    }

  },
  created() {
    // ... (created 保持不变) ...
    const id = this.$route.query.id;
    this.isZS = this.$route.query.isShow
    this.isAdd = this.$route.query.type
    this.isActiveTab = this.$route.query.isActiveTab
    this.getCurrentDeptInfo();
    if (id) {
      this.loadData(id);
    } else {
      this.addSample();
    }
  },
  methods: {
    checkDuplicate(val, currentIdx) {
      if (!val || !val.trim()) return;
      const repeatIdx = this.form.sampleList.findIndex(
        (item, idx) => idx !== currentIdx && (item.sampleName || '').trim() === val.trim()
      );
      if (repeatIdx !== -1) {
        this.$message.error(`牛号“${val}”已存在，不可重复！`);
        // 清空当前输入
        this.$set(this.form.sampleList[currentIdx], 'sampleName', '');
      }
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
        opEntrustOrderId: this.$route.query.id,
        returnReason: this.returnReason,
        type: '2',
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
    viewReport() {
      ckbg(this.form.reportId).then((res) => {
        if (res.code == 200) {
          const encodedData4 = encodeURIComponent(this.form.reportId);
          const encodedData3 = Boolean(false);
          if (this.form.bloodTaskItemType == 2) {
            window.open(
              `/reportgenjh?&bloodTaskItemType=${this.form.bloodTaskItemType}&isShowB=${encodedData3}&reportId=${encodedData4}`,
              '_blank' // 新标签页
            );
          } else if (this.form.bloodTaskItemType == 6) {
            window.open(
              `/reportgenjhkt?bloodTaskItemType=${this.form.bloodTaskItemType}&isShowB=${encodedData3}&reportId=${encodedData4}`,
              '_blank' // 新标签页
            );
          } else if (this.form.bloodTaskItemType == 0) {
            window.open(
              `/reportgenkty?bloodTaskItemType=${this.form.bloodTaskItemType}&isShowB=${encodedData3}&reportId=${encodedData4}`,
              '_blank' // 新标签页
            );

          } else if (this.form.bloodTaskItemType == 9) {
            window.open(
              `/reportgenzy?bloodTaskItemType=${this.form.bloodTaskItemType}&isShowB=${encodedData3}&reportId=${encodedData4}`,
              '_blank' // 新标签页
            );
          } else if (this.form.bloodTaskItemType == 8) {
            window.open(
              `/reportgensh?bloodTaskItemType=${this.form.bloodTaskItemType}&isShowB=${encodedData3}&reportId=${encodedData4}`,
              '_blank' // 新标签页
            );
          }
        }

      })

    },

    // ... (toggleRadio, generateQR, goBack, handleSenderChange, getDeptContactInfo, getCurrentDeptInfo, addSample, removeSample 保持不变) ...
    toggleRadio(field, val) {
      this.form[field] = this.form[field] === val ? null : val;
    },
    generateQR() {
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
    goBack() {
      // const obj = { path: "/CentralLaboratory/sampleReceive/SH" };
      this.$tab.closePage()
      // this.$tab.closeOpenPage(obj);
    },
    // 【修改方法】处理送样人选择变化
    handleSenderChange(contactId) {
      if (contactId) {
        // 根据 ID 查找完整对象
        const selectedContact = this.bsContactInfoList.find(
          contact => contact.bsContactInfoId === contactId
        );

        if (selectedContact) {
          // 1. 同步 ID
          this.form.entrustContact = selectedContact.bsContactInfoId;

          // 2. 同步名字 (sendSampleUserName)
          this.form.sendSampleUserName = selectedContact.contactPerson;

          // 3. 同步电话和邮箱
          this.form.entrustContactPhone = selectedContact.contactPhone;
          this.form.entrustContactEmail = selectedContact.contactEmail;
        }
      } else {
        // 清空逻辑
        this.form.entrustContact = "";
        this.form.sendSampleUserName = "";
        this.form.entrustContactPhone = "";
        this.form.entrustContactEmail = "";
      }
    },
    getDeptContactInfo(deptId) {
      getDeptContactInfoByDeptId(deptId).then(response => {
        this.bsContactInfoList = response.data.bsContactInfoList || [];

        // 新增逻辑：如果是新增委托单，默认选择 isDefaultSendSampleUser=1 的联系人作为送样人
        if (!this.form.opBloodEntrustOrderId) {
          const defaultContact = this.bsContactInfoList.find(
            contact => contact.isDefaultSendSampleUser === '1'
          );

          if (defaultContact) {
            // 设置送样人默认值
            this.selectedContactId = defaultContact.bsContactInfoId;
            this.form.entrustContact = defaultContact.bsContactInfoId;
            this.form.sendSampleUserName = defaultContact.contactPerson;
            this.form.entrustContactPhone = defaultContact.contactPhone;
            this.form.entrustContactEmail = defaultContact.contactEmail;

            // console.log('设置默认送样人:', defaultContact.contactPerson);
          } else {
            console.log('未找到默认送样人联系人');
          }
        }

        if (this.form.opBloodEntrustOrderId) {
          this.setContactSelections();
        }
      });
    },

    getCurrentDeptInfo() {
      getLoginUserDept().then(response => {
        this.currentDept = response.data;
        this.currentDept.address = response.data.address || '';
        this.form.entrustDeptId = this.currentDept.deptId;

        // 如果是新增，默认可以编辑基础信息，并设置默认送样日期
        if (!this.form.opBloodEntrustOrderId) {
          this.canEditBasicInfo = true;
          this.form.sendSampleDate = new Date().toISOString().slice(0, 10);
        }

        this.getDeptContactInfo(this.currentDept.deptId);
      });
    },
    addSample() {
      this.form.sampleList.push({
        name: '',
        model: '',
        produceDate: '',
        testItem: '',
        remark: '',
        pzts: '',
        // 新增 sequence 字段占位
        sequence: null
      });
      this.updateSequences();
    },
    removeSample(index) {
      this.form.sampleList.splice(index, 1);
      this.updateSequences();
    },

    // 提交表单
    submitForm() {
      this.submitLoading = true;
      // 先进行完整表单验证
      if (!this.validateSamples()) {
        this.submitLoading = false; //// 2. 验证失败，停止 loading
        return;
      }

      const address = this.form.opBloodEntrustOrderId
        ? this.form.address
        : this.currentDept.address;

      const submitData = {
        bloodTaskItemType: this.form.itemCode,
        address: this.form.opBloodEntrustOrderId
          ? this.form.address
          : this.currentDept.address,
        entrustDeptId: this.form.entrustDeptId,
        entrustDeptName: this.form.opBloodEntrustOrderId ? this.form.entrustDeptName : this.currentDept.deptName,
        ...this.form,
        // 将生化项目数组转为逗号分隔字符串
        biochemistryItemType: Array.isArray(this.form.biochemistryItemType) ? this.form.biochemistryItemType.join(',') : null,
        entrustContact: this.selectedContactId, //  提交送样人ID
        sampleList: this.form.sampleList.map(sample => ({
          ...sample,
        }))
      };
      if (this.isZaoyunSelected) {
        submitData.isZaoyun = '1';
      }

      if (this.form.opBloodEntrustOrderId != null) {
        updateBloodEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("修改成功");
          // 删除当前 tag 并返回上级页
          this.$store.dispatch('tagsView/delView', this.$route);
          // 关闭当前路由对应的标签页
          this.$tab.closePage();
        }).finally(() => {
          this.submitLoading = false;
        });
      } else {
        addBloodEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.$store.dispatch('tagsView/delView', this.$route);
          // 关闭当前路由对应的标签页
          this.$tab.closePage();
        }).finally(() => {
          this.submitLoading = false;
        });
      }
    },
    // 接收
    jsForm() {
      this.jsLoading = true; //// 1. 开始 loading
      // 接收时也应该执行验证，确保基础数据是完整的
      if (!this.validateSamples()) {
        this.jsLoading = false; //// 2. 验证失败，停止 loading
        return;
      }

      const submitData = {
        ...this.form,

        //【修复】将生化项目数组转为逗号分隔字符串
        biochemistryItemType: Array.isArray(this.form.biochemistryItemType) ? this.form.biochemistryItemType.join(',') : null,

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
      updateBloodEntrustOrder(submitData).then(response => {
        this.$modal.msgSuccess("接收成功");

        // this.$router.go(-1); // 使用 this.$router
        this.$tab.closePage();
        this.$router.push({ path: '/CentralLaboratory/sampleReceive/JB' });
        // this.goBack(); // 统一使用 goBack 方法返回
      }).finally(() => { // 
        this.jsLoading = false; //// 3. 结束 loading
      }); // 
    },
    // 取消按钮
    cancel() {
      this.$tab.closePage();
      // this.goBack(); // 【修改】: 统一使用goBack方法返回
    },
    // ... (loadData, setContactSelections, printForm, validateSamples 保持不变) ...
    loadData(id) {
      getBloodEntrustOrder(id).then(response => {
        this.form = response.data;


        if (response.data.bloodTaskItemType) {
          this.form.itemCode = response.data.bloodTaskItemType;
        }
        // 将后端传来的逗号分隔字符串转为数组
        if (this.form.biochemistryItemType && typeof this.form.biochemistryItemType === 'string') {
          this.form.biochemistryItemType = this.form.biochemistryItemType.split(',');
        } else if (!this.form.biochemistryItemType) {
          this.form.biochemistryItemType = []; // 确保是数组
        }


        this.$nextTick(() => {
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
          // 【新增】：数据加载完毕，立即触发回显逻辑
          this.setContactSelections();
        });
        if (!this.form.address && this.currentDept.address) {
          this.form.address = this.currentDept.address;
        }

        if (this.form.opBloodEntrustOrderId && this.form.entrustDeptId) {
          this.canEditBasicInfo = (this.currentDept.deptId === this.form.entrustDeptId);
        } else {
          this.canEditBasicInfo = true;
        }

        // setContactSelections 会被 watch 调用

        if (!this.form.sampleList || this.form.sampleList.length === 0) {
          this.addSample();
        } else {
          // 确保每个样品都有 sequence 字段占位，然后更新序号
          this.form.sampleList = this.form.sampleList.map(s => ({ ...s, sequence: s.sequence || null }));
          this.updateSequences();
        }
      });
    },

    // 【重写方法】强制回显逻辑：优先匹配ID，其次匹配名字，无匹配则构造临时选项
    setContactSelections() {
      // 如果是新增状态且已经设置了默认送样人，直接返回
      if (!this.form.opBloodEntrustOrderId && this.selectedContactId) {
        return;
      }

      // 1. 获取后端返回的数据
      // entrustContact 通常存的是 ID，sendSampleUserName 存的是名字
      const backendId = this.form.entrustContact;
      const backendName = this.form.sendSampleUserName;

      // 如果 ID 和 名字都没有，无法回显
      if (!backendId && !backendName) {
        this.selectedContactId = null;
        return;
      }

      // 2. 确保列表已初始化
      if (!this.bsContactInfoList) {
        this.bsContactInfoList = [];
      }

      // 3. 尝试在列表中查找 (优先匹配 ID，其次匹配名字)
      let targetOption = this.bsContactInfoList.find(item =>
        (backendId && item.bsContactInfoId === backendId) ||
        (backendName && item.contactPerson === backendName)
      );

      // 4. 【关键】如果没找到（跨部门或已删除），手动构造一个临时选项 push 进去
      if (!targetOption) {
        // 如果后端给了 ID 就用 ID，没给就生成一个临时的，确保 v-model 能选中
        const tempId = backendId || ('TEMP_' + new Date().getTime());

        targetOption = {
          bsContactInfoId: tempId,
          contactPerson: backendName || "未知联系人", // 显示的名字
          contactPhone: this.form.entrustContactPhone || '', // 回显电话
          contactEmail: this.form.entrustContactEmail || ''  // 回显邮箱
        };

        this.bsContactInfoList.push(targetOption);
      }

      // 5. 赋值给 v-model，触发回显
      this.selectedContactId = targetOption.bsContactInfoId;

      // 6. 确保表单数据与回显一致 (防止后端只返了名字没返ID的情况)
      this.form.entrustContact = targetOption.bsContactInfoId;

      this.$forceUpdate();
    },

    // 删除原来的fillPrintData方法，替换为新的printForm
    printForm() {
      // const submitData = {
      //   ...this.form,

      //   //【修复】将生化项目数组转为逗号分隔字符串
      //   biochemistryItemType: Array.isArray(this.form.biochemistryItemType) ? this.form.biochemistryItemType.join(',') : null,

      //   sampleList: this.form.sampleList.map(sample => ({
      //     ...sample,
      //     testItem: (sample.testItem || []).map(item => ({
      //       itemId: item.itemId,
      //       itemName: item.itemName,
      //       itemCode: item.itemCode
      //     }))
      //   }))
      // };
      if (this.form.opBloodEntrustOrderId) {
        this.form.entrustDeptName = this.form.entrustDeptName
      } else {
        this.form.entrustDeptName = this.currentDept.deptName
      }
      if (this.form.itemCode == 9) {
        // 1. 生成唯一 Key
        const printKey = 'blood_print_data_' + new Date().getTime();

        // 2. 存入 localStorage (容量大，支持跨页)

        localStorage.setItem(printKey, JSON.stringify(this.form));
        // form.opBloodEntrustOrderId ? form.entrustDeptName : currentDept.deptName

        // 3. 路由跳转只传 Key
        const routeUrl = this.$router.resolve({
          path: '/dyylprintZy',
          query: { printKey: printKey }
        });
        window.open(routeUrl.href, '_blank');
      } else if (this.form.itemCode == 8) {
        // 1. 生成唯一 Key
        const printKey = 'blood_print_data_' + new Date().getTime();

        // 2. 存入 localStorage (容量大，支持跨页)
        localStorage.setItem(printKey, JSON.stringify(this.form));

        // 3. 路由跳转只传 Key
        const routeUrl = this.$router.resolve({
          path: '/dyylprintSh',
          query: { printKey: printKey }
        });
        window.open(routeUrl.href, '_blank');
      } else {
        // 1. 生成唯一 Key
        const printKey = 'blood_print_data_' + new Date().getTime();

        // 2. 存入 localStorage (容量大，支持跨页)
        localStorage.setItem(printKey, JSON.stringify(this.form));

        // 3. 路由跳转只传 Key
        const routeUrl = this.$router.resolve({
          path: '/dyylprintXy',
          query: { printKey: printKey }
        });
        window.open(routeUrl.href, '_blank');
      }

      // console.log(this.form, '1111111111')
      // const encodedData = encodeURIComponent(JSON.stringify(this.form));
      // 使用路由生成完整URL，避免history模式路径问题
      // updateBloodEntrustOrder(submitData)
      // const routeUrl = this.$router.resolve({
      //   path: '/dyylprintXy',
      //   query: { id: this.$route.query.id }
      // });
      // window.open(routeUrl.href, '_blank');
    },

    validateSamples() {
      // 验证送样人
      if (!this.selectedContactId) {
        this.$message.error('请选择送样人');
        return false;
      }
      // 验证样品列表是否为空
      if (this.form.sampleList.length === 0) {
        this.$message.error('请至少添加一个样品');
        return false;
      }
      // 验证检测项目
      if (!this.form.itemCode) {
        this.$message.error('请选择检测项目');
        return false;
      }
      // 验证送样日期
      if (!this.form.sendSampleDate) {
        this.$message.error('请选择送样日期');
        return false;
      }
      // BVDV抗原必填
      if (this.form.itemCode == '4') {
        for (let i = 0; i < this.form.sampleList.length; i++) {
          const rm = (this.form.sampleList[i].remark || '').trim();
          if (!rm) {
            this.$message.error(`第 ${i + 1} 行样品：选择“BVDV抗原”时备注为必填！`);
            this.highlightSampleRow(i);
            return false;
          }
        }
      }
      // 验证生化项目类别
      // if (this.isShenghuaSelected && (!this.form.biochemistryItemType || this.form.biochemistryItemType.length === 0)) {
      //   this.$message.error('请选择生化项目类别');
      //   return false;
      // }
      for (let i = 0; i < this.form.sampleList.length; i++) {
        const sample = this.form.sampleList[i];
        if (!sample.sampleName || sample.sampleName.trim() === '') {
          this.$message.error(`第 ${i + 1} 行牛号不能为空`);
          return false;
        }
        // if (!sample.gh || sample.gh.trim() === '') {
        //   this.$message.error(`第 ${i + 1} 行管号不能为空`);
        //   return false;
        // }
      }
      return true;
    },

    // 高亮显示有问题的样品行
    highlightSampleRow(index) {
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

    // +++ 新增：下载模板 +++
    handleDownloadTemplate() {
      if (!this.form.itemCode) {
        this.$modal.msgWarning("请先选择“检测项目”后再下载模板！");
        return;
      }

      const itemLabel = this.dict.type.blood_task_item_type.find(d => d.value === this.form.itemCode)?.label || '样品';
      const fileName = `${itemLabel}导入模板.xlsx`;

      this.downloadLoading = true;
      this.$modal.loading("正在生成模板，请稍候...");

      // 使用若依的 download 工具
      download('/labtest/bloodEntrustOrder/downloadImportModel', {
        bloodTaskItemType: this.form.itemCode
      }, fileName).then(() => {
        this.$modal.closeLoading();
        this.downloadLoading = false;
      }).catch(() => {
        this.$modal.closeLoading();
        this.downloadLoading = false;
        this.$modal.msgError("下载模板失败，请联系管理员");
      });
    },

    /**
     * +++ 修改点 1：handleImport +++
     * - 修复了 <br/> 标签显示问题
     * - 实现了导入时覆盖数据
     */
    handleImport(file) {
      if (!this.form.itemCode) {
        this.$modal.msgWarning("请先选择“检测项目”后再导入！");
        return false;
      }

      this.importLoading = true;
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (json.length < 2) {
            throw new Error("Excel 文件为空或仅有表头。");
          }

          const excelHeaders = json[0];
          const dataRows = json.slice(1);

          // 1. 校验表头
          const validation = this.validateExcelHeaders(excelHeaders);
          if (!validation.isValid) {
            throw new Error(validation.errorMsg);
          }

          // 2. 处理数据 (使用您要求的、只校验中文标签的旧逻辑)
          const processingResult = this.processExcelData(dataRows, validation.expectedHeaders);

          // 3. 检查错误 (+++ 修复 <br/> Bug +++)
          if (processingResult.errors.length > 0) {

            // (1) 使用 \n (文本换行符) 代替 <br/>
            const errorMsg = `导入失败，发现以下 ${processingResult.errors.length} 个错误：\n\n${processingResult.errors.join('\n')}`;

            // (2) 使用 $alert 并设置 white-space 样式来强制 \n 换行
            // (这是在 Element UI/RuoYi 中显示多行文本的标准方法)
            this.$alert(errorMsg, "导入校验失败", {
              type: 'error',
              dangerouslyUseHTMLString: true, // 允许使用 HTML
              message: `<div style="white-space: pre-wrap;">${errorMsg}</div>` // pre-wrap 会保留换行符
            });

          } else if (processingResult.newSamples.length === 0) {
            this.$modal.msgWarning("未找到有效的样品数据（“牛号”和“管号”不能为空）。");
          } else {
            /* ===== 新增：牛号重复校验 ===== */
            const dupMap = new Map();
            processingResult.newSamples.forEach((s, idx) => {
              const key = (s.sampleName || '').trim();
              if (!key) return;
              if (!dupMap.has(key)) dupMap.set(key, []);
              dupMap.get(key).push(idx + 2);          // Excel 行号
            });
            const dupMsgs = [];
            dupMap.forEach((rows, name) => {
              if (rows.length > 1) dupMsgs.push(`牛号“${name}”在第 ${rows.join('、')} 行重复`);
            });
            if (dupMsgs.length) {
              this.$alert(dupMsgs.join('<br>'), '导入失败：存在重复牛号', { type: 'error', dangerouslyUseHTMLString: true });
              this.importLoading = false;
              if (this.$refs.upload) this.$refs.upload.clearFiles();
              return;
            }
            /* ===== 判重结束 ===== */

            // 4. 无重复再正式写入
            this.form.sampleList = processingResult.newSamples.map(s => ({ ...s, sequence: null }));
            this.updateSequences();
            console.log(this.form.sampleList, '11111111');
            this.$modal.msgSuccess(`成功导入 ${processingResult.newSamples.length} 条样品数据。`);
          }

        } catch (error) {
          this.$modal.msgError(`导入失败：${error.message}`);
        } finally {
          this.importLoading = false;
          if (this.$refs.upload) {
            this.$refs.upload.clearFiles();
          }
        }
      };

      reader.readAsArrayBuffer(file);
      return false;
    },

    // +++ 新增：校验表头方法 +++
    validateExcelHeaders(excelHeaders) {
      const expectedHeaders = this.getCurrentExpectedHeaders();

      if (excelHeaders.length < expectedHeaders.length) {
        return { isValid: false, errorMsg: `Excel 表头列数不匹配。应为 ${expectedHeaders.length} 列，但文件中只有 ${excelHeaders.length} 列。` };
      }

      for (let i = 0; i < expectedHeaders.length; i++) {
        const expected = expectedHeaders[i];
        const actual = excelHeaders[i] ? String(excelHeaders[i]).trim() : '';

        if (expected !== actual) {
          return {
            isValid: false,
            errorMsg: `Excel 表头不匹配：第 ${i + 1} 列应为“${expected}”，但文件中是“${actual}”。`
          };
        }
      }
      return { isValid: true, expectedHeaders: expectedHeaders };
    },

    // +++ 获取当前项目应有的表头 +++
    getCurrentExpectedHeaders() {
      // 动态获取列名
      let headers = ['序号', '管号', '牛号'];

      if (this.isZaoyunSelected) {
        headers.push('配种天数');
      } else if (this.isShenghuaSelected) {
        headers.push('备注');
      } else if (this.form.itemCode === '4') {
        headers.push('母牛号');
        headers.push('类别', '备注');
      } else {
        // 默认：疫病 (口蹄疫、布病等)
        headers.push('类别', '备注');
      }
      return headers;
    },

    /**
     * +++ 修改点 2：processExcelData +++
     * - 恢复为只校验 "中文标签" 的逻辑 (保留您提到的 “类别”值【1】在字典中不存在 的校验行为)
     */
    processExcelData(dataRows, headers) {
      const newSamples = [];
      const errors = [];

      // (保留旧逻辑) 只创建 标签 -> 值 的映射
      const cattleTypeMap = new Map(
        this.dict.type.cattle_type.map(d => [d.label, d.value])
      );

      dataRows.forEach((row, index) => {
        const rowNum = index + 2;
        const sample = {
          sampleName: '', gh: '', sampleType: null, pzts: '', remark: '', mnh: ''
        };
        let hasData = false;
        let rawCategoryValue = ''; // 存储从Excel读取的原始“类别”值

        headers.forEach((header, i) => {
          const value = (row[i] === null || row[i] === undefined) ? '' : String(row[i]).trim();
          if (value !== '') hasData = true;

          if (header === '牛号') sample.sampleName = value;
          else if (header === '管号') sample.gh = value;
          else if (header === '备注') sample.remark = value;
          else if (header === '类别') rawCategoryValue = value; // 临时存储原始值
          else if (header === '配种天数') sample.pzts = value;
          else if (header === '母牛号') sample.mnh = value;
        });

        if (!hasData) return; // 跳过完全空白的行

        // 原逻辑：if (!sample.sampleName || !sample.gh) {
        // 新逻辑：只校验牛号，允许管号为空
        if (!sample.sampleName) {
          if (hasData) {
            console.log(`第 ${rowNum} 行因缺少牛号被跳过。`);
          }
          return;
        }

        // (保留旧逻辑) 校验：类别
        if (headers.includes('类别') && rawCategoryValue) {
          if (cattleTypeMap.has(rawCategoryValue)) {
            // A. 校验通过 (输入的是中文标签, "母牛")
            sample.sampleType = cattleTypeMap.get(rawCategoryValue);
          } else {
            // B. 校验失败 (e.g., input is "1")
            // (这会产生您提到的 “类别”值【1】在字典中不存在 的错误)
            errors.push(`第 ${rowNum} 行的“类别”值【${rawCategoryValue}】在字典中不存在。`);
            return; // 不添加此行
          }
        }

        newSamples.push(sample);
      });

      return { newSamples, errors };
    },

    // 新增：统一更新 sampleList 中的 sequence 值（保持响应式）
    updateSequences() {
      if (!Array.isArray(this.form.sampleList)) return;
      this.form.sampleList.forEach((s, idx) => {
        this.$set(s, 'sequence', idx + 1);
      });
      // 同步 totalSampleQuantity 即时显示（watch 也会更新）
      this.form.totalSampleQuantity = this.form.sampleList.length;
    },

  }
};
</script>

<style scoped>
/* ... (style 样式保持不变) ... */
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
  /* 添加相对定位 */
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
  /* margin-bottom: 20px; */
  padding: 10px;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.remarks p {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.info-table td {
  border: 1px solid #e6e6e6;
  padding: 8px;
  vertical-align: middle;
}



.form-actions {
  text-align: center;
  margin-top: 20px;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .info-table td {
    padding: 8px;
  }

  .form-header h1 {
    font-size: 18px;
  }
}

@media screen and (max-width: 992px) {
  .app-container {
    padding: 10px;
  }

  .entrust-form {
    padding: 15px;
  }

  .info-table {
    font-size: 14px;
  }
}

/* 增加输入框和选择框的可见区域 */
.el-input,
.el-select,
.el-date-editor {
  width: 100% !important;
}

.el-input-number {
  width: 100% !important;
}

.el-input-number ::v-deep .el-input__inner {
  text-align: center;
}

/* 打印样式优化 */
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

  .info-table td {
    padding: 10px 8px;
    height: 40px;
  }
}

/* 必填字段视觉提示 */
.required-field .el-input__inner,
.required-field .el-select .el-input__inner,
.required-field .el-date-editor .el-input__inner {
  border-color: #f56c6c !important;
}

.required-field .el-radio-group {
  border: 1px solid #f56c6c;
  padding: 8px;
  border-radius: 4px;
}

.required-star {
  font-size: 12px;
  position: absolute;
  left: 0;
  bottom: -18px;
}

/* 错误高亮 */
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

/* 送样人选择器样式调整 */
.el-select.required-field ::v-deep .el-input__inner {
  border-color: #f56c6c;
}

/* 让整个表格滚动区域轨道变宽 */
::v-deep .el-table__body-wrapper {

  /* 纵向滚动条 */
  &::-webkit-scrollbar {
    /* width: 15px; */
    /* 想多粗就写多大 */
    height: 8px;
    /* 横向滚动条同理 */
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
</style>