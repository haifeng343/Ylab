<template>
  <div class="header-search">
    <el-badge :is-dot="msgTip" class="tip">
      <svg-icon class-name="search-icon" icon-class="msg" @click="toMessage" />
    </el-badge>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      msgTip: state => state.user.msgTip
    })
  },
  mounted() {
    this.$store.dispatch('user/getMsgTip')
  },
  methods: {
    toMessage() {
      this.$router.push('/message-manager/message')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  box-sizing: border-box;
  padding: 12px 8px !important;
  .tip {
    display: flex;
    .search-icon {
      cursor: pointer;
      font-size: 24px;
      vertical-align: middle;
    }
  }
}
</style>
