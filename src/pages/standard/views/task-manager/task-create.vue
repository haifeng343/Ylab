<template>
  <div>
    <task-establish :edit-data.sync="editData" :column-list="columnList" @taskEdit="taskEdit" @cancelEdit="cancelEdit" />
  </div>
</template>

<script>
import Vue from 'vue'
import TaskEstablish from './components/task-establish'
import { editTask } from '@/api/task'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
export default {
  name: 'TaskCreate',
  components: { TaskEstablish },
  data() {
    return {
      editData: {
        name: '',
        tid: '',
        typeId: '',
        curId: '',
        level: '',
        planStartTime: '',
        planEndTime: '',
        // 富文本编辑框内容
        content: '',
        formData: {},
        files: ''
      },
      // 自定义字段
      columnList: [],
      code: 'task'
    }
  },
  created() {
    fetchColumnList({ code: this.code }).then(response => {
      this.columnList = response.data.list
      this.columnList.forEach(element => {
        Vue.set(this.editData.formData, element.id, '')
      })
    })
  },
  methods: {
    taskEdit() {
      const postData = deepClone(this.editData)
      postData.formData = JSON.stringify(this.editData.formData)
      editTask(postData).then(res => {
        if (res.code === 200) {
          this.$router.push('/contract-manager/task-list')
        }
      })
    },
    cancelEdit() {
      this.$router.push('/contract-manager/task-list')
    }
  }
}
</script>
