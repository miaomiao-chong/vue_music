<template>
  <div class="album-container">
    <music-list
      :data="songList"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import musicList from "@/components/music-list/music-list";
import { ALBUM_KRY } from "@/assets/js/constant";
import { getAlbum } from "@/service/recommend";
import { getSongUrl } from "@/service/song";

export default {
  name: "album",
  components: {
    musicList
  },
  props: {
    album: {
      type: Object
    }
  },
  data() {
    return {
      result: [],
      loading: true,
      songList: []
    }
  },
  computed: {
    computedAlbum() {
      let ret = null
      const album = this.album
      // 这里是个proxy对象，所以不能直接对album判空？
      console.log("album:", album.id)
      if (album.id) {
        ret = album
      } else {
        console.log("session")
        console.log('sessionStorage.getItem(albumkey)', sessionStorage.getItem(ALBUM_KRY))
        const cachedAlbum = JSON.parse(sessionStorage.getItem(ALBUM_KRY))
        console.log(cachedAlbum)
        console.log("cachedAlbum.id ", cachedAlbum.id, "this.$route.params.id", this.$route.params.id)
        if (cachedAlbum && cachedAlbum.id.toString() === this.$route.params.id) {
          ret = cachedAlbum
          console.log("--------ret-----", ret)
        }
      }
      const newRet = {
        id: ret.id,
        picUrl: ret.pic,
        name: ret.username
      }
      return newRet
    },
    pic() {
      return this.computedAlbum.picUrl;
    },
    title() {
      return this.computedAlbum.name;
    },
  },
  async created() {
    let result = await getAlbum(this.computedAlbum.id)
    result = result.data.result.slice();
    console.log("----result-----", result)
    result = await getSongUrl({ mid: result })
    console.log("-----result------", result)
    this.songList = result
    this.loading = false
  },
  mounted(e) {
    console.log(e);
    console.log(this.album)
  },

}
</script>

<style scoped>
.album-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: rgb(68, 66, 66);
}
</style>
