<template>
  <div style="font-size: 14px;">
    <upload-button @upload="uploadHandler" @uploadEnd="uploadEndHandler" />
    <file-link-list delable :value="value" style="margin-top: 6px;" @del="delHandler" />
  </div>
</template>

<script>
import { deleteFile } from '@/api/common'
import FileLinkList from '@/views/components/FileLinkList'
import UploadButton from './UploadButton'

export default {
  name: 'NormalUpload',
  components: { FileLinkList, UploadButton },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempUploadFiles: [],
      newUploadFiles: [],
      deletedFiles: []
    }
  },
  methods: {
    uploadEndHandler() {
      this.newUploadFiles = this.newUploadFiles.concat(this.tempUploadFiles)
      if (this.value) {
        this.$emit('input', `${this.value},${this.tempUploadFiles.join(',')}`)
      } else {
        this.$emit('input', this.tempUploadFiles.join(','))
      }
      this.tempUploadFiles = []
    },
    uploadHandler(event) {
      this.tempUploadFiles.push(event)
    },
    clearDeletedFiles() {
      this.deletedFiles.forEach(element => {
        const urlArr = element.split('/')
        deleteFile({ fileName: urlArr[urlArr.length - 1] })
      })
    },
    clearNewUpload() {
      this.newUploadFiles.forEach(element => {
        const urlArr = element.split('/')
        deleteFile({ fileName: urlArr[urlArr.length - 1] })
      })
    },
    delHandler(url) {
      this.deletedFiles.push(url)
      const temp = this.value.split(',')
      temp.splice(temp.indexOf(url), 1)
      if (temp.length > 0) {
        this.$emit('input', temp.join(','))
      } else {
        this.$emit('input', '')
      }
    }
  }
}
</script>
