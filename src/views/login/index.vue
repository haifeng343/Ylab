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
      <!-- --------------------------------------手机登录------------------------------------- -->
      <div v-if="loginWay === 'phone'">
        <div v-if="!retrieve" class="content">
          <div style="font-size:34px;color:#303133;text-align:center;padding-top:100px;">登录系统</div>
          <!-- ---------------------------------------密码登录-------------------------------- -->
          <div v-if="passwordLogin">
            <div style="font-size: 16px;margin: 20px 0; text-align:right; color: #909399;">切换到 <span style="color:#5899E9; cursor:pointer;" @click="passwordLogin = false">手机验证码登录</span></div>
            <el-form ref="passwordForm" :rules="rules" :model="passwordForm" class="registerForm">
              <el-form-item prop="phone">
                <el-input v-model="passwordForm.phone" class="login" placeholder="你的手机号码" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="passwordForm.password" class="login" placeholder="密码" show-password />
              </el-form-item>
              <div style="font-size: 14px; color:#909399; height:20px;">
                <span style="float:right; cursor: pointer;" @click="loginWay = 'retrieve'">忘记密码?</span>
              </div>
              <el-form-item>
                <el-button class="clickBtn" type="primary" @click="loginByPassword">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- ---------------------------------------验证码登录------------------------------ -->
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
              <div style="font-size: 14px; color:#909399; height:20px;">
                <span style="float:right; cursor: pointer;" @click="loginWay = 'retrieve'">忘记密码?</span>
              </div>
              <el-form-item>
                <el-button class="clickBtn" type="primary" @click="codeLogin">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="display: flex; width: 100%; height: 40px; align-items: center; margin-bottom: 20px;">
            <div class="line" style="flex: 1; background-color: #C0C4CC;" />
            <div style="font-size: 14px; color:#C0C4CC; padding: 0 10px;">第三方账号登录</div>
            <div class="line" style="flex: 1; background-color: #C0C4CC;" />
          </div>
          <el-button v-if="$route.query.companyId" type="success" class="wx clickBtn" plain @click="$router.push(`/wx-login?companyId=${$route.query.companyId}`)">
            <svg-icon icon-class="wchat" style="font-size:30px; margin-right: 5px;" />
            微信登录
          </el-button>
          <el-button v-else type="success" class="wx clickBtn" plain @click="$router.push('/wx-login')">
            <svg-icon icon-class="wchat" style="font-size:30px; margin-right: 5px;" />
            微信登录
          </el-button>
          <!-- <div v-if="$route.query.companyId" style="margin-top:30px; text-align:center; color: #909399;">
            还没有账号？ <span style="color:#4A90E2;cursor:pointer;" @click="$router.push(`/register?companyId=${$route.query.companyId}`)">注册新账号</span>
          </div>
          <div v-else style="margin-top:30px; text-align:center; color: #909399;">
            还没有账号？ <span style="color:#4A90E2;cursor:pointer;" @click="$router.push('/register')">注册新账号</span>
          </div> -->
        </div>
      </div>
      <!-- ------------------------------------忘记密码------------------------------- -->
      <div v-if="loginWay === 'retrieve'" class="content">
        <div style="font-size:34px;color:#303133;text-align:center;padding-top:180px; margin-bottom: 20px;">忘记密码</div>
        <el-form ref="retrieveForm" :rules="rules" :model="retrieveForm">
          <el-form-item prop="phone">
            <el-input v-model="retrieveForm.phone" class="login" placeholder="你的手机号码">
              <template slot="prepend">中国大陆 +86</template>
            </el-input>
          </el-form-item>
          <div class="clearfix">
            <el-col :span="12">
              <el-form-item prop="code">
                <el-input v-model="retrieveForm.code" class="login" placeholder="验证码" />
              </el-form-item>
            </el-col>
            <el-col :span="2" />
            <el-col :span="10">
              <el-button v-if="showCode" class="clickBtn" type="primary" @click="getCode">获取短信验证码</el-button>
              <el-button v-if="!showCode" class="clickBtn" type="info" disabled>{{ count }}s后重新发送</el-button>
            </el-col>
          </div>
          <el-form-item>
            <el-button class="clickBtn" type="primary" style="margin-top: 10px;" @click="retrievePsw">找回密码</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-top:30px; text-align:center; color: #909399;">
          想起登录密码了, <span style="color:#4A90E2;cursor:pointer;" @click="loginWay = 'phone'">返回登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { loginPws } from '@/api/login'
import { getcode } from '@/api/login'
import { findPws } from '@/api/login'
import { loginCode } from '@/api/login'
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('手机号码不能为空'))
      }
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号错误，请重新填写'))
      } else {
        callback()
      }
    }
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('验证码不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('验证码不能为空'))
      }
      const reg2 = new RegExp(/^\d{6}$/)
      if (!reg2.test(value)) {
        return callback(new Error('验证码格式错误，请重新填写'))
      } else {
        callback()
      }
    }
    var checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('密码不能为空'))
      }
      // const reg1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
      // if (!reg1.test(value)) {
      //   return callback(new Error('密码格式错误，请重新填写'))
      // }
      if (value.length < 6) {
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
      passwordForm: {
        phone: undefined,
        password: undefined,
        companyId: undefined
      },
      codeForm: {
        phone: undefined,
        code: undefined,
        companyId: undefined
      },
      retrieveForm: {
        phone: undefined,
        code: undefined,
        companyId: undefined
      },
      passwordLogin: true,
      // 找回密码显示
      retrieve: false,
      // 登录方式（默认密码登录）
      loginWay: 'phone',
      showCode: true,
      count: '',
      timer: null
    }
  },
  created() {
    if (this.$route.query.companyId) {
      this.passwordForm.companyId = this.$route.query.companyId
      this.codeForm.companyId = this.$route.query.companyId
      this.retrieveForm.companyId = this.$route.query.companyId
    }
    window.name = ''
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
    // dingLogin() {
    //   this.loginWay = 'dingding'
    //   // eslint-disable-next-line
    //   DDLogin({
    //     id: 'qrcode',
    //     goto: encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoabmko1aozxqsdp44n&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://www.yibeirui.com/admin/login/dingLogin'),
    //     style: 'border:none;',
    //     width: '340',
    //     height: '323'
    //   })
    // },
    // 密码登录
    loginByPassword() {
      console.log(1111)
      this.$refs.passwordForm.validate((valid) => {
        if (!valid) {
          return
        } else {
          loginPws(this.passwordForm).then(res => {
            if (res.code === 400) {
              this.$router.push('/register')
            }
            if (res.code === 200) {
              // this.$store.dispatch('user/getUser')
              if (!this.$route.query.redirect_url) {
                this.$router.push('/')
              } else {
                this.$router.push(this.$route.query.redirect_url)
              }
            }
          })
        }
      })
    },
    // 验证码登录
    codeLogin() {
      this.$refs.codeForm.validate((valid) => {
        if (!valid) {
          return
        } else {
          loginCode(this.codeForm).then(res => {
            if (res.code === 400) {
              this.$router.push('/register')
            }
            if (res.code === 200) {
              // this.$store.dispatch('user/getUser')
              if (!this.$route.query.redirect_url) {
                this.$router.push('/')
              } else {
                this.$router.push(this.$route.query.redirect_url)
              }
            }
          })
        }
      })
    },
    // 找回密码
    retrievePsw() {
      findPws(this.retrieveForm).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$message.success('密码已初始化，发送到您手机上，请查收')
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
  .line {
    height: 1px;
  }
  .el-col-2, .el-col-10 {
    margin-top: 1px;
  }
  iframe {
    margin-left: 20px;
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
  .wx.el-button {
    padding: 0;
  }
</style>
<style lang="scss">
  .clickBtn.el-button span {
    font-size: 14px;
  }
</style>
