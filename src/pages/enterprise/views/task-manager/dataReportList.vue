<template>
  <div class="app-container">
    <ylab-hiddenable-container>
      <el-form label-position="left" :inline="true" class="ybr-form-row" style="width: calc(100% - 80px);">
        <el-form-item label="名称：">
          <el-input v-model="listQuery.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="归属项目：">
          <el-select v-model="listQuery.contractId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in contractList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="归属实验：">
          <el-select v-model="listQuery.objId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in experimentList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传人：">
          <el-select v-model="listQuery.createId" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间：">
          <el-date-picker v-model="createTime" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" clearable range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
      </el-form>
      <el-button class="container-line-button" type="primary" @click="handleFilter">
        搜索
      </el-button>
    </ylab-hiddenable-container>
    <div class="container-line-item" style=" display: flex; align-items: center;">
      <span class="status-text-button" style=" margin-right: 0;" @click="rootFolder">所有数据与报告</span>
      <span v-for="(item,index) in folderArr" :key="index">
        <el-link type="info" :underline="false" @click="parentFolder(index)">
          <i class="el-icon-arrow-right" />{{ item.name }}
        </el-link>
      </span>
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
          <div v-if="row.type === 1">
            <svg-icon icon-class="file" style="color:#3352FA;" />
            <span style="color:#263A9E;">{{ row.name.split('-')[row.name.split('-').length-1] }}</span>
            <el-tag v-if="row.status === 1 && row.canApprove && listQuery.parentId === 0" type="danger">待审批</el-tag>
          </div>
          <div v-else style="cursor:pointer" @click="selectFolder(row)">
            <svg-icon icon-class="folder" style="color:#3352FA;" />
            <span style="color:#263A9E;">{{ row.name }}</span>
            <el-tag v-if="row.status === 1 && row.canApprove && listQuery.parentId === 0" type="danger">待审批</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="归属项目" align="center" width="240">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/contract-detail?id=${row.contractId}`)">{{ row.contractName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="归属实验" align="center" width="240">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/experiment-detail?id=${row.experimentId}`)">{{ row.experimentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" align="center" width="160" class-name="small-padding">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="110">
        <template slot-scope="{row}">
          <el-button v-if="row.status === 1 && row.canApprove && listQuery.parentId === 0" type="primary" @click="showApprove(row)">审批</el-button>
          <el-button v-else type="info" disabled>审批</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
    <!-- ---------------------------------------------审核弹框-------------------------------------------------- -->
    <el-dialog title="审批数据与报告" :visible.sync="audit" :close-on-click-modal="false" width="30%">
      <el-form :model="auditForm">
        <el-form-item label="审批意见" label-width="68px">
          <el-input v-model="auditForm.approveRemark" type="textarea" autocomplete="off" placeholder="补充审批意见" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="reject">拒 绝</el-button>
        <el-button type="primary" @click="pass">通 过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fileList, fileUpdateStatus } from '@/api/task'
import { fetchList } from '@/api/contract'
import { experimentFetchList } from '@/api/experiment'
import { fetchPersonList } from '@/api/common'
import Pagination from '@/components/Pagination'
import YlabHiddenableContainer from '@/views/components/YlabHiddenableContainer'
// eslint-disable-next-line
import { parseTime } from '@/utils'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'DataReportList',
  components: { Pagination, YlabHiddenableContainer },
  mixins: [mixin],
  data() {
    return {
      audit: false,
      auditForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        name: undefined,
        createId: undefined,
        contractId: undefined,
        objId: undefined,
        createTime: undefined,
        pageNo: 1,
        pageSize: 20,
        parentId: 0
      },
      createTime: [],
      principalList: [],
      contractList: [],
      experimentList: [],
      folderArr: []
    }
  },
  mounted() {
    this.getList()
    this.getContract()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.setQueryTime('createTime')
      fileList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
      fetchPersonList().then(res => {
        this.principalList = res.data.list
      })
    },
    async getContract() {
      const result = await fetchList({ pageNo: 1, pageSize: 10000 })
      this.contractList = result.data.list
      const experimentResult = await experimentFetchList({ pageNo: 1, pageSize: 10000 })
      this.experimentList = experimentResult.data.list
    },
    selectFolder(row) {
      if (row.status === 3) {
        return
      }
      this.folderArr.push(row)
      this.listQuery.parentId = this.listQuery.parentId + ',' + row.id
      this.getList()
    },
    // 审批
    showApprove(row) {
      this.audit = true
      this.auditForm.id = row.id
    },
    // 通过审批
    pass() {
      this.auditForm.status = 4
      fileUpdateStatus(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.getList()
        }
      })
    },
    // 拒绝审批
    reject() {
      this.auditForm.status = 3
      fileUpdateStatus(this.auditForm).then(res => {
        if (res.code === 200) {
          this.audit = false
          this.auditForm.approveRemark = ''
          this.getList()
        }
      })
    },
    rootFolder() {
      this.folderArr.length = 0
      this.listQuery.parentId = 0
      this.getList()
    },
    parentFolder(index) {
      this.folderArr.length = index + 1
      this.listQuery.parentId = this.folderArr.reduce((val, item) => {
        return val + ',' + item.id
      }, '0')
      this.getList()
    }
  }
}
</script>
