<template>
  <div @click.stop="checkItem('project', true, project, projectGroup.length>1, { groupIndex: projectGroupIndex, index: projectIndex })">
    <div :class="{selected: selectedIds.includes(project.id) && selectedType === 'project', 'project-row-party': projectGroup.length>1, 'project-row': projectGroup.length===1}">
      <div v-if="buttonPermissions.includes(processTree) && period.status!==1 && projectIndex===0 && project.status===0 && !projectGroup[0].canStart" class="handle">
        <el-tooltip effect="dark" content="拖拽调整顺序" placement="right" :hide-after="1000">
          <svg-icon icon-class="move-handle" />
        </el-tooltip>
      </div>
      <div v-else style="flex: 0 0 16px;" />
      <div style="flex: 0 0 58px; text-align: right; z-index: 1; padding-right: 10px;">
        <el-tag v-if="projectIndex===0 && projectGroup.length>1" type="primary" effect="dark">
          并行
        </el-tag>
      </div>
      <div style="flex: 0 0 22px;">
        <el-checkbox
          :value="selectedIds.includes(project.id) && selectedType === 'project'"
          @change="checkItem('project', false, project, projectGroup.length>1, { groupIndex: projectGroupIndex, index: projectIndex })"
          @click.native.stop=""
        />
      </div>
      <div style="color: #C0C4CC; flex: 0 0 14px;">
        <svg-icon
          v-show="!loading"
          ref="treeArrow"
          icon-class="tree-arrow"
          class-name="trans-arrow"
          @click.stop="changeLeafState(projectIndex)"
        />
        <i v-if="loading" class="el-icon-loading" style="font-size: 14px;" />
      </div>
      <div class="is-center" style="flex: 0 0 70px;">
        <el-tag v-if="!project.isShow" type="danger">未生效</el-tag>
        <el-tag v-else :type="project.status | statusTypeFilter">{{ project.status | statusFilter }}</el-tag>
      </div>
      <div style="flex-grow: 1;">
        <span
          class="link-name"
          style="font-weight: bold;"
          @click.stop="$router.push(`/contract-manager/experiment-detail?id=${project.id}`)"
        >{{ project.name }}</span>
        <el-tooltip placement="top">
          <div slot="content">
            <div v-if="project.contractException">项目异常：{{ project.contractException.remark }}</div>
            <div v-if="project.taskException && project.taskException.length > 0" style="display: flex;">
              <div>任务异常：</div>
              <div>
                <div v-for="(item,index) in project.taskException" :key="index">{{ item.remark }}</div>
              </div>
            </div>
          </div>
          <el-tag v-if="project.taskException && project.taskException.length > 0 || project.contractException" type="danger" style="margin-left: 8px;">异常</el-tag>
        </el-tooltip>
      </div>
      <div class="is-center" style="flex: 0 0 70px;">
        <el-dropdown trigger="click">
          <div class="more-buttom">
            <svg-icon icon-class="more" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="buttonPermissions.includes(processTree) && period.status!==1 && (project.status===1 || project.status===0)" @click.native="$emit('newExperiment', projectGroupIndex+1)">新建实验</el-dropdown-item>
            <el-dropdown-item v-if="buttonPermissions.includes(processTree) && period.status!==1 && (project.status===1 || project.status===0)" @click.native="$emit('newTask', { position: {projectIndex, projectGroupIndex, taskPosition: project.children.length }, experimentId: project.id })">新建任务</el-dropdown-item>
            <el-dropdown-item @click.native="$emit('experimentDetail',{ id: project.id, position: {projectGroupIndex, projectIndex} })">详情</el-dropdown-item>
            <el-dropdown-item v-if="buttonPermissions.includes(processTree) && period.status!==1 && project.status===0 && !project.canStart" @click.native="$emit('delExperiment', {projectGroupIndex, projectIndex, id: project.id})">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div ref="taskAll" class="task-all">
      <draggable
        v-model="project.children"
        :group="`task-${project.name}`"
        v-bind="dragOptions"
        handle=".handle-leaf"
        draggable=".draggable"
        @change="$emit('dragged', { projectGroupIndex, projectIndex })"
      >
        <transition-group type="transition" :name="notDrag?'':'flip-list'" style="width: 100%;">
          <div
            v-for="(taskGroup, index) in project.children"
            :key="taskGroup[0].id"
            :class="{'task-group': taskGroup.length>1, 'draggable': buttonPermissions.includes(processTree) && period.status!==1 && taskGroup[0].status===0 && !taskGroup[0].canStart}"
          >
            <flow-tree-task
              v-for="(task, taskIndex) in taskGroup"
              :key="task.id"
              :task-index="taskIndex"
              :task-group="taskGroup"
              :project-group-index="projectGroupIndex"
              :project-index="projectIndex"
              :task-group-index="index"
              :task="taskGroup[taskIndex]"
              :project="project"
              :selected="selected"
              :period="period"
              :class="{selected: selectedIds.includes(task.id) && selectedType === 'task', 'task-row-party': taskGroup.length>1, 'task-row': taskGroup.length===1}"
              @checkItem="$emit('checkItem', $event)"
              @newTask="$emit('newTask', $event)"
              @delTask="$emit('delTask', $event)"
              @taskDetail="$emit('taskDetail', $event)"
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
import FlowTreeTask from './FlowTreeTask'
import { fetchList } from '@/api/task'

export default {
  name: 'FlowTreeRoot',
  components: {
    draggable,
    FlowTreeTask
  },
  props: {
    period: {
      type: Object,
      default: () => {}
    },
    notDrag: {
      type: Boolean,
      default: false
    },
    projectGroup: {
      type: Array,
      default: () => []
    },
    projectGroupIndex: {
      type: Number,
      default: -1
    },
    project: {
      type: Object,
      default: () => {}
    },
    projectIndex: {
      type: Number,
      default: -1
    },
    selected: {
      type: Object,
      default: () => {
        return {
          ids: [],
          type: ''
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      loaded: false,
      openLeaf: false,
      taskGroupHeight: 0,
      ulheight: ''
    }
  },
  computed: {
    selectedIds() {
      return this.selected.sources.map(item => item.source.id)
    },
    selectedType() {
      return this.selected.type
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    children() {
      return this.project.children
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
    }
  },
  watch: {
    children() {
      let count = 0
      for (let i = 0; i < this.project.children.length; i++) {
        for (let j = 0; j < this.project.children[i].length; j++) {
          count += 1
        }
      }
      this.ulheight = 38 * count + 'px'
      this.$refs.taskAll.style.height = this.ulheight
      if (this.projectGroup.length > 1 && this.projectIndex === this.projectGroup.length - 1) {
        this.$el.parentElement.childNodes[0].style.bottom = `${parseInt(this.ulheight) + 22}px`
      }
    }
  },
  mounted() {
    this.$refs.taskAll.style.height = 0
    this.$refs.taskAll.style.borderBottom = 'none'
  },
  methods: {
    // 展开关闭节点
    async changeLeafState() {
      this.openLeaf = !this.openLeaf
      if (this.openLeaf) {
        if (!this.loaded) {
          this.loading = true
          const res = await fetchList({ experimentId: this.project.id, pageNo: 1, pageSize: 200 })
          this.project.children = []
          this.loaded = true
          let taskList = res.data.list
          taskList = taskList.filter(item => {
            return item.level || item.level === 0 || item.level === '0'
          }).map(item => {
            return Object.assign(item, { level: parseInt(item.level) })
          })
          taskList.sort((a, b) => {
            return a.level - b.level
          })
          for (let i = 0; i < taskList.length; i++) {
            if (i === 0) {
              this.project.children.push([{
                id: taskList[i].id,
                name: taskList[i].name,
                status: taskList[i].status,
                isInApprove: taskList[i].isInApprove,
                isShow: taskList[i].isShow,
                canStart: taskList[i].canStart,
                exception: taskList[i].exception,
                contractException: taskList[i].contractException,
                taskException: taskList[i].taskException
              }])
            } else {
              if (taskList[i - 1].level === taskList[i].level) {
                this.project.children[this.project.children.length - 1].push({
                  id: taskList[i].id,
                  name: taskList[i].name,
                  status: taskList[i].status,
                  isInApprove: taskList[i].isInApprove,
                  isShow: taskList[i].isShow,
                  canStart: taskList[i].canStart,
                  exception: taskList[i].exception,
                  contractException: taskList[i].contractException,
                  taskException: taskList[i].taskException
                })
              } else {
                this.project.children.push([{
                  id: taskList[i].id,
                  name: taskList[i].name,
                  status: taskList[i].status,
                  isInApprove: taskList[i].isInApprove,
                  isShow: taskList[i].isShow,
                  canStart: taskList[i].canStart,
                  exception: taskList[i].exception,
                  contractException: taskList[i].contractException,
                  taskException: taskList[i].taskException
                }])
              }
            }
          }
          this.ulheight = 38 * taskList.length + 'px'
          this.loading = false
        }
        this.$refs.treeArrow.$el.style.transform = 'rotate(90deg)'
        this.$refs.taskAll.style.height = this.ulheight
        this.$refs.taskAll.style.borderBottom = '1px solid #E4E7ED'
        if (this.projectGroup.length > 1 && this.projectIndex === this.projectGroup.length - 1) {
          this.$el.parentElement.childNodes[0].style.bottom = `${parseInt(this.ulheight) + 23}px`
        }
      } else {
        this.$refs.treeArrow.$el.style.transform = 'rotate(0)'
        this.$refs.taskAll.style.height = 0
        this.$refs.taskAll.style.borderBottom = 'none'
        if (this.projectGroup.length > 1 && this.projectIndex === this.projectGroup.length - 1) {
          this.$el.parentElement.childNodes[0].style.bottom = '23px'
        }
      }
    },
    // 选择节点
    checkItem(type, isRadio, source, inParty, myMap) {
      this.$emit('checkItem', { type, isRadio, source, inParty, myMap })
    }
  }
}
</script>

<style lang="scss" scoped>
  .row {
    position: relative;
    display: flex;
    align-items: center;
    line-height: 1;
    box-sizing: border-box;
    width: 100%;
  }
  .row:hover {
    background-color: #F6F7FB;
  }
  .more-buttom {
    cursor: pointer;
    padding: 4px 8px;
    display: none;
    border-radius: 4px;
  }
  .row:hover .more-buttom {
    display: block;
  }
  .more-buttom:hover {
    background: #DCE2FD;
  }
  .project-row {
    @extend .row;
    height: 46px;
    border-bottom: 1px solid #E4E7ED;
  }
  .project-row-party {
    @extend .project-row;
  }
  .project-row-party::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: #5370FF;
    left: 53px;
  }
  .link-name {
    color: #000000;
    font-size: 14px;
    cursor: pointer;
  }
  .link-name:hover {
    color: #1A4FA1;
  }
  .ghost {
    opacity: 0.5;
    background: #EAEEFE;
  }
  .flip-list-move {
    transition: transform 0.5s;
  }
  .handle {
    flex: 0 0 16px;
    height: 16px;
    cursor: move;
    color: #C0C4CC;
  }
  .task-all {
    transition: height 0.3s;
    overflow: hidden;
  }
  .task-group {
    position: relative;
  }
  .task-group::before {
    content: '';
    position: absolute;
    width: 2px;
    top: 19px;
    bottom: 19px;
    background-color: #38C4BF;
    left: 100px;
    z-index: 1;
  }
  .task-row {
    @extend .row;
    height: 38px;
  }
  .task-row-party {
    @extend .task-row;
  }
  .task-row-party::before {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: #38C4BF;
    left: 100px;
  }
  .is-center {
    text-align: center;
  }
  .trans-arrow {
    transition: all 0.3s;
    cursor: pointer;
  }
  .selected {
    background-color: #EAEEFE;
  }
  .can-start {
    color: #0076FF;
    background-color: #CCE3FF;
    border-color: #CCE3FF;
    font-weight: bold;
  }
</style>
