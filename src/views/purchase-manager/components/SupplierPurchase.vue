<template>
  <div>
    <el-table
      v-loading="listLoading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="名称" min-width="260">
        <template slot-scope="{row}">
          <span :class="`${row.storeId}?'link-type':''`" @click="linkHandler(row.storeId)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.specs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价(元)" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.originPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购价(元)" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buyPrice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.taxRate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.brand }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.itemNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明" width="160" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" @click="editProduct(row)">
            编辑
          </el-button>
          <el-button type="danger" @click="delProduct(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNo" :limit.sync="listQuery.pageSize" :auto-scroll="false" @pagination="getList" />
    <!-- -----------------------------------编辑常用采购品弹框----------------------------- -->
    <el-dialog title="编辑常用采购品" :visible.sync="newProduct" :close-on-click-modal="false" width="50%" @close="closePop">
      <el-form ref="popForm" :model="popForm" :rules="rules" label-position="left">
        <div style="display: flex;">
          <div style="flex:5;">
            <el-form-item label="物品名称" prop="name" label-width="88px">
              <el-input v-model="popForm.name" />
            </el-form-item>
            <el-form-item label="规格" label-width="88px">
              <el-input v-model="popForm.specs" />
            </el-form-item>
            <el-form-item label="税率(%)" prop="taxRate" label-width="88px">
              <el-input v-model="popForm.taxRate" type="number" />
            </el-form-item>
            <el-form-item label="货号" label-width="88px">
              <el-input v-model="popForm.itemNo" />
            </el-form-item>
          </div>
          <div style="flex:1;" />
          <div style="flex:5;">
            <el-form-item label="原价(元)" prop="originPrice" label-width="88px">
              <el-input v-model="originPrice" type="tel" :maxlength="7" />
            </el-form-item>
            <el-form-item label="采购价(元)" prop="buyPrice" label-width="88px">
              <el-input v-model="buyPrice" type="tel" :maxlength="7" />
            </el-form-item>
            <el-form-item label="品牌" label-width="88px">
              <el-input v-model="popForm.brand" />
            </el-form-item>
            <el-form-item label="说明" label-width="88px">
              <el-input v-model="popForm.remark" placeholder="补充信息" />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="popCancel('popForm')">取 消</el-button>
        <el-button type="primary" @click="popSubmit('popForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { querycommonProduct, editcommonProduct, delcommonProduct } from '@/api/purchase'

export default {
  components: { Pagination },
  props: {
    supplierDetail: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        supplierId: this.$route.query.id,
        pageNo: 1,
        pageSize: 10
      },
      newProduct: false,
      popForm: {
        id: undefined,
        name: undefined,
        specs: undefined,
        taxRate: undefined,
        itemNo: undefined,
        originPrice: undefined,
        buyPrice: undefined,
        brand: undefined,
        remark: undefined
      },
      rules: {
        name: [{ required: true, message: '请输入物品名称', trigger: 'change' }],
        taxRate: [{ required: true, message: '请输入税率', trigger: 'change' }],
        originPrice: [{ required: true, message: '请输入原价', trigger: 'change' }],
        buyPrice: [{ required: true, message: '请输入采购价', trigger: 'change' }]
      }
    }
  },
  computed: {
    originPrice: {
      get() {
        return this.popForm.originPrice / 100
      },
      set(val) {
        this.popForm.originPrice = val * 100
      }
    },
    buyPrice: {
      get() {
        return this.popForm.buyPrice / 100
      },
      set(val) {
        this.popForm.buyPrice = val * 100
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      querycommonProduct(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        setTimeout(() => {
          this.listLoading = false
        }, 0.2 * 1000)
      })
    },
    linkHandler(storeId) {
      if (storeId) {
        this.$router.push(`/store-manager/store-detail?id=${storeId}`)
      }
    },
    editProduct(row) {
      this.newProduct = true
      this.popForm.id = row.id
      this.popForm.name = row.name
      this.popForm.specs = row.specs
      this.popForm.taxRate = row.taxRate
      this.popForm.itemNo = row.itemNo
      this.popForm.originPrice = row.originPrice
      this.popForm.buyPrice = row.buyPrice
      this.popForm.brand = row.brand
      this.popForm.remark = row.remark
    },
    delProduct(row) {
      this.$confirm('删除该常用采购品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delcommonProduct({ id: row.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加常用采购品
    popSubmit(formcount) {
      this.$refs[formcount].validate((valid) => {
        if (!valid) {
          return false
        } else {
          // if (this.popForm.originPrice) {
          //   this.popForm.originPrice = this.popForm.originPrice * 100
          // }
          // if (this.popForm.buyPrice) {
          //   this.popForm.buyPrice = this.popForm.buyPrice * 100
          // }
          editcommonProduct(this.popForm).then(res => {
            if (res.code === 200) {
              this.getList()
              this.popForm = {
                name: undefined,
                specs: undefined,
                taxRate: undefined,
                itemNo: undefined,
                originPrice: undefined,
                buyPrice: undefined,
                brand: undefined,
                remark: undefined
              }
              this.newProduct = false
            }
            this.supplierDetail()
          })
        }
      })
    },
    popCancel(formcount) {
      this.newProduct = false
      this.popForm = {
        name: undefined,
        specs: undefined,
        taxRate: undefined,
        itemNo: undefined,
        originPrice: undefined,
        buyPrice: undefined,
        brand: undefined,
        remark: undefined
      }
    },
    closePop() {
      this.popForm = {
        name: undefined,
        specs: undefined,
        taxRate: undefined,
        itemNo: undefined,
        originPrice: undefined,
        buyPrice: undefined,
        brand: undefined,
        remark: undefined
      }
    }
  }
}
</script>

