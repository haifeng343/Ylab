<template>
  <div>
    <supplier-establish :edit-data="editData" :column-list="columnList" @supplierEdit="supplierEdit" @cancelEdit="cancelEdit" />
  </div>
</template>

<script>
import Vue from 'vue'
import SupplierEstablish from './components/supplier-establish'
import { editSupplier } from '@/api/supplier'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
export default {
  name: 'SupplierCreate',
  components: { SupplierEstablish },
  data() {
    return {
      editData: {
        name: '',
        itemDate: undefined,
        contactName: '',
        contactPhone: undefined,
        buySupplierList: [],
        // 富文本编辑框内容
        remark: '',
        formData: {}
      },
      // 自定义字段
      columnList: [],
      code: 'supplier'
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
    supplierEdit() {
      const postData = deepClone(this.editData)
      postData.formData = JSON.stringify(this.editData.formData)
      editSupplier(postData).then(res => {
        if (res.code === 200) {
          this.$router.push('/purchase-manager/supplier-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/purchase-manager/supplier-list')
    }
  }
}
</script>
