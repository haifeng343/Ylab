<template>
  <div>
    <div class="model">
      <el-row class="website labHeader">
        <el-col :sm="10" :xs="24">
          <div class="clearfix" style="width: 100%; position: relative; padding: 5% 3% 3% 5%;">
            <div style="position: absolute; left: 0; top: 0; width: 20%;">
              <img src="@/assets/lab/frame1.png" style="width: 100%;">
            </div>
            <div style="position: absolute; right: 0; bottom: 0; width: 20%;">
              <img src="@/assets/lab/frame2.png" style="width: 100%;">
            </div>
            <div style="border: 8px solid #FFFFFF; position: relative;">
              <img :src="lab.pics" style="width: 100%; display: block;">
            </div>
            <el-button v-if="user.id || user.id === 0" type="primary" class="videoBtn" @click="loginLive">观看直播</el-button>
          </div>
        </el-col>
        <el-col :offset="2" :sm="12" :xs="22">
          <div style="width: 100%;">
            <div class="labName" style=" margin-bottom: 40px;">{{ lab.name }}</div>
            <div style="font-size: 18px; color: #303133; display: flex; margin-bottom: 24px;">
              <div style="color: #77787D; flex: 0 0 54px;">类型：</div>
              <div style="flex-grow: 1;">{{ lab.typeName }}</div>
            </div>
            <div style="font-size: 18px; line-height: 34px; color: #303133; display: flex;">
              <div style="color: #77787D; flex: 0 0 54px;">简介：</div>
              <div style="flex-grow: 1;">{{ lab.description }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="!user.id && user.id !== 0" class="labRights" style="background-color: #FBFCFE; text-align: center;">
      <div class="getVideo">立刻获取实验室实况视频</div>
      <div style="width: 100%; max-width: 340px; margin: 0 auto;">
        <el-input v-model="phone" style="margin-top: 38px;" placeholder="输入手机号码" />
        <div style="display: flex; justify-content: space-between; margin-top: 24px;">
          <el-input v-model="code" style="width: 55%" placeholder="验证码" />
          <el-button style="width: 40%" :type="waitTime > 0 ? 'info' : 'primary'" :disabled="waitTime > 0" @click="getMsgCode">{{ waitTime > 0 ? `${waitTime}后重新获取` : '获取短信验证码' }}</el-button>
        </div>
        <el-button type="primary" style="width: 100%; margin-top: 38px;" @click="live">观看直播</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { labDetail, cameraList, addToQueue } from '@/api/lab'
import { getcode } from '@/api/login'
export default {
  name: 'LabDetail',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labId: '',
      lab: {},

      phone: '',
      code: '',

      waitTime: 0,
      timer: null,

      labCamera: []
    }
  },
  created() {
    this.$emit('changeTable', 'lab')
    this.labId = this.$route.query.id
    labDetail({ id: parseInt(this.labId) }).then(res => {
      this.lab = res.data
    })
    cameraList({ pageNo: 1, pageSize: 100, labId: this.labId }).then(res => {
      this.labCamera = res.data.list
    })
  },
  methods: {
    getMsgCode() {
      const reg = /^[1]([3-9])[0-9]{9}$/
      if (!reg.test(this.phone)) {
        this.$message.error('手机号错误，请重新填写')
        return
      }
      if (!this.phone || this.phone.trim() === '') {
        this.$message.error('手机号码不能为空')
        return
      }
      getcode({ phone: this.phone }).then(res => {
        if (res.code === 200) {
          const TIME_COUNT = 60
          if (!this.timer) {
            this.waitTime = TIME_COUNT
            this.timer = setInterval(() => {
              if (this.waitTime > 0 && this.waitTime <= TIME_COUNT) {
                this.waitTime--
              } else {
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
        }
      })
    },
    live() {
      if (this.labCamera.length === 0) {
        this.$message.error('该实验室暂无摄像头')
        return
      }
      const reg1 = /^[1]([3-9])[0-9]{9}$/
      if (!reg1.test(this.phone)) {
        this.$message.error('手机号错误，请重新填写')
        return
      }
      if (!this.phone || this.phone.trim() === '') {
        this.$message.error('手机号码不能为空')
        return
      }
      const reg2 = new RegExp(/^\d{6}$/)
      if (!this.code || this.code.trim() === '') {
        this.$message.error('验证码不能为空')
        return
      }
      if (!reg2.test(this.code)) {
        this.$message.error('验证码格式错误，请重新填写')
        return
      }
      const index = window.location.href.search('#')
      const href = window.location.href.substr(0, index)
      addToQueue({ cameraId: this.labCamera[0].id, phone: this.phone, code: this.code }).then(res => {
        if (res.code === 200) {
          window.open(`${href}#/lab-live?cameraId=${this.labCamera[0].id}&phone=${this.phone}&labId=${this.labId}`, '_self')
        }
      })
    },
    loginLive() {
      if (this.labCamera.length === 0) {
        this.$message.error('该实验室暂无摄像头')
        return
      }
      const index = window.location.href.search('#')
      const href = window.location.href.substr(0, index)
      addToQueue({ cameraId: this.labCamera[0].id, phone: this.user.phone }).then(res => {
        if (res.code === 200) {
          window.open(`${href}#/lab-live?cameraId=${this.labCamera[0].id}&phone=${this.user.phone}&labId=${this.labId}`, '_self')
        }
      })
    }
  }
}
</script>

<style>
.el-card__body {
  padding: 16px;
}
.videoBtn.el-button {
  position: absolute;
  right: 40px;
  bottom: 40px;
  border: 1px solid rgba(255,255,255,.4);
  box-shadow: 0px 2px 12px 0px rgba(74,144,226,1);
}
</style>
