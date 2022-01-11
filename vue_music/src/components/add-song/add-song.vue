<template>
  <teleport to="body">
    <transition name="slide">
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="visible=false">
            X
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input v-model="query" placeholder="搜索歌曲"></search-input>
        </div>
        <div v-show="!query">
          <div class="switches">
            <switches :items="['最近播放', '搜索历史']" v-model="currentIndex"></switches>
            <div class="list-wrapper">
              <scroll
                v-if="currentIndex===0"
                class="list-scroll"
                ref="scrollRef"
              >
                <div class="list-inner">
                  <song-list
                    :songs="playHistory"
                    @select="selectSongBySongList"
                  >
                  </song-list>
                </div>
              </scroll>
              <scroll
                v-if="currentIndex===1"
                class="list-scroll"
                ref="scrollRef"
              >
                <div class="list-inner">
                  <search-list
                    :list="searchHistory"
                    :show-delete="false"
                    @clickSearchHistory="clickSearchHistory"
                  ></search-list>
                </div>
              </scroll>
            </div>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest :query="query" @selectSong="selectSong"></suggest>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import SearchInput from "@/components/search/search-input";
import Suggest from "@/components/search/suggest";
import Switches from "@/components/base/switch/switch";
import SearchList from "@/components/search/search-list";
import SongList from "@/components/base/song-list/song-list";
import Scroll from "@/components/base/scroll/scroll";
import { getOneSongDetail } from "@/service/search";
import { SEARCH_KEY } from "@/assets/js/constant";

export default {
  name: "add-song",
  components: {
    Scroll,
    SongList,
    SearchList,
    Switches,
    Suggest,
    SearchInput
  },
  data() {
    return {
      visible: false,
      query: '',
      currentIndex: 0
    }
  },
  computed: {
    // 第二个tab的数据
    searchHistory() {
      return this.$store.state.searchHistory
    },
    playHistory() {
      console.log(this.$store.state.playHistory)
      return this.$store.state.playHistory
    },
    // 点击事件

  },
  watch: {
    async visible() {
      await this.$nextTick()
      this.$refs.scrollRef.scroll.refresh()
    },
    async query() {
      await this.$nextTick()
      this.$refs.scrollRef.scroll.refresh()
    }
  },
  methods: {
    clickSearchHistory(e) {
      this.query = e
    },
    // 两个参数，只需要其中的songItem
    selectSongBySongList({ songItem }) {
      console.log(songItem)
      this.$store.dispatch("addSong", songItem)
    },
    //  suggest组件点击
    async selectSong(item) {
      console.log("外部拿到", item)
      const song = await getOneSongDetail(item.id)
      // console.log(a)
      if (song.data.result.length === 0) {
        console.log("没有数据")
        return
      }
      this.$store.dispatch('addSong', song.data.result[0])

      // 处理缓存  ---  搜索历史
      const searchHis = JSON.parse(localStorage.getItem(SEARCH_KEY)) || []
      // 是否已经添加
      const index = searchHis.findIndex((item) => {
        console.log(item, this.query)
        return item === this.query
      })
      // 删除前面已经有的item, 把新的添加到最前面
      if (index === 0) {
        return
      }
      if (index !== -1) {
        console.log("已经有了")
        searchHis.splice(index, 1)
      }
      // console.log("item", item)
      searchHis.unshift(this.query)
      localStorage.setItem(SEARCH_KEY, JSON.stringify(searchHis))
      this.$store.commit("setSearchHistory", searchHis)

    }
  }
}
</script>

<style scoped lang="scss">
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background-color: #423f3f;

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: 15px;
      color: whitesmoke;
    }

    .close {
      position: absolute;
      top: 14px;
      right: 10px;
      //transform:translateY(16px);
    }
  }

  .search-input-wrapper {
    margin: 20px
  }

  .list-wrapper {
    position: absolute;
    top: 148px;
    bottom: 0;
    width: 100%;

    .list-scroll {
      height: 100%;
      overflow: hidden;

      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
