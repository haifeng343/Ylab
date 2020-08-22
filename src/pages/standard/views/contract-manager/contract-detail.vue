<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="editData.status | statusTypeFilter" class="title-tag">{{ editData.status | statusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">【 {{ editData.contractNo }} 】 {{ editData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopContract)" :disabled="editData.status !== 3" @click.native="changeStatus(1)">恢复</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" :disabled="editData.status !== 1" @click.native="confirmEnd(4)">完成</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopContract)" :disabled="editData.status !== 1" @click.native="changeStatus(3)">暂停</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" :disabled="editData.status !== 0" @click.native="changeStatus(1)">开始</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(deleteContract)" @click.native="delContract">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">类型：</span>
            <span class="detail-form-value">{{ editData.typeName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">负责人：</span>
            <span class="detail-form-value">{{ editData.curName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">优先级：</span>
            <span class="detail-form-value">{{ editData.level }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">计划开始：</span>
            <span class="detail-form-value">{{ editData.planStartTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">计划结束：</span>
            <span class="detail-form-value">{{ editData.planEndTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">实际开始：</span>
            <span class="detail-form-value">{{ editData.startTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">实际结束：</span>
            <span class="detail-form-value">{{ editData.endTime }}</span>
          </span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span class="detail-form-value">{{ editData.formData[column.code] }}</span>
          </span>
        </div>
      </div>
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">详情内容</span>
        </div>
        <div class="flex" style="font-size: 14px;">
          <div>描述：</div>
          <div v-if="editData.description" style="width:50%; font-size: 14px;" v-html="editData.description" />
          <div v-else style="color: #909399;">未输入详情描述</div>
        </div>
        <div class="flex">
          <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
          <file-link-list :value="editData.files" style="margin-top: 6px;" />
        </div>
      </div>
      <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="任务列表" name="childTask">
          <keep-alive>
            <tab-pane v-if="activeName==='childTask'" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="采购列表" name="purchaselist">
          <keep-alive>
            <purchaselist v-if="activeName==='purchaselist'" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <contract-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @contractEdit="contractEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
import tabPane from '@/views/contract-manager/components/TabPane'
import purchaselist from '@/views/contract-manager/components/purchaselist'
import ContractEstablish from './components/ContractEstablish'
import { editProject, fetchDetail, editContractStatus, deleteProject } from '@/api/contract'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
export default {
  name: 'ContractDetail',
  components: { tabPane, purchaselist, ContractEstablish, FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'childTask',
      showEdit: false,
      editData: {
        status: 0,
        name: '',
        contractTypeId: '',
        curId: '',
        level: '',
        planStartTime: '',
        planEndTime: '',
        // 富文本编辑框内容
        description: '',
        formData: {},
        files: ''
      },
      // 编辑数据中转
      transfer: {},
      // 项目日志
      activities: [],
      // 子任务
      subTask: [],
      // 自定义字段
      columnList: [],
      code: 'contract'
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
    newContract() {
      return this.buttonPermission[this.platform].newContract
    },
    // 停止 恢复项目
    stopContract() {
      return this.buttonPermission[this.platform].stopContract
    },
    // 删除项目
    deleteContract() {
      return this.buttonPermission[this.platform].deleteContract
    }
  },
  created() {
    this.contractDetail()
  },
  methods: {
    async contractDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const urlId = this.$route.query.id
      const detailRes = await fetchDetail({ id: urlId })
      if (!detailRes.data.contract) {
        this.$message.error('该项目已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.editData = detailRes.data.contract
      this.activities = detailRes.data.log
      this.editData.formData = Object.assign(blankFormData, JSON.parse(this.editData.formData))
      this.loading = false
    },
    edit() {
      this.transfer = deepClone(this.editData)
      this.showEdit = true
    },
    contractEdit() {
      const postData = deepClone(this.transfer)
      postData.formData = JSON.stringify(this.transfer.formData)
      editProject(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.contractDetail()
        }
      })
    },
    changeStatus(statusNum) {
      editContractStatus({ id: this.editData.id, status: statusNum }).then(res => {
        this.contractDetail()
      })
    },
    delContract() {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProject({ id: this.$route.query.id }).then(res => {
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
    cancelEdit() {
      this.showEdit = false
    },
    // 确认结束
    confirmEnd(statusNum) {
      this.$confirm('确认结束该项目?', '提示', {
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
