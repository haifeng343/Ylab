<template>
  <sale-establish :edit-data.sync="editData" :column-list="columnList" @contractEdit="contractEdit" @cancelEdit="cancelEdit" />
</template>

<script>
import Vue from 'vue'
import SaleEstablish from './components/SaleEstablish'
import { editProject } from '@/api/contract'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
export default {
  name: 'SaleCreate',
  components: { SaleEstablish },
  data() {
    return {
      editData: {
        isSign: true,
        h3Id: '',
        h3Phone: '',
        h3Name: '',
        name: '',
        contractTypeId: '',
        totalMoney: '',
        saleName: '',
        saleFrontName: '',
        saleBackName: '',
        curId: undefined,
        // 富文本编辑框内容
        remark: '',
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
      if (postData.totalMoney) {
        postData.totalMoney = Math.round(postData.totalMoney * 100)
      }
      postData.formData = JSON.stringify(this.editData.formData)
      editProject(postData).then(res => {
        if (res.code === 200) {
          this.$router.push('/sale-manager/sale-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/sale-manager/sale-list')
    }
  }
}
</script>
