<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="检测项目" prop="itemName">
        <el-input v-model="queryParams.itemName" placeholder="请输入检测项目" clearable @keyup.enter.native="handleQuery"
          style="width: 180px;" />
      </el-form-item>
      <el-form-item label="人员姓名" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入人员姓名" clearable @keyup.enter.native="handleQuery"
          style="width: 180px;" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['basicdata:userLabTestItem:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['basicdata:userLabTestItem:export']">导出</el-button>
      </el-col>
      <el-col :span="1.5">

      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 空数据提示 -->
    <div v-if="!loading && groupedUserList.length === 0" class="empty-container">
      <el-empty description="暂无数据" image-size="100">
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
      </el-empty>
    </div>
    <!-- 按人员分组的卡片式展示 -->
    <div v-loading="loading" class="user-item-container">
      <div v-for="user in groupedUserList" :key="user.userId" class="user-group">
        <div class="user-header">
          <div class="user-info">
            <span class="user-name">{{ user.nickName }}</span>
          </div>
          <div>
            <!-- <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleDelete(user)"
              v-hasPermi="['basicdata:userLabTestItem:export']">批量删除</el-button> -->
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleDelete(user)"
              v-hasPermi="['basicdata:userLabTestItem:edit']">批量删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleUpdateUser(user)"
              v-hasPermi="['basicdata:userLabTestItem:edit']">配置项目</el-button>

          </div>

        </div>

        <!-- 项目配置 -->
        <div class="config-section" v-if="hasItemConfig(user)">
          <h4><i class="el-icon-tickets"></i> 检测项目配置</h4>

          <div class="item-tag-container">
            <el-tag v-for="item in getItemConfigs(user)" :key="item.bsInvbillItemStandardId" class="item-tag"
              :type="item.userType == '2' ? 'warning' : 'success'" effect="light">
              {{ item.itemName }}
              <span style="font-weight: bold; margin-left: 5px;">
                {{ item.userType == '2' ? '[校对]' : '[检测]' }}
              </span>
              <span v-if="item.featureName" style="color: #909399; margin-left: 4px;">({{
                item.featureName }})</span>
            </el-tag>
          </div>
        </div>

      </div>
    </div>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

  </div>
</template>

<script>
import { getpagelist, deleteUserLabTestItem, deleteAllUserLabTestItem } from '@/api/Basicdata/RYJCXMcompare';

export default {
  name: "RYJCXMcompare",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 按人员分组后的数据
      groupedUserList: [],
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
        nickName: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      getpagelist(this.queryParams).then(response => {
        console.log(response);
        if (response.code == '200') {
          this.groupedUserList = response.rows;
          this.total = response.total;

          this.loading = false;
        }
      });
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
      //直接跳转
      this.$router.push('/Basicdata/RYJCXMcomparecreate');
    },

    /** 修改用户项目配置 */
    handleUpdateUser(user) {
      //直接跳转
      this.$router.push({
        path: '/Basicdata/RYJCXMcomparecreate',
        query: { id: user.userId },
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/basicdata/userLabTestItem/export', {
        ...this.queryParams
      }, `检测项目对照_${new Date().getTime()}.xlsx`);
    },
    /** 检查是否有项目配置 */
    hasItemConfig(user) {
      return user.userLabtestItems && user.userLabtestItems.some(item => item.userLabtestItemId);
    },
    /** 获取项目配置列表 */
    getItemConfigs(user) {
      return user.userLabtestItems ? user.userLabtestItems.filter(item => item.userLabtestItemId) : [];
    },
    // 选择变化时触发
    handleSelectionChange(val) {
      this.selectedItems = val.userLabtestItemId
      console.log(this.selectedItems, '11111111111')
    },
    handleDelete(user) {
      console.log(user.userId, '11111111')
      this.$modal.confirm(`是否整体删除 ${user.nickName} 的全部项目配置？`).then(() => {
        return deleteAllUserLabTestItem(user.userId);
      }).then(() => {
        this.$modal.msgSuccess("整体删除成功");
        this.getList();
      }).catch(() => { });
    },
    /** 删除配置 */
    handleDeleteConfig(config) {
      this.$modal.confirm(`是否确认删除该配置？`).then(() => {
        return deleteUserLabTestItem(config.userLabtestItemId);
      }).then(() => {
        this.$modal.msgSuccess("删除成功");
        this.getList();
      }).catch(() => { });
    },
  }

};
</script>

<style scoped>
.user-item-container {
  margin-bottom: 20px;
}

.user-group {
  margin-bottom: 24px;
  border: 1px solid #e6ebf5;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
}

.item-table {
  margin: 0;
}


.user-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* 动画效果 */
.user-group {
  transition: all 0.3s ease;
}

.user-group:hover {
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