<template>
  <div
    class="user-center"
  >
<!--    返回上一级路由  -->
    <div class="back" @click="back">
      <i class="iconfont icon-fanhui"></i>
    </div>
<!--    切换按钮-->
<!--    <switches></switches>-->
    <div class="switches-wrapper">
      <switches
        :items="['我喜欢的', '最近播放']"
        v-model="currentIndex"
      ></switches>
    </div>
<!--    随机播放按钮-->
    <div class="play-btn-wrapper">
      <div class="play-btn" :style="btnStyle" @click="random">
        <i class="iconfont icon-Play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
<!--    列表展示-->
    <div class="list-wrapper">
      <scroll class="list-scroll" v-if="currentIndex===0">
        <div class="list-inner">
          <song-list
            :songs="likeList"
            @select="selectSong"
          >
          </song-list>
        </div>
      </scroll>
      <scroll class="list-scroll" v-if="currentIndex===1">
        <div class="list-inner">
          <song-list
            :songs="playHistory"
            @select="selectSong"
          >
          </song-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>

import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list'
import { mapState, mapActions } from 'vuex'
import Switches from "@/components/base/switch/switch";

export default {
  name: 'user-center',
  components: {
    Switches,
    Scroll,
    SongList
  },
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    currentList() {
      return this.currentIndex === 0 ? this.likeList : this.playHistory
    },
    ...mapState([
      'likeList',
      'playHistory'
    ])
  },
  methods: {
    back() {
      this.$router.back()
    },
    selectSong({ songItem }) {
      this.addSong(songItem)
    },
    random() {
      // this.randomPlay(this.currentList)
      // console.log("this.currentList", this.currentList)
      this.$store.dispatch("randomPlay", this.currentList)
    },
    ...mapActions([
      'addSong',
      'randomPlay'
    ])
  }
}
</script>

<style scoped lang="scss">
.user-center {
  z-index: -1;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background-color: #423f3f;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-fanhui {
      display: block;
      padding: 10px;
      font-size: larger;
      color: yellow;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn-wrapper {
    // position: absolute;
    // bottom: 20px;
    // width: 100%;
    position: absolute;
    //bottom: 20px;
    z-index: 30;
    width: 100%;

    .play-btn {
      margin: 0 auto;
      // box-sizing: border-box;
      padding: 8px;
      text-align: center;
      width: 140px;
      border: 1px solid rgb(194, 209, 141);
      border-radius: 100px;
      color: rgba(207, 224, 173, 0.911);

      .icon-Play {
        display: inline-block;
        margin-right: 5px;
      }

      .text {
        display: inline-block;
      }
    }
  }

  .list-wrapper {
    position: absolute;
    top: 110px;
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
