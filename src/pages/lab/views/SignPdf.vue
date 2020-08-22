<template>
  <div>
    <div v-if="signCode === 1" style="backgroundColor: rgba(248,249,251,1); height: 100vh; width: 100%; position: relative;">
      <div v-if="signing" style="position: absolute; left：0; top: 0; width: 100%; height: 100%; z-index: 10; background-color: #FFFFFF;" />
      <sign v-if="signing" style="position: absolute; left：0; top: 0; width: 100%; height: 100%; z-index: 10;" @signed="signedHandler" />
      <div style="position: absolute; left: 0; top: 0; width: 100%; height: 56px; line-height: 56px; font-size: 14px; background:rgba(255,255,255,1); box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1); padding: 0 16px; z-index: 2;">{{ pdfName | ellipsis }}</div>
      <div ref="pdfView" class="canvas-container" style="position: absolute; left: 0; top: 56px; width: 100%; height: calc(100vh - 114px); z-index: 1; overflow-y: auto; overflow-x: hidden;">
        <img v-show="signSrc!==''" ref="imgs" :src="signSrc" style="position: absolute; border: 1px solid #C03639; z-index: 100;" :style="{width: `${159 * scale}px`, left: `${imgLeft}px`, top: `${imgTop}px`}" @touchstart="touchstartHandler">
      </div>
      <!-- <div v-if="bottomBtn" style="position: absolute; left: 0; width: 100%; height: 58px; font-size: 14px; background:rgba(255,255,255,1); box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1); z-index: 2;" :style="{ top: `${screenHeight - 58}px` }">
        <div style="display: flex; height: 100%; align-items: center; padding: 0 30px;">
          <div style="text-align: center; padding: 0 20px 0 0;" @click="signing=true">
            <svg-icon icon-class="signed" style="font-size: 28px;" />
            <div style="margin-top: 3px;">签名</div>
          </div>
          <div style="text-align: center; padding: 0 20px;" @click="signSrc=''">
            <svg-icon icon-class="del" style="font-size: 28px;" />
            <div style="margin-top: 3px;">删除</div>
          </div>
          <div style="flex: 1;" />
          <el-button type="primary" @click="signSubmit">签约完成，提交</el-button>
        </div>
      </div> -->
      <div v-if="bottomBtn" style="position: fixed; left: 0; bottom: 0; width: 100%; height: 58px; font-size: 14px; background:rgba(255,255,255,1); box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1); z-index: 2;">
        <div style="display: flex; height: 100%; align-items: center; padding: 0 30px;">
          <div style="text-align: center; padding: 0 20px 0 0;" @click="signing=true">
            <svg-icon icon-class="signed" style="font-size: 28px;" />
            <div style="margin-top: 3px;">签名</div>
          </div>
          <div style="text-align: center; padding: 0 20px;" @click="signSrc=''">
            <svg-icon icon-class="del" style="font-size: 28px;" />
            <div style="margin-top: 3px;">删除</div>
          </div>
          <div style="flex: 1;" />
          <el-button type="primary" @click="signSubmit">签约完成，提交</el-button>
        </div>
      </div>
      <!-- <div style="position: absolute; left: 0; top: 46px; z-index: 9;">当前页：{{ Math.floor(imgTop / pageHeight + 1) }}||坐标：{{ Math.round(imgLeft / scale) }}, {{ Math.round((imgTop % pageHeight) / scale) }}</div> -->
    </div>
    <div v-if="signCode === 2" class="cer" style="height: 100vh;padding: 20px;">
      <div style="margin: 70px 0 20px;">为确保是您本人自愿签署，请进行意愿认证:</div>
      <el-form ref="codeForm" label-position="left" label-width="70px" :rules="rules" :model="userInfoCode">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfoCode.phone" />
        </el-form-item>
        <div style="width: 100%; height: 1px; background-color: #E4E7ED; margin: 16px 0;" />
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
    <div v-if="signCode === 3" style="margin-top: 56px; height: calc(100vh - 56px);">
      <div v-if="result === 'sucess'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/cerSucess.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">签署成功</div>
        <div style="font-size: 20px; line-height: 32px;">即将自动跳转至待签合同页面</div>
      </div>
      <div v-if="result === 'wait'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/wait.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">签署中</div>
        <div style="font-size: 20px; line-height: 32px;">请耐心等待几秒</div>
      </div>
      <div v-if="result === 'fault'" style="padding-top: 50px; text-align: center;">
        <img src="@/assets/image/nopass.png" width="200px">
        <div style="margin-top: 40px; font-size: 20px; line-height: 32px;">签署失败</div>
        <div style="font-size: 20px; line-height: 32px;">即将自动跳转至待签合同页 如遇问题,请联系您的业务员</div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import PDFJS from 'pdfjs-dist'
import Sign from './components/Sign'
import { sendSignCode, signPdf } from '@/api/lab'
export default {
  components: { Sign },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 20) {
        return value.slice(0, 20) + '...pdf'
      }
      return value
    }
  },
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
    return {
      rules: {
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        code: [{ validator: checkCode, trigger: 'blur' }]
      },
      pdfUrl: '',
      loadingPage: 0,
      scale: 0,

      signing: false,
      signSrc: '',
      imgLeft: 0,
      imgTop: 0,
      screenHeight: 0,
      oldX: 0,
      oldY: 0,
      moving: false,
      userInfoCode: {
        
      },
      userInfoCode: {
        phone: '',
        code: ''
      },
      count: '',
      showCode: true,
      timer: 0,
      signCode: 1,
      result: 'wait',
      bottomBtn: true,
      cHeight: 0
    }
  },
  computed: {
    pdfName() {
      const urlArr = this.pdfUrl.split('/')
      return urlArr[urlArr.length - 1]
    }
  },
  destroyed() {
    // document.removeEventListener('mousemove', this.mousemoveHandler)
    // document.removeEventListener('mouseup', this.mouseupHandler)
    document.removeEventListener('touchend', this.touchendHandler)
  },
  created() {
    if (this.$route.query.noshow == 1) {
      this.bottomBtn = false
    }
    this.screenHeight = document.body.clientHeight
    console.log(document.body.clientHeight)
  },
  mounted() {
    // document.addEventListener('mousemove', this.mousemoveHandler)
    // document.addEventListener('mouseup', this.mouseupHandler)
    document.addEventListener('touchend', this.touchendHandler)
    this.pdfUrl = decodeURI(this.$route.query.pdfPath)
    console.log(this.pdfUrl)
    const loadingTask = PDFJS.getDocument(this.pdfUrl)
    loadingTask.promise.then((pdf) => {
      if (pdf.numPages > 0) {
        this.renderPage(pdf, 1)
      }
    }, (reason) => {
      console.error(reason)
    })
  },
  methods: {
    // mousemoveHandler() {
    //   console.log(123)
    // },
    // mouseupHandler() {
    //   console.log(234)
    // },
    touchstartHandler(event) {
      event.preventDefault()
      event.stopPropagation()
      this.moving = true
      const touch = event.targetTouches[0]
      this.oldX = touch.pageX
      this.oldY = touch.pageY
      document.addEventListener('touchmove', this.touchmoveHandler)
      // this.writeBegin({ x: touch.pageX || touch.clientX, y: touch.pageY || touch.clientY });
    },
    touchmoveHandler(event) {
      // event.preventDefault()
      // event.stopPropagation()
      const touch = event.targetTouches[0]
      this.imgLeft += (touch.pageX - this.oldX)
      this.imgTop += (touch.pageY - this.oldY)
      this.oldX = touch.pageX
      this.oldY = touch.pageY
    },
    touchendHandler(event) {
      document.removeEventListener('touchmove', this.touchmoveHandler)
    },
    signedHandler(data) {
      this.imgLeft = 0
      this.imgTop = this.$refs.pdfView.scrollTop
      this.signing = false
      this.signSrc = data
    },
    renderPage(pdf, num) {
      this.loadingPage = num
      pdf.getPage(num).then((page) => {
        const viewport = page.getViewport(1)
        let scale = (document.documentElement.clientWidth * window.devicePixelRatio / viewport.width).toFixed(2)
        const scaledViewport = page.getViewport({ scale })
        this.scale = scale / window.devicePixelRatio
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.height = scaledViewport.height
        canvas.width = scaledViewport.width
        canvas.style.height = `${Math.round(scaledViewport.height / window.devicePixelRatio)}px`
        this.cHeight = Math.round(scaledViewport.height / window.devicePixelRatio) + 1
        canvas.style.width = `${Math.round(scaledViewport.width / window.devicePixelRatio)}px`
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        }
        const renderTask = page.render(renderContext)
        renderTask.promise.then(() => {
          this.$refs.pdfView.appendChild(canvas)
          if (this.loadingPage < pdf.numPages) {
            // New page rendering is pending
            this.renderPage(pdf, this.loadingPage + 1)
          }
        })
      })
    },
    getCode() {
      const reg3 = /^[1]([3-9])[0-9]{9}$/
      if (!reg3.test(this.userInfoCode.phone)) {
        this.$message.error('手机号错误，请重新填写')
        return
      }
      sendSignCode({ phone: this.userInfoCode.phone }).then(res => {
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
          this.signCode = 3
          this.$emit('sign', this.signCode)
          signPdf({ contractId: this.$route.query.id, phone: this.userInfoCode.phone, code: this.userInfoCode.code, sealData: this.signSrc.split('base64,')[1], signPos: { posType: 0, posPage: Math.floor(this.imgTop / this.cHeight + 1), posX: Math.round(this.imgLeft / this.scale) + 80, posY: Math.round(( this.cHeight - 1 - (this.imgTop % this.cHeight)) / this.scale) - (40 / this.scale) }}).then(res => {
            let that = this
            if (res.code === 200) {
              this.result = 'sucess'
              setTimeout(function() {
                that.$router.push('/onlineSign')
              }, 2000)
            }
          }).catch(res => {
            this.result = 'fault'
            let thiss = this
            setTimeout(function() {
              thiss.$router.push('/onlineSign')
            }, 2000)
          })
        }
      })
    },
    signSubmit() {
      if (!this.signSrc || this.signSrc.length === 0) {
        this.$message.error('请先签名')
        return
      }
      this.signCode = 2
      this.$emit('sign', this.signCode)
    }
  }
}
</script>
<style lang="scss">
  .cer {
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
  }
</style>
<style lang="scss" scoped>
  .canvas-container {
    >>> canvas {
      display: block;
      border-bottom: 1px solid #aaa;
    }
  }
</style>
