<template>
  <div ref="flowStage" class="contract-flow">
    <el-tabs v-if="periodList.length>0" v-model="activeName" type="border-card">
      <el-tab-pane v-for="period in periodList" :key="period.id" :name="String(period.id)">
        <span slot="label">
          {{ period.name }}
          <el-tag :type="statusType[period.status]" class="title-tag" style="margin: 8px 0;">
            {{ statusContent[period.status] }}
          </el-tag>
        </span>
        <flow-tree ref="experimentTree" :period-id="period.id" :period="period" :contract-id="contractId" @changeListStatus="$emit('changeListStatus')" />
      </el-tab-pane>
    </el-tabs>
    <!-- <svg-icon style="position: absolute; right: 110px; top: 11px; font-size: 18px; color: #5a5e66; cursor: pointer;" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="fullscreen" /> -->
  </div>
</template>

<script>

import screenfull from 'screenfull'
import { getPeriod } from '@/api/period'
import FlowTree from './FlowTree'

export default {
  name: 'ContractFlow',
  components: {
    FlowTree
  },
  props: {
    contractId: {
      type: String,
      default: ''
    },
    upDataDtail: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeName: '',
      isFullscreen: false,
      statusType: ['info', 'warning', 'danger', 'danger', 'sucess'],
      statusContent: ['未开始', '审批中', '未提审', '未通过', '已通过'],
      // 流程列表
      periodList: []
    }
  },
  created() {
    this.getPeriodList()
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    async getPeriodList() {
      const res = await getPeriod({ objId: this.$route.query.id, pageNo: 1, pageSize: 100, isTemplate: 0 })
      this.periodList = res.data.list
      if (this.periodList.length > 0) {
        this.activeName = String(this.periodList[0].id)
      }
    },
    fullscreen() {
      if (!screenfull.enabled) {
        this.$message({
          message: '您的浏览器不支持全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle(this.$refs.flowStage)
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .contract-flow {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .contract-flow >>> svg {
    font-size: 14px;
  }
</style>
