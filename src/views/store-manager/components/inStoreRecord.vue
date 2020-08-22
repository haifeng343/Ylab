<template>
  <div class="app-container">
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
      <el-table-column label="类型" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="!row.buyNo && row.type === 5 || !row.buyNo && row.type === 6">领用退回</span>
          <span v-else-if="!row.buyNo && row.type === 3">新建入库</span>
          <span v-else-if="row.type === 3 || row.type === 4">采购入库</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单编号" align="center" width="190">
        <template slot-scope="{row}">
          <span v-if="row.buyId" class="link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${row.buyId}`)">{{ row.buyNo }}</span>
          <span v-else>无订单</span>
          <el-tag v-if="row.type === 4" type="danger" style="margin-left: 5px;">已退货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单价(元)" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.buyPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" width="140">
        <template slot-scope="{row}">
          <span>{{ row.itemNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.supplierName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库人" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-between;">
      <div style="margin-top: 20px; font-size: 14px; padding-left: 8px; color: #909399;">备注：无订单表示该批次物品不来自采购渠道</div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
    </div>
  </div>
</template>

<script>
import { queryStorage } from '@/api/purchase'
import Pagination from '@/components/Pagination'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'InStoreRecord',
  components: { Pagination },
  mixins: [mixin],
  props: {
    storeNo: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        storeNo: undefined,
        pageNo: 1,
        pageSize: 10,
        sort: 2,
        type: 3
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.storeNo = this.storeNo
      queryStorage(this.listQuery).then(response => {
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
