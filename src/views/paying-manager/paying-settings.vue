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
  name: 'PayingSettings',
  components: { ColumnTable },
  data() {
    return {
      columnList: [
        { name: '名称', type: 'text', inherent: true, isNotNull: true },
        { name: '类型', type: 'select', inherent: true, isNotNull: false, options: '', isType: true },
        { name: '申请人', type: 'employee', inherent: true, isNotNull: true },
        { name: '申请时间', type: 'date', inherent: true, isNotNull: true },
        { name: '更新时间', type: 'date', inherent: true, isNotNull: true }
      ],
      code: 'buy_pay'
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
