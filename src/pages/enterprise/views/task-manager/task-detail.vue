<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag v-if="detailData.editData.canStart && detailData.editData.status === 0" class="can-start">可开始</el-tag>
          <el-tag v-else-if="detailData.editData.isInApprove" type="primary" class="title-tag">审批中</el-tag>
          <el-tag v-else :type="detailData.editData.status | statusTypeFilter" class="title-tag">{{ detailData.editData.status | statusFilter }}</el-tag>
          <span v-if="detailData.editData.taskException && detailData.editData.taskException.length > 0 || detailData.editData.contractException" class="detail-title" style="width: calc(100% - 400px); color: red;">【{{ detailData.editData.taskNo }}】{{ detailData.editData.name }}
            <el-tooltip placement="top">
              <div slot="content">
                <div v-if="detailData.editData.contractException">项目异常：{{ detailData.editData.contractException.remark }}</div>
                <div v-if="detailData.editData.taskException && detailData.editData.taskException.length > 0" style="display: flex;">
                  <div>任务异常：</div>
                  <div>
                    <div v-for="(item,index) in detailData.editData.taskException" :key="index">{{ item.remark }}</div>
                  </div>
                </div>
              </div>
              <el-tag type="danger">异常</el-tag>
            </el-tooltip>
          </span>
          <!-- <span v-else class="detail-title" style="width: calc(100% - 200px)">【{{ detailData.editData.taskNo }}】{{ detailData.editData.name }} <el-tag v-if="detailData.belongData && detailData.belongData.h3Id" type="primary">合作</el-tag></span> -->
          <span v-else class="detail-title" style="width: calc(100% - 200px)">【{{ detailData.editData.taskNo }}】{{ detailData.editData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="canApproveBuy" @click.native="permit = true">审批</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(enterpriseTaskEdit)" @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="!(exceptionStatus && exceptionStatus.status === 0)" @click.native="solveExceptionDialog = true">解决异常</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(enterpriseTaskExeption)" :disabled="exceptionStatus && exceptionStatus.status === 0" @click.native="exceptionDialog = true">报告异常</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(enterpriseTaskStop)" :disabled="detailData.editData.status !== 3" @click.native="changeStatus(1)">恢复</el-dropdown-item>
              <el-dropdown-item :disabled="detailData.editData.status !== 1 || detailData.editData.isInApprove" @click.native="confirmEnd(4)">完成</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(enterpriseTaskStop)" :disabled="detailData.editData.status !== 1" @click.native="pause">暂停</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(enterpriseTaskEdit)" :disabled="!detailData.editData.canStart || detailData.editData.status !== 0" @click.native="changeStatus(1)">开始</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="detailData.experiment" class="container-line-item">
          <span class="detail-form-name">归属实验：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/experiment-detail?id=${detailData.experiment.id}`)">{{ detailData.experiment.taskNo }} {{ detailData.experiment.name }}</span>
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
          <!-- <span class="detail-form-item">
            <span class="detail-form-name">优先级：</span>
            <span class="detail-form-value">{{ detailData.editData.level }}</span>
          </span> -->
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
      <!-- <div style="position: relative;">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane v-if="detailData.editData.tid" label="关联任务" name="relatedTasks">
            <keep-alive>
              <related-task v-if="activeName==='relatedTasks'" :tid="detailData.editData.tid" @taskIdChanged="taskIdChangedHandler" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <el-button
          v-if="activeName==='myTaskList'"
          size="mini"
          type="primary"
          style="position: absolute; right: 16px; top: 6px;"
          @click="$router.push(`/contract-manager/task-create?taskName=${detailData.editData.name}&taskId=${detailData.editData.id}`)"
        >
          新建
        </el-button>
      </div> -->
      <!-- -----------------------------------------审批流程----------------------------------------- -->
      <div v-if="experimentApproveFlows.length > 0">
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">审批流程</span>
        </div>
        <el-tabs v-model="activeExperimentName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="实验审批流程" name="experimentApprove">
            <div style="padding: 24px 0;">
              <el-steps v-if="experimentApproveFlows" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in experimentApproveFlows" :key="index" icon="el-icon-edit">
                  <template slot="icon">
                    <div class="buyApproveNode">
                      <svg-icon v-if="item.status === 4" icon-class="sucessApprove" />
                      <svg-icon v-else-if="item.status === 3" icon-class="failApprove" />
                      <svg-icon v-else icon-class="awaitApprove" />
                      <div v-if="item.status === 4">审批通过</div>
                      <div v-else-if="item.status === 3">审批拒绝</div>
                      <div v-else>待审批</div>
                    </div>
                  </template>
                  <template slot="title">
                    <div style="margin-top: 20px;">
                      <el-tooltip class="item" effect="dark" :content="item.referEmps" placement="top-start">
                        <el-button v-if="item.status === 4||item.status === 3" type="primary">{{ item.approveName }}</el-button>
                        <el-button v-else type="primary" plain>{{ item.referNames }}</el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-step>
                <!-- <el-step icon="el-icon-edit">
                  <template slot="icon">
                    <div class="buyApproveNode">
                      <svg-icon icon-class="awaitApprove" />
                      <div>待通过</div>
                    </div>
                  </template>
                </el-step> -->
              </el-steps>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
      <!-- ------------------------提交异常弹框---------------------- -->
      <el-dialog
        title="提交异常"
        :visible.sync="exceptionDialog"
        width="400px"
        @close="exceptionCancel"
      >
        <el-form :model="exceptionForm" label-width="68px">
          <el-form-item label="异常原因">
            <el-input v-model="exceptionForm.remark" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exceptionCancel">取消</el-button>
          <el-button type="primary" @click="exceptionSubmit">确定</el-button>
        </span>
      </el-dialog>
      <!-- ------------------------解决异常弹框---------------------- -->
      <el-dialog
        title="解决异常"
        :visible.sync="solveExceptionDialog"
        width="400px"
      >
        <span>确认异常已解决？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="solveExceptionDialog = false">取消</el-button>
          <el-button type="primary" @click="solveExceptionSubmit">确定</el-button>
        </span>
      </el-dialog>
      <!-- ------------------------审批弹框---------------------- -->
      <el-dialog
        title="审批"
        :visible.sync="permit"
        width="400px"
      >
        <el-form :model="permitForm" label-width="68px">
          <el-form-item label="审批意见">
            <el-input v-model="permitForm.approveRemark" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="permitReject">拒绝</el-button>
          <el-button type="primary" @click="permitApprove">通过</el-button>
        </span>
      </el-dialog>
    </div>
    <task-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @taskEdit="taskEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
// import relatedTask from './components/relatedTask'
import TaskEstablish from './components/TaskEstablish'
import { editTask, fetchDetail, editTaskStatus, deleteTask } from '@/api/task'
import { exception, solveException } from '@/api/contract'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
export default {
  name: 'TaskDetail',
  components: { TaskEstablish, FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'relatedTasks',
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
        },
        experiment: {}
      },
      // 编辑数据中转
      transfer: {},
      // 任务日志
      activities: [],
      // 自定义字段
      columnList: [],
      code: 'task',
      isShowDefault: true,
      // 审批流程
      experimentApproveFlows: [],
      activeExperimentName: 'experimentApprove',
      exceptionStatus: null,
      exceptionDialog: false,
      exceptionForm: {
        objId: undefined,
        code: 'task',
        remark: ''
      },
      // 解决异常弹框
      solveExceptionDialog: false,
      // 审批
      canApproveBuy: false,
      permit: false,
      permitForm: {
        id: undefined,
        status: undefined,
        approveRemark: ''
      }
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
    // 开始、编辑任务
    enterpriseTaskEdit() {
      return this.buttonPermission[this.platform].enterpriseTaskEdit
    },
    // 停止、恢复任务
    enterpriseTaskStop() {
      return this.buttonPermission[this.platform].enterpriseTaskStop
    },
    // 报告异常
    enterpriseTaskExeption() {
      return this.buttonPermission[this.platform].enterpriseTaskExeption
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
      this.experimentApproveFlows = detailRes.data.flows
      this.detailData.belongData = detailRes.data.contract
      this.detailData.experiment = detailRes.data.experiment
      if (detailRes.data.task.taskException.length > 0) {
        this.exceptionStatus = detailRes.data.task.taskException[0]
      }
      this.activities = detailRes.data.logs
      this.detailData.editData.formData = Object.assign(blankFormData, JSON.parse(this.detailData.editData.formData))
      this.canApproveBuy = detailRes.data.canApproveBuy
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
      this.$confirm('即将删除任务，确认删除吗？', '删除任务', {
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
      this.$confirm('确认完成该任务?', '提示', {
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
    },
    // 取消提交异常
    exceptionCancel() {
      this.exceptionDialog = false
      this.exceptionForm = {
        objId: undefined,
        code: 'task',
        remark: ''
      }
    },
    // 提交异常
    exceptionSubmit() {
      this.exceptionForm.objId = this.$route.query.id
      exception(this.exceptionForm).then(res => {
        if (res.code === 200) {
          this.exceptionDialog = false
          this.taskDetail()
        }
      })
    },
    // 解决异常
    solveExceptionSubmit() {
      solveException({ id: this.exceptionStatus.id, status: 4 }).then(res => {
        if (res.code === 200) {
          this.solveExceptionDialog = false
          this.exceptionStatus = null
          this.taskDetail()
        }
      })
    },
    // 审批拒绝
    permitReject() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 13
      editTaskStatus(this.permitForm).then(res => {
        if (res.code === 200) {
          this.permit = false
          this.taskDetail()
        }
      })
    },
    // 审批通过
    permitApprove() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 4
      editTaskStatus(this.permitForm).then(res => {
        if (res.code === 200) {
          this.permit = false
          this.taskDetail()
        }
      })
    },
    // 暂停
    pause() {
      this.$confirm('即将暂停任务，确认暂停吗？', '暂停任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeStatus(3)
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
