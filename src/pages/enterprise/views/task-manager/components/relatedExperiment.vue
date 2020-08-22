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
      :row-class-name="tableRowClassName"
      style="width: 100%;"
    >
      <el-table-column label="状态" width="80" align="center" class-name="status-col">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taskNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/experiment-detail?id=${row.id}`); $emit('taskIdChanged');">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.curName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始" align="center" width="95" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.planStartTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" width="95" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.planEndTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
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
import { experimentFetchList } from '@/api/experiment'

export default {
  name: 'RelatedExperiment',
  components: { Pagination },
  props: {
    tid: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        tid: undefined,
        pageNo: 1,
        pageSize: 10,
        sort: 2
      }
    }
  },
  created() {
    this.listQuery.tid = this.tid
    this.getList()
  },
  methods: {
    getList() {
      experimentFetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    tableRowClassName({ row, rowIndex }) {
      console.log(row)
      console.log(row.id)
      console.log(Number(this.$route.query.id))
      if (row.id === Number(this.$route.query.id)) {
        return 'info-row'
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
  .el-table .info-row {
    background: #F5F7FA;
  }
</style>
