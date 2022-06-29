<template>
  <div class="header">
    <span class="icon"></span>
    <h1 class="text">white bear Music</h1>
    <router-link to="./user" class="mine">
      <i class="iconfont icon-wode"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'm-header'
}
</script>

<style lang="scss" scoped>

.header {
  height: 44px;
  text-align: center;
  color: black;
  font-size: 0;
  background-color: yellow;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image('logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: 20px;
    color: yellowgreen;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-wode {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: #954e4e;
    }
  }
}
</style>
