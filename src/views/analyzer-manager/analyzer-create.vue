<template>
  <analyzer-establish :edit-data.sync="editData" :column-list="columnList" @analyzerEdit="analyzerEdit" @cancelEdit="cancelEdit" />
</template>

<script>
import Vue from 'vue'
import AnalyzerEstablish from './components/analyzer-establish'
import { editAnalyzer } from '@/api/analyzer'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
export default {
  name: 'AnalyzerCreate',
  components: { AnalyzerEstablish },
  data() {
    return {
      editData: {
        name: '',
        brand: '',
        specs: '',
        maxTime: undefined,
        address: '',
        purpose: '',
        formData: {}
      },
      // 自定义字段
      columnList: [],
      code: 'machine'
    }
  },
  created() {
    fetchColumnList({ code: this.code }).then(response => {
      this.columnList = response.data.list
      this.columnList.forEach(element => {
        Vue.set(this.editData.formData, element.id, '')
      })
    })
  },
  methods: {
    analyzerEdit() {
      const postData = deepClone(this.editData)
      postData.formData = JSON.stringify(this.editData.formData)
      editAnalyzer(postData).then(res => {
        if (res.code === 200) {
          this.$router.push('/analyzer-manager/analyzer-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/analyzer-manager/analyzer-list')
    }
  }
}
</script>
