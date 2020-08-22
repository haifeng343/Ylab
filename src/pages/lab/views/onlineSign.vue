<template>
  <div>
    <div v-if="total > 0" v-loading="loading" style="backgroundColor: rgba(248,249,251,1); margin-top: 56px; height: calc(100vh - 56px);">
      <div style="width: 100%; height: calc(100vh - 140px); overflow: scroll;">
        <div v-for="(item,index) in list" :key="index" style="font-size: 14px; margin-top: 10px; backgroundColor: #fff; width: 100%; padding: 16px;" @click="intoSign(item.id)">
          <div style="color: #000; line-height: 14px; margin-bottom: 24px; font-weight: 700;">{{ item.name }}</div>
          <div style="color: #606266; margin-bottom: 14px;">创建日期：{{ item.createTime }}</div>
          <div style="color: #606266; position: relative;">业务员：{{ item.saleName }}
            <el-tag v-if="item.signStatus === 1" type="danger" style="position: absolute; right: 0; bottom: 0;">已签约</el-tag>
          </div>
        </div>
        <div style="margin: 20px 0 15px; font-size: 14px; color: #909399;line-height: 20px;">
          <div style="width: 100%; padding: 0 16px; text-align: center;">若找不到合同请联络您的业务员或电询 </div>
          <div style="width: 100%; padding: 0 16px; text-align: center;">021-20787300-8033</div>
        </div>
      </div>
      <div style="padding: 10px 16px 20px; background-color: #fff; position: fixed; bottom: 0; width: 100%;">
        <div style="margin-bottom: 16px; font-size: 14px; color: #909399;">本页共{{ total }}条</div>
        <div style="display: flex; align-items: center; text-align: center;">
          <div style="flex: 1;">
            <el-button v-if="currentPage > 1" @click="prePage">上一页</el-button>
            <el-button v-else disabled>上一页</el-button>
          </div>
          <div style="flex: 1; font-size: 14px; color: #606266;">{{ currentPage }}/{{ maxPage }}</div>
          <div style="flex: 1;">
            <el-button v-if="currentPage === maxPage" disabled>下一页</el-button>
            <el-button v-else @click="nextPage">下一页</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="position: relative; backgroundColor: rgba(248,249,251,1); margin-top: 56px; height: calc(100vh - 56px);">
      <div style="position: absolute;left: 50%; top: 50%; transform: translate(-50%, -70%); text-align: center;">
        <svg-icon icon-class="noSign" style="font-size: 200px;" />
        <div style="font-weight: 700; margin-top: 15px;">您当前尚无待签约合同</div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchList, fetchDetail } from '@/api/contract'
import { gePerson } from '@/api/user'
// import { signPdf } from '@/api/lab'
export default {
  name: 'OnlineSign',
  data() {
    return {
      list: [],
      total: null,
      maxPage: null,

      currentPage: 1,
      loading: false,
      description: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      fetchList({ pageNo: this.currentPage, pageSize: 10, isSign: 1, sort: 'createTime,desc' }).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.maxPage = Math.ceil(this.total / 10)
        this.loading = false
      })
    },
    prePage() {
      if (!this.loading) {
        this.currentPage -= 1
        this.getList()
      }
    },
    nextPage() {
      if (!this.loading) {
        this.currentPage += 1
        this.getList()
      }
    },
    async intoSign(id) {
      await gePerson().then(res => {
        if (res.data.employee.authStatus) {
          fetchDetail({ id: id }).then(res => {
            if (res.data.contract.signStatus === 0) {
              this.$router.push(`/signPdf?pdfPath=${res.data.contract.files}&id=${res.data.contract.id}&noshow=0`)
            } else {
              this.description = `http://${res.data.contract.description}`
              // this.$router.push(`/signPdf?pdfPath=${this.description}&id=${res.data.contract.id}&noshow=1`)
              window.location.href = `${this.description}`
            }
            // console.log(this.pdfUrl)
            // const pdfRoot = new Date().getTime() + Math.random().toString(36).substr(2)
            // // console.log(`oss://erp-new${this.pdfUrl.split('http://erp-new.oss-cn-beijing.aliyuncs.com')[1]}`)
            // let paramString = `Format=json&Version=2017-09-06&AccessKeyId=LTAI4GKZ53eoTEYTTdfszb8Z&SignatureMethod=HMAC-SHA1&SignatureVersion=1.0&Timestamp=${new Date().toISOString()}&SignatureNonce=${Math.random().toString(36).substr(2)}&Action=ConvertOfficeFormat&Project=pdftoimg&SrcUri=oss://erp-new${this.pdfUrl.split('http://erp-new.oss-cn-beijing.aliyuncs.com')[1]}&TgtType=jpg&TgtUri=oss://erp-new/contractJpg/${pdfRoot}`
            // // console.log(paramString)
            // const paramArray = paramString.split('&')
            // paramArray.sort()
            // for (let i = 0; i < paramArray.length; i++) {
            //   paramArray[i] = `${encodeURIComponent(paramArray[i].split('=')[0])}=${encodeURIComponent(paramArray[i].split('=')[1])}`
            // }
            // let newS = paramArray.join('&')
            // newS = encodeURIComponent(newS)
            // // console.log(newS)
            // const StringToSign = `POST&%2F&${newS}`
            // const bytes = Crypto.HMAC(Crypto.SHA1, StringToSign, `BdWuNpJkw12rprTFW4GpwLf0tEvV9S&`, {
            //   asBytes: true
            // })
            // const signature = Crypto.util.bytesToBase64(bytes)
            // paramString = `${paramString}&Signature=${signature}`
            // axios.post(`https://imm.cn-beijing.aliyuncs.com?${paramString}`).then((response) => {
            //   // console.log(response)
            //   this.examCount = response.data.PageCount
            //   this.examPdfUrl = `http://erp-new.oss-cn-beijing.aliyuncs.com/contractPng/${pdfRoot}/1.jpg`
          })
        } else {
          fetchDetail({ id: id }).then(res => {
            if (res.data.contract.signStatus === 0) {
              this.$router.push(`/certification?pdfPath=${res.data.contract.files}&id=${res.data.contract.id}&noshow=0`)
            } else {
              this.description = `http://${res.data.contract.description}`
              this.$router.push(`/certification?pdfPath=${this.description}&id=${res.data.contract.id}&noshow=1`)
            }
          })
        }
      })
    }
  }
}
</script>
