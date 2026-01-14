<template>
  <div>
    <el-dialog title="选择项目" :visible.sync="visible" width="800px" top="5vh" append-to-body>
       <el-form :model="itemsqueryParams" ref="itemsref" size="small" :inline="true">

        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="itemsqueryParams.itemName" placeholder="请输入项目名称" clearable style="width: 240px"
            @keyup.enter.native="handleitems" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleitems">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetitems">重置</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table :data="agriMaterialList" ref="table" highlight-current-row v-loading="listLoading" style="width: 100%;"
        :row-key="getRowKeys" type="selection" @selection-change="handleSelectionChange" @row-click="clickRow"
        max-height="420">
        <el-table-column type="selection" :reserve-selection="true" :selectable="checkSelectable"></el-table-column>
      <el-table-column label="检测项目名称" align="center" prop="itemName" min-width="200" />
          <el-table-column label="检测项目编码" align="center" prop="itemCode" min-width="200" />
          <el-table-column label="制单人" align="center" prop="createBy" width="100" :show-overflow-tooltip="true" />
          <el-table-column label="制单时间" align="center" prop="createTime" width="170"></el-table-column>
     
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination :current-page="itemsqueryParams.pageNum" layout="total , prev, pager, next"
          @current-change="handleCurrentChange" :page-size="itemsqueryParams.pageSize" :total="total"
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
  import { getpagelabTestlist} from '@/api/Basicdata/RYJCXMcompare';
  export default {
    name: "selectLandSb",
    props: {
      labtestItemsList: Array,
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
          return row.labtestItemsId;
        },
        itemsqueryParams: {
          pageNum: 1,
          pageSize: 10,
          itemName:"",
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
        this.itemsqueryParams= {
          pageNum: 1,
          pageSize: 10,
          itemName:"",
          isEnable:1,
        }
        this.getList();
        this.visible = true;
        if (this.$refs.table != undefined) {
          this.$refs.table.clearSelection();
        }
        this.multipleSelectionAll = this.labtestItemsList.map(function (val) {
          return val.labtestItemsId;
        }).toString();
        this.mullist=JSON.parse(JSON.stringify(this.labtestItemsList))

      },
         /** 搜索按钮操作 */
      handleitems() {
        this.itemsqueryParams.pageNum = 1
        this.getitems()
      },
      /** 重置按钮操作 */
      resetitems() {
        this.resetForm('itemsref')
        this.itemsqueryParams = {
            pageNum: 1,
          pageSize: 10,
          itemName: '',
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
        getpagelabTestlist(this.itemsqueryParams).then((response) => {
          if (response.code == 200) {
            this.agriMaterialList = response.rows;
            this.total = response.total;
            var queryland = [];
            for (var a = 0; a < this.labtestItemsList.length; a++) {
              queryland.push(this.labtestItemsList[a].labtestItemsId);
            }
            this.$nextTick(() => {
              this.agriMaterialList.forEach((row, index) => {
                if (queryland.indexOf(row.labtestItemsId) >= 0) {
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
          return val.labtestItemsId;
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
          obj[item.labtestItemsId] ? "" : (obj[item.labtestItemsId] = 1 && prev.push(item));
          return prev
            ;
        }, []);
      },
      // 分页
      handleCurrentChange (val) {
        this.itemsqueryParams.pageNum = val;
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
              if (row.labtestItemsId) {
                this.$refs.table.toggleRowSelection(row.labtestItemsId, true);
              }
            });
          }
        },
        deep: true
      },
    }
  }

</script>