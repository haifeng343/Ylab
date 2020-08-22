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
      <div class="content">
        <!-- -------------------------注册公司---------------------------------- -->
        <div v-if="registerCompany">
          <div style="font-size:34px;color:#303133;text-align:center;padding-top:100px;margin-bottom: 20px;">欢迎注册系统</div>
          <el-form ref="registerComForm" :rules="rules" :model="registerComForm" class="registerForm">
            <el-form-item prop="comName">
              <el-input v-model="registerComForm.comName" class="login" placeholder="公司或组织名称" />
            </el-form-item>
            <el-form-item prop="peopleCount">
              <el-select v-model="registerComForm.peopleCount" class="login" placeholder="企业人数">
                <el-option
                  v-for="item in companyNumList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="empName">
              <el-input v-model="registerComForm.empName" class="login" placeholder="你的工作昵称" />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="registerComForm.phone" class="login" placeholder="你的手机号码">
                <template slot="prepend">中国大陆 +86</template>
              </el-input>
            </el-form-item>
            <div class="clearfix">
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input v-model="registerComForm.code" class="login" placeholder="验证码" />
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="10">
                <el-button v-if="showCode" class="clickBtn" type="primary" @click="getCode">获取短信验证码</el-button>
                <el-button v-if="!showCode" class="clickBtn" type="info" disabled>{{ count }}s后重新发送</el-button>
              </el-col>
            </div>
            <el-form-item prop="password">
              <el-input v-model="registerComForm.password" prop="password" class="login" placeholder="密码（至少6位）" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="clickBtn" @click="register('registerComForm')">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- -----------------------注册个人--------------------------------- -->
        <div v-if="!registerCompany">
          <div style="font-size:34px;color:#303133;text-align:center;padding-top:100px; margin-bottom: 20px;">欢迎注册系统</div>
          <el-form ref="registerPerson" :rules="rules" :model="registerPerson" class="registerForm">
            <el-form-item>
              <el-input v-model="registerPerson.comName" class="login" placeholder="公司或组织名称" disabled />
            </el-form-item>
            <el-form-item>
              <el-select v-model="registerPerson.peopleCount" class="login" placeholder="企业人数" disabled>
                <el-option
                  v-for="item in companyNumList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="empName">
              <el-input v-model="registerPerson.empName" class="login" placeholder="你的工作昵称" />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="registerPerson.phone" class="login" placeholder="你的手机号码">
                <template slot="prepend">中国大陆 +86</template>
              </el-input>
            </el-form-item>
            <div class="clearfix">
              <el-col :span="12">
                <el-form-item prop="code">
                  <el-input v-model="registerPerson.code" class="login" placeholder="验证码" />
                </el-form-item>
              </el-col>
              <el-col :span="2" />
              <el-col :span="10">
                <el-button v-if="showCode" class="clickBtn" type="primary" @click="getCode">获取短信验证码</el-button>
                <el-button v-if="!showCode" class="clickBtn" type="info" disabled>{{ count }}s后重新发送</el-button>
              </el-col>
            </div>
            <el-form-item prop="password">
              <el-input v-model="registerPerson.password" class="login" placeholder="密码（至少6位）" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="clickBtn" style="margin-top: 20px;" @click="registerPer('registerPerson')">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="$route.query.companyId" style="margin-top:30px; text-align:center; color: #909399;">
          已有账号 <span style="color:#4A90E2;cursor:pointer;" @click="$router.push(`/login?companyId=${$route.query.companyId}`)">直接登录</span>
        </div>
        <div v-else style="margin-top:30px; text-align:center; color: #909399;">
          已有账号 <span style="color:#4A90E2;cursor:pointer;" @click="$router.push('/login')">直接登录</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getcode } from '@/api/login'
import { registerCompany } from '@/api/login'
import { personRegister } from '@/api/login'
import { queryComInfo } from '@/api/login'

export default {
  name: 'Register',
  data() {
    var checkComName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('公司名称不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('公司名称不能为空'))
      } else {
        callback()
      }
    }
    var checkPeopleCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('企业人数不能为空'))
      } else {
        callback()
      }
    }
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
        comName: [{ validator: checkComName, trigger: 'blur' }],
        peopleCount: [{ validator: checkPeopleCount, trigger: 'change' }],
        empName: [{ validator: checkEmpName, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }],
        password: [{ validator: checkPassword, trigger: 'blur' }]
      },
      registerCompany: true,
      companyNumList: [{ value: '0-10人', label: '0-10人' }, { value: '10-20人', label: '10-20人' }, { value: '20-50人', label: '20-50人' }, { value: '50-100人', label: '50-100人' }, { value: '100-500人', label: '100-500人' }, { value: '500人以上', label: '500人以上' }],
      phone: undefined,
      registerComForm: {
        openid: '',
        unionid: '',
        comName: '',
        peopleCount: '',
        empName: '',
        phone: '',
        code: undefined,
        password: ''
      },
      registerPerson: {
        companyId: undefined,
        openid: '',
        unionid: '',
        comName: '',
        peopleCount: '',
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
  created() {
    if (this.$route.query.companyId && this.$route.query.companyId !== 'STATE') {
      this.registerCompany = false
      this.registerPerson.companyId = this.$route.query.companyId
      this.registerPerson.openid = this.$route.query.openid
      this.registerPerson.unionid = this.$route.query.unionid
      queryComInfo(this.$route.query.companyId).then(res => {
        this.registerPerson.comName = res.data.name
        this.registerPerson.peopleCount = res.data.peopleCount
      })
    }
    if (this.$route.query.companyId === 'STATE') {
      this.registerComForm.openid = this.$route.query.openid
      this.registerComForm.unionid = this.$route.query.unionid
    }
  },
  methods: {
    getCode() {
      const reg = /^[1]([3-9])[0-9]{9}$/
      this.phone = this.registerComForm.phone || this.registerPerson.phone
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
    // 注册公司
    register(registerComForm) {
      console.log(this.$refs[registerComForm])
      this.$refs[registerComForm].validate((valid) => {
        if (!valid) {
          return
        } else {
          registerCompany(this.registerComForm).then(res => {
            if (res.code === 200) {
              // this.$store.dispatch('user/getUser')
              this.$router.push('/')
            }
          })
        }
      })
    },
    // 注册个人
    registerPer(registerPerson) {
      this.$refs[registerPerson].validate((valid) => {
        if (!valid) {
          return
        } else {
          personRegister(this.registerPerson).then(res => {
            if (res.code === 200) {
              // this.$store.dispatch('user/getUser')
              this.$router.push('/')
            }
          })
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
    width: 380px;
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
  .registerForm .el-select {
    width: 100%;
  }
  .registerForm .el-input__suffix-inner {
    height: 100%;
  }
  .clickBtn.el-button span {
    font-size: 14px;
  }
</style>
