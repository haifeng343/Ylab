<template>
  <div class="tree-task" @click.stop="checkItem('task', true, project.id, task, taskGroup.length>1, { groupIndex: taskGroupIndex, index: taskIndex }, { projectGroupIndex, projectIndex })">
    <div v-if="buttonPermissions.includes(processTree) && period.status!==1 && taskIndex===0 && task.status===0 && !task.canStart" class="handle-leaf">
      <el-tooltip effect="dark" content="拖拽调整顺序" placement="right" :hide-after="1000">
        <svg-icon icon-class="move-handle" />
      </el-tooltip>
    </div>
    <div v-else style="flex: 0 0 16px;" />
    <div style="flex: 0 0 108px; text-align: right; z-index: 1; padding-right: 10px;">
      <el-tag v-if="taskIndex===0 && taskGroup.length>1" type="success" effect="dark">
        并行
      </el-tag>
    </div>
    <div style="flex: 0 0 22px;">
      <el-checkbox
        :value="selectedIds.includes(task.id) && selectedType === 'task'"
        @change="checkItem('task', false, project.id, task, taskGroup.length>1, { groupIndex:taskGroupIndex, index: taskIndex }, { projectGroupIndex, projectIndex })"
        @click.native.stop=""
      />
    </div>
    <div class="is-center" style="flex: 0 0 70px;">
      <el-tag v-if="!task.isShow" type="danger">未生效</el-tag>
      <el-tag v-else-if="task.canStart && task.status === 0" class="can-start">可开始</el-tag>
      <el-tag v-else-if="task.isInApprove" type="primary">审批中</el-tag>
      <el-tag v-else :type="task.status | statusTypeFilter">{{ task.status | statusFilter }}</el-tag>
    </div>
    <div style="flex-grow: 1;">
      <span class="link-name" @click.stop="$router.push(`/contract-manager/task-detail?id=${task.id}`)">{{ task.name }}</span>
      <el-tooltip placement="top">
        <div slot="content">
          <div v-if="task.contractException">项目异常：{{ task.contractException.remark }}</div>
          <div v-if="task.taskException && task.taskException.length > 0" style="display: flex;">
            <div>任务异常：</div>
            <div>
              <div v-for="(item,index) in task.taskException" :key="index">{{ item.remark }}</div>
            </div>
          </div>
        </div>
        <el-tag v-if="task.taskException && task.taskException.length > 0 || task.contractException" type="danger" style="margin-left: 8px;">异常</el-tag>
      </el-tooltip>
    </div>
    <div class="is-center" style="flex: 0 0 70px;">
      <el-dropdown trigger="click">
        <div class="more-buttom">
          <svg-icon icon-class="more" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-if="buttonPermissions.includes(processTree) && period.status!==1 && (task.status===0 || task.status===1)"
            @click.native="$emit('newTask', { position: {projectIndex, projectGroupIndex, taskPosition: taskGroupIndex+1 }, experimentId: project.id })"
          >新建任务</el-dropdown-item>
          <el-dropdown-item v-if="(buttonPermissions.includes(processTree) || buttonPermissions.includes(enterpriseTaskEdit)) && period.status!==1 && period.status!==2 && task.canStart && task.status === 0" @click.native="taskStart(task.id)">开始</el-dropdown-item>
          <el-dropdown-item @click.native="$emit('taskDetail', { id: task.id, position: { projectIndex, projectGroupIndex, taskGroupIndex, taskIndex }})">详情</el-dropdown-item>
          <el-dropdown-item
            v-if="buttonPermissions.includes(processTree) && period.status!==1 && task.status===0 && !task.canStart"
            @click.native="$emit('delTask', { projectIndex, projectGroupIndex, taskGroupIndex, taskIndex, id: task.id })"
          >删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { editTaskStatus } from '@/api/task'
export default {
  name: 'FlowTreeTask',
  props: {
    period: {
      type: Object,
      default: () => {}
    },
    projectGroupIndex: {
      type: Number,
      default: -1
    },
    projectIndex: {
      type: Number,
      default: -1
    },
    taskGroup: {
      type: Array,
      default: () => []
    },
    taskGroupIndex: {
      type: Number,
      default: -1
    },
    task: {
      type: Object,
      default: () => {}
    },
    taskIndex: {
      type: Number,
      default: -1
    },
    project: {
      type: Object,
      default: () => {}
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
  computed: {
    selectedIds() {
      return this.selected.sources.map(item => item.source.id)
    },
    selectedType() {
      return this.selected.type
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
    enterpriseTaskEdit() {
      return this.buttonPermission[this.platform].enterpriseTaskEdit
    }
  },
  methods: {
    checkItem(type, isRadio, projectId, source, inParty, myMap, projectMap) {
      this.$emit('checkItem', { type, isRadio, projectId, source, inParty, myMap, projectMap })
    },
    taskStart(id) {
      editTaskStatus({ id: id, status: 1 }).then(res => {
        this.task.status = 1
        this.project.status = 1
        this.$emit('changeListStatus')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .handle-leaf {
    flex: 0 0 16px;
    height: 16px;
    cursor: move;
    color: #C0C4CC;
  }
  .is-center {
    text-align: center;
  }
  .can-start {
    color: #0076FF;
    background-color: #CCE3FF;
    border-color: #CCE3FF;
    font-weight: bold;
  }
  .link-name {
    color: #000000;
    font-size: 14px;
    cursor: pointer;
  }
  .link-name:hover {
    color: #1A4FA1;
  }
  .more-buttom {
    cursor: pointer;
    padding: 4px 8px;
    display: none;
    border-radius: 4px;
  }
  .tree-task:hover .more-buttom {
    display: block;
  }
  .more-buttom:hover {
    background: #DCE2FD;
  }
</style>
