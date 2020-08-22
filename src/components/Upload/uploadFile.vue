<template>
  <uploader ref="uploader" :options="options" :file-status-text="fileStatusText" class="uploader-example" :style="{width: showList ? '660px' : '320px'}">
    <div v-show="showList" style="background: #fff;box-shadow: 0 0 6px rgba(0, 0, 0, .4);">
      <div style="display: flex; padding: 0 16px;justify-content: space-between;align-items: center;">
        <span style="fontSize: 16px;">传输列表</span>
        <div>
          <svg-icon class-name="shrink" icon-class="shrink" style="height: 20px;width: 20px;color: #909399;cursor: pointer;" @click="showList = !showList" />
          <svg-icon icon-class="closeX" style="height: 14px;width: 14px;color: rgba(144, 147, 153, .6);cursor: pointer; margin-left: 20px;" @click="$store.state.user.showUpLoad = false" />
        </div>
      </div>
      <uploader-list />
    </div>
    <div v-show="!showList">
      <div class="uploadShowMin">
        <div class="circleProgress">
          <el-progress type="circle" :percentage="percent" :stroke-width="9" :width="84" color="#5370FF" />
          <div style="position: absolute;fontSize: 22px;">{{ `${percent.toFixed(0)}%` }}</div>
        </div>
        <div style="fontSize: 20px; color: #3352FA">{{ `${(sizeUploaded/1048576).toFixed(1)}/${(feliSize/1048576).toFixed(1)}M` }}</div>
        <svg-icon class-name="extend" icon-class="extend" style="height: 48px;width: 48px; color: #3352FA; margin-left: 16px;cursor: pointer;" @click="showList = !showList" />
      </div>
    </div>
  </uploader>
</template>

<script>
import { fileEdit } from '@/api/task'
import { EventBus } from '@/utils/event-bus'
export default {
  name: 'UploadFile',
  data() {
    return {
      showList: true,
      options: {
        target: 'http://' + window.location.host + '/admin/test/upload',
        testChunks: false
      },
      fileStatusText: {
        success: '上传成功',
        error: '上传失败',
        uploading: '上传中',
        paused: '暂停',
        waiting: '等待'
      },
      feliSize: 0,
      sizeUploaded: 0,
      percent: 0,
      kinds: '1',
      contractId: 0
    }
  },
  mounted() {
    this.initEvnet()
    EventBus.$on('uploadFile', fileData => {
      this.kinds = fileData.kinds
      this.contractId = fileData.contractId
      this.chooseFiles(fileData.ev)
    })
  },
  methods: {
    initEvnet() {
      const fileArray = []
      let timer
      const vueObj = this
      const objIdObj = {} // 保存id
      const kindsObj = {} // 保存kinds
      const contractIdObj = {} // 保存contractId
      async function sendFiles(Files, parentId = '0', isApprove = 1) {
        if (Files.isFolder) {
          const result = await fileEdit([{
            name: Files.name,
            objId: objIdObj[Files.files[0].uniqueIdentifier],
            kinds: kindsObj[Files.files[0].uniqueIdentifier],
            contractId: contractIdObj[Files.files[0].uniqueIdentifier],
            path: Files.path,
            size: '',
            type: 2,
            isApprove,
            parentId
          }])
          fileArray.forEach((inItem) => {
            if (inItem.path === Files.path) {
              inItem.parentId = `${parentId},${result.data[0].id}`
              inItem.isApprove = 0
            }
          })
          Files.fileList.forEach((item) => {
            // sendFiles(item, result.data[0].id)
            sendFiles(item, `${parentId},${result.data[0].id}`, 0)
          })
        }
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          fileEdit(fileArray).then(() => {
            fileArray.forEach(item => {
              delete objIdObj[item.uniqueIdentifier]
              delete kindsObj[item.uniqueIdentifier]
              delete contractIdObj[item.uniqueIdentifier]
            })
            fileArray.length = 0
            EventBus.$emit('refreshDownload')
          })
        }, 600)
      }
      const uploader = this.$refs.uploader.uploader
      uploader.on('fileSuccess', function(rootFile, file, message) {
        fileArray.push({
          name: JSON.parse(message).data,
          objId: objIdObj[file.uniqueIdentifier],
          kinds: kindsObj[file.uniqueIdentifier],
          contractId: contractIdObj[file.uniqueIdentifier],
          size: file.size / 1024,
          type: 1,
          isApprove: 1,
          parentId: '0',
          path: file.parent.path,
          uniqueIdentifier: file.uniqueIdentifier
        })
      })
      uploader.on('fileComplete', async function(rootFile) {
        sendFiles(rootFile)
      })
      uploader.on('fileProgress', function(rootFile, file) {
        vueObj.sizeUploaded = uploader.sizeUploaded()
        vueObj.feliSize = uploader.getSize()
        vueObj.percent = uploader.progress() * 100
      })
      uploader.on('fileAdded', function(files, event) {
        objIdObj[files.uniqueIdentifier] = vueObj.$route.query.id
        kindsObj[files.uniqueIdentifier] = vueObj.kinds
        contractIdObj[files.uniqueIdentifier] = vueObj.contractId
      })
    },
    chooseFiles(ev) {
      const files = ev.target.files
      const uploader = this.$refs.uploader.uploader
      for (let i = 0; i < files.length; i++) {
        uploader.addFile(files[i])
      }
      ev.target.value = ''
    }
  }
}
</script>
<style lang="scss">
   .uploadShowMin{
     height: 84px;
     padding: 18px;
     display: flex;
     justify-content: flex-end;
     background: #fff;
     border-radius: 42px;
     box-shadow: 0 0 6px rgba(0, 0, 0, .4);
     .circleProgress{
       border-radius: 51px;
       height: 102px;
       width: 102px;
       position: absolute;
       left: 12px;
       top: 4px;
       background: #fff;
       box-shadow: 0 0 6px rgba(0, 0, 0, .4);
       display: flex;
       justify-content: center;
       align-items: center;
     }
     .extend{
      height: 48px;
      width: 48px;
     }
   }
   .uploader-file {
     height: 32px !important;
    line-height: 32px !important;
    border-bottom: 0 !important;
   }
  .uploader-example {
    padding: 15px;
    font-size: 12px;
    /* box-shadow: 0 0 6px rgba(0, 0, 0, .4); */
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
    color: #fff;
    background-color: #5370FF;
    border-color: #5370FF;
    padding: 7px 15px;
    font-size: 12px;
    border-radius: 3px;
    font-weight: 400;
  }
  .uploader-example .uploader-btn:hover{
    background: #758dff;
    border-color: #758dff;
    color: #fff;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .uploader-file-progress{
    background: #5370FF !important;
  }
  .uploader-file-icon{
    margin-top: 8px !important;
    &:before{
      font-size: 18px !important;
    }
  }
  .uploader-file-actions>span{
    margin-top: 8px !important;
  }
</style>
