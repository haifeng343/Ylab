<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-title" style="width: calc(100% - 200px)">{{ processDetail.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="processEdit">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="delTemplate">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">创建人：</span>
            <span class="detail-form-name">{{ processDetail.createName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">创建时间：</span>
            <span class="detail-form-name">{{ processDetail.createTime }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">更新时间：</span>
            <span class="detail-form-name">{{ processDetail.updateTime }}</span>
          </span>
        </div>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">流程详情</span>
      </div>
      <flow-tree v-if="processDetail.id" ref="flowTree" :period-id="processDetail.id" :period="processDetail" :need-approve="false" :contract-id="String(processDetail.contract.id)" />
    </div>
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
import { deleteTemplate } from '@/api/period'
import FlowTree from '../contract-manager/components/FlowTree'
export default {
  name: 'TemplateDetail',
  components: {
    FlowTree
  },
  data() {
    return {
      loading: false,
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
    },
    delTemplate() {
      this.$confirm(`确认删除模板？`, '删除模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        deleteTemplate({ id: this.$route.query.id })
        this.$router.push('/contract-manager/process-template')
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
