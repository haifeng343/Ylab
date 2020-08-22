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
          <span :class="{'finished-item': row.status === 4}">{{ row.taskNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span
            style="display: inline;"
            class="link-type"
            :class="{'finished-item': row.status === 4}"
            @click="$router.push(`/contract-manager/experiment-detail?id=${row.id}`)"
          >{{ row.name }}</span>
          <el-tooltip placement="bottom">
            <div slot="content">
              <span>新增了数据报告</span>
            </div>
            <svg-icon v-if="row.isReport" icon-class="file" style="color:#909399;" />
          </el-tooltip>
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
          <!-- <el-tag v-if="row.h3Id" type="primary">合作</el-tag> -->
          <!-- <el-tag v-if="row.exception" type="danger">异常</el-tag> -->
          <el-tag v-if="row.isNew === 1" type="danger">NEW</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责部门" align="center" width="110">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划开始" align="center" width="95" class-name="small-padding">
        <template slot-scope="scope">
          <span :class="{'finished-item': scope.row.status === 4}">{{ scope.row.planStartTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束" align="center" width="95" class-name="small-padding">
        <template slot-scope="scope">
          <span :class="{'finished-item': scope.row.status === 4}">{{ scope.row.planEndTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span :class="{'finished-item': row.status === 4}">{{ row.createTime }}</span>
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
        isShow: 1,
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
      this.listQuery.tid = this.$route.query.id
      experimentFetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
      })
    }

  }
}
</script>
