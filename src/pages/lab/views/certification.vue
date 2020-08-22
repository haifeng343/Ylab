<template>
  <div style="backgroundColor: rgba(248,249,251,1); margin-top: 56px; height: calc(100vh - 56px);padding-top: 10px;">
    <div class="cer" style="backgroundColor: #fff; width: 100%; height: 100%;">
      <div style="padding: 24px; box-shadow:0px 2px 12px 0px rgba(0,0,0,0.1);">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step title="实名认证" />
          <el-step class="stepTwo" title="选择认证方式" />
          <el-step title="开始认证" />
          <el-step title="认证结果" />
        </el-steps>
      </div>
      <div v-if="currentStep === 0" style="padding: 20px;">
        <div style="width: 100%; font-size: 16px; line-height: 40px; border-bottom: 1px solid #E4E7ED;padding: 16px 0; margin-bottom: 16px;">
          <span style="margin-right: 30px;">证件类型</span>
          <span>身份证</span>
        </div>
        <el-form ref="cardForm" label-position="left" label-width="80px" :rules="rules" :model="userInfo">
          <el-form-item label="真实姓名" prop="cardName">
            <el-input v-model="userInfo.cardName" />
          </el-form-item>
          <div style="width: 100%; height: 1px; background-color: #E4E7ED;margin: 16px 0;" />
          <el-form-item label="证件号" prop="cardNo">
            <el-input v-model="userInfo.cardNo" />
          </el-form-item>
          <div style="width: 100%; height: 1px; background-color: #E4E7ED;margin: 16px 0;" />
        </el-form>
        <div style="margin-top: 30px; width: 100%; text-align: center;">
          <el-checkbox v-model="checked">同意 <span style="color: #4A90E2;">《授权须知》</span></el-checkbox>
        </div>
        <el-button v-if="checked" type="primary" style="width: 100%;" @click="submitCard">确定</el-button>
        <el-button v-else type="primary" style="width: 100%;" disabled>确定</el-button>
      </div>
      <div v-if="currentStep === 1" style="padding: 20px;">
        <div style="display: flex; width: 100%; height: 124px; line-height: 124px; box-shadow:0px 2px 30px 0px rgba(0,0,0,0.1); border-radius:8px;justify-content: center; align-items: center;" @click="currentStep = 2">
          <div style="height: 75%;margin-right: 20px;"><img src="@/assets/image/phoneNumber.png" style="height: 100%;"></div>
          <div style="font-size: 18px; color: #4A90E2; font-weight: 500;">手机号认证</div>
        </div>
        <div style="margin-top: 30px; display: flex; width: 100%; height: 124px; line-height: 124px; box-shadow:0px 2px 30px 0px rgba(0,0,0,0.1); border-radius:8px;justify-content: center; align-items: center;" @click="getFaceUrl">
          <div style="height: 75%;margin-right: 20px;"><img src="@/assets/image/face.png" style="height: 100%;"></div>
          <div style="font-size: 18px; color: #4A90E2; font-weight: 500;">人脸识别</div>
        </div>
      </div>
      <div v-if="currentStep === 2" style="padding: 20px;">
        <el-form ref="phoneForm" label-position="left" label-width="60px" :rules="rules" :model="userInfoPhone">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userInfoPhone.phone" />
          </el-form-item>
          <div style="width: 100%; height: 1px; background-color: #E4E7ED; margin: 16px 0;" />
        </el-form>
        <el-form ref="codeForm" label-position="left" label-width="60px" :rules="rules" :model="userInfoCode">
          <el-form-item label="验证码" prop="code">
            <el-input v-model="userInfoCode.code">
              <el-button v-if="showCode" slot="suffix" class="approve" @click="getCode">获取验证码</el-button>
              <el-button v-else slot="suffix" class="approve" disabled>{{ count }}s后重新发送</el-button>
            </el-input>
          </el-form-item>
          <div style="width: 100%; height: 1px; background-color: #E4E7ED;margin: 16px 0;" />
        </el-form>
        <el-button type="primary" style="width: 100%; margin-top: 30px;" @click="confirm">认证</el-button>
      </div>
      <div v-if="currentStep === 3 && result === 'sucess'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/cerSucess.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">认证成功</div>
        <div style="font-size: 20px; line-height: 32px;">即将自动跳转至签约页面</div>
      </div>
      <div v-if="currentStep === 3 && result === 'wait'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/wait.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">正在认证</div>
        <div style="font-size: 20px; line-height: 32px;">请耐心等待几秒</div>
      </div>
      <div v-if="currentStep === 3 && result === 'fault'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/nopass.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">认证失败</div>
        <div style="font-size: 20px; line-height: 32px;">即将自动跳转回上一页</div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { makeSureCard, getPhoneCode, submitPhoneCode, getCodeResult, getface, getFaceResult } from '@/api/lab'
export default {
  name: 'Certification',
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('姓名不能为空'))
      } 
      if (value.trim().length < 2) {
        return callback(new Error('姓名不能少于两个字'))
      }
      else {
        callback()
      }
    }
    var checkNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('证件号不能为空'))
      }
      if (value.trim() === '') {
        return callback(new Error('证件号不能为空'))
      }
      const reg1 = new RegExp(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)
      if (!reg1.test(value)) {
        return callback(new Error('证件号格式错误，请重新填写'))
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
    return {
      rules: {
        cardName: [{ validator: checkName, trigger: 'blur' }],
        cardNo: [{ validator: checkNo, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }]
      },
      currentStep: 0,
      checked: false,
      userInfo: {
        cardName: '',
        cardNo: ''
      },
      userInfoPhone: {
        phone: ''
      },
      userInfoCode: {
        code: ''
      },
      showCode: true,
      time: null,
      count: '',
      result: '',
      timer: 0,
      timeStream: 0,
      timer1: 0,
      timeStream1: 0
    }
  },
  created() {
    if (this.$route.query.currentStep) {
      this.currentStep = 3
      this.result = 'wait'
      getFaceResult({}).then(res => {
        if (res.code === 200) {
          this.result = 'sucess'
          this.$router.push(`/signPdf?pdfPath=${this.$route.query.pdfPath}&id=${this.$route.query.id}&noshow=${this.$route.query.noshow}`)
          // this.$router.push(`/signPdf?pdfPath=decodeURIComponent(${this.$route.query.pdfPath})&id=decodeURIComponent(${this.$route.query.id})&noshow=decodeURIComponent(${this.$route.query.noshow})`)
        }
      }).catch(res => {
        this.result = 'fault'
        let those = this
        setTimeout(function() {
          those.currentStep = 0
          those.$router.push(`/certification?pdfPath=${those.$route.query.pdfPath}&id=${those.$route.query.id}&noshow=${those.$route.query.noshow}`)
        }, 1000)
      })
      // this.timer1 = setInterval(() => {
      //   if (this.timeStream1 % 3 === 0) {
      //     getFaceResult({}).then(res => {
      //       let those = this
      //       if (res.code === 200) {
      //         clearInterval(this.timer1)
      //         this.result = 'sucess'
      //         setTimeout(function() {
      //           those.$router.push(`/signPdf?pdfPath=decodeURIComponent(${those.$route.query.pdfPath})&id=decodeURIComponent(${those.$route.query.id})`)
      //         }, 2000)
      //       }
      //       if (res.code === 100) {
      //         clearInterval(this.timer1)
      //         this.result = 'fault'
      //         setTimeout(function() {
      //           those.currentStep = 0
      //         }, 2000)
      //       }
      //     })
      //   }
      //   this.timeStream1 += 1
      // }, 1000)
    }
  },
  methods: {
    submitCard() {
      this.$refs.cardForm.validate((valid) => {
        if (!valid) {
          return
        } else {
          makeSureCard(this.userInfo).then(res => {
            if (res.code === 200) {
              this.currentStep = 1
            }
          })
        }
      })
    },
    getCode() {
      const reg3 = /^[1]([3-9])[0-9]{9}$/
      if (!reg3.test(this.userInfoPhone.phone)) {
        this.$message.error('手机号错误，请重新填写')
        return
      }
      getPhoneCode({ phone: this.userInfoPhone.phone }).then(res => {
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
    confirm() {
      this.$refs.codeForm.validate((valid) => {
        if (!valid) {
          return
        } else {
          submitPhoneCode({ code: this.userInfoCode.code }).then(res => {
            if (res.code === 200) {
              this.currentStep = 3
              this.result = 'wait'
              this.timer = setInterval(() => {
                if (this.timeStream % 3 === 0) {
                  getCodeResult({}).then(res => {
                    let that = this
                    if (res.code === 200) {
                      clearInterval(this.timer)
                      this.result = 'sucess'
                      setTimeout(function() {
                        that.$router.push(`/signPdf?pdfPath=${that.$route.query.pdfPath}&id=${that.$route.query.id}&noshow=${that.$route.query.noshow}`)
                      }, 2000)
                    }
                    if (res.code === 100) {
                      clearInterval(this.timer)
                      this.result = 'fault'
                    }
                  })
                }
                this.timeStream += 1
              }, 1000)
            }
          })
        }
      })
    },
    getFaceUrl() {
      getface({ backUrl: `/html/lab.html#/certification?currentStep=3&result=wait&pdfPath=${this.$route.query.pdfPath}&id=${this.$route.query.id}&noshow=${this.$route.query.noshow}`}).then(res => {
        window.location.href = res.data
      })
    }
  }
}
</script>
<style lang="scss">
  .cer {
    .el-step__title {
      font-size: 14px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      color: #000;
      font-size: 16px;
      font-weight: 400;
    }
    .el-input__inner {
      border: none;
    }
    .el-checkbox__inner {
      border-radius: 14px;
    }
    .el-button.approve {
      padding: 12px 0;
      border: none;
    }
    .stepTwo.el-step {
      flex-basis: 30% !important;
    }
  }
</style>
