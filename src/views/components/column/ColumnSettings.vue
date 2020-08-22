<template>
  <el-form ref="form" :model="columnForm" class="ybr-form-col">
    <el-form-item label="字段名称">
      <el-input v-model="columnForm.name" placeholder="请填写" />
    </el-form-item>
    <el-form-item label="字段类型">
      <el-select v-model="columnForm.type" :disabled="true" placeholder="请选择">
        <el-option label="文本" value="text" />
        <el-option label="选项" value="select" />
        <el-option label="日期" value="date" />
      </el-select>
    </el-form-item>
    <el-form-item v-if="columnForm.type === 'select'" label="选项" prop="options" :rules="{ required: columnForm.isNotNull, message: '选项不能为空', trigger: 'change'}">
      <el-select v-model="columnForm.options" multiple filterable allow-create default-first-option placeholder="添加选项" />
    </el-form-item>
    <el-form-item v-if="columnForm.type === 'select'" label="是否多选">
      <el-switch v-model="columnForm.isMultiple" />
    </el-form-item>
    <el-form-item label="是否必填">
      <el-switch v-model="columnForm.isNotNull" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ColumnSettings',
  props: {
    columnForm: {
      type: Object,
      default: function() {
        return {
          name: '',
          type: 'text',
          isMultiple: false,
          options: []
          // isNotNull: false
        }
      }
    }
  }
}
</script>
