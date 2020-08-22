<template>
  <div>
    <sticky :sticky-top="84" class-name="sub-navbar">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </sticky>
    <div class="app-container">
      <div>
        <!-- <el-input v-model="editData.name" class="no-border container-standard" placeholder="输入任务名称（必须）" /> -->
        <el-form ref="titleForm" :model="editData" :rules="titleRules">
          <el-form-item prop="name">
            <md-input v-model="editData.name" icon="el-icon-search" placeholder="输入任务名称（必填）">
              任务名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-standard">
        <el-form ref="otherForm" :inline="true" :model="editData" :rules="rules" class="ybr-form-row" label-position="left">
          <el-form-item label="归属项目:">
            <el-select v-model="editData.tid" filterable placeholder="请选择">
              <el-option v-for="(item,index) in contractList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型:">
            <el-select v-model="editData.typeId" filterable placeholder="请选择">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人:" prop="curId">
            <el-select v-model="editData.curId" filterable placeholder="请选择">
              <el-option v-for="(item,index) in principalList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="优先级:">
            <el-select v-model="editData.level" placeholder="请选择">
              <el-option label="高" value="高" />
              <el-option label="中" value="中" />
              <el-option label="低" value="低" />
            </el-select>
          </el-form-item>
          <el-form-item label="计划开始:" prop="planStartTime">
            <el-date-picker v-model="editData.planStartTime" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item label="计划结束:" prop="planEndTime">
            <el-date-picker v-model="editData.planEndTime" type="datetime" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item v-for="column in columnList" :key="column.code" :label="`${column.name}：`" :prop="`formData.${column.code}`" :rules="{ required: column.isNotNull, message: '必填项', trigger: 'change' }">
            <el-date-picker v-if="column.type==='date'" v-model="editData.formData[column.code]" type="date" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" />
            <el-select v-else-if="column.type==='select'" v-model="editData.formData[column.code]" placeholder="请选择">
              <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
            </el-select>
            <el-input v-else-if="column.type==='text'" v-model="editData.formData[column.code]" />
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
import { fetchTypeList } from '@/api/form'
import { fetchContractList } from '@/api/task'
export default {
  name: 'TaskEstablish',
  components: { Tinymce, Sticky, MdInput, NormalUpload },
  props: {
    editData: {
      type: Object,
      default: null
    },
    columnList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      code: 'task',
      contractList: [],
      typeList: [],
      principalList: [],
      rules: {
        curId: [{ required: true, message: '请选择负责人', trigger: 'change' }],
        planStartTime: [{ required: true, message: '请选择计划开始时间', trigger: 'change' }],
        planEndTime: [{ required: true, message: '请选择计划结束时间', trigger: 'change' }]
      },
      titleRules: {
        name: [{ required: true, trigger: 'change', message: '任务名称不能为空' }]
      },
      titlePass: false,
      formPass: false
    }
  },
  created() {
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 99999 }).then(res => {
      this.typeList = res.data.list
    })
    fetchContractList({ pageNo: 1, pageSize: 100000, isUnion: 0 }).then(res => {
      this.contractList = res.data.list
    })
  },
  methods: {
    handleSubmit() {
      this.titlePass = false
      this.formPass = false
      this.$refs.titleForm.validate((valid) => {
        if (!valid) {
          this.titlePass = false
          return false
        } else {
          this.titlePass = true
          if (this.formPass) {
            this.$refs.upload.clearDeletedFiles()
            this.$emit('taskEdit')
          }
        }
      })
      this.$refs.otherForm.validate((valid) => {
        if (!valid) {
          this.formPass = false
          return false
        } else {
          this.formPass = true
          if (this.titlePass) {
            this.$refs.upload.clearDeletedFiles()
            this.$emit('taskEdit')
          }
        }
      })
    },
    handleCancel() {
      this.$refs.titleForm.resetFields()
      this.$refs.otherForm.resetFields()
      this.$refs.upload.clearNewUpload()
      this.$emit('cancelEdit')
    }
  }
}
</script>
