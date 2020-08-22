<template>
  <div class="app-container">
    <div class="container-standard">
      <div class="container-line-title">
        <el-tag v-if="detail.status" :type="detail.status | statusTypeFilter" class="title-tag">{{ detail.status | statusFilter }}</el-tag>
        <span class="detail-title" style="width: calc(100% - 460px)">【 {{ detail.ybrContractNo }} 】 {{ detail.name }}</span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">类型：</span>
          <span class="detail-form-value">{{ detail.typeName }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">负责人：</span>
          <span class="detail-form-value">{{ detail.chargeEmpName }}</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">计划开始：</span>
          <span class="detail-form-value">{{ detail.planStartTime }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">计划结束：</span>
          <span class="detail-form-value">{{ detail.planEndTime }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">实际开始：</span>
          <span class="detail-form-value">{{ detail.startTime }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">实际结束：</span>
          <span class="detail-form-value">{{ detail.endTime }}</span>
        </span>
      </div>
    </div>
    <div class="container-standard">
      <div class="container-line-title">
        <span class="detail-subtitle">基本信息</span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">客户名：</span>
          <span v-if="detail.customName" class="detail-form-value">{{ detail.customName.split('-')[1] }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">联系方式：</span>
          <span class="detail-form-value">{{ detail.customPhone }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">联系邮箱：</span>
          <span class="detail-form-value">{{ detail.customMail }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">客户单位：</span>
          <span v-if="detail.customName" class="detail-form-value">{{ detail.customName.split('-')[0] }}</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">业务员：</span>
          <span class="detail-form-value">{{ detail.ownerName }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">售前顾问：</span>
          <span v-if="detail.saleFrontName" class="detail-form-value">{{ detail.saleFrontName.toString() }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">售后顾问：</span>
          <span class="detail-form-value">{{ detail.saleBackName }}</span>
        </span>
      </div>
      <div class="container-line-title">
        <span class="detail-subtitle" style="margin-top: 10px;">合同信息</span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">合同编号：</span>
          <span class="detail-form-value">{{ detail.contractNo }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">签约时间：</span>
          <span class="detail-form-value">{{ detail.qianYueDate }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">约定完工：</span>
          <span class="detail-form-value">{{ detail.preCompleteDate }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">样本情况：</span>
          <span v-if="detail.hasSample === '有'" class="detail-form-value">{{ detail.sampleUseCount+'/'+detail.sampleCount }}</span>
          <span v-else-if="detail.hasSample === '无'" class="detail-form-value">无需样本</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">开票总金额(元)：</span>
          <span class="detail-form-value">{{ detail.kpMoney | moneyFilter }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">合同金额(元)：</span>
          <span class="detail-form-value">{{ detail.totalMoney | moneyFilter }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">已付金额(元)：</span>
          <span class="detail-form-value">{{ detail.paidMoney | moneyFilter }}</span>
        </span>
        <!-- <span class="detail-form-item">
          <span class="detail-form-name">待收金额(元)：</span>
          <span class="detail-form-value">{{ detail.totalMoney-detail.paidMoney | moneyFilter }}</span>
        </span> -->
      </div>
    </div>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="任务列表" name="taskList">
        <el-table
          v-loading="listLoading"
          :data="taskData"
          border
          style="width: 100%"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.7)"
        >
          <el-table-column label="状态" align="center" width="80">
            <template slot-scope="{row}">
              <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="编号" align="center" width="134">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.taskNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" min-width="260">
            <template slot-scope="{row}">
              <span style="display: inline;" class="link-type" :class="{'finished-item': row.status === 4}" @click="$router.push(`/contract-manager/cooperate-task-detail?id=${row.id}`)">{{ row.name }}</span>
              <el-tag v-if="row.h3Id" type="primary">合作</el-tag>
              <el-tag v-if="row.isNew === 1" type="danger">NEW</el-tag>
              <el-tooltip placement="bottom">
                <div slot="content">
                  <span>新增了数据报告</span>
                </div>
                <svg-icon v-if="row.isReport" icon-class="file" style="color:#909399;" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120" align="center">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.typeName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优先级" align="center" width="85">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人" align="center" width="110">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.curName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划开始" align="center" width="95" class-name="small-padding">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.planStartTime | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="计划结束" align="center" width="95" class-name="small-padding">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.planEndTime | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="160" class-name="small-padding">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
            <template slot-scope="{row}">
              <span :class="{'finished-item': row.status === 4}">{{ row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryTask.pageNo" :limit.sync="queryTask.pageSize" :auto-scroll="false" @pagination="getTask" />
      </el-tab-pane>
      <el-tab-pane label="开票明细" name="openInvoice">
        <el-table
          v-loading="listLoading"
          :data="invoiceData"
          border
          style="width: 100%"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.7)"
        >
          <el-table-column label="开票编号" align="center" width="170">
            <template slot-scope="{row}">
              <span class="link-type" @click="toInvoiceContent(row)">{{ row.kpNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发票号" align="center" width="134">
            <template slot-scope="{row}">
              <span>{{ row.invoiceNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票金额(元)" align="center" width="160">
            <template slot-scope="{row}">
              <span>{{ row.invoiceMoney | moneyFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票单位" align="center">
            <template slot-scope="{row}">
              <span>{{ row.invoiceOrg }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票人" align="center" width="110">
            <template slot-scope="{row}">
              <span>{{ row.invoiceOwnName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票日期" align="center" width="180">
            <template slot-scope="{row}">
              <span>{{ row.invoiceDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开票给到日期" align="center" width="180">
            <template slot-scope="{row}">
              <span>{{ row.invoiceReceiveDate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total1>0" :total="total1" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="queryInvoince" />
      </el-tab-pane>
      <el-tab-pane label="付款明细" name="paying">
        <el-table
          v-loading="listLoading"
          :data="payingData"
          border
          style="width: 100%"
          element-loading-text="加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(255, 255, 255, 0.7)"
        >
          <el-table-column label="付款编号" align="center" width="170">
            <template slot-scope="{row}">
              <span>{{ row.hkNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款金额(元)" align="center" width="135">
            <template slot-scope="{row}">
              <span>{{ row.hkMoney | moneyFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="付款类型" align="center" width="135">
            <template slot-scope="{row}">
              <span>{{ row.type }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收款公司" align="center">
            <template slot-scope="{row}">
              <span>{{ row.hkCompany }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收款确认人" align="center" width="190">
            <template slot-scope="{row}">
              <span>{{ row.hkEmp }}</span>
            </template>
          </el-table-column>
          <el-table-column label="到账日期" align="center" width="180">
            <template slot-scope="{row}">
              <span>{{ row.hkDate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total2>0" :total="total2" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="queryPaying" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getInvoice, getPaying } from '@/api/user'
import { fetchList } from '@/api/task'
export default {
  name: 'JoinContractDetail',
  components: { Pagination },
  data() {
    return {
      activeName: 'taskList',
      detail: {},
      taskData: [],
      invoiceData: [],
      payingData: [],
      listLoading: false,
      total: 0,
      total1: 0,
      total2: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20
      },
      queryTask: {
        id: undefined,
        isUnion: 0,
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.detail = JSON.parse(sessionStorage.getItem('JoinContract'))
    this.initData()
  },
  methods: {
    async initData() {
      this.listQuery.objectId = this.detail.objectId
      this.listLoading = true
      this.queryInvoince()
      this.queryPaying()
      this.getTask()
      this.listLoading = false
    },
    async getTask() {
      if (this.detail.id) {
        this.queryTask.id = this.detail.id
        const result2 = await fetchList(this.queryTask)
        if (result2.code === 200) {
          this.taskData = result2.data.list
          this.total = result2.data.total
        }
      }
    },
    async queryInvoince() {
      const result = await getInvoice(this.listQuery)
      if (result.code === 200) {
        this.invoiceData = result.data
        // this.total1 = result.data.total
      }
    },
    async queryPaying() {
      const result1 = await getPaying(this.listQuery)
      if (result1.code === 200) {
        this.payingData = result1.data
        // this.total2 = result1.data.total
      }
    },
    toInvoiceContent(data) {
      sessionStorage.setItem('invoice', JSON.stringify(data))
      this.$router.push(`/invoice-content?ownerName=${this.detail.ownerName}`)
    }
  }
}
</script>
