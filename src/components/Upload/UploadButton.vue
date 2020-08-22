<template>
  <div style="position: relative; width: 100px; height: 32px; cursor: pointer; overflow: hidden;">
    <el-button size="small" type="primary" :loading="uploadingLen>0" style="width: 100px;">{{ uploadingLen?`上传中..${uploadingLen}`:'点击上传' }}</el-button>
    <input type="file" multiple style="position: absolute; left: -100px; top: -32px; width: 200px; height: 64px; cursor: pointer; opacity: 0;" @change="chooseFilesHandler">
  </div>
</template>

<script>
import oss from '@/utils/ali-oss.js'

export default {
  name: 'UploadButton',
  props: {
    value: {
      type: String,
      default: ''
    },
    acceptType: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      uploadingLen: 0
    }
  },
  methods: {
    upload(file) {
      if (this.acceptType === 'image') {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          this.$message.error('只接受png、jpg格式的图片')
          this.uploadingLen -= 1
          return false
        }
      }
      const size = file.size / 1024 / 1024
      if (size >= 10) {
        this.$message.error('文件大小不能超过10MB')
        this.uploadingLen -= 1
        return false
      }
      if (size === 0) {
        this.$message.error('文件不能为空')
        this.uploadingLen -= 1
        return false
      }
      oss({
        file,
        onSuccess: (res) => {
          this.uploadingLen -= 1
          this.$emit('upload', res.url)
          if (this.uploadingLen === 0) {
            this.$emit('uploadEnd')
          }
        },
        onError: (error) => {
          this.uploadingLen -= 1
          this.$message.error(error)
        }
      })
    },
    chooseFilesHandler(event) {
      const files = event.target.files
      if (this.uploadingLen > 0) {
        return
      } else {
        this.uploadingLen = files.length
      }
      for (let i = 0; i < files.length; i++) {
        this.upload(files[i])
      }
      event.target.value = ''
    }
  }
}
</script>
