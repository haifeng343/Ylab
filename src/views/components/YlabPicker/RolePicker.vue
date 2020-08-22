<template>
  <el-checkbox-group :value="selectedIds" class="role-picker-check" @input="checkHandler">
    <el-checkbox v-for="role in roleData" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import { getRolesList } from '@/api/role'
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
      roleData: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    selectedIds() {
      return this.value.map(item => item.id)
    }
  },
  created() {
    getRolesList(this.listQuery).then(res => {
      this.roleData = res.data.list
    })
  },
  methods: {
    checkHandler(event) {
      const roleList = this.roleData.filter(item => {
        return event.includes(item.id)
      }).map(item => {
        return { id: item.id, name: item.name }
      })
      this.$emit('input', roleList)
    }
  }
}
</script>

<style lang="scss" scoped>
.role-picker-check>>>.el-checkbox {
  display: block;
  padding: 4px 0;
}
</style>
