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
            <md-input v-model="editData.name" icon="el-icon-search" placeholder="输入供应商名称（必填）">
              供应商名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <div class="container-standard"> -->
      <el-form ref="otherForm" :inline="true" :model="editData" :rules="rules" class="ybr-form-row" label-position="left" label-width="80px">
        <el-form-item label="账期(天)：" prop="itemDate">
          <el-input v-model="editData.itemDate" type="number" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系人：" prop="contactName">
          <el-input v-model="editData.contactName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="联系方式：" prop="contactPhone">
          <el-input v-model="editData.contactPhone" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="简介：">
          <el-input v-model="editData.remark" type="textarea" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-for="column in columnList" :key="column.code" :label="`${column.name}：`" :prop="`formData.${column.code}`" :rules="{ required: column.isNotNull, message: '必填项', trigger: 'change' }">
          <el-date-picker v-if="column.type==='date'" v-model="editData.formData[column.code]" type="date" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" />
          <el-select v-else-if="column.type==='select'" v-model="editData.formData[column.code]" placeholder="请选择">
            <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
          </el-select>
          <el-input v-else-if="column.type==='text'" v-model="editData.formData[column.code]" />
        </el-form-item>
      </el-form>
      <!-- </div> -->
      <!-- <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">常用采购品</span>
        </div>
        <div class="container-line-item">
          <tinymce v-model="editData.remark" :height="300" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import Sticky from '@/components/Sticky'
import MdInput from '@/components/MDinput'
export default {
  name: 'SupplierEstablish',
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
      code: 'supplier',
      rules: {
        itemDate: [{ required: true, message: '必填项', trigger: 'change' }],
        contactName: [{ required: true, message: '必填项', trigger: 'change' }],
        contactPhone: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      titleRules: {
        name: [{ required: true, trigger: 'change', message: '供应商名称不能为空' }]
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
            this.$emit('supplierEdit')
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
            this.$emit('supplierEdit')
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
