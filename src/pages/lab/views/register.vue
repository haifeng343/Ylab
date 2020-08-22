<template>
  <div>
    <div class="bottom">
      <div class="content">
        <div style="width: 100%;">
          <div style="font-size:34px;color:#303133;text-align:center;margin-bottom: 20px;">欢迎注册系统</div>
          <el-form ref="registerForm" :rules="rules" :model="registerForm" class="registerForm">
            <el-form-item prop="empName">
              <el-input v-model="registerForm.empName" class="login" placeholder="姓名" />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="registerForm.phone" class="login" placeholder="你的手机号码">
                <template slot="prepend">中国大陆 +86</template>
              </el-input>
            </el-form-item>
            <div class="clearfix">
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input v-model="registerForm.code" class="login" placeholder="验证码" />
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="10">
                <el-button v-if="showCode" class="loginClickBtn" type="primary" @click="getCode">获取短信验证码</el-button>
                <el-button v-if="!showCode" class="loginClickBtn" type="info" disabled>{{ count }}s后重新发送</el-button>
              </el-col>
            </div>
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" prop="password" class="login" placeholder="密码（至少6位）" show-password />
            </el-form-item>
            <div style="text-align:center; color: #909399;margin-bottom: 20px;">
              注册即同意<span style="color: #4A90E2; cursor: pointer;" @click="$router.push('/privacy')">《隐私条款》</span>
            </div>
            <el-form-item>
              <el-button type="primary" class="loginClickBtn" @click="register('registerForm')">注册</el-button>
            </el-form-item>
          </el-form>
          <div style="margin-top:30px; text-align:center; color: #909399;">
            已有账号 <span style="color:#4A90E2;cursor:pointer;" @click="directLogin">直接登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getcode, website } from '@/api/login'

export default {
  data() {
    var checkEmpName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('工作昵称不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('工作昵称不能为空'))
      } else {
        callback()
      }
    }
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
      if (value.trim().length < 6) {
        return callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        empName: [{ validator: checkEmpName, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      },
      registerForm: {
        empName: '',
        phone: '',
        code: undefined,
        password: ''
      },
      showCode: true,
      count: '',
      timer: null
    }
  },
  methods: {
    getCode() {
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!reg.test(this.registerForm.phone)) {
        this.$message.error('手机号错误，请重新填写')
        return
      }
      getcode({ phone: this.registerForm.phone }).then(res => {
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
    // 注册
    register(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (!valid) {
          return
        } else {
          website(this.registerForm).then(res => {
            if (res.code === 200) {
              if (this.$route.query.style) {
                this.$router.push('/dredge')
              } else {
                this.$router.push('/product')
              }
            }
          })
        }
      })
    },
    directLogin() {
      if (this.$route.query.style) {
        this.$router.push(`/login?style=dredge?redirect_url=${window.location.href.split('redirect_url=')[1]}`)
      } else {
        this.$router.push(`/login?redirect_url=${window.location.href.split('redirect_url=')[1]}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
  .loginClickBtn.el-button span {
    font-size: 14px;
  }
</style>
