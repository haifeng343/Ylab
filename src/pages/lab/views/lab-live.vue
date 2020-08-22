<template>
  <div>
    <el-row class="stage" style="width: 100%; max-width: 1080px;">
      <el-col :lg="18" :md="24">
        <div class="vedio" style="width: 100%; padding-bottom: 56.25%;">
          <div style="position: absolute; left: 0; top: 0; bottom: 0; right: 0;">
            <iframe
              id="ysOpenDevice"
              :src="viewHref"
              allowfullscreen
              style="width: 100%; height: 100%;"
            />
          </div>
          <div v-if="!living" style="position: absolute; width: 100%; height: 100%; left: 0; top: 0; background-color: #222; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 14px;">
            排队中，请不要关闭此页面...
          </div>
        </div>
      </el-col>
      <el-col :lg="6" :md="24">
        <div v-if="living" class="live-list">
          <div class="title">选择摄像头</div>
          <div class="status">
            <div class="part">
              <div class="label1">当前排队人数</div>
              <div class="label2">{{ customerList.length - 1 }}人</div>
            </div>
            <div class="part">
              <div class="label1">剩余观看时间</div>
              <div class="label2">{{ leftTime | timeFilter }}</div>
            </div>
          </div>
          <div class="exitWatch">
            <el-button type="primary" @click="exitLive">退出观看</el-button>
          </div>
          <div class="sub-title">
            切换摄像头
          </div>
          <div class="list carame-list">
            <div v-for="(camera, index) in labCameraList" :key="camera.id" class="item" @click="changeCamera(camera.id)">
              <div class="label1">{{ index + 1 }}</div>
              <div class="label2">{{ camera.name }}</div>
              <div v-if="currentCamera === camera.id" class="label3">当前</div>
            </div>
          </div>
        </div>
        <div v-else class="live-list">
          <div class="title">观看用户列表</div>
          <div class="status">
            <div class="part">
              <div class="label1">当前观看用户</div>
              <div class="label2">{{ viewingCustomer.phone }}</div>
            </div>
            <div class="part">
              <div class="label1">剩余排队时间</div>
              <div class="label2">{{ leftTime | timeFilter }}</div>
            </div>
          </div>
          <div class="exitWatch">
            <el-button type="primary" @click="exitLive">退出排队</el-button>
          </div>
          <div class="sub-title">
            正在排队用户
          </div>
          <div class="list">
            <div v-for="(customer, index) in customerList" v-show="index" :key="index" class="item">
              <div class="label1">{{ index }}</div>
              <div class="label2">{{ customer.phone }}</div>
              <div v-if="myPhone === customer.phone" class="label3">我</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" :width="isMobile?'100%':'330px'" class="video" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <div style="font-size:16px; font-weight: bold; text-align: center; color: #000000; line-height: 24px; height: 24px;">
        <img src="@/assets/lab/bg1.png" style="position: absolute; top: 0; right: 0; width: 330px;">
        <div style="position: absolute; z-index: 2; width: calc(100% - 50px)">2分钟直播观看时间已到，不再次观看请直接关闭网页</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reView">重新排队观看</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addToQueue, getQueue, cameraList } from '@/api/lab'
export default {
  filters: {
    timeFilter(time) {
      let h = parseInt(time / 3600)
      h = h < 10 ? `0${h}` : h
      let i = parseInt(time / 60) % 60
      i = i < 10 ? `0${i}` : i
      let s = time % 60
      s = s < 10 ? `0${s}` : s
      return `${h}:${i}:${s}`
    }
  },
  data() {
    return {
      player: '',
      living: false,
      viewHref: '',

      labId: '',
      currentCamera: '',
      myPhone: '',
      customerList: [],
      myInfo: [],
      leftTime: 0,

      timer: 0,
      timeStream: 0,

      labCameraList: [],

      dialogVisible: false,
      isMobile: false
    }
  },
  computed: {
    viewingCustomer() {
      if (this.customerList.length > 0) {
        return this.customerList[0]
      } else {
        return { phone: '无' }
      }
    }
  },
  created() {
    this.$emit('changeTable', 'lab')
    if (document.body.clientWidth < 1000) {
      this.isMobile = true
    }
  },
  mounted() {
    this.myPhone = this.$route.query.phone
    this.currentCamera = parseInt(this.$route.query.cameraId)
    this.labId = this.$route.query.labId
    this.player = document.getElementById('ysOpenDevice').contentWindow

    cameraList({ pageNo: 1, pageSize: 100, labId: this.labId }).then(res => {
      this.labCameraList = res.data.list
    })

    this.startInterval()
  },
  beforeDestroy() {
    if (this.timer !== 0) {
      clearInterval(this.timer)
    }
  },
  methods: {
    startInterval() {
      this.timer = setInterval(() => {
        if (this.timeStream % 3 === 0) {
          this.getCustomerInfo(this.timeStream)
        }
        if (this.leftTime > 0) {
          this.leftTime -= 1
        }
        this.timeStream += 1
      }, 1000)
    },
    reView() {
      addToQueue({ cameraId: this.currentCamera, phone: this.myPhone }).then(res => {
        this.getCustomerInfo(this.timeStream)
        this.dialogVisible = false
      })
      this.startInterval()
    },
    changeCamera(id) {
      this.currentCamera = id
      getQueue({ cameraId: this.currentCamera, phone: this.myPhone }).then(res => {
        this.customerList = res.data
        if (this.customerList) {
          this.myInfo = this.customerList.filter(item => {
            return item.phone === this.myPhone
          })
        } else {
          this.myInfo = []
        }
        this.viewHref = this.myInfo[0].viewHref
        this.player.postMessage('stop', 'https://open.ys7.com/ezopen/h5/iframe')
        this.player.postMessage('play', 'https://open.ys7.com/ezopen/h5/iframe')
      })
    },
    getCustomerInfo(exist) {
      getQueue({ cameraId: this.currentCamera, phone: this.myPhone }).then(res => {
        if (res.code === 200) {
          this.customerList = res.data
          this.getMyInfo(exist)
          this.updateLeftTime()
        } else {
          this.living = false
          this.viewHref = ''
          this.player.postMessage('stop', 'https://open.ys7.com/ezopen/h5/iframe')
          clearInterval(this.timer)
          this.timer = 0
          this.timeStream = 0
          this.$message.error('播放出错')
        }
      }).catch(() => {
        this.living = false
        this.viewHref = ''
        this.player.postMessage('stop', 'https://open.ys7.com/ezopen/h5/iframe')
        clearInterval(this.timer)
        this.timer = 0
        this.timeStream = 0
        this.$message.error('播放出错')
      })
    },
    getMyInfo(exist) {
      if (this.customerList.length > 0) {
        this.myInfo = this.customerList.filter(item => {
          return item.phone === this.myPhone
        })
      } else {
        if (exist === 0) {
          this.$router.push(`/lab-detail?id=${this.$route.query.labId}`)
        } else {
          this.myInfo = []
        }
      }

      if (this.myInfo.length === 0 || !this.myInfo[0].inView || !this.myInfo[0].canContinueView) {
        if (this.living) {
          this.living = false
          this.viewHref = ''
          this.player.postMessage('stop', 'https://open.ys7.com/ezopen/h5/iframe')

          // TODO
          // quite
          clearInterval(this.timer)
          this.timer = 0
          this.timeStream = 0
          this.dialogVisible = true
        }
        return
      }
      if (!this.living && this.myInfo[0].inView && this.myInfo[0].canContinueView) {
        this.living = true
        this.viewHref = this.myInfo[0].viewHref
        this.player.postMessage('play', 'https://open.ys7.com/ezopen/h5/iframe')
      }
    },
    updateLeftTime() {
      this.leftTime = parseInt((this.myInfo[0].preViewTime - this.myInfo[0].now) / 1000)
    },
    exitLive() {
      this.$router.push(`/lab-detail?id=${this.$route.query.labId}`)
    }
  }
}
</script>

<style scoped>
.live-list {
  width: 100%;
  box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1);
  border: 1px solid rgba(220,223,230,1);
  font-size: 14px;
}

.live-list .title {
  height: 46px;
  background-color: #F6F7FB;
  text-align: center;
  line-height: 46px;
  color: #303133;
  font-weight: bold;
}

.live-list .status {
  height: 76px;
  background-color: #E4E7ED;
  display: flex;
}
.exitWatch {
  height: 40px;
  background-color: #E4E7ED;
  text-align: center;
}
.live-list .status .part {
  width: 50%;
  padding: 8px 0;
}
.live-list .status .part .label1 {
  text-align: center;
  line-height: 30px;
  color: #909399;
}
.live-list .status .part .label2 {
  text-align: center;
  line-height: 30px;
  color: #303133;
}

.live-list .sub-title {
  height: 46px;
  background-color: #F6F7FB;
  color: #1A4FA1;
  padding-left: 23px;
  line-height: 46px;
}

@media screen and (min-width: 1200px) {
  .stage {
     margin: 120px auto 100px auto;
  }
}
@media screen and (max-width: 1200px) {
  .stage {
     margin: 60px auto 0 auto;
  }
}

@media screen and (max-width: 1200px) {
  .live-list {
     margin-top: 56vw;
  }
}
@media screen and (min-width: 1200px) {
  .live-list {
     margin-left: 16px;
  }
}

@media screen and (min-width: 1200px) {
  .vedio {
    position: relative
  }
}
@media screen and (max-width: 1200px) {
  .vedio {
    position: fixed
  }
}

@media screen and (max-width: 1200px) {
  .live-list .list {
    height: unset;
  }
}
@media screen and (min-width: 1200px) {
  .live-list .list {
    height: 284px;
  }
}

.live-list .list {
  overflow-y: auto;
  padding: 6px 0;
}
.live-list .carame-list .item {
  cursor: pointer;
}
.live-list .carame-list .item:hover {
  background-color: rgba(74,144,226,0.1);
}
.live-list .list .item {
  height: 36px;
  display: flex;
  align-items: center;
}
.live-list .list .item .label1 {
  margin-left: 23px;
  width: 16px;
  height: 16px;
  background: #A1CBFD;
  border-radius: 2px;
  color: #FFFFFF;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}
.live-list .list .item .label2 {
  margin-left: 16px;
}
.live-list .list .item .label3 {
  margin-left: 20px;
  color: #4A90E2;
  border-radius:2px;
  border:1px solid rgba(74,144,226,0.8);
  font-size: 12px;
  line-height: 16px;
  padding: 0 2px;
  height: 16px;
  box-sizing: border-box;
  text-align: center;
}
</style>
<style lang="scss">
  .video .el-dialog__header {
    padding: 0 20px;
    padding-bottom: 0;
  }
</style>
