<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" @click="gotoWeb">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <svg-icon icon-class="logo" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img src="@/assets/logo.png" class="sidebar-logo"> -->
        <svg-icon icon-class="logo" class="sidebar-logo" />
        <svg-icon icon-class="YLab" class="sidebar-label" style="height: 0.5em;" />
        <!-- <img src="@/assets/logo_label.png" style="height: 22px; vertical-align: middle;"> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    gotoWeb() {
      const index = window.location.href.search('/html')
      const href = window.location.href.substr(0, index)
      setTimeout(() => {
        window.open(`${href}/html/lab.html#/product`, '_self')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  // background: #427EC6;
  padding: 0 20px;
  // text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      color: #FFFFFF;
      font-size: 32px !important;
      vertical-align: middle;
      margin-left: -2px !important;
      margin-right: 0 !important;
    }

    & .sidebar-label {
      color: #FFFFFF;
      font-size: 68px !important;
      vertical-align: middle;
      margin-right: 0 !important;
      margin-left: 6px !important;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    padding: 0;
    text-align: center;
    .sidebar-logo {
      margin-left: 14px !important;
      margin-right: 12px !important;
    }
  }
}
</style>
