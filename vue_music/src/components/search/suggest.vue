<template>
  <div class="suggestContainer" v-no-result="noResult">
    <ul class="suggestList">
      <li class="suggestItem" v-for="item in songs" :key="item.id">
        <div class="icon">
          <i class="iconfont icon-yinle"></i>
        </div>
        <div class="listItem">
          {{ item.songName }}--{{ item.singer }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getSearchList } from "@/service/search";

export default {
  name: "suggest",
  props: {
    query: String
  },
  data() {
    return {
      songs: [],
      hasMore: true,
      songCount: 0,
      offset: 0,
      limit: 30,
      page: 0
    }
  },
  computed: {
    noResult() {
      return this.query && this.hasMore && false && this.songCount === 0
    }
  },
  watch: {
    async query(newVal) {
      await getSearchList(newVal, 20, 0).then((res) => {
        // console.log(res)
        this.resetData()
        this.songs = res.data.songs
        this.hasMore = res.data.hasMore
        this.songCount = res.data.songCount

      })
    }
  },
  methods: {
    resetData() {
      // query发生变化以后，page值也应该变成初始值,songs也应该清空
      this.songs = []
      this.hasMore = true
      this.songCount = 0
      this.offset = 0
      this.limit = 30
      this.page = 0
    }
  }
}
</script>

<style scoped lang="scss">
.suggestContainer {
  //height: 100%;

  .suggestList {
    .suggestItem {
      display: flex;
      padding-left: 15px;
      height: 30px;

      .icon {
        .icon-yinle {
          color: #954e4e;
          font-size: larger;
          line-height: 30px;
        }
      }

      .listItem {
        padding-left: 8px;
        line-height: 30px;
        font-size: 16px;
        color: #797373;
      }
    }
  }
}

</style>
