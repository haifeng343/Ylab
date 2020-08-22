<template>
  <div id="app">
    <router-view />
    <el-dialog
      :visible.sync="$store.getters['user/showOutTime']"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="outTime"
    >
      <a @click="jumpToBuy">
        <img v-if="$store.state.user.roles.includes('admin')" src="../../assets/image/outTime.png">
        <img v-else src="../../assets/image/outTime1.png">
      </a>
      <!-- <div v-if="roles.includes('admin')" style="text-align: center;"><span>试用期30天已到,</span><a href="http://www.yibeirui.com/lab.html#/lab">点此联系我们</a></div>
      <div v-else style="text-align: center;"><span>试用期30天已到,请提醒管理员购买服务</span></div> -->
    </el-dialog>
    <el-dialog title="邀请外部成员加入" :visible.sync="$store.state.user.inviteDialog" :close-on-click-modal="false" width="544px">
      <div style="color:#303133; font-size:14px; margin-bottom:16px;">将链接发送给小伙伴</div>
      <el-input v-model="message" style="width:400px;max-width:100%;" />
      <el-button type="primary" icon="el-icon-document" @click="handleCopy(message, $event)">
        复制链接
      </el-button>
      <div style="margin:24px 24px 0 0; color:#909399;font-size:12px;">被邀请的成员如无账号需要注册后加入，已有账号可在被邀请页面登录加入</div>
      <div style="margin:0 24px 0 0; color:#5370FF;font-size:14px;">窗口关闭后可在系统设置-用户管理里重新邀请</div>
    </el-dialog>
    <!-- --------------------------------人数超过50提醒弹框 ------------------------->
    <el-dialog title="邀请外部成员加入" :visible.sync="$store.state.user.inviteLimitDialog" :close-on-click-modal="false" width="544px">
      <div style="color:#303133; line-height: 24px; font-size:16px; margin-bottom:16px;">当前团队人数已满50人，继续邀请将额外增加运维费用，请与开发团队联络 021-20787300-8033（9:00-18:00）</div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import clip from '@/utils/clipboard'
import { inviteMember } from '@/api/user'
export default {
  name: 'App',
  data() {
    return {
      message: ''
    }
  },
  computed: {
    ...mapState({
      lastTime: state => state.user.lastTime,
      roles: state => state.user.roles
    })
  },
  watch: {
    '$store.state.user.inviteDialog'() {
      this.invite()
    }
  },
  methods: {
    jumpToBuy() {
      const index = window.location.href.search('/html')
      const href = window.location.href.substr(0, index)
      window.location.href = `${href}/html/lab.html#/product`
    },
    handleCopy(text, event) {
      clip(text, event)
      this.$store.state.user.inviteDialog = false
    },
    invite() {
      inviteMember().then(res => {
        this.message = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>

>>>.outTime{
  .el-dialog{
    width: 360px;
    .el-dialog__header{
      display: none;
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}

</style>
