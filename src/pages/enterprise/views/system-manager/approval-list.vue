<template>
  <div class="app-container">
    <div class="container-line-item">
      <el-button class="container-line-button" type="primary" style="margin-bottom: 20px;" @click="newPermission">新建</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" border style="width: 100%">
      <el-table-column label="审批名称" width="240">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批说明">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应用流程" width="240">
        <template slot-scope="{row}">
          <div>{{ row.formName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="应用类型">
        <template slot-scope="{row}">
          <div>{{ row.typeNames }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="editPermission(row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deletePermission(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- -----------------------------------新建审批----------------------------- -->
    <el-dialog :title="titleContent === 'new' ? '新建审批' : '编辑审批' " :visible.sync="newPermit" :close-on-click-modal="false" width="660px" @close="popCancel('popForm')">
      <el-form ref="popForm" class="mgb" :model="popForm" :rules="rules" label-position="left">
        <div style="display: flex;">
          <div style="flex:5;">
            <el-form-item label="审批名称" prop="name" label-width="78px">
              <el-input v-model="popForm.name" placeholder="请输入审批名称" />
            </el-form-item>
            <el-form-item class="select" label="应用流程" prop="formId" label-width="78px">
              <el-select v-model="popForm.formId" filterable clearable placeholder="请选择应用流程" @change="changeProcess">
                <el-option v-for="(item,index) in processList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item class="select" label="应用类型" prop="typeIds" label-width="78px">
              <el-select v-model="typeIds" multiple filterable placeholder="请选择应用类型">
                <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </div>
          <div style="flex:1;" />
          <div style="flex:5;">
            <el-form-item label="审批说明" label-width="78px">
              <el-input v-model="popForm.remark" type="textarea" :rows="7" placeholder="简要说明审批流" />
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;">
          <span style="color: red; margin-top: 10px;margin-right: 4px;">*</span>
          <el-form-item label="审批流" label-width="72px">
            <!-- <span>
              <el-tag v-for="(node, index) in popForm.nodeList" :key="index" type="primary" size="medium" closable style="cursor: pointer;">{{ node.name }}</el-tag>
              <svg-icon v-if="popForm.nodeList.length" icon-class="arrow" style="font-size: 40px; " />
            </span> -->
            <span v-for="(item, transitIndex) in transit" :key="transitIndex">
              <el-tag
                v-for="(node, nodeIndex) in item.referIds"
                :key="nodeIndex"
                type="primary"
                closable
                style="cursor: pointer;margin-left: 3px;"
                @close="closeHandle(transit, transitIndex, item, nodeIndex)"
                @click="nodeHandle(transit, transitIndex, item, nodeIndex)"
              >
                <span>
                  <svg-icon v-if="item.type===2" icon-class="role" style="font-size: 16px;" />
                  <svg-icon v-else-if="item.type===3" icon-class="person" style="font-size: 16px;" />
                  {{ node.name }}
                </span>
              </el-tag>
              <svg-icon icon-class="arrow" style="font-size: 40px; " />
            </span>
            <el-tag type="info" size="medium" plain style="cursor: pointer;" @click="addNode">+ 添加节点</el-tag>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="popCancel('popForm')">取 消</el-button>
        <el-button type="primary" @click="popSubmit('popForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择角色成员"
      :visible.sync="editRoleDialog"
      width="660px"
      class="role"
      :close-on-click-modal="false"
    >
      <div><el-radio v-model="chooseTop" label="1">选择员工上级</el-radio></div>
      <div style="margin: 10px 0;"><el-radio v-model="chooseTop" label="2">其他</el-radio></div>
      <ylab-picker
        v-if="chooseTop !== '1' && editRoleDialog"
        ref="ylabPicker"
        :tools="['emp', 'role']"
        :default-emp-list="defaultEmpList"
        :default-role-list="defaultRoleList"
        :is-radio="isRadio"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRoleHandle">取 消</el-button>
        <el-button type="primary" @click="editRoleHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import YlabPicker from '@/views/components/YlabPicker'
import { fetchTypeList } from '@/api/form'
import { getPermitList, getProcess, editPermit, delPermit, getPermit } from '@/api/permission'
import { roleAddMember } from '@/api/role'
import { Transfer } from 'element-ui'
export default {
  name: 'ApprovalList',
  components: {
    YlabPicker
  },
  data() {
    return {
      listLoading: false,
      list: null,
      newPermit: false,
      // 应用类型
      code: 'buy_order',
      typeList: [],
      typeIds: [],
      // 应用流程
      processList: [],
      popForm: {
        name: '',
        formId: '',
        typeIds: '',
        remark: '',
        nodeList: []
      },
      transit: [],
      rules: {
        name: [{ required: true, message: '请输入审批名称', trigger: 'blur'}],
        formId: [{ required: true, message: '请输入应用流程', trigger: 'blur'}],
        typeIds: [{ required: true, message: '请输入应用流程', trigger: 'blur'}]
      },
      // 角色成员弹框
      editRoleDialog: false,
      chooseTop: '2',
      currentRole: {},
      defaultEmpList: [],
      defaultRoleList: [],
      // 判断是新建还是编辑  新建：'' 编辑： level
      nodeLabel: '',
      isRadio: true,
      titleContent: ''
    }
  },
  created() {
    this.getList()
    getProcess({ pageNo: 1, pageSize: 1000, hasProgress: 1 }).then((res) => {
      this.processList = res.data.list
    })
    this.getTypeList()
  },
  methods: {
    getList() {
      getPermitList({ pageNo: 1, pageSize: 1000 }).then((res) => {
        this.list = res.data.list
      })
    },
    getTypeList() {
      fetchTypeList({ code: this.code, pageNo: 1, pageSize: 1000 }).then(res => {
        this.typeList = res.data.list
      })
    },
    changeProcess(e) {
      this.typeIds = []
      this.processList.forEach((value,index) => {
        if (e === value.id) {
          this.code = value.code
          this.getTypeList()
        }
      })
    },
    newPermission() {
      this.titleContent = 'new'
      this.popForm = {
        name: '',
        formId: undefined,
        typeIds: '',
        remark: '',
        nodeList: []
      }
      this.newPermit = true
    },
    popSubmit(formcount) {
      let submitTransit = this.transit.map((item,index) => {
        if (item.type === 1) {
          return {
            level: index,
            type: item.type
          }
        } else {
          return {
            level: index,
            type: item.type,
            referIds: item.referIds.map(item => item.id).join(',')
          }
        }
      })
      this.popForm.typeIds = this.typeIds.join(',')
      this.popForm.nodeList = submitTransit
      this.$refs[formcount].validate((valid) => {
        if (!valid) {
          return false
        } else if (this.popForm.nodeList.length === 0) {
          this.$message.error('至少添加一个审批节点')
          return false
        } else {
          editPermit(this.popForm).then((res) => {
            if (res.code === 200) {
              this.newPermit = false
              this.$nextTick(() => {
                this.popForm = {
                  name: '',
                  formId: undefined,
                  typeIds: '',
                  remark: '',
                  nodeList: []
                }
                this.typeIds = []
                this.transit = []
                this.getList()
              })
            }
          })
        }
      })
    },
    popCancel() {
      this.newPermit = false
      this.popForm = {
        name: '',
        formId: undefined,
        typeIds: '',
        remark: '',
        nodeList: []
      }
      this.typeIds = []
      this.transit = []
    },
    addNode() {
      this.chooseTop = '2'
      this.nodeLabel = ''
      this.editRoleDialog = true
    },
    cancelRoleHandle() {
      this.editRoleDialog = false
      // if (this.chooseTop === '2') {
      //   this.$refs.ylabPicker.checkEmpList = []
      //   this.$refs.ylabPicker.checkRoleList = []
      // }
      this.defaultEmpList = []
      this.defaultRoleList = []
    },
    editRoleHandler() {
      if (this.nodeLabel === '') {
        if ( this.chooseTop === '1') {
          this.transit.push({
            level: this.transit.length,
            type: 1,
            referIds: [{ name: '上级' }]
          })
        } else {
          let checkEmpList = this.$refs.ylabPicker.checkEmpList.filter(item => { return item.type === 2 })
          let checkRoleList = this.$refs.ylabPicker.checkRoleList
          if (checkEmpList.length > 0) {
            this.transit.push({
              level: this.transit.length,
              type: 3,
              referIds: checkEmpList.map(item => { return { id: item.id, name: item.name } })
            })
          } else if (checkRoleList.length > 0) {
            this.transit.push({
              level: this.transit.length,
              type: 2,
              referIds: checkRoleList.map(item => { return { id: item.id, name: item.name } })
            })
          } else {
            this.$message.error('请选择审批流')
            return
          }
          // this.$refs.ylabPicker.checkEmpList = []
          // this.$refs.ylabPicker.checkRoleList = []
        }
      } else {
        if (this.chooseTop === '1') {
          this.transit.splice(this.nodeLabel, 1, { level: this.nodeLabel, type: 1, referIds: [{ name: '上级' }] })
        } else {
          if (this.$refs.ylabPicker.checkEmpList.length > 0) {
            this.transit.splice(this.nodeLabel, 1,{
              level: this.nodeLabel,
              type: 3,
              referIds: this.$refs.ylabPicker.checkEmpList.filter(item => { return item.type === 2 }).map(item => { return { id: item.id, name: item.name } })
            })
          } else if (this.$refs.ylabPicker.checkRoleList.length > 0) {
            this.transit.splice(this.nodeLabel, 1,{
              level: this.nodeLabel,
              type: 2,
              referIds: this.$refs.ylabPicker.checkRoleList.map(item => { return { id: item.id, name: item.name } })
            })
          } else {
            this.$message.error('请选择审批流')
            return
          }
        }
      }
      this.editRoleDialog = false
      this.defaultEmpList = []
      this.defaultRoleList = []
    },
    closeHandle(transit, transitIndex, item, nodeIndex) {
      if (item.type === 1) {
        transit.splice(transitIndex, 1)
      } else {
        if (item.referIds.length > 1) {
          item.referIds.splice(nodeIndex, 1)
        } else {
          transit.splice(transitIndex, 1)
        }
      }
    },
    nodeHandle(transit, transitIndex, item, nodeIndex) {
      this.nodeLabel = transitIndex
      this.editRoleDialog = true
      this.chooseTop = '2'
      if (item.type === 3) {
        this.defaultEmpList = item.referIds.map(item => {
          return { id: Number(item.id), name: item.name }
        })
        this.defaultRoleList = []
      } else if (item.type === 2) {
        this.defaultRoleList = item.referIds.map(item => {
          return { id: Number(item.id), name: item.name }
        })
        this.defaultEmpList = []
      } else {
        this.chooseTop = '1'
      }
    },
    // 删除审批流
    deletePermission(id) {
      this.$confirm('确定要删除吗，该操作不可恢复！', '删除审批', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPermit({id}).then(res => {
          if (res.code === 200) {
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
    // 编辑审批流
    editPermission(id) {
      this.titleContent = 'edit'
      getPermit({id}).then((res) => {
        this.popForm = res.data
        this.newPermit = true
        this.processList.forEach((value,index) => {
          if (this.popForm.formId === value.id) {
            this.code = value.code
            this.getTypeList()
          }
        })
        this.popForm.typeIds.split(',').map(item => {
          this.typeIds.push(Number(item))
        })
        this.popForm.nodeList.forEach(item => {
          if (item.type === 1) {
            item.referIds = [{ name: '上级' }]
          } else {
            item.referIds = item.referIds.split(',')
            item.referNames = item.referNames.split(',')
           let transfer = []
            for( let index in item.referIds) {
              transfer.push({ id: item.referIds[index], name: item.referNames[index]})
            }
            item.referIds = transfer
          }
        })
        this.transit = this.popForm.nodeList
      })
    }
  }
}
</script>
<style lang="scss">
  .select .el-select {
    width: 100%;
  }
  .role .el-dialog {
    margin-top: 8vh !important;
  }
  .role .el-dialog__body {
    height: 487px;
  }
  .mgb .el-form-item--small.el-form-item {
    margin-bottom: 23px;
  }
</style>
