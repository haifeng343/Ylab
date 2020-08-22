<template>
  <section class="app-main">
    <el-alert
      v-if="lastTime !== undefined"
      type="warning"
      center
    >
      <div v-if="lastTime>0" slot="title"><span>还有{{ lastTime }}天的免费试用期,点此&nbsp;</span><a style="color: #4A90E2;fontWeight: 700;" @click="jumpToBuy">购买服务</a></div>
    </el-alert>
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" @closeme="$emit('closeme', $event)" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    ...mapState({
      lastTime: state => state.user.lastTime
    })
  },
  methods: {
    jumpToBuy() {
      const index = window.location.href.search('/html')
      const href = window.location.href.substr(0, index)
      window.location.href = `${href}/html/lab.html#/product`
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
