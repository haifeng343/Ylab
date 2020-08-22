<template>
  <div v-loading="listLoading" class="flow-tree">
    <!-- ------------------------新建实验---------------------- -->
    <el-dialog :title="experimentTitle === 'newExperiment' ? ' 新建实验' : (experimentTitle === 'editExperiment' ? '编辑实验' : '实验详情')" :visible.sync="projectDialog" :close-on-click-modal="false" width="1200px" @close="projectDialog = false; showEdit = false">
      <div style="height: 600px; overflow-y: auto;overflow-x: hidden;">
        <div v-if="!showEdit" class="app-container">
          <div class="container-standard">
            <div class="container-line-title">
              <span class="detail-title" style="width: calc(100% - 460px)">【{{ projectData.taskNo }}】{{ projectData.name }}</span>
              <el-button v-if="buttonPermissions.includes(processTree) || buttonPermissions.includes(experimentEdit)" class="container-line-button" type="primary" @click="showEdit = true; experimentTitle = 'editExperiment'">
                编辑
              </el-button>
            </div>
            <div class="container-line-item">
              <span class="detail-form-item">
                <span class="detail-form-name">类型：</span>
                <span class="detail-form-value">{{ projectData.typeName }}</span>
              </span>
              <span class="detail-form-item">
                <span class="detail-form-name">负责部门：</span>
                <span class="detail-form-value">{{ projectData.deptName }}</span>
              </span>
              <!-- <span class="detail-form-item">
                <span class="detail-form-name">负责人：</span>
                <span class="detail-form-value">{{ projectData.curName }}</span>
              </span> -->
              <span class="detail-form-item">
                <span class="detail-form-name">计划开始：</span>
                <span class="detail-form-value">{{ projectData.planStartTime }}</span>
              </span>
              <span class="detail-form-item">
                <span class="detail-form-name">计划结束：</span>
                <span class="detail-form-value">{{ projectData.planEndTime }}</span>
              </span>
            </div>
            <div class="container-line-item" style="margin-bottom: 0;">
              <span v-for="column in experimentColumnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
                <span class="detail-form-name">{{ column.name }}：</span>
                <span class="detail-form-value">{{ projectData.formData[column.code] }}</span>
              </span>
            </div>
          </div>
          <div class="container-standard">
            <div class="container-line-title">
              <span class="detail-subtitle">详情内容</span>
            </div>
            <div class="flex" style="font-size: 14px;">
              <div>描述：</div>
              <div v-if="projectData.content" style="width:50%; font-size: 14px;" v-html="projectData.content" />
              <div v-else style="color: #909399;">未输入详情描述</div>
            </div>
            <div class="flex">
              <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
              <file-link-list :value="projectData.files" style="margin-top: 6px;" />
            </div>
          </div>
        </div>
        <experiment-establish v-if="showEdit" ref="experiment" :edit-data.sync="projectData" :column-list="experimentColumnList" :no-sticky="'noSticky'" @changeExperimentValidate="changeExperimentValidate" />
      </div>
      <span v-if="buttonPermissions.includes(processTree)" slot="footer" class="dialog-footer">
        <el-button type="danger" @click="projectDialog = false; showEdit = false">取消</el-button>
        <el-button type="primary" @click="submitProject">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="taskTitle === 'buildTask' ? ' 新建任务' : (taskTitle === 'taskEdit' ? '编辑任务' : '任务详情')" :visible.sync="taskDialog" :close-on-click-modal="false" width="1200px" @close="showTaskEdit = false; taskDialog = false">
      <div style="height: 600px; overflow-y: auto;overflow-x: hidden;">
        <div v-if="!showTaskEdit" class="app-container">
          <div class="container-standard">
            <div class="container-line-title">
              <span class="detail-title" style="width: calc(100% - 460px)">【{{ taskData.taskNo }}】{{ taskData.name }}</span>
              <el-button v-if="buttonPermissions.includes(processTree) || buttonPermissions.includes(enterpriseTaskEdit)" class="container-line-button" type="primary" @click="showTaskEdit = true; taskTitle = 'taskEdit' ">
                编辑
              </el-button>
            </div>
            <div class="container-line-item">
              <span class="detail-form-item">
                <span class="detail-form-name">类型：</span>
                <span class="detail-form-value">{{ taskData.typeName }}</span>
              </span>
              <span class="detail-form-item">
                <span class="detail-form-name">负责人：</span>
                <span class="detail-form-value">{{ taskData.curName }}</span>
              </span>
              <span class="detail-form-item">
                <span class="detail-form-name">计划开始：</span>
                <span class="detail-form-value">{{ taskData.planStartTime }}</span>
              </span>
              <span class="detail-form-item">
                <span class="detail-form-name">计划结束：</span>
                <span class="detail-form-value">{{ taskData.planEndTime }}</span>
              </span>
            </div>
            <div class="container-line-item" style="margin-bottom: 0;">
              <span v-for="column in experimentColumnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
                <span class="detail-form-name">{{ column.name }}：</span>
                <span class="detail-form-value">{{ taskData.formData[column.code] }}</span>
              </span>
            </div>
          </div>
          <div class="container-standard">
            <div class="container-line-title">
              <span class="detail-subtitle">详情内容</span>
            </div>
            <div class="flex" style="font-size: 14px;">
              <div>描述：</div>
              <div v-if="taskData.content" style="width:50%; font-size: 14px;" v-html="taskData.content" />
              <div v-else style="color: #909399;">未输入详情描述</div>
            </div>
            <div class="flex">
              <div class="detail-form-value" style="margin-top: 6px; margin-right: 8px;">附件：</div>
              <file-link-list :value="taskData.files" style="margin-top: 6px;" />
            </div>
          </div>
        </div>
        <task-establish v-if="showTaskEdit" ref="task" :edit-data.sync="taskData" :column-list="taskColumnList" :no-sticky="'noSticky'" @changeTaskValidate="changeTaskValidate" />
      </div>
      <span v-if="buttonPermissions.includes(processTree)" slot="footer" class="dialog-footer">
        <el-button type="danger" @click="taskDialog = false; showTaskEdit = false">取消</el-button>
        <el-button type="primary" @click="submitTask">提交</el-button>
      </span>
    </el-dialog>
    <div v-if="source.length>0" class="topBtn" style="margin-bottom: 8px;">
      <span v-if="loading" style="font-size: 14px">
        <i class="el-icon-loading" />
        保存中
      </span>
      <span v-else style="font-size: 14px">
        <svg-icon style="color: #38C4BF; font-size: 16px;" icon-class="gou" />
        已保存
      </span>
      <span style="height: 30px;" />
      <el-button v-if="buttonPermissions.includes(processTree) && canjoin" class="container-line-button" type="primary" @click="joinParty">
        并行
      </el-button>
      <el-button v-if="buttonPermissions.includes(processTree) && !canjoin" class="container-line-button" type="info" disabled>
        并行
      </el-button>
      <el-button v-if="buttonPermissions.includes(processTree) && canLeave" class="container-line-button" type="primary" plain @click="leaveParty">
        删除并行
      </el-button>
      <el-button v-if="buttonPermissions.includes(processTree) && canLeave" class="container-line-button" type="info" plain disabled>
        删除并行
      </el-button>
      <el-button v-if="buttonPermissions.includes(processTree) && needApprove && period.status===2" class="container-line-button" type="primary" @click="approveProcessHandler">
        提交审核
      </el-button>
      <el-button v-if="canSave" class="container-line-button" type="primary" @click="sendTemplate">
        保存为模板
      </el-button>
      <el-button v-else type="info" class="container-line-button" disabled>
        保存为模板
      </el-button>
    </div>
    <div v-else>
      <el-button v-if="buttonPermissions.includes(processTree)" type="primary" plain @click="newExperiment(0)">新建实验</el-button>
    </div>
    <div v-if="source.length>0" style="border: 1px solid #E4E7ED; border-bottom: none; font-size: 0;">
      <div class="header">
        <div style="flex: 0 0 16px;" />
        <div style="flex: 0 0 58px;" />
        <div style="flex: 0 0 22px;" />
        <div style="flex: 0 0 16px;" />
        <div class="is-center" style="flex: 0 0 70px;">状态</div>
        <div style="flex-grow: 1;">名称</div>
        <div class="is-center" style="flex: 0 0 70px;">操作</div>
      </div>
      <draggable v-model="source" v-bind="dragOptions" handle=".handle" draggable=".draggable" @change="dragHandler">
        <transition-group type="transition" group="top" :name="notDrag?'':'flip-list'" style="width: 100%;">
          <div v-for="(projectGroup, index) in source" ref="projectGroup" :key="projectGroup[0].id" class="project-group" :class="{draggable: buttonPermissions.includes(processTree) && period.status!==1 && projectGroup[0].status===0 && !projectGroup[0].canStart}">
            <div v-if="projectGroup.length>1" class="project-group-line" />
            <flow-tree-project
              v-for="(project, projectIndex) in projectGroup"
              :key="project.id"
              :project="projectGroup[projectIndex]"
              :project-index="projectIndex"
              :project-group="projectGroup"
              :project-group-index="index"
              :period="period"
              :selected="selected"
              :not-drag="notDrag"
              @checkItem="checkItem"
              @dragged="taskDragHandler"
              @newExperiment="newExperiment"
              @delExperiment="delExperimentHandler"
              @delTask="delTaskHandler"
              @newTask="taskNew"
              @taskDetail="taskEdit"
              @experimentDetail="experimentDetail"
              @changeListStatus="$emit('changeListStatus')"
            />
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import FileLinkList from '@/views/components/FileLinkList'
import FlowTreeProject from './FlowTreeProject'
import { fetchColumnList } from '@/api/form'
import { approveProcess, periodTemplate } from '@/api/period'
import { editExperiment, experimentEditTree, experimentFetchList, fetchDetail, deleteExperiment } from '@/api/experiment'
import { editTask, taskEditTree, deleteTask, fetchDetail as fetchTaskDetail } from '@/api/task'
import ExperimentEstablish from '@/pages/enterprise/views/task-manager/components/experimentEstablish'
import TaskEstablish from '@/pages/enterprise/views/task-manager/components/TaskEstablish'
import { getProcessDetail } from '@/api/permission'
import { deepClone } from '@/utils'
export default {
  name: 'FlowTree',
  components: {
    draggable,
    FlowTreeProject,
    ExperimentEstablish,
    TaskEstablish,
    FileLinkList
  },
  props: {
    contractId: {
      type: String,
      default: ''
    },
    periodId: {
      type: Number,
      default: 0
    },
    period: {
      type: Object,
      default: () => {}
    },
    needApprove: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      listLoading: false,
      targetExperimentPosition: 0,
      targetTaskPosition: {},
      showEdit: false,
      showTaskEdit: false,
      projectDialog: false,
      projectData: {
        name: '',
        periodId: this.periodId,
        typeId: '',
        deptId: '',
        planStartTime: '',
        planEndTime: '',
        // 富文本编辑框内容
        content: '',
        formData: {},
        files: ''
      },
      // 实验新建编辑表单校验
      experimentValidate: false,
      // 任务新建编辑表单校验
      taskValidate: false,
      // 自定义字段
      experimentColumnList: [],
      taskDialog: false,
      experimentTitle: '',
      taskTitle: '',
      taskData: {
        name: '',
        experimentId: '',
        typeId: '',
        curId: '',
        planStartTime: '',
        planEndTime: '',
        formData: {},
        content: '',
        files: ''
      },
      // 自定义字段
      taskColumnList: [],

      notDrag: false,
      source: [],
      selected: {
        sources: [], // { source: {}, inParty: false, myMap: { groupIndex, index }, projectMap: { projectGroupIndex, projectIndex } }
        projectId: '',
        type: '' // project, task
      },
      canSave: false
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    canjoin() {
      for (let i = 0; i < this.selected.sources.length; i++) {
        if (this.selected.sources[i].source.status !== 0 || this.selected.sources[i].source.canStart) {
          return false
        }
      }
      if (this.selected.sources.length < 2) {
        return false
      } else {
        return true
      }
    },
    canLeave() {
      for (let i = 0; i < this.selected.sources.length; i++) {
        if (this.selected.sources[i].source.status !== 0 || !this.selected.sources[i].inParty || this.selected.sources[i].source.canStart) {
          return false
        }
      }
      if (this.selected.sources.length > 0) {
        return true
      } else {
        return false
      }
    },
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    processTree() {
      return this.buttonPermission[this.platform].processTree
    },
    experimentEdit() {
      return this.buttonPermission[this.platform].experimentEdit
    },
    enterpriseTaskEdit() {
      return this.buttonPermission[this.platform].enterpriseTaskEdit
    }
  },
  created() {
    this.getList()
    fetchColumnList({ code: 'experiment' }).then(response => {
      this.experimentColumnList = response.data.list
      this.experimentColumnList.forEach(element => {
        this.$set(this.projectData.formData, element.id, '')
      })
    })
    fetchColumnList({ code: 'task' }).then(response => {
      this.taskColumnList = response.data.list
      this.taskColumnList.forEach(element => {
        this.$set(this.taskData.formData, element.id, '')
      })
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      this.source = []
      experimentFetchList({ periodId: this.periodId, pageNo: 1, pageSize: 1000 }).then(res => {
        let projectList = res.data.list
        projectList = projectList.filter(item => {
          return item.level || item.level === 0 || item.level === '0'
        }).map(item => {
          return Object.assign(item, { level: parseInt(item.level) })
        })
        projectList.sort((a, b) => {
          return a.level - b.level
        })
        for (let i = 0; i < projectList.length; i++) {
          if (i === 0) {
            this.source.push([{
              id: projectList[i].id,
              name: projectList[i].name,
              status: projectList[i].status,
              canStart: projectList[i].canStart,
              isShow: projectList[i].isShow,
              children: [],
              exception: projectList[i].exception,
              contractException: projectList[i].contractException,
              taskException: projectList[i].taskException
            }])
          } else {
            if (projectList[i - 1].level === projectList[i].level) {
              this.source[this.source.length - 1].push({
                id: projectList[i].id,
                name: projectList[i].name,
                status: projectList[i].status,
                canStart: projectList[i].canStart,
                isShow: projectList[i].isShow,
                children: [],
                exception: projectList[i].exception,
                contractException: projectList[i].contractException,
                taskException: projectList[i].taskException
              })
            } else {
              this.source.push([{
                id: projectList[i].id,
                name: projectList[i].name,
                status: projectList[i].status,
                canStart: projectList[i].canStart,
                isShow: projectList[i].isShow,
                children: [],
                exception: projectList[i].exception,
                contractException: projectList[i].contractException,
                taskException: projectList[i].taskException
              }])
            }
          }
        }
        this.listLoading = false
        this.getCanSave()
      })
    },
    approveProcessHandler(event) {
      // for (let projectGroupIndex = 0; projectGroupIndex < this.source.length; projectGroupIndex++) {
      //   const projectGroup = this.source[projectGroupIndex]
      //   for (let projectIndex = 0; projectIndex < projectGroup.length; projectIndex++) {
      //     const project = projectGroup[projectIndex]
      //     if (!project.children || project.children.length === 0) {
      //       this.$alert(`“${project.name}”未添加任务，无法提交审核`)
      //       return
      //     }
      //   }
      // }
      approveProcess({ id: this.period.id, status: 4 }).then(res => {
        if (res.code === 200) {
          this.$message.success('提交审核成功，请等待审核')
          this.period.status = 1
        }
      })
    },
    delTaskHandler(event) {
      this.$confirm('即将删除任务，确认删除吗？', '删除任务', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask({ id: event.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            const projectSource = this.source[event.projectGroupIndex][event.projectIndex].children
            if (projectSource[event.taskGroupIndex].length === 1) {
              projectSource.splice(event.taskGroupIndex, 1)
            } else {
              projectSource[event.taskGroupIndex].splice(event.taskIndex, 1)
            }
            this.save(projectSource, 'task')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    taskNew(event) {
      this.targetTaskPosition = event.position
      this.taskData = {
        name: '',
        experimentId: event.experimentId,
        tid: this.contractId,
        typeId: '',
        curId: '',
        planStartTime: '',
        planEndTime: '',
        formData: {},
        content: '',
        files: ''
      }
      this.taskTitle = 'buildTask'
      this.taskDialog = true
      this.showTaskEdit = true
    },
    taskEdit(event) {
      this.targetTaskPosition = event.position
      fetchTaskDetail({ id: event.id }).then(res => {
        this.taskData = {
          id: res.data.task.id,
          status: res.data.task.status,
          taskNo: res.data.task.taskNo,
          name: res.data.task.name,
          experimentId: res.data.experiment.id,
          typeId: res.data.task.typeId,
          typeName: res.data.task.typeName,
          curId: res.data.task.curId,
          curName: res.data.task.curName,
          planStartTime: res.data.task.planStartTime,
          planEndTime: res.data.task.planEndTime,
          formData: JSON.parse(res.data.task.formData),
          content: res.data.task.content,
          files: res.data.task.files
        }
        this.taskTitle = 'detailTask'
        this.taskDialog = true
      })
    },
    changeTaskValidate() {
      this.taskValidate = true
    },
    async submitTask() {
      await this.$refs.task.handleSubmit()
      if (!this.taskValidate) {
        return
      } else {
        const postData = deepClone(this.taskData)
        postData.formData = JSON.stringify(this.taskData.formData)
        editTask(postData).then(res => {
          if (res.code === 200) {
            const projectSource = this.source[this.targetTaskPosition.projectGroupIndex][this.targetTaskPosition.projectIndex].children
            if (this.taskData.id) {
              const task = projectSource[this.targetTaskPosition.taskGroupIndex][this.targetTaskPosition.taskIndex]
              task.name = res.data.name
              this.$message.success('修改成功')
            } else {
              projectSource.splice(this.targetTaskPosition.taskPosition, 0, [{
                id: res.data.id,
                name: res.data.name,
                status: res.data.status
              }])
              this.save(projectSource, 'task')
              this.$message.success('新增成功')
            }
          }
        })
        this.taskDialog = false
        this.showTaskEdit = false
        this.taskValidate = false
      }
    },
    delExperimentHandler(event) {
      this.$confirm('此操作将永久删除该实验, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteExperiment({ id: event.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if (this.source[event.projectGroupIndex].length === 1) {
              this.source.splice(event.projectGroupIndex, 1)
            } else {
              this.source[event.projectGroupIndex].splice(event.projectIndex, 1)
            }
            this.save(this.source, 'project')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    newExperiment(event) {
      this.targetExperimentPosition = event
      this.projectData = {
        name: '',
        periodId: this.periodId,
        tid: this.contractId,
        typeId: '',
        deptId: '',
        planStartTime: '',
        planEndTime: '',
        content: '',
        formData: {},
        files: ''
      }
      this.experimentTitle = 'newExperiment'
      this.projectDialog = true
      this.showEdit = true
    },
    experimentDetail(event) {
      this.targetExperimentPosition = event.position
      fetchDetail({ id: event.id }).then(res => {
        this.projectData = {
          id: res.data.experiment.id,
          status: res.data.experiment.status,
          taskNo: res.data.experiment.taskNo,
          periodId: res.data.experiment.periodId,
          name: res.data.experiment.name,
          typeId: res.data.experiment.typeId,
          typeName: res.data.experiment.typeName,
          deptId: res.data.experiment.deptId,
          deptName: res.data.experiment.deptName,
          planStartTime: res.data.experiment.planStartTime,
          planEndTime: res.data.experiment.planEndTime,
          content: res.data.experiment.content,
          formData: JSON.parse(res.data.experiment.formData),
          files: res.data.experiment.files,
          level: res.data.experiment.level
        }
        this.experimentTitle = 'experimentDetail'
        this.projectDialog = true
      })
    },
    changeExperimentValidate() {
      this.experimentValidate = true
    },
    async submitProject() {
      await this.$refs.experiment.handleSubmit()
      if (!this.experimentValidate) {
        return
      } else {
        const postData = deepClone(this.projectData)
        postData.formData = JSON.stringify(this.projectData.formData)
        editExperiment(postData).then(res => {
          if (res.code === 200) {
            if (this.projectData.id) {
              this.source[this.targetExperimentPosition.projectGroupIndex][this.targetExperimentPosition.projectIndex].name = res.data.name
              this.$message.success('修改成功')
            } else {
              this.source.splice(this.targetExperimentPosition, 0, [{
                id: res.data.id,
                name: res.data.name,
                status: res.data.status,
                children: []
              }])
              this.save(this.source, 'project')
              this.$message.success('新增成功')
            }
          }
        })
        this.projectDialog = false
        this.showEdit = false
        this.experimentValidate = false
      }
    },
    joinParty() {
      this.notDrag = true
      this.$nextTick(() => {
        if (this.selected.type === 'project') {
          const groupIndexArr = this.selected.sources.map(item => item.myMap.groupIndex)
          const unique = [...new Set(groupIndexArr)]
          unique.sort((a, b) => { return a - b })
          if (unique.length > 1) {
            for (let i = unique.length - 1; i > 0; i--) {
              const temp = this.source.splice(unique[i], 1)[0]
              this.$set(this.source, unique[0], this.source[unique[0]].concat(temp))
            }
          }
          this.resetSelected()
          this.save(this.source, this.selected.type)
          setTimeout(() => {
            this.notDrag = false
          }, 300)
        } else {
          const groupIndexArr = this.selected.sources.map(item => item.myMap.groupIndex)
          const unique = [...new Set(groupIndexArr)]
          unique.sort((a, b) => { return a - b })
          const projectSource = this.source[this.selected.sources[0].projectMap.projectGroupIndex][this.selected.sources[0].projectMap.projectIndex].children
          if (unique.length > 1) {
            for (let i = unique.length - 1; i > 0; i--) {
              const temp = projectSource.splice(unique[i], 1)[0]
              this.$set(projectSource, unique[0], projectSource[unique[0]].concat(temp))
            }
          }
          this.resetSelected()
          this.save(projectSource, this.selected.type)
          setTimeout(() => {
            this.notDrag = false
          }, 300)
        }
      })
    },
    leaveParty() {
      this.notDrag = true
      this.$nextTick(() => {
        if (this.selected.type === 'project') {
          const myMapArr = this.selected.sources.map(item => item.myMap)
          myMapArr.sort((a, b) => {
            if (a.groupIndex > b.groupIndex) {
              return -1
            } else if (a.groupIndex < b.groupIndex) {
              return 1
            } else {
              return b.index - a.index
            }
          })
          for (let i = 0; i < myMapArr.length; i++) {
            if (this.source[myMapArr[i].groupIndex].length === 1) {
              continue
            }
            const projectSource = this.source[myMapArr[i].groupIndex].splice(myMapArr[i].index, 1)
            this.source.splice(myMapArr[i].groupIndex + 1, 0, projectSource)
          }
          this.resetSelected()
          this.save(this.source, this.selected.type)
          setTimeout(() => {
            this.notDrag = false
          }, 300)
        } else {
          const myMapArr = this.selected.sources.map(item => item.myMap)
          myMapArr.sort((a, b) => {
            if (a.groupIndex > b.groupIndex) {
              return -1
            } else if (a.groupIndex < b.groupIndex) {
              return 1
            } else {
              return b.index - a.index
            }
          })
          const taskGroupSource = this.source[this.selected.sources[0].projectMap.projectGroupIndex][this.selected.sources[0].projectMap.projectIndex].children
          for (let i = 0; i < myMapArr.length; i++) {
            if (taskGroupSource[myMapArr[i].groupIndex].length === 1) {
              continue
            }
            const taskSource = taskGroupSource[myMapArr[i].groupIndex].splice(myMapArr[i].index, 1)
            taskGroupSource.splice(myMapArr[i].groupIndex + 1, 0, taskSource)
          }
          this.resetSelected()
          this.save(taskGroupSource, this.selected.type)
          setTimeout(() => {
            this.notDrag = false
          }, 300)
        }
      })
    },
    dragHandler() {
      this.resetSelected()
      this.save(this.source, 'project')
    },
    taskDragHandler(event) {
      const taskGroupSource = this.source[event.projectGroupIndex][event.projectIndex].children
      this.resetSelected()
      this.save(taskGroupSource, 'task')
    },
    resetSelected() {
      const selectedIds = this.selected.sources.map(item => item.source.id)
      if (this.selected.type === 'project') {
        const newSources = []
        for (let projectGroupIndex = 0; projectGroupIndex < this.source.length; projectGroupIndex++) {
          const projectGroup = this.source[projectGroupIndex]
          for (let projectIndex = 0; projectIndex < projectGroup.length; projectIndex++) {
            const project = projectGroup[projectIndex]
            if (selectedIds.includes(project.id)) {
              newSources.push({ source: project, inParty: projectGroup.length > 1, myMap: { groupIndex: projectGroupIndex, index: projectIndex }})
            }
          }
        }
        this.$set(this.selected, 'sources', newSources)
      } else {
        const newSources = []
        for (let projectGroupIndex = 0; projectGroupIndex < this.source.length; projectGroupIndex++) {
          const projectGroup = this.source[projectGroupIndex]
          for (let projectIndex = 0; projectIndex < projectGroup.length; projectIndex++) {
            const project = projectGroup[projectIndex]
            if (project.id === this.selected.projectId) {
              for (let taskGroupIndex = 0; taskGroupIndex < project.children.length; taskGroupIndex++) {
                const taskGroup = project.children[taskGroupIndex]
                for (let taskIndex = 0; taskIndex < taskGroup.length; taskIndex++) {
                  const task = taskGroup[taskIndex]
                  if (selectedIds.includes(task.id)) {
                    newSources.push({ source: task, inParty: taskGroup.length > 1, myMap: { groupIndex: taskGroupIndex, index: taskIndex }, projectMap: { projectGroupIndex, projectIndex }})
                  }
                }
              }
            }
          }
        }
        this.$set(this.selected, 'sources', newSources)
      }
    },
    // 选择节点
    checkItem(event) {
      if (event.isRadio) { // 单选
        this.selected.sources = [{ source: event.source, inParty: event.inParty, myMap: event.myMap, projectMap: event.projectMap }]
      } else { // 点击checkbox多选
        if (this.selected.type !== event.type) { // 切换实验、任务时，直接单选
          this.selected.sources = [{ source: event.source, inParty: event.inParty, myMap: event.myMap, projectMap: event.projectMap }]
        } else { // 选择同一类型时，多选
          if (event.type === 'task' && this.selected.projectId !== event.projectId) { // 任务时，切换了实验，直接单选
            this.selected.sources = [{ source: event.source, inParty: event.inParty, myMap: event.myMap, projectMap: event.projectMap }]
          } else { // 多选
            const targetId = event.source.id
            const selectedIds = this.selected.sources.map(item => item.source.id)
            const index = selectedIds.indexOf(targetId)
            if (index === -1) {
              this.selected.sources.push({ source: event.source, inParty: event.inParty, myMap: event.myMap, projectMap: event.projectMap })
            } else {
              this.selected.sources.splice(index, 1)
            }
          }
        }
      }
      this.selected.type = event.type
      // 任务时，存储一些额外信息
      this.selected.projectId = event.projectId
    },
    save(source, type) {
      const savedSource = []
      for (let groupIndex = 0; groupIndex < source.length; groupIndex++) {
        const group = source[groupIndex]
        for (let index = 0; index < group.length; index++) {
          const item = group[index]
          savedSource.push({ id: item.id, level: groupIndex })
        }
      }
      this.loading = true
      if (type === 'project') {
        experimentEditTree({ trees: savedSource }).then(res => {
          if (res.code === 200) {
            this.period.status = 2
            this.loading = false
          } else {
            this.$alert('流程保存失败')
          }
        })
      } else {
        taskEditTree({ trees: savedSource }).then(res => {
          if (res.code === 200) {
            this.period.status = 2
            this.loading = false
          } else {
            this.$alert('流程保存失败')
          }
        })
      }
      this.canSave = true
    },
    async getCanSave() {
      const processRes = await getProcessDetail({ id: this.periodId })
      this.canSave = processRes.data.bo.canSave
    },
    async sendTemplate() {
      await periodTemplate({ id: this.periodId })
      this.getCanSave()
      this.$message.success('保存成功')
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    color: #909399;
    font-size: 14px;
    display: flex;
    align-items: center;
    line-height: 1;
    height: 46px;
    box-sizing: border-box;
    border-bottom: 1px solid #E4E7ED;
    width: 100%;
  }
  .is-center {
    text-align: center;
  }
  .ghost {
    opacity: 0.5;
    background: #EAEEFE;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .project-group {
    position: relative;
  }
  .project-group-line {
    position: absolute;
    width: 2px;
    top: 22px;
    bottom: 23px;
    background-color: #3B5BFC;
    left: 53px;
    transition: all 0.3s;
    z-index: 1;
  }
  .flow-tree >>> .el-checkbox {
    margin-top: 2px;
  }
</style>
