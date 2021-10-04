<template>
  <div class="player">
    <div class="normal-player"
         v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic"/>
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="iconfont icon-xiangxia"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h1 class="subtitle">{{ currentSong.singer }}</h1>
      </div>

    </div>
    <!--    控制歌曲播放-->
    <audio ref="audioRef"></audio>
  </div>
</template>

<script>
export default {
  name: "player",
  data() {
    return {
    }
  },
  computed: {
    // 希望fullScreen是响应式的
    fullScreen() {
      return this.$store.state.fullScreen
    },
    currentSong() {
      return this.$store.getters.currentSong
    }
  },
  watch: {

  },
  mounted() {
    // console.log(this.$store.state.fullScreen)
  },
  methods: {
    goBack() {
      this.$store.commit("setFullScreen", false)
    }
  }
}
</script>

<style scoped lang="scss">
.player {
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(194, 178, 178, 0.99);

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
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
        margin: 12px 0 0 12px;
        .icon-xiangxia {
          font-size: 30px;
          font-weight: bold;
          color: #b2d372;
        }
      }

      .title {
        text-align: center;
        display: block;
        font-size: 23px;
        font-weight: bold;
        margin: 11px auto 15px auto;
      }

      .subtitle {
        text-align: center;
        font-size: 20px;
      }
    }
  }
}
</style>
