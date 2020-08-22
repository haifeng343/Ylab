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
      <el-table-column label="状态" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.canStart && row.status === 0" class="can-start">可开始</el-tag>
          <el-tag v-else-if="row.isInApprove" type="primary">审批中</el-tag>
          <el-tag v-else :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.taskNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" :class="{'finished-item': row.status === 4}" @click="$router.push(`/contract-manager/task-detail?id=${row.id}`)">{{ row.name }}</span>
          <!-- <el-tag v-if="row.h3Id" type="primary">合作</el-tag> -->
          <el-tooltip placement="top">
            <div slot="content">
              <div v-if="row.contractException">项目异常：{{ row.contractException.remark }}</div>
              <div v-if="row.taskException && row.taskException.length > 0" style="display: flex;">
                <div>任务异常：</div>
                <div>
                  <div v-for="(item,index) in row.taskException" :key="index">{{ item.remark }}</div>
                </div>
              </div>
            </div>
            <el-tag v-if="row.contractException || (row.taskException && row.taskException.length > 0)" type="danger" style="margin-left: 8px;">异常</el-tag>
          </el-tooltip>
          <el-tag v-if="row.isNew === 1" type="danger">NEW</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="140" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="优先级" width="140" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.level }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="负责人" width="110" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.curName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始" align="center" width="95" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.planStartTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" width="95" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.planEndTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.updateTime }}</span>
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
import { fetchList } from '@/api/task'
import { mixin } from '@/utils/ylab-list-common'

export default {
  components: { Pagination },
  mixins: [mixin],
  props: {
    experimentId: {
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
        experimentId: '',
        pageNo: 1,
        pageSize: 10,
        sort: 2,
        isShow: 1
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.experimentId = this.experimentId
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

