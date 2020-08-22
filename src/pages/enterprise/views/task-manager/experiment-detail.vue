<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="detailData.editData.status | statusTypeFilter" class="title-tag">{{ detailData.editData.status | statusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">【{{ detailData.editData.taskNo }}】{{ detailData.editData.name }}
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
              <el-tag v-show="detailData.editData.taskException && detailData.editData.taskException.length > 0 || detailData.editData.contractException" type="danger">异常</el-tag>
            </el-tooltip>
          </span>
          <el-dropdown v-if="buttonPermissions.includes(experimentEdit)" trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="buttonPermissions.includes(experimentEdit)" @click.native="edit">编辑</el-dropdown-item>
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
          <!-- <span class="detail-form-item">
            <span class="detail-form-name">负责人：</span>
            <span class="detail-form-value">{{ detailData.editData.curName }}</span>
          </span> -->
          <span class="detail-form-item">
            <span class="detail-form-name">负责部门：</span>
            <span class="detail-form-value">{{ detailData.editData.deptName }}</span>
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
        </div>
        <div class="container-line-item">
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
          <el-tab-pane v-if="detailData.editData.id" label="任务列表" name="myTaskList">
            <keep-alive>
              <task-of-experiment v-if="activeName==='myTaskList'" :experiment-id="detailData.editData.id" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- -----------------------------------------审批流程----------------------------------------- -->
      <!-- <div v-if="experimentApproveFlows.length > 0">
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
                        <el-button v-if="item.status === 4||item.status === 3" type="primary">{{ item.referNames }}</el-button>
                        <el-button v-else type="primary" plain>{{ item.referNames }}</el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-step>
                <el-step icon="el-icon-edit">
                  <template slot="icon">
                    <div class="buyApproveNode">
                      <svg-icon icon-class="awaitApprove" />
                      <div>待通过</div>
                    </div>
                  </template>
                </el-step>
              </el-steps>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div> -->
      <!-- ------------------------存储---------------------- -->
      <AataReport :contract-id="detailData.belongData.id" />
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
      <!-- ------------------------提交异常弹框---------------------- -->
      <!-- <el-dialog
        title="提交异常"
        :visible.sync="exceptionDialog"
        width="400px"
      >
        <el-form :model="exceptionForm" label-width="68px">
          <el-form-item label="异常原因">
            <el-input v-model="exceptionForm.remark" type="textarea" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="exceptionDialog = false">取消</el-button>
          <el-button type="primary" @click="exceptionSubmit">确定</el-button>
        </span>
      </el-dialog> -->
      <!-- ------------------------解决异常弹框---------------------- -->
      <!-- <el-dialog
        title="解决异常"
        :visible.sync="solveExceptionDialog"
        width="400px"
      >
        <span>确认异常已解决？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="solveExceptionDialog = false">取消</el-button>
          <el-button type="primary" @click="solveExceptionSubmit">确定</el-button>
        </span>
      </el-dialog> -->
      <!-- ------------------------审批弹框---------------------- -->
      <!-- <el-dialog
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
      </el-dialog> -->
    </div>
    <experiment-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @taskEdit="taskEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
import TaskOfExperiment from './components/taskOfExperiment'
// import relatedExperiment from './components/relatedExperiment'
import ExperimentEstablish from './components/experimentEstablish'
import { editExperiment, fetchDetail, editExperimentStatus, deleteExperiment } from '@/api/experiment'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import FileLinkList from '@/views/components/FileLinkList'
import OperateLog from '@/components/operateLog'
import AataReport from './components/dataReport'
export default {
  name: 'ExperimentDetail',
  components: { TaskOfExperiment, ExperimentEstablish, FileLinkList, OperateLog, AataReport },
  data() {
    return {
      loading: true,
      activeName: 'myTaskList',
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
      code: 'experiment'
      // 审批流程
      // experimentApproveFlows: [],
      // activeExperimentName: 'experimentApprove',
      // exceptionStatus: {},
      // exceptionDialog: false,
      // exceptionForm: {
      //   objId: undefined,
      //   code: 'experiment',
      //   remark: ''
      // },
      // 解决异常弹框
      // solveExceptionDialog: false,
      // 审批
      // canApproveBuy: false,
      // permit: false,
      // permitForm: {
      //   id: undefined,
      //   status: undefined,
      //   approveRemark: ''
      // }
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
    // 编辑实验
    experimentEdit() {
      return this.buttonPermission[this.platform].experimentEdit
    },
    // 停止 恢复实验
    stopTask() {
      return this.buttonPermission[this.platform].stopTask
    },
    // 删除实验
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
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const urlId = this.$route.query.id
      const detailRes = await fetchDetail({ id: urlId })
      if (!detailRes.data.experiment) {
        this.$message.error('该实验已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.detailData.editData = detailRes.data.experiment
      // this.experimentApproveFlows = detailRes.data.flows
      this.detailData.belongData = detailRes.data.contract
      // if (detailRes.data.contract.exception) {
      //   this.exceptionStatus = detailRes.data.contract.exception
      // }
      this.activities = detailRes.data.logs
      this.detailData.editData.formData = Object.assign(blankFormData, JSON.parse(this.detailData.editData.formData))
      // this.canApproveBuy = detailRes.data.canApproveBuy
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
      editExperiment(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.taskDetail()
        }
      })
    },
    changeStatus(statusNum) {
      editExperimentStatus({ id: this.detailData.editData.id, status: statusNum }).then(res => {
        this.taskDetail()
      })
    },
    delTask() {
      this.$confirm('此操作将永久删除该实验, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExperiment({ id: this.$route.query.id }).then(res => {
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
      this.$confirm('确认完成该实验?', '提示', {
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
    pause() {
      this.$confirm('即将暂停实验，确认暂停吗？', '暂停实验', {
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
