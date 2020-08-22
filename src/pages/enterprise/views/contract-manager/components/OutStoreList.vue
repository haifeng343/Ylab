<template>
  <div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="39" />
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="statusColor[row.approveStatus]">{{ permitStatus[row.approveStatus] }}</el-tag>
        </template>
      </el-table-column>
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
      <!-- <el-table-column label="出库单价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.storePrice | moneyFilter }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="规格" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.specs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领用人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
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
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { queryStorage } from '@/api/purchase'

export default {
  components: { Pagination },
  // props: {
  //   subTask: {
  //     type: Array,
  //     'default': null
  //   }
  // },
  data() {
    return {
      permitStatus: ['已取消', '审核中', '', '未通过', '已领用', '已退回'],
      statusColor: ['danger', 'warning', '', 'info', 'success', 'primary'],
      list: null,
      total: 0,
      listQuery: {
        contractId: '',
        pageNo: 1,
        pageSize: 10,
        sort: 2
      }
    }
  },
  created() {
    this.getList()
    // this.total = this.subTask.length
  },
  methods: {
    getList() {
      // this.list = this.subTask
      // this.list = this.listQuery.pageSize * this.listQuery.pageNo >= this.list.length ? this.list.slice((this.listQuery.pageNo - 1) * this.listQuery.pageSize, this.list.length) : this.list.slice((this.listQuery.pageNo - 1) * this.listQuery.pageSize, this.listQuery.pageNo * this.listQuery.pageSize)
      // 查询子实验
      this.listQuery.contractId = this.$route.query.id
      queryStorage(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    }

  }
}
</script>
