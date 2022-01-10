<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playList" v-show="visible&&playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon iconfont" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <div class="close" @click.stop="hide">X</div>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <!--            <ul>-->
            <!--              <li class="item" v-for="song in sequenceList" :key="song.id" @click="selectSong(song)">-->
            <!--                <span class="text" :class="{'playItem': song.id==currentSong.id}">{{ song.name }}</span>-->
            <!--                <span class="favorite" @click.stop="toggleLike(song)">-->
            <!--                  <i class="iconfont icon-shoucang" :style="getFavoriteIcon(song)"></i>-->
            <!--                </span>-->
            <!--                <span class="deleteIcon" @click.stop="deleteItem(song)">X</span>-->
            <!--              </li>-->
            <!--            </ul>-->
            <transition-group name="list" tag="ul">
              <li class="item" v-for="song in sequenceList" :key="song.id" @click="selectSong(song)">
                <span class="text" :class="{'playItem': song.id==currentSong.id}">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleLike(song)">
                              <i class="iconfont icon-shoucang" :style="getFavoriteIcon(song)"></i>
                            </span>
                <span class="deleteIcon" @click.stop="deleteItem(song)" :class="{'disable':removing}">X</span>
              </li>
            </transition-group>
          </scroll>
          <div class="operate">
            <div class="add" @click="showAddSong">点此添加</div>
            <div class="clearAll" @click="clearAll">点此清空</div>
          </div>
        </div>
        <confirm text="确认清空吗" @confirm="confirm" ref="confirm"></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from "@/components/base/scroll/scroll";
import { FAVORITE_KEY, PLAY_MODE } from "@/assets/js/constant";
import Confirm from "@/components/base/confirm/confirm";
import AddSong from "@/components/add-song/add-song";

export default {
  name: "playlist",
  components: {
    AddSong,
    Confirm,
    Scroll
  },
  data() {
    return {
      visible: false,
      removing: false
    }
  },
  mounted() {
    // console.log(Object.prototype.toString.call(this.test))
  },
  computed: {
    playlist() {
      return this.$store.state.playlist
    },
    sequenceList() {
      return this.$store.state.sequenceList
    },
    playMode() {
      return this.$store.state.playMode
    },
    currentSong() {
      return this.$store.getters.currentSong
    },
    modeIcon() {
      return this.playMode === PLAY_MODE.sequence ? 'icon-liebiaoxunhuan' : this.playMode === PLAY_MODE.loop ? 'icon-danquxunhuan' : 'icon-suijibofang'
    },
    modeText() {
      return this.playMode === PLAY_MODE.sequence ? '列表循环' : this.playMode === PLAY_MODE.loop ? '单曲循环' : '随机播放'
    },
    favoriteList() {
      return this.$store.state.likeList
    }
  },
  methods: {
    // test() {
    //   return 'fdadfas'
    // },
    hide() {
      this.visible = false
    },
    show() {
      console.log("show")
      this.visible = true
      this.$nextTick(() => {
        this.refreshScroll()
      })
    },
    refreshScroll() {
      // 这里的scroll 就是Bscroll的实例
      // console.log("refresh")
      this.$refs.scrollRef.scroll.refresh()
    },
    changeMode() {
      const mode = (this.$store.state.playMode + 1) % 3
      // console.log("----------mode-------------", mode)
      this.$store.dispatch('changeMode', mode)
    },
    selectSong(song) {
      const index = this.playlist.findIndex((item) => {
        return item.id === song.id
      })
      this.$store.commit('setCurrentIndex', index)
      this.$store.commit("setPlayingState", true)
    },
    // 这里以后要优化 和player里的切换收藏操作相似
    toggleLike(song) {
      const islike = this.isFavorite(song);
      console.log("islike", islike)
      if (islike) {
        this.removeLike(song)
      } else {
        this.unshiftLike(song)
      }
    },
    unshiftLike(song) {
      // 如果点击收藏了以后
      // 头部插入当前歌曲
      const arr = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
      arr.unshift(song)
      // 新数组放到放到vuex和缓存
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
      this.$store.commit('setLikelist', arr)
    },
    removeLike(song) {
      const arr = JSON.parse(localStorage.getItem(FAVORITE_KEY))
      console.log("删除")
      console.log(arr, song)
      // 注意
      const index = arr.findIndex((item) => {
        return item.id === song.id
      })
      if (index > -1) {
        arr.splice(index, 1)
      }
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
      this.$store.commit('setLikelist', arr)
    },

    getFavoriteIcon(song) {
      // console.log("getfavorite")
      if (!this.playlist) {
        return
      }
      return {
        color: this.isFavorite(song) ? 'red' : ''
      }
    },
    isFavorite(song) {
      // console.log(this.favoriteList)
      return this.favoriteList.findIndex((item) => {
        return item.id === song.id
      }) > -1
    },
    deleteItem(song) {
      if (this.removing) {
        return
      }
      this.removing = true
      this.$store.dispatch('removeSong', song)
      setTimeout(() => {
        this.removing = false
      }, 300)
    },
    clearAll() {
      console.log(this.$refs.confirm)
      this.$refs.confirm.visible = true
    },
    confirm() {
      this.$store.dispatch('clearSongList')
      this.$refs.confirm.visible = false
      this.visible = false
    },
    showAddSong() {
      // console.log("fds")
      console.log(this.$refs.addSongRef)
      this.$refs.addSongRef.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.playList {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    overflow: hidden;
    background-color: #423f3f;

    .list-header {
      height: 50px;
      align-items: center;

      .title {
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;

        .icon {
          color: yellowgreen;
          font-size: 30px;
          margin-left: 20px;
          margin-right: 10px;
        }

        .close {
          font-size: 20px;
          position: absolute;
          right: 20px;
          overflow: hidden;

        }
      }
    }

    .list-content {
      height: 440px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 40px;
        overflow: hidden;
        color: #bbbbb8;

        .playItem {
          color: #e8a52e;
        }

        .text {
          //color: #954e4e;
          flex: 1;
        }

        .favorite {
          position: relative;
          margin-right: 10px;

          &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
          }
        }

        .deleteIcon {
          margin-left: 5px;
          position: relative;

          &:before {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
          }
        }

        .disable {
          color: #6f6f6c;
        }
      }

      .list-enter-active, .list-leave-active {
        transition: all .3s;
      }

      .list-enter-from, .list-leave-to {
        height: 0 !important;
      }
    }

    .operate {
      height: 40px;
      display: flex;
      justify-content: space-evenly;

      .add {
        line-height: 40px;
      }

      .clearAll {
        line-height: 40px;
      }
    }
  }

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;

    .list-wrapper {
      transition: all .3s;
    }

  }

  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

}
</style>
