<template>
  <div class="container-line-item">
    <el-checkbox-group v-model="checkedColumnsClone" style="width: calc(100% - 132px);" @change="saveHandler">
      <el-checkbox v-for="(fixedColumn, index) in fixedColumns" :key="index" :label="fixedColumn" />
      <el-checkbox v-for="column in columnList" :key="column.code" :label="column.code">{{ column.name }}</el-checkbox>
    </el-checkbox-group>
    <el-button class="container-line-button" plain @click="$emit('closeme')">
      关闭
    </el-button>
  </div>
</template>

<script>
import { fetchColumnList } from '@/api/form'
export default {
  name: 'ColumnFilterSettings',
  props: {
    code: {
      type: String,
      default: ''
    },
    fixedColumns: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      columnList: [],
      checkedColumnsClone: []
    }
  },
  computed: {
    checkedColumns() {
      if (this.$store.getters.column.checkedColumns[this.code]) {
        return JSON.parse(this.$store.getters.column.checkedColumns[this.code])
      } else {
        return []
      }
    }
  },
  watch: {
    code() {
      this.fetchColumnList()
    }
  },
  created() {
    this.fetchColumnList()
    this.checkedColumnsClone = this.checkedColumns
  },
  methods: {
    saveHandler() {
      this.$store.dispatch('column/saveColumn', { code: this.code, checkedColumns: JSON.stringify(this.checkedColumnsClone) })
    },
    fetchColumnList() {
      fetchColumnList({ code: this.code }).then(response => {
        this.columnList = response.data.list
      })
    }
  }
}
</script>
