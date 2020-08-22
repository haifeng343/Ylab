<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="创建人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker v-model="listQuery.createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="更新时间：">
          <el-date-picker v-model="listQuery.updateTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">流程模板</span>
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
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/template-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { getProcessList } from '@/api/permission'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'ProcessTemplate',
  components: { Pagination, YlabHiddenableContainer },
  mixins: [mixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        createId: undefined,
        createTime: undefined,
        updateTime: undefined,
        isTemplate: 1
      },
      principalList: []
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function() {
        sessionStorage.removeItem('statuses')
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProcessList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
      fetchPersonList().then(res => {
        this.principalList = res.data.list
      })
    }
  }
}
</script>
