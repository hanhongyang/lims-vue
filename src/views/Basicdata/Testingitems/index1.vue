<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="项目名称" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入项目名称" clearable @keyup.enter.native="handleQuery"
          style="width: 180px" />
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-select v-model="queryParams.tag" placeholder="请输入标签" clearable @keyup.enter.native="handleQuery"
          style="width: 180px">
          <el-option v-for="dict in dict.type.item_tag" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="isEnable">
        <el-select v-model="queryParams.isEnable" placeholder="状态" clearable style="width: 240px">
          <el-option v-for="dict in dict.type.is_enable" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['basicdata:items:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:items:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="tablepagelist" height="calc(100vh - 300px)"
      style="width: 100%; min-height: 200px">
      <el-table-column type="index" align="center" label="序号" width="50" />
      <el-table-column label="项目编码" align="center" prop="itemCode" min-width="150" />
      <el-table-column label="项目名称" align="center" prop="itemName" min-width="150" />
      <el-table-column prop="isEnable" label="状态" width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_enable" :value="scope.row.isEnable" />
        </template>
      </el-table-column>
      <el-table-column label="标签" align="center" prop="tag" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.tag">
            <el-tag v-for="tagValue in scope.row.tag.split(',')" :key="tagValue" size="small" style="margin: 2px;">
              {{ getTagLabel(tagValue) }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" align="center" prop="createBy" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="制单时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改人" align="center" prop="updateBy" width="200" :show-overflow-tooltip="true" />
      <el-table-column label="修改时间" align="center" prop="updateTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['basicdata:items:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-circle-check" @click="handleStatusChange(scope.row)"
            v-hasPermi="['']">启用/停用</el-button>
          <!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
            v-hasPermi="['basicdata:items:edit']">
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleStatusChange" icon="el-icon-circle-check"
                v-hasPermi="['basicdata:items:edit']">启用/停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="formrules" label-width="100px">
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="项目名称" />
        </el-form-item>
        <el-form-item label="项目编码" prop="itemCode">
          <el-input v-model="form.itemCode" placeholder="项目编码" />
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-select v-model="form.tag" multiple placeholder="请选择标签" style="width: 100%">
            <el-option v-for="dict in dict.type.item_tag" :key="dict.value" :label="dict.label" :value="dict.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="实验地点" prop="labLocation">
          <el-select v-model="form.labLocation" multiple placeholder="请选择实验地点" style="width: 100%">
            <el-option v-for="item in labLocationOptions" :key="item.id" :label="item.monitoringPoint"
              :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行标准" prop="zxbz" v-if="form.tag.includes('1')">
          <el-input v-model="form.zxbz" placeholder="请输入执行标准" />
        </el-form-item>
        <!--<el-form-item label="模板编号" prop="testModelNo" v-if="form.tag.includes('1')">
  <el-input v-model="form.testModelNo" placeholder="请输入化验单模板编号" />
  </el-form-item>
<el-form-item label="模板名称" prop="testModelName" v-if="form.tag.includes('1')">
  <el-input v-model="form.testModelName" placeholder="请输入化验单模板名称" />
  </el-form-item>-->
        <!-- TODO：只有检测中心和管理员可以看见以下内容 -->
        <el-form-item label="定性或定量" prop="qualitativeOrQuantitative">
          <el-radio-group v-model="form.qualitativeOrQuantitative" size="small">
            <el-radio v-for="dict in dict.type.qualitative_or_quantitative" :key="dict.value" :label="dict.value">{{
              dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="保留小数位" prop="decimalPlaces">
          <el-input v-model="form.decimalPlaces" placeholder="" size="small" style="width: 120px;"
            @input="handleDecimalPlacesInput" clearable>
            <template slot="append">位</template>
          </el-input>
        </el-form-item>
        <el-form-item label="有效数字位" prop="significantDigits">
          <el-input v-model="form.significantDigits" placeholder="" size="small" style="width: 120px;"
            @input="handleSignificantDigitsInput" clearable>
            <template slot="append">位</template>
          </el-input>
        </el-form-item>

        <el-form-item label="适用部门" prop="itemDeptList">
          <el-button type="primary" size="small" @click="openDeptDialog" icon="el-icon-search">
            选择部门
          </el-button>
          <div style="margin-top: 8px;">
            <el-tag v-for="dept in selectedDeptNames" :key="dept.deptId" closable
              style="margin-right: 8px; margin-bottom: 8px;" @close="removeDept(dept.deptId)">
              {{ dept.deptName }}
            </el-tag>
            <span v-if="!selectedDeptNames || selectedDeptNames.length === 0" style="color: #909399;">
              未选择部门
            </span>
          </div>
        </el-form-item>

        <el-form-item label="使用设备" prop="itemInstrumentList">
          <el-button type="primary" size="small" @click="openInstrumentDialog" icon="el-icon-search">
            选择设备
          </el-button>
          <div style="margin-top: 8px;">
            <el-tag v-for="instrument in selectedInstruments" :key="instrument.instrumentId" closable
              style="margin-right: 8px; margin-bottom: 8px;" @close="removeInstrument(instrument.instrumentId)">
              {{ instrument.instrumentName }} ({{ instrument.instrumentCode }})
            </el-tag>
            <span v-if="!selectedInstruments || selectedInstruments.length === 0" style="color: #909399;">
              未选择设备
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 部门选择弹窗 -->
    <el-dialog title="选择部门" :visible.sync="deptDialogVisible" width="800px" append-to-body>
      <!-- <div style="margin-bottom: 10px; color: #909399; font-size: 12px;">
        <i class="el-icon-info"></i> 提示：只能选择二级部门，一级部门不可选择
      </div>-->
      <el-tree ref="deptTree" :data="deptTreeData" show-checkbox node-key="deptId" :props="defaultProps"
        :default-expand-all="true" :check-strictly="true" :disabled="isDisabledNode" @check="handleCheck"
        style="max-height: 400px; overflow-y: auto;" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleDeptConfirm">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 设备选择弹窗 -->

    <el-dialog title="选择设备" :visible.sync="instrumentDialogVisible" width="1000px" append-to-body>
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

      <el-table :data="instrumentList" ref="instrumentTable" :row-key="getRowKey" style="width: 100%" height="400px"
        @selection-change="handleInstrumentSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" width="55" />
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="设备名称" align="center" prop="instrumentName" min-width="150" />
        <el-table-column label="设备编号" align="center" prop="instrumentCode" min-width="150" />
        <el-table-column label="状态" align="center" width="80">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.is_enable" :value="scope.row.isEnable" />
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="instrumentTotal > 0" :total="instrumentTotal" :page.sync="instrumentQueryParams.pageNum"
        :limit.sync="instrumentQueryParams.pageSize" @pagination="getInstrumentList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="instrumentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInstrumentConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getpagelist,
  addobj,
  getdetail,
  updateobj,
  changestatus,
} from "@/api/Basicdata/Testingitems";
import { getLoginUserDept, listDept } from "@/api/system/dept";
import { listInstrument } from "@/api/instrument/device";
import {
  listMonitor
} from "@/api/environment/monitor";
export default {
  dicts: ["is_enable", 'qualitative_or_quantitative', 'item_tag'],
  name: "Testingitems",
  data() {
    return {
      deptList: [],
      labLocationOptions: [],
      deptDialogVisible: false, // 部门弹窗显示状态
      deptTreeData: [], // 部门树形数据
      selectedDeptNames: [], // 选中的部门名称列表
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 【请填写功能名称】表格数据
      tablepagelist: [],
      // 弹出层标题
      title: "",
      isregiet: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: "",
        isEnable: "1", // 默认启用
        tag: "",
      },
      // 表单参数
      form: {
        labtestItemsId: "",
        itemName: "",
        itemCode: "",
        itemDeptList: [],
        labLocation: [],
        tag: "",
        decimalPlaces: "",        // 改为字符串，默认空
        significantDigits: "",    // 改为字符串，默认空
        zxbz: "",
        //testModelNo: "",
        //testModelName: ""
      },
      // 表单校验
      formrules: {
        itemName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        itemCode: [
          { required: true, message: "请输入项目编码", trigger: "blur" },
        ],
        decimalPlaces: [
          {
            validator: this.validateNumber,
            message: "请输入有效的数字",
            trigger: "blur"
          },
          {
            validator: this.validateMutuallyExclusive,
            message: "保留小数位和有效数字位不能同时填写",
            trigger: "blur"
          }
        ],
        significantDigits: [
          {
            validator: this.validateNumber,
            message: "请输入有效的数字",
            trigger: "blur"
          },
          {
            validator: this.validateMutuallyExclusive,
            message: "保留小数位和有效数字位不能同时填写",
            trigger: "blur"
          }
        ],
      },
      currentDept: null, // 存储当前用户部门信息
      // 设备相关数据
      instrumentDialogVisible: false, // 设备弹窗显示状态
      instrumentList: [], // 设备列表数据
      instrumentTotal: 0, // 设备总数
      instrumentQueryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: "",
        instrumentName: ""
      },
      selectedInstruments: [], // 选中的设备列表
      selectedInstrumentIds: [], // 选中的设备ID列表
    };
  },
  created() {
    this.getList();
    this.getCurrentDeptInfo(); // 获取当前用户部门信息
    this.getDeptList(); // 预加载部门列表
    this.getLabLocationList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      getpagelist(this.queryParams).then((response) => {
        console.log(response);
        if (response.code == "200") {
          this.tablepagelist = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      // 清空部门树的选中状态
      this.$nextTick(() => {
        if (this.$refs.deptTree) {
          this.$refs.deptTree.setCheckedKeys([]);
        }
      });
    },
    /** 新增：指定表格行的唯一标识 */
    getRowKey(row) {
      // 确保这里使用的是每行数据的唯一ID字段名
      return row.bsInstrumentsId;
    },
    // 表单重置
    reset() {
      this.form = {
        labtestItemsId: "",
        itemName: "",
        itemCode: "",
        itemDeptList: [], // 重置时清空部门选择
        itemInstrumentList: [], // 设备列表字段
        labLocation: [],
        tag: [],
        qualitativeOrQuantitative: "",
        decimalPlaces: "",
        significantDigits: "",
        zxbz: "",
        //testModelNo: "",
        //testModelName: ""
      };
      this.selectedDeptNames = []; // 清空显示的部门标签
      this.selectedInstruments = []; // 重置选中的设备
      this.selectedInstrumentIds = []; // 重置选中的设备ID
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.isregiet = false;
      this.title = "添加";
      // 清空部门选择相关数据
      this.selectedDeptNames = [];
      this.form.itemDeptList = [];
      // 清空设备选择相关数据
      this.selectedInstruments = [];
      this.selectedInstrumentIds = [];
      // 清空部门树的选中状态
      this.$nextTick(() => {
        if (this.$refs.deptTree) {
          this.$refs.deptTree.setCheckedKeys([]);
        }
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const labtestItemsId = row.labtestItemsId;
      getdetail(labtestItemsId).then((response) => {
        if (response.code == "200") {
          if (response.data) {
            this.form = response.data;

            // 处理标签数据 - 将逗号分隔的字符串转换为数组
            if (this.form.tag && typeof this.form.tag === 'string') {
              this.form.tag = this.form.tag.split(',');
            } else if (!this.form.tag) {
              this.form.tag = [];
            }
            if (this.form.labLocation && typeof this.form.labLocation === 'string') {
              // 将逗号分隔的字符串id转为数组
              this.form.labLocation = this.form.labLocation.split(',');
            } else if (!this.form.labLocation) {
              this.form.labLocation = [];
            }

            // 处理部门数据
            if (this.form.itemDeptList && this.form.itemDeptList.length > 0) {
              // 提取 deptId 列表用于表单提交
              const originalItemDeptList = this.form.itemDeptList;
              this.form.itemDeptList = originalItemDeptList.map(item =>
                String(item.deptId)
              );

              // 使用返回的部门名称用于显示
              this.selectedDeptNames = originalItemDeptList
                .filter(item => item.deptName)
                .map(item => ({
                  deptId: String(item.deptId),
                  deptName: item.deptName
                }));
            } else {
              this.form.itemDeptList = [];
              this.selectedDeptNames = [];
            }
            // 处理设备数据（这里需要根据实际情况调整，假设返回数据中有 itemInstrumentList）
            if (this.form.itemInstrumentList && Array.isArray(this.form.itemInstrumentList)) {
              // 过滤掉空对象和无效数据
              const validInstruments = this.form.itemInstrumentList.filter(item =>
                item && item.instrumentId && item.instrumentName
              );

              if (validInstruments.length > 0) {
                this.selectedInstruments = validInstruments.map(item => ({
                  instrumentId: item.instrumentId,
                  instrumentName: item.instrumentName,
                  instrumentCode: item.instrumentCode || ''
                }));
                this.selectedInstrumentIds = this.selectedInstruments.map(item => item.instrumentId);
              } else {
                // 如果没有有效设备数据，清空设备选择
                this.selectedInstruments = [];
                this.selectedInstrumentIds = [];
              }
            } else {
              // 如果 itemInstrumentList 不存在或不是数组，清空设备选择
              this.selectedInstruments = [];
              this.selectedInstrumentIds = [];
            }

            this.open = true;
            this.isregiet = true;
            this.title = "修改";

            // 确保部门树数据已加载
            this.getDeptList().then(() => {
              // 设置部门树的选中状态
              this.$nextTick(() => {
                if (this.$refs.deptTree && this.form.itemDeptList.length > 0) {
                  this.$refs.deptTree.setCheckedKeys(this.form.itemDeptList);
                }
              });
            });
          }
        }
      });
    },

    /** 处理复选框点击事件 */
    handleCheck(checkedNode, checkedState) {
      // 如果点击的是一级部门，阻止选中
      //if (this.isDisabledNode(checkedNode)) {
      //  this.$nextTick(() => {
      //    this.$refs.deptTree.setChecked(checkedNode.deptId, false);
      //  });
      //}
    },
    /** 禁用一级部门的复选框 */
    //isDisabledNode(node) {
    //  // 禁用一级部门（parentId为0的部门）
    //  return node.parentId === 0 || node.parentId === '0' || String(node.parentId) === "0";
    //},
    /** 设置选中的部门名称 */
    setSelectedDeptNames(deptIds) {
      this.selectedDeptNames = deptIds.map(deptId => {
        const dept = this.findDeptById(deptId, this.deptTreeData);
        return dept ? { deptId, deptName: dept.deptName } : null;
      }).filter(Boolean);
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {

          // 转换标签格式 - 将数组转换为逗号分隔的字符串
          const tagValue = Array.isArray(this.form.tag)
            ? this.form.tag.join(',')
            : this.form.tag || '';

          // 转换 itemDeptList 格式为对象数组
          const itemDeptList = this.form.itemDeptList.map(deptId => ({
            deptId: deptId,
            itemId: this.form.labtestItemsId || ''
          }));
          console.log("Submit Form - selectedInstrumentIds:", this.selectedInstrumentIds);
          // 组装 itemInstrumentList
          const itemInstrumentList = this.selectedInstrumentIds.map(instrumentId => ({
            itemId: this.form.labtestItemsId || '',
            instrumentId: instrumentId
          }));
          // 转换实验地点格式 
          const labLocationValue = Array.isArray(this.form.labLocation)
            ? this.form.labLocation.join(',')
            : this.form.labLocation || '';
          // 转换 itemDeptList 格式为对象数组
          const submitData = {
            ...this.form,
            tag: tagValue,
            itemDeptList: itemDeptList,
            labLocation: labLocationValue,
            itemInstrumentList: itemInstrumentList
          };

          console.log('提交数据:', submitData);

          if (this.form.labtestItemsId != "") {
            this.loading = true;
            updateobj(submitData).then((response) => {
              this.loading = false;
              if (response.code == "200") {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.loading = true;
            addobj(submitData).then((response) => {
              this.loading = false;
              if (response.code == "200") {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
                // 新增成功后重置部门选择
                this.selectedDeptNames = [];
                this.form.itemDeptList = [];
                this.selectedInstruments = [];
                this.selectedInstrumentIds = [];
                if (this.$refs.deptTree) {
                  this.$refs.deptTree.setCheckedKeys([]);
                }
              }
            });
          }
        } else {
          this.$modal.msgError("请检查必填项是否填写");
        }
      });
    },

    // 状态修改
    handleStatusChange(row) {
      // 确定目标状态：如果当前是启用(1)，则要停用(0)；如果当前是停用(0)，则要启用(1)
      const targetStatus = row.isEnable === "1" ? "0" : "1";
      const text = targetStatus === "0" ? "停用" : "启用";

      this.$modal
        .confirm('确认要"' + text + '""' + row.itemName + '"吗？')
        .then(() => {
          // 传递目标状态给后端
          return changestatus(row.labtestItemsId, targetStatus);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");

          // 重新获取列表数据
          this.getList();
        })
        .catch(() => {
          // 取消操作，不需要做任何改变
          this.$modal.msgInfo("已取消操作");
        });
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleStatusChange":
          console.log(row.isEnable);
          this.handleStatusChange(row);
          break;
        default:
          break;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/basicdata/labTestItems/export",
        {
          ...this.queryParams,
        },
        `检测项目_${new Date().getTime()}.xlsx`
      );
    },
    // 获取当前机构信息
    getCurrentDeptInfo() {
      getLoginUserDept().then(response => {
        if (response.code === 200) {
          this.currentDept = response.data;
          console.log("11111111", this.currentDept.deptType)
        }
      });
    },
    /** 获取部门列表并转换为树形结构 */
    getDeptList() {
      return new Promise((resolve, reject) => {
        if (this.deptTreeData.length === 0) {
          listDept().then(response => {
            if (response.code === 200) {
              // 将扁平数据转换为树形结构
              this.deptTreeData = this.buildDeptTree(response.data);
              resolve(this.deptTreeData);
            } else {
              reject(new Error('获取部门列表失败'));
            }
          }).catch(error => {
            reject(error);
          });
        } else {
          // 如果已经加载过，直接返回现有数据
          resolve(this.deptTreeData);
        }
      });
    },
    /** 打开部门选择弹窗 */
    openDeptDialog() {
      this.deptDialogVisible = true;
      this.$nextTick(() => {
        if (this.$refs.deptTree) {
          // 设置已选中的部门
          const selectedDeptIds = this.form.itemDeptList || [];
          this.$refs.deptTree.setCheckedKeys(selectedDeptIds);

          // 确保一级部门显示为禁用状态
          //this.$refs.deptTree.store.nodesMap.forEach(node => {
          //  if (this.isDisabledNode(node.data)) {
          //    node.disabled = true;
          //  }
          //});
        }
      });
    },

    /** 部门选择确认 */
    handleDeptConfirm() {
      // 只获取明确勾选的节点，不包含半选状态
      const checkedNodes = this.$refs.deptTree.getCheckedNodes();

      // 过滤掉一级部门（parentId为0的部门）
      //const filteredNodes = checkedNodes.filter(node =>
      //  String(node.parentId) !== "0" && node.parentId !== 0
      //);

      // 获取明确勾选的部门ID（统一转换为字符串）
      const selectedDeptIds = checkedNodes.map(node => String(node.deptId));
      this.form.itemDeptList = selectedDeptIds;

      // 更新显示的部门名称
      this.selectedDeptNames = checkedNodes.map(node => ({
        deptId: String(node.deptId),
        deptName: node.deptName
      }));

      this.deptDialogVisible = false;
    },
    /** 移除已选部门 */
    removeDept(deptId) {
      // 统一类型比较
      const deptIdStr = String(deptId);

      // 从表单数据中移除
      this.form.itemDeptList = this.form.itemDeptList.filter(id =>
        String(id) !== deptIdStr
      );

      // 从显示列表中移除
      this.selectedDeptNames = this.selectedDeptNames.filter(dept =>
        String(dept.deptId) !== deptIdStr
      );

      // 更新树形组件的选中状态
      if (this.$refs.deptTree) {
        this.$refs.deptTree.setChecked(deptId, false);
      }
    },

    /** 获取部门列表并转换为树形结构 */
    getDeptList() {
      if (this.deptTreeData.length === 0) {
        listDept().then(response => {
          if (response.code === 200) {
            // 将扁平数据转换为树形结构
            this.deptTreeData = this.buildDeptTree(response.data);
          }
        });
      }
    },

    /** 构建部门树形结构 */
    buildDeptTree(deptList) {
      const deptMap = {};
      const tree = [];

      // 创建映射
      deptList.forEach(dept => {
        // 确保 deptId 和 parentId 都是字符串类型，便于比较
        deptMap[dept.deptId] = {
          ...dept,
          deptId: String(dept.deptId), // 转换为字符串
          parentId: String(dept.parentId), // 转换为字符串
          children: []
        };
      });

      // 构建树形结构
      deptList.forEach(dept => {
        const deptIdStr = String(dept.deptId);
        const parentIdStr = String(dept.parentId);

        if (parentIdStr === "0") {
          tree.push(deptMap[deptIdStr]);
        } else {
          const parent = deptMap[parentIdStr];
          if (parent) {
            parent.children.push(deptMap[deptIdStr]);
          }
        }
      });

      return tree;
    },

    /** 根据ID查找部门 */
    findDeptById(deptId, treeData) {
      const deptIdStr = String(deptId); // 统一转换为字符串比较

      for (const dept of treeData) {
        if (String(dept.deptId) === deptIdStr) {
          return dept;
        }
        if (dept.children && dept.children.length > 0) {
          const found = this.findDeptById(deptId, dept.children);
          if (found) return found;
        }
      }
      return null;
    },
    // 获取标签的显示文本
    getTagLabel(tagValue) {
      const tagOption = this.dict.type.item_tag.find(item => item.value === tagValue);
      return tagOption ? tagOption.label : tagValue;
    },

    /** 打开设备选择弹窗 */
    async openInstrumentDialog() {
      this.$nextTick(() => {
        if (this.$refs.instrumentTable) {
          this.$refs.instrumentTable.clearSelection();
        }
      });
      try {
        // 确保当前部门信息已加载
        if (!this.currentDept) {
          await this.getCurrentDeptInfo();
        }

        this.instrumentDialogVisible = true;
        this.instrumentQueryParams.pageNum = 1;

        // 设置当前部门的 deptId
        if (this.currentDept && this.currentDept.deptId) {
          this.instrumentQueryParams.deptId = this.currentDept.deptId;
        } else {
          this.instrumentQueryParams.deptId = "";
          console.warn('未获取到当前部门信息');
        }

        this.getInstrumentList();
      } catch (error) {
        console.error('获取部门信息失败:', error);
        this.$modal.msgError("获取部门信息失败，无法打开设备选择");
      }
    },

    /** 获取设备列表 */
    getInstrumentList() {
      this.loading = true;
      listInstrument(this.instrumentQueryParams).then((response) => {
        this.instrumentList = response.rows || [];
        this.instrumentTotal = response.total || 0;
        this.loading = false;

        // 修改部分：回显逻辑
        this.$nextTick(() => {
          if (this.$refs.instrumentTable) {
            this.instrumentList.forEach(row => {
              // 检查该行是否在已选ID列表中
              if (this.selectedInstrumentIds.includes(row.bsInstrumentsId)) {
                // toggleRowSelection(row, true) 确保它是选中状态
                // 注意：如果该行已经被 reserve-selection 记住了，这里再次 toggle 可能会导致状态反转
                // 所以最好先判断一下是否已经选中了，或者只在打开弹窗的第一次加载时做回显

                // 更稳健的做法：
                // 只有当这一行没有被选中时，才去选中它
                // Element UI 内部维护了 selection 数组，我们无法直接简单判断 row 是否在内部 selection 中
                // 但是通常直接调用 toggleRowSelection(row, true) 是安全的，true 表示强制选中
                this.$refs.instrumentTable.toggleRowSelection(row, true);
              }
            });
          }
        });
      }).catch(error => {
        console.error('获取设备列表失败:', error);
        this.loading = false;
        this.$modal.msgError("获取设备列表失败");
      });
    },

    /** 处理设备选择变化 */
    handleInstrumentSelectionChange(selection) {
      // 开启 reserve-selection 后，selection 参数会包含所有页面已选中的行
      // 不需要再手动做复杂的数组合并和去重逻辑了，直接赋值即可

      // 注意：为了防止对象引用问题，这里建议保存 selection 的副本
      // 但在后续提交时，你需要确保使用的是 selection 中的对象

      // 这里暂时只更新 ID 列表，最终提交时再处理详细对象
      this.selectedInstrumentIds = selection.map(item => item.bsInstrumentsId);
      console.log("Selected IDs after change:", this.selectedInstrumentIds);
      // 更新用于显示的 tags 列表
      // 注意：selection 中包含的是完整的 row 对象
      this.selectedInstruments = selection.map(item => ({
        instrumentId: item.bsInstrumentsId,
        instrumentName: item.instrumentName,
        instrumentCode: item.instrumentCode || ''
      }));

    },

    /** 设备查询 */
    handleInstrumentQuery() {
      this.instrumentQueryParams.pageNum = 1;
      this.getInstrumentList();
    },

    /** 重置设备查询 */
    resetInstrumentQuery() {
      this.resetForm("instrumentQueryForm");
      this.instrumentQueryParams = {
        pageNum: 1,
        pageSize: 10,
        deptId: "",
        instrumentName: ""
      };
      this.getInstrumentList();
    },

    /** 设备选择确认 */
    handleInstrumentConfirm() {
      // 更新选中的设备列表和ID列表
      this.selectedInstruments = [...this.selectedInstruments]; // 确保引用更新
      this.selectedInstrumentIds = this.selectedInstruments.map(instrument => instrument.instrumentId);
      this.instrumentDialogVisible = false;
      // 组装 itemInstrumentList
      const itemInstrumentList = this.selectedInstrumentIds.map(instrumentId => ({
        itemId: this.form.labtestItemsId || '',
        instrumentId: instrumentId // 使用已保存的 ID
      }));
    },

    /** 移除设备 */
    removeInstrument(instrumentId) {
      // 从选中的设备列表中移除
      this.selectedInstruments = this.selectedInstruments.filter(
        instrument => instrument.instrumentId !== instrumentId
      );

      // 更新选中的设备ID列表
      this.selectedInstrumentIds = this.selectedInstruments.map(instrument => instrument.instrumentId);
    },
    /** 处理保留小数位输入 */
    handleDecimalPlacesInput(value) {
      // 只允许输入数字，过滤非数字字符
      this.form.decimalPlaces = value.replace(/[^\d]/g, '');
    },

    /** 处理有效数字位输入 */
    handleSignificantDigitsInput(value) {
      // 只允许输入数字，过滤非数字字符
      this.form.significantDigits = value.replace(/[^\d]/g, '');
    },
    /** 互斥校验 - 不允许两个字段同时有值 */
    validateMutuallyExclusive(rule, value, callback) {
      const decimalPlaces = this.form.decimalPlaces;
      const significantDigits = this.form.significantDigits;

      // 如果两个字段都有值，则校验不通过
      if (decimalPlaces && decimalPlaces.trim() !== '' &&
        significantDigits && significantDigits.trim() !== '') {
        callback(new Error('小数位和数字位不能同时填写，请只填写其中一个'));
      } else {
        callback();
      }
    },
    /** 数字校验方法 */
    validateNumber(rule, value, callback) {
      if (value === '' || value === null || value === undefined) {
        // 允许为空
        callback();
        return;
      }

      // 检查是否为有效数字
      if (/^\d+$/.test(value)) {
        const numValue = parseInt(value);
        if (numValue >= 0) {
          callback();
        } else {
          callback(new Error('必须为非负整数'));
        }
      } else {
        callback(new Error('请输入有效的数字'));
      }
    },

    /** 获取实验地点（温湿度监控点）列表 */
    getLabLocationList() {
      // 查询所有启用的监控点，设置一个较大的分页
      listMonitor({ pageNum: 1, pageSize: 9999, isEnable: '0' }).then(response => {
        if (response.code === 200 && response.rows) {
          this.labLocationOptions = response.rows;
        } else {
          this.labLocationOptions = [];
          this.$modal.msgError("获取实验地点列表失败");
        }
      }).catch(() => {
        this.$modal.msgError("获取实验地点列表失败");
      });
    },


















  },
};
</script>
<style>
/* 让禁用的一级部门显示为灰色 */
.el-tree-node.is-disabled>.el-tree-node__content {
  color: #c0c4cc;
  cursor: not-allowed;
}

.el-tree-node.is-disabled>.el-tree-node__content .el-checkbox {
  cursor: not-allowed;
}
</style>