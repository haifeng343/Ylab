<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- 不提供调整大小功能 -->
        <!-- <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <HeaderMessage id="header-search" class="right-menu-item" />
      </template>
      <div style="position: fixed; bottom: 10px; right: 10px;">
        <uploadFile v-show="$store.state.user.showUpLoad" />
      </div>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" style="padding-top: 0px;">
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <!-- <el-dropdown-item divided> -->
          <el-dropdown-item :class="{enterpriseBackGround: $store.state.app.platform === 'enterprise',standardBackGround: $store.state.app.platform === 'standard'}" class="personName" disabled>
            <div>
              <div style="fontSize: 24px;">{{ name }}</div>
              <div>{{ $store.state.user.company.name }}</div>
            </div>
            <img :src="$store.state.user.avatar" alt="个人头像">
          </el-dropdown-item>
          <el-dropdown-item v-for="(item, index) in companys" :key="index">
            <span style="padding: 10px 0; width: 100%;" @click.prevent="changeCompany(item.companyId)">切换至：{{ item.companyName }}</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="personBtn" @click="$router.push('/person')">
              <span>个人中心</span><span class="el-icon-arrow-right" />
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div class="personBtn" @click="invite">
              <span>邀请外部成员加入</span>
            </div>
          </el-dropdown-item>
          <el-dropdown-item>
            <span style="display:block;padding: 10px 0;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import HeaderMessage from '@/components/HeaderMessage'
import Search from '@/components/HeaderSearch'
import uploadFile from '../../components/Upload/uploadFile'
import { mapState } from 'vuex'
import { switchCompany } from '@/api/role'
import { getDeptMember } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    // ErrorLog,
    Screenfull,
    Search,
    HeaderMessage,
    uploadFile
  },
  data() {
    return {
      companys: [],
      total: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    ...mapState({
      name: state => state.user.name,
      companyList: state => state.companyList
    })
  },
  created() {
    this.companys = this.$store.state.user.companyList.filter(item => {
      return item.companyId !== this.$store.state.user.company.companyId
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push('/login')
      const index = window.location.href.search('/html')
      const href = window.location.href.substr(0, index)
      window.location.href = `${href}/html/lab.html#/product`
    },
    changeCompany(id) {
      switchCompany(id).then(res => {
        if (res.code === 200) {
          // if (this.$route.path === '/dashboard') {
          //   this.$router.go(0)
          // } else {
          //   // this.$router.replace('/dashboard')
          //   window.location.reload()
          // }
          window.location.reload()
        }
      })
    },
    async invite() {
      await getDeptMember({ pageNo: 1, pageSize: 20 }).then(res => {
        this.total = res.data.total
      })

      this.$store.state.user.inviteDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}

  .personBtn{
    display: flex;
    justify-content: space-between;
    align-items: center;
    // margin: 10px 0;
    padding: 10px 0;
  }
  .personName{
    width: 320px;
    height: 106px;
    color: #fff;
    padding-top: 22px;
    padding-bottom: 22px;
    display: flex;
    justify-content: space-between;
    img{
      width: 58px;
      height: 58px;
      border-radius: 8px;
      border: 2px solid #fff;
    }
  }
  .enterpriseBackGround{
    background: url('../../assets/person/enterprisePersonbutton.png') no-repeat;
  }
  .standardBackGround{
    background: url('../../assets/person/personbutton.png') no-repeat;
  }
  >>>.popper__arrow{
    display: none;
  }
</style>
