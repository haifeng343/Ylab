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
          <el-input v-model="listQuery.contractNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('类型')" label="类型：">
          <el-select v-model="listQuery.typeId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
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
      <span
        :class="listQuery.isAll===1?'status-text-button-actived':'status-text-button'"
        @click="listQuery.isAll=1; handleFilter();"
      >
        所有合同
      </span>
      <el-dropdown trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$router.push('/sale-manager/sale-settings')">设置</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="$router.push('/contract-manager/batch?type=contract')">导入</el-dropdown-item>
          <el-dropdown-item @click.native="derive">导出</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <el-button class="container-line-button" type="primary" @click="$router.push('/sale-manager/sale-create')">
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
          <el-tag v-if="row.signStatus === 1" type="success">已签署</el-tag>
          <el-tag v-if="row.signStatus === 0" type="info">未签署</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contractNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/sale-manager/sale-detail?id=${row.id}`)">
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('类型')" label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('总金额')" label="总金额" align="center" width="85">
        <template slot-scope="{row}">
          <span>{{ row.totalMoney | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('客户')" label="客户" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.h3Name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('业务员')" label="业务员" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.saleName }}</span>
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
import { fetchList, editContractStatus } from '@/api/contract'
import { fetchTypeList } from '@/api/form'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
import axios from 'axios'
const statusOptions = [
  { value: 0, label: '未签署' },
  { value: 1, label: '已签署' }
]

const fixedColumns = ['状态', '编号', '名称', '类型', '总金额', '客户', '业务员', '更新时间']

export default {
  name: 'SaleList',
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
        contractNo: undefined,
        name: undefined,
        typeId: undefined,
        curId: undefined,
        totalMoney: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 'createTime,desc',
        isAll: 1,
        isSign: 1
      },
      payMoney1: '',
      payMoney2: '',
      formDataQuery: {},
      statusOptions: statusOptions,

      planStartTime: [],
      planEndTime: [],
      createTime: [],
      updateTime: [],

      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'contract',
      columnList: [],
      principalList: [],
      typeList: []
    }
  },
  watch: {
    listQuery: {
      deep: true,
      handler: function() {
        sessionStorage.removeItem('statuses')
        sessionStorage.removeItem('curId')
      }
    }
  },
  created() {
    this.getList()
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('planStartTime')
      this.setQueryTime('planEndTime')
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
        this.listQuery.totalMoney = `${this.payMoney1 * 100},${this.payMoney2 * 100}`
      } else {
        this.listQuery.totalMoney = undefined
      }

      this.listQuery.keyword = keyword
      this.listQuery.dataTimes = dataTimes
      const statuses = sessionStorage.getItem('statuses')
      if (statuses) {
        this.listQuery.statuses = JSON.parse(statuses)
        this.listQuery.curId = JSON.parse(sessionStorage.getItem('curId'))
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
    changeStatus(id, statusNum) {
      editContractStatus({ id, status: statusNum }).then(res => {
        this.getList()
      })
    },
    // 确认结束
    confirmEnd(id, statusNum) {
      this.$confirm('确认结束该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeStatus(id, statusNum)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    derive() {
      axios({ url: '/admin/contract/export', method: 'post', data: this.listQuery, responseType: 'blob' }).then((res) => {
        var blob = new Blob([res.data])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `项目.xlsx`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, `项目.xlsx`)
        }
      })
    }
  }
}
</script>
