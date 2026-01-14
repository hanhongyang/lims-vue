<template>
  <div>
    <el-dialog title="选择牧场" :visible.sync="visible" width="800px" top="5vh" append-to-body>
       <el-form :model="instrumentsqueryParams" ref="instrumentsref" size="small" :inline="true">

        <el-form-item label="设备名称" prop="instrumentName">
          <el-input v-model="instrumentsqueryParams.instrumentName" placeholder="请输入设备名称" clearable style="width: 240px"
            @keyup.enter.native="handleinstruments" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleinstruments">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetinstruments">重置</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table :data="agriMaterialList" ref="table" highlight-current-row v-loading="listLoading" style="width: 100%;"
        :row-key="getRowKeys" type="selection" @selection-change="handleSelectionChange" @row-click="clickRow"
        max-height="420">
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable"></el-table-column>
  <el-table-column label="设备名称" align="center" prop="instrumentName" min-width="200" />
          <el-table-column label="设备编码" align="center" prop="instrumentCode" min-width="200" />
          <el-table-column label="设备型号" align="center" prop="mdoelNumber" min-width="200" />
          <el-table-column label="类型" align="center" prop="type" min-width="200" />
          <el-table-column label="公司名称" align="center" prop="deptName" min-width="200" />
          <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="制单时间" align="center" prop="createTime" width="170"></el-table-column>
     
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination :current-page="instrumentsqueryParams.pageNum" layout="total , prev, pager, next"
          @current-change="handleCurrentChange" :page-size="instrumentsqueryParams.pageSize" :total="total"
          style="float:right;">
        </el-pagination>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSelectLandGrouping">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getinstrumentslist} from '@/api/Basicdata/TestMethod';
  export default {
    name: "selectLandSb",
    props: {
      instrumentslist: Array,
    },
    data () {
      return {
        total: 0,
        visible: false,
        listLoading: false,
        mullist: [],
        multipleSelectionAll: [],//所有选中的数据包含跨分页数据
        allCheck: false,
        agriMaterialList: [],
        getRowKeys (row) {
          return row.bsInstrumentsId;
        },
        instrumentsqueryParams: {
          pageNum: 1,
          pageSize: 10,
          instrumentName:"",
            isEnable:1,
        },
      };
    },
    created () {
    },
    methods: {
      // 显示弹框
      show () {
        this.mullist = [];
        this.agriMaterialList = [];
        this.multipleSelectionAll = [];
           this.instrumentsqueryParams= {
          pageNum: 1,
          pageSize: 10,
          instrumentName:"",
          isEnable:1,
        }
        this.getList();
        this.visible = true;
        if (this.$refs.table != undefined) {
          this.$refs.table.clearSelection();
        }
        this.multipleSelectionAll = this.instrumentslist.map(function (val) {
          return val.bsInstrumentsId;
        }).toString();
        this.mullist=JSON.parse(JSON.stringify(this.instrumentslist))

      },
         /** 搜索按钮操作 */
      handleinstruments() {
        this.instrumentsqueryParams.pageNum = 1
        this.getinstruments()
      },
      /** 重置按钮操作 */
      resetinstruments() {
        this.resetForm('instrumentsref')
        this.instrumentsqueryParams = {
            pageNum: 1,
          pageSize: 10,
          instrumentName: '',
          isEnable:1,
        }
        this.getlabTestList()
      },
      // 隐藏
      hide () {
        this.visible = false;
      },
      clickRow (row) {
        this.$refs.table.toggleRowSelection(row);
      },
      // 获取数据
      getList () {
        this.allCheck = false,
        getinstrumentslist(this.instrumentsqueryParams).then((response) => {
          if (response.code == 200) {
            this.agriMaterialList = response.rows;
            this.total = response.total;
            var queryland = [];
            for (var a = 0; a < this.instrumentslist.length; a++) {
              queryland.push(this.instrumentslist[a].bsInstrumentsId);
            }
            this.$nextTick(() => {
              this.agriMaterialList.forEach((row, index) => {
                if (queryland.indexOf(row.bsInstrumentsId) >= 0) {
                  this.$refs.table.toggleRowSelection(row, true);
                }
              });
            });
          }
        });
      },
      // 分页全选-选中框改变事件
      handleSelectionChange (val) {
        // 数据去重
        this.multipleSelectionAll = this.reduceSame(val);
        var tempmult = JSON.parse(JSON.stringify(this.multipleSelectionAll));
        // 选中所有选择框时勾选全选按钮
        if (this.multipleSelectionAll.length == this.total) {
          this.allCheck = true;
        }
        // 将row是对象数组数据转换为字符串
        this.multipleSelectionAll = this.multipleSelectionAll.map(function (val) {
          return val.bsInstrumentsId;
        }).toString();
        // 将row是对象数组数据转换为字符串
        this.mullist = tempmult;
        // 选中后的数据
        // console.log(this.multipleSelectionAll);
        // 选中后的数据
        // console.log(this.mullist);
      },
      // 分页全选-全选按钮change事件
      allCheckEvent () {
        let _this = this;
        if (_this.allCheck) {
          // 全选选中时当前页所有数据选中
          _this.agriMaterialList.forEach(row => {
            if (row) {
              _this.$refs.table.toggleRowSelection(row, true);
            }
          });
        } else {
          _this.$refs.table.clearSelection();
        }
      },
      // 分页全选-全选时禁用选择框
      checkSelectable (row, index) {
        return !this.allCheck;
      },
      // 数组对象去重
      reduceSame: function (arr) {
        let obj = {};
        return arr.reduce(function (prev, item) {
          obj[item.bsInstrumentsId] ? "" : (obj[item.bsInstrumentsId] = 1 && prev.push(item));
          return prev
            ;
        }, []);
      },
      // 分页
      handleCurrentChange (val) {
        this.instrumentsqueryParams.pageNum = val;
        this.getList();
      },
      // 确认
      handleSelectLandGrouping () {
        this.$emit('affirm', this.mullist);
      }
    },
    mounted () {

    },
    watch: {
      // 分页全选-监听数据变化
      agriMaterialList: {
        handler (value) {
          if (this.allCheck) {
            this.agriMaterialList.forEach(row => {
              if (row.bsInstrumentsId) {
                this.$refs.table.toggleRowSelection(row.bsInstrumentsId, true);
              }
            });
          }
        },
        deep: true
      },
    }
  }

</script>