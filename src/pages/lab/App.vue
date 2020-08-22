<template>
  <div id="app">
    <el-container v-if="!lost">
      <!-- -------------------pc头部----------------- -->
      <el-header class="lab-header hidden-xs-only" style="height: 68px;">
        <div style="width: 100%;max-width: 1200px; height: 100%; box-sizing: border-box; display: flex; align-items: center; margin: 0 auto;">
          <a @click="goIndex">
            <svg-icon icon-class="logo" style="font-size:40px; color:#4A90E2;" />
            <svg-icon icon-class="YLab" style="font-size:80px; color:#4A90E2;" />
          </a>
          <div v-if="$route.meta.title && $route.meta.title()" style="margin-left: 24px;fontSize: 20px;">{{ $route.meta.title() }}</div>
          <div v-else-if="!regAndDre" style="height: 100%;">
            <el-menu
              :default-active="activeIndex"
              mode="horizontal"
              text-color="#000000"
              active-text-color="#4A90E2"
              style="margin-left: 70px; height: 100%;"
            >
              <el-menu-item index="product" style="height: 100%;" @click="$router.push('/product')">产品</el-menu-item>
              <el-menu-item index="resource" style="height: 100%;" @click="$router.push('/resource')">资源</el-menu-item>
              <el-menu-item index="lab" style="height: 100%;" @click="$router.push('/lab')">实验室</el-menu-item>
              <el-menu-item index="case" style="height: 100%;" @click="$router.push('/case')">合作案例</el-menu-item>
              <!-- <el-menu-item index="price" style="height: 100%;" @click="$router.push('/price')">价格</el-menu-item> -->
            </el-menu>
          </div>
          <div style="flex: 1;" />
          <div v-if="!regAndDre && !user.id && user.id !== 0" class="indexBtn">
            <el-button size="mini" @click="login">登录</el-button>
            <el-button type="primary" size="mini" @click="register">注册</el-button>
          </div>
          <div v-if="!regAndDre && (user.id || user.id === 0)" class="indexBtn">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ user.name }}<i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$router.push('/dredge')">创建团队</el-dropdown-item>
                <el-dropdown-item><div @click="$router.push('/setting')">账号设置</div></el-dropdown-item>
                <el-dropdown-item divided @click.native="exit">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="mini" plain @click="intoSys">进入YLab</el-button>
          </div>
        </div>
      </el-header>
      <!-- ----------------------移动端头部------------------------------- -->
      <div v-if="!signPdf || (signPdf && (hashead === 2 || hashead === 3))" class="lab-header hidden-sm-and-up" style="line-height: 56px; text-align: center;">
        <svg-icon v-if="!regAndDre || online" icon-class="menu" style="position: absolute; top: 50%;left: 0; transform: translateY(-50%);font-size:38px; margin-left: 15px;" @click="showMenu = true" />
        <a class="logoHeader" @click="goIndex">
          <svg-icon icon-class="logo" style="font-size:32px; color:#4A90E2;" />
          <svg-icon icon-class="YLab" style="font-size:56px; color:#4A90E2;" />
        </a>
      </div>
      <div v-if="showMenu" style="width: 100%; height: 100%; background: rgba(0,0,0,.5); position: fixed; z-index: 3;" @click="showMenu = false" />
      <div v-if="showMenu" style="width: 60%; height: 100%; background: #4A90E2; position: fixed; z-index: 4;" @click.stop="showMenu = true">
        <div style="padding: 24px 30px; border-bottom: 1px solid rgba(255,255,255,.2); margin-bottom: 10px;">
          <div v-if="!user.id && user.id !== 0" style="display: flex;" @click.stop="login(); showMenu = false">
            <svg-icon icon-class="logo" style="font-size: 36px; color: #FFFFFF;" />
            <div style="line-height: 36px; font-size: 16px; margin-left: 8px; color: #fff;">登录</div>
          </div>
          <div v-else style="display: flex;">
            <svg-icon icon-class="logo" style="font-size: 36px; color: #FFFFFF;" />
            <div style="line-height: 36px; font-size: 16px; margin-left: 8px; color: #fff;">{{ user.name }}</div>
          </div>
        </div>
        <div style="padding: 10px 16px; color: #fff; font-size: 14px; line-height:24px;" @click.stop="$router.push('/product'); showMenu = false">产品</div>
        <div style="padding: 10px 16px; color: #fff; font-size: 14px; line-height:24px;" @click.stop="$router.push('/resource'); showMenu = false">资源</div>
        <div style="padding: 10px 16px; color: #fff; font-size: 14px; line-height:24px;" @click.stop="$router.push('/lab'); showMenu = false">实验室</div>
        <div style="padding: 10px 16px; color: #fff; font-size: 14px; line-height:24px;" @click.stop="$router.push('/case'); showMenu = false">合作案例</div>
        <!-- <div style="padding: 10px 16px; color: #fff; font-size: 14px; line-height:24px;" @click.stop="$router.push('/price'); showMenu = false">价格</div> -->
        <!-- <div v-if="user.id || user.id === 0" style="position: absolute; bottom: 0; width: 100%; line-height: 24px; text-align: center; font-size: 14px; padding: 15px 16px; border-top: 1px solid rgba(255,255,255,.2); color: #fff;" @click.stop="exitPhone(); showMenu = false">退出登录</div> -->
        <div v-if="user.id || user.id === 0" style="position: absolute; bottom: 28px; width: 100%; height: 73px; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,.2); color: #fff;">
          <!-- <div style="display: flex;align-items: center; justify-content: center; height: 50%;">
            <div style="flex: 1; text-align:center;" @click.stop="showMenu = false;">
              <svg-icon icon-class="set" style="color: #fff; font-size: 30px;" />
              <div>账号设置</div>
            </div>
            <div style="flex: 1;text-align:center; box-sizing: border-box;" @click.stop="showMenu = false;">
              <svg-icon icon-class="buildTeam" style="color: #fff; font-size: 30px;" />
              <div>创建团队</div>
            </div>
            <div style="flex: 1;text-align:center; box-sizing: border-box;" @click.stop="$router.push('/onlineSign'); showMenu = false;">
              <svg-icon icon-class="sign" style="color: #fff; font-size: 30px;" />
              <div>合同签约</div>
            </div>
          </div> -->
          <div style="display: flex;align-items: center; justify-content: center; height: 100%;">
            <div style="flex: 1; text-align:center;" @click.stop="intoPhoneSys(); showMenu = false;">
              <svg-icon icon-class="into" style="color: #fff; font-size: 30px;" />
              <div>YLab系统</div>
            </div>
            <div style="flex: 1;text-align:center; box-sizing: border-box;" @click.stop="$router.push('/onlineSign'); showMenu = false;">
              <svg-icon icon-class="sign" style="color: #fff; font-size: 30px;" />
              <div>合同签约</div>
            </div>
            <div style="flex: 1;text-align:center; box-sizing: border-box;" @click.stop="exitPhone(); showMenu = false;">
              <svg-icon icon-class="exit" style="color: #fff; font-size: 30px;" />
              <div>退出</div>
            </div>
            <!-- <div style="flex: 1;text-align:center; box-sizing: border-box;" /> -->
          </div>
        </div>
        <div v-if="user.id || user.id === 0" style="position: absolute; bottom: 0; width: 100%; height: 28px; font-size: 14px; color: rgba(255,255,255,.4); text-align: center; line-height: 28px;">
          联系我们 021-20787300-8033
        </div>
      </div>
      <el-alert v-if="!user.companyId && user.comapnyId !== 0 && !regAndDre" class="webAlert" type="warning" center>
        <div slot="title">现在开通YLab 立刻享有30天免费试用期</div>
      </el-alert>
      <router-view ref="child" :user="user" :change-user="changeUser" @userInfo="userInfo" @changeTable="changeTable" @sign="sign" />
      <!-- ---------------------pc底部------------------------ -->
      <div v-if="!regAndDre" class="sole clearfix hidden-xs-only" style="background-color: #213558; position:relative;border-bottom: 1px solid rgba(255,255,255,.2);">
        <div class="model">
          <div class="soleContent" style="display: flex; color: #fff;">
            <div class="soleLogo">
              <img src="@/assets/image/lucidLogo.png" height="33px" style="cursor: pointer;" @click="goIndex">
              <div style="font-size:12px; color:rgba(255,255,255,.4);margin-top: 16px;">YLab销售团队</div>
              <div style="font-size:12px; color:rgba(255,255,255,.4);margin-top: 16px;">021-20787300-8033</div>
            </div>
            <ul>
              <li>产品</li>
              <li class="action" style="cursor: pointer;" @click="goProduct('#func')">功能</li>
              <li class="scheme" style="cursor: pointer;" @click="goProduct('#way')">解决方案</li>
            </ul>
            <ul>
              <li>资源</li>
              <li class="donation" style="cursor: pointer;" @click="goResource('#donation')">现货赠品</li>
            </ul>
            <ul>
              <li>实验室</li>
              <li style="cursor: pointer;" @click="goLab('#labType')">实验室类型</li>
            </ul>
            <!-- <ul>
              <li>价格</li>
              <li class="standard" style="cursor: pointer;">标准版</li>
              <li class="scienceFree" style="cursor: pointer;">科研服务免费版</li>
            </ul> -->
            <ul>
              <li>公司</li>
              <li style="cursor: pointer;"><a href="http://www.bioscienceres.com/" target="_Blank">关于我们</a></li>
              <li style="cursor: pointer;"><a href="https://www.zhipin.com/job_detail/?query=%E4%B8%8A%E6%B5%B7%E6%87%BF%E8%B4%9D%E7%91%9E%E7%94%9F%E7%89%A9%E5%8C%BB%E8%8D%AF%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=101020100&industry=&position=" target="_Blank">工作机会</a></li>
            </ul>
            <ul>
              <li>法律声明</li>
              <li style="cursor: pointer;" @click="$router.push('/privacy')">隐私条款</li>
            </ul>
          </div>
          <div v-show="bottomGo" style="position:fixed;bottom:70px;right:0;">
            <div class="begin" style="cursor:pointer;position: absolute; bottom:24px; right:20px;width:48px;height:48px;padding: 4px; box-sizing: border-box;" @click="gotop"><img src="@/assets/image/goTop.png" width="40px"></div>
            <div class="showTencent begin" style="position: absolute; bottom:80px; right:20px;width:48px;height:48px;padding: 4px; box-sizing: border-box;"><img src="@/assets/image/tencent.png" width="40px">
              <div class="tencent" style="position: absolute;bottom:-56px;right:84px;width:350px;height:170px;background-color:#fff;box-shadow:0px 2px 12px 0px rgba(0,0,0,0.16);border-radius:2px;padding:10px 0 0 12px;">
                <div style="float:left;font-size: 14px;color:#303133;line-height: 20px;text-align: center;">
                  <div>关注我们公众号</div>
                  <div>随时查看工作事项</div>
                  <div style="margin-top: 6px;"><img src="@/assets/image/xiaokeshu.jpg" width="97px"></div>
                </div>
                <div style="float:left;margin-left: 24px;">
                  <div style="margin-top: 14px;">
                    <div style="float: left;margin-top:5px;"><img src="@/assets/image/time.png" width="43px"></div>
                    <div style="display:inline-block; margin-left:13px;">
                      <div style="color: #303133;">咨询时间</div>
                      <div style="color:#909399; font-size:14px;margin-top:13px;">9:00-17:30</div>
                    </div>
                  </div>
                  <div style="margin-top: 25px;">
                    <div style="float: left;margin-top:5px;"><img src="@/assets/image/phone.png" width="43px"></div>
                    <div style="display:inline-block; margin-left:13px;">
                      <div style="color: #303133;">咨询电话</div>
                      <div style="color:#909399; font-size:14px;margin-top:13px;">021-20787300-8033</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!regAndDre" class="hidden-xs-only" style="background-color:#213558; color: rgba(255,255,255,.4);">
        <div class="model">
          <div style="text-align: center;padding: 20px 0; font-size: 14px;">
            Copyright © 2011- 上海懿贝瑞生物医药科技有限公司，All Rights Reserved
            <span style="margin-left: 17px;">沪ICP备16017892号</span>
          </div>
        </div>
      </div>
      <!-- --------------------移动端底部---------------------- -->
      <div v-if="!regAndDre && !signPdf" class="hidden-sm-and-up" style="background-color: #213558; padding-top: 20px;">
        <div class="model">
          <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="productDetail = !productDetail">产品
              <svg-icon v-if="!productDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-if="productDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-if="productDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail" @click="goProduct('#func')">功能</div>
              <div class="detail" @click="goProduct('#way')">解决方案</div>
            </div>
          </div>
          <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="resourceDetail = !resourceDetail">资源
              <svg-icon v-show="!resourceDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-show="resourceDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-show="resourceDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail" @click="goResource('#donation')">现货赠品</div>
            </div>
          </div>
          <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="labDetail = !labDetail">实验室
              <svg-icon v-show="!labDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-show="labDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-show="labDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail" @click="goLab('#labType')">实验室类型</div>
            </div>
          </div>
          <!-- <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="priceDetail = !priceDetail">价格
              <svg-icon v-show="!priceDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-show="priceDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-show="priceDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail">标准版</div>
              <div class="detail">科研服务免费版</div>
            </div>
          </div> -->
          <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="companyDetail = !companyDetail">公司
              <svg-icon v-show="!companyDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-show="companyDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-show="companyDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail"><a href="http://www.bioscienceres.com/" target="_Blank">关于我们</a></div>
              <div class="detail"><a href="https://www.zhipin.com/job_detail/?query=%E4%B8%8A%E6%B5%B7%E6%87%BF%E8%B4%9D%E7%91%9E%E7%94%9F%E7%89%A9%E5%8C%BB%E8%8D%AF%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B8&city=101020100&industry=&position=" target="_Blank">工作机会</a></div>
            </div>
          </div>
          <div>
            <div style="width: 100%; height: 44px;line-height: 44px; color: #fff; padding: 0 15px;" @click="rightDetail = !rightDetail">法律声明
              <svg-icon v-show="!rightDetail" icon-class="down" style="float: right; height: 100%;" />
              <svg-icon v-show="rightDetail" icon-class="up" style="float: right; height: 100%;" />
            </div>
            <div v-show="rightDetail" style="width: 100%; padding: 0 15px;">
              <div class="detail" @click="$router.push('/privacy')">隐私条款</div>
            </div>
          </div>
          <div style="text-align: center;padding-top: 20px; font-size: 12px; color: rgba(255,255,255,.4);">YLab销售团队</div>
          <div style="text-align: center;font-size: 12px; color: rgba(255,255,255,.4);">021-20787300-8033</div>
          <div style="text-align: center;padding: 10px 0 20px; font-size: 12px; color: rgba(255,255,255,.4);">
            Copyright © 2011- 上海懿贝瑞生物医药科技有限公司  All Rights Reserved
            <span style="margin-left: 17px;">沪ICP备16017892号</span>
          </div>
        </div>
      </div>
    </el-container>
    <router-view v-if="lost" />
  </div>
</template>

<script>
import { gePerson } from '@/api/user'
import { logout } from '@/api/login'
// import { log } from 'util'

export default {
  name: 'App',
  data() {
    return {
      activeIndex: 'product',
      user: {},
      showMenu: false,
      bottomGo: false,
      productDetail: false,
      resourceDetail: false,
      priceDetail: false,
      companyDetail: false,
      labDetail: false,
      rightDetail: false,
      hashead: 0
    }
  },
  computed: {
    regAndDre() {
      return this.$route.path === '/dredge' || this.$route.path === '/register' || this.$route.path === '/login' || this.$route.path === '/wx-login' || this.$route.path === '/onlineSign' || this.$route.path === '/certification' || this.$route.path === '/signResult'
    },
    online() {
      return this.$route.path === '/onlineSign' || this.$route.path === '/certification'
    },
    lost() {
      return this.$route.path === '/404'
    },
    signPdf() {
      return this.$route.path === '/signPdf'
    }
  },
  watch: {
    $route: {
      handler: function() {
        window.scroll(0, 0)
      },
      deep: true
    }
  },
  created() {
    this.userInfo()
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    userInfo() {
      gePerson().then(res => {
        this.user = res.data.employee
      })
    },
    exit() {
      logout().then(res => {
        if (res.code === 200) {
          this.$message('退出成功')
          this.userInfo()
          if (this.$route.path === '/setting' || this.$route.path === '/lab-live') {
            this.$router.push('/product')
          }
        }
      })
    },
    exitPhone() {
      logout().then(res => {
        if (res.code === 200) {
          this.userInfo()
        }
      })
    },
    changeTable(event) {
      this.activeIndex = event
    },
    gotop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    },
    handleScroll() {
      const scrolltop = document.documentElement.scrollTop || document.body.scrollTop
      scrolltop > 166 ? (this.bottomGo = true) : (this.bottomGo = false)
    },
    intoSys() {
      if (this.user.companyId || this.user.companyId === 0) {
        this.$message.success('您已开通YLab系统，即将跳转进入系统…')
        const index = window.location.href.search('/html')
        const href = window.location.href.substr(0, index)
        if (this.user.companyVersion === 1) {
          setTimeout(() => {
            window.open(`${href}/html/standard.html#/dashboard`, '_self')
          }, 2000)
        }
        if (this.user.companyVersion === 2) {
          setTimeout(() => {
            window.open(`${href}/html/enterprise.html#/dashboard`, '_self')
          }, 2000)
        }
      } else {
        this.$router.push('/dredge')
      }
    },
    intoPhoneSys() {
      if (this.user.companyId || this.user.companyId === 0) {
        this.$message.success('您已开通YLab系统，即将跳转进入系统…')
        const index = window.location.href.search('/html')
        const href = window.location.href.substr(0, index)
        if (this.user.companyVersion === 1) {
          setTimeout(() => {
            window.open(`${href}/m/html/standard.html#/dashboard`, '_self')
          }, 2000)
        }
        if (this.user.companyVersion === 2) {
          setTimeout(() => {
            window.open(`${href}/m/html/enterprise.html#/dashboard`, '_self')
          }, 2000)
        }
      } else {
        this.$router.push('/dredge')
      }
    },
    login() {
      this.$router.push(`/login?redirect_url=${encodeURIComponent(window.location.href)}`)
    },
    register() {
      this.$router.push(`/register?redirect_url=${encodeURIComponent(window.location.href)}`)
    },
    goProduct(position) {
      if (this.$route.path === '/product') {
        this.$el.querySelector(position).scrollIntoView({ block: 'center' })
      } else {
        this.$router.push(`/product?position=${encodeURIComponent(position)}`)
      }
    },
    goResource(position) {
      if (this.$route.path === '/resource') {
        this.$el.querySelector(position).scrollIntoView()
      } else {
        this.$router.push(`/resource?position=${encodeURIComponent(position)}`)
      }
    },
    goLab(position) {
      if (this.$route.path === '/lab') {
        this.$el.querySelector(position).scrollIntoView({ block: 'center' })
      } else {
        this.$router.push(`/lab?position=${encodeURIComponent(position)}`)
      }
    },
    goIndex() {
      if (this.$route.path === '/product') {
        this.gotop()
      } else {
        this.$router.push('/product')
      }
    },
    changeUser(user) {
      this.user = user
    },
    sign(event) {
      this.hashead = event
    }
  }
}
</script>

<style scoped>
.lab-header {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 56px;
  background: #fff;
  box-shadow:0px 2px 12px 0px rgba(0,0,0,0.05);
}
.detail {
  padding: 0 15px;
  font-size: 14px;
  color: rgba(255,255,255,.4);
  height: 36px;
  line-height: 36px;
  width: 100%;
}
a.logoHeader {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
</style>

<style>
.lab-header .el-menu-item {
  font-size: 16px !important;
  font-weight: 400 !important;
  padding: 0 !important;
  margin: 0 42px;
  text-align: center;
}

.lab-header .el-menu.el-menu--horizontal {
  border-bottom: none;
}
.indexBtn .el-dropdown-link {
  cursor: pointer;
  font-size: 14px;
  margin-right: 15px;
}
.indexBtn .el-icon-arrow-down {
  font-size: 14px;
}

.showTencent:hover .tencent {
  display: block;
}
.tencent{
  display: none;
}
.webAlert.el-alert {
  display: flex;
  top: 68px;
}
</style>
