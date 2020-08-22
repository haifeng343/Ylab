<template>
  <div style="display: flex;">
    <!-- ------------------------------------------左--------------------------------------------------- -->
    <div class="app-container no-scrollbar" style="flex: 1; height: calc(100vh - 86px); border-right: 1px solid #DCDFE6; overflow: auto;">
      <el-tree
        :data="dept"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node" @click="getMember(data)">
          <span>{{ data.name }} ({{ data.total }})</span>
          <span v-if="data.name !== '未分配' ">
            <el-dropdown>
              <span>
                <svg-icon icon-class="more" class-name="svgMore" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="!data.companyName" @click.native="deptEdit(data)">编辑</el-dropdown-item>
                <el-dropdown-item @click.native="deptAdd(data)">新建</el-dropdown-item>
                <el-dropdown-item v-if="!data.companyName" @click.native="deptDel(data)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
      <!-- -------------------------------------编辑部门弹框------------------------------------------ -->

      <el-dialog title="编辑部门" :visible.sync="editDept" :close-on-click-modal="false" width="450px">
        <el-form ref="editForm" :model="editForm" :rules="rules" label-position="left">
          <el-form-item label="部门名称" prop="name" label-width="100px">
            <el-input v-model="editForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCancel">取 消</el-button>
          <el-button type="primary" @click="editHandle">确 认</el-button>
        </div>
      </el-dialog>
      <!-- ------------------------------------------新建部门弹框--------------------------------------- -->
      <el-dialog title="新建部门" :visible.sync="addDept" :close-on-click-modal="false" width="450px">
        <el-form ref="addForm" :model="addForm" :rules="rules" label-position="left">
          <el-form-item label="上级部门：" label-width="100px">
            <span>{{ addForm.ParentName }}</span>
          </el-form-item>
          <el-form-item label="子部门名称" prop="name" label-width="100px">
            <el-input v-model="addForm.name" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addCancel">取 消</el-button>
          <el-button type="primary" @click="addHandle">确 认</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- ---------------------------------------右--------------------------------------------------- -->
    <div class="app-container no-scrollbar" style="flex: 3; overflow: auto; height: calc(100vh - 86px);">
      <div style="display: flex; margin-bottom: 40px;">
        <el-button type="primary" @click="invite">
          <svg-icon icon-class="invite" font-size="14px" class-name="svgInvite" />
          <span style="vertical-align:middle;">邀请</span>
        </el-button>
        <el-button @click="memDialog = true">
          <svg-icon icon-class="add" font-size="14px" class-name="svgAdd" />
          <span style="vertical-align:middle;">添加</span>
        </el-button>
        <div style="flex: 1;" />
        <el-input v-model="searchLabel" placeholder="请输入用户名称快速搜索" style="width: 200px; margin-right: 15px;" />
        <el-button type="primary" @click="getMemberByName">搜索</el-button>
      </div>
      <div class="container-line-title">
        <span class="detail-subtitle">{{ selectDeptName }}</span>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        :data="memberList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="用户昵称" align="center">
          <template slot-scope="{row}">
            <span class="uName" style="cursor: pointer;" @click="$router.push(`/person?id=${row.id}`)">{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在部门" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deptName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门职位" align="center">
          <template slot-scope="{row}">
            <span>{{ row.position }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户角色" align="center">
          <template slot-scope="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" @click="memEdit(row)">
              编辑
            </el-button>
            <el-button v-if="row.roleName && row.roleName.indexOf('管理员') !== -1" type="info" disabled>
              删除
            </el-button>
            <el-dropdown v-else class="delBtn">
              <el-button type="danger">
                删除
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="row.deptName !== '未分配'" @click.native="delFromDept(row)">从部门删除</el-dropdown-item>
                <el-dropdown-item @click.native="delFromCom(row)">从企业删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getMemberhandler" />
    </div>
    <!-- ------------------------------------------从企业删除人员弹框--------------------------------- -->
    <el-dialog title="从企业删除人员" :visible.sync="deleteCom" :close-on-click-modal="false" width="550px">
      <el-form :model="delComForm">
        <div style="color:#606266;"><span style="color:#F56C6C;">该用户将从企业内部清除，</span>再次加入企业需要重新邀请。</div>
        <div v-if="contractTaskCount.contractDoingCount > 0" class="clearfix" style="display: flex; margin-top: 25px;">
          <div style="color:#303133;margin-right: 30px;">该用户有未完成项目，将责任人更换为</div>
          <el-form-item>
            <el-select v-model="delComForm.changeContractId" filterable placeholder="请选择">
              <el-option
                v-for="item in contractPerson"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="contractTaskCount.taskDoingCount > 0" class="clearfix" style="display: flex; margin-top: 10px;">
          <div style="color:#303133;margin-right: 30px;">该用户有未完成任务，将责任人更换为</div>
          <el-form-item>
            <el-select v-model="delComForm.changeTaskId" filterable placeholder="请选择">
              <el-option
                v-for="item in contractPerson"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="contractTaskCount.contractDoingCount === 0 && contractTaskCount.taskDoingCount === 0" style="margin-top: 10px;">该用户无需交接，可直接删除</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delCancel">取 消</el-button>
        <el-button type="primary" @click="delHandle">确 认</el-button>
      </div>
    </el-dialog>
    <!-- ------------------------------------------编辑人员弹框--------------------------------------- -->
    <el-dialog title="编辑人员" :visible.sync="editMember" :close-on-click-modal="false" width="550px">
      <el-form :model="memberForm" label-position="left">
        <el-form-item label="用户昵称：" label-width="100px">
          <span>{{ memberForm.name }}</span>
        </el-form-item>
        <el-form-item label="所在部门" label-width="100px">
          <div style="border: 1px solid #ccc;">
            <el-input v-model="memberForm.deptName" autocomplete="off" />
            <div class="no-scrollbar" style="border: 1px solid #ccc; border-top: none; height:200px; overflow: auto;">
              <el-tree :data="innerDept" :props="defaultProps" @node-click="handleNodeClick" />
            </div>
          </div>
        </el-form-item>
        <el-form-item label="部门职位" label-width="100px">
          <el-select v-model="memberForm.isHead" placeholder="请选择">
            <el-option :value="1" label="主管">主管</el-option>
            <el-option :value="0" label="成员">成员</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户角色" label-width="100px">
          <el-select v-model="memberForm.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editMember = false">取 消</el-button>
        <el-button type="primary" @click="memHandle">确 认</el-button>
      </div>
    </el-dialog>
    <!-- ------------------------------------------邀请外部成员弹框---------------------------- -->
    <el-dialog title="邀请外部成员加入" :visible.sync="inviteDialog" :close-on-click-modal="false" width="544px">
      <div style="color:#303133; font-size:14px; margin-bottom:16px;">将链接发送给小伙伴</div>
      <el-input v-model="message" style="width:400px;max-width:100%;" />
      <el-button type="primary" icon="el-icon-document" @click="handleCopy(message, $event)">
        复制链接
      </el-button>
      <div style="margin:24px 24px 0 0; color:#909399;font-size:12px;">被邀请的成员如无账号需要注册后加入，已有账号可在被邀请页面登录加入</div>
      <div style="margin:0 24px 0 0; color:#5370FF;font-size:14px;">窗口关闭后可在系统设置-用户管理里重新邀请</div>
    </el-dialog>
    <!-- --------------------------------人数超过50提醒弹框 ------------------------->
    <el-dialog title="邀请外部成员加入" :visible.sync="inviteLimitDialog" :close-on-click-modal="false" width="544px">
      <div style="color:#303133; line-height: 24px; font-size:16px; margin-bottom:16px;">当前团队人数已满50人，继续邀请将额外增加运维费用，请与开发团队联络 021-20787300-8033（9:00-18:00）</div>
    </el-dialog>
    <!-- --------------------------------------------添加人员弹框------------------------------ -->
    <el-dialog title="添加人员" :visible.sync="memDialog" :close-on-click-modal="false" width="660px">
      <ylab-picker v-if="memDialog" ref="ylabPicker" :tools="['emp']" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="memDialog = false">取 消</el-button>
        <el-button type="primary" @click="addMember">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import YlabPicker from '@/views/components/YlabPicker'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import { mixin } from '@/utils/ylab-list-common'
import { deepClone } from '@/utils'
import { queryDept } from '@/api/user'
import { editDeptment } from '@/api/user'
import { delDept } from '@/api/user'
import { getDeptMember } from '@/api/user'
import { getRoles } from '@/api/user'
import { editMember } from '@/api/user'
import { inviteMember } from '@/api/user'
import { deptAddMem } from '@/api/user'
import { getConTaskCount } from '@/api/user'
import { comDelMember } from '@/api/user'
import { deptDelMember } from '@/api/user'
export default {
  name: 'User',
  components: { Pagination, YlabPicker },
  mixins: [mixin],
  data() {
    return {
      rules: {
        name: [
          { required: true, min: 1, message: '部门名称不能为空', trigger: 'blur' }
        ]
      },
      dept: [],
      innerDept: [],
      searchLabel: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        deptId: undefined,
        name: ''
      },
      editDept: false,
      addDept: false,
      editForm: {
        id: undefined,
        name: ''
      },
      addForm: {
        parentId: undefined,
        ParentName: '',
        name: ''
      },
      delComForm: {
      // 准备删除人员的id
        id: undefined,
        changeContractId: undefined,
        changeTaskId: undefined
      },
      // 部门成员
      memberList: [],
      // 右侧展示的部门
      selectDeptName: '',
      selectDeptId: undefined,
      companyName: '',
      companyId: '',
      roles: [],
      memberForm: {
        name: '',
        deptId: undefined,
        deptName: '',
        isHead: undefined,
        roleIds: []
      },
      editMember: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inviteDialog: false,
      inviteLimitDialog: false,
      message: '',
      memDialog: false,

      deleteCom: false,
      contractPerson: [],
      contractTaskCount: {}
    }
  },
  created() {
    // this.getList()
    this.getMemberhandler()
    queryDept().then(res => {
      this.dept = [res.data]
      this.innerDept = res.data.children
      this.selectDeptName = res.data.name
      this.selectDeptId = res.data.id
      this.companyName = res.data.name
      this.companyId = res.data.id
    })
  },
  methods: {
    getList() {
      queryDept().then(res => {
        this.dept = [res.data]
        this.innerDept = res.data.children
        // this.dept.push(res.data)
      })
    },
    getMemberhandler() {
      getDeptMember(this.listQuery).then(res => {
        this.memberList = res.data.list
        this.total = res.data.total
        // this.selectDeptName = this.memberList[0].deptName
        // this.selectDeptId = this.memberList[0].deptId
      })
    },
    getRolesHandle() {
      getRoles({ pageNo: 1, pageSize: 9999 }).then(res => {
        this.roles = res.data.list.map(item => {
          return { name: item.name, id: item.id }
        })
      })
    },
    // 编辑部门
    deptEdit(data) {
      this.editDept = true
      this.getList()
      this.editForm.id = data.id
      this.editForm.name = data.name
    },
    editHandle() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.editDept = false
        editDeptment(this.editForm).then(res => {
          if (res.code === 200) {
            this.getList()
          }
        })
      })
    },
    editCancel() {
      this.editDept = false
      this.$refs.editForm.resetFields()
    },
    // 新建部门
    deptAdd(data) {
      this.addDept = true
      this.addForm.parentId = data.id
      this.addForm.ParentName = data.name
    },
    addHandle() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.addDept = false
        editDeptment(this.addForm).then(res => {
          if (res.code === 200) {
            this.getList()
            this.addForm.name = ''
          }
        })
      })
    },
    addCancel() {
      this.addDept = false
      this.$refs.addForm.resetFields()
    },
    // 删除部门
    deptDel(data) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delDept({ id: data.id }).then(res => {
          if (res.code === 200) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取部门成员
    getMember(data) {
      this.selectDeptName = data.name
      this.selectDeptId = data.id
      this.listQuery.deptId = data.id
      this.listQuery.name = ''
      this.getMemberhandler()
    },
    // 根据名字搜索成员
    getMemberByName() {
      this.selectDeptName = this.companyName
      this.listQuery.deptId = this.companyId
      this.listQuery.name = this.searchLabel
      this.getMemberhandler()
    },
    // 编辑成员
    memEdit(row) {
      this.memberForm = deepClone(row)
      this.editMember = true
      if (this.memberForm.roleIds) {
        this.memberForm.roleIds = this.memberForm.roleIds.split(',').map(item => {
          return parseInt(item)
        })
      }
      this.getRolesHandle()
    },
    memHandle() {
      this.memberForm.roleIds = this.memberForm.roleIds.toString()
      editMember(this.memberForm).then(res => {
        if (res.code === 200) {
          this.editMember = false
          this.listQuery.deptId = this.memberForm.deptId
          this.selectDeptName = this.memberForm.deptName
          this.getMemberhandler()
          this.getList()
        }
      })
    },
    handleNodeClick(data) {
      this.memberForm.deptId = data.id
      this.memberForm.deptName = data.name
    },
    // 从部门删除人员
    delFromDept(row) {
      this.$confirm('删除后该用户将显示在【未分配】列表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deptDelMember({ id: row.id, deptId: row.deptId }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.listQuery.deptId = row.deptId
            this.getMemberhandler()
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 从企业删除人员
    delFromCom(row) {
      this.deleteCom = true
      this.delComForm.id = row.id
      getConTaskCount({ id: row.id }).then(res => {
        this.contractTaskCount = res.data
      })
      getDeptMember().then(res => {
        this.contractPerson = res.data.list
      })
    },
    delHandle() {
      if (this.contractTaskCount.contractDoingCount > 0 || this.contractTaskCount.taskDoingCount > 0) {
        if (this.contractTaskCount.contractDoingCount > 0 && !this.delComForm.changeContractId) {
          this.$message.warning('请填写项目责任人')
          return
        }
        if (this.contractTaskCount.taskDoingCount > 0 && !this.delComForm.changeTaskId) {
          this.$message.warning('请填写任务责任人')
          return
        }
        if (this.contractTaskCount.contractDoingCount > 0 && this.contractTaskCount.taskDoingCount > 0 && !this.delComForm.changeTaskId) {
          this.$message.warning('请填写任务责任人')
          return
        }
        if (this.contractTaskCount.contractDoingCount > 0 && this.contractTaskCount.taskDoingCount > 0 && !this.delComForm.changeContractId) {
          this.$message.warning('请填写项目责任人')
          return
        }
      }
      comDelMember(this.delComForm).then(res => {
        if (res.code === 200) {
          this.deleteCom = false
          this.delComForm = {
            id: undefined,
            changeContractId: undefined,
            changeTaskId: undefined
          }
          this.getMemberhandler()
          this.getList()
        }
      })
    },
    delCancel() {
      this.deleteCom = false
      this.delComForm = {
        id: undefined,
        changeContractId: undefined,
        changeTaskId: undefined
      }
    },
    handleCopy(text, event) {
      clip(text, event)
      this.inviteDialog = false
    },
    invite() {
      if (this.total > 50) {
        this.inviteLimitDialog = true
      } else {
        this.inviteDialog = true
        inviteMember().then(res => {
          this.message = res.data
        })
      }
    },
    addMember() {
      const memberListId = this.$refs.ylabPicker.checkEmpList
        .filter(item => {
          return item.type === 2
        }).map(item => item.id)
      if (memberListId.length !== 0) {
        deptAddMem({ id: memberListId, deptId: this.selectDeptId }).then(res => {
          if (res.code === 200) {
            this.memDialog = false
            this.getMemberhandler()
            this.getList()
          }
        })
      } else {
        this.$message({
          message: '人员不能为空',
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .delBtn.el-dropdown {
    margin-left: 10px;
  }
  .el-table :hover.uName {
    color: #4A90E2 !important;
  }
</style>
<style lang="scss" scoped>
  .svgMore {
    display: none;
  }
  .el-tree-node__content:hover .svgMore {
    display: block;
  }
</style>
