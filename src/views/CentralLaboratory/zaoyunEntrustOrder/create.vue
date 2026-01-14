<template>
  <div class="app-container">
    <div class="entrust-form">
      <!-- 表头 -->
      <div class="form-header">
        <div class="form-data-header-title" @click="goBack" style="float: left; margin-right: 20px;">
          <i class="el-icon-back"></i>
          返回
        </div>
        <h1>{{ 'SHGM-ZJ-29-10' }} 早孕检测样品送检单</h1>
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
            <td width="12%">送样单位</td>
            <td width="23%">
              <el-input :value="form.opBloodEntrustOrderId ? form.entrustDeptName : currentDept.deptName"
                :disabled="true"></el-input>
            </td>
            <td width="12%">送样日期</td>
            <td width="23%" align="center">
              <el-date-picker v-model="form.sendSampleDate" type="date" placeholder="选择送样日期" value-format="yyyy-MM-dd"
                style="width: 100%;" :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
              </el-date-picker>
            </td>
            <!-- <td width="15%" align="center">送检数量</td>
            <td width="15%" align="center">
              <el-input-number v-model="form.totalSampleQuantity" :min="1" :max="99999" size="small"
                style="width: 100%">
              </el-input-number>
            </td> -->
            <td width="12%">送样人</td>
            <td width="23%">
              <el-input v-model="form.sendSampleUserName" placeholder="请输入送样人"
                :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
              </el-input>
            </td>
          </tr>
          <!-- 第二行 -->
          <tr>
            <td width="15%" align="center">电话</td>
            <td width="15%" align="center">
              <el-select v-model="selectedPhoneIndex" placeholder="请选择电话" style="width: 100%;"
                @change="handlePhoneChange" :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
                <el-option v-for="(contact, index) in bsContactInfoList" :key="index"
                  :label="`${contact.contactPerson}-${contact.contactPhone}`" :value="index" />
              </el-select>
            </td>
            <td width="12%">地址</td>
            <td width="23%">
              <el-input :value="form.opBloodEntrustOrderId ? form.address : currentDept.address"
                :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
              </el-input>
            </td>
            <td width="12%">邮箱</td>
            <td width="23%">
              <el-select v-model="selectedEmailIndex" placeholder="请选择邮箱" style="width: 100%;"
                @change="handleEmailChange" :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
                <el-option v-for="(contact, index) in bsContactInfoList" :key="index"
                  :label="`${contact.contactPerson}-${contact.contactEmail}`" :value="index" />
              </el-select>
            </td>

          </tr>
          <!-- 第三行 -->
          <tr>
            <td width="12%">接收人/接收日期</td>
            <td width="23%">
              <el-input :value="form.opBloodEntrustOrderId ? form.address : currentDept.address"
                :disabled="!canEditBasicInfo && form.opBloodEntrustOrderId">
              </el-input>
            </td>
            <td colspan="4"></td>
          </tr>
          <!-- 第四行 -->
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
        <el-table :data="form.sampleList" border style="width: 100%" height="27vh">
          <!-- <el-table-column prop="reportNo" label="管号" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
</el-table-column> -->
          <el-table-column label="管号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.gh" placeholder="管号"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="牛号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.sampleName" placeholder="牛号"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="配种天数" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.pzts"></el-input>
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

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="submitForm" v-if="!isZS">提交</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm" v-if="isActiveTab === '2'">保存</el-button>
        <el-button @click="printForm" type="success" icon="el-icon-printer">打印</el-button>
        <el-button @click="cancel">取消</el-button>
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
import { getLoginUserDept, getDeptContactInfoByDeptId } from "@/api/system/dept";
import { returnFeedEntrustOrder } from "@/api/CentralLaboratory/feedEntrustOrder";
import QRCode from 'qrcodejs2';
export default {
  name: "BloodEntrustOrderCreate",

  dicts: ['fmd_time', 'bbktjc_type', 'entrust_order_status'],
  data() {
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
        sendSampleDate: null,
        totalSampleQuantity: 0,
        remark: "",
        sampleList: [],
        entrustContactPhone: "",
        entrustContactEmail: "",
        itemCode: '9', // 9代表早孕
        isZaoyun: '1', // 1代表早孕
      },
      bsContactInfoList: [], // 委托方联系信息列表
      selectedPhoneIndex: null, // 选中的电话索引
      selectedEmailIndex: null, // 选中的邮箱索引

      // 当前机构信息
      currentDept: {
        deptId: null,
        deptName: '',
        address: ''
      }
    };
  },
  watch: {
    // 监听联系信息列表变化，更新选中项
    bsContactInfoList: {
      handler(newVal) {
        if (newVal.length > 0 && this.form.opBloodEntrustOrderId) {
          this.$nextTick(() => {
            this.setContactSelections();
          });
        }
      },
      deep: true
    }
  },
  created() {
    // 获取路由参数
    const id = this.$route.query.id;
    this.isZS = this.$route.query.isShow
    console.log(this.isZS, '11111111111111111111')
    this.isActiveTab = this.$route.query.isActiveTab
    // 获取当前机构信息
    this.getCurrentDeptInfo();

    if (id) {
      console.log(id, '早孕id')
      this.loadData(id);
    }

  },
  computed: {
    statusText() {
      const item = this.dict.type.entrust_order_status.find(d => d.value === this.form.status);
      return item ? item.label : '待受理';
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
  methods: {
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
      const obj = { path: "/CentralLaboratory/sampleReceive/ZY" };
      this.$tab.closeOpenPage(obj);
    },
    // 处理电话选择变化
    handlePhoneChange(index) {
      if (index !== null && this.bsContactInfoList[index]) {
        this.form.entrustContactPhone = this.bsContactInfoList[index].contactPhone;
      } else {
        this.form.entrustContactPhone = "";
      }
    },

    // 处理邮箱选择变化
    handleEmailChange(index) {
      if (index !== null && this.bsContactInfoList[index]) {
        this.form.entrustContactEmail = this.bsContactInfoList[index].contactEmail;
      } else {
        this.form.entrustContactEmail = "";
      }
    },

    // 获取机构联系信息
    getDeptContactInfo(deptId) {
      getDeptContactInfoByDeptId(deptId).then(response => {
        this.bsContactInfoList = response.data.bsContactInfoList || [];

        console.log('获取到的联系人列表:', this.bsContactInfoList);

        // 新增逻辑：如果是新增委托单，默认选择 isDefaultSendSampleUser=1 的联系人作为送样人
        if (!this.form.opBloodEntrustOrderId) {
          const defaultContact = this.bsContactInfoList.find(
            contact => contact.isDefaultSendSampleUser === '1'
          );

          console.log('找到的默认联系人:', defaultContact);

          if (defaultContact) {
            // 设置送样人默认值
            this.form.sendSampleUserName = defaultContact.contactPerson;
            console.log('设置默认送样人:', this.form.sendSampleUserName);

            // 同时设置电话和邮箱的默认选中项
            this.selectedPhoneIndex = this.bsContactInfoList.findIndex(
              contact => contact.bsContactInfoId === defaultContact.bsContactInfoId
            );
            this.selectedEmailIndex = this.selectedPhoneIndex;

            // 设置电话和邮箱值
            if (this.selectedPhoneIndex !== -1) {
              this.form.entrustContactPhone = defaultContact.contactPhone;
              this.form.entrustContactEmail = defaultContact.contactEmail;
              console.log('设置默认电话和邮箱:', this.form.entrustContactPhone, this.form.entrustContactEmail);
            }
          } else {
            console.log('未找到默认送样人联系人');
          }
        }

        // 如果联系信息列表为空，但表单中有电话或邮箱值，则创建临时选项
        if (this.bsContactInfoList.length === 0) {
          if (this.form.entrustContactPhone) {
            this.bsContactInfoList.push({
              contactPerson: '',
              contactPhone: this.form.entrustContactPhone,
              contactEmail: this.form.entrustContactEmail || ''
            });
            this.selectedPhoneIndex = 0;
          }
          if (this.form.entrustContactEmail && !this.form.entrustContactPhone) {
            this.bsContactInfoList.push({
              contactPerson: '',
              contactPhone: '',
              contactEmail: this.form.entrustContactEmail
            });
            this.selectedEmailIndex = 0;
          }
        }

        // 获取联系信息后设置选中项
        if (this.form.opBloodEntrustOrderId) {
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

        // 如果是新增，默认可以编辑基础信息
        if (!this.form.opBloodEntrustOrderId) {
          this.canEditBasicInfo = true;
          // 设置默认送样日期为当天
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
        testItem: '',
        remark: ''
      });
    },

    // 删除样品
    removeSample(index) {
      this.form.sampleList.splice(index, 1);
    },

    // 提交表单
    submitForm() {
      if (this.form.sampleList.length === 0) {
        this.$message.warning('请至少添加一个样品');
        return;
      }
      // 校验必填字段
      if (!this.validateSamples()) {
        return;
      }
      // 确保地址字段有正确的值
      const address = this.form.opBloodEntrustOrderId
        ? this.form.address
        : this.currentDept.address;

      const submitData = {
        address: this.form.opBloodEntrustOrderId
          ? this.form.address
          : this.currentDept.address,
        entrustDeptId: this.form.entrustDeptId,
        entrustDeptName: this.form.opBloodEntrustOrderId ? this.form.entrustDeptName : this.currentDept.deptName,
        ...this.form,
        sampleList: this.form.sampleList.map(sample => ({
          ...sample,
          itemCode: this.form.opBloodEntrustOrderId

        }))
      };

      if (this.form.opBloodEntrustOrderId != null) {
        updateBloodEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("修改成功");
          // 关闭当前路由对应的标签页
          this.$tab.closePage();
          // this.$tab.closeTab('create');
          // this.$tab.closePage();
          // this.$router.push({ path: '/CentralLaboratory/Order/zaoyunEntrustOrder' });
        });
      } else {
        addBloodEntrustOrder(submitData).then(response => {
          this.$modal.msgSuccess("新增成功");
          // 关闭当前路由对应的标签页
          this.$tab.closePage();
        });
      }
    },
    // 取消按钮
    cancel() {
      this.$router.push({ path: '/CentralLaboratory/Order/zaoyunEntrustOrder' });
    },
    // 加载委托单数据
    loadData(id) {
      getBloodEntrustOrder(id).then(response => {
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
        if (this.form.opBloodEntrustOrderId && this.form.entrustDeptId) {
          this.canEditBasicInfo = (this.currentDept.deptId === this.form.entrustDeptId);
        } else {
          this.canEditBasicInfo = true; // 新增时默认可以编辑
        }

        // 设置电话和邮箱下拉框的选中项
        this.setContactSelections();

        // 如果样品为空，添加一个空样品
        if (!this.form.sampleList || this.form.sampleList.length === 0) {
          this.addSample();
        }
      });
    },

    // 设置联系信息下拉框选中项
    setContactSelections() {
      // 如果是新增状态且已经设置了默认送样人，直接返回
      if (!this.form.opBloodEntrustOrderId && this.form.sendSampleUserName) {
        return;
      }

      // 设置电话选中项
      if (this.form.entrustContactPhone && this.bsContactInfoList.length > 0) {
        this.selectedPhoneIndex = this.bsContactInfoList.findIndex(
          contact => contact.contactPhone === this.form.entrustContactPhone
        );

        // 如果没有找到匹配项，但表单中有值，创建一个临时选项
        if (this.selectedPhoneIndex === -1 && this.form.entrustContactPhone) {
          this.bsContactInfoList.push({
            contactPerson: '已保存的联系人',
            contactPhone: this.form.entrustContactPhone,
            contactEmail: this.form.entrustContactEmail || ''
          });
          this.selectedPhoneIndex = this.bsContactInfoList.length - 1;
        }
      } else {
        this.selectedPhoneIndex = null;
      }

      // 设置邮箱选中项
      if (this.form.entrustContactEmail && this.bsContactInfoList.length > 0) {
        this.selectedEmailIndex = this.bsContactInfoList.findIndex(
          contact => contact.contactEmail === this.form.entrustContactEmail
        );

        // 如果没有找到匹配项，但表单中有值，创建一个临时选项
        if (this.selectedEmailIndex === -1 && this.form.entrustContactEmail && !this.form.entrustContactPhone) {
          this.bsContactInfoList.push({
            contactPerson: '已保存的联系人',
            contactPhone: '',
            contactEmail: this.form.entrustContactEmail
          });
          this.selectedEmailIndex = this.bsContactInfoList.length - 1;
        }
      } else {
        this.selectedEmailIndex = null;
      }
    },


    // 打印表单
    printForm() {
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
    },
    jsForm() {
      this.jsLoading = true; //// 1. 开始 loading
      // 接收时也应该执行验证，确保基础数据是完整的
      if (!this.validateSamples()) {
        this.jsLoading = false; //// 2. 验证失败，停止 loading
        return;
      }

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
      updateBloodEntrustOrder(submitData).then(response => {
        this.$modal.msgSuccess("接收成功");

        // this.$router.go(-1); // 使用 this.$router
        this.$tab.closePage();
        this.$router.push({ path: '/CentralLaboratory/sampleReceive/ZY' });
        // this.goBack(); // 统一使用 goBack 方法返回
      }).finally(() => { // 
        this.jsLoading = false; //// 3. 结束 loading
      }); // 
    },
    // 校验样品必填字段
    validateSamples() {
      for (let i = 0; i < this.form.sampleList.length; i++) {
        const sample = this.form.sampleList[i];

        // 校验牛号是否填写
        if (!sample.sampleName || sample.sampleName.trim() === '') {
          this.$message.warning(`第 ${i + 1} 行牛号不能为空`);
          return false;
        }
      }
      return true;
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
  margin-bottom: 20px;
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
  padding: 12px;
  vertical-align: middle;
}

.info-table td:first-child {
  background-color: #f9f9f9;
  font-weight: bold;
  text-align: center;
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
