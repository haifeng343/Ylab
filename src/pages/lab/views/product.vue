<template>
  <div style="margin-top: 68px;">
    <div class="model">
      <el-row class="website">
        <el-col :sm="9" :xs="24">
          <div class="ylabCloud">YLab Cloud</div>
          <div class="ylabCloud1">为中小型研发机构提供完整的实验室管理解决方案，引领管理升级和支撑业务发展。提高实验的速度，质量，公平性。</div>
          <div class="btnDiv"><el-button type="primary" class="clickBtn" @click="freeTry">免费试用</el-button></div>
        </el-col>
        <el-col :sm="1" />
        <el-col :sm="14" :xs="24">
          <img src="@/assets/image/ylab.png" width="100%">
        </el-col>
      </el-row>
      <div class="lab">一个完全集成的平台,打造智能实验室信息管理系统</div>
    </div>
    <div id="func" class="program">
      <div class="model">
        <el-row class="website">
          <el-col :sm="10" :xs="24" class="mgb">
            <div class="text1">项目管理</div>
            <div class="text2">实验记录、采购、库存无缝对接，计划分解执,更有效的追踪工作线索，确保项目进度，降低延期风险。看板式任务管理，直观的查看每个项目的进展情况，项目下的所有工作、动态、文件、进展，对于项目下的所有成员都是透明可见的，大家都可以及时了解到项目当前的进度情况。</div>
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/program.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program1">
      <div class="model">
        <el-row class="website">
          <el-col :xs="24" class="hidden-sm-and-up mgb">
            <div class="text1">供应商&采购</div>
            <div class="text2">统一管理试剂、耗材、危化品等实验材料，通过个性灵活的审核机制及管理台账，实现了申购人、采购人、入库人、使用人，数量，项目，经销商结账等环节的全程闭环监管。让数据可追溯，让材料管理更顺畅和便捷有效。</div>
          </el-col>
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/provider.png" style="width: 100%;">
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="10" class="hidden-xs-only">
            <div class="text1">供应商&采购</div>
            <div class="text2">统一管理试剂、耗材、危化品等实验材料，通过个性灵活的审核机制及管理台账，实现了申购人、采购人、入库人、使用人，数量，项目，经销商结账等环节的全程闭环监管。让数据可追溯，让材料管理更顺畅和便捷有效。</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program">
      <div class="model">
        <el-row class="website">
          <el-col :sm="10" :xs="24" class="mgb">
            <div class="text1">库存管理</div>
            <div class="text2">实时对实验室各类耗材、设备库存进行管控，实时呈现所有出入库记录，低库存及时预警、一键采购，支持非采购订单入库更贴合实验室实际情况，支持建立多库存放、分库盘点维护。</div>
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/inventory.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program1">
      <div class="model">
        <el-row class="website">
          <el-col :xs="24" class="hidden-sm-and-up mgb">
            <div class="text1">仪器预约</div>
            <div class="text2">通过事先预约仪器、实时查看仪器预约与使用情况，减少实验员使用实验仪器时间冲突事件概率，辅助提高实验员对实验时间的合理安排性，实现实验室管理员对各类仪器设备的高效利用与管理。</div>
          </el-col>
          <el-col :sm="13" :xs="24">
            <img src="@/assets/image/device.png" style="width: 100%;">
          </el-col>
          <el-col :sm="1" />
          <el-col :sm="10" class="hidden-xs-only">
            <div class="text1">仪器预约</div>
            <div class="text2">通过事先预约仪器、实时查看仪器预约与使用情况，减少实验员使用实验仪器时间冲突事件概率，辅助提高实验员对实验时间的合理安排性，实现实验室管理员对各类仪器设备的高效利用与管理。</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="program">
      <div class="model">
        <el-row class="website">
          <el-col :sm="9" :xs="24" class="mgb">
            <div class="text1">移动办公</div>
            <div class="text2">关注微信公众号或从手机进入官网即刻拥有移动云端轻版本，无需下载任何APP、没有任何安装捆绑。从电脑端YLab进入扫描二维码更可享受电脑、手机互联服务，微信实时接收电脑端所有通知消息、快速查看各项申请进度、便捷处理各类审批单据、实时添加实验记录。</div>
          </el-col>
          <!-- <el-col :sm="1" /> -->
          <el-col :sm="15" :xs="24">
            <img src="@/assets/image/inform.png" style="width: 100%;">
          </el-col>
        </el-row>
      </div>
    </div>
    <div id="way" class="lab">全方位的解决方案</div>
    <div class="model">
      <el-row class="ways">
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/pc.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">多终端 跨平台 随时可用</div>
          <div style="color:#606266;line-height:24px;">在网页、安卓手机和苹果手机上都能轻松使用，多端间实时无缝切换</div>
        </el-col>
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/saas.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">SaaS技术</div>
          <div style="color:#606266;line-height:24px;">软件即服务，免费升级，版本及时迭代，定期更新软件功能，满足更多业务需求，提高用户体验</div>
        </el-col>
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/cloud.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">云存储</div>
          <div style="color:#606266;line-height:24px;">不受地域限制</div>
        </el-col>
      </el-row>
      <el-row class="ways">
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/adaptive.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">适应性</div>
          <div style="color:#606266;line-height:24px;">YLabCloud提供随心而变的业务管理来适应多变的需求</div>
        </el-col>
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/deploy.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">快速部署</div>
          <div style="color:#606266;line-height:24px;">免安装，快速配置，超低转化成本</div>
        </el-col>
        <el-col :sm="8" :xs="24" class="way">
          <div><img src="@/assets/image/safety.png" width="120px"></div>
          <div style=" font-size: 18px;font-weight: 500;">安全性</div>
          <div style="color:#606266;line-height:24px;">阿里云安全技术认证</div>
        </el-col>
      </el-row>
    </div>
    <div class="mole">
      <img src="@/assets/image/molecular.png" width="100%">
      <div class="moleDiv" style="position:absolute; left:50%;top:50%; transform:translate(-50%,-50%);">
        <div style="font-size:30px; font-weight:500;margin-bottom:35px; text-align: center;">敏捷协作,助力团队效率提升</div>
        <div class="beginDiv"><el-button type="primary" class="beginBtn" @click="freeTry">现在开始</el-button></div>
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
    this.$emit('userInfo')
    this.$emit('changeTable', 'product')
  },
  mounted() {
    if (this.$route.query.position) {
      this.$el.querySelector(this.$route.query.position).scrollIntoView({ block: 'center' })
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
