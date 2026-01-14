<template>
  <div class="app-container">
    <el-card class="full-height-card">
      <!-- 查询条件 -->
      <div class="filter-container">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
          <el-form-item label="年份">
            <el-select v-model="queryParams.year" placeholder="选择年份" clearable style="width: 120px">
              <el-option
                v-for="item in yearOptions"
                :key="item"
                :label="item + '年'"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="月份">
            <el-select v-model="queryParams.month" placeholder="选择月份" clearable style="width: 120px">
              <el-option
                v-for="item in monthOptions"
                :key="item"
                :label="item + '月'"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" icon="el-icon-search">查询</el-button>
            <el-button @click="resetQuery" icon="el-icon-refresh">重置</el-button>
            <el-button type="success" @click="initFromHolidayApi" icon="el-icon-download">初始化所选年工作日</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 日历视图 -->
      <div class="calendar-container">
        <div class="calendar-header">
          <h3>{{ currentYear }}年{{ currentMonth }}月</h3>
          <div>
            <el-button-group>
              <el-button @click="prevMonth" icon="el-icon-arrow-left">上个月</el-button>
              <el-button @click="nextMonth">下个月<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 星期标题 -->
        <div class="week-header">
          <div v-for="day in weekDays" :key="day" class="week-day">{{ day }}</div>
        </div>

        <!-- 日历内容 -->
        <div class="calendar-body">
          <div 
            v-for="day in calendarDays" 
            :key="day.dateStr"
            :class="['calendar-day', 
                     { 'other-month': !day.isCurrentMonth, 
                       'workday': day.isWorkday && day.isCurrentMonth, 
                       'non-workday': !day.isWorkday && day.isCurrentMonth,
                       'today': day.isToday }]"
            @click="toggleWorkdayStatus(day)"
          >
            <div class="day-header">
              <span class="day-number">{{ day.day }}</span>
              <span v-if="day.isCurrentMonth" class="day-type-tag">
                <el-tag 
                  v-if="day.isWorkday" 
                  size="mini" 
                  type="primary" 
                  effect="plain"
                >班</el-tag>
                <el-tag 
                  v-else 
                  size="mini" 
                  type="warning" 
                  effect="plain"
                >休</el-tag>
              </span>
            </div>
            <div class="day-footer" v-if="day.isCurrentMonth && day.sourceType === 2">
              <el-tag size="mini" type="info" effect="plain">已修改</el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 图例说明 -->
      <div class="legend-container">
        <div class="legend-item">
          <div class="color-box workday"></div>
          <span>工作日(蓝色)</span>
        </div>
        <div class="legend-item">
          <div class="color-box non-workday"></div>
          <span>非工作日(黄色)</span>
        </div>
        <div class="legend-item">
          <div class="color-box today"></div>
          <span>今天(边框蓝色)</span>
        </div>
      </div>
    </el-card>

    <!-- 初始化API数据对话框 -->
    <el-dialog
      title="从节假日API初始化数据"
      :visible.sync="initDialogVisible"
      width="50%"
      :before-close="handleInitDialogClose"
    >
      <el-alert
        title="将从节假日API获取数据并更新到数据库，此操作可能会覆盖现有修改"
        type="warning"
        show-icon
        style="margin-bottom: 20px"
      >
      </el-alert>
      <el-form :model="initForm" label-width="120px">
        <el-form-item label="年份">
          <el-select v-model="initForm.year" placeholder="请选择年份" style="width: 200px">
            <el-option
              v-for="item in yearOptions"
              :key="item"
              :label="item + '年'"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="initDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmInit" :loading="initLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { listByYearMonth, updateWorkdayStatus, initFromHolidayApi } from "@/api/Basicdata/workdayConfig";

export default {
  name: "WorkdayConfig",
  data() {
    // 获取当前日期
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    return {
      // 查询参数
      queryParams: {
        year: currentYear,
        month: currentMonth
      },
      // 当前显示的年份和月份
      currentYear: currentYear,
      currentMonth: currentMonth,
      // 数据列表
      dayList: [],
      // 对话框控制
      initDialogVisible: false,
      initLoading: false,
      initForm: {
        year: currentYear
      },
      // 选项数据
      yearOptions: Array.from({length: 10}, (_, i) => currentYear - 5 + i),
      monthOptions: Array.from({length: 12}, (_, i) => i + 1),
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    };
  },
  computed: {
    // 计算日历显示所需的天数数组
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth, 0);
      const today = new Date();
      const todayStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      
      // 获取当月第一天是星期几 (0是周日，转换为1-7表示周一到周日)
      let firstDayOfWeek = firstDay.getDay();
      if (firstDayOfWeek === 0) firstDayOfWeek = 7; // 周日转换为7
      
      // 填充上个月的空白天数
      const prevMonthLastDay = new Date(this.currentYear, this.currentMonth - 1, 0).getDate();
      for (let i = firstDayOfWeek - 1; i > 0; i--) {
        const day = prevMonthLastDay - i + 1;
        const dateStr = this.formatDateStr(
          this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear,
          this.currentMonth === 1 ? 12 : this.currentMonth - 1,
          day
        );
        
        days.push({
          dateStr,
          year: this.currentMonth === 1 ? this.currentYear - 1 : this.currentYear,
          month: this.currentMonth === 1 ? 12 : this.currentMonth - 1,
          day,
          isWorkday: false,
          isCurrentMonth: false,
          isToday: false
        });
      }
      
      // 填充当月的天数
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = this.formatDateStr(this.currentYear, this.currentMonth, i);
        const dayData = this.dayList.find(item => item.dateStr === dateStr) || {
          dateStr,
          year: this.currentYear,
          month: this.currentMonth,
          day: i,
          isWorkday: false,
          weekDay: new Date(this.currentYear, this.currentMonth - 1, i).getDay() || 7,
          sourceType: 1
        };
        
        days.push({
          ...dayData,
          isCurrentMonth: true,
          isToday: dateStr === todayStr
        });
      }
      
      // 填充下个月的空白天数
      const nextMonthDays = 42 - days.length; // 6行7列共42个格子
      for (let i = 1; i <= nextMonthDays; i++) {
        const dateStr = this.formatDateStr(
          this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear,
          this.currentMonth === 12 ? 1 : this.currentMonth + 1,
          i
        );
        
        days.push({
          dateStr,
          year: this.currentMonth === 12 ? this.currentYear + 1 : this.currentYear,
          month: this.currentMonth === 12 ? 1 : this.currentMonth + 1,
          day: i,
          isWorkday: false,
          isCurrentMonth: false,
          isToday: false
        });
      }
      
      return days;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取工作日配置列表
    getList() {
      listByYearMonth(this.currentYear, this.currentMonth).then(response => {
        this.dayList = response.data;
      });
    },
    
    // 处理查询
    handleQuery() {
      this.currentYear = this.queryParams.year;
      this.currentMonth = this.queryParams.month;
      this.getList();
    },
    
    // 重置查询
    resetQuery() {
      const currentDate = new Date();
      this.queryParams = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
      };
      this.handleQuery();
    },
    
    // 切换上个月
    prevMonth() {
      if (this.currentMonth === 1) {
        this.currentMonth = 12;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.updateQueryParams();
      this.getList();
    },
    
    // 切换下个月
    nextMonth() {
      if (this.currentMonth === 12) {
        this.currentMonth = 1;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.updateQueryParams();
      this.getList();
    },
    
    // 更新查询参数
    updateQueryParams() {
      this.queryParams.year = this.currentYear;
      this.queryParams.month = this.currentMonth;
    },
    
    // 切换工作日状态
    toggleWorkdayStatus(day) {
      if (!day.isCurrentMonth) return;
      
      this.$confirm(`确定要将【${day.year}-${day.month}-${day.day}】设置为${day.isWorkday ? '非工作日' : '工作日'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateWorkdayStatus({
          dateStr: day.dateStr,
          isWorkday: day.isWorkday ? 0 : 1
        }).then(response => {
          this.$message.success('修改成功');
          this.getList(); // 重新获取数据刷新页面
        });
      }).catch(() => {
        this.$message.info('已取消修改');
      });
    },
    
    // 打开初始化对话框
    initFromHolidayApi() {
      this.initForm.year = this.currentYear;
      this.initDialogVisible = true;
    },
    
    // 确认初始化
    confirmInit() {
      this.initLoading = true;
      initFromHolidayApi(this.initForm.year).then(response => {
        this.$message.success('初始化成功');
        this.initDialogVisible = false;
        this.getList(); // 重新获取数据
      }).finally(() => {
        this.initLoading = false;
      });
    },
    
    // 处理初始化对话框关闭
    handleInitDialogClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    
    // 格式化日期字符串为YYYYMMDD格式
    formatDateStr(year, month, day) {
      return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
.app-container {
  height: 88vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.full-height-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.filter-container {
  margin-bottom: 15px;
}

.calendar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* 重要：允许内容收缩 */
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  padding: 8px 4px;
  background-color: #f5f7fa;
  font-weight: bold;
  font-size: 13px;
}

.calendar-body {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 4px;
  min-height: 0; /* 重要：允许内容收缩 */
}

.calendar-day {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 0; /* 重要：允许内容收缩 */
}

.calendar-day:hover {
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.calendar-day.other-month {
  background-color: #f9f9f9;
  color: #c0c4cc;
  cursor: not-allowed;
}

.calendar-day.workday {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

.calendar-day.non-workday {
  background-color: #fdf6ec;
  border-color: #faecd8;
}

.calendar-day.today {
  border: 2px solid #409EFF;
  box-shadow: 0 0 6px rgba(64, 158, 255, 0.3);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.day-number {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.calendar-day.other-month .day-number {
  color: #c0c4cc;
}

.day-type-tag {
  margin-left: 4px;
}

.day-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.legend-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 15px;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: #f5f7fa;
  border-radius: 3px;
  font-size: 12px;
}

.color-box {
  width: 16px;
  height: 16px;
  margin-right: 6px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
}

.color-box.workday {
  background-color: #ecf5ff;
  border-color: #b3d8ff;
}

.color-box.non-workday {
  background-color: #fdf6ec;
  border-color: #faecd8;
}

.color-box.today {
  background-color: white;
  border: 2px solid #409EFF;
}

/* 响应式调整 */
@media (max-height: 700px) {
  .calendar-day {
    padding: 4px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .week-day {
    padding: 6px 2px;
    font-size: 12px;
  }
}
</style>