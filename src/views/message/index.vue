<template>
  <div class="app-container">
    <div>
      <div class="clearBtn" style="margin-left: 20px;" @click="showDel = true">
        <svg-icon icon-class="lajitong" />删除已读
      </div>
      <div class="clearBtn" @click="allRead">
        <svg-icon icon-class="clear" style="line-height: 16px;" />全部已读
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="msgData"
      border
      style="width: 100%"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      @row-click="MessageRead"
    >
      <el-table-column label="发送人" align="center" width="110">
        <template slot-scope="{row}">
          <span :class="{read:row.status}">{{ row.createName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="center">
        <template slot-scope="{row}">
          <div class="duiqiMsg">
            <span style="display: inline;" :class="{read:row.status}">{{ row.content }}</span>
            <el-tag v-if="!row.status" type="danger">NEW</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="具体页面" align="center" width="400">
        <template slot-scope="{row}">
          <el-link
            v-if="row.hrefContent"
            :type="!row.status?'primary':'info'"
            :underline="false"
            @click="MessageRead(row, '', '',true)"
          >{{ row.hrefContent }}</el-link>
          <span v-else :class="{read:row.status}">无</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" align="center" width="160">
        <template slot-scope="{row}">
          <span :class="{read:row.status}">{{ row.createTime }}</span>
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
    <el-dialog
      title="提示"
      :visible.sync="showDel"
      width="416px"
    >
      <span>确认删除所有已读消息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDel = false">取 消</el-button>
        <el-button type="primary" @click="delAllRead">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMessages, sendMessageRead, delReadMsg } from '@/api/message'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'

export default {
  name: 'Message',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      msgData: [],
      total: 0,
      listLoading: false,
      showDel: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    const { getList } = this
    getList()
  },
  methods: {
    async allRead() {
      await sendMessageRead({})
      this.getList()
    },
    async MessageRead(row, column, event, isGoto) {
      const { href, id } = row
      if (isGoto) {
        this.$router.push(href.slice(1))
      }
      await sendMessageRead({ ids: id })
      this.getList()
    },
    async getList() {
      const { pageNo, pageSize } = this.listQuery
      this.listLoading = true
      this.$store.dispatch('user/getMsgTip')
      const result = await getMessages({ pageNo, pageSize })
      if (result.code === 200) {
        this.msgData = result.data.list
        this.total = result.data.total
        this.msgData.forEach(item => {
          if (item.href) {
            item.hrefContent = item.href.split(',')[0]
            item.href = item.href.split(',')[1]
          }
        })
        this.listLoading = false
      }
    },
    async delAllRead() {
      this.showDel = false
      const result = await delReadMsg()
      if (result.code === 200) {
        this.$message.success('删除成功')
        this.listQuery.pageNo = 1
        this.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.read {
  color: #a6a9ad;
}

</style>
