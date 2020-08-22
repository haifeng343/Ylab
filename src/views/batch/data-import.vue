<template>
  <div>
    <div style="height: 100%; margin: 200px auto;">
      <div style="font-size: 28px;margin-bottom:20px; text-align:center;">导入数据</div>
      <div style="color:#606266; margin-bottom: 70px; text-align:center;">请先下载模板，依据模板格式填写表格后导入</div>
      <div style="display: flex; justify-content: center;">
        <div style="padding-top: 100px;">
          <el-button type="info" plain @click="downloadModel">先下载模板</el-button>
        </div>
        <div style="height: 160px; width: 1px; margin: 0 65px; background-color:#e1e1e1;" />
        <div style="padding-top: 10px;">
          <div style="display: flex; justify-content: center;">
            <svg-icon icon-class="upexcel" style="font-size: 70px; color: #67C23A; margin-bottom: 20px;" />
          </div>
          <div class="upload" style="width: 96px; height: 34px; position: relative;">
            <el-button type="primary"><svg-icon icon-class="upload" /> 上传数据</el-button>
            <input type="file" @change="uploadList">
          </div>
        </div>
      </div>
      <!-- <div style="font-size: 14px; color: red; text-align: center;margin-top: 40px;">请先下载模板，严格按照模板格式填写表格后导入，否则将无法导入数据！！！</div> -->
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
export default {
  name: 'GuideInto',
  data() {
    return {

    }
  },
  methods: {
    downloadModel() {
      if (this.$route.query.type === 'contract') {
        axios({ url: '/admin/contract/getExcelTemplate', method: 'post', data: {}, responseType: 'blob' }).then((res) => {
          var blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = `项目模板.xlsx`
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, `项目模板.xlsx`)
          }
        })
      }
      if (this.$route.query.type === 'task') {
        axios({ url: '/admin/task/getExcelTemplate', method: 'post', data: {}, responseType: 'blob' }).then((res) => {
          var blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = `任务模板.xlsx`
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, `任务模板.xlsx`)
          }
        })
      }
      if (this.$route.query.type === 'store') {
        axios({ url: '/admin/buyInfo/store/getExcelTemplate', method: 'post', data: {}, responseType: 'blob' }).then((res) => {
          var blob = new Blob([res.data])
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = `库存模板.xlsx`
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, `库存模板.xlsx`)
          }
        })
      }
    },
    uploadList(event) {
      const loading = this.$loading({
        lock: true,
        text: '上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const file = event.target.files[0]
      const fromData = new FormData()
      fromData.append('file', file)
      if (this.$route.query.type === 'contract') {
        const instance = axios.create()
        instance.post('/admin/contract/import', fromData).then((res) => {
          loading.close()
          if (res.data.code === 200) {
            this.$message.success('上传成功,2秒后跳转回项目列表')
            setTimeout(() => {
              this.$router.push('/contract-manager/contract-list')
            }, 2000)
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      }
      if (this.$route.query.type === 'task') {
        const instance = axios.create()
        instance.post('/admin/task/import', fromData).then((res) => {
          loading.close()
          if (res.data.code === 200) {
            this.$message.success('上传成功,2秒后跳转回任务列表')
            setTimeout(() => {
              this.$router.push('/contract-manager/task-list')
            }, 2000)
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      }
      if (this.$route.query.type === 'store') {
        const instance = axios.create()
        instance.post('/admin/buyInfo/store/import', fromData).then((res) => {
          loading.close()
          if (res.data.code === 200) {
            this.$message.success('上传成功,2秒后跳转回库存列表')
            setTimeout(() => {
              this.$router.push('/store-manager/store-list')
            }, 2000)
          }
          if (res.data.code !== 200) {
            Message({
              message: res.data.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
      }
      event.target.value = ''
    }
  }
}
</script>
<style lang="scss">
  .upload input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
</style>
