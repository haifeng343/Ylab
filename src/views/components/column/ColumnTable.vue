<template>
  <div>
    <el-table
      v-loading="delLoading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :data="columnList"
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="字段名称" min-width="400" />
      <el-table-column label="字段类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type | columnTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统自带" align="center">
        <template slot-scope="{row}">
          <span>{{ row.inherent ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否必填" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isNotNull ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.name === '规格' && $store.state.app.platform === 'enterprise'" type="primary" @click="showSetSpecs = true">编辑</el-button>
          <el-button v-if="row.isType" type="primary" @click="editTypeHandler(row)">编辑</el-button>
          <el-button v-if="!row.inherent" type="primary" @click="editColumnHandler(row)">编辑</el-button>
          <el-button v-if="!row.inherent" type="danger" @click="delHandler(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="columnSettingsDialog" :close-on-click-modal="false" title="字段配置" width="500px">
      <el-form ref="form" :model="columnForm" class="ybr-form-col">
        <el-form-item label="字段名称" prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'change' }">
          <el-input v-model="columnForm.name" placeholder="请填写" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-select v-model="columnForm.type" :disabled="columnForm.id" placeholder="请选择">
            <el-option label="文本" value="text" />
            <el-option label="选项" value="select" />
            <el-option label="日期" value="date" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="columnForm.type === 'select'" label="选项" prop="options" :rules="{ required: true, message: '选项不能为空', trigger: 'change'}">
          <el-select v-model="columnForm.options" multiple filterable allow-create default-first-option placeholder="添加选项" />
        </el-form-item>
        <el-form-item v-if="columnForm.type === 'select'" label="是否多选">
          <el-switch v-model="columnForm.isMultiple" />
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch v-model="columnForm.isNotNull" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="endColumnEditing()">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitColumnHandler()">{{ submitLoading?'保存中':'确定' }}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="typeSettingDialog" :close-on-click-modal="false" title="类型设置" width="800px">
      <type-settings ref="typeSettings" :code="code" @typeChanged="$emit('typeChanged')" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTypeHandler">新建</el-button>
        <el-button @click="typeSettingDialog=false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 设置规格 -->
    <el-dialog :visible.sync="showSetSpecs" :close-on-click-modal="false" title="编辑规格" width="250px">
      <el-form :model="doubleSpecs">
        <el-checkbox v-model="doubleSpecs.isDouble">使用双规格</el-checkbox>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSpecs">提交</el-button>
        <el-button @click="showSetSpecs = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import ColumnSettings from '@/views/components/column/ColumnSettings.vue'
import TypeSettings from '@/views/components/column/TypeSettings.vue'
import { editColumn, delColumn } from '@/api/form'
import { setDoubleSpecs } from '@/api/store'
export default {
  name: 'ColumnTable',
  components: { TypeSettings },
  props: {
    columnList: {
      type: Array,
      default: function() {
        return []
      }
    },
    code: {
      type: String,
      default: 'task'
    }
  },
  data() {
    return {
      typeSettingDialog: false,
      columnSettingsDialog: false,
      columnForm: {
        isNotNull: false,
        type: 'text',
        isMultiple: false,
        options: []
      },
      submitLoading: false,
      delLoading: false,
      showSetSpecs: false,
      doubleSpecs: {
        isDouble: false
      }
    }
  },
  mounted() {
    this.doubleSpecs.isDouble = this.$store.state.user.company.isDouble
    console.log(this.doubleSpecs.isDouble)
    console.log(this.$store.state.user.company.isDouble)
  },
  methods: {
    addTypeHandler() {
      this.$refs.typeSettings.addTypeHandler()
    },
    editTypeHandler(row) {
      this.columnForm.isNotNull = row.isNotNull
      this.typeSettingDialog = true
    },
    newColumn() {
      this.columnForm = {
        id: undefined,
        name: '',
        type: 'text',
        isMultiple: false,
        options: [],
        isNotNull: false
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.columnSettingsDialog = true
    },
    editColumnHandler(row) {
      this.columnForm = JSON.parse(JSON.stringify(row))
      this.columnForm.code = this.code
      if (!this.columnForm.options || this.columnForm.options === '') {
        this.columnForm.options = []
      } else {
        this.columnForm.options = this.columnForm.options.split(',')
      }
      this.columnSettingsDialog = true
    },
    submitColumnHandler() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          editColumn(Object.assign({ code: this.code }, this.columnForm)).then(response => {
            if (this.columnForm.id) {
              for (let i = 0; i < this.columnList.length; i++) {
                if (this.columnList[i].id === this.columnForm.id) {
                  Object.assign(this.columnList[i], response.data)
                  break
                }
              }
            } else {
              this.columnList.push(response.data)
            }
            setTimeout(() => {
              this.submitLoading = false
              this.endColumnEditing()
              this.$message.success('操作成功')
            }, 0.2 * 1000)
          })
        } else {
          return false
        }
      })
    },
    endColumnEditing() {
      this.columnSettingsDialog = false
      this.columnForm = {}
    },
    delHandler(id) {
      this.$confirm('确定删除该字段?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delLoading = true
        delColumn({ id }).then(response => {
          setTimeout(() => {
            this.delLoading = false
            for (let i = 0; i < this.columnList.length; i++) {
              if (this.columnList[i].id === id) {
                this.columnList.splice(i, 1)
              }
            }
            this.$message({ type: 'success', message: '删除成功!' })
          }, 0.2 * 1000)
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    async setSpecs() {
      this.showSetSpecs = false
      const result = await setDoubleSpecs(this.doubleSpecs)
      if (result.code === 200) {
        this.$message.success('提交成功')
      }
    }
  }
}

</script>
