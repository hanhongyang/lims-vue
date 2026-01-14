<template>
  <div class="app-container">
    <el-button type="primary" icon="el-icon-back" style="margin-bottom:10px" @click="HDPada">返回检测任务</el-button>
    <el-button type="success" icon="el-icon-back" @click="HDPadb">返回样品化验</el-button>
    <el-button type="primary" icon="el-icon-plus" @click="addSample">增加样品</el-button>
    <!-- <div style="text-align: center;font-size: 20px;">{{ Details.modelNo }} {{ Details.modelName }}</div><br> -->
    <div style="text-align: center;font-size: 20px;">近红外检测</div><br>
    <div style="text-align: right;font-size: 20px;">报告编号：{{ Details.resultNo }}</div><br>
    <div class="stickytable">
      <div class="sticky-table">
        <table cellpadding="0" cellspacing="0" width="100%" id="exportTable" style="text-align: center;">
          <tbody>
            <tr>
              <td>检测日期</td>
              <td colspan="2">温湿度(℃/%)</td>
              <td>主要仪器</td>
              <td>仪器编号</td>
              <td colspan="2">检测地点</td>
              <td colspan="2">检测依据</td>
            </tr>
            <tr>
              <td><el-date-picker v-model="Details.testDate" type="date" class="custom-padding" :editable="false"
                  :readonly="isJCRY">
                </el-date-picker></td>
              <td colspan="2"><el-input v-model="Details.temperature" class="tembum"
                  :readonly="isJCRY"></el-input>/<el-input v-model="Details.humidity" class="tembum"
                  :readonly="isJCRY"></el-input></td>
              <td><el-input v-model="Details.instrumentName" :readonly="isJCRY"></el-input></td>
              <td><el-input v-model="Details.instrumentNo" :readonly="isJCRY"></el-input></td>
              <td colspan="2"><el-input v-model="Details.testLocation" :readonly="isJCRY"></el-input></td>
              <td colspan="2"><el-input v-model="Details.testBasis" :readonly="isJCRY"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="9" style="padding:0;border:0">
                <table cellpadding="0" cellspacing="0" width="100%" style="text-align: center;">
                  <tbody>
                    <!-- <tr v-if="formulaTipsList">
                      <td colspan="11" style="border:0;padding:0;text-align:left">
                        <el-alert title="以下字段为空，公式无法计算：" :description="formulaTipsList" type="warning" :closable="false"
                          show-icon>
                        </el-alert>
                      </td>
                    </tr> -->
                    <tr>
                      <td>样品编号</td>
                      <td>样品名称</td>
                      <td colspan="2">项目名称</td>
                      <td colspan="3">结果</td>
                      <td colspan="2">鲜样中含量</td>
                      <td colspan="2">操作</td>
                    </tr>
                    <template v-for="(item, index) in Details.infoList">
                      <tr :key="`row1-${index}`" class="sample-split" :class="{ 'first-sample': index === 0 }">
                        <td :rowspan="(item.testItem || []).length">{{ item.sampleNo }}</td>
                        <td :rowspan="(item.testItem || []).length">{{ item.name }}</td>
                        <td colspan="2">{{ item.testItem[0].itemName }}</td>
                        <td colspan="3"><el-input v-model="item.testItem[0].average" inputmode="decimal"
                            :readonly="Details.status == '2'" @input="onAverageInput(item)" /></td>
                        <td colspan="2"><el-input v-model="item.testItem[0].remark" inputmode="decimal" readonly /></td>
                        <td colspan="2" :rowspan="(item.testItem || []).length">
                          <!-- <el-button type="primary" icon="el-icon-upload" size="mini" @click="openUploadDialog(item)"
                            v-if="isRec || (isShow && Details.status == '1')">上传</el-button> -->
                          <el-button size="mini" :type="item.fileId ? 'success' : 'primary'"
                            :icon="item.fileId ? 'el-icon-check' : 'el-icon-upload'" @click="openUploadDialog(item)"
                            v-if="isRec || (isShow && Details.status == '1')">
                            {{ item.fileId ? '已上传' : '未上传' }}
                          </el-button>
                          <el-button v-if="item.fileId" type="primary" icon="el-icon-view" size="mini"
                            @click="openYLDialog(item)">
                            预览
                          </el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSample(index)"
                            v-if="isRec">删除</el-button>
                          <!-- <el-button type="warning" icon="el-icon-refresh" size="mini"
                            @click="retestSample(index)">复检</el-button> -->
                          <template v-if="isShow">
                            <el-button type="warning" icon="el-icon-refresh" size="mini" @click="retestSample(index)"
                              v-if="item.isReset == 0 || item.isReset == '0'">复检</el-button>
                            <span v-if="item.isReset == 1 || item.isReset == '1'"
                              style="color: #E6A23C; font-size: 12px;">
                              已申请复检
                            </span>
                          </template>
                        </td>
                      </tr>

                      <!-- 剩余项目行 -->
                      <tr v-for="(it, idx) in (item.testItem || []).slice(1)" :key="`row2-${index}-${idx + 1}`">
                        <td colspan="2">{{ it.itemName }}</td>
                        <td colspan="3"><el-input v-model="it.average" :readonly="Details.status == '2'"
                            @input="onAverageInput(item)" />
                        </td>
                        <td colspan="2"><el-input v-model="it.remark" readonly /></td>
                      </tr>
                    </template>
                    <!-- <tr v-if="formulaTips">
                      <td colspan="11" style="border:0;padding:0">
                        <el-alert title="以下字段为空，公式无法计算：" :description="formulaTips" type="warning" :closable="false"
                          show-icon>
                        </el-alert>
                      </td>
                    </tr> -->
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer" style="text-align:left;padding:5px;">
        <el-row>
          <el-col :span="10" :offset="2">
            <span>检测人:</span>
            <img v-if="signTypes.检测人" :src="signTypes.检测人" style="width:300px;height:150px;vertical-align:top">
            <el-button @click="qzclick('检测人')" v-if="isRec || (isShow && Details.status == '1')">签字</el-button>
          </el-col>
          <el-col :span="10" :offset="2" v-if="isShow">
            <span>核对人:</span>
            <img v-if="signTypes.核对人" :src="signTypes.核对人" style="width:300px;height:150px;vertical-align:top">
            <el-button @click="qzclick('核对人')" v-if="Details.status == '2' && !isJCRY">签字</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="fixed-bottom">
        <div style="margin-top: 20px; text-align: center;">
          <el-button type="primary" icon="el-icon-check" @click="saveForm"
            v-if="isRec || (isShow && (Details.status == '1' || Details.status == '6'))">保存</el-button>
          <el-button type="success" icon="el-icon-upload2" @click="submitTest"
            v-if="isRec || (isShow && (Details.status == '1' || Details.status == '6'))">提交</el-button>
          <el-button type="success" icon="el-icon-check" @click="submitCheck"
            v-if="isShow && Details.status == '2' && !isJCRY">校对</el-button>
          <el-button type="danger" icon="el-icon-refresh-left" @click="handleBack"
            v-if="isShow && Details.status == '2' && !isJCRY">退回</el-button>
        </div>
      </div>
      <el-dialog title="选择检测样品" :visible.sync="testItemDialogVisible" width="800px" append-to-body>
        <el-table ref="testItemTable" :data="testItemList" height="400"
          @selection-change="handleTestItemSelectionChange">
          <el-table-column type="selection" align="center" :selectable="checkSelectable"></el-table-column>
          <el-table-column prop="sampleNo" label="样品编码" align="center"></el-table-column>
          <el-table-column prop="sampleName" label="样品名称" align="center"></el-table-column>
        </el-table>

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
      <el-dialog title="签字板" :visible.sync="videoif" width="80%">
        <electronic @closeCanvas="closeCanvas" :showCanvas="videoif" @savecanva="savecanva" :SignatureImg="SignatureImg"
          :typename="currentSignType" v-if="videoif" @signature-done="onSignatureDone" />
      </el-dialog>
      <el-dialog title="上传" :visible.sync="uploadVisible" width="400px" append-to-body @close="closeUpload">
        {{ uploadSampleName }}
        <!-- <el-upload :action="uploadAction" list-type="picture-card" :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload> -->
        <el-upload ref="upload" :action="uploadAction" :headers="uploadHeaders" name="file"
          :data="{ sampleName: uploadSampleName }" :on-success="handleUploadSuccess" :on-error="handleUploadError"
          :before-upload="beforeUpload" :on-remove="handleRemove" list-type="picture-card" :limit="1"
          :file-list="uploadFileList" :on-exceed="() => $message.warning('最多上传1张')">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeUpload">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- 图片预览弹窗 -->
      <el-dialog v-dialogDrag title="图片预览" :visible.sync="previewVisible" width="800px" append-to-body
        @close="closePreview" ref="previewDialog " :key="dialogKey">
        <div class="preview-box" @wheel.prevent="handleWheel" @mousedown="startDrag" @mousemove="onDrag"
          @mouseup="stopDrag" @mouseleave="stopDrag">
          <img v-if="previewImageUrl" :src="previewImageUrl" :style="{
            transform: `translate(${translateX}px, ${translateY}px) scale(${imageScale})`,
            transition: isDragging ? 'none' : 'transform 0.1s'
          }" class="preview-img" @dragstart.prevent />
          <div v-else style="color:#999">图片加载中…</div>
          <div v-if="previewImageUrl" class="scale-info">
            缩放: {{ Math.round(imageScale * 100) }}%
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="resetImage">重置</el-button>
          <el-button @click="cancelPreview">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
// *** 逻辑修改：导入 jhwRetest, testSubmit, saveCheck (替换 JD) ***
import { addjhw, editJhw, listTask, XZPic, saveCheck, jhwRetest, testSubmit, usersign, backToSubmit } from "@/api/hyd";
import electronic from '@/views/Feedproject/electronic.vue'
import Decimal from 'decimal.js';
import { downloadFile } from "@/api/common/common";
import csfhyMixinJHY from "@/views/Feedproject/csfhyMixinJHY";
export default {
  name: "CrudeADFfeed",
  mixins: [csfhyMixinJHY],
  components: {
    "electronic": electronic,
  },
  directives: {
    dialogDrag: {
      bind(el, binding, vnode) {
        // 获取弹窗头部作为拖拽触发区域
        const dialogHeaderEl = el.querySelector('.el-dialog__header');
        const dragDom = el.querySelector('.el-dialog');

        if (!dialogHeaderEl || !dragDom) return;

        // 设置头部样式为可拖拽
        dialogHeaderEl.style.cssText += ';cursor:move;user-select:none;';
        dragDom.style.cssText += ';top:0px;';

        // 兼容性获取样式方法
        const getStyle = (function () {
          if (window.document.currentStyle) {
            return (dom, attr) => dom.currentStyle[attr];
          } else {
            return (dom, attr) => getComputedStyle(dom, false)[attr];
          }
        })();

        dialogHeaderEl.onmousedown = (e) => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft;
          const disY = e.clientY - dialogHeaderEl.offsetTop;

          // 获取到的值带px，正则匹配替换
          let styL = getStyle(dragDom, 'left');
          let styT = getStyle(dragDom, 'top');

          // 处理百分比的情况
          if (styL.includes('%')) {
            styL = +document.body.clientWidth * (+styL.replace(/%/g, '') / 100);
            styT = +document.body.clientHeight * (+styT.replace(/%/g, '') / 100);
          } else {
            styL = +styL.replace(/px/g, '');
            styT = +styT.replace(/px/g, '');
          }

          document.onmousemove = function (e) {
            // 计算移动的距离
            let left = e.clientX - disX;
            let top = e.clientY - disY;

            // 移动当前元素
            dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
          };

          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          };

          // 阻止默认行为，防止选中文字
          e.preventDefault();
        };
      }
    }
  },
  data() {
    return {
      dialogKey: 0, // 新增：用于强制刷新弹窗
      uploadafter: false,
      uploadAction: `${process.env.VUE_APP_BASE_API}/file/uploadAndGetUrl`,
      dialogImageUrl: '',
      dialogVisible: false,
      isJCRY: false,
      oneBeforeTime: '',
      oneAfterTime: '',
      twoBeforeTime: '',
      twoAfterTime: '',
      Details: {
        testBasis: "GB/T18868-2024"
      },
      isPad: true,
      PjcList: [],
      isRec: true,
      isShow: true,
      testItemDialogVisible: false,
      testItemList: [],
      testItemQuery: {
        pageNum: 1,
        pageSize: 10,
        keyword: '',
        isTest: '0',
        itemId: ''
      },
      uploadVisible: false,   // 控制弹窗显隐
      uploadSampleName: '',   // 要显示的样品名称
      testItemTotal: 0,
      signtype: "",
      videoif: false,
      SignatureImg: "",
      instrumentNameOne: '',
      instrumentNameTwo: '',
      instrumentNoOne: '',
      instrumentNoTwo: '',
      testLocationOne: '',
      testLocationTwo: '',
      signatureImage: '',
      signTypes: {
        检测人: '',
        核对人: ''
      },
      currentSignType: '',
      sjhphOne: '',
      sjhphTwo: '',
      sjhphThree: '',
      sjhphFour: '',
      firstId: '',
      testUserSignature: '',
      checkUserSignature: '',
      // *** 逻辑修改：新增负数校验节流阀 ***
      lastWarningTime: 0,
      warningThrottleMs: 2000,
      currentUploadRow: null,   // ← 记住正在上传的哪一行
      previewVisible: false,        // 预览弹窗显隐
      previewImageUrl: '',          // 真正给 <img> 用的完整地址
      previewFileId: '',           // 当前行保存的 fileId
      uploadFileList: [],  // el-upload 的初始文件列表
      //  新增：图片缩放比例 
      imageScale: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      translateX: 0, // X轴偏移
      translateY: 0, // Y轴偏移
    };
  },
  created() {
    // 这一段是重点
    if (this.$route.params.SjtaskInfo) {
      // this.dqID();
      this.Details = this.$route.params.SjtaskInfo;

      // ★★★ 确保执行这一步，触发第一步写的方法 ★★★
      if (this.Details.infoList) {
        this.Details.infoList = this.Details.infoList.map(item => this.initSampleItem(item));
      }

      this.isShow = true;
      this.isRec = false;

      // ... 其他逻辑 ...
      this.initTimes(); // 确保这个也执行
    }
    if (!this.Details.testBasis) {
      this.$set(this.Details, 'testBasis', 'GB/T18868-2024')
    }
  },
  computed: {
    displayTestBasis() {
      return this.Details.testBasis || 'GB/T18868-2024'
    },
    uploadHeaders() {
      return {
        Authorization: 'Bearer ' + getToken()
      };
    },
    // 返回空字段的中文名，用顿号连接；若无空字段返回空串
    formulaTipsList() {
      const tips = [];

      /* ---------- 2. 逐行字段 ---------- */
      (this.Details.infoList || []).forEach((row, idx) => {
        const rowEmpty = [];
        if (!row.m1 || !row.compareM1) rowEmpty.push('滤袋质量 m₁');
        if (!row.m || !row.compareM) rowEmpty.push('试样质量 m');
        if (!row.m2 || !row.compareM2) rowEmpty.push('袋+残渣总质量 m₂');


        if (rowEmpty.length) {
          tips.push(`第 ${idx + 1} 行样品信息：${rowEmpty.join('、')}`);
        }
      });

      /* ---------- 3. 返回 ---------- */
      return tips.length ? tips.join('；') : '';
    },
    formulaTips() {
      const empty = [];
      if (!this.Details.clqglzl) empty.push('处理前滤袋质量');
      if (!this.Details.clhglzl) empty.push('处理后滤袋质量');

      return empty.length ? empty.join('、') : '';
    }
  },
  mounted() {
    const fmt = d => {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${dd}`
    }
    const today = fmt(new Date())
    if (this.$route.params.taskInfo) {
      console.log(this.$route.params.taskInfo, '传递1111数据')
      this.dqID()
      const task = this.$route.params.taskInfo || {}
      this.Details = { ...task, infoList: [] }
      this.Details.instrumentNo = this.$route.params.taskInfo.bsItemDeptConfigList[0].instrumentCode
      this.Details.testLocation = this.$route.params.taskInfo.bsItemDeptConfigList[0].locationName
      this.Details.testBasis = this.$route.params.taskInfo.zxbz

      // 再把 bsItemDeptConfigList[0] 里的属性全部摊到 Details 上
      if (task.bsItemDeptConfigList && task.bsItemDeptConfigList[0]) {
        Object.assign(this.Details, task.bsItemDeptConfigList[0])
      }
      const jcList = this.$route.params.jcList || []
      console.log(this.$route.params.jcList, '传递222数据')
      // ★★★ 关键修改：初始化每个 item 的所有属性 ★★★
      this.Details.infoList = jcList.map(item => this.initSampleItem(item))
      this.Details.infoList = jcList
      this.Details.itemId = this.$route.params.jcList[0].IDD
      this.isShow = false
      this.isRec = true
      this.$set(this.Details, 'testDate', today)
      console.log(this.Details.infoList, '近红外化验单数据')
    } else if (this.$route.params.SjtaskInfo) {
      this.dqIDHD()
      this.Details = this.$route.params.SjtaskInfo
      // ★★★ 关键修改：确保详情页的 infoList 也初始化 ★★★
      if (this.Details.infoList) {
        this.Details.infoList = this.Details.infoList.map(item => this.initSampleItem(item))
      }
      this.isShow = true
      this.isRec = false
      if (this.$route.params.isJCRY) {
        this.isJCRY = this.$route.params.isJCRY
        console.log('检测人员查看详情', this.isJCRY)
      }
      if (this.$route.params.SjtaskInfo.testUserSignature) {
        XZPic(this.$route.params.SjtaskInfo.testUserSignature).then((res) => {
          this.signTypes.检测人 = URL.createObjectURL(res)
          this.testUserSignature = this.Details.testUserSignature; // *** 逻辑修改：加载签名ID ***
        })
      }
      if (this.$route.params.SjtaskInfo.checkUserSignature) {
        XZPic(this.$route.params.SjtaskInfo.checkUserSignature).then((res1) => {
          this.signTypes.核对人 = URL.createObjectURL(res1)
          this.checkUserSignature = this.Details.checkUserSignature; // *** 逻辑修改：加载签名ID ***
        })
      }
    } else if (this.$route.query.SjtaskInfo1) {
      this.Details = this.$route.query.SjtaskInfo1
      this.isShow = true
      this.isRec = false
      // *** 逻辑修改：兼容 query 方式 ***
      if (this.Details.testUserSignature) {
        XZPic(this.Details.testUserSignature).then((res) => {
          this.signTypes.检测人 = URL.createObjectURL(res)
          this.testUserSignature = this.Details.testUserSignature;
        })
      }
      if (this.Details.checkUserSignature) {
        XZPic(this.Details.checkUserSignature).then((res1) => {
          this.signTypes.核对人 = URL.createObjectURL(res1)
          this.checkUserSignature = this.Details.checkUserSignature;
        })
      }
    } else {
      this.$message.error('未获取到任务信息，请返回任务列表重新进入！')
      return
    }
    this.isPadPc()
    this.initTimes();
    // 在初始化后查询初水分数据并计算鲜样含量
    this.$nextTick(() => {
      setTimeout(() => {
        console.log('111111111111')
        this.loadCsfhyDataAndCalculate();
      }, 100);
    });

  },
  // *** 逻辑修改：新增 beforeDestroy ***
  beforeDestroy() {
    // 清理 Blob URL 防止内存泄漏
    if (this.signTypes.检测人 && this.signTypes.检测人.startsWith('blob:')) {
      URL.revokeObjectURL(this.signTypes.检测人);
    }
    if (this.signTypes.核对人 && this.signTypes.核对人.startsWith('blob:')) {
      URL.revokeObjectURL(this.signTypes.核对人);
    }
  },
  methods: {
    
    /**
    * ★★★ 新增：结果输入时触发鲜样含量计算 ★★★
    */
    onAverageInput(item) {
      console.log('=== onAverageInput 触发 ===');
      console.log('样品:', item.sampleNo);
      console.log('输入的结果:', item.testItem?.[0]?.average);
      console.log('缓存的初水分数据:', this.cachedCsfhyData);

      // 延迟执行，等待 v-model 更新完成
      this.$nextTick(() => {
        this.calculateFreshSampleForItem(item);
      });
    },

    /**
     * 针对非第一个项目的输入处理
     */
    onAverageInputByTestItem(sampleItem, testItem) {
      this.$nextTick(() => {
        this.calculateFreshSampleForItem(sampleItem);
      });
    },

    // 如果需要手动触发计算（比如初水分数据更新后）
    recalculateAllFreshSample() {
      if (this.Details.infoList) {
        this.Details.infoList.forEach(item => {
          this.calculateFreshSampleForItem(item);
        });
      }
    },
    // 【新增】获取焦点时，去掉百分号，方便用户修改数字
    inputFocus(row, key) {
      let val = row[key];
      if (val && typeof val === 'string' && val.includes('%')) {
        // 去掉 %
        row[key] = val.replace('%', '');
      }
    },

    // 【新增】失去焦点时，如果内容是数字，自动补上百分号
    inputBlur(row, key) {
      let val = row[key];
      // 如果有值，且不是纯粹的符号，且没有%，则加上
      if (val && !String(val).includes('%')) {
        // 简单校验一下是不是数字（可选）
        if (!isNaN(parseFloat(val))) {
          row[key] = String(val) + '%';
        }
      }
    },
    // 专门的重置方法
    resetImage() {
      this.imageScale = 1;   // 重置大小
      this.translateX = 0;   // 重置X轴位移
      this.translateY = 0;   // 重置Y轴位移
    },

    startDrag(e) {
      if (this.imageScale <= 1) return; // 只有放大时才允许拖拽
      this.isDragging = true;
      this.startX = e.clientX - this.translateX;
      this.startY = e.clientY - this.translateY;
    },
    onDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      this.translateX = e.clientX - this.startX;
      this.translateY = e.clientY - this.startY;
    },
    stopDrag() {
      this.isDragging = false;
    },
    // 鼠标滚轮缩放 
    handleWheel(e) {
      // // 滚轮向上放大，向下缩小
      // const delta = e.deltaY > 0 ? -0.1 : 0.1;
      // let newScale = this.imageScale + delta;

      // // 限制缩放范围 0.2 - 5 倍
      // newScale = Math.max(0.2, Math.min(5, newScale));
      // this.imageScale = newScale;
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      let newScale = this.imageScale + delta;
      newScale = Math.max(0.2, Math.min(5, newScale));
      this.imageScale = newScale;
    },

    // 关闭时重置缩放 
    closePreview() {
      this.previewVisible = false;

      // 1. 清理图片资源
      if (this.previewImageUrl && this.previewImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.previewImageUrl);
      }
      this.previewImageUrl = '';
      this.previewFileId = '';

      // 2. 复原图片缩放/位移变量
      this.resetImage();

      // 3. 更新 key，强制下次打开时重新渲染组件
      this.dialogKey += 1;
    },
    // 0. 打开预览弹窗
    openYLDialog(row) {
      if (!row.fileId) {
        this.$message.warning('该样品尚未上传图片');
        return;
      }
      this.resetImage();
      this.previewFileId = row.fileId;
      this.previewImageUrl = '';          // 先清空
      this.previewVisible = true;

      // 1. 调后端拿 Blob
      downloadFile(row.fileId).then(blob => {
        // 2. 生成临时 URL 给 <img>
        this.previewImageUrl = URL.createObjectURL(blob);
      }).catch(err => {
        console.error(err);
        this.$message.error('图片加载失败');
      });
    },

    // 关闭预览弹窗
    // closePreview() {
    //   this.previewVisible = false;
    //   // 记得释放 Blob URL
    //   if (this.previewImageUrl.startsWith('blob:')) {
    //     URL.revokeObjectURL(this.previewImageUrl);
    //   }
    //   this.previewImageUrl = '';
    //   this.previewFileId = '';
    // },

    // 用户点击“确认使用该图片”→把地址写回当前行
    confirmPreview() {
      // 当前行就是上传时记住的 this.currentUploadRow
      if (this.currentUploadRow) {
        this.$set(this.currentUploadRow, 'fileId', this.previewFileId);
        this.$message.success('已确认图片');
      }
      this.closePreview();
    },

    // 如果只想看不想用，点取消即可
    cancelPreview() {
      this.closePreview();
    },
    // ★★★ 修改 1：数据初始化方法，负责将扁平数据转为嵌套结构 ★★★
    initSampleItem(item) {
      // 1. 获取现有的 testItem，如果没有则初始化为空数组
      let currentTestItems = item.testItem || [];

      // 2. 【核心修复】如果 testItem 为空（说明是后端返回的扁平数据），则手动构造它
      if (currentTestItems.length === 0) {
        currentTestItems.push({
          // --- 数据回显搬运 ---
          itemName: item.itemName || '近红外检测', // 如果后端没返itemName，给个默认值
          average: item.average,                    // ★ 关键：回显结果
          remark: item.remark,                      // ★ 关键：回显备注

          // --- ID 回显 (用于后续修改/保存) ---
          entrustOrderItemId: item.entrustOrderItemId,
          entrustOrderSampleId: item.entrustOrderSampleId,
          opJczxFeedResultInfoId: item.opJczxFeedResultInfoId, // 结果详情ID

          // --- 其他可能需要的字段 (防止报错) ---
          x: item.x,
          compareX: item.compareX,
          isReset: item.isReset || '0'
        });
      }

      // 3. 返回格式化后的对象
      return {
        ...item,
        // 确保外层也有这些基本字段
        sampleNo: item.sampleNo || '',
        name: item.sampleName || item.name || '',
        isReset: item.isReset || '0',

        // ★ 将构造好的数组赋值回去
        testItem: currentTestItems
      };
    },
    // 打开上传弹窗
    openUploadDialog(row) {
      console.log(row, '11111111111')
      this.currentUploadRow = row;
      this.uploadSampleName = row.name;

      // ★★★ 打印看看实际的 fileUrl ★★★
      console.log('row.fileId:', row.fileId);
      console.log('row.fileUrl:', row.fileUrl);
      downloadFile(row.fileId).then(blob => {

        // ★★★ 关键：根据已保存的 fileUrl 恢复显示 ★★★
        if (row.fileUrl) {
          this.uploadFileList = [{
            name: row.fileName || '已上传图片',
            url: URL.createObjectURL(blob)
          }];
        } else {
          this.uploadFileList = [];
        }

        // ★★★ 等数据设置完成后再打开弹窗 ★★★
        this.$nextTick(() => {
          this.uploadVisible = true;
        });
      }).catch(err => {
        console.error(err);
        this.$message.error('图片加载失败');
      });


    },
    // 关闭弹窗
    closeUpload() {
      // ★★★ 不需要 clearFiles，数据已保存在 row 中 ★★★
      this.currentUploadRow = null;
      this.uploadSampleName = '';
      this.uploadFileList = [];
      this.uploadVisible = false;
    },
    handleRemove(file, fileList) {
      console.log('删除文件:', file);
      this.uploadFileList = [];

      // ★★★ 清空该行保存的文件信息 ★★★
      if (this.currentUploadRow) {
        this.$set(this.currentUploadRow, 'fileId', '');
        this.$set(this.currentUploadRow, 'fileUrl', '');
        this.$set(this.currentUploadRow, 'fileName', '');
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功
    handleUploadSuccess(res, file) {
      console.log('上传成功返回数据：', res);
      if (res.code == 200 && res.data) {
        const fileId = res.data.fileId || res.data;
        const fileUrl = res.data.fileUrl;  // ★ 取后端返回的 fileUrl

        // ★★★ 同时保存 fileId 和 fileUrl ★★★
        this.$set(this.currentUploadRow, 'fileId', fileId);
        this.$set(this.currentUploadRow, 'fileUrl', fileUrl);
        // this.$set(this.currentUploadRow, 'fileName', file.name);
        // ★★★ 打印确认是否保存成功 ★★★
        console.log('保存后 currentUploadRow:', this.currentUploadRow);

        this.$message.success(`【${this.uploadSampleName}】上传成功`);

      } else {
        this.$message.error(res.msg || '上传失败');
      }

    },
    // 上传失败
    handleUploadError(err) {
      console.error('上传失败：', err);
      this.$message.error('上传失败，请重试');
    },
    // 上传前校验（可选）
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('只能上传 JPG/PNG 图片');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB');
        return false;
      }
      return true;
    },
    dqID() {
      usersign().then(res => {
        if (!this.isRev) {
          console.log('检测人')
          this.testUserSignature = res.data.sign;
          downloadFile(this.testUserSignature).then((res) => {
            this.signTypes.检测人 = URL.createObjectURL(res);
          })
        }
      });
    },
    dqIDHD() {
      usersign().then(res => {
        if (this.Details.status == '2' && !this.isJCRY) {
          console.log('核对人')
          this.checkUserSignature = res.data.sign;
          downloadFile(this.checkUserSignature).then((res) => {
            this.signTypes.核对人 = URL.createObjectURL(res);
          })
        }
      });
    },
    csfhy() {
      console.log('111111')
      this.csfhyMixinHandler();
    },
    loadCsfhyDataAndCalculate() {
      console.log('2222222222222')
      this.loadCsfhyDataAndCalculateMixin();
    },
    calculateFreshSampleForItem(item) {
      this.calculateFreshSampleForItemMixin(item);
    },
    calculateSingleFreshSample(item, csfValue) {
      this.calculateSingleFreshSampleMixin(item, csfValue);
    },
    calculateFreshSample(csfhyData) {
      this.calculateFreshSampleMixin(csfhyData);
    },
    /* 通用：收集所有空字段 */
    validateEmpty() {
      const empty = [];

      /* ---- 全局字段 ---- */
      if (!this.Details.clqglzl) empty.push('处理前滤袋质量');
      if (!this.Details.clhglzl) empty.push('处理后滤袋质量');

      /* ---- 逐行样品字段 ---- */
      (this.Details.infoList || []).forEach((row, idx) => {
        if (!row.m1) empty.push(`第${idx + 1}行滤袋质量 m₁`);
        if (!row.m) empty.push(`第${idx + 1}行试样质量 m`);
        if (!row.m2) empty.push(`第${idx + 1}行袋+残渣总质量 m₂`);
        if (!row.compareM1) empty.push(`第${idx + 1}行对比滤袋质量 m₁`);
        if (!row.compareM) empty.push(`第${idx + 1}行对比试样质量 m`);
        if (!row.compareM2) empty.push(`第${idx + 1}行对比袋+残渣总质量 m₂`);
      });

      return empty; // 返回空字段数组
    },
    /** 通用平板检测 */
    isPADDevice() {
      const userAgent = navigator.userAgent.toLowerCase();
      const isiPad = /ipad/.test(userAgent);
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);
      const isWindowsTablet = /windows/.test(userAgent) && /touch/.test(userAgent);

      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const isTabletSize = (screenWidth >= 768 && screenWidth <= 1024) ||
        (screenHeight >= 768 && screenHeight <= 1024);

      return isiPad || isAndroidTablet || isWindowsTablet || isTabletSize;
    },
    /** 专门检测华为平板 */
    isHuaweiPad() {
      const userAgent = navigator.userAgent.toLowerCase();

      // 华为平板特征检测
      const isHuawei = /huawei/.test(userAgent) || /honor/.test(userAgent);
      const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

      // 屏幕尺寸检测（华为平板典型尺寸）
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const isHuaweiTabletSize = (screenWidth >= 768 && screenWidth <= 2560) ||
        (screenHeight >= 768 && screenHeight <= 1600);

      // 华为平板特有特征
      const hasEMUI = /emui/.test(userAgent);
      const isHuaweiPad = (isHuawei && isAndroidTablet) ||
        (isHuawei && isHuaweiTabletSize) ||
        (hasEMUI && isAndroidTablet);

      return isHuaweiPad;
    },
    isPadPc() {
      // 使用若依的设备检测
      const device = this.$store.state.app.device;
      // 检测是否为华为平板
      if (this.isHuaweiPad()) {
        console.log('华为')
        this.isPad = true
      } else if (this.isPADDevice()) {
        console.log('Pad')
        this.isPad = true
      } else {
        console.log('PC')
        this.isPad = false
      }
    },
    HDPada() {
      this.$router.push('JHYTaskPad')
    },
    HDPadb() {
      this.$router.push('JHYResultPad')
    },
    initTimes() {
      // 试剂批号
      const sjhphTk = (this.Details.sjhph || '').split(',');
      this.sjhphOne = sjhphTk[0] || '';
      this.sjhphTwo = sjhphTk[1] || '';
      this.sjhphThree = sjhphTk[2] || '';
      this.sjhphFour = sjhphTk[3] || '';
      // 仪器
      const Name = (this.Details.instrumentName || '').split(',');
      this.instrumentNameOne = Name[0] || '';
      this.instrumentNameTwo = Name[1] || '';
      // 仪器编号
      const No = (this.Details.instrumentNo || '').split(',');
      this.instrumentNoOne = No[0] || '';
      this.instrumentNoTwo = No[1] || '';
      // 检测地点
      const Location = (this.Details.testLocation || '').split(',');
      this.testLocationOne = Location[0] || '';
      this.testLocationTwo = Location[1] || '';
    },
    updateDetails() {
      // this.Details.xxFirstTime = `${this.oneBeforeTime},${this.oneAfterTime}`;
      // this.Details.xxFirstTime = `${this.twoBeforeTime},${this.twoAfterTime}`;
      this.Details.sjhph = `${this.sjhphOne},${this.sjhphTwo},${this.sjhphThree},${this.sjhphFour}`;
      this.Details.instrumentName = `${this.instrumentNameOne},${this.instrumentNameTwo}`;
      this.Details.instrumentNo = `${this.instrumentNoOne},${this.instrumentNoTwo}`;
      this.Details.testLocation = `${this.testLocationOne},${this.testLocationTwo}`;
    },
    // *** 逻辑修改：onNumberInput 更新 ***
    onNumberInput(val, row, key) {
      // 1. 去掉非法字符（保留数字、负号、小数点）
      let cleaned = val.replace(/[^-0-9.]/g, '');

      // 2. 负号只能出现在最前面
      cleaned = cleaned.replace(/(?!^)-/g, '');

      // 3. 多个小数点只保留第一个
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }

      // 4. 禁止以小数点开头，强制补 0
      if (cleaned.startsWith('.')) {
        cleaned = '0' + cleaned;
      }

      // 5. 禁止以负号+小数点开头的输入，如 "-."
      if (cleaned.startsWith('-.')) {
        cleaned = '-0.';
      }

      // *** 逻辑修改：全局字段需要特殊处理 ***
      if (key === 'clqglzl' || key === 'clhglzl') {
        this.$set(this.Details, key, cleaned);
      } else {
        row[key] = cleaned;
      }

      this.$nextTick(() => {
        // *** 逻辑修改：如果修改的是全局 C1 因子, 必须更新所有行 ***
        if (key === 'clqglzl' || key === 'clhglzl') {
          if (this.Details.infoList && this.Details.infoList.length) {
            this.Details.infoList.forEach(item => {
              this.updateCompareValues(item);
            });
          }
        } else {
          this.updateCompareValues(row);
        }
      });
    },
    // 计算X值的方法
    computex(item) {
      const c1Raw = this.computeC1();
      if (c1Raw === '' || c1Raw === null) return ''; // 如果C1没算出来，先不计算
      const C1 = new Decimal(c1Raw);
      // 检查必需的值是否都已输入
      const requiredValues = [item.m1, item.m, item.m2];
      if (!this.hasRequiredValues(requiredValues)) {
        this.$set(item, 'x', ''); // *** 逻辑修改：确保清空 ***
        return '';
      }

      try {
        const m2 = new Decimal(item.m2);
        const m1 = new Decimal(item.m1);
        const m = new Decimal(item.m);

        // 检查分母是否为0
        if (m.equals(0)) {
          this.$set(item, 'x', '0'); // *** 逻辑修改：确保赋值 ***
          return '0';
        }
        const numerator = m1.times(C1)
        const numerator1 = m2.minus(numerator)
        const numerator2 = numerator1.dividedBy(m);
        const result = numerator2.times(100);

        const formattedResult = this.formatPrecision(result);
        this.$set(item, 'x', formattedResult); // *** 逻辑修改：确保保存 ***
        return formattedResult;
      } catch (error) {
        console.error('计算X值错误:', error);
        this.$set(item, 'x', '');
        return '';
      }
    },
    // 计算对比X值的方法
    computeCompareX(item) {
      const c1Raw = this.computeC1();
      if (c1Raw === '' || c1Raw === null) return ''; // 如果C1没算出来，先不计算
      const C1 = new Decimal(c1Raw);
      // 检查必需的值是否都已输入
      const requiredValues = [item.compareM1, item.compareM, item.compareM2];
      if (!this.hasRequiredValues(requiredValues)) {
        this.$set(item, 'compareX', ''); // *** 逻辑修改：确保清空 ***
        return '';
      }

      try {
        const m2 = new Decimal(item.compareM2);
        const m1 = new Decimal(item.compareM1);
        const m = new Decimal(item.compareM);

        // 检查分母是否为0
        if (m.equals(0)) {
          this.$set(item, 'compareX', '0'); // *** 逻辑修改：确保赋值 ***
          return '0';
        }

        const numerator = m1.times(C1)
        const numerator1 = m2.minus(numerator)
        const numerator2 = numerator1.dividedBy(m);
        const result = numerator2.times(100);

        const formattedResult = this.formatPrecision(result);
        this.$set(item, 'compareX', formattedResult); // *** 逻辑修改：确保保存 ***
        return formattedResult;
      } catch (error) {
        console.error('计算X值错误:', error);
        this.$set(item, 'compareX', '');
        return '';
      }
    },
    computeC1(item) {
      // 检查必需的值是否都已输入
      const requiredValues = [this.Details.clqglzl, this.Details.clhglzl,];
      if (!this.hasRequiredValues(requiredValues)) {
        return '';
      }
      try {
        const q = new Decimal(this.Details.clqglzl);
        const h = new Decimal(this.Details.clhglzl);


        // 检查分母是否为0
        if (q.equals(0)) {
          return '0';
        }
        return h.dividedBy(q).toDecimalPlaces(4).toString();

        // const result = h.dividedBy(q);

        // return this.formatPrecision(result.toFixed(4));
      } catch (error) {
        console.error('计算X值错误:', error);
        return '';
      }
    },
    // 精度格式化方法
    formatPrecision(value) {
      if (value === null || value === undefined || value === '') {
        return '';
      }

      let num = new Decimal(value);

      // 优先使用小数位，其次使用有效数字位
      if (this.Details.decimalPlaces) {
        const decimalPlaces = parseInt(this.Details.decimalPlaces);
        return num.toDecimalPlaces(decimalPlaces).toString();
      } else if (this.Details.significantDigits) {
        const significantDigits = parseInt(this.Details.significantDigits);
        return num.toSignificantDigits(significantDigits).toString();
      } else {
        // 默认保留2位小数
        return num.toDecimalPlaces(2).toString();
      }
    },
    // 检查是否所有必需的值都已输入
    hasRequiredValues(values) {
      return values.every(val =>
        val !== null && val !== undefined && val !== '' && !isNaN(val)
      );
    },
    // 检测样品分页大小变化
    handleTestItemSizeChange(val) {
      this.testItemQuery.pageSize = val;
      this.getTestItemList();
    },
    // 检测样品当前页变化
    handleTestItemCurrentChange(val) {
      this.testItemQuery.pageNum = val;
      this.getTestItemList();
    },
    getTestItemList() {
      this.testItemQuery.testMethod = '2';
      this.testItemQuery.queryCsf = '0'; // 化学法
      this.testItemQuery.itemId = this.Details.itemId
      this.testItemQuery.entrustOrderType = '1'
      listTask(this.testItemQuery).then(res => {
        this.testItemList = res.rows
        this.testItemTotal = res.total;
        // 数据加载后，自动勾选已存在的样品 ---
        this.$nextTick(() => {
          if (this.$refs.testItemTable && this.testItemList) {
            this.testItemList.forEach(row => {
              // 检查当前行是否已在详情列表中
              const isExist = this.Details.infoList.some(item => item.sampleNo === row.sampleNo);
              if (isExist) {
                // toggleRowSelection(row, selected): 
                // row: 当前行数据, true: 选中状态
                this.$refs.testItemTable.toggleRowSelection(row, true);
              }
            });
          }
        });
      });
    },
    // 处理检测样品选择变化
    handleTestItemSelectionChange(selection) {
      this.selectedTestItems = selection;
    },
    // 【新增】判断行是否可选（置灰逻辑）
    // 返回 true 表示可选，返回 false 表示不可选（置灰）
    checkSelectable(row) {
      // 如果当前样品编号已存在于化验单详情列表中，则不可选（置灰）
      // 使用 some 方法查找是否存在匹配的 sampleNo
      const isExist = this.Details.infoList.some(item => item.sampleNo === row.sampleNo);
      return !isExist;
    },
    confirmTestItems() {
      this.selectedTestItems.forEach(item => {
        // ---再次校验，只添加新样品 ---
        const isExist = this.Details.infoList.some(existing => existing.sampleNo === item.sampleNo);
        // 只有当样品不存在时，才推入数组
        if (!isExist) {
          const newSample = {
            "entrustOrderItemId": item.entrustOrderItemId,
            "entrustOrderSampleId": item.entrustOrderSampleId,
            "sampleNo": item.sampleNo,
            "sampleName": item.sampleName,
          };
          this.Details.infoList.push(newSample);
        }
      });
      this.testItemDialogVisible = false;
    },
    // 增加样品
    addSample() {
      this.getTestItemList()
      this.testItemDialogVisible = true
    },
    // 删除样品
    deleteSample(index) {
      this.$confirm('确定要删除这个样品吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Details.infoList.splice(index, 1);
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    updateCompareValues(item) {
      item.compareX = this.computeCompareX(item);
      item.x = this.computex(item);

      this.$nextTick(() => {
        const x = item.x;
        const compareX = item.compareX;

        if (x !== '' && compareX !== '' && x !== null && compareX !== null) {
          const xVal = new Decimal(x);
          const compareXVal = new Decimal(compareX);

          // 1. 计算平均值
          const avg = xVal.plus(compareXVal).dividedBy(2);

          // 2. 计算绝对差值
          const absoluteDiff = Decimal.abs(xVal.minus(compareXVal));

          // 3. 根据第一行 ADF 含量(x) 判断使用哪种偏差
          const adfContent = parseFloat(x);

          let diffValue;
          let diffType;
          let allowedValue;

          if (adfContent < 5) {
            // ADF 含量 < 5% 时，使用绝对差值，允许 ≤1%
            diffValue = absoluteDiff;
            diffType = 'absolute';  // 绝对差值
            allowedValue = 1;
          } else if (adfContent >= 5 && adfContent <= 10) {
            // ADF 含量 5%~10% 时，使用相对相差，允许 ≤10%
            diffValue = avg.equals(0)
              ? new Decimal(0)
              : absoluteDiff.dividedBy(avg).times(100);
            diffType = 'relative';  // 相对相差
            allowedValue = 10;
          } else {
            // ADF 含量 > 10% 时，使用相对相差，允许 ≤6%
            diffValue = avg.equals(0)
              ? new Decimal(0)
              : absoluteDiff.dividedBy(avg).times(100);
            diffType = 'relative';  // 相对相差
            allowedValue = 6;
          }

          // 4. 设置结果
          // this.$set(item, 'average', this.formatPrecision(avg));
          this.$set(item, 'average', avg.toDecimalPlaces(1).toString());
          this.$set(item, 'absoluteDifference', diffValue.toFixed(2));
          this.$set(item, 'diffType', diffType);           // 可选：保存偏差类型
          this.$set(item, 'allowedValue', allowedValue);   // 可选：保存允许值

          // 5. 判断是否超标（可选）
          const isExceeded = diffValue.greaterThan(allowedValue);
          this.$set(item, 'isExceeded', isExceeded);

          // 6. 负数校验
          const average_val = parseFloat(item.average);
          if (xVal.lessThan(0) || compareXVal.lessThan(0) || (!isNaN(average_val) && average_val < 0)) {
            const now = Date.now();
            if (now - this.lastWarningTime > this.warningThrottleMs) {
              this.$message.warning('计算结果为负数，请检查输入数据是否正确');
              this.lastWarningTime = now;
            }
          }

          // 7. 计算鲜样含量
          this.calculateFreshSampleForItem(item);

        } else {
          this.$set(item, 'average', '');
          this.$set(item, 'absoluteDifference', '');
          this.$set(item, 'diffType', '');
          this.$set(item, 'isExceeded', false);
          this.calculateFreshSampleForItem(item);
        }
      });

    },
    qzclick(type) {
      this.currentSignType = type
      this.videoif = true
    },
    onSignatureDone({ type, data, fileId, close }) {
      this.signTypes[type] = data       // 根据类型写入对应变量
      this.videoif = close
      // 根据签名类型保存fileId
      if (fileId) {
        if (type === '检测人') {
          this.testUserSignature = fileId;
          console.log('检测人签名文件ID:', fileId);
        } else if (type === '核对人') {
          this.checkUserSignature = fileId;
          console.log('核对人签名文件ID:', fileId);
        }
      }
    },
    // 关闭
    closeCanvas(val) {
      this.videoif = val
    },
    // 保存
    savecanva(val) {
      var imgUrl = ""
      var that = this
      console.log(val.indexOf("http://"))
      if (val.indexOf("data:image/png;base64,") == 0) {
        var file = this.base.getFileFromBase64(val) // 得到File对象
        console.log(file)
        imgUrl = window.webkitURL.createObjectURL(file) || window.URL.createObjectURL(file) // imgUrl图片网络路径	
      } else {
        imgUrl = val
      }
      const data = {
        path: imgUrl
      }
    },

    // *** 逻辑修改：新增 saveForm ***
    saveForm() {
      // ★★★ 调试：打印当前数据 ★★★
      console.log('========== 保存前数据检查 ==========');
      console.log('Details:', JSON.parse(JSON.stringify(this.Details)));
      console.log('infoList:', JSON.parse(JSON.stringify(this.Details.infoList)));

      this.Details.infoList.forEach((item, index) => {
        console.log(`样品${index + 1}:`, {
          sampleNo: item.sampleNo,
          average: item.average,
          remark: item.remark,
        });
      });
      console.log('=====================================');


      this.submitForm(true); // true = prevent navigation
    },

    // *** 逻辑修改：submitForm 改造 ***
    async submitForm2(preventNavigation = false) {
      console.log('========== 提交前数据检查 ==========');
      console.log('Details:', JSON.parse(JSON.stringify(this.Details)));
      console.log('infoList:', JSON.parse(JSON.stringify(this.Details.infoList)));
      // 1. 深拷贝 Details，作为基础数据
      const submitData = JSON.parse(JSON.stringify(this.Details));

      // 2. 补充签名
      submitData.testUserSignature = this.testUserSignature;
      submitData.checkUserSignature = this.checkUserSignature;
      submitData.modelName = '近红外';
      // 3. 【核心修改】扁平化处理：将 infoList -> testItem 结构拍平
      const flatInfoList = [];

      // 遍历页面上的原始数据 this.Details.infoList (而不是 submitData.infoList，因为我们要重构它)
      if (this.Details.infoList && this.Details.infoList.length > 0) {
        this.Details.infoList.forEach(sample => {
          // 确保有 testItem 数据
          if (sample.testItem && sample.testItem.length > 0) {
            sample.testItem.forEach(item => {
              // 创建一个新对象，合并 样品信息(sample) 和 项目信息(item)
              // 注意：...item 放在后面，确保项目级的字段（如 remark, average）覆盖样品级的同名字段
              const mergedItem = {
                ...sample,
                ...item
              };

              // --- ID 重命名逻辑 ---

              // 1. 处理样品ID: opFeedEntrustOrderSampleId -> entrustOrderSampleId
              if (sample.opFeedEntrustOrderSampleId) {
                mergedItem.entrustOrderSampleId = sample.opFeedEntrustOrderSampleId;
              } else if (sample.feedEntrustOrderSampleId) {
                // 如果已经是新名字，保留
                mergedItem.entrustOrderSampleId = sample.feedEntrustOrderSampleId;
              }

              // 2. 处理项目ID: opFeedEntrustOrderItemId -> entrustOrderItemId
              if (item.opFeedEntrustOrderItemId) {
                mergedItem.entrustOrderItemId = item.opFeedEntrustOrderItemId;
              } else if (item.feedEntrustOrderItemId) {
                // 如果已经是新名字，保留
                mergedItem.entrustOrderItemId = item.feedEntrustOrderItemId;
              }

              // --- 清理不需要的旧字段和嵌套数组 ---
              delete mergedItem.testItem; // 删除嵌套的数组
              delete mergedItem.opFeedEntrustOrderSampleId;
              delete mergedItem.opFeedEntrustOrderItemId;
              delete mergedItem.opFeedEntrustOrderSampleIdList; // 通常这个字段也不需要

              // 将合并好的对象推入新数组
              flatInfoList.push(mergedItem);
            });
          }
        });
      }

      // 4. 将扁平化后的数组赋值给 submitData
      submitData.infoList = flatInfoList;

      console.log('转换后的扁平化提交数据:', submitData);

      // 5. 补充 opJczxFeedResultBaseId (修改时需要)
      if (!submitData.opJczxFeedResultBaseId && this.Details.opJczxFeedResultBaseId) {
        submitData.opJczxFeedResultBaseId = this.Details.opJczxFeedResultBaseId;
      }

      try {
        let result;
        // 6. 根据状态调用新增或修改接口
        if (this.isRec) {
          // 新增逻辑：补充 itemId
          if (this.$route.params.jcList && this.$route.params.jcList[0]) {
            // 假设 IDD 就是 itemId
            this.Details.itemId = this.$route.params.jcList[0].IDD;
            submitData.itemId = this.Details.itemId;
          }
          result = await addjhw(submitData);
        } else if (this.isShow) {
          result = await editJhw(submitData);
        }

        // 7. 处理返回结果
        if (result.code == 200) {
          // 7.1 更新 BaseId
          if (result.data && result.data.opJczxFeedResultBaseId) {
            this.Details.opJczxFeedResultBaseId = result.data.opJczxFeedResultBaseId;
          }

          // 7.2 更新状态
          if (this.isRec) {
            if (!this.Details.status) {
              this.Details.status = '1';
            }
            this.isRec = false;
            this.isShow = true;
          }

          // 7.3 回写 ID 和 状态 (注意：现在后端返回的结构可能也是扁平的，或者你需要根据返回结构调整回写逻辑)
          // 这里假设后端返回的 infoList 顺序与提交顺序一致
          if (result.data && result.data.infoList && result.data.infoList.length > 0) {
            // 由于结构扁平化了，回写逻辑变得复杂。
            // 简单的处理是：如果只做保存，不刷新页面；如果提交，跳转页面。
            // 这里为了保险，只更新 isReset 状态，如果需要精确回写 ID，需要后端返回带有对应标识的数据

            // 简易回写：尝试匹配 sampleNo
            result.data.infoList.forEach(returnedItem => {
              const localSample = this.Details.infoList.find(s => s.sampleNo === returnedItem.sampleNo);
              if (localSample) {
                // 回写复检状态
                this.$set(localSample, 'isReset', returnedItem.isReset || '0');
                // 如果本地也是扁平结构可以直接回写ID，但本地是嵌套结构，所以ID回写比较麻烦，暂略
                // 如果需要回写 opJczxFeedResultInfoId，需要遍历 localSample.testItem
                if (localSample.testItem) {
                  localSample.testItem.forEach(ti => {
                    // 假设返回数据里有 entrustOrderItemId 来匹配
                    if (ti.opFeedEntrustOrderItemId === returnedItem.entrustOrderItemId) {
                      this.$set(localSample, 'opJczxFeedResultInfoId', returnedItem.opJczxFeedResultInfoId);
                    }
                  })
                }
              }
            });
          }

          if (!preventNavigation) {
            this.$message.success(this.isRec ? '已提交成功' : '已修改成功');
            this.$router.push('/jczxFeedResultBasePad');
          } else {
            this.$message.success('保存成功');
          }

          return { success: true, data: result.data };
        } else {
          this.$message.error(result.msg || '保存失败');
          return { success: false, error: result.msg };
        }
      } catch (error) {
        console.error('保存异常:', error);
        this.$message.error('保存失败，系统异常');
        return { success: false, error: error.message };
      }
    },


    // ★★★ 修改 2：提交方法，负责将嵌套结构拍平传给后端 ★★★
    async submitForm(preventNavigation = false) {
      // 1. 深拷贝 Details，作为基础数据
      const submitData = JSON.parse(JSON.stringify(this.Details));

      // 2. 补充签名和固定字段
      submitData.testUserSignature = this.testUserSignature;
      submitData.checkUserSignature = this.checkUserSignature;
      submitData.modelName = '近红外'; // 确保这个字段存在

      // 3. 【核心修改】扁平化处理：将 infoList -> testItem 结构拍平
      const flatInfoList = [];

      // 遍历页面上的原始数据
      if (this.Details.infoList && this.Details.infoList.length > 0) {
        this.Details.infoList.forEach(sample => {
          // 确保有 testItem 数据
          if (sample.testItem && sample.testItem.length > 0) {
            sample.testItem.forEach(item => {
              // 创建一个新对象，合并 样品信息(sample) 和 项目信息(item)
              // 注意：...item 放在后面，确保项目级的字段（如 average）覆盖样品级的同名字段
              const mergedItem = {
                ...sample,
                ...item
              };

              // --- ID 重命名逻辑 (opFeed... -> entrust...) ---
              if (sample.opFeedEntrustOrderSampleId) {
                mergedItem.entrustOrderSampleId = sample.opFeedEntrustOrderSampleId;
              } else if (sample.feedEntrustOrderSampleId) {
                mergedItem.entrustOrderSampleId = sample.feedEntrustOrderSampleId;
              }

              if (item.opFeedEntrustOrderItemId) {
                mergedItem.entrustOrderItemId = item.opFeedEntrustOrderItemId;
              } else if (item.feedEntrustOrderItemId) {
                mergedItem.entrustOrderItemId = item.feedEntrustOrderItemId;
              }

              // --- 清理不需要的嵌套数组和旧字段 ---
              delete mergedItem.testItem;
              delete mergedItem.opFeedEntrustOrderSampleId;
              delete mergedItem.opFeedEntrustOrderItemId;
              delete mergedItem.opFeedEntrustOrderSampleIdList;

              flatInfoList.push(mergedItem);
            });
          }
        });
      }

      // 4. 将扁平化后的数组赋值给 submitData
      // submitData.infoList = flatInfoList;

      // console.log('转换后的扁平化提交数据:', submitData);

      // 5. 补充 opJczxFeedResultBaseId
      if (!submitData.opJczxFeedResultBaseId && this.Details.opJczxFeedResultBaseId) {
        submitData.opJczxFeedResultBaseId = this.Details.opJczxFeedResultBaseId;
      }

      console.log('提交数据:', submitData);
      try {
        let result;
        // 6. 根据状态调用接口
        if (this.isRec) {
          // 新增时补充 itemId
          if (this.$route.params.jcList && this.$route.params.jcList[0]) {
            this.Details.itemId = this.$route.params.jcList[0].IDD;
            submitData.itemId = this.Details.itemId;
          }
          result = await addjhw(submitData);
        } else if (this.isShow) {
          result = await editJhw(submitData);
        }

        // 7. 处理返回结果
        if (result.code == 200) {
          if (result.data && result.data.opJczxFeedResultBaseId) {
            this.Details.opJczxFeedResultBaseId = result.data.opJczxFeedResultBaseId;
          }

          if (this.isRec) {
            if (!this.Details.status) {
              this.Details.status = '1';
            }
            this.isRec = false;
            this.isShow = true;
          }

          // 简单回写状态
          if (result.data && result.data.infoList) {
            result.data.infoList.forEach(returnedItem => {
              console.log(returnedItem, '11111111111111111111');
              const localSample = this.Details.infoList.find(s => s.sampleNo === returnedItem.sampleNo);
              if (localSample) {
                this.$set(localSample, 'isReset', returnedItem.isReset || '0');
                // 尝试回写 ID
                if (localSample.testItem && localSample.testItem[0]) {
                  this.$set(localSample.testItem[0], 'opJczxFeedResultInfoId', returnedItem.opJczxFeedResultInfoId);
                }
              }
            });
          }

          if (!preventNavigation) {
            this.$message.success(this.isRec ? '已提交成功' : '已修改成功');
            this.$router.push('/JHYResultPad');
          } else {
            this.$message.success('保存成功');
          }
          return { success: true, data: result.data };
        } else {
          this.$message.error(result.msg || '保存失败');
          return { success: false, error: result.msg };
        }
      } catch (error) {
        console.error('保存异常:', error);
        this.$message.error('保存失败，系统异常');
        return { success: false, error: error.message };
      }
    },
    // *** 逻辑修改：JDForm -> submitCheck ***
    async submitCheck() {
      const saveResult = await this.submitForm(true);
      if (!saveResult || !saveResult.success) {
        this.$message.error('数据保存失败，无法校对。请检查填写内容。');
        return;
      }
      if (!this.checkUserSignature) {
        this.$message.error('请先进行核对人签字');
        return;
      }
      if (!this.Details.opJczxFeedResultBaseId) {
        this.$message.error('缺少必要参数');
        return;
      }

      try {
        const submitData = {
          opJczxFeedResultBaseId: this.Details.opJczxFeedResultBaseId,
          checkUserSignature: this.checkUserSignature
        };
        const res = await saveCheck(submitData); // *** 逻辑修改：调用 saveCheck ***
        if (res.code === 200) {
          this.$message.success('校对成功');
          this.$router.push(`/JHYResultPad?tab=2`);
        } else {
          this.$message.error(res.msg || '校对失败');
        }
      } catch (error) {
        this.$message.error('校对失败');
      }
    },
    // 检查是否有样品已申请复检
    hasRetestSample() {
      const list = this.Details.infoList || [];
      return list.length > 0 && list.every(item => item.isReset === '1');
    },
    // *** 逻辑修改：新增 submitTest 方法 ***
    async submitTest() {
      //const empty = this.validateEmpty();
      // if (empty.length) {
      //   this.$message.error(`请完善以下字段再保存：${empty.join('、')}`);
      //   return { success: false, error: '数据未填完整' }; // 返回失败
      // }
      if (this.hasRetestSample()) {
        this.$message.error('已全部申请复检，化验单中不存在可提交数据。');
        return;
      }
      if (!this.testUserSignature) {
        this.$message.error('请先进行检测人签字后再提交');
        return;
      }
      const saveResult = await this.submitForm(true);
      if (!saveResult || !saveResult.success) {
        this.$message.error('数据保存失败，无法提交。请检查填写内容。');
        return;
      }
      const baseId = this.Details.opJczxFeedResultBaseId;
      if (!baseId) {
        this.$message.error('保存成功但未获取到任务ID，无法提交');
        return;
      }
      try {
        const res = await testSubmit({ opJczxFeedResultBaseId: baseId });
        if (res.code === 200) {
          this.$message.success('提交成功');
          this.$router.push('/JHYResultPad');
        } else {
          this.$message.error(res.msg || '提交失败');
        }
      } catch (error) {
        console.error('提交失败:', error);
        this.$message.error('提交接口调用失败');
      }
    },

    // *** 逻辑修改：新增 retestSample 方法 ***
    retestSample(index) {
      // 1. 获取当前行的数据
      const item = this.Details.infoList[index];
      console.log(item);
      const infoId = item.entrustOrderSampleId;

      // 2. 检查是否有ID (只有已保存的才能复检)
      if (!infoId) {
        this.$message.warning('此样品尚未保存，无法复检。');
        return;
      }

      // 3. 弹窗确认
      this.$confirm('确定要复检此样品吗？该样品化验数据将作废。', '复检确认', {
        confirmButtonText: '确定复检',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 4. 调用后端 jhwRetest 接口
        jhwRetest([infoId]).then(response => {
          if (response.code === 200) {
            this.$message.success('申请复检成功，请前往检测任务列表查看该样品');
            this.$set(this.Details.infoList[index], 'isReset', '1');
          } else {
            this.$message.error(response.msg || '申请复检失败');
          }
        }).catch(error => {
          console.error("复检接口失败:", error);
          this.$message.error('复检请求失败');
        });

      }).catch(() => {
        this.$message.info('已取消复检');
      });
    },
    // 【新增】整单退回
    handleBack() {
      this.$confirm('确定要退回当前化验单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.Details.opJczxFeedResultBaseId) {
          this.$message.error('未获取到任务ID');
          return;
        }
        // 调用接口，传参 opJczxFeedResultBaseId
        backToSubmit({ opJczxFeedResultBaseId: this.Details.opJczxFeedResultBaseId }).then(res => {
          if (res.code === 200) {
            this.$message.success('退回成功');
            // 退回成功后返回列表页
            this.$router.push('/JHYResultPad');
          } else {
            this.$message.error(res.msg || '退回失败');
          }
        }).catch(err => {
          console.error(err);
          this.$message.error('调用退回接口失败');
        });
      }).catch(() => {
        // 取消操作
      });
    },
  },
};
</script>
<style scoped src="@/assets/styles/tablescroll.css"></style>
<style scoped lang="scss">
.app-container {
  position: relative;
  //min-height: 100vh;

}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  padding: 16px 20px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e8e8e8;
  z-index: 1000;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.fixed-bottom button {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.fixed-bottom button:first-child {
  background: #1890ff;
  color: white;
}

.fixed-bottom button:last-child {
  background: #f5f5f5;
  color: #666;
  border: 1px solid #d9d9d9;
}

.stickytable {
  overflow-x: auto;
  width: 100%;
}

.sticky-table {
  min-width: 1000px;
  /* 根据内容设置最小宽度 */
  width: 100%;
}

.sticky-table th {
  background: #fff;
  line-height: 23px;
}

.sticky-table th:last-child {
  background: #fff;
  right: auto;
}



.sticky-table td {
  min-width: 50px;
  line-height: 23px;
  color: #606266;
}

.sticky-table td:first-child {
  position: relative;
}

.sticky-table td:last-child {
  position: relative;
  background: transparent !important;

}

/* 确保日期选择器不溢出 */
.el-date-editor.el-input {
  width: 100% !important;
  max-width: 100%;
}

table {
  table-layout: fixed;
  width: 100%;
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .el-date-editor.el-input {
    min-width: 100px !important;
  }

  td {
    padding: 2px !important;
    font-size: 12px;
  }
}

.tembum {
  width: 100% !important;
  max-width: 45%;
}

.HgTime {
  width: 100% !important;
  max-width: 60%;
}

.custom-padding ::v-deep {
  .el-input__inner {
    padding-right: 0;
    padding-left: 24px;
    width: calc(100% - 1px);
  }

  .el-input__suffix {
    display: none !important;
  }
}

table td,
table th {
  border-right: 1px solid #dcdfe6;
}

.formula-container {
  white-space: normal;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  /* *** 逻辑修正：确保公式左对齐 *** */
}

.math-formula {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  font-family: 'Cambria Math', 'Times New Roman', serif;
}

.math-fraction {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  margin: 0 6px;
}

.math-numerator,
.math-denominator {
  padding: 0 15px;
  /* 增加内边距 */
  font-size: 13px;
  line-height: 1.3;
  font-style: italic;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  letter-spacing: 0.5px;
  /* 增加字母间距 */
}

.math-fraction-line {
  width: 100%;
  height: 1.2px;
  background: #333;
  margin: 3px 0;
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.1);
}

/* 修复下标重叠的关键 */
.math-sub {
  font-size: 0.65em;
  vertical-align: sub;
  position: relative;
  bottom: -0.1em;
  display: inline-block;
  margin: 0 -0.05em;
  /* 微调边距 */
  line-height: 1;
}

/* 乘号样式 - 确保明显区分 */
.math-times {
  font-weight: 900;
  margin: 0 5px;
  font-size: 15px;
  font-family: 'Times New Roman', serif;
  color: #333;
}

/* 变量X加粗 */
.math-var {
  font-weight: bold;
  font-style: italic;
  margin: 0 2px;
  color: #333;
}

/* 为括号添加额外间距 */
.math-numerator,
.math-denominator {
  word-spacing: 0.3em;
  /* 增加单词间距 */
}

/* 确保括号有足够空间 */
.math-numerator::before,
.math-numerator::after {
  content: '';
  display: inline-block;
  width: 0.2em;
}


/* 左括号右边距 */
.math-bracket-left {
  margin-right: 0.2em;
  display: inline-block;
}

/* 右括号左边距 */
.math-bracket-right {
  margin-left: 0.3em;
  display: inline-block;
}

/* 分数容器 */
.frac {
  display: inline-flex;
  /* 让子元素纵向排列 */
  flex-direction: column;
  text-align: center;
  line-height: 1.2;
  vertical-align: middle;
  /* 与左右文字居中对齐 */
  font-size: inherit;
  /* 想多大就改这里 */
}

/* 分子 */
.num {
  border-bottom: 1px solid #000;
  /* 分数线 */
  padding: 0 4px;
  /* 左右留点空 */
}

/* 分母 */
.den {
  padding: 0 4px;
}

/* 第一个样品块不加上边框 */
.first-sample>td {
  border-top: none !important;
}

/* 其余样品块加粗上边框 */
.sample-split:not(.first-sample)>td {
  border-top: 1px solid #606266 !important;
}

/* 图片预览容器 */
.preview-box {
  width: 100%;
  height: 60vh;
  /* 设定视窗高度，根据需要调整 */
  background-color: #f2f2f2;
  /* 灰色背景，方便看清边界 */
  overflow: hidden;
  /* ★★★ 关键：超出部分隐藏 ★★★ */
  display: flex;
  /* Flex布局让图片居中 */
  justify-content: center;
  align-items: center;
  position: relative;
  /* 为了定位缩放比例文字 */
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}

/* 图片本体 */
.preview-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  /* 保持图片比例 */
  cursor: grab;
  /* 提示可操作 */
}

/* 缩放比例文字 */
.scale-info {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
}
</style>