<template>
  <div>
    <sticky :sticky-top="84" class-name="sub-navbar">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </sticky>
    <div class="app-container">
      <div>
        <!-- <el-input v-model="editData.name" class="no-border container-standard" placeholder="输入项目名称（必须）" /> -->
        <el-form ref="titleForm" :model="editData" :rules="titleRules">
          <el-form-item prop="name">
            <md-input v-model="editData.name" icon="el-icon-search" placeholder="输入合同名称（必填）">
              合同名称
            </md-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="container-standard">
        <el-form ref="otherForm" :inline="true" :model="editData" class="ybr-form-row" label-position="left" :rules="rules">
          <div>
            <el-form-item class="businessContract" label="关联项目">
              <el-select
                v-model="business"
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)"
                placeholder="请选择"
                @change="selectBusiness"
              >
                <el-option v-for="(item,index) in workContract" :key="index" :label="`${item.contractNo} ${item.name}`" :value="`${item.objectId}?${item.contractNo} ${item.name}?${item.customPhone}`" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="类型:">
            <el-select v-model="editData.contractTypeId" placeholder="请选择">
              <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="合同总额:" prop="totalMoney">
            <el-input v-model="editData.totalMoney" />
          </el-form-item>
          <el-form-item label="客户名:" prop="h3Name">
            <el-input v-model="editData.h3Name" />
          </el-form-item>
          <el-form-item label="手机号:" prop="h3Phone">
            <el-input v-model="editData.h3Phone" />
          </el-form-item>
          <el-form-item label="业务员:">
            <el-input v-model="editData.saleName" />
          </el-form-item>
          <el-form-item label="售前支持:">
            <el-input v-model="editData.saleFrontName" />
          </el-form-item>
          <el-form-item label="售后支持:">
            <el-input v-model="editData.saleBackName" />
          </el-form-item>
          <el-form-item label="签约主体:" prop="curId">
            <el-select v-model="editData.curId" placeholder="请选择公司主体">
              <el-option label="懿贝瑞" value="1" />
              <el-option label="冠路" value="2" />
              <el-option label="滴英" value="3" />
              <el-option label="懿贝瑞医疗" value="4" />
            </el-select>
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
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-subtitle">详情内容</span>
        </div>
        <!-- ----------------------富文本编辑器----------------------------- -->
        <div class="container-line-item">
          <tinymce v-model="editData.remark" :height="300" />
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
import { queryBusinessContract } from '@/api/contract'
export default {
  name: 'SaleEstablish',
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
      loading: false,
      code: 'contract',
      typeList: [],
      principalList: [],
      rules: {
        totalMoney: [{ required: true, message: '请输入合同总额', trigger: 'change' }],
        h3Name: [{ required: true, message: '请输入客户名', trigger: 'change' }],
        h3Phone: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        curId: [{ required: true, message: '请选择公司主体', trigger: 'change' }]
      },
      titleRules: {
        name: [{ required: true, trigger: 'change', message: '合同名称不能为空' }]
      },
      titlePass: false,
      formPass: false,
      workContract: [],
      business: ''
    }
  },
  created() {
    this.loading = true
    fetchPersonList().then(res => {
      this.principalList = res.data.list
    })
    fetchTypeList({ code: 'contract', pageNo: 1, pageSize: 1000 }).then(res => {
      this.typeList = res.data.list
    })
    queryBusinessContract({ pageNo: 1, pageSize: 9999 }).then(res => {
      this.workContract = res.data
      if (this.editData.h3Id !== '') {
        this.business = this.editData.h3Id + '?' + this.editData.h3Name + '?' + this.editData.h3Phone
      }
      this.loading = false
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
            this.$emit('contractEdit')
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
            this.$emit('contractEdit')
          }
        }
      })
    },
    handleCancel() {
      this.$refs.titleForm.resetFields()
      this.$refs.otherForm.resetFields()

      this.$refs.upload.clearNewUpload()
      this.$emit('cancelEdit')
    },
    selectBusiness(e) {
      this.editData.h3Id = e.split('?')[0]
      this.editData.h3Name = e.split('?')[1]
      this.editData.h3Phone = e.split('?')[2]
    }
  }
}
</script>
<style lang="scss">
  .businessContract .el-loading-spinner {
    top: 0;
    margin-top: 0;
  }
</style>
