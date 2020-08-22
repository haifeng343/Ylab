<template>
  <div v-loading="loading">
    <div v-show="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="editData.status | statusTypeFilter" class="title-tag">{{ editData.status | statusFilter }}</el-tag>
          <span v-if="editData.taskException && editData.taskException.length > 0 || editData.contractException" class="detail-title" style="width: calc(100% - 500px); color: red;">【 {{ editData.contractNo }} 】 {{ editData.name }}
            <el-tooltip placement="top">
              <div slot="content">
                <div v-if="editData.contractException">项目异常：{{ editData.contractException.remark }}</div>
                <div v-if="editData.taskException && editData.taskException.length > 0" style="display: flex;">
                  <div>任务异常：</div>
                  <div>
                    <div v-for="(item,index) in editData.taskException" :key="index">{{ item.remark }}</div>
                  </div>
                </div>
              </div>
              <el-tag type="danger" style="margin-left: 8px;">异常</el-tag>
            </el-tooltip>
          </span>
          <!-- <span class="detail-title" style="width: calc(100% - 500px)">【 {{ editData.contractNo }} 】 {{ editData.name }} <el-tag v-if="editData.h3Id" type="primary">合作</el-tag></span> -->
          <span v-else class="detail-title" style="width: calc(100% - 200px)">【 {{ editData.contractNo }} 】 {{ editData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="canApproveBuy" @click.native="permit = true">审批</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="!(exceptionStatus && exceptionStatus.status === 0)" @click.native="solveExceptionDialog = true">解决异常</el-dropdown-item>
              <el-dropdown-item :disabled="exceptionStatus && exceptionStatus.status === 0" @click.native="exceptionDialog = true">报告异常</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopContract)" :disabled="editData.status !== 3" @click.native="changeStatus(1)">恢复</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" :disabled="editData.status !== 1 || editData.isInApprove" @click.native="confirmEnd(4)">完成</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(stopContract)" :disabled="editData.status !== 1" @click.native="pause">暂停</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(newContract)" :disabled="editData.status !== 0" @click.native="changeStatus(1)">开始</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(deleteContract)" @click.native="delContract">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">业务合同：</span>
          <span class="detail-form-value">{{ editData.h3Name }}</span>
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
        <!-- <el-tab-pane label="任务列表" name="childTask">
          <keep-alive>
            <tab-pane v-if="activeName==='childTask'" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="采购列表" name="purchaselist">
          <keep-alive>
            <purchaselist v-if="activeName==='purchaselist'" />
          </keep-alive>
        </el-tab-pane> -->
        <el-tab-pane label="实验列表" name="experimentlist">
          <keep-alive>
            <experiment-list v-if="activeName==='experimentlist'" ref="experimentlist" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="采购列表" name="purchaselist">
          <keep-alive>
            <purchaselist v-if="activeName==='purchaselist'" />
          </keep-alive>
        </el-tab-pane>
        <el-tab-pane label="领用列表" name="outStorelist">
          <keep-alive>
            <outstore-list v-if="activeName==='outStorelist'" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>

      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">实验流程</span>
        <el-dropdown>
          <el-button
            v-if="buttonPermissions.includes(processTree)"
            type="text"
            icon="el-icon-plus"
            size="medium"
            style="margin-left: 10px;"
          >新建流程</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="newProcess[0].name = ''; showNewProcess = true;">新建流程</el-dropdown-item>
            <el-dropdown-item @click.native="openSelectTemPlate">从模板选择</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <contract-flow ref="contractFlow" :contract-id="$route.query.id" :up-data-dtail="contractDetail" @changeListStatus="changeListStatus" />
      <el-dialog
        title="新建流程"
        :visible.sync="showNewProcess"
        width="400px"
      >
        <el-form :model="newProcess">
          <el-form-item>
            <el-input v-model="newProcess[0].name" type="text" placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="showNewProcess = false">取消</el-button>
          <el-button type="primary" @click="setNewProcess">提交</el-button>
        </span>
      </el-dialog>
      <!-- -----------------------------------------审批流程----------------------------------------- -->
      <div v-if="contractApproveFlows.length > 0">
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">审批流程</span>
        </div>
        <el-tabs v-model="activeContractName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="项目审批流程" name="contractApprove">
            <div style="padding: 24px 0;">
              <el-steps v-if="contractApproveFlows" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in contractApproveFlows" :key="index" icon="el-icon-edit">
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
    <contract-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @contractEdit="contractEdit" @cancelEdit="cancelEdit" />
    <!-- ------------------------从模板选择弹框---------------------- -->
    <el-dialog
      title="模板选择"
      :visible.sync="showSelectTemPlate"
      width="1080px"
    >
      <div>
        <el-link type="info" :underline="false" @click="isShowDialodTree = false ; templatePath = undefined">所有模板</el-link>
        <span v-if="templatePath"><i class="el-icon-arrow-right" /><el-link type="info" :underline="false">{{ templatePath }}</el-link>
        </span>
      </div>
      <div v-if="!isShowDialodTree" style="position: relative">
        <el-table
          :data="temPlateList"
          border
          fit
          style="width: 100%;cursor:pointer';"
          @selection-change="handleCurrentTemplate"
        >
          <el-table-column
            type="selection"
            width="39"
          />
          <el-table-column label="名称" min-width="260">
            <template slot-scope="{row}">
              <span class="link-type" @click="toProcessDetail(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center" width="110">
            <template slot-scope="{row}">
              <span>{{ row.createName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="132" class-name="small-padding">
            <template slot-scope="{row}">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" width="132" class-name="small-padding">
            <template slot-scope="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="temPlateTotal>0" :total="temPlateTotal" :page.sync="temPlatelistQuery.pageNo" :limit.sync="temPlatelistQuery.pageSize" @pagination="paginationHandler" />
        <div style="color: #909399;position: absolute;left: 0;bottom: 12px;">选择模版,点击模版名称可查看详情</div>
      </div>
      <div v-else class="selectTemplate">
        <flow-tree v-if="processDetail.id" ref="flowTree" :period-id="processDetail.id" :period="processDetail" :need-approve="false" :contract-id="String(processDetail.contract.id)" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="showSelectTemPlate = false">取消</el-button>
        <el-button type="primary" @click="sendProcess">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import experimentList from './components/ExperimentList'
import purchaselist from '@/views/contract-manager/components/purchaselist'
import outstoreList from './components/OutStoreList'
import ContractEstablish from './components/ContractEstablish'
import ContractFlow from './components/ContractFlow'
import FileLinkList from '@/views/components/FileLinkList'
import Pagination from '@/components/Pagination'
import { getProcessList, getProcessDetail } from '@/api/permission'
import { editProject, fetchDetail, editContractStatus, deleteProject, exception, solveException, contractPermit } from '@/api/contract'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import OperateLog from '@/components/operateLog'
import { editPeriod } from '@/api/period'
import { mixin } from '@/utils/ylab-list-common'
import FlowTree from './components/FlowTree'

export default {
  name: 'ContractDetail',
  components: { experimentList, purchaselist, outstoreList, ContractEstablish, FileLinkList, ContractFlow, OperateLog, Pagination, FlowTree },
  mixins: [mixin],
  data() {
    return {
      loading: true,
      activeName: 'experimentlist',
      showEdit: false,
      editData: {
        h3Id: '',
        h3Phone: '',
        h3Name: '',
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
      isShowDefault: true,
      // 子任务
      subTask: [],
      // 自定义字段
      columnList: [],
      code: 'contract',
      activeContractName: 'contractApprove',
      contractApproveFlows: [],
      // 异常原因
      exceptionDialog: false,
      exceptionForm: {
        objId: undefined,
        code: 'contract',
        remark: ''
      },
      exceptionStatus: null,
      // 解决异常弹框
      solveExceptionDialog: false,
      // 审批
      canApproveBuy: false,
      permit: false,
      permitForm: {
        id: undefined,
        status: undefined,
        approveRemark: ''
      },

      // 新建流程
      showNewProcess: false,
      newProcess: [{
        name: '',
        templateId: undefined,
        objId: undefined
      }],
      showSelectTemPlate: false,
      templatePath: undefined,
      temPlateList: [],
      temPlateTotal: 0,
      temPlatelistQuery: {
        pageNo: 1,
        pageSize: 10,
        isTemplate: 1
      },
      isShowDialodTree: false,
      processDetail: {}
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
    },
    processTree() {
      return this.buttonPermission[this.platform].processTree
    }
  },
  watch: {
    showSelectTemPlate() {
      this.templatePath = undefined
      this.newProcess[0].templateId = undefined
      this.newProcess[0].name = undefined
      this.isShowDialodTree = false
    }
  },
  created() {
    this.contractDetail()
  },
  methods: {
    async setNewProcess() {
      if (!this.newProcess[0].name.trim()) {
        this.$message.error('请输入名称')
        return
      }
      this.newProcess[0].objId = this.$route.query.id
      const result = await editPeriod(this.newProcess)
      if (result.code === 200) {
        this.$message.success('提交成功')
        this.newProcess[0].name = ''
        this.$refs.contractFlow.getPeriodList()
      }
      this.showNewProcess = false
    },
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
      if (detailRes.data.contract.contractException) {
        this.exceptionStatus = detailRes.data.contract.contractException
      }
      this.activities = detailRes.data.log
      this.editData.formData = Object.assign(blankFormData, JSON.parse(this.editData.formData))
      this.contractApproveFlows = detailRes.data.flows
      this.canApproveBuy = detailRes.data.canApproveBuy
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
        this.$refs.contractFlow.$refs.experimentTree[0].getList()
        this.$refs.experimentlist.getList()
      })
    },
    delContract() {
      this.$confirm('删除项目后，关联实验与任务将同时删除，该操作不可恢复！确认删除该项目？', '删除项目', {
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
      this.$confirm('确认完成该项目?', '提示', {
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
    // 提交异常
    exceptionSubmit() {
      this.exceptionForm.objId = this.$route.query.id
      exception(this.exceptionForm).then(res => {
        if (res.code === 200) {
          this.exceptionDialog = false
          this.contractDetail()
          this.$refs.contractFlow.$refs.experimentTree[0].getList()
          this.$refs.experimentlist.getList()
        }
      })
    },
    // 取消提交异常
    exceptionCancel() {
      this.exceptionDialog = false
      this.exceptionForm = {
        objId: undefined,
        code: 'contract',
        remark: ''
      }
    },
    // 解决异常
    solveExceptionSubmit() {
      solveException({ id: this.exceptionStatus.id, status: 4 }).then(res => {
        if (res.code === 200) {
          this.solveExceptionDialog = false
          this.exceptionStatus = null
          this.contractDetail()
          this.$refs.contractFlow.$refs.experimentTree[0].getList()
          this.$refs.experimentlist.getList()
        }
      })
    },
    // 暂停
    pause() {
      this.$confirm('即将暂停项目及关联实验、任务，确认暂停吗？', '暂停项目', {
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
    },
    // 通过审批
    permitApprove() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 4
      contractPermit(this.permitForm).then(res => {
        if (res.code === 200) {
          this.permit = false
          this.contractDetail()
        }
      })
    },
    permitReject() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 13
      contractPermit(this.permitForm).then(res => {
        if (res.code === 200) {
          this.permit = false
          this.contractDetail()
        }
      })
    },
    changeListStatus() {
      this.$refs.experimentlist.getList()
    },
    openSelectTemPlate() {
      this.showSelectTemPlate = true
      this.getList()
    },
    getList() {
      getProcessList(this.temPlatelistQuery).then(response => {
        this.temPlateList = response.data.list
        this.temPlateTotal = response.data.total
      })
    },
    async toProcessDetail(row) {
      console.log(row)
      this.templatePath = row.name
      this.isShowDialodTree = true
      const processRes = await getProcessDetail({ id: row.id })
      this.processDetail = processRes.data.bo
    },
    handleCurrentTemplate(data) {
      this.newProcess = data.map(item => {
        return {
          templateId: item.id,
          name: item.name,
          objId: this.$route.query.id
        }
      })
    },
    sendProcess() {
      if (!this.newProcess[0].templateId) {
        this.$message.error('请选择模板')
        return
      }
      this.setNewProcess()
      this.showSelectTemPlate = false
    }
  }
}
</script>
<style lang="scss">
.selectTemplate{
  .topBtn{
    display: none;
  }
  .is-center{
    display: none;
  }
  svg {
      font-size: 14px;
    }
}
</style>
