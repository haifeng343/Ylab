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
    <div class="status-text-button">我发起的({{ total }})</div>
    <el-table
      v-loading="listLoading"
      :data="pendingData"
      border
      style="width: 100%"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
    >
      <el-table-column label="类型" align="center" width="146">
        <template slot-scope="{row}">
          <div style="color: #337ab7;">
            <span v-if="row.code === 'ly'" class="link-type" @click="toDetail(row)">领用申请</span>
            <span v-if="row.code === 'cg'" class="link-type" @click="toDetail(row)">采购申请</span>
            <el-tag v-if="row.hasNew" type="danger">有更新</el-tag>
          </div>
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
      <el-table-column label="节点状态" align="center">
        <template slot-scope="{row}">
          <div style="text-align: left">
            <div v-if="row.approveName">
              <span>审批人：</span><span>{{ row.approveName }}</span>
            </div>
            <div v-if="row.approveRemark&&row.approveRemark.includes(`审批`)">
              <div v-if="row.approveRemark">
                <span>审批结果：</span><span>{{ row.approveRemark.split('&&,')[0].substring(2,4) }}</span>
              </div>
              <div v-if="row.approveRemark">
                <span>审批意见：</span><span>{{ row.approveRemark.split('&&,')[0].substring(4) }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="{row}">
          <el-button v-if="row.code === 'cg' && row.status !== 2" type="danger" @click="changePurchaseStatus(row.id,2)">
            取消
          </el-button>
          <el-button v-else-if="row.code === 'cg' && row.status === 2" type="info" disabled>
            取消
          </el-button>
          <el-button v-if="row.code === 'ly' && row.status === 1" type="primary" @click="confirmCancel(row.id,0,row.logId)">
            取消
          </el-button>
          <el-button v-if="row.code === 'ly' && row.status !== 1" type="info" disabled>
            取消
          </el-button>
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
  </div>
</template>

<script>
import { getCreate } from '@/api/user'
import { updatePurchaseStatus } from '@/api/purchase'
import { storeReceivePermit } from '@/api/store'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
let isReturn = false
export default {
  name: 'MyCreate',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      permitStatus: ['已取消', '审核中', '', '未通过', '已领用', '已退回'],
      statusColor: ['info', 'warning', '', 'danger', 'success', 'primary'],
      pendingData: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        status: 1
      }
    }
  },
  mounted() {
    const { getList } = this
    getList()
  },
  methods: {
    async getList() {
      if (isReturn) {
        return
      }
      this.listLoading = true
      isReturn = true
      const result = await getCreate(this.listQuery)
      if (result.code === 200) {
        this.pendingData = result.data.list
        this.total = result.data.total
        this.listLoading = false
        isReturn = false
      }
    },
    // 修改采购订单状态
    changePurchaseStatus(id, statusNo) {
      updatePurchaseStatus({ id, status: statusNo }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    // 确认取消
    confirmCancel(id, status, logId) {
      storeReceivePermit({ id, status, logId }).then(res => {
        if (res.code === 200) {
          this.getList()
        }
      })
    },
    toDetail(data) {
      if (data.code === 'cg') {
        this.$router.push(`/purchase-manager/purchase-detail?id=${data.id}`)
      } else if (data.code === 'ly') {
        this.$router.push(`/store-manager/out-store-detail?id=${data.id}`)
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
