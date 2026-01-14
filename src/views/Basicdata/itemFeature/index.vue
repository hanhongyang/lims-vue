<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="检测项目" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="特性" prop="featureName">
        <el-input v-model="queryParams.featureName" placeholder="请输入特性" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddFeature"
            v-hasPermi="['basicdata:itemFeature:add']">新增</el-button>
        </el-col>
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:itemFeature:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 空数据提示 -->
    <div v-if="!loading && itemFeatureList.length === 0" class="empty-container">
      <el-empty description="暂无数据" image-size="100">
        <el-button type="primary" size="mini" @click="handleAddFeature">新增特性</el-button>
      </el-empty>
    </div>
    <!-- 按项目分组的列表展示 -->
    <div v-loading="loading" class="item-feature-container">
      <div v-for="item in itemFeatureList" :key="item.itemId" class="item-group">
        <div class="item-header">
          <div class="user-info">
            <span class="item-name">{{ item.itemName }}</span>
          </div>
          <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleUpdateFeature(item)"
            v-hasPermi="['basicdata:itemFeature:edit']">配置特性</el-button>
        </div>
        <!-- 项目配置 -->
        <div class="config-section" v-if="hasItemConfig(item)">
          <h4><i class="el-icon-tickets"></i> 特性配置</h4>
          <el-table :data="getItemConfigs(item)" size="mini" class="config-table">
            <el-table-column label="特性名称" align="center" prop="featureName" min-width="200" />
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteFeature(scope.row)"
                  v-hasPermi="['basicdata:itemFeature:remove']">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />


  </div>
</template>

<script>
import { listItemFeature, getItemFeature, delItemFeature, addItemFeature, updateItemFeature, batchAddItemFeature, batchUpdateItemFeature } from "@/api/Basicdata/itemFeature";

export default {
  name: "ItemFeature",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 特性列表
      itemFeatureList: [],
      // 当前操作的项目
      currentItem: null,
      // 操作模式：add/edit
      mode: 'add',

      // 临时选中的特性
      selectedFeature: null,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: null,
        featureName: null,
        deptId: null,
        isDelete: '0',
        isEnable: null
      },
      // 表单参数
      form: {
        itemId: null,
        itemName: null,
        featureIds: [], // 用于批量添加和修改
        isEnable: "1"
      },
      // 表单校验
      rules: {
        featureIds: [
          { required: true, message: "请至少选择一个特性", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询检测项目特性对应列表 */
    getList() {
      this.loading = true;
      listItemFeature(this.queryParams).then(response => {
        this.itemFeatureList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch(error => {
        console.error("获取列表失败:", error);
        this.loading = false;
      });
    },

    removeFeature(index) {
      this.form.featureIds.splice(index, 1);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.currentItem = null;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        itemId: null,
        itemName: null,
        featureIds: [],
        isEnable: "1"
      };
      this.selectedFeature = null;
      this.resetForm("form");
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


    handleAddFeature(item) {
      this.$router.push({
        path: '/Basicdata/ItemFeatureCreate',
        query: {
          itemId: item.itemId,
          itemName: item.itemName,
          mode: 'add',
          t: Date.now() // 添加时间戳防止路由缓存
        }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },
    /** 修改项目特性 */
    handleUpdateFeature(item) {
      this.$router.push({
        path: '/Basicdata/ItemFeatureCreate',
        query: {
          itemId: item.itemId,
          itemName: item.itemName,
          mode: 'edit',
          t: Date.now() // 添加时间戳防止路由缓存
        }
      }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('路由跳转错误:', err);
        }
      });
    },
    /** 检查是否有项目配置 */
    hasItemConfig(item) {
      return item.featureList && item.featureList.some(item => item.bsLabtestItemFeatureId);
    },
    /** 获取项目配置列表 */
    getItemConfigs(item) {
      return item.featureList ? item.featureList.filter(item => item.bsLabtestItemFeatureId) : [];
    },
    /** 删除单个特性 */
    handleDeleteFeature(item, feature) {
      console.log(item, '1')
      this.$modal.confirm(`是否确认删除项目【${item.itemName}】的特性【${item.featureName}】？`).then(() => {
        return delItemFeature(item.bsLabtestItemFeatureId);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.getList();
      }).catch(() => { });
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('basicdata/itemFeature/export', {
        ...this.queryParams
      }, `itemFeature_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style scoped>
.item-feature-container {
  margin-bottom: 20px;
}

.item-group {
  margin-bottom: 24px;
  border: 1px solid #e6ebf5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.item-name {
  font-size: 18px;
  font-weight: bold;
}

.item-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.feature-table {
  margin: 0;
}

.empty-feature {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
  background-color: #fafafa;
  border-top: 1px solid #ebeef5;
}

.feature-select-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.selected-features {
  margin-top: 10px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.selected-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.feature-tag {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .item-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .item-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 动画效果 */
.item-group {
  transition: all 0.3s ease;
}

.item-group:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.config-table {
  margin: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.config-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.config-section:last-child {
  border-bottom: none;
}

.config-section h4 {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-table {
  margin: 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.empty-config {
  padding: 40px 20px;
  text-align: center;
  background: #fafafa;
}

.config-section {
  transition: all 0.3s ease;
}

.config-section:hover {
  background: #f8f9fa;
}
</style>