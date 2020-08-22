<template>
  <div>
    <div style="width: 100%; height: 68px;">
      <div style="width: 90%; height: 100%; line-height: 68px; padding-left: 80px; box-sizing: border-box; margin: 0 auto;">
        <a href="http://www.yibeirui.com/">
          <svg-icon icon-class="logo" style="font-size:40px; color:#4A90E2;" />
          <svg-icon icon-class="YLab" style="font-size:60px; color:#4A90E2;" />
        </a>
      </div>
    </div>
    <div class="bottom">
      <div class="content" style="padding-top:100px;">
        <iframe v-if="$route.query.companyId" id="iframe_id" class="ybr_qrcode" :src="`https://open.weixin.qq.com/connect/qrconnect?appid=wx7c56490d688dae6f&redirect_uri=http%3A%2F%2Fwww.yibeirui.com%2Fadmin%2Flogin%2FwxLogin&response_type=code&scope=snsapi_login&state=${this.$route.query.companyId}#wechat_redirect`" sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no" height="400px" />
        <iframe v-else id="iframe_id" class="ybr_qrcode" src="https://open.weixin.qq.com/connect/qrconnect?appid=wx7c56490d688dae6f&redirect_uri=http%3A%2F%2Fwww.yibeirui.com%2Fadmin%2Flogin%2FwxLogin&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect" sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no" height="400px" />
        <div style="display: flex; width: 100%; height: 20px; align-items: center; margin-bottom:20px;">
          <div class="line" style="flex: 1; background-color: #C0C4CC;" />
          <div style="font-size: 14px; color:#C0C4CC; padding: 0 10px;">其他登录方式</div>
          <div class="line" style="flex: 1; background-color: #C0C4CC;" />
        </div>
        <el-button v-if="$route.query.companyId" type="primary" class="sj clickBtn" plain @click="$router.push(`/login?companyId=${$route.query.companyId}`)">
          <svg-icon icon-class="phone" style="font-size:30px; margin-right: 5px;" />
          手机登录
        </el-button>
        <el-button v-else type="primary" class="sj clickBtn" plain @click="$router.push('/login')">
          <svg-icon icon-class="phone" style="font-size:30px; margin-right: 5px;" />
          手机登录
        </el-button>
        <div v-if="$route.query.companyId" style="margin-top:30px; text-align:center; color: #909399;">
          还没有账号？ <span style="color:#4A90E2;cursor:pointer;" @click="$router.push(`/register?companyId=${$route.query.companyId}`)">注册新账号</span>
        </div>
        <div v-else style="margin-top:30px; text-align:center; color: #909399;">
          还没有账号？ <span style="color:#4A90E2;cursor:pointer;" @click="$router.push('/register')">注册新账号</span>
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
      companyId: undefined
    }
  },
  created() {
    this.companyId = this.$route.query.companyId
  }
}
</script>
<style lang="scss" scoped>
  .bottom{
    width: 100%;
    height:calc(100vh - 68px);
    background: url('http://erp-new.oss-cn-beijing.aliyuncs.com/erp/file/20191107/1573109765143-%E6%B3%A8%E5%86%8C%E7%99%BB%E5%BD%95%E8%83%8C%E6%99%AF.png?Expires=1888469765&OSSAccessKeyId=LTAI4GKZ53eoTEYTTdfszb8Z&Signature=y2BeM%2FsLInus7xUMMkPvvsvGMgA%3D') no-repeat;
    background-size: 100% 100%;
  }
  .content{
    width: 340px;
    height: 100%;
    margin: auto;
  }
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
  .clickBtn.el-button span {
    font-size: 14px;
  }
</style>
