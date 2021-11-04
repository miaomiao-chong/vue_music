<template>
  <div class="player" v-show="playList.length">
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
      <div class="middle" @click="toggleClick">
        <!--        中间的cd-->
        <div class="middle-cd" ref="middleCd" :class="isShowLyric? 'fadeout': 'fadein'">
          <div class="cd-wrapper">
            <img :src="currentSong.pic" class="cd-image" :style="animationState">
          </div>
          <div class="playingLyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>

          </div>
        </div>
        <!--        中间的lyric-->
        <div class="middle-lyric" :class="isShowLyric? 'fadein': 'fadeout'">
          <scroll class="content" ref="lyricScrollRef" :probe-type="3" @scroll="handlescroll">
            <div class="lyric-wrapper" ref="lyricListRef">
              <p class="text" v-for="(line, index) in currentLyric.lines" :key="index"
                 :class="{'active': currentLineNum ===index}">
                {{ line.txt }}
              </p>
            </div>
            <div class="pure-music" v-show="pureMusicLyric">
              <p>{{ pureMusicLyric }}</p>
            </div>
          </scroll>
        </div>
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

    <mini-player :progress="progress"></mini-player>
    <!--    控制歌曲播放-->
    <audio ref="audioRef" @pause="pause" @canplay="ready" @error="error" @timeupdate='update' @ended="end"
           volume="0.1"></audio>
  </div>
</template>

<script type="module">
import { FAVORITE_KEY, PLAY_MODE } from '@/assets/js/constant'
import progressBar from './progress-bar'
import scroll from '@/components/base/scroll/scroll'
import { getLyric } from "@/service/song";
import Lyric from "@/components/player/lyric-parser";
import miniPlayer from './mini-player'
// import { formatTime } from "@/assets/js/utils";

let audioEl = null
let middleCdEl = null
let lyricEl = null
let lyricListEl = null
export default {
  name: "player",
  components: {
    progressBar: progressBar,
    scroll: scroll,
    miniPlayer: miniPlayer
  },
  data: function () {
    return {
      songReady: false,
      islike: true,
      currentTime: 0,
      duration: 0,
      progressChanging: false, // 解决拖动进度条的问题
      isShowLyric: true,
      // 纯音乐
      pureMusicLyric: '',
      // 实例化返回内容
      currentLyric: '',
      // 当前播放行数
      currentLineNum: 0,
      playingLyric: '"此歌曲为没有填词的纯音乐 请欣赏"',
      rawLyric: '',
    }
  },
  computed: {
    playList() {
      return this.$store.state.playlist
    },
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
    // 图片旋转相关
    animationState() {
      return {
        animationPlayState: this.playing ? 'running' : 'paused'
      }
    }
  },
  watch: {
    async currentSong(song) {
      this.stopLyric()
      this.rawLyric = ''
      this.currentLyric = ''
      this.playingLyric = '此歌曲为没有填词的纯音乐 请欣赏'
      // 初始化动画是否开始
      // this.startAnimation = false
      this.isShowLyric = false
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
      const id = this.currentSong.id
      // 获取歌词
      this.rawLyric = await getLyric({ id }).then((res) => {
        // console.log(res.data.result)
        return res.data.result
      })
      // this.rawLyric = "[00:00.000] 作词 : 薛之谦\n[00:01.000] 作曲 : 罗小黑\n[00:02.000] 编曲 : 周以力\n[00:03.000] 制作人 : 周以力/郑伟\n[00:18.042]你降落的 太突然了\n[00:24.240]我刚好呢 又路过了\n[00:32.325]机会难得 又主观觉得\n[00:38.725]想明抢 又碰不得\n[00:46.157]你带来了 我的快乐\n[00:53.157]让这世界 有点颜色\n[01:00.444]我好想指责 你太随意了\n[01:06.991]宝物该有人捧着  你是不是我的\n[01:17.333]你像 天外来物一样 求之不得\n[01:24.269]你在世俗里的名字 不重要了\n[01:31.516]正好 我隐藏的人格是锲而不舍\n[01:38.299]直到蜂拥而至的人都透明了\n[01:45.943]我在 不近又不远处\n[01:49.925]用明天换你 靠近我\n[02:07.554]你占领了 我的快乐\n[02:14.406]和这世界 已没有瓜葛\n[02:21.639]任事物干渴  都褪去颜色\n[02:28.340]只有你是天蓝色  我开始找你了\n[02:40.569]会像 天外来物一样 失而复得\n[02:47.769]你在世俗里的名字  被人用了\n[02:54.662]反正 我隐藏的人格是锲而不舍\n[03:01.730]直到蜂拥而至的人都透明了\n[03:08.793]我在 不近又不远处\n[03:12.651]用明天换你 靠近我\n[03:18.765]你就像 天外来物一样 求之不得\n[03:26.717]我在世俗里的描写被取笑了\n[03:33.681]反正我隐藏的人格是非你不可\n[03:40.352]直到别有用心的人都透明了\n[03:47.895]我在 不近又不远处\n[03:52.044]用明天换你 靠近我\n[03:54.560] 吉他 : 张淞\n[03:57.076] 大提琴 : 郎莹\n[03:59.592] 鼓 : 褚伟明\n[04:02.108] 贝斯 : 努而德柯\n[04:04.624] 人声录音 : 郑伟 夏之炜 吴身宝\n[04:07.140] 人声编辑 : 郑伟\n[04:09.656] 人声录音室 : 上海广播大厦200studio\n[04:12.172] 乐器录音棚 : soundhub studio\n[04:14.688] 混音 : 全相彦 @OK master studio\n[04:17.204] 母带 : 全相彦 @OK master studio\n"
      // 实例化
      console.log("实例化了一下")
      this.currentLyric = new Lyric(this.rawLyric, this.handleLyric)
      const hasLyric = this.currentLyric.lines.length
      if (hasLyric) {
        this.playLyric()
      } else {
        console.log("没有歌词")
        this.pureMusicLyric = '此歌曲为没有填词的纯音乐 请欣赏'
      }
      if (this.songReady === false) {
        this.stopLyric()
      }
    },
    playing(newPlaying) {
      if (!this.songReady) {
        return
      }
      // console.log("newPlaying", newPlaying)
      if (newPlaying) {
        audioEl.play()
        this.playLyric()
      } else {
        audioEl.pause()
        this.stopLyric()
      }
    },

  },
  created() {

  },
  mounted() {
    // console.log(this.$store.state.fullScreen)
    this.$nextTick(() => {
      audioEl = this.$refs.audioRef
      audioEl.volume = 0.1
      lyricEl = this.$refs.middleLyric
      lyricListEl = this.$refs.lyricList
      middleCdEl = this.$refs.middleCd
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
      // 播放完以后会自动触发pause 我们需要他自动播放
      this.$store.commit('setPlayingState', true)
    },
    // 加载完可以播放了
    ready(e) {
      console.log("缓冲数据")
      this.songReady = true
      // 歌曲播放总时长
      this.duration = e.target.duration
      this.playLyric()
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
      const arr = JSON.parse(localStorage.getItem(FAVORITE_KEY)) || []
      arr.unshift(this.currentSong)
      // 新数组放到放到vuex和缓存
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
      this.$store.commit('setLikelist', arr)
    },
    removeLike() {
      if (this.islike) {
        return
      }
      const currentSong = this.currentSong
      const arr = JSON.parse(localStorage.getItem(FAVORITE_KEY))
      console.log("删除")
      console.log(arr, currentSong)
      // 注意
      const index = arr.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      if (index > -1) {
        arr.splice(index, 1)
      }
      localStorage.setItem(FAVORITE_KEY, JSON.stringify(arr))
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
      this.playLyric()
    },
    progressChanged(e) {
      // console.log(e);
      this.progressChanging = false
      audioEl.currentTime = this.currentTime = this.duration * e
      if (!this.playing) {
        this.$store.commit("setPlayingState", true)
      }
      this.playLyric()
    },
    end(e) {
      console.log("end")
      this.currentTime = 0
      if (this.playMode === PLAY_MODE.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 歌词相关
    // 单击切换
    // 双击貌似在移动端有点毛病
    toggleClick() {
      // this.startAnimation = true
      console.log("点击切换")
      this.isShowLyric = !this.isShowLyric
    },
    handlescroll(e) {
      // console.log("e")
    },

    playLyric() {
      // clearTimeout()
      // console.log(this.currentLyric.lines)
      // console.log("播放了")
      // console.log(this.currentLyric)
      // console.log("currentLyric", this.currentLyric)
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000)
      }
    },
    stopLyric() {
      console.log("暂停了")
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    // 实例化回调
    handleLyric({
                  lineNum,
                  txt
                }) {
      this.playingLyric = txt
      this.currentLineNum = lineNum
      // 注意命名规范
      const scrollComp = this.$refs.lyricScrollRef
      const listEl = this.$refs.lyricListRef
      // const lineEl = listEl.children[0]
      // const lineHeight = lineEl.clientHeight
      // console.log(scrollComp)
      // if (lineNum > 4) {
      //   scrollComp.scroll.scrollTo(0, -lineHeight * (lineNum - 4), 1000)
      // }
      if (lineNum > 4) {
        const lineEl = listEl.children[lineNum - 4]
        scrollComp.scroll.scrollToElement(lineEl, 1000)
      } else {
        scrollComp.scroll.scrollTo(0, 0, 1000)
      }
    }
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

    .middle {
      position: fixed;
      top: 100px;
      bottom: 180px;
      width: 100%;
      overflow: hidden;

      .middle-cd {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;

        .cd-wrapper {
          //width: 100%;
          //margin: 0 auto;
          //position: relative;
          //overflow: hidden;
          //width: 350px;
          //height: 350px;
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 320px;
          box-sizing: border-box;

          .cd-image {
            //position: absolute;
            //left: 0;
            //top: 0;
            //margin: 0 auto;
            //width: 70%;
            //height: 70%;
            //box-sizing: border-box;
            //border-radius: 50%;
            //border: 10px solid rgba(255, 255, 255, 0.1);
            ////动画
            //animation: rotateImg 30s linear infinite;
            position: absolute;

            width: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid rgba(255, 255, 255, 0.1);
            //动画
            animation: rotateImg 30s linear infinite;
          }

          @keyframes rotateImg {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        }

        .playingLyric-wrapper {
          //height: 70px;
          width: 100%;
          position: absolute;
          bottom: 0;

          .playing-lyric {
            line-height: 70px;
            height: 100%;
            text-align: center;
            padding-top: 10%;
            color: #d4d4de;
          }
        }
      }

      .middle-lyric {
        padding: 0px;
        width: 100%;
        height: 100%;
        //background-color: antiquewhite;
        .content {
          height: 100%;
          width: 100%;
          overflow: hidden;

          .pure-music {
            padding-top: 50%;
            color: #d1d1e1;
            text-align: center;
          }

          .text {
            padding: 16px;
            text-align: center;
          }

          .active {
            color: #a5f609;
          }
        }

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
