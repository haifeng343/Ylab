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
            <el-table-column label="操作" align="center" width="132">
              <template slot-scope="{row}">
                <div>
                  <el-link v-if="row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="openFile(row)">预览</el-link>
                  <el-link v-else type="info" disabled>预览</el-link>
                  <el-link v-if="row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownFile(row)">下载</el-link>
                  <el-link v-else-if="row.type === 2 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownBatch(row)">下载</el-link>
                  <el-link v-else type="info" disabled>下载</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
            <el-table-column label="操作" align="center" width="132">
              <template slot-scope="{row}">
                <div>
                  <el-link v-if="row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="openFile(row)">预览</el-link>
                  <el-link v-else type="info" disabled>预览</el-link>
                  <el-link v-if="row.type === 1 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownFile(row)">下载</el-link>
                  <el-link v-else-if="row.type === 2 && row.status !== 3 && row.status !== 1" type="primary" @click="sendDownBatch(row)">下载</el-link>
                  <el-link v-else type="info" disabled>下载</el-link>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="paginationHandler" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import download from 'downloadjs'
import { fileList, fileDownBatch } from '@/api/task'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
export default {
  name: 'DataReport',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      reportList: [],
      total: 0,
      listLoading: false,
      isShowDownBatch: false,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        name: '',
        parentId: 0,
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
  },
  methods: {
    async getList() {
      this.listQuery.objId = this.$route.query.id
      this.listLoading = true
      const result = await fileList(this.listQuery)
      this.listLoading = false
      this.reportList = result.data.list
      this.total = result.data.total
      this.canDownBatch()
    },
    async sendDownBatch(row) {
      const result = await fileDownBatch({ objId: this.$route.query.id, parentId: row.id })
      download(result, `${row.name ? row.name : '打包数据'}.zip`, 'gzip')
    },
    sendDownFile(row) {
      axios.get(`http://${row.name}`, { responseType: 'blob' }).then((response) => {
        download(response.data, row.name.split('-')[row.name.split('-').length - 1])
      })
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
      dataTotalArr.forEach(item => {
        if (item.status === 1 || item.status === 3) {
          this.isShowDownBatch = false
        }
      })
    }
  }
}
</script>

