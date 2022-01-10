<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input :placeholder="placeholder" v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hotKeys">
          <h1 class="title">热门搜索</h1>
          <ul class="itemContainer">
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.first"
              @click="chooseHot(item)"
            >
              <span>{{ item.first }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchList.length">
          <div class="titleCon">
            <span class="title">搜索历史</span>
            <span class="clear" @click="showConfirm">
              清空列表
            </span>
          </div>
          <confirm ref="confirmRef" text="确认全部删除吗" @confirm="confirm" @cancel="cancel">
          </confirm>
          <search-list :list="searchList" @deleteSearchHistory="deleteSearchHistory"
                       @clickSearchHistory="clickSearchHistory"></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query" v-on:selectSong="selectSong"></suggest>
    </div>
  </div>
</template>

<script>
import searchInput from "@/components/search/search-input";
import { getHotKeys, getOneSongDetail, getSearchList } from "@/service/search";
import Scroll from "@/components/base/scroll/scroll";
import Suggest from "@/components/search/suggest";
import { getSingerDetail } from "@/service/singer";
import Confirm from "@/components/base/confirm/confirm";
import SearchList from "@/components/search/search-list";
import { SEARCH_KEY } from "@/assets/js/constant";

export default {
  name: "",
  components: {
    SearchList,
    Confirm,
    Suggest,
    Scroll,
    "search-input": searchInput,
  },
  data() {
    return {
      placeholder: "输入查询的歌手/歌曲",
      query: "",
      // 热门搜索
      hotKeys: [],
      searchResList: []
    };
  },
  watch: {
    async query(newVal) {
      console.log(newVal);
      // getSearchList(newVal, 30, 0)
      if (!newVal) {
        await this.$nextTick()
        // scroll组件有个scroll对象，对象里面有个refresh方法
        console.log(this.$refs.scrollRef)
        // this.$refs.scrollRef.scroll.refresh()
        this.refreshScroll()
      }
    },
  },
  async created() {
    await getHotKeys().then((res) => {
      // console.log(res.data.result.hotKeys)
      this.hotKeys = res.data.result.hotKeys;
    });
  },
  computed: {
    searchList() {
      return this.$store.state.searchHistory
    }
  },
  methods: {
    refreshScroll() {
      this.$refs.scrollRef.scroll.refresh()
    },
    chooseHot(item) {
      // console.log(item);
      this.query = item.first
    },
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

      // 处理缓存
      // const searchHis = JSON.parse(localStorage.getItem(SEARCH_KEY)) || []
      // // 是否已经添加
      // const index = searchHis.findIndex((listItem) => {
      //   console.log(listItem.id, item.id)
      //   return listItem.id === item.id
      // })
      // // 删除前面已经有的item, 把新的添加到最前面
      // if (index === 0) {
      //   return
      // }
      // if (index !== -1) {
      //   console.log("已经有了")
      //   searchHis.splice(index, 1)
      // }
      // searchHis.unshift(item)
      // localStorage.setItem(SEARCH_KEY, JSON.stringify(searchHis))
      // this.$store.commit("setSearchHistory", searchHis)

    },
    // 点击历史记录
    clickSearchHistory(val) {
      this.query = val
    },
    // 删除历史
    deleteSearchHistory(item) {
      const searchList = JSON.parse(localStorage.getItem(SEARCH_KEY)) || []
      const index = searchList.findIndex((storageItem) => {
        return storageItem.id === item.id
      })
      if (index >= 0) {
        searchList.splice(index, 1)
      }
      localStorage.setItem(SEARCH_KEY, JSON.stringify(searchList))
      this.$store.state.searchHistory = searchList
    },
    //  删除全部历史记录
    showConfirm() {
      this.$refs.confirmRef.show()
    },
    confirm() {
      localStorage.removeItem(SEARCH_KEY)
      console.log(localStorage)
      this.$store.state.searchHistory = []
    }
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: scroll;

  .search-input-wrapper {
    margin: 0 20px;
  }

  .search-content {
    flex: 1;
    //position: fixed;
    //top: 130px;
    //bottom: 0;
    overflow: hidden;

    div {
      .hotKeys {
        margin: 0 20px 20px 20px;

        .title {
          height: 30px;
          color: #6f6f6c;
          line-height: 30px;
        }

        .itemContainer {
          display: flex;
          flex-wrap: wrap;
          // margin: 0 20px 20px 20px;
          .item {
            height: 30px;
            line-height: 30px;
            padding: 0 5px;
            border-radius: 6px;
            background: rgb(97, 94, 94);
            color: rgba($color: #2e2828, $alpha: 0.5);
            // background-color: rgba(244, 249, 253, 0.692);
            margin: 0 5px 5px 0;
          }
        }
      }

      .search-history {
        width: 100vw;
        padding: 0 20px;
        box-sizing: border-box;

        .titleCon {
          height: 30px;
          line-height: 30px;
          display: flex;
          color: #6f6f6c;
          width: 100%;

          .title {
            display: inline-block;
            //width: 80%;
            flex: 1;
          }

          .clear {
            width: 90px;
          }
        }
      }
    }

  }

  .search-result {
    flex: 1;
    overflow: scroll;
  }
}
</style>
