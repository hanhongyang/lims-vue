<template>
    <div class="dashboard-container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h4>样品化验单</h4>
            <el-button type="success" icon="el-icon-back" @click="handleBackClick">返回后台管理系统</el-button>
        </div>

        <div class="grid-container">
            <div v-for="(module, index) in modules" :key="index" class="module-card" @click="handleModuleClick(module)">
                <div class="icon" :class="module.iconClass">
                    {{ module.icon }}
                    <span v-if="module.tag" class="promo-tag">{{ module.tag }}</span>
                </div>
                <div class="module-name">{{ module.name }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardGrid',
    data() {
        return {
            modules: [

                { name: '检测任务', icon: '🛍️', iconClass: 'icon-blue' },

                { name: '样品化验', icon: '📋', iconClass: 'icon-green' },

                // { name: '评价管理', icon: '✅', iconClass: 'icon-green' },
                // { name: '账户提现', icon: '📁', iconClass: 'icon-orange' },
                { name: '检测任务（近红外）', icon: '🔄', iconClass: 'icon-orange' },
                { name: '样品化验（近红外）', icon: '📊', iconClass: 'icon-purple' },
                // { name: '流量推广', icon: '🚀', iconClass: 'icon-purple', tag: '立减50' },
                // { name: '达人合作', icon: '⭐', iconClass: 'icon-purple' },
                // { name: '发布商品', icon: '➕', iconClass: 'icon-blue' },
                // { name: '优惠券', icon: '🎫', iconClass: 'icon-orange' }
            ]
        }
    },
    methods: {
        handleModuleClick(module) {
            // 这里可以根据模块名称进行路由跳转或其他操作
            switch (module.name) {
                case '检测任务':
                    this.$router.push('/feedTaskPad')
                    break
                case '样品化验':
                    this.$router.push('/jczxFeedResultBasePad')
                    break
                case '检测任务（近红外）':
                    this.$router.push('/JHYTaskPad')
                    break
                case '样品化验（近红外）':
                    this.$router.push('/JHYResultPad')
                    break

                default:
                    this.$message.info(`您点击了：${module.name}`)
            }
        },
        handleBackClick() {
            this.$router.push('/')
        },

    }
}
</script>

<style scoped>
.dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 30px;
}

.header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
}

.header h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
}

.header p {
    color: #666;
    margin-top: 8px;
    font-size: 14px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
}

.module-card {
    background: white;
    border-radius: 10px;
    padding: 25px 15px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    position: relative;
}

.module-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border-color: #e0e0e0;
}

.icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 15px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: white;
    position: relative;
}

.module-name {
    font-size: 15px;
    font-weight: 500;
    color: #333;
}

/* 图标颜色 */
.icon-blue {
    background-color: #4a7bff;
}

.icon-green {
    background-color: #34c759;
}

.icon-orange {
    background-color: #ff9500;
}

.icon-purple {
    background-color: #af52de;
}

/* 特殊标签 */
.promo-tag {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff3b30;
    color: white;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .grid-container {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 768px) {
    .grid-container {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .grid-container {
        grid-template-columns: 1fr;
    }
}
</style>