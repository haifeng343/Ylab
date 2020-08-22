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
          <el-input v-model="listQuery.buyNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="退货情况：">
          <el-select v-model="listQuery.isBack" filterable clearable placeholder="请选择">
            <el-option label="有退货" value="1" />
            <el-option label="无退货" value="0" />
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
        <el-form-item v-if="checkedColumns.includes('申请人')" label="申请人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('申请时间')" label="申请时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item label="更新时间">
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
      <span class="status-text-button">所有采购</span>
      <el-dropdown v-if="buttonPermissions.includes(purchaseSetting)" trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="buttonPermissions.includes(purchaseSetting)" @click.native="$router.push('/purchase-manager/purchase-settings')">设置</el-dropdown-item>
          <el-dropdown-item v-if="buttonPermissions.includes(purchaseSetting)" @click.native="derive">导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <el-button class="container-line-button" type="primary" @click="$router.push('/purchase-manager/purchase-create')">
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
          <el-tag :type="row.status | statusTypeFilter">{{ row.status | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buyNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${row.id}`)">{{ row.name }}</span>
          <el-tag v-if="row.isBack" type="danger" style="margin-left: 5px;">有退货</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('总金额')" label="总金额(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.payMoney | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('申请人')" prop="curName" label="申请人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('申请时间')" label="申请时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160" class-name="small-padding">
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
import { fetchList } from '@/api/purchase'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
import axios from 'axios'

const fixedColumns = ['状态', '编号', '名称', '总金额', '申请人', '申请时间']

const statusOptions = [
  // 审判中停止
  { value: 2, label: '已取消' },
  { value: 4, label: '已完成' },
  { value: 5, label: '审核中' },
  { value: 6, label: '采购中' },
  { value: 7, label: '未通过' }
]

export default {
  name: 'PurchaseList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        statuses: undefined,
        buyNo: undefined,
        name: undefined,
        payMoney: undefined,
        createId: undefined,
        createTime: undefined,
        updateTime: undefined,
        pageNo: 1,
        pageSize: 20,
        isBack: ''
      },
      formDataQuery: {},
      statusOptions: statusOptions,

      payMoney1: '',
      payMoney2: '',
      createTime: [],
      updateTime: [],
      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'buy_order',
      columnList: [],
      principalList: []
    }
  },
  computed: {
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    // 采购设置
    purchaseSetting() {
      return this.buttonPermission[this.platform].purchaseSetting
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
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('createTime')
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

      if (this.payMoney1 && this.payMoney2) {
        this.listQuery.payMoney = `${this.payMoney1 * 100},${this.payMoney2 * 100}`
      } else {
        this.listQuery.payMoney = undefined
      }
      this.listQuery.keyword = keyword
      this.listQuery.dataTimes = dataTimes
      this.listQuery.code = this.code
      const statuses = sessionStorage.getItem('statuses')
      if (statuses) {
        this.listQuery.statuses = JSON.parse(statuses)
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
    },
    derive() {
      axios({ url: '/admin/buy/export', method: 'post', data: this.listQuery, responseType: 'blob' }).then((res) => {
        var blob = new Blob([res.data])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `采购.xlsx`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, `采购.xlsx`)
        }
      })
    }
  }
}
</script>
