<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="编号：">
          <el-input v-model="listQuery.recordNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="listQuery.title" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="listQuery.content" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="关联人：">
          <el-select v-model="listQuery.empIds" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">所有记录</span>
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
      <el-table-column label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.recordNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span v-if="row.isRecord" class="link-type" @click="$router.push(`/contract-manager/record-detail?id=${row.id}`)">{{ row.title }}</span>
          <span v-else class="link-type" @click="$router.push(`/contract-manager/cooperate-record-detail?id=${row.id}`)">{{ row.title }} <el-tag v-if="row.h3Id" type="primary">合作</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联人" align="center" min-width="110">
        <template slot-scope="{row}">
          <span v-if="row.h3Id">-</span>
          <span v-else>{{ row.empNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联任务" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/task-detail?id=${row.taskId}`)">{{ row.taskName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近更新" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { fetchRecordList } from '@/api/task'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'RecordList',
  components: { Pagination, YlabHiddenableContainer },
  mixins: [mixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        recordNo: undefined,
        content: undefined,
        title: undefined,
        empIds: undefined,
        createId: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 2
      },

      value1: [],
      principalList: []
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
      this.listLoading = true
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
