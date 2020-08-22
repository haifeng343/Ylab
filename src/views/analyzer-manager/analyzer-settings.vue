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
  name: 'AnalyzerSettings',
  components: { ColumnTable },
  data() {
    return {
      columnList: [
        { name: '名称', type: 'text', inherent: true, isNotNull: true },
        { name: '用途', type: 'employee', inherent: true, isNotNull: true },
        { name: '可预约最长时间(小时)', type: 'date', inherent: true, isNotNull: true }
      ],
      code: 'machine'
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
