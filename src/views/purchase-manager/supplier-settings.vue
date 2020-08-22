<template>
  <div class="app-container">
    <div class="container-line-item">
      <span class="status-text-button">字段配置</span>
      <el-button class="container-line-button" type="primary" @click="newColumnHandler">
        新建
      </el-button>
    </div>
    <column-table ref="column" :code="code" :column-list.sync="columnList" />
  </div>
</template>

<script>
import ColumnTable from '@/views/components/column/ColumnTable.vue'
import { fetchColumnList } from '@/api/form'

export default {
  name: 'SupplierSettings',
  components: { ColumnTable },
  data() {
    return {
      columnList: [
        { name: '编号', type: 'text', inherent: true, isNotNull: true },
        { name: '名称', type: 'text', inherent: true, isNotNull: true },
        { name: '账期', type: 'text', inherent: true, isNotNull: true },
        { name: '联系人', type: 'text', inherent: true, isNotNull: true },
        { name: '联系方式', type: 'text', inherent: true, isNotNull: true },
        { name: '简介', type: 'text', inherent: true, isNotNull: true },
        { name: '最近更新', type: 'date', inherent: true, isNotNull: true }
      ],
      code: 'supplier'
    }
  },
  created() {
    fetchColumnList({ code: this.code }).then(response => {
      this.columnList = this.columnList.concat(response.data.list)
    })
  },
  methods: {
    newColumnHandler() {
      this.$refs.column.newColumn()
    }
  }
}
</script>
