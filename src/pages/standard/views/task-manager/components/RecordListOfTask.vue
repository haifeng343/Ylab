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
      <el-table-column type="selection" width="39" />
      <el-table-column label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/record-detail?id=${row.id}`)">{{ row.title }}</span>
          <el-tooltip placement="bottom">
            <div slot="content">
              <span>新增了数据报告</span>
            </div>
            <svg-icon v-if="row.isReport" icon-class="file" style="color:#909399;" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="110" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联人" min-width="260" align="center">
        <template slot-scope="{row}">
          <span>{{ row.empNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="paginationHandler" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { fetchRecordList } from '@/api/task'
import { mixin } from '@/utils/ylab-list-common'

export default {
  components: { Pagination },
  mixins: [mixin],
  props: {
    taskId: {
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
        taskId: '',
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
      this.listLoading = true
      this.listQuery.taskId = this.taskId
      fetchRecordList(this.listQuery).then(response => {
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

