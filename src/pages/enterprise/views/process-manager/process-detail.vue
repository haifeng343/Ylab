<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="statusType[processDetail.status]" class="title-tag">{{ statusContent[processDetail.status] }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">{{ processDetail.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="processEdit">编辑</el-dropdown-item>
              <el-dropdown-item :disabled="processDetail.status !== 1" @click.native="permit = true">审批</el-dropdown-item>
              <el-dropdown-item :disabled="processDetail.status !== 2" @click.native="permitSubmit">提交审批</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="processDetail.contract" class="container-line-item">
          <span class="detail-form-name">归属项目：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/contract-detail?id=${processDetail.contract.id}`)">{{ processDetail.contract.contractNo }} {{ processDetail.contract.name }}</span>
        </div>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">流程详情</span>
      </div>
      <flow-tree v-if="processDetail.id" ref="flowTree" :period-id="processDetail.id" :period="processDetail" :need-approve="false" :contract-id="String(processDetail.contract.id)" />
      <!-- -----------------------------------------审批流程----------------------------------------- -->
      <div v-if="processApproveFlows.length > 0">
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">审批流程</span>
        </div>
        <el-tabs v-model="activeContractName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="流程审批流程" name="processApprove">
            <div style="padding: 24px 0;">
              <el-steps v-if="processApproveFlows" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in processApproveFlows" :key="index" icon="el-icon-edit">
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
    </div>
    <!-- ------------------------审批弹框---------------------- -->
    <el-dialog
      title="流程审批"
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
    <!-- ------------------------编辑弹框---------------------- -->
    <el-dialog
      title="流程编辑"
      :visible.sync="edit"
      width="400px"
    >
      <el-form :model="editForm" label-width="68px">
        <el-form-item label="流程名称">
          <el-input v-model="editForm[0].name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProcessDetail, processPermit, PermitEdit } from '@/api/permission'
import FlowTree from '../contract-manager/components/FlowTree'
export default {
  name: 'ProcessDetail',
  components: {
    FlowTree
  },
  data() {
    return {
      loading: false,
      statusType: ['info', 'warning', 'danger', 'danger', 'sucess'],
      statusContent: ['未开始', '审批中', '未提审', '未通过', '已通过'],
      processDetail: {},
      processApproveFlows: [],
      activeContractName: 'processApprove',
      permit: false,
      permitForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      edit: false,
      editForm: [{
        name: '',
        id: this.$route.query.id
      }]
    }
  },
  created() {
    this.fetchDetail()
  },
  methods: {
    async fetchDetail() {
      this.loading = true
      const processRes = await getProcessDetail({ id: this.$route.query.id })
      console.log(processRes.data)
      if (!processRes.data) {
        this.$message.error('该流程已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.processDetail = processRes.data.bo
      this.processApproveFlows = processRes.data.flows
      this.loading = false
    },
    permitApprove() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 4
      processPermit(this.permitForm).then(res => {
        this.permit = false
        this.fetchDetail()
        this.$refs.flowTree.getList()
      })
    },
    permitReject() {
      this.permitForm.id = this.$route.query.id
      this.permitForm.status = 3
      processPermit(this.permitForm).then(res => {
        this.permit = false
        this.fetchDetail()
      })
    },
    permitSubmit() {
      // const source = this.$refs.flowTree.source
      // for (let projectGroupIndex = 0; projectGroupIndex < source.length; projectGroupIndex++) {
      //   const projectGroup = source[projectGroupIndex]
      //   for (let projectIndex = 0; projectIndex < projectGroup.length; projectIndex++) {
      //     const project = projectGroup[projectIndex]
      //     if (!project.children || project.children.length === 0) {
      //       this.$alert(`“${project.name}”未添加任务，无法提交审核`)
      //       return
      //     }
      //   }
      // }
      processPermit({ id: this.$route.query.id, status: 4 }).then(res => {
        if (res.code === 200) {
          this.$message.success('提交成功，等待审批')
          this.fetchDetail()
        }
      })
    },
    processEdit() {
      this.edit = true
      this.editForm[0].name = this.processDetail.name
    },
    submitEdit() {
      PermitEdit(this.editForm).then(res => {
        if (res.code === 200) {
          this.$message.success('修改成功，请提交审批')
          this.edit = false
          this.fetchDetail()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container >>> svg {
    font-size: 14px;
  }
</style>
