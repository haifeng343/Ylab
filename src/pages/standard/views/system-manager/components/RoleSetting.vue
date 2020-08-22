<template>
  <el-dialog
    :visible.sync="editAuthorizationDialog"
    width="520px"
    :close-on-click-modal="false"
  >
    <el-dialog
      title="选择部门"
      :visible.sync="deptDialog"
      width="660px"
      append-to-body
      :close-on-click-modal="false"
    >
      <ylab-picker
        v-if="deptDialog"
        ref="ylabPicker"
        :tools="['dept']"
        :default-dept-list="checkDeptList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="deptDialog = false">取 消</el-button>
        <el-button type="primary" @click="setDeptHandler">确 定</el-button>
      </div>
    </el-dialog>
    <div slot="title" style="display: flex; align-items: center;">
      <div style="font-size: 16px;">配置：</div>
      <el-breadcrumb separator="/" class="header-breadcrumb">
        <el-breadcrumb-item><a @click="settingMenuId=''">{{ roleName }}</a></el-breadcrumb-item>
        <el-breadcrumb-item v-if="settingMenuId !== ''">菜单权限：{{ settingMenuName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-tree
      v-if="editAuthorizationDialog"
      v-show="settingMenuId===''"
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
        <span class="settingHover">
          <svg-icon
            v-if="menuDataMap[data.id] && menuDataMap[data.id].length>0"
            icon-class="setting2"
            style="font-size: 20px; cursor: pointer; margin-left: 30px;"
            @click="settingMenu(data.id, data.name)"
          />
          <span
            v-if="menuDataMap[data.id] && menuDataMap[data.id].length>0"
            style="cursor: pointer; margin-left: 2px;"
            @click="settingMenu(data.id, data.name)"
          >配置</span>
        </span>
      </span>
    </el-tree>
    <div v-show="settingMenuId!==''">
      <div style="margin-bottom: 12px; font-weight: bold;">1.数据权限</div>
      <div v-for="dataApproval in dataApprovalList" :key="dataApproval.id" style="display: flex; align-items: center;">
        <el-checkbox :disabled="roleName==='管理员'||roleName==='实验员'||roleName==='采购主管'||roleName==='库存主管'" :value="tempSelectDataIds.includes(dataApproval.id)" :label="dataApproval.id" @change="checkData(dataApproval.id)">{{ dataApproval.name }}</el-checkbox>
        <span class="settingHover">
          <svg-icon
            v-if="dataApproval.code==='other' && roleName!=='管理员' && roleName !== '实验员' && roleName !== '采购主管' && roleName !== '库存主管'"
            icon-class="setting2"
            style="font-size: 18px; cursor: pointer; margin-left: 30px;"
            @click="settingDept(dataApproval.id)"
          />
          <span
            v-if="dataApproval.code==='other' && roleName!=='管理员' && roleName !== '实验员' && roleName !== '采购主管' && roleName !== '库存主管'"
            style="font-size: 14px; cursor: pointer; margin-left: 2px;"
            @click="settingDept(dataApproval.id)"
          >配置</span>
        </span>
      </div>
      <div style="margin-bottom: 12px; margin-top: 32px; font-weight: bold;">2.功能操作权限</div>
      <div v-for="buttonApproval in buttonApprovalList" :key="buttonApproval.id">
        <el-checkbox :disabled="roleName==='管理员'||roleName==='实验员'||roleName==='采购主管'||roleName==='库存主管'" :checked="tempSelectDataIds.includes(buttonApproval.id)" :label="buttonApproval.id" @change="checkData(buttonApproval.id)">{{ buttonApproval.name }}</el-checkbox>
      </div>
    </div>
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
import YlabPicker from '@/views/components/YlabPicker'

export default {
  name: 'RoleSetting',
  components: {
    YlabPicker
  },
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
      tempSelectDataIds: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },

      // 配置权限中的菜单
      settingMenuId: '',
      settingMenuName: '',

      // 设置可看的部门
      deptDialog: false,
      roleDepts: [],
      checkDeptList: [],
      deptPermissionId: '',
      deptPermissionIndex: '',
      dataId: [],
      allDataId: null
    }
  },
  computed: {
    dataApprovalList() {
      if (this.menuDataMap[this.settingMenuId]) {
        return this.menuDataMap[this.settingMenuId].filter(item => { return item.type === 2 })
      } else {
        return []
      }
    },
    buttonApprovalList() {
      if (this.menuDataMap[this.settingMenuId]) {
        return this.menuDataMap[this.settingMenuId].filter(item => { return item.type === 3 })
      } else {
        return []
      }
    }
  },
  methods: {
    init() {
      this.currenRolePower = []
      this.selectMenuIds = []
      this.selectDataIds = []
      this.roleDepts = []
      this.initPower()
      this.settingMenuId = ''
    },
    // 当前设置权限中的菜单
    settingMenu(id, name) {
      this.dataId = []
      this.settingMenuId = id
      this.settingMenuName = name
      this.tempSelectDataIds = this.selectDataIds.map(item => item)
      this.menuDataMap[id].map(item => {
        if (item.sort) {
          this.dataId.push(item.id)
          if (item.code === 'all') {
            this.allDataId = item.id
          }
        }
      })
      if (!this.tempSelectDataIds.find(item => this.dataId.includes(item))) {
        this.tempSelectDataIds.push(this.allDataId)
      }
    },
    checkPower(a, b) {
      this.selectMenuIds = b.checkedNodes.map(item => {
        return item.id
      })
    },
    checkData(id) {
      const index = this.tempSelectDataIds.indexOf(id)
      if (index === -1) {
        this.tempSelectDataIds.push(id)
      } else {
        for (let i = 0; i < this.roleDepts.length; i++) {
          if (this.roleDepts[i].permissionId === id) {
            this.roleDepts.splice(i, 1)
            break
          }
        }
        this.tempSelectDataIds.splice(index, 1)
      }
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
        if (this.roleName === '管理员' || this.roleName === '实验员' || this.roleName === '采购主管' || this.roleName === '库存主管') {
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
      if (this.settingMenuId !== '') {
        this.settingMenuId = ''
      } else {
        this.editAuthorizationDialog = false
      }
    },
    confirm() {
      if (this.settingMenuId !== '') {
        this.settingMenuId = ''
        this.selectDataIds = this.tempSelectDataIds.map(item => item)
      } else {
        this.editAuthorizationHandler()
      }
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
    },
    // 数据权限-其它部门，设置部门
    settingDept(id) {
      this.deptPermissionId = id
      for (let i = 0; i < this.roleDepts.length; i++) {
        if (this.roleDepts[i].permissionId === id) {
          this.deptPermissionIndex = i
          this.checkDeptList = this.roleDepts[i].refers
          this.deptDialog = true
          return
        }
      }
      this.deptPermissionIndex = ''
      this.checkDeptList = []
      this.deptDialog = true
    },
    setDeptHandler() {
      this.deptDialog = false
      if (this.$refs.ylabPicker.checkDeptList.length > 0) {
        const index = this.tempSelectDataIds.indexOf(this.deptPermissionId)
        if (index === -1) {
          this.tempSelectDataIds.push(this.deptPermissionId)
        }
      } else {
        const index = this.tempSelectDataIds.indexOf(this.deptPermissionId)
        if (index !== -1) {
          this.tempSelectDataIds.splice(index, 1)
        }
      }
      if (this.deptPermissionIndex === '') {
        this.roleDepts.push({
          permissionId: this.deptPermissionId,
          refers: this.$refs.ylabPicker.checkDeptList
        })
      } else {
        this.roleDepts[this.deptPermissionIndex].refers = this.$refs.ylabPicker.checkDeptList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-breadcrumb {
  font-size: 16px;
  >>>.el-breadcrumb__separator {
    font-weight: 400;
  }
}
.settingHover {
  color: #1A4FA1;
}
.settingHover:hover {
  color: #4A90E2;
}
</style>
