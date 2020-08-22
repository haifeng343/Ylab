<template>
  <div v-loading="loading">
    <div v-if="!showEdit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <span class="detail-title" style="width: calc(100% - 200px)">【{{ detailData.supplierNo }}】{{ detailData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="edit">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="delSupplier">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">联系人：</span>
            <span class="detail-form-value">{{ detailData.contactName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">联系方式：</span>
            <span class="detail-form-value">{{ detailData.contactPhone }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">账期(天):</span>
            <span class="detail-form-value">{{ detailData.itemDate }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">最近更新：</span>
            <span class="detail-form-value">{{ detailData.updateTime }}</span>
          </span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span class="detail-form-value">{{ detailData.formData[column.code] }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <div class="flex">
            <div class="detail-form-value" style="margin-right: 8px;">简介：</div>
            <div style="flex-grow: 1; font-size: 14px;" class="container-line-item">
              {{ detailData.remark }}
            </div>
          </div>
        </div>
      </div>
      <div style="position: relative;">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane v-if="detailData.id !== ''" label="常用采购品" name="supplierPurchase">
            <keep-alive>
              <supplier-purchase v-if="activeName==='supplierPurchase'" ref="supplierPurchase" :supplier-detail="supplierDetail" />
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane v-if="detailData.id !== ''" label="采购记录" name="supplierPurchaseHistory">
            <keep-alive>
              <supplier-purchase-history v-if="activeName==='supplierPurchaseHistory'" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <el-button
          v-if="activeName==='supplierPurchase'"
          size="mini"
          type="primary"
          style="position: absolute; right: 16px; top: 6px;"
          @click="newProduct = true"
        >
          新建
        </el-button>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <supplier-establish v-if="showEdit" :edit-data="transfer" :column-list="columnList" @supplierEdit="supplierEditHandler" @cancelEdit="cancelEdit" />
    <!-- -----------------------------------新建常用采购品弹框----------------------------- -->
    <el-dialog title="新建常用采购品" :visible.sync="newProduct" :close-on-click-modal="false" width="50%" @close="closePop">
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
              <el-input v-model="popForm.originPrice" type="tel" :maxlength="7" />
            </el-form-item>
            <el-form-item label="采购价(元)" prop="buyPrice" label-width="88px">
              <el-input v-model="popForm.buyPrice" type="tel" :maxlength="7" />
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
import SupplierPurchase from './components/SupplierPurchase'
import SupplierPurchaseHistory from './components/SupplierPurchaseHistory'
import SupplierEstablish from './components/supplier-establish'
import { editSupplier, fetchDetail, deleteSupplier } from '@/api/supplier'
import { editcommonProduct } from '@/api/purchase'
import { fetchColumnList } from '@/api/form'
import { deepClone } from '@/utils'
import OperateLog from '@/components/operateLog'

export default {
  name: 'SupplierDetail',
  components: { SupplierPurchase, SupplierPurchaseHistory, SupplierEstablish, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'supplierPurchase',
      showEdit: false,
      newProduct: false,
      popForm: {
        name: undefined,
        specs: undefined,
        taxRate: undefined,
        itemNo: undefined,
        originPrice: undefined,
        buyPrice: undefined,
        brand: undefined,
        remark: undefined
      },
      detailData: {
        id: '',
        name: '',
        supplierNo: '',
        contactName: '',
        itemDate: '',
        contactPhone: '',
        updateTime: '',
        remark: '',
        formData: {}
      },
      activities: [],
      // 编辑数据中转
      transfer: {},
      // 自定义字段
      columnList: [],
      code: 'supplier',
      rules: {
        name: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
        taxRate: [{ required: true, message: '请输入税率', trigger: 'blur' }],
        originPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }],
        buyPrice: [{ required: true, message: '请输入采购价', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.supplierDetail()
  },
  methods: {
    async supplierDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const urlId = this.$route.query.id
      const detailRes = await fetchDetail({ id: urlId })
      if (!detailRes.data.supplier.enable) {
        this.$message.error('该供应商已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.detailData = detailRes.data.supplier
      this.detailData.formData = Object.assign(blankFormData, JSON.parse(this.detailData.formData))
      this.activities = detailRes.data.log
      this.loading = false
    },
    edit() {
      this.transfer = deepClone(this.detailData)
      this.showEdit = true
    },
    cancelEdit() {
      this.showEdit = false
    },
    supplierEditHandler() {
      const postData = deepClone(this.transfer)
      postData.formData = JSON.stringify(this.transfer.formData)
      editSupplier(postData).then(res => {
        if (res.code === 200) {
          this.showEdit = false
          this.supplierDetail()
        }
      })
    },
    delSupplier() {
      this.$confirm('删除该供应商', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier({ id: this.$route.query.id }).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            setTimeout(() => {
              this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
            }, 1000)
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
          this.popForm.supplierId = this.detailData.id
          if (this.popForm.originPrice) {
            this.popForm.originPrice = this.popForm.originPrice * 100
          }
          if (this.popForm.buyPrice) {
            this.popForm.buyPrice = this.popForm.buyPrice * 100
          }
          editcommonProduct(this.popForm).then(res => {
            if (res.code === 200) {
              this.$refs.supplierPurchase.getList()
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
            }
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
