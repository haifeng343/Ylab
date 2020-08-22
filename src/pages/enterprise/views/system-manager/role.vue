<template>
  <div class="app-container">
    <div class="container-line-item">
      <div style="height: 32px; width: 1px; display: inline-block;" />
      <el-button class="container-line-button" type="primary" @click="newBuild">
        新建
      </el-button>
    </div>
    <el-table v-loading="listLoading" :data="roleData" border style="width: 100%">
      <el-table-column label="角色名字" align="center" width="126">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色说明" width="360">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色成员" align="left">
        <template slot-scope="{row}">
          <div v-if="row.member">人员：{{ row.member }}</div>
          <div v-if="row.depName">部门：{{ row.depName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="256">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="openEditRoleDialog(row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="editAuthorization(row)">权限</el-button>
          <el-button v-if="row.name==='管理员'||row.name==='实验员'" size="mini" type="info" disabled>删除</el-button>
          <el-button v-else size="mini" type="danger" @click="delRole(row)">删除</el-button>
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
      title="编辑角色"
      :visible.sync="editRoleDialog"
      width="520px"
      :close-on-click-modal="false"
    >
      <el-dialog
        title="编辑角色成员"
        :visible.sync="roleMemberDialog"
        width="660px"
        append-to-body
        :close-on-click-modal="false"
      >
        <ylab-picker
          v-if="roleMemberDialog"
          ref="ylabPicker"
          :tools="['emp', 'dept']"
          :default-emp-list="checkEmpList"
          :default-dept-list="checkDeptList"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleMemberDialog = false">取 消</el-button>
          <el-button type="primary" @click="roleAddMemberHandler">确 定</el-button>
        </div>
      </el-dialog>
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-position="left" class="ybr-form-col">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" :disabled="currentRole.name==='管理员' || currentRole.name==='实验员'" />
        </el-form-item>
        <el-form-item label="角色说明" prop="remark">
          <el-input v-model="roleForm.remark" :disabled="currentRole.name==='管理员' || currentRole.name==='实验员'" />
        </el-form-item>
      </el-form>
      <div style="height: 254px; background-color: #F8F9FB; margin: 25px -20px 0 -20px; padding: 20px;">
        <div style="margin-bottom: 24px;">
          <span>角色成员(可多选)</span>
          <span style="float: right; color: #4A90E2; cursor: pointer;" @click="roleMemberDialog = true">
            <svg-icon icon-class="into" style="font-size: 20px;" />选择</span>
        </div>
        <div v-if="checkEmpList.length > 0" style="display: flex; margin: 8px 0;">
          <div style="flex: 0 0 50px; line-height: 1.5;">人员：</div>
          <div style="flex-grow: 1; line-height: 1.5;">{{ checkEmpList.map(item=>item.name).join(', ') }}</div>
        </div>
        <div v-if="checkDeptList.length > 0" style="display: flex; margin: 8px 0;">
          <div style="flex: 0 0 50px; line-height: 1.5;">部门：</div>
          <div style="flex-grow: 1; line-height: 1.5;">{{ checkDeptList.map(item=>item.name).join(', ') }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleHandler">确 定</el-button>
      </div>
    </el-dialog>

    <role-setting ref="roleSetting" :role-name="currentRole.name" @reflash="getList" />
  </div>
</template>

<script>
import { getRolesList, roleAddMember, editRole } from '@/api/role'
import Pagination from '@/components/Pagination'
import { mixin } from '@/utils/ylab-list-common'
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

      roleForm: {
        name: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },

      editRoleDialog: false,
      checkEmpList: [],
      checkDeptList: [],
      roleMemberDialog: false
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
    openEditRoleDialog(row) {
      this.currentRole = row
      this.roleForm = { name: row.name, remark: row.remark }
      this.checkEmpList = row.employees.map(item => { return { name: item.name, id: item.id } })
      this.checkDeptList = row.depts.map(item => { return { name: item.name, id: item.id } })
      this.editRoleDialog = true
    },
    editRoleHandler() {
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          let formData
          if (this.currentRole.id) {
            formData = Object.assign({}, this.roleForm, { id: this.currentRole.id })
          } else {
            formData = this.roleForm
          }
          const res = await editRole(formData)
          const roleId = res.data.id
          const res2 = await roleAddMember({
            empIds: this.checkEmpList.map(item => item.id),
            deptIds: this.checkDeptList.map(item => item.id),
            roleId
          })
          if (res2.code === 200) {
            this.editRoleDialog = false
            this.getList()
          }
        }
      })
    },
    delRole(row) {
      if ((row.employees && row.employees.length > 0) || (row.depts && row.depts.length > 0)) {
        this.$alert('请先删除角色下的部门和人员')
        return
      }
      this.$confirm('确定删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        editRole({ id: row.id, name: row.name, enable: 0 }).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message({ type: 'success', message: '删除成功' })
          }
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' })
      })
    },
    roleAddMemberHandler() {
      this.checkEmpList = this.$refs.ylabPicker.checkEmpList.filter(item => { return item.type === 2 })
      this.checkDeptList = this.$refs.ylabPicker.checkDeptList
      this.roleMemberDialog = false
    },
    editAuthorization(row) {
      this.currentRole = row
      this.$refs.roleSetting.roleId = this.currentRole.id
      this.$refs.roleSetting.init()
      this.$refs.roleSetting.editAuthorizationDialog = true
    },
    newBuild() {
      this.currentRole = {}
      this.editRoleDialog = true
      this.roleForm = {
        name: '',
        remark: ''
      }
      this.checkEmpList = []
      this.checkDeptList = []
    }
  }
}
</script>
