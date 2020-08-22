<template>
  <div />
</template>
<script>
export default {
  name: 'Blank',
  created() {
    const userId = sessionStorage.getItem('userId')
    if (userId) {
      sessionStorage.removeItem('userId')
      sessionStorage.setItem('wxData', JSON.stringify({ openid: this.$route.query.openid, unionid: this.$route.query.unionid, userId }))
      window.location.href = 'http://www.yibeirui.com/html/lab.html#/setting'
    }
    if (this.$route.query.code === '400') {
      this.$router.push(`/related?companyId=${this.$route.query.companyId}&openid=${this.$route.query.openid}&unionid=${this.$route.query.unionid}`)
    }
    if (this.$route.query.code === '200') {
      // this.$store.dispatch('user/getUser')
      // this.$router.push('/')
      window.location.href = 'http://www.yibeirui.com/html/lab.html#/product'
    }
  }
}
</script>
