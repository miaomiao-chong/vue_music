<template>
  <div class="singer-container">
    <!-- <div class="aaa">我是跳转后的页面</div> -->
    <music-list
      :title="title"
      :pic="pic"
      :songs="songs"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { getSongUrl } from "@/service/song";
import musicList from "@/components/music-list/music-list";
import { SINGER_KEY } from "@/assets/js/constant";
export default {
  name: "singer-detail",
  components: { musicList },
  data() {
    return {
      // title: "",
      // pic: "",
      songs: [],
      result: [],
      loading: true,
    };
  },

  props: {
    singer: Object,
  },
  computed: {
    computedSinger() {
      let ret = null;
      const singer = this.singer;
      if (singer) {
        ret = singer;
      } else {
        const cachedSinger = JSON.parse(sessionStorage.getItem(SINGER_KEY));
        console.log("cachedSinger", cachedSinger);
        console.log(typeof cachedSinger.id); // number
        console.log(typeof this.$route.params.id); // string
        if (
          cachedSinger &&
          JSON.stringify(cachedSinger.id) === this.$route.params.id
        ) {
          ret = cachedSinger;
        }
      }
      console.log("ret", ret);
      return ret;
    },
    //  pic和title为什么要放到计算属性里面
    pic() {
      const singer = this.computedSinger;
      return singer && singer.picUrl;
    },
    title() {
      const singer = this.computedSinger;
      // return singer && singer.picUrl;
      return singer && singer.name;
    },
  },
  async created() {
    // console.log(this.$route.params);
    // console.log(this.singer);
    // this.title = this.singer.name;
    // this.pic = this.singer.picUrl;
    // console.log("111", this.computedSinger);
    // console.log("this.computedSinger", this.computedSinger);
    // 如果缓存和点击的不匹配 那就跳到歌手页面
    if (this.computedSinger) {
      const path = this.$route;
      console.log("path", path);
      // this.$router.push({
      //   path,
      // });
    }
    let result = await getSingerDetail(this.computedSinger);
    result = result.data.result;
    this.songs = await getSongUrl({ mid: result, aa: "test" });
    console.log(this.songs);
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
.singer-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgb(68, 66, 66);
}
</style>