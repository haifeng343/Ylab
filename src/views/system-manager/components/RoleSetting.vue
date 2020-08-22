<template>
  <el-tree
    :data="currenRolePower"
    show-checkbox
    node-key="id"
    :props="defaultProps"
    :default-checked-keys="selectPowerId"
    @check="checkPower"
  />
</template>

<script>
import { getRolePower } from '@/api/role'
import { selected, Menu } from '@/utils'

export default {
  name: 'RoleSetting',
  props: {
    roleId: {
      type: Number,
      default: 0
    },
    roleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currenRolePower: [],
      selectPowerId: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      }
    }
  },
  mounted() {
    this.initPower()
  },
  methods: {
    checkPower(a, b) {
      this.selectPowerId = b.checkedNodes.map(item => {
        return item.id
      })
    },
    async initPower() {
      const result = await getRolePower({ roleId: this.roleId })
      if (result.code === 200) {
        this.currenRolePower = Menu(result.data, this.roleName)
        Menu(result.data, this.roleName)
        this.selectPowerId = selected(result.data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container-line-title {
  margin-top: 24px;
}
.form-checkList {
  padding-left: 24px;
  margin-bottom: 24px;
  .form-title {
    color: #000000;
    line-height: 14px;
  }
}
</style>
