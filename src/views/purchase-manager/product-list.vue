<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="原价(元)：">
          <el-col :span="11">
            <el-input v-model="originPrice1" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="originPrice2" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
        </el-form-item>
        <el-form-item label="采购价(元)：">
          <el-col :span="11">
            <el-input v-model="buyPrice1" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="buyPrice2" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
        </el-form-item>
        <el-form-item label="税率(%)：">
          <el-input v-model="listQuery.taxRate" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="品牌：">
          <el-input v-model="listQuery.brand" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="货号：">
          <el-input v-model="listQuery.itemNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="供应商：">
          <el-select v-model="listQuery.supplierId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in supplierList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">所有常用采购品</span>
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
      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价(元)" align="right" width="120">
        <template slot-scope="{row}">
          <span>{{ row.originPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购价(元)" align="right" width="120">
        <template slot-scope="{row}">
          <span>{{ row.buyPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" align="center" width="90">
        <template slot-scope="{row}">
          <span>{{ row.taxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" align="center">
        <template slot-scope="{row}">
          <span>{{ row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center" width="140">
        <template slot-scope="{row}">
          <span>{{ row.itemNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="200">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/purchase-manager/supplier-detail?id=${row.supplierId}`)">{{ row.supplierName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
  </div>
</template>

<script>
import { fetchList } from '@/api/supplier'
import { querycommonProduct } from '@/api/purchase'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'ProductList',
  components: { Pagination, YlabHiddenableContainer },
  mixins: [mixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        // storeNo: undefined,
        name: undefined,
        originPrice: undefined,
        buyPrice: undefined,
        taxRate: undefined,
        brand: undefined,
        itemNo: undefined,
        supplierId: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: ''
      },
      value1: [],
      supplierList: [],
      originPrice1: '',
      originPrice2: '',
      buyPrice1: '',
      buyPrice2: ''
    }
  },
  created() {
    this.getList()
    fetchList({ pageNo: 1, pageSize: 10000 }).then(res => {
      this.supplierList = res.data.list
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.originPrice1 && this.originPrice2) {
        this.originPrice1 = this.originPrice1 * 100
        this.originPrice2 = this.originPrice2 * 100
        this.listQuery.originPrice = `${this.originPrice1},${this.originPrice2}`
      } else {
        this.listQuery.originPrice = undefined
      }
      if (this.buyPrice1 && this.buyPrice2) {
        this.buyPrice1 = this.buyPrice1 * 100
        this.buyPrice2 = this.buyPrice2 * 100
        this.listQuery.buyPrice = `${this.buyPrice1},${this.buyPrice2}`
      } else {
        this.listQuery.buyPrice = undefined
      }
      querycommonProduct(this.listQuery).then(response => {
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
