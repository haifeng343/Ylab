<template>
  <div class="app-container">
    <!-- <div class="container-line-item">
      <el-button class="container-line-button" type="primary" style="margin-bottom: 20px;" @click="newBuild = true">新建</el-button>
    </div> -->
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column label="状态" class-name="status-col" width="80" align="center">
        <template slot-scope="{row}">
          <el-tag :type="statusType[row.status]">{{ statusContent[row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="流程名称" min-width="326">
        <template slot-scope="{row}">
          <span class="link-type" @click="$router.push(`/contract-manager/process-detail?id=${row.id}`)">{{ row.name }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="paginationHandler"
    />
    <!-- --------------------------新建弹框----------------------- -->
    <el-dialog
      title="流程新建"
      :visible.sync="newBuild"
      width="400px"
    >
      <el-form :model="editForm" label-width="68px">
        <el-form-item label="流程名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newBuild = false">取消</el-button>
        <el-button type="primary" @click="submitBuild">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getProcessList, PermitEdit } from '@/api/permission'
import { mixin } from '@/utils/ylab-list-common'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProcessList',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      statusType: ['info', 'warning', 'danger', 'danger', 'sucess'],
      statusContent: ['未开始', '审批中', '未提审', '未通过', '已通过'],
      listLoading: false,
      list: null,
      newBuild: false,
      editForm: {
        name: ''
      },
      total: 0,
      listQuery: {
        isTemplate: 0,
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getProcessList(this.listQuery).then((res) => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    submitBuild() {
      PermitEdit(this.editForm).then(res => {
        this.newBuild = false
        this.getList()
      })
    }
  }
}
</script>
