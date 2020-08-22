<template>
  <purchase-establish :edit-data.sync="editData" :column-list="columnList" @purchaseEdit="purchaseEdit" @cancelEdit="cancelEdit" />
</template>

<script>
import PurchaseEstablish from './components/purchase-establish'
import { editPurchaseForm } from '@/api/purchase'
import { fetchColumnList } from '@/api/form'
export default {
  name: 'PurchaseCreate',
  components: { PurchaseEstablish },
  data() {
    return {
      editData: {
        contractId: '',
        purpose: '',
        name: '',
        specs: '',
        typeName: '',
        typeId: undefined,
        formData: {},
        buyInfoList: []
      },
      files: [],
      // 自定义字段
      columnList: [],
      code: 'buy_order'
    }
  },
  created() {
    if (Object.keys(this.$route.query).length !== 0) {
      this.editData.buyInfoList.push({ name: '', specs: '' })
      this.editData.buyInfoList[0].name = this.$route.query.name
      this.editData.buyInfoList[0].specs = this.$route.query.specs
      if (this.$route.query.typeId !== 'null') {
        this.editData.buyInfoList[0].typeName = this.$route.query.typeName
        this.editData.buyInfoList[0].typeId = Number(this.$route.query.typeId)
      }
    }
    fetchColumnList({ code: this.code }).then(response => {
      this.columnList = response.data.list
      this.columnList.forEach(element => {
        this.$set(this.editData.formData, element.id, '')
      })
    })
  },
  methods: {
    purchaseEdit() {
      this.editData.formData = JSON.stringify(this.editData.formData)
      editPurchaseForm(this.editData).then(res => {
        if (res.code === 200) {
          this.$router.push('/purchase-manager/purchase-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/purchase-manager/purchase-list')
    }
  }
}
</script>
