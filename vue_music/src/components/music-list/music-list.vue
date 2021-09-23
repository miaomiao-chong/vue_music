<template>
  <div class="music-list">
    <!-- 顶层的返回按钮 -->
    <div class="back" @click="goBack">
      <i class="iconfont icon-fanhui" style="color: yellow"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgImageStyle">
      <!-- 半透明 -->
      <div class="filter"></div>
    </div>
    <scroll class="list">
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
  },
  methods: {
    goBack() {
      this.$router.back()
    }
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
    width: 100%;
    height: 250px;
    background-size: cover;
  }
  .list {
    // height: 300px;
    overflow: hidden;
    top: 250px;
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