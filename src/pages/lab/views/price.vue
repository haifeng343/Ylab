<template>
  <div style="margin-top: 68px;">
    <div class="model">
      <div class="ylabCloud2" style="text-align: center;">选择适合你团队的系统版本</div>
      <div class="ylabCloud3" style="text-align: center;">我们为不同规模和需求的团队都准备了适用的方案</div>
      <el-row class="website">
        <el-col :sm="8" :xs="24" class="price">
          <div style="height:380px;box-shadow:0px 2px 24px 0px rgba(0,0,0,0.1); margin-bottom: 50px;">
            <div class="img-try">免费版</div>
            <div style="width: 100%; height:302px; text-align: center;">
              <div style="margin-top: 42px;width:100%;"><img src="@/assets/image/money0.png" height="61px"></div>
              <div style="color: #4A90E2;font-weight:600px;margin-top:23px;">元/月</div>
              <div style="color: #606266;font-size:14px; margin-top:60px;">0-50人团队</div>
              <!-- <div class="priceDiv"><el-button type="primary" class="priceBtn">立即购买</el-button></div> -->
            </div>
          </div>
        </el-col>
        <el-col :sm="8" :xs="24" class="price">
          <div style="height:380px;box-shadow:0px 2px 24px 0px rgba(0,0,0,0.1);margin-bottom: 50px;">
            <div class="img-standard">标准版</div>
            <div style="width: 100%; height:302px; text-align: center;">
              <div style="margin-top: 42px;width:100%;"><img src="@/assets/image/money1.png" height="61px"></div>
              <div style="color: #4A90E2;font-weight:600px;margin-top:23px;">元/月</div>
              <div style="color: #606266;font-size:14px; margin-top:60px;">0-50人团队</div>
              <!-- <div class="priceDiv"><el-button type="primary" class="priceBtn">立即购买</el-button></div> -->
            </div>
          </div>
        </el-col>
        <el-col :sm="8" :xs="24" class="price">
          <div style="height:380px;box-shadow:0px 2px 24px 0px rgba(0,0,0,0.1);margin-bottom: 50px;">
            <div class="img-science">科研服务免费版</div>
            <div style="width: 100%; height:302px; text-align: center;">
              <div style="margin-top:42px;width:100%;display: flex;justify-content: center;">
                <div><img src="@/assets/image/money2.png" height="61px"></div>
                <div style="color:#4A90E2;font-weight:600;margin:40px 0 0 10px;">服务</div>
              </div>
              <div style="color: #4A90E2;font-weight:600px;margin-top:23px;">元/月</div>
              <div style="color: #606266;font-size:14px; margin-top:60px;">0-50人团队</div>
              <!-- <div class="priceDiv"><el-button type="primary" class="priceBtn">立即购买</el-button></div> -->
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- <div class="freeTry">团队可享有<span style="color:#4A90E2;">1个月免费试用</span>，其他套餐请联系我们详询。</div> -->
      <div class="freeware"><el-button type="primary">免费试用</el-button></div>
      <div style="color: #606266; font-size: 14px; text-align:center; margin-bottom: 15px;">注册后可享有30天免费试用期，继续购买服务请联系您的业务员或直接联络我们</div>
      <div class="priceBottom" style="color: #606266; font-size: 14px; text-align:center;">YLab销售团队 | 021-20787300</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product',
  created() {
    this.$emit('changeTable', 'price')
  }
}
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
</style>
