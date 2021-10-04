<template>
  <div class="player">
    <div class="normal-player">
      <div class="background">
        <img src="@/assets/images/loading.png"/>
      </div>
      <div class="top">
        <div class="back">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <h1 class="title">title</h1>
        <h1 class="subtitle">subtitle</h1>
      </div>
    </div>
<!--    控制歌曲播放-->
    <audio></audio>
  </div>
</template>

<script>
export default {
  name: "player"
}
</script>

<style scoped lang="scss">
.player{
  .normal-player{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: antiquewhite;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
