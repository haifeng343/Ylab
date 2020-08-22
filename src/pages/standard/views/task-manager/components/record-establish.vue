<template>
  <div>
    <sticky :sticky-top="84" class-name="sub-navbar">
      <el-button @click="cancelEdit">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </sticky>
    <div class="app-container">
      <div>
        <!-- <el-input v-model="editData.title" class="no-border container-standard" placeholder="输入实验名称（必须）" /> -->
        <el-form ref="titleForm" :model="editData" :rules="titleRules">
          <el-form-item prop="title">
            <md-input v-model="editData.title" icon="el-icon-search" placeholder="输入实验名称（必填）">
              实验记录名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-standard">
        <div class="container-line-item">
          <span class="detail-form-name">归属任务：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/task-detail?id=${editData.taskId}`)">{{ editData.taskName }}</span>
        </div>
        <el-form :inline="true" :model="editData" class="ybr-form-row" label-position="left">
          <el-form-item label="关联人:">
            <el-select v-model="editData.empIds" multiple placeholder="请选择">
              <el-option v-for="(item, index) in relatedPerson" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">详情内容</span>
        </div>
        <!-- ----------------------富文本编辑器----------------------------- -->
        <div class="container-line-item">
          <tinymce v-model="editData.content" :height="300" />
        </div>
      </div>
      <div style="display: flex;">
        <div style="margin-top: 8px">附件：</div><normal-upload ref="upload" v-model="editData.files" class="container-line-item" />
      </div>
    </div>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import MdInput from '@/components/MDinput'
import NormalUpload from '@/components/Upload/NormalUpload'
import { fetchPersonList } from '@/api/common'

export default {
  name: 'RecordEstablish',
  components: { Tinymce, Sticky, MdInput, NormalUpload },
  props: {
    editData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      relatedPerson: [],
      titleRules: {
        title: [{ required: true, trigger: 'change', message: '实验名称不能为空' }]
      },
      titlePass: false
    }
  },
  created() {
    fetchPersonList().then(res => {
      this.relatedPerson = res.data.list
    })
  },
  methods: {
    handleSubmit() {
      this.titlePass = false
      this.$refs.titleForm.validate((valid) => {
        if (!valid) {
          this.titlePass = false
          return false
        } else {
          this.titlePass = true
          this.$refs.upload.clearDeletedFiles()
          this.$emit('recordEdit')
        }
      })
    },
    cancelEdit() {
      this.$refs.upload.clearNewUpload()
      this.$emit('handleCancel')
    }
  }
}
</script>
