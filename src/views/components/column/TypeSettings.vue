<template>
  <div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="300px" label="选项">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.name" class="edit-input" />
            <el-button class="cancel-btn" type="warning" @click="cancelEdit(row)">
              取消
            </el-button>
          </template>
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
        <template slot-scope="{row}">
          <el-button v-if="row.edit" type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
            确定
          </el-button>
          <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.edit=!row.edit">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { fetchTypeList, addType, editType } from '@/api/form'
import Pagination from '@/components/Pagination'

export default {
  name: 'TypeSettings',
  components: { Pagination },
  props: {
    typeSettingDialog: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: 'task'
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 5,
        code: this.code
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const { data } = await fetchTypeList(this.listQuery)
      this.total = data.total
      this.list = data.list.map(item => {
        this.$set(item, 'edit', false)
        item.originalName = item.name
        return item
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({ message: '取消编辑', type: 'info' })
    },
    confirmEdit(row) {
      row.edit = false
      editType({ id: row.id, name: row.name, code: this.code }).then(() => {
        row.originalName = row.name
        this.$message({ message: '修改成功', type: 'success' })
        this.$emit('typeChanged')
      })
    },
    addTypeHandler() {
      this.$prompt('请输入类型', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (value) => {
          if (!value || value === '') {
            return '类型不能为空'
          }
        }
      }).then(({ value }) => {
        addType({ name: value, code: this.code }).then((response) => {
          if (response.code === 400) {
            this.$message({ type: 'error', message: '已有同名的类型' })
            return
          }
          const data = response.data
          this.list.push({ id: data.id, name: data.name, originalName: data.name, edit: false })
          this.total += 1
          this.$message({ type: 'success', message: '添加成功' })
          this.$emit('typeChanged')
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '取消' })
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 8px;
}
</style>
