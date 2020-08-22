<template>
  <div>
    <sticky :sticky-top="84" class-name="sub-navbar">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </sticky>
    <div class="app-container">
      <div>
        <el-form ref="titleForm" :model="editData" :rules="titleRules">
          <el-form-item prop="name">
            <md-input v-model="editData.name" icon="el-icon-search" placeholder="输入仪器名称（必填）">
              仪器名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form ref="otherForm" :inline="true" :model="editData" class="ybr-form-row" label-position="left" :rules="rules">
          <el-form-item label="品牌:" prop="brand">
            <el-input v-model="editData.brand" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="型号:" prop="specs">
            <el-input v-model="editData.specs" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="预约时间:" prop="maxTime">
            <el-input v-model.number="editData.maxTime" type="age" placeholder="可预约最长时间(小时)" />
          </el-form-item>
          <el-form-item label="存放地点:">
            <el-input v-model="editData.address" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="用途:">
            <el-input v-model="editData.purpose" placeholder="请输入" />
          </el-form-item>
          <el-form-item v-for="column in columnList" :key="column.code" :label="`${column.name}：`" :prop="`formData.${column.code}`" :rules="{ required: column.isNotNull, message: '必填项', trigger: 'change' }">
            <el-date-picker v-if="column.type==='date'" v-model="editData.formData[column.code]" type="date" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            <el-select v-else-if="column.type==='select'" v-model="editData.formData[column.code]" placeholder="请选择">
              <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
            </el-select>
            <el-input v-else-if="column.type==='text'" v-model="editData.formData[column.code]" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import MdInput from '@/components/MDinput'
// import { fetchColumnList } from '@/api/form'

export default {
  name: 'DeviceEstablish',
  components: { Sticky, MdInput },
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
      rules: {
        brand: [
          { required: true, message: '请输入品牌', trigger: 'change' },
          { min: 1, message: '品牌不能为空', trigger: 'change' }
        ],
        specs: [
          { required: true, message: '请输入型号', trigger: 'change' },
          { min: 1, message: '型号不能为空', trigger: 'change' }
        ],
        maxTime: [
          { required: true, message: '请输入预约时间', trigger: 'blur' },
          { type: 'number', message: '预约时间不能为空', trigger: 'blur' }
        ]
      },
      titleRules: {
        name: [{ required: true, trigger: 'change', message: '仪器名称不能为空' }]
      },
      titlePass: false,
      formPass: false
    }
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
            this.$emit('analyzerEdit')
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
            this.$emit('analyzerEdit')
          }
        }
      })
    },
    handleCancel() {
      this.$refs.titleForm.resetFields()
      this.$refs.otherForm.resetFields()
      this.$emit('cancelEdit')
    }
  }
}
</script>

