<template>
  <div class="music-list">
    <!-- 顶层的返回按钮 -->
    <div class="back" @click="goBack">
      <i class="iconfont icon-fanhui" style="color: yellow"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <!-- 半透明 -->
      <div class="filter"></div>
      <div class="play-btn-wrapper">
        <div class="play-btn">
          <i class="iconfont icon-Play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <scroll class="list" :style="scrollStyle" v-loading="loading">
      <div class="song-list-wrapper">
        <Song-list :songs="songs"></Song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import SongList from "@/components/base/song-list/song-list";
// import Scroll from "../base/scroll/scroll.vue";
export default {
  name: "music-list",
  components: { Scroll, SongList },
  props: {
    songs: {
      type: Array,
      default() {
        return [];
      },
    },
    title: String,
    pic: String,
    loading: Boolean,
  },
  data() {
    return {
      imageHeight: 0,
    };
  },
  created() {
    console.log(this.songs);
    console.log(this.title);
    console.log(this.pic);
  },
  computed: {
    bgImageStyle() {
      return {
        backgroundImage: `url(${this.pic})`,
        //   backgroundImage:
        //     'url("https://img-blog.csdnimg.cn/a0d98281da88480aa8be2e0dbda23fd6.jpg")',
      };
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`,
      };
    },
  },
  methods: {
    goBack() {
      this.$router.back();
    },
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
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
    background-size: cover;
    height: 0;
    padding-top: 70%;
    .filter {
    }
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
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
          margin-right: 5px;
        }
        .text {
        }
      }
    }
  }
  .list {
    // height: 300px;
    overflow: hidden;

    position: absolute;
    bottom: 0;
    width: 100%;
    .song-list-wrapper {
      padding: 0 20px;
      // background: rgb(72, 72, 73);
    }
  }
}
</style>