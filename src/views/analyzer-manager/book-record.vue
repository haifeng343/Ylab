<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form v-model="listQuery" label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="仪器名称：">
          <el-input v-model="listQuery.machineName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="预约人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间：">
          <el-date-picker v-model="appointmentTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="listQuery.statuses" clearable multiple placeholder="请选择">
            <el-option v-for="item in searchStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">预约记录</span>
    </div>
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
      <el-table-column label="状态" class-name="status-col" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.status || row.status === 0" :type="row.status | analyzerStatusTypeFilter">{{ row.status | analyzerStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="仪器名称" min-width="180">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/analyzer-manager/analyzer-detail?id=${row.machineId}`)">{{ row.machineName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="320">
        <template slot-scope="{row}">
          <span v-if="row.startTime.substr(0, 10) === row.endTime.substr(0,10)">{{ row.startTime | filteTime }}-{{ row.endTime.substr(11, 5) }}</span>
          <span v-else>{{ row.startTime | filteTime }} 至 {{ row.endTime | filteTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约人" class-name="status-col" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用目的" min-width="120">
        <template slot-scope="{row}">
          <span>{{ row.content }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import { mixin } from '@/utils/ylab-list-common'
import { fetchPersonList } from '@/api/common'
import { queryAppointment } from '@/api/analyzer'
const statusOptions = [
  { value: 0, label: '已预约', type: 'warning' },
  { value: 1, label: '', type: '' }, // 假的
  { value: 2, label: '系统取消', type: 'info' },
  { value: 3, label: '个人取消', type: 'info' },
  { value: 4, label: '已完成', type: 'success' }
]
const searchStatus = [
  { value: 0, label: '已预约' },
  { value: 2, label: '系统取消' },
  { value: 3, label: '个人取消' },
  { value: 4, label: '已完成' }
]
const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default {
  name: 'BookRecord',
  components: { Pagination, YlabHiddenableContainer },
  filters: {
    analyzerStatusFilter(type) {
      return statusOptions[type].label
    },
    analyzerStatusTypeFilter(type) {
      return statusOptions[type].type
    },
    filteTime(stime) {
      // eslint-disable-next-line
      const time = stime.replace(/\-/g, "/")
      const date = new Date(time)
      const m = stime.substr(5, 2)
      const d = stime.substr(8, 2)
      const h = stime.substr(11, 2)
      const i = stime.substr(14, 2)
      return `${m}月${d}日 ${week[date.getDay()]} ${h}:${i}`
    }
  },
  mixins: [mixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      appointmentTime: [],
      listQuery: {
        machineName: '',
        statuses: undefined,
        appointmentTime: undefined,
        createId: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 'createTime,desc'
      },
      principalList: [],
      statusOptions: statusOptions,
      searchStatus: searchStatus,
      appointment: {
        startTime: '',
        endTime: ''
      }
    }
  },
  created() {
    this.getList()
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
  },
  methods: {
    getList() {
      this.setQueryTime('appointmentTime')
      queryAppointment(this.listQuery).then((res) => {
        this.list = res.data.list
        this.total = res.data.total
      })
    }
  }
}
</script>
