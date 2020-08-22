<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-title">【{{ editData.taskNo }}】{{ editData.name }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">归属任务：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/task-detail?id=${editData.taskId}`)">{{ editData.taskNo }} {{ editData.taskName }}</span>
        </div>
      </div>
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">实验记录详细内容</span>
        </div>
        <div class="flex">
          <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">描述：</div>
          <div style="flex-grow: 1; font-size: 14px;" class="container-line-item" v-html="editData.content" />
        </div>
        <div class="flex">
          <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
          <file-link-list :value="editData.files" style="margin-top: 6px;" />
        </div>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
  </div>
</template>

<script>
import { fetchRecordDetail } from '@/api/experiment'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
export default {
  name: 'CooperateRecordDetail',
  components: { FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      showEdit: false,
      // 项目日志
      editData: {
        files: ''
      },
      // 任务日志
      activities: [],
      urlId: ''
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      this.urlId = this.$route.query.id
      fetchRecordDetail({ id: this.urlId }).then(res => {
        this.editData = res.data.task
        this.activities = res.data.logs
        this.loading = false
      })
    }
  }
}
</script>
