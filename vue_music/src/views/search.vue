<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input :placeholder="placeholder" v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
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
    </scroll>
    <div class="search-result" v-show="query"><suggest :query="query"></suggest></div>

  </div>
</template>

<script>
import searchInput from "@/components/search/search-input";
import { getHotKeys, getSearchList } from "@/service/search";
import Scroll from "@/components/base/scroll/scroll";
import Suggest from "@/components/search/suggest";

export default {
  name: "",
  components: {
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

    },
  },
  async created() {
    await getHotKeys().then((res) => {
      // console.log(res.data.result.hotKeys)
      this.hotKeys = res.data.result.hotKeys;
    });
  },
  methods: {
    chooseHot(item) {
      // console.log(item);
      this.query = item.first
    },
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
  .search-input-wrapper {
    margin: 0 20px;
  }

  .search-content {
    position: fixed;
    top: 130px;
    bottom: 0;

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
  }
  .search-result{
      flex: 1;
  }
}
</style>
