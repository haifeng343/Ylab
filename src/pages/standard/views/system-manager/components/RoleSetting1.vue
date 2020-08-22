<template>
  <el-dialog
    :visible.sync="editAuthorizationDialog"
    width="520px"
    :close-on-click-modal="false"
  >
    <div slot="title" style="display: flex; align-items: center;">
      <div style="font-size: 16px;">配置：{{ roleName }}</div>
    </div>
    <el-tree
      v-if="editAuthorizationDialog"
      ref="emTree"
      v-loading="loading"
      :data="currenRolePower"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      default-expand-all
      @check="checkPower"
    >
      <span slot-scope="{ node, data }" style="display: flex; align-items: center;">
        <span>{{ data.name }}</span>
      </span>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRolePower } from '@/api/role'
import { getSelected, setDisabled } from '@/views/system-manager/utils'
import { editRolePower } from '@/api/role'

export default {
  name: 'RoleSetting',
  props: {
    roleName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleId: '',
      editAuthorizationDialog: false,
      loading: false,

      // 数据源
      menuDataMap: '',
      currenRolePower: [],
      selectMenuIds: [],
      selectDataIds: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      // 设置可看的部门
      roleDepts: []
    }
  },
  methods: {
    init() {
      this.menuDataMap = ''
      this.currenRolePower = []
      this.selectMenuIds = []
      this.selectDataIds = []
      this.roleDepts = []
      this.initPower()
    },
    checkPower(a, b) {
      this.selectMenuIds = b.checkedNodes.map(item => {
        return item.id
      })
    },
    async initPower() {
      this.loading = true
      const result = await getRolePower({ roleId: this.roleId })
      if (result.code === 200) {
        this.menuDataMap = result.data.dataMap
        Object.keys(this.menuDataMap).forEach(key => {
          this.menuDataMap[key].forEach(item => {
            if (item.isSelect) {
              this.selectDataIds.push(item.id)
            }
            if (item.code === 'other' && item.refers) {
              this.roleDepts.push({
                permissionId: item.id,
                refers: item.refers.map(item => { return { id: item.id, name: item.name } })
              })
            }
          })
        })
        if (this.roleName === '管理员') {
          this.currenRolePower = setDisabled(result.data.menuList)
        } else {
          this.currenRolePower = result.data.menuList
        }
        this.selectMenuIds = getSelected(result.data.menuList)
        this.$refs.emTree.setCheckedKeys(this.selectMenuIds)
        this.loading = false
      }
    },
    cancel() {
      this.editAuthorizationDialog = false
    },
    confirm() {
      this.editAuthorizationHandler()
    },
    editAuthorizationHandler() {
      if (this.selectMenuIds.length !== 0) {
        editRolePower({
          roleId: this.roleId,
          menuIds: this.selectMenuIds.join(','),
          dataIds: this.selectDataIds.join(','),
          roleDepts: this.roleDepts.map(item => {
            return {
              permissionId: item.permissionId,
              referIds: item.refers.map(item2 => item2.id).join(',')
            }
          })
        }).then(res => {
          if (res.code === 200) {
            this.editAuthorizationDialog = false
            this.$emit('reflash')
          }
        })
      } else {
        this.$message({
          message: '配置权限不能为空',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
