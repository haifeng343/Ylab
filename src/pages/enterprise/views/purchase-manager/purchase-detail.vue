<template>
  <div v-loading="loading">
    <div v-show="reedit === 0" class="app-container">
      <div class="container-standard">
        <div class="container-line-title">
          <el-tag :type="editData.status | statusTypeFilter" class="title-tag">{{ editData.status | statusFilter }}</el-tag>
          <span class="detail-title" style="width: calc(100% - 424px)">{{ editData.buyNo }}</span>
          <el-dropdown trigger="click" class="container-line-button">
            <el-button type="primary">
              <div style="height: 12px;">操作<i class="el-icon-arrow-down el-icon--right" /></div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="printHandler">打印</el-dropdown-item>
              <el-dropdown-item :disabled="editData.status !== 7" @click.native="reEdit">重新编辑</el-dropdown-item>
              <el-dropdown-item v-if="editData.status === 5 && permitBtn" @click.native="audit = true">审批</el-dropdown-item>
              <el-dropdown-item v-if="editData.status === 8 && canApprovePrice" @click.native="audit = true">审核</el-dropdown-item>
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
          <div v-if="showBuyNeed" style="border: 1px solid #e6ebf5; padding: 12px 6px;">
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
                <el-table-column v-if="buttonPermissions.includes(editPrice)" label="操作" align="center" width="184" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button v-if="row.type !== 3 && row.type !== 4 && editData.status === 6 || row.type !== 3 && row.type !== 4 && editData.status === 10 || row.type !== 3 && row.type !== 4 && editData.status === 9 && !row.supplierId" type="primary" @click="editPriceDetail(row)">
                      编辑
                    </el-button>
                    <el-button v-else type="info" disabled>
                      编辑
                    </el-button>
                    <el-button v-if="row.type === 2 && editData.status === 9 && row.canPayment || row.type === 2 && priceFlows.length === 0 && row.canPayment" type="primary" @click="openPayDialog(row)">
                      申请付款
                    </el-button>
                    <!-- <el-button type="primary" @click="openPayDialog(row)">
                      申请付款
                    </el-button> -->
                    <el-button v-else type="info" disabled>
                      申请付款
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
      <!-- <el-dialog title="编辑报价明细" :visible.sync="priceDetail" :close-on-click-modal="false" width="80%" top="5vh">
        <el-form :inline="true" :model="buyDetail" class="ybr-form-row" label-position="left">
          <el-form-item label="规格" label-width="74px">
            <el-input v-model="buyDetail.specs" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="数量" label-width="74px">
            <el-input v-model="buyDetail.count" type="number" placeholder="请输入（必填）" />
          </el-form-item>
        </el-form>
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">最终采购报价</span>
        </div>
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
              <el-tooltip class="item" effect="dark" content="常用采购品" placement="top-start">
                <svg-icon icon-class="buyIcon" class-name="svgSupplier" @click="changeSpecialSelect" />
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="货期(天)" label-width="74px">
            <el-input v-model="buyDetail.goodsDate" type="number" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="采购价(元)" label-width="74px">
            <el-input v-model="buyDetail.buyPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="品牌" label-width="74px">
            <el-input v-model="buyDetail.brand" placeholder="请输入（必填）" />
          </el-form-item>
          <el-form-item label="原价(元)" label-width="74px">
            <el-input v-model="buyDetail.originPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
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
        </div> -->
      <!-- ----------------------富文本编辑器----------------------------- -->
      <!-- <div class="container-line-item">
          <tinymce v-if="priceDetail" v-model="buyDetail.description" :height="200" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="priceCancel">取 消</el-button>
          <el-button type="primary" @click="priceSubmit">提 交</el-button>
        </div>
      </el-dialog> -->
      <!-- -----------------------------------------展示报价明细弹框------------------------------------- -->
      <!-- <el-dialog title="报价明细" :visible.sync="showPrice" width="80%">
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
      </el-dialog> -->
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
                <el-table-column v-if="buttonPermissions.includes(inStore)" label="操作" align="center" width="150" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button v-if="row.type !== 3 && row.type !== 4 && editData.status === 9 || row.type !== 3 && row.type !== 4 && priceFlows.length === 0" type="success" @click="enterStore(row)">
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
      <!-- -----------------------------------------审批流程----------------------------------------- -->
      <div v-if="buyApproveFlows.length > 0 || priceFlows.length > 0">
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">审批流程</span>
        </div>
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane label="采购审批流程" name="buyApprove">
            <div style="padding: 24px 0;">
              <el-steps v-if="buyApproveFlows && buyApproveFlows.length > 0" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in buyApproveFlows" :key="index" icon="el-icon-edit">
                  <template slot="icon">
                    <div class="buyApproveNode">
                      <svg-icon v-if="item.status === 4" icon-class="sucessApprove" />
                      <svg-icon v-else-if="item.status === 3" icon-class="failApprove" />
                      <svg-icon v-else icon-class="awaitApprove" />
                      <div v-if="item.status === 4">审批通过</div>
                      <div v-else-if="item.status === 3">审批拒绝</div>
                      <div v-else>待审批</div>
                    </div>
                  </template>
                  <template slot="title">
                    <div style="margin-top: 20px;">
                      <el-tooltip class="item" effect="dark" :content="item.referEmps" placement="top-start">
                        <el-button v-if="item.status === 4||item.status === 3" type="primary">{{ item.referNames }}</el-button>
                        <el-button v-else type="primary" plain>{{ item.referNames }}</el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-step>
              </el-steps>
              <div v-else>暂无数据</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="采购报价流程" name="priceApprove">
            <div v-if="priceFlows" style="padding: 24px 0;">
              <el-steps v-if="priceFlows && priceFlows.length > 0" :active="1" space="200px" :align-center="true">
                <el-step v-for="(item,index) in priceFlows" :key="index" icon="el-icon-edit">
                  <template slot="icon">
                    <div class="buyApproveNode">
                      <svg-icon v-if="item.status === 4" icon-class="sucessApprove" />
                      <svg-icon v-else-if="item.status === 3" icon-class="failApprove" />
                      <svg-icon v-else icon-class="awaitApprove" />
                      <div v-if="item.status === 4">审批通过</div>
                      <div v-else-if="item.status === 3">审批拒绝</div>
                      <div v-else>待审批</div>
                    </div>
                  </template>
                  <template slot="title">
                    <div style="margin-top: 20px;">
                      <el-tooltip class="item" effect="dark" :content="item.referEmps" placement="top-start">
                        <el-button v-if="item.status === 4||item.status === 3" type="primary">{{ item.referNames }}</el-button>
                        <el-button v-else type="primary" plain>{{ item.referNames }}</el-button>
                      </el-tooltip>
                    </div>
                  </template>
                </el-step>
              </el-steps>
              <div v-else>暂无数据</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- ------------------------------------------------------入库弹窗-------------------------------------------- -->
      <el-dialog title="设置规格弹窗" :visible.sync="showInStoreDialog" :close-on-click-modal="false" width="440px">
        <el-form :model="inStoreSpecs" label-position="left" label-width="80px">
          <el-form-item label="规格1：">
            <span>{{ inStoreData.specs }}</span>
          </el-form-item>
          <el-form-item label="数量：">
            <span>{{ inStoreData.count }}</span>
          </el-form-item>
          <div style="color:#4A90E2; margin-bottom: 8px;">当前物品尚未设置规格2，可在下方快速设置</div>
          <el-form-item label="规格2">
            <el-input v-model="inStoreSpecs.useSpecs" placeholder="输入规格定义" />
          </el-form-item>
          <el-form-item label="换算">
            <div style="display: flex;">
              <span style="width: 72px;">规格1=&nbsp;</span>
              <el-input v-model="inStoreSpecs.conversion" type="number" />
              <span style="width: 72px;">&nbsp;规格2</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <span class="link-type" @click="noUseSpecsEnterStore">暂不设置，先入库</span>
          <el-button type="primary" @click="useSpecsEnterStore">确 定</el-button>
        </div>
      </el-dialog>
      <!-- -----------------------------------------流程节点----------------------------------------- -->
      <div class="container-line-title" style="margin-top:20px;">
        <span class="detail-subtitle">流程节点</span>
      </div>
      <OperateLog :activities="activities" />
    </div>
    <!-- ---------------------------------------------重新编辑-------------------------------------------------- -->
    <purchase-establish v-if="reedit === 1" :edit-data.sync="transfer" :column-list="columnList" @purchaseEdit="purchaseEdit" @cancelEdit="cancelEdit" />
    <div v-if="reedit === 2">
      <sticky :sticky-top="84" class-name="sub-navbar">
        <el-button @click="priceCancel">取消</el-button>
        <el-button v-if="showSetBuyPriceBtn" type="primary" @click="priceSubmit">提交</el-button>
      </sticky>
      <div class="app-container">
        <div class="container-standard">
          <div style="margin-bottom: 16px;">
            <span class="detail-title">{{ editData.buyNo }}</span>&nbsp;&nbsp;<span class="detail-title">{{ buyDetail.name }}</span>
          </div>
          <el-form :inline="true" :model="buyDetail" class="ybr-form-row" label-position="left">
            <el-form-item label="规格" label-width="74px">
              <el-input v-model="buyDetail.specs" placeholder="请输入（必填）" />
            </el-form-item>
            <el-form-item label="数量" label-width="74px">
              <el-input v-model="buyDetail.count" type="number" placeholder="请输入（必填）" />
            </el-form-item>
          </el-form>
        </div>
        <div class="container-line-title" style="margin-top:20px;">
          <span class="detail-subtitle">采购报价</span>
        </div>
        <div class="buyPrice">
          <div class="header">
            <div><span style="color: red;">*</span><span>最终采购报价</span></div>
            <svg-icon icon-class="openDown" :class="{toUp:!showFirstBuyData}" style="color:#1A4FA1;" @click="showFirstBuyData=!showFirstBuyData" />
          </div>
          <div v-if="showFirstBuyData" class="app-container">
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
                  <el-tooltip class="item" effect="dark" content="常用采购品" placement="top-start">
                    <svg-icon icon-class="buyIcon" class-name="svgSupplier" @click="changeSpecialSelect" />
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="货期(天)" label-width="74px">
                <el-input v-model="buyDetail.goodsDate" type="number" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="采购价(元)" label-width="74px">
                <el-input v-model="buyDetail.buyPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
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
            <div class="container-line-item">
              <tinymce v-if="reedit === 2" v-model="buyDetail.description" :height="200" />
            </div>
          </div>
        </div>
        <div class="buyPrice">
          <div class="header">
            <div><span>其他供应商报价</span></div>
            <svg-icon icon-class="openDown" :class="{toUp:!showSecondtBuyData}" style="color:#1A4FA1;" @click="showSecondtBuyData=!showSecondtBuyData" />
          </div>
          <div v-if="showSecondtBuyData" class="app-container">
            <el-form :inline="true" :model="secondBuyDetail" class="ybr-form-row" label-position="left">
              <el-form-item label="供应商" label-width="74px">
                <div style="position:relative;">
                  <el-select ref="specialSelect" v-model="temp" class="specialSelect" @change="secondSelectSupplierHandler">
                    <el-option v-for="(item,index) in suppliers" :key="index" :label="item.supplierName" :value="item">
                      <span style="float:left; margin-right:10px;">{{ item.supplierName }}</span>
                      <span style="float:left; margin-right:10px;">{{ item.name }}</span>
                      <span style="float:left;">{{ item.brand }}</span>
                    </el-option>
                  </el-select>

                  <el-autocomplete v-model="secondBuyDetail.supplierName" :fetch-suggestions="querySearchAsync" placeholder="请输入（必填）" class="specialInput" @select="secondHandleSelect" />
                  <el-tooltip class="item" effect="dark" content="常用采购品" placement="top-start">
                    <svg-icon icon-class="buyIcon" class-name="svgSupplier" @click="changeSpecialSelect" />
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="货期(天)" label-width="74px">
                <el-input v-model="secondBuyDetail.goodsDate" type="number" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="采购价(元)" label-width="74px">
                <el-input v-model="secondBuyDetail.buyPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="品牌" label-width="74px">
                <el-input v-model="secondBuyDetail.brand" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="货号" label-width="74px">
                <el-input v-model="secondBuyDetail.itemNo" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="原价(元)" label-width="74px">
                <el-input v-model="secondBuyDetail.originPrice" type="tel" :maxlength="7" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="税率(%)" label-width="74px">
                <el-input v-model="secondBuyDetail.taxRate" type="number" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="账期(天)" label-width="74px">
                <el-input v-model="secondBuyDetail.itemDate" type="number" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="联系人" label-width="74px">
                <el-input v-model="secondBuyDetail.contactName" placeholder="请输入（必填）" />
              </el-form-item>
              <el-form-item label="联系方式" label-width="74px">
                <el-input v-model="secondBuyDetail.contactPhone" placeholder="请输入（必填）" />
              </el-form-item>
            </el-form>
            <div class="container-line-title">
              <span class="detail-subtitle">物品详细说明</span>
            </div>
            <div class="container-line-item">
              <tinymce v-if="reedit === 2" v-model="secondBuyDetail.description" :height="200" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ------------------------------------------------------申请付款弹窗-------------------------------------------- -->
    <el-dialog title="申请付款" :visible.sync="showPay" :close-on-click-modal="false" width="660px">
      <div>
        <div style="height: 32px;">
          <el-radio v-model="isOnePay" label="1">单批次</el-radio>
        </div>
        <div style="height: 32px;">
          <el-radio v-model="isOnePay" label="3">多批次</el-radio>
        </div>
        <div style="height: 48px;">
          <span>付款类型&nbsp;&nbsp;&nbsp;</span>
          <el-select v-model="payInfo.typeId" size="mini" filterable clearable placeholder="请选择" style="width:220px;">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </div>
        <div v-for="(item,index) in payInfo.infoList" :key="index" style="height: 48px;">
          <span>批次{{ index + 1 }}金额&nbsp;</span>
          <el-input v-model.number="payInfo.infoList[index].payMoney" type="number" size="mini" style="width:220px;" />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;付款时间&nbsp;</span>
          <el-date-picker v-model="payInfo.infoList[index].planPayTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss" size="mini" placeholder="请选择时间" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeApplayPay">取 消</el-button>
        <el-button type="primary" @click="sendApplayPay">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from '@/components/Sticky'
import axios from 'axios'
import { deepClone } from '@/utils'
import PurchaseEstablish from '@/views/purchase-manager/components/purchase-establish'
import Tinymce from '@/components/Tinymce'
import { fetchColumnList, fetchTypeList } from '@/api/form'
import { fetchList } from '@/api/supplier'
import OperateLog from '@/components/operateLog'
import { getPurchaseDetail, queryPurchaseDemand, querycommonProduct, editPriceInfo, updatePriceStatus, updatePurchaseStatus, deletePurchase, editPurchaseForm } from '@/api/purchase'
import { editStore } from '@/api/store'
import { applayPay } from '@/api/paying'
import { parseTime } from '@/utils'
import { moneyFilter } from '@/filters'
import { print } from '@/utils/print'
import { getSecondStorage } from '@/api/purchase'
export default {
  name: 'PurchaseDetail',
  components: { Tinymce, PurchaseEstablish, OperateLog, Sticky },
  data() {
    return {
      loading: false,
      showEdit: false,
      permitBtn: null,
      canApprovePrice: false,
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
      // 展示报价明细弹框
      showPrice: false,
      // 报价明细数据
      showFirstBuyData: true,
      showSecondtBuyData: false,
      buyDetail: {
        specs: '',
        count: 0,
        supplierName: '',
        brand: '',
        itemNo: '',
        originPrice: '',
        buyPrice: '',
        taxRate: '',
        itemDate: '',
        contactName: '',
        contactPhone: '',
        description: '',
        goodsDate: ''
      },
      secondBuyDetail: {
        supplierName: '',
        brand: '',
        buyId: '',
        itemNo: '',
        originPrice: '',
        buyPrice: '',
        taxRate: '',
        itemDate: '',
        contactName: '',
        contactPhone: '',
        description: '',
        goodsDate: '',
        type: 7
      },
      showSetBuyPriceBtn: false,
      temp: '',
      // 重新编辑
      reedit: 0,
      // 重新编辑数据中转
      transfer: {},
      // 供应商列表
      suppliers: [],
      // 任务日志
      activities: [],
      isShowDefault: true,
      // 自定义字段
      columnList: [],
      code: 'buy_order',
      // 连续请求
      source: '',
      showBuyNeed: true,
      showBuyPrice: true,
      showInStore: true,
      activeName: 'buyApprove',
      buyApproveFlows: [],
      priceFlows: [],
      showInStoreDialog: false,
      inStoreData: {
        specs: '',
        count: 0
      },
      inStoreSpecs: {
        useSpecs: '',
        conversion: undefined,
        id: ''
      },
      showPay: false,
      isOnePay: '1',
      typeList: [],
      payInfo: {
        typeId: undefined,
        deptId: undefined,
        relationType: 2,
        relationId: '',
        payMoney: undefined,
        infoList: [{
          payMoney: undefined,
          planPayTime: undefined
        }]
      }
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
  watch: {
    isOnePay(data) {
      if (data === '1') {
        this.payInfo.infoList.length = 1
      } else {
        for (let i = 0; i < data; i++) {
          this.payInfo.infoList.push({
            payMoney: undefined,
            planPayTime: undefined
          })
        }
      }
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
      this.permitBtn = detailRes.data.canApproveBuy
      this.canApprovePrice = detailRes.data.canApprovePrice
      this.editData = detailRes.data.buy
      this.buyApproveFlows = detailRes.data.flows
      this.priceFlows = detailRes.data.priceFlows
      this.editData.formData = Object.assign(blankFormData, JSON.parse(this.editData.formData))
      this.activities = detailRes.data.log
      const buyDataRes = await queryPurchaseDemand({ buyId: urlId })
      this.buyData = buyDataRes.data.list
      this.loading = false
      fetchTypeList({ code: 'buy_pay', pageNo: 1, pageSize: 1000 }).then(res => {
        this.typeList = res.data.list
      })
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
      if (this.editData.status === 5) {
        this.changePurchaseStatus(6)
      } else if (this.editData.status === 8) {
        this.changePurchaseStatus(9)
      }
      this.auditForm.approveRemark = ''
    },
    // 拒绝审批
    rejectBuy() {
      this.audit = false
      if (this.editData.status === 5) {
        this.changePurchaseStatus(7)
      } else if (this.editData.status === 8) {
        this.changePurchaseStatus(10)
      }
      this.auditForm.approveRemark = ''
    },
    // 编辑报价明细
    async editPriceDetail(buyDetail) {
      this.reedit = 2
      this.showSetBuyPriceBtn = true
      this.buyDetail = {
        specs: buyDetail.specs,
        count: buyDetail.count,
        id: buyDetail.id,
        name: buyDetail.name,
        supplierName: buyDetail.supplierName,
        brand: buyDetail.brand,
        itemNo: buyDetail.itemNo,
        goodsDate: buyDetail.goodsDate,
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
      const result = await getSecondStorage({ id: buyDetail.id, type: 7 })
      this.secondBuyDetail.supplierName = result.data.supplierName
      this.secondBuyDetail.goodsDate = result.data.goodsDate
      this.secondBuyDetail.buyPrice = result.data.buyPrice
      this.secondBuyDetail.brand = result.data.brand
      this.secondBuyDetail.itemNo = result.data.itemNo
      this.secondBuyDetail.originPrice = result.data.originPrice
      this.secondBuyDetail.taxRate = result.data.taxRate
      this.secondBuyDetail.itemDate = result.data.itemDate
      this.secondBuyDetail.contactName = result.data.contactName
      this.secondBuyDetail.contactPhone = result.data.contactPhone
      this.secondBuyDetail.description = result.data.description
    },
    // 展示报价明细
    async showPriceDetail(buyDetail) {
      this.reedit = 2
      this.showSetBuyPriceBtn = false
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
        description: buyDetail.description,
        specs: buyDetail.specs,
        count: buyDetail.count,
        goodsDate: buyDetail.goodsDate
      }
      const result = await getSecondStorage({ id: buyDetail.id, type: 7 })
      this.secondBuyDetail.supplierName = result.data.supplierName
      this.secondBuyDetail.goodsDate = result.data.goodsDate
      this.secondBuyDetail.buyPrice = result.data.buyPrice
      this.secondBuyDetail.brand = result.data.brand
      this.secondBuyDetail.itemNo = result.data.itemNo
      this.secondBuyDetail.originPrice = result.data.originPrice
      this.secondBuyDetail.taxRate = result.data.taxRate
      this.secondBuyDetail.itemDate = result.data.itemDate
      this.secondBuyDetail.contactName = result.data.contactName
      this.secondBuyDetail.contactPhone = result.data.contactPhone
      this.secondBuyDetail.description = result.data.description
    },
    // 取消编辑报价明细
    priceCancel() {
      this.reedit = 0
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
      this.buyDetail.goodsDate = event.goodsDate
    },
    secondSelectSupplierHandler(event) {
      this.secondBuyDetail.name = event.name
      this.secondBuyDetail.supplierName = event.supplierName
      this.secondBuyDetail.brand = event.brand
      this.secondBuyDetail.itemNo = event.itemNo
      this.secondBuyDetail.originPrice = event.originPrice / 100
      this.secondBuyDetail.buyPrice = event.buyPrice / 100
      this.secondBuyDetail.taxRate = event.taxRate
      this.secondBuyDetail.itemDate = event.itemDate
      this.secondBuyDetail.contactName = event.contactName
      this.secondBuyDetail.contactPhone = event.contactPhone
      this.secondBuyDetail.goodsDate = event.goodsDate
    },
    // 提交编辑报价明细
    async priceSubmit() {
      if (!this.buyDetail.specs) {
        this.$message.error('请输入规格')
        return
      }
      if (!this.buyDetail.count) {
        this.$message.error('请输入数量')
        return
      }
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
      this.reedit = 0
      if (this.buyDetail.originPrice) { this.buyDetail.originPrice = this.buyDetail.originPrice * 100 }
      if (this.buyDetail.buyPrice) { this.buyDetail.buyPrice = this.buyDetail.buyPrice * 100 }
      const result = await editPriceInfo(this.buyDetail)
      if (result.code === 200) {
        if (this.secondBuyDetail.supplierName) {
          if (this.secondBuyDetail.originPrice) { this.secondBuyDetail.originPrice = this.secondBuyDetail.originPrice * 100 }
          if (this.secondBuyDetail.buyPrice) { this.secondBuyDetail.buyPrice = this.secondBuyDetail.buyPrice * 100 }
          this.secondBuyDetail.buyId = result.data.id
          await editPriceInfo(this.secondBuyDetail)
        }
        this.changePriceStatus(this.buyDetail.id, 2)
      }
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
    enterStore(row) {
      const isDouble = this.$store.state.user.company.isDouble
      if (isDouble && !row.useSpecs) {
        this.showInStoreDialog = true
        this.inStoreSpecs.id = `${row.id}`
        this.inStoreData.specs = row.specs
        this.inStoreData.count = row.count
      } else {
        this.changePriceStatus(row.id, 3)
      }
    },
    noUseSpecsEnterStore() {
      this.changePriceStatus(this.inStoreSpecs.id, 3)
      this.showInStoreDialog = false
    },
    async useSpecsEnterStore(noUseSpecs) {
      if (!this.inStoreSpecs.useSpecs) {
        this.$message.error('请输入规格2')
        return false
      }
      if (!this.inStoreSpecs.conversion) {
        this.$message.error('请输入换算')
        return false
      }
      // this.changePriceStatus(this.inStoreSpecs.id, 3)
      const result = await updatePriceStatus({ id: this.inStoreSpecs.id, status: 3 })
      if (result.code === 200) {
        this.purchaseDetail()
      }
      await editStore(this.inStoreSpecs)
      this.showInStoreDialog = false
    },
    // 重新编辑
    reEdit() {
      this.editData.buyInfoList = this.buyData
      this.transfer = deepClone(this.editData)
      this.reedit = 1
    },
    purchaseEdit() {
      this.transfer.formData = JSON.stringify(this.transfer.formData)
      editPurchaseForm(this.transfer).then(res => {
        if (res.code === 200) {
          this.reedit = 0
          this.changePurchaseStatus(5)
        }
      })
    },
    cancelEdit() {
      this.reedit = 0
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
    secondHandleSelect(item) {
      this.secondBuyDetail.itemDate = item.itemDate
      this.secondBuyDetail.contactName = item.contactName
      this.secondBuyDetail.contactPhone = item.contactPhone
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
    },
    openPayDialog(row) {
      console.log(row)
      this.payInfo.payMoney = row.count * row.buyPrice / 100
      this.payInfo.infoList[0].payMoney = row.count * row.buyPrice / 100
      this.payInfo.relationId = row.id
      this.isOnePay = '1'
      this.showPay = true
    },
    async sendApplayPay() {
      if (!this.payInfo.typeId) {
        this.$message.error('付款类型必须填')
        return
      }
      if (!this.payInfo.infoList[0].payMoney) {
        this.$message.error('付款金额至少填第一行')
        return
      }
      if (!this.payInfo.infoList[0].planPayTime) {
        this.$message.error('付款金额至少填第一行')
        return
      }

      let totalMoney = 0
      this.payInfo.infoList.forEach(item => {
        if (item.payMoney) {
          totalMoney = totalMoney + item.payMoney
        }
      })

      if (totalMoney !== this.payInfo.payMoney) {
        this.$message.error('付款金额和采购单总额不符,请检查重新填写')
        return
      }

      this.payInfo.infoList.forEach(item => {
        if (item.payMoney > 10000000) {
          this.$message.error('批次金额不能大于10000000')
          return
        }
      })

      this.payInfo.infoList.forEach(item => {
        if (item.payMoney) {
          item.payMoney = item.payMoney * 100
        }
      })
      this.payInfo.payMoney = this.payInfo.payMoney * 100
      await applayPay(this.payInfo)
      this.showPay = false
      this.purchaseDetail()
    },
    closeApplayPay() {
      this.showPay = false
      this.isOnePay = '1'
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
      }
    }
  }
  .toUp{
    transform:rotate(180deg);
  }

  .buyApproveNode{
    text-align: center;
    .svg-icon{
      width: 18px;
      height: 18px;
    }
    div{
      color: #909399;
      font-size: 12px;
    }
  }

  .buyPrice{
    border:1px solid rgba(228,231,237,1);
    margin-bottom: 32px;
    .header{
      height:48px;
      background:rgba(246,247,251,1);
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg{
          width: 20px;
          height: 20px;
          cursor:pointer;
        }
    }
  }
</style>
