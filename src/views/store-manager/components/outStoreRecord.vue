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
      <el-table-column label="类型" align="left" width="160">
        <template slot-scope="{row}">
          <span v-if="row.type === 6">其他出库</span>
          <span v-if="row.type === 5">领用出库</span>
          <span v-if="row.type === 4">退货出库</span>
          <el-tag v-if="row.type === 5 && row.approveStatus === 5" type="danger" style="margin-left: 4px;">已退回</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="领用数量" align="center">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领用物品单价(元)" align="center">
        <template slot-scope="{row}">
          <span>{{ row.storePrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领用人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库时间" align="center" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { queryStorage } from '@/api/purchase'
import Pagination from '@/components/Pagination'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'OutStoreRecord',
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
        sort: 1,
        type: 5,
        isComplete: 1
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
