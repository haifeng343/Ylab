<template>
  <div>
    <div class="container-line-title">
      <span class="detail-subtitle">合作项目</span>
    </div>
    <div v-if="list.length>0" class="content-wrap">
      <el-card v-for="(item,index) in list" :key="index" class="box-card">
        <div slot="header" class="clearfix">
          <el-tag :type="item.status | statusTypeFilter" class="title-tag">{{ item.status | statusFilter }}</el-tag>
          <span class="detail-title">{{ item.name }}</span>
          <el-button style="float: right; padding: 3px 0; font-size: 16px;" type="text" @click="toDetail(item)">详情<span class="el-icon-arrow-right" /></el-button>
        </div>
        <div class="text-title container-line-item">
          <span class="detail-form-item">基本信息</span>
          <span class="detail-form-item">合同信息</span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">客户名：</span>
            <span v-if="item.customName" class="detail-form-value">{{ item.customName.split('-')[1] }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">合同编号：</span>
            <span class="detail-form-value">{{ item.contractNo }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">联系方式：</span>
            <span class="detail-form-value">{{ item.customPhone }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">签约时间：</span>
            <span class="detail-form-value">{{ item.qianYueDate }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">联系邮箱：</span>
            <span class="detail-form-value">{{ item.customMail }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">约定完工：</span>
            <span class="detail-form-value">{{ item.preCompleteDate }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">客户单位：</span>
            <span v-if="item.customName" class="detail-form-value">{{ item.customName.split('-')[0] }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">样本情况：</span>
            <span v-if="item.hasSample === '有'" class="detail-form-value">{{ item.sampleUseCount+'/'+item.sampleCount }}</span>
            <span v-else class="detail-form-value">{{ item.hasSample }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">业务员：</span>
            <span class="detail-form-value">{{ item.ownerName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">开票总金额(元)：</span>
            <span class="detail-form-value">{{ item.kpMoney | moneyFilter }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">售前顾问：</span>
            <span v-if="item.saleFrontName" class="detail-form-value">{{ item.saleFrontName.toString() }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">合同金额(元)：</span>
            <span class="detail-form-value">{{ item.totalMoney | moneyFilter }}</span>
          </span>
        </div>
        <div class="container-line-item">
          <span class="detail-form-item">
            <span class="detail-form-name">售后顾问：</span>
            <span class="detail-form-value">{{ item.saleBackName }}</span>
          </span>
          <span class="detail-form-item">
            <span class="detail-form-name">已付金额(元)：</span>
            <span class="detail-form-value" style="margin-right: 10px;">{{ item.paidMoney | moneyFilter }}</span>
            <!-- <el-tag v-if="item.totalMoney-item.paidMoney === 0" type="success">已结清</el-tag>
            <el-tag v-else type="danger">待结清</el-tag> -->
          </span>
        </div>
        <!-- <div class="container-line-item">
          <span class="detail-form-item" />
          <span class="detail-form-item">
            <span class="detail-form-name">待收金额(元)：</span>
            <span class="detail-form-value">{{ item.totalMoney-item.paidMoney | moneyFilter }}</span>
          </span>
        </div> -->
      </el-card>
    </div>
    <div v-else class="content-wrap" style="color: rgb(144, 147, 153);">暂无合作项目</div>
  </div>
</template>

<script>
import { getJoinContract } from '@/api/user'
export default {
  name: 'JoinContract',
  data() {
    return {
      list: [],
      listQuery: {
        pageNo: 1,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      const result = await getJoinContract(this.listQuery)
      if (result.code === 200) {
        this.list = result.data
      }
    },
    toDetail(data) {
      sessionStorage.setItem('JoinContract', JSON.stringify(data))
      this.$router.push('/contract-manager/join-contract-detail')
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
font-size: 14px;
}

.text-title {
    font-weight: bold;
    font-size: 16px;
}

.content-wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both
}

.box-card {
width: 49%;
margin-bottom: 20px;
}
>>>.el-card__header{
  border-top: 8px solid rgb(79,119,255);
  border-bottom: 0;
}
.detail-form-item{
    width: 49%;
}
</style>
