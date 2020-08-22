<template>
  <contract-establish :edit-data.sync="editData" :column-list="columnList" @contractEdit="contractEdit" @cancelEdit="cancelEdit" />
</template>

<script>
import Vue from 'vue'
import ContractEstablish from './components/ContractEstablish'
import { editProject } from '@/api/contract'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
export default {
  name: 'ContractCreate',
  components: { ContractEstablish },
  data() {
    return {
      editData: {
        h3Id: '',
        h3Phone: '',
        h3Name: '',
        name: '',
        contractTypeId: '',
        curId: '',
        level: '',
        planStartTime: '',
        planEndTime: '',
        // 富文本编辑框内容
        description: '',
        formData: {},
        files: ''
      },
      // 自定义字段
      columnList: [],
      code: 'contract'
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
    contractEdit() {
      const postData = deepClone(this.editData)
      postData.formData = JSON.stringify(this.editData.formData)
      editProject(postData).then(res => {
        if (res.code === 200) {
          this.$router.push('/contract-manager/contract-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/contract-manager/contract-list')
    }
  }
}
</script>
