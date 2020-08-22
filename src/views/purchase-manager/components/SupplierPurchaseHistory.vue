<template>
  <div>
    <el-table
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
      <el-table-column label="采购订单编号" width="140" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${row.buyId}`)">{{ row.buyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购物品名称" min-width="260">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.specs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.originPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.buyPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.itemNo }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { queryPurchaseDemand } from '@/api/purchase'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        supplierId: undefined,
        pageNo: 1,
        pageSize: 10,
        sort: 2
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listQuery.supplierId = this.$route.query.id
      queryPurchaseDemand(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    }
  }
}
</script>
