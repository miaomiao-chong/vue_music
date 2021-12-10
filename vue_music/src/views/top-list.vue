<template>
  <div class="top-list" v-loading="loading">
    <scroll class="top-list-content">
      <div class="scrollContainer">
        <ul>
          <li
            class="item"
            v-for="item in isDetailList"
            :key="item.id"
            @click="selectItem(item)"
          >
            <div class="icon">
              <img
                width="100"
                height="100"
                v-lazy="item.coverImgUrl"
              />
            </div>
            <ul class="song-list">
              <li
                class="song"
                v-for="(song, index) in item.songList"
                :key="song.id">
                <span>{{ index + 1 }}. </span>
                <span>{{ song.songName }}-{{ song.singerName }}</span>
              </li>
            </ul>
          </li>
        </ul>

        <ul class="noDetailContainer">
          <li
            class="noDetailItem"
            v-for="item in noDetailList"
            :key="item.id"
            @click="selectItem(item)"
          >
            <div class="playCount">{{ parsePlayCount(item.playCount, 2) }}</div>
            <div class="icon">
              <img
                v-lazy="item.coverImgUrl"
              />
            </div>
          </li>
        </ul>
      </div>

    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :topList="selectedTop"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getTopList } from "@/service/top-list";
import Scroll from "@/components/base/scroll/scroll";
import { ALBUM_KRY } from "@/assets/js/constant";

export default {
  name: 'top-list',
  data() {
    return {
      isDetailList: [],
      noDetailList: [],
      selectedTop: {},
      loading: true
    }
  },
  components: { Scroll },
  mounted() {

  },
  computed: {},
  async created() {
    const topListArr = await getTopList();
    console.log(topListArr.data.result.filteredList)
    const topList = topListArr.data.result.filteredList
    const isDetailList = []
    const noDetailList = []
    topList.forEach(item => {
      console.log(item.songList.length)
      if (item.songList.length) {
        isDetailList.push(item)
      } else {
        noDetailList.push(item)
      }
    })
    this.isDetailList = isDetailList
    this.noDetailList = noDetailList
    this.loading = false
  },

  methods: {
    // 格式化听歌数
    parsePlayCount(value, point = 2) {
      let numStr = value.toString()
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length <= 8) {
        let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
        return parseFloat(parseInt(value / 10000) + '.' + decimal) +
          '万'
      } else if (numStr.length > 8) {
        let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseFloat(parseInt(value / 100000000) + '.' + decimal) + '亿'
      }
    },
    selectItem(item) {
      // console.log(12345)
      this.cacheTopList(item)
      this.selectedTop = item
      this.$router.push(`/top-list/${item.id}`)
    },
    cacheTopList(toplist) {
      const toplistStr = JSON.stringify(toplist)
      sessionStorage.setItem(ALBUM_KRY, toplistStr)
    }
  }
}

</script>

<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .top-list-content {
    height: 100%;
    overflow: hidden;

    .scrollContainer {
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;

        &:last-child {
          padding-bottom: 10px;
        }

        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }

        .song-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 5px 0 10px;
          height: 100px;
          overflow: hidden;

          .song {
            @include no-wrap();
            line-height: 26px;
          }
        }
      }

      .noDetailContainer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20px;

        .noDetailItem {
          width: 30%;
          box-sizing: border-box;
          margin-bottom: 10px;
          position: relative;

          .playCount {
            position: absolute;
            top: 5px;
            left: 3px;
            font-size: 6px;
          }

          .icon {
            width: 100%;

            img {
              width: 100%;
            }
          }
        }
      }
    }

  }
}
</style>
