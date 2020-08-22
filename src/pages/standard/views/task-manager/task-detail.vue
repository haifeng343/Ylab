<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="detailData.editData.status | statusTypeFilter" class="title-tag">{{ detailData.editData.status | statusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 460px)">【{{ detailData.editData.taskNo }}】{{ detailData.editData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="buttonPermissions.includes(newTask)" @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopTask)" :disabled="detailData.editData.status !== 3" @click.native="changeStatus(1)">恢复</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newTask)" :disabled="detailData.editData.status !== 1" @click.native="confirmEnd(4)">完成</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopTask)" :disabled="detailData.editData.status !== 1" @click.native="changeStatus(3)">暂停</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newTask)" :disabled="detailData.editData.status !== 0" @click.native="changeStatus(1)">开始</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(deleteTask)" @click.native="delTask">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="detailData.belongData" class="container-line-item">
          <span class="detail-form-name">归属项目：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/contract-detail?id=${detailData.editData.tid}`)">{{ detailData.belongData.contractNo }} {{ detailData.belongData.name }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">类型：</span>
            <span class="detail-form-value">{{ detailData.editData.typeName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">负责人：</span>
            <span class="detail-form-value">{{ detailData.editData.curName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">优先级：</span>
            <span class="detail-form-value">{{ detailData.editData.level }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">计划开始：</span>
            <span class="detail-form-value">{{ detailData.editData.planStartTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">计划结束：</span>
            <span class="detail-form-value">{{ detailData.editData.planEndTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">实际开始：</span>
            <span class="detail-form-value">{{ detailData.editData.startTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">实际结束：</span>
            <span class="detail-form-value">{{ detailData.editData.endTime }}</span>
          </span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span class="detail-form-value">{{ detailData.editData.formData[column.code] }}</span>
          </span>
        </div>
      </div>
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">详情内容</span>
        </div>
        <div class="flex" style="font-size: 14px;">
          <div>描述：</div>
          <div v-if="detailData.editData.content" style="width:50%; font-size: 14px;" v-html="detailData.editData.content" />
          <div v-else style="color: #909399;">未输入详情描述</div>
        </div>
        <div class="flex">
          <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
          <file-link-list :value="detailData.editData.files" style="margin-top: 6px;" />
        </div>
      </div>
      <div style="position: relative;">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane v-if="detailData.editData.id" label="实验记录" name="myRecordList">
            <keep-alive>
              <record-list-of-task v-if="activeName==='myRecordList'" :task-id="detailData.editData.id" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane v-if="detailData.editData.tid" label="关联任务" name="relatedTasks">
            <keep-alive>
              <related-task v-if="activeName==='relatedTasks'" :tid="detailData.editData.tid" @taskIdChanged="taskIdChangedHandler" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <el-button
          v-if="activeName==='myRecordList'"
          size="mini"
          type="primary"
          style="position: absolute; right: 16px; top: 6px;"
          @click="$router.push(`/contract-manager/record-create?taskName=${detailData.editData.name}&taskId=${detailData.editData.id}`)"
        >
          新建
        </el-button>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <task-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @taskEdit="taskEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
import RecordListOfTask from './components/RecordListOfTask'
import relatedTask from './components/relatedTask'
import TaskEstablish from './components/task-establish'
import { editTask, fetchDetail, editTaskStatus, deleteTask } from '@/api/task'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
export default {
  name: 'TaskDetail',
  components: { RecordListOfTask, relatedTask, TaskEstablish, FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'myRecordList',
      showEdit: false,
      detailData: {
        belongData: {
          contractNo: '',
          name: ''
        },
        editData: {
          id: '',
          status: 0,
          name: '',
          tid: '',
          typeId: '',
          curId: '',
          level: '',
          planStartTime: '',
          planEndTime: '',
          // 富文本编辑框内容
          content: '',
          formData: {},
          files: ''
        }
      },
      // 编辑数据中转
      transfer: {},
      // 任务日志
      activities: [],
      // 自定义字段
      columnList: [],
      code: 'task'
    }
  },
  computed: {
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    // 新建 编辑项目
    newTask() {
      return this.buttonPermission[this.platform].newTask
    },
    // 停止 恢复项目
    stopTask() {
      return this.buttonPermission[this.platform].stopTask
    },
    // 删除项目
    deleteTask() {
      return this.buttonPermission[this.platform].deleteTask
    }
  },
  created() {
    this.taskDetail()
  },
  methods: {

    taskIdChangedHandler() {
      this.taskDetail()
    },
    async taskDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      console.log(this.columnList)
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const urlId = this.$route.query.id
      const detailRes = await fetchDetail({ id: urlId })
      if (!detailRes.data.task) {
        this.$message.error('该任务已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.detailData.editData = detailRes.data.task
      this.detailData.belongData = detailRes.data.contract
      this.activities = detailRes.data.logs
      this.detailData.editData.formData = Object.assign(blankFormData, JSON.parse(this.detailData.editData.formData))
      this.loading = false
    },
    edit() {
      this.transfer = deepClone(this.detailData.editData)
      this.showEdit = true
    },
    cancelEdit() {
      this.showEdit = false
    },
    taskEdit() {
      const postData = deepClone(this.transfer)
      postData.formData = JSON.stringify(this.transfer.formData)
      editTask(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.taskDetail()
        }
      })
    },
    changeStatus(statusNum) {
      editTaskStatus({ id: this.detailData.editData.id, status: statusNum }).then(res => {
        this.taskDetail()
      })
    },
    delTask() {
      this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask({ id: this.$route.query.id }).then(res => {
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
    },
    // 确认结束
    confirmEnd(statusNum) {
      this.$confirm('确认结束该任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeStatus(statusNum)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>
