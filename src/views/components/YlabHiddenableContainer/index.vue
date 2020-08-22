<template>
  <div class="container-standard" :style="{height: hiddening?'64px':'unset'}" style=" overflow: hidden;">
    <slot />
    <div class="arrow-bar">
      <svg-icon v-if="hiddening" icon-class="double-arrow-down" class-name="clickable" @click="hiddening=false" />
      <svg-icon v-else icon-class="double-arrow-up" class-name="clickable" @click="hiddening=true" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hiddening: true
    }
  }
}
</script>

<style scoped>
  .arrow-bar {
    text-align: center;
    position: absolute;
    width: 100%;
    bottom: 0;
    padding-bottom: 5px;
    background-color: #FFFFFF;
  }
</style>
