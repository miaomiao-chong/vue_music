<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="slider-wrapper">
        <div class="slider-page">
          <div class="cd-wrapper">
            <div class="cd">
              <img width="40" height="40" :src="currentSong.pic" :style="animationState"/>
            </div>
          </div>
          <!--          <div ref="titleSliderWrapper" class="titleWrapper">-->
          <!--            <div ref="titleSliderPage" class="titlePage">-->
          <!--              <h2 class="name">{{ currentSong.name }}</h2>-->
          <!--              <p class="desc">{{ currentSong.singer }}</p>-->
          <!--            </div>-->
          <!--          </div>-->
          <div ref="titleSliderWrapper" class="titleWrapper">
            <div class="titleGroup">
              <div ref="titleSliderPage" class="titlePage" v-for="song in playlist" :key="song.name">
                <h2 class="name">{{ song.name }}</h2>
                <p class="desc">{{ song.singer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Progress :percentage="progress*100" class="progress"></Progress>
    </div>
  </transition>
</template>

<script>
import progress from '@/components/base/progress/progress'
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { nextTick } from "vue";

let slider
BScroll.use(Slide)
export default {

  name: "mini-player",
  props: {
    progress: {
      type: Number,
      default: 0,
    }
  },
  components: {
    Progress: progress
  },
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
    },
    playlist() {
      return this.$store.state.playlist
    },
    sliderShow() {
      return !this.fullScreen && this.playlist.length
    },
    currentIndex() {
      return this.$store.state.currentIndex
    }
  },
  mounted() {
    this.sliderShow = false
  },

  watch: {
    async sliderShow() {
      await nextTick()
      if (!slider) {
        slider = new BScroll(this.$refs.titleSliderWrapper, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })
      } else {
        slider.refresh()
      }
      slider.goToPage(this.currentIndex, 0, 0)
    },
    currentIndex(currentIndex) {
      slider.goToPage(currentIndex, 0, 0)
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

  .slider-wrapper {
    width: 70%;
    height: 100%;

    .slider-page {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;

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

      .titleWrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        //overflow: hidden;
        width: 150px;
        height: 40px;
        line-height: 20px;
        overflow: hidden;

        .titleGroup {
          overflow: hidden;
          width: 100%;
          height: 100%;

          .titlePage {
            display: inline-block;
            height: 100%;
            width: 100%;

            .name {
              margin-bottom: 2px;
              @include no-wrap();
              font-size: 10px;
              color: whitesmoke;
              z-index: 10;
            }

            .desc {
              @include no-wrap();
              font-size: 8px;
              color: #d1d1e1;
              z-index: 10;
            }
          }
        }

      }

    }

    .progress {
      flex: 1;
    }

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
