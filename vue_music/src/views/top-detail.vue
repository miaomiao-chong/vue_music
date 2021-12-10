<template>
  <div class="toplist-container">
    <music-list
      :data="songList"
      :title="title"
      :pic="pic"
      :loading="loading"
      :rank="true"
    ></music-list>
  </div>
</template>

<script>
import musicList from "@/components/music-list/music-list";
import { TOP_LIST_KEY } from "@/assets/js/constant";
import { getSongUrl } from "@/service/song";
import { getTopDetail } from "@/service/top-list";

export default {
  name: "top-detail",
  props: {
    topList: {
      type: Object,
    }
  },
  components: {
    musicList
  },
  data() {
    return {
      result: [],
      loading: true,
      songList: []
    }
  },
  computed: {
    computedTopDetail() {
      let ret = null
      const topList = this.topList
      // 这里是个proxy对象，所以不能直接对album判空？
      console.log("album:", topList)
      if (topList.id) {
        ret = topList
      } else {
        console.log("session")
        console.log('sessionStorage.getItem(albumkey)', sessionStorage.getItem(TOP_LIST_KEY))
        const cachedTopList = JSON.parse(sessionStorage.getItem(TOP_LIST_KEY))
        console.log(cachedTopList)
        console.log("cachedAlbum.id ", cachedTopList.id, "this.$route.params.id", this.$route.params.id)
        if (cachedTopList && cachedTopList.id.toString() === this.$route.params.id) {
          ret = cachedTopList
          console.log("--------ret-----", ret)
        }
      }
      console.log("ret.....", ret)
      const newRet = {
        id: ret.id,
        picUrl: ret.coverImgUrl,
        name: ret.name
      }
      return newRet
    },
    pic() {
      return this.computedTopDetail.picUrl;
    },
    title() {
      return this.computedTopDetail.name;
    },
  },
  async created() {
    let result = await getTopDetail(this.computedTopDetail.id)
    result = result.data.result.slice();
    console.log("----result-----", result)
    result = await getSongUrl({ mid: result })
    console.log("-----result------", result)
    this.songList = result
    this.loading = false
  }
}
</script>

<style scoped>
.toplist-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgb(68, 66, 66);
}
</style>
