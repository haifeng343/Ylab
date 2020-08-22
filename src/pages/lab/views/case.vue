<template>
  <div style="margin-top: 68px;">
    <div class="team" style="height: 372px;">
      <div class="model" style="height: 100%;">
        <div style="position: relative; top: 50%; transform: translateY(-50%);">
          <div style="font-size: 34px; font-weight: 500; color: #fff;text-align: center;">助力科研发展，全面提升实验室生产力</div>
          <div style="font-size: 24px; color: #fff; text-align: center; margin-top:10px;">YLab持续为<span style="font-size: 34px; font-weight: 500;">500</span>多家医院，超过<span style="font-size: 34px; font-weight: 500;">1000</span>多团队提供高效管理服务</div>
        </div>
      </div>
    </div>
    <div style="margin-top: 50px; text-align: center; color: #37383A; font-size: 18px;">客户部分展示</div>
    <div style="width: 100%; max-width: 1200px; margin: 20px auto 150px auto; padding: 0 16px;">
      <el-row :gutter="39">
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 80px; margin: 18px auto;"><img src="@/assets/image/fudan.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">复旦大学附属华东医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">史教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/anyike.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">安徽医科大学第一附属医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">汪教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/baotou.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">包头医学院第一附属医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">罗教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/beidasan.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">北京大学第三医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">陈教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/changzhouer.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">常州市第二人民医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">刘教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/chengyiyi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">成都医学院第一附属医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">徐教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/erjunzheng.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">第二军医大学附属长征医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">林教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shangjiaojiu.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">上海交通大学医学院附属第九人民医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">陈教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/sanjunqiao.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">第三军医大学新桥医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">李教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/dongganwai.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">东方肝胆外科医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">杨教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/fuyixie.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">福建医科大附属协和医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">陈教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/fudahua.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">复旦大学附属华山医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">李教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/fudazhong.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">复旦大学附属中山医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">杨教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/fushuzhong.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">复旦大学附属肿瘤医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">王教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/gansuren.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">甘肃省人民医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">何教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/guangyaoyi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">广东药科大学附属第一医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">周教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/hayier.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">哈尔滨医科大学附属第二医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">何教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/hunanzhongyi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">湖南中医药大学第一附属医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">徐教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/huazhongtongxie.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">华中科技大学同济医学院附属协和医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">孙教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/nanjunzhong.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">南京军区南京总医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">陈教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shangjiaofuren.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">上海交通大学医学院附属仁济医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">冯教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shangjiaoruijin.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">上海交通大学医学院附属瑞金医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">程教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shangjiaofuxiong.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">上海交通大学附属胸科医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">叶教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shangjiaofuxin.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">上海交通大学医学院附属新华医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">胡教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/shouyianzhen.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">首都医科大学安贞医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">谢教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/sudayi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">苏州大学附属第一医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">周教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/zhedayi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">浙江大学医学院附属第一医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">朱教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/zhongyixie.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">中国医学科学院协和医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">黄教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/zhongnanxiangya.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">中南大学湘雅附一医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">周教授团队</div>
          </el-card>
        </el-col>
        <el-col :md="8" :sm="12" :xs="24">
          <el-card
            class="lab-card"
            style="cursor: pointer; margin-top: 36px; text-align: center;"
            shadow="always"
          >
            <div style="height: 100px; margin: 0 auto;"><img src="@/assets/image/zhongshanfuyi.png" style="height: 100%;"></div>
            <div style="width: 100%; height: 1px; background-color: #E1E1E1; margin: 22px 0 17px;" />
            <div style="font-size: 18px; font-weight: bold; margin-top: 16px;">中山大学附属第一医院</div>
            <div style="font-size: 16px; color: #909399; margin-top: 16px;">宋教授团队</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Case',
  created() {
    this.$emit('changeTable', 'case')
  }
}
</script>
<style lang="scss" scoped>
  .team {
    background-image: url('../../../assets/image/team.png');
    background-size: 100% 100%;
  }
</style>
