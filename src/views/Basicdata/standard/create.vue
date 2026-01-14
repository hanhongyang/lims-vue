<template>
  <div class="app-container">
    <!-- 头部导航和操作按钮 -->
    <div class="aboustform">
      <div class="form-data-header" style="margin-bottom: 0; padding: 0">
        <div class="form-data-header-title" @click="goBack">
          <i class="el-icon-back"></i>
          返回
          <span></span>
        </div>
        <div class="form-data-header-content"></div>
        <div class="form-data-header-tools">
          <el-button @click="saveForm" size="mini" type="primary" :disabled="BCZT">
            保存
          </el-button>
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleCreate" v-if="isregiet"
            v-hasPermi="['basicdata:standard:add']">
            新增
          </el-button>
        </div>
      </div>
    </div>

    <div style="padding-top: 40px">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- 基本信息部分 -->
        <el-card class="basic-info-card">
          <div slot="header" class="clearfix">
            <span>基本信息</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司" prop="deptId">
                <!-- <el-select v-model="form.deptId" placeholder="请选择公司" style="width: 100%" @change="handleDeptChange"
                  clearable>
                  <el-option v-for="dept in deptList" :key="dept.deptId" :label="dept.deptName" :value="dept.deptId" />
                </el-select> -->
                <!-- 公司选择输入框，点击即可弹窗 -->
                <el-input v-model="form.deptName" placeholder="请选择" readonly style="width: 100%"
                  @click.native="handleZZClick">
                  <el-button slot="append" icon="el-icon-search" @click="handleZZClick"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="物料" prop="invbillName">
                <!-- 物料选择输入框，点击即可弹窗 -->
                <el-input v-model="form.invbillName" placeholder="请先选择公司" readonly style="width: 100%"
                  :disabled="!form.deptId" @click.native="handleMaterialClick">
                  <el-button slot="append" icon="el-icon-search" :disabled="!form.deptId"
                    @click="handleMaterialClick"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="制单人" style="width: 100%">
                <el-input v-model="form.createBy" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="制单时间" style="width: 100%">
                <el-input v-model="form.createTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修改人" style="width: 100%">
                <el-input v-model="form.updateBy" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="修改时间" style="width: 100%">
                <el-input v-model="form.updateTime" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- 检测项目配置 -->
        <el-card class="test-config-card">
          <div slot="header" class="clearfix">
            <span>检测项目配置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addTestItem">
              <i class="el-icon-circle-plus-outline"></i> 添加检测项目
            </el-button>
          </div>

          <div v-for="(item, index) in form.testItems" :key="index" class="test-item-card">
            <el-divider v-if="index > 0"></el-divider>
            <div class="item-header">
              <span>检测项目 {{ index + 1 }}</span>
              <el-button v-if="form.testItems.length > 1" type="text" icon="el-icon-delete"
                @click="removeTestItem(index)" style="color: #F56C6C;">删除</el-button>
            </div>

            <!-- 第一行：项目名称、项目特性、上下限 -->
            <el-row :gutter="20">
              <el-col :span="6">
                <el-form-item :label="`项目名称`" :prop="`testItems.${index}.itemId`"
                  :rules="{ required: true, message: '请选择检测项目', trigger: 'change' }">
                  <el-input v-model="item.itemName" placeholder="请先选择项目" readonly @click.native="showItemDialog(index)"
                    class="project-name-input">
                    <el-button slot="append" icon="el-icon-search" @click="showItemDialog(index)"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item :label="`项目特性`" :prop="`testItems.${index}.featureId`">
                  <el-select v-model="item.featureId" placeholder="请先选择项目" :disabled="!item.itemId" clearable
                    @change="featureId => handleFeatureChange(index, featureId)" class="project-feature-input">
                    <el-option v-for="feature in itemFeatures[index]" :key="feature.featureId"
                      :label="feature.featureName" :value="feature.featureId" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!--<el-col :span="6">
                <el-form-item :label="`检验设备`" class="instrument-input">
                  <el-input v-model="item.instrumentName" placeholder="请选择检验设备" readonly
                    @click.native="showInstrumentDialog(index)">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>-->
              <el-col :span="4">
                <el-form-item :label="`结果录入方式`" class="required-check">
                  <el-radio-group v-model="item.resultAddType">
                    <el-radio v-for="dict in dict.type.result_add_type" :key="dict.value" :label="dict.value">{{
                      dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :label="`是否必检`" class="required-check">
                  <el-radio-group v-model="item.isBj" size="small">
                    <el-radio v-for="dict in dict.type.sys_yes_no2" :key="dict.value" :label="dict.value">{{
                      dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item :label="`是否初检`" class="initial-check">
                  <el-radio-group v-model="item.isCj" size="small">
                    <el-radio v-for="dict in dict.type.sys_yes_no2" :key="dict.value" :label="dict.value">{{
                      dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 第二行： -->
           <!-- <el-row :gutter="20" v-if="form.deptId !== '1958861893339926532'">
              <el-col :span="7">
                  <el-form-item :label="`执行标准`" :prop="`testItems.${index}.zxbz`" class="standard-input">
                  <el-input v-model="item.zxbz" placeholder="请输入执行标准"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="`是否必检`" class="required-check">
                  <el-radio-group v-model="item.isBj" size="small">
                    <el-radio v-for="dict in dict.type.sys_yes_no2" :key="dict.value" :label="dict.value">{{
                      dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :label="`是否初检`" class="initial-check">
                  <el-radio-group v-model="item.isCj" size="small">
                    <el-radio v-for="dict in dict.type.sys_yes_no2" :key="dict.value" :label="dict.value">{{
                      dict.label }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>-->
            <!-- 第三行： -->
            <!--  <el-row :gutter="20">
              
              <el-col :span="7">
                <el-form-item :label="`化验模板编号`" :prop="`testItems.${index}.testModelNo`" class="standard-input">
                  <el-input v-model="item.testModelNo" placeholder="请输入化验模板编号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :label="`化验模板名称`" :prop="`testItems.${index}.testModelName`" class="standard-input">
                  <el-input v-model="item.testModelName" placeholder="请输入化验模板名称"></el-input>
                </el-form-item>
              </el-col>
            </el-row>-->
          </div>

          <div v-if="form.testItems.length === 0" class="empty-test-items">
            <el-empty description='暂无检测项目' image-size="80">
            </el-empty>
          </div>
        </el-card>
      </el-form>
    </div>

    <!-- 公司选择对话框 -->
    <el-dialog title="选择公司" :visible.sync="showZZlDialog" width="800px" append-to-body>
      <!-- <el-form :model="materialQueryParams" ref="materialQueryForm" size="small" :inline="true" @submit.native.prevent>
        <el-form-item label="物料名称" prop="invbillName">
          <el-input v-model="materialQueryParams.invbillName" placeholder="请输入物料名称" clearable style="width: 240px"
            @keyup.enter.native="handleMaterialQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleMaterialQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetMaterialQuery">重置</el-button>
        </el-form-item>
      </el-form> -->

      <el-table :data="deptList" height="400" @row-dblclick="handleZZDblClick">
        <el-table-column label="公司名称" align="center" prop="deptName" />
        <!-- <el-table-column label="物料编码" align="center" prop="sapCode" />
        <el-table-column label="部门" align="center" prop="deptName" /> -->
      </el-table>

      <!-- 公司对话框分页 -->
      <!-- <div class="pagination-container">
        <el-pagination small :current-page="materialQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
          :page-size="materialQueryParams.pageSize" layout="total, sizes, prev, pager, next" :total="materialTotal"
          @size-change="handleMaterialSizeChange" @current-change="handleMaterialCurrentChange">
        </el-pagination>
      </div> -->

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmZZSelection">确 定</el-button>
        <el-button @click="showZZlDialog = false">取 消</el-button>
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
        <el-form-item label="标签" prop="tag">
                    <el-select v-model="materialQueryParams.tag" placeholder="请选择标签" clearable style="width: 180px">
                        <el-option v-for="dict in dict.type.invbill_tag" :key="dict.value" :label="dict.label"
              :value="dict.value" />
                      </el-select>
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

    <!-- 项目选择对话框 -->
    <el-dialog title="选择检测项目" :visible.sync="showItemDialogVisible" width="800px" append-to-body
      @open="handleItemDialogOpen">
      <el-form :model="itemQueryParams" ref="itemQueryForm" size="small" :inline="true" @submit.native.prevent>
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="itemQueryParams.itemName" placeholder="请输入项目名称" clearable style="width: 240px"
            @keyup.enter.native="handleItemQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleItemQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetItemQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table ref="itemTable" :data="itemOptions" height="400" @row-click="handleItemRowClick"
        @row-dblclick="handleItemDblClick" :row-class-name="itemTableRowClassName" highlight-current-row>
        <el-table-column label="项目名称" align="center" prop="itemName" />
        <el-table-column label="项目编码" align="center" prop="itemCode" />
        <el-table-column label="项目类型" align="center" prop="itemType" />
      </el-table>

      <div class="pagination-container">
        <el-pagination small :current-page="itemQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
          :page-size="itemQueryParams.pageSize" layout="total, sizes, prev, pager, next" :total="itemTotal"
          @size-change="handleItemSizeChange" @current-change="handleItemCurrentChange">
        </el-pagination>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmItemSelection">确 定</el-button>
        <el-button @click="showItemDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 设备选择对话框 -->
    <el-dialog title="选择检验设备" :visible.sync="showInstrumentDialogVisible" width="800px" append-to-body
      @open="handleInstrumentDialogOpen">

      <!-- 搜索表单 -->
      <el-form :model="instrumentQueryParams" ref="instrumentQueryForm" size="small" :inline="true"
        @submit.native.prevent>
        <el-form-item label="设备名称" prop="instrumentName">
          <el-input v-model="instrumentQueryParams.instrumentName" placeholder="请输入设备名称" clearable style="width: 240px"
            @keyup.enter.native="handleInstrumentQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleInstrumentQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetInstrumentQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 设备表格 -->
      <el-table ref="instrumentTable" :data="instrumentOptions" height="400" @row-dblclick="handleInstrumentDblClick"
        @selection-change="handleInstrumentSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="设备名称" align="center" prop="instrumentName" />
        <el-table-column label="设备编码" align="center" prop="instrumentCode" />
        <el-table-column label="设备型号" align="center" prop="instrumentModel" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination small :current-page="instrumentQueryParams.pageNum" :page-sizes="[10, 20, 30, 50]"
          :page-size="instrumentQueryParams.pageSize" layout="total, sizes, prev, pager, next" :total="instrumentTotal"
          @size-change="handleInstrumentSizeChange" @current-change="handleInstrumentCurrentChange">
        </el-pagination>
      </div>

      <!-- 对话框底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmInstrumentSelection">确 定</el-button>
        <el-button @click="showInstrumentDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getStandard, addStandard, updateStandard, addStandardBatch, updateStandardBatch, getStandardByInvbillCode } from "@/api/Basicdata/standard";
import { getpagelist } from "@/api/Basicdata/Testingitems";
import { getItemFeatureByItemId } from "@/api/Basicdata/itemFeature";
import { listInstrument } from "@/api/instrument/device";
import { getinvbilllist } from "@/api/Basicdata/invbill";
import { listDept } from "@/api/system/dept";

export default {

  name: "StandardCreate",
  dicts: ['result_add_type', 'sys_yes_no2', 'invbill_tag'],
  watch: {
    /**
     * 监听 'invbill_tag' 字典
     */
    'dict.type.invbill_tag': {
      handler(newVal) {
        // 1. 确保字典已加载 (newVal 存在且有内容)
        // 2. 确保 tag 字段当前是 null (即未被设置过)
        if (newVal && newVal.length > 0 && this.materialQueryParams.tag === null) {

          // 3. 将 tag 默认值设置为字典的第一项
          this.materialQueryParams.tag = newVal[0].value;

          // 4. (可选) 如果此时弹窗已打开，则自动刷新列表
          if (this.showMaterialDialog) {
            this.handleMaterialQuery(); // 重新查询
          }
        }
      },
      immediate: true // 关键：在组件创建时立即执行一次 handler
    }
  },
  data() {
    return {
      // 表单参数
      form: {
        bsInvbillItemStandardId: null,
        deptId: null,
        invbillCode: null,
        invbillName: '',
        remark: '',
        testItems: []
      },
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "请选择公司", trigger: "change" }
        ],
        invbillName: [
          { required: true, message: "请选择物料", trigger: "change" }
        ]
      },
      BCZT: false,
      isregiet: false,
      selectedZZ: null,   // 新增：缓存双击选中的公司
      // 部门列表
      deptList: [],
      showZZlDialog: false,
      // 物料选择相关
      showMaterialDialog: false,
      materialOptions: [],
      materialQueryParams: {
        pageNum: 1,
        pageSize: 10,
        invbillName: '',
        ownDeptId: null, // 添加部门ID参数
        isEnable: '1',
        isSapType: '0',
        tag: null
      },
      materialTotal: 0,
      selectedMaterial: null,

      // 项目选择相关
      showItemDialogVisible: false,
      // 项目列表
      itemOptions: [],
      itemQueryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: '',
        isEnable: '1'
      },
      itemTotal: 0,
      selectedItem: null,
      currentItemIndex: -1, // 当前正在编辑的项目项索引

      // 项目特性列表（按项目索引存储）
      itemFeatures: [],

      // 设备选择相关
      showInstrumentDialogVisible: false,
      instrumentOptions: [],
      instrumentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        instrumentName: '',
        isEnable: '1'
      },
      instrumentTotal: 0,
      //selectedInstrument: null,
      selectedInstruments: [],
      currentInstrumentIndex: -1, // 当前正在编辑的设备项索引
    };
  },
  created() {
    const query = this.$route.query;
    this.form.invbillCode = query.invbillCode;
    this.form.deptId = query.deptId;
    console.log('路由参数:', query);
    // 初始化数据
    this.getDeptList();
    this.getInstrumentList();

    // 如果是编辑模式，加载数据
    if (query.invbillCode && query.deptId) {
      this.getStandardData(query.invbillCode, query.deptId);
    }
  },
  methods: {
    /** 返回上一页 */
    goBack() {
      const obj = { path: "/Basicdata/standard" };
      this.$tab.closeOpenPage(obj);
    },

    /** 获取部门列表 */
    getDeptList() {
      return new Promise((resolve) => {
        listDept().then(response => {
          this.deptList = response.data;
          resolve();
        });
      });
    },

    /** 公司选择变化 */
    handleDeptChange(deptId) {
      // 清空已选择的物料和项目
      this.form.invbillCode = null;
      this.form.invbillName = '';

      // 更新查询参数中的部门ID
      this.materialQueryParams.ownDeptId = deptId;
    },

    /** 点击物料输入框 */
    handleMaterialClick() {
      if (!this.form.deptId) {
        this.$message.warning('请先选择公司');
        return;
      }
      this.showMaterialDialog = true;
    },
    /** 点击公司输入框 */
    handleZZClick() {
      // if (!this.form.deptId) {
      //   this.$message.warning('请先选择公司');
      //   return;
      // }
      this.showZZlDialog = true;
    },

    /** 获取物料列表 */
    getMaterialList() {
      if (!this.form.deptId) {
        this.$message.warning('请先选择公司');
        return;
      }

      // 确保查询参数中包含部门ID
      this.materialQueryParams.ownDeptId = this.form.deptId;

      getinvbilllist(this.materialQueryParams).then(response => {
        this.materialOptions = response.rows;
        this.materialTotal = response.total;
      }).catch(error => {
        console.error("获取物料列表失败:", error);
      });
    },

    /** 物料对话框打开时自动查询 */
    handleMaterialDialogOpen() {
      if (!this.form.deptId) {
        this.$message.warning('请先选择公司');
        this.$nextTick(() => {
          this.showMaterialDialog = false;
        });
        return;
      }
      this.getMaterialList();
      this.selectedMaterial = null; // 清空之前的选择
    },

    /** 设备对话框打开时自动查询 */
    handleInstrumentDialogOpen() {
      this.getInstrumentOptions();
      // this.selectedInstrument = null; 
      this.selectedInstruments = [];
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

    /** 设备分页大小变化 */
    handleInstrumentSizeChange(val) {
      this.instrumentQueryParams.pageSize = val;
      this.getInstrumentOptions();
    },

    /** 设备当前页变化 */
    handleInstrumentCurrentChange(val) {
      this.instrumentQueryParams.pageNum = val;
      this.getInstrumentOptions();
    },

    /** 获取仪器列表 */
    getInstrumentList() {
      listInstrument({ pageSize: 1000, isEnable: '1' }).then(response => {
        this.instrumentList = response.rows;
      });
    },

    /** 获取设备选项列表 */
    getInstrumentOptions() {
      listInstrument(this.instrumentQueryParams).then(response => {
        this.instrumentOptions = response.rows;
        this.instrumentTotal = response.total;
        this.preselectInstruments(); //
      });
    },
    /**  预选已保存的设备 */
    preselectInstruments() {
      this.$nextTick(() => {
        // 确保 $refs 可用
        if (this.$refs.instrumentTable && this.currentInstrumentIndex >= 0) {
          const item = this.form.testItems[this.currentInstrumentIndex];

          // 确保 instrumentId 是一个有内容的字符串
          if (item && item.instrumentId && typeof item.instrumentId === 'string' && item.instrumentId.length > 0) {
            const selectedIds = item.instrumentId.split(',');

            // 遍历弹窗的选项数据
            const rowsToSelect = this.instrumentOptions.filter(opt =>
              selectedIds.includes(String(opt.bsInstrumentsId))
            );

            // 勾选找到的行
            rowsToSelect.forEach(row => {
              this.$refs.instrumentTable.toggleRowSelection(row, true);
            });
          } else if (this.$refs.instrumentTable) {
            // 如果没有已选ID，确保清空选择
            this.$refs.instrumentTable.clearSelection();
          }
        }
      });
    },
    /** 获取标准数据（编辑模式） */
    getStandardData(invbillCode, deptId) {
      getStandardByInvbillCode(invbillCode, deptId).then(response => {
        const data = response.data[0]; // 注意：这里返回的是数组，取第一个元素
        console.log('编辑模式加载的数据:', data);

        if (data) {
          this.form = {
            bsInvbillItemStandardId: data.bsInvbillItemStandardId, // 添加这行，设置主ID
            deptId: data.deptId,
            deptName: data.deptName,
            invbillCode: data.invbillCode,
            invbillName: data.invbillName,
            createBy: data.createBy,
            createTime: data.createTime,
            updateBy: data.updateBy,
            updateTime: data.updateTime,
            remark: data.remark,
            testItems: data.standardList ? data.standardList.map((item, index) => ({
              bsInvbillItemStandardId: item.bsInvbillItemStandardId, // 添加每个项目的ID

              itemId: item.itemId,
              itemName: item.itemName, // 添加项目名称
              featureId: item.featureId,
              featureName: item.featureName, // 添加特性名称
              //zxbz: item.zxbz || '',
              //testModelNo: item.testModelNo || '',
              // testModelName: item.testModelName || '',
              lowerLimit: item.lowerLimit,
              upperLimit: item.upperLimit,
              instrumentId: String(item.instrumentId || ''),
              instrumentName: item.instrumentName || '',
              isBj: item.isBj !== undefined && item.isBj !== null ? item.isBj.toString() : '1',
              isCj: item.isCj !== undefined && item.isCj !== null ? item.isCj.toString() : '1',
              resultAddType: item.resultAddType || '0'
            })) : []
          };

          // 确保部门列表已加载，这样选择器能正确显示名称
          if (this.deptList.length === 0) {
            this.getDeptList();
          }

          // 加载每个项目的特性列表
          if (data.standardList && data.standardList.length > 0) {
            // 为每个检测项目加载对应的特性列表
            this.itemFeatures = [];
            data.standardList.forEach((item, index) => {
              if (item.itemId) {
                this.loadItemFeaturesForEdit(index, item.itemId, item.featureId);
              } else {
                this.itemFeatures[index] = [];
              }
            });
          } else {
            this.itemFeatures = [];
          }
        }
      }).catch(error => {
        console.error("加载标准数据失败:", error);
      });
    },

    /** 编辑模式下加载项目特性 */
    loadItemFeaturesForEdit(index, itemId, selectedFeatureId) {
      getItemFeatureByItemId(itemId).then(response => {
        if (response.data && response.data.length > 0) {
          this.$set(this.itemFeatures, index, response.data);

          // 如果之前有选中的特性，保持选中状态
          if (selectedFeatureId) {
            // 确保特性列表加载完成后再设置选中值
            this.$nextTick(() => {
              this.form.testItems[index].featureId = selectedFeatureId;
            });
          }
        } else {
          this.$set(this.itemFeatures, index, []);
        }
      }).catch(error => {
        console.error("加载特性列表失败:", error);
        this.$set(this.itemFeatures, index, []);
      });
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
        isEnable: '1',
        tag: defaultTag
      };
      this.handleMaterialQuery();
    },

    /** 物料行双击事件 */
    handleZZDblClick(row) {
      console.log('公司双击事件触发:', row);
      this.selectedZZ = row;          // 缓存选中的公司
      this.confirmZZSelection();      // 双击即确认（不需要再点“确定”按钮）
    },
    /** 确认公司选择 */
    confirmZZSelection() {
      console.log(this.selectedZZ, '11111111111')
      if (!this.selectedZZ) {
        this.$message.warning('请选择一个公司');
        return;
      }
      // 把 id 和 name 都写进 form
      this.form.deptId = this.selectedZZ.deptId;
      this.form.deptName = this.selectedZZ.deptName;   // 回显用

      this.showZZlDialog = false;
      this.selectedZZ = null;
    },
    /** 物料行双击事件 */
    handleMaterialDblClick(row) {
      console.log('物料双击事件触发:', row);
      this.selectedMaterial = row;
      this.confirmMaterialSelection();
    },

    /** 设备行双击事件 */
    handleInstrumentDblClick(row) {
      console.log('设备双击事件触发:', row);
      // this.selectedInstrument = row; // <--- 删除
      // this.confirmInstrumentSelection(); // <--- 删除
      this.$refs.instrumentTable.toggleRowSelection(row); // <--- 新增：切换选中状态
    },
    /** 设备多选框变化 */
    handleInstrumentSelectionChange(selection) {
      this.selectedInstruments = selection;
    },

    /** 确认物料选择 */
    confirmMaterialSelection() {
      if (!this.selectedMaterial) {
        this.$message.warning('请选择一个物料');
        return;
      }


      this.form.invbillCode = this.selectedMaterial.sapCode;
      this.form.invbillName = this.selectedMaterial.invbillName;


      this.showMaterialDialog = false;
      this.selectedMaterial = null;
    },

    /** 显示设备选择对话框 */
    showInstrumentDialog(index) {
      this.currentInstrumentIndex = index;
      this.showInstrumentDialogVisible = true;
      this.getInstrumentOptions();
    },

    /** 设备查询 */
    handleInstrumentQuery() {
      this.instrumentQueryParams.pageNum = 1;
      this.getInstrumentOptions();
    },

    /** 重置设备查询 */
    resetInstrumentQuery() {
      this.instrumentQueryParams = {
        pageNum: 1,
        pageSize: 10,
        instrumentName: '',
        isEnable: '1'
      };
      this.handleInstrumentQuery();
    },

    /** 确认设备选择 */
    confirmInstrumentSelection() {


      // (新逻辑)
      if (this.currentInstrumentIndex >= 0) {
        // 1. 从对象数组 [ {id:1, name:'A'}, {id:2, name:'B'} ] 中提取 ID 和 Name
        const selectedIds = this.selectedInstruments.map(inst => inst.bsInstrumentsId);
        const selectedNames = this.selectedInstruments.map(inst => inst.instrumentName);
        // 2. 将数组转换为逗号分隔的字符串
        this.form.testItems[this.currentInstrumentIndex].instrumentId = selectedIds.join(',');
        this.form.testItems[this.currentInstrumentIndex].instrumentName = selectedNames.join(',');
      }

      this.showInstrumentDialogVisible = false;
      // this.selectedInstrument = null; // <--- 删除
      this.selectedInstruments = []; // <--- 修改
      this.currentInstrumentIndex = -1;
    },

    /** 添加检测项目 */
    addTestItem() {


      this.form.testItems.push({
        itemId: null,
        itemName: '',
        featureId: null,
        //zxbz: '',
        testModelNo: '',
        testModelName: '',
        lowerLimit: null,
        upperLimit: null,
        instrumentId: '',
        instrumentName: '',
        isBj: '1',
        isCj: '1',
        resultAddType: '0'
      });
      this.itemFeatures.push([]);
    },

    /** 删除检测项目 */
    removeTestItem(index) {
      this.form.testItems.splice(index, 1);
      this.itemFeatures.splice(index, 1);
    },

    /** 提交表单 */
    saveForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.deptId) {
            this.$modal.msgError("请选择公司");
            return;
          }

          if (!this.form.invbillCode) {
            this.$modal.msgError("请选择物料");
            return;
          }

          if (this.form.testItems.length === 0) {
            this.$modal.msgError("请至少添加一个检测项目");
            return;
          }

          // 检查每个检测项目是否完整
          for (let i = 0; i < this.form.testItems.length; i++) {
            const item = this.form.testItems[i];
            if (!item.itemId) {
              this.$modal.msgError(`请选择第 ${i + 1} 个检测项目`);
              return;
            }
            //if (!item.featureId) {
            //  this.$modal.msgError(`请选择第 ${i + 1} 个检测项目的特性`);
            //  return;
            // }
          }

          // 构建批量提交数据
          const batchData = {
            invbillCode: this.form.invbillCode,
            deptId: this.form.deptId,
            standardList: this.form.testItems.map(item => ({
              bsInvbillItemStandardId: item.bsInvbillItemStandardId, // 添加项目ID
              itemId: item.itemId,
              featureId: item.featureId,
              zxbz: item.zxbz,
              testModelNo: item.testModelNo,
              testModelName: item.testModelName,
              instrumentId: item.instrumentId,
              isBj: item.isBj,
              isCj: item.isCj,
              lowerLimit: item.lowerLimit,
              upperLimit: item.upperLimit,
              resultAddType: item.resultAddType
            }))
          };

          console.log('批量提交数据:', batchData);
          this.BCZT = true;


          const hasExistingId = this.form.bsInvbillItemStandardId ||
            this.form.testItems.some(item => item.bsInvbillItemStandardId);
          // 使用批量接口
          const submitPromise = hasExistingId
            ? updateStandardBatch(batchData)  // 批量更新
            : addStandardBatch(batchData);    // 批量新增


          submitPromise.then(response => {
            this.BCZT = false;
            this.$modal.msgSuccess(this.form.bsInvbillItemStandardId ? "修改成功" : "新增成功");
            this.goBack();
          }).catch(error => {
            this.BCZT = false;
            console.error("提交失败:", error);
            this.$modal.msgError("提交失败: " + (error.message || "未知错误"));
          });
        } else {
          this.$modal.msgError("请完善必填信息");
        }
      });
    },

    /** 新增按钮操作 */
    handleCreate() {
      // 直接跳转
      const { path } = this.$route;
      this.$router.replace({
        path: "/redirect" + path,
      });
    },

    /** 显示项目选择对话框 */
    showItemDialog(index) {


      this.currentItemIndex = index;
      this.showItemDialogVisible = true;
      // 清空搜索条件
      this.itemQueryParams.itemName = '';
      this.getItemOptions();
    },

    /** 获取项目选项列表 */
    getItemOptions() {

      getpagelist(this.itemQueryParams).then(response => {
        this.itemOptions = response.rows;
        this.itemTotal = response.total;
      }).catch(error => {
        console.error("获取项目列表失败:", error);
      });
    },

    /** 项目查询 */
    handleItemQuery() {
      this.itemQueryParams.pageNum = 1;
      this.getItemOptions();
    },

    /** 重置项目查询 */
    resetItemQuery() {
      this.itemQueryParams = {
        pageNum: 1,
        pageSize: 10,
        itemName: '',
        isEnable: '1'
      };
      this.handleItemQuery();
    },

    /** 项目对话框打开时自动查询 */
    handleItemDialogOpen() {
      this.getItemOptions();
      this.selectedItem = null; // 清空之前的选择
    },

    /** 项目分页大小变化 */
    handleItemSizeChange(val) {
      this.itemQueryParams.pageSize = val;
      this.getItemOptions();
    },

    /** 项目当前页变化 */
    handleItemCurrentChange(val) {
      this.itemQueryParams.pageNum = val;
      this.getItemOptions();
    },

    /** 项目行双击事件 */
    handleItemDblClick(row) {
      console.log('项目双击事件触发:', row);

      //  添加重复检查
      const isSelected = this.form.testItems.some((item, index) =>
        item.itemId === row.labtestItemsId && index !== this.currentItemIndex
      );
      // if (isSelected) {
      //   this.$message.warning('该项目已被选择，请勿重复添加');
      //   return;
      // }

      this.selectedItem = row;
      this.confirmItemSelection();
    },

    /** 确认项目选择 */
    confirmItemSelection() {
      if (!this.selectedItem) {
        this.$message.warning('请选择一个项目');
        return;
      }

      // 添加重复检查 (安全校验)
      const isSelected = this.form.testItems.some((item, index) =>
        item.itemId === this.selectedItem.labtestItemsId && index !== this.currentItemIndex
      );
      // if (isSelected) {
      //   this.$message.warning('该项目已被选择，请勿重复添加');
      //   return;
      // }


      if (this.currentItemIndex >= 0) {
        this.form.testItems[this.currentItemIndex].itemId = this.selectedItem.labtestItemsId;
        this.form.testItems[this.currentItemIndex].itemName = this.selectedItem.itemName;

        // 选择项目后加载项目特性
        this.loadItemFeatures(this.currentItemIndex, this.selectedItem.labtestItemsId);
      }

      this.showItemDialogVisible = false;
      this.selectedItem = null;
      this.currentItemIndex = -1;
    },

    /** 加载项目特性 */
    loadItemFeatures(index, itemId) {
      // 清空当前项目的特性选择和上下限
      this.form.testItems[index].featureId = null;
      this.form.testItems[index].upperLimit = null;
      this.form.testItems[index].lowerLimit = null;

      // 加载项目特性
      getItemFeatureByItemId(itemId).then(response => {
        if (response.data && response.data.length > 0) {
          // 注意：接口返回的数据在 response.data 中
          this.$set(this.itemFeatures, index, response.data);
        } else {
          this.$set(this.itemFeatures, index, []);
          this.$message.info('该项目暂无特性');
        }
      }).catch(error => {
        console.error("加载特性列表失败:", error);
        this.$set(this.itemFeatures, index, []);
      });
    },

    /** 项目特性选择变化 */
    handleFeatureChange(index, featureId) {
      // 找到选中的特性
      const selectedFeature = this.itemFeatures[index].find(f => f.featureId === featureId);
      if (selectedFeature) {
        // 自动填充上限下限
        this.form.testItems[index].upperLimit = selectedFeature.upperLimit;
        this.form.testItems[index].lowerLimit = selectedFeature.lowerLimit;
      } else {
        // 清空上下限
        this.form.testItems[index].upperLimit = null;
        this.form.testItems[index].lowerLimit = null;
      }
    },

    /**  检查项目行是否已被选择, 用于添加禁用样式 */
    itemTableRowClassName({ row }) {
      if (!row) return '';
      // 检查当前表单的 testItems 列表中是否已存在该 itemId
      // 关键: 必须排除当前正在编辑的行 (currentItemIndex)
      const isSelected = this.form.testItems.some((item, index) =>
        item.itemId === row.labtestItemsId && index !== this.currentItemIndex
      );

      if (isSelected) {
        return 'disabled-row'; // 返回禁用样式类
      }
      return '';
    },

    /**  项目行单击事件, 用于"确定"按钮 */
    handleItemRowClick(row) {
      // 检查是否已被选择
      const isSelected = this.form.testItems.some((item, index) =>
        item.itemId === row.labtestItemsId && index !== this.currentItemIndex
      );

      if (isSelected) {
        // 如果点击了禁用行
        // this.$message.warning('该项目已被选择，请勿重复添加');
        // 清空高亮并清除 selectedItem
        this.$refs.itemTable.setCurrentRow(null);
        this.selectedItem = null;
        return;
      }
      // 否则，正常选中
      this.selectedItem = row;
    },
    /** 聚焦公司选择框 */
    focusDeptSelect() {
      const deptSelect = this.$el.querySelector('select[name="deptId"]');
      if (deptSelect) {
        deptSelect.focus();
      }
    }
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
}

.test-item-card {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #f9fafc;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
  color: #606266;
}

.empty-test-items {
  padding: 40px 0;
}


/* 使物料输入框整体可点击 */
.el-input.readonly-input {
  cursor: pointer;
}

.pagination-container {
  padding: 10px 0;
  background: #fff;
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
</style>