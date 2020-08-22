<template>
  <el-row class="app-container" type="flex">
    <div style="width:320px;flex:none;">
      <div class="grid-content bg-purple app-container">
        <div class="wrapper-title">个人中心</div>
        <div class="personAvatar">
          <img :src="personMsg.avatar" alt="个人头像">
          <span class="wrapper-title">{{ personMsg.name }}</span>
        </div>
        <div class="container-line-item">
          <div class="detail-form-item">
            <span class="detail-form-name">登录账号&nbsp;&nbsp;</span>
            <span class="detail-form-value">{{ personMsg.phone }}</span>
          </div>
          <div class="detail-form-item">
            <span class="detail-form-name">所在公司&nbsp;&nbsp;</span>
            <span class="detail-form-value">{{ personMsg.companyName }}</span>
          </div>
          <div class="detail-form-item">
            <span class="detail-form-name">所在部门&nbsp;&nbsp;</span>
            <span class="detail-form-value">{{ personMsg.deptName }}</span>
          </div>
          <div style="display: flex;width: 100%;line-height: 32px;">
            <span class="detail-form-name" style="flex: none;">角色系统&nbsp;&nbsp;</span>
            <span class="detail-form-value">{{ personMsg.roleName }}</span>
          </div>
          <div class="detail-form-item">
            <span class="detail-form-name">最近登录&nbsp;&nbsp;</span>
            <span class="detail-form-value">{{ personMsg.lastLoginTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-col :span="20">
      <div class="grid-content bg-purple-light app-container" style="padding-right:0;margin-left: 20px;">
        <div class="wrapper-title">ERP操作动态</div>
        <div class="ulwrap" style="overflow: auto;height: 96%;margin-top: 10px;padding-right:20px">
          <ul v-loading="listLoading" style="padding: 0;">
            <li v-for="(item,index) in log" :key="index" style="list-style-type:none;border-bottom: 1px solid rgba(220,223,230,1); padding: 20px 0;">
              <div style="fontSize:16px; margin-bottom: 20px;">{{ item.content }}</div>
              <div class="column1">
                <div class="link-type" @click="toDetail(item)">查看详情<span class="el-icon-arrow-right" /></div>
                <div style="color:rgba(144,147,153,1);">ERP动态  {{ item.createTime }}</div>
              </div>
            </li>
          </ul>
          <pagination
            v-if="total>0"
            :total="total"
            :page.sync="listQuery.pageNo"
            :limit.sync="listQuery.pageSize"
            @pagination="paginationHandler"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { gePerson } from '@/api/user'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
export default {
  name: 'Person',
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      listLoading: false,
      personMsg: {},
      log: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      },
      target: '.ulwrap'
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const id = this.$route.query.id
      if (id) {
        this.listQuery.id = id
      } else {
        this.listQuery.id = this.$store.state.user.id
      }
      this.listLoading = true
      const result = await gePerson(this.listQuery)
      if (result.code === 200) {
        this.personMsg = result.data.employee
        this.log = result.data.log
        this.total = result.data.total
      }
      this.listLoading = false
    },
    toDetail(data) {
      switch (data.type) {
        case 1:
          this.$router.push(`/contract-manager/contract-detail?id=${data.queryId}`)
          break
        case 2:
          this.$router.push(`/contract-manager/task-detail?id=${data.queryId}`)
          break
        case 3:
          this.$router.push(`/contract-manager/record-detail?id=${data.queryId}`)
          break
        case 4:
          this.$router.push(`/purchase-manager/purchase-detail?id=${data.queryId}`)
          break
        case 5:
          this.$router.push(`/store-manager/store-detail?id=${data.queryId}`)
          break
        case 6:
          this.$router.push(`/analyzer-manager/analyzer-detail?id=${data.queryId}`)
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
    background-color: rgba(246,247,251,1);
    height: calc(100vh - 84px);
}
.grid-content{
    background-color: #fff;
    height: 100%;
}
.personAvatar{
    padding: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
        height: 120px;
        width: 120px;
        border-radius: 50%;
        border: 5px solid #C4DFFF;
    }
    span{
        font-size: 18px;
        margin-top: 22px;
    }
}
.wrapper-title {
    font-size:16px;
    font-weight: bold;
  }
.detail-form-item{
    height: 32px;
    line-height: 32px;
}
.column1{
    display: flex;
    justify-content: space-between;
}
.cell{
    div{
        padding: 2px 0;
    }
}
.detail-form-item{
  width: 100%;
}
</style>
