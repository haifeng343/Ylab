<template>
  <div>
    <div class="container-line-title" style="margin-top:20px;">
      <span class="detail-subtitle">数据与报告</span>
      <span v-if="isShowDownBatch">
        <svg-icon icon-class="zip233" style="color:#3352FA;" />
        <el-link type="primary" @click="sendDownBatch">打包下载</el-link>
      </span>
      <span v-else>
        <svg-icon icon-class="zip233" style="color: #c8c9cc;" />
        <el-link type="info" disabled>打包下载</el-link>
      </span>
    </div>
    <div style="position: relative;">
      <el-tabs v-model="listQuery.kinds" style="margin-top:15px;" type="border-card">
        <el-tab-pane label="报告" name="1">
          <div style="height: 40px; line-height: 40px;">
            <el-link type="info" :underline="false" @click="rootFolder">全部文件</el-link>
            <span v-for="(item,index) in folderArr" :key="index">
              <i class="el-icon-arrow-right" />
              <el-link type="info" :underline="false" @click="parentFolder(index)">{{ item.name }}</el-link>
            </span>
          </div>
          <el-table
            v-loading="listLoading"
            :data="reportList"
            border
            style="width: 100%"
          >
            <el-table-column label="文件标题" align="left">
              <template slot-scope="{row}">
                <div v-if="row.type === 1">
                  <svg-icon icon-class="file" style="color:#3352FA;" />
                  <span style="color:#263A9E;">{{ row.name.split('-')[row.name.split('-').length-1] }}</span>
                  <el-tag v-if="row.status === 1 && listQuery.parentId == 0" type="danger">待审批</el-tag>
                </div>
                <div v-else style="cursor:pointer">
                  <svg-icon icon-class="folder" style="color:#3352FA;" />
                  <span style="color:#263A9E;" @click="selectFolder(row)">{{ row.name }}</span>
                  <el-tag v-if="row.status === 1 && listQuery.parentId == 0" type="danger">待审批</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="文件大小" align="center" width="105">
              <template slot-scope="{row}">
                <span>{{ Math.ceil(row.size) }} k</span>
              </template>
            </el-table-column>
            <el-table-column label="上传人" align="center" width="168">
              <template slot-scope="{row}">
                <span>{{ row.createName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传时间" align="center" width="168">
              <template slot-scope="{row}">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
              <template slot-scope="{row}">
                <div>
                  <el-link v-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="openFile(row)">预览</el-link>
                  <el-link v-else type="info" disabled>预览</el-link>
                  <el-link v-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownFile(row)">下载</el-link>
                  <el-link v-else-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 2 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownBatch(row)">下载</el-link>
                  <el-link v-else type="info" disabled>下载</el-link>
                  <el-link v-if="row.status === 1 && row.canApprove && listQuery.parentId == 0" type="primary" @click="showApprove(row)">审批</el-link>
                  <el-link v-else type="info" disabled>审批</el-link>
                  <el-link v-if="$store.state.user.roles.includes('admin') || row.canDelete" type="danger" @click="deleteData(row)">删除</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 40px; border: 1px solid #dfe6ec; border-top: 0;text-align: right;line-height: 40px;padding-right: 20px;">
            <el-link :underline="false" @click="showDownloadRecord = true">查看下载记录</el-link>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
        </el-tab-pane>
        <el-tab-pane label="原始数据" name="2">
          <div style="height: 40px; line-height: 40px;">
            <el-link type="info" :underline="false" @click="rootFolder">全部文件</el-link>
            <span v-for="(item,index) in folderArr" :key="index">
              <i class="el-icon-arrow-right" />
              <el-link type="info" :underline="false" @click="parentFolder(index)">{{ item.name }}</el-link>
            </span>
          </div>
          <el-table
            v-loading="listLoading"
            :data="reportList"
            border
            style="width: 100%"
          >
            <el-table-column label="文件标题" align="left">
              <template slot-scope="{row}">
                <div v-if="row.type === 1">
                  <svg-icon icon-class="file" style="color:#3352FA;" />
                  <span style="color:#263A9E;">{{ row.name.split('-')[row.name.split('-').length-1] }}</span>
                  <el-tag v-if="row.status === 1 && row.canApprove && listQuery.parentId == 0" type="danger">待审批</el-tag>
                </div>
                <div v-else style="cursor:pointer">
                  <svg-icon icon-class="folder" style="color:#3352FA;" />
                  <span style="color:#263A9E;" @click="selectFolder(row)">{{ row.name }}</span>
                  <el-tag v-if="row.status === 1 && row.canApprove && listQuery.parentId == 0" type="danger">待审批</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="文件大小" align="center" width="105">
              <template slot-scope="{row}">
                <span>{{ Math.ceil(row.size) }} k</span>
              </template>
            </el-table-column>
            <el-table-column label="上传人" align="center" width="168">
              <template slot-scope="{row}">
                <span>{{ row.createName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="上传时间" align="center" width="168">
              <template slot-scope="{row}">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="160">
              <template slot-scope="{row}">
                <div>
                  <el-link v-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="openFile(row)">预览</el-link>
                  <el-link v-else type="info" disabled>预览</el-link>
                  <el-link v-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownFile(row)">下载</el-link>
                  <el-link v-else-if="($store.state.user.roles.includes('admin') || row.canDownload) && row.type === 2 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownBatch(row)">下载</el-link>
                  <el-link v-else type="info" disabled>下载</el-link>
                  <el-link v-if="row.status === 1 && row.canApprove && listQuery.parentId == 0" type="primary" @click="showApprove(row)">审批</el-link>
                  <el-link v-else type="info" disabled>审批</el-link>
                  <el-link v-if="$store.state.user.roles.includes('admin') || row.canDelete" type="danger" @click="deleteData(row)">删除</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="height: 40px; border: 1px solid #dfe6ec; border-top: 0;text-align: right;line-height: 40px;padding-right: 20px;">
            <el-link :underline="false" @click="showDownloadRecord = true">查看下载记录</el-link>
          </div>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
        </el-tab-pane>
      </el-tabs>
      <div style="position: absolute; right: 16px; top: 6px; width: 80px; height: 28px;overflow: hidden;">
        <el-button
          size="mini"
          type="primary"
        >
          上传文件
        </el-button>
        <input type="file" multiple style="position: absolute;left: 0px;top: 0;width: 80px; height: 28px; cursor: pointer; opacity: 0;" @change="chooseFiles">
      </div>
      <div style="position: absolute; right: 120px; top: 6px; width: 92px; height: 28px;overflow: hidden;">
        <el-button
          size="mini"
          type="primary"
        >
          上传文件夹
        </el-button>
        <input type="file" webkitdirectory style="position: absolute;left: 0px;top: 0;width: 92px; height: 28px; cursor: pointer; opacity: 0;" @change="chooseFiles">
      </div>
    </div>
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
    <!-- ---------------------------------------------查看下载记录-------------------------------------------------- -->
    <el-dialog title="下载记录" :visible.sync="showDownloadRecord" :close-on-click-modal="false" width="1080px">
      <el-table
        :data="downloadLog"
        border
        style="width: 100%"
      >
        <el-table-column label="下载人" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.operateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载明细" align="center">
          <template slot-scope="{row}">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载时间" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import download from 'downloadjs'
import { fileList, fileDelete, fileDownBatch, fileUpdateStatus, fileDownloadRecord, queryDownloadRecord } from '@/api/task'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
import { EventBus } from '@/utils/event-bus'
export default {
  name: 'DataReport',
  components: { Pagination },
  mixins: [mixin],
  props: {
    contractId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      audit: false,
      auditForm: {
        id: undefined,
        approveRemark: '',
        status: undefined
      },
      isShowDownBatch: false,
      showDownloadRecord: false,
      downloadLog: [],
      reportList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        parentId: '0',
        kinds: '1'
      },
      folderArr: []
    }
  },
  watch: {
    'listQuery.kinds': function(data) {
      this.rootFolder()
    }
  },
  mounted() {
    this.getList()
    EventBus.$on('refreshDownload', () => {
      this.getList()
    })
  },
  methods: {
    async getList() {
      this.listQuery.objId = this.$route.query.id
      this.listLoading = true
      const result = await fileList(this.listQuery)
      this.listLoading = false
      this.reportList = result.data.list
      this.total = result.data.total
      this.getDownloadRecord()
      this.canDownBatch()
    },
    async getDownloadRecord() {
      const result = await queryDownloadRecord({ experimentId: this.$route.query.id, type: 20 })
      this.downloadLog = result.data.log
    },
    chooseFiles(event) {
      this.$store.state.user.showUpLoad = true
      const fileData = {}
      fileData.ev = event
      fileData.kinds = this.listQuery.kinds
      fileData.contractId = this.contractId
      EventBus.$emit('uploadFile', fileData)
    },
    deleteData(row) {
      this.$confirm(`即将删除文件${row.type === 1 ? row.name.split('-')[row.name.split('-').length - 1] : row.name}，确认删除吗?`, '删除文件', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async() => {
        await fileDelete({ id: row.id })
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async sendDownBatch(row) {
      const result = await fileDownBatch({ objId: this.$route.query.id, parentId: row.id })
      download(result, `${row.name ? row.name : '打包数据'}.zip`, 'gzip')
      this.getDownloadRecord()
    },
    async sendDownFile(row) {
      const result = await axios.get(`http://${row.name}`, { responseType: 'blob' })
      download(result.data, row.name.split('-')[row.name.split('-').length - 1])
      await fileDownloadRecord({ experimentId: this.$route.query.id, content: `下载了${row.name.split('-')[row.name.split('-').length - 1]}文件` })
      this.getDownloadRecord()
    },
    openFile(row) {
      window.open(`http://${row.name}`)
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
      this.listQuery.parentId = '0'
      this.getList()
    },
    parentFolder(index) {
      this.folderArr.length = index + 1
      this.listQuery.parentId = this.folderArr.reduce((val, item) => {
        return val + ',' + item.id
      }, '0')
      this.getList()
    },
    async canDownBatch() {
      const report = await fileList({
        pageNo: 1,
        pageSize: 9999,
        objId: this.$route.query.id,
        name: '',
        parentId: '0',
        kinds: '1'
      })
      const initData = await fileList({
        pageNo: 1,
        pageSize: 9999,
        objId: this.$route.query.id,
        name: '',
        parentId: '0',
        kinds: '2'
      })
      this.isShowDownBatch = true
      const dataTotalArr = [...report.data.list, ...initData.data.list]
      console.log(dataTotalArr)
      dataTotalArr.forEach(item => {
        if (item.status === 1 || item.status === 3) {
          this.isShowDownBatch = false
        }
      })
    }
  }
}
</script>

