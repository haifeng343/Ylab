<template>
  <div class="app-container">
    <div class="container-line-item">
      <span :class="code==='buy_store'?'status-text-button-actived':'status-text-button'" @click="codeChange('buy_store', true)">所有库存</span>
      <span
        v-for="type in typeList"
        :key="type.code"
        :class="code===type.code?'status-text-button-actived':'status-text-button'"
        @click="codeChange(type.code, false)"
      >
        {{ type.name }}
      </span>
      <el-button class="container-line-button" type="primary" @click="newColumnHandler">
        新建
      </el-button>
    </div>
    <column-table ref="column" :code="code" :is-top-type="isTopType" :column-list.sync="columnList" @typeChanged="getTypeList" />
  </div>
</template>

<script>
import ColumnTable from '@/views/components/column/ColumnTable.vue'
import { fetchColumnList, fetchTypeList } from '@/api/form'

export default {
  name: 'StoreSettings',
  components: { ColumnTable },
  data() {
    return {
      constColumnList: [
        { name: '名称', type: 'text', inherent: true, isNotNull: true },
        { name: '类型', type: 'select', inherent: true, isNotNull: false, options: '', isType: true },
        { name: '规格', type: 'text', inherent: true, isNotNull: true }
      ],
      columnList: [],
      typeList: [],
      code: 'buy_store',
      isTopType: true,
      topTypeColumn: []
    }
  },
  created() {
    this.getColumnList()
    this.getTypeList()
  },
  methods: {
    codeChange(code, isTopType) {
      this.code = code
      this.isTopType = isTopType
      this.getColumnList()
    },
    newColumnHandler() {
      this.$refs.column.newColumn()
    },
    getColumnList() {
      fetchColumnList({ code: this.code }).then(response => {
        const selfList = response.data.list
        if (!this.isTopType) {
          for (let i = selfList.length - 1; i >= 0; i--) {
            if (this.topTypeColumn.includes(selfList[i].code)) {
              selfList.splice(i, 1)
            }
          }
          this.columnList = this.constColumnList.concat(selfList)
          this.columnList.splice(1, 1) // 删除类型
        } else {
          this.columnList = this.constColumnList.concat(selfList)
          this.topTypeColumn = selfList.map(item => item.code)
        }
      })
    },
    getTypeList() {
      fetchTypeList({ pageNo: 1, pageSize: 100, code: this.code }).then(response => {
        this.typeList = response.data.list
      })
    }
  }
}
</script>
