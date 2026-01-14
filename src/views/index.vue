<template>
  <div class="bodywarp">
    <div class="boxcardwrap">
      <div v-for="group in visibleGroups" :key="group.key" class="row-card">
        <div class="row-title">{{ group.title }}</div>

        <div class="row-content">
          <div
            v-for="item in group.visibleItems"
            :key="item.key"
            class="col-card"
            @click="handleJump(item)"
          >
            <stat-card
              :title="item.title"
              :value="getValue(item)"
              :icon="item.icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StatCard from '@/components/StatCard/index.vue'
import { statistics } from '@/api/home/dashboard'
import { getReportCounts as getFeedReportCounts } from '@/api/CentralLaboratory/jczxFeedReport'
import { listjczxPcrReportBaseId } from '@/api/CentralLaboratory/jczxPCRReport'
import { getReportCounts as getBloodReportCounts } from '@/api/CentralLaboratory/jczxBloodReport'
import { checkPermi, checkRole } from '@/utils/permission'

export default {
  name: 'InspectionDashboard',
  components: { StatCard },

  data() {
    return {
      stats: {},
      reportStatus: {},

      // =================== 配置驱动核心 ===================
      groups: [
        {
          key: 'feed',
          title: '饲料检测',
          items: [
            {
              key: 'feed-chemistry',
              title: '待化验（化学法）',
              icon: 'staricon01.png',
              perms: ['labtest:feedTask:query'],
              valuePath: 'stats.feed.waitChemistry',
              route: '/CentralLaboratory/Task/feedTask',
              tab: 'chemistry'
            },
            {
              key: 'feed-moisture',
              title: '待化验（初水分）',
              icon: 'staricon02.png',
              perms: ['labtest:feedTask:list'],
              valuePath: 'stats.feed.waitMoisture',
              route: '/CentralLaboratory/Task/feedTask',
              tab: 'csf'
            },
            {
              key: 'feed-submit',
              title: '待提交',
              icon: 'staricon03.png',
              perms: ['labtest:jczxFeedResultBase:list'],
              valuePath: 'stats.feed.waitSubmit',
              route: '/CentralLaboratory/jczxFeedResultBase',
              tab: '1'
            },
            {
              key: 'feed-check',
              title: '待校对',
              icon: 'staricon04.png',
              perms: ['labtest:jczxFeedResultBase:list'],
              valuePath: 'stats.feed.waitCheck',
              route: '/CentralLaboratory/jczxFeedResultBase',
              tab: '2'
            },
             {
              key: 'nir-task',
              title: '待化验（近红外）',
              icon: 'staricon01.png',
              perms: ['labtest:jhwTask:query'],
              valuePath: 'stats.nir.waitTest',
              route: '/CentralLaboratory/Task/JHYTask'
            },
            {
              key: 'nir-submit',
              title: '待提交（近红外）',
              icon: 'staricon02.png',
              perms: ['labtest:sampleTest:jhw'],
              valuePath: 'stats.nir.waitSubmit',
              route: '/CentralLaboratory/indexHY',
              tab: '1'
            },
            {
              key: 'nir-check',
              title: '待校对（近红外）',
              icon: 'staricon03.png',
              perms: ['labtest:sampleTest:jhw'],
              valuePath: 'stats.nir.waitCheck',
              route: '/CentralLaboratory/indexHY',
              tab: '2'
            },
            {
              key: 'feed-report-design',
              title: '报告待编制',
              icon: 'staricon01.png',
              perms: ['labtest:jczxFeedReport:list'],
              roles: ['feed:report:dbz'],
              valuePath: 'reportStatus.feed.reportWaitDesign',
              route: '/CentralLaboratory/HY/jczxFeedReport',
              tab: '0'
            },
            {
              key: 'feed-report-check',
              title: '报告待审核',
              icon: 'staricon02.png',
              perms: ['labtest:jczxFeedReport:list'],
              roles: ['feed:report:dsh'],
              valuePath: 'reportStatus.feed.reportWaitCheck',
              route: '/CentralLaboratory/HY/jczxFeedReport',
              tab: '2'
            },
            {
              key: 'feed-report-agree',
              title: '报告待批准',
              icon: 'staricon03.png',
              perms: ['labtest:jczxFeedReport:list'],
              roles: ['feed:report:dpz'],
              valuePath: 'reportStatus.feed.reportWaitAgree',
              route: '/CentralLaboratory/HY/jczxFeedReport',
              tab: '3'
            },
            {
              key: 'feed-report-send',
              title: '报告待发送',
              icon: 'staricon04.png',
              perms: ['labtest:jczxFeedReport:list'],
              roles: ['feed:report:dfs'],
              valuePath: 'reportStatus.feed.reportWaitSend',
              route: '/CentralLaboratory/HY/jczxFeedReport',
              tab: '4'
            }
          ]
        },

        {
          key: 'pcr',
          title: 'PCR 检测',
          items: [
            {
              key: 'pcr-task',
              title: '待化验',
              icon: 'staricon01.png',
              perms: ['labtest:pcrTask:query'],
              valuePath: 'stats.pcr.waitTest',
              route: '/CentralLaboratory/Task/pcrTask'
            },
            {
              key: 'pcr-report',
              title: '报告待发送',
              icon: 'staricon04.png',
              perms: ['basicdata:jczxPcrReport:list'],
              valuePath: 'reportStatus.pcr.waitSend',
              route: '/CentralLaboratory/HY/jczxPcrReport'
            }
          ]
        },

        {
          key: 'disease',
          title: '疾病检测',
          items: [
            {
              key: 'disease-task',
              title: '待化验',
              icon: 'staricon01.png',
              perms: ['labtest:bloodTask:query'],
              valuePath: 'stats.disease.waitTest',
              route: '/CentralLaboratory/Task/JbTask'
            },
            {
              key: 'disease-report-wait-design',
              title: '报告待编制',
              icon: 'staricon02.png',
              perms: ['labtest:report:jibing'],
              valuePath: 'reportStatus.disease.waitDesign',
              route: '/CentralLaboratory/HY/xyJb',
              tab: '0'
            },
            {
              key: 'disease-report-design',
              title: '报告制作中',
              icon: 'staricon02.png',
              perms: ['labtest:report:jibing'],
              valuePath: 'reportStatus.disease.designing',
              route: '/CentralLaboratory/HY/xyJb',
              tab: '1'
            },
            {
              key: 'disease-report-check',
              title: '报告待审核',
              icon: 'staricon03.png',
              perms: ['labtest:report:jibing'],
              valuePath: 'reportStatus.disease.waitCheck',
              route: '/CentralLaboratory/HY/xyJb',
              tab: '2'
            },
            {
              key: 'disease-report-send',
              title: '报告待发送',
              icon: 'staricon04.png',
              perms: ['labtest:report:jibing'],
              valuePath: 'reportStatus.disease.waitSend',
              route: '/CentralLaboratory/HY/xyJb',
              tab: '4'
            }
          ]
        },

        {
          key: 'biochemistry',
          title: '生化检测',
          items: [
            {
              key: 'bio-task',
              title: '待化验',
              icon: 'staricon01.png',
              perms: ['labtest:shTask:query'],
              valuePath: 'stats.biochemistry.waitTest',
              route: '/CentralLaboratory/Task/shTask'
            },
            {
              key: 'bio-report',
              title: '报告待发送',
              icon: 'staricon04.png',
              perms: ['labtest:report:shenghua'],
              valuePath: 'reportStatus.biochemistry.waitSend',
              route: '/CentralLaboratory/HY/xySh'
            }
          ]
        },

        {
          key: 'earlyPregnancy',
          title: '早孕检测',
          items: [
            {
              key: 'zy-task',
              title: '待化验',
              icon: 'staricon01.png',
              perms: ['labtest:zyTask:query'],
              valuePath: 'stats.earlyPregnancy.waitTest',
              route: '/CentralLaboratory/Task/zyTask'
            },
            {
              key: 'zy-report',
              title: '报告待发送',
              icon: 'staricon04.png',
              perms: ['labtest:report:zaoyun'],
              valuePath: 'reportStatus.earlyPregnancy.waitSend',
              route: '/CentralLaboratory/HY/xyZy'
            }
          ]
        },

        {
          key: 'nir',
          title: '近红外检测',
          items: [
            {
              key: 'nir-task',
              title: '待化验（近红外）',
              icon: 'staricon01.png',
              perms: ['labtest:jhwTask:query'],
              valuePath: 'stats.nir.waitTest',
              route: '/CentralLaboratory/Task/JHYTask'
            },
            {
              key: 'nir-submit',
              title: '待提交（近红外）',
              icon: 'staricon02.png',
              perms: ['labtest:sampleTest:jhw'],
              valuePath: 'stats.nir.waitSubmit',
              route: '/CentralLaboratory/indexHY',
              tab: '1'
            },
            {
              key: 'nir-check',
              title: '待校对（近红外）',
              icon: 'staricon03.png',
              perms: ['labtest:sampleTest:jhw'],
              valuePath: 'stats.nir.waitCheck',
              route: '/CentralLaboratory/indexHY',
              tab: '2'
            }
          ]
        }
      ]
    }
  },

  computed: {
    // 只显示至少有一个权限的模块
    visibleGroups() {
      return this.groups
        .map((group) => {
          // 过滤当前模块中“有权限的卡片”
          const visibleItems = group.items.filter(item => {
            const rolePass = !item.roles || checkRole(item.roles)
            const permPass = !item.perms || checkPermi(item.perms)
            return rolePass && permPass
          })
          return { ...group, visibleItems }
        })
        .filter((group) => group.visibleItems.length > 0)
    }
  },

  mounted() {
    this.getStatistics()
    this.getReportStatusCount()
  },

  methods: {
    getStatistics() {
      statistics().then((res) => {
        this.stats = res.data
      })
    },

    // 获取报告状态统计
    getReportStatusCount() {
      getFeedReportCounts().then((res) => {
        this.$set(this.reportStatus, 'feed', {
          reportWaitDesign: res.data.status_0,
          reportWaitCheck: res.data.status_2,
          reportWaitAgree: res.data.status_3,
          reportWaitSend: res.data.status_4
        })
      })

      listjczxPcrReportBaseId({ status: '4' }).then((res) => {
        this.$set(this.reportStatus, 'pcr', { waitSend: res.total })
      })

      getBloodReportCounts({ status: '4', bloodTaskItemType: '8' }).then(
        (res) => {
          this.$set(this.reportStatus, 'biochemistry', {
            waitSend: res.data.status_0
          })
        }
      )

      getBloodReportCounts({ status: '0', bloodTaskItemType: '8,9' }).then(
        (res) => {
          this.$set(this.reportStatus, 'disease', {
            waitDesign: res.data.status_0,
            designing: res.data.status_1,
            waitCheck: res.data.status_2,
            waitSend: res.data.status_4
          })
        }
      )

      getBloodReportCounts({ status: '4', bloodTaskItemType: '9' }).then(
        (res) => {
          this.$set(this.reportStatus, 'earlyPregnancy', {
            waitSend: res.data.status_0
          })
        }
      )
    },

    handleJump(item) {
      this.$router.push({
        path: item.route,
        query: item.tab ? { tab: item.tab } : {}
      })
    },

    getValue(item) {
      return item.valuePath
        .split('.')
        .reduce((obj, key) => (obj ? obj[key] : 0), this)
    }
  }
}
</script>
<style scoped>
.boxcardwrap {
  padding: 16px;
}
.row-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.05);
}
.row-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}
.row-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.col-card {
  cursor: pointer;
}
</style>
