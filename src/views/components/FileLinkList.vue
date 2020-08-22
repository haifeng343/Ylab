<template>
  <div style="width: 575px;">
    <div v-for="(file, index) in fileList" :key="index" class="file-item">
      <span class="link-type" @click="downloadHandler(file.name, file.url)">{{ file.name | hiddenTime }}</span>
      <i v-if="delable" class="el-icon-circle-close close" @click="delHandler(file.url)" />
    </div>
  </div>
</template>

<script>
import download from 'downloadjs'
import axios from 'axios'
export default {
  filters: {
    hiddenTime(value) {
      return decodeURIComponent(value.substring(14))
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    delable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    fileList() {
      if (this.value) {
        return this.value.split(',').map(item => {
          const urlParts = item.split('/')
          const name = urlParts[urlParts.length - 1]
          return { name, url: item }
        })
      } else {
        return []
      }
    }
  },
  methods: {
    downloadHandler(name, url) {
      axios.get(url, { responseType: 'blob' }).then((response) => {
        download(response.data, name)
      })
    },
    delHandler(url) {
      this.$emit('del', url)
    }
  }
}
</script>

<style scoped>
  .file-item {
    margin-bottom: 8px;
  }

  .file-item:hover .close {
    display: inline-block;
  }

  .close {
    color: #4A90E2;
    margin-right: 7px;
    cursor: pointer;
    display: none;
    margin-left: 7px;
  }
</style>
