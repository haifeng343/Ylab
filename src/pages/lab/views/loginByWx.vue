<template>
  <div class="bottom">
    <div class="content">
      <div style="width: 100%;">
        <iframe id="iframe_id" class="ybr_qrcode" src="https://open.weixin.qq.com/connect/qrconnect?appid=wx7c56490d688dae6f&redirect_uri=http%3A%2F%2Fwww.yibeirui.com%2Fadmin%2Flogin%2FwxLogin&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect" sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no" height="400px" />
        <div style="display: flex; width: 100%; height: 20px; align-items: center; margin-bottom:20px;">
          <div class="line" style="flex: 1; background-color: #C0C4CC;" />
          <div style="font-size: 14px; color:#C0C4CC; padding: 0 10px;">其他登录方式</div>
          <div class="line" style="flex: 1; background-color: #C0C4CC;" />
        </div>
        <el-button type="primary" class="sj loginClickBtn" plain @click="loginByPhone">
          <svg-icon icon-class="phone" style="font-size:30px; margin-right: 5px;" />
          手机登录
        </el-button>
        <div style="margin-top:30px; text-align:center; color: #909399;">
          还没有账号？ <span style="color:#4A90E2;cursor:pointer;" @click="registerNew">注册新账号</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LoginByWx',
  data() {
    return {
    }
  },
  methods: {
    loginByPhone() {
      this.$router.push(`/login?redirect_url=${window.location.href.split('redirect_url=')[1]}`)
    },
    registerNew() {
      this.$router.push(`/register?redirect_url=${window.location.href.split('redirect_url=')[1]}`)
    }
  }
}
</script>
<style lang="scss" scoped>
  iframe {
    margin-left: 20px;
  }
  .line {
    height: 1px;
  }
  .el-button {
    width: 100%;
    height: 44px;
  }
</style>
<style lang="scss">
  .sj.el-button {
    padding: 0;
  }
  .loginClickBtn.el-button span {
    font-size: 14px;
  }
</style>
