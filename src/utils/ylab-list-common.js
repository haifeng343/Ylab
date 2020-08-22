export var mixin = {
  activated() {
    this.getList()
  },
  methods: {
    // 分页变动
    paginationHandler() {
      this.getList()
    },
    // 过滤变动后查询
    handleFilter() {
      this.listQuery.pageNo = 1
      this.getList()
    },
    setQueryTime(name) {
      if (this[name] && this[name].length === 2) {
        if (!this.listQuery[name]) {
          this.listQuery[name] = {}
        }
        this.listQuery[name].startTime = this[name][0]
        this.listQuery[name].endTime = this[name][1].replace('00:00:00', '23:59:59')
      } else {
        this.listQuery[name] = undefined
      }
    }
  }
}
