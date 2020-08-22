import { getMyQuery } from '@/api/common'
import { fetchColumnList } from '@/api/form'
import Vue from 'vue'
export var column = {
  computed: {
    checkedColumns() {
      if (this.$store.getters.column.checkedColumns[this.code]) {
        return JSON.parse(this.$store.getters.column.checkedColumns[this.code])
      } else {
        return []
      }
    },
    visibleColumns() {
      const temp = this.columnList.filter((item) => {
        return this.checkedColumns.includes(item.code)
      })
      temp.sort((a, b) => {
        return this.checkedColumns.indexOf(a.code) - this.checkedColumns.indexOf(b.code)
      })
      return temp
    }
  },
  created() {
    this.initCheckedColumns()
    this.initFormDataQuery()
  },
  activated() {
    this.initCheckedColumns()
    this.initFormDataQuery()
  },
  methods: {
    initFormDataQuery() {
      fetchColumnList({ code: this.code }).then(response => {
        this.columnList = response.data.list
        this.formDataQuery = {}
        this.columnList.forEach(element => {
          Vue.set(this.formDataQuery, element.code, undefined)
        })
      })
    },
    initCheckedColumns() {
      if (this.checkedColumns.length === 0) {
        getMyQuery({ code: this.code }).then(res => {
          const checkedColumns = res.data.checkedColumns
          if (checkedColumns && checkedColumns.length > 0) {
            this.$store.commit(
              'column/SET_CHECKED_COLUMNS',
              {
                code: this.code,
                checkedColumns: checkedColumns
              }
            )
          } else {
            this.$store.dispatch(
              'column/saveColumn',
              {
                code: this.code,
                checkedColumns: JSON.stringify(this.fixedColumns)
              }
            )
          }
        })
      }
    }
  }
}
