<template>
  <div class="bar-chart">
    <div v-if="source['refuseCount'] || source['refuseCount']===0" class="bar" :style="{ width: `${source['refuseCount']/total*100}%` }" style="background-color: #909399;" />
    <div v-if="source['approvingCount'] || source['approvingCount']===0" class="bar" :style="{ width: `${source['approvingCount']/total*100}%` }" style="background-color: #E6A23C;" />
    <div v-if="source['buyingCount'] || source['buyingCount']===0" class="bar" :style="{ width: `${source['buyingCount']/total*100}%` }" style="background-color: #4A90E2;" />
    <div v-if="source['backCount'] || source['backCount']===0" class="bar" :style="{ width: `${source['backCount']/total*100}%` }" style="background-color: #4A90E2;" />
    <div v-if="source['completeCount'] || source['completeCount']===0" class="bar" :style="{ width: `${source['completeCount']/total*100}%` }" style="background-color: #67C23A;" />
    <div v-if="source['stopCount'] || source['stopCount']===0" class="bar" :style="{ width: `${source['stopCount']/total*100}%` }" style="background-color: #F56C6C;" />
    <div v-if="source['cancelCount'] || source['cancelCount']===0" class="bar" :style="{ width: `${source['cancelCount']/total*100}%` }" style="background-color: #F56C6C;" />
  </div>
</template>

<script>
export default {
  props: {
    source: {
      type: Object,
      default: () => {
        return {
          refuseCount: 0,
          approvingCount: 0,
          buyingCount: 0,
          completeCount: 0,
          stopCount: 0,
          cancelCount: 0
        }
      }
    }
  },
  computed: {
    total() {
      let total = 0
      for (const i in this.source) {
        total += this.source[i]
      }
      if (total !== 0) {
        return total
      } else {
        return 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bar-chart {
    flex-grow: 1;
    position: relative;
  }

  // .bar-chart::before {
  //   content: '';
  //   position: absolute;
  //   width: 1px;
  //   height: 100%;
  //   left: 0;
  //   top: 0;
  //   background-color: #909399;
  // }
  .bar-chart{
    box-sizing: border-box;
    border-left: 1px solid #909399;
  }

  .bar {
    height: 14px;
    margin-bottom: 16px;
  }

  .bar:last-child {
    margin-bottom: 0;
  }
</style>
