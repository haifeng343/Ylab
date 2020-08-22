<template>
  <div class="app-container">
    <div class="container-line-title" style="display: flex; justify-content: space-between;">
      <span class="detail-subtitle" style="align-self: flex-start;">待办与我的</span>
      <div>
        <el-select v-model="listQuery.status" filterable placeholder="请选择" @change="getList">
          <el-option label="全部" :value="0" />
          <el-option label="待审批" :value="1" />
          <el-option label="已审批" :value="4" />
        </el-select>
      </div>
    </div>
    <div class="status-text-button">我的审批({{ total }})</div>
    <el-table
      v-loading="listLoading"
      :data="pendingData"
      border
      style="width: 100%"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
    >
      <el-table-column label="标题" align="center" width="170">
        <template slot-scope="{row}">
          <span v-if="row.code === 'cg'" class="link-type" @click="toDetail(row)">{{ row.createName }}的采购申请</span>
          <span v-else-if="row.code === 'ly'" class="link-type" @click="toDetail(row)">{{ row.createName }}的领用申请</span>
        </template>
      </el-table-column>
      <el-table-column label="详细内容" align="center">
        <template slot-scope="{row}">
          <div class="duiqiMsg">
            <span>{{ row.detail }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" align="center" width="150">
        <template slot-scope="{row}">
          <el-tag v-if="row.code === 'cg'" :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
          <el-tag v-if="row.code === 'ly'" :type="statusColor[row.status]">{{ permitStatus[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审批结果" align="center" width="190">
        <template slot-scope="{row}">
          <div v-if="!row.approveRemark" style="text-align: left">待审批</div>
          <div v-else-if="row.approveRemark.includes(`审批`)" style="text-align: left">
            <div><span>审批结果：</span><span>{{ row.approveRemark.split('&&,')[0].substring(2,4) }}</span></div>
            <div><span>审批意见：</span><span>{{ row.approveRemark.split('&&,')[0].substring(4) }}</span></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" align="center" width="160">
        <template slot-scope="{row}">
          <span v-if="row.approveRemark">{{ row.approveRemark.split(',')[1] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="{row}">
          <el-button v-if="row.status === 5||row.status === 1" type="primary" @click="showApprove(row)">审批</el-button>
          <el-button v-else type="info" plain disabled>审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="paginationHandler"
    />
    <el-dialog title="采购申请审批" :visible.sync="auditCg" :close-on-click-modal="false" width="30%">
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
    <el-dialog title="领用申请审批" :visible.sync="auditLy" :close-on-click-modal="false" width="30%">
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
  </div>
</template>

<script>
import { getPending } from '@/api/user'
import { updatePurchaseStatus } from '@/api/purchase'
import { storeReceivePermit } from '@/api/store'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
import { mapState } from 'vuex'

export default {
  name: 'AwaitApprove',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      permitStatus: ['已取消', '审核中', '', '未通过', '已领用', '已退回'],
      statusColor: ['info', 'warning', '', 'danger', 'success', 'primary'],
      pendingData: [],
      total: 0,
      listLoading: false,
      auditCg: false,
      auditLy: false,
      auditForm: {
        approveRemark: ''
      },
      editData: {},
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        status: 1
      }
    }
  },
  computed: {
    ...mapState({
      roles: state => state.user.roles
    })
  },
  mounted() {
    const { getList } = this
    getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const result = await getPending(this.listQuery)
      if (result.code === 200) {
        this.pendingData = result.data.list
        this.total = result.data.total
        this.listLoading = false
      }
    },
    toDetail(data) {
      if (data.code === 'cg') {
        this.$router.push(`/purchase-manager/purchase-detail?id=${data.id}`)
      } else if (data.code === 'ly') {
        this.$router.push(`/store-manager/out-store-detail?id=${data.id}`)
      }
    },
    async showApprove(data) {
      this.editData = data
      if (data.code === 'cg') {
        this.auditCg = true
      } else if (data.code === 'ly') {
        this.auditLy = true
      }
    },
    changePurchaseStatus(statusNo) {
      updatePurchaseStatus({ id: this.editData.id, status: statusNo, approveRemark: this.auditForm.approveRemark }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    changeStoreStatus(statusNo) {
      storeReceivePermit({ id: this.editData.id, status: statusNo, approveRemark: this.auditForm.approveRemark, logId: this.editData.logId }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    rejectBuy() {
      if (this.editData.code === 'cg') {
        this.auditCg = false
        this.changePurchaseStatus(7)
        this.auditForm.approveRemark = ''
      } else if (this.editData.code === 'ly') {
        this.auditLy = false
        this.changeStoreStatus(3)
        this.auditForm.approveRemark = ''
      }
    },
    passBuy() {
      if (this.editData.code === 'cg') {
        this.auditCg = false
        this.changePurchaseStatus(6)
        this.auditForm.approveRemark = ''
      } else if (this.editData.code === 'ly') {
        this.auditLy = false
        this.changeStoreStatus(4)
        this.auditForm.approveRemark = ''
      }
    }
  }
}
</script>
<style lang="scss">

.duiqiMsg{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
