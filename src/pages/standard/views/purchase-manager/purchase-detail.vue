<template>
  <div v-loading="loading">
    <div v-show="!reedit" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="editData.status | statusTypeFilter" class="title-tag">{{ editData.status | statusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 200px)">{{ editData.buyNo }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="printHandler">打印</el-dropdown-item>
              <el-dropdown-item :disabled="editData.status !== 7" @click.native="reEdit">重新编辑</el-dropdown-item>
              <el-dropdown-item v-if="editData.status === 5 && ($store.getters.roles.includes('admin') || $store.getters.roles.includes('buyApprove'))" @click.native="audit = true">审批</el-dropdown-item>
              <el-dropdown-item :disabled="editData.status === 4 || editData.status === 2" @click.native="changePurchaseStatus(2)">取消</el-dropdown-item>
              <el-dropdown-item v-if="buttonPermissions.includes(deletePurchase)" :disabled="editData.status !== 2 && editData.status !== 7" @click.native="delPurchase">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- ---------------------------------------------审核弹框-------------------------------------------------- -->
        <el-dialog title="采购申请审批" :visible.sync="audit" :close-on-click-modal="false" width="30%">
          <el-form :model="auditForm">
            <el-form-item label="审批意见" label-width="68px">
              <el-input v-model="auditForm.approveRemark" type="textarea" autocomplete="off" placeholder="补充审批意见" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="rejectBuy">拒 绝</el-button>
            <el-button type="primary" @click="passBuy">通 过</el-button>
          </div>
        </el-dialog>
        <div class="container-line-item">
          <span class="detail-form-name">归属项目：</span>
          <span class="detail-form-value link-type" @click="$router.push(`/contract-manager/contract-detail?id=${editData.contractId}`)">{{ editData.contractNo }} {{ editData.contractName }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">总金额(元)：</span>
          <span class="detail-form-value">{{ editData.payMoney | moneyFilter }}</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-name">采购用途：</span>
          <span class="detail-form-value">{{ editData.purpose }}</span>
        </div>
        <div class="container-line-item" style="margin-bottom: 0;">
          <span v-for="column in columnList" :key="column.code" style="margin-bottom: 12px;" class="detail-form-item">
            <span class="detail-form-name">{{ column.name }}：</span>
            <span class="detail-form-value">{{ editData.formData[column.code] }}</span>
          </span>
        </div>
      </div>
      <!-- ----------------------------------采购需求------------------------------------------------- -->
      <div class="cglist">
        <div class="left">
          <div class="num" style="background:#EAEDFD;">01</div>
          <div class="littleCircle" />
          <div class="middle" />
          <svg-icon icon-class="todown" style="color:#E4E7ED;" />
        </div>
        <div class="right">
          <div class="listTitle" style="background: #EAEDFD;">
            <span style="margin-left: 40px;">采购需求</span>
            <svg-icon icon-class="openDown" :class="{toUp:!showBuyNeed}" style="color:#1A4FA1;" @click="showBuyNeed=!showBuyNeed" />
          </div>
          <div v-if="showBuyNeed" class="app-container" style="border: 1px solid #e6ebf5; padding: 12px 6px;">
            <el-table :data="buyData" border fit highlight-current-row style="width: 99%; margin-left: 6px;">
              <el-table-column label="采购编号" prop="buyInfoNo" width="140" align="center" />
              <el-table-column label="物品名称" prop="name" min-width="230" />
              <el-table-column label="类型" prop="typeName" width="120" align="center" />
              <el-table-column label="规格" prop="specs" width="120" align="center" />
              <el-table-column label="数量" prop="count" width="120" align="center" />
              <el-table-column label="备注" prop="remark" min-width="230" align="center" />
            </el-table>
          </div>
        </div>
      </div>
      <!-- ------------------------------------------------------------采购报价--------------------------------------- -->
      <div class="cglist">
        <div class="left">
          <div class="num" :style="{background: editData.status !== 5 && editData.status !== 7 ? '#EAEDFD' : '#E4E7ED'}">02</div>
          <div class="littleCircle" />
          <div class="middle" />
          <svg-icon icon-class="todown" style="color:#E4E7ED;" />
        </div>
        <div class="right">
          <div v-if="editData.status !== 5 && editData.status !== 7">
            <!-- <div class="container-standard"> -->
            <div class="listTitle" style="background: #EAEDFD;">
              <span style="margin-left: 40px;">采购报价</span>
              <svg-icon icon-class="openDown" :class="{toUp:!showBuyPrice}" style="color:#1A4FA1;" @click="showBuyPrice=!showBuyPrice" />
            </div>
            <div v-if="showBuyPrice" style="border: 1px solid #e6ebf5; padding: 12px 6px;">
              <el-table :data="buyData" border fit highlight-current-row style="width: 99%; margin-left: 6px;">
                <el-table-column label="采购编号" prop="buyInfoNo" width="140" align="center" />
                <el-table-column label="物品名称" min-width="230">
                  <template slot-scope="{row}">
                    <span class="link-type" style="cursor: pointer;" @click="showPriceDetail(row)">{{ row.name }}</span>
                    <el-tag v-if="row.type === 4" type="danger">已退货</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="规格" prop="specs" width="120" align="center" />
                <el-table-column label="数量" prop="count" width="120" align="center" />
                <el-table-column label="供应商" prop="supplierName" align="center" />
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
                <el-table-column v-if="buttonPermissions.includes(55)" label="操作" align="center" width="80" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button v-if="row.type !== 3 && row.type !== 4 && editData.status === 6" type="primary" @click="editPriceDetail(row)">
                      编辑
                    </el-button>
                    <el-button v-else type="info" disabled>
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else>
            <div class="listTitle" style="background: #F6F7FB;">
              <span>采购报价</span>
            </div>
            <div class="app-container" style="border: 1px solid #e6ebf5;text-align: center;color: #909399">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- -----------------------------------------编辑报价明细弹框------------------------------------- -->
      <el-dialog class="editPaddingTop" title="编辑报价明细" :visible.sync="priceDetail" :close-on-click-modal="false" width="80%" top="5vh">
        <div style="font-size: 18px; font-weight: 500; margin-bottom: 12px; color: #000;"><span style="margin-right: 16px;">{{ buyDetail.buyInfoNo }}</span><span>{{ buyDetail.name }}</span></div>
        <el-form :inline="true" :model="buyDetail" class="ybr-form-row" label-position="left">
          <el-form-item label="供应商" label-width="74px">
            <div style="position:relative;">
              <el-select ref="specialSelect" v-model="temp" class="specialSelect" @change="selectSupplierHandler">
                <el-option v-for="(item,index) in suppliers" :key="index" :label="item.supplierName" :value="item">
                  <span style="float:left; margin-right:10px;">{{ item.supplierName }}</span>
                  <span style="float:left; margin-right:10px;">{{ item.name }}</span>
                  <span style="float:left;">{{ item.brand }}</span>
                </el-option>
              </el-select>

              <el-autocomplete v-model="buyDetail.supplierName" :fetch-suggestions="querySearchAsync" placeholder="请输入（必填）" class="specialInput" @select="handleSelect" />
              <svg-icon icon-class="supplier" class-name="svgSupplier" @click="changeSpecialSelect" />
            </div>
          </el-form-item>
          <el-form-item label="品牌" label-width="74px">
            <el-input v-model="buyDetail.brand" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="货号" label-width="74px">
            <el-input v-model="buyDetail.itemNo" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="原价(元)" label-width="74px">
            <el-input v-model="buyDetail.originPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="采购价(元)" label-width="74px">
            <el-input v-model="buyDetail.buyPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="税率(%)" label-width="74px">
            <el-input v-model="buyDetail.taxRate" type="number" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="账期(天)" label-width="74px">
            <el-input v-model="buyDetail.itemDate" type="number" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="联系人" label-width="74px">
            <el-input v-model="buyDetail.contactName" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="联系方式" label-width="74px">
            <el-input v-model="buyDetail.contactPhone" placeholder="请输入（必填）" />
          </el-form-item>
        </el-form>
        <div class="container-line-title">
          <span class="detail-subtitle">物品详细说明</span>
        </div>
        <!-- ----------------------富文本编辑器----------------------------- -->
        <div class="container-line-item">
          <tinymce v-if="priceDetail" v-model="buyDetail.description" :height="200" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="priceCancel">取 消</el-button>
          <el-button type="primary" @click="priceSubmit">提 交</el-button>
        </div>
      </el-dialog>
      <!-- -----------------------------------------展示报价明细弹框------------------------------------- -->
      <el-dialog title="报价明细" :visible.sync="showPrice" width="80%">
        <div class="container-line-item" style="display: flex;">
          <span style="flex: 1;">
            <span class="detail-form-name1">供应商：</span>
            <span class="detail-form-value">{{ buyDetail.supplierName }}</span>
          </span>
          <span style="flex: 1;">
            <span class="detail-form-name1">品牌：</span>
            <span class="detail-form-value">{{ buyDetail.brand }}</span>
          </span>
        </div>
        <div class="container-line-item" style="display: flex;">
          <span style="flex: 1;">
            <span class="detail-form-name1">货号：</span>
            <span class="detail-form-value">{{ buyDetail.itemNo }}</span>
          </span>
          <span style="flex: 1;">
            <span class="detail-form-name1">原价(元)：</span>
            <span class="detail-form-value">{{ buyDetail.originPrice }}</span>
          </span>
        </div>
        <div class="container-line-item" style="display: flex;">
          <span style="flex: 1;">
            <span class="detail-form-name1">采购价(元)：</span>
            <span class="detail-form-value">{{ buyDetail.buyPrice }}</span>
          </span>
          <span style="flex: 1;">
            <span class="detail-form-name1">税率(%)：</span>
            <span class="detail-form-value">{{ buyDetail.taxRate }}</span>
          </span>
        </div>
        <div class="container-line-item" style="display: flex;">
          <span style="flex: 1;">
            <span class="detail-form-name1">账期(天)：</span>
            <span class="detail-form-value">{{ buyDetail.itemDate }}</span>
          </span>
          <span style="flex: 1;">
            <span class="detail-form-name1">联系人：</span>
            <span class="detail-form-value">{{ buyDetail.contactName }}</span>
          </span>
        </div>
        <div class="container-line-item" style="display: flex;">
          <span style="flex: 1;">
            <span class="detail-form-name1">联系方式：</span>
            <span class="detail-form-value">{{ buyDetail.contactPhone }}</span>
          </span>
        </div>
        <div class="container-line-title" style="margin-top: 30px;">
          <span class="detail-subtitle">物品详细说明</span>
        </div>
        <div class="flex">
          <div style="width:50%; font-size: 14px;" v-html="buyDetail.description" />
        </div>
      </el-dialog>
      <!-- -----------------------------------------入库信息----------------------------------------- -->
      <div class="cglist">
        <div class="left">
          <div class="num" :style="{background: instoreData.length > 0 ? '#EAEDFD' : '#E4E7ED'}">03</div>
        </div>
        <div class="right">
          <div v-if="instoreData.length > 0">
            <div class="listTitle" style="background: #EAEDFD;">
              <span style="margin-left: 40px;">入库信息</span>
              <svg-icon icon-class="openDown" :class="{toUp:!showInStore}" style="color:#1A4FA1;" @click="showInStore=!showInStore" />
            </div>
            <div v-if="showInStore" style="border: 1px solid #e6ebf5; padding: 12px 6px;">
              <el-table :data="instoreData" border fit highlight-current-row style="width: 99%; margin-left: 6px;">
                <el-table-column label="采购编号" prop="buyInfoNo" width="140" align="center" />
                <el-table-column label="物品名称" prop="name" min-width="160" />
                <el-table-column label="数量" prop="count" width="120" align="center" />
                <el-table-column label="入库" width="120" align="center">
                  <template slot-scope="{row}">
                    <span v-if="row.type === 3" style="color: #67C23A;">已入库</span>
                    <span v-if="row.type !== 3 && row.type !== 4">未入库</span>
                    <span v-if="row.type === 4" style="color: #F56C6C;">已退货</span>
                  </template>
                </el-table-column>
                <el-table-column label="库存编号" width="240" align="center">
                  <template slot-scope="{row}">
                    <span v-if="row.type === 3">{{ row.storeNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="新库存数量" width="150" align="center">
                  <template slot-scope="{row}">
                    <span v-if="row.type === 3">{{ row.storeCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="新库存单价(元)" width="150" align="center">
                  <template slot-scope="{row}">
                    <span v-if="row.type === 3">{{ row.storePrice | moneyFilter }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="buttonPermissions.includes(56)" label="操作" align="center" width="150" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button v-if="row.type !== 3 && row.type !== 4 && editData.status === 6" type="success" @click="enterStore(row.id)">
                      入库
                    </el-button>
                    <el-button v-else type="info" disabled>
                      入库
                    </el-button>
                    <el-button v-if="row.type === 3" type="danger" @click="salesReturn(row.id)">
                      退货
                    </el-button>
                    <el-button v-else type="info" disabled>
                      退货
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div v-else>
            <div class="listTitle" style="background: #F6F7FB;">
              <span>入库信息</span>
            </div>
            <div class="app-container" style="border: 1px solid #e6ebf5;text-align: center;color: #909399">暂无数据</div>
          </div>
        </div>
      </div>
      <!-- -----------------------------------------流程节点----------------------------------------- -->
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">流程节点</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <!-- ---------------------------------------------重新编辑-------------------------------------------------- -->
    <purchase-establish v-if="reedit" :edit-data.sync="transfer" :column-list="columnList" @purchaseEdit="purchaseEdit" @cancelEdit="cancelEdit" />
  </div>
</template>
<script>
import { print } from '@/utils/print'
import axios from 'axios'
import { deepClone } from '@/utils'
import PurchaseEstablish from '@/views/purchase-manager/components/purchase-establish'
import Tinymce from '@/components/Tinymce'
import { fetchColumnList } from '@/api/form'
import { fetchList } from '@/api/supplier'
import OperateLog from '@/components/operateLog'
import { parseTime } from '@/utils'
import { moneyFilter } from '@/filters'
import { getPurchaseDetail, queryPurchaseDemand, querycommonProduct, editPriceInfo, updatePriceStatus, updatePurchaseStatus, deletePurchase, editPurchaseForm } from '@/api/purchase'
export default {
  name: 'PurchaseDetail',
  components: { Tinymce, PurchaseEstablish, OperateLog },
  data() {
    return {
      loading: false,
      showEdit: false,
      editData: {
        id: '',
        status: 0,
        name: '',
        Contractd: '',
        typeId: '',
        curId: '',
        level: '',
        planStartTime: '',
        planEndTime: '',
        // 富文本编辑框内容
        content: '',
        formData: {}
      },
      // 采购需求列表数据
      buyData: [],
      // 审核弹框
      audit: false,
      // 审核弹框数据
      auditForm: {
        approveRemark: ''
      },
      // 编辑报价明细弹框
      priceDetail: false,
      // 展示报价明细弹框
      showPrice: false,
      // 报价明细数据
      buyDetail: {
        supplierName: '',
        brand: '',
        itemNo: '',
        originPrice: '',
        buyPrice: '',
        taxRate: '',
        itemDate: '',
        contactName: '',
        contactPhone: '',
        description: ''
      },
      temp: '',
      // 重新编辑
      reedit: false,
      // 重新编辑数据中转
      transfer: {},
      // 供应商列表
      suppliers: [],
      // 任务日志
      activities: [],
      // 自定义字段
      columnList: [],
      code: 'buy_order',
      // 连续请求
      source: '',
      showBuyNeed: true,
      showBuyPrice: true,
      showInStore: true
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
    // 删除采购
    deletePurchase() {
      return this.buttonPermission[this.platform].deletePurchase
    },
    // 编辑报价
    editPrice() {
      return this.buttonPermission[this.platform].editPrice
    },
    // 入库 退货
    inStore() {
      return this.buttonPermission[this.platform].inStore
    },
    instoreData() {
      if (this.buyData) {
        return this.buyData.filter(item => {
          return item.type !== 1 && item.type !== 0
        })
      }
      return []
    },
    userName() {
      return this.$store.state.user.name
    }
  },
  created() {
    this.purchaseDetail()
  },
  methods: {
    printHandler() {
      let printHtml = `<div style="font-size: 18px; font-weight: bold; letter-spacing: 2px; text-align: center; line-height: 60px;">
          采购申请
        </div>
        <table style="width: 100%; font-size: 12px; border-collapse: collapse;" border="1" cellspacing="0">
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">采购单号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.buyNo}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">申请人</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createName}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">归属项目</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.contractName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">项目编号</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.contractNo}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">采购用途</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="6">${this.editData.purpose}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">创建时间</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.createTime}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">修改时间</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="2">${this.editData.updateTime}</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd; text-align: center;" colspan="8">采购信息</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">名称</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">类型</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">规格</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">数量</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">供应商</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">金额</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">总额</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">备注</td>
          </tr>`
      let totalPrice = 0
      for (let i = 0; i < this.buyData.length; i++) {
        printHtml += `<tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].name}${this.buyData[i].type === 4 ? '(已退货)' : ''}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].typeName}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].specs}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].count}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].supplierName ? this.buyData[i].supplierName : ''}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${moneyFilter(this.buyData[i].buyPrice)}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${moneyFilter(this.buyData[i].buyPrice * this.buyData[i].count)}</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="1">${this.buyData[i].remark}</td>
          </tr>`
        if (this.buyData[i].type !== 4) {
          totalPrice += this.buyData[i].buyPrice * this.buyData[i].count
        }
      }
      printHtml += `<tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd; text-align: center;" colspan="8">费用</td>
          </tr>
          <tr>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="4">总金额</td>
            <td style="padding: 3px 5px; border: 1px solid #dddddd;" colspan="4">${moneyFilter(totalPrice)}</td>
          </tr>
        </table>
        <div style="margin-top: 10px;">
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印人：${this.userName}</div>
          <div style="display: inline-block; width: 40vw; font-size: 10px;">打印时间：${parseTime(new Date())}</div>
        </div>`
      print(printHtml)
    },
    async purchaseDetail() {
      const blankFormData = {}
      this.loading = true
      const columnRes = await fetchColumnList({ code: this.code })
      this.columnList = columnRes.data.list
      this.columnList.forEach(element => {
        blankFormData[element.id] = ''
      })
      const urlId = this.$route.query.id
      const detailRes = await getPurchaseDetail({ id: urlId })
      if (!detailRes.data.buy.enable) {
        this.$message.error('该采购单已被删除')
        setTimeout(() => {
          this.$emit('closeme', { name: this.$options.name, path: this.$route.path })
        }, 1000)
        this.loading = false
        return
      }
      this.editData = detailRes.data.buy
      this.editData.formData = Object.assign(blankFormData, JSON.parse(this.editData.formData))
      this.activities = detailRes.data.log
      const buyDataRes = await queryPurchaseDemand({ buyId: urlId })
      this.buyData = buyDataRes.data.list
      this.loading = false
    },
    // 删除采购订单
    delPurchase() {
      this.$confirm('删除该采购单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePurchase({ id: this.editData.id }).then(res => {
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
    // 修改采购订单状态
    changePurchaseStatus(statusNo) {
      updatePurchaseStatus({ id: this.editData.id, status: statusNo, approveRemark: this.auditForm.approveRemark }).then(res => {
        if (res.code === 200) {
          this.purchaseDetail()
        }
      })
    },
    // 通过审批
    passBuy() {
      this.audit = false
      this.changePurchaseStatus(6)
      this.auditForm.approveRemark = ''
    },
    // 拒绝审批
    rejectBuy() {
      this.audit = false
      this.changePurchaseStatus(7)
      this.auditForm.approveRemark = ''
    },
    // 编辑报价明细
    editPriceDetail(buyDetail) {
      this.priceDetail = true
      this.buyDetail = {
        id: buyDetail.id,
        name: buyDetail.name,
        buyInfoNo: buyDetail.buyInfoNo,
        supplierName: buyDetail.supplierName,
        brand: buyDetail.brand,
        itemNo: buyDetail.itemNo,
        originPrice: buyDetail.originPrice ? buyDetail.originPrice / 100 : '',
        buyPrice: buyDetail.buyPrice ? buyDetail.buyPrice / 100 : '',
        taxRate: buyDetail.taxRate,
        itemDate: buyDetail.itemDate,
        contactName: buyDetail.contactName,
        contactPhone: buyDetail.contactPhone,
        description: buyDetail.description
      }
      querycommonProduct({ name: buyDetail.name, pageSize: 9999, pageNo: 1 }).then(res => {
        this.suppliers = res.data.list
      })
    },
    // 展示报价明细
    showPriceDetail(buyDetail) {
      this.showPrice = true
      this.buyDetail = {
        id: buyDetail.id,
        name: buyDetail.name,
        supplierName: buyDetail.supplierName,
        brand: buyDetail.brand,
        itemNo: buyDetail.itemNo,
        originPrice: buyDetail.originPrice ? buyDetail.originPrice / 100 : '',
        buyPrice: buyDetail.buyPrice ? buyDetail.buyPrice / 100 : '',
        taxRate: buyDetail.taxRate,
        itemDate: buyDetail.itemDate,
        contactName: buyDetail.contactName,
        contactPhone: buyDetail.contactPhone,
        description: buyDetail.description
      }
    },
    // 取消编辑报价明细
    priceCancel() {
      this.priceDetail = false
    },
    selectSupplierHandler(event) {
      this.buyDetail.name = event.name
      this.buyDetail.supplierName = event.supplierName
      this.buyDetail.brand = event.brand
      this.buyDetail.itemNo = event.itemNo
      this.buyDetail.originPrice = event.originPrice / 100
      this.buyDetail.buyPrice = event.buyPrice / 100
      this.buyDetail.taxRate = event.taxRate
      this.buyDetail.itemDate = event.itemDate
      this.buyDetail.contactName = event.contactName
      this.buyDetail.contactPhone = event.contactPhone
    },
    // 提交编辑报价明细
    priceSubmit() {
      if (!this.buyDetail.supplierName) {
        this.$message.error('请输入供应商')
        return
      }
      if (!this.buyDetail.brand) {
        this.$message.error('请输入品牌')
        return
      }
      if (!this.buyDetail.itemNo) {
        this.$message.error('请输入货号')
        return
      }
      if (!this.buyDetail.originPrice) {
        this.$message.error('请输入原价')
        return
      }
      var reg = /^\d+(\.\d+)?$/
      if (!reg.test(this.buyDetail.originPrice)) {
        this.$message.error('原价必须为数字')
        return
      }
      if (!this.buyDetail.buyPrice) {
        this.$message.error('请输入采购价')
        return
      }
      if (!reg.test(this.buyDetail.buyPrice)) {
        this.$message.error('采购价必须为数字')
        return
      }
      if (!this.buyDetail.taxRate) {
        this.$message.error('请输入税率')
        return
      }
      if (!this.buyDetail.itemDate) {
        this.$message.error('请输入账期')
        return
      }
      if (!this.buyDetail.contactName) {
        this.$message.error('请输入联系人')
        return
      }
      if (!this.buyDetail.contactPhone) {
        this.$message.error('请输入联系方式')
        return
      }
      this.priceDetail = false
      if (this.buyDetail.originPrice) {
        this.buyDetail.originPrice = this.buyDetail.originPrice * 100
      }
      if (this.buyDetail.buyPrice) {
        this.buyDetail.buyPrice = this.buyDetail.buyPrice * 100
      }
      editPriceInfo(this.buyDetail).then(res => {
        if (res.code === 200) {
          this.changePriceStatus(this.buyDetail.id, 2)
        }
      })
    },
    // 修改报价信息状态
    changePriceStatus(id, statusNo) {
      updatePriceStatus({ id, status: statusNo }).then(res => {
        if (res.code === 200) {
          this.purchaseDetail()
        }
      })
    },
    // 入库
    enterStore(id) {
      this.changePriceStatus(id, 3)
      this.purchaseDetail()
    },
    // 重新编辑
    reEdit() {
      this.editData.buyInfoList = this.buyData
      this.transfer = deepClone(this.editData)
      this.reedit = true
    },
    purchaseEdit() {
      this.transfer.formData = JSON.stringify(this.transfer.formData)
      editPurchaseForm(this.transfer).then(res => {
        if (res.code === 200) {
          this.reedit = false
          this.changePurchaseStatus(5)
        }
      })
    },
    cancelEdit() {
      this.reedit = false
    },
    // 确认退货
    salesReturn(id) {
      this.$confirm('确认退货吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changePriceStatus(id, 4)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleSelect(item) {
      this.buyDetail.itemDate = item.itemDate
      this.buyDetail.contactName = item.contactName
      this.buyDetail.contactPhone = item.contactPhone
    },
    querySearchAsync(queryString, cb) {
      if (this.source !== '') {
        this.source.cancel('cancel')
      }
      this.source = axios.CancelToken.source()
      fetchList({ name: queryString, pageNo: 1, pageSize: 100 }, { cancelToken: this.source.token }).then(res => {
        cb(res.data.list.map(item => { return { value: item.name, itemDate: item.itemDate, contactName: item.contactName, contactPhone: item.contactPhone } }))
      })
    },
    changeSpecialSelect() {
      this.$refs.specialSelect.visible = true
    }
  }
}
</script>
<style lang="scss" scope>
  @import "~@/styles/variables.scss";
  .specialInput {
    position: absolute;
    top:0;
    left:0;
    width:calc(100% - 30px);
    .el-input__inner {
      border: none;
      margin: 1px;
      height: 30px;
    }
  }
  .svgSupplier {
    position: absolute;
    top: 9px;
    right: 8px;
    cursor: pointer;
  }
  .svgSupplier:hover {
    color: $light-blue;
  }
  .specialSelect {
    .el-input__suffix {
      opacity: 0;
    }
  }
  .cglist{
    display: flex;
    .left{
      display: flex;
      flex-direction: column;
      align-items: center;
      .num{
        width: 44px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-size:24px;
        font-weight:bold;
        border-radius: 50%;
        margin-bottom: 2px;
      }
      .middle{
        flex: 1;
        height: 100%;
        width: 1px;
        border-left: 4px dotted #E4E7ED;
      }
      .littleCircle{
        background: #E4E7ED;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
    .right{
      padding-bottom: 40px;
      margin-left: 10px;
      flex: 1;
      .listTitle{
        height: 44px;
        line-height: 44px;
        text-align: center;
        span{
          color:rgba(0,105,227,1);
          font-size:16px;
          font-weight: 700;
        }
        svg{
          width: 20px;
          height: 20px;
          float: right;
          margin: 12px;
          cursor:pointer;
        }
        .toUp{
          transform:rotate(180deg);
        }
      }
    }
  }
</style>
<style lang="scss">
  .editPaddingTop .el-dialog__body {
    padding-top: 0px;
  }
</style>
