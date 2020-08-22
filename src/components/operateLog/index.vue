<template>
  <div>
    <el-timeline v-if="isShowDefault" :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in defaultActivities"
        :key="index"
        :timestamp="activity.createTime"
      >
        <span class="link-type" @click="$router.push(`/person?id=${activity.operateId}`)">{{ activity.operateName }}&nbsp;</span>
        <span style="color: #a6a9ad;">{{ activity.content.split('&&')[0] }}</span>
        <span>{{ activity.content.split('&&')[1] }}</span>
      </el-timeline-item>
    </el-timeline>
    <el-timeline v-else :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :timestamp="activity.createTime"
      >
        <span class="link-type" @click="$router.push(`/person?id=${activity.operateId}`)">{{ activity.operateName }}&nbsp;</span>
        <span style="color: #a6a9ad;">{{ activity.content.split('&&')[0] }}</span>
        <span>{{ activity.content.split('&&')[1] }}</span>
      </el-timeline-item>
    </el-timeline>
    <div v-if="activities.length > 3" style="padding-left:70px;">
      <el-button v-if="isShowDefault" @click="isShowDefault = false">展开更多 <i class="el-icon-arrow-down" /></el-button>
      <el-button v-else @click="isShowDefault = true">收起 <i class="el-icon-arrow-up" /></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OperateLog',
  props: {
    activities: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDefault: true,
      reverse: false
    }
  },
  computed: {
    defaultActivities() {
      return this.activities.slice(0, 3)
    }
  }
}
</script>
