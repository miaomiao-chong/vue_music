<template>
  <div class="music-list">
    <!-- 顶层的返回按钮 -->
    <div class="back" @click="goBack">
      <i class="iconfont icon-fanhui" style="color: yellow"></i>
    </div>
    <h1 class="title">
      <x-marquee :word="title" :interval="200" :step="3"></x-marquee>
    </h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 半透明 -->
      <div class="filter" :style="filterStyle"></div>
      <div class="play-btn-wrapper">
        <div class="play-btn" :style="btnStyle" @click="randomPlay">
          <i class="iconfont icon-Play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probeType="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <Song-list :songs="data" :rank="rank" @select="selectItem"></Song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
// import Scroll from "@/components/base/scroll/scroll";
import Scroll from "@/components/wrap-scroll/index";
import SongList from "@/components/base/song-list/song-list";
import marquee from "@/components/base/marquee/marquee";
// import Scroll from "../base/scroll/scroll.vue";
const RESERVE_HRIGHT = 40;
export default {
  name: "music-list",
  components: {
    Scroll,
    SongList,
    'x-marquee': marquee
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
    rank: Boolean
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      // 最大可以滚动的距离
      maxTranslateY: 0,
    };
  },
  created() {
    // console.log(this.songs);
    // console.log(this.title);
    // console.log(this.pic);
  },
  computed: {
    bgImageStyle() {
      const scrollY = this.scrollY;
      let zIndex = 0;
      let paddingTop = "70%";
      let height = 0;
      let translateZ = 0;
      if (scrollY > this.maxTranslateY) {
        zIndex = 10;
        paddingTop = 0;
        height = `${RESERVE_HRIGHT}px`;
        translateZ = 1;
      }

      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }
      return {
        height,
        paddingTop,
        zIndex,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${translateZ}px)`,
      };
    },
    btnStyle() {
      let display = "";
      if (this.scrollY > this.maxTranslateY) {
        display = "none";
      }
      return {
        display
      };
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`,
        bottom: this.$store.state.playlist.length ? '60px' : ''
      };
    },
    filterStyle() {
      let blur = 0;
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) *
          20;
      }
      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
      // console.log(this.scrollY);
    },
    selectItem(data) {
      const {
        songItem,
        index
      } = data
      // console.log(index, songItem)
      // console.log(aaa)
      // 传入此歌单所有歌曲以及歌曲索引
      this.$store.dispatch('selectPlay', {
        list: this.data,
        index
      })
    },
    randomPlay() {
      console.log("随机按钮")
      this.$store.dispatch('randomPlay', this.data)
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.maxTranslateY = this.imageHeight - RESERVE_HRIGHT;
  },
};
</script>

<style lang="scss" scoped>
.music-list {
  height: 100%;
  position: relative;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);

    .icon-fanhui {
      display: block;
      padding: 10px;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    // @include no-wrap();
    text-align: center;
    line-height: 40px;
  }

  .bg-image {
    position: relative;
    width: 100%;
    // height: 250px;
    transform-origin: top;
    background-size: cover;

    .filter {
      position: absolute;
      z-index: 22;
      transform: translateZ(2);
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }

    .play-btn-wrapper {
      // position: absolute;
      // bottom: 20px;
      // width: 100%;
      position: absolute;
      bottom: 20px;
      z-index: 30;
      width: 100%;

      .play-btn {
        margin: 0 auto;
        // box-sizing: border-box;
        padding: 8px;
        text-align: center;
        width: 140px;
        border: 1px solid rgb(194, 209, 141);
        border-radius: 100px;
        color: rgba(207, 224, 173, 0.911);

        .icon-Play {
          display: inline-block;
          margin-right: 5px;
        }

        .text {
          display: inline-block;
        }
      }
    }
  }

  .list {
    // height: 300px;
    // overflow: hidden;

    position: absolute;
    bottom: 0;
    width: 100%;

    .song-list-wrapper {
      padding: 0 20px;
      background: rgb(72, 72, 73);
    }
  }
}
</style>
