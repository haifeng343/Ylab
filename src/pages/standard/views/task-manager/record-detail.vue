<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-title">【{{ editData.recordNo }}】{{ editData.title }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="deleteRecord">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">归属任务：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/task-detail?id=${editData.taskId}`)">{{ editData.taskNo }} {{ editData.taskName }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">关联人：</span>
            <span class="detail-form-value">{{ editData.empNames }}</span>
          </span>
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
    <record-establish v-if="showEdit" :edit-data="transfer" @recordEdit="recordEdit" @handleCancel="handleCancel" />
  </div>
</template>

<script>
import RecordEstablish from './components/record-establish'
import { fetchRecordDetail, editRecord, delRecord } from '@/api/task'
import { deepClone } from '@/utils'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
export default {
  name: 'TaskDetail',
  components: { RecordEstablish, FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      showEdit: false,
      // 项目日志
      editData: {
        files: ''
      },
      // 编辑数据中转
      transfer: {},
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
        this.editData = res.data.obj
        this.activities = res.data.logs
        this.loading = false
      })
    },
    edit() {
      this.transfer = deepClone(this.editData)
      if (this.transfer.empIds && this.transfer.empIds !== '') {
        this.transfer.empIds = this.transfer.empIds.split(',').map(item => Number(item))
      } else {
        this.transfer.empIds = []
      }
      this.showEdit = true
    },
    recordEdit() {
      const postData = deepClone(this.transfer)
      postData.empIds = postData.empIds.join(',')
      editRecord(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.getDetail()
        }
      })
    },
    handleCancel() {
      this.showEdit = false
    },
    deleteRecord() {
      this.$confirm('此操作将永久删除该实验记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delRecord({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            setTimeout(() => {
              this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
            }, 1000)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
