<template>
  <div>
    <sticky :sticky-top="84" class-name="sub-navbar">
      <el-button @click="handleCancel()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">提交</el-button>
    </sticky>
    <div class="app-container">
      <div class="container-standard">
        <el-form ref="otherForm" :inline="true" :model="editData" :rules="rules" class="ybr-form-row" label-position="left">
          <el-form-item label="归属项目:">
            <el-select v-model="editData.contractId" filterable clearable placeholder="请选择">
              <el-option v-for="(item,index) in contractList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购类型:">
            <el-select v-model="editData.typeId" filterable clearable placeholder="请选择">
              <el-option v-for="(item,index) in purchaseTypeList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购用途:" prop="purpose">
            <el-input v-model="editData.purpose" placeholder="请输入采购用途" />
          </el-form-item>
          <el-form-item v-for="column in columnList" :key="column.code" :label="`${column.name}：`" :prop="`formData.${column.code}`" :rules="{ required: column.isNotNull, message: '必填项', trigger: 'blur' }">
            <el-date-picker v-if="column.type==='date'" v-model="editData.formData[column.code]" type="date" placeholder="请选择" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd" />
            <el-select v-else-if="column.type==='select'" v-model="editData.formData[column.code]" placeholder="请选择">
              <el-option v-for="(item,index) in column.options.split(',')" :key="index" :label="item" :value="item" />
            </el-select>
            <el-input v-else-if="column.type==='text'" v-model="editData.formData[column.code]" />
          </el-form-item>
        </el-form>
      </div>
      <div class="container-line-title">
        <span class="detail-subtitle">采购需求</span>
        <el-button class="container-line-button" type="primary" @click="popOut = true">
          新建
        </el-button>
      </div>
      <!-- ----------------------需求列表----------------------------- -->
      <el-table
        v-loading="listLoading"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.7)"
        :data="editData.buyInfoList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="物品名称" min-width="260">
          <template slot-scope="{row}">
            <span v-if="row.id" class="link-type" @click="$router.push(`/contract-manager/task-detail?id=${row.id}`)">{{ row.name }}</span>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" prop="specs" width="120" align="center" />
        <el-table-column label="类型" prop="typeName" width="120" align="center" />
        <el-table-column label="数量" prop="count" width="120" align="center" />
        <el-table-column label="备注" prop="remark" min-width="260" align="center" />
        <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.$index)">
              编辑
            </el-button>
            <el-button type="danger" @click="del(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- -----------------------------------弹框----------------------------- -->
    <el-dialog title="新建采购需求" :visible.sync="popOut" :close-on-click-modal="false" width="500px" @close="clearPopForm">
      <el-form ref="popForm" class="popOut" :rules="popFormRules" :model="popForm" label-position="left">
        <el-form-item label="物品名称" label-width="80px" prop="name">
          <el-autocomplete v-if="$route.query !== {} && popForm.indexNum === 0" v-model="popForm.name" :fetch-suggestions="querySearchAsync" disabled />
          <el-autocomplete v-else v-model="popForm.name" :fetch-suggestions="querySearchAsync" @select="handleSelect" />
        </el-form-item>
        <el-form-item label="规格" label-width="80px" prop="specs">
          <el-input v-if="$route.query !== {} && popForm.indexNum === 0" v-model="popForm.specs" disabled />
          <el-input v-else v-model="popForm.specs" />
        </el-form-item>
        <el-form-item label="数量" label-width="80px" prop="count">
          <el-input v-model="popForm.count" type="number" />
        </el-form-item>
        <el-form-item label="类型:" label-width="80px">
          <el-select v-if="$route.query !== {} && popForm.indexNum === 0" v-model="popForm.typeId" filterable placeholder="请选择" disabled>
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-else v-model="popForm.typeId" filterable placeholder="请选择" @change="typeSelectHandler">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="popForm.remark" type="textarea" placeholder="补充备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="popOut = false; clearPopForm();">取 消</el-button>
        <el-button type="primary" @click="popSubmit('popForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import Sticky from '@/components/Sticky'
import { fetchTypeList } from '@/api/form'
import { fetchList } from '@/api/store'
import { fetchContractList } from '@/api/task'
import { deepClone } from '@/utils'
export default {
  name: 'PurchaseEstablish',
  components: { Sticky },
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
      total: 0,
      listLoading: false,
      code: 'buy_store',
      contractList: [],
      // 采购单类型
      purchaseTypeList: [],
      typeList: [],
      goodList: [],
      rules: {
        // typeId: [{ required: true, message: '请选择采购类型', trigger: 'change' }],
        purpose: [
          { required: true, message: '请输入采购用途', trigger: 'change' },
          { min: 1, message: '采购用途不能为空', trigger: 'change' }
        ]
      },

      titlePass: false,
      formPass: false,
      // 弹框
      popOut: false,
      popForm: {
        name: '',
        specs: '',
        count: '',
        remark: '',
        typeId: undefined,
        typeName: '',
        indexNum: ''
      },
      popFormRules: {
        name: [{ required: true, message: '必填项', trigger: 'change' }],
        specs: [{ required: true, message: '必填项', trigger: 'change' }],
        count: [{ required: true, message: '必填项', trigger: 'change' }]
        // typeId: [{ required: true, message: '必填项', trigger: 'change' }]
      },
      // 连续请求
      source: ''
    }
  },
  computed: {
    platform() {
      return this.$store.getters.platform
    }
  },
  created() {
    fetchTypeList({ code: 'buy_order', pageNo: 1, pageSize: 99999 }).then(res => {
      this.purchaseTypeList = res.data.list
    })
    fetchTypeList({ code: this.code, pageNo: 1, pageSize: 99999 }).then(res => {
      this.typeList = res.data.list
    })
    if (this.platform === 'standard') {
      fetchContractList({ pageNo: 1, pageSize: 1000, isUnion: 0 }).then(res => {
        this.contractList = res.data.list
      })
    } else {
      fetchContractList({ pageNo: 1, pageSize: 1000 }).then(res => {
        this.contractList = res.data.list
      })
    }
  },
  methods: {
    handleSubmit() {
      this.titlePass = false
      this.formPass = false
      if (this.editData.buyInfoList.length === 0) {
        this.$message({
          message: '至少新建一条采购需求列表',
          type: 'error'
        })
        return
      } else {
        for (var i = 0; i < this.editData.buyInfoList.length; i++) {
          if (!this.editData.buyInfoList[i].count) {
            this.$message.error({
              message: '采购物品数量不能为空'
            })
            return
          }
        }
        this.titlePass = true
      }
      this.$refs.otherForm.validate((valid) => {
        if (!valid) {
          this.formPass = false
          return false
        } else {
          this.formPass = true
          if (this.titlePass) {
            this.$emit('purchaseEdit')
          }
        }
      })
    },
    handleCancel() {
      this.$refs.otherForm.resetFields()
      this.$emit('cancelEdit')
    },
    typeSelectHandler(event) {
      for (let i = 0; i < this.typeList.length; i++) {
        if (this.typeList[i].id === event) {
          this.popForm.typeName = this.typeList[i].name
        }
      }
    },
    clearPopForm() {
      this.$refs.popForm.resetFields()
      this.popForm = {
        name: '',
        specs: '',
        count: '',
        remark: '',
        typeId: '',
        typeName: '',
        indexNum: ''
      }
    },
    // 提交采购需求信息
    popSubmit(formcount) {
      this.$refs[formcount].validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.popOut = false
          if (this.popForm.indexNum === '') {
            this.editData.buyInfoList.push(deepClone(this.popForm))
          } else {
            Vue.set(this.editData.buyInfoList, this.popForm.indexNum, deepClone(this.popForm))
          }
          this.clearPopForm()
        }
      })
    },
    del(indexNum) {
      this.editData.buyInfoList.splice(indexNum, 1)
    },
    edit(indexNum) {
      this.popOut = true
      console.log(indexNum)
      this.popForm = deepClone(this.editData.buyInfoList[indexNum])
      this.popForm.indexNum = indexNum
    },
    querySearchAsync(queryString, cb) {
      if (this.source !== '') {
        this.source.cancel('cancel')
      }
      this.source = axios.CancelToken.source()
      fetchList({ name: queryString, pageNo: 1, pageSize: 100 }, { cancelToken: this.source.token }).then(res => {
        console.log(res)
        cb(res.data.list.map(item => { return { value: item.name + '　' + item.specs + '　' + item.typeName, name: item.name, specs: item.specs, typeId: item.typeId, typeName: item.typeName } }))
      })
    },
    handleSelect(item) {
      this.popForm.name = item.name
      this.popForm.specs = item.specs
      this.popForm.typeId = item.typeId
      this.popForm.typeName = item.typeName
    }
  }
}
</script>
<style lang="scss">
  .popOut .el-form-item__content{
    .el-autocomplete {
      width: 100%;
    }
    .el-select{
      width: 100%;
      .el-input{
        width: 100%;
      }
    }
  }
</style>
