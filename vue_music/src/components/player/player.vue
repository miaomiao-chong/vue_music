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
      <div class="bottom">
        <div class="operators">
          <!--          循环-->
          <div class="icon">
            <i class="iconfont innerIcon icon-liebiaoxunhuan"></i>
          </div>
          <!--          上一曲-->
          <div class="icon">
            <i class="iconfont innerIcon icon-shangyiqu"></i>
          </div>
          <!--          播放暂停-->
          <div class="icon">
            <i class="iconfont innerIcon" :class="playIcon" @click="toggleIcon"></i>
          </div>
          <!--          下一曲-->
          <div class="icon">
            <i class="iconfont innerIcon icon-xiayiqu"></i>
          </div>
          <!--          喜欢-->
          <div class="icon">
            <i class="iconfont innerIcon icon-shoucang"></i>
          </div>

        </div>
      </div>
    </div>
    <!--    控制歌曲播放-->
    <audio ref="audioRef" @pause="pause"></audio>
  </div>
</template>

<script>
export default {
  name: "player",
  data() {
    return {}
  },
  computed: {
    // 希望fullScreen是响应式的
    fullScreen() {
      return this.$store.state.fullScreen
    },
    currentSong() {
      return this.$store.getters.currentSong
    },
    playing() {
      return this.$store.state.playing
    },
    playIcon() {
      console.log(this.playing)
      return this.playing ? 'icon-bofangzhong' : 'icon-zanting'
    }
  },
  watch: {
    currentSong(song) {
      console.log(this.$refs.audioRef)
      const audioEl = this.$refs.audioRef
      audioEl.src = song.url
      audioEl.play()
    },
    playing(newPlaying) {
      console.log("newPlaying", newPlaying)
      const audioEl = this.$refs.audioRef
      if (newPlaying) {
        audioEl.play()
      } else {
        audioEl.pause()
      }
    }
  },
  mounted() {
    // console.log(this.$store.state.fullScreen)
  },
  methods: {
    goBack() {
      this.$store.commit("setFullScreen", false)
    },
    toggleIcon() {
      // 不要直接修改playing 要修改vuex数据
      this.$store.commit('setPlayingState', !this.playing)
    },
    // 音乐自己关闭的情况 不是用户交互触发它暂停
    pause() {
      this.$store.commit('setPlayingState', false)
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
          color: #a5f609;
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

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .operators {
        display: flex;

        .icon {
          flex: 1;
          text-align: center;
          //这个直接用i也可
          .innerIcon {
            font-size: 30px;

          }
        }

      }
    }
  }
}
</style>
