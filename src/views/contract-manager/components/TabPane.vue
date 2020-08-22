<template>
  <div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column type="selection" width="39" />
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
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
          <span style="display: inline;" class="link-type" @click="$router.push(`/contract-manager/task-detail?id=${row.id}`)">{{ row.name }}</span>
          <el-tag v-if="row.isNew === 1" type="danger">NEW</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" width="85">
        <template slot-scope="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" width="110">
        <template slot-scope="{row}">
          {{ row.curName }}
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
import { fetchList } from '@/api/task'

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
      list: null,
      total: 0,
      listQuery: {
        tid: '',
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
      // 查询子任务
      this.listQuery.tid = this.$route.query.id
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    }

  }
}
</script>

