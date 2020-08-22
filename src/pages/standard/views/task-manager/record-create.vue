<template>
  <record-establish :edit-data.sync="editData" @recordEdit="recordEdit" @handleCancel="handleCancel" />
</template>

<script>
import RecordEstablish from './components/record-establish'
import { deepClone } from '@/utils'
import { editRecord } from '@/api/task'
export default {
  name: 'RecordCreate',
  components: { RecordEstablish },
  data() {
    return {
      editData: {
        taskName: '',
        taskId: '',
        title: '',
        content: '',
        empIds: '',
        files: ''
      }
    }
  },
  created() {
    this.editData.taskName = this.$route.query.taskName
    this.editData.taskId = this.$route.query.taskId
  },
  methods: {
    recordEdit() {
      const postData = deepClone(this.editData)
      postData.empIds = postData.empIds.join(',')
      editRecord(postData).then(res => {
        if (res.code === 200) {
          this.$router.push(`/contract-manager/task-detail?id=${this.editData.taskId}`)
        }
      })
    },
    handleCancel() {
      this.$router.push(`/contract-manager/task-detail?id=${this.editData.taskId}`)
    }
  }
}
</script>
