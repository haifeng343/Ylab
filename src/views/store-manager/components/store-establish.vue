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
            <md-input v-model="editData.name" icon="el-icon-search" placeholder="输入库存物品名称（必填）">
              库存物品名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-form ref="otherForm" :inline="true" :model="editData" class="ybr-form-row" label-position="left" :rules="rules">
          <el-form-item label="类型:" prop="typeId">
            <el-select v-model="editData.typeId" placeholder="请选择" :disabled="$route.query.typeId? true : false " @change="changeHandler">
              <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="规格:" prop="specs">
            <el-input v-model="editData.specs" placeholder="请输入" :disabled="$route.query.specs? true : false " />
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
import { fetchTypeList } from '@/api/form'
import { fetchColumnList } from '@/api/form'

export default {
  name: 'StoreEstablish',
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
      typeList: [],
      rules: {
        typeId: [{ required: true, message: '请选择类型', trigger: 'change' }],
        specs: [
          { required: true, message: '请输入规格', trigger: 'change' },
          { min: 1, message: '规格不能为空', trigger: 'change' }
        ]
      },
      titleRules: {
        name: [{ required: true, trigger: 'change', message: '库存物品名称不能为空' }]
      },
      titlePass: false,
      formPass: false
    }
  },
  created() {
    fetchTypeList({ code: 'buy_store', pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
  },
  methods: {
    changeHandler(event) {
      for (let i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].id === event) {
          this.getColumnList(this.typeList[i].code)
          return
        }
      }
    },
    getColumnList(code) {
      fetchColumnList({ code }).then(response => {
        this.columnList = response.data.list
        this.columnList.forEach(element => {
          if (!this.editData.formData[element.id] && this.editData.formData[element.id] !== 0) {
            this.$set(this.editData.formData, element.id, '')
          }
        })
      })
    },
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
            this.$emit('storeEdit')
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
            this.$emit('storeEdit')
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
