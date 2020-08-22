<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="roleData" border style="width: 100%">
      <el-table-column label="角色名字" align="center" width="126">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色说明" width="360">
        <template slot-scope="{row}">
          <span v-if="row.name === '管理员'">所有权限</span>
          <span v-if="row.name === '实验员'">项目、任务基本操作权限，物品领用、采购申请权限等</span>
          <span v-if="row.name === '库存主管'">库存管理的所有权限</span>
          <span v-if="row.name === '采购主管'">采购管理的所有权限</span>
        </template>
      </el-table-column>
      <el-table-column label="角色成员" align="left">
        <template slot-scope="{row}">
          <div v-if="row.member">人员：{{ row.member }}</div>
          <div v-if="row.depName">部门：{{ row.depName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="editRole(row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="editAuthorization(row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="total>0"
      :total="total"
      :page.sync="listQuery.pageNo"
      :limit.sync="listQuery.pageSize"
      @pagination="paginationHandler"
    />
    <el-dialog
      title="编辑角色成员"
      :visible.sync="editRoleDialog"
      width="660px"
      height="725px"
      :close-on-click-modal="false"
    >
      <ylab-picker
        v-if="editRoleDialog"
        ref="ylabPicker"
        :tools="['emp', 'dept']"
        :default-emp-list="defaultEmpList"
        :default-dept-list="defaultDeptList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleHandler">确 定</el-button>
      </div>
    </el-dialog>

    <role-setting ref="roleSetting" :role-name="currentRole.name" @reflash="getList" />
  </div>
</template>

<script>
import { getRolesList } from '@/api/role'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
import { roleAddMember, editRolePower } from '@/api/role'
import YlabPicker from '@/views/components/YlabPicker'
import RoleSetting from './components/RoleSetting'

export default {
  components: {
    Pagination,
    YlabPicker,
    RoleSetting
  },
  mixins: [mixin],
  data() {
    return {
      roleData: [],
      total: 0,
      currentRole: {},
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20
      },

      editRoleDialog: false,
      defaultEmpList: [],
      defaultDeptList: [],

      editAuthorizationDialog: false
    }
  },
  computed: {},
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const { pageNo, pageSize } = this.listQuery
      this.listLoading = true
      const result = await getRolesList({ pageNo, pageSize })
      if (result.code === 200) {
        this.roleData = result.data.list
        this.total = result.data.total
        this.roleData.forEach(item => {
          item.member = item.employees.map(item => {
            return item.name
          }).toString()
          item.depName = item.depts.map(item => {
            return item.name
          }).toString()
        })
        this.listLoading = false
      }
    },
    editRole(row) {
      this.currentRole = row
      this.defaultEmpList = row.employees.map(item => { return { name: item.name, id: item.id } })
      this.defaultDeptList = row.depts.map(item => { return { name: item.name, id: item.id } })
      this.editRoleDialog = true
    },
    editRoleHandler() {
      roleAddMember({
        empIds: this.$refs.ylabPicker.checkEmpList.filter(item => { return item.type === 2 }).map(item => item.id),
        deptIds: this.$refs.ylabPicker.checkDeptList.map(item => item.id),
        roleId: this.currentRole.id
      }).then(res => {
        if (res.code === 200) {
          this.editRoleDialog = false
          this.getList()
        }
      })
    },
    editAuthorization(row) {
      this.currentRole = row
      this.$refs.roleSetting.roleId = this.currentRole.id
      this.$refs.roleSetting.init()
      this.$refs.roleSetting.editAuthorizationDialog = true
    },
    editAuthorizationHandler() {
      const selectPowerId = this.$refs.roleSetting.selectPowerId
      if (selectPowerId.length !== 0) {
        editRolePower({
          roleId: this.currentRole.id,
          permissionIds: selectPowerId.toString()
        }).then(res => {
          if (res.code === 200) {
            this.editAuthorizationDialog = false
            this.getList()
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
<style lang="scss" scoped>
.new-create {
  float: right;
  margin: 0 12px 12px 0;
}
</style>
