<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd">
          <img width="40" height="40" :src="currentSong.pic" :style="animationState"/>
        </div>
      </div>
      <div>
        <h2 class="name">{{ currentSong.name }}</h2>
        <p class="desc">{{ currentSong.singer }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "mini-player",
  computed: {
    playing() {
      return this.$store.state.playing || []
    },
    fullScreen() {
      return this.$store.state.fullScreen
    },
    currentSong() {
      return this.$store.getters.currentSong
    },
    animationState() {
      return {
        animationPlayState: this.playing ? 'running' : 'paused'
      }
    }
  },
  methods: {
    showNormalPlayer() {
      this.$store.commit('setFullScreen', true)
    }
  }

}
</script>

<style scoped lang="scss">
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 60px;
  background-color: #333333;

  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;

    .cd {
      height: 100%;
      width: 100%;

      img {
        border-radius: 50%;
        animation: rotateImg 30s linear infinite;
      }

      @keyframes rotateImg {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

    }

  }

  .name {
    margin-bottom: 2px;
    @include no-wrap();
    font-size: 10px;
    color: whitesmoke;
  }

  .desc {
    @include no-wrap();
    font-size: 8px;
    color: #d1d1e1;
  }

  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from, &.mini-leave-to {
    //transition: all 0.6s cubic-bezier(0.45, 0, 0.55,1);
    opacity: 0;
    //y轴位移 有从下往上冒的效果
    transform: translate3d(0, 100%, 0);
  }
}
</style>
