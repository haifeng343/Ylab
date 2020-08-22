<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag v-if="detailData.storeCount && detailData.storeCount !== 0" type="success" class="title-tag">有货</el-tag>
          <el-tag v-else type="danger" class="title-tag">无货</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">【{{ detailData.storeNo }}】{{ detailData.name }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push({path:`/store-manager/store-create`, query: { id: $route.query.id, name: detailData.name, typeId: detailData.typeId, specs: detailData.specs, formData: detailData.formData }})">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="$router.push(`/purchase-manager/purchase-create?name=${detailData.name}&specs=${detailData.specs}&typeName=${detailData.typeName}&typeId=${detailData.typeId}`)">采购</el-dropdown-item>
              <el-dropdown-item @click.native="receivePermit = true">出库</el-dropdown-item>
              <el-dropdown-item @click.native="delStoreProduct">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">类型：</span>
            <span class="detail-form-value">{{ detailData.typeName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">规格：</span>
            <span class="detail-form-value">{{ detailData.specs }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">数量：</span>
            <span class="detail-form-value">{{ detailData.storeCount }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">单价(元)：</span>
            <span class="detail-form-value">{{ detailData.storePrice | moneyFilter }}</span>
          </span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span v-if="detailData.formData" class="detail-form-value">{{ detailData.formData[column.code] }}</span>
          </span>
        </div>
      </div>
      <div style="position: relative;">
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="入库记录" name="inStore">
            <in-store-record v-if="activeName==='inStore' && detailData.storeNo" ref="inStore" :store-no="detailData.storeNo" />
          </el-tab-pane>
          <el-tab-pane label="出库记录" name="outStore">
            <keep-alive>
              <out-store-record v-if="activeName==='outStore' && detailData.storeNo" :store-no="detailData.storeNo" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <el-button
          v-if="buttonPermissions.includes(storeNew) && activeName==='inStore'"
          size="mini"
          type="primary"
          style="position: absolute; right: 16px; top: 6px;"
          @click="newStore = true"
        >
          新建
        </el-button>
      </div>
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">操作日志</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <!-- -----------------------------------------------------新建入库弹框------------------------------------------ -->
    <el-dialog title="新建入库" :visible.sync="newStore" :close-on-click-modal="false" width="400px">
      <el-form ref="bank" :model="bank" :rules="rules" label-position="left" label-width="80px">
        <el-form-item label="入库数量" prop="count">
          <el-input v-model="bank.count" type="tel" maxlength="7" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="采购价(元)">
          <el-input v-model="bank.buyPrice" type="tel" maxlength="7" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="bank.brand" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="货号" prop="itemNo">
          <el-input v-model="bank.itemNo" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-autocomplete v-model="bank.supplierName" :fetch-suggestions="querySearchAsync" placeholder="请输入" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHandle">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- ------------------------------------------------------领用弹框-------------------------------------------- -->
    <!-- <el-dialog title="领用确认" :visible.sync="receivePermit" :close-on-click-modal="false" width="440px">
      <el-form :model="receive">
        <el-form-item label="领用数量" label-position="top">
          <el-input v-model="receive.count" type="number" />
        </el-form-item>
      </el-form>

      <div style="font-size:14px; color:#77787D;">确认后将对该采购单下所有物品做出库操作。该操作不可恢复！</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReceive">取 消</el-button>
        <el-button type="primary" @click="handleReceive">确 定</el-button>
      </div>
    </el-dialog> -->
    <!-- ------------------------------------------------------出库弹框-------------------------------------------- -->
    <el-dialog title="出库确认" :visible.sync="receivePermit" :close-on-click-modal="false" width="440px">
      <el-form :model="receive" label-position="left" label-width="80px">
        <el-form-item label="归属项目:">
          <el-select v-model="receive.contractId" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option v-for="(item,index) in contractList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库类型"
          :rules="[
            { required: true }
          ]"
        >
          <el-select v-model="receive.type" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option :label="'领用出库'" :value="5" />
            <el-option :label="'其他出库'" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库规格"
          :rules="[
            { required: true, message: '出库规格必须填'}
          ]"
        >
          <el-select v-model="receive.specs" filterable clearable placeholder="请选择" style="width: 320px;">
            <el-option v-for="(item,index) in selectSpecs" :key="index" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="出库数量"
          :rules="[
            { required: true, message: '出库数量必须填'}
          ]"
        >
          <el-input v-model="receive.count" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receivePermit = false">取 消</el-button>
        <el-button type="primary" @click="handleReceive">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import InStoreRecord from '@/views/store-manager/components/inStoreRecord'
import OutStoreRecord from '@/views/store-manager/components/outStoreRecord'
import { fetchList } from '@/api/supplier'
import { queryStoreDetail, addStoreLog, storeReceive } from '@/api/store'
import { fetchColumnList } from '@/api/form'
import { fetchContractList } from '@/api/task'
import OperateLog from '@/components/operateLog'
export default {
  name: 'StoreDetail',
  components: { InStoreRecord, OutStoreRecord, OperateLog },
  data() {
    return {
      loading: true,
      activeName: 'inStore',
      newStore: false,
      receivePermit: false,
      activities: [],
      detailData: {},
      bank: {
        count: undefined,
        buyPrice: undefined,
        brand: undefined,
        itemNo: undefined,
        supplierName: undefined,
        type: 3
      },
      // receive: {
      //   id: undefined,
      //   count: undefined
      // },
      rules: {
        count: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
        brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
        itemNo: [{ required: true, message: '请输入货号', trigger: 'blur' }],
        supplierName: [{ required: true, message: '请输入供应商', trigger: 'blur' }]
      },
      code: 'buy_store',
      columnList: [],
      // 连续请求
      source: '',
      // 出库确认
      receive: {
        id: undefined,
        count: undefined,
        specs: '',
        contractId: '',
        type: ''
      },
      contractList: [],
      selectSpecs: []
    }
  },
  computed: {
    buttonPermissions() {
      return this.$store.getters.buttonPermissions
    },
    platform() {
      return this.$store.getters.platform
    },
    buttonPermission() {
      return this.$store.getters.buttonPermission
    },
    // 新建库存
    storeNew() {
      return this.buttonPermission[this.platform].storeNew
    }
  },
  created() {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
    this.storeDetail()
    this.getReceiveContraList()
  },
  methods: {
    querySearchAsync(queryString, cb) {
      if (this.source !== '') {
        this.source.cancel('cancel')
      }
      this.source = axios.CancelToken.source()
      fetchList({ name: queryString, pageNo: 1, pageSize: 100 }, { cancelToken: this.source.token }).then(res => {
        cb(res.data.list.map(item => { return { value: item.name } }))
      })
    },
    async storeDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const detailRes = await queryStoreDetail({ id: this.$route.query.id, type: 3 })
      this.detailData = detailRes.data.buyInfo
      if (!this.detailData.useSpecs) {
        this.setGuige = true
      }
      this.activities = detailRes.data.logs
      this.detailData.formData = Object.assign(blankFormData, JSON.parse(this.detailData.formData))
      this.loading = false
      if (detailRes.data.buyInfo.specs) { this.selectSpecs[0] = detailRes.data.buyInfo.specs }
    },
    cancelHandle() {
      this.newStore = false
      this.bank = {
        count: undefined,
        buyPrice: undefined,
        brand: undefined,
        itemNo: undefined,
        supplierName: undefined,
        type: 3
      }
    },
    handleSubmit() {
      this.$refs.bank.validate((valid) => {
        if (!valid) {
          return false
        } else {
          if (this.bank.buyPrice) {
            this.bank.buyPrice = this.bank.buyPrice * 100
          }
          this.bank.id = this.detailData.id
          addStoreLog(this.bank).then(res => {
            if (res.code === 200) {
              this.newStore = false
              this.bank = {
                count: undefined,
                buyPrice: undefined,
                brand: undefined,
                itemNo: undefined,
                supplierName: undefined,
                type: 3
              }
              this.storeDetail()
              this.$refs.inStore.getList()
            }
          })
        }
      })
    },
    handleReceive() {
      this.receive.id = this.$route.query.id
      if (!this.receive.type) {
        this.$message.error('请输入出库类型')
        return false
      }
      if (!this.receive.specs) {
        this.$message.error('请输入出库规格')
        return false
      }
      if (!this.receive.count) {
        this.$message.error('请输入出库数量')
        return false
      }
      storeReceive(this.receive).then(res => {
        if (res.code === 200) {
          // this.$message.success('申请成功，请等待审核')
          this.receivePermit = false
          this.storeDetail()
          this.receive.count = undefined
          this.$router.push(`/store-manager/out-store-detail?id=${res.data.id}`)
        }
      })
    },
    // handleReceive() {
    //   this.receive.id = this.$route.query.id
    //   if (!this.receive.count) {
    //     this.$message.error('请输入领用数量')
    //     return false
    //   }
    //   storeReceive(this.receive).then(res => {
    //     if (res.code === 200) {
    //       this.$message.success('申请成功，请等待审核')
    //       this.receivePermit = false
    //       this.storeDetail()
    //       this.receive.count = undefined
    //       this.$router.push(`/store-manager/out-store-detail?id=${res.data.id}`)
    //     }
    //   })
    // },
    // cancelReceive() {
    //   this.receivePermit = false
    //   this.receive.count = undefined
    // },
    delStoreProduct() {
      this.$confirm('此操作将永久删除该物品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getReceiveContraList() {
      fetchContractList({ pageNo: 1, pageSize: 100 }).then(res => {
        this.contractList = res.data.list
      })
    }
  }
}
</script>
