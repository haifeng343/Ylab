<template>
  <div class="app-container">
    <ylab-hiddenable-container v-show="!viewColumnEditing">
      <el-form v-model="listQuery" label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item v-if="checkedColumns.includes('状态')" label="状态：">
          <el-select v-model="listQuery.statuses" clearable multiple placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('编号')" label="编号：">
          <el-input v-model="listQuery.machineNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('用途')" label="用途：">
          <el-input v-model="listQuery.purpose" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('可预约最长时间(小时)')" label="可预约最长时间(小时)：">
          <el-input v-model="listQuery.maxTime" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('更新时间')" label="更新时间：">
          <el-date-picker v-model="updateTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>

        <el-form-item v-for="column in visibleColumns" :key="column.code" :label="`${column.name}：`">
          <el-date-picker v-if="column.type==='date'" v-model="formDataQuery[column.code]" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          <el-select v-else-if="column.type==='select'" v-model="formDataQuery[column.code]" clearable placeholder="请选择">
            <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
          </el-select>
          <el-input v-else-if="column.type==='text'" v-model="formDataQuery[column.code]" clearable />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <column-filter-settings v-if="viewColumnEditing" :code="code" :fixed-columns="fixedColumns" @closeme="viewColumnEditing=false" />
    <div v-else class="container-line-item">
      <span class="status-text-button">所有仪器</span>
      <el-dropdown v-if="buttonPermissions.includes(setting)" trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="buttonPermissions.includes(setting)" @click.native="$router.push('/analyzer-manager/analyzer-settings')">设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <el-button v-if="buttonPermissions.includes(newAnalyzer)" class="container-line-button" type="primary" @click="$router.push('/analyzer-manager/analyzer-create')">
        新建
      </el-button>
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
      <el-table-column v-if="checkedColumns.includes('状态')" label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | analyzerStatusTypeFilter">{{ row.status | analyzerStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.machineNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/analyzer-manager/analyzer-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('用途')" label="用途" width="180">
        <template slot-scope="{row}">
          <span>{{ row.purpose }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('可预约最长时间(小时)')" label="可预约最长时间(小时)" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.maxTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('更新时间')" label="更新时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-for="column in visibleColumns" :key="column.code" :label="column.name" width="120" align="center">
        <template slot-scope="{row}">
          <span v-if="column.type==='date'">{{ row.formData[column.code] | parseTime('{y}-{m}-{d}') }}</span>
          <span v-else>{{ row.formData[column.code] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { fetchList } from '@/api/analyzer'
import { fetchTypeList } from '@/api/form'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
import { mapState } from 'vuex'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
const statusOptions = [
  { value: 0, label: '禁用', type: 'info' },
  { value: 1, label: '可预约', type: 'success' }
]

const fixedColumns = ['状态', '编号', '名称', '用途', '可预约最长时间(小时)', '更新时间']

export default {
  name: 'AnalyzerList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  filters: {
    analyzerStatusFilter(type) {
      return statusOptions[type].label
    },
    analyzerStatusTypeFilter(type) {
      return statusOptions[type].type
    }
  },
  mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        statuses: undefined,
        analyzerNo: undefined,
        name: undefined,
        typeId: undefined,
        curId: undefined,
        createId: undefined,
        updateTime: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 'createTime,desc'
      },
      formDataQuery: {},
      statusOptions: statusOptions,

      updateTime: [],

      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'machine',
      columnList: [],
      typeList: []
    }
  },
  computed: {
    ...mapState({
      curId1: state => state.user.id
    }),
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    // 新建、编辑仪器
    newAnalyzer() {
      return this.buttonPermission[this.platform].newAnalyzer
    },
    // 设置
    setting() {
      return this.buttonPermission[this.platform].setting
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
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('updateTime')
      const keyword = []
      const dataTimes = []
      this.columnList.forEach(element => {
        if (this.formDataQuery[element.code]) {
          if (element.type === 'date') {
            if (this.formDataQuery[element.code].length === 2) {
              dataTimes.push({ code: parseInt(element.code), startTime: this.formDataQuery[element.code][0], endTime: this.formDataQuery[element.code][1].replace('00:00:00', '23:59:59') })
            }
          } else {
            keyword.push(JSON.stringify({ [element.code]: this.formDataQuery[element.code] }))
          }
        }
      })

      this.listQuery.keyword = keyword
      this.listQuery.dataTimes = dataTimes
      const statuses = sessionStorage.getItem('statuses')
      if (statuses) {
        this.listQuery.statuses = JSON.parse(statuses)
      }
      if (this.$route.query.awaitDo) {
        this.listQuery.statuses = [1]
        this.listQuery.curId = this.curId1
      }
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.list = this.list.map((item) => {
          if (item.formData) {
            return Object.assign(item, { formData: JSON.parse(item.formData) })
          } else {
            return Object.assign(item, { formData: {}})
          }
        })
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
    }
  }
}
</script>
