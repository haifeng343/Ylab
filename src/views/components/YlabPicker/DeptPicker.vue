<template>
  <el-tree
    ref="emTree"
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    show-checkbox
    default-expand-all
    @check="checkHandler"
  />
</template>

<script>
import { queryDept } from '@/api/user'
export default {
  name: 'DeptPicker',
  props: {
    value: {
      type: Array,
      default: () => { return [] }
    }
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    value(val) {
      this.$refs.emTree.setCheckedKeys(val.map(item => item.id))
    }
  },
  created() {
    queryDept().then(res => {
      this.treeData = [res.data]
    })
  },
  mounted() {
    this.$refs.emTree.setCheckedKeys(this.value.map(item => item.id))
  },
  methods: {
    delDept(id) {
      this.getAllIds(this.treeData, id, [])
    },
    getAllIds(arr, id, parentIds) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          const childrenIds = []
          if (arr[i].children) {
            this.getDelChildrenHandler(arr[i].children, childrenIds)
          }
          const allDelIds = parentIds.concat(childrenIds)
          allDelIds.push(id)
          this.delDeptHandler(allDelIds)
          return
        }
        if (arr[i].children) {
          const myParentIds = [...parentIds]
          myParentIds.push(arr[i].id)
          this.getAllIds(arr[i].children, id, myParentIds)
        }
      }
    },
    getDelChildrenHandler(arr, childrenIds) {
      for (let i = 0; i < arr.length; i++) {
        childrenIds.push(arr[i].id)
        if (arr[i].children) {
          this.getDelChildrenHandler(arr[i].children, childrenIds)
        }
      }
    },
    delDeptHandler(allDelIds) {
      for (let i = 0; i < allDelIds.length; i++) {
        for (let j = this.value.length - 1; j >= 0; j--) {
          if (this.value[j].id === allDelIds[i]) {
            this.value.splice(j, 1)
            j = -1
          }
        }
      }
      this.$emit('input', this.value)
    },
    checkHandler(a, b) {
      const deptList = b.checkedNodes.map(item => {
        return { id: item.id, name: item.name }
      })
      this.$emit('input', deptList)
    }
  }
}
</script>
