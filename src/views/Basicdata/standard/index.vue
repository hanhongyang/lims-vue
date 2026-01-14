<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="80px">
            <el-form-item label="物料名称" prop="invbillName">
                <el-input v-model="queryParams.invbillName" placeholder="请输入物料名称" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <!--<el-form-item label="执行标准" prop="zxbz">
                <el-input v-model="queryParams.zxbz" placeholder="请输入执行标准" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>-->
            <el-form-item label="物料编码" prop="invbillCode">
                <el-input v-model="queryParams.invbillCode" placeholder="请输入物料编码" clearable
                    @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="启用状态" prop="isEnable">
                <el-select v-model="queryParams.isEnable" placeholder="请选择状态" clearable style="width: 100px">
                    <el-option label="启用" value="1" />
                    <el-option label="停用" value="0" />
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
                    v-hasPermi="['basicdata:standard:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['basicdata:standard:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <!-- 空数据提示 -->
        <div v-if="!loading && materialList.length === 0" class="empty-container">
            <el-empty description="暂无数据" image-size="100">
                <el-button type="primary" size="mini" @click="handleAdd">新增标准</el-button>
            </el-empty>
        </div>
        <!-- 按物料分组的列表展示 -->
        <div v-loading="loading" class="material-standard-container">
            <div v-for="material in materialList" :key="material.invbillCode" class="material-group">
                <div class="material-header">
                    <div class="material-info">
                        <span class="material-name">{{ material.invbillName }}</span>
                        <span class="material-code" style="font-size: 14px; opacity: 0.8;">
                            ({{ material.invbillCode }})
                        </span>
                        <span class="dept-name">{{ material.deptName
                            }}</span>
                    </div>
                    <el-button size="mini" type="warning" icon="el-icon-edit" @click="handleUpdateMaterial(material)"
                        v-hasPermi="['basicdata:standard:edit']">配置标准</el-button>
                </div>

                <!-- 项目配置 -->
                <div class="config-section" v-if="hasItemConfig(material)">
                    <h4><i class="el-icon-tickets"></i> 检测项目配置</h4>

                    <div class="item-tag-container">
                        <el-tag v-for="item in getItemConfigs(material)" :key="item.bsInvbillItemStandardId"
                            class="item-tag" :type="item.isEnable === '1' ? 'success' : 'info'" effect="light">
                            {{ item.itemName }}
                            <span v-if="item.featureName" style="color: #909399; margin-left: 4px;">({{
                                item.featureName}})</span>
                        </el-tag>
                    </div>
                </div>

            </div>
        </div>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { listStandard, delStandard } from "@/api/Basicdata/standard";

export default {
    name: "MaterialStandard",
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 物料标准列表数据
            materialList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                invbillName: null,
                isEnable: null
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询物料标准列表 */
        getList() {
            this.loading = true;
            listStandard(this.queryParams).then(response => {
                this.materialList = response.rows;
                this.total = response.total;
                this.loading = false;
            }).catch(error => {
                console.error("获取列表失败:", error);
                this.loading = false;
            });
        },

        /** 检查是否有项目配置 */
        hasItemConfig(material) {
            return material.standardList && material.standardList.some(item => item.itemId);
        },



        /** 获取项目配置列表 */
        getItemConfigs(material) {
            return material.standardList ? material.standardList.filter(item => item.itemId) : [];
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

            this.$router.push('/Basicdata/StandardCreate').catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },

        /** 配置物料标准 */
        handleUpdateMaterial(material) {
            // 动态路由跳转到编辑页面
            this.$router.push({
                path: '/Basicdata/StandardCreate',
                query: {
                    invbillCode: material.invbillCode,
                    deptId: material.deptId,
                    // 添加时间戳防止路由缓存
                    t: Date.now()
                }
            }).catch(err => {
                if (err.name !== 'NavigationDuplicated') {
                    console.error('路由跳转错误:', err);
                }
            });
        },
        /** 删除配置 */
        handleDeleteConfig(config) {
            this.$modal.confirm(`是否确认删除该配置？`).then(() => {
                return delStandard(config.bsInvbillItemStandardId);
            }).then(() => {
                this.$modal.msgSuccess("删除成功");
                this.getList();
            }).catch(() => { });
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download('basicdata/standard/export', {
                ...this.queryParams
            }, `materialStandard_${new Date().getTime()}.xlsx`);
        }
    }
};
</script>

<style scoped>
.material-standard-container {
    margin-bottom: 20px;
}

.material-group {
    margin-bottom: 24px;
    border: 1px solid #e6ebf5;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.material-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.material-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.material-name {
    font-size: 18px;
    font-weight: bold;
}

.dept-name {
    font-size: 12px;
    background: rgba(255, 255, 255, 0.2);
    padding: 2px 8px;
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

.item-tag-container {
    display: flex;
    flex-wrap: wrap;
    /* 关键：自动换行 */
    gap: 8px;
    /* 标签之间的间距 */
    padding-top: 5px;
    /* 距离标题的间距 */
}

.item-tag {
    font-size: 13px;
    height: 28px;
    line-height: 26px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .material-header {
        flex-direction: column;
        gap: 12px;
        align-items: flex-start;
    }

    .material-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}

/* 动画效果 */
.material-group {
    transition: all 0.3s ease;
}

.material-group:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.config-section {
    transition: all 0.3s ease;
}

.config-section:hover {
    background: #f8f9fa;
}
</style>