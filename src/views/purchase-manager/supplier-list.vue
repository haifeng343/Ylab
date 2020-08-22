<template>
  <div class="app-container">
    <ylab-hiddenable-container v-show="!viewColumnEditing">
      <el-form v-model="listQuery" label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item v-if="checkedColumns.includes('编号')" label="编号：">
          <el-input v-model="listQuery.supplierNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('账期')" label="账期(天)：">
          <el-col :span="11">
            <el-input v-model="itemDate1" type="number" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="itemDate2" type="number" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('联系人')" label="联系人：">
          <el-input v-model="listQuery.contactName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('联系方式')" label="联系方式：">
          <el-input v-model="listQuery.contactPhone" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('简介')" label="简介：">
          <el-input v-model="listQuery.remark" clearable placeholder="请输入" />
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
      <span class="status-text-button">所有供应商</span>
      <el-dropdown v-if="checkPermission(['admin'])" trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="checkPermission(['admin'])" @click.native="$router.push('/purchase-manager/supplier-settings')">设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <el-button class="container-line-button" type="primary" @click="$router.push('/purchase-manager/supplier-create')">
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
      <el-table-column v-if="checkedColumns.includes('编号')" label="编号" width="140" align="center">
        <template slot-scope="{row}">
          <span>{{ row.supplierNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/purchase-manager/supplier-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('账期')" label="账期(天)" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.itemDate }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('联系人')" label="联系人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('联系方式')" label="联系方式" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('简介')" label="简介" min-width="260">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
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
import checkPermission from '@/utils/permission'
import { fetchList } from '@/api/supplier'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'

const fixedColumns = ['编号', '名称', '账期', '联系人', '联系方式', '简介', '更新时间']

export default {
  name: 'SupplierList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        supplierNo: undefined,
        name: undefined,
        contactName: undefined,
        contactPhone: undefined,
        updateTime: undefined,
        itemDate: undefined,
        remark: undefined,
        pageNo: 1,
        pageSize: 20
      },
      formDataQuery: {},

      itemDate1: '',
      itemDate2: '',
      updateTime: [],

      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'supplier',
      columnList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    checkPermission,
    getList() {
      this.listLoading = true
      this.setQueryTime('updateTime')
      // 数量范围
      if (this.itemDate1 && this.itemDate2) {
        this.listQuery.itemDate = `${this.itemDate1},${this.itemDate2}`
      } else {
        this.listQuery.itemDate = undefined
      }
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
