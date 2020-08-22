<template>
  <div>
    <store-establish :edit-data.sync="editData" :column-list="columnList" @storeEdit="storeEdit" @cancelEdit="cancelEdit" />
  </div>
</template>

<script>
import Vue from 'vue'
import StoreEstablish from './components/store-establish'
import { deepClone } from '@/utils'
import { editStore } from '@/api/store'
import { fetchColumnList } from '@/api/form'

export default {
  name: 'StoreCreate',
  components: { StoreEstablish },
  data() {
    return {
      editData: {
        name: '',
        typeId: undefined,
        specs: undefined,
        type: 3,
        formData: {}
      },
      // 自定义字段
      columnList: [],
      code: 'buy_store'
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.initData()
    }
    fetchColumnList({ code: this.code }).then(response => {
      this.columnList = response.data.list
      this.columnList.forEach(element => {
        Vue.set(this.editData.formData, element.id, '')
      })
    })
  },
  methods: {
    initData() {
      const initMsg = this.$route.query
      this.editData.id = initMsg.id
      this.editData.name = initMsg.name
      this.editData.specs = initMsg.specs
      this.editData.typeId = initMsg.typeId
      this.editData.formData = initMsg.formData
    },
    storeEdit() {
      const postData = deepClone(this.editData)
      postData.formData = JSON.stringify(this.editData.formData)
      editStore(postData).then(res => {
        if (res.code === 200) {
          // this.$router.push('/store-manager/store-list')
          this.$router.back()
        }
      })
    },
    cancelEdit() {
      this.$router.back()
    }
  }
}
</script>
