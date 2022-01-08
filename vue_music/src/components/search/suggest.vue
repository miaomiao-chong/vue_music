<template>
<!--  v-loading[loadingText]="!songs.length&&hasMore"总是报错-->
  <div class="suggestContainer"  ref="rootRef">
    <ul class="suggestList">
      <li class="suggestItem" @click="selectSong(item)"  v-for="item in songs" :key="item.id">
        <div class="icon">
          <i class="iconfont icon-yinle"></i>
        </div>
        <div class="listItem">
          {{ item.songName }}--{{ item.singer }}
        </div>
      </li>
      <div  v-show="pullUpLoading" class="loading"><img src="@/assets/images/loading.gif" width="30" height="30"/></div>
      <li class="suggestItem"  style="text-align: center; display:block ; width: 100vw; color:#797373; padding-top: 20px" v-show="!hasMore"> ---已全部加载完毕---</li>
    </ul>
  </div>
</template>

<script>
import { getSearchList } from "@/service/search";
import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'

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
      page: 0,
      // 有关betterScroll
      // 标志位是正在拉取还是拉取结束
      isPullUpLoad: false,
      scroll: null
    }
  },
  mounted() {
    // 有关bscroll
    BScroll.use(PullUp)
    BScroll.use(ObserveDOM)
    // console.log(this.$refs['rootRef'])
    this.scroll = new BScroll(this.$refs['rootRef'], {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    })
    //  监听pullingUp事件
    //   pullingUpHandler:回调函数
    this.scroll.on('pullingUp', this.pullingUpHandler)
  },
  computed: {
    // 总页数
    totalpage() {
      return Math.ceil(this.songCount / this.limit)
    },
    loadingText() {
      console.log(this.query.length, this.hasMore === false, this.songCount === 0)
      // 这样不行，貌似后面loadingText不会变化了啊
      return this.query.length && this.hasMore === false && this.songCount === 0 ? '没有结果' : '正在加载'
    },
    // 到底部时显示的文字
    pullUpLoading() {
      return this.isPullUpLoad && this.hasMore
    }
  },
  watch: {
    query(newVal) {
     this.search()
    },
    async page(val) {
      if (val + 1 > this.totalpage) {
        console.log('已经没有数据了')
      }
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
    },
    // pullingUp回调
    async pullingUpHandler() {
      this.isPullUpLoad = true
      console.log("具体逻辑")
      await this.searchMore()
      const scroll = this.scroll
      scroll.finishPullUp()
      scroll.refresh()
      this.isPullUpLoad = false
    },

    async search() {
      await getSearchList(this.query, this.limit, this.page * this.limit).then((res) => {
        // console.log(res, res)
        this.resetData()
        this.songs = res.data.songs
        this.hasMore = res.data.hasMore
        this.songCount = res.data.songCount
      })
    },
    async searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      const newList = await getSearchList(this.query, this.limit, this.page * this.limit)
      // 拼接新请求到的数据
      this.songs = this.songs.concat(newList.data.songs)
      this.hasMore = newList.data.hasMore
    },
    selectSong (song) {
      console.log("子组件点击", song)
      this.$emit("selectSong", song)
    }
  },
  unmounted() {
    this.scroll.destroy()
  }
}
</script>

<style scoped lang="scss">
.suggestContainer {
  position: fixed;
  top: 120px;
  bottom: 0;
  overflow: hidden;
  .suggestList {
    .suggestItem {
      display: flex;
      padding-left: 15px;
      height: 30px;
      width: 100%;
      .icon {
        .icon-yinle {
          color: #954e4e;
          font-size: larger;
          line-height: 30px;
        }
      }
      .listItem {
        width: 80vw;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 8px;
        line-height: 30px;
        font-size: 16px;
        color: #797373;
      }
    }
    .loading {
      width: 100vw;
      height: 30px;
      img{
        display: block;
        margin: 0 auto;
      }
    }
  }
}

</style>
