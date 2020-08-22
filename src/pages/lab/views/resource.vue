<template>
  <div>
    <div id="donation" class="model" style="margin-top: 68px;">
      <el-row class="website">
        <el-col :sm="9" :xs="24">
          <div class="ylabCloud">科研资源共享</div>
          <div class="ylabCloud1">全国最大研究肿瘤发生发展关键基因服务供应商；是国内领先的疾病、肿瘤研究及转化医学平台。</div>
          <div class="btnDiv"><el-button type="primary" class="clickBtn" @click="freeTry">免费试用</el-button></div>
        </el-col>
        <el-col :sm="1" />
        <el-col :sm="14" :xs="24">
          <img src="@/assets/image/science.png" width="100%">
        </el-col>
      </el-row>
      <div class="lab1">基础科研服务平台</div>
      <el-row class="website">
        <el-col :sm="8" :xs="24" class="serve">
          <div style="height: 106px;box-shadow:0px 2px 12px 0px rgba(0,0,0,0.1);border-radius:8px;padding: 20px 0; margin: 0 15px;">
            <div class="platForm" style="display: flex;align-items: center;">
              <div style="margin-right: 32px;"><img src="@/assets/image/person.png" height="65px"></div>
              <div style="font-size: 24px;">专业团队</div>
            </div>
          </div>
        </el-col>
        <el-col :sm="8" :xs="24" class="serve">
          <div style="height: 106px;box-shadow:0px 2px 12px 0px rgba(0,0,0,0.1);border-radius:8px;padding: 20px 0; margin: 0 15px;">
            <div class="platForm" style="display: flex;align-items: center;">
              <div style="margin-right: 32px;"><img src="@/assets/image/flag.png" height="65px"></div>
              <div style="font-size: 24px;">行业标杆</div>
            </div>
          </div>
        </el-col>
        <el-col :sm="8" :xs="24" class="serve">
          <div style="height: 106px;box-shadow:0px 2px 12px 0px rgba(0,0,0,0.1);border-radius:8px;padding: 20px 0; margin: 0 15px;">
            <div class="platForm" style="display: flex;align-items: center;">
              <div style="margin-right: 32px;"><img src="@/assets/image/academic.png" height="65px"></div>
              <div style="font-size: 24px;">学术前沿</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="program2">
      <div class="model">
        <el-row class="website">
          <el-col :sm="10" :xs="24" class="mgb">
            <div class="text1">大量多余试剂抗体免费送</div>
            <div class="text2">昂贵的试剂抗体产品，都免费赠送；我们始终采用最高品质的进口试剂耗材，包括Sigma、Qiagen、ThermoFisher、NEB、TAKARA、Clontech等</div>
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/reagent.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program3">
      <div class="model">
        <el-row class="website">
          <el-col :xs="24" class="hidden-sm-and-up mgb">
            <div class="text1">3W+质粒现货免费赠送</div>
            <div class="text2">面对来自医疗机构、学校及科研单位的广大客户群体，我们采用高通量的仪器设备和高品质的试剂耗材，并对质粒和菌液进行严格质控，为你们免费提供高质量的产品，帮助客户高效地进行研究。</div>
          </el-col>
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/plasmid.png" style="width: 100%;">
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="10" class="hidden-xs-only">
            <div class="text1">3W+质粒现货免费赠送</div>
            <div class="text2">面对来自医疗机构、学校及科研单位的广大客户群体，我们采用高通量的仪器设备和高品质的试剂耗材，并对质粒和菌液进行严格质控，为你们免费提供高质量的产品，帮助客户高效地进行研究。</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program2">
      <div class="model">
        <el-row class="website">
          <el-col :sm="10" :xs="24" class="mgb">
            <div class="text1">3W+病毒现货免费赠送</div>
            <div class="text2">我们作为国内最大的病毒产品供应商之一，十多年一直专注于病毒包装技术服务。新一代包装系统；严格的原料控制；高效的工作团队；拥有高通量仪器；保证出毒时间和单位出毒量。</div>
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/virus.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program3">
      <div class="model">
        <el-row class="website">
          <el-col :xs="24" class="hidden-sm-and-up mgb">
            <div class="text1">100+细胞免费赠送</div>
            <div class="text2">我们细胞库资源丰富，目前拥有human,mouse及Rat物种来源的现货细胞系300+，保证细胞来源的真实可靠。</div>
          </el-col>
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/cell.png" style="width: 100%;">
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="10" class="hidden-xs-only">
            <div class="text1">100+细胞免费赠送</div>
            <div class="text2">我们细胞库资源丰富，目前拥有human,mouse及Rat物种来源的现货细胞系300+，保证细胞来源的真实可靠。</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program2">
      <div class="model">
        <el-row class="website">
          <el-col :sm="10" :xs="24" class="mgb">
            <div class="text1">科研社群开放，技术经验分享</div>
            <div class="text2">与全国各地400多家三级甲等医院涉及全种类肿瘤研究领域的10000名临床科学家保持长期紧密的合作关系。内部定期高端科研方向探讨；长期接收外部人员来交流学习。</div>
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/share.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Product',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  created() {
    this.$emit('changeTable', 'resource')
  },
  mounted() {
    if (this.$route.query.position) {
      this.$el.querySelector(this.$route.query.position).scrollIntoView()
    }
  },
  methods: {
    freeTry() {
      if (!this.user.id && this.user.id !== 0) {
        this.$router.push(`/register?style=dredge?redirect_url=${encodeURIComponent(window.location.href)}`)
      } else {
        if (this.user.companyId || this.user.companyId === 0) {
          this.$message.success('您已开通YLab系统，即将跳转进入系统…')
          const index = window.location.href.search('/html')
          const href = window.location.href.substr(0, index)
          setTimeout(() => {
            window.open(`${href}/html/standard.html#/dashboard`, '_self')
          }, 2000)
        } else {
          this.$router.push('/dredge')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
