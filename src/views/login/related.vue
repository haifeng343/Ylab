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
      <div class="content" style="padding-top: 100px;">
        <div style="font-size:34px;color:#303133;text-align:center;">关联已有账号</div>
        <!-- -------------------------关联密码登录---------------------------------- -->
        <div v-if="passwordLogin">
          <div style="font-size: 16px;margin: 20px 0; text-align:right; color: #909399;">切换到 <span style="color:#5899E9; cursor:pointer;" @click="passwordLogin = false">验证码登录</span></div>
          <el-form ref="passwordForm" :rules="rules" :model="passwordForm" class="registerForm">
            <el-form-item prop="phone">
              <el-input v-model="passwordForm.phone" class="login" placeholder="你的手机号码" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="passwordForm.password" class="login" placeholder="密码" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="clickBtn" @click="bundlePsw">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- -------------------------关联验证码登录------------------------------- -->
        <div v-if="!passwordLogin">
          <div style="font-size: 16px;margin: 20px 0; text-align:right; color: #909399;">切换到 <span style="color:#5899E9;cursor:pointer;" @click="passwordLogin = true">账号密码登录</span></div>
          <el-form ref="codeForm" :rules="rules" :model="codeForm">
            <el-form-item prop="phone">
              <el-input v-model="codeForm.phone" class="login" placeholder="你的手机号码">
                <template slot="prepend">中国大陆 +86</template>
              </el-input>
            </el-form-item>
            <div class="clearfix">
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input v-model="codeForm.code" class="login" placeholder="验证码" />
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="10">
                <el-button v-if="showCode" class="clickBtn" type="primary" @click="getCode">获取短信验证码</el-button>
                <el-button v-if="!showCode" class="clickBtn" type="info" disabled>{{ count }}s后重新发送</el-button>
              </el-col>
            </div>
            <el-form-item>
              <el-button type="primary" class="clickBtn" @click="bundleCode">绑定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="$route.query.companyId && $route.query.companyId !== 'STATE'" style="color:#4A90E2; text-align:right; margin-top: 20px;cursor:pointer;" @click="$router.push(`/register?companyId=${$route.query.companyId}&openid=${$route.query.openid}&unionid=${$route.query.unionid}`)">注册新账号</div>
        <div v-else-if="$route.query.companyId === 'STATE'" style="color:#4A90E2; text-align:right; margin-top: 20px;cursor:pointer;" @click="$router.push(`/register?companyId=${$route.query.companyId}&openid=${$route.query.openid}&unionid=${$route.query.unionid}`)">注册新账号</div>
        <div v-else style="color:#4A90E2; text-align:right; margin-top: 20px;cursor:pointer;" @click="$router.push('/register')">注册新账号</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getcode } from '@/api/login'
import { relatedWx } from '@/api/login'
export default {
  name: 'Related',
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      } else {
        callback()
      }
    }
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (value.trim().length < 6) {
        return callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      },
      passwordLogin: true,
      phone: '',
      passwordForm: {
        phone: undefined,
        password: undefined,
        openid: undefined,
        unionid: undefined,
        companyId: undefined
      },
      codeForm: {
        phone: undefined,
        code: undefined,
        openid: undefined,
        unionid: undefined,
        companyId: undefined
      },
      showCode: true,
      count: '',
      timer: null
    }
  },
  created() {
    console.log(this.$route.query.companyId)
    this.passwordForm.openid = this.$route.query.openid
    this.passwordForm.unionid = this.$route.query.unionid
    this.passwordForm.companyId = this.$route.query.companyId
    this.codeForm.openid = this.$route.query.openid
    this.codeForm.unionid = this.$route.query.unionid
    this.codeForm.companyId = this.$route.query.companyId
  },
  methods: {
    getCode() {
      const reg = /^[1]([3-9])[0-9]{9}$/
      this.phone = this.passwordForm.phone || this.codeForm.phone
      if (!reg.test(this.phone)) {
        this.$message.error('手机号错误，请重新填写')
        this.phone = ''
        return
      }
      getcode({ phone: this.phone }).then(res => {
        if (res.code === 200) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.showCode = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.showCode = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        }
      })
    },
    bundlePsw() {
      relatedWx(this.passwordForm).then(res => {
        if (res.code === 200) {
          this.$router.push('/')
        }
      })
    },
    bundleCode() {
      relatedWx(this.codeForm).then(res => {
        if (res.code === 200) {
          this.$router.push('/')
        }
      })
    }
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
  .el-button {
    width: 100%;
    height: 44px;
  }
  .el-col-2, .el-col-10 {
    margin-top: 1px;
  }
</style>
<style lang="scss">
  .login {
    .el-input__inner {
      height: 44px !important;
      line-height: 44px;
    }
  }
  .registerForm .el-input__suffix-inner {
    height: 100%;
  }
  .clickBtn.el-button span {
    font-size: 14px;
  }
</style>
