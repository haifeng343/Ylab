<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="editData.status | statusTypeFilter">{{ editData.status | statusFilter }}</el-tag>
          <span class="detail-title">【{{ editData.paymentNo }}】{{ editData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="editData.status === 1 && canApprovePay" @click.native="showApprove">审批</el-dropdown-item>
              <el-dropdown-item v-if="editData.status === 1" @click.native="cancelPay">取消</el-dropdown-item>
              <el-dropdown-item @click.native="printHandler">打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">关联单据：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${editData.relationId}`)">{{ editData.relationName }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">付款类型：</span>
            <span class="detail-form-value">{{ editData.typeName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">付款总额：</span>
            <span class="detail-form-value">{{ editData.payMoney | moneyFilter }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">申请部门：</span>
            <span class="detail-form-value">{{ editData.deptName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">申请人：</span>
            <span class="detail-form-value">{{ editData.createName }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">付款状态：</span>
            <span class="detail-form-value">{{ editData.status === 4 ? '完成' : '未完成' }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">申请时间：</span>
            <span class="detail-form-value">{{ editData.createTime }}</span>
          </span>
        </div>
      </div>
      <!-- 付款批次 -->
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">付款批次</span>
      </div>
      <el-table
        :data="payBatch"
        border
        style="width: 100%"
      >
        <el-table-column label="付款编号" align="center" width="145">
          <template slot-scope="{row}">
            <span>{{ row.paymentInfoNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="约定付款日期" align="center" width="190">
          <template slot-scope="{row}">
            <span>{{ row.planPayTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批次" align="center" width="95">
          <template slot-scope="{row}">
            <span>{{ row.batch }}</span>
          </template>
        </el-table-column>
        <el-table-column label="占比" align="center" width="95">
          <template slot-scope="{row}">
            <span>{{ (row.payMoney / editData.payMoney * 100).toFixed(2) }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center" width="135">
          <template slot-scope="{row}">
            <span>{{ row.payMoney / 100 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际付款日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.realPayTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" align="center" width="100">
          <template slot-scope="{}">
            <span>{{ editData.createName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="{row}">
            <el-button v-if="row.isPay === 0 && editData.status === 5" type="primary" @click="changePayInfo(row, 1)">付款</el-button>
            <el-button v-else type="info" disabled>付款</el-button>
            <el-button v-if="row.isPay === 1 && editData.status !== 1" type="primary" @click="changePayInfo(row, 0)">取消</el-button>
            <el-button v-else type="info" disabled>取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="approveFlows.length !== 0">
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">审批流程</span>
        </div>
        <el-tabs v-model="ApproveName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="付款审批流程" name="payingApprove">
            <div v-if="approveFlows" style="padding: 24px 0;">
              <el-steps v-if="approveFlows" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in approveFlows" :key="index" icon="el-icon-edit">
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
            <div v-else>暂无数据</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <!-- ---------------------------------------------审核弹框-------------------------------------------------- -->
    <el-dialog title="审批付款" :visible.sync="audit" :close-on-click-modal="false" width="30%">
      <el-form :model="auditForm">
        <el-form-item label="审批意见" label-width="68px">
          <el-input v-model="auditForm.approveRemark" type="textarea" autocomplete="off" placeholder="补充审批意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="reject">拒 绝</el-button>
        <el-button type="primary" @click="pass">通 过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { getPayDetail, changePayStatus, changePayInfoStatus } from '@/api/paying'
import { print } from '@/utils/print'
import OperateLog from '@/components/operateLog'
const statusOptions = [
  { value: 1, label: '审核中', type: '' },
  { value: 2, label: '已取消', type: 'danger' },
  { value: 3, label: '未通过', type: 'info' },
  { value: 4, label: '已付款', type: 'success' },
  { value: 5, label: '待付款', type: 'warning' }
]
export default {
  name: 'PayingDetail',
  components: { OperateLog },
  filters: {
    statusFilter(status) {
      return statusOptions[status - 1].label
    },
    statusTypeFilter(status) {
      return statusOptions[status - 1].type
    }
  },
  data() {
    return {
      audit: false,
      auditForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      loading: true,
      // 项目日志
      editData: {},
      statusOptions: statusOptions,
      payBatch: [],
      // 任务日志
      activities: [],
      ApproveName: 'payingApprove',
      approveFlows: [],
      canApprovePay: false
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.loading = true
      getPayDetail({ id: this.$route.query.id }).then(res => {
        this.editData = res.data.payment
        this.payBatch = res.data.infoList
        this.canApprovePay = res.data.canApprovePay
        this.approveFlows = res.data.flows
        this.activities = res.data.logs
        this.loading = false
      })
    },
    printHandler() {
      const printHtml = `<div style="font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; line-height: 60px;">
          付款信息
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;" border="1" cellspacing="0">
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">付款单号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="6">${this.editData.paymentNo}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请人</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请时间</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createTime}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">关联单据</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.relationName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请部门</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.deptName}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">付款总额</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.payMoney / 100}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">付款类型</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.typeName}</td>
          </tr>
        </table>
        <div style="margin-top: 10px;">
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印人：${this.userName}</div>
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印时间：${parseTime(new Date())}</div>
        </div>`
      print(printHtml)
    },
    cancelPay() {
      this.$confirm(`确认取消本次付款申请，取消后需要重新申请，该操作不可恢复`, '取消付款', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        changePayStatus({ id: this.$route.query.id, status: 2 }).then(() => {
          this.getDetail()
        })
      })
    },
    showApprove() {
      this.audit = true
      this.auditForm.id = this.$route.query.id
    },
    // 通过审批
    pass() {
      this.auditForm.status = 5
      changePayStatus(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.getDetail()
        }
      })
    },
    // 拒绝审批
    reject() {
      this.auditForm.status = 3
      changePayStatus(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.getDetail()
        }
      })
    },
    async changePayInfo(row, status) {
      await changePayInfoStatus({ id: row.id, status })
      this.getDetail()
    }
  }
}
</script>
