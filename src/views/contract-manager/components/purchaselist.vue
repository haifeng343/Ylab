<template>
  <div>
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
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${row.id}`)">{{ row.name }}</span>
          <el-tag v-if="row.isBack" type="danger" style="margin-left: 5px;">有退货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.payMoney | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="curName" label="申请人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList } from '@/api/purchase'
import Pagination from '@/components/Pagination'
// eslint-disable-next-line

export default {
  name: 'PurchaseList',
  components: { Pagination },
  // mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        contractId: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.contractId = this.$route.query.id
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
    }
  }
}
</script>
