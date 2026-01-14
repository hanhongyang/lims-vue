<template>
  <div class="app-container">
    <div class="aboustform">
      <div class="form-data-header" style="margin-bottom: 0; padding: 0">
        <div class="form-data-header-title" @click="goBack">
          <i class="el-icon-back"></i>
          返回
          <span></span>
        </div>
        <div class="form-data-header-content"></div>
        <div class="form-data-header-tools">
          <el-button @click="handlePass" size="mini" type="success" :loading="saving">
            通过
          </el-button>
          <el-button @click="handleFail" size="mini" type="danger" :loading="saving">
            不通过
          </el-button>
        </div>
      </div>
    </div>

    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" label-width="120px">
        <el-card class="test-config-card">
          <div slot="header" class="clearfix">
            <dict-tag :options="dict.type.blood_task_item_type" :value="form.bloodTaskItemType" />
            <el-tag v-if="tableData.length" type="info" style="float: right;">
              共 {{ tableData.length }} 条记录
            </el-tag>
          </div>
          <el-table :data="tableData" border stripe style="width: 100%" v-loading="loading"
            :row-class-name="tableRowClassName">

            <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label"
              :width="column.width" align="center">
              <template slot-scope="scope">
                <el-input v-if="column.isRemark" v-model="sampleExamineNote[scope.row.sampleNo]" placeholder="请输入异议"
                  @input="$set(sampleExamineNote, scope.row.sampleNo, $event); $forceUpdate()" />

                <span v-else-if="column.isResult" :class="getResultClass(scope.row[column.prop])">
                  {{ scope.row[column.prop] }}
                </span>

                <span v-else>
                  {{ scope.row[column.prop] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form>
    </div>

  </div>
</template>

<script>
// 导入 router
import router from '@/router';
import { getBloodBaseByResultNo, examineBloodResultBase, saveBloodResultInfoList } from "@/api/CentralLaboratory/sampleTest";
// 移除了未使用的 import (previewExcel, downloadFile)

export default {
  name: "bloodResultInfo",
  dicts: ['blood_result_status', 'blood_task_item_type'],
  data() {
    return {
      form: {
        bloodTaskItemType: '', // 项目
        opJczxBloodResultInfoList: [], // 存储检测项目数据
      },
      originalData: [],
      tableData: [], // 1. 补充 el-table 的数据源
      loading: false, // 表格loading状态
      saving: false, // 保存按钮loading状态
      sampleExamineNote: {},

      // 2. 补充 动态列配置
      itemConfigs: {
        '0': [
          { prop: 'aypxj', label: 'A型口蹄疫样品效价' },
          { prop: 'atestResult', label: 'A型口蹄疫结果判定' },
          { prop: 'oypxj', label: 'O型口蹄疫样品效价' },
          { prop: 'otestResult', label: 'O型口蹄疫结果判定' },
        ], // 补充其他项目的配置
        '1': [],
        '2': [
          { prop: 'testResult', label: '结果判定', isResult: true } // isResult: true 用于应用样式
        ],
        '3': [],
        '4': [],
        '5': [],
        '6': [
          { prop: 'sp', label: 'S/P值' },
          { prop: 'testResult', label: '结果判定' }
        ],
        '7': [],
        '8': [
          { prop: 'shZdb', label: '总蛋白' },
          { prop: 'shTlz', label: '铜离子' },
          { prop: 'shTielz', label: '铁离子' },
          { prop: 'shXlz', label: '锌离子' },
          { prop: 'shGysz', label: '甘油三酯' },
          { prop: 'shQds', label: 'β-羟丁酸' },
          { prop: 'shFzhx', label: '非酯化性脂肪酸' },
          { prop: 'shPpt', label: '葡萄糖' },
          { prop: 'shXynsd', label: '血液尿素氮' },
          { prop: 'shGczam', label: '谷草转氨酶' },
          { prop: 'shGbzam', label: '谷丙转氨酶' },
          { prop: 'shBdb', label: '白蛋白' },
          { prop: 'shJxlsm', label: '碱性磷酸酶' },
          { prop: 'shZg', label: '总钙' },
          { prop: 'shLzg', label: '离子钙' },
          { prop: 'shMlz', label: '镁离子' },
          { prop: 'shWjl', label: '无机磷' },
          { prop: 'shJlz', label: '钾离子' },
          { prop: 'shNlz', label: '钠离子' },
          { prop: 'shLlz', label: '氯离子' },
        ],
        '9': [
          { prop: 'importCowNo', label: '导入牛号' },
          { prop: 'od', label: 'BioPRYN OD' },
          { prop: 'zaoyunTestResult', label: '结果' },
          { prop: 'testRemark', label: '备注' },
        ]
      }
    };
  },
  computed: {
    // 3. 补充 tableColumns 计算属性 (已修改，增加了过滤逻辑)
    tableColumns() {
      // 从 form 中获取当前的项目类型
      const bloodType = this.form.bloodTaskItemType;
      // 1. 获取用于检查的数据
      const data = this.tableData;

      // 固定的前三列
      const baseColumns = [
        { prop: 'entrustDeptName', label: '委托单位', width: 180, editable: false },
        { prop: 'gh', label: '管号', width: 180 },
        { prop: 'sampleName', label: '牛号', width: 180 },
        { prop: 'sampleNo', label: '样品编号', width: 180 }
      ];

      // 根据项目类型动态获取的 *所有* 列
      const allDynamicColumns = (this.itemConfigs[bloodType] || []).map(col => ({
        ...col,
        width: 150, // 动态列的默认宽度
        isResult: col.isResult || false
      }));

      let filteredDynamicColumns;

      // 关键判断：只对 '8' (生化) 并且有数据时进行过滤,因为生化项目不固定
      if (bloodType === '8' && data && data.length > 0) {
        // (仅对类型 '8' 执行过滤)
        filteredDynamicColumns = allDynamicColumns.filter(column => {
          // 检查 'data' 数组中是否 *至少有一行* 在 'column.prop' 字段上有值
          const hasValue = data.some(row => {
            const value = row[column.prop];
            // "有值" 定义为：不是 null, 不是 undefined, 也不是空字符串
            return value !== null && value !== undefined && value !== '';
          });
          return hasValue; // 如果有值，保留该列
        });
      } else {
        // 对于其他类型(如 '0', '2', '9'等)，或没有数据时，显示所有配置的列
        filteredDynamicColumns = allDynamicColumns;
      }
      // [!code ++] // ==== 过滤逻辑结束 ====


      // 固定的最后一列：异议
      const remarkColumn = [
        {
          prop: 'examineNote',
          label: '异议',
          width: 200,
          isRemark: true // 标记为异议列，以匹配 template
        }
      ];

      // 3. 使用过滤后的列 (filteredDynamicColumns)
      return [...baseColumns, ...filteredDynamicColumns, ...remarkColumn]; // [!code focus]
    }
  },
  created() {
    // 初始化数据
    this.getResultInfo();
  },
  methods: {
    /** 返回上一页 */
    goBack() {
      // 返回上一路由并关闭当前标签
      router.go(-1);
      this.$tab.closePage();
    },

    // 行样式，用于标记异议行
    tableRowClassName({ row, rowIndex }) {
      const examineNote = this.sampleExamineNote[row.sampleNo];
      if (examineNote && examineNote.trim().length > 0) {
        return 'objection-row';
      }
      return '';
    },

    // 结果样式
    getResultClass(result) {
      // 假设 阳性/Positive 用 '+' 或特定字符串
      if (['+', '阳性'].includes(result)) {
        return 'positive-result';
      }
      // 假设 阴性/Negative 用 '-' 或特定字符串
      if (['-', '阴性'].includes(result)) {
        return 'negative-result';
      }
      return '';
    },

    getResultInfo() {
      const resultNo = this.$route.query.resultNo;
      // 4. 从路由获取项目类型
      const bloodTaskItemType = this.$route.query.bloodTaskItemType;

      this.loading = true;
      getBloodBaseByResultNo(resultNo).then(response => {
        this.loading = false;
        if (response.code === 200 && response.data) {
          this.originalData = response.data;
          this.tableData = response.data; // 5. 填充 tableData

          // 初始化 sampleExamineNote
          const examineNote = {};
          this.originalData.forEach(sample => {
            // 使用 $set 确保响应式
            this.$set(examineNote, sample.sampleNo, sample.examineNote || '');
          });
          this.sampleExamineNote = examineNote;

          this.form = {
            ...this.form,
            opJczxBloodResultInfoList: response.data,
            // 6. 设置项目类型，触发 tableColumns 重新计算
            bloodTaskItemType: bloodTaskItemType || (response.data.length ? response.data[0].bloodTaskItemType : '')
          };
        } else {
          this.$modal.msgError("获取数据失败");
        }
      }).catch(error => {
        this.loading = false;
        console.error("获取数据失败:", error);
        this.$modal.msgError("获取数据失败");
      });

    },

    // 审核方法
    submitAudit(examinePassFlag) {
      this.saving = true;
      const auditPayload = []; // 这个变量已经定义
      const resultNo = this.$route.query.resultNo;

      this.tableData.forEach(sample => {
        const rowRemark = this.sampleExamineNote[sample.sampleNo] || '';
        auditPayload.push({
          opBloodEntrustOrderSampleId: sample.opBloodEntrustOrderSampleId,
          sampleNo: sample.sampleNo,
          examineNote: rowRemark
        });
      });

      if (auditPayload.length === 0) {
        this.$modal.msgWarning("无可提交的审核项目");
        this.saving = false;
        return;
      }
      // 构建最终的请求体
      const finalPayload = {
        sampleList: auditPayload, // 这里改为 auditPayload
        examinePassFlag: examinePassFlag,
        resultNo: resultNo
      };
      // 调用审核接口 examineBloodResultBase
      examineBloodResultBase(finalPayload).then(response => {
        this.saving = false;
        if (response.code === 200) {
          const action = examinePassFlag === 1 ? '通过' : '不通过';
          this.$modal.msgSuccess(`审核操作 (${action}) 成功`);
          this.goBack();
        } else {
          this.$modal.msgError("审核失败: " + response.msg);
        }
      }).catch(error => {
        this.saving = false;
        this.$modal.msgError("审核失败: " + (error.msg || '请检查网络连接'));
      });
    },


    // *** ADDED handlePass method ***
    handlePass() {
      this.$modal.confirm('确认审核通过吗？').then(() => {
        this.submitAudit(1); // 传递 1 表示通过
      }).catch(() => { }); // 用户取消则不执行任何操作
    },

    // *** ADDED handleFail method ***
    handleFail() {
      this.$modal.confirm('确认审核不通过吗？').then(() => {
        this.submitAudit(0); // 传递 0 表示不通过
      }).catch(() => { }); // 用户取消则不执行任何操作
    },

  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

/* 基本信息卡片样式 - 保持不变 */
.basic-info-card {
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


/* 检测项目配置卡片样式 */
.test-config-card {
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

/* 检测结果样式 */
.positive-result {
  color: #F56C6C;
  font-weight: bold;
}

.negative-result {
  color: #67C23A;
  font-weight: bold;
}

/* 新增：异议行样式 */
:deep(.el-table .objection-row) {
  background: #fef0f0 !important;
  /* light red/pink */
}

/* 表格样式优化 */
:deep(.test-config-card .el-table) {
  margin-top: 10px;
}

:deep(.test-config-card .el-table th) {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
}

:deep(.test-config-card .el-table .cell) {
  padding: 8px 12px;
}

/* Excel预览样式 */
:deep(.excel-preview table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

:deep(.excel-preview th),
:deep(.excel-preview td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(.excel-preview th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

:deep(.excel-preview tr:nth-child(even)) {
  background-color: #f9f9f9;
}

:deep(.sheet-title) {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #333;
}

/* 调整表单项间距 - 保持Element UI默认样式 */
.el-form-item {
  margin-bottom: 18px;
}

/* 确保行内元素间距均匀 */
.el-row {
  margin-bottom: 10px;
}

.el-col {
  padding-left: 10px;
  padding-right: 10px;
}

.el-table .el-table__row {
  cursor: pointer;
}

/*添加行高亮显示样式 */
.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 确保样式正确应用 */
.el-table__body tr {
  cursor: pointer;
}

.el-table__body tr:hover>td {
  background-color: #f5f7fa !important;
}

/* 禁用状态的样式 */
.el-input.is-disabled .el-input__inner {
  cursor: not-allowed;
  background-color: #f5f7fa;
  color: #c0c4cc;
}

/* 卡片标题样式 */
.el-card__header {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6ebf5;
  padding: 12px 20px;
  font-weight: bold;
}

/* 调整列宽比例 */
.el-col-7 {
  width: 29.1667%;
}

.el-col-5 {
  width: 20.8333%;
}
</style>