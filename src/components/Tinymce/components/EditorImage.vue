<template>
  <div class="upload-container">
    <el-button
      :style="{background:color,borderColor:color}"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传图片
    </el-button>
    <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false" append-to-body>
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="/admin/test/upload"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          点击上传
        </el-button>
      </el-upload>
      <div style="text-align: right;">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      console.log(this.listObj)
      if (!this.checkAllSuccess()) {
        this.$message('请等待所有图片上传完成')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = `http://${response.data}`
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          const url = this.listObj[objKeyArr[i]].url
          const urlParts = url.split('/')
          const name = urlParts[urlParts.length - 1]
          return new Promise((resolve, reject) => {
            axios.post('/admin/test/deleteFile', { fileName: name }).then((res) => {
              resolve(true)
            })
          })
        }
      }
    },
    beforeUpload(file) {
      const size = file.size / 1024 / 1024
      if (size >= 10) {
        this.$message.error('文件大小不能超过10MB')
        return false
      }
      if (size === 0) {
        this.$message.error('文件不能为空')
        return false
      }
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      return new Promise((resolve, reject) => {
        if (file.type.search('jpeg') < 0 && file.type.search('jpg') < 0 && file.type.search('png') < 0) {
          this.$message.error('只可上传jpg或png图片')
          reject()
          return
        }
        _self.listObj[fileName] = {}
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
