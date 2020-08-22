<template>
  <div id="setting">
    <div class="content">
      <el-card class="box-card left">
        <div class="personAvatar">
          <img :src="user.avatar" alt="个人头像">
          <span class="wrapper-title">{{ user.name }}</span>
        </div>
        <div :class="showRight === 1? 'leftItem active':'leftItem'" @click="changeShowRight(1)">
          <svg-icon icon-class="setting" />
          <span>个人信息</span>
        </div>
        <div :class="showRight === 2? 'leftItem active':'leftItem'" @click="changeShowRight(2)">
          <svg-icon icon-class="bind" />
          <span>第三方账号</span>
        </div>
        <div :class="showRight === 3? 'leftItem active':'leftItem'" @click="changeShowRight(3)">
          <svg-icon icon-class="lock1" />
          <span>登录密码</span>
        </div>
      </el-card>
      <el-card class="box-card right">
        <div v-show="showRight === 1" class="app-container">
          <div class="wrapper-title" style="margin-bottom: 20px;">个人信息</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" label-position="left" class="demo-ruleForm">
            <el-form-item label="头像">
              <div style="display: flex;align-items: center;">
                <my-upload
                  v-model="show"
                  field="file"
                  :url="uploadUrl"
                  img-format="jpg"
                  :no-square="true"
                  @crop-upload-success="cropUploadSuccess"
                />
                <img :src="ruleForm.avatar" style="height: 150px;width: 150px;border-radius: 50%;">
                <el-button type="primary" plain style="margin-left:30px;" @click="show = !show">上传头像</el-button>
              </div>
            </el-form-item>
            <el-form-item label="登录手机" prop="phone">
              <el-input v-model="ruleForm.phone" style="width: 300px;" placeholder="你的手机号码" autocomplete="off" />
            </el-form-item>
            <el-form-item label="工作昵称" prop="name">
              <el-input v-model="ruleForm.name" style="width: 300px;" placeholder="你的工作昵称" autocomplete="off" />
            </el-form-item>
            <div style="margin-left: 100px;margin-bottom: 12px;margin-top: 56px;">以上信息需要提交验证码</div>
            <el-form-item label="验证码" prop="code">
              <el-input v-model="ruleForm.code" style="width: 300px;" placeholder="验证码" autocomplete="off" />
              <span v-if="showCode" style="color: rgb(74, 144, 226); cursor: pointer;margin-left: 16px;" @click="getCode">获取验证码</span>
              <span v-if="!showCode" class="colorGray">{{ count }}s后重新发送</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="showRight === 2">
          <div class="wrapper-title app-container" style="border-bottom:1px solid rgba(228,231,237,1);">第三方账号</div>
          <div class="app-container" style="display:flex;justify-content: space-between">
            <div style="display:flex;align-items:center;">
              <img src="@/assets/image/weixin.png" style="width: 32px;height: 32px;">
              <span style="margin-left:10px;">微信：</span>
              <span v-if="user.wxNickName" style="color:#4A90E2;">{{ user.wxNickName }}</span>
              <span v-else>无</span>
            </div>
            <el-button v-if="user.wxNickName" type="danger" plain @click="unbind">解绑</el-button>
            <el-button v-else type="primary" plain @click="isShowCode">绑定</el-button>
          </div>
        </div>
        <div v-show="showRight === 3" class="app-container">
          <div class="wrapper-title" style="margin-bottom: 20px;">登录密码</div>
          <el-form ref="passWordForm" :model="passWordForm" :rules="passwordRules" label-width="100px" label-position="left">
            <el-form-item label="验证码" prop="passWordFormCode">
              <el-input v-model="passWordForm.passWordFormCode" style="width: 300px;" placeholder="验证码" autocomplete="off" />
              <span v-if="showCode" style="color: rgb(74, 144, 226); cursor: pointer;margin-left: 16px;" @click="getCode">获取验证码</span>
              <span v-if="!showCode" class="colorGray">{{ count }}s后重新发送</span>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input v-model="passWordForm.password" type="password" autocomplete="off" placeholder="密码（至少6位）" show-password style="width: 300px;" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="notarizePassword">
              <el-input v-model="passWordForm.notarizePassword" type="password" autocomplete="off" placeholder="密码（至少6位）" show-password style="width: 300px;" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitPassWord">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="343px"
    >
      <iframe v-if="user.companyId" id="iframe_id" class="ybr_qrcode" :src="`https://open.weixin.qq.com/connect/qrconnect?appid=wx7c56490d688dae6f&redirect_uri=http%3A%2F%2Fwww.yibeirui.com%2Fadmin%2Flogin%2FwxLogin&response_type=code&scope=snsapi_login&state=${user.companyId}#wechat_redirect`" sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no" height="400px" />
      <iframe v-else id="iframe_id" class="ybr_qrcode" src="https://open.weixin.qq.com/connect/qrconnect?appid=wx7c56490d688dae6f&redirect_uri=http%3A%2F%2Fwww.yibeirui.com%2Fadmin%2Flogin%2FwxLogin&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect" sandbox="allow-scripts allow-top-navigation" frameborder="0" scrolling="no" height="400px" />
    </el-dialog>
  </div>
</template>
<script>
import { getcode } from '@/api/login'
import { changePersonMsg } from '@/api/user'
import { wxUnbind, gePerson } from '@/api/user'
import myUpload from 'vue-image-crop-upload'
import { RelevanceWx } from '@/api/user'
export default {
  name: 'Setting',
  components: { 'my-upload': myUpload },
  props: {
    changeUser: {
      type: Function,
      default: function() {}
    }
  },
  data() {
    const checkPhone = (rule, value, callback) => {
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
    const checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('工作昵称不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('工作昵称不能为空'))
      } else {
        callback()
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (value.trim().length < 6) {
        return callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    const checkNotarizePassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('确认新密码不能为空'))
      }
      if (value !== this.passWordForm.password) {
        return callback(new Error('两次输入密码不一致'))
      }
      if (value.trim().length < 6) {
        return callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    const checkCode = (rule, value, callback) => {
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
    const checkPassWordFormCode = (rule, value, callback) => {
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
    return {
      ruleForm: {
        avatar: '',
        name: '',
        phone: '',
        code: ''
      },
      passWordForm: {
        password: '',
        notarizePassword: '',
        passWordFormCode: ''
      },
      rules: {
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        name: [{ validator: checkName, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }]
      },
      passwordRules: {
        password: [{ validator: checkPassword, trigger: 'blur' }],
        notarizePassword: [{ validator: checkNotarizePassword, trigger: 'blur' }],
        passWordFormCode: [{ validator: checkPassWordFormCode, trigger: 'blur' }]
      },
      user: {},
      dialogVisible: false,
      showCode: true,
      count: '',
      show: false,
      showRight: sessionStorage.getItem('showRight') ? parseInt(sessionStorage.getItem('showRight')) : 1,
      uploadUrl: 'http://' + window.location.host + '/admin/test/upload'
    }
  },
  async mounted() {
    const wxData = JSON.parse(sessionStorage.getItem('wxData'))
    if (wxData) {
      const result = await RelevanceWx(wxData)
      if (result.code === 200) {
        this.$message.success('绑定成功')
        sessionStorage.removeItem('wxData')
      }
      this.showRight = 2
    }
    this.userInfo()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    getImgUrl(url) {
      this.ruleForm.avatar = url
    },
    getCode() {
      this.$refs.ruleForm.validateField('phone', (validMsg) => {
        if (!validMsg) {
          getcode({ phone: this.ruleForm.phone }).then(res => {
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
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.ruleForm.id = this.user.id
          const result = await changePersonMsg(this.ruleForm)
          if (result.code === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
          this.userInfo()
        } else {
          return false
        }
      })
    },
    submitPassWord() {
      this.$refs.passWordForm.validate(async(valid) => {
        if (valid) {
          this.passWordForm.id = this.user.id
          const result = await changePersonMsg(this.passWordForm)
          if (result.code === 200) {
            this.$message.success('修改成功')
          } else {
            this.$message.error('修改失败')
          }
          this.userInfo()
        } else {
          return false
        }
      })
    },
    async unbind() {
      const result = await wxUnbind()
      if (result.code === 200) {
        this.$message.success('解绑成功')
      }
      this.userInfo()
    },
    isShowCode() {
      this.dialogVisible = true
      sessionStorage.setItem('userId', this.user.id)
    },
    userInfo() {
      gePerson().then(res => {
        this.user = res.data.employee
        this.ruleForm.avatar = res.data.employee.avatar
        this.ruleForm.name = res.data.employee.name
        this.ruleForm.phone = res.data.employee.phone
        this.changeUser(res.data.employee)
      })
    },
    cropUploadSuccess(result) {
      this.ruleForm.avatar = `http://${result.data}`
    },
    changeShowRight(status) {
      this.showRight = status
      sessionStorage.setItem('showRight', status)
    }
  }
}
</script>
<style lang="scss" scoped>
>>>.el-card__body{
  padding: 0;
}
  #setting{
    padding-bottom: 80px;
    background:rgba(248,249,251,1);
    padding-top: 120px;
    .content{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      max-width: 1200px;
    }
  }
  .left{
    width: 420px;
    height: 460px;
    margin-right: 24px;
  }
  .right{
    width: 100%;
    height: 644px;
  }
  .personAvatar{
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      height: 150px;
      width: 150px;
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
.colorGray{
  display: inline-block;
  margin-left: 16px;
  color: #C0C4CC;
}
>>>.demo-ruleForm .el-form-item:nth-child(1) label{
  margin-top: 50px;
}
.upload input {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
.leftItem{
  text-align: center;
  padding: 20px 0 20px 72px;
  border-top: 1px solid rgb(228,231,237);
  color: #909399;
  text-align: left;
  cursor:pointer;
  &.active{
    color: #000;
  }
  svg{
    margin-bottom: 2px;
  }
}
</style>

