<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="编号：">
          <el-input v-model="listQuery.storeNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="listQuery.queryType" filterable clearable placeholder="请选择">
            <el-option label="采购入库" :value="1" />
            <el-option label="新建入库" :value="2" />
            <el-option label="领用退回" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库数量：">
          <el-col :span="11">
            <el-input v-model="listQuery.count1" type="number" clearable style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="listQuery.count2" type="number" clearable style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="入库单价(元)：">
          <el-col :span="11">
            <el-input v-model="buyPrice1" clearable style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="buyPrice2" clearable style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="采购订单编号：">
          <el-input v-model="listQuery.buyNo" clearable placeholder="采购订单编号" />
        </el-form-item>
        <el-form-item label="入库人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item">
      <span class="status-text-button">入库记录</span>
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
      <el-table-column label="编号" align="left" width="200">
        <template slot-scope="{row}">
          <span>{{ row.storeNo }}</span>
          <el-tag v-if="row.type === 4" type="danger" style="margin-left: 5px;">已退货</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/store-manager/store-detail?id=${row.storeId}&code=${row.code}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="类型" align="center" width="120">
        <template slot-scope="{row}">
          <span v-if="!row.buyNo && row.type === 5 || !row.buyNo && row.type === 6">领用退回</span>
          <span v-else-if="!row.buyNo && row.type === 3">新建入库</span>
          <span v-else-if="row.type === 3 || row.type === 4">采购入库</span>
        </template>
      </el-table-column>
      <el-table-column label="入库数量" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库单价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.buyPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购订单编号" align="center" width="140">
        <template slot-scope="{row}">
          <span v-if="row.buyId" class="link-type" @click="$router.push(`/purchase-manager/purchase-detail?id=${row.buyId}`)">{{ row.buyNo }}</span>
          <span v-else>无订单</span>
        </template>
      </el-table-column>
      <el-table-column label="入库人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click="printHandler(row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: space-between;">
      <div style="margin-top: 20px; font-size: 14px; padding-left: 8px; color: #909399;">备注：无订单表示该批次物品不来自采购渠道</div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
    </div>
  </div>
</template>

<script>
import { print } from '@/utils/print'
import { queryStorage } from '@/api/purchase'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { moneyFilter } from '@/filters'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'InStoreList',
  components: { Pagination, YlabHiddenableContainer },
  mixins: [mixin],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        storeNo: undefined,
        name: undefined,
        queryType: undefined,
        count: undefined,
        buyPrice: undefined,
        buyNo: undefined,
        createId: undefined,
        createTime: undefined,
        pageNo: 1,
        pageSize: 20,
        sort: 2,
        type: 3
      },
      createTime: [],
      count1: '',
      count2: '',
      buyPrice1: '',
      buyPrice2: '',
      principalList: []
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  created() {
    this.getList()
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
  },
  methods: {
    // <tr>
    //   <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库单号</td>
    //   <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="6">${row.buyInfoNo}</td>
    // </tr>
    printHandler(row) {
      const printHtml = `<div style="font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; line-height: 60px;">
          入库信息
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;" border="1" cellspacing="0">
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库物品</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.name}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">物品类型</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.typeName}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库人</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.createName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库时间</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.createTime}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">库存编号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.storeNo}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">品牌</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.brand ? row.brand : ''}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">规格</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.storeSpecs}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">数量</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${row.count}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库单价</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${moneyFilter(row.buyPrice)}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">入库类型</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">
  ${(!row.buyNo && row.type === 5 || !row.buyNo && row.type === 6) ? '领用退回' : ((!row.buyNo && row.type === 3) ? '新建入库' : '采购入库')}
            </td>
          </tr>
          
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">采购订单编号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="6">${row.buyNo ? row.buyNo : '无关联订单'}</td>
          </tr>
        </table>
        <div style="margin-top: 10px;">
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印人：${this.userName}</div>
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印时间：${parseTime(new Date())}</div>
        </div>`
      print(printHtml)
    },
    getList() {
      this.listLoading = true
      this.setQueryTime('createTime')
      // 数量范围
      if (this.count1 && this.count2) {
        this.listQuery.count = `${this.count1},${this.count2}`
      } else {
        this.listQuery.count = undefined
      }
      // 价格范围
      if (this.buyPrice1 && this.buyPrice2) {
        this.listQuery.buyPrice = `${this.buyPrice1 * 100},${this.buyPrice2 * 100}`
      } else {
        this.listQuery.buyPrice = undefined
      }
      queryStorage(this.listQuery).then(response => {
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
