<template>
  <div v-loading="loading">
    <div class="app-container">
      <!-- <div class="container-standard"> -->
      <div class="container-line-title">
        <el-tag v-if="editData.approveStatus || editData.approveStatus === 0" :type="statusColor[editData.approveStatus]" class="title-tag">{{ permitStatus[editData.approveStatus] }}</el-tag>
        <span class="detail-title" style="width: calc(100% - 200px)">【{{ editData.buyInfoNo }}】{{ editData.name }}</span>
        <el-dropdown trigger="click" class="container-line-button">
          <el-button type="primary">
            <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="printHandler">打印</el-dropdown-item>
            <el-dropdown-item :disabled="editData.approveStatus !== 4" @click.native="toBack">退回</el-dropdown-item>
            <el-dropdown-item v-if="editData.type === 5 && editData.approveStatus === 1" @click.native="approveStore(editData.id)">审批</el-dropdown-item>
            <el-dropdown-item v-if="editData.approveStatus === 1 && editData.flag === 2 && canApproveBuy" @click.native="canceToBack">取消</el-dropdown-item>
            <el-dropdown-item v-if="editData.approveStatus === 1 && editData.flag === 1" @click.native="cancelPermit(editData.id)">取消</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item" style="width: 500px;">
          <span class="detail-form-name">库存物品：</span>
          <span class="detail-form-value link-type" @click="route.push(`/store-manager/store-detail?id=${editData.storeId}`)">{{ editData.storeNo }} {{ editData.name }}</span>
        </span>
        <span class="detail-form-item" style="width: 500px;">
          <span class="detail-form-name">关联项目：</span>
          <span class="detail-form-value link-type" @click="route.push(`/contract-manager/contract-detail?id=${editData.contractId}`)">{{ editData.contractNo }} {{ editData.contractName }}</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">类型：</span>
          <span class="detail-form-value">{{ editData.typeName }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">规格：</span>
          <span class="detail-form-value">{{ editData.useSpecs }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">领用数量：</span>
          <span class="detail-form-value">{{ editData.count }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">领用物品单价(元)：</span>
          <span class="detail-form-value">{{ editData.storePrice | moneyFilter }}</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">领用人：</span>
          <span class="detail-form-value">{{ editData.createName }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">申请时间: </span>
          <span class="detail-form-value">{{ editData.createTime }}</span>
        </span>
      </div>
      <!-- ---------------------------------------------操作日志-------------------------------------------------- -->
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
      <!-- ---------------------------------------------领用审核弹框-------------------------------------------------- -->
      <el-dialog title="领用申请审批" :visible.sync="audit" :close-on-click-modal="false" width="30%">
        <el-form :model="auditForm">
          <el-form-item label="审批意见" label-width="68px">
            <el-input v-model="auditForm.approveRemark" type="textarea" autocomplete="off" placeholder="补充审批意见" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="rejectBuy">拒 绝</el-button>
          <el-button type="primary" @click="passBuy">通 过</el-button>
        </div>
      </el-dialog>
      <!-- ---------------------------------------------取消领用弹框-------------------------------------------------- -->
      <el-dialog title="领用申请审批" :visible.sync="cancelAudit" :close-on-click-modal="false" width="30%">
        <div style="line-height: 24px;">确认取消本次申请，库存数量和价格不做变动，如需请重新申请。该操作不可恢复。</div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="cancelAudit = false">取 消</el-button>
          <el-button type="primary" @click="confirmCancel">确 认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { moneyFilter } from '@/filters'
import { print } from '@/utils/print'
import { queryStoreDetail, storeReceivePermit } from '@/api/store'
import OperateLog from '@/components/operateLog'
export default {
  name: 'OutStoreDetail',
  components: { OperateLog },
  data() {
    return {
      permitStatus: ['已取消', '审核中', '', '未通过', '已领用', '已退回'],
      statusColor: ['danger', 'warning', '', 'info', 'success', 'primary'],
      loading: true,
      editData: {},
      audit: false,
      auditForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      cancelAudit: false,
      canApproveBuy: false,
      canApproveBuyBack: false,
      activities: []
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  created() {
    this.outStoreDetail()
  },
  methods: {
    printHandler() {
      const printHtml = `<div style="font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; line-height: 60px;">
          出库信息
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;" border="1" cellspacing="0">
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">出库单号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="6">${this.editData.buyInfoNo}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请人</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请时间</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createTime}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">关联项目</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.contractName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">项目编号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.contractNo}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">出库物品</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.name}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">库存编号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.storeNo}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">规格</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.useSpecs}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">数量</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.count}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">物品类型</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.typeName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">出库成本</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${moneyFilter(this.editData.storePrice)}</td>
          </tr>
        </table>
        <div style="margin-top: 10px;">
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印人：${this.userName}</div>
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印时间：${parseTime(new Date())}</div>
        </div>`
      print(printHtml)
    },
    async outStoreDetail() {
      this.loading = true
      const detailRes = await queryStoreDetail({ id: this.$route.query.id, type: 4 })
      this.editData = detailRes.data.buyInfo
      this.activities = detailRes.data.logs
      this.canApproveBuy = detailRes.data.canApproveBuy
      this.canApproveBuyBack = detailRes.data.canApproveBuyBack
      this.backFlows = detailRes.data.backFlows
      this.loading = false
    },
    // 审批领用
    approveStore(id) {
      this.audit = true
      this.auditForm.id = id
    },
    // 通过审批
    passBuy() {
      this.auditForm.status = 4
      storeReceivePermit(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.outStoreDetail()
        }
      })
    },
    // 拒绝审批
    rejectBuy() {
      this.auditForm.status = 3
      storeReceivePermit(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.outStoreDetail()
        }
      })
    },
    cancelPermit(id) {
      this.cancelAudit = true
      this.auditForm.id = id
    },
    // 确认取消
    confirmCancel() {
      this.auditForm.status = 0
      storeReceivePermit(this.auditForm).then(res => {
        if (res.code === 200) {
          this.cancelAudit = false
          this.outStoreDetail()
        }
      })
    },
    toBack() {
      this.$confirm('确认退回已领用物品？', '退回物品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.auditForm.status = 1
        this.auditForm.id = this.$route.query.id
        storeReceivePermit(this.auditForm).then(res => {
          if (res.code === 200) {
            this.outStoreDetail()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      })
    },
    // 取消退回
    canceToBack() {
      this.$confirm('确认取消本次退回申请，已领用信息不做更改。该操作不可恢复！', '取消退回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.auditForm.status = 0
        this.auditForm.id = this.$route.query.id
        storeReceivePermit(this.auditForm).then(res => {
          if (res.code === 200) {
            this.outStoreDetail()
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scope>
.buyApproveNode{
  text-align: center;
  .svg-icon{
    width: 18px;
    height: 18px;
  }
  div{
    color: #909399;
    font-size: 12px;
  }
}
</style>
