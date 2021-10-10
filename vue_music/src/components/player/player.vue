<template>
  <div class="player">
    <div class="normal-player"
         v-show="fullScreen"
    >
      <div class="background">
        <img :src="currentSong.pic"/>
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="iconfont icon-xiangxia"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h1 class="subtitle">{{ currentSong.singer }}</h1>
      </div>
      <div class="bottom">
        <!--        进度条-->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :progress=progress
                          @progress-changing="onProgressChanging"
                          @progress-changed='progressChanged'>
            </progress-bar>
          </div>
          <span class="time time-l">{{ formatTime(duration) }}</span>
        </div>
        <div class="operators">
          <!--          循环-->
          <div class="icon">
            <i class="iconfont innerIcon" :class="modeIcon" @click="changeMode"></i>
          </div>
          <!--          上一曲-->
          <div class="icon">
            <i class="iconfont innerIcon icon-shangyiqu" :class="disableCls" @click="pre"></i>
          </div>
          <!--          播放暂停-->
          <div class="icon" :class="disableCls">
            <i class="iconfont innerIcon" :class="[playIcon, disableCls]" @click="toggleIcon"
               style="font-size: 50px"></i>
          </div>
          <!--          下一曲-->
          <div class="icon" :class="disableCls">
            <i class="iconfont innerIcon icon-xiayiqu" :class="disableCls" @click="next"></i>
          </div>
          <!--          喜欢-->
          <div class="icon" :class="disableCls">
            <i class="iconfont innerIcon icon-shoucang" :style="toggleLikeIcon" @click="toggleLike"></i>
          </div>
        </div>
      </div>
    </div>
    <!--    控制歌曲播放-->
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error" @timeupdate='update'></audio>
  </div>
</template>

<script>
import { FAVORITE_KEY, PLAY_MODE } from '@/assets/js/constant'
import progressBar from './progress-bar'
// import { formatTime } from "@/assets/js/utils";

let audioEl = null
export default {
  name: "player",
  components: {
    progressBar: progressBar
  },
  data: function () {
    return {
      songReady: false,
      islike: true,
      currentTime: 0,
      duration: 0,
      progressChanging: false, // 解决拖动进度条的问题
    }
  },
  computed: {
    // 希望fullScreen是响应式的
    fullScreen() {
      return this.$store.state.fullScreen
    },
    currentSong() {
      return this.$store.getters.currentSong
    },
    songListLen() {
      // console.log(this.$store.state.songListLen)
      return this.$store.state.songListLen
    },
    playing() {
      return this.$store.state.playing
    },
    currentIndex() {
      return this.$store.state.currentIndex
    },
    playIcon() {
      // console.log(this.playing)
      return this.playing ? 'icon-bofangzhong' : 'icon-zanting'
    },
    // disable播放样式
    disableCls() {
      // console.log("songready:----", this.songReady)
      return this.songReady ? '' : 'disable'
    },

    // mode
    // 获取播放模式
    playMode() {
      return this.$store.state.playMode
    },
    // 格局播放模式计算出icon
    modeIcon() {
      const playMode = this.playMode
      // .icon-liebiaoxunhuan  .icon-shunxubofang .icon-suijibofang
      return playMode === PLAY_MODE.sequence ? 'icon-liebiaoxunhuan' : playMode === PLAY_MODE.loop ? 'icon-danquxunhuan' : 'icon-suijibofang'
    },
    toggleLikeIcon() {
      const isLike = this.islike
      return {
        color: isLike ? 'red' : ''
      }
    },
    // 进度相关
    progress() {
      // console.log("---", this.currentTime, ' ,', this.duration)
      return this.currentTime / this.duration
    },
  },
  watch: {
    currentSong(song) {
      this.currentTime = 0
      // 切换的时候也要换成false
      this.songReady = false
      // console.log(this.$refs.audioRef)
      audioEl.src = song.url
      audioEl.play()
      // 这里是收藏有关逻辑
      const storeLikelist = this.$store.state.likeList
      const index = storeLikelist.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      if (index > -1) {
        this.islike = true
      } else {
        this.islike = false
      }
    },
    playing(newPlaying) {
      if (!this.songReady) {
        return
      }
      // console.log("newPlaying", newPlaying)
      if (newPlaying) {
        audioEl.play()
      } else {
        audioEl.pause()
      }
    }
  },
  created() {
    // this.$store.commit('setLikelist', JSON.parse(sessionStorage.getItem(FAVORITE_KEY)))
  },
  mounted() {
    // console.log(this.$store.state.fullScreen)
    this.$nextTick(() => {
      audioEl = this.$refs.audioRef
      // console.log("vue", this.$el)
    })
  },
  methods: {
    goBack() {
      this.$store.commit("setFullScreen", false)
    },
    toggleIcon() {
      if (!this.songReady) {
        return
      }
      // 不要直接修改playing 要修改vuex数据
      this.$store.commit('setPlayingState', !this.playing)
    },
    // 音乐自己关闭的情况 不是用户交互触发它暂停
    pause() {
      this.$store.commit('setPlayingState', false)
    },
    // 上一曲
    pre() {
      if (this.songListLen === 0 || !this.songReady) {
        return
      }
      if (this.songListLen === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          // console.log("this.songListLen", this.songListLen)
          index = this.songListLen - 1
          // console.log("index", index)
        }
        this.$store.commit('setCurrentIndex', index)
        if (!this.playing) {
          this.$store.commit('setPlayingState', true)
        }
      }
    },
    // 下一曲
    next() {
      // console.log("songReady", this.songReady)
      if (this.songListLen === 0 || !this.songReady) {
        return
      }
      if (this.songListLen === 1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        if (index === this.songListLen) {
          index = 0
        }
        this.$store.commit('setCurrentIndex', index)
        if (!this.playing) {
          this.$store.commit('setPlayingState', true)
        }
      }
    },
    // 只有一首歌的情况单曲循环
    loop() {
      audioEl.currentTime = 0
      audioEl.play()
      this.$store.commit('setPlayingState', true)
    },
    // 加载完可以播放了
    ready(e) {
      console.log("缓冲数据")
      this.songReady = true
      // 歌曲播放总时长
      this.duration = e.target.duration
    },
    // 播放出问题 防止出问题不能切换的情况
    error() {
      // alert('fdasfda')
      this.songReady = true
    },

    changeMode() {
      // 妙 对3取余，这样就是[0,2]的值
      // const mode = 2
      const mode = (this.playMode + 1) % 3
      // console.log("----------mode-------------", mode)
      this.$store.dispatch('changeMode', mode)
    },

    // 收藏
    toggleLike() {
      this.islike = !this.islike
      if (this.islike) {
        this.unshiftLike()
      } else {
        this.removeLike()
      }
      // console.log(JSON.parse(sessionStorage.getItem(FAVORITE_KEY)))
    },
    unshiftLike() {
      // 如果点击收藏了以后
      // 头部插入当前歌曲
      const arr = JSON.parse(sessionStorage.getItem(FAVORITE_KEY)) || []
      arr.unshift(this.currentSong)
      // 新数组放到放到vuex和缓存
      sessionStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
      this.$store.commit('setLikelist', arr)
    },
    removeLike() {
      if (this.islike) {
        return
      }
      const currentSong = this.currentSong
      const arr = JSON.parse(sessionStorage.getItem(FAVORITE_KEY))
      console.log("删除")
      console.log(arr, currentSong)
      // 注意
      const index = arr.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      if (index > -1) {
        arr.splice(index, 1)
      }
      sessionStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
      this.$store.commit('setLikelist', arr)
    },
    // 播放进度相关
    update(e) {
      if (!this.progressChanging) {
      this.currentTime = e.target.currentTime;
      // console.log(this.currentTime)
      }
    },
    formatTime(interval) {
      // interval 向下取整
      interval = interval | 0
      // 不足两位的话就向前填充一个0
      let minute = ((interval / 60 | 0) + '')
      let second = ((interval % 60 | 0) + '')
      let len = minute.length
      for (; len < 2; len++) {
        minute = '0' + minute
      }
      len = second.length
      for (; len < 2; len++) {
        second = '0' + second
      }
      return `${minute}:${second}`
    },
    onProgressChanging(e) {
      // console.log("onProgressChanging", e);
      this.progressChanging = true
      // 实时修改currentTime值
      this.currentTime = this.duration * e
    },
    progressChanged(e) {
      // console.log(e);
      this.progressChanging = false
      audioEl.currentTime = this.currentTime = this.duration * e
      if (!this.playing) {
        this.$store.commit("setPlayingState", true)
      }
    },
  }
}
</script>

<style scoped lang="scss">
.player {
  .normal-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: rgba(194, 178, 178, 0.99);

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .top {
      width: 100%;
      height: 80px;
      //background: aqua;
      position: relative;
      //bfc 方案
      overflow: hidden;

      .back {
        position: absolute;
        margin: 12px 0 0 12px;

        .icon-xiangxia {
          font-size: 30px;
          font-weight: bold;
          color: #a5f609;
        }
      }

      .title {
        text-align: center;
        display: block;
        font-size: 23px;
        font-weight: bold;
        margin: 11px auto 15px auto;
      }

      .subtitle {
        text-align: center;
        font-size: 20px;
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .progress-wrapper {
        display: flex;
        width: 80%;
        padding: 10px 0;
        align-items: center;
        margin: 0 auto;

        .time {
          width: 40px;
          flex: 0 0 40px;
          font-size: 8px;
          margin: 0 auto;
          padding: 0 8px;

          .time-l {
            text-align: left;
          }

          .time-l {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        height: 60px;
        justify-content: space-evenly;
        align-items: center;

        .icon {
          text-align: center;
          //justify-content: space-evenly;
          //这个直接用i标签也可
          .disable {
            color: #bbbbb8;
          }

          .innerIcon {
            font-size: 30px;
          }
        }
      }
    }
  }
}
</style>
