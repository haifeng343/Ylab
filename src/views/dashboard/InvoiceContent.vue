<template>
  <div class="app-container">
    <div class="container-standard">
      <div class="container-line-title">
        <span class="detail-title" style="width: calc(100% - 460px)">【 {{ contentData.kpNo }} 】 发票内容</span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">发票号：</span>
          <span class="detail-form-value">{{ contentData.invoiceNo }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">发票类型：</span>
          <span class="detail-form-value">{{ contentData.type }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">开票金额(元)：</span>
          <span class="detail-form-value">{{ contentData.invoiceMoney | moneyFilter }}</span>
        </span>
        <span class="detail-form-item" style="width: 400px;">
          <span class="detail-form-name">开票单位：</span>
          <span class="detail-form-value">{{ contentData.invoiceOrg }}</span>
        </span>
      </div>
      <div class="container-line-item">
        <span class="detail-form-item">
          <span class="detail-form-name">开票日期：</span>
          <span class="detail-form-value">{{ contentData.invoiceDate }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">开票给到日期：</span>
          <span class="detail-form-value">{{ contentData.invoiceReceiveDate }}</span>
        </span>
        <span class="detail-form-item">
          <span class="detail-form-name">业务员：</span>
          <span class="detail-form-value">{{ $route.query.ownerName }}</span>
        </span>
      </div>
    </div>
    <div class="container-line-title">
      <span class="detail-subtitle">票据列表</span>
    </div>
    <el-table
      :data="contentData.kpList"
      border
      style="width: 100%"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.7)"
    >
      <el-table-column label="名称" align="center" width="270">
        <template slot-scope="{row}">
          <span>{{ row.xxcontent }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.F0000032 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.allnum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" align="center" width="305">
        <template slot-scope="{row}">
          <span>{{ row.oneprice | moneyFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总金额(元)" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.allprice | moneyFilter }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'InvoiceContent',
  data() {
    return {
      contentData: {}
    }
  },
  mounted() {
    this.contentData = JSON.parse(sessionStorage.getItem('invoice'))
  }
}
</script>
