<template>
  <div class="player">
    <div class="normal-player">
      <div class="background">
        <img src="@/assets/images/loading.png"/>
      </div>
      <div class="top">
        <div class="back">
          <i class="iconfont icon-xiangxia"></i>
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
    background: rgba(194, 178, 178, 0.99);
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);
      img{
        width: 100%;
        height: 100%;
      }
    }
    .top {
      width: 100%;
      height: 80px;
      //background: aqua;
      position: relative;
      //bfc 方案
      overflow: hidden;
      .back {
        position: absolute;
        .icon-xiangxia {
          font-size: 40px;
          font-weight: bold;
          color: #b2d372;
        }
      }

      .title {
        text-align: center;
        display: block;
        font-size: 30px;
        margin: 8px auto 8px auto;
      }

      .subtitle {
        text-align: center;
        font-size: 20px;
      }
    }
  }
}
</style>
