<template>
  <div class="ylab-picker">
    <el-tabs type="border-card" style="width: 310px">
      <el-tab-pane v-if="tools.includes('emp')" label="选择人员">
        <el-input v-model="empName" class="search" placeholder="输入搜索..." @keyup.enter.native="searchEmp(empName)"><i slot="prefix" class="el-input__icon el-icon-search" @click="searchEmp(empName)" /></el-input>
        <emp-picker ref="empPicker" :value="checkEmpList" @input="checkEmpList=$event; empRadio()" />
      </el-tab-pane>
      <el-tab-pane v-if="tools.includes('dept')" label="选择部门">
        <dept-picker ref="deptPicker" :value="checkDeptList" @input="checkDeptList=$event; deptRadio()" />
      </el-tab-pane>
      <el-tab-pane v-if="tools.includes('role')" label="选择角色">
        <role-picker ref="rolePicker" :value="checkRoleList" @input="checkRoleList=$event; roleRadio()" />
      </el-tab-pane>
    </el-tabs>
    <div class="checked-part">
      <div class="header">已选</div>
      <div class="container">
        <div v-if="checkEmpList.length > 0" class="part">
          <div class="name">人员:</div>
          <div class="picked">
            <el-tag
              v-for="emp in checkEmpList"
              v-show="emp.type===2"
              :key="emp.id"
              :disable-transitions="true"
              closable
              @close="delEmpHandler(emp.id)"
            >{{ emp.name }}</el-tag>
          </div>
        </div>
        <div v-if="checkDeptList.length > 0" class="part">
          <div class="name">部门:</div>
          <div class="picked">
            <el-tag
              v-for="dept in checkDeptList"
              :key="dept.id"
              :disable-transitions="true"
              closable
              @close="delDeptHandler(dept.id)"
            >{{ dept.name }}</el-tag>
          </div>
        </div>
        <div v-if="checkRoleList.length > 0" class="part">
          <div class="name">角色:</div>
          <div class="picked">
            <el-tag
              v-for="(role, index) in checkRoleList"
              :key="role.id"
              :disable-transitions="true"
              closable
              @close="checkRoleList.splice(index, 1)"
            >{{ role.name }}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmpPicker from './EmpPicker'
import DeptPicker from './DeptPicker'
import RolePicker from './RolePicker'

export default {
  name: 'YlabPicker',
  components: { EmpPicker, DeptPicker, RolePicker },
  props: {
    currentRole: {
      type: Object,
      default: null
    },
    defaultEmpList: {
      type: Array,
      default: () => { return [] }
    },
    defaultDeptList: {
      type: Array,
      default: () => { return [] }
    },
    defaultRoleList: {
      type: Array,
      default: () => { return [] }
    },
    tools: {
      type: Array,
      default: () => { return ['emp', 'dept', 'role'] }
    },
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 已选部门
      checkEmpList: [],
      checkDeptList: [],
      checkRoleList: [],
      empName: ''
    }
  },
  created() {
    this.checkEmpList = this.defaultEmpList.map(item => Object.assign(item, { type: 2 }))
    this.checkDeptList = this.defaultDeptList
    this.checkRoleList = this.defaultRoleList
  },
  methods: {
    delEmpHandler(id) {
      this.$refs.empPicker.delEmp(id)
    },
    delDeptHandler(id) {
      this.$refs.deptPicker.delDept(id)
    },
    empRadio() {
      if (this.isRadio) {
        this.checkDeptList = []
        this.checkRoleList = []
      }
    },
    deptRadio() {
      if (this.isRadio) {
        this.checkEmpList = []
        this.checkRoleList = []
      }
    },
    roleRadio() {
      if (this.isRadio) {
        this.checkEmpList = []
        this.checkDeptList = []
      }
    },
    searchEmp(event) {
      if (event.trim()) {
        this.$refs.empPicker.selectByName(event)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ylab-picker {
  display: flex;
  >>>.el-tabs {
    box-shadow: none;
    .el-tabs__content {
      padding: 0;

      .el-tab-pane {
        height: 332px;
        overflow-y: auto;
      }

      .el-tree {
        margin: 15px;
      }

      .el-checkbox-group {
        margin: 15px;
      }
    }
  }
}
.checked-part {
  width: 310px;
  border: 1px solid #DCDFE6;
  border-left: none;

  .header {
    height: 39px;
    text-align: center;
    line-height: 39px;
    border-bottom: 1px solid #DCDFE6;
  }

  .container {
    height: 332px;
    overflow-y: auto;

    .part {
      display: flex;
      margin: 13px 8px;
      .name {
        flex: 0 0 42px;
        padding-top: 4px;
      }
      .picked {
        flex-grow: 1;

        .el-tag {
          margin-right: 4px;
          margin-left: 4px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
  .search.el-input {
    width: calc(100% - 30px);
    margin: 15px 15px 0 15px;
  }
</style>
