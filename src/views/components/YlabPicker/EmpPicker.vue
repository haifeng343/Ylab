<template>
  <el-tree
    ref="emTree"
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    show-checkbox
    :default-expanded-keys="empId"
    @check="checkHandler"
  >
    <span slot-scope="{ node, data }">
      <span :style="{backgroundColor: empId.includes(data.id)?'rgba(74, 144, 226, .3)':''}">{{ data.name }}</span>
    </span>
  </el-tree>
</template>
<script>
import { getTree } from '@/api/user'
export default {
  name: 'EmpPicker',
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
      },
      empId: []
    }
  },
  watch: {
    value(val) {
      this.$refs.emTree.setCheckedKeys(val.map(item => item.id))
    }
  },
  created() {
    getTree().then(res => {
      this.treeData = this.changeId([res.data])
    })
  },
  mounted() {
    this.$refs.emTree.setCheckedKeys(this.value.map(item => item.id))
  },
  methods: {
    delEmp(id) {
      this.getAllIds(this.treeData, id, [])
    },
    getAllIds(arr, id, parentIds) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          this.delEmpHandler(id, parentIds)
          return
        }
        if (arr[i].children) {
          const myParentIds = [...parentIds]
          myParentIds.push(arr[i].id)
          this.getAllIds(arr[i].children, id, myParentIds)
        }
      }
    },
    delEmpHandler(id, parentIds) {
      for (let i = 0; i < parentIds.length; i++) {
        for (let j = this.value.length - 1; j >= 0; j--) {
          if (this.value[j].id === parentIds[i]) {
            this.value.splice(j, 1)
            j = -1
          }
        }
      }
      for (let j = this.value.length - 1; j >= 0; j--) {
        if (this.value[j].id === id) {
          this.value.splice(j, 1)
          j = -1
        }
      }
      this.$emit('input', this.value)
    },
    changeId(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 1) {
          arr[i].id = `1-${arr[i].id}`
        }
        if (arr[i].children) {
          this.changeId(arr[i].children)
        }
      }
      return arr
    },
    checkHandler(a, b) {
      const memberList = b.checkedNodes.map(item => {
        return { id: item.id, name: item.name, type: item.type }
      })
      this.$emit('input', memberList)
    },
    searchIdByName(tree, name) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].children) {
          this.searchIdByName(tree[i].children, name)
        }
        if (tree[i].type === 2 && tree[i].name.search(name) !== -1) {
          this.empId.push(tree[i].id)
        }
      }
    },
    selectByName(empName) {
      // this.empId = []
      this.$set(this, 'empId', [])
      this.searchIdByName(this.treeData, empName)
    }
  }
}
</script>
