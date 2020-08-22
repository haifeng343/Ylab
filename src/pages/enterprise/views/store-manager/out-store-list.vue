<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <!-- <el-form-item label="状态：">
          <el-select v-model="listQuery.statuses" clearable multiple placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="编号：">
          <el-input v-model="listQuery.storeNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="listQuery.queryType" filterable clearable placeholder="请选择">
            <el-option label="退货出库" :value="4" />
            <el-option label="领用出库" :value="5" />
            <el-option label="其他出库" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量：">
          <el-col :span="11">
            <el-input v-model="listQuery.count1" type="number" clearable style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="listQuery.count2" type="number" clearable style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="物品单价(元)：">
          <el-col :span="11">
            <el-input v-model="storePrice1" clearable style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="storePrice2" clearable style="width: 100%;" />
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="领用编号：">
          <el-input v-model="listQuery.buyInfoNo" clearable placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="出库人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="申请时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item> -->
        <el-form-item label="出库时间：">
          <el-date-picker v-model="updateTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">出库记录</span>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" width="39" />
      <!-- <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="statusColor[row.approveStatus]">{{ permitStatus[row.approveStatus] }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="编号" align="center" width="140">
        <template slot-scope="{row}">
          <span>{{ row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/store-manager/out-store-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="row.type === 6">其他出库</span>
          <span v-if="row.type === 5">领用出库</span>
          <span v-if="row.type === 4">退货出库</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物品单价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.storePrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领用编号" align="center" width="140">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.buyInfoNo }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="规格" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.specs }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="出库人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="申请时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.approveStatus === 1 && row.canApprove" type="primary" @click="approveStore(row)">
            审批
          </el-button>
          <el-button v-else type="info" disabled>
            审批
          </el-button>
          <el-button v-if="row.approveStatus === 1" type="danger" @click="cancelPermit(row.id)">
            取消
          </el-button>
          <el-button v-if="row.approveStatus !== 1" type="info" disabled>
            取消
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
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
      <div style="line-height: 24px;">确认取消本次领用申请，库存数量和价格不做变动，如需领用请重新申请。该操作不可恢复。</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="cancelAudit = false">取 消</el-button>
        <el-button type="primary" @click="confirmCancel">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryStorage } from '@/api/purchase'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { storeReceivePermit } from '@/api/store'
import permission from '@/directive/permission/index.js'

const statusOptions = [
  { value: 0, label: '已取消' },
  { value: 1, label: '审核中' },
  { value: 3, label: '未通过' },
  { value: 4, label: '已领用' },
  { value: 5, label: '已退回' }
]

export default {
  name: 'OutStoreList',
  components: { Pagination, YlabHiddenableContainer },
  directives: { permission },
  mixins: [mixin],
  data() {
    return {
      permitStatus: ['已取消', '审核中', '', '未通过', '已领用', '已退回'],
      statusColor: ['danger', 'warning', '', 'info', 'success', 'primary'],
      audit: false,
      auditForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      cancelAudit: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        statuses: [4],
        storeNo: undefined,
        name: undefined,
        queryType: undefined,
        count: undefined,
        storePrice: undefined,
        buyNo: undefined,
        buyInfoNo: undefined,
        createId: undefined,
        createTime: undefined,
        updateTime: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 1,
        type: 5
      },
      createTime: [],
      updateTime: [],
      statusOptions: statusOptions,
      count1: '',
      count2: '',
      storePrice1: '',
      storePrice2: '',
      principalList: []
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function() {
        sessionStorage.removeItem('statuses')
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('createTime')
      this.setQueryTime('updateTime')
      // 数量范围
      if (this.count1 && this.count2) {
        this.listQuery.count = `${this.count1},${this.count2}`
      } else {
        this.listQuery.count = undefined
      }
      // 价格范围
      if (this.storePrice1 && this.storePrice2) {
        this.listQuery.storePrice = `${this.storePrice1 * 100},${this.storePrice2 * 100}`
      } else {
        this.listQuery.storePrice = undefined
      }
      const statuses = sessionStorage.getItem('statuses')
      if (statuses) {
        this.listQuery.statuses = JSON.parse(statuses)
      }
      queryStorage(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
      fetchPersonList().then(res => {
        this.principalList = res.data.list
      })
      // fetchTypeList({ code: 'buy_store', pageNo: 1, pageSize: 99999 }).then(res => {
      //   this.typeList = res.data.list
      // })
    },
    // 审批领用
    approveStore(row) {
      this.audit = true
      this.auditForm.id = row.id
      this.auditForm.logId = row.logId
    },
    // 通过审批
    passBuy() {
      this.auditForm.status = 4
      storeReceivePermit(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.getList()
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
          this.getList()
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
          this.getList()
        }
      })
    }
  }
}
</script>
