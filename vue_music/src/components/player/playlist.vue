<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playList" v-show="visible&&playlist.length" @click="hide">
        <div class="list-wrapper" style="background-color: #a5f609" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon"></i>
              <span class="text">{{ modeText }}</span>
              <div class="close" @click="hide">X</div>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <ul>
              <li class="item" v-for="song in sequenceList" :key="song.id">
                <span class="text">{{ song.name }}</span>
                <span class="favorite">
                  <i class="iconfont icon-shoucang"></i>
                </span>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";

export default {
  name: "playlist",
  components: { Scroll },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
  },
  computed: {
    playlist() {
      return this.$store.state.playlist
    },
    sequenceList() {
      return this.$store.state.sequenceList
    },
    modeIcon() {

    }
  },
  methods: {
    hide() {
      this.visible = false
    },
    show() {
      console.log("show")
      this.visible = true
      this.$nextTick(() => {
        this.refreshScroll()
      })
    },
    refreshScroll() {
      // 这里的scroll 就是Bscroll的实例
      console.log("refresh")
      this.$refs.scrollRef.scroll.refresh()
    }
  }
}
</script>

<style scoped lang="scss">
.playList {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    overflow: hidden;

    .list-header {
      height: 50px;
      align-items: center;
      .title {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
          .close{
            font-size: 20px;
            position: absolute;
            right: 20px;
            overflow: hidden;

          }
      }
    }

    .list-content {
      height: 440px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
      }
    }
  }

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;

    .list-wrapper {
      transition: all .3s;
    }

  }

  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

}
</style>
