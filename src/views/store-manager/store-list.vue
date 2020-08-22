<template>
  <div class="app-container">
    <ylab-hiddenable-container v-show="!viewColumnEditing">
      <el-form v-model="listQuery" label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="状态：">
          <el-select v-model="listQuery.status" clearable placeholder="请选择">
            <el-option label="无货" value="0" />
            <el-option label="有货" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('编号')" label="编号：">
          <el-input v-model="listQuery.storeNo" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('名称')" label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('规格')" label="规格：">
          <el-input v-model="listQuery.specs" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('数量')" label="数量：">
          <el-col :span="11">
            <el-input v-model="count1" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="count2" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
        </el-form-item>
        <el-form-item v-if="checkedColumns.includes('单价')" label="单价(元)：">
          <el-col :span="11">
            <el-input v-model="averPrice1" clearable style="width: 100%;" placeholder="请输入" />
          </el-col>
          <el-col class="line" :span="2" align="center">-</el-col>
          <el-col :span="11">
            <el-input v-model="averPrice2" clearable style="width: 100%;" placeholder="请输入" />
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
        :class="code==='buy_store'?'status-text-button-actived':'status-text-button'"
        @click="changeCode('buy_store')"
      >
        所有库存
      </span>
      <span
        v-for="type in typeList"
        :key="type.code"
        :class="code===type.code?'status-text-button-actived':'status-text-button'"
        @click="changeCode(type.code, type.id)"
      >
        {{ type.name }}
      </span>
      <el-dropdown v-if="buttonPermissions.includes(storeSetting)" trigger="click" class="container-line-button" size="medium">
        <el-button type="primary">
          <div style="height: 12px;">更多<i class="el-icon-arrow-down el-icon--right" /></div>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="buttonPermissions.includes(storeSetting)" @click.native="$router.push('/store-manager/store-settings')">设置</el-dropdown-item>
          <el-dropdown-item v-if="buttonPermissions.includes(storeSetting)" @click.native="$router.push('/store-manager/batch?type=store')">导入</el-dropdown-item>
          <el-dropdown-item v-if="buttonPermissions.includes(storeSetting)" @click.native="derive">导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button class="container-line-button" type="primary" @click="viewColumnEditing=true">
        视图
      </el-button>
      <el-button v-if="buttonPermissions.includes(storeNew)" class="container-line-button" type="primary" @click="$router.push('/store-manager/store-create')">
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
          <span>{{ row.storeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('名称')" label="名称" min-width="260">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/store-manager/store-detail?id=${row.id}&code=${row.code}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('类型')" label="类型" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('规格')" label="规格" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.specs }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('数量')" label="数量" align="center" width="120">
        <template slot-scope="{row}">
          <!-- <span>{{ row.storeCount }}</span> -->
          <span v-if="Number.isInteger(row.storeCount)">{{ row.storeCount }}</span>
          <span v-else>{{ row.storeCount.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkedColumns.includes('单价')" label="单价(元)" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.storePrice | moneyFilter }}</span>
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
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.storeCount === 0" type="info" disabled>出库</el-button>
          <el-button v-else type="success" @click="receiveConfirm(row)">出库</el-button>
          <el-button type="primary" @click="$router.push(`/purchase-manager/purchase-create?name=${row.name}&specs=${row.specs}&typeName=${row.typeName}&typeId=${row.typeId}`)">采购</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
    <!-- ------------------------------------------------------领用弹框-------------------------------------------- -->
    <el-dialog title="领用确认" :visible.sync="receivePermit" :close-on-click-modal="false" width="440px" @closed="cancelReceive">
      <el-form :model="receive" label-position="left" label-width="80px">
        <el-form-item label="归属项目:">
          <el-select v-model="receive.contractId" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option v-for="(item,index) in contractList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库类型"
          :rules="[
            { required: true }
          ]"
        >
          <el-select v-model="receive.type" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option :label="'领用出库'" :value="5" />
            <el-option :label="'其他出库'" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库规格"
          :rules="[
            { required: true, message: '出库规格必须填'}
          ]"
        >
          <el-select v-model="receive.specs" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option v-for="(item,index) in selectSpecs" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库数量"
          :rules="[
            { required: true, message: '出库数量必须填'}
          ]"
        >
          <el-input v-model="receive.count" type="number" />
        </el-form-item>
      </el-form>
      <div style="font-size:14px; color:#77787D;">确认后将对该采购单下所有物品做出库操作。该操作不可恢复！</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReceive">取 消</el-button>
        <el-button type="primary" @click="handleReceive">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/store'
import { storeReceive } from '@/api/store'
import { fetchTypeList } from '@/api/form'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
import ColumnFilterSettings from '@/views/components/column/ColumnFilterSettings'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'
import { column } from '@/utils/ylab-list-column'
import { fetchContractList } from '@/api/task'
import axios from 'axios'

const fixedColumns = ['编号', '名称', '类型', '规格', '数量', '单价', '更新时间']

export default {
  name: 'StoreList',
  components: { Pagination, YlabHiddenableContainer, ColumnFilterSettings },
  mixins: [mixin, column],
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      receivePermit: false,
      listQuery: {
        status: undefined,
        name: undefined,
        storeNo: undefined,
        count: undefined,
        typeId: undefined,
        averPrice: undefined,
        updateTime: undefined,
        specs: undefined,
        pageNo: 1,
        pageSize: 20
      },
      // 出库确认
      receive: {
        id: undefined,
        count: undefined,
        specs: '',
        contractId: '',
        type: '',
        storeCount: undefined
      },
      contractList: [],
      selectSpecs: [],
      formDataQuery: {},

      updateTime: [],
      count1: '',
      count2: '',
      averPrice1: '',
      averPrice2: '',

      fixedColumns: fixedColumns,
      viewColumnEditing: false,
      code: 'buy_store',
      columnList: [],
      typeList: []
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
    // 新建库存
    storeNew() {
      return this.buttonPermission[this.platform].storeNew
    },
    // 库存设置
    storeSetting() {
      return this.buttonPermission[this.platform].storeSetting
    }
  },
  created() {
    this.getList()
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
    this.getReceiveContraList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('updateTime')
      // 数量范围
      if (this.count1 && this.count2) {
        this.listQuery.count = `${this.count1},${this.count2}`
      } else {
        this.listQuery.count = undefined
      }
      // 价格范围
      if (this.averPrice1 && this.averPrice2) {
        this.listQuery.averPrice = `${this.averPrice1 * 100},${this.averPrice2 * 100}`
      } else {
        this.listQuery.averPrice = undefined
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
    },
    changeCode(code, typeId) {
      this.code = code
      if (typeId) {
        this.listQuery.typeId = typeId
      } else {
        this.listQuery.typeId = undefined
      }
      this.initCheckedColumns()
      this.initFormDataQuery()
      this.handleFilter()
    },
    // 领用
    receiveConfirm(row) {
      this.receive.id = row.id
      if (row.specs) { this.selectSpecs[0] = row.specs }
      if (row.useSpecs) { this.selectSpecs[1] = row.useSpecs }
      this.receive.storeCount = row.storeCount
      this.receivePermit = true
    },
    checkNum(count) {
      var reg = /^[1-9]\d*$/
      if (!reg.test(count)) {
        this.$message.error('领用数量应为正整数')
        this.receive.count = undefined
        return
      }
    },
    handleReceive() {
      if (!this.receive.type) {
        this.$message.error('请输入出库类型')
        return false
      }
      if (!this.receive.specs) {
        this.$message.error('请输入出库规格')
        return false
      }
      if (!this.receive.count) {
        this.$message.error('请输入出库数量')
        return false
      }
      if (this.receive.count > this.receive.storeCount) {
        this.$message.error('领用数量不能超过库存数量')
        return false
      }
      storeReceive(this.receive).then(res => {
        if (res.code === 200) {
          this.receivePermit = false
          this.$router.push(`/store-manager/out-store-detail?id=${res.data.id}`)
        }
      })
    },
    cancelReceive() {
      this.receivePermit = false
      this.receive.count = undefined
      this.receive.id = undefined
      this.receive.specs = ''
      this.receive.contractId = ''
      this.receive.type = ''
      this.selectSpecs.length = 0
    },
    derive() {
      axios({ url: '/admin/buyInfo/store/export', method: 'post', data: this.listQuery, responseType: 'blob' }).then((res) => {
        var blob = new Blob([res.data])
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = `库存.xlsx`
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, `库存.xlsx`)
        }
      })
    },
    getReceiveContraList() {
      fetchContractList({ pageNo: 1, pageSize: 100 }).then(res => {
        this.contractList = res.data.list
      })
    }
  }
}
</script>
