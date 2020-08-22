<template>
  <div id="app">
    <div class="draw-area">
      <sign-canvas v-if="canSign" ref="SignCanvas" v-model="value" class="sign-canvas" :options="options" />
    </div>
    <div class="sign-btns">
      <el-button type="primary" @click="canvasClear()">清空</el-button>
      <el-button type="primary" @click="saveAsImg()">保存</el-button>
    </div>
  </div>
</template>
<script>
import SignCanvas from './SignCanvas'
export default {
  components: { SignCanvas },
  data() {
    return {
      value: null,
      options: {
        canvasWidth: 600,
        canvasHeight: 600,
        isSign: true, // 签名模式 [Boolean] 默认为非签名模式,有线框, 当设置为true的时候没有任何线框
        isShowBorder: false // 是否显示边框 [可选]
      },
      canSign: false
    }
  },
  created() {
    this.options.canvasWidth = document.documentElement.clientWidth - 46
    this.options.canvasHeight = document.documentElement.clientHeight
    this.canSign = true
  },
  methods: {
    canvasClear() {
      this.$refs.SignCanvas.canvasClear()
    },
    saveAsImg() {
      const img = this.$refs.SignCanvas.saveAsImg()
      this.$emit('signed', img)
    }
  }
}
</script>
<style lang="scss" scoped>
.sign-canvas{
  position: absolute;
  top: 0;
  left: 0;
  display: block;
}
.draw-area {
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: calc(100vw - 46px);
  border: 1px dashed #C03639;
}
.sign-btns{
  position: absolute;
  left: calc(100vw - 46px);
  top: 100vh;
  width: 100vh;
  height: 46px;
  transform: rotate(-90deg);
  background-color: #FFFFFF;
  transform-origin:0 0;
  display: flex;
  justify-content: space-around;
}
</style>
