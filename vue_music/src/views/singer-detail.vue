<template>
  <div class="singer-container">
    <!-- <div class="aaa">我是跳转后的页面</div> -->
    <music-list :title="title" :pic="pic" :songs="songs" :loading="loading"></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from "@/service/singer";
import { getSongUrl } from "@/service/song";
import musicList from "@/components/music-list/music-list";
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
    //  pic和title为什么要放到计算属性里面
    pic() {
      return this.singer && this.singer.picUrl;
    },
    title() {
      return this.singer && this.singer.name;
    },
  },
  async created() {
    // console.log(this.singer);
    // this.title = this.singer.name;
    // this.pic = this.singer.picUrl;
    let result = await getSingerDetail(this.singer);
    result = result.data.result;
    this.songs = await getSongUrl({ mid: result, aa: "test" });
    console.log(this.songs);
    this.loading = false;

    // console.log("resul", result);
    // console.log("urlData", urlData);
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