<template>
  <div v-loading="loading">
    <div v-show="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag v-if="editData.signStatus === 1" type="success">已签署</el-tag>
          <el-tag v-if="editData.signStatus === 0" type="info">未签署</el-tag>
          <span class="detail-title" style="width: calc(100% - 300px)">【 {{ editData.contractNo }} 】 {{ editData.name }}</span>
          <el-button type="danger" class="container-line-button" @click="delContract">删除</el-button>
          <el-button type="primary" class="container-line-button" @click="sendMessage">发送短信</el-button>
          <el-button v-if="!editData.isSendSms" type="primary" class="container-line-button" @click="edit">编辑</el-button>
          <el-button v-else type="info" class="container-line-button" disabled>编辑</el-button>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">关联项目：</span>
          <span class="detail-form-value">{{ editData.h3Name }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">合同类型：</span>
            <span class="detail-form-value">{{ editData.typeName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">合同总额：</span>
            <span class="detail-form-value">{{ editData.totalMoney | moneyFilter }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">客户：</span>
            <span class="detail-form-value" style="display: inline-block; max-width: 200px; vertical-align: top;">{{ editData.h3Name }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">手机号：</span>
            <span class="detail-form-value">{{ editData.h3Phone }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">业务员：</span>
            <span class="detail-form-value">{{ editData.saleName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">售前支持：</span>
            <span class="detail-form-value">{{ editData.saleFrontName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">售后支持：</span>
            <span class="detail-form-value">{{ editData.saleBackName }}</span>
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
          <div v-if="editData.remark" style="width:50%; font-size: 14px;" v-html="editData.remark" />
          <div v-else style="color: #909399;">未输入详情描述</div>
        </div>
        <div class="flex">
          <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
          <file-link-list v-if="editData.description" :value="`http://${editData.description}`" style="margin-top: 6px;" />
          <file-link-list v-else :value="editData.files" style="margin-top: 6px;" />
        </div>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <sale-establish v-if="showEdit" :edit-data.sync="transfer" :column-list="columnList" @contractEdit="contractEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
import SaleEstablish from './components/SaleEstablish'
import FileLinkList from '@/views/components/FileLinkList'
import { editProject, fetchDetail, deleteProject } from '@/api/contract'
import { sendSms } from '@/api/lab'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import OperateLog from '@/components/operateLog'
import { editPeriod } from '@/api/period'

export default {
  name: 'ContractDetail',
  components: { SaleEstablish, FileLinkList, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'experimentlist',
      showEdit: false,
      editData: {
        isSign: true,
        h3Id: '',
        h3Phone: '',
        h3Name: '',
        status: 0,
        name: '',
        contractTypeId: '',
        totalMoney: '',
        saleName: '',
        saleFrontName: '',
        saleBackName: '',
        curId: undefined,
        // 富文本编辑框内容
        remark: '',
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
      permit: false,
      // 新建流程
      showNewProcess: false,
      newProcess: {
        name: ''
      }
    }
  },
  created() {
    this.contractDetail()
  },
  methods: {
    async setNewProcess() {
      if (!this.newProcess.name.trim()) {
        this.$message.error('请输入名称')
        return
      }
      this.newProcess.objId = this.$route.query.id
      const result = await editPeriod(this.newProcess)
      if (result.code === 200) {
        this.$message.success('提交成功')
        this.newProcess.name = ''
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
        this.$message.error('该合同已被删除')
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
      this.transfer.totalMoney = this.transfer.totalMoney / 100
      this.showEdit = true
    },
    contractEdit() {
      const postData = deepClone(this.transfer)
      postData.totalMoney = Math.round(postData.totalMoney * 100)
      postData.formData = JSON.stringify(this.transfer.formData)
      editProject(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.contractDetail()
        }
      })
    },
    delContract() {
      this.$confirm('确认删除该合同？', '删除合同', {
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
    sendMessage() {
      sendSms({ contractId: this.$route.query.id }).then(res => {
        if (res.code === 200) {
          this.$message.success('已发送短信通知给客户')
          this.contractDetail()
        }
      })
    }
  }
}
</script>
