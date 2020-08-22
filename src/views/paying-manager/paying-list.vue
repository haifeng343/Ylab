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
          <el-input v-model="listQuery.paymentNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('类型')" label="类型：">
          <el-select v-model="listQuery.typeId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('申请人')" label="申请人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('总金额')" label="总金额：">
          <el-col :span="11">
            <el-input v-model="payMoney1" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="payMoney2" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('申请时间')" label="申请时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
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
          <el-dropdown-item v-if="buttonPermissions.includes(setting)" @click.native="$router.push('/paying-manager/paying-settings')">设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
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
          <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.paymentNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/paying-manager/paying-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('类型')" label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('总金额')" label="总金额" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.payMoney | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('申请人')" label="申请人" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('申请时间')" label="申请时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
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
import { getPayList } from '@/api/paying'
import { fetchTypeList } from '@/api/form'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
import { mapState } from 'vuex'
import { fetchPersonList } from '@/api/common'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
const statusOptions = [
  { value: 1, label: '审核中', type: '' },
  { value: 2, label: '已取消', type: 'danger' },
  { value: 3, label: '未通过', type: 'info' },
  { value: 4, label: '已付款', type: 'success' },
  { value: 5, label: '待付款', type: 'warning' }
]

const fixedColumns = ['状态', '编号', '名称', '类型', '总金额', '申请人', '申请时间', '更新时间']

export default {
  name: 'PayingList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  filters: {
    statusFilter(status) {
      return statusOptions[status - 1].label
    },
    statusTypeFilter(status) {
      return statusOptions[status - 1].type
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
        payMoney: undefined,
        createTime: undefined,
        updateTime: undefined,
        pageNo: 1,
        pageSize: 20
      },
      formDataQuery: {},
      statusOptions: statusOptions,

      updateTime: [],
      createTime: [],
      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'buy_pay',
      payMoney1: '',
      payMoney2: '',
      columnList: [],
      principalList: [],
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
    // 设置
    setting() {
      return this.buttonPermission[this.platform].setting
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
      this.setQueryTime('createTime')
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
      if (this.payMoney1 && this.payMoney2) {
        this.listQuery.payMoney = `${this.payMoney1 * 100},${this.payMoney2 * 100}`
      } else {
        this.listQuery.payMoney = undefined
      }
      this.listQuery.keyword = keyword
      this.listQuery.dataTimes = dataTimes
      getPayList(this.listQuery).then(response => {
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
      fetchPersonList().then(res => {
        this.principalList = res.data.list
      })
    }
  }
}
</script>
